"use client"

import { useState } from "react"
import { GraduationCap, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { EducationLoanSeoContent } from "@/components/calculators/seo/LoanSeo"

export function EducationLoanEMI() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10.5)
  const [tenure, setTenure] = useState(120)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const calculateEMI = () => {
    const principal = loanAmount
    const ratePerMonth = interestRate / 12 / 100
    const n = tenure

    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1)
    const totalAmount = emi * n
    const totalInterest = totalAmount - principal

    // Generate Amortization Schedule
    let balance = principal
    let totalInterestPaid = 0
    const schedule = []
    let currentYear = new Date().getFullYear()
    
    for (let i = 1; i <= n; i++) {
      const interest = balance * ratePerMonth
      const principalComponent = emi - interest
      balance = balance - principalComponent
      totalInterestPaid += interest
      
      if (balance < 0) balance = 0

      schedule.push({
        month: i,
        year: currentYear + Math.floor((i - 1) / 12),
        principal: Math.round(principalComponent),
        interest: Math.round(interest),
        balance: Math.round(balance),
        totalPayment: Math.round(emi),
        cumulativeInterest: Math.round(totalInterestPaid)
      })
    }

    setResult({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: principal,
      schedule: schedule
    })
  }

  const chartData = result ? [
    { name: 'Principal Amount', value: result.principal, color: '#3b82f6' },
    { name: 'Total Interest', value: result.totalInterest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setLoanAmount(0)
    setInterestRate(0)
    setTenure(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result || !result.schedule) return

    const headers = ['Month', 'Principal', 'Interest', 'Total Payment', 'Balance']
    const data = result.schedule.map((row: any) => [
      row.month,
      row.principal,
      row.interest,
      row.totalPayment,
      row.balance
    ])

    generateReport(format, 'education_loan_schedule', headers, data, 'Education Loan EMI Schedule', {
      'Loan Amount': `₹${loanAmount}`,
      'Interest Rate': `${interestRate}%`,
      'Tenure': `${tenure} months`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Education Loan EMI Calculator"
      description="Calculate your monthly education loan EMI and view detailed amortization schedule"
      icon={GraduationCap}
      calculate={calculateEMI}
      onClear={handleClear}
      seoContent={<EducationLoanSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={100000}
            max={10000000}
            step={50000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate (p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={20}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure (Months)"
            value={tenure}
            onChange={setTenure}
            min={12}
            max={180}
            step={12}
            helpText={`Duration: ${(tenure / 12).toFixed(1)} Years`}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Monthly EMI"
              value={`₹${result.emi.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Total Interest"
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="warning"
            />
            <ResultCard
              label="Total Amount"
              value={`₹${result.totalAmount.toLocaleString()}`}
              type="default"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              onChange={setChartView}
              options={[
                { value: 'pie', label: 'Breakdown', icon: PieChartIcon },
                { value: 'graph', label: 'Amortization', icon: TrendingUp }
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
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                ) : (
                  <AreaChart data={result.schedule}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
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
