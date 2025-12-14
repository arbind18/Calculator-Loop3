"use client"

import { useState } from "react"
import { Flame, TrendingUp, DollarSign } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"
import { RetirementSeoContent } from "@/components/calculators/seo/InvestmentSeo"

export function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(25)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(20000)
  const [returnRate, setReturnRate] = useState(10)
  const [inflationRate, setInflationRate] = useState(6)
  const [withdrawalRate, setWithdrawalRate] = useState(4)
  
  const [result, setResult] = useState<any>(null)

  const calculateFIRE = () => {
    const annualExpenses = monthlyExpenses * 12
    const fireNumber = annualExpenses * (100 / withdrawalRate) // Rule of 25 usually
    
    let age = currentAge
    let balance = currentSavings
    let expenses = annualExpenses
    const data = []
    let fireAge = null

    // Project for next 60 years or until age 100
    for (let i = 0; i <= (100 - currentAge); i++) {
      const year = new Date().getFullYear() + i
      
      // Adjust expenses for inflation
      if (i > 0) {
        expenses = expenses * (1 + inflationRate / 100)
      }

      // Calculate required corpus for this year's expenses
      const requiredCorpus = expenses * (100 / withdrawalRate)

      // Add investment returns and new contributions
      if (i > 0) {
        balance = balance * (1 + returnRate / 100) + (monthlyInvestment * 12)
      }

      // Check if FIRE achieved
      if (balance >= requiredCorpus && fireAge === null) {
        fireAge = age
      }

      data.push({
        age,
        year,
        balance: Math.round(balance),
        required: Math.round(requiredCorpus),
        expenses: Math.round(expenses)
      })

      age++
    }

    setResult({
      fireNumber: data[0].required, // Based on current expenses, but usually we project future. Let's use the crossing point logic.
      projectedFireNumber: data.find(d => d.age === fireAge)?.required || 0,
      fireAge: fireAge || "Never",
      yearsToFreedom: fireAge ? fireAge - currentAge : "N/A",
      data
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="FIRE Calculator (Financial Independence)"
      description="Plan your early retirement. Calculate your 'FIRE Number' and find out exactly when you can stop working."
      icon={Flame}
      calculate={calculateFIRE}
      values={[currentAge, currentSavings, monthlyExpenses, monthlyInvestment, returnRate]}
      seoContent={<RetirementSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Current Age" value={currentAge} onChange={setCurrentAge} min={18} max={80} suffix="yrs" />
            <InputGroup label="Current Savings" value={currentSavings} onChange={setCurrentSavings} prefix="₹" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Monthly Expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} prefix="₹" />
            <InputGroup label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} prefix="₹" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Exp. Return" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
            <InputGroup label="Inflation" value={inflationRate} onChange={setInflationRate} suffix="%" step={0.1} />
            <InputGroup label="Withdrawal Rate" value={withdrawalRate} onChange={setWithdrawalRate} suffix="%" step={0.1} helpText="Safe rate is usually 3-4%" />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="FIRE Age"
              value={result.fireAge}
              type="highlight"
              subtext={typeof result.yearsToFreedom === 'number' ? `${result.yearsToFreedom} years to go!` : undefined}
            />
            <ResultCard
              label="Target Corpus (at FIRE age)"
              value={`₹${formatCompactNumber(result.projectedFireNumber)}`}
              type="default"
            />
            <ResultCard
              label="Current FIRE Number"
              value={`₹${formatCompactNumber(result.fireNumber)}`}
              type="default"
              subtext="If you retired today"
            />
          </div>
        </div>
      )}
      charts={result && (
        <div className="h-[400px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.data}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip 
                formatter={(value: number) => `₹${value.toLocaleString()}`}
                labelFormatter={(label) => `Age: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="balance" 
                name="Your Wealth" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="required" 
                name="Required for FIRE" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorRequired)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
