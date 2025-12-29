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
import { calculateLoanSettlement, LoanSettlementResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function LoanSettlement() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [outstanding, setOutstanding] = useState(500000)
  const [settlementAmount, setSettlementAmount] = useState(300000)
  const [result, setResult] = useState<LoanSettlementResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateLoanSettlement({
      outstandingAmount: outstanding,
      settlementOffer: settlementAmount
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [outstanding, settlementAmount])

  const chartData = result ? [
    { name: t.loan.settlement_amount, value: settlementAmount, color: '#3b82f6' },
    { name: t.loan.waived_amount, value: result.savings, color: '#10b981' },
  ] : []

  const handleClear = () => {
    setOutstanding(500000)
    setSettlementAmount(300000)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.waived_amount, result.savings],
      [t.loan.waiver_percentage, `${result.waiverPercentage}%`],
      [t.loan.credit_score_impact, result.creditScoreImpact]
    ]

    generateReport(format, 'loan_settlement', headers, data, t.loan.loan_settlement_title, {
      [t.loan.outstanding_amount]: `₹${outstanding}`,
      [t.loan.settlement_amount]: `₹${settlementAmount}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.loan_settlement_title}
      description={t.loan.loan_settlement_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      values={[outstanding, settlementAmount]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setOutstanding(Number(vals?.[0] ?? 500000))
        setSettlementAmount(Number(vals?.[1] ?? 300000))
      }}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.outstanding_amount}
            value={outstanding}
            onChange={setOutstanding}
            min={1000}
            max={100000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.settlement_amount}
            value={settlementAmount}
            onChange={setSettlementAmount}
            min={1000}
            max={outstanding}
            step={1000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.waived_amount}
              value={`₹${result.savings.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.waiver_percentage}
              value={`${result.waiverPercentage.toFixed(1)}%`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.credit_score_impact}
              value={result.creditScoreImpact}
              type="warning"
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
