"use client"

import { useState } from "react"
import { Bike, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { CarLoanSeoContent } from "@/components/calculators/seo/LoanSeo"

export function TwoWheelerLoan() {
  const [loanAmount, setLoanAmount] = useState(80000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(36)
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

    generateReport(format, 'two_wheeler_loan_schedule', headers, data, 'Two Wheeler Loan EMI Schedule', {
      'Loan Amount': `₹${loanAmount}`,
      'Interest Rate': `${interestRate}%`,
      'Tenure': `${tenure} months`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Two Wheeler Loan EMI Calculator"
      description="Calculate your monthly two wheeler loan EMI and view detailed amortization schedule"
      icon={Bike}
      calculate={calculateEMI}
      onClear={handleClear}
      seoContent={<CarLoanSeoContent />}
      onDownload={handleDownload}
      values={[loanAmount, interestRate, tenure]}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={500000}
            step={5000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate (p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={25}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure (Months)"
            value={tenure}
            onChange={setTenure}
            min={6}
            max={60}
            step={6}
            helpText={`Duration: ${(tenure / 12).toFixed(1)} Years`}
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
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
        </div>
      )}
      charts={result && (
        <div className="space-y-8 w-full">
          <ChartToggle 
            view={chartView}
            onChange={setChartView}
            options={[
              { value: 'pie', label: 'Pie Chart', icon: PieChartIcon },
              { value: 'graph', label: 'Graph', icon: TrendingUp }
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
      )}
    />
  )
}
