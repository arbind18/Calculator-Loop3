"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, Target, Percent, Calculator, PieChart, BarChart3, AlertCircle, CheckCircle, Info, Zap, Wallet } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

interface PricingResult {
  costPerUnit: number
  targetMargin: number
  recommendedPrice: number
  breakEvenUnits: number
  breakEvenRevenue: number
  markupPercent: number
  profitPerUnit: number
  contributionMargin: number
  competitorGap: number
  priceElasticityImpact: number
  sensitivity: {
    price: number
    profit: number
    margin: number
  }[]
  insights: string[]
  warnings: string[]
}

export function AdvancedPricingStrategyCalculator() {
  const [costPerUnit, setCostPerUnit] = useState(250)
  const [fixedCosts, setFixedCosts] = useState(50000)
  const [targetMargin, setTargetMargin] = useState(40)
  const [expectedVolume, setExpectedVolume] = useState(1000)
  const [competitorPrice, setCompetitorPrice] = useState(350)
  const [priceElasticity, setPriceElasticity] = useState(1.2)
  const [desiredProfit, setDesiredProfit] = useState(80000)
  const [discountRate, setDiscountRate] = useState(10)
  const [result, setResult] = useState<PricingResult | null>(null)

  const calculate = () => {
    // Basic pricing calculations
    const recommendedPrice = costPerUnit / (1 - targetMargin / 100)
    const profitPerUnit = recommendedPrice - costPerUnit
    const markupPercent = (profitPerUnit / costPerUnit) * 100
    const contributionMargin = profitPerUnit
    
    // Break-even analysis
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0
    const breakEvenRevenue = breakEvenUnits * recommendedPrice
    
    // Competitor analysis
    const competitorGap = ((recommendedPrice - competitorPrice) / competitorPrice) * 100
    
    // Price elasticity impact (if price changes)
    const priceChangePercent = ((recommendedPrice - competitorPrice) / competitorPrice) * 100
    const demandChangePercent = -priceElasticity * priceChangePercent
    const priceElasticityImpact = demandChangePercent
    
    // Sensitivity analysis (±10% price changes)
    const sensitivity = [-10, -5, 0, 5, 10].map(change => {
      const newPrice = recommendedPrice * (1 + change / 100)
      const newProfit = (newPrice - costPerUnit) * expectedVolume
      const newMargin = ((newPrice - costPerUnit) / newPrice) * 100
      return {
        price: newPrice,
        profit: newProfit,
        margin: newMargin
      }
    })

    // Insights and warnings
    const insights: string[] = []
    const warnings: string[] = []

    if (recommendedPrice > competitorPrice) {
      warnings.push(`Recommended price is ${competitorGap.toFixed(1)}% above competitor. Consider value differentiation.`)
    } else {
      insights.push(`Competitive pricing: ${Math.abs(competitorGap).toFixed(1)}% below competitor.`)
    }

    if (breakEvenUnits <= expectedVolume) {
      insights.push(`Break-even achievable: ${breakEvenUnits.toFixed(0)} units vs expected ${expectedVolume}.`)
    } else {
      warnings.push(`Break-even requires ${breakEvenUnits.toFixed(0)} units, higher than expected volume.`)
    }

    if (profitPerUnit > 0) {
      insights.push(`Healthy profit per unit: ₹${profitPerUnit.toFixed(2)}.`)
    }

    if (priceElasticityImpact < -10) {
      warnings.push(`High elasticity impact: demand may drop by ${Math.abs(priceElasticityImpact).toFixed(1)}%.`)
    }

    if (recommendedPrice * expectedVolume - fixedCosts < desiredProfit) {
      warnings.push(`Target profit ₹${desiredProfit.toLocaleString('en-IN')} not met at expected volume.`)
    } else {
      insights.push(`Target profit achievable at expected volume.`)
    }

    setResult({
      costPerUnit,
      targetMargin,
      recommendedPrice,
      breakEvenUnits,
      breakEvenRevenue,
      markupPercent,
      profitPerUnit,
      contributionMargin,
      competitorGap,
      priceElasticityImpact,
      sensitivity,
      insights,
      warnings
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced Pricing Strategy Calculator"
      description="Optimize pricing with margin targets, break-even analysis, competitor comparison, and elasticity impact modeling."
      icon={DollarSign}
      calculate={calculate}
      values={[costPerUnit, fixedCosts, targetMargin, expectedVolume, competitorPrice, priceElasticity, desiredProfit, discountRate]}
      calculatorId="advanced-pricing-strategy-calculator"
      category="Business"
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Cost per Unit"
            value={costPerUnit}
            onChange={setCostPerUnit}
            min={1}
            max={100000}
            step={1}
            prefix="₹"
            helpText="Direct cost of producing one unit"
          />
          <InputGroup
            label="Fixed Costs"
            value={fixedCosts}
            onChange={setFixedCosts}
            min={0}
            max={10000000}
            step={1000}
            prefix="₹"
            helpText="Monthly/annual fixed costs"
          />
          <InputGroup
            label="Target Margin"
            value={targetMargin}
            onChange={setTargetMargin}
            min={1}
            max={80}
            step={1}
            suffix="%"
            helpText="Desired profit margin percentage"
          />
          <InputGroup
            label="Expected Volume"
            value={expectedVolume}
            onChange={setExpectedVolume}
            min={1}
            max={100000}
            step={10}
            helpText="Expected units sold per period"
          />
          <InputGroup
            label="Competitor Price"
            value={competitorPrice}
            onChange={setCompetitorPrice}
            min={1}
            max={100000}
            step={1}
            prefix="₹"
            helpText="Average competitor price"
          />
          <InputGroup
            label="Price Elasticity"
            value={priceElasticity}
            onChange={setPriceElasticity}
            min={0.1}
            max={5}
            step={0.1}
            helpText="Demand sensitivity to price changes"
          />
          <InputGroup
            label="Desired Profit"
            value={desiredProfit}
            onChange={setDesiredProfit}
            min={0}
            max={10000000}
            step={1000}
            prefix="₹"
            helpText="Target profit amount"
          />
          <InputGroup
            label="Discount Rate"
            value={discountRate}
            onChange={setDiscountRate}
            min={0}
            max={50}
            step={1}
            suffix="%"
            helpText="Expected discounting/promotional rate"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label="Recommended Price"
              value={result.recommendedPrice.toFixed(2)}
              prefix="₹"
              type="highlight"
              icon={Target}
            />
            <ResultCard
              label="Profit per Unit"
              value={result.profitPerUnit.toFixed(2)}
              prefix="₹"
              type="success"
              icon={TrendingUp}
            />
            <ResultCard
              label="Break-Even Units"
              value={result.breakEvenUnits.toFixed(0)}
              type="default"
              icon={BarChart3}
            />
            <ResultCard
              label="Markup %"
              value={result.markupPercent.toFixed(1)}
              suffix="%"
              type="default"
              icon={Percent}
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Pricing Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Competitor Gap:</strong> {result.competitorGap.toFixed(1)}%</p>
                <p><strong>Elasticity Impact:</strong> {result.priceElasticityImpact.toFixed(1)}%</p>
                <p><strong>Break-even Revenue:</strong> ₹{result.breakEvenRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p><strong>Target Margin:</strong> {result.targetMargin}%</p>
                <p><strong>Contribution Margin:</strong> ₹{result.contributionMargin.toFixed(2)}</p>
                <p><strong>Discount Sensitivity:</strong> {discountRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Price Sensitivity Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 text-left">Price Change</th>
                    <th className="px-4 py-3 text-right">New Price</th>
                    <th className="px-4 py-3 text-right">Profit</th>
                    <th className="px-4 py-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[-10, -5, 0, 5, 10].map((change, idx) => {
                    const row = result.sensitivity[idx]
                    return (
                      <tr key={change} className="hover:bg-secondary/20">
                        <td className="px-4 py-3">{change > 0 ? `+${change}%` : `${change}%`}</td>
                        <td className="px-4 py-3 text-right">₹{row.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">₹{row.profit.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right">{row.margin.toFixed(1)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {result.insights.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Positive Insights
              </h3>
              <ul className="space-y-2">
                {result.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Warnings
              </h3>
              <ul className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <span className="text-orange-500 mt-0.5">⚠</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    />
  )
}
