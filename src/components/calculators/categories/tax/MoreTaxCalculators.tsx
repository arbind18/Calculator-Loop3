"use client"
import { useState } from "react"
import { Calculator, PiggyBank } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { GratuitySeoContent, IncomeTaxSeoContent } from "@/components/calculators/seo/TaxSeo"
import { RetirementSeoContent } from "@/components/calculators/seo/InvestmentSeo"

export function PFCalculator() {
  const [basic, setBasic] = useState(50000)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const monthly = basic * 0.12 * 2 // Employee + Employer
    const total = monthly * 12 * years
    const interest = total * 0.30 // Approx 8.15% annual
    const maturity = total + interest
    setResult({ monthly: Math.round(monthly), total: Math.round(total), interest: Math.round(interest), maturity: Math.round(maturity) })
  }

  return (
    <FinancialCalculatorTemplate
      title="PF Calculator"
      description="Calculate your Provident Fund maturity amount."
      icon={PiggyBank}
      calculate={calculate}
      seoContent={<RetirementSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Basic Salary (monthly)"
          value={basic}
          onChange={setBasic}
          min={10000}
          max={200000}
          step={1000}
          prefix="₹"
        />
        <InputGroup
          label="Service Years"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          step={1}
          suffix="years"
        />
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Maturity Amount"
            value={result.maturity}
            type="success"
            prefix="₹"
          />
          <ResultCard
            label="Total Contribution"
            value={result.total}
            type="highlight"
            prefix="₹"
          />
          <ResultCard
            label="Interest Earned"
            value={result.interest}
            prefix="₹"
          />
          <ResultCard
            label="Monthly Contribution"
            value={result.monthly}
            prefix="₹"
          />
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function GratuityCalculator() {
  const [basic, setBasic] = useState(40000)
  const [years, setYears] = useState(15)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    if (years < 5) {
      setResult({ gratuity: 0, eligible: false })
      return
    }
    const gratuity = (basic * years * 15) / 26
    setResult({ gratuity: Math.round(gratuity), eligible: true })
  }

  return (
    <FinancialCalculatorTemplate
      title="Gratuity Calculator"
      description="Calculate your gratuity amount based on service years."
      icon={Calculator}
      calculate={calculate}
      seoContent={<GratuitySeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Last Drawn Basic Salary"
          value={basic}
          onChange={setBasic}
          min={10000}
          max={200000}
          step={1000}
          prefix="₹"
        />
        <InputGroup
          label="Years of Service"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          step={1}
          suffix="years"
        />
      </div>

      {result && (
        <div className="mt-8">
          {result.eligible ? (
            <ResultCard
              label="Gratuity Amount"
              value={result.gratuity}
              type="success"
              prefix="₹"
              subtext="Formula: (Basic × Years × 15) / 26"
            />
          ) : (
            <div className="p-6 bg-destructive/10 rounded-xl text-center border border-destructive/20">
              <p className="text-lg font-bold text-destructive">Not Eligible</p>
              <p className="text-sm text-muted-foreground mt-2">Minimum 5 years of service required</p>
            </div>
          )}
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function TDSCalculator() {
  const [income, setIncome] = useState(50000)
  const [category, setCategory] = useState('salary')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    let tdsRate = 0
    if (category === 'salary') tdsRate = income > 250000 ? 10 : 0
    else if (category === 'professional') tdsRate = 10
    else if (category === 'interest') tdsRate = 10
    else if (category === 'rent') tdsRate = income > 50000 ? 5 : 0
    else if (category === 'commission') tdsRate = 5

    const tds = (income * tdsRate) / 100
    const net = income - tds
    setResult({ tds: Math.round(tds), rate: tdsRate, net: Math.round(net) })
  }

  return (
    <FinancialCalculatorTemplate
      title="TDS Calculator"
      description="Calculate TDS deduction based on income category."
      icon={Calculator}
      calculate={calculate}
      seoContent={<IncomeTaxSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Income Amount"
          value={income}
          onChange={setIncome}
          min={10000}
          max={1000000}
          step={1000}
          prefix="₹"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Income Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-lg bg-background border"
          >
            <option value="salary">Salary</option>
            <option value="professional">Professional Fees</option>
            <option value="interest">Interest Income</option>
            <option value="rent">Rent</option>
            <option value="commission">Commission</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            label="Net Amount"
            value={result.net}
            type="success"
            prefix="₹"
          />
          <ResultCard
            label="TDS Deducted"
            value={result.tds}
            type="warning"
            prefix="₹"
          />
          <ResultCard
            label="TDS Rate"
            value={result.rate}
            suffix="%"
          />
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function ProfessionalTax() {
  const [salary, setSalary] = useState(40000)
  const [state, setState] = useState('maharashtra')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    let annual = 0
    if (state === 'maharashtra') {
      if (salary <= 10000) annual = 0
      else if (salary <= 25000) annual = 1750
      else annual = 2500
    } else if (state === 'karnataka') {
      if (salary <= 15000) annual = 0
      else annual = 2400
    } else if (state === 'west-bengal') {
      if (salary <= 10000) annual = 0
      else if (salary <= 20000) annual = 1300
      else annual = 2500
    }
    const monthly = Math.round(annual / 12)
    setResult({ monthly, annual })
  }

  return (
    <FinancialCalculatorTemplate
      title="Professional Tax Calculator"
      description="Calculate Professional Tax based on your state and salary."
      icon={Calculator}
      calculate={calculate}
      seoContent={<IncomeTaxSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Monthly Salary"
          value={salary}
          onChange={setSalary}
          min={5000}
          max={200000}
          step={1000}
          prefix="₹"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-3 rounded-lg bg-background border"
          >
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
            <option value="west-bengal">West Bengal</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Monthly PT"
            value={result.monthly}
            type="warning"
            prefix="₹"
          />
          <ResultCard
            label="Annual PT"
            value={result.annual}
            type="warning"
            prefix="₹"
          />
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function AdvanceTaxCalculator() {
  const [income, setIncome] = useState(800000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    let tax = 0
    if (income <= 300000) tax = 0
    else if (income <= 600000) tax = (income - 300000) * 0.05
    else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10
    else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15
    else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20
    else tax = 150000 + (income - 1500000) * 0.30
    
    const cess = tax * 0.04
    const total = tax + cess
    const q1 = total * 0.15
    const q2 = total * 0.45 - q1
    const q3 = total * 0.75 - q1 - q2
    const q4 = total - q1 - q2 - q3
    
    setResult({ 
      total: Math.round(total), 
      q1: Math.round(q1), 
      q2: Math.round(q2), 
      q3: Math.round(q3), 
      q4: Math.round(q4) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Advance Tax Calculator"
      description="Calculate your advance tax installments."
      icon={Calculator}
      calculate={calculate}
      seoContent={<IncomeTaxSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Estimated Annual Income"
          value={income}
          onChange={setIncome}
          min={100000}
          max={5000000}
          step={10000}
          prefix="₹"
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Total Tax Liability"
            value={result.total}
            type="warning"
            prefix="₹"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Q1 (by June 15)"
              value={result.q1}
              prefix="₹"
            />
            <ResultCard
              label="Q2 (by Sep 15)"
              value={result.q2}
              prefix="₹"
            />
            <ResultCard
              label="Q3 (by Dec 15)"
              value={result.q3}
              prefix="₹"
            />
            <ResultCard
              label="Q4 (by Mar 15)"
              value={result.q4}
              prefix="₹"
            />
          </div>
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function PostTaxIncome() {
  const [income, setIncome] = useState(1000000)
  const [deductions, setDeductions] = useState(150000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const taxable = income - deductions
    let tax = 0
    if (taxable <= 300000) tax = 0
    else if (taxable <= 600000) tax = (taxable - 300000) * 0.05
    else if (taxable <= 900000) tax = 15000 + (taxable - 600000) * 0.10
    else if (taxable <= 1200000) tax = 45000 + (taxable - 900000) * 0.15
    else if (taxable <= 1500000) tax = 90000 + (taxable - 1200000) * 0.20
    else tax = 150000 + (taxable - 1500000) * 0.30
    
    const cess = tax * 0.04
    const totalTax = tax + cess
    const postTax = income - totalTax
    const monthly = postTax / 12
    
    setResult({ 
      taxable: Math.round(taxable), 
      tax: Math.round(totalTax), 
      postTax: Math.round(postTax), 
      monthly: Math.round(monthly) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Post-Tax Income Calculator"
      description="Calculate your income after tax deductions."
      icon={Calculator}
      calculate={calculate}
      seoContent={<IncomeTaxSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Annual Income"
          value={income}
          onChange={setIncome}
          min={100000}
          max={10000000}
          step={10000}
          prefix="₹"
        />
        <InputGroup
          label="Deductions (80C, etc.)"
          value={deductions}
          onChange={setDeductions}
          min={0}
          max={500000}
          step={5000}
          prefix="₹"
        />
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Post-Tax Annual Income"
            value={result.postTax}
            type="success"
            prefix="₹"
          />
          <ResultCard
            label="Monthly In-Hand"
            value={result.monthly}
            type="success"
            prefix="₹"
          />
          <ResultCard
            label="Total Tax Payable"
            value={result.tax}
            type="warning"
            prefix="₹"
          />
          <ResultCard
            label="Taxable Income"
            value={result.taxable}
            prefix="₹"
          />
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}
