"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
import { FinancialCalculatorTemplate } from "../templates/FinancialCalculatorTemplate"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InteractivePieChart } from "@/components/charts/InteractivePieChart"
import { InteractiveLineChart } from "@/components/charts/InteractiveLineChart"
import { ChartExportButton } from "@/components/charts/ChartExportButton"
import ShareCalculationButton from "@/components/social/ShareCalculationButton"
import EmailDialog from "@/components/email/EmailDialog"
import ComparisonPanel from "@/components/comparison/ComparisonPanel"
import { useAnalytics } from "@/hooks/useAnalytics"

export default function AdvancedEMICalculator() {
  const [principal, setPrincipal] = useState<number>(3000000)
  const [interestRate, setInterestRate] = useState<number>(8.5)
  const [tenure, setTenure] = useState<number>(20)
  const [result, setResult] = useState<any>(null)
  const { trackCalculator, trackResult } = useAnalytics()

  const loadScenarioInputs = (inputs: Record<string, any>) => {
    setPrincipal(inputs.loan_amount || inputs.principal)
    setInterestRate(inputs.interest_rate || inputs.interestRate)
    setTenure(inputs.tenure_years || inputs.tenure)
  }

  const calculateEMI = () => {
    const P = principal
    const r = interestRate / 12 / 100
    const n = tenure * 12

    // Track calculator use
    trackCalculator('EMI Calculator', {
      loan_amount: P,
      interest_rate: interestRate,
      tenure_years: tenure,
    })

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalAmount = emi * n
    const totalInterest = totalAmount - P

    // Generate yearly breakdown
    const yearlyData: Array<{
      name: string
      principal: number
      interest: number
      totalPaid: number
    }> = []
    let remainingPrincipal = P
    
    for (let year = 1; year <= Math.min(tenure, 20); year++) {
      const yearStart = (year - 1) * 12 + 1
      const yearEnd = year * 12
      let yearPrincipal = 0
      let yearInterest = 0

      for (let month = yearStart; month <= yearEnd; month++) {
        const monthInterest = remainingPrincipal * r
        const monthPrincipal = emi - monthInterest
        yearPrincipal += monthPrincipal
        yearInterest += monthInterest
        remainingPrincipal -= monthPrincipal
      }

      yearlyData.push({
        name: `Year ${year}`,
        principal: Math.round(remainingPrincipal),
        interest: Math.round(year === 1 ? yearInterest : yearlyData[year-2].interest + yearInterest),
        totalPaid: Math.round(emi * year * 12)
      })
    }

    const calculationResult = {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: P,
      yearlyData
    }

    setResult(calculationResult)

    // Track result
    trackResult(
      'EMI Calculator',
      { loan_amount: P, interest_rate: interestRate, tenure_years: tenure },
      {
        monthly_emi: calculationResult.emi,
        total_amount: calculationResult.totalAmount,
        total_interest: calculationResult.totalInterest,
      }
    )
  }

  const pieData = result ? [
    { name: 'Principal', value: result.principal, color: '#8b5cf6' },
    { name: 'Interest', value: result.totalInterest, color: '#ec4899' },
  ] : []

  const lineConfig = [
    { dataKey: 'principal', name: 'Remaining Principal', color: '#8b5cf6', strokeWidth: 3 },
    { dataKey: 'interest', name: 'Cumulative Interest', color: '#ec4899', strokeWidth: 3 },
  ]

  return (
    <FinancialCalculatorTemplate
      title="Advanced EMI Calculator"
      description="Calculate your loan EMI with interactive visualizations"
      icon={Calculator}
      calculate={calculateEMI}
      inputs={
        <div className="space-y-4">
          <div>
            <Label>Loan Amount (₹)</Label>
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              placeholder="Enter loan amount"
            />
          </div>
          <div>
            <Label>Interest Rate (% per annum)</Label>
            <Input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              placeholder="Enter interest rate"
            />
          </div>
          <div>
            <Label>Loan Tenure (Years)</Label>
            <Input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              placeholder="Enter tenure"
            />
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly EMI</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  ₹{result.emi.toLocaleString('en-IN')}
                </p>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-xl font-semibold">₹{result.totalAmount.toLocaleString('en-IN')}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Interest</p>
                <p className="text-xl font-semibold text-pink-600">₹{result.totalInterest.toLocaleString('en-IN')}</p>
              </Card>
            </div>
            
            {/* Share and Email Buttons */}
            <div className="flex gap-2 justify-center pt-2">
              <ShareCalculationButton
                calculatorName="EMI Calculator"
                results={{
                  monthlyEMI: result.emi,
                  loanAmount: result.principal,
                  totalInterest: result.totalInterest,
                  totalAmount: result.totalAmount,
                  interestRate: interestRate,
                  tenure: tenure
                }}
                customMessage={`I calculated my home loan EMI for ₹${(result.principal/100000).toFixed(1)}L`}
                hashtags={['EMI', 'HomeLoan', 'Finance', 'Calculator']}
              />
              <EmailDialog
                calculatorName="EMI Calculator"
                inputs={{
                  loan_amount: result.principal,
                  interest_rate: interestRate,
                  tenure_years: tenure,
                }}
                results={{
                  monthly_emi: result.emi,
                  total_amount: result.totalAmount,
                  total_interest: result.totalInterest,
                  principal_amount: result.principal,
                }}
              />
            </div>
          </div>
        )
      }
      charts={
        result && (
          <div className="space-y-8">
            {/* Pie Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Loan Breakdown</h3>
                <ChartExportButton chartId="emi-pie-chart" filename="loan-breakdown" />
              </div>
              <div id="emi-pie-chart">
                <InteractivePieChart
                  data={pieData}
                  innerRadius={70}
                  outerRadius={120}
                  showLegend={true}
                  showValues={true}
                />
              </div>
            </Card>

            {/* Line Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Loan Progress</h3>
                <ChartExportButton chartId="emi-line-chart" filename="loan-progress" />
              </div>
              <div id="emi-line-chart">
                <InteractiveLineChart
                  data={result.yearlyData}
                  lines={lineConfig}
                  xAxisLabel="Years"
                  yAxisLabel="Amount (₹)"
                  showArea={true}
                  showGrid={true}
                  showTrend={true}
                  height={350}
                />
              </div>
            </Card>

            {/* Comparison Panel */}
            <ComparisonPanel
              calculatorName="EMI Calculator"
              currentInputs={{
                loan_amount: result.principal,
                interest_rate: interestRate,
                tenure_years: tenure,
              }}
              currentResults={{
                monthly_emi: result.emi,
                total_amount: result.totalAmount,
                total_interest: result.totalInterest,
                principal_amount: result.principal,
              }}
              preferLower={{
                monthly_emi: true,
                total_amount: true,
                total_interest: true,
              }}
              onLoadScenario={loadScenarioInputs}
            />
          </div>
        )
      }
      category="Loan"
      calculatorUrl="advanced-emi-calculator"
    />
  )
}
