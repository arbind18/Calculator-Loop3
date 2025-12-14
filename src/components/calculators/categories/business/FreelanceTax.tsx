"use client"

import { useState } from "react"
import { Laptop, DollarSign } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { formatCompactNumber } from "@/lib/utils"

export function FreelanceTax() {
  const [annualIncome, setAnnualIncome] = useState(1500000)
  const [expenses, setExpenses] = useState(200000)
  const [usePresumptive, setUsePresumptive] = useState(true) // 44ADA

  const [result, setResult] = useState<any>(null)

  const calculateTax = () => {
    // Section 44ADA: 50% of gross receipts is taxable income
    let taxableIncome = 0
    
    if (usePresumptive) {
      taxableIncome = annualIncome * 0.5
    } else {
      taxableIncome = annualIncome - expenses
    }

    // Tax Calculation (New Regime Simplified)
    // 0-3L: 0, 3-6L: 5%, 6-9L: 10%, 9-12L: 15%, 12-15L: 20%, >15L: 30%
    let tax = 0
    const incomeForTax = Math.max(0, taxableIncome) // No standard deduction for business usually, but let's keep it simple

    if (incomeForTax > 300000) tax += Math.min(300000, incomeForTax - 300000) * 0.05
    if (incomeForTax > 600000) tax += Math.min(300000, incomeForTax - 600000) * 0.10
    if (incomeForTax > 900000) tax += Math.min(300000, incomeForTax - 900000) * 0.15
    if (incomeForTax > 1200000) tax += Math.min(300000, incomeForTax - 1200000) * 0.20
    if (incomeForTax > 1500000) tax += (incomeForTax - 1500000) * 0.30

    // Rebate 87A
    if (incomeForTax <= 700000) tax = 0

    // Cess
    tax = tax * 1.04

    setResult({
      taxableIncome,
      tax,
      inHand: annualIncome - tax - (usePresumptive ? 0 : expenses), // If presumptive, expenses are deemed covered
      effectiveRate: (tax / annualIncome) * 100
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Freelancer Tax Estimator"
      description="Calculate tax for freelancers/professionals (Section 44ADA vs Normal)."
      icon={Laptop}
      calculate={calculateTax}
      values={[annualIncome, expenses, usePresumptive]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Gross Receipts" value={annualIncome} onChange={setAnnualIncome} prefix="₹" min={0} max={100000000} />
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <Switch 
              id="presumptive"
              checked={usePresumptive} 
              onCheckedChange={setUsePresumptive}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="presumptive" className="font-medium cursor-pointer">
                Use Presumptive Taxation (44ADA)
              </Label>
              <p className="text-xs text-muted-foreground">Declare 50% income flat. No audit needed up to ₹75L.</p>
            </div>
          </div>
          {!usePresumptive && (
            <InputGroup label="Actual Business Expenses" value={expenses} onChange={setExpenses} prefix="₹" min={0} max={100000000} />
          )}
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Taxable Income"
              value={`₹${formatCompactNumber(result.taxableIncome)}`}
              type="default"
              subtext={usePresumptive ? "50% of Gross" : "Gross - Expenses"}
            />
            <ResultCard
              label="Estimated Tax"
              value={`₹${formatCompactNumber(result.tax)}`}
              type="warning"
            />
            <ResultCard
              label="Effective Tax Rate"
              value={`${result.effectiveRate.toFixed(1)}%`}
              type="default"
            />
          </div>
        </div>
      )}
    />
  )
}
