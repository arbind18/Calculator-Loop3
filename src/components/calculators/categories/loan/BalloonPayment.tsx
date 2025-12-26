"use client"

import { useState, useEffect } from "react"
import { DollarSign, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { LoanEligibilitySeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateBalloonPayment, BalloonPaymentResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function BalloonPayment() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(5)
  const [balloonPercent, setBalloonPercent] = useState(20)
  const [result, setResult] = useState<BalloonPaymentResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateBalloonPayment({
      loanAmount,
      interestRate,
      tenureYears: tenure,
      balloonPercent
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure, balloonPercent])

  const chartData = result ? [
    { name: "Principal", value: loanAmount, color: '#3b82f6' },
    { name: "Interest Paid", value: result.totalInterest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setLoanAmount(1000000)
    setInterestRate(10)
    setTenure(5)
    setBalloonPercent(20)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, "Value"]
    const data = [
      ["Reduced Monthly EMI", `₹${result.monthlyEMI.toLocaleString()}`],
      ["Final Balloon Payment", `₹${result.balloonAmount.toLocaleString()}`],
      ["Total Amount Paid", `₹${result.totalPayment.toLocaleString()}`],
      ["Total Interest", `₹${result.totalInterest.toLocaleString()}`]
    ]

    generateReport(format, 'balloon_payment', headers, data, "Balloon Payment", {
      "Loan Amount": `₹${loanAmount}`,
      "Interest Rate": `${interestRate}%`,
      "Tenure (Years)": `${tenure}`,
      "Balloon Percent": `${balloonPercent}%`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Balloon Payment Calculator"
      description="Calculate EMI with final balloon payment for your loan"
      icon={DollarSign}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={100000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0.1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure (Years)"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
          />
          <InputGroup
            label="Balloon Payment (%)"
            value={balloonPercent}
            onChange={setBalloonPercent}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Reduced Monthly EMI"
              value={`₹${result.monthlyEMI.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Final Balloon Payment"
              value={`₹${result.balloonAmount.toLocaleString()}`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Total Amount Paid"
              value={`₹${result.totalPayment.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label="Total Interest"
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="default"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: "Distribution", icon: PieChartIcon },
                { value: 'graph', label: "Payment Schedule", icon: DollarSign }
              ]}
            />

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                ) : (
                  <AreaChart data={result.schedule}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="year" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    />
  )
}
