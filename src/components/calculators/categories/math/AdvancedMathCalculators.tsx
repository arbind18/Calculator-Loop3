'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, ArrowRight, Check, X, Calculator, BookOpen, Lightbulb } from 'lucide-react';

// Types and Helper Interfaces
interface CalculationStep {
    label: string;
    value: string;
    description?: string;
}

// ----------------------------------------------------------------------
// 1. Percentage Change Calculator
// ----------------------------------------------------------------------
export function PercentageChangeCalculator() {
    const [val1, setVal1] = useState<string>('');
    const [val2, setVal2] = useState<string>('');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const v1 = parseFloat(val1);
        const v2 = parseFloat(val2);

        if (isNaN(v1) || isNaN(v2)) return;

        const diff = v2 - v1;
        const percentage = (diff / Math.abs(v1)) * 100;
        const isIncrease = diff > 0;
        const isDecrease = diff < 0;

        setResult({
            percentage: Math.abs(percentage).toFixed(2),
            diff: diff.toFixed(2),
            isIncrease,
            isDecrease,
            v1,
            v2
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Original Value (Starting)</Label>
                    <Input
                        type="number"
                        value={val1}
                        onChange={(e) => setVal1(e.target.value)}
                        placeholder="e.g., 500"
                    />
                </div>
                <div className="space-y-2">
                    <Label>New Value (Ending)</Label>
                    <Input
                        type="number"
                        value={val2}
                        onChange={(e) => setVal2(e.target.value)}
                        placeholder="e.g., 750"
                    />
                </div>
            </div>

            <Button onClick={calculate} className="w-full">Calculate Percentage Change</Button>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Result:
                                <span className={result.isIncrease ? "text-green-600" : result.isDecrease ? "text-red-600" : ""}>
                                    {result.percentage}% {result.isIncrease ? "Increase" : result.isDecrease ? "Decrease" : "No Change"}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">
                                From <strong>{result.v1}</strong> to <strong>{result.v2}</strong> is a difference of <strong>{result.diff}</strong>.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Step-by-Step Solution
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-4 border">

                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-700 dark:text-blue-300 font-bold min-w-[3rem] text-center">1</div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">Find the difference</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Subtract the original value from the new value.</p>
                                    <div className="mt-2 bg-white dark:bg-slate-800 p-2 rounded border font-mono text-sm">
                                        {result.v2} - {result.v1} = {result.diff}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-700 dark:text-blue-300 font-bold min-w-[3rem] text-center">2</div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">Divide by the original value</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Take the difference and divide it by the absolute original number.</p>
                                    <div className="mt-2 bg-white dark:bg-slate-800 p-2 rounded border font-mono text-sm">
                                        {result.diff} ÷ |{result.v1}| = {(result.diff / Math.abs(result.v1)).toFixed(4)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-blue-700 dark:text-blue-300 font-bold min-w-[3rem] text-center">3</div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-slate-100">Convert to Percentage</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Multiply by 100 to get the percentage.</p>
                                    <div className="mt-2 bg-white dark:bg-slate-800 p-2 rounded border font-mono text-sm">
                                        {(result.diff / Math.abs(result.v1)).toFixed(4)} × 100 = <strong>{result.percentage}%</strong>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. Prime Factorization Calculator
// ----------------------------------------------------------------------
export function PrimeFactorizationCalculator() {
    const [number, setNumber] = useState<string>('');
    const [result, setResult] = useState<any>(null);

    const getPrimeFactors = (n: number) => {
        const factors: number[] = [];
        let d = 2;
        let temp = n;
        while (d * d <= temp) {
            while (temp % d === 0) {
                factors.push(d);
                temp /= d;
            }
            d++;
        }
        if (temp > 1) factors.push(temp);
        return factors;
    };

    const calculate = () => {
        const n = parseInt(number);
        if (isNaN(n) || n <= 1) {
            setResult({ error: "Please enter a number greater than 1" });
            return;
        }

        const factors = getPrimeFactors(n);
        // Group factors for display: 2, 2, 3 -> 2² × 3
        const counts: Record<number, number> = {};
        factors.forEach(f => counts[f] = (counts[f] || 0) + 1);

        const formatted = Object.entries(counts)
            .map(([num, count]) => count > 1 ? `${num}^${count}` : num)
            .join(' × ');

        setResult({ factors, formatted, n, counts });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Enter a Number</Label>
                <Input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="e.g., 120"
                />
            </div>
            <Button onClick={calculate} className="w-full">Find Prime Factors</Button>

            {result && !result.error && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Prime Factors of {result.n}</CardTitle>
                            <CardDescription className="text-2xl font-bold text-primary mt-2">
                                {result.factors.join(' × ')}
                            </CardDescription>
                            {result.formatted !== result.factors.join(' × ') && (
                                <p className="text-sm text-muted-foreground mt-1 text-center">Exponential Notation: {result.formatted}</p>
                            )}
                        </CardHeader>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Factor Tree Method
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border">
                            <p className="mb-4 text-sm text-muted-foreground">We divide the number by smallest prime numbers until we reach 1.</p>
                            <div className="space-y-2 font-mono text-sm">
                                {/* Simplified visualization logic could go here */}
                                {result.factors.map((f: any, i: number) => {
                                    const currentVal = result.factors.slice(i).reduce((a: number, b: number) => a * b, 1);
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-16 text-right font-bold">{currentVal}</span>
                                            <span className="text-muted-foreground">÷</span>
                                            <span className="w-8 text-center bg-blue-100 dark:bg-blue-900 rounded text-blue-700 dark:text-blue-300 font-bold">{f}</span>
                                            <span className="text-muted-foreground">=</span>
                                            <span className="w-16 text-left">{currentVal / f}</span>
                                        </div>
                                    )
                                })}
                                <div className="flex items-center gap-3">
                                    <span className="w-16 text-right font-bold">1</span>
                                    <span className="text-muted-foreground text-xs italic ml-4">(Stop here)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// 3. Divisibility Checker
// ----------------------------------------------------------------------
export function DivisibilityChecker() {
    const [num, setNum] = useState('');
    const [divisor, setDivisor] = useState('');
    const [result, setResult] = useState<any>(null);

    const check = () => {
        const n = parseInt(num);
        const d = parseInt(divisor);
        if (isNaN(n) || isNaN(d) || d === 0) return;

        setResult({
            isDivisible: n % d === 0,
            remainder: n % d,
            n,
            d,
            quotient: Math.floor(n / d)
        });
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Number to Check</Label>
                    <Input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="e.g. 1024" />
                </div>
                <div className="space-y-2">
                    <Label>Divisible By?</Label>
                    <Input type="number" value={divisor} onChange={e => setDivisor(e.target.value)} placeholder="e.g. 8" />
                </div>
            </div>
            <Button onClick={check} className="w-full">Check Divisibility</Button>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Alert className={result.isDivisible ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                        {result.isDivisible ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
                        <AlertTitle className={result.isDivisible ? "text-green-800" : "text-red-800"}>
                            {result.isDivisible ? "Yes, it is divisible!" : "No, it is not divisible."}
                        </AlertTitle>
                        <AlertDescription className={result.isDivisible ? "text-green-700" : "text-red-700"}>
                            {result.n} ÷ {result.d} = {result.quotient}
                        </AlertDescription>
                    </Alert>

                    {!result.isDivisible && (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                            <p className="font-medium">Why?</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Because when you divide {result.n} by {result.d}, you get a remainder of <strong>{result.remainder}</strong>.
                            </p>
                            <div className="mt-2 font-mono text-sm bg-white dark:bg-slate-800 p-2 rounded inline-block">
                                {result.n} = ({result.d} × {result.quotient}) + {result.remainder}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ----------------------------------------------------------------------
// 4. Even/Odd Checker
// ----------------------------------------------------------------------
export function EvenOddChecker() {
    const [num, setNum] = useState('');
    const [result, setResult] = useState<any>(null);

    const check = () => {
        const n = parseInt(num);
        if (isNaN(n)) return;
        setResult({
            n,
            isEven: n % 2 === 0
        })
    }

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
                <Label>Enter any number</Label>
                <Input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder="e.g., 42" />
            </div>
            <Button onClick={check} className="w-full">Check Logic</Button>

            {result && (
                <div className="text-center animate-in zoom-in-50 duration-300 space-y-4">
                    <div className={`text-4xl font-bold ${result.isEven ? "text-blue-600" : "text-purple-600"}`}>
                        {result.isEven ? "EVEN" : "ODD"}
                    </div>

                    <div className="text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" /> How do we know?
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded border">1</span>
                                <span>Look at the last digit: <strong>{Math.abs(result.n) % 10}</strong></span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded border">2</span>
                                <span>If the last digit is 0, 2, 4, 6, or 8, it is <span className="text-blue-600 font-medium">Even</span>.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded border">3</span>
                                <span>If the last digit is 1, 3, 5, 7, or 9, it is <span className="text-purple-600 font-medium">Odd</span>.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
