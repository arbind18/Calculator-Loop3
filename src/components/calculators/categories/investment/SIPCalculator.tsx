"use client"

import { useState, useEffect } from "react"
import { Calculator, TrendingUp, PieChart as PieChartIcon, Download, Printer, Share2, RotateCcw, Trash2, Sparkles, FileSpreadsheet, FileText, FileJson, ImageIcon, Code, Globe, Link2, Database, Archive, Lock, Image as ImageIcon2 } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { ComprehensiveSIPSeo } from "@/components/calculators/seo/ComprehensiveSIPSeo"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { useTranslation } from "@/hooks/useTranslation"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function SIPCalculator() {
  const { t, lang } = useTranslation()
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [timePeriod, setTimePeriod] = useState(10)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')
  const [autoCalculate, setAutoCalculate] = useState(false)
  const [previousData, setPreviousData] = useState<any>(null)

  // Delete/Clear function - Set all to 0
  const handleReset = () => {
    // Store current data before clearing
    setPreviousData({
      monthlyInvestment,
      expectedReturn,
      timePeriod,
      result
    })
    // Clear all to 0
    setMonthlyInvestment(0)
    setExpectedReturn(0)
    setTimePeriod(0)
    setResult(null)
  }

  // Reload function - Restore previous data
  const handleReload = () => {
    if (previousData) {
      setMonthlyInvestment(previousData.monthlyInvestment)
      setExpectedReturn(previousData.expectedReturn)
      setTimePeriod(previousData.timePeriod)
      setResult(previousData.result)
    }
  }

  // Share function
  const handleShare = async () => {
    if (!result) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SIP Calculator Result',
          text: `Invest ₹${monthlyInvestment}/month for ${timePeriod} years = ₹${result.maturityAmount.toLocaleString('en-IN')} maturity`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Auto calculate on input change
  useEffect(() => {
    if (autoCalculate && monthlyInvestment > 0 && timePeriod > 0) {
      calculate()
    }
  }, [autoCalculate, monthlyInvestment, expectedReturn, timePeriod])

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
        ;(async () => {
          const ExcelJS = await import('exceljs')
          const workbook = new ExcelJS.Workbook()
          const worksheet = workbook.addWorksheet('SIP')

          worksheet.addRow(headers)
          data.forEach((row: any[]) => worksheet.addRow(row))
          worksheet.getRow(1).font = { bold: true }

          const buffer = await workbook.xlsx.writeBuffer()
          const mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          const blob = new Blob([buffer as ArrayBuffer], { type: mime })
          downloadFile(blob, 'sip_calculator.xlsx', mime)
        })()
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

  const downloadFile = (content: Blob | string, fileName: string, type: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: `${type};charset=utf-8;` })
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
        <>
          {/* Action Toolbar - Always Visible */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Auto Calculate</span>
              <Switch
                checked={autoCalculate}
                onCheckedChange={setAutoCalculate}
                className="ml-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Clear all data"
                className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReload}
                title="Reload last values"
                className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                title="Share results"
                className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrint}
                title="Print"
                className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download options"
                    className="h-8 w-8 hover:bg-white dark:hover:bg-slate-800 bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 max-h-[500px] overflow-y-auto">
                  <DropdownMenuLabel className="font-semibold">Download Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* BASIC & STANDARD */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">BASIC & STANDARD</div>
                  <DropdownMenuItem onClick={() => handleDownload('csv')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                    CSV (Excel)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                    PDF Document
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileJson className="mr-2 h-4 w-4 text-yellow-600" />
                    JSON Data
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* IMAGES & VISUALS */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">IMAGES & VISUALS</div>
                  <DropdownMenuItem>
                    <ImageIcon className="mr-2 h-4 w-4 text-purple-600" />
                    PNG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ImageIcon className="mr-2 h-4 w-4 text-blue-600" />
                    JPG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Code className="mr-2 h-4 w-4 text-orange-600" />
                    SVG Vector
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* ADVANCED DOCS */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ADVANCED DOCS</div>
                  <DropdownMenuItem>
                    <Globe className="mr-2 h-4 w-4 text-blue-600" />
                    HTML Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    Word (.docx)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4 text-orange-600" />
                    PowerPoint (.pptx)
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* DEVELOPER DATA */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">DEVELOPER DATA</div>
                  <DropdownMenuItem>
                    <Code className="mr-2 h-4 w-4 text-purple-600" />
                    XML Data
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link2 className="mr-2 h-4 w-4 text-blue-600" />
                    API Link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Database className="mr-2 h-4 w-4 text-green-600" />
                    SQL Insert
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Database className="mr-2 h-4 w-4 text-teal-600" />
                    SQLite DB
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* ARCHIVES & SECURITY */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ARCHIVES & SECURITY</div>
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4 text-gray-600" />
                    ZIP Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Lock className="mr-2 h-4 w-4 text-red-600" />
                    Encrypted PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Lock className="mr-2 h-4 w-4 text-orange-600" />
                    Password ZIP
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Result Cards */}
          {result && (
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
          )}
        </>
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
