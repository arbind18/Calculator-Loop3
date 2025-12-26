"use client"

import { useState, useEffect } from "react"
import { Receipt, TrendingUp, ArrowRightLeft } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { GSTSeoContent } from "@/components/calculators/seo/BusinessSeo"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AdvancedGSTCalculator() {
  const [amount, setAmount] = useState(10000)
  const [gstRate, setGstRate] = useState(18)
  const [isInclusive, setIsInclusive] = useState(false) // false = Exclusive (Add GST), true = Inclusive (Remove GST)
  const [isInterState, setIsInterState] = useState(false) // false = Intra-state (CGST+SGST), true = Inter-state (IGST)
  
  const [result, setResult] = useState<any>(null)

  const calculateGST = () => {
    let baseAmount = 0
    let gstAmount = 0
    let totalAmount = 0

    if (isInclusive) {
      // Formula: GST Amount = Amount - [Amount x {100 / (100 + GST%)}]
      baseAmount = amount * (100 / (100 + gstRate))
      gstAmount = amount - baseAmount
      totalAmount = amount
    } else {
      // Formula: GST Amount = Amount * (GST% / 100)
      baseAmount = amount
      gstAmount = amount * (gstRate / 100)
      totalAmount = amount + gstAmount
    }

    setResult({
      baseAmount: Math.round(baseAmount),
      gstAmount: Math.round(gstAmount),
      totalAmount: Math.round(totalAmount),
      cgst: Math.round(gstAmount / 2),
      sgst: Math.round(gstAmount / 2),
      igst: Math.round(gstAmount)
    })
  }

  useEffect(() => {
    calculateGST()
  }, [amount, gstRate, isInclusive, isInterState])

  const chartData = result ? [
    { name: 'Base Amount', value: result.baseAmount, color: '#3b82f6' },
    { name: 'GST Component', value: result.gstAmount, color: '#ef4444' },
  ] : []

  return (
    <FinancialCalculatorTemplate
      title="Advanced GST Calculator"
      description="Calculate GST (Inclusive/Exclusive) with detailed CGST, SGST, or IGST breakdowns."
      icon={Receipt}
      calculate={calculateGST}
      onClear={() => {
        setAmount(10000)
        setGstRate(18)
        setIsInclusive(false)
        setIsInterState(false)
      }}
      seoContent={<GSTSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label={isInclusive ? "Total Amount (GST Included)" : "Base Amount (GST Excluded)"} 
            value={amount} 
            onChange={setAmount} 
            prefix="₹" 
            min={1} 
            max={100000000} 
            step={100}
          />
          
          <div className="space-y-2">
            <Label>GST Rate</Label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`p-2 rounded-md border text-sm font-medium transition-colors ${
                    gstRate === rate 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <Label className="text-base">Calculation Type</Label>
                <p className="text-xs text-muted-foreground">
                  {isInclusive ? "Removing GST from Total" : "Adding GST to Base"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${!isInclusive ? "font-bold" : "text-muted-foreground"}`}>Exclusive</span>
                <Switch checked={isInclusive} onCheckedChange={setIsInclusive} />
                <span className={`text-xs ${isInclusive ? "font-bold" : "text-muted-foreground"}`}>Inclusive</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <Label className="text-base">Transaction Type</Label>
                <p className="text-xs text-muted-foreground">
                  {isInterState ? "Inter-State (IGST)" : "Intra-State (CGST + SGST)"}
                </p>
              </div>
              <Switch checked={isInterState} onCheckedChange={setIsInterState} />
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label="Total Amount" 
              value={`₹${result.totalAmount.toLocaleString()}`} 
              type="highlight" 
            />
            <ResultCard 
              label="Total GST" 
              value={`₹${result.gstAmount.toLocaleString()}`} 
              type="warning" 
            />
            <ResultCard 
              label="Base Amount" 
              value={`₹${result.baseAmount.toLocaleString()}`} 
              type="default" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isInterState ? (
              <ResultCard 
                label="IGST (Integrated Tax)" 
                value={`₹${result.igst.toLocaleString()}`} 
                type="default" 
                className="col-span-2"
              />
            ) : (
              <>
                <ResultCard 
                  label={`CGST (${gstRate/2}%)`} 
                  value={`₹${result.cgst.toLocaleString()}`} 
                  type="default" 
                />
                <ResultCard 
                  label={`SGST (${gstRate/2}%)`} 
                  value={`₹${result.sgst.toLocaleString()}`} 
                  type="default" 
                />
              </>
            )}
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
