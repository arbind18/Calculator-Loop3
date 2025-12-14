"use client"
import { useState } from "react"
import { TrendingUp, Landmark, CreditCard, Wallet, Percent, ArrowRightLeft, PiggyBank, Calendar } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import {
  FDSeoContent,
  RDSeoContent,
  PPFSeoContent,
  SimpleInterestSeoContent,
  CompoundInterestSeoContent
} from "@/components/calculators/seo/BankingSeo"

export function SavingsAccountInterest() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(3.5)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const interest = (principal * rate * years) / 100
    const maturity = principal + interest
    setResult({ interest: Math.round(interest), maturity: Math.round(maturity) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Savings Account Interest"
      description="Calculate interest earned on your savings account balance."
      icon={Wallet}
      calculate={calculate}
      values={[principal, rate, years]}
      seoContent={<SimpleInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Principal"
            value={principal}
            onChange={setPrincipal}
            min={10000}
            max={1000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={2}
            max={7}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Years"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="highlight" />
          <ResultCard label="Total Amount" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="success" />
        </div>
      )}
    />
  )
}

export function DepositMaturity() {
  const [amount, setAmount] = useState(100000)
  const [rate, setRate] = useState(6.5)
  const [months, setMonths] = useState(12)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const years = months / 12
    const maturity = amount * Math.pow(1 + rate/400, 4 * years)
    const interest = maturity - amount
    setResult({ maturity: Math.round(maturity), interest: Math.round(interest) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Deposit Maturity Calculator"
      description="Calculate maturity amount for Fixed Deposits."
      icon={Landmark}
      calculate={calculate}
      values={[amount, rate, months]}
      seoContent={<FDSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Deposit Amount"
            value={amount}
            onChange={setAmount}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={3}
            max={10}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure"
            value={months}
            onChange={setMonths}
            min={6}
            max={120}
            suffix=" months"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="highlight" />
          <ResultCard label="Maturity Amount" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="success" />
        </div>
      )}
    />
  )
}

export function BankChargesCalculator() {
  const [balance, setBalance] = useState(5000)
  const [minBalance, setMinBalance] = useState(10000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const shortfall = minBalance - balance
    let charges = 0
    if (shortfall > 0) {
      if (shortfall <= 2500) charges = 100
      else if (shortfall <= 5000) charges = 250
      else if (shortfall <= 7500) charges = 500
      else charges = 750
    }
    setResult({ charges, shortfall: shortfall > 0 ? shortfall : 0 })
  }

  return (
    <FinancialCalculatorTemplate
      title="Bank Charges Calculator"
      description="Estimate penalty charges for non-maintenance of minimum balance."
      icon={CreditCard}
      calculate={calculate}
      values={[balance, minBalance]}
      seoContent={<SimpleInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Account Balance"
            value={balance}
            onChange={setBalance}
            min={0}
            max={50000}
            step={500}
            prefix="₹"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Balance Required</label>
            <select 
              value={minBalance} 
              onChange={(e) => setMinBalance(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="5000">₹5,000 (Basic)</option>
              <option value="10000">₹10,000 (Regular)</option>
              <option value="25000">₹25,000 (Premium)</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-4">
          {result.charges > 0 ? (
            <>
              <ResultCard label="Monthly Penalty Charges" value={`₹${result.charges}`} type="warning" />
              <ResultCard label="Balance Shortfall" value={`₹${result.shortfall}`} type="default" />
            </>
          ) : (
            <div className="bg-green-500/10 p-8 rounded-xl text-center border border-green-500/20">
              <p className="text-2xl font-bold text-green-500">✓ No Charges</p>
              <p className="text-sm text-muted-foreground mt-2">Minimum balance maintained</p>
            </div>
          )}
        </div>
      )}
    />
  )
}

export function ATMWithdrawalCalculator() {
  const [withdrawals, setWithdrawals] = useState(8)
  const [bankType, setBankType] = useState('own')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const freeLimit = bankType === 'own' ? 5 : 3
    const excess = withdrawals > freeLimit ? withdrawals - freeLimit : 0
    const charges = excess * (bankType === 'own' ? 20 : 25)
    setResult({ charges, excess, freeLimit })
  }

  return (
    <FinancialCalculatorTemplate
      title="ATM Withdrawal Charges"
      description="Calculate charges for excess ATM withdrawals."
      icon={CreditCard}
      calculate={calculate}
      values={[withdrawals, bankType]}
      seoContent={<SimpleInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Number of Withdrawals"
            value={withdrawals}
            onChange={setWithdrawals}
            min={1}
            max={30}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">ATM Type</label>
            <select 
              value={bankType} 
              onChange={(e) => setBankType(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="own">Own Bank ATM</option>
              <option value="other">Other Bank ATM</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Free Limit" value={`${result.freeLimit}`} type="success" />
          <ResultCard label="Excess" value={`${result.excess}`} type="warning" />
          <ResultCard label="Charges" value={`₹${result.charges}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function LoanAgainstFD() {
  const [fdAmount, setFdAmount] = useState(500000)
  const [fdRate, setFdRate] = useState(6.5)
  const [loanRate, setLoanRate] = useState(8)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const maxLoan = fdAmount * 0.90
    const interest = (maxLoan * loanRate) / 100
    const fdInterest = (fdAmount * fdRate) / 100
    const netCost = interest - fdInterest
    setResult({ maxLoan: Math.round(maxLoan), interest: Math.round(interest), fdInterest: Math.round(fdInterest), netCost: Math.round(netCost) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Loan Against FD"
      description="Calculate eligible loan amount and net cost for Loan Against FD."
      icon={Percent}
      calculate={calculate}
      values={[fdAmount, fdRate, loanRate]}
      seoContent={<FDSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="FD Amount"
            value={fdAmount}
            onChange={setFdAmount}
            min={50000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="FD Interest Rate"
            value={fdRate}
            onChange={setFdRate}
            min={5}
            max={9}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Loan Interest Rate"
            value={loanRate}
            onChange={setLoanRate}
            min={6}
            max={12}
            step={0.1}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard label="Max Loan (90% of FD)" value={`₹${result.maxLoan.toLocaleString('en-IN')}`} type="highlight" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Loan Interest" value={`₹${result.interest.toLocaleString('en-IN')}`} type="warning" />
            <ResultCard label="FD Interest" value={`₹${result.fdInterest.toLocaleString('en-IN')}`} type="success" />
            <ResultCard label="Net Cost" value={`₹${result.netCost.toLocaleString('en-IN')}`} type="default" />
          </div>
        </div>
      )}
    />
  )
}

export function MoneyMarketCalculator() {
  const [principal, setPrincipal] = useState(1000000)
  const [rate, setRate] = useState(7.5)
  const [days, setDays] = useState(90)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const interest = (principal * rate * days) / (365 * 100)
    const maturity = principal + interest
    setResult({ interest: Math.round(interest), maturity: Math.round(maturity) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Money Market Calculator"
      description="Calculate returns on short-term money market instruments."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, rate, days]}
      seoContent={<SimpleInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Investment Amount"
            value={principal}
            onChange={setPrincipal}
            min={100000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={5}
            max={12}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure (days)"
            value={days}
            onChange={setDays}
            min={7}
            max={365}
            suffix=" days"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="highlight" />
          <ResultCard label="Maturity Amount" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="success" />
        </div>
      )}
    />
  )
}

export function InterestRateComparison() {
  const [amount, setAmount] = useState(500000)
  const [years, setYears] = useState(3)
  const [rateA, setRateA] = useState(6.2)
  const [rateB, setRateB] = useState(7.1)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const maturityA = amount * Math.pow(1 + rateA / 100, years)
    const maturityB = amount * Math.pow(1 + rateB / 100, years)
    const interestA = maturityA - amount
    const interestB = maturityB - amount
    setResult({
      interestA: Math.round(interestA),
      interestB: Math.round(interestB),
      maturityA: Math.round(maturityA),
      maturityB: Math.round(maturityB),
      diff: Math.round(Math.abs(maturityB - maturityA)),
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Interest Rate Comparison"
      description="Compare returns from two different interest rates."
      icon={ArrowRightLeft}
      calculate={calculate}
      values={[amount, years, rateA, rateB]}
      seoContent={<CompoundInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Investment Amount"
            value={amount}
            onChange={setAmount}
            min={10000}
            max={20000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Tenure (years)"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Bank A Rate"
              value={rateA}
              onChange={setRateA}
              min={3}
              max={12}
              step={0.1}
              suffix="%"
            />
            <InputGroup
              label="Bank B Rate"
              value={rateB}
              onChange={setRateB}
              min={3}
              max={12}
              step={0.1}
              suffix="%"
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard 
              label="Bank A Maturity" 
              value={`₹${result.maturityA.toLocaleString('en-IN')}`} 
              subtext={`Interest: ₹${result.interestA.toLocaleString('en-IN')}`}
              type="default" 
            />
            <ResultCard 
              label="Bank B Maturity" 
              value={`₹${result.maturityB.toLocaleString('en-IN')}`} 
              subtext={`Interest: ₹${result.interestB.toLocaleString('en-IN')}`}
              type="default" 
            />
          </div>
          <ResultCard 
            label="Difference in Maturity" 
            value={`₹${result.diff.toLocaleString('en-IN')}`} 
            type="highlight" 
          />
        </div>
      )}
    />
  )
}

export function DepositGrowth() {
  const [initial, setInitial] = useState(50000)
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const monthlyRate = rate / 12 / 100
    const months = years * 12
    const initialFuture = initial * Math.pow(1 + monthlyRate, months)
    const contributionFuture = monthlyRate === 0
      ? monthly * months
      : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    const maturity = initialFuture + contributionFuture
    const invested = initial + monthly * months
    setResult({ maturity: Math.round(maturity), invested, gain: Math.round(maturity - invested) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Deposit Growth Calculator"
      description="Calculate growth of initial deposit plus monthly contributions."
      icon={PiggyBank}
      calculate={calculate}
      values={[initial, monthly, rate, years]}
      seoContent={<RDSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Initial Deposit"
            value={initial}
            onChange={setInitial}
            min={0}
            max={1000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Monthly Contribution"
            value={monthly}
            onChange={setMonthly}
            min={0}
            max={200000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Annual Interest Rate"
            value={rate}
            onChange={setRate}
            min={3}
            max={14}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Years"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Invested" value={`₹${result.invested.toLocaleString('en-IN')}`} type="default" />
          <ResultCard label="Maturity Value" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Total Gain" value={`₹${result.gain.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function RDPlanner() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000)
  const [months, setMonths] = useState(24)
  const [rate, setRate] = useState(7.2)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const monthlyRate = rate / 12 / 100
    const interest = monthlyDeposit * (months * (months + 1) / 2) * monthlyRate
    const maturity = monthlyDeposit * months + interest
    setResult({ maturity: Math.round(maturity), interest: Math.round(interest), invested: monthlyDeposit * months })
  }

  return (
    <FinancialCalculatorTemplate
      title="RD Installment Planner"
      description="Plan your Recurring Deposit installments to reach your goal."
      icon={Calendar}
      calculate={calculate}
      values={[monthlyDeposit, months, rate]}
      seoContent={<RDSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Monthly Deposit"
            value={monthlyDeposit}
            onChange={setMonthlyDeposit}
            min={500}
            max={100000}
            step={500}
            prefix="₹"
          />
          <InputGroup
            label="Tenure (months)"
            value={months}
            onChange={setMonths}
            min={6}
            max={120}
            step={1}
            suffix=" months"
          />
          <InputGroup
            label="Annual Interest Rate"
            value={rate}
            onChange={setRate}
            min={4}
            max={12}
            step={0.1}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Deposits" value={`₹${result.invested.toLocaleString('en-IN')}`} type="default" />
          <ResultCard label="Maturity Amount" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Total Interest" value={`₹${result.interest.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}
