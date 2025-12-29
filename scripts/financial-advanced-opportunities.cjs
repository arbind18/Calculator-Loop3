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

function getFinancialIds(toolsData) {
  const ids = [];
  const financial = toolsData.financial;
  if (!financial) return ids;
  for (const [subKey, sub] of Object.entries(financial.subcategories || {})) {
    for (const t of sub.calculators || []) {
      ids.push({ id: t.id, title: t.title, subcategoryKey: subKey, subcategoryName: sub.name });
    }
  }
  return ids;
}

const report = JSON.parse(fs.readFileSync('financial-tools-report.json', 'utf8'));
const advancedIds = new Set((report.advancedImplemented || []).map(x => x.id));

const toolsData = loadToolsData();
const financialTools = getFinancialIds(toolsData);
const financialIdSet = new Set(financialTools.map(x => x.id));

const currentAdvanced = financialTools.filter(x => advancedIds.has(x.id));
const currentBasic = financialTools.filter(x => !advancedIds.has(x.id));

// Heuristic: “high-impact advanced candidates” are tools that typically benefit from schedules/scenario/sensitivity.
const highImpactPatterns = [
  /emi|amort|prepayment|loan|mortgage|home-loan|car-loan|personal-loan|credit-card|apr|interest|balance-transfer|payoff/i,
  /sip|swp|stp|lumpsum|cagr|roi|npv|irr|xirr|asset-allocation|portfolio|rebalance|sharpe|alpha|beta|treynor/i,
  /income-tax|gst|tds|hra|pf|gratuity|capital-gains|regime|surcharge|rebate|80c|80d|tax/i,
  /fd|rd|ppf|nps|retirement|pension|annuity|corpus/i,
  /forex|pip|position|margin|swap|risk-reward|crypto|staking|mining|gas-fee|impermanent|yield-farming/i,
  /rent-vs-buy|real-estate|property|stamp-duty|closing-cost|affordability/i,
];

function isHighImpact(id) {
  return highImpactPatterns.some(re => re.test(id));
}

const highImpactCandidates = currentBasic.filter(x => isHighImpact(x.id));

// group counts by subcategory
function countBySubcategory(list) {
  const map = new Map();
  for (const x of list) {
    const key = `${x.subcategoryKey}::${x.subcategoryName}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([k, v]) => ({ subcategoryKey: k.split('::')[0], subcategoryName: k.split('::')[1], count: v }))
    .sort((a, b) => b.count - a.count);
}

const out = {
  generatedAt: new Date().toISOString(),
  financialNowTotal: financialTools.length,
  currentAdvancedCount: currentAdvanced.length,
  currentBasicCount: currentBasic.length,
  highImpactAdvancedCandidateCount: highImpactCandidates.length,
  highImpactCandidatesBySubcategory: countBySubcategory(highImpactCandidates),
  sampleHighImpactCandidates: highImpactCandidates.slice(0, 40),
  currentAdvancedIds: currentAdvanced.map(x => x.id),
};

fs.writeFileSync('financial-advanced-opportunities.json', JSON.stringify(out, null, 2));
console.log('Wrote financial-advanced-opportunities.json');
console.log('Financial total:', out.financialNowTotal);
console.log('Advanced now:', out.currentAdvancedCount);
console.log('Basic now:', out.currentBasicCount);
console.log('High-impact upgrade candidates:', out.highImpactAdvancedCandidateCount);
console.log('Top subcategories:', out.highImpactCandidatesBySubcategory.slice(0, 6));
