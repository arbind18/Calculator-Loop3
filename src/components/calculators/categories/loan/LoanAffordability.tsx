"use client"

import { useState, useEffect } from "react"
import { DollarSign, PieChart as PieChartIcon } from "lucide-react"
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

export function LoanAffordability() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [monthlyIncome, setMonthlyIncome] = useState(50000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(20000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)
  const [otherEMIs, setOtherEMIs] = useState(0)
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateLoanEligibility({
      monthlyIncome,
      existingEMI: otherEMIs,
      interestRate,
      tenureMonths: tenure * 12
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [monthlyIncome, monthlyExpenses, interestRate, tenure, otherEMIs])

  const chartData = result ? [
    { name: t.loan.affordable_emi, value: result.affordableEMI, color: '#3b82f6' },
    { name: t.loan.other_expenses, value: monthlyExpenses + otherEMIs, color: '#ef4444' },
    { name: t.loan.savings, value: Math.max(0, monthlyIncome - result.affordableEMI - monthlyExpenses - otherEMIs), color: '#10b981' },
  ] : []

  const handleClear = () => {
    setMonthlyIncome(50000)
    setMonthlyExpenses(20000)
    setInterestRate(8.5)
    setTenure(20)
    setOtherEMIs(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.maximum_loan_amount, result.maxLoanAmount],
      [t.loan.affordable_emi, result.affordableEMI],
      [t.loan.debt_to_income_ratio, `${result.dtiRatio}%`]
    ]

    generateReport(format, 'loan_affordability', headers, data, t.loan.loan_affordability_title, {
      [t.loan.monthly_income]: `₹${monthlyIncome}`,
      [t.loan.monthly_expenses]: `₹${monthlyExpenses}`,
      [t.loan.interest_rate]: `${interestRate}%`,
      [t.loan.tenure_years]: `${tenure}`,
      [t.loan.other_emis]: `₹${otherEMIs}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.loan_affordability_title}
      description={t.loan.loan_affordability_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      values={[monthlyIncome, monthlyExpenses, interestRate, tenure, otherEMIs]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setMonthlyIncome(Number(vals?.[0] ?? 50000))
        setMonthlyExpenses(Number(vals?.[1] ?? 20000))
        setInterestRate(Number(vals?.[2] ?? 8.5))
        setTenure(Number(vals?.[3] ?? 20))
        setOtherEMIs(Number(vals?.[4] ?? 0))
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
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.monthly_expenses}
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            min={0}
            max={monthlyIncome}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.other_emis}
            value={otherEMIs}
            onChange={setOtherEMIs}
            min={0}
            max={monthlyIncome}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.interest_rate}
            value={interestRate}
            onChange={setInterestRate}
            min={0.1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.tenure_years}
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.maximum_loan_amount}
              value={`₹${result.maxLoanAmount.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.affordable_emi}
              value={`₹${result.affordableEMI.toLocaleString()}`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.debt_to_income_ratio}
              value={`${result.dtiRatio.toFixed(1)}%`}
              type={result.dtiRatio > 50 ? "warning" : "success"}
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: t.common.distribution, icon: PieChartIcon }
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
