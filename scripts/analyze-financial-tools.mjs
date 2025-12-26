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

function getStringLiteralValue(node) {
  if (!node) return null
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  return null
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
    const keyText = ts.isIdentifier(key)
      ? key.text
      : isStringLiteralLike(key)
        ? key.text
        : null
    if (keyText === name) return prop.initializer
  }
  return null
}

function collectFinancialToolIds(toolsDataNode) {
  // toolsData: { financial: { subcategories: { ... } } }
  const financial = getPropertyByName(toolsDataNode, 'financial')
  const subcategories = getPropertyByName(financial, 'subcategories')
  if (!subcategories || !ts.isObjectLiteralExpression(subcategories)) return []

  const results = []

  for (const subProp of subcategories.properties) {
    if (!ts.isPropertyAssignment(subProp)) continue
    const subKeyNode = subProp.name
    const subKey = ts.isIdentifier(subKeyNode)
      ? subKeyNode.text
      : isStringLiteralLike(subKeyNode)
        ? subKeyNode.text
        : ''
    const subInit = subProp.initializer

    const subNameNode = getPropertyByName(subInit, 'name')
    const subName = subNameNode && isStringLiteralLike(subNameNode) ? subNameNode.text : subKey
    const calculatorsArr = getPropertyByName(subInit, 'calculators')
    if (!calculatorsArr || !ts.isArrayLiteralExpression(calculatorsArr)) continue

    for (const el of calculatorsArr.elements) {
      if (!ts.isObjectLiteralExpression(el)) continue
      const idNode = getPropertyByName(el, 'id')
      const titleNode = getPropertyByName(el, 'title')
      const id = idNode && isStringLiteralLike(idNode) ? idNode.text : null
      const title = titleNode && isStringLiteralLike(titleNode) ? titleNode.text : null
      if (id) results.push({ id, title: title ?? '', subcategoryKey: subKey, subcategoryName: subName })
    }
  }

  return results
}

function collectAllToolIdsByCategory(toolsDataNode) {
  // toolsData: { [categoryKey]: { subcategories: { [subKey]: { name, calculators: [{id,title}] }}}}
  if (!toolsDataNode || !ts.isObjectLiteralExpression(toolsDataNode)) return []

  const results = []

  for (const catProp of toolsDataNode.properties) {
    if (!ts.isPropertyAssignment(catProp)) continue

    const catKeyNode = catProp.name
    const categoryKey = ts.isIdentifier(catKeyNode)
      ? catKeyNode.text
      : isStringLiteralLike(catKeyNode)
        ? catKeyNode.text
        : ''
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

function collectCalculatorRegistryEntries(registryNode, registrySourceText, registryFilePath) {
  // calculatorComponents: { ... , 'id': dynamic(()=>import('path')...) }
  if (!registryNode || !ts.isObjectLiteralExpression(registryNode)) return new Map()

  const map = new Map()

  for (const prop of registryNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue

    const key = prop.name
    let id = null
    if (ts.isIdentifier(key)) id = key.text
    else if (isStringLiteralLike(key)) id = key.text

    if (!id) continue

    // Find import('...') string in initializer
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

function resolveImportExists(importPath) {
  // Handles '@/components/..' style
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

function main() {
  const toolsDataPath = path.join(repoRoot, 'src/lib/toolsData.ts')
  const registryPath = path.join(repoRoot, 'src/lib/calculatorRegistry.ts')
  const outputPath = path.join(repoRoot, 'financial-tools-report.json')
  const markdownPath = path.join(repoRoot, 'financial-tools-summary.md')

  const toolsText = read(toolsDataPath)
  const registryText = read(registryPath)

  const toolsSf = parseTs(toolsDataPath, toolsText)
  const registrySf = parseTs(registryPath, registryText)

  const toolsDataInit = findVarInitializer(toolsSf, 'toolsData')
  const registryInit = findVarInitializer(registrySf, 'calculatorComponents')

  const financialTools = collectFinancialToolIds(toolsDataInit)
  const allTools = collectAllToolIdsByCategory(toolsDataInit)
  const registryEntries = collectCalculatorRegistryEntries(registryInit, registryText, registryPath)

  const financialIds = financialTools.map(t => t.id)
  const total = financialIds.length

  const implemented = []
  const missing = []

  for (const t of financialTools) {
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
    if (reg?.fileExists === false) {
      broken.push({ ...t, importPath: reg.importPath })
    }
  }

  const summary = {
    totalFinancialToolsInToolsData: total,
    implementedInRegistry: implemented.length,
    missingInRegistry: missing.length,
    advancedImplemented: advanced.length,
    basicImplemented: basic.length,
    registryEntriesWithMissingFiles: broken.length,
  }

  const bySubcategory = new Map()

  function bump(t, bucket, inc = 1) {
    const key = t.subcategoryKey || 'unknown'
    const name = t.subcategoryName || key
    const cur = bySubcategory.get(key) || {
      subcategoryKey: key,
      subcategoryName: name,
      total: 0,
      implemented: 0,
      missing: 0,
      advancedImplemented: 0,
      basicImplemented: 0,
    }
    cur[bucket] += inc
    bySubcategory.set(key, cur)
  }

  for (const t of financialTools) bump(t, 'total')
  for (const t of implemented) bump(t, 'implemented')
  for (const t of missing) bump(t, 'missing')
  for (const t of advanced) bump(t, 'advancedImplemented')
  for (const t of basic) bump(t, 'basicImplemented')

  const subcategoryBreakdown = Array.from(bySubcategory.values()).sort((a, b) => b.total - a.total)

  const out = {
    summary,
    subcategoryBreakdown,
    missingInRegistry: missing,
    brokenRegistryEntries: broken,
    basicImplemented: basic,
    advancedImplemented: advanced,
  }

  // Duplicates analysis
  const financeIdCounts = new Map()
  const financeTitleCounts = new Map()

  for (const t of financialTools) {
    financeIdCounts.set(t.id, (financeIdCounts.get(t.id) || 0) + 1)
    const normalizedTitle = (t.title || '').trim().toLowerCase()
    if (normalizedTitle) {
      financeTitleCounts.set(normalizedTitle, (financeTitleCounts.get(normalizedTitle) || 0) + 1)
    }
  }

  const duplicateFinanceIds = Array.from(financeIdCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({
      id,
      count,
      occurrences: financialTools.filter(t => t.id === id),
    }))
    .sort((a, b) => b.count - a.count)

  const duplicateFinanceTitles = Array.from(financeTitleCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([normalizedTitle, count]) => ({
      title: normalizedTitle,
      count,
      occurrences: financialTools
        .filter(t => (t.title || '').trim().toLowerCase() === normalizedTitle)
        .map(t => ({ id: t.id, title: t.title, subcategoryKey: t.subcategoryKey, subcategoryName: t.subcategoryName })),
    }))
    .sort((a, b) => b.count - a.count)

  const byIdAcrossCategories = new Map()
  for (const t of allTools) {
    const arr = byIdAcrossCategories.get(t.id) || []
    arr.push({
      categoryKey: t.categoryKey,
      subcategoryKey: t.subcategoryKey,
      subcategoryName: t.subcategoryName,
      title: t.title,
    })
    byIdAcrossCategories.set(t.id, arr)
  }

  const idsInMultipleCategories = Array.from(byIdAcrossCategories.entries())
    .map(([id, occurrences]) => ({
      id,
      count: occurrences.length,
      categories: Array.from(new Set(occurrences.map(o => o.categoryKey))).sort(),
      occurrences,
    }))
    .filter(x => x.categories.length > 1)
    .sort((a, b) => b.categories.length - a.categories.length)

  out.duplicates = {
    duplicateFinanceIds,
    duplicateFinanceTitles,
    idsInMultipleCategories,
  }

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), 'utf8')

  const lines = []
  lines.push('# Financial Tools Report')
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  for (const [k, v] of Object.entries(summary)) {
    lines.push(`- ${k}: ${v}`)
  }
  lines.push('')
  lines.push('## Breakdown (by subcategory)')
  lines.push('')
  lines.push('| subcategoryKey | subcategoryName | total | implemented | missing | advancedImplemented | basicImplemented |')
  lines.push('|---|---|---:|---:|---:|---:|---:|')
  for (const row of subcategoryBreakdown) {
    lines.push(`| ${row.subcategoryKey} | ${String(row.subcategoryName).replace(/\|/g, '\\|')} | ${row.total} | ${row.implemented} | ${row.missing} | ${row.advancedImplemented} | ${row.basicImplemented} |`)
  }
  lines.push('')
  lines.push('## Advanced (implemented)')
  lines.push('')
  for (const t of advanced) {
    lines.push(`- ${t.id} — ${t.title}`)
  }
  lines.push('')
  lines.push('## Basic (implemented)')
  lines.push('')
  for (const t of basic) {
    lines.push(`- ${t.id} — ${t.title}`)
  }
  lines.push('')
  lines.push('## Not working (missing in calculatorRegistry → 404)')

  lines.push('')
  for (const t of missing) {
    const sub = t.subcategoryName ? `${t.subcategoryName} (${t.subcategoryKey})` : t.subcategoryKey
    lines.push(`- ${t.id} — ${t.title} — ${sub}`)
  }

  lines.push('')
  lines.push('## Duplicates')
  lines.push('')
  lines.push(`- duplicateFinanceIds: ${duplicateFinanceIds.length}`)
  lines.push(`- duplicateFinanceTitles: ${duplicateFinanceTitles.length}`)
  lines.push(`- idsInMultipleCategories: ${idsInMultipleCategories.length}`)
  lines.push('')

  if (duplicateFinanceIds.length) {
    lines.push('### Duplicate IDs (within finance)')
    lines.push('')
    for (const d of duplicateFinanceIds.slice(0, 50)) {
      const first = d.occurrences[0]
      lines.push(`- ${d.id} — occurrences: ${d.count} (e.g. ${first.subcategoryKey})`)
    }
    lines.push('')
  }

  if (duplicateFinanceTitles.length) {
    lines.push('### Duplicate Titles (within finance, normalized)')
    lines.push('')
    for (const d of duplicateFinanceTitles.slice(0, 50)) {
      const ids = Array.from(new Set(d.occurrences.map(o => o.id)))
      lines.push(`- ${d.title} — occurrences: ${d.count} (ids: ${ids.join(', ')})`)
    }
    lines.push('')
  }

  if (idsInMultipleCategories.length) {
    lines.push('### IDs reused across multiple categories')
    lines.push('')
    for (const d of idsInMultipleCategories.slice(0, 50)) {
      lines.push(`- ${d.id} — categories: ${d.categories.join(', ')}`)
    }
    lines.push('')
  }
  lines.push('')
  lines.push('## Broken registry entries (import file missing)')
  lines.push('')
  if (broken.length === 0) {
    lines.push('- None')
  } else {
    for (const t of broken) {
      lines.push(`- ${t.id} — ${t.title} (import: ${t.importPath})`)
    }
  }

  fs.writeFileSync(markdownPath, lines.join('\n'), 'utf8')

  console.log(JSON.stringify(summary, null, 2))
}

main()
