
import React, { useState } from 'react';

// --------------------------------------------------------------------------------
//  BATCH 3: Remainder/Modulo, Series (Sum/Product), Difference
// --------------------------------------------------------------------------------

/**
 * Advanced Remainder & Modulo Calculator
 * Merges functionality to show both Division Remainder and Modular Arithmetic.
 */
export function RemainderModuloCalculator() {
    const [dividend, setDividend] = useState<string>('17');
    const [divisor, setDivisor] = useState<string>('5');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const a = parseFloat(dividend);
        const n = parseFloat(divisor);

        if (isNaN(a) || isNaN(n)) {
            setResult({ error: 'Please enter valid numbers.' });
            return;
        }
        if (n === 0) {
            setResult({ error: 'Divisor cannot be zero.' });
            return;
        }

        const quotient = Math.floor(a / n);
        const remainder = a % n;
        // JS % operator is remainder, but for negative numbers, modulo is often expected to be positive.
        // Let's show both if different.
        const modulo = ((a % n) + n) % n;

        setResult({
            quotient,
            remainder,
            modulo,
            isNegative: a < 0 || n < 0
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dividend (a)</label>
                    <input
                        type="number"
                        value={dividend}
                        onChange={(e) => setDividend(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g. 17"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Divisor (n)</label>
                    <input
                        type="number"
                        value={divisor}
                        onChange={(e) => setDivisor(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g. 5"
                    />
                </div>
            </div>

            <button
                onClick={calculate}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                Calculate Remainder & Modulo
            </button>

            {result && !result.error && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="text-sm text-gray-500">Remainder</div>
                            <div className="text-2xl font-bold text-blue-600">{result.remainder}</div>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="text-sm text-gray-500">Quotient</div>
                            <div className="text-2xl font-bold text-green-600">{result.quotient}</div>
                        </div>
                    </div>

                    {result.isNegative && result.remainder !== result.modulo && (
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm">
                            <strong>Note for Negative Numbers:</strong>
                            <br />
                            Remainder (JS default): {result.remainder}
                            <br />
                            Modulo (Positive equivalent): {result.modulo}
                        </div>
                    )}

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Step-by-Step Breakdown</h4>
                        <div className="bg-white p-3 rounded border text-sm font-mono space-y-2">
                            <p>Formula: Dividend = (Quotient × Divisor) + Remainder</p>
                            <p>{dividend} = ({result.quotient} × {divisor}) + {result.remainder}</p>
                            <hr className="my-2" />
                            <p>1. How many times does {divisor} fit into {dividend}?</p>
                            <p>&nbsp;&nbsp;&nbsp;{dividend} ÷ {divisor} = {parseFloat(dividend) / parseFloat(divisor)}</p>
                            <p>2. Take the integer part (Quotient): <span className="font-bold">{result.quotient}</span></p>
                            <p>3. Calculate the amount covered: {result.quotient} × {divisor} = {result.quotient * parseFloat(divisor)}</p>
                            <p>4. Subtract from Dividend to find Remainder:</p>
                            <p>&nbsp;&nbsp;&nbsp;{dividend} - {result.quotient * parseFloat(divisor)} = <span className="font-bold text-blue-600">{result.remainder}</span></p>
                        </div>
                    </div>
                </div>
            )}
            {result && result.error && (
                <div className="text-red-500 bg-red-50 p-3 rounded">{result.error}</div>
            )}
        </div>
    );
}

// Wrapper for both IDs to point to the same component for now, or we can separate them wrapper-wise
export function RemainderCalculator(props: any) { return <RemainderModuloCalculator {...props} />; }
export function ModuloCalculator(props: any) { return <RemainderModuloCalculator {...props} />; }


/**
 * Advanced Sum of Series Calculator
 * Supports custom list, Arithmetic (AP), and Geometric (GP) series.
 */
export function SumOfSeriesCalculator() {
    const [mode, setMode] = useState<'list' | 'ap' | 'gp'>('list');

    // List Mode
    const [listInput, setListInput] = useState('1, 2, 3, 4, 5');

    // AP/GP formulas
    const [firstTerm, setFirstTerm] = useState('1');
    const [diffRatio, setDiffRatio] = useState('1'); // Common Difference (d) or Ratio (r)
    const [numTerms, setNumTerms] = useState('10');

    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        let sum = 0;
        let terms: number[] = [];
        let steps: JSX.Element[] = [];

        if (mode === 'list') {
            terms = listInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
            if (terms.length === 0) { setResult({ error: 'Invalid list input.' }); return; }
            sum = terms.reduce((acc, val) => acc + val, 0);
            steps.push(<p key="step1">Summing list via direct addition:</p>);
            steps.push(<p key="step2" className="truncate text-gray-500 text-xs mt-1">{terms.join(' + ')}</p>);
        }
        else if (mode === 'ap') {
            const a = parseFloat(firstTerm);
            const d = parseFloat(diffRatio);
            const n = parseFloat(numTerms);
            if (isNaN(a) || isNaN(d) || isNaN(n)) { setResult({ error: 'Invalid AP inputs.' }); return; }

            // Formula: Sn = n/2 * (2a + (n-1)d)
            sum = (n / 2) * (2 * a + (n - 1) * d);
            steps.push(<p key="formula">AP Sum Formula: Sₙ = <sup>n</sup>&frasl;<sub>2</sub> [2a + (n-1)d]</p>);
            steps.push(<p key="sub">Substitute: S<sub>{n}</sub> = ({n}/2) * [2({a}) + ({n}-1){d}]</p>);
            steps.push(<p key="calc1">= {n / 2} * [{2 * a} + {(n - 1) * d}]</p>);
            steps.push(<p key="calc2">= {n / 2} * [{2 * a + (n - 1) * d}]</p>);
        }
        else if (mode === 'gp') {
            const a = parseFloat(firstTerm);
            const r = parseFloat(diffRatio);
            const n = parseFloat(numTerms);
            if (isNaN(a) || isNaN(r) || isNaN(n)) { setResult({ error: 'Invalid GP inputs.' }); return; }

            // Formula: Sn = a(r^n - 1) / (r - 1)  (for r != 1)
            if (r === 1) {
                sum = a * n;
                steps.push(<p key="r1">Since r = 1, Sum = a × n = {a} × {n}</p>);
            } else {
                sum = (a * (Math.pow(r, n) - 1)) / (r - 1);
                steps.push(<p key="formula">GP Sum Formula: Sₙ = a(rⁿ - 1) / (r - 1)</p>);
                steps.push(<p key="sub">Substitute: S<sub>{n}</sub> = {a}({r}<sup>{n}</sup> - 1) / ({r} - 1)</p>);
            }
        }

        setResult({ sum, steps });
    };

    return (
        <div className="space-y-6">
            {/* Mode Tabs */}
            <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                {(['list', 'ap', 'gp'] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => { setMode(m); setResult(null); }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === m ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {m === 'list' && 'Number List'}
                        {m === 'ap' && 'Arithmetic (AP)'}
                        {m === 'gp' && 'Geometric (GP)'}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {mode === 'list' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Numbers (comma-separated)</label>
                        <textarea
                            value={listInput}
                            onChange={(e) => setListInput(e.target.value)}
                            className="w-full p-2 border rounded-md h-24 font-mono text-sm"
                            placeholder="1, 5, 10, 20..."
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Term (a)</label>
                            <input type="number" value={firstTerm} onChange={e => setFirstTerm(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {mode === 'ap' ? 'Common Diff (d)' : 'Common Ratio (r)'}
                            </label>
                            <input type="number" value={diffRatio} onChange={e => setDiffRatio(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Num Terms (n)</label>
                            <input type="number" value={numTerms} onChange={e => setNumTerms(e.target.value)} className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                )}
            </div>

            <button onClick={calculate} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium">
                Calculate Sum
            </button>

            {result && !result.error && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center mb-4">
                        <div className="text-sm text-gray-500 uppercase tracking-wide">Total Sum</div>
                        <div className="text-3xl font-bold text-gray-900">{result.sum.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-3 rounded border text-sm space-y-2">
                        <h4 className="font-semibold text-gray-900 border-b pb-1 mb-2">Calculation Steps</h4>
                        {result.steps}
                    </div>
                </div>
            )}
            {result && result.error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{result.error}</div>}
        </div>
    );
}


/**
 * Advanced Product of Series Calculator
 */
export function ProductOfSeriesCalculator() {
    const [input, setInput] = useState('1, 2, 3, 4');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const terms = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

        if (terms.length === 0) {
            setResult({ error: 'Please enter valid numbers.' });
            return;
        }

        const product = terms.reduce((acc, val) => acc * val, 1);

        // Check for overflow/infinity
        const displayProduct = (!isFinite(product)) ? "Value too large" : product.toLocaleString();

        setResult({
            product: displayProduct,
            count: terms.length,
            isLarge: terms.length > 5 || product > 1000000000
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Series (comma-separated)</label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-2 border rounded-md h-24 font-mono text-sm"
                    placeholder="e.g. 2, 4, 8, 16"
                />
            </div>

            <button onClick={calculate} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium">
                Calculate Product
            </button>

            {result && !result.error && (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500 uppercase tracking-wide">Product Result</div>
                    <div className="text-3xl font-bold text-gray-900 my-2">{result.product}</div>
                    <div className="text-xs text-gray-400">Multiplied {result.count} terms</div>
                </div>
            )}
            {result && result.error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{result.error}</div>}
        </div>
    );
}

/**
 * Advanced Difference Calculator
 * Calculates Absolute and Percentage Difference between two numbers.
 */
export function DifferenceCalculator() {
    const [val1, setVal1] = useState('100');
    const [val2, setVal2] = useState('150');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);

        if (isNaN(v1) || isNaN(v2)) { setResult({ error: 'Invalid numbers' }); return; }

        const absDiff = Math.abs(v1 - v2);
        const avg = (v1 + v2) / 2;
        // Avoid division by zero for percentage diff
        const percentDiff = avg === 0 ? 0 : (absDiff / Math.abs(avg)) * 100;

        setResult({
            v1, v2,
            absDiff,
            percentDiff: percentDiff.toFixed(2),
            change: v2 - v1 // Directional change (Increase/Decrease)
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value 1</label>
                    <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value 2</label>
                    <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-full p-2 border rounded-md" />
                </div>
            </div>

            <button onClick={calculate} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium">
                Calculate Difference
            </button>

            {result && !result.error && (
                <div className="grid grid-cols-1 gap-4">
                    {/* Absolute Difference */}
                    <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
                        <div>
                            <div className="text-sm text-blue-800 font-medium">Absolute Difference</div>
                            <div className="text-xs text-blue-600">|{result.v1} - {result.v2}|</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{result.absDiff}</div>
                    </div>

                    {/* Percentage Difference */}
                    <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center border border-green-100">
                        <div>
                            <div className="text-sm text-green-800 font-medium">Percentage Difference</div>
                            <div className="text-xs text-green-600">Relative to average</div>
                        </div>
                        <div className="text-2xl font-bold text-green-700">{result.percentDiff}%</div>
                    </div>

                    {/* Simple Change */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm text-gray-500 mb-1">Simple Change (V2 - V1)</div>
                        <div className={`text-xl font-bold ${result.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.change > 0 ? '+' : ''}{result.change}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {result.change > 0 ? 'Increase' : result.change < 0 ? 'Decrease' : 'No Change'} from Value 1 to Value 2
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
