"use client"

import { useMemo, useState } from "react"
import { CreditCard, Percent, Plane, ShieldAlert, TrendingDown } from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0)

const fmtINR = (n: number, digits = 0) => {
  if (!Number.isFinite(n)) return "-"
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: digits })}`
}

const emi = (principal: number, annualRatePct: number, months: number) => {
  const p = clamp0(principal)
  const n = Math.max(0, Math.round(clamp0(months)))
  const r = clamp0(annualRatePct) / 100 / 12
  if (n === 0) return 0
  if (r === 0) return p / n
  const pow = Math.pow(1 + r, n)
  return (p * r * pow) / (pow - 1)
}

const pvOfEMIs = (emiAmount: number, monthlyRate: number, months: number) => {
  const n = Math.max(0, Math.round(clamp0(months)))
  const r = clamp0(monthlyRate)
  if (n === 0) return 0
  if (r === 0) return emiAmount * n
  return emiAmount * ((1 - Math.pow(1 + r, -n)) / r)
}

const solveMonthlyRate = (targetPV: number, emiAmount: number, months: number) => {
  const pvTarget = clamp0(targetPV)
  const payment = clamp0(emiAmount)
  const n = Math.max(1, Math.round(clamp0(months)))

  if (Math.abs(pvTarget - payment * n) < 1e-6) return 0

  let lo = 0
  let hi = 0.1
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    const pv = pvOfEMIs(payment, mid, n)
    if (pv > pvTarget) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export function CreditCardInterestCalculator() {
  const [balance, setBalance] = useState(50_000)
  const [apr, setApr] = useState(42)

  const result = useMemo(() => {
    const monthlyRate = clamp0(apr) / 100 / 12
    const interest = clamp0(balance) * monthlyRate
    return { monthlyRatePct: monthlyRate * 100, interest }
  }, [balance, apr])

  return (
    <FinancialCalculatorTemplate
      title="Credit Card Interest"
      description="Estimate one-month interest on outstanding balance (approx)."
      icon={Percent}
      calculate={() => {}}
      values={[balance, apr]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Balance" value={balance} onChange={setBalance} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="APR (Annual)" value={apr} onChange={setApr} min={0} max={100} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Monthly Rate" value={`${result.monthlyRatePct.toFixed(2)}%`} />
          <ResultCard label="Estimated Interest (1 month)" value={fmtINR(result.interest, 2)} type="highlight" />
        </div>
      }
    />
  )
}

export function MinimumPaymentWarning() {
  const [outstanding, setOutstanding] = useState(60_000)
  const [monthlyRatePct, setMonthlyRatePct] = useState(3.5)
  const [minDuePct, setMinDuePct] = useState(5)
  const [minRupees, setMinRupees] = useState(200)

  const result = useMemo(() => {
    let balance = clamp0(outstanding)
    let months = 0
    let totalInterest = 0

    while (balance > 1 && months < 240) {
      const interest = balance * (clamp0(monthlyRatePct) / 100)
      let payment = Math.max(balance * (clamp0(minDuePct) / 100), clamp0(minRupees))
      if (payment <= interest + 1) payment = interest + 1
      if (payment > balance + interest) payment = balance + interest
      balance = balance + interest - payment
      totalInterest += interest
      months++
    }

    const years = months / 12
    return { months, years, totalInterest }
  }, [outstanding, monthlyRatePct, minDuePct, minRupees])

  return (
    <FinancialCalculatorTemplate
      title="Minimum Payment Warning"
      description="See how long it can take if you pay only minimum due (simulation)."
      icon={ShieldAlert}
      calculate={() => {}}
      values={[outstanding, monthlyRatePct, minDuePct, minRupees]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Balance" value={outstanding} onChange={setOutstanding} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Monthly Interest Rate" value={monthlyRatePct} onChange={setMonthlyRatePct} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Minimum Due %" value={minDuePct} onChange={setMinDuePct} min={0} max={50} step={0.5} suffix="%" />
          <InputGroup label="Minimum Due (₹)" value={minRupees} onChange={setMinRupees} min={0} max={1e7} step={10} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Time to Clear" value={result.months >= 240 ? "20+ years" : `${result.years.toFixed(1)} years`} type="warning" />
          <ResultCard label="Months" value={result.months >= 240 ? "240+" : `${result.months}`} />
          <ResultCard label="Total Interest (approx)" value={fmtINR(result.totalInterest)} type="highlight" />
        </div>
      }
    />
  )
}

export function CreditUtilizationCalculator() {
  const [totalLimit, setTotalLimit] = useState(2_00_000)
  const [used, setUsed] = useState(50_000)

  const result = useMemo(() => {
    const limit = clamp0(totalLimit)
    const utilization = limit === 0 ? 0 : (clamp0(used) / limit) * 100
    return { utilization }
  }, [totalLimit, used])

  return (
    <FinancialCalculatorTemplate
      title="Credit Utilization Ratio"
      description="Calculate your utilization percentage (used / total limit)."
      icon={Percent}
      calculate={() => {}}
      values={[totalLimit, used]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Credit Limit" value={totalLimit} onChange={setTotalLimit} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Amount Used" value={used} onChange={setUsed} min={0} max={1e12} step={100} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Utilization" value={`${result.utilization.toFixed(2)}%`} type="highlight" />}
    />
  )
}

export function RewardPointsCalculator() {
  const [points, setPoints] = useState(10_000)
  const [valuePerPoint, setValuePerPoint] = useState(0.25)

  const result = useMemo(() => {
    const value = clamp0(points) * clamp0(valuePerPoint)
    return { value }
  }, [points, valuePerPoint])

  return (
    <FinancialCalculatorTemplate
      title="Reward Points Value"
      description="Convert reward points into an estimated cash value."
      icon={CreditCard}
      calculate={() => {}}
      values={[points, valuePerPoint]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Points" value={points} onChange={setPoints} min={0} max={1e12} step={100} />
          <InputGroup label="Value per Point" value={valuePerPoint} onChange={setValuePerPoint} min={0} max={100} step={0.01} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Value" value={fmtINR(result.value, 2)} type="highlight" />}
    />
  )
}

export function ForeignTransactionFeeCalculator() {
  const [amount, setAmount] = useState(20_000)
  const [feePct, setFeePct] = useState(3.5)

  const fee = useMemo(() => (clamp0(amount) * clamp0(feePct)) / 100, [amount, feePct])

  return (
    <FinancialCalculatorTemplate
      title="Forex Transaction Fee"
      description="Estimate foreign transaction fee on international spends."
      icon={Plane}
      calculate={() => {}}
      values={[amount, feePct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Foreign Spend Amount" value={amount} onChange={setAmount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Forex Fee" value={feePct} onChange={setFeePct} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Fee" value={fmtINR(fee, 2)} type="highlight" />}
    />
  )
}

export function CashAdvanceFeeCalculator() {
  const [withdrawal, setWithdrawal] = useState(5_000)
  const [feePct, setFeePct] = useState(2.5)
  const [minFee, setMinFee] = useState(300)

  const result = useMemo(() => {
    const fee = Math.max((clamp0(withdrawal) * clamp0(feePct)) / 100, clamp0(minFee))
    return { fee, total: clamp0(withdrawal) + fee }
  }, [withdrawal, feePct, minFee])

  return (
    <FinancialCalculatorTemplate
      title="Cash Advance Fee"
      description="Estimate cash withdrawal fee charged by card issuer."
      icon={CreditCard}
      calculate={() => {}}
      values={[withdrawal, feePct, minFee]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Cash Withdrawal" value={withdrawal} onChange={setWithdrawal} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Fee %" value={feePct} onChange={setFeePct} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Minimum Fee" value={minFee} onChange={setMinFee} min={0} max={1e8} step={10} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Fee" value={fmtINR(result.fee, 2)} type="warning" />
          <ResultCard label="Total Debited" value={fmtINR(result.total, 2)} type="highlight" />
        </div>
      }
    />
  )
}

export function CardVsLoanCalculator() {
  const [amount, setAmount] = useState(1_00_000)
  const [months, setMonths] = useState(12)
  const [cardApr, setCardApr] = useState(42)
  const [loanApr, setLoanApr] = useState(14)

  const result = useMemo(() => {
    const cardEmi = emi(amount, cardApr, months)
    const loanEmi = emi(amount, loanApr, months)

    const cardTotal = cardEmi * clamp0(months)
    const loanTotal = loanEmi * clamp0(months)

    return {
      cardEmi,
      loanEmi,
      cardInterest: Math.max(0, cardTotal - clamp0(amount)),
      loanInterest: Math.max(0, loanTotal - clamp0(amount)),
      savings: Math.max(0, cardTotal - loanTotal)
    }
  }, [amount, months, cardApr, loanApr])

  return (
    <FinancialCalculatorTemplate
      title="Card vs Personal Loan"
      description="Compare repayment cost if you convert spend to a loan vs carry card balance."
      icon={TrendingDown}
      calculate={() => {}}
      values={[amount, months, cardApr, loanApr]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Amount" value={amount} onChange={setAmount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Months" value={months} onChange={setMonths} min={1} max={240} step={1} suffix=" months" />
          <InputGroup label="Card APR" value={cardApr} onChange={setCardApr} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Loan APR" value={loanApr} onChange={setLoanApr} min={0} max={60} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Card EMI" value={fmtINR(result.cardEmi)} type="warning" />
          <ResultCard label="Loan EMI" value={fmtINR(result.loanEmi)} type="highlight" />
          <ResultCard label="Card Interest" value={fmtINR(result.cardInterest)} type="warning" />
          <ResultCard label="Estimated Savings" value={fmtINR(result.savings)} type="success" />
        </div>
      }
    />
  )
}

export function AnnualFeeBreakeven() {
  const [annualFee, setAnnualFee] = useState(1_000)
  const [rewardRatePct, setRewardRatePct] = useState(1)

  const result = useMemo(() => {
    const rate = clamp0(rewardRatePct) / 100
    const spend = rate === 0 ? 0 : clamp0(annualFee) / rate
    return { spend }
  }, [annualFee, rewardRatePct])

  return (
    <FinancialCalculatorTemplate
      title="Annual Fee Breakeven"
      description="Compute yearly spend needed so rewards equal the annual fee."
      icon={Percent}
      calculate={() => {}}
      values={[annualFee, rewardRatePct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Fee" value={annualFee} onChange={setAnnualFee} min={0} max={1e9} step={50} prefix="₹" />
          <InputGroup label="Reward/Cashback Rate" value={rewardRatePct} onChange={setRewardRatePct} min={0} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Spend Needed (per year)" value={fmtINR(result.spend)} type="highlight" />}
    />
  )
}

export function DebtSnowballCalculator() {
  const [debt1, setDebt1] = useState(30_000)
  const [apr1, setApr1] = useState(36)
  const [debt2, setDebt2] = useState(70_000)
  const [apr2, setApr2] = useState(42)
  const [monthlyPayment, setMonthlyPayment] = useState(8_000)

  const result = useMemo(() => {
    // Snowball: pay off smaller balance first (debt1).
    let b1 = clamp0(debt1)
    let b2 = clamp0(debt2)
    const r1 = clamp0(apr1) / 100 / 12
    const r2 = clamp0(apr2) / 100 / 12
    let months = 0
    let interest = 0

    while (b1 + b2 > 1 && months < 600) {
      const i1 = b1 * r1
      const i2 = b2 * r2
      interest += i1 + i2
      b1 += i1
      b2 += i2

      let pay = clamp0(monthlyPayment)
      if (b1 > 0) {
        const p1 = Math.min(pay, b1)
        b1 -= p1
        pay -= p1
      }
      if (pay > 0 && b2 > 0) {
        const p2 = Math.min(pay, b2)
        b2 -= p2
      }

      months++
    }

    return { months, interest }
  }, [debt1, apr1, debt2, apr2, monthlyPayment])

  return (
    <FinancialCalculatorTemplate
      title="Debt Snowball"
      description="2-debt payoff simulation: pay smallest balance first."
      icon={TrendingDown}
      calculate={() => {}}
      values={[debt1, apr1, debt2, apr2, monthlyPayment]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Debt 1 (smaller)" value={debt1} onChange={setDebt1} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="APR 1" value={apr1} onChange={setApr1} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Debt 2" value={debt2} onChange={setDebt2} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="APR 2" value={apr2} onChange={setApr2} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} min={0} max={1e9} step={100} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Months to Clear" value={result.months >= 600 ? "600+" : `${result.months}`} type="highlight" />
          <ResultCard label="Total Interest" value={fmtINR(result.interest)} type="warning" />
        </div>
      }
    />
  )
}

export function DebtAvalancheCalculator() {
  const [debt1, setDebt1] = useState(30_000)
  const [apr1, setApr1] = useState(36)
  const [debt2, setDebt2] = useState(70_000)
  const [apr2, setApr2] = useState(42)
  const [monthlyPayment, setMonthlyPayment] = useState(8_000)

  const result = useMemo(() => {
    // Avalanche: pay highest APR first.
    let b1 = clamp0(debt1)
    let b2 = clamp0(debt2)
    const r1 = clamp0(apr1) / 100 / 12
    const r2 = clamp0(apr2) / 100 / 12
    let months = 0
    let interest = 0

    while (b1 + b2 > 1 && months < 600) {
      const i1 = b1 * r1
      const i2 = b2 * r2
      interest += i1 + i2
      b1 += i1
      b2 += i2

      let pay = clamp0(monthlyPayment)
      const payFirstDebt2 = r2 >= r1
      if (payFirstDebt2) {
        if (b2 > 0) {
          const p2 = Math.min(pay, b2)
          b2 -= p2
          pay -= p2
        }
        if (pay > 0 && b1 > 0) {
          const p1 = Math.min(pay, b1)
          b1 -= p1
        }
      } else {
        if (b1 > 0) {
          const p1 = Math.min(pay, b1)
          b1 -= p1
          pay -= p1
        }
        if (pay > 0 && b2 > 0) {
          const p2 = Math.min(pay, b2)
          b2 -= p2
        }
      }

      months++
    }

    return { months, interest }
  }, [debt1, apr1, debt2, apr2, monthlyPayment])

  return (
    <FinancialCalculatorTemplate
      title="Debt Avalanche"
      description="2-debt payoff simulation: pay highest APR first."
      icon={TrendingDown}
      calculate={() => {}}
      values={[debt1, apr1, debt2, apr2, monthlyPayment]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Debt 1" value={debt1} onChange={setDebt1} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="APR 1" value={apr1} onChange={setApr1} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Debt 2" value={debt2} onChange={setDebt2} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="APR 2" value={apr2} onChange={setApr2} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} min={0} max={1e9} step={100} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Months to Clear" value={result.months >= 600 ? "600+" : `${result.months}`} type="highlight" />
          <ResultCard label="Total Interest" value={fmtINR(result.interest)} type="warning" />
        </div>
      }
    />
  )
}

export function LatePaymentFeeCalculator() {
  const [dueAmount, setDueAmount] = useState(10_000)
  const [fixedFee, setFixedFee] = useState(500)
  const [penaltyApr, setPenaltyApr] = useState(42)
  const [daysLate, setDaysLate] = useState(15)

  const result = useMemo(() => {
    const interest = clamp0(dueAmount) * (clamp0(penaltyApr) / 100) * (clamp0(daysLate) / 365)
    const total = clamp0(fixedFee) + interest
    return { interest, total }
  }, [dueAmount, fixedFee, penaltyApr, daysLate])

  return (
    <FinancialCalculatorTemplate
      title="Late Payment Fee Estimator"
      description="Estimate late fee + penalty interest for delayed payment."
      icon={ShieldAlert}
      calculate={() => {}}
      values={[dueAmount, fixedFee, penaltyApr, daysLate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Due Amount" value={dueAmount} onChange={setDueAmount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Late Fee (fixed)" value={fixedFee} onChange={setFixedFee} min={0} max={1e9} step={50} prefix="₹" />
          <InputGroup label="Penalty APR" value={penaltyApr} onChange={setPenaltyApr} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Days Late" value={daysLate} onChange={setDaysLate} min={0} max={365} step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Penalty Interest" value={fmtINR(result.interest, 2)} />
          <ResultCard label="Total Charges" value={fmtINR(result.total, 2)} type="highlight" />
        </div>
      }
    />
  )
}

export function OverLimitFeeCalculator() {
  const [overLimitAmount, setOverLimitAmount] = useState(5_000)
  const [fee, setFee] = useState(500)

  const total = useMemo(() => clamp0(overLimitAmount) + clamp0(fee), [overLimitAmount, fee])

  return (
    <FinancialCalculatorTemplate
      title="Over Limit Fee"
      description="Estimate the immediate cost when you exceed your card limit."
      icon={ShieldAlert}
      calculate={() => {}}
      values={[overLimitAmount, fee]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Over-limit Amount" value={overLimitAmount} onChange={setOverLimitAmount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Over-limit Fee" value={fee} onChange={setFee} min={0} max={1e9} step={50} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Total Impact" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function CreditCardEligibility() {
  const [age, setAge] = useState(28)
  const [monthlyIncome, setMonthlyIncome] = useState(50_000)
  const [creditScore, setCreditScore] = useState(750)

  const result = useMemo(() => {
    const scoreFactor = creditScore >= 780 ? 1.2 : creditScore >= 720 ? 1 : creditScore >= 680 ? 0.8 : 0.6
    const ageOk = age >= 18 && age <= 65
    const baseLimit = clamp0(monthlyIncome) * 3
    const estimatedLimit = ageOk ? baseLimit * scoreFactor : 0
    const eligible = ageOk && monthlyIncome >= 15_000 && creditScore >= 650
    return { eligible, estimatedLimit }
  }, [age, monthlyIncome, creditScore])

  return (
    <FinancialCalculatorTemplate
      title="Credit Card Eligibility"
      description="Quick eligibility and indicative limit estimate (illustrative)."
      icon={CreditCard}
      calculate={() => {}}
      values={[age, monthlyIncome, creditScore]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Age" value={age} onChange={setAge} min={0} max={100} step={1} />
          <InputGroup label="Monthly Income" value={monthlyIncome} onChange={setMonthlyIncome} min={0} max={1e9} step={500} prefix="₹" />
          <InputGroup label="Credit Score" value={creditScore} onChange={setCreditScore} min={300} max={900} step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Eligibility" value={result.eligible ? "Likely Eligible" : "May Not Qualify"} type={result.eligible ? "success" : "warning"} />
          <ResultCard label="Indicative Limit" value={fmtINR(result.estimatedLimit)} type="highlight" />
        </div>
      }
    />
  )
}

export function FuelSurchargeWaiver() {
  const [monthlyFuelSpend, setMonthlyFuelSpend] = useState(8_000)
  const [surchargePct, setSurchargePct] = useState(1)
  const [waiverPct, setWaiverPct] = useState(100)
  const [waiverCapMonthly, setWaiverCapMonthly] = useState(200)

  const result = useMemo(() => {
    const surcharge = (clamp0(monthlyFuelSpend) * clamp0(surchargePct)) / 100
    const waived = Math.min(surcharge * (clamp0(waiverPct) / 100), clamp0(waiverCapMonthly))
    const net = Math.max(0, surcharge - waived)
    return { surcharge, waived, net }
  }, [monthlyFuelSpend, surchargePct, waiverPct, waiverCapMonthly])

  return (
    <FinancialCalculatorTemplate
      title="Fuel Surcharge Waiver"
      description="Estimate fuel surcharge charged and waiver benefit."
      icon={CreditCard}
      calculate={() => {}}
      values={[monthlyFuelSpend, surchargePct, waiverPct, waiverCapMonthly]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Fuel Spend" value={monthlyFuelSpend} onChange={setMonthlyFuelSpend} min={0} max={1e10} step={100} prefix="₹" />
          <InputGroup label="Surcharge" value={surchargePct} onChange={setSurchargePct} min={0} max={10} step={0.1} suffix="%" />
          <InputGroup label="Waiver %" value={waiverPct} onChange={setWaiverPct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Waiver Cap (monthly)" value={waiverCapMonthly} onChange={setWaiverCapMonthly} min={0} max={1e7} step={10} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Surcharge" value={fmtINR(result.surcharge, 2)} />
          <ResultCard label="Waived" value={fmtINR(result.waived, 2)} type="success" />
          <ResultCard label="Net Cost" value={fmtINR(result.net, 2)} type="highlight" />
        </div>
      }
    />
  )
}

export function AirportLoungeValue() {
  const [visitsPerYear, setVisitsPerYear] = useState(8)
  const [valuePerVisit, setValuePerVisit] = useState(1200)
  const [annualFee, setAnnualFee] = useState(1000)

  const result = useMemo(() => {
    const value = clamp0(visitsPerYear) * clamp0(valuePerVisit)
    const net = value - clamp0(annualFee)
    return { value, net }
  }, [visitsPerYear, valuePerVisit, annualFee])

  return (
    <FinancialCalculatorTemplate
      title="Airport Lounge Value"
      description="Estimate lounge access benefit value vs annual fee."
      icon={Plane}
      calculate={() => {}}
      values={[visitsPerYear, valuePerVisit, annualFee]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Visits per Year" value={visitsPerYear} onChange={setVisitsPerYear} min={0} max={365} step={1} />
          <InputGroup label="Value per Visit" value={valuePerVisit} onChange={setValuePerVisit} min={0} max={1e7} step={50} prefix="₹" />
          <InputGroup label="Annual Fee" value={annualFee} onChange={setAnnualFee} min={0} max={1e7} step={50} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Total Value" value={fmtINR(result.value)} />
          <ResultCard label="Net Benefit" value={fmtINR(result.net)} type={result.net >= 0 ? "success" : "warning"} />
        </div>
      }
    />
  )
}

export function AnnualCashbackCalculator() {
  const [monthlySpend, setMonthlySpend] = useState(30_000)
  const [cashbackPct, setCashbackPct] = useState(1)
  const [annualCap, setAnnualCap] = useState(10_000)

  const result = useMemo(() => {
    const gross = (clamp0(monthlySpend) * 12 * clamp0(cashbackPct)) / 100
    const cashback = Math.min(gross, clamp0(annualCap))
    return { cashback }
  }, [monthlySpend, cashbackPct, annualCap])

  return (
    <FinancialCalculatorTemplate
      title="Annual Cashback Calculator"
      description="Estimate annual cashback based on spend, rate, and cap."
      icon={CreditCard}
      calculate={() => {}}
      values={[monthlySpend, cashbackPct, annualCap]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Spend" value={monthlySpend} onChange={setMonthlySpend} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Cashback Rate" value={cashbackPct} onChange={setCashbackPct} min={0} max={50} step={0.1} suffix="%" />
          <InputGroup label="Annual Cashback Cap" value={annualCap} onChange={setAnnualCap} min={0} max={1e12} step={100} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cashback (annual)" value={fmtINR(result.cashback)} type="highlight" />}
    />
  )
}

export function MilesToCashConverter() {
  const [miles, setMiles] = useState(10_000)
  const [valuePerMile, setValuePerMile] = useState(0.5)

  const value = useMemo(() => clamp0(miles) * clamp0(valuePerMile), [miles, valuePerMile])

  return (
    <FinancialCalculatorTemplate
      title="Miles/Points Value"
      description="Convert miles/points to an estimated cash value."
      icon={Plane}
      calculate={() => {}}
      values={[miles, valuePerMile]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Miles/Points" value={miles} onChange={setMiles} min={0} max={1e12} step={100} />
          <InputGroup label="Value per Mile" value={valuePerMile} onChange={setValuePerMile} min={0} max={100} step={0.01} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Value" value={fmtINR(value, 2)} type="highlight" />}
    />
  )
}

export function CreditCardAgainstFD() {
  const [fdAmount, setFdAmount] = useState(1_00_000)
  const [limitPct, setLimitPct] = useState(80)
  const [fdRate, setFdRate] = useState(7)
  const [annualFee, setAnnualFee] = useState(500)

  const result = useMemo(() => {
    const limit = (clamp0(fdAmount) * clamp0(limitPct)) / 100
    const fdInterest = (clamp0(fdAmount) * clamp0(fdRate)) / 100
    const net = fdInterest - clamp0(annualFee)
    return { limit, fdInterest, net }
  }, [fdAmount, limitPct, fdRate, annualFee])

  return (
    <FinancialCalculatorTemplate
      title="Credit Card Against FD"
      description="Estimate credit limit and net FD interest after annual fee (illustrative)."
      icon={CreditCard}
      calculate={() => {}}
      values={[fdAmount, limitPct, fdRate, annualFee]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="FD Amount" value={fdAmount} onChange={setFdAmount} min={0} max={1e13} step={1000} prefix="₹" />
          <InputGroup label="Card Limit % of FD" value={limitPct} onChange={setLimitPct} min={0} max={100} step={0.5} suffix="%" />
          <InputGroup label="FD Interest Rate" value={fdRate} onChange={setFdRate} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Annual Fee" value={annualFee} onChange={setAnnualFee} min={0} max={1e7} step={50} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Indicative Limit" value={fmtINR(result.limit)} type="highlight" />
          <ResultCard label="FD Interest (annual)" value={fmtINR(result.fdInterest)} />
          <ResultCard label="Net (Interest − Fee)" value={fmtINR(result.net)} type={result.net >= 0 ? "success" : "warning"} />
        </div>
      }
    />
  )
}

export function ForeignCurrencyMarkup() {
  const [amount, setAmount] = useState(20_000)
  const [markupPct, setMarkupPct] = useState(1)

  const fee = useMemo(() => (clamp0(amount) * clamp0(markupPct)) / 100, [amount, markupPct])

  return (
    <FinancialCalculatorTemplate
      title="Foreign Currency Markup"
      description="Estimate markup charged by card issuer on foreign currency spends."
      icon={Plane}
      calculate={() => {}}
      values={[amount, markupPct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Foreign Spend Amount" value={amount} onChange={setAmount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Markup" value={markupPct} onChange={setMarkupPct} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Markup Amount" value={fmtINR(fee, 2)} type="highlight" />}
    />
  )
}

export function BillingCycleCalculator() {
  const [statementDay, setStatementDay] = useState(15)
  const [graceDays, setGraceDays] = useState(20)

  const result = useMemo(() => {
    const s = Math.min(28, Math.max(1, Math.round(statementDay)))
    const g = Math.max(0, Math.round(graceDays))
    const dueDay = Math.min(28, Math.max(1, s + g))
    return { statementDay: s, dueDay }
  }, [statementDay, graceDays])

  return (
    <FinancialCalculatorTemplate
      title="Billing Cycle & Due Date"
      description="Approximate due date day-of-month from statement day and grace period."
      icon={CreditCard}
      calculate={() => {}}
      values={[statementDay, graceDays]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Statement Day (1-28)" value={statementDay} onChange={setStatementDay} min={1} max={28} step={1} />
          <InputGroup label="Grace Period" value={graceDays} onChange={setGraceDays} min={0} max={45} step={1} suffix=" days" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Statement Day" value={`${result.statementDay}`} />
          <ResultCard label="Approx Due Day" value={`${result.dueDay}`} type="highlight" />
        </div>
      }
    />
  )
}

export function CreditLimitIncreaseCalculator() {
  const [currentLimit, setCurrentLimit] = useState(1_00_000)
  const [utilizationPct, setUtilizationPct] = useState(30)
  const [onTimeMonths, setOnTimeMonths] = useState(12)

  const result = useMemo(() => {
    const factor = onTimeMonths >= 12 ? 1.25 : onTimeMonths >= 6 ? 1.15 : 1.05
    const utilPenalty = utilizationPct > 70 ? 0.85 : utilizationPct > 50 ? 0.95 : 1
    const suggested = clamp0(currentLimit) * factor * utilPenalty
    return { suggested }
  }, [currentLimit, utilizationPct, onTimeMonths])

  return (
    <FinancialCalculatorTemplate
      title="Credit Limit Increase Estimator"
      description="Simple indicative limit increase based on usage and payment history."
      icon={TrendingDown}
      calculate={() => {}}
      values={[currentLimit, utilizationPct, onTimeMonths]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Current Limit" value={currentLimit} onChange={setCurrentLimit} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Utilization" value={utilizationPct} onChange={setUtilizationPct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="On-time Payment Months" value={onTimeMonths} onChange={setOnTimeMonths} min={0} max={120} step={1} />
        </div>
      }
      result={<ResultCard label="Suggested Limit" value={fmtINR(result.suggested)} type="highlight" />}
    />
  )
}

export function CardUpgradeCalculator() {
  const [annualSpend, setAnnualSpend] = useState(6_00_000)
  const [currentRewardPct, setCurrentRewardPct] = useState(1)
  const [newRewardPct, setNewRewardPct] = useState(2)
  const [currentFee, setCurrentFee] = useState(500)
  const [newFee, setNewFee] = useState(1500)

  const result = useMemo(() => {
    const currentRewards = (clamp0(annualSpend) * clamp0(currentRewardPct)) / 100
    const newRewards = (clamp0(annualSpend) * clamp0(newRewardPct)) / 100
    const netGain = (newRewards - clamp0(newFee)) - (currentRewards - clamp0(currentFee))
    return { currentRewards, newRewards, netGain }
  }, [annualSpend, currentRewardPct, newRewardPct, currentFee, newFee])

  return (
    <FinancialCalculatorTemplate
      title="Card Upgrade Evaluator"
      description="Compare net benefit of upgrading based on spend and reward rate."
      icon={CreditCard}
      calculate={() => {}}
      values={[annualSpend, currentRewardPct, newRewardPct, currentFee, newFee]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Spend" value={annualSpend} onChange={setAnnualSpend} min={0} max={1e13} step={1000} prefix="₹" />
          <InputGroup label="Current Reward Rate" value={currentRewardPct} onChange={setCurrentRewardPct} min={0} max={50} step={0.1} suffix="%" />
          <InputGroup label="New Reward Rate" value={newRewardPct} onChange={setNewRewardPct} min={0} max={50} step={0.1} suffix="%" />
          <InputGroup label="Current Annual Fee" value={currentFee} onChange={setCurrentFee} min={0} max={1e7} step={50} prefix="₹" />
          <InputGroup label="New Annual Fee" value={newFee} onChange={setNewFee} min={0} max={1e7} step={50} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Current Rewards" value={fmtINR(result.currentRewards)} />
          <ResultCard label="New Rewards" value={fmtINR(result.newRewards)} />
          <ResultCard label="Net Gain" value={fmtINR(result.netGain)} type={result.netGain >= 0 ? "success" : "warning"} />
        </div>
      }
    />
  )
}

export function CashWithdrawalCostCalculator() {
  const [withdrawal, setWithdrawal] = useState(5_000)
  const [feePct, setFeePct] = useState(2.5)
  const [minFee, setMinFee] = useState(300)
  const [apr, setApr] = useState(42)
  const [days, setDays] = useState(30)

  const result = useMemo(() => {
    const fee = Math.max((clamp0(withdrawal) * clamp0(feePct)) / 100, clamp0(minFee))
    const interest = clamp0(withdrawal) * (clamp0(apr) / 100) * (clamp0(days) / 365)
    return { fee, interest, total: clamp0(withdrawal) + fee + interest }
  }, [withdrawal, feePct, minFee, apr, days])

  return (
    <FinancialCalculatorTemplate
      title="Cash Withdrawal Cost"
      description="Estimate cash withdrawal fee + interest cost until repayment."
      icon={ShieldAlert}
      calculate={() => {}}
      values={[withdrawal, feePct, minFee, apr, days]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Withdrawal" value={withdrawal} onChange={setWithdrawal} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Fee %" value={feePct} onChange={setFeePct} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Minimum Fee" value={minFee} onChange={setMinFee} min={0} max={1e8} step={10} prefix="₹" />
          <InputGroup label="APR" value={apr} onChange={setApr} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Days Until Repayment" value={days} onChange={setDays} min={0} max={365} step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Fee" value={fmtINR(result.fee, 2)} />
          <ResultCard label="Interest" value={fmtINR(result.interest, 2)} type="warning" />
          <ResultCard label="Total Cost" value={fmtINR(result.total, 2)} type="highlight" />
        </div>
      }
    />
  )
}

export function CreditCardInsuranceCalculator() {
  const [outstanding, setOutstanding] = useState(50_000)
  const [premiumRatePctMonthly, setPremiumRatePctMonthly] = useState(0.8)

  const premium = useMemo(() => (clamp0(outstanding) * clamp0(premiumRatePctMonthly)) / 100, [outstanding, premiumRatePctMonthly])

  return (
    <FinancialCalculatorTemplate
      title="Credit Shield Insurance Cost"
      description="Estimate monthly credit shield insurance premium (illustrative)."
      icon={ShieldAlert}
      calculate={() => {}}
      values={[outstanding, premiumRatePctMonthly]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Balance" value={outstanding} onChange={setOutstanding} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Premium Rate (monthly)" value={premiumRatePctMonthly} onChange={setPremiumRatePctMonthly} min={0} max={10} step={0.01} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium, 2)} type="highlight" />}
    />
  )
}

export function AddonCardLimitSetter() {
  const [primaryLimit, setPrimaryLimit] = useState(2_00_000)
  const [addonPct, setAddonPct] = useState(20)

  const addonLimit = useMemo(() => (clamp0(primaryLimit) * clamp0(addonPct)) / 100, [primaryLimit, addonPct])

  return (
    <FinancialCalculatorTemplate
      title="Add-on Card Limit Setter"
      description="Compute suggested add-on card limit as a % of primary limit."
      icon={CreditCard}
      calculate={() => {}}
      values={[primaryLimit, addonPct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Primary Card Limit" value={primaryLimit} onChange={setPrimaryLimit} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Add-on Limit %" value={addonPct} onChange={setAddonPct} min={0} max={100} step={1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Add-on Limit" value={fmtINR(addonLimit)} type="highlight" />}
    />
  )
}

export function MinimumDueTrapWarning() {
  const [outstanding, setOutstanding] = useState(1_00_000)
  const [apr, setApr] = useState(42)
  const [minDuePct, setMinDuePct] = useState(5)

  const result = useMemo(() => {
    const monthlyRate = clamp0(apr) / 100 / 12
    let balance = clamp0(outstanding)
    let months = 0
    let totalInterest = 0

    while (balance > 1 && months < 240) {
      const interest = balance * monthlyRate
      let payment = balance * (clamp0(minDuePct) / 100)
      if (payment <= interest + 1) payment = interest + 1
      if (payment > balance + interest) payment = balance + interest
      balance = balance + interest - payment
      totalInterest += interest
      months++
    }

    return { months, totalInterest }
  }, [outstanding, apr, minDuePct])

  return (
    <FinancialCalculatorTemplate
      title="Minimum Due Trap Warning"
      description="Shows how minimum due can keep you in debt for years."
      icon={ShieldAlert}
      calculate={() => {}}
      values={[outstanding, apr, minDuePct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Balance" value={outstanding} onChange={setOutstanding} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="APR" value={apr} onChange={setApr} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Minimum Due %" value={minDuePct} onChange={setMinDuePct} min={0} max={50} step={0.5} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Time to Clear" value={result.months >= 240 ? "20+ years" : `${(result.months / 12).toFixed(1)} years`} type="warning" />
          <ResultCard label="Total Interest" value={fmtINR(result.totalInterest)} type="highlight" />
        </div>
      }
    />
  )
}

export function NoCostEMIRealCost() {
  const [productPrice, setProductPrice] = useState(50_000)
  const [upfrontDiscount, setUpfrontDiscount] = useState(2_500)
  const [tenureMonths, setTenureMonths] = useState(12)

  const result = useMemo(() => {
    const price = clamp0(productPrice)
    const discount = clamp0(upfrontDiscount)
    const n = Math.max(1, Math.round(clamp0(tenureMonths)))

    const upfront = Math.max(0, price - discount)
    const emiAmount = price / n
    const monthlyRate = solveMonthlyRate(upfront, emiAmount, n)
    const apr = monthlyRate * 12 * 100

    return { upfront, emiAmount, apr, extraPaid: price - upfront }
  }, [productPrice, upfrontDiscount, tenureMonths])

  return (
    <FinancialCalculatorTemplate
      title="No Cost EMI Real Cost"
      description="Implied APR when you lose upfront discount for EMI option."
      icon={TrendingDown}
      calculate={() => {}}
      values={[productPrice, upfrontDiscount, tenureMonths]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Product Price" value={productPrice} onChange={setProductPrice} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Upfront Discount" value={upfrontDiscount} onChange={setUpfrontDiscount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Tenure" value={tenureMonths} onChange={setTenureMonths} min={1} max={60} step={1} suffix=" months" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Upfront Cost" value={fmtINR(result.upfront)} type="highlight" />
          <ResultCard label="EMI (Approx)" value={fmtINR(result.emiAmount, 2)} />
          <ResultCard label="Extra Paid" value={fmtINR(result.extraPaid)} type="warning" />
          <ResultCard label="Implied APR" value={`${result.apr.toFixed(2)}%`} type="highlight" />
        </div>
      }
    />
  )
}

export function AnnualFeeWaiverTracker() {
  const [annualFee, setAnnualFee] = useState(1_000)
  const [waiverSpendThreshold, setWaiverSpendThreshold] = useState(2_00_000)
  const [currentAnnualSpend, setCurrentAnnualSpend] = useState(1_20_000)

  const result = useMemo(() => {
    const remaining = Math.max(0, clamp0(waiverSpendThreshold) - clamp0(currentAnnualSpend))
    const waived = clamp0(currentAnnualSpend) >= clamp0(waiverSpendThreshold)
    return { remaining, waived }
  }, [waiverSpendThreshold, currentAnnualSpend])

  return (
    <FinancialCalculatorTemplate
      title="Annual Fee Waiver Tracker"
      description="Track progress toward annual spend required for fee waiver."
      icon={CreditCard}
      calculate={() => {}}
      values={[annualFee, waiverSpendThreshold, currentAnnualSpend]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Fee" value={annualFee} onChange={setAnnualFee} min={0} max={1e7} step={50} prefix="₹" />
          <InputGroup label="Waiver Spend Threshold" value={waiverSpendThreshold} onChange={setWaiverSpendThreshold} min={0} max={1e13} step={1000} prefix="₹" />
          <InputGroup label="Current Annual Spend" value={currentAnnualSpend} onChange={setCurrentAnnualSpend} min={0} max={1e13} step={1000} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Fee Waived?" value={result.waived ? "Yes" : "No"} type={result.waived ? "success" : "warning"} />
          <ResultCard label="Remaining Spend" value={fmtINR(result.remaining)} type="highlight" />
        </div>
      }
    />
  )
}
