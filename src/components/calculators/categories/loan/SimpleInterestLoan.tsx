"use client"

import { useState, useEffect } from "react"
import { Percent, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { SimpleInterestSeoContent } from "@/components/calculators/seo/BankingSeo"
import { calculateSimpleInterest, SimpleInterestResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function SimpleInterestLoan() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(10)
  const [time, setTime] = useState(3)
  const [result, setResult] = useState<SimpleInterestResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateSimpleInterest({
      principal,
      rate,
      timeYears: time
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [principal, rate, time])

  const chartData = result ? [
    { name: t.loan.principal_paid, value: result.principal, color: '#3b82f6' },
    { name: t.loan.interest_paid, value: result.interest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setPrincipal(500000)
    setRate(10)
    setTime(3)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result || !result.schedule) return

    const headers = [t.common.result, t.loan.principal_paid, t.loan.interest_paid, t.loan.total_paid]
    const data = result.schedule.map((row) => [
      row.year,
      row.principal,
      row.interest,
      row.balance
    ])

    generateReport(format, 'simple_interest_schedule', headers, data, t.loan.simple_interest_title, {
      [t.loan.loan_amount]: principal,
      [t.loan.interest_rate]: `${rate}%`,
      [t.loan.tenure_years]: time
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.simple_interest_title}
      description={t.loan.simple_interest_desc}
      icon={Percent}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<SimpleInterestSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.loan_amount}
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={100000000}
            step={1000}
            prefix="?"
          />
          <InputGroup
            label={t.loan.interest_rate}
            value={rate}
            onChange={setRate}
            min={0.1}
            max={50}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.tenure_years}
            value={time}
            onChange={setTime}
            min={1}
            max={30}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.interest_paid}
              value={`₹${result.interest.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.total_paid}
              value={`₹${result.totalAmount.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.principal_paid}
              value={`₹${result.principal.toLocaleString()}`}
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
                    <XAxis dataKey="year" className="text-xs" />
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
