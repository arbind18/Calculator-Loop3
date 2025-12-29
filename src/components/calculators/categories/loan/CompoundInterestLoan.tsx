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
import { calculateCompoundInterest, CompoundInterestResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function CompoundInterestLoan() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(10)
  const [time, setTime] = useState(5)
  const [frequency, setFrequency] = useState(12) // Monthly
  const [result, setResult] = useState<CompoundInterestResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateCompoundInterest({
      principal,
      rate,
      timeYears: time,
      frequency
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [principal, rate, time, frequency])

  const chartData = result ? [
    { name: t.loan.principal_amount, value: principal, color: '#3b82f6' },
    { name: t.loan.interest_amount, value: result.interest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setPrincipal(100000)
    setRate(10)
    setTime(5)
    setFrequency(12)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.total_amount, result.totalAmount],
      [t.loan.interest_amount, result.interest]
    ]

    generateReport(format, 'compound_interest_loan', headers, data, t.loan.compound_interest_loan_title, {
      [t.loan.principal_amount]: `₹${principal}`,
      [t.loan.interest_rate]: `${rate}%`,
      [t.loan.time_period]: `${time}`,
      [t.loan.compounding_frequency]: `${frequency}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.compound_interest_loan_title}
      description={t.loan.compound_interest_loan_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      values={[principal, rate, time, frequency]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals?.[0] ?? 100000))
        setRate(Number(vals?.[1] ?? 10))
        setTime(Number(vals?.[2] ?? 5))
        setFrequency(Number(vals?.[3] ?? 12))
      }}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.principal_amount}
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={100000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.interest_rate}
            value={rate}
            onChange={setRate}
            min={0.1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.time_period}
            value={time}
            onChange={setTime}
            min={1}
            max={30}
            step={1}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.loan.compounding_frequency}</label>
            <select 
              className="w-full p-2 border rounded-md bg-background"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
            >
              <option value={1}>{t.loan.annually}</option>
              <option value={2}>{t.loan.semi_annually}</option>
              <option value={4}>{t.loan.quarterly}</option>
              <option value={12}>{t.loan.monthly}</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.total_amount}
              value={`₹${result.totalAmount.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.interest_amount}
              value={`₹${result.interest.toLocaleString()}`}
              type="highlight"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: t.common.distribution, icon: PieChartIcon },
                { value: 'graph', label: t.common.growth_chart, icon: DollarSign }
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
