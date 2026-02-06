'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle2, Calculator, Download, History as HistoryIcon } from 'lucide-react';
import { CopyButton, CopyIconButton } from '@/components/ui/CopyButton';
import { CalculationHistory, CalculationHistorySidebar, type CalculationEntry } from '@/components/ui/CalculationHistory';
import { useCalculatorShortcuts, KeyboardShortcutsHelp } from '@/hooks/useCalculatorShortcuts';
import { exportCalculationResult } from '@/lib/exportToPDF';
import { FractionBar, FractionCircle } from '@/components/ui/FractionVisuals';
import { NumberLine, ComparisonNumberLine } from '@/components/ui/NumberLine';

export default function AdvancedDecimalCalculator() {
  const [decimal1, setDecimal1] = useState('');
  const [decimal2, setDecimal2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
  const [precision, setPrecision] = useState('10');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [fraction, setFraction] = useState<string | null>(null);
  const [scientific, setScientific] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationEntry[]>([]);

  // Decimal to Fraction conversion
  const decimalToFraction = (decimal: number): string => {
    if (Number.isInteger(decimal)) {
      return `${decimal}/1`;
    }

    const tolerance = 1.0e-10;
    let numerator = 1;
    let denominator = 1;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;

    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

    numerator = h1;
    denominator = k1;

    return `${numerator}/${denominator}`;
  };

  // GCD for fraction simplification
  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const calculateDecimal = () => {
    const num1 = parseFloat(decimal1);
    const num2 = parseFloat(decimal2);
    const precisionValue = parseInt(precision);

    if (isNaN(num1) || (operation !== 'add' && operation !== 'subtract' && operation !== 'multiply' && operation !== 'divide' && isNaN(num2))) {
      setResult('Invalid input');
      setSteps(['Please enter valid decimal numbers']);
      return;
    }

    let calculatedResult: number;
    const calcSteps: string[] = [];

    calcSteps.push(`Step 1: Given values`);
    calcSteps.push(`   First decimal: ${num1}`);
    if (!isNaN(num2)) {
      calcSteps.push(`   Second decimal: ${num2}`);
    }
    calcSteps.push(`   Precision: ${precisionValue} decimal places`);
    calcSteps.push('');

    switch (operation) {
      case 'add':
        calcSteps.push(`Step 2: Perform Addition`);
        calcSteps.push(`   ${num1} + ${num2}`);
        calculatedResult = num1 + num2;
        calcSteps.push(`   = ${calculatedResult}`);
        break;
      case 'subtract':
        calcSteps.push(`Step 2: Perform Subtraction`);
        calcSteps.push(`   ${num1} - ${num2}`);
        calculatedResult = num1 - num2;
        calcSteps.push(`   = ${calculatedResult}`);
        break;
      case 'multiply':
        calcSteps.push(`Step 2: Perform Multiplication`);
        calcSteps.push(`   ${num1} × ${num2}`);
        calculatedResult = num1 * num2;
        calcSteps.push(`   = ${calculatedResult}`);
        break;
      case 'divide':
        if (num2 === 0) {
          setResult('Cannot divide by zero');
          setSteps(['Error: Division by zero is undefined']);
          return;
        }
        calcSteps.push(`Step 2: Perform Division`);
        calcSteps.push(`   ${num1} ÷ ${num2}`);
        calculatedResult = num1 / num2;
        calcSteps.push(`   = ${calculatedResult}`);
        break;
      default:
        calculatedResult = num1;
    }

    calcSteps.push('');
    calcSteps.push(`Step 3: Round to ${precisionValue} decimal places`);
    const roundedResult = parseFloat(calculatedResult.toFixed(precisionValue));
    calcSteps.push(`   ${calculatedResult} → ${roundedResult}`);

    // Convert to fraction
    const fractionResult = decimalToFraction(roundedResult);
    calcSteps.push('');
    calcSteps.push(`Step 4: Convert to Fraction`);
    calcSteps.push(`   Decimal: ${roundedResult}`);
    calcSteps.push(`   Fraction: ${fractionResult}`);

    // Convert to scientific notation
    const scientificResult = roundedResult.toExponential(precisionValue);
    calcSteps.push('');
    calcSteps.push(`Step 5: Scientific Notation`);
    calcSteps.push(`   ${scientificResult}`);

    // Convert to percentage
    const percentageResult = (roundedResult * 100).toFixed(precisionValue - 2);
    calcSteps.push('');
    calcSteps.push(`Step 6: Percentage Form`);
    calcSteps.push(`   ${percentageResult}%`);

    setResult(roundedResult.toString());
    setSteps(calcSteps);
    setFraction(fractionResult);
    setScientific(scientificResult);
    setPercentage(percentageResult);

    // Add to history
    const operationSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
    const newEntry: CalculationEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      expression: `${num1} ${operationSymbols[operation]} ${num2}`,
      result: roundedResult.toString(),
      details: `Precision: ${precisionValue} decimal places`
    };
    setHistory(prev => [...prev, newEntry]);
  };

  const clearAll = () => {
    setDecimal1('');
    setDecimal2('');
    setResult(null);
    setSteps([]);
    setFraction(null);
    setScientific(null);
    setPercentage(null);
  };

  const handleExportPDF = async () => {
    if (!result) return;

    await exportCalculationResult({
      calculatorName: 'Advanced Decimal Calculator',
      inputs: [
        { label: 'First Decimal', value: decimal1 },
        { label: 'Second Decimal', value: decimal2 },
        { label: 'Operation', value: operation },
        { label: 'Precision', value: `${precision} decimal places` }
      ],
      result: `Result: ${result}`,
      steps,
      additionalInfo: [
        { label: 'Fraction Form', value: fraction || '' },
        { label: 'Scientific Notation', value: scientific || '' },
        { label: 'Percentage', value: `${percentage}%` }
      ]
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const parseFractionValue = (value: string | null) => {
    if (!value) return null;
    const [numStr, denStr] = value.split('/');
    const numerator = Number(numStr);
    const denominator = Number(denStr);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }
    return { numerator, denominator };
  };

  const fractionValue = parseFractionValue(fraction);

  const handleReuseCalculation = (entry: CalculationEntry) => {
    // Parse and reuse from history - simplified for now
    const parts = entry.expression.split(' ');
    if (parts.length >= 3) {
      setDecimal1(parts[0]);
      setDecimal2(parts[2]);
    }
  };

  // Keyboard shortcuts
  const shortcuts = useCalculatorShortcuts({
    onCalculate: calculateDecimal,
    onClear: clearAll,
    onCopy: result ? () => navigator.clipboard.writeText(result) : undefined
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Advanced Decimal Calculator</h1>
        <p className="text-lg text-gray-600">
          Perform precise decimal operations with multiple output formats
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="guide">How to Use</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Decimal Operations</CardTitle>
              <CardDescription>Enter decimal numbers and choose operation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decimal1">First Decimal Number</Label>
                  <Input
                    id="decimal1"
                    type="number"
                    step="0.0000000001"
                    placeholder="Enter first decimal (e.g., 3.14159)"
                    value={decimal1}
                    onChange={(e) => setDecimal1(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimal2">Second Decimal Number</Label>
                  <Input
                    id="decimal2"
                    type="number"
                    step="0.0000000001"
                    placeholder="Enter second decimal (e.g., 2.71828)"
                    value={decimal2}
                    onChange={(e) => setDecimal2(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operation">Operation</Label>
                  <Select value={operation} onValueChange={(value: any) => setOperation(value)}>
                    <SelectTrigger id="operation">
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

                <div className="space-y-2">
                  <Label htmlFor="precision">Decimal Precision</Label>
                  <Select value={precision} onValueChange={setPrecision}>
                    <SelectTrigger id="precision">
                      <SelectValue placeholder="Select precision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 decimal places</SelectItem>
                      <SelectItem value="4">4 decimal places</SelectItem>
                      <SelectItem value="6">6 decimal places</SelectItem>
                      <SelectItem value="8">8 decimal places</SelectItem>
                      <SelectItem value="10">10 decimal places</SelectItem>
                      <SelectItem value="15">15 decimal places</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={calculateDecimal} className="flex-1 min-w-[150px]">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button onClick={clearAll} variant="outline" className="flex-1 min-w-[150px]">
                  Clear All
                </Button>
                {history.length > 0 && (
                  <CalculationHistorySidebar
                    history={history}
                    onClear={handleClearHistory}
                    onDelete={handleDeleteHistoryEntry}
                    onReuse={handleReuseCalculation}
                  />
                )}
              </div>

              <KeyboardShortcutsHelp shortcuts={shortcuts} />
            </CardContent>
          </Card>

          {result !== null && (
            <>
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                    <span className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                      Result
                    </span>
                    <div className="flex gap-2">
                      <CopyButton text={result} label="Copy Result" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportPDF}
                        className="ml-2"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700 mb-6">
                    {result}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Fraction Form</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-semibold text-blue-700">{fraction}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Scientific Notation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-semibold text-purple-700">{scientific}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Percentage Form</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-semibold text-orange-700">{percentage}%</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Visual Representations */}
              {fractionValue && (
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Representation</CardTitle>
                    <CardDescription>See the result in different visual formats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Fraction Visual */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-md">Fraction Visualization</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FractionBar
                            numerator={fractionValue.numerator}
                            denominator={fractionValue.denominator}
                          />
                        </div>
                        <div>
                          <FractionCircle
                            numerator={fractionValue.numerator}
                            denominator={fractionValue.denominator}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Number Line */}
                    {decimal1 && decimal2 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-md">Number Comparison</h4>
                        <ComparisonNumberLine
                          value1={parseFloat(decimal1)}
                          value2={parseFloat(decimal2)}
                          label1="First Number"
                          label2="Second Number"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-1">
                    {steps.map((step, index) => (
                      <div key={index} className={step.startsWith('Step') ? 'font-bold text-blue-700 mt-3' : 'text-gray-700'}>
                        {step}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Features:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>High precision calculations up to 15 decimal places</li>
                    <li>Automatic conversion to fraction, scientific notation, and percentage</li>
                    <li>Step-by-step solution for understanding the process</li>
                    <li>Ideal for financial calculations, scientific computations, and engineering</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </>
          )}
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Use the Advanced Decimal Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Enter Decimal Numbers</h3>
                <p className="text-gray-700">
                  Input your decimal numbers in the first and second fields. You can use very small or very large decimals.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">2. Choose Operation</h3>
                <p className="text-gray-700">
                  Select the mathematical operation you want to perform: addition, subtraction, multiplication, or division.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">3. Set Precision</h3>
                <p className="text-gray-700">
                  Choose how many decimal places you want in your result (2 to 15 decimal places available).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">4. View Multiple Formats</h3>
                <p className="text-gray-700">
                  Get your result in decimal, fraction, scientific notation, and percentage formats simultaneously.
                </p>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Pro Tips:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Use high precision (10-15 places) for scientific and financial calculations</li>
                    <li>The fraction converter uses continued fractions for accurate results</li>
                    <li>Scientific notation is useful for very large or very small numbers</li>
                    <li>Click the "Copy" button to quickly copy results to clipboard</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="font-semibold text-lg mb-2">Common Use Cases</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-green-800">Financial Calculations</p>
                      <p className="text-sm text-gray-700 mt-1">Interest rates, currency conversions, tax calculations</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-blue-800">Scientific Measurements</p>
                      <p className="text-sm text-gray-700 mt-1">Lab data, chemical concentrations, physical constants</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-purple-800">Engineering</p>
                      <p className="text-sm text-gray-700 mt-1">Precision measurements, tolerance calculations</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-orange-800">Statistics</p>
                      <p className="text-sm text-gray-700 mt-1">Data analysis, probability calculations, averages</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
