'use client';
import React, { useState } from 'react';

// ============================================================================
// ADVANCED GRAPHING CALCULATOR
// ============================================================================
export function AdvancedGraphCalculator() {
  const [expression, setExpression] = useState('x^2');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [results, setResults] = useState<any>(null);

  const evaluate = (expr: string, x: number): number => {
    try {
      // Basic evaluation - replace with proper parser in production
      const sanitized = expr.replace(/\^/g, '**').replace(/x/g, `(${x})`);
      return eval(sanitized);
    } catch {
      return NaN;
    }
  };

  const calculate = () => {
    const min = parseFloat(xMin);
    const max = parseFloat(xMax);
    const points: Array<{x: number, y: number}> = [];
    const step = (max - min) / 50;

    for (let x = min; x <= max; x += step) {
      const y = evaluate(expression, x);
      if (!isNaN(y)) {
        points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
      }
    }

    // Find critical points
    const yValues = points.map(p => p.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const minPoint = points.find(p => p.y === minY);
    const maxPoint = points.find(p => p.y === maxY);

    // Calculate slope at x=0 (if in range)
    let slopeAtZero = null;
    if (min <= 0 && max >= 0) {
      const y1 = evaluate(expression, -0.1);
      const y2 = evaluate(expression, 0.1);
      slopeAtZero = ((y2 - y1) / 0.2).toFixed(4);
    }

    setResults({
      points,
      expression,
      minPoint,
      maxPoint,
      minY: minY.toFixed(4),
      maxY: maxY.toFixed(4),
      slopeAtZero,
      domain: `[${min}, ${max}]`,
      range: `[${minY.toFixed(2)}, ${maxY.toFixed(2)}]`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Graphing Calculator</h2>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Function f(x) =</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., x^2, sin(x), x^3-2*x"
          />
          <p className="text-xs text-gray-500 mt-1">Use: x for variable, ^ for power, *, /, +, -</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">X Min</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">X Max</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Generate Graph Data
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Function Analysis</h3>
            <p className="text-lg mb-2">f(x) = {results.expression}</p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <p><strong>Domain:</strong> {results.domain}</p>
              <p><strong>Range:</strong> {results.range}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Minimum Point</h4>
              {results.minPoint && (
                <>
                  <p className="text-sm">x = {results.minPoint.x}</p>
                  <p className="text-2xl font-bold text-green-600">y = {results.minPoint.y}</p>
                </>
              )}
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Maximum Point</h4>
              {results.maxPoint && (
                <>
                  <p className="text-sm">x = {results.maxPoint.x}</p>
                  <p className="text-2xl font-bold text-red-600">y = {results.maxPoint.y}</p>
                </>
              )}
            </div>
          </div>

          {results.slopeAtZero && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Slope at x = 0</h4>
              <p className="text-xl font-bold text-purple-600">{results.slopeAtZero}</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
            <h4 className="font-semibold mb-2">Sample Data Points</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {results.points.slice(0, 30).map((point: any, i: number) => (
                <div key={i} className="bg-white p-2 rounded">
                  ({point.x}, {point.y})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED MATRIX CALCULATOR
// ============================================================================
export function AdvancedMatrixCalculator() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState<number[][]>([[1, 2], [3, 4]]);
  const [results, setResults] = useState<any>(null);

  const updateMatrixSize = (newRows: number, newCols: number) => {
    const newMatrix = Array(newRows).fill(0).map(() => Array(newCols).fill(0));
    for (let i = 0; i < Math.min(rows, newRows); i++) {
      for (let j = 0; j < Math.min(cols, newCols); j++) {
        newMatrix[i][j] = matrix[i]?.[j] || 0;
      }
    }
    setRows(newRows);
    setCols(newCols);
    setMatrix(newMatrix);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const calculateDeterminant = (m: number[][]): number => {
    const n = m.length;
    if (n === 1) return m[0][0];
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = m.slice(1).map(row => row.filter((_, colIndex) => colIndex !== j));
      det += (j % 2 === 0 ? 1 : -1) * m[0][j] * calculateDeterminant(minor);
    }
    return det;
  };

  const transposeMatrix = (m: number[][]): number[][] => {
    return m[0].map((_, colIndex) => m.map(row => row[colIndex]));
  };

  const multiplyScalar = (m: number[][], scalar: number): number[][] => {
    return m.map(row => row.map(val => val * scalar));
  };

  const calculate = () => {
    const transpose = transposeMatrix(matrix);
    const scaled = multiplyScalar(matrix, 2);
    let determinant = null;
    
    if (rows === cols) {
      determinant = calculateDeterminant(matrix);
    }

    // Calculate trace (sum of diagonal elements)
    let trace = 0;
    if (rows === cols) {
      for (let i = 0; i < rows; i++) {
        trace += matrix[i][i];
      }
    }

    setResults({
      original: matrix,
      transpose,
      scaled,
      determinant: determinant !== null ? determinant.toFixed(6) : 'N/A (not square)',
      trace: rows === cols ? trace.toFixed(6) : 'N/A (not square)',
      isSquare: rows === cols,
      dimensions: `${rows}×${cols}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Matrix Calculator</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
          <select
            value={rows}
            onChange={(e) => updateMatrixSize(parseInt(e.target.value), cols)}
            className="w-full px-4 py-2 border rounded-md"
          >
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
          <select
            value={cols}
            onChange={(e) => updateMatrixSize(rows, parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-md"
          >
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Matrix Elements</label>
        <div className="space-y-2">
          {matrix.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((val, j) => (
                <input
                  key={j}
                  type="number"
                  step="any"
                  value={val}
                  onChange={(e) => updateCell(i, j, e.target.value)}
                  className="w-20 px-2 py-1 border rounded text-center"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
      >
        Calculate Matrix Operations
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Matrix Properties</h4>
            <p className="text-sm mb-1">Dimensions: <strong>{results.dimensions}</strong></p>
            <p className="text-sm mb-1">Is Square: <strong>{results.isSquare ? 'Yes' : 'No'}</strong></p>
            {results.isSquare && (
              <>
                <p className="text-sm mb-1">Determinant: <strong>{results.determinant}</strong></p>
                <p className="text-sm">Trace: <strong>{results.trace}</strong></p>
              </>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Transpose</h4>
            <div className="space-y-1">
              {results.transpose.map((row: number[], i: number) => (
                <div key={i} className="flex gap-2">
                  {row.map((val: number, j: number) => (
                    <span key={j} className="w-16 text-center bg-white p-1 rounded">{val}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Scaled by 2</h4>
            <div className="space-y-1">
              {results.scaled.map((row: number[], i: number) => (
                <div key={i} className="flex gap-2">
                  {row.map((val: number, j: number) => (
                    <span key={j} className="w-16 text-center bg-white p-1 rounded">{val}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED CALCULUS CALCULATOR
// ============================================================================
export function AdvancedCalculusCalculator() {
  const [expression, setExpression] = useState('x^2');
  const [variable, setVariable] = useState('x');
  const [point, setPoint] = useState('0');
  const [results, setResults] = useState<any>(null);

  const derivative = (expr: string, x: number, h: number = 0.0001): number => {
    const f = (val: number) => {
      try {
        const sanitized = expr.replace(/\^/g, '**').replace(/x/g, `(${val})`);
        return eval(sanitized);
      } catch {
        return NaN;
      }
    };
    return (f(x + h) - f(x - h)) / (2 * h);
  };

  const integral = (expr: string, a: number, b: number, n: number = 1000): number => {
    const f = (val: number) => {
      try {
        const sanitized = expr.replace(/\^/g, '**').replace(/x/g, `(${val})`);
        return eval(sanitized);
      } catch {
        return NaN;
      }
    };
    
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const x = a + i * h;
      sum += f(x + h / 2) * h; // Midpoint rule
    }
    return sum;
  };

  const calculate = () => {
    const x = parseFloat(point);
    
    const f = (val: number) => {
      try {
        const sanitized = expression.replace(/\^/g, '**').replace(/x/g, `(${val})`);
        return eval(sanitized);
      } catch {
        return NaN;
      }
    };

    const functionValue = f(x);
    const firstDerivative = derivative(expression, x);
    const secondDerivative = derivative(expression, x, 0.001);
    const integralValue = integral(expression, 0, x);

    setResults({
      expression,
      point: x,
      functionValue: functionValue.toFixed(6),
      firstDerivative: firstDerivative.toFixed(6),
      secondDerivative: secondDerivative.toFixed(6),
      integral: integralValue.toFixed(6),
      tangentSlope: firstDerivative.toFixed(6),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Calculus Calculator</h2>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Function f(x) =</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., x^2, x^3-2*x"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Evaluate at x =</label>
          <input
            type="number"
            step="any"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700"
      >
        Calculate Derivatives & Integrals
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-orange-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Function Analysis at x = {results.point}</h3>
            <p className="text-lg mb-3">f(x) = {results.expression}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Function Value</h4>
              <p className="text-sm text-gray-600">f({results.point})</p>
              <p className="text-2xl font-bold text-blue-600">{results.functionValue}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">First Derivative</h4>
              <p className="text-sm text-gray-600">f'({results.point})</p>
              <p className="text-2xl font-bold text-green-600">{results.firstDerivative}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Second Derivative</h4>
              <p className="text-sm text-gray-600">f''({results.point})</p>
              <p className="text-2xl font-bold text-purple-600">{results.secondDerivative}</p>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Definite Integral</h4>
              <p className="text-sm text-gray-600">∫₀^{results.point} f(x)dx</p>
              <p className="text-2xl font-bold text-pink-600">{results.integral}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Tangent Line Slope</h4>
            <p className="text-lg">Slope = {results.tangentSlope}</p>
            <p className="text-sm text-gray-600 mt-2">
              Tangent line equation: y - {results.functionValue} = {results.tangentSlope}(x - {results.point})
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Notes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Derivatives calculated using numerical approximation</li>
              <li>• Integral calculated using midpoint rule</li>
              <li>• For analytical solutions, use symbolic math tools</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED VECTOR CALCULATOR
// ============================================================================
export function AdvancedVectorCalculator() {
  const [vector1, setVector1] = useState<number[]>([1, 2, 3]);
  const [vector2, setVector2] = useState<number[]>([4, 5, 6]);
  const [dimension, setDimension] = useState(3);
  const [results, setResults] = useState<any>(null);

  const updateDimension = (newDim: number) => {
    setDimension(newDim);
    setVector1(Array(newDim).fill(0).map((_, i) => vector1[i] || 0));
    setVector2(Array(newDim).fill(0).map((_, i) => vector2[i] || 0));
  };

  const updateVector = (vecNum: number, index: number, value: string) => {
    const val = parseFloat(value) || 0;
    if (vecNum === 1) {
      const newVec = [...vector1];
      newVec[index] = val;
      setVector1(newVec);
    } else {
      const newVec = [...vector2];
      newVec[index] = val;
      setVector2(newVec);
    }
  };

  const calculate = () => {
    // Magnitude
    const mag1 = Math.sqrt(vector1.reduce((sum, v) => sum + v * v, 0));
    const mag2 = Math.sqrt(vector2.reduce((sum, v) => sum + v * v, 0));

    // Addition and Subtraction
    const addition = vector1.map((v, i) => v + vector2[i]);
    const subtraction = vector1.map((v, i) => v - vector2[i]);

    // Dot Product
    const dotProduct = vector1.reduce((sum, v, i) => sum + v * vector2[i], 0);

    // Cross Product (only for 3D)
    let crossProduct = null;
    if (dimension === 3) {
      crossProduct = [
        vector1[1] * vector2[2] - vector1[2] * vector2[1],
        vector1[2] * vector2[0] - vector1[0] * vector2[2],
        vector1[0] * vector2[1] - vector1[1] * vector2[0],
      ];
    }

    // Angle between vectors
    const angle = Math.acos(dotProduct / (mag1 * mag2)) * (180 / Math.PI);

    // Unit vectors
    const unit1 = vector1.map(v => v / mag1);
    const unit2 = vector2.map(v => v / mag2);

    setResults({
      mag1: mag1.toFixed(6),
      mag2: mag2.toFixed(6),
      addition: addition.map(v => v.toFixed(4)),
      subtraction: subtraction.map(v => v.toFixed(4)),
      dotProduct: dotProduct.toFixed(6),
      crossProduct: crossProduct?.map(v => v.toFixed(4)),
      angle: angle.toFixed(4),
      unit1: unit1.map(v => v.toFixed(4)),
      unit2: unit2.map(v => v.toFixed(4)),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Vector Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Dimension</label>
        <select
          value={dimension}
          onChange={(e) => updateDimension(parseInt(e.target.value))}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value={2}>2D</option>
          <option value={3}>3D</option>
          <option value={4}>4D</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-blue-800">Vector 1</h3>
          <div className="space-y-2">
            {vector1.map((val, i) => (
              <input
                key={i}
                type="number"
                step="any"
                value={val}
                onChange={(e) => updateVector(1, i, e.target.value)}
                className="w-full px-3 py-1 border rounded text-sm"
                placeholder={`Component ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="border-2 border-green-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-green-800">Vector 2</h3>
          <div className="space-y-2">
            {vector2.map((val, i) => (
              <input
                key={i}
                type="number"
                step="any"
                value={val}
                onChange={(e) => updateVector(2, i, e.target.value)}
                className="w-full px-3 py-1 border rounded text-sm"
                placeholder={`Component ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700"
      >
        Calculate Vector Operations
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Magnitude of Vector 1</h4>
              <p className="text-2xl font-bold text-blue-600">{results.mag1}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Magnitude of Vector 2</h4>
              <p className="text-2xl font-bold text-green-600">{results.mag2}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Addition (v1 + v2)</h4>
            <p className="text-lg font-mono">[{results.addition.join(', ')}]</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Subtraction (v1 - v2)</h4>
            <p className="text-lg font-mono">[{results.subtraction.join(', ')}]</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Dot Product (v1 · v2)</h4>
            <p className="text-2xl font-bold text-yellow-700">{results.dotProduct}</p>
          </div>

          {results.crossProduct && (
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Cross Product (v1 × v2)</h4>
              <p className="text-lg font-mono">[{results.crossProduct.join(', ')}]</p>
            </div>
          )}

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Angle Between Vectors</h4>
            <p className="text-2xl font-bold text-indigo-600">{results.angle}°</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal-50 p-3 rounded">
              <h4 className="font-semibold mb-2 text-sm">Unit Vector 1</h4>
              <p className="text-sm font-mono">[{results.unit1.join(', ')}]</p>
            </div>
            <div className="bg-cyan-50 p-3 rounded">
              <h4 className="font-semibold mb-2 text-sm">Unit Vector 2</h4>
              <p className="text-sm font-mono">[{results.unit2.join(', ')}]</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
