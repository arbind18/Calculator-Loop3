"use client"

import { useState } from "react"
import { FileText, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"
import { CapitalGainsSeoContent } from "@/components/calculators/seo/TaxSeo"

export function CapitalGainsTax() {
  const [salePrice, setSalePrice] = useState(1000000)
  const [purchasePrice, setPurchasePrice] = useState(500000)
  const [assetType, setAssetType] = useState<'equity' | 'debt' | 'property'>('equity')
  const [holdingPeriod, setHoldingPeriod] = useState(12) // Months

  const [result, setResult] = useState<any>(null)

  const calculateTax = () => {
    const gain = salePrice - purchasePrice
    let taxRate = 0
    let taxType = ''
    let taxAmount = 0

    if (assetType === 'equity') {
      if (holdingPeriod > 12) {
        taxType = 'LTCG (Long Term)'
        // LTCG > 1L is taxed at 10% (India specific rule, simplified)
        const taxableGain = Math.max(0, gain - 100000)
        taxRate = 10
        taxAmount = taxableGain * 0.10
      } else {
        taxType = 'STCG (Short Term)'
        taxRate = 15
        taxAmount = gain * 0.15
      }
    } else if (assetType === 'property') {
      if (holdingPeriod > 24) {
        taxType = 'LTCG (Long Term)'
        taxRate = 20 // With indexation usually, simplified here
        taxAmount = gain * 0.20
      } else {
        taxType = 'STCG (Short Term)'
        taxRate = 30 // Slab rate assumption
        taxAmount = gain * 0.30
      }
    } else {
      // Debt
      taxType = 'STCG (As per Slab)'
      taxRate = 30 // Assumption
      taxAmount = gain * 0.30
    }

    setResult({
      gain,
      taxType,
      taxRate,
      taxAmount,
      netProfit: gain - taxAmount
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Capital Gains Tax Calculator"
      description="Estimate tax on your stock or property profits (LTCG/STCG)."
      icon={FileText}
      calculate={calculateTax}
      seoContent={<CapitalGainsSeoContent />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Sale Price" value={salePrice} onChange={setSalePrice} prefix="₹" min={0} max={100000000} />
          <InputGroup label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="₹" min={0} max={100000000} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset Type</label>
            <select 
              className="w-full p-2 rounded-md border bg-background"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as any)}
            >
              <option value="equity">Stocks/Equity Funds</option>
              <option value="property">Real Estate/Property</option>
              <option value="debt">Debt Funds/Gold</option>
            </select>
          </div>
          <InputGroup label="Holding Period" value={holdingPeriod} onChange={setHoldingPeriod} suffix="months" min={0} max={1200} />
        </div>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Total Capital Gain"
              value={`₹${formatCompactNumber(result.gain)}`}
              type="highlight"
            />
            <ResultCard
              label="Estimated Tax"
              value={`₹${formatCompactNumber(result.taxAmount)}`}
              type="warning"
              subtext={`${result.taxType} @ ~${result.taxRate}%`}
            />
            <ResultCard
              label="Net Profit"
              value={`₹${formatCompactNumber(result.netProfit)}`}
              type="default"
            />
          </div>
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}
