"use client"
import { useState } from "react"
import { PiggyBank, HandCoins, TrendingDown, Percent } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import {
  PPFSeoContent,
  LumpsumSeoContent,
  InflationSeoContent
} from "@/components/calculators/seo/InvestmentSeo"
import { CompoundInterestSeoContent } from "@/components/calculators/seo/BankingSeo"

export function PPFCalculator() {
  const [yearly, setYearly] = useState(100000)
  const [years, setYears] = useState(15)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const rate = 0.071 // Current PPF rate
    let corpus = 0
    for (let i = 1; i <= years; i++) {
      corpus = (corpus + yearly) * (1 + rate)
    }
    const invested = yearly * years
    const interest = corpus - invested
    setResult({ 
      corpus: Math.round(corpus), 
      invested, 
      interest: Math.round(interest) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="PPF Calculator"
      description="Calculate Public Provident Fund maturity amount and interest."
      icon={PiggyBank}
      calculate={calculate}
      values={[yearly, years]}
      seoContent={<PPFSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Yearly Investment"
            value={yearly}
            onChange={setYearly}
            min={500}
            max={150000}
            step={500}
            prefix="₹"
            helpText="Max ₹1.5 Lakh per year"
          />
          <InputGroup
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={15}
            max={50}
            suffix=" years"
            helpText="Min 15 years lock-in"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Invested" value={`₹${result.invested.toLocaleString('en-IN')}`} />
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Maturity Value" value={`₹${result.corpus.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function LumpsumCalculator() {
  const [amount, setAmount] = useState(500000)
  const [years, setYears] = useState(10)
  const [returns, setReturns] = useState(12)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const maturity = amount * Math.pow(1 + returns/100, years)
    const profit = maturity - amount
    setResult({ 
      maturity: Math.round(maturity), 
      profit: Math.round(profit) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Lumpsum Investment Calculator"
      description="Calculate returns on your one-time investment."
      icon={HandCoins}
      calculate={calculate}
      values={[amount, years, returns]}
      seoContent={<LumpsumSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Investment Amount"
            value={amount}
            onChange={setAmount}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
          <InputGroup
            label="Expected Returns"
            value={returns}
            onChange={setReturns}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Total Profit" value={`₹${result.profit.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Maturity Value" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function InflationImpact() {
  const [amount, setAmount] = useState(100000)
  const [years, setYears] = useState(10)
  const [inflation, setInflation] = useState(6)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const future = amount * Math.pow(1 + inflation/100, years)
    const purchasing = amount / Math.pow(1 + inflation/100, years)
    const loss = amount - purchasing
    setResult({ 
      future: Math.round(future), 
      purchasing: Math.round(purchasing), 
      loss: Math.round(loss) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Inflation Impact Calculator"
      description="Calculate how inflation affects your money's purchasing power."
      icon={TrendingDown}
      calculate={calculate}
      values={[amount, years, inflation]}
      seoContent={<InflationSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Current Amount"
            value={amount}
            onChange={setAmount}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            suffix=" years"
          />
          <InputGroup
            label="Inflation Rate"
            value={inflation}
            onChange={setInflation}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="bg-orange-500/10 p-6 rounded-xl text-center border border-orange-500/20">
            <p className="text-sm text-muted-foreground mb-2">Future cost of today's ₹{amount.toLocaleString('en-IN')}</p>
            <p className="text-3xl font-bold text-orange-500">₹{result.future.toLocaleString('en-IN')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Purchasing Power" value={`₹${result.purchasing.toLocaleString('en-IN')}`} subtext="Value after inflation" />
            <ResultCard label="Value Loss" value={`₹${result.loss.toLocaleString('en-IN')}`} type="warning" />
          </div>
        </div>
      )}
    />
  )
}

export function CompoundInterestInvestment() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(5)
  const [frequency, setFrequency] = useState(12)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const amount = principal * Math.pow(1 + (rate/100)/frequency, frequency * years)
    const interest = amount - principal
    setResult({ 
      amount: Math.round(amount), 
      interest: Math.round(interest) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Compound Interest Calculator"
      description="Calculate compound interest with different compounding frequencies."
      icon={Percent}
      calculate={calculate}
      values={[principal, rate, years, frequency]}
      seoContent={<CompoundInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            suffix=" years"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Compounding Frequency</label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="1">Yearly</option>
              <option value="2">Half-Yearly</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Total Amount" value={`₹${result.amount.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}
