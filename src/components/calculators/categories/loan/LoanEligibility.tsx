"use client"

import { useState } from "react"
import { CheckCircle, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from "react-hot-toast"
import { LoanEligibilitySeoContent } from "@/components/calculators/seo/LoanSeo"

export function LoanEligibility() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000)
  const [existingEMI, setExistingEMI] = useState(5000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(240)
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'bar'>('pie')

  const calculate = () => {
    // FOIR (Fixed Obligation to Income Ratio) is typically 50-60%
    const foir = 0.5
    const availableIncome = monthlyIncome * foir - existingEMI
    
    // Calculate max loan amount based on affordable EMI
    const ratePerMonth = interestRate / 12 / 100
    const n = tenure
    
    // Reverse EMI calculation: P = EMI × [(1+r)^n - 1] / [r × (1+r)^n]
    const maxLoan = availableIncome * (Math.pow(1 + ratePerMonth, n) - 1) / (ratePerMonth * Math.pow(1 + ratePerMonth, n))

    setResult({
      eligibleAmount: Math.round(maxLoan),
      affordableEMI: Math.round(availableIncome),
      disposableIncome: Math.round(monthlyIncome - existingEMI - availableIncome),
      existingEMI: existingEMI,
      monthlyIncome: monthlyIncome
    })
  }

  const chartData = result ? [
    { name: 'Affordable EMI', value: result.affordableEMI, color: '#3b82f6' },
    { name: 'Existing EMI', value: result.existingEMI, color: '#ef4444' },
    { name: 'Disposable Income', value: result.disposableIncome, color: '#22c55e' },
  ] : []

  const handleClear = () => {
    setMonthlyIncome(0)
    setExistingEMI(0)
    setInterestRate(0)
    setTenure(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = ['Metric', 'Value']
    const data = [
      ['Monthly Income', result.monthlyIncome],
      ['Existing EMI', result.existingEMI],
      ['Interest Rate', `${interestRate}%`],
      ['Tenure', `${tenure} Months`],
      ['Eligible Loan Amount', result.eligibleAmount],
      ['Affordable EMI', result.affordableEMI],
      ['Disposable Income', result.disposableIncome]
    ]

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'loan_eligibility.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Eligibility")
        XLSX.writeFile(wb, "loan_eligibility.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Loan Eligibility Report", 14, 15)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 25,
        })
        doc.save("loan_eligibility.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result, null, 2)
        downloadFile(jsonContent, 'loan_eligibility.json', 'application/json')
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
      title="Loan Eligibility Calculator"
      description="Check how much loan you can borrow based on your income"
      icon={CheckCircle}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<LoanEligibilitySeoContent />}
      onDownload={handleDownload}
      values={[monthlyIncome, existingEMI, interestRate, tenure]}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Monthly Income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            min={20000}
            max={500000}
            step={5000}
            prefix="₹"
          />
          <InputGroup
            label="Existing EMI"
            value={existingEMI}
            onChange={setExistingEMI}
            min={0}
            max={monthlyIncome * 0.8}
            step={1000}
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
              label="Eligible Loan Amount"
              value={`₹${result.eligibleAmount.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Affordable EMI"
              value={`₹${result.affordableEMI.toLocaleString()}`}
              type="success"
            />
            <ResultCard
              label="Disposable Income"
              value={`₹${result.disposableIncome.toLocaleString()}`}
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
              { value: 'bar', label: 'Comparison', icon: TrendingUp }
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
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
