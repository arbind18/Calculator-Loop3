export type Lang = 'en' | 'hi';

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const parseFirstNumber = (s: string): number | null => {
  const m = s.match(/(-?\d+(?:\.\d+)?)/);
  if (!m?.[1]) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
};

export const tryBuildAlgebraIdentityResponse = (message: string, lang: Lang): string | null => {
  const q = normalize(message);

  // Case 1: x + 1/x = k -> find x^3 + 1/x^3 or x^2 + 1/x^2
  const hasXPlusInvX = q.includes('x + 1/x') || q.includes('x+1/x') || q.includes('x + 1 / x') || q.includes('x+1 / x');
  if (hasXPlusInvX) {
    const k = parseFirstNumber(q);
    if (k === null) return null;

    const wantsCube = q.includes('x^3') || q.includes('x³') || q.includes('x3') || q.includes('cube');
    const wantsSquare = q.includes('x^2') || q.includes('x²') || q.includes('x2') || q.includes('square');

    if (wantsCube) {
      const value = k * k * k - 3 * k;
      if (lang === 'hi') {
        return [
          '### 🧮 Algebra Identity',
          '',
          '**Given:** x + 1/x = ' + k,
          '',
          '**Use identity:** (x + 1/x)^3 = x^3 + 1/x^3 + 3(x + 1/x)',
          '',
          '**Steps:**',
          `- (x + 1/x)^3 = ${k}^3 = ${k * k * k}`,
          `- So, x^3 + 1/x^3 = ${k * k * k} − 3(${k}) = ${value}`,
          '',
          '**Result:**',
          `- x^3 + 1/x^3 = ${value}`,
        ].join('\n');
      }

      return [
        '### 🧮 Algebra Identity',
        '',
        '**Given:** x + 1/x = ' + k,
        '',
        '**Identity:** (x + 1/x)^3 = x^3 + 1/x^3 + 3(x + 1/x)',
        '',
        '**Steps:**',
        `- (x + 1/x)^3 = ${k}^3 = ${k * k * k}`,
        `- Therefore, x^3 + 1/x^3 = ${k * k * k} − 3(${k}) = ${value}`,
        '',
        '**Result:**',
        `- x^3 + 1/x^3 = ${value}`,
      ].join('\n');
    }

    if (wantsSquare) {
      const value = k * k - 2;
      if (lang === 'hi') {
        return [
          '### 🧮 Algebra Identity',
          '',
          '**Given:** x + 1/x = ' + k,
          '',
          '**Use identity:** (x + 1/x)^2 = x^2 + 1/x^2 + 2',
          '',
          '**Steps:**',
          `- (x + 1/x)^2 = ${k}^2 = ${k * k}`,
          `- So, x^2 + 1/x^2 = ${k * k} − 2 = ${value}`,
          '',
          '**Result:**',
          `- x^2 + 1/x^2 = ${value}`,
        ].join('\n');
      }

      return [
        '### 🧮 Algebra Identity',
        '',
        '**Given:** x + 1/x = ' + k,
        '',
        '**Identity:** (x + 1/x)^2 = x^2 + 1/x^2 + 2',
        '',
        '**Steps:**',
        `- (x + 1/x)^2 = ${k}^2 = ${k * k}`,
        `- Therefore, x^2 + 1/x^2 = ${k * k} − 2 = ${value}`,
        '',
        '**Result:**',
        `- x^2 + 1/x^2 = ${value}`,
      ].join('\n');
    }
  }

  // Case 2: a + b + c = 0 -> a^3 + b^3 + c^3 = 3abc
  const hasSumZero = q.includes('a + b + c = 0') || q.includes('a+b+c=0');
  const wantsCubeSum = q.includes('a^3') || q.includes('a³') || q.includes('a3') || q.includes('b^3') || q.includes('c^3') || q.includes('a^3+b^3+c^3');
  if (hasSumZero && wantsCubeSum) {
    if (lang === 'hi') {
      return [
        '### 🧮 Algebra Identity',
        '',
        '**Given:** a + b + c = 0',
        '',
        '**Identity:** a^3 + b^3 + c^3 − 3abc = (a + b + c)(a^2 + b^2 + c^2 − ab − bc − ca)',
        '',
        '**Steps:**',
        '- Kyunki (a + b + c) = 0, isliye RHS = 0',
        '- Hence, a^3 + b^3 + c^3 − 3abc = 0',
        '',
        '**Result:**',
        '- a^3 + b^3 + c^3 = 3abc',
      ].join('\n');
    }

    return [
      '### 🧮 Algebra Identity',
      '',
      '**Given:** a + b + c = 0',
      '',
      '**Identity:** a^3 + b^3 + c^3 − 3abc = (a + b + c)(a^2 + b^2 + c^2 − ab − bc − ca)',
      '',
      '**Steps:**',
      '- Since (a + b + c) = 0, the RHS is 0',
      '- Therefore, a^3 + b^3 + c^3 − 3abc = 0',
      '',
      '**Result:**',
      '- a^3 + b^3 + c^3 = 3abc',
    ].join('\n');
  }

  // Case 3: x^2 + y^2 + z^2 = xy + yz + zx -> x=y=z
  const hasXYZCondition = q.includes('x^2 + y^2 + z^2 = xy + yz + zx') || q.includes('x² + y² + z² = xy + yz + zx') || q.includes('x2 + y2 + z2 = xy + yz + zx') || q.includes('x^2+y^2+z^2=xy+yz+zx');
  const asksEquality = q.includes('x = y = z') || q.includes('x=y=z') || q.includes('prove') || q.includes('show');
  if (hasXYZCondition && asksEquality) {
    if (lang === 'hi') {
      return [
        '### 🧮 Algebra (Equality Condition)',
        '',
        '**Given:** x^2 + y^2 + z^2 = xy + yz + zx',
        '',
        '**Idea:** (x−y)^2 + (y−z)^2 + (z−x)^2 ≥ 0',
        '',
        '**Steps:**',
        '- (x−y)^2 + (y−z)^2 + (z−x)^2',
        '  = 2(x^2 + y^2 + z^2 − xy − yz − zx)',
        '- Given se: (x^2 + y^2 + z^2 − xy − yz − zx) = 0',
        '- Isliye sum of squares = 0',
        '- Square 0 tabhi hota hai jab har term 0 ho: x−y=0, y−z=0, z−x=0',
        '',
        '**Result:**',
        '- x = y = z',
      ].join('\n');
    }

    return [
      '### 🧮 Algebra (Equality Condition)',
      '',
      '**Given:** x^2 + y^2 + z^2 = xy + yz + zx',
      '',
      '**Idea:** (x−y)^2 + (y−z)^2 + (z−x)^2 ≥ 0',
      '',
      '**Steps:**',
      '- (x−y)^2 + (y−z)^2 + (z−x)^2',
      '  = 2(x^2 + y^2 + z^2 − xy − yz − zx)',
      '- Using the given condition, the bracket is 0',
      '- Hence the sum of squares is 0',
      '- So each square is 0 ⇒ x=y, y=z ⇒ x=y=z',
      '',
      '**Result:**',
      '- x = y = z',
    ].join('\n');
  }

  return null;
};
