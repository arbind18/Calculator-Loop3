const fs = require('fs');
const p = 'src/components/calculators/categories/currency/ExtendedCurrencyCalculators.tsx';
const s = fs.readFileSync(p, 'utf8');
const parts = s.split('<FinancialCalculatorTemplate');
parts.shift();
const missing = [];
for (const part of parts) {
  const chunk = '<FinancialCalculatorTemplate' + part;
  const m = chunk.match(/title="([^"]+)"/);
  const title = m ? m[1] : '(no title)';
  const uptoInputs = chunk.split('inputs=')[0];
  const hasClear = /\bonClear=/.test(uptoInputs);
  const hasRestore = /\bonRestoreAction=/.test(uptoInputs);
  if (!hasClear || !hasRestore) missing.push({ title, hasClear, hasRestore });
}
console.log('Total templates', parts.length);
console.log('Missing handlers', missing.length);
for (const m of missing) {
  console.log(m.title + ' | clear:' + m.hasClear + ' restore:' + m.hasRestore);
}
