"use client"

import { useState } from "react"
import { Percent, Activity } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"

export function OperatingMargin() {
  const [revenue, setRevenue] = useState(1000000)
  const [cogs, setCogs] = useState(400000)
  const [operatingExpenses, setOperatingExpenses] = useState(300000) // Rent, Salaries, etc.

  const [result, setResult] = useState<any>(null)

  const calculateMargin = () => {
    const grossProfit = revenue - cogs
    const operatingIncome = grossProfit - operatingExpenses
    const margin = (operatingIncome / revenue) * 100

    setResult({
      grossProfit,
      operatingIncome,
      margin: margin.toFixed(2)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Operating Margin Calculator"
      description="Calculate your business efficiency after paying for production and operations."
      icon={Activity}
      calculate={calculateMargin}
      values={[revenue, cogs, operatingExpenses]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Revenue" value={revenue} onChange={setRevenue} prefix="₹" min={0} max={100000000} />
          <InputGroup label="Cost of Goods Sold (COGS)" value={cogs} onChange={setCogs} prefix="₹" min={0} max={100000000} />
          <InputGroup label="Operating Expenses" value={operatingExpenses} onChange={setOperatingExpenses} prefix="₹" helpText="Rent, Payroll, Utilities, etc." min={0} max={100000000} />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Operating Margin"
              value={`${result.margin}%`}
              type="highlight"
            />
            <ResultCard
              label="Operating Income (EBIT)"
              value={`₹${formatCompactNumber(result.operatingIncome)}`}
              type="default"
            />
            <ResultCard
              label="Gross Profit"
              value={`₹${formatCompactNumber(result.grossProfit)}`}
              type="default"
            />
          </div>
        </div>
      )}
    />
  )
}
