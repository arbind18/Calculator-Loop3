"use client"

import { useState, useEffect } from "react"
import { Briefcase, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { BusinessLoanSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEMI, LoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function BusinessLoanEMI() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(2000000)
  const [interestRate, setInterestRate] = useState(13)
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
    setLoanAmount(2000000)
    setInterestRate(13)
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

    generateReport(format, 'business_loan_schedule', headers, data, t.loan.business_loan_title, {
      [t.loan.loan_amount]: loanAmount,
      [t.loan.interest_rate]: `${interestRate}%`,
      [t.loan.tenure_months]: tenure
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.business_loan_title}
      description={t.loan.business_loan_desc}
      icon={Briefcase}
      calculate={handleCalculate}
      onClear={handleClear}
      values={[loanAmount, interestRate, tenure]}
      onRestoreAction={(vals) => {
        const nextAmount = Number(vals?.[0])
        const nextRate = Number(vals?.[1])
        const nextTenure = Number(vals?.[2])
        if (Number.isFinite(nextAmount)) setLoanAmount(nextAmount)
        if (Number.isFinite(nextRate)) setInterestRate(nextRate)
        if (Number.isFinite(nextTenure)) setTenure(nextTenure)
      }}
      seoContent={<BusinessLoanSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.loan_amount}
            value={loanAmount}
            onChange={setLoanAmount}
            min={100000}
            max={50000000}
            step={50000}
            prefix="?"
          />
          <InputGroup
            label={t.loan.interest_rate}
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={25}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.tenure_months}
            value={tenure}
            onChange={setTenure}
            min={12}
            max={120}
            step={12}
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
