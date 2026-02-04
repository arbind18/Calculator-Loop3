'use client';
import React, { useState } from 'react';

// ============================================================================
// ADVANCED BASIC CALCULATOR
// ============================================================================
export function AdvancedBasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op);
    setDisplay('0');
  };

  const handleEquals = () => {
    try {
      const result = eval(equation + ' ' + display);
      const calculation = `${equation} ${display} = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);
      setDisplay(String(result));
      setEquation('');
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleMemoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const handleMemoryRecall = () => {
    setDisplay(String(memory));
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleSquareRoot = () => {
    const result = Math.sqrt(parseFloat(display));
    setDisplay(String(result));
  };

  const handleSquare = () => {
    const result = Math.pow(parseFloat(display), 2);
    setDisplay(String(result));
  };

  const handleReciprocal = () => {
    const result = 1 / parseFloat(display);
    setDisplay(String(result));
  };

  const handlePercentage = () => {
    const result = parseFloat(display) / 100;
    setDisplay(String(result));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Basic Calculator</h2>
      
      <div className="mb-4">
        <div className="bg-gray-100 rounded p-4 mb-2">
          <div className="text-sm text-gray-600 mb-1">{equation}</div>
          <div className="text-3xl font-bold text-right">{display}</div>
          {memory !== 0 && <div className="text-xs text-blue-600 mt-1">M: {memory}</div>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <button onClick={handleMemoryClear} className="bg-red-500 text-white p-3 rounded hover:bg-red-600">MC</button>
        <button onClick={handleMemoryRecall} className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">MR</button>
        <button onClick={handleMemoryAdd} className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">M+</button>
        <button onClick={handleClear} className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">C</button>

        <button onClick={() => handleNumber('7')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">7</button>
        <button onClick={() => handleNumber('8')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">8</button>
        <button onClick={() => handleNumber('9')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">9</button>
        <button onClick={() => handleOperator('/')} className="bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600">÷</button>

        <button onClick={() => handleNumber('4')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">4</button>
        <button onClick={() => handleNumber('5')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">5</button>
        <button onClick={() => handleNumber('6')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">6</button>
        <button onClick={() => handleOperator('*')} className="bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600">×</button>

        <button onClick={() => handleNumber('1')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">1</button>
        <button onClick={() => handleNumber('2')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">2</button>
        <button onClick={() => handleNumber('3')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">3</button>
        <button onClick={() => handleOperator('-')} className="bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600">−</button>

        <button onClick={() => handleNumber('0')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">0</button>
        <button onClick={() => handleNumber('.')} className="bg-gray-200 p-3 rounded hover:bg-gray-300">.</button>
        <button onClick={handleEquals} className="bg-green-500 text-white p-3 rounded hover:bg-green-600">=</button>
        <button onClick={() => handleOperator('+')} className="bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600">+</button>

        <button onClick={handleSquareRoot} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 text-sm">√</button>
        <button onClick={handleSquare} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 text-sm">x²</button>
        <button onClick={handleReciprocal} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 text-sm">1/x</button>
        <button onClick={handlePercentage} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 text-sm">%</button>
      </div>

      {history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="text-sm text-gray-600 mb-1">{item}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED PERCENTAGE CALCULATOR
// ============================================================================
export function AdvancedPercentageCalculator() {
  const [value, setValue] = useState('');
  const [percent, setPercent] = useState('');
  const [total, setTotal] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const val = parseFloat(value) || 0;
    const pct = parseFloat(percent) || 0;
    const tot = parseFloat(total) || 0;

    setResults({
      percentOf: (val * pct / 100).toFixed(2),
      percentageValue: ((val / tot) * 100).toFixed(2),
      percentageIncrease: (val * (1 + pct / 100)).toFixed(2),
      percentageDecrease: (val * (1 - pct / 100)).toFixed(2),
      percentChange: (((tot - val) / val) * 100).toFixed(2),
      reversePercentage: (val / (pct / 100)).toFixed(2),
      markup: ((val * pct) / 100).toFixed(2),
      margin: ((pct / (100 + pct)) * 100).toFixed(2),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Percentage Calculator</h2>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter percentage"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total/Second Value</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter total"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-200"
      >
        Calculate All Percentage Operations
      </button>

      {results && (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">{percent}% of {value}</h3>
            <p className="text-2xl font-bold text-blue-600">{results.percentOf}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">{value} is what % of {total}?</h3>
            <p className="text-2xl font-bold text-green-600">{results.percentageValue}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">{value} + {percent}%</h3>
            <p className="text-2xl font-bold text-purple-600">{results.percentageIncrease}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">{value} - {percent}%</h3>
            <p className="text-2xl font-bold text-red-600">{results.percentageDecrease}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">% Change from {value} to {total}</h3>
            <p className="text-2xl font-bold text-yellow-600">{results.percentChange}%</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-2">Reverse: {value} is {percent}% of?</h3>
            <p className="text-2xl font-bold text-indigo-600">{results.reversePercentage}</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h3 className="font-semibold text-pink-800 mb-2">Markup ({percent}% on {value})</h3>
            <p className="text-2xl font-bold text-pink-600">{results.markup}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="font-semibold text-teal-800 mb-2">Margin ({percent}%)</h3>
            <p className="text-2xl font-bold text-teal-600">{results.margin}%</p>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Formulas Used</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Percentage of Value: (Value × Percentage) / 100</li>
          <li>• Value as % of Total: (Value / Total) × 100</li>
          <li>• Percentage Increase: Value × (1 + Percentage/100)</li>
          <li>• Percentage Decrease: Value × (1 - Percentage/100)</li>
          <li>• Percentage Change: ((New - Old) / Old) × 100</li>
          <li>• Reverse Percentage: Value / (Percentage / 100)</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED FRACTION CALCULATOR
// ============================================================================
export function AdvancedFractionCalculator() {
  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState<any>(null);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const simplifyFraction = (num: number, den: number) => {
    const divisor = gcd(Math.abs(num), Math.abs(den));
    return {
      numerator: num / divisor,
      denominator: den / divisor,
      decimal: num / den,
      mixed: Math.floor(num / den) !== 0 
        ? `${Math.floor(num / den)} ${Math.abs(num % den)}/${den / divisor}`
        : null
    };
  };

  const calculate = () => {
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    let resultNum = 0;
    let resultDen = 0;

    switch (operation) {
      case 'add':
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        break;
      case 'subtract':
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        break;
      case 'multiply':
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case 'divide':
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
    }

    const simplified = simplifyFraction(resultNum, resultDen);
    setResult({
      ...simplified,
      original: `${resultNum}/${resultDen}`,
      input1: simplifyFraction(n1, d1),
      input2: simplifyFraction(n2, d2),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Fraction Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">First Fraction</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Numerator"
            />
            <span className="text-2xl">/</span>
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Denominator"
            />
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Second Fraction</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Numerator"
            />
            <span className="text-2xl">/</span>
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Denominator"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setOperation('add')}
            className={`py-2 rounded ${operation === 'add' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Add (+)
          </button>
          <button
            onClick={() => setOperation('subtract')}
            className={`py-2 rounded ${operation === 'subtract' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Subtract (−)
          </button>
          <button
            onClick={() => setOperation('multiply')}
            className={`py-2 rounded ${operation === 'multiply' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Multiply (×)
          </button>
          <button
            onClick={() => setOperation('divide')}
            className={`py-2 rounded ${operation === 'divide' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Divide (÷)
          </button>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Calculate Fraction
      </button>

      {result && (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Result</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Original Result:</span>
                <span className="text-xl font-semibold">{result.original}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Simplified:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {result.numerator}/{result.denominator}
                </span>
              </div>
              {result.mixed && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mixed Number:</span>
                  <span className="text-xl font-semibold text-purple-600">{result.mixed}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Decimal:</span>
                <span className="text-xl font-semibold text-green-600">{result.decimal.toFixed(6)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">First Fraction Simplified</h4>
              <p className="text-lg">{result.input1.numerator}/{result.input1.denominator}</p>
              <p className="text-sm text-gray-600">Decimal: {result.input1.decimal.toFixed(4)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Second Fraction Simplified</h4>
              <p className="text-lg">{result.input2.numerator}/{result.input2.denominator}</p>
              <p className="text-sm text-gray-600">Decimal: {result.input2.decimal.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED DECIMAL CALCULATOR
// ============================================================================
export function AdvancedDecimalCalculator() {
  const [decimal1, setDecimal1] = useState('');
  const [decimal2, setDecimal2] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const d1 = parseFloat(decimal1) || 0;
    const d2 = parseFloat(decimal2) || 0;

    setResults({
      addition: (d1 + d2).toFixed(10),
      subtraction: (d1 - d2).toFixed(10),
      multiplication: (d1 * d2).toFixed(10),
      division: d2 !== 0 ? (d1 / d2).toFixed(10) : 'Cannot divide by zero',
      power: Math.pow(d1, d2).toFixed(10),
      modulo: d2 !== 0 ? (d1 % d2).toFixed(10) : 'Cannot modulo by zero',
      average: ((d1 + d2) / 2).toFixed(10),
      ratio: d2 !== 0 ? `${(d1 / d2).toFixed(4)} : 1` : 'N/A',
      percentage: ((d1 / d2) * 100).toFixed(4) + '%',
      reciprocal1: d1 !== 0 ? (1 / d1).toFixed(10) : 'Undefined',
      reciprocal2: d2 !== 0 ? (1 / d2).toFixed(10) : 'Undefined',
      sqrt1: Math.sqrt(Math.abs(d1)).toFixed(10),
      sqrt2: Math.sqrt(Math.abs(d2)).toFixed(10),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Decimal Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Decimal Number</label>
          <input
            type="number"
            step="any"
            value={decimal1}
            onChange={(e) => setDecimal1(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter first decimal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Second Decimal Number</label>
          <input
            type="number"
            step="any"
            value={decimal2}
            onChange={(e) => setDecimal2(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter second decimal"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Calculate All Operations
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">Results</h3>
          
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">Addition</p>
              <p className="text-lg font-bold text-blue-600">{results.addition}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600">Subtraction</p>
              <p className="text-lg font-bold text-green-600">{results.subtraction}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-gray-600">Multiplication</p>
              <p className="text-lg font-bold text-purple-600">{results.multiplication}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-gray-600">Division</p>
              <p className="text-lg font-bold text-red-600">{results.division}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-gray-600">Power (d1^d2)</p>
              <p className="text-lg font-bold text-yellow-600">{results.power}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded">
              <p className="text-sm text-gray-600">Modulo</p>
              <p className="text-lg font-bold text-indigo-600">{results.modulo}</p>
            </div>
            <div className="bg-pink-50 p-3 rounded">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-lg font-bold text-pink-600">{results.average}</p>
            </div>
            <div className="bg-teal-50 p-3 rounded">
              <p className="text-sm text-gray-600">Ratio</p>
              <p className="text-lg font-bold text-teal-600">{results.ratio}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-lg font-bold text-orange-600">{results.percentage}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-800">First Number Properties</h4>
              <p>Reciprocal: <span className="font-bold">{results.reciprocal1}</span></p>
              <p>Square Root: <span className="font-bold">{results.sqrt1}</span></p>
            </div>
            <div className="border-2 border-green-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-800">Second Number Properties</h4>
              <p>Reciprocal: <span className="font-bold">{results.reciprocal2}</span></p>
              <p>Square Root: <span className="font-bold">{results.sqrt2}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
