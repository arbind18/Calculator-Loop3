"use client"

import { useState } from "react"
import { Calculator, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { ComprehensiveSIPSeo } from "@/components/calculators/seo/ComprehensiveSIPSeo"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { useTranslation } from "@/hooks/useTranslation"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function SIPCalculator() {
  const { t, lang } = useTranslation()
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [timePeriod, setTimePeriod] = useState(10)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const calculate = () => {
    const P = monthlyInvestment
    const r = expectedReturn / 100 / 12
    const n = timePeriod * 12

    // FV = P × [(1 + r)^n - 1] / r × (1 + r)
    const maturityAmount = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    const totalInvested = P * n
    const returns = maturityAmount - totalInvested

    // Generate Schedule
    const schedule = []
    let currentBalance = 0
    let totalInvestedSoFar = 0
    let currentYear = new Date().getFullYear()

    for (let i = 1; i <= n; i++) {
      totalInvestedSoFar += P
      const interest = (currentBalance + P) * r
      currentBalance = currentBalance + P + interest

      if (i % 12 === 0) {
        schedule.push({
          year: currentYear + (i / 12),
          invested: Math.round(totalInvestedSoFar),
          value: Math.round(currentBalance),
          returns: Math.round(currentBalance - totalInvestedSoFar)
        })
      }
    }

    setResult({
      maturityAmount: Math.round(maturityAmount),
      totalInvested: Math.round(totalInvested),
      returns: Math.round(returns),
      schedule: schedule
    })
  }

  const chartData = result ? [
    { name: 'Invested Amount', value: result.totalInvested, color: '#3b82f6' },
    { name: 'Est. Returns', value: result.returns, color: '#22c55e' },
  ] : []

  const handleClear = () => {
    setMonthlyInvestment(0)
    setExpectedReturn(0)
    setTimePeriod(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = ['Metric', 'Value']
    const data = [
      [t('investment.monthly_investment') || 'Monthly Investment', monthlyInvestment],
      [t('investment.expected_return') || 'Expected Return', `${expectedReturn}%`],
      [t('investment.time_period') || 'Time Period', `${timePeriod} Years`],
      [t('investment.invested_amount') || 'Total Invested', result.totalInvested],
      [t('investment.est_returns') || 'Est. Returns', result.returns],
      [t('investment.total_value') || 'Total Value', result.maturityAmount]
    ]

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'sip_calculator.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "SIP")
        XLSX.writeFile(wb, "sip_calculator.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text(t('investment.sip_title') || "SIP Calculator", 14, 15)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 25,
        })
        doc.save("sip_calculator.pdf")
        break
    }
  }

  const downloadFile = (content: string, fileName: string, type: string) => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <FinancialCalculatorTemplate
      title={t('investment.sip_title')}
      description={t('investment.sip_desc')}
      icon={TrendingUp}
      calculate={calculate}
      onClear={handleClear}
      onDownload={handleDownload}
      values={[monthlyInvestment, expectedReturn, timePeriod]}
      onRestoreAction={(vals) => {
        setMonthlyInvestment(Number(vals?.[0] ?? 0))
        setExpectedReturn(Number(vals?.[1] ?? 0))
        setTimePeriod(Number(vals?.[2] ?? 0))
      }}
      seoContent={
        lang === 'en' ? (
          <ComprehensiveSIPSeo />
        ) : (
          <SeoContentGenerator
            title={t('investment.sip_title')}
            description={t('investment.sip_desc')}
            categoryName={t('nav.financial')}
          />
        )
      }
      inputs={
        <div className="space-y-6">
          <InputGroup
            label={t('investment.monthly_investment')}
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
            min={500}
            max={1000000}
            step={500}
            prefix="₹"
          />
          <InputGroup
            label={t('investment.expected_return')}
            value={expectedReturn}
            onChange={setExpectedReturn}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
          />
          <InputGroup
            label={t('investment.time_period')}
            value={timePeriod}
            onChange={setTimePeriod}
            min={1}
            max={40}
            step={1}
            suffix="Years"
          />
        </div>
      }
      result={
        result && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard
                label={t('investment.invested_amount')}
                value={result.totalInvested}
                type="default"
                prefix="₹"
                icon={Calculator}
              />
              <ResultCard
                label={t('investment.est_returns')}
                value={result.returns}
                type="success"
                prefix="₹"
                icon={TrendingUp}
              />
              <ResultCard
                label={t('investment.total_value')}
                value={result.maturityAmount}
                type="highlight"
                prefix="₹"
                icon={PieChartIcon}
              />
            </div>
          </div>
        )
      }
      charts={
        result && (
          <div className="space-y-4">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: 'Breakdown', icon: PieChartIcon },
                { value: 'graph', label: 'Growth', icon: TrendingUp },
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
                      formatter={(value) => {
                        const raw = Array.isArray(value) ? value[0] : value
                        const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                        return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                      }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                ) : (
                  <AreaChart data={result.schedule}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="year"
                      className="text-xs text-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      className="text-xs text-muted-foreground"
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) => {
                        const raw = Array.isArray(value) ? value[0] : value
                        const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                        return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                      }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Total Value"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      name="Invested Amount"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorInvested)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )
      }
    />
  )
}
