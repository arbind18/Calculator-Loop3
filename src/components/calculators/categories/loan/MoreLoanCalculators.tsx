"use client"

import { useState } from "react"
import { Calculator, PauseCircle } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

export function LoanPartPayment() {
  const [outstanding, setOutstanding] = useState(2000000)
  const [partPayment, setPartPayment] = useState(500000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [remainingTenure, setRemainingTenure] = useState(180) // Months

  const handleClear = () => {
    setOutstanding(2000000)
    setPartPayment(500000)
    setInterestRate(8.5)
    setRemainingTenure(180)
  }

  const calculate = () => {
    const r = interestRate / 12 / 100
    
    // Current EMI
    const currentEMI = outstanding * r * Math.pow(1 + r, remainingTenure) / (Math.pow(1 + r, remainingTenure) - 1)
    
    // New Principal
    const newPrincipal = outstanding - partPayment
    
    // Option 1: Reduce Tenure (Keep EMI same)
    // n = log(EMI / (EMI - P*r)) / log(1+r)
    const newTenure = Math.log(currentEMI / (currentEMI - newPrincipal * r)) / Math.log(1 + r)
    
    // Option 2: Reduce EMI (Keep Tenure same)
    const newEMI = newPrincipal * r * Math.pow(1 + r, remainingTenure) / (Math.pow(1 + r, remainingTenure) - 1)
    
    return { 
      currentEMI: Math.round(currentEMI),
      newTenure: Math.ceil(newTenure),
      newEMI: Math.round(newEMI),
      tenureSaved: remainingTenure - Math.ceil(newTenure),
      emiSaved: Math.round(currentEMI - newEMI)
    }
  }

  const result = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Loan Part Payment Calculator"
      description="See impact of part payment: Reduce Tenure vs Reduce EMI."
      icon={Calculator}
      calculate={() => {}}
      values={[outstanding, partPayment, interestRate, remainingTenure]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setOutstanding(Number(vals?.[0] ?? 2000000))
        setPartPayment(Number(vals?.[1] ?? 500000))
        setInterestRate(Number(vals?.[2] ?? 8.5))
        setRemainingTenure(Number(vals?.[3] ?? 180))
      }}
      onDownload={(format) => generateReport(format, 'part_payment', ['Metric', 'Value'], [['Tenure Saved', `${result.tenureSaved} Months`]], 'Part Payment Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Outstanding Loan" value={outstanding} onChange={setOutstanding} prefix="₹" />
          <InputGroup label="Part Payment Amount" value={partPayment} onChange={setPartPayment} prefix="₹" />
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} />
          <InputGroup label="Remaining Tenure" value={remainingTenure} onChange={setRemainingTenure} suffix="Months" />
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-semibold">Option 1: Reduce Tenure</div>
              <div className="text-2xl font-bold text-green-700">{result.tenureSaved} Months Saved</div>
              <div className="text-xs text-green-600">EMI remains ₹{result.currentEMI}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-semibold">Option 2: Reduce EMI</div>
              <div className="text-2xl font-bold text-blue-700">₹{result.emiSaved} Saved/Mo</div>
              <div className="text-xs text-blue-600">New EMI: ₹{result.newEMI}</div>
            </div>
          </div>
        </div>
      }
    />
  )
}

export function MoratoriumCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000)
  const [interestRate, setInterestRate] = useState(9)
  const [moratoriumPeriod, setMoratoriumPeriod] = useState(6) // Months

  const handleClear = () => {
    setLoanAmount(1000000)
    setInterestRate(9)
    setMoratoriumPeriod(6)
  }

  const calculate = () => {
    // Simple interest during moratorium is added to principal
    const interestAccrued = loanAmount * (interestRate / 100) * (moratoriumPeriod / 12)
    const newPrincipal = loanAmount + interestAccrued
    return { interestAccrued: Math.round(interestAccrued), newPrincipal: Math.round(newPrincipal) }
  }

  const { interestAccrued, newPrincipal } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Moratorium Calculator"
      description="Calculate interest accrued during loan moratorium period."
      icon={PauseCircle}
      calculate={() => {}}
      values={[loanAmount, interestRate, moratoriumPeriod]}
      onClear={handleClear}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals?.[0] ?? 1000000))
        setInterestRate(Number(vals?.[1] ?? 9))
        setMoratoriumPeriod(Number(vals?.[2] ?? 6))
      }}
      onDownload={(format) => generateReport(format, 'moratorium', ['Item', 'Value'], [['Interest Accrued', `₹${interestAccrued}`]], 'Moratorium Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Loan Amount" value={loanAmount} onChange={setLoanAmount} prefix="₹" />
          <InputGroup label="Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} />
          <InputGroup label="Moratorium Period" value={moratoriumPeriod} onChange={setMoratoriumPeriod} suffix="Months" />
        </div>
      }
      result={
        <div className="p-6 bg-orange-50 rounded-xl text-center">
          <div className="text-lg text-orange-800 mb-2">Extra Interest to Pay</div>
          <div className="text-4xl font-bold text-orange-600">₹{interestAccrued.toLocaleString()}</div>
          <p className="text-sm text-orange-700 mt-2">New Principal: ₹{newPrincipal.toLocaleString()}</p>
        </div>
      }
    />
  )
}
