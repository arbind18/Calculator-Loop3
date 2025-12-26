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
import { calculateTopUpLoan, TopUpLoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function TopUpLoan() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [existingLoan, setExistingLoan] = useState(2000000)
  const [existingEMI, setExistingEMI] = useState(25000)
  const [topUpAmount, setTopUpAmount] = useState(500000)
  const [tenure, setTenure] = useState(10)
  const [interestRate, setInterestRate] = useState(9)
  const [result, setResult] = useState<TopUpLoanResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateTopUpLoan({
      existingLoan: existingLoan,
      existingEMI,
      topUpAmount,
      tenureMonths: tenure * 12,
      interestRate
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [existingLoan, existingEMI, topUpAmount, tenure, interestRate])

  const chartData = result ? [
    { name: t.loan.existing_emi, value: existingEMI, color: '#3b82f6' },
    { name: t.loan.top_up_emi, value: result.additionalEMI, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setExistingLoan(2000000)
    setExistingEMI(25000)
    setTopUpAmount(500000)
    setTenure(10)
    setInterestRate(9)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.top_up_emi, result.additionalEMI],
      [t.loan.total_monthly_emi, result.newEMI],
      [t.loan.extra_interest, result.totalInterest]
    ]

    generateReport(format, 'top_up_loan', headers, data, t.loan.top_up_loan_title, {
      [t.loan.existing_loan_amount]: `₹${existingLoan}`,
      [t.loan.existing_emi]: `₹${existingEMI}`,
      [t.loan.top_up_amount]: `₹${topUpAmount}`,
      [t.loan.tenure_years]: `${tenure}`,
      [t.loan.interest_rate]: `${interestRate}%`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.top_up_loan_title}
      description={t.loan.top_up_loan_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.existing_loan_amount}
            value={existingLoan}
            onChange={setExistingLoan}
            min={10000}
            max={100000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.existing_emi}
            value={existingEMI}
            onChange={setExistingEMI}
            min={1000}
            max={existingLoan}
            step={500}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.top_up_amount}
            value={topUpAmount}
            onChange={setTopUpAmount}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.tenure_years}
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
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
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.top_up_emi}
              value={`₹${result.additionalEMI.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.total_monthly_emi}
              value={`₹${result.newEMI.toLocaleString()}`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.extra_interest}
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="default"
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
