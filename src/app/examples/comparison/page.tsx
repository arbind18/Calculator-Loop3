'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ComparisonPanel from '@/components/comparison/ComparisonPanel';
import ComparisonTable from '@/components/comparison/ComparisonTable';
import { useComparison } from '@/hooks/useComparison';
import { Calculator, Info } from 'lucide-react';

export default function ComparisonExamplePage() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const { scenarios } = useComparison();

  // Calculate EMI
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi =
    loanAmount > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1)
        )
      : 0;
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;

  const currentInputs = {
    loan_amount: loanAmount,
    interest_rate: interestRate,
    tenure_years: tenure,
  };

  const currentResults = {
    monthly_emi: emi,
    total_amount: totalAmount,
    total_interest: totalInterest,
    principal_amount: loanAmount,
  };

  const loadScenario = (inputs: Record<string, any>) => {
    setLoanAmount(inputs.loan_amount || 0);
    setInterestRate(inputs.interest_rate || 0);
    setTenure(inputs.tenure_years || 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Scenario Comparison Tools</h1>
        <p className="text-muted-foreground text-lg">
          Compare multiple calculation scenarios side-by-side to make better decisions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                EMI Calculator
              </CardTitle>
              <CardDescription>Calculate and save different scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}</Label>
                  <Input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interest Rate: {interestRate}%</Label>
                  <Input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tenure: {tenure} years</Label>
                  <Input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Results */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    ₹{emi.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Interest</p>
                    <p className="font-semibold text-pink-600">
                      ₹{totalInterest.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Comparison Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">✨ Save Multiple Scenarios</h4>
                <p className="text-muted-foreground">
                  Save different loan options with custom names
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">📊 Side-by-Side Comparison</h4>
                <p className="text-muted-foreground">
                  View all scenarios in cards or table format
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">🏆 Best/Worst Highlighting</h4>
                <p className="text-muted-foreground">
                  Automatically identifies best and worst options
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">📈 Percentage Differences</h4>
                <p className="text-muted-foreground">
                  See how much scenarios differ from each other
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">📥 Export to CSV</h4>
                <p className="text-muted-foreground">
                  Download all scenarios for offline analysis
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">🔄 Quick Load</h4>
                <p className="text-muted-foreground">
                  Click any scenario to load its inputs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Panel */}
        <div>
          <ComparisonPanel
            calculatorName="EMI Calculator"
            currentInputs={currentInputs}
            currentResults={currentResults}
            preferLower={{
              monthly_emi: true,
              total_amount: true,
              total_interest: true,
            }}
            onLoadScenario={loadScenario}
          />
        </div>
      </div>

      {/* Full Width Table */}
      {scenarios.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison Table</CardTitle>
              <CardDescription>
                Compare all scenarios with inputs, results, and differences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonTable
                scenarios={scenarios}
                preferLower={{
                  monthly_emi: true,
                  total_amount: true,
                  total_interest: true,
                }}
                showInputs={true}
                showDifference={true}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Comparison Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Calculate Different Scenarios</h3>
            <p className="text-sm text-muted-foreground">
              Use the calculator on the left to try different loan amounts, interest rates, and
              tenures. Each combination represents a different scenario.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Save Scenarios</h3>
            <p className="text-sm text-muted-foreground">
              Click "Add Scenario" with a meaningful name (e.g., "Bank A - 8.5%", "Bank B - 9%") or
              use "Quick Add" for automatic naming.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Compare Options</h3>
            <p className="text-sm text-muted-foreground">
              Switch between Cards view for a quick overview or Table view for detailed
              side-by-side comparison. Best values are highlighted in green with a trophy icon.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Analyze Differences</h3>
            <p className="text-sm text-muted-foreground">
              The Difference column shows percentage and absolute differences between best and worst
              scenarios, helping you understand the impact of your choices.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">5. Export or Edit</h3>
            <p className="text-sm text-muted-foreground">
              Export all scenarios to CSV for spreadsheet analysis, rename scenarios, duplicate
              them for variations, or remove ones you don't need.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
