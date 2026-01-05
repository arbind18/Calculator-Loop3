import { Lang } from './mathSolver';

type Unit = {
  names: string[];
  factor: number; // Factor to convert TO base unit
  offset?: number; // For temperature
  baseUnit: string;
};

const UNITS: Record<string, Unit[]> = {
  length: [
    { names: ['m', 'meter', 'meters', 'metre', 'metres'], factor: 1, baseUnit: 'm' },
    { names: ['km', 'kilometer', 'kilometers', 'kilometre'], factor: 1000, baseUnit: 'm' },
    { names: ['cm', 'centimeter', 'centimeters'], factor: 0.01, baseUnit: 'm' },
    { names: ['mm', 'millimeter', 'millimeters'], factor: 0.001, baseUnit: 'm' },
    { names: ['mi', 'mile', 'miles'], factor: 1609.344, baseUnit: 'm' },
    { names: ['yd', 'yard', 'yards'], factor: 0.9144, baseUnit: 'm' },
    { names: ['ft', 'foot', 'feet'], factor: 0.3048, baseUnit: 'm' },
    { names: ['in', 'inch', 'inches'], factor: 0.0254, baseUnit: 'm' },
  ],
  weight: [
    { names: ['kg', 'kilogram', 'kilograms'], factor: 1, baseUnit: 'kg' },
    { names: ['g', 'gram', 'grams'], factor: 0.001, baseUnit: 'kg' },
    { names: ['mg', 'milligram', 'milligrams'], factor: 0.000001, baseUnit: 'kg' },
    { names: ['lb', 'lbs', 'pound', 'pounds'], factor: 0.45359237, baseUnit: 'kg' },
    { names: ['oz', 'ounce', 'ounces'], factor: 0.028349523125, baseUnit: 'kg' },
  ],
  temperature: [
    { names: ['c', 'celsius', 'centigrade'], factor: 1, offset: 0, baseUnit: 'c' },
    { names: ['f', 'fahrenheit'], factor: 1, offset: 0, baseUnit: 'c' }, // Special handling needed
    { names: ['k', 'kelvin'], factor: 1, offset: 0, baseUnit: 'c' }, // Special handling needed
  ],
  currency: [
    { names: ['inr', 'rupee', 'rupees', 'rs'], factor: 1, baseUnit: 'inr' },
    { names: ['usd', 'dollar', 'dollars'], factor: 84.5, baseUnit: 'inr' },
    { names: ['eur', 'euro', 'euros'], factor: 91.2, baseUnit: 'inr' },
    { names: ['gbp', 'pound', 'pounds'], factor: 107.5, baseUnit: 'inr' },
    { names: ['jpy', 'yen'], factor: 0.55, baseUnit: 'inr' },
    { names: ['aud', 'audollar'], factor: 55.0, baseUnit: 'inr' },
    { names: ['cad', 'cadollar'], factor: 60.5, baseUnit: 'inr' },
  ]
};

const findUnit = (name: string) => {
  const n = name.toLowerCase().replace(/[^a-z]/g, '');
  for (const category in UNITS) {
    for (const unit of UNITS[category]) {
      if (unit.names.includes(n)) {
        return { ...unit, category };
      }
    }
  }
  return null;
};

const convertTemperature = (val: number, from: string, to: string): number => {
  // Convert to Celsius
  let c = val;
  if (from === 'f' || from === 'fahrenheit') c = (val - 32) * 5 / 9;
  else if (from === 'k' || from === 'kelvin') c = val - 273.15;

  // Convert from Celsius
  if (to === 'f' || to === 'fahrenheit') return c * 9 / 5 + 32;
  if (to === 'k' || to === 'kelvin') return c + 273.15;
  return c;
};

export const tryBuildUnitConversionResponse = (message: string, lang: Lang): string | null => {
  // Pattern: "10 km to miles", "convert 5 kg in lbs", "30c to f"
  const regex = /([0-9]+(?:\.[0-9]+)?)\s*([a-z]+)\s*(?:to|in|into)\s*([a-z]+)/i;
  const match = message.match(regex);

  if (!match) return null;

  const value = parseFloat(match[1]);
  const fromUnitName = match[2];
  const toUnitName = match[3];

  const fromUnit = findUnit(fromUnitName);
  const toUnit = findUnit(toUnitName);

  if (!fromUnit || !toUnit) return null;

  if (fromUnit.category !== toUnit.category) {
    return lang === 'hi' 
      ? `Maaf kijiye, main ${fromUnitName} (jo ${fromUnit.category} hai) ko ${toUnitName} (jo ${toUnit.category} hai) mein convert nahi kar sakta.`
      : `Sorry, I cannot convert ${fromUnitName} (${fromUnit.category}) to ${toUnitName} (${toUnit.category}).`;
  }

  let result: number;
  let formula = '';

  if (fromUnit.category === 'temperature') {
    result = convertTemperature(value, fromUnit.names[0], toUnit.names[0]);
    formula = 'Temperature conversion formula applied.';
  } else {
    // Standard linear conversion
    const baseValue = value * fromUnit.factor;
    result = baseValue / toUnit.factor;
    formula = `1 ${fromUnit.names[0]} = ${fromUnit.factor / toUnit.factor} ${toUnit.names[0]}`;
  }

  const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(4).replace(/\.?0+$/, '');

  let note = '';
  if (fromUnit.category === 'currency') {
    note = lang === 'hi' 
      ? '\n\n_Note: Ye rates approximate hain aur market ke hisab se badal sakte hain._'
      : '\n\n_Note: These are approximate market rates and may vary._';
  }

  const response = lang === 'hi'
    ? `### Unit Conversion\n\n**${value} ${fromUnitName} = ${formattedResult} ${toUnitName}**\n\nFormula: ${formula}${note}`
    : `### Unit Conversion\n\n**${value} ${fromUnitName} = ${formattedResult} ${toUnitName}**\n\nFormula: ${formula}${note}`;

  return response;
};
