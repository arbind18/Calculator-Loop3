'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle2, Calculator, Download, Copy } from 'lucide-react';
import { CopyButton, CopyIconButton } from '@/components/ui/CopyButton';
import { CalculationHistorySidebar, type CalculationEntry } from '@/components/ui/CalculationHistory';
import { useCalculatorShortcuts, KeyboardShortcutsHelp } from '@/hooks/useKeyboardShortcuts';
import { exportCalculationResult } from '@/lib/exportToPDF';
import { ScientificNotationVisual, MagnitudeComparison, DecimalPlacesVisual } from '@/components/ui/ScientificNotationVisuals';

export default function AdvancedScientificNotationCalculator() {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'decimal' | 'scientific'>('decimal');
  const [mantissa, setMantissa] = useState('');
  const [exponent, setExponent] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide' | 'convert'>('convert');
  const [mantissa2, setMantissa2] = useState('');
  const [exponent2, setExponent2] = useState('');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [copied, setCopied] = useState(false);

  const parseScientificNotation = (mantissa: string, exponent: string): number => {
    const m = parseFloat(mantissa);
    const e = parseInt(exponent);
    if (isNaN(m) || isNaN(e)) return NaN;
    return m * Math.pow(10, e);
  };

  const toScientificNotation = (num: number, precision: number = 6): { mantissa: number; exponent: number; formatted: string } => {
    if (num === 0) {
      return { mantissa: 0, exponent: 0, formatted: '0.000000 × 10⁰' };
    }

    const exp = Math.floor(Math.log10(Math.abs(num)));
    const man = num / Math.pow(10, exp);
    const formatted = `${man.toFixed(precision)} × 10${formatExponent(exp)}`;

    return { mantissa: parseFloat(man.toFixed(precision)), exponent: exp, formatted };
  };

  const toEngineeringNotation = (num: number, precision: number = 6): { mantissa: number; exponent: number; formatted: string } => {
    if (num === 0) {
      return { mantissa: 0, exponent: 0, formatted: '0.000000 × 10⁰' };
    }

    const exp = Math.floor(Math.log10(Math.abs(num)));
    const engExp = Math.floor(exp / 3) * 3;
    const man = num / Math.pow(10, engExp);
    const formatted = `${man.toFixed(precision)} × 10${formatExponent(engExp)}`;

    return { mantissa: parseFloat(man.toFixed(precision)), exponent: engExp, formatted };
  };

  const formatExponent = (exp: number): string => {
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    const expStr = Math.abs(exp).toString();
    let formatted = '';
    
    if (exp < 0) formatted = '⁻';
    
    for (let digit of expStr) {
      formatted += superscripts[parseInt(digit)];
    }
    
    return formatted;
  };

  const calculateOperation = () => {
    const num1 = parseScientificNotation(mantissa, exponent);
    
    if (operation === 'convert') {
      if (inputType === 'decimal') {
        const value = parseFloat(inputValue);
        if (isNaN(value)) {
          setResult({ error: 'Please enter a valid number' });
          return;
        }

        const scientific = toScientificNotation(value);
        const engineering = toEngineeringNotation(value);
        const standardForm = value.toString();
        const eNotation = value.toExponential(6);

        setResult({
          type: 'conversion',
          decimal: value,
          scientific,
          engineering,
          standardForm,
          eNotation,
          steps: [
            'Step 1: Convert Decimal to Scientific Notation',
            `   Given: ${value}`,
            '',
            'Step 2: Find the exponent',
            `   Move decimal point to get a number between 1 and 10`,
            `   Mantissa: ${scientific.mantissa}`,
            `   Exponent: ${scientific.exponent}`,
            '',
            'Step 3: Express in Scientific Notation',
            `   ${scientific.formatted}`,
            '',
            'Step 4: Engineering Notation (exponents are multiples of 3)',
            `   ${engineering.formatted}`,
            '',
            'Step 5: E-Notation (computer format)',
            `   ${eNotation}`
          ]
        });
      } else {
        const value = parseScientificNotation(mantissa, exponent);
        if (isNaN(value)) {
          setResult({ error: 'Please enter valid mantissa and exponent' });
          return;
        }

        const scientific = toScientificNotation(value);
        const engineering = toEngineeringNotation(value);

        setResult({
          type: 'conversion',
          decimal: value,
          scientific,
          engineering,
          standardForm: value.toString(),
          eNotation: value.toExponential(6),
          steps: [
            'Step 1: Convert Scientific Notation to Decimal',
            `   Given: ${mantissa} × 10^${exponent}`,
            '',
            'Step 2: Calculate the value',
            `   ${mantissa} × 10^${exponent} = ${mantissa} × ${Math.pow(10, parseInt(exponent))}`,
            `   = ${value}`,
            '',
            'Step 3: Normalized Scientific Notation',
            `   ${scientific.formatted}`,
            '',
            'Step 4: Engineering Notation',
            `   ${engineering.formatted}`
          ]
        });
      }
      return;
    }

    // Operations between two scientific notation numbers
    const num2 = parseScientificNotation(mantissa2, exponent2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult({ error: 'Please enter valid values for both numbers' });
      return;
    }

    let calculatedResult: number;
    let operationSteps: string[] = [];

    operationSteps.push('Step 1: Given values in Scientific Notation');
    operationSteps.push(`   Number 1: ${mantissa} × 10^${exponent}`);
    operationSteps.push(`   Number 2: ${mantissa2} × 10^${exponent2}`);
    operationSteps.push('');

    switch (operation) {
      case 'add':
        operationSteps.push('Step 2: Addition in Scientific Notation');
        operationSteps.push('   Convert both to same exponent:');
        const exp1 = parseInt(exponent);
        const exp2 = parseInt(exponent2);
        if (exp1 === exp2) {
          operationSteps.push(`   Both have exponent ${exp1}`);
          operationSteps.push(`   (${mantissa} + ${mantissa2}) × 10^${exp1}`);
          calculatedResult = num1 + num2;
        } else {
          operationSteps.push(`   Convert to decimal, add, then convert back`);
          operationSteps.push(`   ${num1} + ${num2}`);
          calculatedResult = num1 + num2;
        }
        operationSteps.push(`   = ${calculatedResult}`);
        break;

      case 'subtract':
        operationSteps.push('Step 2: Subtraction in Scientific Notation');
        operationSteps.push(`   Convert to decimal: ${num1} - ${num2}`);
        calculatedResult = num1 - num2;
        operationSteps.push(`   = ${calculatedResult}`);
        break;

      case 'multiply':
        operationSteps.push('Step 2: Multiplication in Scientific Notation');
        operationSteps.push('   Multiply mantissas and add exponents:');
        operationSteps.push(`   (${mantissa} × ${mantissa2}) × 10^(${exponent} + ${exponent2})`);
        const multMantissa = parseFloat(mantissa) * parseFloat(mantissa2);
        const multExp = parseInt(exponent) + parseInt(exponent2);
        operationSteps.push(`   = ${multMantissa} × 10^${multExp}`);
        calculatedResult = num1 * num2;
        operationSteps.push(`   = ${calculatedResult}`);
        break;

      case 'divide':
        if (num2 === 0) {
          setResult({ error: 'Cannot divide by zero' });
          return;
        }
        operationSteps.push('Step 2: Division in Scientific Notation');
        operationSteps.push('   Divide mantissas and subtract exponents:');
        operationSteps.push(`   (${mantissa} ÷ ${mantissa2}) × 10^(${exponent} - ${exponent2})`);
        const divMantissa = parseFloat(mantissa) / parseFloat(mantissa2);
        const divExp = parseInt(exponent) - parseInt(exponent2);
        operationSteps.push(`   = ${divMantissa} × 10^${divExp}`);
        calculatedResult = num1 / num2;
        operationSteps.push(`   = ${calculatedResult}`);
        break;

      default:
        calculatedResult = num1;
    }

    const scientific = toScientificNotation(calculatedResult);
    const engineering = toEngineeringNotation(calculatedResult);

    operationSteps.push('');
    operationSteps.push('Step 3: Express result in different formats');
    operationSteps.push(`   Decimal: ${calculatedResult}`);
    operationSteps.push(`   Scientific: ${scientific.formatted}`);
    operationSteps.push(`   Engineering: ${engineering.formatted}`);

    setResult({
      type: 'operation',
      decimal: calculatedResult,
      scientific,
      engineering,
      standardForm: calculatedResult.toString(),
      eNotation: calculatedResult.toExponential(6),
      steps: operationSteps
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputValue('');
    setMantissa('');
    setExponent('');
    setMantissa2('');
    setExponent2('');
    setResult(null);
  };

  const loadExample = (example: 'large' | 'small' | 'operation') => {
    if (example === 'large') {
      setInputType('decimal');
      setInputValue('299792458');
      setOperation('convert');
    } else if (example === 'small') {
      setInputType('decimal');
      setInputValue('0.00000000167');
      setOperation('convert');
    } else {
      setInputType('scientific');
      setMantissa('3.5');
      setExponent('8');
      setMantissa2('2.1');
      setExponent2('6');
      setOperation('multiply');
    }
  };

  const visualNumber = inputType === 'decimal'
    ? parseFloat(inputValue)
    : parseScientificNotation(mantissa, exponent);

  const visualScientific = Number.isFinite(visualNumber)
    ? toScientificNotation(visualNumber)
    : { mantissa: 0, exponent: 0, formatted: '0.000000 × 10⁰' };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Advanced Scientific Notation Calculator</h1>
        <p className="text-lg text-gray-600">
          Convert, calculate, and work with scientific and engineering notation
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
              <CardTitle>Scientific Notation Operations</CardTitle>
              <CardDescription>Convert numbers or perform calculations in scientific notation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operation">Operation Type</Label>
                  <Select value={operation} onValueChange={(value: any) => setOperation(value)}>
                    <SelectTrigger id="operation">
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="convert">Convert Number</SelectItem>
                      <SelectItem value="add">Addition</SelectItem>
                      <SelectItem value="subtract">Subtraction</SelectItem>
                      <SelectItem value="multiply">Multiplication</SelectItem>
                      <SelectItem value="divide">Division</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {operation === 'convert' && (
                  <div className="space-y-2">
                    <Label htmlFor="inputType">Input Type</Label>
                    <Select value={inputType} onValueChange={(value: any) => setInputType(value)}>
                      <SelectTrigger id="inputType">
                        <SelectValue placeholder="Select input type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="decimal">Decimal Number</SelectItem>
                        <SelectItem value="scientific">Scientific Notation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {operation === 'convert' ? (
                <>
                  {inputType === 'decimal' ? (
                    <div className="space-y-2">
                      <Label htmlFor="inputValue">Decimal Number</Label>
                      <Input
                        id="inputValue"
                        type="text"
                        placeholder="Enter number (e.g., 299792458 or 0.00000167)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mantissa">Mantissa (a)</Label>
                        <Input
                          id="mantissa"
                          type="number"
                          step="0.000001"
                          placeholder="e.g., 2.998"
                          value={mantissa}
                          onChange={(e) => setMantissa(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exponent">Exponent (n)</Label>
                        <Input
                          id="exponent"
                          type="number"
                          placeholder="e.g., 8"
                          value={exponent}
                          onChange={(e) => setExponent(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Format: a × 10ⁿ</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-base font-semibold mb-2">First Number</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="mantissa1">Mantissa</Label>
                        <Input
                          id="mantissa1"
                          type="number"
                          step="0.000001"
                          placeholder="e.g., 3.5"
                          value={mantissa}
                          onChange={(e) => setMantissa(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exponent1">Exponent</Label>
                        <Input
                          id="exponent1"
                          type="number"
                          placeholder="e.g., 8"
                          value={exponent}
                          onChange={(e) => setExponent(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2">Second Number</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="mantissa2">Mantissa</Label>
                        <Input
                          id="mantissa2"
                          type="number"
                          step="0.000001"
                          placeholder="e.g., 2.1"
                          value={mantissa2}
                          onChange={(e) => setMantissa2(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exponent2">Exponent</Label>
                        <Input
                          id="exponent2"
                          type="number"
                          placeholder="e.g., 6"
                          value={exponent2}
                          onChange={(e) => setExponent2(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={calculateOperation} className="flex-1 min-w-[150px]">
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
                  <Button onClick={() => loadExample('large')} variant="outline" size="sm">
                    Large Number (Speed of Light)
                  </Button>
                  <Button onClick={() => loadExample('small')} variant="outline" size="sm">
                    Small Number (Proton Mass)
                  </Button>
                  <Button onClick={() => loadExample('operation')} variant="outline" size="sm">
                    Multiplication Example
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && !result.error && (
            <>
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
                      Results in Multiple Formats
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          Decimal Form
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.decimal.toString())}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold text-gray-800 break-all">
                          {result.decimal}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          Scientific Notation
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.scientific.formatted)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-blue-700">
                          {result.scientific.formatted}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Mantissa: {result.scientific.mantissa}, Exponent: {result.scientific.exponent}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          Engineering Notation
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.engineering.formatted)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-green-700">
                          {result.engineering.formatted}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          (Exponents in multiples of 3)
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          E-Notation (Computer Format)
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.eNotation)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-purple-700 font-mono">
                          {result.eNotation}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Standard programming notation
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Visual Representations */}
              <Card>
                <CardHeader>
                  <CardTitle>Visual Representation</CardTitle>
                  <CardDescription>Understand scientific notation visually</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scientific Notation Visual */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-md">Scientific Notation Breakdown</h4>
                    <ScientificNotationVisual 
                      mantissa={visualScientific.mantissa}
                      exponent={visualScientific.exponent}
                    />
                  </div>

                  {/* Decimal Places Visual */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-md">Place Value Visualization</h4>
                    <DecimalPlacesVisual 
                      number={result.decimal}
                    />
                  </div>

                  {/* If we have calculation mode, show magnitude comparison */}
                  {result.magnitude && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-md">Order of Magnitude</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                          Order of Magnitude: <span className="font-bold text-blue-700">10<sup>{result.magnitude}</sup></span>
                        </p>
                        <p className="text-xs text-gray-600">
                          This number is in the range of {result.magnitude >= 0 ? `billions/trillions` : 'thousandths/millionths'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-1">
                    {result.steps.map((step: string, index: number) => (
                      <div
                        key={index}
                        className={step.startsWith('Step') ? 'font-bold text-blue-700 mt-3' : 'text-gray-700'}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
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
              <CardTitle>Understanding Scientific Notation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">What is Scientific Notation?</h3>
                <p className="text-gray-700">
                  Scientific notation expresses numbers as <strong>a × 10ⁿ</strong> where:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li><strong>a</strong> (mantissa) is a number between 1 and 10</li>
                  <li><strong>n</strong> (exponent) is an integer showing powers of 10</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Engineering Notation</h3>
                <p className="text-gray-700">
                  Similar to scientific notation but exponents are always multiples of 3 (matching SI prefixes: kilo, mega, giga, etc.)
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Operations Rules</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Multiplication:</strong> Multiply mantissas, add exponents</p>
                  <p className="ml-4 text-sm">(a × 10ⁿ) × (b × 10ᵐ) = (a × b) × 10⁽ⁿ⁺ᵐ⁾</p>
                  
                  <p><strong>Division:</strong> Divide mantissas, subtract exponents</p>
                  <p className="ml-4 text-sm">(a × 10ⁿ) ÷ (b × 10ᵐ) = (a ÷ b) × 10⁽ⁿ⁻ᵐ⁾</p>
                  
                  <p><strong>Addition/Subtraction:</strong> Convert to same exponent first</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Real-World Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-blue-800">Physics</p>
                      <p className="text-sm text-gray-700 mt-1">Speed of light: 2.998 × 10⁸ m/s</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-green-800">Chemistry</p>
                      <p className="text-sm text-gray-700 mt-1">Avogadro's number: 6.022 × 10²³</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-purple-800">Astronomy</p>
                      <p className="text-sm text-gray-700 mt-1">Earth's mass: 5.972 × 10²⁴ kg</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-4">
                      <p className="font-medium text-orange-800">Biology</p>
                      <p className="text-sm text-gray-700 mt-1">Cell size: 1.0 × 10⁻⁵ m</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <Info className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Scientific notation is essential for handling very large (astronomical) or very small (atomic) numbers efficiently!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
