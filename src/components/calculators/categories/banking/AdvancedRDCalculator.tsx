"use client"

import { useState, useEffect } from "react"
import { PiggyBank, TrendingUp, Calendar } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { RDSeoContent } from "@/components/calculators/seo/BankingSeo"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AdvancedRDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(5)
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false)
  const [compoundingFreq, setCompoundingFreq] = useState(4) // 4 = Quarterly
  
  const [result, setResult] = useState<any>(null)

  const calculateRD = () => {
    const finalRate = isSeniorCitizen ? rate + 0.5 : rate
    const r = finalRate / 100
    const months = years * 12
    
    // Simulation approach for accurate compounding
    // Most Indian banks compound quarterly
    
    let balance = 0
    let totalInvested = 0
    const schedule = []
    
    // We need to simulate month by month
    // Interest is usually credited at the end of every quarter (Month 3, 6, 9, 12...)
    // But for RD, the standard formula often used is:
    // A = P * (1+r/n)^(n*t) for each installment? 
    // Actually, the General Formula for RD with Quarterly Compounding is:
    // Maturity = P * [ (1+r/4)^(4n/12) + (1+r/4)^(4(n-1)/12) + ... ] 
    // This is a geometric series.
    
    // Let's stick to the iterative simulation which is easier to chart and explain
    // We will assume interest is calculated monthly but compounded according to frequency
    
    // Actually, to match online calculators (like HDFC/SBI), they often use the formula:
    // A = P * ( (1+i)^n - 1 ) / (1 - (1+i)^(-1/3) ) ... complicated.
    
    // Let's use a robust approximation:
    // Calculate interest for every installment individually and sum them up.
    // Installment 1: invested for N months.
    // Installment 2: invested for N-1 months.
    // ...
    // Installment N: invested for 1 month.
    // Formula for one lump sum P for t years with q compounding is P(1+r/q)^(qt)
    
    let maturityAmount = 0
    const freq = compoundingFreq // 4 for quarterly
    
    for (let i = 0; i < months; i++) {
      const monthsRemaining = months - i
      const yearsRemaining = monthsRemaining / 12
      
      // Interest for this specific installment
      const installmentValue = monthlyDeposit * Math.pow(1 + r/freq, freq * yearsRemaining)
      maturityAmount += installmentValue
      
      totalInvested += monthlyDeposit
      
      // Add to schedule every year
      if ((i + 1) % 12 === 0) {
        schedule.push({
          year: (i + 1) / 12,
          invested: totalInvested,
          value: Math.round(maturityAmount - (monthlyDeposit * (months - 1 - i))) // Approximation for chart
          // Wait, the chart needs the accumulated value at that point in time, not the final value of installments paid so far.
        })
      }
    }
    
    // Let's redo the schedule for the chart correctly:
    // We need "Balance at end of Year X"
    // Re-run simulation for chart data
    const chartData = []
    let currentBalance = 0
    
    // This simulation assumes monthly compounding for simplicity in chart, 
    // but we use the rigorous formula for the final result.
    // Let's just use the rigorous formula for the final result and a close approximation for the chart.
    
    for (let y = 1; y <= years; y++) {
        // Calculate value of an RD of duration 'y' years
        let val = 0
        const m = y * 12
        for(let j=0; j<m; j++) {
            const monthsRem = m - j
            val += monthlyDeposit * Math.pow(1 + r/freq, freq * (monthsRem/12))
        }
        chartData.push({
            year: y,
            invested: monthlyDeposit * 12 * y,
            value: Math.round(val)
        })
    }

    setResult({
      maturityAmount: Math.round(maturityAmount),
      totalInvestment: monthlyDeposit * months,
      totalInterest: Math.round(maturityAmount - (monthlyDeposit * months)),
      chartData
    })
  }

  useEffect(() => {
    calculateRD()
  }, [monthlyDeposit, rate, years, isSeniorCitizen, compoundingFreq])

  return (
    <FinancialCalculatorTemplate
      title="Recurring Deposit (RD) Calculator"
      description="Calculate the maturity value of your RD with quarterly compounding logic used by banks."
      icon={PiggyBank}
      calculate={calculateRD}
      values={[monthlyDeposit, rate, years, isSeniorCitizen, compoundingFreq]}
      onClear={() => {
        setMonthlyDeposit(5000)
        setRate(6.5)
        setYears(5)
        setIsSeniorCitizen(false)
        setCompoundingFreq(4)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setMonthlyDeposit(Number(vals[0] ?? 5000))
        setRate(Number(vals[1] ?? 6.5))
        setYears(Number(vals[2] ?? 5))
        setIsSeniorCitizen(Boolean(vals[3] ?? false))
        setCompoundingFreq(Number(vals[4] ?? 4))
        setResult(null)
      }}
      seoContent={<RDSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label="Monthly Deposit" 
            value={monthlyDeposit} 
            onChange={setMonthlyDeposit} 
            prefix="₹" 
            min={500} 
            max={1000000} 
            step={500}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="Interest Rate" 
              value={rate} 
              onChange={setRate} 
              suffix="%" 
              min={2} 
              max={15} 
              step={0.1}
              helpText={isSeniorCitizen ? "+0.5% Senior Citizen bonus applied" : "Base rate"}
            />
            
            <InputGroup 
              label="Time Period (Years)" 
              value={years} 
              onChange={setYears} 
              min={1} 
              max={10} 
              step={1}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-base">Senior Citizen</Label>
              <p className="text-xs text-muted-foreground">Get extra 0.50% interest</p>
            </div>
            <Switch checked={isSeniorCitizen} onCheckedChange={setIsSeniorCitizen} />
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label="Maturity Amount" 
              value={`₹${result.maturityAmount.toLocaleString()}`} 
              type="highlight" 
            />
            <ResultCard 
              label="Total Investment" 
              value={`₹${result.totalInvestment.toLocaleString()}`} 
              type="default" 
            />
            <ResultCard 
              label="Total Interest" 
              value={`₹${result.totalInterest.toLocaleString()}`} 
              type="success" 
            />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip
                  formatter={(value) => {
                    const raw = Array.isArray(value) ? value[0] : value
                    const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                    return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="Maturity Value" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  name="Amount Invested" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorInvested)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
