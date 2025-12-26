"use client"

import { useState } from "react"
import { Calculator, Shield, Heart, Car, Activity } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"
import { TermInsuranceSeoContent, HealthInsuranceSeoContent } from "@/components/calculators/seo/InsuranceSeo"

export function TermInsurancePremium() {
  const [age, setAge] = useState(30)
  const [coverage, setCoverage] = useState(10000000)
  const [term, setTerm] = useState(30)
  const [smoker, setSmoker] = useState(false)
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const calculate = () => {
    // Simplified logic for estimation
    let baseRate = 100 // per lakh
    if (age > 30) baseRate += (age - 30) * 5
    if (age > 40) baseRate += (age - 40) * 10
    if (smoker) baseRate *= 1.5
    if (gender === 'female') baseRate *= 0.9

    const premium = (coverage / 100000) * baseRate
    return {
      monthlyPremium: Math.round(premium / 12),
      annualPremium: Math.round(premium),
      totalPremium: Math.round(premium * term)
    }
  }

  const result = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Term Insurance Premium Estimator"
      description="Estimate your term life insurance premium based on age, coverage, and lifestyle."
      icon={Shield}
      calculate={() => {}} // Auto-calculated
      seoContent={<TermInsuranceSeoContent />}
      onDownload={(format) => {
        generateReport(format, 'term_insurance', 
          ['Type', 'Amount'], 
          [
            ['Monthly Premium', `₹${result.monthlyPremium}`],
            ['Annual Premium', `₹${result.annualPremium}`],
            ['Total Premium Paid', `₹${result.totalPremium}`]
          ], 
          'Term Insurance Estimate'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Age" value={age} onChange={setAge} min={18} max={65} suffix="Years" />
          <InputGroup label="Coverage Amount" value={coverage} onChange={setCoverage} prefix="₹" step={500000} />
          <InputGroup label="Policy Term" value={term} onChange={setTerm} min={5} max={50} suffix="Years" />
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Smoker</span>
            <input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Gender</span>
            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="p-2 border rounded">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Annual Premium</div>
              <div className="text-2xl font-bold">₹{result.annualPremium.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Monthly Premium</div>
              <div className="text-2xl font-bold">₹{result.monthlyPremium.toLocaleString()}</div>
            </div>
          </div>
        </div>
      }
    />
  )
}

export function HumanLifeValue() {
  const [currentIncome, setCurrentIncome] = useState(1000000)
  const [expenses, setExpenses] = useState(300000)
  const [age, setAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)
  const [inflation, setInflation] = useState(6)
  const [expectedReturn, setExpectedReturn] = useState(8)

  const calculate = () => {
    const yearsLeft = retirementAge - age
    const surplus = currentIncome - expenses
    // Present Value of Annuity
    const rate = (expectedReturn - inflation) / 100
    const hlv = surplus * ((1 - Math.pow(1 + rate, -yearsLeft)) / rate)
    return Math.round(hlv)
  }

  const hlv = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Human Life Value (HLV) Calculator"
      description="Calculate the insurance cover you need based on your future income potential."
      icon={Activity}
      calculate={() => {}}
      onDownload={(format) => {
        generateReport(format, 'hlv_report', ['Item', 'Value'], [['Human Life Value', `₹${hlv}`]], 'HLV Report')
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Income" value={currentIncome} onChange={setCurrentIncome} prefix="₹" />
          <InputGroup label="Annual Expenses" value={expenses} onChange={setExpenses} prefix="₹" />
          <InputGroup label="Current Age" value={age} onChange={setAge} suffix="Years" />
          <InputGroup label="Retirement Age" value={retirementAge} onChange={setRetirementAge} suffix="Years" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Recommended Insurance Cover</div>
          <div className="text-4xl font-bold text-primary">₹{hlv.toLocaleString()}</div>
        </div>
      }
    />
  )
}

export function HealthInsurancePremium() {
  const [age, setAge] = useState(30)
  const [members, setMembers] = useState(2) // 1=Self, 2=Self+Spouse, etc.
  const [coverage, setCoverage] = useState(500000)

  const calculate = () => {
    // Base rate approx 5000 for 5L cover at age 30
    let base = 5000
    if (age > 30) base += (age - 30) * 200
    if (age > 45) base += (age - 45) * 300
    
    // Coverage multiplier
    base = base * (coverage / 500000)
    
    // Members multiplier
    if (members === 2) base *= 1.8 // Floater discount
    if (members === 3) base *= 2.5
    if (members === 4) base *= 3.0
    
    return Math.round(base)
  }

  const premium = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Health Insurance Premium Estimator"
      description="Estimate health insurance premium for family floater plans."
      icon={Heart}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'health_insurance', ['Item', 'Value'], [['Estimated Premium', `₹${premium}`]], 'Health Insurance Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Eldest Member Age" value={age} onChange={setAge} suffix="Years" />
          <InputGroup label="Number of Members" value={members} onChange={setMembers} min={1} max={6} />
          <InputGroup label="Sum Insured" value={coverage} onChange={setCoverage} prefix="₹" step={100000} />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Estimated Annual Premium</div>
          <div className="text-4xl font-bold text-primary">₹{premium.toLocaleString()}</div>
        </div>
      }
    />
  )
}
