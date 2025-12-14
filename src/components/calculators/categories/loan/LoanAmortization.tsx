"use client"

import { useState } from "react"
import { Calendar, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from "react-hot-toast"
import { AmortizationSeoContent } from "@/components/calculators/seo/LoanSeo"

export function LoanAmortization() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(60)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const calculate = () => {
    const principal = loanAmount
    const ratePerMonth = interestRate / 12 / 100
    const n = tenure

    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1)
    const totalAmount = emi * n
    const totalInterest = totalAmount - principal
    
    let balance = principal
    const schedule = []
    let currentYear = new Date().getFullYear()
    let totalInterestPaid = 0

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

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'amortization_schedule.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.json_to_sheet(result.schedule)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Schedule")
        XLSX.writeFile(wb, "amortization_schedule.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Loan Amortization Schedule", 14, 15)
        doc.text(`Loan Amount: ₹${loanAmount.toLocaleString()}`, 14, 25)
        doc.text(`Interest Rate: ${interestRate}%`, 14, 32)
        doc.text(`Tenure: ${tenure} Months`, 14, 39)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 45,
        })
        doc.save("amortization_schedule.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result.schedule, null, 2)
        downloadFile(jsonContent, 'amortization_schedule.json', 'application/json')
        break

      case 'html':
        const htmlContent = `
          <html>
            <head><title>Amortization Schedule</title></head>
            <body>
              <h1>Amortization Schedule</h1>
              <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>
                  ${data.map((row: any[]) => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `
        downloadFile(htmlContent, 'amortization_schedule.html', 'text/html')
        break
        
      case 'markdown':
        const mdContent = `
# Amortization Schedule

| ${headers.join(' | ')} |
| ${headers.map(() => '---').join(' | ')} |
${data.map((row: any[]) => `| ${row.join(' | ')} |`).join('\n')}
        `
        downloadFile(mdContent, 'amortization_schedule.md', 'text/markdown')
        break

      case 'xml':
        const xmlContent = `
<?xml version="1.0" encoding="UTF-8"?>
<schedule>
  ${result.schedule.map((row: any) => `
  <payment>
    <month>${row.month}</month>
    <principal>${row.principal}</principal>
    <interest>${row.interest}</interest>
    <totalPayment>${row.totalPayment}</totalPayment>
    <balance>${row.balance}</balance>
  </payment>`).join('')}
</schedule>
        `.trim()
        downloadFile(xmlContent, 'amortization_schedule.xml', 'application/xml')
        break

      case 'copy':
        const textContent = [
          headers.join('\t'),
          ...data.map((row: any[]) => row.join('\t'))
        ].join('\n')
        navigator.clipboard.writeText(textContent)
        toast.success("Schedule copied to clipboard!")
        break
    }
  }

  const downloadFile = (content: string, fileName: string, type: string) => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <FinancialCalculatorTemplate
      title="Loan Amortization Calculator"
      description="View detailed repayment schedule for your loan"
      icon={Calendar}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<AmortizationSeoContent />}
      onDownload={handleDownload}
      values={[loanAmount, interestRate, tenure]}
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
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure (Months)"
            value={tenure}
            onChange={setTenure}
            min={12}
            max={360}
            step={12}
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
              { value: 'pie', label: 'Breakdown', icon: PieChartIcon },
              { value: 'graph', label: 'Growth', icon: TrendingUp }
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
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              ) : (
                <AreaChart data={result.schedule}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="year" 
                    className="text-xs text-muted-foreground" 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs text-muted-foreground" 
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
      schedule={result && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Month</th>
                <th className="px-4 py-3">Principal</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Total Payment</th>
                <th className="px-4 py-3 rounded-tr-lg">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row: any) => (
                <tr key={row.month} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{row.month}</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">₹{row.principal.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600 dark:text-red-400">₹{row.interest.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{row.totalPayment.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">₹{row.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    />
  )
}
