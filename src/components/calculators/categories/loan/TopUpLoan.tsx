"use client"

import { useState } from "react"
import { ArrowUp, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PersonalLoanSeoContent } from "@/components/calculators/seo/LoanSeo"

export function TopUpLoan() {
  const [existingLoan, setExistingLoan] = useState(500000)
  const [existingEMI, setExistingEMI] = useState(12000)
  const [topUpAmount, setTopUpAmount] = useState(200000)
  const [interestRate, setInterestRate] = useState(11)
  const [tenure, setTenure] = useState(60)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const totalLoanAmount = existingLoan + topUpAmount
    const ratePerMonth = interestRate / 12 / 100
    const n = tenure

    // Calculate new EMI for combined loan
    const newEMI = totalLoanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1)
    
    const totalAmount = newEMI * n
    const totalInterest = totalAmount - totalLoanAmount
    const additionalEMI = newEMI - existingEMI

    setResult({
      newEMI: Math.round(newEMI),
      additionalEMI: Math.round(additionalEMI),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      topUpAmount,
      existingEMI
    })
  }

  const chartData = result ? [
    {
      name: 'Monthly Payment',
      'Existing EMI': result.existingEMI,
      'Additional EMI': result.additionalEMI,
    }
  ] : []

  const handleClear = () => {
    setExistingLoan(0)
    setExistingEMI(0)
    setTopUpAmount(0)
    setInterestRate(0)
    setTenure(0)
    setResult(null)
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/calculators/top-up-loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingLoan,
          existingEMI,
          topUpAmount,
          interestRate,
          tenure
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Calculation saved successfully!");
      } else {
        alert("Failed to save calculation.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("An error occurred while saving.");
    }
  };

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = ['Metric', 'Value']
    const data = [
      ['Existing Loan', existingLoan],
      ['Existing EMI', existingEMI],
      ['Top-Up Amount', topUpAmount],
      ['Interest Rate', `${interestRate}%`],
      ['Tenure', `${tenure} months`],
      ['New Total EMI', result.newEMI],
      ['Additional EMI', result.additionalEMI],
      ['Total Interest', result.totalInterest],
      ['Total Amount Payable', result.totalAmount]
    ]

    switch (format) {
      case 'csv':
        const csvContent = [
          headers.join(','),
          ...data.map((row: any[]) => row.join(','))
        ].join('\n')
        downloadFile(csvContent, 'top_up_loan.csv', 'text/csv')
        break

      case 'excel':
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "TopUp")
        XLSX.writeFile(wb, "top_up_loan.xlsx")
        break

      case 'pdf':
        const doc = new jsPDF()
        doc.text("Top-Up Loan Report", 14, 15)
        
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 25,
        })
        doc.save("top_up_loan.pdf")
        break

      case 'json':
        const jsonContent = JSON.stringify(result, null, 2)
        downloadFile(jsonContent, 'top_up_loan.json', 'application/json')
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
      title="Top-Up Loan Calculator"
      description="Calculate additional EMI for top-up on existing loan"
      icon={ArrowUp}
      calculate={calculate}
      onClear={handleClear}
      seoContent={<PersonalLoanSeoContent />}
      onDownload={handleDownload}
      values={[existingLoan, existingEMI, topUpAmount, interestRate, tenure]}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label="Existing Loan Amount"
            value={existingLoan}
            onChange={setExistingLoan}
            min={100000}
            max={5000000}
            step={50000}
            prefix="₹"
          />
          <InputGroup
            label="Existing EMI"
            value={existingEMI}
            onChange={setExistingEMI}
            min={5000}
            max={100000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Top-Up Amount"
            value={topUpAmount}
            onChange={setTopUpAmount}
            min={50000}
            max={2000000}
            step={10000}
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
            max={240}
            step={12}
            helpText={`Duration: ${(tenure / 12).toFixed(1)} Years`}
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="New Total EMI"
              value={`₹${result.newEMI.toLocaleString()}`}
              type="highlight"
            />
            <ResultCard
              label="Additional EMI"
              value={`₹${result.additionalEMI.toLocaleString()}`}
              type="warning"
            />
            <ResultCard
              label="Total Interest"
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="default"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} className="w-full md:w-auto">
              Save Calculation
            </Button>
          </div>
        </div>
      )}
      charts={result && (
        <div className="space-y-8 w-full">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Existing EMI" fill="#94a3b8" stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Additional EMI" fill="#f97316" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
