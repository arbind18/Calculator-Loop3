'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Calculator, BookOpen, Check, X, ArrowRight } from 'lucide-react';

// ----------------------------------------------------------------------
// 1. Advanced Percentage Calculator
// ----------------------------------------------------------------------
export function PercentageCalculator() {
    const [mode, setMode] = useState('what_is_x_percent_of_y');
    const [val1, setVal1] = useState('');
    const [val2, setVal2] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);
        if (isNaN(v1) || isNaN(v2)) return;

        let res = 0;
        let steps: string[] = [];
        let formula = "";

        switch (mode) {
            case 'what_is_x_percent_of_y': // What is X% of Y?
                res = (v1 / 100) * v2;
                formula = `(Percentage ÷ 100) × Value`;
                steps.push(`Convert percentage to decimal: ${v1} ÷ 100 = ${v1 / 100}`);
                steps.push(`Multiply by the value: ${v1 / 100} × ${v2} = ${res}`);
                break;
            case 'x_is_what_percent_of_y': // X is what % of Y?
                res = (v1 / v2) * 100;
                formula = `(Part ÷ Whole) × 100`;
                steps.push(`Divide part by whole: ${v1} ÷ ${v2} = ${(v1 / v2).toFixed(4)}`);
                steps.push(`Multiply by 100: ${(v1 / v2).toFixed(4)} × 100 = ${res}%`);
                break;
            case 'percentage_increase_decrease': // From X to Y
                const diff = v2 - v1;
                res = (diff / Math.abs(v1)) * 100;
                formula = `((New - Old) ÷ |Old|) × 100`;
                steps.push(`Find difference: ${v2} - ${v1} = ${diff}`);
                steps.push(`Divide by original abs value: ${diff} ÷ |${v1}| = ${(diff / Math.abs(v1)).toFixed(4)}`);
                steps.push(`Convert to %: ${(diff / Math.abs(v1)).toFixed(4)} × 100 = ${res.toFixed(2)}%`);
                break;
        }

        setResult({ value: parseFloat(res.toFixed(2)), steps, formula });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <Label>I want to calculate:</Label>
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="what_is_x_percent_of_y">What is X% of Y?</option>
                    <option value="x_is_what_percent_of_y">X is what % of Y?</option>
                    <option value="percentage_increase_decrease">Percentage Change from X to Y</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{mode === 'percentage_increase_decrease' ? 'Initial Value (Old)' : (mode === 'x_is_what_percent_of_y' ? 'Part (X)' : 'Percentage (X)')}</Label>
                    <Input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                    <Label>{mode === 'percentage_increase_decrease' ? 'Final Value (New)' : (mode === 'x_is_what_percent_of_y' ? 'Whole (Y)' : 'Value (Y)')}</Label>
                    <Input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} placeholder="0" />
                </div>
            </div>

            <Button onClick={calculate} className="w-full">Calculate</Button>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Result: {result.value}{mode !== 'what_is_x_percent_of_y' ? '%' : ''}</CardTitle>
                            <CardDescription>
                                Formula: {result.formula}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4" /> Steps:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {result.steps.map((step: string, i: number) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Advanced Average Calculator
// ----------------------------------------------------------------------
export function AverageCalculator() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const nums = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        if (nums.length === 0) return;

        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / nums.length;

        // Sort for median
        const sorted = [...nums].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

        // Range
        const range = sorted[sorted.length - 1] - sorted[0];

        // Mode
        const counts: Record<number, number> = {};
        nums.forEach(n => counts[n] = (counts[n] || 0) + 1);
        let maxFreq = 0;
        let modes: number[] = [];
        for (const n in counts) {
            if (counts[n] > maxFreq) {
                maxFreq = counts[n];
                modes = [parseFloat(n)];
            } else if (counts[n] === maxFreq) {
                modes.push(parseFloat(n));
            }
        }

        setResult({ mean, median, modes: maxFreq > 1 ? modes : [], range, sorted, sum, count: nums.length });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Enter numbers (separated by comma or space)</Label>
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., 10, 20, 30, 40" />
            </div>
            <Button onClick={calculate} className="w-full">Calculate Statistics</Button>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Mean (Average)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{result.mean.toFixed(2)}</div>
                            <p className="text-sm text-muted-foreground mt-1">Sum ({result.sum}) ÷ Count ({result.count})</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Median (Middle)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{result.median}</div>
                            <p className="text-sm text-muted-foreground mt-1">Middle value when sorted</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Mode (Most Frequent)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{result.modes.length > 0 ? result.modes.join(', ') : 'No Mode'}</div>
                            <p className="text-sm text-muted-foreground mt-1">{result.modes.length > 0 ? 'Appear most often' : 'All numbers appear once'}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Range</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{result.range}</div>
                            <p className="text-sm text-muted-foreground mt-1">Highest ({result.sorted[result.sorted.length - 1]}) - Lowest ({result.sorted[0]})</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold mb-2 text-sm">Sorted Data Set:</h4>
                            <div className="bg-muted p-2 rounded text-sm font-mono break-all">
                                {result.sorted.join(', ')}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Ratio Calculator
// ----------------------------------------------------------------------
export function RatioCalculator() {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [result, setResult] = useState<any>(null);

    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));

    const calculate = () => {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        if (isNaN(num1) || isNaN(num2)) return;

        const divisor = gcd(num1, num2);
        const simpleA = num1 / divisor;
        const simpleB = num2 / divisor;

        // Unit rates
        const val1to1 = num1 / num2;
        const val1toN = num2 / num1;

        setResult({ simpleA, simpleB, divisor, val1to1, val1toN, num1, num2 });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2 text-center">
                    <Label>Value A</Label>
                    <Input type="number" value={a} onChange={(e) => setA(e.target.value)} className="text-center" />
                </div>
                <div className="text-center font-bold text-2xl text-muted-foreground">:</div>
                <div className="space-y-2 text-center">
                    <Label>Value B</Label>
                    <Input type="number" value={b} onChange={(e) => setB(e.target.value)} className="text-center" />
                </div>
            </div>
            <Button onClick={calculate} className="w-full">Simplify Ratio</Button>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20 text-center">
                        <CardHeader>
                            <CardTitle className="text-4xl text-primary">
                                {result.simpleA} : {result.simpleB}
                            </CardTitle>
                            <CardDescription>Simplified Ratio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Both numbers were divided by their Greatest Common Divisor (GCD): <strong>{result.divisor}</strong></p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Unit Rate (A/B)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono text-xl">{result.val1to1.toFixed(4)} : 1</p>
                                <p className="text-xs text-muted-foreground mt-1">Value of A for every 1 unit of B</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Unit Rate (B/A)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono text-xl">1 : {result.val1toN.toFixed(4)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Value of B for every 1 unit of A</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 4. Proportion Calculator
// ----------------------------------------------------------------------
export function ProportionCalculator() {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [d, setD] = useState('x'); // Placeholder for display
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const vA = parseFloat(a);
        const vB = parseFloat(b);
        const vC = parseFloat(c);

        if (isNaN(vA) || isNaN(vB) || isNaN(vC)) return;
        if (vA === 0) return; // Divide by zero protection

        // A/B = C/x  =>  A*x = B*C  =>  x = (B*C)/A
        // Wait, standard proportion is usually A:B = C:D
        // User solves for D (x)

        const res = (vB * vC) / vA;

        setResult({ res, vA, vB, vC });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 justify-center text-lg font-medium mb-4">
                <span>If</span> <span className="bg-muted px-2 py-1 rounded">A</span>
                <span>:</span> <span className="bg-muted px-2 py-1 rounded">B</span>
                <span>=</span> <span className="bg-muted px-2 py-1 rounded">C</span>
                <span>:</span> <span className="bg-primary/20 text-primary px-2 py-1 rounded">X</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>A (First)</Label>
                    <Input type="number" value={a} onChange={e => setA(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>B (Second)</Label>
                    <Input type="number" value={b} onChange={e => setB(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>C (Third)</Label>
                    <Input type="number" value={c} onChange={e => setC(e.target.value)} />
                </div>
                <div className="space-y-2 opacity-50 pointer-events-none">
                    <Label>X (Missing)</Label>
                    <Input value="?" readOnly className="bg-muted" />
                </div>
            </div>

            <Button onClick={calculate} className="w-full">Solve for X</Button>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-center text-3xl">X = {result.res}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2 text-sm">Step-by-Step:</h4>
                                <div className="bg-white dark:bg-slate-900 p-3 rounded border font-mono text-sm space-y-2">
                                    <p>1. Write as fractions:  {result.vA}/{result.vB} = {result.vC}/x</p>
                                    <p>2. Cross multiply:      {result.vA} × x = {result.vB} × {result.vC}</p>
                                    <p>3. Simplify:            {result.vA}x = {result.vB * result.vC}</p>
                                    <p>4. Divide by {result.vA}:        x = {result.vB * result.vC} ÷ {result.vA}</p>
                                    <p className="font-bold text-primary">5. Result:             x = {result.res}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}


// ----------------------------------------------------------------------
// 5. Roots Calculator (Square & Cube)
// ----------------------------------------------------------------------
export function RootsCalculator({ type = 'square' }: { type?: 'square' | 'cube' }) {
    const [num, setNum] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const n = parseFloat(num);
        if (isNaN(n)) return;
        if (n < 0 && type === 'square') {
            setResult({ error: "Cannot find real square root of negative number" });
            return;
        }

        const root = type === 'square' ? Math.sqrt(n) : Math.cbrt(n);
        const isPerfect = Number.isInteger(root);

        // Nearest squares/cubes
        const floorRoot = Math.floor(root);
        const ceilRoot = Math.ceil(root);
        const lowerPerfect = Math.pow(floorRoot, type === 'square' ? 2 : 3);
        const upperPerfect = Math.pow(ceilRoot, type === 'square' ? 2 : 3);

        setResult({ root, isPerfect, n, lowerPerfect, upperPerfect, floorRoot, ceilRoot });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{type === 'square' ? 'Enter a number to find Square Root' : 'Enter a number to find Cube Root'}</Label>
                <Input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="e.g. 144" />
            </div>
            <Button onClick={calculate} className="w-full">Find {type === 'square' ? 'Square' : 'Cube'} Root</Button>

            {result && !result.error && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20 text-center">
                        <CardHeader>
                            <CardTitle className="text-4xl">
                                {type === 'square' ? '√' : '∛'}{result.n} = {Number.isInteger(result.root) ? result.root : result.root.toFixed(6)}
                            </CardTitle>
                            <CardDescription>{result.isPerfect ? `Yes, ${result.n} is a perfect ${type}.` : `Not a perfect ${type}.`}</CardDescription>
                        </CardHeader>
                    </Card>

                    {!result.isPerfect && (
                        <Card>
                            <CardContent className="pt-6">
                                <h4 className="font-semibold mb-2">Estimation:</h4>
                                <p className="text-sm text-muted-foreground mb-4">The exact answer is a non-terminating decimal. We can estimate it by looking at nearest perfect {type}s:</p>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-center">
                                        <div className="font-bold text-lg">{result.lowerPerfect}</div>
                                        <div className="text-muted-foreground">{result.floorRoot}^{type === 'square' ? '2' : '3'}</div>
                                    </div>
                                    <div className="flex-1 border-b-2 border-dashed border-muted mx-4 relative top-[-10px]"></div>
                                    <div className="text-center relative top-[-5px]">
                                        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">{result.n}</div>
                                    </div>
                                    <div className="flex-1 border-b-2 border-dashed border-muted mx-4 relative top-[-10px]"></div>
                                    <div className="text-center">
                                        <div className="font-bold text-lg">{result.upperPerfect}</div>
                                        <div className="text-muted-foreground">{result.ceilRoot}^{type === 'square' ? '2' : '3'}</div>
                                    </div>
                                </div>
                                <p className="text-center mt-4 text-sm">
                                    So the root is between <strong>{result.floorRoot}</strong> and <strong>{result.ceilRoot}</strong>.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            {result && result.error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}

// Wrapper for Cube Root Calculator
export function CubeRootCalculator(props: any) {
    return <RootsCalculator {...props} type="cube" />;
}

// ----------------------------------------------------------------------
// 7. Ultra-Advanced Fraction Calculator
// ----------------------------------------------------------------------
export function FractionCalculator() {
    const [mode, setMode] = useState<'arithmetic' | 'simplify' | 'compare'>('arithmetic');

    // Arithmetic Mode States
    const [whole1, setWhole1] = useState('');
    const [num1, setNum1] = useState('1');
    const [den1, setDen1] = useState('2');
    const [operation, setOperation] = useState('add');
    const [whole2, setWhole2] = useState('');
    const [num2, setNum2] = useState('1');
    const [den2, setDen2] = useState('3');

    // Simplify Mode States
    const [simpNum, setSimpNum] = useState('');
    const [simpDen, setSimpDen] = useState('');

    // Results
    const [result, setResult] = useState<any>(null);

    // Helper: GCD
    const gcd = (a: number, b: number): number => {
        a = Math.abs(a);
        b = Math.abs(b);
        return b === 0 ? a : gcd(b, a % b);
    };

    // Helper: LCM
    const lcm = (a: number, b: number): number => {
        return Math.abs(a * b) / gcd(a, b);
    };

    // Helper: Convert Mixed to Improper
    const mixedToImproper = (whole: string, num: string, den: string) => {
        const w = parseInt(whole) || 0;
        const n = parseInt(num) || 0;
        const d = parseInt(den) || 1;
        return { num: w * d + n, den: d };
    };

    // Helper: Convert Improper to Mixed
    const improperToMixed = (num: number, den: number) => {
        const sign = (num < 0) !== (den < 0) ? -1 : 1;
        num = Math.abs(num);
        den = Math.abs(den);
        const whole = Math.floor(num / den);
        const remainder = num % den;
        return { whole: whole * sign, num: remainder, den };
    };

    // Helper: Simplify Fraction
    const simplify = (num: number, den: number) => {
        const g = gcd(num, den);
        return { num: num / g, den: den / g };
    };

    // Arithmetic Calculation
    const calculateArithmetic = () => {
        const f1 = mixedToImproper(whole1, num1, den1);
        const f2 = mixedToImproper(whole2, num2, den2);

        let resNum = 0;
        let resDen = 1;
        const steps: string[] = [];

        // Step 1: Show conversion to improper
        if (whole1 || whole2) {
            steps.push(`Convert mixed numbers to improper fractions:`);
            if (whole1) {
                steps.push(`  ${whole1} ${num1}/${den1} = (${whole1}×${den1} + ${num1})/${den1} = ${f1.num}/${f1.den}`);
            }
            if (whole2) {
                steps.push(`  ${whole2} ${num2}/${den2} = (${whole2}×${den2} + ${num2})/${den2} = ${f2.num}/${f2.den}`);
            }
        }

        // Step 2: Perform operation
        switch (operation) {
            case 'add':
            case 'subtract': {
                const commonDen = lcm(f1.den, f2.den);
                const newNum1 = f1.num * (commonDen / f1.den);
                const newNum2 = f2.num * (commonDen / f2.den);

                steps.push(`Find common denominator (LCM of ${f1.den} and ${f2.den}): ${commonDen}`);
                steps.push(`Convert fractions: ${f1.num}/${f1.den} = ${newNum1}/${commonDen}, ${f2.num}/${f2.den} = ${newNum2}/${commonDen}`);

                if (operation === 'add') {
                    resNum = newNum1 + newNum2;
                    steps.push(`Add numerators: ${newNum1} + ${newNum2} = ${resNum}`);
                } else {
                    resNum = newNum1 - newNum2;
                    steps.push(`Subtract numerators: ${newNum1} - ${newNum2} = ${resNum}`);
                }
                resDen = commonDen;
                steps.push(`Result: ${resNum}/${resDen}`);
                break;
            }
            case 'multiply':
                resNum = f1.num * f2.num;
                resDen = f1.den * f2.den;
                steps.push(`Multiply numerators: ${f1.num} × ${f2.num} = ${resNum}`);
                steps.push(`Multiply denominators: ${f1.den} × ${f2.den} = ${resDen}`);
                break;
            case 'divide':
                resNum = f1.num * f2.den;
                resDen = f1.den * f2.num;
                steps.push(`Flip second fraction and multiply: ${f1.num}/${f1.den} × ${f2.den}/${f2.num}`);
                steps.push(`Result: (${f1.num} × ${f2.den})/(${f1.den} × ${f2.num}) = ${resNum}/${resDen}`);
                break;
        }

        // Step 3: Simplify
        const simplified = simplify(resNum, resDen);
        if (simplified.num !== resNum || simplified.den !== resDen) {
            const g = gcd(resNum, resDen);
            steps.push(`Simplify using GCD(${Math.abs(resNum)}, ${Math.abs(resDen)}) = ${g}`);
            steps.push(`${resNum}/${resDen} = ${simplified.num}/${simplified.den}`);
        }

        // Step 4: Convert to mixed if improper
        const mixed = improperToMixed(simplified.num, simplified.den);
        const decimal = simplified.num / simplified.den;
        const percentage = (decimal * 100).toFixed(2);

        setResult({
            num: simplified.num,
            den: simplified.den,
            mixed: mixed.whole !== 0 && mixed.num !== 0 ? `${mixed.whole} ${mixed.num}/${mixed.den}` :
                mixed.whole !== 0 ? `${mixed.whole}` :
                    `${mixed.num}/${mixed.den}`,
            decimal: decimal.toFixed(4),
            percentage,
            steps,
            f1Display: whole1 ? `${whole1} ${num1}/${den1}` : `${num1}/${den1}`,
            f2Display: whole2 ? `${whole2} ${num2}/${den2}` : `${num2}/${den2}`,
            operation
        });
    };

    // Simplify Calculation
    const calculateSimplify = () => {
        const n = parseInt(simpNum);
        const d = parseInt(simpDen);

        if (isNaN(n) || isNaN(d) || d === 0) return;

        const steps: string[] = [];
        const g = gcd(n, d);

        steps.push(`Find GCD of ${Math.abs(n)} and ${Math.abs(d)}`);
        steps.push(`GCD = ${g}`);

        const simplified = { num: n / g, den: d / g };
        steps.push(`Divide both by GCD: ${n}÷${g} = ${simplified.num}, ${d}÷${g} = ${simplified.den}`);

        const decimal = simplified.num / simplified.den;
        const mixed = improperToMixed(simplified.num, simplified.den);

        setResult({
            num: simplified.num,
            den: simplified.den,
            original: `${n}/${d}`,
            mixed: mixed.whole !== 0 && mixed.num !== 0 ? `${mixed.whole} ${mixed.num}/${mixed.den}` :
                mixed.whole !== 0 ? `${mixed.whole}` :
                    `${mixed.num}/${mixed.den}`,
            decimal: decimal.toFixed(4),
            percentage: (decimal * 100).toFixed(2),
            steps
        });
    };

    // Compare Calculation
    const calculateCompare = () => {
        const f1 = mixedToImproper(whole1, num1, den1);
        const f2 = mixedToImproper(whole2, num2, den2);

        const steps: string[] = [];
        const commonDen = lcm(f1.den, f2.den);
        const newNum1 = f1.num * (commonDen / f1.den);
        const newNum2 = f2.num * (commonDen / f2.den);

        steps.push(`Convert to common denominator: ${commonDen}`);
        steps.push(`${f1.num}/${f1.den} = ${newNum1}/${commonDen}`);
        steps.push(`${f2.num}/${f2.den} = ${newNum2}/${commonDen}`);
        steps.push(`Compare numerators: ${newNum1} vs ${newNum2}`);

        const comparison = newNum1 > newNum2 ? '>' : newNum1 < newNum2 ? '<' : '=';

        setResult({
            f1Display: whole1 ? `${whole1} ${num1}/${den1}` : `${num1}/${den1}`,
            f2Display: whole2 ? `${whole2} ${num2}/${den2}` : `${num2}/${den2}`,
            comparison,
            steps,
            f1Decimal: (f1.num / f1.den).toFixed(4),
            f2Decimal: (f2.num / f2.den).toFixed(4)
        });
    };

    const handleCalculate = () => {
        if (mode === 'arithmetic') calculateArithmetic();
        else if (mode === 'simplify') calculateSimplify();
        else if (mode === 'compare') calculateCompare();
    };

    // Simple Pie Chart Component
    const PieChart = ({ numerator, denominator }: { numerator: number; denominator: number }) => {
        const percentage = Math.min(100, Math.max(0, (numerator / denominator) * 100));
        const color = percentage > 100 ? '#ef4444' : percentage > 50 ? '#3b82f6' : '#10b981';

        return (
            <div className="flex flex-col items-center gap-2">
                <div
                    className="w-24 h-24 rounded-full border-4 border-gray-200"
                    style={{
                        background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}%)`
                    }}
                />
                <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="arithmetic">Arithmetic</TabsTrigger>
                    <TabsTrigger value="simplify">Simplify</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                </TabsList>

                {/* Arithmetic Mode */}
                <TabsContent value="arithmetic" className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Fraction 1 */}
                        <div className="flex-1 space-y-2">
                            <Label>First Fraction</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={whole1}
                                    onChange={(e) => setWhole1(e.target.value)}
                                    placeholder="Whole"
                                    className="w-20"
                                />
                                <Input
                                    type="number"
                                    value={num1}
                                    onChange={(e) => setNum1(e.target.value)}
                                    placeholder="Num"
                                    className="w-20"
                                />
                                <span className="text-xl">/</span>
                                <Input
                                    type="number"
                                    value={den1}
                                    onChange={(e) => setDen1(e.target.value)}
                                    placeholder="Den"
                                    className="w-20"
                                />
                            </div>
                        </div>

                        {/* Operation */}
                        <select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="add">+</option>
                            <option value="subtract">−</option>
                            <option value="multiply">×</option>
                            <option value="divide">÷</option>
                        </select>

                        {/* Fraction 2 */}
                        <div className="flex-1 space-y-2">
                            <Label>Second Fraction</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    value={whole2}
                                    onChange={(e) => setWhole2(e.target.value)}
                                    placeholder="Whole"
                                    className="w-20"
                                />
                                <Input
                                    type="number"
                                    value={num2}
                                    onChange={(e) => setNum2(e.target.value)}
                                    placeholder="Num"
                                    className="w-20"
                                />
                                <span className="text-xl">/</span>
                                <Input
                                    type="number"
                                    value={den2}
                                    onChange={(e) => setDen2(e.target.value)}
                                    placeholder="Den"
                                    className="w-20"
                                />
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleCalculate} className="w-full">Calculate</Button>

                    {result && mode === 'arithmetic' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calculator className="w-5 h-5" />
                                        Result
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-primary mb-2">
                                            {result.num}/{result.den}
                                        </div>
                                        {result.mixed !== `${result.num}/${result.den}` && (
                                            <div className="text-lg text-muted-foreground">
                                                = {result.mixed}
                                            </div>
                                        )}
                                        <div className="text-sm text-muted-foreground mt-2">
                                            Decimal: {result.decimal} | Percentage: {result.percentage}%
                                        </div>
                                    </div>

                                    <div className="flex justify-around items-center pt-4 border-t">
                                        <div className="text-center">
                                            <PieChart numerator={parseInt(num1)} denominator={parseInt(den1)} />
                                            <p className="text-xs mt-1">{result.f1Display}</p>
                                        </div>
                                        <div className="text-2xl">{operation === 'add' ? '+' : operation === 'subtract' ? '−' : operation === 'multiply' ? '×' : '÷'}</div>
                                        <div className="text-center">
                                            <PieChart numerator={parseInt(num2)} denominator={parseInt(den2)} />
                                            <p className="text-xs mt-1">{result.f2Display}</p>
                                        </div>
                                        <div className="text-2xl">=</div>
                                        <div className="text-center">
                                            <PieChart numerator={result.num} denominator={result.den} />
                                            <p className="text-xs mt-1">{result.num}/{result.den}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" /> Step-by-Step Solution
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2 border">
                                    {result.steps.map((step: string, i: number) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-mono text-sm min-w-[2rem] text-center">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm flex-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Simplify Mode */}
                <TabsContent value="simplify" className="space-y-4">
                    <div className="flex gap-2 items-center justify-center">
                        <Input
                            type="number"
                            value={simpNum}
                            onChange={(e) => setSimpNum(e.target.value)}
                            placeholder="Numerator"
                            className="w-32"
                        />
                        <span className="text-2xl">/</span>
                        <Input
                            type="number"
                            value={simpDen}
                            onChange={(e) => setSimpDen(e.target.value)}
                            placeholder="Denominator"
                            className="w-32"
                        />
                    </div>

                    <Button onClick={handleCalculate} className="w-full">Simplify</Button>

                    {result && mode === 'simplify' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader>
                                    <CardTitle>Simplified Result</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center space-y-2">
                                        <div className="text-2xl">{result.original}</div>
                                        <div className="text-4xl font-bold text-primary">
                                            = {result.num}/{result.den}
                                        </div>
                                        {result.mixed !== `${result.num}/${result.den}` && (
                                            <div className="text-lg text-muted-foreground">= {result.mixed}</div>
                                        )}
                                        <div className="text-sm text-muted-foreground">
                                            Decimal: {result.decimal} | {result.percentage}%
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2 border">
                                {result.steps.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300 font-mono text-sm">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Compare Mode */}
                <TabsContent value="compare" className="space-y-4">
                    <div className="flex gap-4 items-center justify-center">
                        <div className="flex gap-2 items-center">
                            <Input type="number" value={whole1} onChange={(e) => setWhole1(e.target.value)} placeholder="W" className="w-16" />
                            <Input type="number" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="N" className="w-16" />
                            <span>/</span>
                            <Input type="number" value={den1} onChange={(e) => setDen1(e.target.value)} placeholder="D" className="w-16" />
                        </div>
                        <span className="text-2xl">vs</span>
                        <div className="flex gap-2 items-center">
                            <Input type="number" value={whole2} onChange={(e) => setWhole2(e.target.value)} placeholder="W" className="w-16" />
                            <Input type="number" value={num2} onChange={(e) => setNum2(e.target.value)} placeholder="N" className="w-16" />
                            <span>/</span>
                            <Input type="number" value={den2} onChange={(e) => setDen2(e.target.value)} placeholder="D" className="w-16" />
                        </div>
                    </div>

                    <Button onClick={handleCalculate} className="w-full">Compare</Button>

                    {result && mode === 'compare' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardContent className="pt-6">
                                    <div className="text-center text-4xl font-bold">
                                        {result.f1Display} <span className="text-primary">{result.comparison}</span> {result.f2Display}
                                    </div>
                                    <div className="text-center text-sm text-muted-foreground mt-2">
                                        {result.f1Decimal} {result.comparison} {result.f2Decimal}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2 border">
                                {result.steps.map((step: string, i: number) => (
                                    <div key={i} className="text-sm">{step}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ----------------------------------------------------------------------
// 8. Advanced Rounding Calculator
// ----------------------------------------------------------------------
export function RoundingCalculator() {
    const [num, setNum] = useState('');
    const [mode, setMode] = useState<'decimal' | 'multiple' | 'sigfig'>('decimal');
    const [precision, setPrecision] = useState('2');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const n = parseFloat(num);
        if (isNaN(n)) return;

        let res: number | string = 0;
        const steps: string[] = [];
        const floor = Math.floor(n);
        const ceil = Math.ceil(n);

        if (mode === 'decimal') {
            const p = parseInt(precision) || 0;
            const factor = Math.pow(10, p);
            res = Math.round(n * factor) / factor;
            steps.push(`Round to ${p} decimal places.`);
            steps.push(`Identify the digit at position ${p + 1}: ${n.toFixed(p + 1).split('.')[1]?.[p] || '0'}`);
            steps.push(parseInt(n.toFixed(p + 1).split('.')[1]?.[p] || '0') >= 5 ? 'Digit is >= 5, so round UP.' : 'Digit is < 5, so round DOWN.');
        } else if (mode === 'multiple') {
            const m = parseFloat(precision) || 1;
            res = Math.round(n / m) * m;
            steps.push(`Round to nearest multiple of ${m}.`);
            steps.push(`${n} ÷ ${m} = ${(n / m).toFixed(2)}`);
            steps.push(`Round ${(n / m).toFixed(2)} to nearest integer = ${Math.round(n / m)}`);
            steps.push(`${Math.round(n / m)} × ${m} = ${res}`);
        } else if (mode === 'sigfig') {
            const p = parseInt(precision) || 1;
            res = Number(n.toPrecision(p));
            steps.push(`Round to ${p} significant figures.`);
            steps.push(`Identify the first ${p} significant digits.`);
        }

        setResult({
            val: res,
            floor,
            ceil,
            steps,
            mode
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label>Rounding Mode</Label>
                    <div className="flex flex-wrap gap-2">
                        <Button variant={mode === 'decimal' ? 'default' : 'outline'} onClick={() => setMode('decimal')} size="sm">Decimal Places</Button>
                        <Button variant={mode === 'multiple' ? 'default' : 'outline'} onClick={() => setMode('multiple')} size="sm">Nearest Multiple</Button>
                        <Button variant={mode === 'sigfig' ? 'default' : 'outline'} onClick={() => setMode('sigfig')} size="sm">Significant Figures</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Number to Round</Label>
                        <Input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter number (e.g., 12.3456)" />
                    </div>
                    <div className="space-y-2">
                        <Label>{mode === 'decimal' ? 'Decimal Places' : mode === 'multiple' ? 'Multiple Of' : 'Significant Figures'}</Label>
                        <Input type="number" value={precision} onChange={(e) => setPrecision(e.target.value)} placeholder="0" />
                    </div>
                </div>

                <Button onClick={calculate}>Round Number</Button>
            </div>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Result</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">{result.val}</div>
                            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                                    <div className="text-muted-foreground mb-1">Floor (Round Down)</div>
                                    <div className="font-semibold text-lg">{result.floor}</div>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-800 rounded border">
                                    <div className="text-muted-foreground mb-1">Ceiling (Round Up)</div>
                                    <div className="font-semibold text-lg">{result.ceil}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Explanation</Label>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2 border text-sm">
                            {result.steps.map((step: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <span className="text-primary font-mono">•</span>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 9. Advanced Factorial Calculator
// ----------------------------------------------------------------------
export function FactorialCalculator() {
    const [num, setNum] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const n = parseInt(num);
        if (isNaN(n) || n < 0) return;

        if (n > 170) {
            setResult({ val: "Infinity (Too Large)", steps: ["Number is too large for standard calculation (>170)."] });
            return;
        }

        let res = 1;
        const sequence = [];
        for (let i = n; i >= 1; i--) {
            res *= i;
            if (i >= n - 10) sequence.push(i); // Show first 10
        }

        let zeros = 0;
        let temp = n;
        while (temp >= 5) {
            zeros += Math.floor(temp / 5);
            temp /= 5;
        }

        setResult({
            val: res.toLocaleString(),
            raw: res,
            sequence: sequence.join(' × ') + (n > 10 ? ' × ... × 1' : ''),
            zeros,
            digits: res.toString().length
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-4">
                <div className="space-y-2 flex-1">
                    <Label>Enter Number (n)</Label>
                    <Input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Integer ≥ 0" />
                </div>
                <Button onClick={calculate}>Calculate Factorial</Button>
            </div>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Result: {num}!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-bold text-primary break-all">{result.val}</div>
                            {result.val.length > 20 && <div className="text-xs text-muted-foreground mt-1">({result.val.length} digits)</div>}

                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border font-mono text-sm overflow-x-auto whitespace-nowrap">
                                {num}! = {result.sequence} = {result.val}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.zeros}</span>
                                    <span className="text-xs text-muted-foreground">Trailing Zeros</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{result.digits}</span>
                                    <span className="text-xs text-muted-foreground">Total Digits</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 10. Advanced Absolute Value Calculator
// ----------------------------------------------------------------------
export function AbsoluteValueCalculator() {
    const [num, setNum] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const n = parseFloat(num);
        if (isNaN(n)) return;
        const res = Math.abs(n);
        setResult({ val: res, original: n });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-4">
                <div className="space-y-2 flex-1">
                    <Label>Enter Number</Label>
                    <Input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Negative or Positive" />
                </div>
                <Button onClick={calculate}>Get Absolute Value</Button>
            </div>

            {result !== null && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 text-center">
                            <div className="text-5xl font-bold text-primary mb-2">|{result.original}| = {result.val}</div>
                            <p className="text-muted-foreground">Absolute value is the distance from zero.</p>
                        </CardContent>
                    </Card>

                    {/* Number Line Visual */}
                    <div className="relative h-24 bg-slate-100 dark:bg-slate-900 rounded-lg border flex items-center justify-center overflow-hidden">
                        <div className="absolute w-[90%] h-1 bg-gray-400 top-1/2 -translate-y-1/2"></div>

                        {/* Zero Marker */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                            <div className="w-0.5 h-6 bg-gray-600"></div>
                            <span className="mt-2 text-sm font-bold">0</span>
                        </div>

                        {/* Value Marker */}
                        <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
                            style={{
                                left: `calc(50% + ${Math.max(-45, Math.min(45, (result.original / (Math.abs(result.original) * 2 || 1)) * 40))}%)`
                            }}>
                            <div className="w-4 h-4 bg-primary rounded-full relative z-10 shadow-lg"></div>
                            <div className={`h-1 bg-primary absolute top-1.5 ${result.original < 0 ? 'right-2 w-[calc(50vw-2rem)] origin-right' : 'left-2 w-[calc(50vw-2rem)] origin-left'} opacity-50 hidden md:block`}></div>
                            <span className="mt-4 text-sm font-bold text-primary">{result.original}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 11. Advanced Reciprocal Calculator
// ----------------------------------------------------------------------
export function ReciprocalCalculator() {
    const [mode, setMode] = useState<'decimal' | 'fraction'>('decimal');
    const [num, setNum] = useState('');
    const [fracNum, setFracNum] = useState('');
    const [fracDen, setFracDen] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        if (mode === 'decimal') {
            const n = parseFloat(num);
            if (isNaN(n) || n === 0) return;
            setResult({
                val: (1 / n).toFixed(6),
                decimal: 1 / n,
                equation: `1 / ${n} = ${(1 / n).toFixed(4)}`
            });
        } else {
            const n = parseFloat(fracNum);
            const d = parseFloat(fracDen);
            if (isNaN(n) || isNaN(d) || n === 0) return; // Reciprocal of 0 is undefined
            setResult({
                num: d,
                den: n,
                decimal: d / n,
                equation: `Flip ${n}/${d} → ${d}/${n}`
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 mb-4">
                <Button variant={mode === 'decimal' ? 'default' : 'outline'} onClick={() => setMode('decimal')} size="sm">Decimal</Button>
                <Button variant={mode === 'fraction' ? 'default' : 'outline'} onClick={() => setMode('fraction')} size="sm">Fraction</Button>
            </div>

            <div className="flex items-end gap-4">
                {mode === 'decimal' ? (
                    <div className="space-y-2 flex-1">
                        <Label>Enter Number</Label>
                        <Input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Ex: 5, 0.25" />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 flex-1">
                        <div className="space-y-2">
                            <Label>Num</Label>
                            <Input type="number" value={fracNum} onChange={(e) => setFracNum(e.target.value)} />
                        </div>
                        <span className="text-2xl mt-6">/</span>
                        <div className="space-y-2">
                            <Label>Den</Label>
                            <Input type="number" value={fracDen} onChange={(e) => setFracDen(e.target.value)} />
                        </div>
                    </div>
                )}
                <Button onClick={calculate}>Find Reciprocal</Button>
            </div>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 text-center">
                            {mode === 'decimal' ? (
                                <div className="text-4xl font-bold text-primary">{result.val}</div>
                            ) : (
                                <div className="flex items-center justify-center gap-4 text-4xl font-bold text-primary">
                                    <div className="flex flex-col items-center">
                                        <span>{fracNum}</span>
                                        <div className="h-0.5 w-full bg-current"></div>
                                        <span>{fracDen}</span>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                                    <div className="flex flex-col items-center text-green-600 dark:text-green-400">
                                        <span>{result.num}</span>
                                        <div className="h-0.5 w-full bg-current"></div>
                                        <span>{result.den}</span>
                                    </div>
                                </div>
                            )}
                            <p className="mt-4 text-lg font-medium">{result.equation}</p>
                            {mode === 'fraction' && <p className="text-sm text-muted-foreground mt-2">Decimal Value: {result.decimal.toFixed(4)}</p>}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}


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
