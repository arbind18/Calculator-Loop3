"use client"

import { useState } from "react"
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from "react-hot-toast"
import { CompoundInterestSeoContent } from "@/components/calculators/seo/BankingSeo"

export function CompoundInterestLoan() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(10)
  const [time, setTime] = useState(5)
  const [frequency, setFrequency] = useState(12) // Monthly compounding by default
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const calculate = () => {
    // Compound Interest: A = P(1 + r/n)^(nt)
    const r = rate / 100
    const n = frequency
    const t = time
    
    const amount = principal * Math.pow((1 + r/n), n*t)
    const interest = amount - principal

    // Generate Schedule (Yearly)
    const schedule = []
    let currentYear = new Date().getFullYear()
    let currentPrincipal = principal
    
    for (let i = 1; i <= t; i++) {
      const yearEndAmount = principal * Math.pow((1 + r/n), n*i)
      const yearInterest = yearEndAmount - currentPrincipal
      
      schedule.push({
        year: currentYear + i - 1,
        principal: Math.round(currentPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.round(yearEndAmount)
      })
      currentPrincipal = yearEndAmount
    }

    setResult({
      interest: Math.round(interest),
      totalAmount: Math.round(amount),
      principal: principal,
      schedule: schedule
    })
  }

  const chartData = result ? [
    { name: 'Principal Amount', value: result.principal, color: '#3b82f6' },
    { name: 'Total Interest', value: result.interest, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setPrincipal(0)
    setRate(0)
    setTime(0)
    setFrequency(12)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result || !result.schedule) return

    const headers = ['Year', 'Opening Balance', 'Interest Earned', 'Closing Balance']
    const data = result.schedule.map((row: any) => [
      row.year,
      row.principal,
      row.interest,
      row.balance
    ])

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'compound_interest_schedule.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.json_to_sheet(result.schedule)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Schedule")
        XLSX.writeFile(wb, "compound_interest_schedule.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Compound Interest Schedule", 14, 15)
        doc.text(`Principal: ₹${principal.toLocaleString()}`, 14, 25)
        doc.text(`Rate: ${rate}%`, 14, 32)
        doc.text(`Time: ${time} Years`, 14, 39)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 45,
        })
        doc.save("compound_interest_schedule.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result.schedule, null, 2)
        downloadFile(jsonContent, 'compound_interest_schedule.json', 'application/json')
        break

      case 'html':
        const htmlContent = `
          <html>
            <head><title>Compound Interest Schedule</title></head>
            <body>
              <h1>Compound Interest Schedule</h1>
              <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>
                  ${data.map((row: any[]) => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `
        downloadFile(htmlContent, 'compound_interest_schedule.html', 'text/html')
        break
        
      case 'markdown':
        const mdContent = `
# Compound Interest Schedule

| ${headers.join(' | ')} |
| ${headers.map(() => '---').join(' | ')} |
${data.map((row: any[]) => `| ${row.join(' | ')} |`).join('\n')}
        `
        downloadFile(mdContent, 'compound_interest_schedule.md', 'text/markdown')
        break

      case 'xml':
        const xmlContent = `
<?xml version="1.0" encoding="UTF-8"?>
<schedule>
  ${result.schedule.map((row: any) => `
  <year>
    <yearNumber>${row.year}</yearNumber>
    <openingBalance>${row.principal}</openingBalance>
    <interestEarned>${row.interest}</interestEarned>
    <closingBalance>${row.balance}</closingBalance>
  </year>`).join('')}
</schedule>
        `.trim()
        downloadFile(xmlContent, 'compound_interest_schedule.xml', 'application/xml')
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
      title="Compound Interest Calculator"
      description="Calculate compound interest with different compounding frequencies"
      icon={TrendingUp}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<CompoundInterestSeoContent />}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate (% per annum)"
            value={rate}
            onChange={setRate}
            min={1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Time Period (Years)"
            value={time}
            onChange={setTime}
            min={1}
            max={30}
            step={1}
            helpText={`${time} Years`}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Compounding Frequency</label>
            <select 
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full p-2 rounded-md border border-input bg-background"
            >
              <option value={1}>Annually (1/yr)</option>
              <option value={2}>Semi-Annually (2/yr)</option>
              <option value={4}>Quarterly (4/yr)</option>
              <option value={12}>Monthly (12/yr)</option>
              <option value={365}>Daily (365/yr)</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Total Interest"
              value={`₹${result.interest.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Total Amount"
              value={`₹${result.totalAmount.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label="Principal"
              value={`₹${result.principal.toLocaleString()}`}
              type="success"
            />
          </div>

          <div className="space-y-8 w-full">
            <ChartToggle
              view={chartView}
              setView={setChartView}
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Year</th>
                  <th className="px-4 py-3">Opening Balance</th>
                  <th className="px-4 py-3">Interest Earned</th>
                  <th className="px-4 py-3 rounded-tr-lg">Closing Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row: any) => (
                  <tr key={row.year} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.year}</td>
                    <td className="px-4 py-3 text-muted-foreground">₹{row.principal.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400">₹{row.interest.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold">₹{row.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    />
  )
}
