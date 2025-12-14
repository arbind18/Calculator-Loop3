"use client"

import { useState } from "react"
import { Rocket, AlertTriangle } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"

export function StartupRunway() {
  const [cashBalance, setCashBalance] = useState(5000000)
  const [monthlyBurn, setMonthlyBurn] = useState(500000)
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000)
  const [growthRate, setGrowthRate] = useState(5) // Revenue growth %

  const [result, setResult] = useState<any>(null)

  const calculateRunway = () => {
    let balance = cashBalance
    let revenue = monthlyRevenue
    let months = 0
    const data = []

    // Simulate month by month
    while (balance > 0 && months < 60) { // Cap at 5 years
      const netBurn = monthlyBurn - revenue
      balance -= netBurn
      months++
      
      // Revenue grows
      revenue = revenue * (1 + growthRate / 100)

      if (months % 3 === 0 || balance <= 0) {
        data.push({
          month: months,
          balance: Math.max(0, Math.round(balance)),
          revenue: Math.round(revenue),
          burn: Math.round(monthlyBurn)
        })
      }
    }

    setResult({
      runwayMonths: months >= 60 ? "60+ Months" : `${months} Months`,
      isProfitable: monthlyRevenue > monthlyBurn,
      data
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Startup Runway Calculator"
      description="How long will your startup survive? Calculate your runway based on burn rate and revenue."
      icon={Rocket}
      calculate={calculateRunway}
      values={[cashBalance, monthlyBurn, monthlyRevenue, growthRate]}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Current Cash Balance" value={cashBalance} onChange={setCashBalance} prefix="₹" min={0} max={1000000000} />
            <InputGroup label="Monthly Burn (Expenses)" value={monthlyBurn} onChange={setMonthlyBurn} prefix="₹" min={0} max={100000000} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Monthly Revenue" value={monthlyRevenue} onChange={setMonthlyRevenue} prefix="₹" min={0} max={100000000} />
            <InputGroup label="Revenue Growth Rate" value={growthRate} onChange={setGrowthRate} suffix="%" helpText="Monthly growth %" min={0} max={100} />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Runway"
              value={result.runwayMonths}
              type={parseInt(result.runwayMonths) < 6 ? "warning" : "highlight"}
              subtext={parseInt(result.runwayMonths) < 6 ? "Urgent: Raise funds or cut costs!" : "Healthy runway"}
            />
          </div>
        </div>
      )}
      charts={result && (
        <div className="h-[350px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="balance" name="Cash Balance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
