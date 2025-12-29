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


  // ------------------------------
  // Class 9–12 Math Formula Pack
  // ------------------------------
  {
    id: 'quadratic-roots',
    title: { en: 'Quadratic Equation (Roots)', hi: 'Quadratic Equation (Roots)' },
    aliases: ['quadratic formula', 'quadratic roots', 'ax^2+bx+c=0', 'ax2+bx+c=0', 'd = b^2-4ac', 'discriminant'],
    formula: {
      en: 'For ax^2 + bx + c = 0:\nDiscriminant: D = b^2 − 4ac\nRoots: x = (−b ± √D) / (2a)',
      hi: 'ax^2 + bx + c = 0 ke liye:\nDiscriminant: D = b^2 − 4ac\nRoots: x = (−b ± √D) / (2a)'
    },
    variables: [
      { key: 'a', label: { en: 'Coefficient of x^2', hi: 'x^2 ka coefficient' } },
      { key: 'b', label: { en: 'Coefficient of x', hi: 'x ka coefficient' } },
      { key: 'c', label: { en: 'Constant term', hi: 'Constant term' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'ap-nth-term',
    title: { en: 'Arithmetic Progression (n-th term)', hi: 'Arithmetic Progression (n-th term)' },
    aliases: ['ap nth term', 'arithmetic progression nth term', 'tn in ap', 't_n ap', 'a+d(n-1)'],
    formula: {
      en: 'a_n = a + (n − 1)d',
      hi: 'a_n = a + (n − 1)d'
    },
    variables: [
      { key: 'a', label: { en: 'First term', hi: 'First term (pehla pad)' } },
      { key: 'd', label: { en: 'Common difference', hi: 'Common difference (antar)' } },
      { key: 'n', label: { en: 'Term number', hi: 'Term number (n)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'ap-sum',
    title: { en: 'Arithmetic Progression (Sum of n terms)', hi: 'AP (n terms ka yog)' },
    aliases: ['sum of ap', 'ap sum', 'sn ap', 's_n ap', 'n/2(2a+(n-1)d)', 'n/2(a+l)'],
    formula: {
      en: 'S_n = n/2 [2a + (n − 1)d]  OR  S_n = n/2 (a + l)',
      hi: 'S_n = n/2 [2a + (n − 1)d]  YA  S_n = n/2 (a + l)'
    },
    variables: [
      { key: 'a', label: { en: 'First term', hi: 'First term (a)' } },
      { key: 'd', label: { en: 'Common difference', hi: 'Common difference (d)' } },
      { key: 'n', label: { en: 'Number of terms', hi: 'Terms ki sankhya (n)' } },
      { key: 'l', label: { en: 'Last term', hi: 'Last term (l)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'gp-nth-term',
    title: { en: 'Geometric Progression (n-th term)', hi: 'Geometric Progression (n-th term)' },
    aliases: ['gp nth term', 'geometric progression nth term', 't_n gp', 'ar^(n-1)'],
    formula: {
      en: 'a_n = a · r^(n − 1)',
      hi: 'a_n = a · r^(n − 1)'
    },
    variables: [
      { key: 'a', label: { en: 'First term', hi: 'First term (a)' } },
      { key: 'r', label: { en: 'Common ratio', hi: 'Common ratio (r)' } },
      { key: 'n', label: { en: 'Term number', hi: 'Term number (n)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'gp-sum',
    title: { en: 'Geometric Progression (Sum of n terms)', hi: 'GP (n terms ka yog)' },
    aliases: ['gp sum', 'sum of gp', 'sn gp', 'a(1-r^n)/(1-r)'],
    formula: {
      en: 'If r ≠ 1: S_n = a(1 − r^n)/(1 − r)\nIf |r| < 1 (infinite): S_∞ = a/(1 − r)',
      hi: 'Agar r ≠ 1: S_n = a(1 − r^n)/(1 − r)\nAgar |r| < 1 (infinite): S_∞ = a/(1 − r)'
    },
    variables: [
      { key: 'a', label: { en: 'First term', hi: 'First term (a)' } },
      { key: 'r', label: { en: 'Common ratio', hi: 'Common ratio (r)' } },
      { key: 'n', label: { en: 'Number of terms', hi: 'Terms ki sankhya (n)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'binomial-theorem',
    title: { en: 'Binomial Theorem', hi: 'Binomial Theorem' },
    aliases: ['binomial theorem', '(a+b)^n', 'general term', 't_{r+1}', 'ncr in binomial'],
    formula: {
      en: '(a + b)^n = Σ_{r=0..n} (nCr) a^{n−r} b^r\nGeneral term: T_{r+1} = (nCr) a^{n−r} b^r',
      hi: '(a + b)^n = Σ_{r=0..n} (nCr) a^{n−r} b^r\nGeneral term: T_{r+1} = (nCr) a^{n−r} b^r'
    },
    variables: [
      { key: 'n', label: { en: 'Power', hi: 'Power (n)' } },
      { key: 'r', label: { en: 'Term index', hi: 'Term index (r)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'npr',
    title: { en: 'Permutations (nPr)', hi: 'Permutations (nPr)' },
    aliases: ['npr', 'permutation formula', 'permutations', 'npr formula', 'n p r'],
    formula: {
      en: 'nPr = n! / (n − r)!',
      hi: 'nPr = n! / (n − r)!'
    },
    variables: [
      { key: 'n', label: { en: 'Total items', hi: 'Total items (n)' } },
      { key: 'r', label: { en: 'Selected items', hi: 'Selected items (r)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'ncr',
    title: { en: 'Combinations (nCr)', hi: 'Combinations (nCr)' },
    aliases: ['ncr', 'combination formula', 'combinations', 'ncr formula', 'n c r', 'choose'],
    formula: {
      en: 'nCr = n! / [r!(n − r)!]',
      hi: 'nCr = n! / [r!(n − r)!]'
    },
    variables: [
      { key: 'n', label: { en: 'Total items', hi: 'Total items (n)' } },
      { key: 'r', label: { en: 'Selected items', hi: 'Selected items (r)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'distance-2d',
    title: { en: 'Distance Between Two Points (2D)', hi: 'Do binduon ke beech ki doori (2D)' },
    aliases: ['distance formula', 'distance between two points', 'coordinate geometry distance', 'sqrt((x2-x1)^2+(y2-y1)^2)'],
    formula: {
      en: 'Distance = √[(x2 − x1)^2 + (y2 − y1)^2]',
      hi: 'Distance = √[(x2 − x1)^2 + (y2 − y1)^2]'
    },
    variables: [
      { key: 'x1', label: { en: 'x-coordinate of point 1', hi: 'Bindu 1 ka x' } },
      { key: 'y1', label: { en: 'y-coordinate of point 1', hi: 'Bindu 1 ka y' } },
      { key: 'x2', label: { en: 'x-coordinate of point 2', hi: 'Bindu 2 ka x' } },
      { key: 'y2', label: { en: 'y-coordinate of point 2', hi: 'Bindu 2 ka y' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'midpoint-2d',
    title: { en: 'Midpoint Formula (2D)', hi: 'Midpoint Formula (2D)' },
    aliases: ['midpoint formula', 'mid point', 'midpoint of two points', '((x1+x2)/2,(y1+y2)/2)'],
    formula: {
      en: 'Midpoint M = ((x1 + x2)/2, (y1 + y2)/2)',
      hi: 'Midpoint M = ((x1 + x2)/2, (y1 + y2)/2)'
    },
    variables: [
      { key: 'x1', label: { en: 'x1', hi: 'x1' } },
      { key: 'y1', label: { en: 'y1', hi: 'y1' } },
      { key: 'x2', label: { en: 'x2', hi: 'x2' } },
      { key: 'y2', label: { en: 'y2', hi: 'y2' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'slope',
    title: { en: 'Slope of a Line', hi: 'Slope of a Line (Dhalan)' },
    aliases: ['slope formula', 'm=(y2-y1)/(x2-x1)', 'dhalan'],
    formula: {
      en: 'Slope m = (y2 − y1) / (x2 − x1)',
      hi: 'Slope m = (y2 − y1) / (x2 − x1)'
    },
    variables: [
      { key: 'x1', label: { en: 'x1', hi: 'x1' } },
      { key: 'y1', label: { en: 'y1', hi: 'y1' } },
      { key: 'x2', label: { en: 'x2', hi: 'x2' } },
      { key: 'y2', label: { en: 'y2', hi: 'y2' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'line-point-slope',
    title: { en: 'Equation of Line (Point–Slope)', hi: 'Line Equation (Point–Slope)' },
    aliases: ['point slope form', 'equation of line', 'y-y1=m(x-x1)'],
    formula: {
      en: 'y − y1 = m(x − x1)',
      hi: 'y − y1 = m(x − x1)'
    },
    variables: [
      { key: 'm', label: { en: 'Slope', hi: 'Slope (m)' } },
      { key: 'x1', label: { en: 'Point x-coordinate', hi: 'Point ka x (x1)' } },
      { key: 'y1', label: { en: 'Point y-coordinate', hi: 'Point ka y (y1)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'circle-standard',
    title: { en: 'Circle (Standard Form)', hi: 'Circle (Standard Form)' },
    aliases: ['circle equation', '(x-h)^2+(y-k)^2=r^2', 'standard circle'],
    formula: {
      en: '(x − h)^2 + (y − k)^2 = r^2',
      hi: '(x − h)^2 + (y − k)^2 = r^2'
    },
    variables: [
      { key: 'h', label: { en: 'Center x-coordinate', hi: 'Center ka x (h)' } },
      { key: 'k', label: { en: 'Center y-coordinate', hi: 'Center ka y (k)' } },
      { key: 'r', label: { en: 'Radius', hi: 'Radius (r)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'trig-identities',
    title: { en: 'Basic Trigonometric Identities', hi: 'Basic Trigonometric Identities' },
    aliases: ['trig identities', 'sin^2+cos^2=1', '1+tan^2=sec^2', '1+cot^2=csc^2', 'trigonometry formula'],
    formula: {
      en: 'sin^2θ + cos^2θ = 1\n1 + tan^2θ = sec^2θ\n1 + cot^2θ = csc^2θ',
      hi: 'sin^2θ + cos^2θ = 1\n1 + tan^2θ = sec^2θ\n1 + cot^2θ = csc^2θ'
    },
    variables: [],
    requiredKeys: [],
  },
  {
    id: 'log-laws',
    title: { en: 'Logarithm Laws', hi: 'Logarithm Laws' },
    aliases: ['log rules', 'logarithm laws', 'log a + log b', 'log(a*b)'],
    formula: {
      en: 'log(a·b) = log a + log b\nlog(a/b) = log a − log b\nlog(a^k) = k·log a',
      hi: 'log(a·b) = log a + log b\nlog(a/b) = log a − log b\nlog(a^k) = k·log a'
    },
    variables: [],
    requiredKeys: [],
  },
  {
    id: 'complex-modulus',
    title: { en: 'Complex Number (Modulus)', hi: 'Complex Number (Modulus)' },
    aliases: ['complex modulus', '|z|', 'modulus of complex number', 'a+ib modulus'],
    formula: {
      en: 'If z = a + ib, then |z| = √(a^2 + b^2)',
      hi: 'Agar z = a + ib, to |z| = √(a^2 + b^2)'
    },
    variables: [
      { key: 'a', label: { en: 'Real part', hi: 'Real part (a)' } },
      { key: 'b', label: { en: 'Imaginary part coefficient', hi: 'Imaginary part ka coefficient (b)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'de-moivre',
    title: { en: "De Moivre's Theorem", hi: "De Moivre's Theorem" },
    aliases: ['de moivre', 'cis', '(cosθ+isinθ)^n', 'complex power'],
    formula: {
      en: '(cosθ + i sinθ)^n = cos(nθ) + i sin(nθ)',
      hi: '(cosθ + i sinθ)^n = cos(nθ) + i sin(nθ)'
    },
    variables: [
      { key: 'θ', label: { en: 'Angle', hi: 'Angle (θ)' } },
      { key: 'n', label: { en: 'Power (integer)', hi: 'Power (integer n)' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'determinant-2x2',
    title: { en: 'Determinant (2×2)', hi: 'Determinant (2×2)' },
    aliases: ['determinant 2x2', '|a b; c d|', 'det 2x2'],
    formula: {
      en: 'For A = [[a, b],[c, d]]: det(A) = ad − bc',
      hi: 'A = [[a, b],[c, d]] ke liye: det(A) = ad − bc'
    },
    variables: [
      { key: 'a', label: { en: 'a', hi: 'a' } },
      { key: 'b', label: { en: 'b', hi: 'b' } },
      { key: 'c', label: { en: 'c', hi: 'c' } },
      { key: 'd', label: { en: 'd', hi: 'd' } },
    ],
    requiredKeys: [],
  },
  {
    id: 'inverse-2x2',
    title: { en: 'Inverse of 2×2 Matrix', hi: '2×2 Matrix ka Inverse' },
    aliases: ['inverse of 2x2', 'matrix inverse 2x2', 'a b; c d inverse'],
    formula: {
      en: 'If det(A) ≠ 0 and A=[[a,b],[c,d]] then A^{-1} = (1/(ad−bc)) [[d,−b],[−c,a]]',
      hi: 'Agar det(A) ≠ 0 aur A=[[a,b],[c,d]] to A^{-1} = (1/(ad−bc)) [[d,−b],[−c,a]]'
    },
    variables: [],
    requiredKeys: [],
  },
  {
    id: 'vector-dot',
    title: { en: 'Vector Dot Product', hi: 'Vector Dot Product' },
    aliases: ['dot product', 'a.b', 'scalar product', 'cos theta dot'],
    formula: {
      en: 'a · b = |a||b|cosθ = a1b1 + a2b2 + a3b3',
      hi: 'a · b = |a||b|cosθ = a1b1 + a2b2 + a3b3'
    },
    variables: [],
    requiredKeys: [],
  },
  {
    id: 'vector-cross',
    title: { en: 'Vector Cross Product (Magnitude)', hi: 'Vector Cross Product (Magnitude)' },
    aliases: ['cross product', '|a×b|', 'vector product', 'sin theta cross'],
    formula: {
      en: '|a × b| = |a||b|sinθ',
      hi: '|a × b| = |a||b|sinθ'
    },
    variables: [],
    requiredKeys: [],
  },
  {
    id: 'probability-basic',
    title: { en: 'Probability (Basic)', hi: 'Probability (Basic)' },
    aliases: ['probability formula', 'p(e)=n(e)/n(s)', 'probability'],
    formula: {
      en: 'P(E) = n(E) / n(S)',
      hi: 'P(E) = n(E) / n(S)'
    },
    variables: [
      { key: 'nE', label: { en: 'Favourable outcomes', hi: 'Favourable outcomes (n(E))' } },
      { key: 'nS', label: { en: 'Total outcomes', hi: 'Total outcomes (n(S))' } },
    ],
    requiredKeys: [],
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
