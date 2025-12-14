"use client"

import { useState } from "react"
import { Scale, CheckCircle } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"
import { IncomeTaxSeoContent } from "@/components/calculators/seo/TaxSeo"

export function OldVsNewRegime() {
  const [income, setIncome] = useState(1200000)
  const [deductions, setDeductions] = useState(150000) // 80C
  const [hra, setHra] = useState(0)
  const [otherDeductions, setOtherDeductions] = useState(50000) // Standard Deduction etc

  const [result, setResult] = useState<any>(null)

  const calculateTax = () => {
    // New Regime Slabs (FY 2023-24 onwards simplified)
    // 0-3L: 0, 3-6L: 5%, 6-9L: 10%, 9-12L: 15%, 12-15L: 20%, >15L: 30%
    // Standard Deduction 50k allowed in New Regime now
    
    const newRegimeTaxable = Math.max(0, income - 50000)
    let taxNew = 0
    
    if (newRegimeTaxable > 300000) taxNew += Math.min(300000, newRegimeTaxable - 300000) * 0.05
    if (newRegimeTaxable > 600000) taxNew += Math.min(300000, newRegimeTaxable - 600000) * 0.10
    if (newRegimeTaxable > 900000) taxNew += Math.min(300000, newRegimeTaxable - 900000) * 0.15
    if (newRegimeTaxable > 1200000) taxNew += Math.min(300000, newRegimeTaxable - 1200000) * 0.20
    if (newRegimeTaxable > 1500000) taxNew += (newRegimeTaxable - 1500000) * 0.30

    // Rebate u/s 87A if income <= 7L in New Regime
    if (newRegimeTaxable <= 700000) taxNew = 0

    // Old Regime Slabs
    // 0-2.5L: 0, 2.5-5L: 5%, 5-10L: 20%, >10L: 30%
    const oldRegimeTaxable = Math.max(0, income - deductions - hra - otherDeductions)
    let taxOld = 0

    if (oldRegimeTaxable > 250000) taxOld += Math.min(250000, oldRegimeTaxable - 250000) * 0.05
    if (oldRegimeTaxable > 500000) taxOld += Math.min(500000, oldRegimeTaxable - 500000) * 0.20
    if (oldRegimeTaxable > 1000000) taxOld += (oldRegimeTaxable - 1000000) * 0.30

    // Rebate u/s 87A if income <= 5L in Old Regime
    if (oldRegimeTaxable <= 500000) taxOld = 0

    // Cess 4%
    taxNew = taxNew * 1.04
    taxOld = taxOld * 1.04

    setResult({
      taxNew,
      taxOld,
      savings: Math.abs(taxNew - taxOld),
      betterRegime: taxNew < taxOld ? 'New Regime' : 'Old Regime'
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Old vs New Tax Regime"
      description="Compare your tax liability under both regimes to find maximum savings."
      icon={Scale}
      calculate={calculateTax}
      seoContent={<IncomeTaxSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup label="Annual Income" value={income} onChange={setIncome} prefix="₹" min={0} max={100000000} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="80C Deductions" value={deductions} onChange={setDeductions} prefix="₹" helpText="PF, PPF, ELSS, LIC" min={0} max={150000} />
          <InputGroup label="HRA Exemption" value={hra} onChange={setHra} prefix="₹" min={0} max={10000000} />
          <InputGroup label="Other Deductions" value={otherDeductions} onChange={setOtherDeductions} prefix="₹" helpText="Standard Ded, 80D, etc" min={0} max={10000000} />
        </div>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Recommendation"
              value={result.betterRegime}
              type="highlight"
              icon={CheckCircle}
            />
            <ResultCard
              label="Tax in New Regime"
              value={`₹${formatCompactNumber(result.taxNew)}`}
              type={result.betterRegime === 'New Regime' ? 'highlight' : 'default'}
            />
            <ResultCard
              label="Tax in Old Regime"
              value={`₹${formatCompactNumber(result.taxOld)}`}
              type={result.betterRegime === 'Old Regime' ? 'highlight' : 'default'}
            />
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              You save <strong>₹{result.savings.toLocaleString()}</strong> by choosing the {result.betterRegime}!
            </p>
          </div>
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}
