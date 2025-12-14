"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard, DownloadOptions } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { formatCompactNumber } from "@/lib/utils"
import { PersonalLoanEMIContent } from "./PersonalLoanEMIContent"

export function PersonalLoanEMI() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(12)
  const [tenure, setTenure] = useState(36)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const calculateEMI = () => {
    const principal = loanAmount
    const ratePerMonth = interestRate / 12 / 100
    const n = tenure

    // EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
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

  const handleDownload = (format: string, options?: DownloadOptions) => {
    if (!result || !result.schedule) return

    let scheduleData = result.schedule
    
    if (options) {
      if (!options.includeSchedule) {
        scheduleData = []
      } else if (options.scheduleRange === '1yr') {
        scheduleData = scheduleData.slice(0, 12)
      } else if (options.scheduleRange === '5yr') {
        scheduleData = scheduleData.slice(0, 60)
      }
    }

    const headers = ['Month', 'Principal', 'Interest', 'Total Payment', 'Balance']
    const data = scheduleData.map((row: any) => [
      row.month,
      row.principal,
      row.interest,
      row.totalPayment,
      row.balance
    ])

    let metadata = {
      'Loan Amount': `₹${loanAmount}`,
      'Interest Rate': `${interestRate}%`,
      'Tenure': `${tenure} months`
    }

    if (options && !options.includeSummary) {
        metadata = undefined as any
    }

    generateReport(format, 'personal_loan_emi', headers, data, 'Personal Loan EMI Schedule', metadata)
  }

  return (
    <FinancialCalculatorTemplate
      title="Personal Loan EMI Calculator"
      description="Calculate your monthly personal loan EMI and view detailed amortization schedule"
      icon={DollarSign}
      calculate={calculateEMI}
      onClear={handleClear}
      seoContent={<PersonalLoanEMIContent />}
      onDownload={handleDownload}
      values={[loanAmount, interestRate, tenure]}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={10000000}
            step={5000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate (p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={30}
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
              value={`₹${result.emi > 10000000 ? formatCompactNumber(result.emi) : result.emi.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Total Interest"
              value={`₹${result.totalInterest > 10000000 ? formatCompactNumber(result.totalInterest) : result.totalInterest.toLocaleString()}`}
              type="warning"
            />
            <ResultCard
              label="Total Amount"
              value={`₹${result.totalAmount > 10000000 ? formatCompactNumber(result.totalAmount) : result.totalAmount.toLocaleString()}`}
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
              { value: 'pie', label: 'Breakdown', icon: PieChartIcon },
              { value: 'graph', label: 'Amortization', icon: TrendingUp }
            ]}
          />

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'pie' ? (
                <PieChart>
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        strokeWidth={0}
                        filter="url(#shadow)"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `₹${value > 10000000 ? formatCompactNumber(value) : value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      border: '1px solid'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={40} 
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ paddingTop: '20px', fontWeight: 500 }}
                  />
                </PieChart>
              ) : (
                <ComposedChart data={result.schedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs text-muted-foreground" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground" 
                    tickFormatter={(value) => `₹${formatCompactNumber(value)}`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={80}
                    tick={{ fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `₹${value > 10000000 ? formatCompactNumber(value) : value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      border: '1px solid'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={40} 
                    iconType="line"
                    iconSize={16}
                    wrapperStyle={{ paddingBottom: '10px', fontWeight: 500 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    name="Outstanding Balance"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorBalance)"
                    animationDuration={1000}
                    animationBegin={0}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeInterest" 
                    name="Total Interest Paid"
                    stroke="#ef4444" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorInterest)"
                    animationDuration={1200}
                    animationBegin={200}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
