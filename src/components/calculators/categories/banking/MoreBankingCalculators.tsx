"use client"

import { useState } from "react"
import { Landmark, TrendingUp, Calendar } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

export function KisanVikasPatra() {
  const [investment, setInvestment] = useState(10000)
  const [interestRate, setInterestRate] = useState(7.5) // Current rate approx

  const calculate = () => {
    // KVP doubles money in X months
    // Rule of 72 or exact formula: A = P(1+r/n)^(nt)
    // KVP usually doubles in ~115 months at 7.5%
    // Doubling time = log(2) / log(1 + r)
    
    const r = interestRate / 100
    const yearsToDouble = Math.log(2) / Math.log(1 + r)
    const monthsToDouble = Math.ceil(yearsToDouble * 12)
    
    const maturityAmount = investment * 2
    
    return { months: monthsToDouble, maturityAmount }
  }

  const { months, maturityAmount } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Kisan Vikas Patra (KVP)"
      description="Calculate when your investment will double under KVP scheme."
      icon={Landmark}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'kvp_report', ['Item', 'Value'], [['Maturity Amount', `₹${maturityAmount}`], ['Time to Double', `${months} Months`]], 'KVP Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Investment Amount" value={investment} onChange={setInvestment} prefix="₹" step={1000} />
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} helpText="Current KVP rate is approx 7.5%" />
        </div>
      }
      result={
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Maturity Amount</div>
            <div className="text-2xl font-bold text-green-700">₹{maturityAmount.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Time to Double</div>
            <div className="text-2xl font-bold text-blue-700">{Math.floor(months/12)}Y {months%12}M</div>
          </div>
        </div>
      }
    />
  )
}

export function NationalSavingsCertificate() {
  const [investment, setInvestment] = useState(10000)
  const [interestRate, setInterestRate] = useState(7.7) // Current rate
  const [years, setYears] = useState(5) // Fixed 5 years usually

  const calculate = () => {
    // NSC compounds annually
    const maturityAmount = investment * Math.pow(1 + interestRate / 100, years)
    const interestEarned = maturityAmount - investment
    return { maturityAmount: Math.round(maturityAmount), interestEarned: Math.round(interestEarned) }
  }

  const { maturityAmount, interestEarned } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="National Savings Certificate (NSC)"
      description="Calculate maturity amount for NSC investments."
      icon={Landmark}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'nsc_report', ['Item', 'Value'], [['Maturity Amount', `₹${maturityAmount}`]], 'NSC Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Investment Amount" value={investment} onChange={setInvestment} prefix="₹" step={1000} />
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} />
          <InputGroup label="Tenure" value={years} onChange={setYears} suffix="Years" disabled />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Maturity Amount</div>
          <div className="text-4xl font-bold text-primary">₹{maturityAmount.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-2">Total Interest: ₹{interestEarned.toLocaleString()}</p>
        </div>
      }
    />
  )
}

export function PostOfficeMIS() {
  const [investment, setInvestment] = useState(100000)
  const [interestRate, setInterestRate] = useState(7.4)

  const calculate = () => {
    const monthlyIncome = (investment * (interestRate / 100)) / 12
    return Math.round(monthlyIncome)
  }

  const monthlyIncome = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Post Office MIS Calculator"
      description="Calculate monthly income from Post Office Monthly Income Scheme."
      icon={Calendar}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'pomis_report', ['Item', 'Value'], [['Monthly Income', `₹${monthlyIncome}`]], 'POMIS Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Investment Amount" value={investment} onChange={setInvestment} prefix="₹" step={1000} max={900000} helpText="Max ₹9L for single, ₹15L for joint" />
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Monthly Income</div>
          <div className="text-4xl font-bold text-primary">₹{monthlyIncome.toLocaleString()}</div>
        </div>
      }
    />
  )
}
