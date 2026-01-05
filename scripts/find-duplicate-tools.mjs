import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read toolsData.ts
const toolsDataPath = path.join(__dirname, '../src/lib/toolsData.ts');
const content = fs.readFileSync(toolsDataPath, 'utf8');

// Extract all tool definitions
const tools = [];
const idPattern = /\{\s*id:\s*['"]([^'"]+)['"]\s*,\s*title:\s*['"]([^'"]+)['"]/g;

let match;
while ((match = idPattern.exec(content)) !== null) {
  tools.push({
    id: match[1],
    title: match[2]
  });
}

console.log(`\n📊 Total Tools Found: ${tools.length}\n`);

// Group by similar functionality
const duplicateGroups = {
  'BMI/Body Mass': [],
  'BMR/Metabolic Rate': [],
  'Body Fat': [],
  'Waist Measurements': [],
  'Loan/EMI': [],
  'Investment Returns': [],
  'Tax Calculators': [],
  'Calorie/Diet': [],
  'Pregnancy/Due Date': [],
  'Age/Date': [],
  'Time Conversion': [],
  'Interest Rate': [],
  'Savings/Deposits': [],
  'Currency/Exchange': [],
  'Discount/Percentage': [],
  'Area/Perimeter': [],
  'Volume Calculation': [],
  'Speed/Velocity': [],
  'Temperature': [],
  'Weight/Mass': [],
  'GPA/CGPA': [],
  'Grade Calculator': [],
  'Percentage/Marks': [],
  'Concrete/Material': [],
  'Paint/Coverage': [],
  'Roofing': [],
  'Flooring': [],
};

// Keywords to identify tool categories
const keywords = {
  'BMI/Body Mass': ['bmi', 'body-mass', 'body mass index'],
  'BMR/Metabolic Rate': ['bmr', 'metabolic', 'tdee', 'calorie-burn'],
  'Body Fat': ['body-fat', 'fat-percentage', 'adiposity', 'ffmi'],
  'Waist Measurements': ['waist', 'hip', 'circumference', 'waist-to'],
  'Loan/EMI': ['loan', 'emi', 'mortgage', 'prepayment'],
  'Investment Returns': ['roi', 'return', 'investment', 'dividend', 'profit'],
  'Tax Calculators': ['tax', 'tds', 'gst', 'income-tax'],
  'Calorie/Diet': ['calorie', 'diet', 'nutrition', 'macro', 'protein', 'carb'],
  'Pregnancy/Due Date': ['pregnancy', 'due-date', 'ovulation', 'conception', 'trimester'],
  'Age/Date': ['age-calculator', 'date-difference', 'days-between'],
  'Time Conversion': ['time-conversion', 'timezone', 'hour', 'minute'],
  'Interest Rate': ['interest', 'compound', 'simple-interest'],
  'Savings/Deposits': ['savings', 'deposit', 'fd', 'recurring', 'ppf'],
  'Currency/Exchange': ['currency', 'exchange', 'forex'],
  'Discount/Percentage': ['discount', 'percentage', 'markup', 'margin'],
  'Area/Perimeter': ['area', 'perimeter', 'square-feet', 'hectare'],
  'Volume Calculation': ['volume', 'cubic', 'capacity'],
  'Speed/Velocity': ['speed', 'velocity', 'pace'],
  'Temperature': ['temperature', 'celsius', 'fahrenheit', 'kelvin'],
  'Weight/Mass': ['weight-conversion', 'mass-conversion', 'kg-to-lbs'],
  'GPA/CGPA': ['gpa', 'cgpa', 'grade-point'],
  'Grade Calculator': ['grade-calculator', 'grading', 'marks-to-grade'],
  'Percentage/Marks': ['percentage-calculator', 'marks', 'score'],
  'Concrete/Material': ['concrete', 'cement', 'aggregate'],
  'Paint/Coverage': ['paint', 'coverage', 'wall-area'],
  'Roofing': ['roof', 'shingles', 'pitch'],
  'Flooring': ['flooring', 'tile', 'carpet'],
};

// Categorize tools
tools.forEach(tool => {
  const lowerTitle = tool.title.toLowerCase();
  const lowerId = tool.id.toLowerCase();
  
  for (const [category, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(kw => lowerId.includes(kw) || lowerTitle.includes(kw))) {
      duplicateGroups[category].push(tool);
      break;
    }
  }
});

// Find exact duplicates by ID
const idCounts = {};
tools.forEach(tool => {
  idCounts[tool.id] = (idCounts[tool.id] || 0) + 1;
});

const exactDuplicates = Object.entries(idCounts)
  .filter(([id, count]) => count > 1)
  .map(([id, count]) => ({ id, count }));

// Generate report
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalTools: tools.length,
    exactDuplicates: exactDuplicates.length,
    potentialOverlapGroups: Object.entries(duplicateGroups).filter(([_, items]) => items.length > 1).length
  },
  exactDuplicates,
  duplicateGroups: Object.fromEntries(
    Object.entries(duplicateGroups)
      .filter(([_, items]) => items.length > 1)
      .map(([category, items]) => [category, items])
  )
};

// Print report
console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 DUPLICATE & OVERLAPPING TOOLS ANALYSIS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📊 SUMMARY:');
console.log(`   Total Tools: ${report.summary.totalTools}`);
console.log(`   Exact Duplicates: ${report.summary.exactDuplicates}`);
console.log(`   Overlap Groups: ${report.summary.potentialOverlapGroups}\n`);

if (exactDuplicates.length > 0) {
  console.log('🚨 EXACT DUPLICATES (Same ID used multiple times):');
  exactDuplicates.forEach(dup => {
    console.log(`   ❌ "${dup.id}" appears ${dup.count} times`);
  });
  console.log();
}

console.log('⚠️  POTENTIAL OVERLAPPING FUNCTIONALITY:\n');

for (const [category, items] of Object.entries(report.duplicateGroups)) {
  if (items.length <= 1) continue;
  
  console.log(`\n📦 ${category} (${items.length} tools):`);
  console.log('   ─────────────────────────────────────────────');
  items.forEach((tool, idx) => {
    console.log(`   ${idx + 1}. ${tool.title}`);
    console.log(`      ID: ${tool.id}`);
  });
  
  // Provide recommendation
  if (items.length > 3) {
    console.log(`   💡 RECOMMENDATION: Consider consolidating into 1-2 comprehensive tools`);
  } else if (items.length > 1) {
    console.log(`   💡 RECOMMENDATION: Review if these can be merged or clearly differentiated`);
  }
}

// Save detailed report
const outputPath = path.join(__dirname, '../duplicate-tools-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`\n\n✅ Detailed report saved to: duplicate-tools-analysis.json\n`);
console.log('═══════════════════════════════════════════════════════════\n');
