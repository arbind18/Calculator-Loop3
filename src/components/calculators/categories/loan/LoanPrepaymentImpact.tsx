"use client"

import { useState, useEffect } from "react"
import { FastForward, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { PrepaymentSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEMI, LoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function LoanPrepaymentImpact() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(120)
  const [prepayment, setPrepayment] = useState(100000)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar')

  const handleCalculate = () => {
    // Original Scenario
    const originalResult = calculateLoanEMI({
      loanAmount,
      interestRate,
      tenureMonths: tenure
    })

    // With Prepayment (Assuming reduced principal, same tenure -> reduced EMI)
    // Note: Usually prepayment reduces tenure, but this calculator seems to show EMI reduction impact based on previous code.
    // Let's stick to the previous logic: New Principal = Loan Amount - Prepayment.
    // This is effectively "What if I took a smaller loan?" or "What if I paid a lump sum right now and refinanced?"
    
    const newResult = calculateLoanEMI({
      loanAmount: loanAmount - prepayment,
      interestRate,
      tenureMonths: tenure
    })

    setResult({
      original: originalResult,
      new: newResult,
      savings: Math.round(originalResult.totalInterest - newResult.totalInterest)
    })
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure, prepayment])

  const chartData = result ? [
    {
      name: t.loan.interest_paid,
      [t.common.result]: result.original.totalInterest,
      [t.loan.prepayment_impact_title]: result.new.totalInterest,
    },
    {
      name: t.loan.total_paid,
      [t.common.result]: result.original.totalAmount,
      [t.loan.prepayment_impact_title]: result.new.totalAmount,
    },
  ] : []

  const handleClear = () => {
    setLoanAmount(1000000)
    setInterestRate(10)
    setTenure(120)
    setPrepayment(100000)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.loan.original_emi, t.loan.new_emi, t.loan.difference]
    const data = [
      [t.loan.principal_paid, loanAmount, loanAmount - prepayment, prepayment],
      [t.loan.emi, result.original.emi, result.new.emi, result.original.emi - result.new.emi],
      [t.loan.interest_paid, result.original.totalInterest, result.new.totalInterest, result.savings],
      [t.loan.total_paid, result.original.totalAmount, result.new.totalAmount, result.original.totalAmount - result.new.totalAmount],
    ]

    generateReport(format, 'prepayment_impact', headers, data, t.loan.prepayment_impact_title)
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.prepayment_impact_title}
      description={t.loan.prepayment_impact_desc}
      icon={FastForward}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<PrepaymentSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.loan_amount}
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={10000000}
            step={10000}
            prefix="?"
          />
          <InputGroup
            label={t.loan.interest_rate}
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.tenure_months}
            value={tenure}
            onChange={setTenure}
            min={12}
            max={360}
            step={12}
            helpText={`${(tenure / 12).toFixed(1)} Years`}
          />
          <InputGroup
            label={t.loan.prepayment_amount}
            value={prepayment}
            onChange={setPrepayment}
            min={1000}
            max={loanAmount - 1000}
            step={1000}
            prefix="?"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.interest_saved}
              value={`₹${result.interestSaved.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.new_emi}
              value={`₹${result.interestSaved.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.original_emi}
              value={`₹${result.interestSaved.toLocaleString()}`}
              type="default"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'bar', label: t.common.growth_chart, icon: TrendingUp }
              ]}
            />

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey={t.common.result} name="Original" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={t.loan.prepayment_impact_title} name="With Prepayment" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    />
  )
}
