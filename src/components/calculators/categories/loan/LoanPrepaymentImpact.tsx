"use client"

import { useState, useEffect } from "react"
import { FastForward, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { PrepaymentSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateLoanPrepaymentImpact } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import toast from "react-hot-toast"

export function LoanPrepaymentImpact() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(120)
  const [prepayment, setPrepayment] = useState(100000)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar')
  const [scheduleTab, setScheduleTab] = useState<"with" | "original">("with")

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
    if (!Number.isFinite(prepayment) || prepayment < 0) {
      toast.error("Prepayment must be 0 or more")
      return
    }

    const impact = calculateLoanPrepaymentImpact({
      loanAmount,
      interestRate,
      tenureMonths: tenure,
      prepaymentAmount: prepayment,
    })

    setResult(impact)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure, prepayment])

  const chartData = result ? [
    {
      name: t.loan.interest_paid,
      [t.common.result]: result.original.totalInterest,
      [t.loan.prepayment_impact_title]: result.withPrepayment.totalInterest,
    },
    {
      name: t.loan.total_paid,
      [t.common.result]: result.original.totalAmount,
      [t.loan.prepayment_impact_title]: result.withPrepayment.totalAmount,
    },
  ] : []

  const handleClear = () => {
    setLoanAmount(1000000)
    setInterestRate(10)
    setTenure(120)
    setPrepayment(100000)
    setResult(null)
    setScheduleTab("with")
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.loan.original_emi, t.loan.new_emi, t.loan.difference]
    const data = [
      [t.loan.principal_paid, loanAmount, loanAmount - prepayment, prepayment],
      [t.loan.emi, result.original.emi, result.withPrepayment.emi, result.original.emi - result.withPrepayment.emi],
      [t.loan.interest_paid, result.original.totalInterest, result.withPrepayment.totalInterest, result.interestSaved],
      [t.loan.total_paid, result.original.totalAmount, result.withPrepayment.totalAmount, result.original.totalAmount - result.withPrepayment.totalAmount],
    ]

    generateReport(format, 'prepayment_impact', headers, data, t.loan.prepayment_impact_title)
  }

  const renderSchedule = (schedule: Array<any>) => {
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
            {schedule.map((row: any) => (
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

  return (
    <FinancialCalculatorTemplate
      title={t.loan.prepayment_impact_title}
      description={t.loan.prepayment_impact_desc}
      icon={FastForward}
      calculate={handleCalculate}
      values={[loanAmount, interestRate, tenure, prepayment]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals?.[0] ?? 1000000))
        setInterestRate(Number(vals?.[1] ?? 10))
        setTenure(Number(vals?.[2] ?? 120))
        setPrepayment(Number(vals?.[3] ?? 100000))
      }}
      seoContent={<PrepaymentSeoContent />}
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
            label={t.loan.prepayment_amount}
            value={prepayment}
            onChange={setPrepayment}
            min={1000}
            max={loanAmount - 1000}
            step={1000}
            prefix="?"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.interest_saved}
              value={`₹${(result.interestSaved ?? 0).toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.new_emi}
              value={`₹${(result.withPrepayment?.emi ?? 0).toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.original_emi}
              value={`₹${(result.original?.emi ?? 0).toLocaleString()}`}
              type="default"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'bar', label: t.common.growth_chart, icon: TrendingUp }
              ]}
            />

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any) => `₹${(value ?? 0).toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey={t.common.result} name="Original" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={t.loan.prepayment_impact_title} name="With Prepayment" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      schedule={result?.withPrepayment?.schedule && (
        <div className="space-y-4">
          <Tabs value={scheduleTab} onValueChange={(v) => setScheduleTab(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="with">With Prepayment</TabsTrigger>
              <TabsTrigger value="original">Original</TabsTrigger>
            </TabsList>
            <TabsContent value="with">{renderSchedule(result.withPrepayment.schedule)}</TabsContent>
            <TabsContent value="original">{renderSchedule(result.original.schedule)}</TabsContent>
          </Tabs>
        </div>
      )}
    />
  )
}
