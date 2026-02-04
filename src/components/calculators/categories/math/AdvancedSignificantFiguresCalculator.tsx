'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle2, Calculator, Lightbulb, Download, Copy } from 'lucide-react';
import { CopyButton, CopyIconButton } from '@/components/ui/CopyButton';
import { CalculationHistorySidebar, type CalculationEntry } from '@/components/ui/CalculationHistory';
import { useCalculatorShortcuts, KeyboardShortcutsHelp } from '@/hooks/useKeyboardShortcuts';
import { exportCalculationResult } from '@/lib/exportToPDF';
import { NumberLine } from '@/components/ui/NumberLine';
import { DecimalPlacesVisual } from '@/components/ui/ScientificNotationVisuals';

export default function AdvancedSignificantFiguresCalculator() {
  const [inputNumber, setInputNumber] = useState('');
  const [operation, setOperation] = useState<'count' | 'round' | 'calculate'>('count');
  const [targetSigFigs, setTargetSigFigs] = useState('3');
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [mathOperation, setMathOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('multiply');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [copied, setCopied] = useState(false);

  // Count significant figures and identify them
  const countSigFigs = (numStr: string): { count: number; analysis: string[]; highlighted: string; rules: string[] } => {
    const analysis: string[] = [];
    const rules: string[] = [];
    let highlighted = '';
    
    // Remove any whitespace
    numStr = numStr.trim();
    
    // Handle scientific notation
    if (numStr.includes('e') || numStr.includes('E')) {
      const [mantissa] = numStr.split(/[eE]/);
      return countSigFigs(mantissa);
    }
    
    // Convert to string and analyze
    let cleaned = numStr.replace(/[,\s]/g, '');
    const isNegative = cleaned.startsWith('-');
    if (isNegative) cleaned = cleaned.substring(1);
    
    const hasDecimal = cleaned.includes('.');
    const parts = cleaned.split('.');
    
    let sigFigCount = 0;
    let foundNonZero = false;
    
    analysis.push('Analyzing digit by digit:');
    
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      
      if (char === '.') {
        highlighted += '<span class="text-gray-400">.</span>';
        continue;
      }
      
      if (char === '0') {
        if (!foundNonZero) {
          // Leading zeros - not significant
          highlighted += `<span class="bg-red-100 text-red-700 px-1 rounded">${char}</span>`;
          analysis.push(`  Position ${i + 1}: '${char}' - Leading zero (NOT significant)`);
          rules.push('Leading zeros are never significant');
        } else if (hasDecimal || i < cleaned.length - 1) {
          // Captive or trailing zeros with decimal - significant
          highlighted += `<span class="bg-green-100 text-green-700 px-1 rounded font-bold">${char}</span>`;
          analysis.push(`  Position ${i + 1}: '${char}' - ${hasDecimal ? 'Decimal' : 'Captive'} zero (SIGNIFICANT)`);
          rules.push(hasDecimal ? 'Trailing zeros after decimal are significant' : 'Zeros between non-zero digits are significant');
          sigFigCount++;
        } else {
          // Trailing zeros without decimal - ambiguous
          highlighted += `<span class="bg-yellow-100 text-yellow-700 px-1 rounded">${char}</span>`;
          analysis.push(`  Position ${i + 1}: '${char}' - Trailing zero without decimal (Ambiguous - not counted)`);
          rules.push('Trailing zeros without decimal are ambiguous');
        }
      } else {
        // Non-zero digit - always significant
        foundNonZero = true;
        highlighted += `<span class="bg-green-100 text-green-700 px-1 rounded font-bold">${char}</span>`;
        analysis.push(`  Position ${i + 1}: '${char}' - Non-zero digit (SIGNIFICANT)`);
        rules.push('All non-zero digits are significant');
        sigFigCount++;
      }
    }
    
    if (isNegative) highlighted = '-' + highlighted;
    
    return {
      count: sigFigCount,
      analysis,
      highlighted,
      rules: [...new Set(rules)] // Remove duplicates
    };
  };

  // Round to specific significant figures
  const roundToSigFigs = (num: number, sigFigs: number): { rounded: string; steps: string[] } => {
    const steps: string[] = [];
    
    steps.push(`Step 1: Original number: ${num}`);
    
    if (num === 0) {
      steps.push('Step 2: Number is zero, result is 0');
      return { rounded: '0', steps };
    }
    
    const sign = num < 0 ? -1 : 1;
    const absNum = Math.abs(num);
    
    steps.push(`Step 2: Determine the order of magnitude`);
    const magnitude = Math.floor(Math.log10(absNum));
    steps.push(`   Magnitude (exponent): 10^${magnitude}`);
    
    steps.push(`Step 3: Scale to get ${sigFigs} significant figures`);
    const scaled = absNum / Math.pow(10, magnitude - sigFigs + 1);
    steps.push(`   Scaled value: ${scaled}`);
    
    steps.push(`Step 4: Round to nearest integer`);
    const rounded = Math.round(scaled);
    steps.push(`   Rounded: ${rounded}`);
    
    steps.push(`Step 5: Scale back`);
    const result = sign * rounded * Math.pow(10, magnitude - sigFigs + 1);
    steps.push(`   Result: ${result}`);
    
    // Format properly
    let formatted: string;
    if (Math.abs(magnitude) > 6) {
      formatted = result.toExponential(sigFigs - 1);
      steps.push(`Step 6: Express in scientific notation: ${formatted}`);
    } else {
      formatted = result.toPrecision(sigFigs);
      steps.push(`Step 6: Express with ${sigFigs} significant figures: ${formatted}`);
    }
    
    return { rounded: formatted, steps };
  };

  // Perform calculation with sig fig rules
  const calculateWithSigFigs = (n1: string, n2: string, op: string): any => {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    
    if (isNaN(num1) || isNaN(num2)) {
      return { error: 'Please enter valid numbers' };
    }
    
    const sigFigs1 = countSigFigs(n1);
    const sigFigs2 = countSigFigs(n2);
    
    const steps: string[] = [];
    steps.push('Step 1: Count significant figures in each number');
    steps.push(`   Number 1: ${n1} has ${sigFigs1.count} sig figs`);
    steps.push(`   Number 2: ${n2} has ${sigFigs2.count} sig figs`);
    steps.push('');
    
    let rawResult: number;
    let resultSigFigs: number;
    
    if (op === 'multiply' || op === 'divide') {
      steps.push('Step 2: For multiplication/division:');
      steps.push('   → Result has sig figs = MINIMUM of input sig figs');
      resultSigFigs = Math.min(sigFigs1.count, sigFigs2.count);
      steps.push(`   → Result should have ${resultSigFigs} sig figs`);
      steps.push('');
      
      if (op === 'multiply') {
        steps.push(`Step 3: Multiply: ${num1} × ${num2}`);
        rawResult = num1 * num2;
      } else {
        if (num2 === 0) {
          return { error: 'Cannot divide by zero' };
        }
        steps.push(`Step 3: Divide: ${num1} ÷ ${num2}`);
        rawResult = num1 / num2;
      }
    } else {
      steps.push('Step 2: For addition/subtraction:');
      steps.push('   → Result has decimal places = MINIMUM decimal places');
      
      const decimals1 = n1.includes('.') ? n1.split('.')[1].length : 0;
      const decimals2 = n2.includes('.') ? n2.split('.')[1].length : 0;
      const minDecimals = Math.min(decimals1, decimals2);
      
      steps.push(`   → Number 1 has ${decimals1} decimal places`);
      steps.push(`   → Number 2 has ${decimals2} decimal places`);
      steps.push(`   → Result should have ${minDecimals} decimal places`);
      steps.push('');
      
      if (op === 'add') {
        steps.push(`Step 3: Add: ${num1} + ${num2}`);
        rawResult = num1 + num2;
      } else {
        steps.push(`Step 3: Subtract: ${num1} - ${num2}`);
        rawResult = num1 - num2;
      }
      
      resultSigFigs = minDecimals;
    }
    
    steps.push(`   = ${rawResult}`);
    steps.push('');
    
    const rounded = roundToSigFigs(rawResult, resultSigFigs);
    steps.push('Step 4: Round to appropriate significant figures');
    steps.push(...rounded.steps.slice(1).map(s => '   ' + s));
    
    return {
      rawResult,
      finalResult: rounded.rounded,
      resultSigFigs,
      num1SigFigs: sigFigs1.count,
      num2SigFigs: sigFigs2.count,
      steps
    };
  };

  const handleCalculate = () => {
    if (operation === 'count') {
      if (!inputNumber.trim()) {
        setResult({ error: 'Please enter a number' });
        return;
      }
      
      const sigFigData = countSigFigs(inputNumber);
      setResult({
        type: 'count',
        count: sigFigData.count,
        analysis: sigFigData.analysis,
        highlighted: sigFigData.highlighted,
        rules: sigFigData.rules,
        original: inputNumber
      });
    } else if (operation === 'round') {
      const num = parseFloat(inputNumber);
      if (isNaN(num)) {
        setResult({ error: 'Please enter a valid number' });
        return;
      }
      
      const target = parseInt(targetSigFigs);
      const rounded = roundToSigFigs(num, target);
      const originalSigFigs = countSigFigs(inputNumber);
      
      setResult({
        type: 'round',
        original: inputNumber,
        originalCount: originalSigFigs.count,
        targetCount: target,
        rounded: rounded.rounded,
        steps: rounded.steps
      });
    } else {
      const calcResult = calculateWithSigFigs(num1, num2, mathOperation);
      setResult({
        type: 'calculate',
        ...calcResult
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputNumber('');
    setNum1('');
    setNum2('');
    setResult(null);
  };

  const loadExample = (example: 'count' | 'round' | 'calculate') => {
    if (example === 'count') {
      setOperation('count');
      setInputNumber('0.00456700');
    } else if (example === 'round') {
      setOperation('round');
      setInputNumber('123456.789');
      setTargetSigFigs('4');
    } else {
      setOperation('calculate');
      setNum1('12.5');
      setNum2('3.42');
      setMathOperation('multiply');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Advanced Significant Figures Calculator</h1>
        <p className="text-lg text-gray-600">
          Count, round, and calculate with significant figures
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="guide">Rules & Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Significant Figures Operations</CardTitle>
              <CardDescription>Choose operation type and enter values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="operation">Operation Type</Label>
                <Select value={operation} onValueChange={(value: any) => setOperation(value)}>
                  <SelectTrigger id="operation">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">Count Significant Figures</SelectItem>
                    <SelectItem value="round">Round to Sig Figs</SelectItem>
                    <SelectItem value="calculate">Calculate with Sig Figs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {operation === 'count' && (
                <div className="space-y-2">
                  <Label htmlFor="inputNumber">Enter Number</Label>
                  <Input
                    id="inputNumber"
                    type="text"
                    placeholder="e.g., 0.00456700 or 1500 or 3.14159"
                    value={inputNumber}
                    onChange={(e) => setInputNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Try: 0.00456700, 1500, 3.14159, or 100.00
                  </p>
                </div>
              )}

              {operation === 'round' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="inputNumberRound">Number to Round</Label>
                    <Input
                      id="inputNumberRound"
                      type="text"
                      placeholder="e.g., 123456.789"
                      value={inputNumber}
                      onChange={(e) => setInputNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetSigFigs">Target Significant Figures</Label>
                    <Select value={targetSigFigs} onValueChange={setTargetSigFigs}>
                      <SelectTrigger id="targetSigFigs">
                        <SelectValue placeholder="Select sig figs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 sig fig</SelectItem>
                        <SelectItem value="2">2 sig figs</SelectItem>
                        <SelectItem value="3">3 sig figs</SelectItem>
                        <SelectItem value="4">4 sig figs</SelectItem>
                        <SelectItem value="5">5 sig figs</SelectItem>
                        <SelectItem value="6">6 sig figs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {operation === 'calculate' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="num1">First Number</Label>
                      <Input
                        id="num1"
                        type="text"
                        placeholder="e.g., 12.5"
                        value={num1}
                        onChange={(e) => setNum1(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="num2">Second Number</Label>
                      <Input
                        id="num2"
                        type="text"
                        placeholder="e.g., 3.42"
                        value={num2}
                        onChange={(e) => setNum2(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mathOperation">Mathematical Operation</Label>
                    <Select value={mathOperation} onValueChange={(value: any) => setMathOperation(value)}>
                      <SelectTrigger id="mathOperation">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Addition (+)</SelectItem>
                        <SelectItem value="subtract">Subtraction (−)</SelectItem>
                        <SelectItem value="multiply">Multiplication (×)</SelectItem>
                        <SelectItem value="divide">Division (÷)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCalculate} className="flex-1 min-w-[150px]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button onClick={clearAll} variant="outline" className="flex-1 min-w-[150px]">
                  Clear All
                </Button>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-medium mb-2">Quick Examples:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button onClick={() => loadExample('count')} variant="outline" size="sm">
                    Count Example
                  </Button>
                  <Button onClick={() => loadExample('round')} variant="outline" size="sm">
                    Rounding Example
                  </Button>
                  <Button onClick={() => loadExample('calculate')} variant="outline" size="sm">
                    Calculation Example
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && !result.error && result.type === 'count' && (
            <>
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                      Significant Figures: {result.count}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.count.toString())}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Visual Highlighting:</p>
                    <div 
                      className="text-3xl font-mono p-4 bg-white rounded-lg border-2 border-green-300"
                      dangerouslySetInnerHTML={{ __html: result.highlighted }}
                    />
                    <div className="flex justify-center gap-4 mt-3 text-xs">
                      <span className="flex items-center">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded mr-1">0</span>
                        Significant
                      </span>
                      <span className="flex items-center">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded mr-1">0</span>
                        Not Significant
                      </span>
                      <span className="flex items-center">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded mr-1">0</span>
                        Ambiguous
                      </span>
                    </div>
                  </div>

                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-base">Digit-by-Digit Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-1">
                        {result.analysis.map((line: string, idx: number) => (
                          <div key={idx} className="text-gray-700">{line}</div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <strong>Rules Applied:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {result.rules.map((rule: string, idx: number) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </>
          )}

          {result && !result.error && result.type === 'round' && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
                    Rounded Result
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.rounded)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white">
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Original Number</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">{result.original}</p>
                      <p className="text-xs text-gray-500 mt-1">{result.originalCount} sig figs</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Rounded To</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">{result.rounded}</p>
                      <p className="text-xs text-gray-500 mt-1">{result.targetCount} sig figs</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-green-200">
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Precision</p>
                      <p className="text-xl font-bold text-green-700 mt-1">{result.targetCount} figures</p>
                      <p className="text-xs text-gray-500 mt-1">Target precision</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">Step-by-Step Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-1">
                      {result.steps.map((step: string, idx: number) => (
                        <div
                          key={idx}
                          className={step.startsWith('Step') ? 'font-bold text-blue-700 mt-2' : 'text-gray-700'}
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {result && !result.error && result.type === 'calculate' && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-purple-600" />
                  Calculation Result with Sig Figs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white">
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">Raw Result</p>
                      <p className="text-xl font-bold text-gray-800 mt-1">{result.rawResult}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-purple-200">
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600">With Proper Sig Figs</p>
                      <p className="text-2xl font-bold text-purple-700 mt-1">{result.finalResult}</p>
                      <p className="text-xs text-gray-500 mt-1">{result.resultSigFigs} sig figs</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">Calculation Steps with Sig Fig Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-1">
                      {result.steps.map((step: string, idx: number) => (
                        <div
                          key={idx}
                          className={step.startsWith('Step') ? 'font-bold text-purple-700 mt-2' : 'text-gray-700'}
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {result?.error && (
            <Alert variant="destructive">
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Significant Figures Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-700">✓ Significant (Count These)</h3>
                <div className="space-y-2 ml-4">
                  <p className="text-gray-700"><strong>1. All non-zero digits</strong></p>
                  <p className="text-sm text-gray-600 ml-4">Example: 123.45 has 5 sig figs</p>
                  
                  <p className="text-gray-700"><strong>2. Zeros between non-zero digits (captive zeros)</strong></p>
                  <p className="text-sm text-gray-600 ml-4">Example: 1002 has 4 sig figs</p>
                  
                  <p className="text-gray-700"><strong>3. Trailing zeros after decimal point</strong></p>
                  <p className="text-sm text-gray-600 ml-4">Example: 1.200 has 4 sig figs</p>
                  
                  <p className="text-gray-700"><strong>4. Leading zeros after decimal (if after non-zero)</strong></p>
                  <p className="text-sm text-gray-600 ml-4">Example: 0.00450 has 3 sig figs (4, 5, 0)</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-700">✗ NOT Significant</h3>
                <div className="space-y-2 ml-4">
                  <p className="text-gray-700"><strong>1. Leading zeros before non-zero digits</strong></p>
                  <p className="text-sm text-gray-600 ml-4">Example: 0.0045 has 2 sig figs (leading zeros don't count)</p>
                  
                  <p className="text-gray-700"><strong>2. Trailing zeros without decimal point</strong></p>
                  <p className="text-sm text-gray-600 ml-4">Example: 1500 has 2 sig figs (unless written as 1500.)</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-700">Calculation Rules</h3>
                <div className="space-y-3 ml-4">
                  <div>
                    <p className="text-gray-700 font-medium">Multiplication & Division:</p>
                    <p className="text-sm text-gray-600 ml-4">Result has the FEWEST sig figs from inputs</p>
                    <p className="text-sm text-green-700 ml-4">Example: 12.5 (3 sf) × 3.42 (3 sf) = 42.8 (3 sf)</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 font-medium">Addition & Subtraction:</p>
                    <p className="text-sm text-gray-600 ml-4">Result has the FEWEST DECIMAL PLACES from inputs</p>
                    <p className="text-sm text-green-700 ml-4">Example: 12.5 (1 dp) + 3.42 (2 dp) = 15.9 (1 dp)</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> In scientific measurements, significant figures indicate the precision of your measurement. More sig figs = more precise measurement!
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="font-semibold text-lg mb-3">Common Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { num: '0.00456', sf: 3, note: 'Leading zeros not counted' },
                    { num: '100.00', sf: 5, note: 'Trailing zeros after decimal count' },
                    { num: '1500', sf: 2, note: 'Ambiguous trailing zeros' },
                    { num: '1.500 × 10³', sf: 4, note: 'Scientific notation clarifies' }
                  ].map((ex, idx) => (
                    <Card key={idx} className="bg-gray-50">
                      <CardContent className="pt-4">
                        <p className="font-mono text-lg font-bold">{ex.num}</p>
                        <p className="text-sm text-green-700 font-semibold mt-1">{ex.sf} significant figures</p>
                        <p className="text-xs text-gray-600 mt-1">{ex.note}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
