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
import { calculateStepUpEMI, StepUpEMIResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function StepUpEMI() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(2000000)
  const [interestRate, setInterestRate] = useState(9)
  const [tenure, setTenure] = useState(20)
  const [stepUpPercent, setStepUpPercent] = useState(5)
  const [result, setResult] = useState<StepUpEMIResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateStepUpEMI({
      loanAmount,
      interestRate,
      tenureYears: tenure,
      annualIncreasePercent: stepUpPercent
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, interestRate, tenure, stepUpPercent])

  const chartData = result ? [
    { name: t.loan.principal_amount, value: loanAmount, color: '#3b82f6' },
    { name: t.loan.total_interest, value: result.totalInterest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setLoanAmount(2000000)
    setInterestRate(9)
    setTenure(20)
    setStepUpPercent(5)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.initial_emi, result.initialEMI],
      [t.loan.final_emi, result.finalEMI],
      [t.loan.total_amount, result.totalPayment],
      [t.loan.total_interest, result.totalInterest],
    ]

    generateReport(format, 'step_up_emi', headers, data, t.loan.step_up_emi_title, {
      [t.loan.loan_amount]: `₹${loanAmount}`,
      [t.loan.tenure_years]: `${tenure}`,
      [t.loan.step_up_percent]: `${stepUpPercent}%`,
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.step_up_emi_title}
      description={t.loan.step_up_emi_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      onClear={handleClear}
      values={[loanAmount, interestRate, tenure, stepUpPercent]}
      onRestoreAction={(vals) => {
        const nextAmount = Number(vals?.[0])
        const nextRate = Number(vals?.[1])
        const nextTenure = Number(vals?.[2])
        const nextStep = Number(vals?.[3])
        if (Number.isFinite(nextAmount)) setLoanAmount(nextAmount)
        if (Number.isFinite(nextRate)) setInterestRate(nextRate)
        if (Number.isFinite(nextTenure)) setTenure(nextTenure)
        if (Number.isFinite(nextStep)) setStepUpPercent(nextStep)
      }}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.loan_amount}
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={100000000}
            step={10000}
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
            label={t.loan.tenure_years}
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
          />
          <InputGroup
            label={t.loan.step_up_percent}
            value={stepUpPercent}
            onChange={setStepUpPercent}
            min={1}
            max={20}
            step={1}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.initial_emi}
              value={`₹${result.initialEMI.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.final_emi}
              value={`₹${result.finalEMI.toLocaleString()}`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.total_amount}
              value={`₹${result.totalPayment.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label={t.loan.total_interest}
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="default"
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
