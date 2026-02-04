'use client';
import React, { useState } from 'react';

// ============================================================================
// ADVANCED QUADRATIC FORMULA CALCULATOR
// ============================================================================
export function AdvancedQuadraticCalculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const aVal = parseFloat(a) || 0;
    const bVal = parseFloat(b) || 0;
    const cVal = parseFloat(c) || 0;

    if (aVal === 0) {
      alert('Coefficient "a" cannot be zero in a quadratic equation');
      return;
    }

    const discriminant = bVal * bVal - 4 * aVal * cVal;
    const vertex_x = -bVal / (2 * aVal);
    const vertex_y = aVal * vertex_x * vertex_x + bVal * vertex_x + cVal;
    const axis_of_symmetry = vertex_x;
    const y_intercept = cVal;
    const x_intercepts = [];

    let root1, root2, rootType;

    if (discriminant > 0) {
      root1 = (-bVal + Math.sqrt(discriminant)) / (2 * aVal);
      root2 = (-bVal - Math.sqrt(discriminant)) / (2 * aVal);
      rootType = 'Two distinct real roots';
      x_intercepts.push(root1, root2);
    } else if (discriminant === 0) {
      root1 = -bVal / (2 * aVal);
      root2 = root1;
      rootType = 'One repeated real root';
      x_intercepts.push(root1);
    } else {
      const realPart = -bVal / (2 * aVal);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * aVal);
      root1 = `${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i`;
      root2 = `${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`;
      rootType = 'Two complex conjugate roots';
    }

    const direction = aVal > 0 ? 'Upward (Minimum at vertex)' : 'Downward (Maximum at vertex)';
    const domain = 'All real numbers (-∞, ∞)';
    const range = aVal > 0 
      ? `[${vertex_y.toFixed(4)}, ∞)` 
      : `(-∞, ${vertex_y.toFixed(4)}]`;

    setResults({
      discriminant: discriminant.toFixed(4),
      root1,
      root2,
      rootType,
      vertex: `(${vertex_x.toFixed(4)}, ${vertex_y.toFixed(4)})`,
      vertex_x: vertex_x.toFixed(4),
      vertex_y: vertex_y.toFixed(4),
      axis_of_symmetry: axis_of_symmetry.toFixed(4),
      y_intercept: y_intercept.toFixed(4),
      x_intercepts: x_intercepts.map(x => x.toFixed(4)).join(', ') || 'None (Complex roots)',
      direction,
      domain,
      range,
      equation: `${aVal}x² + ${bVal}x + ${cVal} = 0`,
      standardForm: `y = ${aVal}x² + ${bVal}x + ${cVal}`,
      vertexForm: `y = ${aVal}(x - ${(-vertex_x).toFixed(4)})² + ${vertex_y.toFixed(4)}`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Quadratic Formula Calculator</h2>
      <p className="text-gray-600 mb-4">Solve equations in the form: ax² + bx + c = 0</p>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient a</label>
          <input
            type="number"
            step="any"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter a"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient b</label>
          <input
            type="number"
            step="any"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter b"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient c</label>
          <input
            type="number"
            step="any"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter c"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-200"
      >
        Solve Quadratic Equation
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Equation Forms</h3>
            <p className="text-lg mb-2"><strong>Standard Form:</strong> {results.standardForm}</p>
            <p className="text-lg mb-2"><strong>Equation:</strong> {results.equation}</p>
            <p className="text-lg"><strong>Vertex Form:</strong> {results.vertexForm}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Discriminant (Δ = b² - 4ac)</h4>
              <p className="text-2xl font-bold text-green-600">{results.discriminant}</p>
              <p className="text-sm text-gray-600 mt-1">{results.rootType}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Vertex</h4>
              <p className="text-2xl font-bold text-purple-600">{results.vertex}</p>
              <p className="text-sm text-gray-600 mt-1">{results.direction}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-3">Roots / Solutions</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Root 1 (x₁)</p>
                <p className="text-xl font-bold text-yellow-700">{results.root1}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Root 2 (x₂)</p>
                <p className="text-xl font-bold text-yellow-700">{results.root2}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">Axis of Symmetry</p>
              <p className="text-lg font-bold text-blue-600">x = {results.axis_of_symmetry}</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-sm text-gray-600">Y-Intercept</p>
              <p className="text-lg font-bold text-red-600">{results.y_intercept}</p>
            </div>
            <div className="bg-teal-50 p-3 rounded">
              <p className="text-sm text-gray-600">X-Intercepts</p>
              <p className="text-lg font-bold text-teal-600">{results.x_intercepts}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Function Properties</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <p><strong>Domain:</strong> {results.domain}</p>
              <p><strong>Range:</strong> {results.range}</p>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Formulas Used</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Discriminant: Δ = b² - 4ac</li>
              <li>• Roots: x = (-b ± √Δ) / 2a</li>
              <li>• Vertex: (-b/2a, f(-b/2a))</li>
              <li>• Axis of Symmetry: x = -b/2a</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED LINEAR EQUATION SOLVER
// ============================================================================
export function AdvancedLinearEquationSolver() {
  const [equations, setEquations] = useState<number>(2);
  const [coefficients, setCoefficients] = useState<number[][]>([[1, 1], [1, -1]]);
  const [constants, setConstants] = useState<number[]>([5, 1]);
  const [solution, setSolution] = useState<any>(null);

  const updateCoefficient = (row: number, col: number, value: string) => {
    const newCoeffs = [...coefficients];
    newCoeffs[row][col] = parseFloat(value) || 0;
    setCoefficients(newCoeffs);
  };

  const updateConstant = (row: number, value: string) => {
    const newConstants = [...constants];
    newConstants[row] = parseFloat(value) || 0;
    setConstants(newConstants);
  };

  const solve2x2 = () => {
    const [[a1, b1], [a2, b2]] = coefficients;
    const [c1, c2] = constants;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) {
      setSolution({ type: 'no-unique', message: 'No unique solution (lines are parallel or coincident)' });
      return;
    }

    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;

    setSolution({
      type: 'unique',
      x: x.toFixed(6),
      y: y.toFixed(6),
      determinant: determinant.toFixed(6),
      equation1: `${a1}x + ${b1}y = ${c1}`,
      equation2: `${a2}x + ${b2}y = ${c2}`,
      slopeIntercept1: `y = ${(-a1/b1).toFixed(4)}x + ${(c1/b1).toFixed(4)}`,
      slopeIntercept2: `y = ${(-a2/b2).toFixed(4)}x + ${(c2/b2).toFixed(4)}`,
    });
  };

  const solve3x3 = () => {
    // Implementation for 3x3 system using Cramer's rule
    setSolution({ type: 'info', message: '3x3 solver - upgrade to full implementation' });
  };

  const handleSolve = () => {
    if (equations === 2) solve2x2();
    else solve3x3();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Linear Equation Solver</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">System Size</label>
        <select
          value={equations}
          onChange={(e) => setEquations(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value={2}>2x2 System (2 equations, 2 variables)</option>
          <option value={3}>3x3 System (3 equations, 3 variables)</option>
        </select>
      </div>

      {equations === 2 && (
        <div className="space-y-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Equation 1: a₁x + b₁y = c₁</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={coefficients[0][0]}
                onChange={(e) => updateCoefficient(0, 0, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
                placeholder="a₁"
              />
              <span>x +</span>
              <input
                type="number"
                step="any"
                value={coefficients[0][1]}
                onChange={(e) => updateCoefficient(0, 1, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
                placeholder="b₁"
              />
              <span>y =</span>
              <input
                type="number"
                step="any"
                value={constants[0]}
                onChange={(e) => updateConstant(0, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
                placeholder="c₁"
              />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Equation 2: a₂x + b₂y = c₂</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={coefficients[1][0]}
                onChange={(e) => updateCoefficient(1, 0, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
                placeholder="a₂"
              />
              <span>x +</span>
              <input
                type="number"
                step="any"
                value={coefficients[1][1]}
                onChange={(e) => updateCoefficient(1, 1, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
                placeholder="b₂"
              />
              <span>y =</span>
              <input
                type="number"
                step="any"
                value={constants[1]}
                onChange={(e) => updateConstant(1, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
                placeholder="c₂"
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSolve}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Solve System of Equations
      </button>

      {solution && solution.type === 'unique' && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Solution</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Value of x</p>
                <p className="text-3xl font-bold text-green-600">{solution.x}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Value of y</p>
                <p className="text-3xl font-bold text-teal-600">{solution.y}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">System Details</h4>
            <p className="mb-1"><strong>Equation 1:</strong> {solution.equation1}</p>
            <p className="mb-1"><strong>Equation 2:</strong> {solution.equation2}</p>
            <p className="mt-3"><strong>Determinant:</strong> {solution.determinant}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Slope-Intercept Forms</h4>
            <p className="mb-1"><strong>Line 1:</strong> {solution.slopeIntercept1}</p>
            <p><strong>Line 2:</strong> {solution.slopeIntercept2}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Method Used</h4>
            <p className="text-sm text-gray-700">Cramer's Rule with matrix determinants</p>
            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>• Det = a₁b₂ - a₂b₁</li>
              <li>• x = (c₁b₂ - c₂b₁) / Det</li>
              <li>• y = (a₁c₂ - a₂c₁) / Det</li>
            </ul>
          </div>
        </div>
      )}

      {solution && solution.type === 'no-unique' && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">No Unique Solution</h3>
          <p className="text-gray-700">{solution.message}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED POLYNOMIAL CALCULATOR
// ============================================================================
export function AdvancedPolynomialCalculator() {
  const [degree, setDegree] = useState(2);
  const [coefficients, setCoefficients] = useState<number[]>([1, 0, -1]);
  const [xValue, setXValue] = useState('');
  const [results, setResults] = useState<any>(null);

  const updateCoefficient = (index: number, value: string) => {
    const newCoeffs = [...coefficients];
    newCoeffs[index] = parseFloat(value) || 0;
    setCoefficients(newCoeffs);
  };

  const updateDegree = (newDegree: number) => {
    setDegree(newDegree);
    const newCoeffs = Array(newDegree + 1).fill(0);
    coefficients.forEach((c, i) => {
      if (i < newCoeffs.length) newCoeffs[i] = c;
    });
    setCoefficients(newCoeffs);
  };

  const evaluate = () => {
    const x = parseFloat(xValue) || 0;
    let result = 0;
    let derivative = 0;
    let secondDerivative = 0;

    // Polynomial evaluation
    for (let i = 0; i < coefficients.length; i++) {
      result += coefficients[i] * Math.pow(x, degree - i);
    }

    // First derivative
    for (let i = 0; i < coefficients.length - 1; i++) {
      const power = degree - i;
      derivative += coefficients[i] * power * Math.pow(x, power - 1);
    }

    // Second derivative
    for (let i = 0; i < coefficients.length - 2; i++) {
      const power = degree - i;
      secondDerivative += coefficients[i] * power * (power - 1) * Math.pow(x, power - 2);
    }

    // Build polynomial string
    let polyString = '';
    for (let i = 0; i < coefficients.length; i++) {
      const coeff = coefficients[i];
      const power = degree - i;
      if (coeff !== 0) {
        if (polyString && coeff > 0) polyString += ' + ';
        if (coeff < 0) polyString += ' - ';
        polyString += `${Math.abs(coeff)}`;
        if (power > 0) polyString += `x`;
        if (power > 1) polyString += `^${power}`;
      }
    }

    setResults({
      value: result.toFixed(6),
      derivative: derivative.toFixed(6),
      secondDerivative: secondDerivative.toFixed(6),
      polynomial: polyString || '0',
      xValue: x,
      leadingCoefficient: coefficients[0],
      constantTerm: coefficients[coefficients.length - 1],
      degree: degree,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Polynomial Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Polynomial Degree</label>
        <select
          value={degree}
          onChange={(e) => updateDegree(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          {[1, 2, 3, 4, 5, 6].map(d => (
            <option key={d} value={d}>Degree {d}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Coefficients (from highest to lowest degree)</label>
        <div className="grid grid-cols-4 gap-2">
          {coefficients.map((coeff, index) => (
            <div key={index}>
              <label className="text-xs text-gray-500">x^{degree - index}</label>
              <input
                type="number"
                step="any"
                value={coeff}
                onChange={(e) => updateCoefficient(index, e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Evaluate at x =</label>
        <input
          type="number"
          step="any"
          value={xValue}
          onChange={(e) => setXValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Enter x value"
        />
      </div>

      <button
        onClick={evaluate}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Evaluate Polynomial
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Polynomial</h4>
            <p className="text-lg font-mono">{results.polynomial}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">P({results.xValue})</p>
              <p className="text-2xl font-bold text-blue-600">{results.value}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">P'({results.xValue}) - First Derivative</p>
              <p className="text-2xl font-bold text-green-600">{results.derivative}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">P''({results.xValue}) - Second Derivative</p>
            <p className="text-2xl font-bold text-purple-600">{results.secondDerivative}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Polynomial Properties</h4>
            <div className="grid md:grid-cols-3 gap-2 text-sm">
              <p><strong>Degree:</strong> {results.degree}</p>
              <p><strong>Leading Coefficient:</strong> {results.leadingCoefficient}</p>
              <p><strong>Constant Term:</strong> {results.constantTerm}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED EXPONENT & LOGARITHM CALCULATOR
// ============================================================================
export function AdvancedExponentCalculator() {
  const [base, setBase] = useState('');
  const [exponent, setExponent] = useState('');
  const [logValue, setLogValue] = useState('');
  const [logBase, setLogBase] = useState('10');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const b = parseFloat(base) || 0;
    const exp = parseFloat(exponent) || 0;
    const lv = parseFloat(logValue) || 1;
    const lb = parseFloat(logBase) || 10;

    setResults({
      power: Math.pow(b, exp).toFixed(8),
      squareRoot: Math.sqrt(b).toFixed(8),
      cubeRoot: Math.pow(b, 1/3).toFixed(8),
      nthRoot: Math.pow(b, 1/exp).toFixed(8),
      naturalLog: Math.log(lv).toFixed(8),
      log10: Math.log10(lv).toFixed(8),
      log2: Math.log2(lv).toFixed(8),
      logCustomBase: (Math.log(lv) / Math.log(lb)).toFixed(8),
      exponential: Math.exp(exp).toFixed(8),
      powerOf10: Math.pow(10, exp).toFixed(8),
      powerOf2: Math.pow(2, exp).toFixed(8),
      reciprocal: b !== 0 ? (1/b).toFixed(8) : 'Undefined',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Exponent & Logarithm Calculator</h2>
      
      <div className="space-y-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Exponent Operations</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
              <input
                type="number"
                step="any"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exponent</label>
              <input
                type="number"
                step="any"
                value={exponent}
                onChange={(e) => setExponent(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter exponent"
              />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Logarithm Operations</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="number"
                step="any"
                value={logValue}
                onChange={(e) => setLogValue(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Log Base (optional)</label>
              <input
                type="number"
                step="any"
                value={logBase}
                onChange={(e) => setLogBase(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Custom base"
              />
            </div>
          </div>
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
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Exponent Results</h4>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">{base}^{exponent}</p>
                <p className="text-xl font-bold text-purple-600">{results.power}</p>
              </div>
              <div>
                <p className="text-gray-600">√{base}</p>
                <p className="text-xl font-bold text-purple-600">{results.squareRoot}</p>
              </div>
              <div>
                <p className="text-gray-600">∛{base}</p>
                <p className="text-xl font-bold text-purple-600">{results.cubeRoot}</p>
              </div>
              <div>
                <p className="text-gray-600">{exponent}√{base}</p>
                <p className="text-xl font-bold text-purple-600">{results.nthRoot}</p>
              </div>
              <div>
                <p className="text-gray-600">e^{exponent}</p>
                <p className="text-xl font-bold text-purple-600">{results.exponential}</p>
              </div>
              <div>
                <p className="text-gray-600">10^{exponent}</p>
                <p className="text-xl font-bold text-purple-600">{results.powerOf10}</p>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Logarithm Results</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">ln({logValue}) - Natural Log</p>
                <p className="text-xl font-bold text-teal-600">{results.naturalLog}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">log₁₀({logValue})</p>
                <p className="text-xl font-bold text-teal-600">{results.log10}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">log₂({logValue})</p>
                <p className="text-xl font-bold text-teal-600">{results.log2}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">log_{logBase}({logValue})</p>
                <p className="text-xl font-bold text-teal-600">{results.logCustomBase}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Common Formulas</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• a^b = Result of exponentiation</li>
              <li>• log_b(x) = ln(x) / ln(b)</li>
              <li>• ln(x) = Natural logarithm (base e)</li>
              <li>• e^x = Exponential function</li>
              <li>• n√x = x^(1/n)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
