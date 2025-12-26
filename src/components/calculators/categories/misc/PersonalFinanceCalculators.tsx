"use client"

import { useState } from "react"
import { Wallet, Target, PieChart } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

export function NetWorth() {
  const [assets, setAssets] = useState({
    cash: 50000,
    investments: 500000,
    property: 5000000,
    vehicles: 200000,
    other: 100000
  })
  
  const [liabilities, setLiabilities] = useState({
    loans: 2500000,
    creditCard: 20000,
    other: 0
  })

  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0)
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <FinancialCalculatorTemplate
      title="Net Worth Calculator"
      description="Calculate your total net worth by subtracting liabilities from assets."
      icon={Wallet}
      calculate={() => {}}
      onDownload={(format) => {
        generateReport(format, 'net_worth', 
          ['Category', 'Amount'], 
          [
            ['Total Assets', `₹${totalAssets}`],
            ['Total Liabilities', `₹${totalLiabilities}`],
            ['Net Worth', `₹${netWorth}`]
          ], 
          'Net Worth Report'
        )
      }}
      inputs={
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-green-600">Assets (What you own)</h3>
            <InputGroup label="Cash & Bank" value={assets.cash} onChange={(v) => setAssets({...assets, cash: v})} prefix="₹" />
            <InputGroup label="Investments" value={assets.investments} onChange={(v) => setAssets({...assets, investments: v})} prefix="₹" />
            <InputGroup label="Real Estate" value={assets.property} onChange={(v) => setAssets({...assets, property: v})} prefix="₹" />
            <InputGroup label="Vehicles" value={assets.vehicles} onChange={(v) => setAssets({...assets, vehicles: v})} prefix="₹" />
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-red-600">Liabilities (What you owe)</h3>
            <InputGroup label="Loans (Home/Car)" value={liabilities.loans} onChange={(v) => setLiabilities({...liabilities, loans: v})} prefix="₹" />
            <InputGroup label="Credit Card Debt" value={liabilities.creditCard} onChange={(v) => setLiabilities({...liabilities, creditCard: v})} prefix="₹" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="p-6 bg-primary/10 rounded-xl text-center">
            <div className="text-lg text-muted-foreground mb-2">Your Net Worth</div>
            <div className="text-4xl font-bold text-primary">₹{netWorth.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded">
              <div className="text-xs text-green-600">Assets</div>
              <div className="font-bold">₹{totalAssets.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-red-50 rounded">
              <div className="text-xs text-red-600">Liabilities</div>
              <div className="font-bold">₹{totalLiabilities.toLocaleString()}</div>
            </div>
          </div>
        </div>
      }
    />
  )
}

export function SavingsGoal() {
  const [goalAmount, setGoalAmount] = useState(1000000)
  const [currentSavings, setCurrentSavings] = useState(100000)
  const [years, setYears] = useState(5)
  const [returnRate, setReturnRate] = useState(8)

  const calculate = () => {
    // FV = PV * (1+r)^n + PMT * ((1+r)^n - 1)/r
    // We need to find PMT (Monthly Investment)
    // PMT = (FV - PV * (1+r)^n) * r / ((1+r)^n - 1)
    
    const r = returnRate / 12 / 100
    const n = years * 12
    
    const futureValueOfCurrent = currentSavings * Math.pow(1 + r, n)
    const shortfall = goalAmount - futureValueOfCurrent
    
    if (shortfall <= 0) return 0
    
    const monthlyInvestment = shortfall * r / (Math.pow(1 + r, n) - 1)
    return Math.round(monthlyInvestment)
  }

  const monthlyNeeded = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Savings Goal Calculator"
      description="Calculate how much you need to save monthly to reach your financial goal."
      icon={Target}
      calculate={() => {}}
      onDownload={(format) => {
        generateReport(format, 'savings_goal', ['Metric', 'Value'], [['Monthly Savings Needed', `₹${monthlyNeeded}`]], 'Savings Goal Report')
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Goal Amount" value={goalAmount} onChange={setGoalAmount} prefix="₹" />
          <InputGroup label="Current Savings" value={currentSavings} onChange={setCurrentSavings} prefix="₹" />
          <InputGroup label="Time to Goal" value={years} onChange={setYears} suffix="Years" />
          <InputGroup label="Expected Return" value={returnRate} onChange={setReturnRate} suffix="%" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Monthly Savings Needed</div>
          <div className="text-4xl font-bold text-primary">₹{monthlyNeeded.toLocaleString()}</div>
        </div>
      }
    />
  )
}

export function BudgetPlanner() {
  const [income, setIncome] = useState(50000)
  
  const calculate = () => {
    // 50/30/20 Rule
    const needs = income * 0.50
    const wants = income * 0.30
    const savings = income * 0.20
    return { needs, wants, savings }
  }

  const { needs, wants, savings } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="50/30/20 Budget Planner"
      description="Plan your monthly budget using the popular 50/30/20 rule."
      icon={PieChart}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'budget_planner', ['Category', 'Amount'], [['Needs', `₹${needs}`], ['Wants', `₹${wants}`], ['Savings', `₹${savings}`]], 'Budget Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly After-Tax Income" value={income} onChange={setIncome} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">Needs (50%)</div>
            <div className="text-xl font-bold text-blue-700">₹{needs.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600">Wants (30%)</div>
            <div className="text-xl font-bold text-purple-700">₹{wants.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Savings (20%)</div>
            <div className="text-xl font-bold text-green-700">₹{savings.toLocaleString()}</div>
          </div>
        </div>
      }
    />
  )
}
