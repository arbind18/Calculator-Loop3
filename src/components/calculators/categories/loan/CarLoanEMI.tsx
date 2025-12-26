"use client"

import { useState, useEffect } from "react"
import { Car, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { CarLoanSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanEMI, LoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import toast from "react-hot-toast"
import type { DownloadOptions } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { aggregateLoanScheduleByYear, filterScheduleByYearRange } from "@/lib/logic/scheduleAggregations"

export function CarLoanEMI() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(800000)
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(60)
  const [result, setResult] = useState<LoanResult | null>(null)
  const [optimisticResult, setOptimisticResult] = useState<LoanResult | null>(null)
  const [pessimisticResult, setPessimisticResult] = useState<LoanResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')
  const [scenario, setScenario] = useState<"base" | "optimistic" | "pessimistic" | "compare">("base")
  const [scheduleView, setScheduleView] = useState<"monthly" | "yearly">("monthly")

  const handleCalculate = () => {
    if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
      toast.error("Loan amount must be greater than 0")
      return
    }
    if (!Number.isFinite(interestRate) || interestRate <= 0) {
      toast.error("Interest rate must be greater than 0")
      return
    }
    if (!Number.isFinite(tenure) || tenure <= 0) {
      toast.error("Tenure must be greater than 0")
      return
    }

    const base = calculateLoanEMI({
      loanAmount,
      interestRate,
      tenureMonths: tenure,
    })

    const optimisticRate = Math.max(0.1, interestRate - 1)
    const pessimisticRate = interestRate + 1

    const optimistic = calculateLoanEMI({
      loanAmount,
      interestRate: optimisticRate,
      tenureMonths: tenure,
    })

    const pessimistic = calculateLoanEMI({
      loanAmount,
      interestRate: pessimisticRate,
      tenureMonths: tenure,
    })

    setResult(base)
    setOptimisticResult(optimistic)
    setPessimisticResult(pessimistic)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure])

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

  const handleClear = () => {
    setLoanAmount(800000)
    setInterestRate(9.5)
    setTenure(60)
    setResult(null)
    setOptimisticResult(null)
    setPessimisticResult(null)
    setScenario("base")
    setScheduleView("monthly")
  }

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
      [t.loan.tenure_months]: tenure,
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

    generateReport(format, "car_loan_schedule", headers, data, t.loan.car_loan_title, metadata)
  }

  const renderMonthlySchedule = (schedule: LoanResult["schedule"]) => {
    if (!schedule?.length) return null
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.loan.remaining_months}</TableHead>
            <TableHead>{t.loan.principal_paid}</TableHead>
            <TableHead>{t.loan.interest_paid}</TableHead>
            <TableHead>{t.loan.total_paid}</TableHead>
            <TableHead>{t.loan.remaining_balance}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((row) => (
            <TableRow key={row.month}>
              <TableCell>{row.month}</TableCell>
              <TableCell>{`₹${(row.principal ?? 0).toLocaleString()}`}</TableCell>
              <TableCell>{`₹${(row.interest ?? 0).toLocaleString()}`}</TableCell>
              <TableCell>{`₹${(row.totalPayment ?? 0).toLocaleString()}`}</TableCell>
              <TableCell>{`₹${(row.balance ?? 0).toLocaleString()}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const renderYearlySchedule = (schedule: LoanResult["schedule"]) => {
    if (!schedule?.length) return null
    const yearly = aggregateLoanScheduleByYear(schedule)
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Year</TableHead>
            <TableHead>{t.loan.principal_paid}</TableHead>
            <TableHead>{t.loan.interest_paid}</TableHead>
            <TableHead>{t.loan.total_paid}</TableHead>
            <TableHead>{t.loan.remaining_balance}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {yearly.map((row) => (
            <TableRow key={row.year}>
              <TableCell>{row.year}</TableCell>
              <TableCell>{`₹${Math.round(row.principalPaid).toLocaleString()}`}</TableCell>
              <TableCell>{`₹${Math.round(row.interestPaid).toLocaleString()}`}</TableCell>
              <TableCell>{`₹${Math.round(row.totalPaid).toLocaleString()}`}</TableCell>
              <TableCell>{`₹${Math.round(row.endingBalance).toLocaleString()}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.car_loan_title}
      description={t.loan.car_loan_desc}
      icon={Car}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<CarLoanSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.loan_amount}
            value={loanAmount}
            onChange={setLoanAmount}
            min={100000}
            max={10000000}
            step={10000}
            prefix="₹"
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
            max={84}
            step={12}
            helpText={`${(tenure / 12).toFixed(1)} Years`}
          />
        </div>
      }
      result={result && (
        <div className="mt-6 space-y-6">
          <Tabs value={scenario} onValueChange={(v) => setScenario(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="base">Base</TabsTrigger>
              <TabsTrigger value="optimistic">Optimistic</TabsTrigger>
              <TabsTrigger value="pessimistic">Pessimistic</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
            </TabsList>

            <TabsContent value="base" className="mt-4">
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard label={t.loan.emi} value={`₹${result.emi.toLocaleString()}`} type="highlight" />
                  <ResultCard label={t.loan.interest_paid} value={`₹${result.totalInterest.toLocaleString()}`} type="warning" />
                  <ResultCard label={t.loan.total_paid} value={`₹${result.totalAmount.toLocaleString()}`} type="default" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="optimistic" className="mt-4">
              {optimisticResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard label={t.loan.emi} value={`₹${optimisticResult.emi.toLocaleString()}`} type="highlight" />
                  <ResultCard label={t.loan.interest_paid} value={`₹${optimisticResult.totalInterest.toLocaleString()}`} type="warning" />
                  <ResultCard label={t.loan.total_paid} value={`₹${optimisticResult.totalAmount.toLocaleString()}`} type="default" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="pessimistic" className="mt-4">
              {pessimisticResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultCard label={t.loan.emi} value={`₹${pessimisticResult.emi.toLocaleString()}`} type="highlight" />
                  <ResultCard label={t.loan.interest_paid} value={`₹${pessimisticResult.totalInterest.toLocaleString()}`} type="warning" />
                  <ResultCard label={t.loan.total_paid} value={`₹${pessimisticResult.totalAmount.toLocaleString()}`} type="default" />
                </div>
              )}
            </TabsContent>

            <TabsContent value="compare" className="mt-4">
              {result && optimisticResult && pessimisticResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <ResultCard label="Base EMI" value={`₹${result.emi.toLocaleString()}`} type="default" />
                  <ResultCard label="Optimistic EMI" value={`₹${optimisticResult.emi.toLocaleString()}`} type="highlight" />
                  <ResultCard label="Pessimistic EMI" value={`₹${pessimisticResult.emi.toLocaleString()}`} type="warning" />
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
                  <Tooltip
                    formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="base" stroke="#3b82f6" dot={false} />
                  <Line type="monotone" dataKey="optimistic" stroke="#22c55e" dot={false} />
                  <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <>
              <ChartToggle
                view={chartView}
                onChange={setChartView}
                options={[
                  { value: "pie", label: t.common.distribution, icon: PieChartIcon },
                  { value: "graph", label: t.common.growth_chart, icon: TrendingUp },
                ]}
              />
              <div className="h-[300px] w-full">
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
                      <Tooltip
                        formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  ) : (
                    <AreaChart data={activeResult.schedule}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area type="monotone" dataKey="balance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
      schedule={activeResult?.schedule && scenario !== "compare" && (
        <div className="space-y-4">
          <Tabs value={scheduleView} onValueChange={(v) => setScheduleView(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Year-wise</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">{renderMonthlySchedule(activeResult.schedule)}</TabsContent>
            <TabsContent value="yearly">{renderYearlySchedule(activeResult.schedule)}</TabsContent>
          </Tabs>
        </div>
      )}
    />
  )
}
