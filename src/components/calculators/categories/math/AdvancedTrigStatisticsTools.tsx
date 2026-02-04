'use client';
import React, { useState } from 'react';

// ============================================================================
// ADVANCED TRIGONOMETRY CALCULATOR
// ============================================================================
export function AdvancedTrigonometryCalculator() {
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let angleValue = parseFloat(angle) || 0;
    const angleInRadians = angleUnit === 'degrees' ? (angleValue * Math.PI) / 180 : angleValue;
    const angleInDegrees = angleUnit === 'radians' ? (angleValue * 180) / Math.PI : angleValue;

    setResults({
      inputAngle: angleValue,
      inputUnit: angleUnit,
      degrees: angleInDegrees.toFixed(6),
      radians: angleInRadians.toFixed(6),
      sin: Math.sin(angleInRadians).toFixed(8),
      cos: Math.cos(angleInRadians).toFixed(8),
      tan: Math.tan(angleInRadians).toFixed(8),
      csc: (1 / Math.sin(angleInRadians)).toFixed(8),
      sec: (1 / Math.cos(angleInRadians)).toFixed(8),
      cot: (1 / Math.tan(angleInRadians)).toFixed(8),
      arcsin: (Math.asin(Math.sin(angleInRadians)) * 180 / Math.PI).toFixed(6),
      arccos: (Math.acos(Math.cos(angleInRadians)) * 180 / Math.PI).toFixed(6),
      arctan: (Math.atan(Math.tan(angleInRadians)) * 180 / Math.PI).toFixed(6),
      sinh: Math.sinh(angleInRadians).toFixed(8),
      cosh: Math.cosh(angleInRadians).toFixed(8),
      tanh: Math.tanh(angleInRadians).toFixed(8),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Trigonometry Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Angle</label>
          <input
            type="number"
            step="any"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter angle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
          <select
            value={angleUnit}
            onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="degrees">Degrees (°)</option>
            <option value="radians">Radians (rad)</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Calculate Trigonometric Functions
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Angle Conversions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Degrees</p>
                <p className="text-xl font-bold text-indigo-600">{results.degrees}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Radians</p>
                <p className="text-xl font-bold text-purple-600">{results.radians} rad</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Basic Trigonometric Functions</h3>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">sin(θ)</p>
                <p className="text-lg font-bold text-blue-600">{results.sin}</p>
              </div>
              <div>
                <p className="text-gray-600">cos(θ)</p>
                <p className="text-lg font-bold text-blue-600">{results.cos}</p>
              </div>
              <div>
                <p className="text-gray-600">tan(θ)</p>
                <p className="text-lg font-bold text-blue-600">{results.tan}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Reciprocal Functions</h3>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">csc(θ) = 1/sin(θ)</p>
                <p className="text-lg font-bold text-green-600">{results.csc}</p>
              </div>
              <div>
                <p className="text-gray-600">sec(θ) = 1/cos(θ)</p>
                <p className="text-lg font-bold text-green-600">{results.sec}</p>
              </div>
              <div>
                <p className="text-gray-600">cot(θ) = 1/tan(θ)</p>
                <p className="text-lg font-bold text-green-600">{results.cot}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Hyperbolic Functions</h3>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">sinh(θ)</p>
                <p className="text-lg font-bold text-purple-600">{results.sinh}</p>
              </div>
              <div>
                <p className="text-gray-600">cosh(θ)</p>
                <p className="text-lg font-bold text-purple-600">{results.cosh}</p>
              </div>
              <div>
                <p className="text-gray-600">tanh(θ)</p>
                <p className="text-lg font-bold text-purple-600">{results.tanh}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Key Identities</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• sin²(θ) + cos²(θ) = 1</li>
              <li>• tan(θ) = sin(θ) / cos(θ)</li>
              <li>• 1 + tan²(θ) = sec²(θ)</li>
              <li>• 1 + cot²(θ) = csc²(θ)</li>
              <li>• sin(2θ) = 2sin(θ)cos(θ)</li>
              <li>• cos(2θ) = cos²(θ) - sin²(θ)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED STATISTICS CALCULATOR
// ============================================================================
export function AdvancedStatisticsCalculator() {
  const [dataInput, setDataInput] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const dataString = dataInput.trim();
    if (!dataString) {
      alert('Please enter data values');
      return;
    }

    const data = dataString.split(/[,\s]+/).map(x => parseFloat(x)).filter(x => !isNaN(x));
    
    if (data.length === 0) {
      alert('No valid numbers found');
      return;
    }

    const n = data.length;
    const sortedData = [...data].sort((a, b) => a - b);
    
    // Mean
    const mean = data.reduce((a, b) => a + b, 0) / n;
    
    // Median
    let median;
    if (n % 2 === 0) {
      median = (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
    } else {
      median = sortedData[Math.floor(n / 2)];
    }
    
    // Mode
    const frequency: Record<number, number> = {};
    data.forEach(x => frequency[x] = (frequency[x] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(k => frequency[parseFloat(k)] === maxFreq).map(Number);
    const mode = modes.length === n ? 'No mode' : modes.join(', ');
    
    // Variance and Standard Deviation
    const variance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const sampleVariance = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
    const sampleStdDev = Math.sqrt(sampleVariance);
    
    // Range
    const range = sortedData[n - 1] - sortedData[0];
    
    // Quartiles
    const q1Index = Math.floor(n / 4);
    const q3Index = Math.floor(3 * n / 4);
    const q1 = sortedData[q1Index];
    const q3 = sortedData[q3Index];
    const iqr = q3 - q1;
    
    // Sum
    const sum = data.reduce((a, b) => a + b, 0);

    setResults({
      count: n,
      sum: sum.toFixed(4),
      mean: mean.toFixed(6),
      median: median.toFixed(6),
      mode,
      range: range.toFixed(6),
      min: sortedData[0].toFixed(6),
      max: sortedData[n - 1].toFixed(6),
      variance: variance.toFixed(6),
      stdDev: stdDev.toFixed(6),
      sampleVariance: sampleVariance.toFixed(6),
      sampleStdDev: sampleStdDev.toFixed(6),
      q1: q1.toFixed(6),
      q2: median.toFixed(6),
      q3: q3.toFixed(6),
      iqr: iqr.toFixed(6),
      coefficientOfVariation: ((stdDev / mean) * 100).toFixed(4),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Statistics Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Data (comma or space separated)
        </label>
        <textarea
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
          placeholder="Example: 10, 20, 30, 40, 50 or 10 20 30 40 50"
        />
      </div>

      <button
        onClick={calculate}
        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
      >
        Calculate Statistics
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Central Tendency</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Mean (Average)</p>
                <p className="text-2xl font-bold text-green-600">{results.mean}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Median</p>
                <p className="text-2xl font-bold text-teal-600">{results.median}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mode</p>
                <p className="text-2xl font-bold text-green-700">{results.mode}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Basic Properties</h4>
              <p className="text-sm mb-1">Count (n): <strong>{results.count}</strong></p>
              <p className="text-sm mb-1">Sum: <strong>{results.sum}</strong></p>
              <p className="text-sm mb-1">Minimum: <strong>{results.min}</strong></p>
              <p className="text-sm mb-1">Maximum: <strong>{results.max}</strong></p>
              <p className="text-sm">Range: <strong>{results.range}</strong></p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Dispersion</h4>
              <p className="text-sm mb-1">Population Variance: <strong>{results.variance}</strong></p>
              <p className="text-sm mb-1">Population Std Dev: <strong>{results.stdDev}</strong></p>
              <p className="text-sm mb-1">Sample Variance: <strong>{results.sampleVariance}</strong></p>
              <p className="text-sm">Sample Std Dev: <strong>{results.sampleStdDev}</strong></p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Quartiles & IQR</h4>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Q1 (25%)</p>
                <p className="font-bold">{results.q1}</p>
              </div>
              <div>
                <p className="text-gray-600">Q2 (50%)</p>
                <p className="font-bold">{results.q2}</p>
              </div>
              <div>
                <p className="text-gray-600">Q3 (75%)</p>
                <p className="font-bold">{results.q3}</p>
              </div>
              <div>
                <p className="text-gray-600">IQR</p>
                <p className="font-bold">{results.iqr}</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Additional Metrics</h4>
            <p className="text-sm">Coefficient of Variation: <strong>{results.coefficientOfVariation}%</strong></p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Formulas</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Mean = Σx / n</li>
              <li>• Variance = Σ(x - mean)² / n</li>
              <li>• Standard Deviation = √Variance</li>
              <li>• IQR = Q3 - Q1</li>
              <li>• CV = (σ / μ) × 100%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED UNIT CONVERSION CALCULATOR
// ============================================================================
export function AdvancedUnitConverter() {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [result, setResult] = useState<string | null>(null);

  const conversionData: Record<string, Record<string, number>> = {
    length: {
      meters: 1,
      kilometers: 0.001,
      centimeters: 100,
      millimeters: 1000,
      miles: 0.000621371,
      yards: 1.09361,
      feet: 3.28084,
      inches: 39.3701,
    },
    weight: {
      kilograms: 1,
      grams: 1000,
      milligrams: 1000000,
      pounds: 2.20462,
      ounces: 35.274,
      tons: 0.001,
    },
    temperature: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
    },
    area: {
      squareMeters: 1,
      squareKilometers: 0.000001,
      squareFeet: 10.7639,
      squareYards: 1.19599,
      acres: 0.000247105,
      hectares: 0.0001,
    },
    volume: {
      liters: 1,
      milliliters: 1000,
      cubicMeters: 0.001,
      gallons: 0.264172,
      quarts: 1.05669,
      pints: 2.11338,
      cups: 4.22675,
    },
  };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      alert('Please enter a valid number');
      return;
    }

    if (category === 'temperature') {
      let result;
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        result = (val * 9/5) + 32;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        result = (val - 32) * 5/9;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        result = val + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        result = val - 273.15;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        result = (val - 32) * 5/9 + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        result = (val - 273.15) * 9/5 + 32;
      } else {
        result = val;
      }
      setResult(result.toFixed(6));
    } else {
      const baseValue = val / conversionData[category][fromUnit];
      const convertedValue = baseValue * conversionData[category][toUnit];
      setResult(convertedValue.toFixed(8));
    }
  };

  const units: Record<string, string[]> = {
    length: ['meters', 'kilometers', 'centimeters', 'millimeters', 'miles', 'yards', 'feet', 'inches'],
    weight: ['kilograms', 'grams', 'milligrams', 'pounds', 'ounces', 'tons'],
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
    area: ['squareMeters', 'squareKilometers', 'squareFeet', 'squareYards', 'acres', 'hectares'],
    volume: ['liters', 'milliliters', 'cubicMeters', 'gallons', 'quarts', 'pints', 'cups'],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Unit Converter</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFromUnit(units[e.target.value][0]);
              setToUnit(units[e.target.value][1] || units[e.target.value][0]);
              setResult(null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="length">Length</option>
            <option value="weight">Weight/Mass</option>
            <option value="temperature">Temperature</option>
            <option value="area">Area</option>
            <option value="volume">Volume</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter value"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              {units[category].map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              {units[category].map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={convert}
          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
        >
          Convert
        </button>

        {result !== null && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            <p className="text-3xl font-bold text-purple-600">
              {value} {fromUnit} = {result} {toUnit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED NUMBER SYSTEM CONVERTER
// ============================================================================
export function AdvancedNumberSystemConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState('10');
  const [results, setResults] = useState<any>(null);

  const convert = () => {
    const base = parseInt(inputBase);
    let decimalValue: number;

    try {
      decimalValue = parseInt(inputValue, base);
      
      if (isNaN(decimalValue)) {
        alert('Invalid input for the selected base');
        return;
      }

      setResults({
        decimal: decimalValue,
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        base5: decimalValue.toString(5),
        base12: decimalValue.toString(12).toUpperCase(),
        base32: decimalValue.toString(32).toUpperCase(),
      });
    } catch (error) {
      alert('Error converting number');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Number System Converter</h2>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Number</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input Base</label>
          <select
            value={inputBase}
            onChange={(e) => setInputBase(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="2">Binary (Base 2)</option>
            <option value="8">Octal (Base 8)</option>
            <option value="10">Decimal (Base 10)</option>
            <option value="16">Hexadecimal (Base 16)</option>
          </select>
        </div>
      </div>

      <button
        onClick={convert}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
      >
        Convert to All Bases
      </button>

      {results && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold">Conversions</h3>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Decimal (Base 10)</p>
            <p className="text-2xl font-bold text-green-600">{results.decimal}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Binary (Base 2)</p>
            <p className="text-xl font-bold text-blue-600">{results.binary}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Octal (Base 8)</p>
            <p className="text-xl font-bold text-purple-600">{results.octal}</p>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Hexadecimal (Base 16)</p>
            <p className="text-xl font-bold text-pink-600">{results.hexadecimal}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-xs text-gray-600">Base 5</p>
              <p className="font-bold text-yellow-700">{results.base5}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded">
              <p className="text-xs text-gray-600">Base 12</p>
              <p className="font-bold text-indigo-700">{results.base12}</p>
            </div>
            <div className="bg-teal-50 p-3 rounded">
              <p className="text-xs text-gray-600">Base 32</p>
              <p className="font-bold text-teal-700">{results.base32}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
