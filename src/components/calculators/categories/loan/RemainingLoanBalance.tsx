"use client"

import { useState } from "react"
import { Scale, TrendingUp, PieChart as PieChartIcon } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { AmortizationSeoContent } from "@/components/calculators/seo/LoanSeo"

export function RemainingLoanBalance() {
  const [originalAmount, setOriginalAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(10)
  const [originalTenure, setOriginalTenure] = useState(120)
  const [paidMonths, setPaidMonths] = useState(24)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const ratePerMonth = interestRate / 12 / 100
    const n = originalTenure

    // Calculate EMI
    const emi = originalAmount * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1)
    
    // Calculate remaining balance
    const remainingMonths = n - paidMonths
    const remainingBalance = emi * (Math.pow(1 + ratePerMonth, remainingMonths) - 1) / (ratePerMonth * Math.pow(1 + ratePerMonth, remainingMonths))

    const totalPaid = emi * paidMonths
    const principalPaid = originalAmount - remainingBalance
    const interestPaid = totalPaid - principalPaid

    setResult({
      emi: Math.round(emi),
      remainingBalance: Math.round(remainingBalance),
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interestPaid),
      totalPaid: Math.round(totalPaid),
      remainingMonths
    })
  }

  const chartData = result ? [
    { name: 'Principal Paid', value: result.principalPaid, color: '#22c55e' },
    { name: 'Remaining Balance', value: result.remainingBalance, color: '#ef4444' },
  ] : []

  const handleClear = () => {
    setOriginalAmount(0)
    setInterestRate(0)
    setOriginalTenure(0)
    setPaidMonths(0)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = ['Metric', 'Value']
    const data = [
      ['Original Loan Amount', originalAmount],
      ['Interest Rate', `${interestRate}%`],
      ['Original Tenure', `${originalTenure} months`],
      ['Months Paid', paidMonths],
      ['EMI', result.emi],
      ['Remaining Balance', result.remainingBalance],
      ['Principal Paid', result.principalPaid],
      ['Interest Paid', result.interestPaid],
      ['Total Amount Paid', result.totalPaid]
    ]

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'remaining_balance.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Balance")
        XLSX.writeFile(wb, "remaining_balance.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Remaining Loan Balance Report", 14, 15)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 25,
        })
        doc.save("remaining_balance.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result, null, 2)
        downloadFile(jsonContent, 'remaining_balance.json', 'application/json')
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
      title="Remaining Loan Balance Calculator"
      description="Calculate how much you still owe on your loan"
      icon={Scale}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<AmortizationSeoContent />}
      onDownload={handleDownload}
      values={[originalAmount, interestRate, originalTenure, paidMonths]}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Original Loan Amount"
            value={originalAmount}
            onChange={setOriginalAmount}
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
            label="Original Tenure (Months)"
            value={originalTenure}
            onChange={setOriginalTenure}
            min={12}
            max={360}
            step={12}
            helpText={`Duration: ${(originalTenure / 12).toFixed(1)} Years`}
          />
          <InputGroup
            label="Months Paid"
            value={paidMonths}
            onChange={setPaidMonths}
            min={1}
            max={originalTenure - 1}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Remaining Balance"
              value={`₹${result.remainingBalance.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Principal Paid"
              value={`₹${result.principalPaid.toLocaleString()}`}
              type="success"
            />
            <ResultCard
              label="Interest Paid"
              value={`₹${result.interestPaid.toLocaleString()}`}
              type="default"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <ResultCard
              label="Monthly EMI"
              value={`₹${result.emi.toLocaleString()}`}
              type="default"
            />
             <ResultCard
              label="Remaining Months"
              value={`${result.remainingMonths}`}
              type="default"
            />
          </div>
        </div>
      )}
      charts={result && (
        <div className="space-y-8 w-full">
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
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
