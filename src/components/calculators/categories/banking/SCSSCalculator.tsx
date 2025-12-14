"use client"

import { useState } from "react"
import { User, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"

export function SCSSCalculator() {
  const [investment, setInvestment] = useState(1500000)
  const [interestRate, setInterestRate] = useState(8.2) // Current SCSS Rate

  const [result, setResult] = useState<any>(null)

  const calculateSCSS = () => {
    // SCSS Rules:
    // Tenure 5 years.
    // Interest paid quarterly.
    
    const tenure = 5
    const quarterlyRate = interestRate / 4 / 100
    const quarterlyInterest = investment * quarterlyRate
    const totalInterest = quarterlyInterest * 4 * tenure
    const totalAmount = investment + totalInterest // Principal back at end

    setResult({
      quarterlyInterest,
      totalInterest,
      totalAmount,
      maturityDate: new Date().getFullYear() + 5
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Senior Citizen Savings Scheme (SCSS)"
      description="Calculate quarterly interest income for senior citizens."
      icon={User}
      calculate={calculateSCSS}
      values={[investment, interestRate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Investment Amount" value={investment} onChange={setInvestment} prefix="₹" min={1000} max={3000000} helpText="Max ₹30 Lakhs" />
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" min={0} max={15} helpText="Current Govt Rate ~8.2%" />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Quarterly Income"
              value={`₹${formatCompactNumber(result.quarterlyInterest)}`}
              type="highlight"
              subtext="Paid every 3 months"
            />
            <ResultCard
              label="Total Interest (5 Yrs)"
              value={`₹${formatCompactNumber(result.totalInterest)}`}
              type="default"
            />
            <ResultCard
              label="Total Maturity Value"
              value={`₹${formatCompactNumber(result.totalAmount)}`}
              type="default"
              subtext="Principal returned at end"
            />
          </div>
        </div>
      )}
    />
  )
}
