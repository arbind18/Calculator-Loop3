"use client"

import { useState } from "react"
import { FastForward, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
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
import { PrepaymentSeoContent } from "@/components/calculators/seo/LoanSeo"

export function LoanPrepaymentImpact() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(120)
  const [prepayment, setPrepayment] = useState(100000)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar')

  const calculate = () => {
    const principal = loanAmount
    const ratePerMonth = interestRate / 12 / 100
    const n = tenure

    // Original EMI
    const originalEMI = principal * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1)
    const originalTotal = originalEMI * n
    const originalInterest = originalTotal - principal

    // After prepayment
    const newPrincipal = principal - prepayment
    const newEMI = newPrincipal * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1)
    const newTotal = newEMI * n
    const newInterest = newTotal - newPrincipal

    setResult({
      originalEMI: Math.round(originalEMI),
      newEMI: Math.round(newEMI),
      savings: Math.round(originalInterest - newInterest),
      originalInterest: Math.round(originalInterest),
      newInterest: Math.round(newInterest),
      originalTotal: Math.round(originalTotal),
      newTotal: Math.round(newTotal)
    })
  }

  const chartData = result ? [
    {
      name: 'Total Interest',
      'Original': result.originalInterest,
      'With Prepayment': result.newInterest,
    },
    {
      name: 'Total Amount',
      'Original': result.originalTotal,
      'With Prepayment': result.newTotal,
    },
  ] : []

  const handleClear = () => {
    setLoanAmount(0)
    setInterestRate(0)
    setTenure(0)
    setPrepayment(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = ['Metric', 'Original', 'With Prepayment', 'Difference']
    const data = [
      ['Principal', loanAmount, loanAmount - prepayment, prepayment],
      ['EMI', result.originalEMI, result.newEMI, result.originalEMI - result.newEMI],
      ['Total Interest', result.originalInterest, result.newInterest, result.savings],
      ['Total Amount', result.originalTotal, result.newTotal, result.originalTotal - result.newTotal],
    ]

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'prepayment_impact.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Impact")
        XLSX.writeFile(wb, "prepayment_impact.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Loan Prepayment Impact Report", 14, 15)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 25,
        })
        doc.save("prepayment_impact.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result, null, 2)
        downloadFile(jsonContent, 'prepayment_impact.json', 'application/json')
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
      title="Loan Prepayment Impact Calculator"
      description="See how much you can save by making a prepayment on your loan"
      icon={FastForward}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<PrepaymentSeoContent />}
      onDownload={handleDownload}
      values={[loanAmount, interestRate, tenure, prepayment]}
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
          <InputGroup
            label="Prepayment Amount"
            value={prepayment}
            onChange={setPrepayment}
            min={10000}
            max={loanAmount}
            step={10000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Total Savings"
              value={`₹${result.savings.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="New EMI"
              value={`₹${result.newEMI.toLocaleString()}`}
              type="success"
            />
            <ResultCard
              label="Original EMI"
              value={`₹${result.originalEMI.toLocaleString()}`}
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
                  <Bar dataKey="Original" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="With Prepayment" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="relative">
                    <h4 className="text-center mb-2 font-medium">Original</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Principal', value: loanAmount, color: '#3b82f6' },
                            { name: 'Interest', value: result.originalInterest, color: '#ef4444' }
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
                    <h4 className="text-center mb-2 font-medium">With Prepayment</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Principal', value: loanAmount, color: '#3b82f6' },
                            { name: 'Interest', value: result.newInterest, color: '#22c55e' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#22c55e" />
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
