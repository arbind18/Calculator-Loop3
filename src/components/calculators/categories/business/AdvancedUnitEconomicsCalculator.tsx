"use client"

import { useMemo, useState } from "react"
import { AlertCircle, CheckCircle, DollarSign, Info, Target, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

interface UnitEconomicsResult {
  arpu: number
  grossMarginPercent: number
  contributionMargin: number
  contributionMarginPercent: number
  breakEvenUnits: number
  breakEvenRevenue: number
  ltv: number
  ltvToCac: number
  paybackMonths: number
  netUnitProfit: number
  insights: string[]
  warnings: string[]
}

export function AdvancedUnitEconomicsCalculator() {
  const [pricePerUnit, setPricePerUnit] = useState(1200)
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(420)
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState(350000)
  const [monthlyUnits, setMonthlyUnits] = useState(1200)
  const [customerAcquisitionCost, setCustomerAcquisitionCost] = useState(6000)
  const [monthlyChurnRate, setMonthlyChurnRate] = useState(4)
  const [avgMonthlyRevenuePerCustomer, setAvgMonthlyRevenuePerCustomer] = useState(1800)

  const [result, setResult] = useState<UnitEconomicsResult | null>(null)

  const calculate = () => {
    const arpu = avgMonthlyRevenuePerCustomer
    const grossMarginPercent = pricePerUnit > 0 ? ((pricePerUnit - variableCostPerUnit) / pricePerUnit) * 100 : 0
    const contributionMargin = pricePerUnit - variableCostPerUnit
    const contributionMarginPercent = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0

    const breakEvenUnits = contributionMargin > 0 ? monthlyFixedCosts / contributionMargin : 0
    const breakEvenRevenue = breakEvenUnits * pricePerUnit

    const churn = monthlyChurnRate / 100
    const ltv = churn > 0 ? arpu * (grossMarginPercent / 100) / churn : 0
    const ltvToCac = customerAcquisitionCost > 0 ? ltv / customerAcquisitionCost : 0

    const grossMarginPerCustomer = arpu * (grossMarginPercent / 100)
    const paybackMonths = grossMarginPerCustomer > 0 ? customerAcquisitionCost / grossMarginPerCustomer : 0

    const netUnitProfit = contributionMargin - monthlyFixedCosts / Math.max(monthlyUnits, 1)

    const insights: string[] = []
    const warnings: string[] = []

    if (grossMarginPercent >= 60) {
      insights.push(`Healthy gross margin of ${grossMarginPercent.toFixed(1)}%.`) 
    } else if (grossMarginPercent >= 40) {
      insights.push(`Moderate gross margin of ${grossMarginPercent.toFixed(1)}%. Focus on cost optimization.`)
    } else {
      warnings.push(`Low gross margin of ${grossMarginPercent.toFixed(1)}%. Profitability may be constrained.`)
    }

    if (ltvToCac >= 3) {
      insights.push(`Strong LTV:CAC ratio of ${ltvToCac.toFixed(2)}.`)
    } else if (ltvToCac >= 1.5) {
      insights.push(`Acceptable LTV:CAC ratio of ${ltvToCac.toFixed(2)}. Monitor payback.`)
    } else {
      warnings.push(`Weak LTV:CAC ratio of ${ltvToCac.toFixed(2)}. Acquisition may be too expensive.`)
    }

    if (paybackMonths <= 6) {
      insights.push(`Fast payback of ${paybackMonths.toFixed(1)} months.`)
    } else if (paybackMonths <= 12) {
      insights.push(`Payback period of ${paybackMonths.toFixed(1)} months is reasonable.`)
    } else {
      warnings.push(`Payback period of ${paybackMonths.toFixed(1)} months is long. Consider reducing CAC or increasing ARPU.`)
    }

    if (monthlyUnits >= breakEvenUnits) {
      insights.push(`Break-even achievable: ${breakEvenUnits.toFixed(0)} units vs ${monthlyUnits} expected.`)
    } else {
      warnings.push(`Break-even requires ${breakEvenUnits.toFixed(0)} units. Current volume may be insufficient.`)
    }

    setResult({
      arpu,
      grossMarginPercent,
      contributionMargin,
      contributionMarginPercent,
      breakEvenUnits,
      breakEvenRevenue,
      ltv,
      ltvToCac,
      paybackMonths,
      netUnitProfit,
      insights,
      warnings,
    })
  }

  const revenuePerMonth = useMemo(() => pricePerUnit * monthlyUnits, [pricePerUnit, monthlyUnits])

  return (
    <FinancialCalculatorTemplate
      title="Advanced Unit Economics Calculator"
      description="Analyze gross margin, LTV:CAC, payback, and break-even performance for sustainable growth."
      icon={Users}
      calculate={calculate}
      values={[pricePerUnit, variableCostPerUnit, monthlyFixedCosts, monthlyUnits, customerAcquisitionCost, monthlyChurnRate, avgMonthlyRevenuePerCustomer]}
      calculatorId="advanced-unit-economics-calculator"
      category="Business"
      inputs={
        <div className="space-y-6">
          <div className="space-y-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Unit Revenue & Costs
            </h3>
            <InputGroup
              label="Price per Unit"
              value={pricePerUnit}
              onChange={setPricePerUnit}
              min={1}
              max={100000}
              step={10}
              prefix="₹"
              helpText="Average selling price per unit"
            />
            <InputGroup
              label="Variable Cost per Unit"
              value={variableCostPerUnit}
              onChange={setVariableCostPerUnit}
              min={0}
              max={100000}
              step={10}
              prefix="₹"
              helpText="COGS or variable cost per unit"
            />
            <InputGroup
              label="Monthly Fixed Costs"
              value={monthlyFixedCosts}
              onChange={setMonthlyFixedCosts}
              min={0}
              max={50000000}
              step={10000}
              prefix="₹"
              helpText="Total fixed operating costs per month"
            />
            <InputGroup
              label="Monthly Units Sold"
              value={monthlyUnits}
              onChange={setMonthlyUnits}
              min={1}
              max={1000000}
              step={50}
              helpText="Expected units sold per month"
            />
          </div>

          <div className="space-y-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Customer Economics
            </h3>
            <InputGroup
              label="Customer Acquisition Cost (CAC)"
              value={customerAcquisitionCost}
              onChange={setCustomerAcquisitionCost}
              min={0}
              max={200000}
              step={100}
              prefix="₹"
              helpText="Average CAC per customer"
            />
            <InputGroup
              label="Monthly Churn Rate"
              value={monthlyChurnRate}
              onChange={setMonthlyChurnRate}
              min={0.1}
              max={30}
              step={0.1}
              suffix="%"
              helpText="Monthly customer churn rate"
            />
            <InputGroup
              label="Avg Monthly Revenue per Customer"
              value={avgMonthlyRevenuePerCustomer}
              onChange={setAvgMonthlyRevenuePerCustomer}
              min={0}
              max={200000}
              step={100}
              prefix="₹"
              helpText="Monthly revenue per active customer"
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label="Gross Margin"
              value={result.grossMarginPercent.toFixed(1)}
              suffix="%"
              type="highlight"
              icon={TrendingUp}
            />
            <ResultCard
              label="Contribution Margin"
              value={result.contributionMargin.toFixed(2)}
              prefix="₹"
              type="success"
              icon={DollarSign}
            />
            <ResultCard
              label="LTV:CAC"
              value={result.ltvToCac.toFixed(2)}
              type="default"
              icon={Target}
            />
            <ResultCard
              label="Payback"
              value={result.paybackMonths.toFixed(1)}
              suffix="mo"
              type="default"
              icon={Wallet}
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Unit Economics Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Monthly Revenue:</strong> ₹{revenuePerMonth.toLocaleString('en-IN')}</p>
                <p><strong>Break-even Units:</strong> {result.breakEvenUnits.toFixed(0)}</p>
                <p><strong>Break-even Revenue:</strong> ₹{result.breakEvenRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p><strong>LTV:</strong> ₹{result.ltv.toLocaleString('en-IN')}</p>
                <p><strong>Contribution Margin %:</strong> {result.contributionMarginPercent.toFixed(1)}%</p>
                <p><strong>Net Unit Profit:</strong> ₹{result.netUnitProfit.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
              <h4 className="font-semibold flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                <CheckCircle className="h-5 w-5" />
                Insights
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-emerald-900 dark:text-emerald-100">
                {result.insights.map((insight, idx) => (
                  <li key={idx}>• {insight}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <h4 className="font-semibold flex items-center gap-2 text-red-900 dark:text-red-100">
                <AlertCircle className="h-5 w-5" />
                Warnings
              </h4>
              {result.warnings.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-red-900 dark:text-red-100">
                  {result.warnings.map((warning, idx) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-red-900 dark:text-red-100">No major risks detected in the assumptions.</p>
              )}
            </div>
          </div>
        </div>
      )}
    />
  )
}
