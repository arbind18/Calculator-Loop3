"use client"

import { useState } from "react"
import { Palmtree, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"
import { RetirementSeoContent } from "@/components/calculators/seo/InvestmentSeo"

export function RetirementCorpus() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [monthlyExpense, setMonthlyExpense] = useState(30000)
  const [inflation, setInflation] = useState(6)

  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const yearsToRetire = retirementAge - currentAge
    const yearsInRetirement = 25 // Assumed life expectancy till 85
    
    // Future Value of Monthly Expense
    const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflation/100, yearsToRetire)
    
    // Corpus needed to sustain this for 25 years (simplified)
    // Assuming corpus grows at inflation rate post retirement (real return 0%) to keep it simple safe
    const corpus = futureMonthlyExpense * 12 * yearsInRetirement
    
    // SIP Required to build this corpus (assuming 12% returns pre-retirement)
    const r = 12 / 100 / 12
    const n = yearsToRetire * 12
    const sipRequired = (corpus * r) / (Math.pow(1 + r, n) - 1)

    setResult({ 
      corpus: Math.round(corpus), 
      futureMonthlyExpense: Math.round(futureMonthlyExpense), 
      sipRequired: Math.round(sipRequired) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Retirement Corpus Calculator"
      description="How much money do you need to retire comfortably?"
      icon={Palmtree}
      calculate={calculate}
      values={[currentAge, retirementAge, monthlyExpense, inflation]}
      seoContent={<RetirementSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Current Age" value={currentAge} onChange={setCurrentAge} suffix="years" min={18} max={60} />
            <InputGroup label="Retirement Age" value={retirementAge} onChange={setRetirementAge} suffix="years" min={40} max={75} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Current Monthly Expense" value={monthlyExpense} onChange={setMonthlyExpense} prefix="₹" min={5000} max={500000} />
            <InputGroup label="Expected Inflation" value={inflation} onChange={setInflation} suffix="%" min={2} max={12} step={0.5} />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Required Corpus"
              value={`₹${formatCompactNumber(result.corpus)}`}
              type="highlight"
              subtext="At retirement age"
            />
            <ResultCard
              label="Monthly SIP Required"
              value={`₹${formatCompactNumber(result.sipRequired)}`}
              type="warning"
              subtext="@ 12% returns"
            />
            <ResultCard
              label="Future Monthly Expense"
              value={`₹${formatCompactNumber(result.futureMonthlyExpense)}`}
              type="default"
              subtext="Adjusted for inflation"
            />
          </div>
        </div>
      )}
    />
  )
}
