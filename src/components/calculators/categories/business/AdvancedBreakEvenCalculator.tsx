"use client"

import { useState, useEffect } from "react"
import { Target, TrendingUp, Info } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { BreakEvenSeoContent } from "@/components/calculators/seo/BusinessSeo"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine 
} from "recharts"

export function AdvancedBreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState(50000)
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(200)
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(500)
  
  const [result, setResult] = useState<any>(null)

  const calculateBreakEven = () => {
    // BEP (Units) = Fixed Costs / (Selling Price - Variable Cost)
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit
    
    if (contributionMargin <= 0) {
      setResult({ error: "Selling Price must be greater than Variable Cost per unit." })
      return
    }

    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin)
    const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit
    
    // Generate Chart Data
    // We want to show a range from 0 to 2x Break Even Units
    const maxUnits = breakEvenUnits * 2 || 100
    const step = Math.ceil(maxUnits / 10)
    const data = []

    for (let units = 0; units <= maxUnits; units += step) {
      const totalRevenue = units * sellingPricePerUnit
      const totalVariableCost = units * variableCostPerUnit
      const totalCost = fixedCosts + totalVariableCost
      
      data.push({
        units,
        revenue: totalRevenue,
        totalCost: totalCost,
        fixedCost: fixedCosts
      })
    }

    setResult({
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio: ((contributionMargin / sellingPricePerUnit) * 100).toFixed(2),
      data
    })
  }

  useEffect(() => {
    calculateBreakEven()
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit])

  return (
    <FinancialCalculatorTemplate
      title="Advanced Break-Even Calculator"
      description="Determine the sales volume needed to cover costs and start making a profit."
      icon={Target}
      calculate={calculateBreakEven}
      onClear={() => {
        setFixedCosts(50000)
        setVariableCostPerUnit(200)
        setSellingPricePerUnit(500)
      }}
      seoContent={<BreakEvenSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label="Total Fixed Costs" 
            value={fixedCosts} 
            onChange={setFixedCosts} 
            prefix="₹" 
            min={0} 
            max={10000000} 
            step={1000}
            helpText="Rent, salaries, insurance, etc."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="Variable Cost per Unit" 
              value={variableCostPerUnit} 
              onChange={setVariableCostPerUnit} 
              prefix="₹" 
              min={0} 
              max={100000} 
              step={10}
              helpText="Materials, packaging, shipping"
            />
            
            <InputGroup 
              label="Selling Price per Unit" 
              value={sellingPricePerUnit} 
              onChange={setSellingPricePerUnit} 
              prefix="₹" 
              min={1} 
              max={200000} 
              step={10}
            />
          </div>
        </div>
      }
      result={result && (
        result.error ? (
          <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
            {result.error}
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard 
                label="Break-Even Units" 
                value={`${result.breakEvenUnits.toLocaleString()} units`} 
                type="highlight" 
              />
              <ResultCard 
                label="Break-Even Revenue" 
                value={`₹${result.breakEvenRevenue.toLocaleString()}`} 
                type="success" 
              />
              <ResultCard 
                label="Contribution Margin" 
                value={`₹${result.contributionMargin} / unit`} 
                type="default" 
              />
              <ResultCard 
                label="Margin Ratio" 
                value={`${result.contributionMarginRatio}%`} 
                type="default" 
              />
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="units" 
                    label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value/1000}k`} 
                  />
                  <Tooltip
                    formatter={(value) => {
                      const raw = Array.isArray(value) ? value[0] : value
                      const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                      return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                    }}
                  />
                  <Legend />
                  <ReferenceLine x={result.breakEvenUnits} stroke="red" strokeDasharray="3 3" label="Break Even" />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Total Revenue" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalCost" 
                    name="Total Costs" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fixedCost" 
                    name="Fixed Costs" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      )}
    />
  )
}
