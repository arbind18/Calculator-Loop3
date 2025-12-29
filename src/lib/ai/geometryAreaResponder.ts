export type Lang = 'en' | 'hi';

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

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return String(n);
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e8 || abs < 1e-6) return n.toExponential(8).replace(/0+e/, 'e').replace(/\.e/, 'e');
  return n.toLocaleString(undefined, { maximumFractionDigits: 10 });
};

const parseNumber = (raw: string) => {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const extractFirst = (message: string, keywords: string[]): number | null => {
  for (const k of keywords) {
    const re = new RegExp(`(?:\\b${k}\\b)\\s*(?:[:=]|is|=)?\\s*(-?\\d+(?:\\.\\d+)?)`, 'i');
    const m = message.match(re);
    if (m?.[1]) {
      const n = parseNumber(m[1]);
      if (n !== null) return n;
    }
  }
  return null;
};

const extractAnyNumber = (message: string): number[] => {
  const out: number[] = [];
  const re = /-?\d+(?:\.\d+)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(message))) {
    const n = parseNumber(m[0]);
    if (n !== null) out.push(n);
  }
  return out;
};

const build = (title: string, formula: string, steps: string[], result: string) => {
  return [`### 📐 ${title}`, '', `**Formula:** ${formula}`, '', '**Steps:**', ...steps.map((s) => `- ${s}`), '', `**Answer:** ${result}`].join('\n');
};

const buildNeed = (lang: Lang, title: string, needed: string) => {
  if (lang === 'hi') {
    return [
      `### 📐 ${title}`,
      '',
      'Iska chhetrafal nikalne ke liye ye values chahiye:',
      `- ${needed}`,
      '',
      "Example: 'area of circle r=7' ya 'क्षेत्रफल आयत length=10 width=5'",
    ].join('\n');
  }

  return [
    `### 📐 ${title}`,
    '',
    'To calculate area, please provide:',
    `- ${needed}`,
    '',
    "Example: 'area of circle r=7' or 'area rectangle length=10 width=5'",
  ].join('\n');
};

export const tryBuildGeometryAreaResponse = (message: string, lang: Lang): string | null => {
  const q = normalize(message);
  const aboutArea = hasAny(q, ['area', 'chhetrafal', 'क्षेत्रफल', 'kshetrafal']);
  if (!aboutArea) return null;

  // Circle
  const isCircle = hasAny(q, ['circle', 'vartul', 'वृत्त']);
  if (isCircle) {
    const r = extractFirst(message, ['r', 'radius']) ?? null;
    if (r === null) return buildNeed(lang, lang === 'hi' ? 'Vritt (Circle) ka chhetrafal' : 'Area of Circle', 'radius (r)');
    const area = Math.PI * r * r;
    const steps = [
      `Given r = ${formatNumber(r)}`,
      `A = πr² = π × ${formatNumber(r)}²`,
      `A = ${formatNumber(area)}`,
    ];
    return build(lang === 'hi' ? 'Vritt (Circle) ka chhetrafal' : 'Area of Circle', 'A = πr²', steps, `${formatNumber(area)} sq units`);
  }

  // Rectangle
  const isRectangle = hasAny(q, ['rectangle', 'aayat', 'आयत']);
  if (isRectangle) {
    const l = extractFirst(message, ['l', 'length']) ?? null;
    const w = extractFirst(message, ['w', 'width', 'breadth', 'b']) ?? null;
    if (l === null || w === null) return buildNeed(lang, lang === 'hi' ? 'Aayat (Rectangle) ka chhetrafal' : 'Area of Rectangle', 'length (l) and width/breadth (w)');
    const area = l * w;
    const steps = [`Given l = ${formatNumber(l)}, w = ${formatNumber(w)}`, `A = l×w = ${formatNumber(l)}×${formatNumber(w)} = ${formatNumber(area)}`];
    return build(lang === 'hi' ? 'Aayat (Rectangle) ka chhetrafal' : 'Area of Rectangle', 'A = l×w', steps, `${formatNumber(area)} sq units`);
  }

  // Square
  const isSquare = hasAny(q, ['square', 'varg', 'वर्ग']);
  if (isSquare) {
    const a = extractFirst(message, ['a', 'side', 's']) ?? null;
    if (a === null) return buildNeed(lang, lang === 'hi' ? 'Varg (Square) ka chhetrafal' : 'Area of Square', 'side (a)');
    const area = a * a;
    const steps = [`Given a = ${formatNumber(a)}`, `A = a² = ${formatNumber(a)}² = ${formatNumber(area)}`];
    return build(lang === 'hi' ? 'Varg (Square) ka chhetrafal' : 'Area of Square', 'A = a²', steps, `${formatNumber(area)} sq units`);
  }

  // Triangle (base, height)
  const isTriangle = hasAny(q, ['triangle', 'trikon', 'त्रिकोण']);
  if (isTriangle) {
    const b = extractFirst(message, ['b', 'base']) ?? null;
    const h = extractFirst(message, ['h', 'height', 'altitude']) ?? null;
    if (b !== null && h !== null) {
      const area = 0.5 * b * h;
      const steps = [`Given base = ${formatNumber(b)}, height = ${formatNumber(h)}`, `A = ½bh = ½×${formatNumber(b)}×${formatNumber(h)} = ${formatNumber(area)}`];
      return build(lang === 'hi' ? 'Trikon (Triangle) ka chhetrafal' : 'Area of Triangle', 'A = ½ × base × height', steps, `${formatNumber(area)} sq units`);
    }

    // Heron's formula if 3 sides provided
    const a1 = extractFirst(message, ['a', 'side1']) ?? null;
    const b1 = extractFirst(message, ['c', 'side2', 'sideb']) ?? null;
    const c1 = extractFirst(message, ['d', 'side3', 'sidec']) ?? null;
    const nums = extractAnyNumber(message);
    const sides = [a1, b1, c1].filter((x): x is number => x !== null);

    // Heuristic: if user gave 3 numbers and no base/height, treat them as sides.
    const inferredSides = sides.length === 3 ? sides : nums.length >= 3 ? nums.slice(0, 3) : [];
    if (inferredSides.length === 3) {
      const [a, b2, c] = inferredSides;
      const s = (a + b2 + c) / 2;
      const under = s * (s - a) * (s - b2) * (s - c);
      if (under <= 0) {
        return lang === 'hi'
          ? 'Triangle sides valid nahi lag rahe (s(s-a)(s-b)(s-c) <= 0). Kripya sahi sides bheje.'
          : 'Triangle sides do not look valid (s(s-a)(s-b)(s-c) <= 0). Please share correct sides.';
      }
      const area = Math.sqrt(under);
      const steps = [
        `Given sides: a=${formatNumber(a)}, b=${formatNumber(b2)}, c=${formatNumber(c)}`,
        `s = (a+b+c)/2 = (${formatNumber(a)}+${formatNumber(b2)}+${formatNumber(c)})/2 = ${formatNumber(s)}`,
        `A = √(s(s-a)(s-b)(s-c)) = ${formatNumber(area)}`,
      ];
      return build(lang === 'hi' ? 'Trikon (Heron) ka chhetrafal' : "Area of Triangle (Heron's)", 'A = √(s(s−a)(s−b)(s−c))', steps, `${formatNumber(area)} sq units`);
    }

    return buildNeed(lang, lang === 'hi' ? 'Trikon (Triangle) ka chhetrafal' : 'Area of Triangle', 'base+height OR three sides (a,b,c)');
  }

  // Parallelogram
  const isParallelogram = hasAny(q, ['parallelogram', 'samantar chaturbhuj', 'समांतर चतुर्भुज']);
  if (isParallelogram) {
    const b = extractFirst(message, ['b', 'base']) ?? null;
    const h = extractFirst(message, ['h', 'height']) ?? null;
    if (b === null || h === null) return buildNeed(lang, lang === 'hi' ? 'Parallelogram ka chhetrafal' : 'Area of Parallelogram', 'base (b) and height (h)');
    const area = b * h;
    const steps = [`Given b=${formatNumber(b)}, h=${formatNumber(h)}`, `A = b×h = ${formatNumber(area)}`];
    return build(lang === 'hi' ? 'Parallelogram ka chhetrafal' : 'Area of Parallelogram', 'A = b×h', steps, `${formatNumber(area)} sq units`);
  }

  // Trapezium / Trapezoid
  const isTrapezium = hasAny(q, ['trapezium', 'trapezoid', 'samantar', 'समलम्ब']);
  if (isTrapezium) {
    const a = extractFirst(message, ['a', 'base1', 'a1']) ?? null;
    const b = extractFirst(message, ['b', 'base2', 'b1']) ?? null;
    const h = extractFirst(message, ['h', 'height']) ?? null;
    if (a === null || b === null || h === null) return buildNeed(lang, lang === 'hi' ? 'Trapezium ka chhetrafal' : 'Area of Trapezium', 'parallel sides (a,b) and height (h)');
    const area = 0.5 * (a + b) * h;
    const steps = [`Given a=${formatNumber(a)}, b=${formatNumber(b)}, h=${formatNumber(h)}`, `A = ½(a+b)h = ½×(${formatNumber(a)}+${formatNumber(b)})×${formatNumber(h)} = ${formatNumber(area)}`];
    return build(lang === 'hi' ? 'Trapezium ka chhetrafal' : 'Area of Trapezium', 'A = ½(a+b)h', steps, `${formatNumber(area)} sq units`);
  }

  // Rhombus
  const isRhombus = hasAny(q, ['rhombus', 'samas', 'समचतुर्भुज', 'kite']);
  if (isRhombus) {
    const d1 = extractFirst(message, ['d1', 'diagonal1']) ?? null;
    const d2 = extractFirst(message, ['d2', 'diagonal2']) ?? null;
    if (d1 === null || d2 === null) return buildNeed(lang, lang === 'hi' ? 'Rhombus ka chhetrafal' : 'Area of Rhombus', 'diagonals d1 and d2');
    const area = 0.5 * d1 * d2;
    const steps = [`Given d1=${formatNumber(d1)}, d2=${formatNumber(d2)}`, `A = ½ d1 d2 = ½×${formatNumber(d1)}×${formatNumber(d2)} = ${formatNumber(area)}`];
    return build(lang === 'hi' ? 'Rhombus ka chhetrafal' : 'Area of Rhombus', 'A = ½ d1 d2', steps, `${formatNumber(area)} sq units`);
  }

  // Ellipse
  const isEllipse = hasAny(q, ['ellipse', 'oval']);
  if (isEllipse) {
    const a = extractFirst(message, ['a', 'semi major', 'semimajor', 'major']) ?? null;
    const b = extractFirst(message, ['b', 'semi minor', 'semiminor', 'minor']) ?? null;
    if (a === null || b === null) return buildNeed(lang, 'Area of Ellipse', 'semi-major a and semi-minor b');
    const area = Math.PI * a * b;
    const steps = [`Given a=${formatNumber(a)}, b=${formatNumber(b)}`, `A = πab = π×${formatNumber(a)}×${formatNumber(b)} = ${formatNumber(area)}`];
    return build('Area of Ellipse', 'A = πab', steps, `${formatNumber(area)} sq units`);
  }

  // If user asked area but shape not recognized: give a compact menu.
  if (lang === 'hi') {
    return [
      '### 📐 Chhetrafal (Area) – Main formulas',
      '',
      '- Circle: A = πr²',
      '- Rectangle: A = l×w',
      '- Square: A = a²',
      '- Triangle: A = ½bh  (ya Heron)',
      '- Parallelogram: A = b×h',
      '- Trapezium: A = ½(a+b)h',
      '- Rhombus: A = ½ d1 d2',
      '',
      "Aap shape + values bhejo. Example: 'area of triangle base=10 height=6'",
    ].join('\n');
  }

  return [
    '### 📐 Area – Common formulas',
    '',
    '- Circle: A = πr²',
    '- Rectangle: A = l×w',
    '- Square: A = a²',
    '- Triangle: A = ½bh (or Heron)',
    '- Parallelogram: A = b×h',
    '- Trapezium: A = ½(a+b)h',
    '- Rhombus: A = ½ d1 d2',
    '',
    "Send the shape + values. Example: 'area of triangle base=10 height=6'",
  ].join('\n');
};
