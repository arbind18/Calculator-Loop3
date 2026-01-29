"use client"

import { useMemo, useState } from "react"
import { BarChart3, CheckCircle, DollarSign, Info, Target, TrendingDown, TrendingUp, AlertCircle, Wallet } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

interface ValuationResult {
  projectedCashFlows: { year: number; cashFlow: number; presentValue: number }[]
  presentValueCF: number
  terminalValue: number
  terminalPresentValue: number
  enterpriseValueDCF: number
  equityValueDCF: number
  perShareDCF: number
  ebitda: number
  enterpriseValueEBITDA: number
  enterpriseValueRevenue: number
  equityValueEBITDA: number
  equityValueRevenue: number
  perShareEBITDA: number
  perShareRevenue: number
  valuationLow: number
  valuationHigh: number
  insights: string[]
  warnings: string[]
}

export function AdvancedBusinessValuationCalculator() {
  const [currentFCF, setCurrentFCF] = useState(12000000)
  const [fcfGrowthRate, setFcfGrowthRate] = useState(12)
  const [discountRate, setDiscountRate] = useState(14)
  const [terminalGrowthRate, setTerminalGrowthRate] = useState(4)
  const [projectionYears, setProjectionYears] = useState(5)
  const [netDebt, setNetDebt] = useState(15000000)
  const [sharesOutstanding, setSharesOutstanding] = useState(5)
  const [currentRevenue, setCurrentRevenue] = useState(80000000)
  const [ebitdaMargin, setEbitdaMargin] = useState(18)
  const [ebitdaMultiple, setEbitdaMultiple] = useState(10)
  const [revenueMultiple, setRevenueMultiple] = useState(2.2)

  const [result, setResult] = useState<ValuationResult | null>(null)

  const calculate = () => {
    const r = discountRate / 100
    const g = fcfGrowthRate / 100
    const tg = terminalGrowthRate / 100

    const projectedCashFlows = Array.from({ length: projectionYears }, (_, idx) => {
      const year = idx + 1
      const cashFlow = currentFCF * Math.pow(1 + g, year)
      const presentValue = cashFlow / Math.pow(1 + r, year)
      return { year, cashFlow, presentValue }
    })

    const presentValueCF = projectedCashFlows.reduce((sum, row) => sum + row.presentValue, 0)

    let terminalValue = 0
    let terminalPresentValue = 0

    if (r > tg) {
      const terminalCF = currentFCF * Math.pow(1 + g, projectionYears)
      terminalValue = (terminalCF * (1 + tg)) / (r - tg)
      terminalPresentValue = terminalValue / Math.pow(1 + r, projectionYears)
    }

    const enterpriseValueDCF = presentValueCF + terminalPresentValue
    const equityValueDCF = enterpriseValueDCF - netDebt
    const sharesCount = sharesOutstanding > 0 ? sharesOutstanding * 1_000_000 : 0
    const perShareDCF = sharesCount > 0 ? equityValueDCF / sharesCount : 0

    const ebitda = currentRevenue * (ebitdaMargin / 100)
    const enterpriseValueEBITDA = ebitda * ebitdaMultiple
    const enterpriseValueRevenue = currentRevenue * revenueMultiple

    const equityValueEBITDA = enterpriseValueEBITDA - netDebt
    const equityValueRevenue = enterpriseValueRevenue - netDebt

    const perShareEBITDA = sharesCount > 0 ? equityValueEBITDA / sharesCount : 0
    const perShareRevenue = sharesCount > 0 ? equityValueRevenue / sharesCount : 0

    const valuationLow = Math.min(enterpriseValueDCF, enterpriseValueEBITDA, enterpriseValueRevenue)
    const valuationHigh = Math.max(enterpriseValueDCF, enterpriseValueEBITDA, enterpriseValueRevenue)

    const insights: string[] = []
    const warnings: string[] = []

    if (r <= tg) {
      warnings.push("Discount rate must be higher than terminal growth to avoid unrealistic terminal value.")
    }

    if (fcfGrowthRate > 20) {
      warnings.push("High FCF growth rate may overstate valuation. Consider a more conservative forecast.")
    } else {
      insights.push(`Projected FCF growth of ${fcfGrowthRate}% is within a reasonable range.`)
    }

    if (netDebt > enterpriseValueDCF * 0.5) {
      warnings.push("Net debt is high relative to valuation. Equity value may be sensitive to leverage.")
    }

    if (ebitdaMargin < 10) {
      warnings.push("Low EBITDA margin may pressure valuation multiples.")
    } else {
      insights.push(`EBITDA margin of ${ebitdaMargin}% supports healthier multiples.`)
    }

    insights.push(`DCF implies enterprise value of ₹${enterpriseValueDCF.toLocaleString('en-IN')}.`)
    insights.push(`Multiple-based EV range: ₹${enterpriseValueEBITDA.toLocaleString('en-IN')} to ₹${enterpriseValueRevenue.toLocaleString('en-IN')}.`)

    setResult({
      projectedCashFlows,
      presentValueCF,
      terminalValue,
      terminalPresentValue,
      enterpriseValueDCF,
      equityValueDCF,
      perShareDCF,
      ebitda,
      enterpriseValueEBITDA,
      enterpriseValueRevenue,
      equityValueEBITDA,
      equityValueRevenue,
      perShareEBITDA,
      perShareRevenue,
      valuationLow,
      valuationHigh,
      insights,
      warnings,
    })
  }

  const valuationRange = useMemo(() => {
    if (!result) return null
    return {
      low: result.valuationLow,
      high: result.valuationHigh,
    }
  }, [result])

  return (
    <FinancialCalculatorTemplate
      title="Advanced Business Valuation Calculator"
      description="Estimate business value using DCF and market multiples with equity value and per-share insights."
      icon={Wallet}
      calculate={calculate}
      values={[currentFCF, fcfGrowthRate, discountRate, terminalGrowthRate, projectionYears, netDebt, sharesOutstanding, currentRevenue, ebitdaMargin, ebitdaMultiple, revenueMultiple]}
      calculatorId="advanced-business-valuation-calculator"
      category="Business"
      inputs={
        <div className="space-y-6">
          <div className="space-y-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              DCF Assumptions
            </h3>
            <InputGroup
              label="Current Free Cash Flow"
              value={currentFCF}
              onChange={setCurrentFCF}
              min={0}
              max={500000000}
              step={100000}
              prefix="₹"
              helpText="Latest annual free cash flow"
            />
            <InputGroup
              label="FCF Growth Rate"
              value={fcfGrowthRate}
              onChange={setFcfGrowthRate}
              min={-20}
              max={40}
              step={1}
              suffix="%"
              helpText="Annual growth for projection period"
            />
            <InputGroup
              label="Discount Rate (WACC)"
              value={discountRate}
              onChange={setDiscountRate}
              min={5}
              max={30}
              step={0.5}
              suffix="%"
              helpText="Required rate of return"
            />
            <InputGroup
              label="Terminal Growth Rate"
              value={terminalGrowthRate}
              onChange={setTerminalGrowthRate}
              min={0}
              max={8}
              step={0.5}
              suffix="%"
              helpText="Long-term growth after projection"
            />
            <InputGroup
              label="Projection Years"
              value={projectionYears}
              onChange={setProjectionYears}
              min={3}
              max={10}
              step={1}
              helpText="Number of forecast years"
            />
          </div>

          <div className="space-y-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Multiples & Capital Structure
            </h3>
            <InputGroup
              label="Net Debt (Debt - Cash)"
              value={netDebt}
              onChange={setNetDebt}
              min={-500000000}
              max={500000000}
              step={100000}
              prefix="₹"
              helpText="Positive if debt exceeds cash"
            />
            <InputGroup
              label="Shares Outstanding"
              value={sharesOutstanding}
              onChange={setSharesOutstanding}
              min={1}
              max={1000}
              step={1}
              helpText="Total shares (in millions)"
            />
            <InputGroup
              label="Current Revenue"
              value={currentRevenue}
              onChange={setCurrentRevenue}
              min={0}
              max={2000000000}
              step={100000}
              prefix="₹"
              helpText="Latest annual revenue"
            />
            <InputGroup
              label="EBITDA Margin"
              value={ebitdaMargin}
              onChange={setEbitdaMargin}
              min={0}
              max={60}
              step={1}
              suffix="%"
              helpText="EBITDA as % of revenue"
            />
            <InputGroup
              label="EV/EBITDA Multiple"
              value={ebitdaMultiple}
              onChange={setEbitdaMultiple}
              min={1}
              max={30}
              step={0.5}
              helpText="Comparable EBITDA multiple"
            />
            <InputGroup
              label="EV/Revenue Multiple"
              value={revenueMultiple}
              onChange={setRevenueMultiple}
              min={0.5}
              max={15}
              step={0.1}
              helpText="Comparable revenue multiple"
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label="DCF Enterprise Value"
              value={result.enterpriseValueDCF.toFixed(0)}
              prefix="₹"
              type="highlight"
              icon={Target}
            />
            <ResultCard
              label="DCF Equity Value"
              value={result.equityValueDCF.toFixed(0)}
              prefix="₹"
              type="success"
              icon={TrendingUp}
            />
            <ResultCard
              label="DCF Per Share"
              value={result.perShareDCF.toFixed(2)}
              prefix="₹"
              type="default"
              icon={DollarSign}
            />
            <ResultCard
              label="EV Range"
              value={`${result.valuationLow.toFixed(0)} - ${result.valuationHigh.toFixed(0)}`}
              prefix="₹"
              type="default"
              icon={BarChart3}
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Market Multiples Snapshot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>EBITDA:</strong> ₹{result.ebitda.toLocaleString('en-IN')}</p>
                <p><strong>EV (EBITDA Multiple):</strong> ₹{result.enterpriseValueEBITDA.toLocaleString('en-IN')}</p>
                <p><strong>Equity Value (EBITDA):</strong> ₹{result.equityValueEBITDA.toLocaleString('en-IN')}</p>
                <p><strong>Per Share (EBITDA):</strong> ₹{result.perShareEBITDA.toFixed(2)}</p>
              </div>
              <div>
                <p><strong>Revenue:</strong> ₹{currentRevenue.toLocaleString('en-IN')}</p>
                <p><strong>EV (Revenue Multiple):</strong> ₹{result.enterpriseValueRevenue.toLocaleString('en-IN')}</p>
                <p><strong>Equity Value (Revenue):</strong> ₹{result.equityValueRevenue.toLocaleString('en-IN')}</p>
                <p><strong>Per Share (Revenue):</strong> ₹{result.perShareRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              DCF Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>PV of Cash Flows:</strong> ₹{result.presentValueCF.toLocaleString('en-IN')}</p>
                <p><strong>Terminal Value:</strong> ₹{result.terminalValue.toLocaleString('en-IN')}</p>
                <p><strong>PV of Terminal:</strong> ₹{result.terminalPresentValue.toLocaleString('en-IN')}</p>
              </div>
              {valuationRange && (
                <div>
                  <p><strong>Valuation Range:</strong> ₹{valuationRange.low.toLocaleString('en-IN')} - ₹{valuationRange.high.toLocaleString('en-IN')}</p>
                  <p><strong>Net Debt:</strong> ₹{netDebt.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Projected Cash Flows
            </h3>
            <div className="space-y-2 text-sm">
              {result.projectedCashFlows.map(row => (
                <div key={row.year} className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span>Year {row.year}</span>
                  <span className="font-semibold">₹{row.cashFlow.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground">PV: ₹{row.presentValue.toLocaleString('en-IN')}</span>
                </div>
              ))}
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
