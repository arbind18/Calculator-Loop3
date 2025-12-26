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
import { calculateBalanceTransfer, BalanceTransferResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function LoanBalanceTransfer() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [outstanding, setOutstanding] = useState(1000000)
  const [currentRate, setCurrentRate] = useState(10)
  const [newRate, setNewRate] = useState(8.5)
  const [remainingTenure, setRemainingTenure] = useState(10)
  const [transferFees, setTransferFees] = useState(5000)
  const [result, setResult] = useState<BalanceTransferResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateBalanceTransfer({
      outstandingPrincipal: outstanding,
      currentRate: currentRate,
      newRate: newRate,
      remainingTenureMonths: remainingTenure * 12,
      processingFees: transferFees
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [outstanding, currentRate, newRate, remainingTenure, transferFees])

  const chartData = result ? [
    { name: t.loan.total_savings, value: Math.max(0, result.netSavings), color: '#10b981' },
    { name: t.loan.transfer_fees, value: transferFees, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setOutstanding(1000000)
    setCurrentRate(10)
    setNewRate(8.5)
    setRemainingTenure(10)
    setTransferFees(5000)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.new_monthly_emi, result.newEMI],
      [t.loan.total_savings, result.netSavings],
      [t.loan.break_even_period, `${result.breakEvenMonths} months`]
    ]

    generateReport(format, 'loan_balance_transfer', headers, data, t.loan.loan_balance_transfer_title, {
      [t.loan.outstanding_amount]: `₹${outstanding}`,
      [t.loan.current_interest_rate]: `${currentRate}%`,
      [t.loan.new_interest_rate]: `${newRate}%`,
      [t.loan.remaining_tenure]: `${remainingTenure}`,
      [t.loan.transfer_fees]: `₹${transferFees}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.loan_balance_transfer_title}
      description={t.loan.loan_balance_transfer_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      onClear={handleClear}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.outstanding_amount}
            value={outstanding}
            onChange={setOutstanding}
            min={10000}
            max={100000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.current_interest_rate}
            value={currentRate}
            onChange={setCurrentRate}
            min={0.1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.new_interest_rate}
            value={newRate}
            onChange={setNewRate}
            min={0.1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.remaining_tenure}
            value={remainingTenure}
            onChange={setRemainingTenure}
            min={1}
            max={30}
            step={1}
          />
          <InputGroup
            label={t.loan.transfer_fees}
            value={transferFees}
            onChange={setTransferFees}
            min={0}
            max={100000}
            step={500}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.new_monthly_emi}
              value={`₹${result.newEMI.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.total_savings}
              value={`₹${result.netSavings.toLocaleString()}`}
              type={result.netSavings > 0 ? "success" : "warning"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.break_even_period}
              value={`${result.breakEvenMonths} months`}
              type="default"
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
