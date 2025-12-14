"use client"

import { useState } from "react"
import { ShieldAlert, HeartPulse } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"

export function EmergencyFund() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000)
  const [dependents, setDependents] = useState(2)
  const [jobStability, setJobStability] = useState<'stable' | 'volatile'>('stable')
  const [monthsToCover, setMonthsToCover] = useState(6)

  const [result, setResult] = useState<any>(null)

  const calculateFund = () => {
    // Base recommendation
    let recommendedMonths = 6
    if (jobStability === 'volatile') recommendedMonths += 3
    if (dependents > 2) recommendedMonths += 3
    
    const recommendedAmount = monthlyExpenses * recommendedMonths
    const userTargetAmount = monthlyExpenses * monthsToCover

    setResult({
      recommendedMonths,
      recommendedAmount,
      userTargetAmount
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Emergency Fund Calculator"
      description="How much cash should you keep safe for rainy days?"
      icon={ShieldAlert}
      calculate={calculateFund}
      values={[monthlyExpenses, dependents, jobStability, monthsToCover]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} prefix="₹" helpText="Rent, EMI, Food, Bills" min={0} max={1000000} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Number of Dependents" value={dependents} onChange={setDependents} min={0} max={10} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Job/Income Stability</label>
              <select 
                className="w-full p-2 rounded-md border bg-background"
                value={jobStability}
                onChange={(e) => setJobStability(e.target.value as any)}
              >
                <option value="stable">Stable (Salaried/Govt)</option>
                <option value="volatile">Volatile (Freelance/Business)</option>
              </select>
            </div>
          </div>
          <InputGroup label="Months You Want to Cover" value={monthsToCover} onChange={setMonthsToCover} suffix="months" min={3} max={24} />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Recommended Fund Size"
              value={`₹${formatCompactNumber(result.recommendedAmount)}`}
              type="highlight"
              subtext={`Based on ${result.recommendedMonths} months coverage`}
            />
            <ResultCard
              label="Your Target Fund"
              value={`₹${formatCompactNumber(result.userTargetAmount)}`}
              type="default"
            />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Keep this amount in a Liquid Fund or High-Yield Savings Account. Do not invest it in stocks or lock-in instruments.
            </p>
          </div>
        </div>
      )}
    />
  )
}
