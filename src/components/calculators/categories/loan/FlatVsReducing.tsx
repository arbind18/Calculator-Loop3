"use client"

import { useState, useEffect } from "react"
import { Percent, AlertTriangle, Info } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { calculateFlatVsReducing, FlatVsReducingResult } from "@/lib/logic/loan"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { generateReport } from "@/lib/downloadUtils"

export function FlatVsReducing() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)
  
  const [loanAmount, setLoanAmount] = useState(100000)
  const [flatRate, setFlatRate] = useState(10) // % p.a.
  const [tenure, setTenure] = useState(3) // years

  const [result, setResult] = useState<FlatVsReducingResult | null>(null)

  const handleCalculate = () => {
    const calculationResult = calculateFlatVsReducing({
      loanAmount,
      flatRate,
      tenureYears: tenure
    })
    setResult(calculationResult)
  }

  useEffect(() => {
    handleCalculate()
  }, [loanAmount, flatRate, tenure])

  const handleClear = () => {
    setLoanAmount(100000)
    setFlatRate(10)
    setTenure(3)
    setResult(null)
  }

  const handleDownload = (format: string) => {
    if (!result) return

    const headers = [t.common.result, t.loan.flat_rate, t.loan.reducing_rate]
    const data = [
      [t.loan.loan_amount, loanAmount, loanAmount],
      [t.loan.interest_rate, `${flatRate}%`, `${flatRate}%`],
      [t.loan.tenure_years, tenure, tenure],
      [t.loan.emi, result.emiFlat, result.emiReducing],
      [t.loan.interest_paid, result.totalInterestFlat, result.totalInterestReducing],
    ]

    generateReport(format, 'flat_vs_reducing', headers, data, t.loan.flat_vs_reducing_title)
  }

  return (
    <FinancialCalculatorTemplate
      title={t.loan.flat_vs_reducing_title}
      description={t.loan.flat_vs_reducing_desc}
      icon={Percent}
      calculate={handleCalculate}
      onClear={handleClear}
      onDownload={handleDownload}
      inputs={
        <div className="space-y-4">
          <InputGroup
            label={t.loan.loan_amount}
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={10000000}
            step={5000}
            prefix="?"
          />
          <InputGroup
            label={t.loan.flat_rate}
            value={flatRate}
            onChange={setFlatRate}
            min={1}
            max={50}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label={t.loan.tenure_years}
            value={tenure}
            onChange={setTenure}
            min={1}
            max={10}
            step={1}
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t.loan.effective_rate}
              value={`${result.effectiveRate.toFixed(2)}%`}
              type="highlight"
            />
            <ResultCard
              label={t.loan.flat_interest}
              value={`${result.effectiveRate.toFixed(2)}%`}
              type="warning"
            />
            <ResultCard
              label={t.loan.reducing_interest}
              value={`${result.effectiveRate.toFixed(2)}%`}
              type="default"
            />
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Did you know?</p>
              <p>A flat rate of {flatRate}% is actually equal to a reducing rate of {result.effectiveRate}%! You are paying ?{result.difference.toLocaleString()} more in interest than you might think.</p>
            </div>
          </div>
        </div>
      )}
    />
  )
}
