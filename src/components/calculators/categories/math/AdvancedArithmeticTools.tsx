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
