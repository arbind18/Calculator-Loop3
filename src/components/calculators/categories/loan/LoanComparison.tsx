"use client"

import { useState } from "react"
import { Scale, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from "react-hot-toast"
import { LoanComparisonSeoContent } from "@/components/calculators/seo/LoanSeo"

export function LoanComparison() {
  const [loan1Amount, setLoan1Amount] = useState(1000000)
  const [loan1Rate, setLoan1Rate] = useState(10)
  const [loan1Tenure, setLoan1Tenure] = useState(120)
  
  const [loan2Amount, setLoan2Amount] = useState(1000000)
  const [loan2Rate, setLoan2Rate] = useState(11)
  const [loan2Tenure, setLoan2Tenure] = useState(120)
  
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar')

  const calculate = () => {
    // Loan 1
    const r1 = loan1Rate / 12 / 100
    const emi1 = loan1Amount * r1 * Math.pow(1 + r1, loan1Tenure) / (Math.pow(1 + r1, loan1Tenure) - 1)
    const total1 = emi1 * loan1Tenure
    const interest1 = total1 - loan1Amount

    // Loan 2
    const r2 = loan2Rate / 12 / 100
    const emi2 = loan2Amount * r2 * Math.pow(1 + r2, loan2Tenure) / (Math.pow(1 + r2, loan2Tenure) - 1)
    const total2 = emi2 * loan2Tenure
    const interest2 = total2 - loan2Amount

    setResult({
      loan1: { 
        emi: Math.round(emi1), 
        total: Math.round(total1), 
        interest: Math.round(interest1),
        principal: loan1Amount
      },
      loan2: { 
        emi: Math.round(emi2), 
        total: Math.round(total2), 
        interest: Math.round(interest2),
        principal: loan2Amount
      },
      savings: Math.round(Math.abs(total1 - total2)),
      betterOption: total1 < total2 ? 'Loan 1' : 'Loan 2'
    })
  }

  const chartData = result ? [
    {
      name: 'Total Interest',
      'Loan 1': result.loan1.interest,
      'Loan 2': result.loan2.interest,
    },
    {
      name: 'Total Amount',
      'Loan 1': result.loan1.total,
      'Loan 2': result.loan2.total,
    },
  ] : []

  const handleClear = () => {
    setLoan1Amount(0)
    setLoan1Rate(0)
    setLoan1Tenure(0)
    setLoan2Amount(0)
    setLoan2Rate(0)
    setLoan2Tenure(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = ['Metric', 'Loan 1', 'Loan 2', 'Difference']
    const data = [
      ['Principal', result.loan1.principal, result.loan2.principal, Math.abs(result.loan1.principal - result.loan2.principal)],
      ['Interest Rate', `${loan1Rate}%`, `${loan2Rate}%`, `${Math.abs(loan1Rate - loan2Rate).toFixed(2)}%`],
      ['Tenure (Months)', loan1Tenure, loan2Tenure, Math.abs(loan1Tenure - loan2Tenure)],
      ['Monthly EMI', result.loan1.emi, result.loan2.emi, Math.abs(result.loan1.emi - result.loan2.emi)],
      ['Total Interest', result.loan1.interest, result.loan2.interest, Math.abs(result.loan1.interest - result.loan2.interest)],
      ['Total Amount', result.loan1.total, result.loan2.total, Math.abs(result.loan1.total - result.loan2.total)],
    ]

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'loan_comparison.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Comparison")
        XLSX.writeFile(wb, "loan_comparison.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Loan Comparison Report", 14, 15)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 25,
        })
        doc.save("loan_comparison.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result, null, 2)
        downloadFile(jsonContent, 'loan_comparison.json', 'application/json')
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
      title="Loan Comparison Calculator"
      description="Compare two loan offers side by side to find the best deal"
      icon={Scale}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<LoanComparisonSeoContent />}
      onDownload={handleDownload}
      values={[loan1Amount, loan1Rate, loan1Tenure, loan2Amount, loan2Rate, loan2Tenure]}
      inputs={
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 border rounded-lg bg-secondary/10">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</div>
              Loan Option 1
            </h3>
            <InputGroup
              label="Loan Amount"
              value={loan1Amount}
              onChange={setLoan1Amount}
              min={100000}
              max={10000000}
              step={50000}
              prefix="₹"
            />
            <InputGroup
              label="Interest Rate (%)"
              value={loan1Rate}
              onChange={setLoan1Rate}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
            />
            <InputGroup
              label="Tenure (Months)"
              value={loan1Tenure}
              onChange={setLoan1Tenure}
              min={12}
              max={360}
              step={12}
            />
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-secondary/10">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</div>
              Loan Option 2
            </h3>
            <InputGroup
              label="Loan Amount"
              value={loan2Amount}
              onChange={setLoan2Amount}
              min={100000}
              max={10000000}
              step={50000}
              prefix="₹"
            />
            <InputGroup
              label="Interest Rate (%)"
              value={loan2Rate}
              onChange={setLoan2Rate}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
            />
            <InputGroup
              label="Tenure (Months)"
              value={loan2Tenure}
              onChange={setLoan2Tenure}
              min={12}
              max={360}
              step={12}
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
            <p className="text-2xl font-bold text-primary">
              {result.betterOption} saves you ₹{result.savings.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-center">Loan 1 Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">EMI</p>
                  <p className="font-bold">₹{result.loan1.emi.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Interest</p>
                  <p className="font-bold text-red-500">₹{result.loan1.interest.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-bold">₹{result.loan1.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-center">Loan 2 Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">EMI</p>
                  <p className="font-bold">₹{result.loan2.emi.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Interest</p>
                  <p className="font-bold text-red-500">₹{result.loan2.interest.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-bold">₹{result.loan2.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      charts={result && (
        <div className="space-y-8 w-full">
          <ChartToggle
            view={chartView}
            onChange={setChartView}
            options={[
              { value: 'bar', label: 'Comparison', icon: TrendingUp },
              { value: 'pie', label: 'Breakdown', icon: PieChartIcon }
            ]}
          />
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="Loan 1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Loan 2" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="relative">
                    <h4 className="text-center mb-2 font-medium">Loan 1</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Principal', value: result.loan1.principal, color: '#3b82f6' },
                            { name: 'Interest', value: result.loan1.interest, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="relative">
                    <h4 className="text-center mb-2 font-medium">Loan 2</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Principal', value: result.loan2.principal, color: '#3b82f6' },
                            { name: 'Interest', value: result.loan2.interest, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
