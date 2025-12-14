"use client"

import { useState } from "react"
import { TrendingUp, Layers } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"

export function StepUpSIP() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [annualStepUp, setAnnualStepUp] = useState(10) // Percentage increase
  const [returnRate, setReturnRate] = useState(12)
  const [duration, setDuration] = useState(10)

  const [result, setResult] = useState<any>(null)

  const calculateStepUpSIP = () => {
    let currentMonthlyInv = monthlyInvestment
    let totalInvested = 0
    let currentValue = 0
    const monthlyRate = returnRate / 12 / 100
    const data = []

    for (let year = 1; year <= duration; year++) {
      // For each month in the year
      for (let month = 1; month <= 12; month++) {
        currentValue = (currentValue + currentMonthlyInv) * (1 + monthlyRate)
        totalInvested += currentMonthlyInv
      }

      data.push({
        year,
        invested: Math.round(totalInvested),
        value: Math.round(currentValue),
        normalSIPValue: calculateNormalSIPValue(monthlyInvestment, returnRate, year) // For comparison
      })

      // Increase investment for next year
      currentMonthlyInv = currentMonthlyInv * (1 + annualStepUp / 100)
    }

    setResult({
      totalInvested,
      totalValue: currentValue,
      wealthGained: currentValue - totalInvested,
      normalSIPValue: data[data.length - 1].normalSIPValue,
      extraWealth: currentValue - data[data.length - 1].normalSIPValue,
      data
    })
  }

  const calculateNormalSIPValue = (p: number, r: number, t: number) => {
    const monthlyRate = r / 12 / 100
    const months = t * 12
    return p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  }

  return (
    <FinancialCalculatorTemplate
      title="Step-Up SIP Calculator"
      description="See the magic of increasing your SIP annually. Small increments lead to massive wealth."
      icon={Layers}
      calculate={calculateStepUpSIP}
      values={[monthlyInvestment, annualStepUp, returnRate, duration]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} prefix="₹" />
            <InputGroup label="Annual Step-Up" value={annualStepUp} onChange={setAnnualStepUp} suffix="%" helpText="Increase investment by this % every year" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Exp. Return Rate" value={returnRate} onChange={setReturnRate} suffix="%" />
            <InputGroup label="Duration" value={duration} onChange={setDuration} suffix="years" />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Total Value"
              value={`₹${formatCompactNumber(result.totalValue)}`}
              type="highlight"
            />
            <ResultCard
              label="Wealth Gained"
              value={`₹${formatCompactNumber(result.wealthGained)}`}
              type="default"
            />
            <ResultCard
              label="Extra vs Normal SIP"
              value={`+₹${formatCompactNumber(result.extraWealth)}`}
              type="highlight"
              subtext="Power of Step-Up!"
            />
          </div>
        </div>
      )}
      charts={result && (
        <div className="h-[400px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Step-Up SIP Value" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="normalSIPValue" 
                name="Normal SIP Value" 
                stroke="#94a3b8" 
                fillOpacity={1} 
                fill="url(#colorNormal)" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
