import { create, all } from 'mathjs';

export type Lang = 'en' | 'hi';

type SolveResponse = {
  title: string;
  formula?: string;
  result: string;
  steps: string[];
  notes?: string[];
};

const math = create(all, {
  number: 'number',
  precision: 64,
});

const isFiniteNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

const normalizeMathText = (raw: string) =>
  raw
    .trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/gi, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const addImplicitMultiplication = (expr: string) => {
  // Best-effort: convert common implicit multiplication into explicit '*'
  // Examples: 2x -> 2*x, 3(x+1) -> 3*(x+1), (x+1)2 -> (x+1)*2, x(y) -> x*(y)
  // Conservative to avoid breaking function names like sin(x).
  let out = expr;
  out = out.replace(/(\d)\s*([a-zA-Z])/g, '$1*$2');
  out = out.replace(/([a-zA-Z])\s*(\d)/g, '$1*$2');
  out = out.replace(/(\d)\s*\(/g, '$1*(');
  out = out.replace(/\)\s*(\d)/g, ')*$1');
  // Only when the letter is a standalone symbol (so we don't turn sin(x) into sin*(x)).
  out = out.replace(/\b([a-zA-Z])\s*\(/g, '$1*(');
  out = out.replace(/\)\s*([a-zA-Z])\b/g, ')*$1');
  return out;
};

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return String(n);
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e6 || abs < 1e-4) return n.toExponential(8).replace(/0+e/, 'e').replace(/\.e/, 'e');
  return n.toLocaleString(undefined, { maximumFractionDigits: 10 });
};

type Scope = Record<string, number>;

const parseAssignments = (message: string): Scope => {
  // Pull simple assignments like: x=2, y = 3.5
  const scope: Scope = {};
  const cleaned = message.replace(/,/g, ' ');
  const re = /\b([a-zA-Z])\b\s*=\s*(-?\d+(?:\.\d+)?)\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned))) {
    const variable = m[1];
    const value = Number(m[2]);
    if (Number.isFinite(value)) scope[variable] = value;
  }
  return scope;
};

const formatScopeInline = (scope: Scope) => {
  const keys = Object.keys(scope);
  if (keys.length === 0) return '';
  return keys
    .sort()
    .map((k) => `${k}=${formatNumber(scope[k]!)}`)
    .join(', ');
};

const pickVariable = (text: string) => {
  // Prefer x, else the first single-letter variable.
  if (/\bx\b/.test(text)) return 'x';
  const m = text.match(/\b([a-zA-Z])\b/);
  return m?.[1] ?? 'x';
};

const parseDerivative = (q: string) => {
  // Support: derivative of x^2; differentiate x^2; d/dx x^2
  const ddx = q.match(/\bd\s*\/\s*d\s*([a-zA-Z])\b\s*(.+)$/i);
  if (ddx?.[1] && ddx?.[2]) return { variable: ddx[1], expr: ddx[2].trim() };

  const m = q.match(/\b(derivative\s+of|differentiate)\b\s+(.+)$/i);
  if (!m?.[2]) return null;
  return { variable: pickVariable(q), expr: m[2].trim() };
};

const parseDefiniteIntegral = (q: string) => {
  // Support: integrate x^2 from 0 to 1; integral of sin(x) from 0 to pi
  const text = q
    .replace(/integral\s+of\s+/i, 'integrate ')
    .replace(/^\s*∫\s*/i, 'integrate ');

  const m = text.match(/\bintegrate\b\s+(.+?)\s+from\s+([^\s]+)\s+to\s+([^\s]+)\b/i);
  if (!m) return null;
  return { expr: m[1].trim(), aRaw: m[2].trim(), bRaw: m[3].trim() };
};

const numericIntegrateSimpson = (f: (x: number) => number, a: number, b: number, maxDepth = 14) => {
  const simpson = (fa: number, fm: number, fb: number, a0: number, b0: number) => ((b0 - a0) / 6) * (fa + 4 * fm + fb);

  const recurse = (
    a0: number,
    b0: number,
    fa: number,
    fm: number,
    fb: number,
    whole: number,
    depth: number
  ): number => {
    const m0 = (a0 + b0) / 2;
    const l0 = (a0 + m0) / 2;
    const r0 = (m0 + b0) / 2;
    const fl = f(l0);
    const fr = f(r0);
    if (!Number.isFinite(fl) || !Number.isFinite(fr)) return whole;
    const left = simpson(fa, fl, fm, a0, m0);
    const right = simpson(fm, fr, fb, m0, b0);
    const delta = left + right - whole;
    if (depth <= 0 || Math.abs(delta) < 1e-10) return left + right + delta / 15;
    return (
      recurse(a0, m0, fa, fl, fm, left, depth - 1) +
      recurse(m0, b0, fm, fr, fb, right, depth - 1)
    );
  };

  const fa = f(a);
  const fb = f(b);
  const m = (a + b) / 2;
  const fm = f(m);
  if (![fa, fb, fm].every((v) => Number.isFinite(v))) return NaN;
  const whole = simpson(fa, fm, fb, a, b);
  return recurse(a, b, fa, fm, fb, whole, maxDepth);
};

type Poly2 = { a0: number; a1: number; a2: number; ok: boolean; reason?: string };

const polyAdd = (p: Poly2, q: Poly2): Poly2 => ({ a0: p.a0 + q.a0, a1: p.a1 + q.a1, a2: p.a2 + q.a2, ok: p.ok && q.ok });
const polySub = (p: Poly2, q: Poly2): Poly2 => ({ a0: p.a0 - q.a0, a1: p.a1 - q.a1, a2: p.a2 - q.a2, ok: p.ok && q.ok });
const polyMul = (p: Poly2, q: Poly2): Poly2 => {
  if (!p.ok || !q.ok) return { a0: 0, a1: 0, a2: 0, ok: false, reason: p.reason ?? q.reason };
  // (p0 + p1 x + p2 x^2)(q0 + q1 x + q2 x^2) truncated to degree 2
  const a0 = p.a0 * q.a0;
  const a1 = p.a0 * q.a1 + p.a1 * q.a0;
  const a2 = p.a0 * q.a2 + p.a1 * q.a1 + p.a2 * q.a0;
  // If any higher degree terms exist, we reject.
  const higher = p.a1 * q.a2 + p.a2 * q.a1 + p.a2 * q.a2;
  if (Math.abs(higher) > 1e-12) return { a0: 0, a1: 0, a2: 0, ok: false, reason: 'Degree > 2' };
  return { a0, a1, a2, ok: true };
};

const polyPow = (p: Poly2, exp: number): Poly2 => {
  if (!p.ok) return p;
  if (!Number.isInteger(exp) || exp < 0) return { a0: 0, a1: 0, a2: 0, ok: false, reason: 'Non-integer exponent' };
  if (exp === 0) return { a0: 1, a1: 0, a2: 0, ok: true };
  if (exp === 1) return p;
  if (exp === 2) return polyMul(p, p);
  return { a0: 0, a1: 0, a2: 0, ok: false, reason: 'Degree > 2' };
};

const tryToPoly2 = (node: any, variable: string): Poly2 => {
  const fail = (reason: string): Poly2 => ({ a0: 0, a1: 0, a2: 0, ok: false, reason });

  if (!node) return fail('Empty expression');

  switch (node.type) {
    case 'ConstantNode': {
      const value = Number(node.value);
      if (!Number.isFinite(value)) return fail('Non-finite constant');
      return { a0: value, a1: 0, a2: 0, ok: true };
    }
    case 'SymbolNode': {
      if (node.name === variable) return { a0: 0, a1: 1, a2: 0, ok: true };
      // Other symbols => we only accept if it is a known constant like e, pi
      if (node.name === 'pi') return { a0: Math.PI, a1: 0, a2: 0, ok: true };
      if (node.name === 'e') return { a0: Math.E, a1: 0, a2: 0, ok: true };
      return fail(`Unknown symbol: ${node.name}`);
    }
    case 'ParenthesisNode':
      return tryToPoly2(node.content, variable);

    case 'OperatorNode': {
      const op = node.op;

      // Unary minus
      if (op === '-' && node.args?.length === 1) {
        const p = tryToPoly2(node.args[0], variable);
        return p.ok ? { a0: -p.a0, a1: -p.a1, a2: -p.a2, ok: true } : p;
      }

      if (!node.args || node.args.length !== 2) return fail('Unsupported operator arity');
      const left = tryToPoly2(node.args[0], variable);
      const right = tryToPoly2(node.args[1], variable);

      if (op === '+') return polyAdd(left, right);
      if (op === '-') return polySub(left, right);
      if (op === '*') return polyMul(left, right);
      if (op === '/') {
        // Only allow division by constant
        if (!right.ok) return right;
        if (Math.abs(right.a1) > 1e-12 || Math.abs(right.a2) > 1e-12) return fail('Division by variable/expression');
        if (Math.abs(right.a0) < 1e-12) return fail('Division by zero');
        return { a0: left.a0 / right.a0, a1: left.a1 / right.a0, a2: left.a2 / right.a0, ok: left.ok };
      }
      if (op === '^') {
        // Only support power with constant integer exponent
        if (!right.ok) return right;
        if (Math.abs(right.a1) > 1e-12 || Math.abs(right.a2) > 1e-12) return fail('Exponent depends on variable');
        const exp = right.a0;
        return polyPow(left, exp);
      }

      return fail(`Unsupported operator: ${op}`);
    }

    default:
      return fail(`Unsupported node type: ${node.type}`);
  }
};

const solveLinearOrQuadratic = (poly: Poly2) => {
  const { a0: c, a1: b, a2: a } = poly;

  if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) {
    if (Math.abs(c) < 1e-12) return { kind: 'identity' as const };
    return { kind: 'inconsistent' as const };
  }

  if (Math.abs(a) < 1e-12) {
    // bx + c = 0 => x = -c/b
    return { kind: 'linear' as const, x: -c / b };
  }

  const D = b * b - 4 * a * c;
  if (D < 0) {
    const re = -b / (2 * a);
    const im = Math.sqrt(-D) / (2 * a);
    return { kind: 'quadratic-complex' as const, re, im, D };
  }

  const sqrtD = Math.sqrt(D);
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);
  return { kind: 'quadratic-real' as const, x1, x2, D };
};

const numericFindRoots = (expr: string, variable: string): number[] => {
  // Best-effort: find sign changes on [-100, 100] and bisection.
  const f = (x: number) => {
    try {
      const v = math.evaluate(expr, { [variable]: x });
      return typeof v === 'number' ? v : Number(v);
    } catch {
      return NaN;
    }
  };

  const roots: number[] = [];
  const pushUnique = (r: number) => {
    if (!Number.isFinite(r)) return;
    if (roots.some((x) => Math.abs(x - r) < 1e-6)) return;
    roots.push(r);
  };

  let prevX = -100;
  let prevY = f(prevX);

  for (let x = -99; x <= 100; x += 1) {
    const y = f(x);
    if (!Number.isFinite(prevY) || !Number.isFinite(y)) {
      prevX = x;
      prevY = y;
      continue;
    }

    if (Math.abs(y) < 1e-8) pushUnique(x);

    if (prevY === 0) {
      prevX = x;
      prevY = y;
      continue;
    }

    if (prevY * y < 0) {
      // Bisection
      let lo = prevX;
      let hi = x;
      let flo = prevY;
      let fhi = y;

      for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        const fmid = f(mid);
        if (!Number.isFinite(fmid)) break;
        if (Math.abs(fmid) < 1e-10) {
          lo = hi = mid;
          break;
        }
        if (flo * fmid < 0) {
          hi = mid;
          fhi = fmid;
        } else {
          lo = mid;
          flo = fmid;
        }
      }

      pushUnique((lo + hi) / 2);
    }

    prevX = x;
    prevY = y;
  }

  return roots.sort((a, b) => a - b);
};

const buildResponseText = (resp: SolveResponse, lang: Lang) => {
  const lines: string[] = [];
  lines.push(lang === 'hi' ? `### 🧮 ${resp.title}` : `### 🧮 ${resp.title}`);
  if (resp.formula) {
    lines.push('');
    lines.push(lang === 'hi' ? '**Formula:**' : '**Formula:**');
    lines.push(resp.formula);
  }
  lines.push('');
  lines.push(lang === 'hi' ? '**Result:**' : '**Result:**');
  lines.push(`- ${resp.result}`);
  lines.push('');
  lines.push(lang === 'hi' ? '**Steps:**' : '**Steps:**');
  resp.steps.forEach((s) => lines.push(`- ${s}`));
  if (resp.notes && resp.notes.length > 0) {
    lines.push('');
    lines.push(lang === 'hi' ? '**Notes:**' : '**Notes:**');
    resp.notes.forEach((n) => lines.push(`- ${n}`));
  }
  return lines.join('\n');
};

const looksLikeMath = (q: string) => {
  const hasOps = /[0-9][0-9\s]*[+\-*/^()]/.test(q) || /[+\-*/^()]/.test(q);
  const hasEq = q.includes('=');
  const hasMathWords = /\b(solve|calculate|simplify|evaluate|find|answer|result|equals|derivative|differentiate|integrate|integral)\b/i.test(q);
  const hasHindiMathWords = /\b(hal|hisab|ganit|solve|nikal|jawab|bata|calculate|integration|integ|derivative)\b/i.test(q);
  return hasEq || (hasOps && (q.match(/\d/g)?.length ?? 0) >= 1) || hasMathWords || hasHindiMathWords;
};

export const tryBuildMathSolveResponse = (message: string, lang: Lang): string | null => {
  const raw = message;
  const q = normalizeMathText(raw);
  if (!looksLikeMath(q)) return null;

  const scope = parseAssignments(raw);

  // 1) Derivative
  const deriv = parseDerivative(q);
  if (deriv) {
    try {
      const variable = deriv.variable;
      const expr = addImplicitMultiplication(normalizeMathText(deriv.expr));
      const steps: string[] = [];
      steps.push(lang === 'hi' ? `Given: f(${variable}) = ${expr}` : `Given: f(${variable}) = ${expr}`);
      steps.push(lang === 'hi' ? `Differentiate w.r.t. ${variable}` : `Differentiate w.r.t. ${variable}`);

      const node = math.parse(expr);
      const d = math.derivative(node, variable);
      const simplified = math.simplify(d).toString();
      steps.push(lang === 'hi' ? `Derivative: ${simplified}` : `Derivative: ${simplified}`);

      let notes: string[] | undefined;
      if (Object.keys(scope).length > 0) {
        if (Object.prototype.hasOwnProperty.call(scope, variable)) {
          const val = math.evaluate(simplified, scope);
          const num = typeof val === 'number' ? val : Number(val);
          if (Number.isFinite(num)) {
            steps.push(lang === 'hi' ? `Substitute ${formatScopeInline(scope)}: ${formatNumber(num)}` : `Substitute ${formatScopeInline(scope)}: ${formatNumber(num)}`);
          }
        } else {
          notes = [
            lang === 'hi'
              ? `Aapne values di hain (${formatScopeInline(scope)}). Agar ${variable} ki value doge to numeric derivative nikal dunga.`
              : `You provided values (${formatScopeInline(scope)}). Provide ${variable} too for a numeric derivative value.`,
          ];
        }
      }

      return buildResponseText(
        {
          title: lang === 'hi' ? 'Derivative' : 'Derivative',
          formula: `\\frac{d}{d${variable}}`,
          result: simplified,
          steps,
          notes,
        },
        lang
      );
    } catch {
      // If derivative fails, continue to other handlers.
    }
  }

  // 2) Definite integral (numeric)
  const integral = parseDefiniteIntegral(q);
  if (integral) {
    try {
      const expr = addImplicitMultiplication(normalizeMathText(integral.expr));
      const variable = pickVariable(expr);

      const aExpr = addImplicitMultiplication(normalizeMathText(integral.aRaw));
      const bExpr = addImplicitMultiplication(normalizeMathText(integral.bRaw));

      const aVal = math.evaluate(aExpr, scope);
      const bVal = math.evaluate(bExpr, scope);
      const a = typeof aVal === 'number' ? aVal : Number(aVal);
      const b = typeof bVal === 'number' ? bVal : Number(bVal);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

      const steps: string[] = [];
      steps.push(lang === 'hi' ? `Given: ∫ ${expr} d${variable} from ${aExpr} to ${bExpr}` : `Given: ∫ ${expr} d${variable} from ${aExpr} to ${bExpr}`);
      if (Object.keys(scope).length > 0) {
        steps.push(lang === 'hi' ? `Known values: ${formatScopeInline(scope)}` : `Known values: ${formatScopeInline(scope)}`);
      }
      steps.push(lang === 'hi' ? `Method: adaptive Simpson (numeric)` : `Method: adaptive Simpson (numeric)`);

      const f = (x: number) => {
        try {
          const v = math.evaluate(expr, { ...scope, [variable]: x });
          return typeof v === 'number' ? v : Number(v);
        } catch {
          return NaN;
        }
      };

      const I = numericIntegrateSimpson(f, a, b);
      if (!Number.isFinite(I)) return null;
      steps.push(lang === 'hi' ? `Result: ≈ ${formatNumber(I)}` : `Result: ≈ ${formatNumber(I)}`);

      return buildResponseText(
        {
          title: lang === 'hi' ? 'Definite Integral (Numeric)' : 'Definite Integral (Numeric)',
          formula: `\\int_{${aExpr}}^{${bExpr}} ${expr}\\, d${variable}`,
          result: `≈ ${formatNumber(I)}`,
          steps,
          notes: [lang === 'hi' ? 'Ye approximate answer hai (numeric integration).' : 'Approximate value from numeric integration.'],
        },
        lang
      );
    } catch {
      // continue
    }
  }

  // Equation path
  if (q.includes('=')) {
    const parts = q.split('=');
    if (parts.length !== 2) return null;

    const left = addImplicitMultiplication(parts[0].trim());
      const right = addImplicitMultiplication(parts[1].trim());
    if (!left || !right) return null;

    const variable = pickVariable(q);

    const steps: string[] = [];
    steps.push(lang === 'hi' ? `Given: ${left} = ${right}` : `Given: ${left} = ${right}`);
    steps.push(lang === 'hi' ? `Bring all terms to one side: (${left}) - (${right}) = 0` : `Bring all terms to one side: (${left}) - (${right}) = 0`);

    const combined = `(${left}) - (${right})`;

    let simplified = combined;
    try {
      const node = math.parse(combined);
      const simp = math.simplify(node);
      simplified = simp.toString();
      if (simplified !== combined) {
        steps.push(lang === 'hi' ? `Simplify: ${simplified} = 0` : `Simplify: ${simplified} = 0`);
      }

      const poly = tryToPoly2(math.parse(simplified), variable);
      if (poly.ok) {
        // Build polynomial string
        const { a2, a1, a0 } = poly;
        const eqStr = `${a2}*${variable}^2 + ${a1}*${variable} + ${a0} = 0`;
        steps.push(lang === 'hi' ? `Recognize polynomial in ${variable}: ${eqStr}` : `Recognize polynomial in ${variable}: ${eqStr}`);

        const solved = solveLinearOrQuadratic(poly);

        if (solved.kind === 'identity') {
          return buildResponseText(
            {
              title: lang === 'hi' ? 'Equation Solution' : 'Equation Solution',
              result: lang === 'hi' ? 'Har value ke liye true (infinite solutions).' : 'True for all values (infinitely many solutions).',
              steps,
            },
            lang
          );
        }

        if (solved.kind === 'inconsistent') {
          return buildResponseText(
            {
              title: lang === 'hi' ? 'Equation Solution' : 'Equation Solution',
              result: lang === 'hi' ? 'Koi solution nahi (no solution).' : 'No solution.',
              steps,
            },
            lang
          );
        }

        if (solved.kind === 'linear') {
          steps.push(lang === 'hi' ? `Linear formula: ${variable} = -c/b` : `Linear formula: ${variable} = -c/b`);
          steps.push(lang === 'hi' ? `${variable} = ${formatNumber(-a0)} / ${formatNumber(a1)} = ${formatNumber(solved.x)}` : `${variable} = ${formatNumber(-a0)} / ${formatNumber(a1)} = ${formatNumber(solved.x)}`);

          return buildResponseText(
            {
              title: lang === 'hi' ? 'Linear Equation Solver' : 'Linear Equation Solver',
              formula: `${variable} = -\frac{c}{b}`,
              result: `${variable} = ${formatNumber(solved.x)}`,
              steps,
            },
            lang
          );
        }

        // Quadratic
        steps.push(lang === 'hi' ? `Quadratic discriminant: D = b² - 4ac` : `Discriminant: D = b² - 4ac`);
        steps.push(
          lang === 'hi'
            ? `D = (${formatNumber(a1)})² - 4*(${formatNumber(a2)})*(${formatNumber(a0)}) = ${formatNumber((solved as any).D)}`
            : `D = (${formatNumber(a1)})² - 4*(${formatNumber(a2)})*(${formatNumber(a0)}) = ${formatNumber((solved as any).D)}`
        );
        steps.push(lang === 'hi' ? `Quadratic formula: ${variable} = (-b ± √D) / (2a)` : `Quadratic formula: ${variable} = (-b ± √D) / (2a)`);

        if (solved.kind === 'quadratic-real') {
          steps.push(
            lang === 'hi'
              ? `${variable}₁ = (${formatNumber(-a1)} + √${formatNumber((solved as any).D)}) / (2*${formatNumber(a2)}) = ${formatNumber(solved.x1)}`
              : `${variable}₁ = (${formatNumber(-a1)} + √${formatNumber((solved as any).D)}) / (2*${formatNumber(a2)}) = ${formatNumber(solved.x1)}`
          );
          steps.push(
            lang === 'hi'
              ? `${variable}₂ = (${formatNumber(-a1)} - √${formatNumber((solved as any).D)}) / (2*${formatNumber(a2)}) = ${formatNumber(solved.x2)}`
              : `${variable}₂ = (${formatNumber(-a1)} - √${formatNumber((solved as any).D)}) / (2*${formatNumber(a2)}) = ${formatNumber(solved.x2)}`
          );

          return buildResponseText(
            {
              title: lang === 'hi' ? 'Quadratic Equation Solver' : 'Quadratic Equation Solver',
              formula: `${variable} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
              result: `${variable} = ${formatNumber(solved.x1)}, ${formatNumber(solved.x2)}`,
              steps,
            },
            lang
          );
        }

        // Complex roots
        return buildResponseText(
          {
            title: lang === 'hi' ? 'Quadratic Equation Solver' : 'Quadratic Equation Solver',
            formula: `${variable} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
            result: `${variable} = ${formatNumber((solved as any).re)} ± ${formatNumber((solved as any).im)}i`,
            steps,
            notes: [lang === 'hi' ? 'Discriminant negative hai, isliye complex roots aate hain.' : 'Negative discriminant gives complex roots.'],
          },
          lang
        );
      }

      // Fallback numeric roots
      steps.push(
        lang === 'hi'
          ? `Is equation ka closed-form step-by-step yahan limited hai; numeric root try kar raha hoon.`
          : `Closed-form steps are limited here; trying numeric roots.`
      );
      const roots = numericFindRoots(simplified, variable);
      if (roots.length > 0) {
        return buildResponseText(
          {
            title: lang === 'hi' ? 'Equation (Numeric Solve)' : 'Equation (Numeric Solve)',
            result: `${variable} ≈ ${roots.map(formatNumber).join(', ')}`,
            steps,
            notes: [
              lang === 'hi'
                ? 'Ye approximate solution hai (range -100..100 me search).'
                : 'Approximate roots found by scanning [-100, 100] and bisection.',
            ],
          },
          lang
        );
      }

      return buildResponseText(
        {
          title: lang === 'hi' ? 'Equation Solve' : 'Equation Solve',
          result: lang === 'hi' ? 'Numeric root nahi mila (ya expression unsupported).' : 'No numeric root found (or expression unsupported).',
          steps,
          notes: [lang === 'hi' ? 'Aap equation ko simplify karke ya range bata ke pooch sakte hain.' : 'Try a simplified equation or specify a range/variable.'],
        },
        lang
      );
    } catch {
      return null;
    }
  }

  // Expression path
  try {
    const expr = addImplicitMultiplication(
      q
      // Strip common leading words
      .replace(/^\s*(solve|calculate|evaluate|simplify|find)\b\s*/i, '')
      .trim()
    );

    if (!expr) return null;

    const steps: string[] = [];
    steps.push(lang === 'hi' ? `Expression: ${expr}` : `Expression: ${expr}`);

    const parsed = math.parse(expr);
    steps.push(lang === 'hi' ? `Parse: ${parsed.toString()}` : `Parse: ${parsed.toString()}`);

    const simplified = math.simplify(parsed).toString();
    if (simplified !== parsed.toString()) {
      steps.push(lang === 'hi' ? `Simplify: ${simplified}` : `Simplify: ${simplified}`);
    }

    // Evaluate only if no symbols except constants
    const symbols = new Set<string>();
    parsed.traverse((n: any) => {
      if (n.type === 'SymbolNode') symbols.add(n.name);
    });

    const hasVariables = [...symbols].some((s) => s !== 'pi' && s !== 'e');
    if (hasVariables) {
      const vars = [...symbols].filter((s) => s !== 'pi' && s !== 'e');
      const missing = vars.filter((v) => !Object.prototype.hasOwnProperty.call(scope, v));
      if (vars.length > 0 && missing.length === 0) {
        const value = math.evaluate(expr, scope);
        const numeric = typeof value === 'number' ? value : Number(value);
        if (isFiniteNumber(numeric)) {
          steps.push(lang === 'hi' ? `Substitute: ${formatScopeInline(scope)}` : `Substitute: ${formatScopeInline(scope)}`);
          steps.push(lang === 'hi' ? `Evaluate: ${simplified} = ${formatNumber(numeric)}` : `Evaluate: ${simplified} = ${formatNumber(numeric)}`);
          return buildResponseText(
            {
              title: lang === 'hi' ? 'Math Calculation' : 'Math Calculation',
              result: formatNumber(numeric),
              steps,
            },
            lang
          );
        }
      }
      return buildResponseText(
        {
          title: lang === 'hi' ? 'Expression Simplify' : 'Expression Simplify',
          result: simplified,
          steps,
          notes: [
            lang === 'hi'
              ? `Isme variables hain (${[...symbols].join(', ')}). Agar aap values doge (jaise x=2), to main numeric answer nikal dunga.`
              : `This contains variables (${[...symbols].join(', ')}). Provide values (like x=2) and I’ll compute a numeric answer too.`,
          ],
        },
        lang
      );
    }

    const value = math.evaluate(expr);
    const numeric = typeof value === 'number' ? value : Number(value);

    if (!isFiniteNumber(numeric)) {
      return buildResponseText(
        {
          title: lang === 'hi' ? 'Expression Result' : 'Expression Result',
          result: String(value),
          steps,
        },
        lang
      );
    }

    steps.push(lang === 'hi' ? `Evaluate: ${simplified} = ${formatNumber(numeric)}` : `Evaluate: ${simplified} = ${formatNumber(numeric)}`);

    return buildResponseText(
      {
        title: lang === 'hi' ? 'Math Calculation' : 'Math Calculation',
        result: formatNumber(numeric),
        steps,
      },
      lang
    );
  } catch {
    return null;
  }
};
