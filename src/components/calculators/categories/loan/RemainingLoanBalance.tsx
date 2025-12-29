"use client"

import { useState, useEffect } from "react"
import { Scale, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { AmortizationSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEMI, calculateRemainingBalance } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function RemainingLoanBalance() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(120)
  const [paidMonths, setPaidMonths] = useState(24)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const emiResult = calculateLoanEMI({
      loanAmount,
      interestRate,
      tenureMonths: tenure
    })
    
    const remainingBalance = calculateRemainingBalance(loanAmount, interestRate, tenure, paidMonths)
    
    const remainingMonths = tenure - paidMonths
    const totalPaid = emiResult.emi * paidMonths
    const principalPaid = loanAmount - remainingBalance
    const interestPaid = totalPaid - principalPaid

    setResult({
      emi: emiResult.emi,
      remainingBalance,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interestPaid),
      totalPaid: Math.round(totalPaid),
      remainingMonths
    })
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure, paidMonths])

  const chartData = result ? [
    { name: t.loan.principal_paid, value: result.principalPaid, color: '#22c55e' },
    { name: t.loan.remaining_balance, value: result.remainingBalance, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setLoanAmount(1000000)
    setInterestRate(10)
    setTenure(120)
    setPaidMonths(24)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.calculate]
    const data = [
      [t.loan.loan_amount, loanAmount],
      [t.loan.interest_rate, `${interestRate}%`],
      [t.loan.tenure_months, tenure],
      [t.loan.paid_months, paidMonths],
      [t.loan.emi, result.emi],
      [t.loan.remaining_balance, result.remainingBalance],
      [t.loan.principal_paid, result.principalPaid],
      [t.loan.interest_paid, result.interestPaid],
      [t.loan.total_paid, result.totalPaid]
    ]

    generateReport(format, 'remaining_loan_balance', headers, data, t.loan.remaining_balance_title)
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.remaining_balance_title}
      description={t.loan.remaining_balance_desc}
      icon={Scale}
      calculate={handleCalculate}
      onClear={handleClear}
      values={[loanAmount, interestRate, tenure, paidMonths]}
      onRestoreAction={(vals) => {
        const nextAmount = Number(vals?.[0])
        const nextRate = Number(vals?.[1])
        const nextTenure = Number(vals?.[2])
        const nextPaid = Number(vals?.[3])
        if (Number.isFinite(nextAmount)) setLoanAmount(nextAmount)
        if (Number.isFinite(nextRate)) setInterestRate(nextRate)
        if (Number.isFinite(nextTenure)) setTenure(nextTenure)
        if (Number.isFinite(nextPaid)) setPaidMonths(nextPaid)
      }}
      seoContent={<AmortizationSeoContent />}
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
            label={t.loan.paid_months}
            value={paidMonths}
            onChange={setPaidMonths}
            min={1}
            max={tenure - 1}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.remaining_balance}
              value={`₹${result.remainingBalance.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.principal_paid}
              value={`₹${result.principalPaid.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.interest_paid}
              value={`₹${result.interestPaid.toLocaleString()}`}
              type="warning"
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
