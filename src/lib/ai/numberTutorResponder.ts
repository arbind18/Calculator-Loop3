export type Lang = 'en' | 'hi';

type Rational = { num: bigint; den: bigint };

type ParsedNumber =
  | { kind: 'int'; value: bigint; raw: string }
  | { kind: 'rat'; value: Rational; raw: string };

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (s: string, parts: string[]) => parts.some((p) => s.includes(p));

const abs = (n: bigint) => (n < 0n ? -n : n);

const gcd = (a: bigint, b: bigint) => {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
};

const reduceRational = (r: Rational): Rational => {
  if (r.den === 0n) return r;
  let num = r.num;
  let den = r.den;
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
};

const formatBigInt = (n: bigint) => {
  const s = n.toString();
  // Add commas for readability (simple grouping)
  const sign = s.startsWith('-') ? '-' : '';
  const body = sign ? s.slice(1) : s;
  const withCommas = body.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + withCommas;
};

const formatRational = (r: Rational) => {
  const rr = reduceRational(r);
  if (rr.den === 1n) return formatBigInt(rr.num);
  return `${formatBigInt(rr.num)}/${formatBigInt(rr.den)}`;
};

const safeParseBigInt = (raw: string): bigint | null => {
  try {
    // BigInt doesn't accept leading '+'
    const cleaned = raw.trim().replace(/^\+/, '');
    if (!/^-?\d+$/.test(cleaned)) return null;
    return BigInt(cleaned);
  } catch {
    return null;
  }
};

const parseNumbers = (message: string): ParsedNumber[] => {
  const text = message;

  // First capture fractions a/b
  const fractions: ParsedNumber[] = [];
  const usedRanges: Array<{ start: number; end: number }> = [];

  const fracRe = /(-?\d+)\s*\/\s*(-?\d+)/g;
  let fm: RegExpExecArray | null;
  while ((fm = fracRe.exec(text))) {
    const a = safeParseBigInt(fm[1]!);
    const b = safeParseBigInt(fm[2]!);
    if (a === null || b === null || b === 0n) continue;
    fractions.push({ kind: 'rat', value: reduceRational({ num: a, den: b }), raw: fm[0] });
    usedRanges.push({ start: fm.index, end: fm.index + fm[0].length });
  }

  const isInsideUsed = (idx: number) => usedRanges.some((r) => idx >= r.start && idx < r.end);

  const ints: ParsedNumber[] = [];
  const intRe = /-?\d+/g;
  let im: RegExpExecArray | null;
  while ((im = intRe.exec(text))) {
    if (isInsideUsed(im.index)) continue;
    const v = safeParseBigInt(im[0]!);
    if (v === null) continue;
    ints.push({ kind: 'int', value: v, raw: im[0] });
  }

  return [...fractions, ...ints];
};

const integerSqrt = (n: bigint) => {
  if (n < 0n) return null;
  if (n < 2n) return n;
  // Newton's method
  let x0 = n;
  let x1 = (x0 + n / x0) / 2n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / 2n;
  }
  return x0;
};

const pow10 = (exp: number) => {
  let out = 1n;
  for (let i = 0; i < exp; i += 1) out *= 10n;
  return out;
};

const formatDecimalFromScaledSqrt = (scaledRoot: bigint, digits: number) => {
  if (digits <= 0) return formatBigInt(scaledRoot);
  const sign = scaledRoot < 0n ? '-' : '';
  const s = abs(scaledRoot).toString();
  const pad = digits + 1;
  const padded = s.length >= pad ? s : s.padStart(pad, '0');
  const intPart = padded.slice(0, -digits);
  const fracPart = padded.slice(-digits).replace(/0+$/, '');
  return fracPart.length ? `${sign}${intPart}.${fracPart}` : `${sign}${intPart}`;
};

const sqrtApproxDecimal = (n: bigint, digits: number) => {
  if (n < 0n) return null;
  const d = Math.max(0, Math.min(50, Math.floor(digits)));
  const scale = pow10(2 * d);
  const scaled = n * scale;
  const r = integerSqrt(scaled);
  if (r === null) return null;
  return { digits: d, value: formatDecimalFromScaledSqrt(r, d) };
};

const getRequestedDigits = (message: string) => {
  // Examples: "10 decimals", "20 decimal places", "digits 30", "30 digits"
  const m = message.match(/\b(\d{1,3})\b\s*(decimals?|decimal\s*places|digits?)\b/i);
  if (!m?.[1]) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(50, Math.floor(n)));
};

const extractSquareFactorsPartially = (n: bigint, maxPrime = 10000n) => {
  // Returns outside and inside so that n = outside^2 * inside, but only extracting square factors via small primes.
  let x = abs(n);
  if (x === 0n) return { outside: 0n, inside: 0n };
  if (x === 1n) return { outside: 1n, inside: 1n };

  let outside = 1n;
  let inside = 1n;

  const pull = (p: bigint) => {
    let exp = 0;
    while (x % p === 0n) {
      x /= p;
      exp += 1;
    }
    if (exp === 0) return;
    const pairs = Math.floor(exp / 2);
    const rem = exp % 2;
    for (let i = 0; i < pairs; i += 1) outside *= p;
    if (rem === 1) inside *= p;
  };

  pull(2n);
  pull(3n);

  let f = 5n;
  while (f * f <= x && f <= maxPrime) {
    pull(f);
    pull(f + 2n);
    f += 6n;
  }

  // Whatever remains is square-free with respect to checked primes; include it in inside.
  inside *= x;
  return { outside, inside };
};

const integerCbrt = (n: bigint) => {
  if (n === 0n) return 0n;
  const neg = n < 0n;
  const a = neg ? -n : n;

  let lo = 0n;
  let hi = 1n;
  while (hi * hi * hi <= a) hi *= 2n;

  while (lo + 1n < hi) {
    const mid = (lo + hi) / 2n;
    const m3 = mid * mid * mid;
    if (m3 === a) return neg ? -mid : mid;
    if (m3 < a) lo = mid;
    else hi = mid;
  }

  return neg ? -lo : lo;
};

const isPerfectSquare = (n: bigint) => {
  const r = integerSqrt(n);
  return r !== null && r * r === n;
};

const isPerfectCube = (n: bigint) => {
  const r = integerCbrt(n);
  return r * r * r === n;
};

const modPow = (base: bigint, exp: bigint, mod: bigint) => {
  let result = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return result;
};

const isProbablePrimeMillerRabin = (n: bigint) => {
  if (n < 2n) return false;
  const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const p of smallPrimes) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  // write n-1 = d*2^s
  let d = n - 1n;
  let s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1n;
  }

  const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n];

  for (const a0 of bases) {
    const a = a0 % n;
    if (a === 0n) continue;

    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let continueOuter = false;
    for (let r = 1n; r < s; r += 1n) {
      x = (x * x) % n;
      if (x === n - 1n) {
        continueOuter = true;
        break;
      }
    }
    if (continueOuter) continue;

    return false;
  }

  return true; // probable prime
};

const trySmallFactorization = (n: bigint, maxPrime = 100000n) => {
  const factors: bigint[] = [];
  let x = abs(n);
  if (x < 2n) return { factors, remainder: x };

  const addFactor = (p: bigint) => {
    factors.push(p);
    x /= p;
  };

  while (x % 2n === 0n) addFactor(2n);
  while (x % 3n === 0n) addFactor(3n);

  let f = 5n;
  while (f * f <= x && f <= maxPrime) {
    while (x % f === 0n) addFactor(f);
    const f2 = f + 2n;
    while (x % f2 === 0n) addFactor(f2);
    f += 6n;
  }

  return { factors, remainder: x };
};

const classifyInteger = (n: bigint) => {
  const sign = n === 0n ? 'zero' : n > 0n ? 'positive' : 'negative';
  const even = n % 2n === 0n;
  const odd = !even;
  const natural = n >= 1n;
  const whole = n >= 0n;
  const integer = true;
  const prime = n > 1n ? isProbablePrimeMillerRabin(abs(n)) : false;
  const composite = n > 1n && !prime;
  return { sign, even, odd, natural, whole, integer, prime, composite };
};

const buildGeneralGuide = (lang: Lang) => {
  if (lang === 'hi') {
    return [
      '### 🔢 Sankhyaon ka Quick Guide (Numbers)',
      '',
      '**Basic operations:**',
      '- Jod (Addition): a + b',
      '- Ghata (Subtraction): a − b',
      '- Guna (Multiplication): a × b (gunan-phal = product)',
      '- Bhag (Division): a ÷ b (quotient + remainder)',
      '',
      '**Number types (paribhasha):**',
      '- **Prakritik sankhya (Natural):** 1,2,3,...',
      '- **Purna sankhya (Whole):** 0,1,2,3,...',
      '- **Purnaank (Integers):** ...,−2,−1,0,1,2,...',
      '- **Parimey sankhya (Rational):** p/q (q≠0) jaise 3/5, −7/2',
      '- **Aparimey (Irrational):** √2, π (exact fraction me nahi likh sakte)',
      '',
      '**Odd/Even:**',
      '- **Sam (Even):** 2 se divisible',
      '- **Visham (Odd):** 2 se divisible nahi',
      '',
      '**Prime/Composite:**',
      '- **Abhajya (Prime):** 1 aur khud se divisible (2,3,5,7,...)',
      '- **Sanyukt/Composite:** 1 aur khud ke alawa aur factors bhi',
      '',
      '**Roots:**',
      '- **Vargmul (Square root):** √n, agar n = k² ho to √n = k',
      '- **Ghanmul (Cube root):** ∛n, agar n = k³ ho to ∛n = k',
      '',
      '### ✅ Kaise pooche (best format)',
      "- 'analyze number: 123456789012345678901234567890'",
      "- 'add: 999999999999999999 + 888888888888888888'",
      "- 'divide: 12345678901234567890 / 97'",
      "- 'sqrt: 99980001'  (perfect square check)",
      "- 'prime check: 9999999967'",
    ].join('\n');
  }

  return [
    '### 🔢 Numbers Quick Guide',
    '',
    '**Basic operations:**',
    '- Addition: a + b',
    '- Subtraction: a − b',
    '- Multiplication: a × b (product)',
    '- Division: a ÷ b (quotient + remainder)',
    '',
    '**Number types:**',
    '- **Natural numbers:** 1,2,3,...',
    '- **Whole numbers:** 0,1,2,3,...',
    '- **Integers:** ...,−2,−1,0,1,2,...',
    '- **Rational numbers:** p/q (q≠0) like 3/5, −7/2',
    '- **Irrational numbers:** √2, π (not exactly representable as a fraction)',
    '',
    '**Odd/Even:**',
    '- **Even:** divisible by 2',
    '- **Odd:** not divisible by 2',
    '',
    '**Prime/Composite:**',
    '- **Prime:** divisible only by 1 and itself (2,3,5,7,...)',
    '- **Composite:** has additional factors',
    '',
    '**Roots:**',
    '- **Square root:** √n, if n = k² then √n = k',
    '- **Cube root:** ∛n, if n = k³ then ∛n = k',
    '',
    '### ✅ Best input formats',
    "- 'analyze number: 123456789012345678901234567890'",
    "- 'add: 999999999999999999 + 888888888888888888'",
    "- 'divide: 12345678901234567890 / 97'",
    "- 'sqrt: 99980001'",
    "- 'prime check: 9999999967'",
  ].join('\n');
};

const buildBigNumberDemo = (lang: Lang) => {
  const a = 9876543210987654321098765432109876543210n;
  const b = 123456789012345678901234567890123456789n;
  const sum = a + b;
  const diff = a - b;
  const prod = a * 99n;
  const divQ = a / 97n;
  const divR = a % 97n;

  if (lang === 'hi') {
    return [
      '### 🧮 Big Number Demo (exact)',
      '',
      `- a = ${formatBigInt(a)}`,
      `- b = ${formatBigInt(b)}`,
      '',
      `- a + b = ${formatBigInt(sum)}`,
      `- a − b = ${formatBigInt(diff)}`,
      `- a × 99 = ${formatBigInt(prod)}`,
      `- a ÷ 97 = ${formatBigInt(divQ)} (remainder ${formatBigInt(divR)})`,
      '',
      'Aap apna bada number bhejo—main exact result nikal dunga.',
    ].join('\n');
  }

  return [
    '### 🧮 Big Number Demo (exact)',
    '',
    `- a = ${formatBigInt(a)}`,
    `- b = ${formatBigInt(b)}`,
    '',
    `- a + b = ${formatBigInt(sum)}`,
    `- a − b = ${formatBigInt(diff)}`,
    `- a × 99 = ${formatBigInt(prod)}`,
    `- a ÷ 97 = ${formatBigInt(divQ)} (remainder ${formatBigInt(divR)})`,
    '',
    'Send your big number(s) and I’ll compute exactly.',
  ].join('\n');
};

const pickLang = (lang: Lang) => ({
  analyze: lang === 'hi' ? 'Analyze (properties)' : 'Analyze (properties)',
});

const buildAnalyzeOne = (n: ParsedNumber, lang: Lang) => {
  if (n.kind === 'rat') {
    const r = reduceRational(n.value);
    const isInteger = r.den === 1n;
    const sign = r.num === 0n ? 'zero' : r.num > 0n ? 'positive' : 'negative';

    if (lang === 'hi') {
      return [
        `**${n.raw}**`,
        `- Type: Parimey (Rational) = ${formatRational(r)}`,
        `- Sign: ${sign}`,
        `- Integer? ${isInteger ? 'Haan (Integer)' : 'Nahi'}`,
      ].join('\n');
    }

    return [
      `**${n.raw}**`,
      `- Type: Rational = ${formatRational(r)}`,
      `- Sign: ${sign}`,
      `- Integer? ${isInteger ? 'Yes (integer)' : 'No'}`,
    ].join('\n');
  }

  const v = n.value;
  const c = classifyInteger(v);
  const digits = abs(v).toString().length;
  const sq = v >= 0n ? isPerfectSquare(v) : false;
  const cb = isPerfectCube(v);

  const factorization = v !== 0n ? trySmallFactorization(v) : { factors: [], remainder: 0n };
  const factorsText =
    factorization.factors.length === 0
      ? '(no small prime factors found)'
      : factorization.factors.map(formatBigInt).join(' × ');

  const remainderText =
    factorization.remainder === 1n || factorization.remainder === 0n
      ? ''
      : ` (remaining cofactor: ${formatBigInt(factorization.remainder)})`;

  const sqrtValue = v >= 0n ? integerSqrt(v) : null;
  const cbrtValue = integerCbrt(v);

  if (lang === 'hi') {
    return [
      `**${n.raw}**`,
      `- Digits: ${digits}`,
      `- Sign: ${c.sign}`,
      `- Prakritik (Natural)? ${c.natural ? 'Haan' : 'Nahi'}`,
      `- Whole? ${c.whole ? 'Haan' : 'Nahi'}`,
      `- Sam (Even)? ${c.even ? 'Haan' : 'Nahi'}`,
      `- Visham (Odd)? ${c.odd ? 'Haan' : 'Nahi'}`,
      `- Abhajya (Prime)? ${c.prime ? 'Haan (probable prime)' : 'Nahi'}`,
      `- Composite? ${c.composite ? 'Haan' : 'Nahi'}`,
      `- Perfect square? ${sq ? 'Haan' : 'Nahi'}`,
      sqrtValue !== null ? `- ⌊√n⌋ = ${formatBigInt(sqrtValue)}${sq ? ' (exact √n)' : ''}` : '- √n: not defined for negative integer (real numbers)',
      `- ⌊∛n⌋ = ${formatBigInt(cbrtValue)}${cb ? ' (exact ∛n)' : ''}`,
      `- Small factorization: ${factorsText}${remainderText}`,
    ].join('\n');
  }

  return [
    `**${n.raw}**`,
    `- Digits: ${digits}`,
    `- Sign: ${c.sign}`,
    `- Natural? ${c.natural ? 'Yes' : 'No'}`,
    `- Whole? ${c.whole ? 'Yes' : 'No'}`,
    `- Even? ${c.even ? 'Yes' : 'No'}`,
    `- Odd? ${c.odd ? 'Yes' : 'No'}`,
    `- Prime? ${c.prime ? 'Yes (probable prime)' : 'No'}`,
    `- Composite? ${c.composite ? 'Yes' : 'No'}`,
    `- Perfect square? ${sq ? 'Yes' : 'No'}`,
    sqrtValue !== null ? `- ⌊√n⌋ = ${formatBigInt(sqrtValue)}${sq ? ' (exact √n)' : ''}` : '- √n: not defined for negative integer (real)',
    `- ⌊∛n⌋ = ${formatBigInt(cbrtValue)}${cb ? ' (exact ∛n)' : ''}`,
    `- Small factorization: ${factorsText}${remainderText}`,
  ].join('\n');
};

const computeBinaryOp = (
  op: 'add' | 'sub' | 'mul' | 'div',
  a: ParsedNumber,
  b: ParsedNumber
): { title: string; result: string; steps: string[] } | null => {
  const toRational = (x: ParsedNumber): Rational => {
    if (x.kind === 'int') return { num: x.value, den: 1n };
    return x.value;
  };

  const ra = reduceRational(toRational(a));
  const rb = reduceRational(toRational(b));

  const steps: string[] = [];

  if (op === 'add') {
    const num = ra.num * rb.den + rb.num * ra.den;
    const den = ra.den * rb.den;
    const r = reduceRational({ num, den });
    steps.push(`a = ${formatRational(ra)}`);
    steps.push(`b = ${formatRational(rb)}`);
    steps.push(`a + b = (a_num*b_den + b_num*a_den) / (a_den*b_den)`);
    return { title: 'Addition', result: formatRational(r), steps };
  }

  if (op === 'sub') {
    const num = ra.num * rb.den - rb.num * ra.den;
    const den = ra.den * rb.den;
    const r = reduceRational({ num, den });
    steps.push(`a = ${formatRational(ra)}`);
    steps.push(`b = ${formatRational(rb)}`);
    steps.push(`a − b = (a_num*b_den − b_num*a_den) / (a_den*b_den)`);
    return { title: 'Subtraction', result: formatRational(r), steps };
  }

  if (op === 'mul') {
    const r = reduceRational({ num: ra.num * rb.num, den: ra.den * rb.den });
    steps.push(`a = ${formatRational(ra)}`);
    steps.push(`b = ${formatRational(rb)}`);
    steps.push(`a × b = (a_num*b_num) / (a_den*b_den)`);
    return { title: 'Multiplication (Product)', result: formatRational(r), steps };
  }

  if (op === 'div') {
    if (rb.num === 0n) return null;
    const r = reduceRational({ num: ra.num * rb.den, den: ra.den * rb.num });
    steps.push(`a = ${formatRational(ra)}`);
    steps.push(`b = ${formatRational(rb)}`);
    steps.push(`a ÷ b = a × (b_den/b_num)`);

    // If both are integers, also show quotient + remainder
    if (a.kind === 'int' && b.kind === 'int') {
      const q = a.value / b.value;
      const rem = a.value % b.value;
      steps.push(`Integer division: q = ${formatBigInt(q)}, r = ${formatBigInt(rem)}`);
    }

    return { title: 'Division', result: formatRational(r), steps };
  }

  return null;
};

export const tryBuildNumberTutorResponse = (message: string, lang: Lang): string | null => {
  const q = normalize(message);

  const aboutNumbers = hasAny(q, [
    'sankhya',
    'संख्या',
    'numbers',
    'number',
    'jod',
    'ghata',
    'guna',
    'bhag',
    'vargmul',
    'घनमूल',
    'ghanmool',
    'square root',
    'cube root',
    'prime',
    'abhajya',
    'parimey',
    'rational',
    'odd',
    'even',
    'visham',
    'sam',
    'gunan',
    'product',
    'factor',
    'gcd',
    'hcf',
    'lcm',
  ]);

  if (!aboutNumbers) return null;

  const parsed = parseNumbers(message);

  const wantsDemo = hasAny(q, ['jitna bada number', 'bada number', 'very big number', 'big number', 'largest number']);

  // If user is asking generally (no numbers) => guide + demo
  if (parsed.length === 0) {
    const guide = buildGeneralGuide(lang);
    const demo = wantsDemo ? `\n\n${buildBigNumberDemo(lang)}` : '';
    return `${guide}${demo}`;
  }

  // Operation intent
  const wantsAdd = hasAny(q, ['add', 'sum', 'jod', '+', 'plus']);
  const wantsSub = hasAny(q, ['subtract', 'minus', 'ghata', '-']);
  const wantsMul = hasAny(q, ['multiply', 'product', 'guna', '*', '×', 'gunan']);
  const wantsDiv = hasAny(q, ['divide', 'division', 'bhag', '/', '÷']);
  const wantsAnalyze = hasAny(q, ['analyze', 'classify', 'type', 'properties', 'batado', 'bata do', 'paribhasha', 'kyon', 'why']);
  const wantsSqrt = hasAny(q, ['sqrt', 'square root', 'vargmul', 'वर्गमूल', 'root']);
  const wantsCbrt = hasAny(q, ['cbrt', 'cube root', 'ghanmool', 'घनमूल']);
  const wantsPrime = hasAny(q, ['prime', 'abhajya', 'is it prime', 'prime check']);

  const lines: string[] = [];

  // If specific op requested and we have 2 numbers
  if ((wantsAdd || wantsSub || wantsMul || wantsDiv) && parsed.length >= 2) {
    const a = parsed[0]!;
    const b = parsed[1]!;

    let op: 'add' | 'sub' | 'mul' | 'div' | null = null;
    if (wantsDiv) op = 'div';
    else if (wantsMul) op = 'mul';
    else if (wantsSub) op = 'sub';
    else if (wantsAdd) op = 'add';

    if (op) {
      const computed = computeBinaryOp(op, a, b);
      if (computed) {
        if (lang === 'hi') {
          lines.push(`### 🧮 Calculation: ${computed.title}`);
          lines.push('');
          lines.push(`**Result:** ${computed.result}`);
          lines.push('');
          lines.push('**Steps:**');
          for (const s of computed.steps) lines.push(`- ${s}`);
        } else {
          lines.push(`### 🧮 Calculation: ${computed.title}`);
          lines.push('');
          lines.push(`**Result:** ${computed.result}`);
          lines.push('');
          lines.push('**Steps:**');
          for (const s of computed.steps) lines.push(`- ${s}`);
        }
        lines.push('');
      }
    }
  }

  // Roots: operate on first integer if present
  if (wantsSqrt) {
    const firstInt = parsed.find((x) => x.kind === 'int') as ParsedNumber | undefined;
    if (firstInt?.kind === 'int') {
      const n = firstInt.value;
      if (n < 0n) {
        lines.push(lang === 'hi' ? '### √n (Vargmul)' : '### √n (Square root)');
        lines.push(lang === 'hi' ? '- Negative integer ka real square root nahi hota.' : '- A negative integer has no real square root.');
        lines.push('');
      } else {
        const r = integerSqrt(n) ?? 0n;
        const exact = r * r === n;
        const digits = getRequestedDigits(message) ?? 10;
        const approx = sqrtApproxDecimal(n, digits);
        const simplified = extractSquareFactorsPartially(n);
        const hasSimplification = simplified.outside !== 1n && simplified.inside !== 1n;

        lines.push(lang === 'hi' ? '### √n (Vargmul)' : '### √n (Square root)');
        lines.push(`- n = ${formatBigInt(n)}`);
        if (exact) {
          lines.push(`- √n = ${formatBigInt(r)} (exact, perfect square)`);
        } else {
          lines.push(`- ⌊√n⌋ = ${formatBigInt(r)}  and  ⌊√n⌋^2 = ${formatBigInt(r * r)}`);
          lines.push(`- Next square: (${formatBigInt(r)}+1)^2 = ${formatBigInt((r + 1n) * (r + 1n))}`);
        }

        if (!exact) {
          // Show simplified radical form if we can extract any square factor
          if (hasSimplification) {
            if (lang === 'hi') {
              lines.push(`- Simplified (partial): √${formatBigInt(n)} = ${formatBigInt(simplified.outside)}√${formatBigInt(simplified.inside)}`);
            } else {
              lines.push(`- Simplified (partial): √${formatBigInt(n)} = ${formatBigInt(simplified.outside)}√${formatBigInt(simplified.inside)}`);
            }
          }

          if (approx) {
            lines.push(`- Approx (${approx.digits} decimals): ${approx.value}`);
          }
        }
        lines.push('');
      }
    }
  }

  if (wantsCbrt) {
    const firstInt = parsed.find((x) => x.kind === 'int') as ParsedNumber | undefined;
    if (firstInt?.kind === 'int') {
      const n = firstInt.value;
      const r = integerCbrt(n);
      const exact = r * r * r === n;
      lines.push(lang === 'hi' ? '### ∛n (Ghanmul)' : '### ∛n (Cube root)');
      lines.push(`- ⌊∛${formatBigInt(n)}⌋ = ${formatBigInt(r)}${exact ? ' (exact)' : ''}`);
      lines.push('');
    }
  }

  // Prime check and general analysis
  if (wantsPrime || wantsAnalyze) {
    lines.push(lang === 'hi' ? '### 🔍 Number Analysis' : '### 🔍 Number Analysis');
    lines.push('');
    const subset = parsed.slice(0, 4);
    for (const n of subset) {
      lines.push(buildAnalyzeOne(n, lang));
      lines.push('');
    }
  }

  // If user asked big number explicitly, include demo too
  if (wantsDemo) {
    lines.push(buildBigNumberDemo(lang));
  }

  // If nothing got appended (rare), fall back to guide
  if (lines.length === 0) {
    return buildGeneralGuide(lang);
  }

  // Append a small prompt for next
  if (lang === 'hi') {
    lines.push('### ✅ Next');
    lines.push("- Aap 1 ya 2 numbers bhejo aur bolo: 'add/subtract/multiply/divide/analyze/sqrt/cuberoot/prime check' ");
  } else {
    lines.push('### ✅ Next');
    lines.push("- Send 1–2 numbers and say: 'add/subtract/multiply/divide/analyze/sqrt/cube root/prime check'");
  }

  return lines.join('\n');
};
