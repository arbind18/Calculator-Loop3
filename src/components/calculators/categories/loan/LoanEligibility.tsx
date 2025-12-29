"use client"

import { useState, useEffect } from "react"
import { CheckCircle, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { LoanEligibilitySeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEligibility, EligibilityResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function LoanEligibility() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [monthlyIncome, setMonthlyIncome] = useState(50000)
  const [existingEMI, setExistingEMI] = useState(5000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(240)
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'bar'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateLoanEligibility({
      monthlyIncome,
      existingEMI,
      interestRate,
      tenureMonths: tenure
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [monthlyIncome, existingEMI, interestRate, tenure])

  const chartData = result ? [
    { name: t.loan.affordable_emi, value: result.affordableEMI, color: '#3b82f6' },
    { name: t.loan.existing_emi, value: existingEMI, color: '#ef4444' },
    { name: t.loan.disposable_income, value: result.disposableIncome, color: '#22c55e' },
  ] : []

  const handleClear = () => {
    setMonthlyIncome(50000)
    setExistingEMI(5000)
    setInterestRate(10)
    setTenure(240)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.calculate]
    const data = [
      [t.loan.monthly_income, monthlyIncome],
      [t.loan.existing_emi, existingEMI],
      [t.loan.interest_rate, `${interestRate}%`],
      [t.loan.tenure_months, tenure],
      [t.loan.eligible_amount, result.eligibleAmount],
      [t.loan.affordable_emi, result.affordableEMI],
      [t.loan.disposable_income, result.disposableIncome]
    ]

    generateReport(format, 'loan_eligibility', headers, data, t.loan.eligibility_title)
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.eligibility_title}
      description={t.loan.eligibility_desc}
      icon={CheckCircle}
      calculate={handleCalculate}
      values={[monthlyIncome, existingEMI, interestRate, tenure]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setMonthlyIncome(Number(vals?.[0] ?? 50000))
        setExistingEMI(Number(vals?.[1] ?? 5000))
        setInterestRate(Number(vals?.[2] ?? 10))
        setTenure(Number(vals?.[3] ?? 240))
      }}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.monthly_income}
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            min={10000}
            max={1000000}
            step={1000}
            prefix="?"
          />
          <InputGroup
            label={t.loan.existing_emi}
            value={existingEMI}
            onChange={setExistingEMI}
            min={0}
            max={monthlyIncome * 0.8}
            step={500}
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
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.eligible_amount}
              value={`₹${result.eligibleAmount.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.affordable_emi}
              value={`₹${result.eligibleAmount.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.disposable_income}
              value={`₹${result.disposableIncome.toLocaleString()}`}
              type="default"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: t.common.distribution, icon: PieChartIcon },
              ]}
            />

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    />
  )
}
