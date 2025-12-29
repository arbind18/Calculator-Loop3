export type Lang = 'en' | 'hi';

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasAny = (s: string, parts: string[]) => parts.some((p) => s.includes(p));

export const tryBuildTrigProofResponse = (message: string, lang: Lang): string | null => {
  const q = normalize(message);
  const isProof = hasAny(q, ['prove', 'show that', 'prove that', 'सिद्ध', 'प्रूव', 'प्रमाण']);

  // Identity: tan((A+B)/2) = (sinA + sinB)/(cosA + cosB)
  // Also appears as tan((A+B)/2) = a/b where a=sinA+sinB, b=cosA+cosB
  const looksLikeTanHalfSum =
    hasAny(q, ['tan((a+b)/2', 'tan((a + b)/2', 'tan((a+b)/ 2', 'tan((a + b)/ 2']) &&
    hasAny(q, ['sin', 'cos', 'sin a', 'sin b', 'cos a', 'cos b']);

  if (isProof && looksLikeTanHalfSum) {
    const linesEn = [
      '### 📐 Trig Proof (Sum-to-Product)',
      '',
      'We use the standard sum-to-product identities:',
      '- sinA + sinB = 2 sin((A+B)/2) cos((A−B)/2)',
      '- cosA + cosB = 2 cos((A+B)/2) cos((A−B)/2)',
      '',
      'Now divide the two:',
      '- (sinA + sinB)/(cosA + cosB)',
      '  = [2 sin((A+B)/2) cos((A−B)/2)] / [2 cos((A+B)/2) cos((A−B)/2)]',
      '  = tan((A+B)/2)',
      '',
      'So, tan((A+B)/2) = (sinA + sinB)/(cosA + cosB).',
    ];

    const linesHi = [
      '### 📐 Trig Proof (Sum-to-Product)',
      '',
      'Hum standard identities use karte hain:',
      '- sinA + sinB = 2 sin((A+B)/2) cos((A−B)/2)',
      '- cosA + cosB = 2 cos((A+B)/2) cos((A−B)/2)',
      '',
      'Ab ratio lo:',
      '- (sinA + sinB)/(cosA + cosB)',
      '  = [2 sin((A+B)/2) cos((A−B)/2)] / [2 cos((A+B)/2) cos((A−B)/2)]',
      '  = tan((A+B)/2)',
      '',
      'Hence prove ho gaya: tan((A+B)/2) = (sinA + sinB)/(cosA + cosB).',
    ];

    return (lang === 'hi' ? linesHi : linesEn).join('\n');
  }

  // Identity: sinA/(1+cosA) + (1+cosA)/sinA = 2cosecA
  const looksLikeCosec2 =
    hasAny(q, ['sin', 'cos']) &&
    hasAny(q, ['1+cos', '1 + cos']) &&
    hasAny(q, ['cosec', 'csc']);

  if (isProof && looksLikeCosec2) {
    const linesEn = [
      '### 📐 Trig Proof',
      '',
      'Start with:',
      '- sinA/(1+cosA) + (1+cosA)/sinA',
      '',
      'Make common denominator sinA(1+cosA):',
      '- = [sin^2A + (1+cosA)^2] / [sinA(1+cosA)]',
      '',
      'Expand and use sin^2A + cos^2A = 1:',
      '- Numerator = sin^2A + 1 + 2cosA + cos^2A',
      '- = (sin^2A + cos^2A) + 1 + 2cosA',
      '- = 1 + 1 + 2cosA = 2(1+cosA)',
      '',
      'So:',
      '- = 2(1+cosA) / [sinA(1+cosA)] = 2/sinA = 2cosecA.',
    ];

    const linesHi = [
      '### 📐 Trig Proof',
      '',
      'Start:',
      '- sinA/(1+cosA) + (1+cosA)/sinA',
      '',
      'Common denominator sinA(1+cosA) lo:',
      '- = [sin^2A + (1+cosA)^2] / [sinA(1+cosA)]',
      '',
      'Expand karo aur sin^2A + cos^2A = 1 use karo:',
      '- Numerator = sin^2A + 1 + 2cosA + cos^2A',
      '- = (sin^2A + cos^2A) + 1 + 2cosA',
      '- = 1 + 1 + 2cosA = 2(1+cosA)',
      '',
      'Hence:',
      '- = 2(1+cosA) / [sinA(1+cosA)] = 2/sinA = 2cosecA.',
    ];

    return (lang === 'hi' ? linesHi : linesEn).join('\n');
  }

  // Triangle identity: tanA + tanB + tanC = tanA tanB tanC (when A+B+C=pi)
  const looksLikeTanTriangle =
    hasAny(q, ['tana', 'tan a']) && hasAny(q, ['tanb', 'tan b']) && hasAny(q, ['tanc', 'tan c']) && hasAny(q, ['a+b+c=pi', 'a + b + c = pi', 'a+b+c=180', 'a + b + c = 180']);

  if (isProof && looksLikeTanTriangle) {
    const linesEn = [
      '### 📐 Trig Proof (Triangle)',
      '',
      'Given A+B+C = π, so C = π − (A+B).',
      '',
      'Then:',
      '- tanC = tan(π − (A+B)) = −tan(A+B)',
      '- tan(A+B) = (tanA + tanB)/(1 − tanA tanB)',
      '',
      'So:',
      '- tanC = −(tanA + tanB)/(1 − tanA tanB)',
      '',
      'Rearrange:',
      '- (tanA + tanB + tanC) = tanA tanB tanC',
    ];

    const linesHi = [
      '### 📐 Trig Proof (Triangle)',
      '',
      'Given A+B+C = π, to C = π − (A+B).',
      '',
      'Then:',
      '- tanC = tan(π − (A+B)) = −tan(A+B)',
      '- tan(A+B) = (tanA + tanB)/(1 − tanA tanB)',
      '',
      'So:',
      '- tanC = −(tanA + tanB)/(1 − tanA tanB)',
      '',
      'Isko rearrange karne par:',
      '- (tanA + tanB + tanC) = tanA tanB tanC',
    ];

    return (lang === 'hi' ? linesHi : linesEn).join('\n');
  }

  return null;
};
