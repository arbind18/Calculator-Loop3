"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Home, TrendingUp, PieChart as PieChartIcon, ChevronDown, ChevronUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { ComprehensiveHomeLoanSeo } from "@/components/calculators/seo/ComprehensiveLoanSeo"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { calculateHomeLoanEMI, HomeLoanResult } from "@/lib/logic/loan"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { saveCalculation } from "@/lib/history"
import type { DownloadOptions } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { aggregateLoanScheduleByYear, filterScheduleByYearRange } from "@/lib/logic/scheduleAggregations"

export function HomeLoanEMI() {
  const { data: session } = useSession()
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  const searchParams = useSearchParams()
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Basic Inputs
  const [loanAmount, setLoanAmount] = useState(Number(searchParams.get('loanAmount')) || 5000000)
  const [interestRate, setInterestRate] = useState(Number(searchParams.get('interestRate')) || 8.5)
  const [tenureYears, setTenureYears] = useState(Number(searchParams.get('tenureYears')) || 20)
  
  // Prepayment Inputs
  const [showPrepayment, setShowPrepayment] = useState(searchParams.get('showPrepayment') === 'true')
  const [monthlyExtra, setMonthlyExtra] = useState(Number(searchParams.get('monthlyExtra')) || 0)
  const [annualExtra, setAnnualExtra] = useState(Number(searchParams.get('annualExtra')) || 0)
  const [scenario, setScenario] = useState<"base" | "optimistic" | "pessimistic" | "compare">("base")
  const [scheduleView, setScheduleView] = useState<"monthly" | "yearly">("yearly")
  
  const [result, setResult] = useState<(HomeLoanResult & { isPrepaymentActive: boolean }) | null>(null)
  const [optimisticResult, setOptimisticResult] = useState<(HomeLoanResult & { isPrepaymentActive: boolean }) | null>(null)
  const [pessimisticResult, setPessimisticResult] = useState<(HomeLoanResult & { isPrepaymentActive: boolean }) | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
      toast.error("Loan amount must be greater than 0")
      return
    }
    if (!Number.isFinite(interestRate) || interestRate <= 0) {
      toast.error("Interest rate must be greater than 0")
      return
    }
    if (!Number.isFinite(tenureYears) || tenureYears <= 0) {
      toast.error("Tenure must be greater than 0")
      return
    }
    if (!Number.isFinite(monthlyExtra) || monthlyExtra < 0) {
      toast.error("Monthly extra must be 0 or more")
      return
    }
    if (!Number.isFinite(annualExtra) || annualExtra < 0) {
      toast.error("Annual extra must be 0 or more")
      return
    }

    const isPrepaymentActive = showPrepayment && (monthlyExtra > 0 || annualExtra > 0)

    const base = calculateHomeLoanEMI({
      loanAmount,
      interestRate,
      tenureMonths: tenureYears * 12,
      showPrepayment,
      monthlyExtra,
      annualExtra,
    })

    const optimisticRate = Math.max(0.1, interestRate - 0.5)
    const pessimisticRate = interestRate + 0.5

    const optimistic = calculateHomeLoanEMI({
      loanAmount,
      interestRate: optimisticRate,
      tenureMonths: tenureYears * 12,
      showPrepayment,
      monthlyExtra,
      annualExtra,
    })

    const pessimistic = calculateHomeLoanEMI({
      loanAmount,
      interestRate: pessimisticRate,
      tenureMonths: tenureYears * 12,
      showPrepayment,
      monthlyExtra,
      annualExtra,
    })

    setResult({ ...base, isPrepaymentActive })
    setOptimisticResult({ ...optimistic, isPrepaymentActive })
    setPessimisticResult({ ...pessimistic, isPrepaymentActive })

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCalculation({
        calculatorType: 'home-loan-emi',
        calculatorName: t.loan.home_loan_title,
        category: 'loan',
        inputs: {
          loanAmount,
          interestRate,
          tenureYears,
          showPrepayment,
          monthlyExtra,
          annualExtra
        },
        result: { ...base, isPrepaymentActive }
      }, session)
    }, 2000)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenureYears, showPrepayment, monthlyExtra, annualExtra])

  const activeResult =
    scenario === "optimistic" ? optimisticResult : scenario === "pessimistic" ? pessimisticResult : result

  const chartData = activeResult ? [
    { name: t.loan.principal_paid, value: activeResult.principal, color: '#3b82f6' },
    { name: t.loan.interest_paid, value: activeResult.totalInterest, color: '#ef4444' },
  ] : []

  const comparisonData = (() => {
    if (!result?.schedule || !optimisticResult?.schedule || !pessimisticResult?.schedule) return []

    const maxMonths = Math.max(
      result.schedule.length,
      optimisticResult.schedule.length,
      pessimisticResult.schedule.length
    )

    const byMonth: Array<{ month: number; base?: number; optimistic?: number; pessimistic?: number }> = []
    for (let i = 0; i < maxMonths; i++) {
      const month = i + 1
      byMonth.push({
        month,
        base: result.schedule[i]?.balance,
        optimistic: optimisticResult.schedule[i]?.balance,
        pessimistic: pessimisticResult.schedule[i]?.balance,
      })
    }
    return byMonth
  })()

  const handleDownload = (format: string, options?: DownloadOptions) => {
    const base = result
    const opt = optimisticResult
    const pes = pessimisticResult

    const selected = scenario === "optimistic" ? opt : scenario === "pessimistic" ? pes : base
    if (!selected) return

    const includeSummary = options?.includeSummary ?? true
    const includeSchedule = options?.includeSchedule ?? true
    const scheduleRange = options?.scheduleRange ?? "all"

    const metadata: Record<string, any> = {
      [t.loan.loan_amount]: loanAmount,
      [t.loan.interest_rate]: `${interestRate}%`,
      [t.loan.tenure_years]: tenureYears,
      [t.loan.monthly_extra]: monthlyExtra,
      [t.loan.annual_extra]: annualExtra,
      "Prepayment Enabled": Boolean(showPrepayment),
    }

    if (includeSummary) {
      if (scenario === "compare" && base && opt && pes) {
        metadata["Scenario: Base EMI"] = base.emi
        metadata["Scenario: Optimistic EMI"] = opt.emi
        metadata["Scenario: Pessimistic EMI"] = pes.emi
      } else {
        metadata["Scenario"] = scenario
        metadata["EMI"] = selected.emi
        metadata["Total Interest"] = selected.totalInterest
        metadata["Total Amount"] = selected.totalAmount
      }
    }

    const headers = [
      t.loan.remaining_months,
      t.loan.principal_paid,
      t.loan.interest_paid,
      t.loan.total_paid,
      t.loan.remaining_balance,
    ]

    const schedule = selected.schedule ?? []
    const filtered = includeSchedule
      ? filterScheduleByYearRange(
          schedule,
          scheduleRange,
          options?.customRangeStart,
          options?.customRangeEnd
        )
      : []

    const data = filtered.map((row) => [
      row.month,
      row.principal,
      row.interest,
      row.totalPayment,
      row.balance,
    ])

    generateReport(format, "home_loan_schedule", headers, data, t.loan.home_loan_title, metadata)
  }

  const renderMonthlySchedule = (schedule: HomeLoanResult["schedule"]) => {
    if (!schedule?.length) return null
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t.loan.remaining_months}</TableHead>
              <TableHead className="text-right">{t.loan.principal_paid}</TableHead>
              <TableHead className="text-right">{t.loan.interest_paid}</TableHead>
              <TableHead className="text-right">{t.loan.total_paid}</TableHead>
              <TableHead className="text-right">{t.loan.remaining_balance}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.principal ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.interest ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.totalPayment ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.balance ?? 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderYearlySchedule = (schedule: HomeLoanResult["schedule"]) => {
    if (!schedule?.length) return null
    const yearly = aggregateLoanScheduleByYear(schedule)
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">{t.loan.principal_paid}</TableHead>
              <TableHead className="text-right">{t.loan.interest_paid}</TableHead>
              <TableHead className="text-right">{t.loan.total_paid}</TableHead>
              <TableHead className="text-right">{t.loan.remaining_balance}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {yearly.map((row) => (
              <TableRow key={row.year}>
                <TableCell>{row.year}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.principalPaid).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.interestPaid).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.totalPaid).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.endingBalance).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleSave = async () => {
    if (!result) return
    
    const calculationData = {
      calculatorType: 'home-loan-emi',
      calculatorName: 'Home Loan EMI Calculator',
      category: 'Loan',
      inputs: {
        loanAmount,
        interestRate,
        tenureYears,
        showPrepayment,
        monthlyExtra,
        annualExtra
      },
      result: result
    }

    try {
      if (session?.user) {
        const res = await fetch('/api/user/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            calculatorType: 'home-loan-emi',
            calculatorName: 'Home Loan EMI Calculator',
            inputs: calculationData.inputs,
            result: calculationData.result,
            notes: '',
            tags: []
          })
        })
        if (!res.ok) throw new Error('Failed to save')
        toast.success("Calculation saved to profile")
      } else {
        const saved = JSON.parse(localStorage.getItem('savedCalculations') || '[]')
        saved.push({
          id: Date.now().toString(),
          ...calculationData,
          savedAt: new Date()
        })
        localStorage.setItem('savedCalculations', JSON.stringify(saved))
        toast.success("Calculation saved to profile")
      }
    } catch (error) {
      console.error("Error saving:", error)
      toast.error("Failed to save calculation")
    }
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.home_loan_title}
      description={t.loan.home_loan_desc}
      icon={Home}
      calculatorId="home-loan-emi"
      onSave={handleSave}
      calculate={handleCalculate}
      values={[loanAmount, interestRate, tenureYears, monthlyExtra, annualExtra, showPrepayment, scenario, scheduleView]}
      seoContent={
        language === 'en' ? (
          <ComprehensiveHomeLoanSeo />
        ) : (
          <SeoContentGenerator
            title={t.loan.home_loan_title}
            description={t.loan.home_loan_desc}
            categoryName={t.nav.financial}
          />
        )
      }
      onClear={() => {
        setLoanAmount(5000000)
        setInterestRate(8.5)
        setTenureYears(20)
        setMonthlyExtra(0)
        setAnnualExtra(0)
        setShowPrepayment(false)
        setScenario("base")
        setScheduleView("yearly")
      }}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals?.[0] ?? 5000000))
        setInterestRate(Number(vals?.[1] ?? 8.5))
        setTenureYears(Number(vals?.[2] ?? 20))
        setMonthlyExtra(Number(vals?.[3] ?? 0))
        setAnnualExtra(Number(vals?.[4] ?? 0))
        setShowPrepayment(Boolean(vals?.[5] ?? false))
        setScenario((vals?.[6] as any) ?? "base")
        setScheduleView((vals?.[7] as any) ?? "yearly")
      }}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-6">
          {/* Basic Inputs */}
          <InputGroup
            label={t.loan.loan_amount}
            value={loanAmount}
            onChange={setLoanAmount}
            min={100000}
            step={10000}
            prefix="₹"
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
            label={t.loan.tenure_years}
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={40}
            step={1}
            suffix="Yr"
          />

          {/* Prepayment Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="space-y-0.5">
              <Label className="text-base">{t.loan.show_prepayment}</Label>
              <p className="text-xs text-muted-foreground">Add extra payments to reduce interest</p>
            </div>
            <Switch
              checked={showPrepayment}
              onCheckedChange={setShowPrepayment}
            />
          </div>

          {/* Prepayment Inputs */}
          {showPrepayment && (
            <div className="space-y-4 p-4 rounded-lg bg-secondary/20 animate-in slide-in-from-top-2">
              <InputGroup
                label={t.loan.monthly_extra}
                value={monthlyExtra}
                onChange={setMonthlyExtra}
                min={0}
                max={loanAmount}
                step={1000}
                prefix="₹"
              />
              <InputGroup
                label={t.loan.annual_extra}
                value={annualExtra}
                onChange={setAnnualExtra}
                min={0}
                max={loanAmount}
                step={5000}
                prefix="₹"
              />
            </div>
          )}
        </div>
      }
      result={result && (
        <div className="mt-6 space-y-6">
          <Tabs value={scenario} onValueChange={(v) => setScenario(v as any)}>
            <div className="w-full max-w-full overflow-x-auto">
              <TabsList className="w-max justify-start">
                <TabsTrigger value="base">Base</TabsTrigger>
                <TabsTrigger value="optimistic">Optimistic</TabsTrigger>
                <TabsTrigger value="pessimistic">Pessimistic</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="base" className="mt-4">
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard label={t.loan.emi} value={result.emi} prefix="₹" type="highlight" />
                  {result.isPrepaymentActive ? (
                    <>
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="text-sm text-muted-foreground mb-1">{t.loan.interest_saved}</div>
                        <div className="text-xl font-bold text-green-600">₹{result.savedInterest.toLocaleString()}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <div className="text-sm text-muted-foreground mb-1">{t.loan.time_saved}</div>
                        <div className="text-xl font-bold text-blue-600">
                          {Math.floor(result.savedTenureMonths / 12)}y {result.savedTenureMonths % 12}m
                        </div>
                      </div>
                      <ResultCard
                        label={t.loan.revised_tenure}
                        value={`${Math.floor(result.revisedTenureMonths / 12)}y ${result.revisedTenureMonths % 12}m`}
                        type="default"
                      />
                    </>
                  ) : (
                    <>
                      <ResultCard label={t.loan.total_interest} value={result.totalInterest} prefix="₹" type="warning" />
                      <ResultCard label={t.loan.total_paid} value={result.totalAmount} prefix="₹" type="default" />
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="optimistic" className="mt-4">
              {optimisticResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard label={t.loan.emi} value={optimisticResult.emi} prefix="₹" type="highlight" />
                  <ResultCard label={t.loan.total_interest} value={optimisticResult.totalInterest} prefix="₹" type="warning" />
                  <ResultCard label={t.loan.total_paid} value={optimisticResult.totalAmount} prefix="₹" type="default" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="pessimistic" className="mt-4">
              {pessimisticResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard label={t.loan.emi} value={pessimisticResult.emi} prefix="₹" type="highlight" />
                  <ResultCard label={t.loan.total_interest} value={pessimisticResult.totalInterest} prefix="₹" type="warning" />
                  <ResultCard label={t.loan.total_paid} value={pessimisticResult.totalAmount} prefix="₹" type="default" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="compare" className="mt-4">
              {result && optimisticResult && pessimisticResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <ResultCard label="Base EMI" value={result.emi} prefix="₹" type="default" />
                  <ResultCard label="Optimistic EMI" value={optimisticResult.emi} prefix="₹" type="highlight" />
                  <ResultCard label="Pessimistic EMI" value={pessimisticResult.emi} prefix="₹" type="warning" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
      charts={activeResult && (
        <div className="space-y-6 w-full">
          {scenario === "compare" ? (
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="base" stroke="#3b82f6" dot={false} />
                  <Line type="monotone" dataKey="optimistic" stroke="#22c55e" dot={false} />
                  <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-4 rounded-xl border bg-card">
              <ChartToggle
                view={chartView}
                onChange={setChartView}
                options={[
                  { value: "pie", label: t.common.distribution, icon: PieChartIcon },
                  { value: "graph", label: t.common.growth_chart, icon: TrendingUp },
                ]}
              />
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === "pie" ? (
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
                      <Tooltip formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <AreaChart data={activeResult.schedule}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`} />
                      <Area type="monotone" dataKey="balance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
      schedule={activeResult?.schedule && scenario !== "compare" && (
        <div className="space-y-4">
          <Tabs value={scheduleView} onValueChange={(v) => setScheduleView(v as any)}>
            <div className="w-full max-w-full overflow-x-auto">
              <TabsList className="w-max justify-start">
                <TabsTrigger value="yearly">Year-wise</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="yearly">{renderYearlySchedule(activeResult.schedule)}</TabsContent>
            <TabsContent value="monthly">{renderMonthlySchedule(activeResult.schedule)}</TabsContent>
          </Tabs>
        </div>
      )}
    />
  )
}
