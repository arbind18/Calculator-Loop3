"use client"

import { useState } from "react"
import { CreditCard, ArrowRightLeft, Percent } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

export function CreditCardMinimumDue() {
  const [outstanding, setOutstanding] = useState(50000)
  const [interestRate, setInterestRate] = useState(3.5) // Monthly
  const [minDuePercent, setMinDuePercent] = useState(5)

  const calculate = () => {
    let balance = outstanding
    let months = 0
    let totalInterest = 0
    
    // Simulate paying only minimum due
    // Warning: This can be an infinite loop if interest > min payment, but usually min payment covers interest + 1% principal
    // We'll cap at 20 years (240 months)
    
    while (balance > 100 && months < 240) {
      const interest = balance * (interestRate / 100)
      let payment = Math.max(balance * (minDuePercent / 100), interest + 100) // Ensure some principal payment
      if (payment > balance) payment = balance
      
      balance = balance + interest - payment
      totalInterest += interest
      months++
    }
    
    return { months, totalInterest: Math.round(totalInterest) }
  }

  const { months, totalInterest } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Credit Card Minimum Due Calculator"
      description="See how long it takes to clear debt paying only the minimum amount."
      icon={CreditCard}
      calculate={() => {}}
      onDownload={(format) => {
        generateReport(format, 'cc_min_due', 
          ['Metric', 'Value'], 
          [
            ['Time to Clear', `${months} Months`],
            ['Total Interest Paid', `₹${totalInterest}`]
          ], 
          'Credit Card Debt Report'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Outstanding Balance" value={outstanding} onChange={setOutstanding} prefix="₹" />
          <InputGroup label="Monthly Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} helpText="Usually 3-4% per month" />
          <InputGroup label="Minimum Due %" value={minDuePercent} onChange={setMinDuePercent} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600">Time to Clear</div>
            <div className="text-2xl font-bold text-red-700">{months >= 240 ? "20+ Years" : `${(months/12).toFixed(1)} Years`}</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-600">Total Interest</div>
            <div className="text-2xl font-bold text-orange-700">₹{totalInterest.toLocaleString()}</div>
          </div>
        </div>
      }
    />
  )
}

export function BalanceTransfer() {
  const [balance, setBalance] = useState(100000)
  const [currentRate, setCurrentRate] = useState(40) // Annual
  const [newRate, setNewRate] = useState(12) // Annual
  const [transferFee, setTransferFee] = useState(2) // %
  const [monthsToPay, setMonthsToPay] = useState(12)

  const calculate = () => {
    const currentInterest = balance * (currentRate / 100) * (monthsToPay / 12)
    const fee = balance * (transferFee / 100)
    const newInterest = balance * (newRate / 100) * (monthsToPay / 12)
    
    const savings = currentInterest - (newInterest + fee)
    return { savings: Math.round(savings), fee: Math.round(fee) }
  }

  const { savings, fee } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Balance Transfer Calculator"
      description="Calculate savings by transferring credit card balance to a lower interest loan/card."
      icon={ArrowRightLeft}
      calculate={() => {}}
      onDownload={(format) => {
        generateReport(format, 'balance_transfer', 
          ['Metric', 'Value'], 
          [
            ['Projected Savings', `₹${savings}`],
            ['Transfer Fee', `₹${fee}`]
          ], 
          'Balance Transfer Report'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Transfer Amount" value={balance} onChange={setBalance} prefix="₹" />
          <InputGroup label="Current Annual Interest" value={currentRate} onChange={setCurrentRate} suffix="%" />
          <InputGroup label="New Annual Interest" value={newRate} onChange={setNewRate} suffix="%" />
          <InputGroup label="Transfer Fee" value={transferFee} onChange={setTransferFee} suffix="%" />
          <InputGroup label="Months to Pay Off" value={monthsToPay} onChange={setMonthsToPay} suffix="Months" />
        </div>
      }
      result={
        <div className="p-6 bg-green-50 rounded-xl text-center">
          <div className="text-lg text-green-800 mb-2">Total Savings</div>
          <div className="text-4xl font-bold text-green-600">₹{savings.toLocaleString()}</div>
          <p className="text-sm text-green-700 mt-2">After paying ₹{fee} fee</p>
        </div>
      }
    />
  )
}

export function CreditCardEMI() {
  const [amount, setAmount] = useState(50000)
  const [rate, setRate] = useState(15) // Annual
  const [months, setMonths] = useState(12)
  const [processingFee, setProcessingFee] = useState(1) // %

  const calculate = () => {
    const r = rate / 12 / 100
    const emi = amount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
    const totalPayment = emi * months
    const totalInterest = totalPayment - amount
    const fee = amount * (processingFee / 100)
    
    return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), fee: Math.round(fee) }
  }

  const { emi, totalInterest, fee } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Credit Card EMI Calculator"
      description="Calculate EMI for converting credit card purchases into installments."
      icon={CreditCard}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'cc_emi', ['Item', 'Value'], [['EMI', `₹${emi}`], ['Total Interest', `₹${totalInterest}`]], 'EMI Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Transaction Amount" value={amount} onChange={setAmount} prefix="₹" />
          <InputGroup label="Interest Rate (Annual)" value={rate} onChange={setRate} suffix="%" />
          <InputGroup label="Tenure" value={months} onChange={setMonths} suffix="Months" />
          <InputGroup label="Processing Fee" value={processingFee} onChange={setProcessingFee} suffix="%" />
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="p-6 bg-primary/10 rounded-xl text-center">
            <div className="text-lg text-muted-foreground mb-2">Monthly EMI</div>
            <div className="text-4xl font-bold text-primary">₹{emi.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted rounded">
              <div className="text-xs text-muted-foreground">Total Interest</div>
              <div className="font-bold">₹{totalInterest.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-muted rounded">
              <div className="text-xs text-muted-foreground">Processing Fee</div>
              <div className="font-bold">₹{fee.toLocaleString()}</div>
            </div>
          </div>
        </div>
      }
    />
  )
}
