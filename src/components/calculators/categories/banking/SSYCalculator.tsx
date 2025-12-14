"use client"

import { useState } from "react"
import { Baby, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"

export function SSYCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000)
  const [childAge, setChildAge] = useState(5)
  const [interestRate, setInterestRate] = useState(8.2) // Current SSY Rate

  const [result, setResult] = useState<any>(null)

  const calculateSSY = () => {
    // SSY Rules:
    // Maturity is 21 years from account opening.
    // Deposits only for first 15 years.
    
    const maturityYears = 21
    const depositYears = 15
    let balance = 0
    let totalInvested = 0
    const data = []

    for (let i = 1; i <= maturityYears; i++) {
      if (i <= depositYears) {
        balance += yearlyInvestment
        totalInvested += yearlyInvestment
      }
      
      // Interest is compounded annually
      const interest = balance * (interestRate / 100)
      balance += interest

      data.push({
        year: i,
        age: childAge + i,
        invested: Math.round(totalInvested),
        balance: Math.round(balance),
        interest: Math.round(balance - totalInvested)
      })
    }

    setResult({
      maturityAmount: balance,
      totalInvested,
      totalInterest: balance - totalInvested,
      maturityYear: new Date().getFullYear() + maturityYears,
      data
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Sukanya Samriddhi Yojana (SSY)"
      description="Calculate returns for your daughter's future under the SSY scheme."
      icon={Baby}
      calculate={calculateSSY}
      values={[yearlyInvestment, childAge, interestRate]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Yearly Investment" value={yearlyInvestment} onChange={setYearlyInvestment} prefix="₹" min={250} max={150000} helpText="Max ₹1.5L per year" />
            <InputGroup label="Girl Child's Age" value={childAge} onChange={setChildAge} suffix="years" min={0} max={10} />
          </div>
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" min={0} max={15} helpText="Current Govt Rate ~8.2%" />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Maturity Amount"
              value={`₹${formatCompactNumber(result.maturityAmount)}`}
              type="highlight"
              subtext={`in Year ${result.maturityYear}`}
            />
            <ResultCard
              label="Total Invested"
              value={`₹${formatCompactNumber(result.totalInvested)}`}
              type="default"
            />
            <ResultCard
              label="Total Interest Earned"
              value={`₹${formatCompactNumber(result.totalInterest)}`}
              type="highlight"
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
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="age" label={{ value: 'Child Age', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="balance" 
                name="Maturity Value" 
                stroke="#ec4899" 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="invested" 
                name="Total Invested" 
                stroke="#94a3b8" 
                fillOpacity={0.5} 
                fill="#94a3b8" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
