"use client"

import { useState } from "react"
import { Package, RefreshCw } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

export function InventoryTurnover() {
  const [cogs, setCogs] = useState(5000000) // Cost of Goods Sold
  const [avgInventory, setAvgInventory] = useState(1000000)

  const [result, setResult] = useState<any>(null)

  const calculateRatio = () => {
    const ratio = cogs / avgInventory
    const daysToSell = 365 / ratio

    setResult({
      ratio: ratio.toFixed(2),
      daysToSell: Math.round(daysToSell)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Inventory Turnover Ratio"
      description="Measure how efficiently you manage your stock. Higher is usually better."
      icon={Package}
      calculate={calculateRatio}
      values={[cogs, avgInventory]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Cost of Goods Sold (COGS)" value={cogs} onChange={setCogs} prefix="₹" min={0} max={100000000} />
          <InputGroup label="Average Inventory Value" value={avgInventory} onChange={setAvgInventory} prefix="₹" helpText="(Opening + Closing Stock) / 2" min={0} max={100000000} />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Turnover Ratio"
              value={result.ratio}
              type="highlight"
              subtext="Times per year"
            />
            <ResultCard
              label="Avg Days to Sell Inventory"
              value={`${result.daysToSell} Days`}
              type="default"
            />
          </div>
        </div>
      )}
    />
  )
}
