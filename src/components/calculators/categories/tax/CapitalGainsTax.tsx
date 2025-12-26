"use client"

import { useState } from "react"
import { FileText, TrendingUp, Info } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { formatCompactNumber } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { calculateCapitalGains, CII_DATA, CapitalGainsResult } from "@/lib/logic/tax"
import { useTranslation } from "@/hooks/useTranslation"
import { useEffect } from "react"

export function CapitalGainsTax() {
  const { t } = useTranslation()
  const [salePrice, setSalePrice] = useState(5000000)
  const [purchasePrice, setPurchasePrice] = useState(3000000)
  const [assetType, setAssetType] = useState<'equity' | 'debt' | 'property' | 'gold'>('property')
  const [purchaseYear, setPurchaseYear] = useState('2015-16')
  const [saleYear, setSaleYear] = useState('2023-24')
  const [result, setResult] = useState<CapitalGainsResult | null>(null)

  const handleCalculate = () => {
    const res = calculateCapitalGains({
      salePrice,
      purchasePrice,
      assetType,
      purchaseYear,
      saleYear
    })
    setResult(res)
  }

  useEffect(() => {
    handleCalculate()
  }, [salePrice, purchasePrice, assetType, purchaseYear, saleYear])

  return (
    <div className="relative">
      <FinancialCalculatorTemplate
        title={t('tax.capital_gains_title')}
        description={t('tax.capital_gains_desc')}
        icon={TrendingUp}
        calculate={handleCalculate}
        inputs={
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('tax.asset_type')}</Label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={assetType} 
                onChange={(e) => setAssetType(e.target.value as any)}
              >
                <option value="equity">{t('tax.equity')}</option>
                <option value="debt">{t('tax.debt')}</option>
                <option value="property">{t('tax.property')}</option>
                <option value="gold">{t('tax.gold')}</option>
              </select>
            </div>

            <InputGroup label={t('tax.sale_price')} value={salePrice} onChange={setSalePrice} prefix="?" min={0} max={1000000000} />
            <InputGroup label={t('tax.purchase_price')} value={purchasePrice} onChange={setPurchasePrice} prefix="?" min={0} max={1000000000} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('tax.purchase_year')}</Label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={purchaseYear} 
                  onChange={(e) => setPurchaseYear(e.target.value)}
                >
                  {Object.keys(CII_DATA).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t('tax.sale_year')}</Label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={saleYear} 
                  onChange={(e) => setSaleYear(e.target.value)}
                >
                  {Object.keys(CII_DATA).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        }
        result={result && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="text-sm text-muted-foreground">{t('tax.capital_gain')}</div>
                <div className="text-2xl font-bold text-primary">₹{result.gain.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{result.taxType}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="text-sm text-muted-foreground">{t('tax.tax_payable')}</div>
                <div className="text-2xl font-bold text-red-500">₹{result.tax.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{t('tax.remarks')}: {result.remarks}</div>
              </div>
            </div>

            {result.indexedCost !== purchasePrice && (
              <div className="p-4 border rounded-lg flex items-center gap-3 bg-blue-500/5 border-blue-500/20">
                <Info className="h-5 w-5 text-blue-500" />
                <div className="text-sm">
                  <span className="font-semibold">{t('tax.indexed_cost')}:</span> ₹{Math.round(result.indexedCost).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
