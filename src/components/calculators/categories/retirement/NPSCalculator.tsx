"use client"

import { useState } from "react"
import { Briefcase, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"
import { NPSSeoContent } from "@/components/calculators/seo/TaxSeo"

export function NPSCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [age, setAge] = useState(30)
  const [returns, setReturns] = useState(10)

  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const years = 60 - age
    const months = years * 12
    const r = returns / 100 / 12
    const corpus = monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r))
    const annuity = corpus * 0.40
    const lumpsum = corpus * 0.60
    const monthlyPension = (annuity * 0.06) / 12
    
    setResult({ 
      corpus: Math.round(corpus), 
      annuity: Math.round(annuity), 
      lumpsum: Math.round(lumpsum), 
      pension: Math.round(monthlyPension) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="NPS Calculator"
      description="Calculate your National Pension System (NPS) corpus and monthly pension."
      icon={Briefcase}
      calculate={calculate}
      values={[monthly, age, returns]}
      seoContent={<NPSSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Contribution" value={monthly} onChange={setMonthly} prefix="₹" min={500} max={200000} step={500} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Current Age" value={age} onChange={setAge} suffix="years" min={18} max={59} />
            <InputGroup label="Expected Returns" value={returns} onChange={setReturns} suffix="%" min={5} max={15} step={0.5} />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Total Corpus at 60"
              value={`₹${formatCompactNumber(result.corpus)}`}
              type="highlight"
            />
            <ResultCard
              label="Est. Monthly Pension"
              value={`₹${formatCompactNumber(result.pension)}`}
              type="highlight"
            />
            <ResultCard
              label="Lumpsum Withdrawal (60%)"
              value={`₹${formatCompactNumber(result.lumpsum)}`}
              type="default"
            />
            <ResultCard
              label="Annuity Value (40%)"
              value={`₹${formatCompactNumber(result.annuity)}`}
              type="default"
            />
          </div>
        </div>
      )}
    />
  )
}
