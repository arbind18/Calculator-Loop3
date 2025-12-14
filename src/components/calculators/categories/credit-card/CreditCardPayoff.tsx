"use client"

import { useState } from "react"
import { CreditCard, AlertTriangle, CheckCircle } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"
import { PersonalLoanSeoContent } from "@/components/calculators/seo/LoanSeo"

export function CreditCardPayoff() {
  const [balance, setBalance] = useState(50000)
  const [interestRate, setInterestRate] = useState(36) // Annual rate, typically 36-42% for cards
  const [monthlyPayment, setMonthlyPayment] = useState(2500) // Minimum due is usually 5%
  
  const [result, setResult] = useState<any>(null)

  const calculatePayoff = () => {
    const monthlyRate = interestRate / 12 / 100
    let currentBalance = balance
    let totalInterest = 0
    let months = 0
    const data = []
    
    // Safety break at 30 years (360 months) to prevent infinite loops for low payments
    while (currentBalance > 0 && months < 360) {
      const interest = currentBalance * monthlyRate
      let principal = monthlyPayment - interest
      
      if (principal <= 0) {
        // Payment too low to cover interest
        setResult({ error: "Payment is too low to cover interest. You will never pay this off!" })
        return
      }

      if (currentBalance < monthlyPayment) {
        principal = currentBalance
        // Last month payment will be less
      }

      currentBalance -= principal
      totalInterest += interest
      months++

      if (months % 6 === 0 || currentBalance <= 0) {
         data.push({
            month: months,
            balance: Math.max(0, Math.round(currentBalance)),
            interestPaid: Math.round(totalInterest)
         })
      }
    }

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    setResult({
      months,
      timeString: `${years > 0 ? `${years} years ` : ''}${remainingMonths} months`,
      totalInterest,
      totalPaid: balance + totalInterest,
      data
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Credit Card Payoff Calculator"
      description="See the true cost of paying only the minimum due. Find out how much interest you're really paying."
      icon={CreditCard}
      calculate={calculatePayoff}
      values={[balance, interestRate, monthlyPayment]}
      seoContent={<PersonalLoanSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Balance" value={balance} onChange={setBalance} prefix="₹" />
          <InputGroup 
            label="Interest Rate (APR)" 
            value={interestRate} 
            onChange={setInterestRate} 
            suffix="%" 
            helpText="Credit cards usually charge 36% to 42% annually"
          />
          <InputGroup 
            label="Monthly Payment" 
            value={monthlyPayment} 
            onChange={setMonthlyPayment} 
            prefix="₹" 
            helpText={`Min due is usually ~₹${Math.round(balance * 0.05)}`}
          />
        </div>
      }
      result={result && !result.error && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Time to Debt Free"
              value={result.timeString}
              type="highlight"
            />
            <ResultCard
              label="Total Interest Payable"
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="warning"
              subtext={`That's ${Math.round((result.totalInterest / balance) * 100)}% of your loan!`}
            />
            <ResultCard
              label="Total Amount Paid"
              value={`₹${result.totalPaid.toLocaleString()}`}
              type="default"
            />
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Debt Trap Warning</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  If you double your payment to <strong>₹{(monthlyPayment * 2).toLocaleString()}</strong>, 
                  you could save significant interest and finish years earlier.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      charts={result && !result.error && (
        <div className="h-[350px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="balance" 
                name="Outstanding Balance" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="interestPaid" 
                name="Total Interest Paid" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
