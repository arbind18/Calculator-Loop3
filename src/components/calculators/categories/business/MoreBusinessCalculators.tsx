"use client"

import { useState } from "react"
import { TrendingDown, Activity, Flame } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

export function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState(100000)
  const [salvageValue, setSalvageValue] = useState(10000)
  const [usefulLife, setUsefulLife] = useState(5)

  const calculate = () => {
    // Straight Line Depreciation
    const annualDepreciation = (assetCost - salvageValue) / usefulLife
    return Math.round(annualDepreciation)
  }

  const depreciation = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Depreciation Calculator"
      description="Calculate annual depreciation using Straight Line Method."
      icon={TrendingDown}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'depreciation', ['Item', 'Value'], [['Annual Depreciation', `₹${depreciation}`]], 'Depreciation Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Asset Cost" value={assetCost} onChange={setAssetCost} prefix="₹" />
          <InputGroup label="Salvage Value" value={salvageValue} onChange={setSalvageValue} prefix="₹" />
          <InputGroup label="Useful Life" value={usefulLife} onChange={setUsefulLife} suffix="Years" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Annual Depreciation</div>
          <div className="text-4xl font-bold text-primary">₹{depreciation.toLocaleString()}</div>
        </div>
      }
    />
  )
}

export function CashFlowCalculator() {
  const [inflow, setInflow] = useState(500000)
  const [outflow, setOutflow] = useState(300000)

  const netCashFlow = inflow - outflow

  return (
    <FinancialCalculatorTemplate
      title="Cash Flow Calculator"
      description="Calculate Net Cash Flow from operating activities."
      icon={Activity}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'cash_flow', ['Item', 'Value'], [['Net Cash Flow', `₹${netCashFlow}`]], 'Cash Flow Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Total Cash Inflow" value={inflow} onChange={setInflow} prefix="₹" />
          <InputGroup label="Total Cash Outflow" value={outflow} onChange={setOutflow} prefix="₹" />
        </div>
      }
      result={
        <div className={`p-6 rounded-xl text-center ${netCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`text-lg mb-2 ${netCashFlow >= 0 ? 'text-green-800' : 'text-red-800'}`}>Net Cash Flow</div>
          <div className={`text-4xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{netCashFlow.toLocaleString()}</div>
        </div>
      }
    />
  )
}

export function BurnRateCalculator() {
  const [cashBalance, setCashBalance] = useState(1000000)
  const [monthlyBurn, setMonthlyBurn] = useState(50000)

  const runway = monthlyBurn > 0 ? Math.floor(cashBalance / monthlyBurn) : 0

  return (
    <FinancialCalculatorTemplate
      title="Burn Rate & Runway Calculator"
      description="Calculate how many months your startup can survive."
      icon={Flame}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'burn_rate', ['Item', 'Value'], [['Runway', `${runway} Months`]], 'Burn Rate Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Current Cash Balance" value={cashBalance} onChange={setCashBalance} prefix="₹" />
          <InputGroup label="Monthly Burn Rate" value={monthlyBurn} onChange={setMonthlyBurn} prefix="₹" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Estimated Runway</div>
          <div className="text-4xl font-bold text-primary">{runway} Months</div>
        </div>
      }
    />
  )
}
