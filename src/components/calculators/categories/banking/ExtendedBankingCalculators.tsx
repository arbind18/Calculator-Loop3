"use client"

import { useMemo, useState } from "react"
import {
  Landmark,
  Wallet,
  Percent,
  Calculator as CalculatorIcon,
  ArrowRightLeft,
  TrendingUp,
  PiggyBank,
  Shield,
  CreditCard
} from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`

const compound = (principal: number, annualRatePct: number, years: number, compoundsPerYear: number) => {
  const r = annualRatePct / 100
  const n = Math.max(1, Math.round(compoundsPerYear))
  return principal * Math.pow(1 + r / n, n * years)
}

const emi = (principal: number, annualRatePct: number, months: number) => {
  const n = Math.max(1, Math.round(months))
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function LockerRentCalculator() {
  const [annualRent, setAnnualRent] = useState(3000)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<{ total: number; monthly: number } | null>(null)

  const calculate = () => {
    const total = annualRent * years
    setResult({ total, monthly: total / (years * 12) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Locker Rent Calculator"
      description="Estimate total locker rent paid over a period."
      icon={Landmark}
      calculate={calculate}
      values={[annualRent, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Locker Rent" value={annualRent} onChange={setAnnualRent} min={0} max={50000} step={100} prefix="₹" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Total Cost" value={inr(result.total)} type="highlight" />
            <ResultCard label="Avg. Monthly Cost" value={inr(result.monthly)} />
          </div>
        )
      }
    />
  )
}

export function DDChargesCalculator() {
  const [amount, setAmount] = useState(50000)
  const [result, setResult] = useState<{ charges: number; effectivePct: number } | null>(null)

  const calculate = () => {
    let charges = 0
    if (amount <= 10000) charges = 30
    else if (amount <= 100000) charges = 50
    else if (amount <= 500000) charges = 100
    else charges = 200

    const effectivePct = amount > 0 ? (charges / amount) * 100 : 0
    setResult({ charges, effectivePct })
  }

  return (
    <FinancialCalculatorTemplate
      title="DD Charges Calculator"
      description="Estimate demand draft charges using a simple slab-based model (varies by bank)."
      icon={CalculatorIcon}
      calculate={calculate}
      values={[amount]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="DD Amount" value={amount} onChange={setAmount} min={0} max={10000000} step={1000} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Estimated Charges" value={inr(result.charges)} type="highlight" />
            <ResultCard label="Effective %" value={`${result.effectivePct.toFixed(3)}%`} />
            <ResultCard label="Note" value="Actual charges depend on bank" />
          </div>
        )
      }
    />
  )
}

export function NEFTRTGSChargesCalculator() {
  const [method, setMethod] = useState<"neft" | "rtgs">("neft")
  const [amount, setAmount] = useState(50000)
  const [result, setResult] = useState<{ charges: number; note: string } | null>(null)

  const calculate = () => {
    if (method === "rtgs" && amount < 200000) {
      setResult({ charges: 0, note: "RTGS typically applies for higher-value transfers; many banks require ₹2L+" })
      return
    }

    let charges = 0
    if (method === "neft") {
      if (amount <= 10000) charges = 2.5
      else if (amount <= 100000) charges = 5
      else if (amount <= 200000) charges = 15
      else charges = 25
    } else {
      if (amount <= 500000) charges = 25
      else charges = 50
    }

    setResult({ charges, note: "Banks may waive charges for online transfers" })
  }

  return (
    <FinancialCalculatorTemplate
      title="NEFT/RTGS Charges Calculator"
      description="Estimate transfer charges using a common slab model (varies by bank)."
      icon={ArrowRightLeft}
      calculate={calculate}
      values={[method, amount]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Transfer Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as "neft" | "rtgs")}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="neft">NEFT</option>
              <option value="rtgs">RTGS</option>
            </select>
          </div>
          <InputGroup label="Transfer Amount" value={amount} onChange={setAmount} min={0} max={50000000} step={1000} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Estimated Charges" value={inr(result.charges)} type="highlight" />
            <ResultCard label="Method" value={method.toUpperCase()} />
            <ResultCard label="Note" value={result.note} />
          </div>
        )
      }
    />
  )
}

export function AMBCalculator() {
  const [week1, setWeek1] = useState(8000)
  const [week2, setWeek2] = useState(12000)
  const [week3, setWeek3] = useState(10000)
  const [week4, setWeek4] = useState(6000)
  const [requiredAmb, setRequiredAmb] = useState(10000)
  const [result, setResult] = useState<{ amb: number; shortfall: number } | null>(null)

  const calculate = () => {
    const amb = (week1 + week2 + week3 + week4) / 4
    const shortfall = Math.max(0, requiredAmb - amb)
    setResult({ amb, shortfall })
  }

  return (
    <FinancialCalculatorTemplate
      title="AMB Calculator"
      description="Estimate Average Monthly Balance using 4 weekly average balances."
      icon={Wallet}
      calculate={calculate}
      values={[week1, week2, week3, week4, requiredAmb]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Week 1 Avg Balance" value={week1} onChange={setWeek1} min={0} max={500000} step={500} prefix="₹" />
          <InputGroup label="Week 2 Avg Balance" value={week2} onChange={setWeek2} min={0} max={500000} step={500} prefix="₹" />
          <InputGroup label="Week 3 Avg Balance" value={week3} onChange={setWeek3} min={0} max={500000} step={500} prefix="₹" />
          <InputGroup label="Week 4 Avg Balance" value={week4} onChange={setWeek4} min={0} max={500000} step={500} prefix="₹" />
          <InputGroup label="Required AMB" value={requiredAmb} onChange={setRequiredAmb} min={0} max={500000} step={500} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Estimated AMB" value={inr(result.amb)} type="highlight" />
            <ResultCard label="Shortfall" value={inr(result.shortfall)} type={result.shortfall > 0 ? "warning" : "success"} />
          </div>
        )
      }
    />
  )
}

export function CashDepositChargesCalculator() {
  const [amount, setAmount] = useState(100000)
  const [freeLimit, setFreeLimit] = useState(50000)
  const [chargePct, setChargePct] = useState(0.5)
  const [minCharge, setMinCharge] = useState(50)
  const [result, setResult] = useState<{ chargeable: number; charges: number } | null>(null)

  const calculate = () => {
    const chargeable = Math.max(0, amount - freeLimit)
    const charges = chargeable > 0 ? Math.max(minCharge, (chargeable * chargePct) / 100) : 0
    setResult({ chargeable, charges })
  }

  return (
    <FinancialCalculatorTemplate
      title="Cash Deposit Charges Calculator"
      description="Estimate cash deposit charges beyond a free monthly limit (varies by bank)."
      icon={Landmark}
      calculate={calculate}
      values={[amount, freeLimit, chargePct, minCharge]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Cash Deposit Amount" value={amount} onChange={setAmount} min={0} max={10000000} step={1000} prefix="₹" />
          <InputGroup label="Free Limit" value={freeLimit} onChange={setFreeLimit} min={0} max={1000000} step={1000} prefix="₹" />
          <InputGroup label="Charge Rate" value={chargePct} onChange={setChargePct} min={0} max={5} step={0.05} suffix="%" />
          <InputGroup label="Minimum Charge" value={minCharge} onChange={setMinCharge} min={0} max={5000} step={10} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Chargeable Amount" value={inr(result.chargeable)} />
            <ResultCard label="Estimated Charges" value={inr(result.charges)} type={result.charges > 0 ? "warning" : "success"} />
            <ResultCard label="Note" value="Edit limits to match your bank" />
          </div>
        )
      }
    />
  )
}

export function ChequeBouncePenaltyCalculator() {
  const [bounces, setBounces] = useState(1)
  const [penaltyPerBounce, setPenaltyPerBounce] = useState(500)
  const [result, setResult] = useState<{ totalPenalty: number } | null>(null)

  const calculate = () => {
    setResult({ totalPenalty: bounces * penaltyPerBounce })
  }

  return (
    <FinancialCalculatorTemplate
      title="Cheque Bounce Penalty Calculator"
      description="Estimate total penalty for cheque returns (varies by bank)."
      icon={Shield}
      calculate={calculate}
      values={[bounces, penaltyPerBounce]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Number of Bounced Cheques" value={bounces} onChange={setBounces} min={0} max={50} step={1} />
          <InputGroup label="Penalty per Bounce" value={penaltyPerBounce} onChange={setPenaltyPerBounce} min={0} max={5000} step={50} prefix="₹" />
        </div>
      }
      result={result && <ResultCard label="Estimated Total Penalty" value={inr(result.totalPenalty)} type="warning" />}
    />
  )
}

export function AutoSweepCalculator() {
  const [balance, setBalance] = useState(200000)
  const [threshold, setThreshold] = useState(50000)
  const [savingsRate, setSavingsRate] = useState(3.5)
  const [fdRate, setFdRate] = useState(7)
  const [months, setMonths] = useState(12)
  const [result, setResult] = useState<{ swept: number; extraInterest: number } | null>(null)

  const calculate = () => {
    const swept = Math.max(0, balance - threshold)
    const years = months / 12
    const savingsInterest = (swept * savingsRate * years) / 100
    const fdInterest = (swept * fdRate * years) / 100
    setResult({ swept, extraInterest: Math.max(0, fdInterest - savingsInterest) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Auto Sweep Calculator"
      description="Estimate extra interest from sweeping surplus savings balance into an FD (simplified)."
      icon={PiggyBank}
      calculate={calculate}
      values={[balance, threshold, savingsRate, fdRate, months]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Current Savings Balance" value={balance} onChange={setBalance} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Sweep Threshold" value={threshold} onChange={setThreshold} min={0} max={10000000} step={1000} prefix="₹" />
          <InputGroup label="Savings Rate" value={savingsRate} onChange={setSavingsRate} min={0} max={10} step={0.1} suffix="%" />
          <InputGroup label="FD Rate" value={fdRate} onChange={setFdRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Time Period" value={months} onChange={setMonths} min={1} max={120} step={1} suffix=" months" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Estimated Swept Amount" value={inr(result.swept)} type="highlight" />
            <ResultCard label="Estimated Extra Interest" value={inr(result.extraInterest)} type="success" />
          </div>
        )
      }
    />
  )
}

export function FDPrematurePenaltyCalculator() {
  const [principal, setPrincipal] = useState(200000)
  const [contractRate, setContractRate] = useState(7)
  const [prematureRate, setPrematureRate] = useState(6)
  const [penalty, setPenalty] = useState(1)
  const [monthsCompleted, setMonthsCompleted] = useState(12)
  const [result, setResult] = useState<{ effectiveRate: number; maturity: number; lossVsContract: number } | null>(null)

  const calculate = () => {
    const years = monthsCompleted / 12
    const effectiveRate = Math.max(-100, prematureRate - penalty)
    const maturity = compound(principal, effectiveRate, years, 4)
    const contractValue = compound(principal, contractRate, years, 4)
    setResult({ effectiveRate, maturity, lossVsContract: Math.max(0, contractValue - maturity) })
  }

  return (
    <FinancialCalculatorTemplate
      title="FD Premature Penalty Calculator"
      description="Estimate maturity on premature FD closure after penalty (simplified)."
      icon={Shield}
      calculate={calculate}
      values={[principal, contractRate, prematureRate, penalty, monthsCompleted]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="FD Amount" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Contract Rate" value={contractRate} onChange={setContractRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Premature Applicable Rate" value={prematureRate} onChange={setPrematureRate} min={-10} max={15} step={0.1} suffix="%" />
          <InputGroup label="Penalty" value={penalty} onChange={setPenalty} min={0} max={5} step={0.1} suffix="%" />
          <InputGroup label="Months Completed" value={monthsCompleted} onChange={setMonthsCompleted} min={1} max={240} step={1} suffix=" months" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Effective Rate" value={`${result.effectiveRate.toFixed(2)}%`} />
            <ResultCard label="Estimated Payout" value={inr(result.maturity)} type="highlight" />
            <ResultCard label="Loss vs Contract" value={inr(result.lossVsContract)} type="warning" />
          </div>
        )
      }
    />
  )
}

export function RDDelayPenaltyCalculator() {
  const [installment, setInstallment] = useState(5000)
  const [missedMonths, setMissedMonths] = useState(2)
  const [penaltyPctPerMonth, setPenaltyPctPerMonth] = useState(1)
  const [result, setResult] = useState<{ penalty: number } | null>(null)

  const calculate = () => {
    const penalty = installment * missedMonths * (penaltyPctPerMonth / 100)
    setResult({ penalty })
  }

  return (
    <FinancialCalculatorTemplate
      title="RD Delay Penalty Calculator"
      description="Estimate penalty for missed RD installments (simplified)."
      icon={CalculatorIcon}
      calculate={calculate}
      values={[installment, missedMonths, penaltyPctPerMonth]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Installment" value={installment} onChange={setInstallment} min={0} max={200000} step={100} prefix="₹" />
          <InputGroup label="Missed Months" value={missedMonths} onChange={setMissedMonths} min={0} max={60} step={1} />
          <InputGroup label="Penalty Rate (per month)" value={penaltyPctPerMonth} onChange={setPenaltyPctPerMonth} min={0} max={10} step={0.1} suffix="%" />
        </div>
      }
      result={result && <ResultCard label="Estimated Penalty" value={inr(result.penalty)} type={result.penalty > 0 ? "warning" : "success"} />}
    />
  )
}

export function SeniorCitizenFDExtraCalculator() {
  const [principal, setPrincipal] = useState(500000)
  const [regularRate, setRegularRate] = useState(7)
  const [extraRate, setExtraRate] = useState(0.5)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<{ regular: number; senior: number; difference: number } | null>(null)

  const calculate = () => {
    const regular = compound(principal, regularRate, years, 4)
    const senior = compound(principal, regularRate + extraRate, years, 4)
    setResult({ regular, senior, difference: senior - regular })
  }

  return (
    <FinancialCalculatorTemplate
      title="Senior Citizen FD Extra Interest"
      description="Compare FD maturity with senior-citizen extra rate (simplified)."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, regularRate, extraRate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="FD Amount" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Regular Rate" value={regularRate} onChange={setRegularRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Extra Rate (Senior)" value={extraRate} onChange={setExtraRate} min={0} max={3} step={0.1} suffix="%" />
          <InputGroup label="Tenure" value={years} onChange={setYears} min={1} max={20} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Regular Maturity" value={inr(result.regular)} />
            <ResultCard label="Senior Maturity" value={inr(result.senior)} type="highlight" />
            <ResultCard label="Extra Benefit" value={inr(result.difference)} type="success" />
          </div>
        )
      }
    />
  )
}

export function EffectiveYieldCalculator() {
  const [nominalRate, setNominalRate] = useState(7)
  const [compoundsPerYear, setCompoundsPerYear] = useState(4)
  const [result, setResult] = useState<{ apy: number } | null>(null)

  const calculate = () => {
    const r = nominalRate / 100
    const n = Math.max(1, Math.round(compoundsPerYear))
    const apy = (Math.pow(1 + r / n, n) - 1) * 100
    setResult({ apy })
  }

  return (
    <FinancialCalculatorTemplate
      title="Effective Yield Calculator"
      description="Convert nominal interest rate into effective annual yield (APY)."
      icon={Percent}
      calculate={calculate}
      values={[nominalRate, compoundsPerYear]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Nominal Rate" value={nominalRate} onChange={setNominalRate} min={-50} max={50} step={0.1} suffix="%" />
          <InputGroup label="Compounding per Year" value={compoundsPerYear} onChange={setCompoundsPerYear} min={1} max={365} step={1} />
        </div>
      }
      result={result && <ResultCard label="Effective Annual Yield" value={`${result.apy.toFixed(3)}%`} type="highlight" />}
    />
  )
}

export function CashDenominationCounter() {
  const [n2000, setN2000] = useState(0)
  const [n500, setN500] = useState(10)
  const [n200, setN200] = useState(0)
  const [n100, setN100] = useState(0)
  const [n50, setN50] = useState(0)
  const [n20, setN20] = useState(0)
  const [n10, setN10] = useState(0)
  const [n5, setN5] = useState(0)
  const [n2, setN2] = useState(0)
  const [n1, setN1] = useState(0)
  const [result, setResult] = useState<{ total: number; count: number } | null>(null)

  const total = useMemo(() => {
    return (
      n2000 * 2000 +
      n500 * 500 +
      n200 * 200 +
      n100 * 100 +
      n50 * 50 +
      n20 * 20 +
      n10 * 10 +
      n5 * 5 +
      n2 * 2 +
      n1 * 1
    )
  }, [n2000, n500, n200, n100, n50, n20, n10, n5, n2, n1])

  const count = useMemo(() => n2000 + n500 + n200 + n100 + n50 + n20 + n10 + n5 + n2 + n1, [n2000, n500, n200, n100, n50, n20, n10, n5, n2, n1])

  const calculate = () => {
    setResult({ total, count })
  }

  return (
    <FinancialCalculatorTemplate
      title="Cash Denomination Counter"
      description="Count total cash value based on denomination quantities."
      icon={Wallet}
      calculate={calculate}
      values={[n2000, n500, n200, n100, n50, n20, n10, n5, n2, n1]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="₹2000 notes" value={n2000} onChange={setN2000} min={0} max={2000} step={1} />
          <InputGroup label="₹500 notes" value={n500} onChange={setN500} min={0} max={5000} step={1} />
          <InputGroup label="₹200 notes" value={n200} onChange={setN200} min={0} max={5000} step={1} />
          <InputGroup label="₹100 notes" value={n100} onChange={setN100} min={0} max={5000} step={1} />
          <InputGroup label="₹50 notes" value={n50} onChange={setN50} min={0} max={5000} step={1} />
          <InputGroup label="₹20 notes" value={n20} onChange={setN20} min={0} max={5000} step={1} />
          <InputGroup label="₹10 notes" value={n10} onChange={setN10} min={0} max={5000} step={1} />
          <InputGroup label="₹5 coins" value={n5} onChange={setN5} min={0} max={5000} step={1} />
          <InputGroup label="₹2 coins" value={n2} onChange={setN2} min={0} max={5000} step={1} />
          <InputGroup label="₹1 coins" value={n1} onChange={setN1} min={0} max={5000} step={1} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Total Cash" value={inr(result.total)} type="highlight" />
            <ResultCard label="Total Notes/Coins" value={result.count.toLocaleString("en-IN")} />
          </div>
        )
      }
    />
  )
}

export function SimpleVsCompoundCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(5)
  const [compoundsPerYear, setCompoundsPerYear] = useState(4)
  const [result, setResult] = useState<{ si: number; ci: number; diff: number } | null>(null)

  const calculate = () => {
    const si = principal + (principal * rate * years) / 100
    const ci = compound(principal, rate, years, compoundsPerYear)
    setResult({ si, ci, diff: ci - si })
  }

  return (
    <FinancialCalculatorTemplate
      title="Simple vs Compound Interest"
      description="Compare maturity amount under simple interest vs compound interest."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, rate, years, compoundsPerYear]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Principal" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Annual Rate" value={rate} onChange={setRate} min={-50} max={50} step={0.1} suffix="%" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Compounding per Year" value={compoundsPerYear} onChange={setCompoundsPerYear} min={1} max={365} step={1} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Simple Interest Maturity" value={inr(result.si)} />
            <ResultCard label="Compound Interest Maturity" value={inr(result.ci)} type="highlight" />
            <ResultCard label="Difference" value={inr(result.diff)} type="success" />
          </div>
        )
      }
    />
  )
}

export function RuleOf72Banking() {
  const [rate, setRate] = useState(7)
  const [result, setResult] = useState<{ years: number } | null>(null)

  const calculate = () => {
    if (rate <= 0) {
      setResult(null)
      return
    }
    setResult({ years: 72 / rate })
  }

  return (
    <FinancialCalculatorTemplate
      title="Rule of 72 (Banking)"
      description="Approximate years to double money based on annual interest rate."
      icon={Percent}
      calculate={calculate}
      values={[rate]}
      inputs={<InputGroup label="Interest Rate" value={rate} onChange={setRate} min={0.1} max={50} step={0.1} suffix="%" />}
      result={result && <ResultCard label="Approx. Years to Double" value={`${result.years.toFixed(2)} years`} type="highlight" />}
    />
  )
}

export function DebitCardEMICalculator() {
  const [amount, setAmount] = useState(50000)
  const [annualRate, setAnnualRate] = useState(14)
  const [months, setMonths] = useState(12)
  const [processingFeePct, setProcessingFeePct] = useState(1)
  const [result, setResult] = useState<{ emiAmount: number; totalPayable: number; fee: number } | null>(null)

  const calculate = () => {
    const fee = (amount * processingFeePct) / 100
    const emiAmount = emi(amount, annualRate, months)
    const totalPayable = emiAmount * Math.max(1, Math.round(months)) + fee
    setResult({ emiAmount, totalPayable, fee })
  }

  return (
    <FinancialCalculatorTemplate
      title="Debit Card EMI Calculator"
      description="Estimate EMI for a debit card purchase (simplified; terms vary by bank)."
      icon={CreditCard}
      calculate={calculate}
      values={[amount, annualRate, months, processingFeePct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Purchase Amount" value={amount} onChange={setAmount} min={0} max={10000000} step={1000} prefix="₹" />
          <InputGroup label="Annual Interest Rate" value={annualRate} onChange={setAnnualRate} min={0} max={60} step={0.1} suffix="%" />
          <InputGroup label="Tenure" value={months} onChange={setMonths} min={1} max={120} step={1} suffix=" months" />
          <InputGroup label="Processing Fee" value={processingFeePct} onChange={setProcessingFeePct} min={0} max={5} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="EMI" value={inr(result.emiAmount)} type="highlight" />
            <ResultCard label="Processing Fee" value={inr(result.fee)} />
            <ResultCard label="Total Payable" value={inr(result.totalPayable)} type="warning" />
          </div>
        )
      }
    />
  )
}

export function SweepInCalculator() {
  const [availableBalance, setAvailableBalance] = useState(10000)
  const [withdrawalNeed, setWithdrawalNeed] = useState(50000)
  const [fdPenaltyPct, setFdPenaltyPct] = useState(1)
  const [result, setResult] = useState<{ neededFromFD: number; penaltyCost: number } | null>(null)

  const calculate = () => {
    const neededFromFD = Math.max(0, withdrawalNeed - availableBalance)
    const penaltyCost = (neededFromFD * fdPenaltyPct) / 100
    setResult({ neededFromFD, penaltyCost })
  }

  return (
    <FinancialCalculatorTemplate
      title="Sweep-in Calculator"
      description="Estimate how much needs to be pulled from FD and approximate penalty impact (simplified)."
      icon={ArrowRightLeft}
      calculate={calculate}
      values={[availableBalance, withdrawalNeed, fdPenaltyPct]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Available Savings Balance" value={availableBalance} onChange={setAvailableBalance} min={0} max={10000000} step={100} prefix="₹" />
          <InputGroup label="Withdrawal Needed" value={withdrawalNeed} onChange={setWithdrawalNeed} min={0} max={10000000} step={100} prefix="₹" />
          <InputGroup label="Approx. FD Penalty" value={fdPenaltyPct} onChange={setFdPenaltyPct} min={0} max={5} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Needed from FD" value={inr(result.neededFromFD)} type="highlight" />
            <ResultCard label="Estimated Penalty Cost" value={inr(result.penaltyCost)} type={result.penaltyCost > 0 ? "warning" : "success"} />
          </div>
        )
      }
    />
  )
}

export function FDLadderCalculator() {
  const [totalAmount, setTotalAmount] = useState(500000)
  const [ladders, setLadders] = useState(5)
  const [horizonMonths, setHorizonMonths] = useState(60)
  const [rate, setRate] = useState(7)
  const [result, setResult] = useState<{ perFD: number; totalMaturity: number; avgTenureMonths: number } | null>(null)

  const calculate = () => {
    const n = Math.max(1, Math.round(ladders))
    const perFD = totalAmount / n
    const maxMonths = Math.max(1, Math.round(horizonMonths))

    let totalMaturity = 0
    let weightedTenure = 0

    for (let i = 1; i <= n; i++) {
      const months = (maxMonths * i) / n
      weightedTenure += months
      totalMaturity += compound(perFD, rate, months / 12, 4)
    }

    const avgTenureMonths = weightedTenure / n
    setResult({ perFD, totalMaturity, avgTenureMonths })
  }

  return (
    <FinancialCalculatorTemplate
      title="FD Ladder Calculator"
      description="Split a total amount across multiple FDs with staggered maturities (simplified)."
      icon={PiggyBank}
      calculate={calculate}
      values={[totalAmount, ladders, horizonMonths, rate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Amount" value={totalAmount} onChange={setTotalAmount} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Number of FDs" value={ladders} onChange={setLadders} min={2} max={20} step={1} />
          <InputGroup label="Max Tenure" value={horizonMonths} onChange={setHorizonMonths} min={6} max={240} step={1} suffix=" months" />
          <InputGroup label="Annual Rate" value={rate} onChange={setRate} min={0} max={15} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Per-FD Amount" value={inr(result.perFD)} />
            <ResultCard label="Avg Tenure" value={`${result.avgTenureMonths.toFixed(1)} months`} />
            <ResultCard label="Estimated Total Maturity" value={inr(result.totalMaturity)} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function ForeignCurrencyAccountCalculator() {
  const [inrAmount, setInrAmount] = useState(200000)
  const [fxRate, setFxRate] = useState(83)
  const [annualInterest, setAnnualInterest] = useState(1)
  const [years, setYears] = useState(3)
  const [exitFxRate, setExitFxRate] = useState(85)
  const [result, setResult] = useState<{ foreignPrincipal: number; foreignMaturity: number; inrValue: number } | null>(null)

  const calculate = () => {
    const foreignPrincipal = fxRate > 0 ? inrAmount / fxRate : 0
    const foreignMaturity = compound(foreignPrincipal, annualInterest, years, 1)
    const inrValue = foreignMaturity * exitFxRate
    setResult({ foreignPrincipal, foreignMaturity, inrValue })
  }

  return (
    <FinancialCalculatorTemplate
      title="Foreign Currency Account Calculator"
      description="Convert INR to a foreign currency, grow with interest, and convert back (simplified)."
      icon={ArrowRightLeft}
      calculate={calculate}
      values={[inrAmount, fxRate, annualInterest, years, exitFxRate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Amount in INR" value={inrAmount} onChange={setInrAmount} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Entry FX Rate (₹ per 1 unit)" value={fxRate} onChange={setFxRate} min={0.01} max={1000} step={0.01} />
          <InputGroup label="Foreign Interest Rate" value={annualInterest} onChange={setAnnualInterest} min={-10} max={20} step={0.1} suffix="%" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" years" />
          <InputGroup label="Exit FX Rate (₹ per 1 unit)" value={exitFxRate} onChange={setExitFxRate} min={0.01} max={1000} step={0.01} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Foreign Principal" value={result.foreignPrincipal.toFixed(2)} />
            <ResultCard label="Foreign Maturity" value={result.foreignMaturity.toFixed(2)} type="highlight" />
            <ResultCard label="Estimated INR Value" value={inr(result.inrValue)} type="success" />
          </div>
        )
      }
    />
  )
}

export function TaxSavingFDCalculator() {
  const [principal, setPrincipal] = useState(150000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(5)
  const [taxBracket, setTaxBracket] = useState(30)
  const [result, setResult] = useState<{ preTax: number; postTax: number; totalTax: number } | null>(null)

  const calculate = () => {
    let balance = principal
    let totalTax = 0
    for (let y = 0; y < Math.max(1, Math.round(years)); y++) {
      const interest = (balance * rate) / 100
      const tax = (interest * taxBracket) / 100
      totalTax += tax
      balance = balance + (interest - tax)
    }
    const postTax = balance
    const preTax = compound(principal, rate, years, 1)
    setResult({ preTax, postTax, totalTax })
  }

  return (
    <FinancialCalculatorTemplate
      title="Tax Saving FD Calculator"
      description="Estimate FD value with annual taxation on interest (simplified)."
      icon={Shield}
      calculate={calculate}
      values={[principal, rate, years, taxBracket]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Deposit Amount" value={principal} onChange={setPrincipal} min={0} max={10000000} step={1000} prefix="₹" />
          <InputGroup label="Interest Rate" value={rate} onChange={setRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={10} step={1} suffix=" years" />
          <InputGroup label="Tax Bracket" value={taxBracket} onChange={setTaxBracket} min={0} max={50} step={1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Pre-tax Value" value={inr(result.preTax)} />
            <ResultCard label="Post-tax Value" value={inr(result.postTax)} type="highlight" />
            <ResultCard label="Estimated Tax Paid" value={inr(result.totalTax)} type="warning" />
          </div>
        )
      }
    />
  )
}

export function CumulativeVsNonCumulativeCalculator() {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(3)
  const [payout, setPayout] = useState<"monthly" | "quarterly" | "annual">("quarterly")
  const [result, setResult] = useState<{ cumulative: number; periodicPayout: number; totalPayout: number } | null>(null)

  const periodsPerYear = payout === "monthly" ? 12 : payout === "quarterly" ? 4 : 1

  const calculate = () => {
    const cumulative = compound(principal, rate, years, periodsPerYear)
    const periodicPayout = (principal * (rate / 100)) / periodsPerYear
    const totalPayout = periodicPayout * periodsPerYear * years
    setResult({ cumulative, periodicPayout, totalPayout })
  }

  return (
    <FinancialCalculatorTemplate
      title="Cumulative vs Non-Cumulative FD"
      description="Compare reinvested (cumulative) FD maturity vs periodic interest payout."
      icon={PiggyBank}
      calculate={calculate}
      values={[principal, rate, years, payout]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Principal" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Interest Rate" value={rate} onChange={setRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={20} step={1} suffix=" years" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Payout Frequency (Non-cumulative)</label>
            <select
              value={payout}
              onChange={(e) => setPayout(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Cumulative Maturity" value={inr(result.cumulative)} type="highlight" />
            <ResultCard label="Periodic Payout" value={inr(result.periodicPayout)} />
            <ResultCard label="Total Payout (Interest)" value={inr(result.totalPayout)} type="success" />
          </div>
        )
      }
    />
  )
}

export function BankFDVsPostOfficeCalculator() {
  const [principal, setPrincipal] = useState(500000)
  const [bankRate, setBankRate] = useState(7)
  const [poRate, setPoRate] = useState(7.4)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<{ bank: number; postOffice: number; difference: number } | null>(null)

  const calculate = () => {
    const bank = compound(principal, bankRate, years, 4)
    const postOffice = compound(principal, poRate, years, 4)
    setResult({ bank, postOffice, difference: postOffice - bank })
  }

  return (
    <FinancialCalculatorTemplate
      title="Bank FD vs Post Office"
      description="Compare maturity values using two interest rates (simplified)."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, bankRate, poRate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Deposit Amount" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Bank FD Rate" value={bankRate} onChange={setBankRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Post Office Rate" value={poRate} onChange={setPoRate} min={0} max={15} step={0.1} suffix="%" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={20} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Bank FD" value={inr(result.bank)} />
            <ResultCard label="Post Office" value={inr(result.postOffice)} type="highlight" />
            <ResultCard label="Difference" value={inr(result.difference)} type={result.difference >= 0 ? "success" : "warning"} />
          </div>
        )
      }
    />
  )
}

function PeriodicInterestTemplate(props: {
  title: string
  description: string
  periodsPerYear: number
}) {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(7)
  const [result, setResult] = useState<{ interest: number } | null>(null)

  const calculate = () => {
    const interest = (principal * (rate / 100)) / props.periodsPerYear
    setResult({ interest })
  }

  return (
    <FinancialCalculatorTemplate
      title={props.title}
      description={props.description}
      icon={Percent}
      calculate={calculate}
      values={[principal, rate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Principal" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Annual Interest Rate" value={rate} onChange={setRate} min={-50} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={result && <ResultCard label="Interest per Period" value={inr(result.interest)} type="highlight" />}
    />
  )
}

export function QuarterlyInterestCalculator() {
  return (
    <PeriodicInterestTemplate
      title="Quarterly Interest Calculator"
      description="Calculate quarterly interest payout on a principal amount."
      periodsPerYear={4}
    />
  )
}

export function MonthlyInterestCalculator() {
  return (
    <PeriodicInterestTemplate
      title="Monthly Interest Calculator"
      description="Calculate monthly interest payout on a principal amount."
      periodsPerYear={12}
    />
  )
}

export function AnnualInterestCalculator() {
  return (
    <PeriodicInterestTemplate
      title="Annual Interest Calculator"
      description="Calculate annual interest payout on a principal amount."
      periodsPerYear={1}
    />
  )
}

export function OverdraftProtectionCostCalculator() {
  const [odAmount, setOdAmount] = useState(25000)
  const [annualRate, setAnnualRate] = useState(24)
  const [days, setDays] = useState(15)
  const [processingFee, setProcessingFee] = useState(0)
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null)

  const calculate = () => {
    const interest = odAmount * (annualRate / 100) * (days / 365)
    const total = interest + processingFee
    setResult({ interest, total })
  }

  return (
    <FinancialCalculatorTemplate
      title="Overdraft Protection Cost"
      description="Estimate interest cost for overdraft usage over a number of days."
      icon={CreditCard}
      calculate={calculate}
      values={[odAmount, annualRate, days, processingFee]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Overdraft Amount Used" value={odAmount} onChange={setOdAmount} min={0} max={10000000} step={100} prefix="₹" />
          <InputGroup label="Annual OD Rate" value={annualRate} onChange={setAnnualRate} min={0} max={60} step={0.1} suffix="%" />
          <InputGroup label="Days Used" value={days} onChange={setDays} min={1} max={365} step={1} suffix=" days" />
          <InputGroup label="Processing/Service Fee" value={processingFee} onChange={setProcessingFee} min={0} max={10000} step={10} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Estimated Interest" value={inr(result.interest)} type="warning" />
            <ResultCard label="Total Cost" value={inr(result.total)} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function MultiCurrencyAccountCalculator() {
  const [inrAmount, setInrAmount] = useState(500000)
  const [usdPct, setUsdPct] = useState(50)
  const [eurPct, setEurPct] = useState(30)
  const [gbpPct, setGbpPct] = useState(20)
  const [usdRate, setUsdRate] = useState(83)
  const [eurRate, setEurRate] = useState(90)
  const [gbpRate, setGbpRate] = useState(105)
  const [result, setResult] = useState<{ usd: number; eur: number; gbp: number; normalized: { usd: number; eur: number; gbp: number } } | null>(null)

  const calculate = () => {
    const sum = usdPct + eurPct + gbpPct
    const denom = sum === 0 ? 1 : sum
    const normalized = {
      usd: (usdPct / denom) * 100,
      eur: (eurPct / denom) * 100,
      gbp: (gbpPct / denom) * 100
    }

    const usdInr = (inrAmount * normalized.usd) / 100
    const eurInr = (inrAmount * normalized.eur) / 100
    const gbpInr = (inrAmount * normalized.gbp) / 100

    const usd = usdRate > 0 ? usdInr / usdRate : 0
    const eur = eurRate > 0 ? eurInr / eurRate : 0
    const gbp = gbpRate > 0 ? gbpInr / gbpRate : 0

    setResult({ usd, eur, gbp, normalized })
  }

  return (
    <FinancialCalculatorTemplate
      title="Multi-Currency Account Calculator"
      description="Split INR into multiple currencies and estimate balances (normalized if total % ≠ 100)."
      icon={ArrowRightLeft}
      calculate={calculate}
      values={[inrAmount, usdPct, eurPct, gbpPct, usdRate, eurRate, gbpRate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Amount (INR)" value={inrAmount} onChange={setInrAmount} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="USD Allocation" value={usdPct} onChange={setUsdPct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="EUR Allocation" value={eurPct} onChange={setEurPct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="GBP Allocation" value={gbpPct} onChange={setGbpPct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="USD Rate (₹/USD)" value={usdRate} onChange={setUsdRate} min={0.01} max={1000} step={0.01} />
          <InputGroup label="EUR Rate (₹/EUR)" value={eurRate} onChange={setEurRate} min={0.01} max={2000} step={0.01} />
          <InputGroup label="GBP Rate (₹/GBP)" value={gbpRate} onChange={setGbpRate} min={0.01} max={3000} step={0.01} />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label={`USD (${result.normalized.usd.toFixed(1)}%)`} value={result.usd.toFixed(2)} type="highlight" />
              <ResultCard label={`EUR (${result.normalized.eur.toFixed(1)}%)`} value={result.eur.toFixed(2)} />
              <ResultCard label={`GBP (${result.normalized.gbp.toFixed(1)}%)`} value={result.gbp.toFixed(2)} />
            </div>
            <div className="text-sm text-muted-foreground">Percentages are normalized if totals are not 100%.</div>
          </div>
        )
      }
    />
  )
}
