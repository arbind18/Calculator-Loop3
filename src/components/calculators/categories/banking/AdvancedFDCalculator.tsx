"use client"

import { useState, useEffect } from "react"
import { Landmark, TrendingUp, Info } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { FDSeoContent } from "@/components/calculators/seo/BankingSeo"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AdvancedFDCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(7.0)
  const [tenureType, setTenureType] = useState<'years' | 'months' | 'days'>('years')
  const [tenureValue, setTenureValue] = useState(5)
  const [compoundingFreq, setCompoundingFreq] = useState(4) // 4 = Quarterly (Standard in India)
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false)
  
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie'>('pie')

  const calculateFD = () => {
    // Adjust rate for senior citizen
    const finalRate = isSeniorCitizen ? rate + 0.5 : rate
    
    let timeInYears = 0
    if (tenureType === 'years') timeInYears = tenureValue
    else if (tenureType === 'months') timeInYears = tenureValue / 12
    else timeInYears = tenureValue / 365

    const r = finalRate / 100
    const n = compoundingFreq // Times per year
    const t = timeInYears

    // A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + r/n, n * t)
    const totalInterest = maturityAmount - principal
    
    // Effective Yield = (Interest / Principal) / TimeInYears * 100 ?? No, usually (A-P)/P * 100 for absolute, or CAGR.
    // Annualized Yield = ((1 + r/n)^n - 1) * 100
    const annualizedYield = (Math.pow(1 + r/n, n) - 1) * 100

    setResult({
      maturityAmount: Math.round(maturityAmount),
      totalInterest: Math.round(totalInterest),
      principal,
      finalRate,
      annualizedYield: annualizedYield.toFixed(2)
    })
  }

  useEffect(() => {
    calculateFD()
  }, [principal, rate, tenureType, tenureValue, compoundingFreq, isSeniorCitizen])

  const chartData = result ? [
    { name: 'Principal Amount', value: result.principal, color: '#3b82f6' },
    { name: 'Total Interest', value: result.totalInterest, color: '#22c55e' },
  ] : []

  return (
    <FinancialCalculatorTemplate
      title="Advanced Fixed Deposit Calculator"
      description="Calculate FD returns with customizable compounding frequency and Senior Citizen rates."
      icon={Landmark}
      calculate={calculateFD}
      onClear={() => {
        setPrincipal(100000)
        setRate(7.0)
        setTenureValue(5)
        setTenureType('years')
      }}
      seoContent={<FDSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label="Deposit Amount" 
            value={principal} 
            onChange={setPrincipal} 
            prefix="₹" 
            min={1000} 
            max={100000000} 
            step={5000}
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
            
            <div className="space-y-2">
              <Label>Tenure</Label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tenureValue}
                  onChange={(e) => setTenureValue(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as any)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label>Compounding Frequency</Label>
              <select 
                value={compoundingFreq} 
                onChange={(e) => setCompoundingFreq(Number(e.target.value))}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="4">Quarterly (Standard)</option>
                <option value="12">Monthly</option>
                <option value="2">Half-Yearly</option>
                <option value="1">Yearly</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <Label className="text-base">Senior Citizen</Label>
                <p className="text-xs text-muted-foreground">Get extra 0.50% interest</p>
              </div>
              <Switch checked={isSeniorCitizen} onCheckedChange={setIsSeniorCitizen} />
            </div>
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
              label="Total Interest" 
              value={`₹${result.totalInterest.toLocaleString()}`} 
              type="success" 
            />
            <ResultCard 
              label="Effective Annual Yield" 
              value={`${result.annualizedYield}%`} 
              type="default" 
            />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const raw = Array.isArray(value) ? value[0] : value
                    const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                    return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
