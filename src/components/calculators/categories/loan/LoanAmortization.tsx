"use client"

import { useState, useEffect } from "react"
import { Calendar, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { AmortizationSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEMI, LoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function LoanAmortization() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(60)
  const [result, setResult] = useState<LoanResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateLoanEMI({
      loanAmount,
      interestRate,
      tenureMonths: tenure
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure])

  const chartData = result ? [
    { name: t.loan.principal_paid, value: result.principal, color: '#3b82f6' },
    { name: t.loan.interest_paid, value: result.totalInterest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setLoanAmount(1000000)
    setInterestRate(10)
    setTenure(60)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result || !result.schedule) return

    const headers = [t.loan.remaining_months, t.loan.principal_paid, t.loan.interest_paid, t.loan.total_paid, t.loan.remaining_balance]
    const data = result.schedule.map((row) => [
      row.month,
      row.principal,
      row.interest,
      row.totalPayment,
      row.balance
    ])

    generateReport(format, 'loan_amortization_schedule', headers, data, t.loan.amortization_title, {
      [t.loan.loan_amount]: loanAmount,
      [t.loan.interest_rate]: `${interestRate}%`,
      [t.loan.tenure_months]: tenure
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.amortization_title}
      description={t.loan.amortization_desc}
      icon={Calendar}
      calculate={handleCalculate}
      values={[loanAmount, interestRate, tenure]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals?.[0] ?? 1000000))
        setInterestRate(Number(vals?.[1] ?? 10))
        setTenure(Number(vals?.[2] ?? 60))
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
            min={6}
            max={360}
            step={6}
            helpText={`${(tenure / 12).toFixed(1)} Years`}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.emi}
              value={`₹${result.emi.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.interest_paid}
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="warning"
            />
            <ResultCard
              label={t.loan.total_paid}
              value={`₹${result.totalAmount.toLocaleString()}`}
              type="default"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: t.common.distribution, icon: PieChartIcon },
                { value: 'graph', label: t.common.growth_chart, icon: TrendingUp }
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
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
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
