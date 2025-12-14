"use client"
import { useState } from "react"
import { Calculator, Receipt } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { IncomeTaxSeoContent, HRASeoContent } from "@/components/calculators/seo/TaxSeo"
import { GSTSeoContent } from "@/components/calculators/seo/BusinessSeo"

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState(800000)
  const [regime, setRegime] = useState('new')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    let tax = 0
    if (regime === 'new') {
      if (income <= 300000) tax = 0
      else if (income <= 600000) tax = (income - 300000) * 0.05
      else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10
      else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15
      else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20
      else tax = 150000 + (income - 1500000) * 0.30
    } else {
      if (income <= 250000) tax = 0
      else if (income <= 500000) tax = (income - 250000) * 0.05
      else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20
      else tax = 112500 + (income - 1000000) * 0.30
    }
    const cess = tax * 0.04
    const total = tax + cess
    setResult({ tax: Math.round(tax), cess: Math.round(cess), total: Math.round(total), inHand: income - total })
  }

  return (
    <FinancialCalculatorTemplate
      title="Income Tax Calculator 2024-25"
      description="Calculate your income tax liability under Old vs New Regime."
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Tax Regime</label>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            className="w-full p-3 rounded-lg bg-background border"
          >
            <option value="new">New Tax Regime</option>
            <option value="old">Old Tax Regime</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Total Tax"
            value={result.total}
            type="warning"
            prefix="₹"
          />
          <ResultCard
            label="In-Hand Income"
            value={result.inHand}
            type="success"
            prefix="₹"
          />
          <ResultCard
            label="Base Tax"
            value={result.tax}
            prefix="₹"
          />
          <ResultCard
            label="Health & Education Cess (4%)"
            value={result.cess}
            prefix="₹"
          />
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function GSTCalculator() {
  const [amount, setAmount] = useState(10000)
  const [gstRate, setGstRate] = useState(18)
  const [type, setType] = useState('exclusive')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    let gst, total, base
    if (type === 'exclusive') {
      base = amount
      gst = (amount * gstRate) / 100
      total = amount + gst
    } else {
      total = amount
      base = amount / (1 + gstRate/100)
      gst = amount - base
    }
    setResult({ gst: Math.round(gst), total: Math.round(total), base: Math.round(base), cgst: Math.round(gst/2), sgst: Math.round(gst/2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="GST Calculator"
      description="Calculate GST inclusive or exclusive amounts."
      icon={Receipt}
      calculate={calculate}
      seoContent={<GSTSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={100}
          max={10000000}
          step={100}
          prefix="₹"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">GST Rate</label>
          <select
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-background border"
          >
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Calculation Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={type === 'exclusive'}
                onChange={() => setType('exclusive')}
                className="accent-primary"
              />
              GST Exclusive (Add GST)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={type === 'inclusive'}
                onChange={() => setType('inclusive')}
                className="accent-primary"
              />
              GST Inclusive (Remove GST)
            </label>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Total Amount"
            value={result.total}
            type="highlight"
            prefix="₹"
          />
          <ResultCard
            label="GST Amount"
            value={result.gst}
            type="warning"
            prefix="₹"
          />
          <ResultCard
            label="Base Amount"
            value={result.base}
            prefix="₹"
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="CGST"
              value={result.cgst}
              prefix="₹"
            />
            <ResultCard
              label="SGST"
              value={result.sgst}
              prefix="₹"
            />
          </div>
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function SalaryBreakup() {
  const [ctc, setCtc] = useState(1200000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const basic = ctc * 0.40
    const hra = basic * 0.50
    const da = ctc * 0.10
    const pf = basic * 0.12
    const pt = 2400
    const grossSalary = basic + hra + da
    const deductions = pf + pt
    const takeHome = grossSalary - deductions
    setResult({ basic, hra, da, pf, pt, gross: grossSalary, deductions, takeHome: Math.round(takeHome/12) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Salary Breakup Calculator"
      description="Estimate your in-hand salary from CTC."
      icon={Calculator}
      calculate={calculate}
      seoContent={<IncomeTaxSeoContent />}
    >
      <div className="space-y-6">
        <InputGroup
          label="Annual CTC"
          value={ctc}
          onChange={setCtc}
          min={300000}
          max={10000000}
          step={10000}
          prefix="₹"
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Monthly In-Hand Salary"
            value={result.takeHome}
            type="success"
            prefix="₹"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Basic Salary"
              value={Math.round(result.basic)}
              prefix="₹"
            />
            <ResultCard
              label="HRA"
              value={Math.round(result.hra)}
              prefix="₹"
            />
            <ResultCard
              label="DA"
              value={Math.round(result.da)}
              prefix="₹"
            />
            <ResultCard
              label="PF Deduction"
              value={Math.round(result.pf)}
              type="warning"
              prefix="-₹"
            />
            <ResultCard
              label="PT Deduction"
              value={result.pt}
              type="warning"
              prefix="-₹"
            />
          </div>
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}

export function HRACalculator() {
  const [basic, setBasic] = useState(50000)
  const [hra, setHra] = useState(25000)
  const [rent, setRent] = useState(20000)
  const [metro, setMetro] = useState(true)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const actual = hra
    const rentMinusTen = rent - (basic * 0.10)
    const percentage = metro ? basic * 0.50 : basic * 0.40
    const exempt = Math.min(actual, rentMinusTen, percentage)
    const taxable = hra - exempt
    setResult({ exempt: Math.round(exempt), taxable: Math.round(taxable) })
  }

  return (
    <FinancialCalculatorTemplate
      title="HRA Exemption Calculator"
      description="Calculate your HRA exemption and taxable HRA."
      icon={Calculator}
      calculate={calculate}
      seoContent={<HRASeoContent />}
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
          label="HRA Received"
          value={hra}
          onChange={setHra}
          min={5000}
          max={100000}
          step={1000}
          prefix="₹"
        />
        <InputGroup
          label="Rent Paid"
          value={rent}
          onChange={setRent}
          min={5000}
          max={100000}
          step={1000}
          prefix="₹"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">City Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={metro}
                onChange={(e) => setMetro(e.target.checked)}
                className="accent-primary"
              />
              Living in Metro City (50%)
            </label>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Exempt HRA"
            value={result.exempt}
            type="success"
            prefix="₹"
          />
          <ResultCard
            label="Taxable HRA"
            value={result.taxable}
            type="warning"
            prefix="₹"
          />
        </div>
      )}
    </FinancialCalculatorTemplate>
  )
}
