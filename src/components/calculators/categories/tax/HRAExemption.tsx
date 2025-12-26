"use client"

import { useState } from "react"
import { Calculator, Building2, MapPin } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { calculateHRAExemption } from "@/lib/logic/tax"
import { useTranslation } from "@/hooks/useTranslation"

export function HRAExemption() {
  const { t } = useTranslation()
  const [basicSalary, setBasicSalary] = useState(600000) // Yearly
  const [da, setDa] = useState(0) // Yearly
  const [hraReceived, setHraReceived] = useState(240000) // Yearly
  const [rentPaid, setRentPaid] = useState(180000) // Yearly
  const [isMetro, setIsMetro] = useState("non-metro")
  
  const result = calculateHRAExemption(basicSalary, da, hraReceived, rentPaid, isMetro === "metro")

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.hra_title')}
        description={t('tax.hra_desc')}
        icon={Building2}
        calculate={() => {}}
        onClear={() => {
          setBasicSalary(600000)
          setHraReceived(240000)
          setRentPaid(180000)
        }}
        inputs={
          <div className="space-y-6">
            <div className="space-y-4">
              <InputGroup label={t('tax.basic_salary')} value={basicSalary} onChange={setBasicSalary} prefix="₹" min={0} max={10000000} />
              <InputGroup label={t('tax.da')} value={da} onChange={setDa} prefix="₹" min={0} max={10000000} />
              <InputGroup label={t('tax.hra_received')} value={hraReceived} onChange={setHraReceived} prefix="₹" min={0} max={10000000} />
              <InputGroup label={t('tax.rent_paid')} value={rentPaid} onChange={setRentPaid} prefix="₹" min={0} max={10000000} />
              
              <div className="space-y-2">
                <Label>{t('tax.city_type')}</Label>
                <RadioGroup defaultValue="non-metro" value={isMetro} onValueChange={setIsMetro} className="flex gap-4">
                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-muted/50 w-full">
                    <RadioGroupItem value="metro" id="metro" />
                    <Label htmlFor="metro" className="cursor-pointer flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {t('tax.metro')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-muted/50 w-full">
                    <RadioGroupItem value="non-metro" id="non-metro" />
                    <Label htmlFor="non-metro" className="cursor-pointer">{t('tax.non_metro')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        }
        result={
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">{t('tax.exempt_hra')}</p>
                <p className="text-3xl font-bold text-green-600">₹{Math.round(result.exemptHRA).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">This amount is tax-free</p>
              </div>
              <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-muted-foreground mb-1">{t('tax.taxable_hra')}</p>
                <p className="text-3xl font-bold text-red-600">₹{Math.round(result.taxableHRA).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">Added to your taxable income</p>
              </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="p-4 bg-muted/50 font-medium border-b">Calculation Breakdown (Lowest of the three)</div>
              <div className="divide-y">
                <div className="flex justify-between p-4 text-sm">
                  <span className="text-muted-foreground">1. Actual HRA Received</span>
                  <span className="font-medium">₹{Math.round(result.condition1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-4 text-sm">
                  <span className="text-muted-foreground">2. Rent Paid - 10% of Salary</span>
                  <span className="font-medium">₹{Math.round(result.condition2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-4 text-sm">
                  <span className="text-muted-foreground">3. {isMetro === 'metro' ? '50%' : '40%'} of Salary</span>
                  <span className="font-medium">₹{Math.round(result.condition3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-4 bg-green-500/5 font-bold text-green-700">
                  <span>Exempt Amount (Lowest)</span>
                  <span>₹{Math.round(result.exemptHRA).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}
