"use client"

import { useState } from "react"
import { Home, Key, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"
import { HomeLoanSeoContent } from "@/components/calculators/seo/LoanSeo"

export function RentVsBuy() {
  // Buy Inputs
  const [propertyPrice, setPropertyPrice] = useState(5000000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [loanRate, setLoanRate] = useState(8.5)
  const [loanTenure, setLoanTenure] = useState(20)
  const [appreciationRate, setAppreciationRate] = useState(5)
  const [maintenanceCost, setMaintenanceCost] = useState(3000) // Monthly

  // Rent Inputs
  const [monthlyRent, setMonthlyRent] = useState(15000)
  const [rentIncreaseRate, setRentIncreaseRate] = useState(5)
  const [investmentReturnRate, setInvestmentReturnRate] = useState(12) // Returns on money saved if renting

  const [result, setResult] = useState<any>(null)

  const calculateRentVsBuy = () => {
    const downPayment = propertyPrice * (downPaymentPercent / 100)
    const loanAmount = propertyPrice - downPayment
    const monthlyRate = loanRate / 12 / 100
    const totalMonths = loanTenure * 12
    
    // EMI Calculation
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1)

    let buyNetWorth = -downPayment // Initial cash outflow
    let rentNetWorth = downPayment // Initial cash saved (invested)
    
    let currentPropertyValue = propertyPrice
    let currentRent = monthlyRent
    let currentMaintenance = maintenanceCost
    
    const data = []
    let breakevenYear = null

    for (let year = 1; year <= loanTenure; year++) {
      // BUY SCENARIO
      // 1. Property Appreciates
      currentPropertyValue = currentPropertyValue * (1 + appreciationRate / 100)
      
      // 2. Pay EMI (Cost)
      const yearlyEMI = emi * 12
      
      // 3. Pay Maintenance (Cost)
      const yearlyMaintenance = currentMaintenance * 12
      currentMaintenance = currentMaintenance * (1 + 3/100) // Assume 3% inflation on maintenance

      // Buy Net Worth = Property Value - Outstanding Loan (Simplified) - Costs Paid (Not exactly net worth, but "Value Generated")
      // Better approach: Compare "Wealth Created".
      // Wealth Buy = Property Value - Outstanding Loan
      // Wealth Rent = Investment Value
      
      // Calculate Outstanding Loan
      // (Complex formula omitted for brevity, approximating linear principal repayment for visualization)
      // Exact: Balance = P * ((1+r)^n - (1+r)^p) / ((1+r)^n - 1)
      const monthsPassed = year * 12
      const outstandingLoan = loanAmount * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsPassed)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      
      const wealthBuy = currentPropertyValue - outstandingLoan

      // RENT SCENARIO
      // 1. Pay Rent (Cost)
      const yearlyRent = currentRent * 12
      currentRent = currentRent * (1 + rentIncreaseRate / 100)

      // 2. Invest the difference (EMI + Maint - Rent)
      // If Buying is more expensive monthly, Renter invests the difference.
      // If Renting is more expensive, Buyer invests the difference (rare in early years).
      const costOfBuyingMonthly = emi + (yearlyMaintenance / 12)
      const costOfRentingMonthly = yearlyRent / 12
      
      const monthlyDifference = costOfBuyingMonthly - costOfRentingMonthly
      
      // Update Rent Wealth (Investment Portfolio)
      // Start with Downpayment growing
      rentNetWorth = rentNetWorth * (1 + investmentReturnRate / 100)
      
      // Add monthly difference investment (with interest)
      if (monthlyDifference > 0) {
        // Renter saves this money
        // FV of series: PMT * (((1+r)^n - 1)/r)
        const monthlyInvRate = investmentReturnRate / 12 / 100
        const yearlySavingsValue = monthlyDifference * ((Math.pow(1 + monthlyInvRate, 12) - 1) / monthlyInvRate)
        rentNetWorth += yearlySavingsValue
      } else {
        // Buyer saves this money (Rent is higher than EMI) - Add to Buy Wealth? 
        // To keep it simple, we subtract from Rent Wealth (as if eating into savings)
        const deficit = Math.abs(monthlyDifference)
        const yearlyDeficit = deficit * 12 // Simplified
        rentNetWorth -= yearlyDeficit
      }

      if (wealthBuy > rentNetWorth && breakevenYear === null) {
        breakevenYear = year
      }

      data.push({
        year,
        wealthBuy: Math.round(wealthBuy),
        wealthRent: Math.round(rentNetWorth)
      })
    }

    setResult({
      breakevenYear: breakevenYear || "Never (in tenure)",
      finalWealthBuy: data[data.length - 1].wealthBuy,
      finalWealthRent: data[data.length - 1].wealthRent,
      recommendation: data[data.length - 1].wealthBuy > data[data.length - 1].wealthRent ? "Buying is better" : "Renting is better",
      data
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Rent vs Buy Calculator"
      description="Should you buy a home or rent and invest? A detailed analysis of wealth creation over time."
      icon={Home}
      calculate={calculateRentVsBuy}
      values={[propertyPrice, monthlyRent, loanRate, investmentReturnRate]}
      seoContent={<HomeLoanSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary flex items-center gap-2"><Key className="h-4 w-4" /> Buying Details</h3>
              <InputGroup label="Property Price" value={propertyPrice} onChange={setPropertyPrice} prefix="₹" />
              <InputGroup label="Down Payment" value={downPaymentPercent} onChange={setDownPaymentPercent} suffix="%" />
              <InputGroup label="Loan Rate" value={loanRate} onChange={setLoanRate} suffix="%" />
              <InputGroup label="Appreciation Rate" value={appreciationRate} onChange={setAppreciationRate} suffix="%" helpText="Exp. property growth" />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-primary flex items-center gap-2"><Home className="h-4 w-4" /> Renting Details</h3>
              <InputGroup label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} prefix="₹" />
              <InputGroup label="Rent Increase" value={rentIncreaseRate} onChange={setRentIncreaseRate} suffix="%" />
              <InputGroup label="Inv. Return Rate" value={investmentReturnRate} onChange={setInvestmentReturnRate} suffix="%" helpText="Returns on saved cash" />
              <InputGroup label="Loan Tenure" value={loanTenure} onChange={setLoanTenure} suffix="yrs" />
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Recommendation"
              value={result.recommendation}
              type="highlight"
            />
            <ResultCard
              label="Wealth if Bought"
              value={`₹${formatCompactNumber(result.finalWealthBuy)}`}
              type="default"
              subtext={`After ${loanTenure} years`}
            />
            <ResultCard
              label="Wealth if Rented"
              value={`₹${formatCompactNumber(result.finalWealthRent)}`}
              type="default"
              subtext={`After ${loanTenure} years`}
            />
          </div>
        </div>
      )}
      charts={result && (
        <div className="h-[400px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="wealthBuy" name="Net Worth (Buy)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wealthRent" name="Net Worth (Rent)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
