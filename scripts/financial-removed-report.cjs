const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const Module = require('module');

function loadToolsData() {
  const file = path.join(process.cwd(), 'src/lib/toolsData.ts');
  const source = fs.readFileSync(file, 'utf8');

  const out = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: file,
  }).outputText;

  const m = new Module(file, module.parent);
  m.filename = file;
  m.paths = Module._nodeModulePaths(path.dirname(file));
  m._compile(out, file);
  return m.exports.toolsData;
}

function indexTools(toolsData) {
  const map = new Map();
  for (const [categoryKey, category] of Object.entries(toolsData)) {
    for (const [subcategoryKey, subcategory] of Object.entries(category.subcategories || {})) {
      for (const tool of subcategory.calculators || []) {
        if (!map.has(tool.id)) {
          map.set(tool.id, {
            categoryKey,
            subcategoryKey,
            subcategoryName: subcategory.name,
            title: tool.title,
          });
        }
      }
    }
  }
  return map;
}

function uniqueById(items) {
  const map = new Map();
  for (const it of items) {
    if (it && it.id && !map.has(it.id)) map.set(it.id, it);
  }
  return Array.from(map.values());
}

const report = JSON.parse(fs.readFileSync('financial-tools-report.json', 'utf8'));
const reportItems = uniqueById([...(report.basicImplemented || []), ...(report.advancedImplemented || [])]);

const toolsData = loadToolsData();
const toolIndex = indexTools(toolsData);

const financialNow = new Set();
for (const sub of Object.values((toolsData.financial && toolsData.financial.subcategories) || {})) {
  for (const t of sub.calculators || []) financialNow.add(t.id);
}

const removed = [];
for (const item of reportItems) {
  if (!financialNow.has(item.id)) {
    const dest = toolIndex.get(item.id) || null;
    removed.push({
      id: item.id,
      title: item.title,
      fromSubcategoryKey: item.subcategoryKey,
      fromSubcategoryName: item.subcategoryName,
      to: dest,
    });
  }
}

const out = {
  generatedAt: new Date().toISOString(),
  totalInFinancialReport: reportItems.length,
  totalInFinancialNow: financialNow.size,
  removedFromFinancial: removed.length,
  removed,
};

fs.writeFileSync('financial-tools-removed-from-financial.json', JSON.stringify(out, null, 2));
console.log('Wrote financial-tools-removed-from-financial.json');
console.log('Removed count:', removed.length);
console.log('Sample (first 30):');
for (const x of removed.slice(0, 30)) {
  console.log('-', x.id, '=>', x.to ? `${x.to.categoryKey}/${x.to.subcategoryKey}` : '(not found elsewhere)');
}
