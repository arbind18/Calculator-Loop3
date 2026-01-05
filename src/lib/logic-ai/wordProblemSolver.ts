import { Lang } from './mathSolver';

export const tryBuildWordProblemResponse = (message: string, lang: Lang): string | null => {
  const lower = message.toLowerCase();

  // 1. Sum / Addition
  // "Sum of 5 and 10", "Add 5 and 10", "5 plus 10"
  if (lower.includes('sum') || lower.includes('add') || lower.includes('plus') || lower.includes('total')) {
    const numbers = extractNumbers(message);
    if (numbers.length >= 2) {
      const sum = numbers.reduce((a, b) => a + b, 0);
      const steps = numbers.join(' + ');
      return formatResponse('Addition', `${steps} = ${sum}`, lang);
    }
  }

  // 2. Difference / Subtraction
  // "Difference between 10 and 5", "Subtract 5 from 10", "10 minus 5"
  if (lower.includes('difference') || lower.includes('subtract') || lower.includes('minus')) {
    const numbers = extractNumbers(message);
    if (numbers.length === 2) {
      // "Subtract 5 from 10" -> 10 - 5
      if (lower.includes('from')) {
        // Regex to check order might be needed, but simple heuristic: usually "subtract X from Y"
        // If we just take numbers in order, "subtract 5 from 10" gives [5, 10]. 10-5=5.
        // "Difference between 10 and 5" gives [10, 5]. 10-5=5.
        // Let's try to be smart.
        const fromIndex = lower.indexOf('from');
        const firstNumIndex = message.indexOf(numbers[0].toString());
        
        if (firstNumIndex < fromIndex) {
           // "Subtract 5 from 10" -> 10 - 5
           const result = numbers[1] - numbers[0];
           return formatResponse('Subtraction', `${numbers[1]} - ${numbers[0]} = ${result}`, lang);
        }
      }
      
      const result = numbers[0] - numbers[1];
      return formatResponse('Subtraction', `${numbers[0]} - ${numbers[1]} = ${result}`, lang);
    }
  }

  // 3. Product / Multiplication
  // "Product of 5 and 10", "Multiply 5 by 10", "5 times 10"
  if (lower.includes('product') || lower.includes('multiply') || lower.includes('times')) {
    const numbers = extractNumbers(message);
    if (numbers.length >= 2) {
      const product = numbers.reduce((a, b) => a * b, 1);
      const steps = numbers.join(' × ');
      return formatResponse('Multiplication', `${steps} = ${product}`, lang);
    }
  }

  // 4. Division
  // "Divide 10 by 2", "10 divided by 2", "Ratio of 10 and 2"
  if (lower.includes('divide') || lower.includes('ratio')) {
    const numbers = extractNumbers(message);
    if (numbers.length === 2) {
      if (numbers[1] === 0) return lang === 'hi' ? "Zero se divide nahi kar sakte." : "Cannot divide by zero.";
      const result = numbers[0] / numbers[1];
      return formatResponse('Division', `${numbers[0]} / ${numbers[1]} = ${result}`, lang);
    }
  }

  // 5. Simple "Apples" logic (Addition/Subtraction)
  // "I have 5 apples, I buy 3 more"
  if (lower.includes('have') && (lower.includes('buy') || lower.includes('get') || lower.includes('more'))) {
     const numbers = extractNumbers(message);
     if (numbers.length >= 2) {
       const sum = numbers.reduce((a, b) => a + b, 0);
       return formatResponse('Total Count', `${numbers.join(' + ')} = ${sum}`, lang);
     }
  }
  
  if (lower.includes('have') && (lower.includes('eat') || lower.includes('give') || lower.includes('lost'))) {
     const numbers = extractNumbers(message);
     if (numbers.length >= 2) {
       const result = numbers[0] - numbers.slice(1).reduce((a, b) => a + b, 0);
       return formatResponse('Remaining Count', `${numbers[0]} - ${numbers.slice(1).join(' - ')} = ${result}`, lang);
     }
  }

  return null;
};

const extractNumbers = (text: string): number[] => {
  const matches = text.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
};

const formatResponse = (title: string, content: string, lang: Lang) => {
  return lang === 'hi'
    ? `### ${title}\n\n**Jawab:** ${content}`
    : `### ${title}\n\n**Answer:** ${content}`;
};
