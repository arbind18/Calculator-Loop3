"use client"

import { useState } from "react"
import { Umbrella, ShieldCheck } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"

export function LifeInsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState(1000000)
  const [yearsToSupport, setYearsToSupport] = useState(15)
  const [loans, setLoans] = useState(2000000)
  const [savings, setSavings] = useState(500000)

  const [result, setResult] = useState<any>(null)

  const calculateInsurance = () => {
    // Human Life Value (HLV) approach simplified
    // Income Replacement + Debt - Savings
    
    const incomeReplacement = annualIncome * yearsToSupport
    const totalNeed = incomeReplacement + loans
    const insuranceNeeded = Math.max(0, totalNeed - savings)

    setResult({
      insuranceNeeded,
      incomeReplacement,
      liabilityCover: loans
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Life Insurance Need Calculator"
      description="Calculate how much life insurance cover (Term Plan) you actually need."
      icon={Umbrella}
      calculate={calculateInsurance}
      values={[annualIncome, yearsToSupport, loans, savings]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Income" value={annualIncome} onChange={setAnnualIncome} prefix="₹" min={0} max={100000000} />
          <InputGroup label="Years to Support Family" value={yearsToSupport} onChange={setYearsToSupport} suffix="years" min={1} max={50} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Outstanding Loans/Debt" value={loans} onChange={setLoans} prefix="₹" min={0} max={100000000} />
            <InputGroup label="Existing Savings/Investments" value={savings} onChange={setSavings} prefix="₹" min={0} max={100000000} />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Recommended Insurance Cover"
              value={`₹${formatCompactNumber(result.insuranceNeeded)}`}
              type="highlight"
              icon={ShieldCheck}
            />
            <ResultCard
              label="Income Replacement Value"
              value={`₹${formatCompactNumber(result.incomeReplacement)}`}
              type="default"
            />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              This amount ensures your family can maintain their lifestyle and pay off debts in your absence.
            </p>
          </div>
        </div>
      )}
    />
  )
}
