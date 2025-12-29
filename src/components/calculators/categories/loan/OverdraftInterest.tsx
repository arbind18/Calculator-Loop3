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
import { calculateOverdraftInterest, OverdraftInterestResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function OverdraftInterest() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [limit, setLimit] = useState(500000)
  const [utilized, setUtilized] = useState(200000)
  const [interestRate, setInterestRate] = useState(12)
  const [days, setDays] = useState(30)
  const [result, setResult] = useState<OverdraftInterestResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateOverdraftInterest({
      totalLimit: limit,
      limitUsed: utilized,
      daysUsed: days,
      interestRate
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [limit, utilized, interestRate, days])

  const chartData = result ? [
    { name: t.loan.utilized_amount, value: utilized, color: '#3b82f6' },
    { name: t.loan.available_limit, value: result.availableLimit, color: '#10b981' },
    { name: t.loan.interest_payable, value: result.interestAmount, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setLimit(500000)
    setUtilized(200000)
    setInterestRate(12)
    setDays(30)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.interest_payable, result.interestAmount],
      [t.loan.total_payable, result.totalRepayment],
      [t.loan.available_limit, result.availableLimit]
    ]

    generateReport(format, 'overdraft_interest', headers, data, t.loan.overdraft_interest_title, {
      [t.loan.overdraft_limit]: `₹${limit}`,
      [t.loan.utilized_amount]: `₹${utilized}`,
      [t.loan.interest_rate]: `${interestRate}%`,
      [t.loan.days_utilized]: `${days}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.overdraft_interest_title}
      description={t.loan.overdraft_interest_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      values={[limit, utilized, interestRate, days]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setLimit(Number(vals?.[0] ?? 500000))
        setUtilized(Number(vals?.[1] ?? 200000))
        setInterestRate(Number(vals?.[2] ?? 12))
        setDays(Number(vals?.[3] ?? 30))
      }}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.overdraft_limit}
            value={limit}
            onChange={setLimit}
            min={10000}
            max={100000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.utilized_amount}
            value={utilized}
            onChange={setUtilized}
            min={0}
            max={limit}
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
            label={t.loan.days_utilized}
            value={days}
            onChange={setDays}
            min={1}
            max={365}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.interest_payable}
              value={`₹${result.interestAmount.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.total_payable}
              value={`₹${result.totalRepayment.toLocaleString()}`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.available_limit}
              value={`₹${result.availableLimit.toLocaleString()}`}
              type="success"
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
