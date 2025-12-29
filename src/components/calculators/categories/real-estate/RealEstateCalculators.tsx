"use client"

import { useState } from "react"
import { Home, Building, Percent, DollarSign } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"
import { calculateRentalYield, calculateHomeAffordability, calculateStampDuty } from "@/lib/logic/real-estate"
import { useTranslation } from "@/hooks/useTranslation"
import { RentalYieldSeoContent, HomeAffordabilitySeoContent, StampDutySeoContent } from "@/components/calculators/seo/RealEstateSeo"

export function RentalYield() {
  const { t } = useTranslation()
  const [propertyValue, setPropertyValue] = useState(5000000)
  const [monthlyRent, setMonthlyRent] = useState(15000)
  const [annualMaintenance, setAnnualMaintenance] = useState(20000)

  const { grossYield, netYield } = calculateRentalYield(propertyValue, monthlyRent, annualMaintenance)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('real_estate.rental_yield_title')}
        description={t('real_estate.rental_yield_desc')}
        icon={Building}
        calculate={() => {}}
        values={[propertyValue, monthlyRent, annualMaintenance]}
        onClear={() => {
          setPropertyValue(5000000)
          setMonthlyRent(15000)
          setAnnualMaintenance(20000)
        }}
        onRestoreAction={(vals) => {
          setPropertyValue(Number(vals?.[0] ?? 5000000))
          setMonthlyRent(Number(vals?.[1] ?? 15000))
          setAnnualMaintenance(Number(vals?.[2] ?? 20000))
        }}
        seoContent={<RentalYieldSeoContent />}
        onDownload={(format) => {
          generateReport(format, 'rental_yield', 
            ['Metric', 'Value'], 
            [
              [t('real_estate.gross_yield'), `${grossYield.toFixed(2)}%`],
              [t('real_estate.net_yield'), `${netYield.toFixed(2)}%`]
            ], 
            t('real_estate.rental_yield_title')
          )
        }}
        inputs={
          <div className="space-y-4">
            <InputGroup label={t('real_estate.property_value')} value={propertyValue} onChange={setPropertyValue} prefix="₹" />
            <InputGroup label={t('real_estate.monthly_rent')} value={monthlyRent} onChange={setMonthlyRent} prefix="₹" />
            <InputGroup label={t('real_estate.annual_maintenance')} value={annualMaintenance} onChange={setAnnualMaintenance} prefix="₹" />
          </div>
        }
        result={
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">{t('real_estate.gross_yield')}</div>
              <div className="text-2xl font-bold text-blue-700">{grossYield.toFixed(2)}%</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">{t('real_estate.net_yield')}</div>
              <div className="text-2xl font-bold text-green-700">{netYield.toFixed(2)}%</div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export function HomeAffordability() {
  const { t } = useTranslation()
  const [monthlyIncome, setMonthlyIncome] = useState(100000)
  const [existingEMIs, setExistingEMIs] = useState(10000)
  const [downPayment, setDownPayment] = useState(1000000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const affordability = calculateHomeAffordability(monthlyIncome, existingEMIs, downPayment, interestRate, tenure)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('real_estate.affordability_title')}
        description={t('real_estate.affordability_desc')}
        icon={Home}
        calculate={() => {}}
        values={[monthlyIncome, existingEMIs, downPayment, interestRate, tenure]}
        onClear={() => {
          setMonthlyIncome(100000)
          setExistingEMIs(10000)
          setDownPayment(1000000)
          setInterestRate(8.5)
          setTenure(20)
        }}
        onRestoreAction={(vals) => {
          setMonthlyIncome(Number(vals?.[0] ?? 100000))
          setExistingEMIs(Number(vals?.[1] ?? 10000))
          setDownPayment(Number(vals?.[2] ?? 1000000))
          setInterestRate(Number(vals?.[3] ?? 8.5))
          setTenure(Number(vals?.[4] ?? 20))
        }}
        seoContent={<HomeAffordabilitySeoContent />}
        onDownload={(format) => {
          generateReport(format, 'home_affordability', ['Item', 'Value'], [[t('real_estate.max_property_value'), `₹${affordability}`]], t('real_estate.affordability_title'))
        }}
        inputs={
          <div className="space-y-4">
            <InputGroup label={t('real_estate.monthly_income')} value={monthlyIncome} onChange={setMonthlyIncome} prefix="₹" />
            <InputGroup label={t('real_estate.existing_emis')} value={existingEMIs} onChange={setExistingEMIs} prefix="₹" />
            <InputGroup label={t('real_estate.down_payment_available')} value={downPayment} onChange={setDownPayment} prefix="₹" />
            <InputGroup label={t('real_estate.interest_rate')} value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} />
            <InputGroup label={t('real_estate.loan_tenure')} value={tenure} onChange={setTenure} suffix="Years" />
          </div>
        }
        result={
          <div className="p-6 bg-primary/10 rounded-xl text-center">
            <div className="text-lg text-muted-foreground mb-2">{t('real_estate.max_property_value')}</div>
            <div className="text-4xl font-bold text-primary">₹{affordability.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-2">Based on 50% debt-to-income ratio</p>
          </div>
        }
      />
    </div>
  )
}

export function StampDuty() {
  const { t } = useTranslation()
  const [propertyValue, setPropertyValue] = useState(5000000)
  const [state, setState] = useState('Maharashtra')
  const [gender, setGender] = useState('male')

  const { duty, registration, total } = calculateStampDuty(propertyValue, state, gender)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('real_estate.stamp_duty_title')}
        description={t('real_estate.stamp_duty_desc')}
        icon={DollarSign}
        calculate={() => {}}
        values={[propertyValue, state, gender]}
        onClear={() => {
          setPropertyValue(5000000)
          setState('Maharashtra')
          setGender('male')
        }}
        onRestoreAction={(vals) => {
          setPropertyValue(Number(vals?.[0] ?? 5000000))
          setState(typeof vals?.[1] === 'string' ? (vals[1] as string) : 'Maharashtra')
          setGender(typeof vals?.[2] === 'string' ? (vals[2] as string) : 'male')
        }}
        seoContent={<StampDutySeoContent />}
        onDownload={(format) => generateReport(format, 'stamp_duty', ['Item', 'Value'], [[t('real_estate.total_charges'), `₹${total}`]], t('real_estate.stamp_duty_title'))}
        inputs={
          <div className="space-y-4">
            <InputGroup label={t('real_estate.property_value')} value={propertyValue} onChange={setPropertyValue} prefix="₹" />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('real_estate.state')}</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full p-2 border rounded-md bg-background">
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Other">Other (Default 5%)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Owner Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 border rounded-md bg-background">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        }
        result={
          <div className="space-y-4">
            <div className="p-6 bg-primary/10 rounded-xl text-center">
              <div className="text-lg text-muted-foreground mb-2">{t('real_estate.total_charges')}</div>
              <div className="text-4xl font-bold text-primary">₹{total.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted rounded">
                <div className="text-xs text-muted-foreground">{t('real_estate.stamp_duty')}</div>
                <div className="font-bold">₹{duty.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted rounded">
                <div className="text-xs text-muted-foreground">{t('real_estate.registration')}</div>
                <div className="font-bold">₹{registration.toLocaleString()}</div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}

