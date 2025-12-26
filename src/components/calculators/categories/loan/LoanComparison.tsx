"use client"

import { useState, useEffect } from "react"
import { Scale, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { LoanComparisonSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEMI, LoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function LoanComparison() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loan1Amount, setLoan1Amount] = useState(1000000)
  const [loan1Rate, setLoan1Rate] = useState(10)
  const [loan1Tenure, setLoan1Tenure] = useState(120)
  
  const [loan2Amount, setLoan2Amount] = useState(1000000)
  const [loan2Rate, setLoan2Rate] = useState(11)
  const [loan2Tenure, setLoan2Tenure] = useState(120)
  
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar')

  const handleCalculate = () => {
    const loan1Result = calculateLoanEMI({
      loanAmount: loan1Amount,
      interestRate: loan1Rate,
      tenureMonths: loan1Tenure
    })

    const loan2Result = calculateLoanEMI({
      loanAmount: loan2Amount,
      interestRate: loan2Rate,
      tenureMonths: loan2Tenure
    })

    setResult({
      loan1: loan1Result,
      loan2: loan2Result,
      savings: Math.round(Math.abs(loan1Result.totalAmount - loan2Result.totalAmount)),
      betterOption: loan1Result.totalAmount < loan2Result.totalAmount ? t.loan.loan_1 : t.loan.loan_2
    })
  }

  useEffect(() => {
    handleCalculate()
  }, [loan1Amount, loan1Rate, loan1Tenure, loan2Amount, loan2Rate, loan2Tenure])

  const chartData = result ? [
    {
      name: t.loan.interest_paid,
      [t.loan.loan_1]: result.loan1.totalInterest,
      [t.loan.loan_2]: result.loan2.totalInterest,
    },
    {
      name: t.loan.total_paid,
      [t.loan.loan_1]: result.loan1.totalAmount,
      [t.loan.loan_2]: result.loan2.totalAmount,
    },
  ] : []

  const handleClear = () => {
    setLoan1Amount(1000000)
    setLoan1Rate(10)
    setLoan1Tenure(120)
    setLoan2Amount(1000000)
    setLoan2Rate(11)
    setLoan2Tenure(120)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.loan.loan_1, t.loan.loan_2, t.loan.difference]
    const data = [
      [t.loan.loan_amount, loan1Amount, loan2Amount, Math.abs(loan1Amount - loan2Amount)],
      [t.loan.interest_rate, `${loan1Rate}%`, `${loan2Rate}%`, `${Math.abs(loan1Rate - loan2Rate).toFixed(2)}%`],
      [t.loan.tenure_months, loan1Tenure, loan2Tenure, Math.abs(loan1Tenure - loan2Tenure)],
      [t.loan.emi, result.loan1.emi, result.loan2.emi, Math.abs(result.loan1.emi - result.loan2.emi)],
      [t.loan.interest_paid, result.loan1.totalInterest, result.loan2.totalInterest, Math.abs(result.loan1.totalInterest - result.loan2.totalInterest)],
      [t.loan.total_paid, result.loan1.totalAmount, result.loan2.totalAmount, Math.abs(result.loan1.totalAmount - result.loan2.totalAmount)],
    ]

    generateReport(format, 'loan_comparison', headers, data, t.loan.comparison_title)
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.comparison_title}
      description={t.loan.comparison_desc}
      icon={Scale}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<LoanComparisonSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground">{t.loan.loan_1}</h3>
            <InputGroup
              label={t.loan.loan_amount}
              value={loan1Amount}
              onChange={setLoan1Amount}
              min={10000}
              max={10000000}
              step={10000}
              prefix="?"
            />
            <InputGroup
              label={t.loan.interest_rate}
              value={loan1Rate}
              onChange={setLoan1Rate}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
            />
            <InputGroup
              label={t.loan.tenure_months}
              value={loan1Tenure}
              onChange={setLoan1Tenure}
              min={12}
              max={360}
              step={12}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground">{t.loan.loan_2}</h3>
            <InputGroup
              label={t.loan.loan_amount}
              value={loan2Amount}
              onChange={setLoan2Amount}
              min={10000}
              max={10000000}
              step={10000}
              prefix="?"
            />
            <InputGroup
              label={t.loan.interest_rate}
              value={loan2Rate}
              onChange={setLoan2Rate}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
            />
            <InputGroup
              label={t.loan.tenure_months}
              value={loan2Tenure}
              onChange={setLoan2Tenure}
              min={12}
              max={360}
              step={12}
            />
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.better_option}
              value={result.betterOption}
              type="highlight"
            />
            <ResultCard
              label={t.loan.interest_saved}
              value={`₹${Math.abs(result.loan1.totalInterest - result.loan2.totalInterest).toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.difference}
              value={`₹${Math.abs(result.emiDifference).toLocaleString()} / month`}
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
                  <Bar dataKey={t.loan.loan_1} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={t.loan.loan_2} fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    />
  )
}
