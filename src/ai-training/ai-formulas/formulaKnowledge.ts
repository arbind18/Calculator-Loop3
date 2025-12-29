export type Lang = 'en' | 'hi';

export interface FormulaVariable {
  key: string;
  label: Record<Lang, string>;
  unit?: string;
}

export interface FormulaEntry {
  id: string;
  title: Record<Lang, string>;
  aliases: string[];
  formula: Record<Lang, string>;
  variables: FormulaVariable[];
  requiredKeys: string[];
  suggestedTools?: string[];
}

export const formulaKnowledge: FormulaEntry[] = [
  {
    id: 'bmi',
    title: {
      en: 'BMI (Body Mass Index)',
      hi: 'BMI (Body Mass Index)'
    },
    aliases: ['bmi', 'body mass index'],
    formula: {
      en: 'BMI = weight(kg) / (height(m) × height(m))',
      hi: 'BMI = weight(kg) / (height(m) × height(m))'
    },
    variables: [
      { key: 'weightKg', label: { en: 'Weight', hi: 'Wajan' }, unit: 'kg' },
      { key: 'heightCm', label: { en: 'Height', hi: 'Kad' }, unit: 'cm' },
    ],
    requiredKeys: ['weightKg', 'heightCm'],
    suggestedTools: ['bmi-calculator']
  },
  {
    id: 'emi',
    title: {
      en: 'Loan EMI (Monthly Payment)',
      hi: 'Loan EMI (Mahina Payment)'
    },
    aliases: ['emi', 'loan emi', 'monthly installment', 'monthly instalment'],
    formula: {
      en: 'EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nWhere: P = principal, r = monthly interest rate (decimal), n = months',
      hi: 'EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nJahan: P = principal, r = monthly interest rate (decimal), n = months'
    },
    variables: [
      { key: 'principal', label: { en: 'Principal (Loan Amount)', hi: 'Loan Amount (Mool Rashi)' }, unit: 'currency' },
      { key: 'annualRatePct', label: { en: 'Annual Interest Rate', hi: 'Byaj Dar (Annual)' }, unit: '%' },
      { key: 'tenureMonths', label: { en: 'Tenure', hi: 'Samay' }, unit: 'months' },
    ],
    requiredKeys: ['principal', 'annualRatePct', 'tenureMonths'],
    suggestedTools: ['home-loan-emi', 'personal-loan-emi', 'car-loan-emi']
  },
  {
    id: 'simple-interest',
    title: {
      en: 'Simple Interest',
      hi: 'Simple Interest (Sadharan Byaj)'
    },
    aliases: ['simple interest', 'si', 'sadharan byaj', 'simple byaj'],
    formula: {
      en: 'Simple Interest (SI) = (P × R × T) / 100\nTotal Amount (A) = P + SI',
      hi: 'Simple Interest (SI) = (P × R × T) / 100\nTotal Amount (A) = P + SI'
    },
    variables: [
      { key: 'principal', label: { en: 'Principal', hi: 'Mool Rashi' }, unit: 'currency' },
      { key: 'ratePct', label: { en: 'Rate per year', hi: 'Byaj Dar (Prati Varsh)' }, unit: '%' },
      { key: 'timeYears', label: { en: 'Time', hi: 'Samay' }, unit: 'years' },
    ],
    requiredKeys: ['principal', 'ratePct', 'timeYears'],
    suggestedTools: ['simple-interest-loan']
  },
  {
    id: 'compound-interest',
    title: {
      en: 'Compound Interest (Annual compounding)',
      hi: 'Compound Interest (Annual)'
    },
    aliases: ['compound interest', 'ci', 'chakravriddhi byaj', 'compound byaj'],
    formula: {
      en: 'Amount (A) = P × (1 + r/100)^t\nCompound Interest (CI) = A − P',
      hi: 'Amount (A) = P × (1 + r/100)^t\nCompound Interest (CI) = A − P'
    },
    variables: [
      { key: 'principal', label: { en: 'Principal', hi: 'Mool Rashi' }, unit: 'currency' },
      { key: 'ratePct', label: { en: 'Rate per year', hi: 'Byaj Dar (Prati Varsh)' }, unit: '%' },
      { key: 'timeYears', label: { en: 'Time', hi: 'Samay' }, unit: 'years' },
    ],
    requiredKeys: ['principal', 'ratePct', 'timeYears'],
    suggestedTools: ['compound-interest-investment', 'compound-interest-loan']
  },
  {
    id: 'gst',
    title: {
      en: 'GST (Tax amount)',
      hi: 'GST (Tax Rashi)'
    },
    aliases: ['gst', 'gst tax', 'goods and services tax'],
    formula: {
      en: 'Exclusive GST: GST = amount × rate/100, Final = amount + GST\nInclusive GST: Base = final × 100/(100+rate), GST = final − Base',
      hi: 'Exclusive GST: GST = amount × rate/100, Final = amount + GST\nInclusive GST: Base = final × 100/(100+rate), GST = final − Base'
    },
    variables: [
      { key: 'amount', label: { en: 'Amount', hi: 'Rashi' }, unit: 'currency' },
      { key: 'ratePct', label: { en: 'GST Rate', hi: 'GST Rate' }, unit: '%' },
      { key: 'mode', label: { en: 'Mode (exclusive/inclusive)', hi: 'Mode (exclusive/inclusive)' } },
    ],
    requiredKeys: ['amount', 'ratePct'],
    suggestedTools: ['gst-calculator']
  },

  {
    id: 'cagr',
    title: {
      en: 'CAGR (Compound Annual Growth Rate)',
      hi: 'CAGR (Compound Annual Growth Rate)'
    },
    aliases: ['cagr', 'compound annual growth rate', 'growth rate per year'],
    formula: {
      en: 'CAGR (%) = ((End / Start)^(1/Years) − 1) × 100',
      hi: 'CAGR (%) = ((End / Start)^(1/Years) − 1) × 100'
    },
    variables: [
      { key: 'startValue', label: { en: 'Start Value', hi: 'Start Value' }, unit: 'currency' },
      { key: 'endValue', label: { en: 'End Value', hi: 'End Value' }, unit: 'currency' },
      { key: 'years', label: { en: 'Years', hi: 'Years' }, unit: 'years' },
    ],
    requiredKeys: ['startValue', 'endValue', 'years'],
    suggestedTools: ['cagr-calculator', 'cagr-calculator-business']
  },

  {
    id: 'roi',
    title: {
      en: 'ROI (Return on Investment)',
      hi: 'ROI (Return on Investment)'
    },
    aliases: ['roi', 'return on investment', 'investment return'],
    formula: {
      en: 'ROI (%) = (Net Profit / Cost) × 100\nNet Profit = Return − Cost',
      hi: 'ROI (%) = (Net Profit / Cost) × 100\nNet Profit = Return − Cost'
    },
    variables: [
      { key: 'cost', label: { en: 'Cost / Investment', hi: 'Cost / Investment' }, unit: 'currency' },
      { key: 'returnValue', label: { en: 'Return / Final Value', hi: 'Return / Final Value' }, unit: 'currency' },
    ],
    requiredKeys: ['cost', 'returnValue'],
    suggestedTools: ['roi-calculator', 'roi-calculator-business', 'marketing-roi']
  },

  {
    id: 'lumpsum-fv',
    title: {
      en: 'Lumpsum Future Value',
      hi: 'Lumpsum Future Value'
    },
    aliases: ['lumpsum future value', 'fv lumpsum', 'future value lumpsum', 'fv'],
    formula: {
      en: 'FV = P × (1 + r/100)^t',
      hi: 'FV = P × (1 + r/100)^t'
    },
    variables: [
      { key: 'principal', label: { en: 'Principal / Amount', hi: 'Amount' }, unit: 'currency' },
      { key: 'ratePct', label: { en: 'Rate per year', hi: 'Byaj Dar (Prati Varsh)' }, unit: '%' },
      { key: 'years', label: { en: 'Years', hi: 'Years' }, unit: 'years' },
    ],
    requiredKeys: ['principal', 'ratePct', 'years'],
    suggestedTools: ['compound-interest-investment', 'fd-calculator', 'deposit-maturity']
  },

  {
    id: 'sip-fv',
    title: {
      en: 'SIP Future Value (Monthly SIP)',
      hi: 'SIP Future Value (Monthly SIP)'
    },
    aliases: ['sip future value', 'sip maturity', 'sip fv', 'mutual fund sip'],
    formula: {
      en: 'FV = PMT × [((1+r)^n − 1) / r] × (1+r)\nWhere r = monthly rate (decimal), n = months',
      hi: 'FV = PMT × [((1+r)^n − 1) / r] × (1+r)\nJahan r = monthly rate (decimal), n = months'
    },
    variables: [
      { key: 'monthlyInvestment', label: { en: 'Monthly SIP', hi: 'Monthly SIP' }, unit: 'currency' },
      { key: 'annualRatePct', label: { en: 'Expected Return (annual)', hi: 'Expected Return (annual)' }, unit: '%' },
      { key: 'years', label: { en: 'Years', hi: 'Years' }, unit: 'years' },
    ],
    requiredKeys: ['monthlyInvestment', 'annualRatePct', 'years'],
    suggestedTools: ['sip-calculator', 'step-up-sip']
  },

  {
    id: 'fd-maturity',
    title: {
      en: 'FD Maturity (Compounded)',
      hi: 'FD Maturity (Compounded)'
    },
    aliases: ['fd maturity', 'fixed deposit maturity', 'deposit maturity', 'fd return'],
    formula: {
      en: 'A = P × (1 + (r/100)/m)^(m×t)\nWhere m = compounding per year',
      hi: 'A = P × (1 + (r/100)/m)^(m×t)\nJahan m = compounding per year'
    },
    variables: [
      { key: 'principal', label: { en: 'Principal', hi: 'Mool Rashi' }, unit: 'currency' },
      { key: 'ratePct', label: { en: 'Rate per year', hi: 'Byaj Dar (Prati Varsh)' }, unit: '%' },
      { key: 'years', label: { en: 'Years', hi: 'Years' }, unit: 'years' },
      { key: 'compoundsPerYear', label: { en: 'Compounding per year (m)', hi: 'Compounding per year (m)' }, unit: 'times/year' },
    ],
    requiredKeys: ['principal', 'ratePct', 'years'],
    suggestedTools: ['fd-calculator', 'deposit-maturity', 'tax-saving-fd']
  },

  {
    id: 'percentage-of',
    title: {
      en: 'Percentage of a number',
      hi: 'Percentage (Pratishat)'
    },
    aliases: ['percentage of', 'x% of', 'percent of', 'pratishat'],
    formula: {
      en: 'Result = (Percent × Value) / 100',
      hi: 'Result = (Percent × Value) / 100'
    },
    variables: [
      { key: 'percent', label: { en: 'Percent', hi: 'Pratishat' }, unit: '%' },
      { key: 'value', label: { en: 'Value', hi: 'Value' }, unit: 'number' },
    ],
    requiredKeys: ['percent', 'value'],
    suggestedTools: ['percentage-calculator']
  },

  {
    id: 'percentage-change',
    title: {
      en: 'Percentage change',
      hi: 'Percentage change'
    },
    aliases: ['percentage change', 'percent change', 'increase percentage', 'decrease percentage'],
    formula: {
      en: 'Change (%) = ((New − Old) / Old) × 100',
      hi: 'Change (%) = ((New − Old) / Old) × 100'
    },
    variables: [
      { key: 'oldValue', label: { en: 'Old Value', hi: 'Old Value' }, unit: 'number' },
      { key: 'newValue', label: { en: 'New Value', hi: 'New Value' }, unit: 'number' },
    ],
    requiredKeys: ['oldValue', 'newValue'],
    suggestedTools: ['percentage-calculator']
  },

  {
    id: 'bmr',
    title: {
      en: 'BMR (Mifflin-St Jeor)',
      hi: 'BMR (Mifflin-St Jeor)'
    },
    aliases: ['bmr', 'basal metabolic rate', 'calorie requirement'],
    formula: {
      en: 'Male: BMR = 10W + 6.25H − 5A + 5\nFemale: BMR = 10W + 6.25H − 5A − 161\nWhere W=kg, H=cm, A=years',
      hi: 'Male: BMR = 10W + 6.25H − 5A + 5\nFemale: BMR = 10W + 6.25H − 5A − 161\nJahan W=kg, H=cm, A=years'
    },
    variables: [
      { key: 'gender', label: { en: 'Gender (male/female)', hi: 'Gender (male/female)' } },
      { key: 'weightKg', label: { en: 'Weight', hi: 'Wajan' }, unit: 'kg' },
      { key: 'heightCm', label: { en: 'Height', hi: 'Kad' }, unit: 'cm' },
      { key: 'ageYears', label: { en: 'Age', hi: 'Umar' }, unit: 'years' },
    ],
    requiredKeys: ['gender', 'weightKg', 'heightCm', 'ageYears'],
  },

  // Basic Math Formulas
  {
    id: 'addition',
    title: {
      en: 'Addition',
      hi: 'Jod (Addition)'
    },
    aliases: ['add', 'plus', 'sum', 'jod', '+'],
    formula: {
      en: 'Sum = a + b',
      hi: 'Jod = a + b'
    },
    variables: [
      { key: 'a', label: { en: 'First number', hi: 'Pehla number' } },
      { key: 'b', label: { en: 'Second number', hi: 'Dusra number' } },
    ],
    requiredKeys: ['a', 'b'],
  },

  {
    id: 'subtraction',
    title: {
      en: 'Subtraction',
      hi: 'Ghata (Subtraction)'
    },
    aliases: ['subtract', 'minus', 'difference', 'ghata', '-'],
    formula: {
      en: 'Difference = a - b',
      hi: 'Antar = a - b'
    },
    variables: [
      { key: 'a', label: { en: 'First number', hi: 'Pehla number' } },
      { key: 'b', label: { en: 'Second number', hi: 'Dusra number' } },
    ],
    requiredKeys: ['a', 'b'],
  },

  {
    id: 'multiplication',
    title: {
      en: 'Multiplication',
      hi: 'Gun (Multiplication)'
    },
    aliases: ['multiply', 'times', 'product', 'gun', '*', '×'],
    formula: {
      en: 'Product = a × b',
      hi: 'Gun = a × b'
    },
    variables: [
      { key: 'a', label: { en: 'First number', hi: 'Pehla number' } },
      { key: 'b', label: { en: 'Second number', hi: 'Dusra number' } },
    ],
    requiredKeys: ['a', 'b'],
  },

  {
    id: 'division',
    title: {
      en: 'Division',
      hi: 'Bhag (Division)'
    },
    aliases: ['divide', 'quotient', 'bhag', '/', '÷'],
    formula: {
      en: 'Quotient = a ÷ b',
      hi: 'Bhagfal = a ÷ b'
    },
    variables: [
      { key: 'a', label: { en: 'Dividend', hi: 'Bhajya' } },
      { key: 'b', label: { en: 'Divisor', hi: 'Bhajak' } },
    ],
    requiredKeys: ['a', 'b'],
  },

  {
    id: 'area-circle',
    title: {
      en: 'Area of Circle',
      hi: 'Vritt ka Kshetrafal'
    },
    aliases: ['area of circle', 'circle area', 'vritt kshetrafal'],
    formula: {
      en: 'Area = π × r²',
      hi: 'Kshetrafal = π × r²'
    },
    variables: [
      { key: 'radius', label: { en: 'Radius', hi: 'Trajya' }, unit: 'units' },
    ],
    requiredKeys: ['radius'],
  },

  {
    id: 'area-square',
    title: {
      en: 'Area of Square',
      hi: 'Varg ka Kshetrafal'
    },
    aliases: ['area of square', 'square area', 'varg kshetrafal'],
    formula: {
      en: 'Area = side × side',
      hi: 'Kshetrafal = bhuj × bhuj'
    },
    variables: [
      { key: 'side', label: { en: 'Side length', hi: 'Bhuj ki lambai' }, unit: 'units' },
    ],
    requiredKeys: ['side'],
  },

  {
    id: 'area-rectangle',
    title: {
      en: 'Area of Rectangle',
      hi: 'Aayt ka Kshetrafal'
    },
    aliases: ['area of rectangle', 'rectangle area', 'aayt kshetrafal'],
    formula: {
      en: 'Area = length × width',
      hi: 'Kshetrafal = lambai × chaurai'
    },
    variables: [
      { key: 'length', label: { en: 'Length', hi: 'Lambai' }, unit: 'units' },
      { key: 'width', label: { en: 'Width', hi: 'Chaurai' }, unit: 'units' },
    ],
    requiredKeys: ['length', 'width'],
  },

  {
    id: 'perimeter-square',
    title: {
      en: 'Perimeter of Square',
      hi: 'Varg ka Paridhi'
    },
    aliases: ['perimeter of square', 'square perimeter', 'varg paridhi'],
    formula: {
      en: 'Perimeter = 4 × side',
      hi: 'Paridhi = 4 × bhuj'
    },
    variables: [
      { key: 'side', label: { en: 'Side length', hi: 'Bhuj ki lambai' }, unit: 'units' },
    ],
    requiredKeys: ['side'],
  },

  {
    id: 'perimeter-rectangle',
    title: {
      en: 'Perimeter of Rectangle',
      hi: 'Aayt ka Paridhi'
    },
    aliases: ['perimeter of rectangle', 'rectangle perimeter', 'aayt paridhi'],
    formula: {
      en: 'Perimeter = 2 × (length + width)',
      hi: 'Paridhi = 2 × (lambai + chaurai)'
    },
    variables: [
      { key: 'length', label: { en: 'Length', hi: 'Lambai' }, unit: 'units' },
      { key: 'width', label: { en: 'Width', hi: 'Chaurai' }, unit: 'units' },
    ],
    requiredKeys: ['length', 'width'],
  },
];
