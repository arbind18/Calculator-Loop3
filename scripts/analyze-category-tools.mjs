import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const repoRoot = path.resolve(process.cwd())

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function parseTs(filePath, sourceText) {
  return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

function isStringLiteralLike(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
}

function findVarInitializer(sourceFile, varName) {
  let found = null
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === varName) {
      found = node.initializer
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}

function getPropertyByName(objectLiteral, name) {
  if (!objectLiteral || !ts.isObjectLiteralExpression(objectLiteral)) return null
  for (const prop of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) continue
    const key = prop.name
    const keyText = ts.isIdentifier(key) ? key.text : isStringLiteralLike(key) ? key.text : null
    if (keyText === name) return prop.initializer
  }
  return null
}

function collectAllToolIdsByCategory(toolsDataNode) {
  if (!toolsDataNode || !ts.isObjectLiteralExpression(toolsDataNode)) return []

  const results = []

  for (const catProp of toolsDataNode.properties) {
    if (!ts.isPropertyAssignment(catProp)) continue

    const catKeyNode = catProp.name
    const categoryKey = ts.isIdentifier(catKeyNode) ? catKeyNode.text : isStringLiteralLike(catKeyNode) ? catKeyNode.text : ''
    if (!categoryKey) continue

    const catInit = catProp.initializer
    const subcategories = getPropertyByName(catInit, 'subcategories')
    if (!subcategories || !ts.isObjectLiteralExpression(subcategories)) continue

    for (const subProp of subcategories.properties) {
      if (!ts.isPropertyAssignment(subProp)) continue

      const subKeyNode = subProp.name
      const subcategoryKey = ts.isIdentifier(subKeyNode)
        ? subKeyNode.text
        : isStringLiteralLike(subKeyNode)
          ? subKeyNode.text
          : ''
      const subInit = subProp.initializer

      const subNameNode = getPropertyByName(subInit, 'name')
      const subcategoryName = subNameNode && isStringLiteralLike(subNameNode) ? subNameNode.text : subcategoryKey
      const calculatorsArr = getPropertyByName(subInit, 'calculators')
      if (!calculatorsArr || !ts.isArrayLiteralExpression(calculatorsArr)) continue

      for (const el of calculatorsArr.elements) {
        if (!ts.isObjectLiteralExpression(el)) continue
        const idNode = getPropertyByName(el, 'id')
        const titleNode = getPropertyByName(el, 'title')
        const id = idNode && isStringLiteralLike(idNode) ? idNode.text : null
        const title = titleNode && isStringLiteralLike(titleNode) ? titleNode.text : null
        if (!id) continue
        results.push({
          id,
          title: title ?? '',
          categoryKey,
          subcategoryKey,
          subcategoryName,
        })
      }
    }
  }

  return results
}

function collectCalculatorRegistryEntries(registryNode, registrySourceText) {
  if (!registryNode || !ts.isObjectLiteralExpression(registryNode)) return new Map()

  const map = new Map()

  for (const prop of registryNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue

    const key = prop.name
    const id = ts.isIdentifier(key) ? key.text : isStringLiteralLike(key) ? key.text : null
    if (!id) continue

    let importPath = null
    function findImport(node) {
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const arg0 = node.arguments[0]
        if (arg0 && isStringLiteralLike(arg0)) {
          importPath = arg0.text
        }
      }
      ts.forEachChild(node, findImport)
    }
    findImport(prop.initializer)

    const initText = registrySourceText.slice(prop.initializer.pos, prop.initializer.end)

    map.set(id, {
      id,
      importPath,
      isAdvanced: (initText || '').includes('Advanced') || (importPath || '').includes('Advanced'),
      fileExists: importPath ? resolveImportExists(importPath) : null,
    })
  }

  return map
}

function collectStringArrayVar(sourceFile, varName) {
  const init = findVarInitializer(sourceFile, varName)
  if (!init || !ts.isArrayLiteralExpression(init)) return []

  const out = []
  for (const el of init.elements) {
    if (isStringLiteralLike(el)) out.push(el.text)
  }
  return out
}

function mergeGenericRegistryEntries(registryEntries, registrySf) {
  const genericMappings = [
    { idsVar: 'genericHealthToolIds', importPath: '@/components/calculators/categories/health/GenericHealthTool' },
    { idsVar: 'genericMathToolIds', importPath: '@/components/calculators/categories/math/GenericMathTool' },
    { idsVar: 'genericEverydayToolIds', importPath: '@/components/calculators/categories/everyday/GenericEverydayTool' },
    { idsVar: 'genericPhysicsToolIds', importPath: '@/components/calculators/categories/physics/GenericPhysicsTool' },
    { idsVar: 'genericBusinessToolIds', importPath: '@/components/calculators/categories/business/GenericBusinessTool' },
    { idsVar: 'genericEducationToolIds', importPath: '@/components/calculators/categories/education/GenericEducationTool' },
    { idsVar: 'genericConstructionToolIds', importPath: '@/components/calculators/categories/construction/GenericConstructionTool' },
    { idsVar: 'genericTechnologyToolIds', importPath: '@/components/calculators/categories/technology/GenericTechnologyTool' },
    { idsVar: 'genericDateTimeToolIds', importPath: '@/components/calculators/categories/datetime/GenericDateTimeTool' },
  ]

  for (const mapping of genericMappings) {
    const ids = collectStringArrayVar(registrySf, mapping.idsVar)
    for (const id of ids) {
      if (registryEntries.has(id)) continue
      registryEntries.set(id, {
        id,
        importPath: mapping.importPath,
        isAdvanced: false,
        fileExists: resolveImportExists(mapping.importPath),
      })
    }
  }
}

function resolveImportExists(importPath) {
  if (!importPath.startsWith('@/')) return null
  const rel = importPath.replace(/^@\//, 'src/')
  const absBase = path.join(repoRoot, rel)

  const candidates = [
    absBase + '.tsx',
    absBase + '.ts',
    absBase + '.jsx',
    absBase + '.js',
    path.join(absBase, 'index.tsx'),
    path.join(absBase, 'index.ts'),
    path.join(absBase, 'index.jsx'),
    path.join(absBase, 'index.js'),
  ]

  for (const c of candidates) {
    if (fs.existsSync(c)) return true
  }
  return false
}

function toMarkdown(report) {
  const lines = []
  lines.push(`# ${report.categoryKey} tools report`)
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  for (const [k, v] of Object.entries(report.summary)) {
    lines.push(`- ${k}: ${v}`)
  }
  lines.push('')
  lines.push('## Breakdown (by subcategory)')
  lines.push('')
  lines.push('| subcategoryKey | subcategoryName | total | implemented | missing | advancedImplemented | basicImplemented |')
  lines.push('|---|---|---:|---:|---:|---:|---:|')
  for (const row of report.subcategoryBreakdown) {
    lines.push(`| ${row.subcategoryKey} | ${row.subcategoryName} | ${row.total} | ${row.implemented} | ${row.missing} | ${row.advancedImplemented} | ${row.basicImplemented} |`)
  }
  lines.push('')
  if (report.missingInRegistry.length) {
    lines.push('## Missing (in registry)')
    lines.push('')
    for (const m of report.missingInRegistry) {
      lines.push(`- ${m.id} — ${m.title} (${m.subcategoryKey})`)
    }
    lines.push('')
  }
  if (report.brokenRegistryEntries.length) {
    lines.push('## Broken (registry points to missing file)')
    lines.push('')
    for (const b of report.brokenRegistryEntries) {
      lines.push(`- ${b.id} — ${b.title} (${b.subcategoryKey}) → ${b.importPath}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function main() {
  const categoryKey = process.argv[2]
  if (!categoryKey) {
    console.error('Usage: node scripts/analyze-category-tools.mjs <categoryKey>')
    process.exit(1)
  }

  const toolsDataPath = path.join(repoRoot, 'src/lib/toolsData.ts')
  const registryPath = path.join(repoRoot, 'src/lib/calculatorRegistry.ts')

  const toolsText = read(toolsDataPath)
  const registryText = read(registryPath)

  const toolsSf = parseTs(toolsDataPath, toolsText)
  const registrySf = parseTs(registryPath, registryText)

  const toolsDataInit = findVarInitializer(toolsSf, 'toolsData')
  const registryInit = findVarInitializer(registrySf, 'calculatorComponents')

  const allTools = collectAllToolIdsByCategory(toolsDataInit).filter(t => t.categoryKey === categoryKey)
  const registryEntries = collectCalculatorRegistryEntries(registryInit, registryText)
  mergeGenericRegistryEntries(registryEntries, registrySf)

  const total = allTools.length
  const implemented = []
  const missing = []

  for (const t of allTools) {
    if (registryEntries.has(t.id)) implemented.push(t)
    else missing.push(t)
  }

  const advanced = []
  const basic = []
  for (const t of implemented) {
    const reg = registryEntries.get(t.id)
    const byTitle = (t.title || '').toLowerCase().includes('advanced')
    const isAdv = Boolean(reg?.isAdvanced || byTitle)
    if (isAdv) advanced.push(t)
    else basic.push(t)
  }

  const broken = []
  for (const t of implemented) {
    const reg = registryEntries.get(t.id)
    if (reg?.fileExists === false) broken.push({ ...t, importPath: reg.importPath })
  }

  const bySub = new Map()
  for (const t of allTools) {
    const key = t.subcategoryKey
    if (!bySub.has(key)) {
      bySub.set(key, {
        subcategoryKey: key,
        subcategoryName: t.subcategoryName,
        total: 0,
        implemented: 0,
        missing: 0,
        advancedImplemented: 0,
        basicImplemented: 0,
      })
    }
    const row = bySub.get(key)
    row.total += 1
    if (registryEntries.has(t.id)) {
      row.implemented += 1
      const byTitle = (t.title || '').toLowerCase().includes('advanced')
      const isAdv = Boolean(registryEntries.get(t.id)?.isAdvanced || byTitle)
      if (isAdv) row.advancedImplemented += 1
      else row.basicImplemented += 1
    } else {
      row.missing += 1
    }
  }

  const subcategoryBreakdown = Array.from(bySub.values()).sort((a, b) => a.subcategoryKey.localeCompare(b.subcategoryKey))

  const report = {
    categoryKey,
    summary: {
      totalToolsInToolsData: total,
      implementedInRegistry: implemented.length,
      missingInRegistry: missing.length,
      advancedImplemented: advanced.length,
      basicImplemented: basic.length,
      registryEntriesWithMissingFiles: broken.length,
    },
    subcategoryBreakdown,
    missingInRegistry: missing,
    brokenRegistryEntries: broken,
  }

  const outJson = path.join(repoRoot, `${categoryKey}-tools-report.json`)
  const outMd = path.join(repoRoot, `${categoryKey}-tools-summary.md`)

  fs.writeFileSync(outJson, JSON.stringify(report, null, 2))
  fs.writeFileSync(outMd, toMarkdown(report))

  console.log(JSON.stringify(report.summary, null, 2))
}

main()
