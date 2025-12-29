import { formulaKnowledge, type FormulaEntry, type Lang } from '@/ai-training/ai-formulas/formulaKnowledge';
import { getToolByIdWithContext } from '@/lib/ai/rag';

type ParsedValueMap = Record<string, number | string | null | undefined>;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.%\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (text: string, needles: string[]) => needles.some((n) => text.includes(n));

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return '';
  const abs = Math.abs(n);
  if (abs >= 10000000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (abs >= 100000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (abs >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

const parseNumber = (raw: string) => {
  const cleaned = raw
    .replace(/,/g, '')
    .replace(/₹/g, '')
    .trim();

  const m = cleaned.match(/^(-?[0-9]*\.?[0-9]+)\s*(k|thousand|l|lakh|lac|cr|crore|m|mn|million|b|bn|billion)?$/i);
  if (!m?.[1]) return null;

  const base = Number(m[1]);
  if (!Number.isFinite(base)) return null;

  const suffix = (m[2] || '').toLowerCase();
  const mult =
    suffix === 'k' || suffix === 'thousand'
      ? 1_000
      : suffix === 'l' || suffix === 'lakh' || suffix === 'lac'
        ? 100_000
        : suffix === 'cr' || suffix === 'crore'
          ? 10_000_000
          : suffix === 'm' || suffix === 'mn' || suffix === 'million'
            ? 1_000_000
            : suffix === 'b' || suffix === 'bn' || suffix === 'billion'
              ? 1_000_000_000
              : 1;

  return base * mult;
};

const extractByKeyword = (message: string, keywords: string[]): number | null => {
  const msg = message;
  for (const key of keywords) {
    const re = new RegExp(
      `(?:\\b${escapeRegex(key)}\\b)\\s*(?:[:=]|is|=)?\\s*(₹?\n?\t?\n?\t?\n?\t?\n?\t?\s*-?[0-9][0-9,]*(?:\\.[0-9]+)?\\s*(?:k|thousand|l|lakh|lac|cr|crore|m|mn|million|b|bn|billion)?)`,
      'i'
    );
    const m = msg.match(re);
    if (m?.[1]) {
      const n = parseNumber(m[1]);
      if (n !== null) return n;
    }
  }
  return null;
};

const extractWithUnit = (message: string, unitRegex: RegExp): number | null => {
  const m = message.match(unitRegex);
  if (m?.[1]) return parseNumber(m[1]);
  return null;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');

const extractRatePct = (message: string): number | null => {
  // Prefer explicit percent
  const explicit = message.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*(%|percent|per\s*cent)/i);
  if (explicit?.[1]) {
    const n = parseNumber(explicit[1]);
    return n;
  }

  const byKeyword = extractByKeyword(message, ['rate', 'interest', 'byaj', 'r']);
  if (byKeyword === null) return null;

  // Heuristic: 0.12 -> 12%
  if (byKeyword > 0 && byKeyword <= 1) return byKeyword * 100;
  return byKeyword;
};

const extractTenureMonths = (message: string): number | null => {
  const months = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(months?|mo)\b/i);
  if (months !== null) return Math.round(months);

  const years = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(years?|yr|yrs)\b/i);
  if (years !== null) return Math.round(years * 12);

  // Keyword fallbacks
  const byMonths = extractByKeyword(message, ['tenure months', 'months', 'n']);
  if (byMonths !== null) return Math.round(byMonths);

  const byYears = extractByKeyword(message, ['tenure years', 'years', 't']);
  if (byYears !== null) return Math.round(byYears * 12);

  return null;
};

const extractTimeYears = (message: string): number | null => {
  const years = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(years?|yr|yrs)\b/i);
  if (years !== null) return years;

  const months = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(months?|mo)\b/i);
  if (months !== null) return months / 12;

  const byYears = extractByKeyword(message, ['time', 'tenure', 'years', 't']);
  if (byYears !== null) return byYears;

  return null;
};

const extractYears = (message: string): number | null => {
  const years = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(years?|yr|yrs)\b/i);
  if (years !== null) return years;
  const byYears = extractByKeyword(message, ['years', 'yr', 'time', 't']);
  if (byYears !== null) return byYears;
  return null;
};

const extractGender = (message: string): 'male' | 'female' | null => {
  const q = normalize(message);
  if (hasAny(q, ['female', 'woman', 'lady', 'girl', 'mahila'])) return 'female';
  if (hasAny(q, ['male', 'man', 'boy', 'aadmi', 'purush'])) return 'male';
  return null;
};

const extractHeightCm = (message: string): number | null => {
  const explicitCm = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*cm\b/i);
  if (explicitCm !== null) return explicitCm;

  const explicitM = extractWithUnit(message, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*m\b/i);
  if (explicitM !== null) return explicitM * 100;

  // 5ft 8in, 5'8
  const ftIn = message.match(/\b([0-9]{1,2})\s*(?:ft|feet|')\s*([0-9]{1,2})?\s*(?:in|inch|\")?\b/i);
  if (ftIn?.[1]) {
    const ft = parseNumber(ftIn[1]);
    const inches = ftIn[2] ? parseNumber(ftIn[2]) : 0;
    if (ft !== null && inches !== null) {
      const totalIn = ft * 12 + inches;
      return totalIn * 2.54;
    }
  }

  const byKeyword = extractByKeyword(message, ['height', 'kad']);
  if (byKeyword !== null) return byKeyword;

  return null;
};

const getBestFormulaMatch = (message: string): { entry: FormulaEntry; score: number } | null => {
  const q = normalize(message);
  let best: { entry: FormulaEntry; score: number } | null = null;

  for (const entry of formulaKnowledge) {
    let score = 0;

    const title = normalize(entry.title.en);
    if (q.includes(title)) score += 5;

    for (const alias of entry.aliases) {
      const a = normalize(alias);
      if (!a) continue;
      if (q.includes(a)) score += a.length <= 3 ? 3 : 4;
    }

    // Small intent boosts
    if (q.includes('formula') || q.includes('sutra') || q.includes('equation')) score += 1;

    if (!best || score > best.score) {
      best = { entry, score };
    }
  }

  if (!best || best.score < 4) return null;
  return best;
};

const buildFormulaHeader = (entry: FormulaEntry, lang: Lang) => {
  return `### ${entry.title[lang]}\n\n**Formula:**\n${entry.formula[lang]}`;
};

const buildVariablesSection = (entry: FormulaEntry, lang: Lang) => {
  let out = `\n\n**Variables:**\n`;
  entry.variables.forEach((v) => {
    const unit = v.unit ? ` (${v.unit})` : '';
    out += `- **${v.key}**: ${v.label[lang]}${unit}\n`;
  });
  return out;
};

const buildToolsSection = (toolIds: string[] | undefined, lang: Lang) => {
  if (!toolIds || toolIds.length === 0) return '';

  const tools = toolIds
    .map((id) => getToolByIdWithContext(id))
    .filter((t) => t !== null);

  if (tools.length === 0) return '';

  const intro = lang === 'hi' ? '\n\n**Recommended calculators:**\n' : '\n\n**Recommended calculators:**\n';
  let out = intro;
  tools.forEach((t) => {
    if (!t) return;
    out += `- [${t.tool.title}](/calculator/${t.tool.id})\n`;
  });
  return out;
};

const parseInputsForEntry = (entry: FormulaEntry, message: string): ParsedValueMap => {
  const q = message;

  switch (entry.id) {
    case 'bmi': {
      const weightKg =
        extractByKeyword(q, ['weight', 'wajan']) ??
        extractWithUnit(q, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*kg\b/i);

      const heightCm = extractHeightCm(q);

      return { weightKg, heightCm };
    }

    case 'emi': {
      const principal =
        extractByKeyword(q, ['principal', 'loan amount', 'amount', 'p']) ??
        extractWithUnit(q, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*(lakh|lac)\b/i);

      let principalValue: number | null = null;
      if (principal !== null) {
        // If captured from lakh regex (it returns the number only); detect that case by checking original message
        const lakhMatch = q.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*(lakh|lac)\b/i);
        if (lakhMatch?.[1]) {
          const n = parseNumber(lakhMatch[1]);
          principalValue = n !== null ? n * 100000 : null;
        } else {
          principalValue = principal;
        }
      }

      const annualRatePct = extractRatePct(q);
      const tenureMonths = extractTenureMonths(q);

      return { principal: principalValue, annualRatePct, tenureMonths };
    }

    case 'simple-interest': {
      const principal = extractByKeyword(q, ['principal', 'amount', 'p', 'loan amount']);
      const ratePct = extractRatePct(q);
      const timeYears = extractTimeYears(q);
      return { principal, ratePct, timeYears };
    }

    case 'compound-interest': {
      const principal = extractByKeyword(q, ['principal', 'amount', 'p', 'investment', 'deposit']);
      const ratePct = extractRatePct(q);
      const years = extractYears(q) ?? extractTimeYears(q);
      return { principal, ratePct, years };
    }

    case 'lumpsum-fv': {
      const principal =
        extractByKeyword(q, ['principal', 'amount', 'investment', 'deposit', 'p']) ??
        extractWithUnit(q, /₹\s*([0-9][0-9,]*(?:\.[0-9]+)?\s*(?:k|l|lakh|lac|cr|crore|m|mn|million|b|bn|billion)?)\b/i);
      const ratePct = extractRatePct(q);
      const years = extractYears(q);
      return { principal, ratePct, years };
    }

    case 'sip-fv': {
      const monthlyInvestment =
        extractByKeyword(q, ['sip', 'monthly', 'pmt', 'installment', 'investment']) ??
        extractWithUnit(q, /₹\s*([0-9][0-9,]*(?:\.[0-9]+)?\s*(?:k|l|lakh|lac|cr|crore|m|mn|million|b|bn|billion)?)\b/i);
      const annualRatePct = extractRatePct(q);
      const years = extractYears(q);
      return { monthlyInvestment, annualRatePct, years };
    }

    case 'fd-maturity': {
      const principal = extractByKeyword(q, ['principal', 'amount', 'deposit', 'p', 'fd']);
      const ratePct = extractRatePct(q);
      const years = extractYears(q) ?? extractTimeYears(q);
      const compoundsPerYear =
        extractByKeyword(q, ['compounding', 'm']) ??
        (hasAny(normalize(q), ['monthly compounding', 'monthly']) ? 12 : null) ??
        (hasAny(normalize(q), ['quarterly']) ? 4 : null) ??
        (hasAny(normalize(q), ['half yearly', 'half-yearly', 'semiannual']) ? 2 : null);
      return { principal, ratePct, years, compoundsPerYear: compoundsPerYear ?? undefined };
    }

    case 'cagr': {
      const startValue = extractByKeyword(q, ['start', 'initial', 'begin', 'from']);
      const endValue = extractByKeyword(q, ['end', 'final', 'to']);
      const years = extractYears(q);
      return { startValue, endValue, years };
    }

    case 'roi': {
      const cost = extractByKeyword(q, ['cost', 'investment', 'invested', 'spent']);
      const returnValue = extractByKeyword(q, ['return', 'final', 'value', 'received', 'sell', 'selling']);
      return { cost, returnValue };
    }

    case 'percentage-of': {
      const percent = extractRatePct(q);
      const value = extractByKeyword(q, ['of', 'value', 'number', 'base']);

      // Pattern: 15% of 200
      const pat = q.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*%\s*(?:of)\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i);
      if (pat?.[1] && pat?.[2]) {
        const p = parseNumber(pat[1]);
        const v = parseNumber(pat[2]);
        return { percent: p, value: v };
      }

      return { percent, value };
    }

    case 'percentage-change': {
      const oldValue = extractByKeyword(q, ['old', 'previous', 'from']);
      const newValue = extractByKeyword(q, ['new', 'current', 'to']);

      // Pattern: from 120 to 150
      const pat = q.match(/\bfrom\s*([0-9][0-9,]*(?:\.[0-9]+)?)\s*to\s*([0-9][0-9,]*(?:\.[0-9]+)?)\b/i);
      if (pat?.[1] && pat?.[2]) {
        const o = parseNumber(pat[1]);
        const n = parseNumber(pat[2]);
        return { oldValue: o, newValue: n };
      }

      return { oldValue, newValue };
    }

    case 'bmr': {
      const gender = extractGender(q);
      const weightKg =
        extractByKeyword(q, ['weight', 'wajan']) ??
        extractWithUnit(q, /([0-9][0-9,]*(?:\.[0-9]+)?)\s*kg\b/i);
      const heightCm = extractHeightCm(q);
      const ageYears = extractByKeyword(q, ['age', 'umar', 'years']);
      return { gender, weightKg, heightCm, ageYears };
    }

    case 'gst': {
      const amount = extractByKeyword(q, ['amount', 'price', 'value', 'base', 'final', 'mrp']);
      const ratePct = extractRatePct(q);
      const mode = hasAny(normalize(q), ['inclusive', 'including', 'with gst']) ? 'inclusive' : 'exclusive';
      return { amount, ratePct, mode };
    }

    case 'addition': {
      const a = extractByKeyword(q, ['first', 'a', 'pehla']);
      const b = extractByKeyword(q, ['second', 'b', 'plus', 'add', 'dusra']);
      return { a, b };
    }

    case 'subtraction': {
      const a = extractByKeyword(q, ['first', 'a', 'pehla']);
      const b = extractByKeyword(q, ['second', 'b', 'minus', 'subtract', 'dusra']);
      return { a, b };
    }

    case 'multiplication': {
      const a = extractByKeyword(q, ['first', 'a', 'pehla']);
      const b = extractByKeyword(q, ['second', 'b', 'times', 'multiply', 'dusra']);
      return { a, b };
    }

    case 'division': {
      const a = extractByKeyword(q, ['dividend', 'a', 'bhajya']);
      const b = extractByKeyword(q, ['divisor', 'b', 'bhajak']);
      return { a, b };
    }

    case 'area-circle': {
      const radius = extractByKeyword(q, ['radius', 'trajya', 'r']);
      return { radius };
    }

    case 'area-square': {
      const side = extractByKeyword(q, ['side', 'bhuj']);
      return { side };
    }

    case 'area-rectangle': {
      const length = extractByKeyword(q, ['length', 'lambai', 'l']);
      const width = extractByKeyword(q, ['width', 'chaurai', 'w']);
      return { length, width };
    }

    case 'perimeter-square': {
      const side = extractByKeyword(q, ['side', 'bhuj']);
      return { side };
    }

    case 'perimeter-rectangle': {
      const length = extractByKeyword(q, ['length', 'lambai', 'l']);
      const width = extractByKeyword(q, ['width', 'chaurai', 'w']);
      return { length, width };
    }

    default:
      return {};
  }
};

const computeForEntry = (entry: FormulaEntry, values: ParsedValueMap) => {
  switch (entry.id) {
    case 'bmi': {
      const weightKg = Number(values.weightKg);
      const heightCm = Number(values.heightCm);
      if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || heightCm <= 0) return null;
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      return { bmi };
    }

    case 'emi': {
      const principal = Number(values.principal);
      const annualRatePct = Number(values.annualRatePct);
      const tenureMonths = Number(values.tenureMonths);
      if (!Number.isFinite(principal) || !Number.isFinite(annualRatePct) || !Number.isFinite(tenureMonths)) return null;
      if (principal <= 0 || annualRatePct <= 0 || tenureMonths <= 0) return null;

      const r = annualRatePct / 12 / 100;
      const n = tenureMonths;
      const pow = Math.pow(1 + r, n);
      const emi = (principal * r * pow) / (pow - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - principal;

      return { emi, totalPayment, totalInterest };
    }

    case 'simple-interest': {
      const principal = Number(values.principal);
      const ratePct = Number(values.ratePct);
      const timeYears = Number(values.timeYears);
      if (!Number.isFinite(principal) || !Number.isFinite(ratePct) || !Number.isFinite(timeYears)) return null;
      if (principal <= 0 || ratePct < 0 || timeYears < 0) return null;

      const si = (principal * ratePct * timeYears) / 100;
      const amount = principal + si;
      return { si, amount };
    }

    case 'compound-interest': {
      const principal = Number(values.principal);
      const ratePct = Number(values.ratePct);
      const years = Number((values as any).years ?? values.timeYears);
      if (!Number.isFinite(principal) || !Number.isFinite(ratePct) || !Number.isFinite(years)) return null;
      if (principal <= 0 || ratePct < 0 || years < 0) return null;

      const amount = principal * Math.pow(1 + ratePct / 100, years);
      const ci = amount - principal;
      return { ci, amount };
    }

    case 'gst': {
      const amount = Number(values.amount);
      const ratePct = Number(values.ratePct);
      const mode = String(values.mode || 'exclusive');
      if (!Number.isFinite(amount) || !Number.isFinite(ratePct)) return null;
      if (amount < 0 || ratePct < 0) return null;

      if (mode === 'inclusive') {
        const base = amount * 100 / (100 + ratePct);
        const gst = amount - base;
        return { base, gst, final: amount };
      }

      const gst = (amount * ratePct) / 100;
      const final = amount + gst;
      return { gst, final };
    }

    case 'lumpsum-fv': {
      const principal = Number(values.principal);
      const ratePct = Number(values.ratePct);
      const years = Number((values as any).years);
      if (!Number.isFinite(principal) || !Number.isFinite(ratePct) || !Number.isFinite(years)) return null;
      if (principal <= 0 || years < 0) return null;
      const fv = principal * Math.pow(1 + ratePct / 100, years);
      const gain = fv - principal;
      return { fv, gain };
    }

    case 'sip-fv': {
      const monthlyInvestment = Number((values as any).monthlyInvestment);
      const annualRatePct = Number((values as any).annualRatePct);
      const years = Number((values as any).years);
      if (!Number.isFinite(monthlyInvestment) || !Number.isFinite(annualRatePct) || !Number.isFinite(years)) return null;
      if (monthlyInvestment <= 0 || years <= 0) return null;

      const n = Math.round(years * 12);
      const r = annualRatePct / 12 / 100;
      if (r <= 0) {
        const totalInvested = monthlyInvestment * n;
        return { fv: totalInvested, totalInvested };
      }

      const fv = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const totalInvested = monthlyInvestment * n;
      const gain = fv - totalInvested;
      return { fv, totalInvested, gain };
    }

    case 'fd-maturity': {
      const principal = Number(values.principal);
      const ratePct = Number(values.ratePct);
      const years = Number((values as any).years);
      const mRaw = (values as any).compoundsPerYear;
      const m = mRaw === undefined || mRaw === null ? 4 : Number(mRaw); // common FD default: quarterly

      if (!Number.isFinite(principal) || !Number.isFinite(ratePct) || !Number.isFinite(years) || !Number.isFinite(m)) return null;
      if (principal <= 0 || years < 0 || ratePct < 0 || m <= 0) return null;

      const maturity = principal * Math.pow(1 + (ratePct / 100) / m, m * years);
      const interest = maturity - principal;
      return { maturity, interest };
    }

    case 'cagr': {
      const startValue = Number((values as any).startValue);
      const endValue = Number((values as any).endValue);
      const years = Number((values as any).years);
      if (!Number.isFinite(startValue) || !Number.isFinite(endValue) || !Number.isFinite(years)) return null;
      if (startValue <= 0 || endValue <= 0 || years <= 0) return null;
      const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
      return { cagrPct: cagr };
    }

    case 'roi': {
      const cost = Number((values as any).cost);
      const returnValue = Number((values as any).returnValue);
      if (!Number.isFinite(cost) || !Number.isFinite(returnValue)) return null;
      if (cost <= 0) return null;
      const netProfit = returnValue - cost;
      const roiPct = (netProfit / cost) * 100;
      return { roiPct, netProfit };
    }

    case 'percentage-of': {
      const percent = Number((values as any).percent);
      const value = Number((values as any).value);
      if (!Number.isFinite(percent) || !Number.isFinite(value)) return null;
      const result = (percent * value) / 100;
      return { result };
    }

    case 'percentage-change': {
      const oldValue = Number((values as any).oldValue);
      const newValue = Number((values as any).newValue);
      if (!Number.isFinite(oldValue) || !Number.isFinite(newValue)) return null;
      if (oldValue === 0) return null;
      const diff = newValue - oldValue;
      const changePct = (diff / oldValue) * 100;
      return { changePct, diff };
    }

    case 'bmr': {
      const gender = String((values as any).gender || '').toLowerCase();
      const weightKg = Number((values as any).weightKg);
      const heightCm = Number((values as any).heightCm);
      const ageYears = Number((values as any).ageYears);
      if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || !Number.isFinite(ageYears)) return null;
      if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return null;
      if (gender !== 'male' && gender !== 'female') return null;

      const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
      const bmr = gender === 'male' ? base + 5 : base - 161;
      return { bmr };
    }

    case 'addition': {
      const a = Number((values as any).a);
      const b = Number((values as any).b);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
      const sum = a + b;
      return { sum };
    }

    case 'subtraction': {
      const a = Number((values as any).a);
      const b = Number((values as any).b);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
      const difference = a - b;
      return { difference };
    }

    case 'multiplication': {
      const a = Number((values as any).a);
      const b = Number((values as any).b);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
      const product = a * b;
      return { product };
    }

    case 'division': {
      const a = Number((values as any).a);
      const b = Number((values as any).b);
      if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
      const quotient = a / b;
      return { quotient };
    }

    case 'area-circle': {
      const radius = Number((values as any).radius);
      if (!Number.isFinite(radius) || radius < 0) return null;
      const area = Math.PI * radius * radius;
      return { area };
    }

    case 'area-square': {
      const side = Number((values as any).side);
      if (!Number.isFinite(side) || side < 0) return null;
      const area = side * side;
      return { area };
    }

    case 'area-rectangle': {
      const length = Number((values as any).length);
      const width = Number((values as any).width);
      if (!Number.isFinite(length) || !Number.isFinite(width) || length < 0 || width < 0) return null;
      const area = length * width;
      return { area };
    }

    case 'perimeter-square': {
      const side = Number((values as any).side);
      if (!Number.isFinite(side) || side < 0) return null;
      const perimeter = 4 * side;
      return { perimeter };
    }

    case 'perimeter-rectangle': {
      const length = Number((values as any).length);
      const width = Number((values as any).width);
      if (!Number.isFinite(length) || !Number.isFinite(width) || length < 0 || width < 0) return null;
      const perimeter = 2 * (length + width);
      return { perimeter };
    }

    default:
      return null;
  }
};

export const tryBuildFormulaResponse = (message: string, lang: Lang): string | null => {
  const qNorm = normalize(message);

  const formulaIntent = hasAny(qNorm, [
    'formula',
    'equation',
    'sutra',
    'sutra bata',
    'formula bata',
    'how to calculate',
    'calculate',
  ]);

  const match = getBestFormulaMatch(message);
  if (!match) return null;

  // If user has no formula intent and also no obvious numbers, avoid hijacking general queries.
  const hasNumbers = /\d/.test(message);
  if (!formulaIntent && !hasNumbers) return null;

  const entry = match.entry;
  const values = parseInputsForEntry(entry, message);

  const missing = entry.requiredKeys.filter((k) => {
    const v = values[k];
    return v === null || v === undefined || v === '' || (typeof v === 'number' && !Number.isFinite(v));
  });

  let out = buildFormulaHeader(entry, lang);
  out += buildVariablesSection(entry, lang);

  const computed = missing.length === 0 ? computeForEntry(entry, values) : null;

  if (computed) {
    out += `\n\n**Result:**\n`;

    if (entry.id === 'bmi') {
      const bmi = (computed as any).bmi as number;
      out += `- BMI = ${formatNumber(bmi)}\n`;
    }

    if (entry.id === 'emi') {
      const { emi, totalPayment, totalInterest } = computed as any;
      out += `- EMI = ${formatNumber(emi)}\n`;
      out += `- Total payment = ${formatNumber(totalPayment)}\n`;
      out += `- Total interest = ${formatNumber(totalInterest)}\n`;
    }

    if (entry.id === 'simple-interest') {
      const { si, amount } = computed as any;
      out += `- SI = ${formatNumber(si)}\n`;
      out += `- Total amount = ${formatNumber(amount)}\n`;
    }

    if (entry.id === 'compound-interest') {
      const { ci, amount } = computed as any;
      out += `- Amount (A) = ${formatNumber(amount)}\n`;
      out += `- CI = ${formatNumber(ci)}\n`;
    }

    if (entry.id === 'gst') {
      if ((computed as any).base !== undefined) {
        const { base, gst, final } = computed as any;
        out += `- Base = ${formatNumber(base)}\n`;
        out += `- GST = ${formatNumber(gst)}\n`;
        out += `- Final = ${formatNumber(final)}\n`;
      } else {
        const { gst, final } = computed as any;
        out += `- GST = ${formatNumber(gst)}\n`;
        out += `- Final = ${formatNumber(final)}\n`;
      }
    }

    if (entry.id === 'cagr') {
      const { cagrPct } = computed as any;
      out += `- CAGR = ${formatNumber(cagrPct)}%\n`;
    }

    if (entry.id === 'roi') {
      const { roiPct, netProfit } = computed as any;
      out += `- ROI = ${formatNumber(roiPct)}%\n`;
      out += `- Net profit = ${formatNumber(netProfit)}\n`;
    }

    if (entry.id === 'lumpsum-fv') {
      const { fv, gain } = computed as any;
      out += `- Future value = ${formatNumber(fv)}\n`;
      out += `- Gain = ${formatNumber(gain)}\n`;
    }

    if (entry.id === 'sip-fv') {
      const { fv, totalInvested, gain } = computed as any;
      out += `- Future value = ${formatNumber(fv)}\n`;
      if (totalInvested !== undefined) out += `- Total invested = ${formatNumber(totalInvested)}\n`;
      if (gain !== undefined) out += `- Gain = ${formatNumber(gain)}\n`;
    }

    if (entry.id === 'fd-maturity') {
      const { maturity, interest } = computed as any;
      out += `- Maturity amount = ${formatNumber(maturity)}\n`;
      out += `- Interest earned = ${formatNumber(interest)}\n`;
    }

    if (entry.id === 'percentage-of') {
      const { result } = computed as any;
      out += `- Result = ${formatNumber(result)}\n`;
    }

    if (entry.id === 'percentage-change') {
      const { changePct, diff } = computed as any;
      out += `- Change = ${formatNumber(changePct)}%\n`;
      out += `- Difference = ${formatNumber(diff)}\n`;
    }

    if (entry.id === 'bmr') {
      const { bmr } = computed as any;
      out += `- BMR = ${formatNumber(bmr)} kcal/day\n`;
    }

    if (entry.id === 'addition') {
      const { sum } = computed as any;
      out += `- Sum = ${formatNumber(sum)}\n`;
    }

    if (entry.id === 'subtraction') {
      const { difference } = computed as any;
      out += `- Difference = ${formatNumber(difference)}\n`;
    }

    if (entry.id === 'multiplication') {
      const { product } = computed as any;
      out += `- Product = ${formatNumber(product)}\n`;
    }

    if (entry.id === 'division') {
      const { quotient } = computed as any;
      out += `- Quotient = ${formatNumber(quotient)}\n`;
    }

    if (entry.id === 'area-circle') {
      const { area } = computed as any;
      out += `- Area = ${formatNumber(area)}\n`;
    }

    if (entry.id === 'area-square') {
      const { area } = computed as any;
      out += `- Area = ${formatNumber(area)}\n`;
    }

    if (entry.id === 'area-rectangle') {
      const { area } = computed as any;
      out += `- Area = ${formatNumber(area)}\n`;
    }

    if (entry.id === 'perimeter-square') {
      const { perimeter } = computed as any;
      out += `- Perimeter = ${formatNumber(perimeter)}\n`;
    }

    if (entry.id === 'perimeter-rectangle') {
      const { perimeter } = computed as any;
      out += `- Perimeter = ${formatNumber(perimeter)}\n`;
    }
  } else {
    out += `\n\n**To calculate, share these values:**\n`;
    missing.forEach((k) => {
      const meta = entry.variables.find((v) => v.key === k);
      if (meta) {
        const unit = meta.unit ? ` (${meta.unit})` : '';
        out += `- ${meta.label[lang]}${unit}\n`;
      } else {
        out += `- ${k}\n`;
      }
    });

    out +=
      lang === 'hi'
        ? `\n_Example:_ BMI ke liye: weight 70kg, height 175cm.\n`
        : `\n_Example:_ For BMI: weight 70kg, height 175cm.\n`;
  }

  out += buildToolsSection(entry.suggestedTools, lang);
  return out;
};
