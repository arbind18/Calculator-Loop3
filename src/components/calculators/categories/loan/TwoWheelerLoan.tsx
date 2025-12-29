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
import { calculateLoanEMI, LoanResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function TwoWheelerLoan() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [vehiclePrice, setVehiclePrice] = useState(100000)
  const [downPayment, setDownPayment] = useState(20000)
  const [interestRate, setInterestRate] = useState(11)
  const [tenure, setTenure] = useState(3)
  const [result, setResult] = useState<LoanResult | null>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const handleCalculate = () => {
    const calculationResult = calculateLoanEMI({
      loanAmount: vehiclePrice - downPayment,
      interestRate,
      tenureMonths: tenure * 12
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [vehiclePrice, downPayment, interestRate, tenure])

  const chartData = result ? [
    { name: t.loan.principal_amount, value: result.principal, color: '#3b82f6' },
    { name: t.loan.total_interest, value: result.totalInterest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setVehiclePrice(100000)
    setDownPayment(20000)
    setInterestRate(11)
    setTenure(3)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.common.value]
    const data = [
      [t.loan.loan_amount, result.principal],
      [t.loan.emi, result.emi],
      [t.loan.total_interest, result.totalInterest],
      [t.loan.total_amount, result.totalAmount]
    ]

    generateReport(format, 'two_wheeler_loan', headers, data, t.loan.two_wheeler_loan_title, {
      [t.loan.vehicle_price]: `₹${vehiclePrice}`,
      [t.loan.down_payment]: `₹${downPayment}`,
      [t.loan.interest_rate]: `${interestRate}%`,
      [t.loan.tenure_years]: `${tenure}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.two_wheeler_loan_title}
      description={t.loan.two_wheeler_loan_desc}
      icon={DollarSign}
      calculate={handleCalculate}
      onClear={handleClear}
      values={[vehiclePrice, downPayment, interestRate, tenure]}
      onRestoreAction={(vals) => {
        const nextPrice = Number(vals?.[0])
        const nextDown = Number(vals?.[1])
        const nextRate = Number(vals?.[2])
        const nextTenure = Number(vals?.[3])
        if (Number.isFinite(nextPrice)) setVehiclePrice(nextPrice)
        if (Number.isFinite(nextDown)) setDownPayment(nextDown)
        if (Number.isFinite(nextRate)) setInterestRate(nextRate)
        if (Number.isFinite(nextTenure)) setTenure(nextTenure)
      }}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.vehicle_price}
            value={vehiclePrice}
            onChange={setVehiclePrice}
            min={10000}
            max={1000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label={t.loan.down_payment}
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={vehiclePrice}
            step={1000}
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
            max={7}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.emi}
              value={`₹${result.emi.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.loan_amount}
              value={`₹${result.principal.toLocaleString()}`}
              type="highlight"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t.loan.total_amount}
              value={`₹${result.totalAmount.toLocaleString()}`}
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
