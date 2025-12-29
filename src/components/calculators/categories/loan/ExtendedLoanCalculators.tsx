"use client"

import { useMemo, useState } from "react"
import { Car, FileWarning, Landmark, Scale, TrendingDown } from "lucide-react"
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

  // If PV equals sum of payments, rate ~ 0.
  if (Math.abs(pvTarget - payment * n) < 1e-6) return 0

  // Binary search monthly rate in [0, 10%] (very high for consumer loans)
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

export function LoanRestructuringCalculator() {
  const [outstanding, setOutstanding] = useState(12_00_000)
  const [currentRate, setCurrentRate] = useState(11)
  const [currentTenure, setCurrentTenure] = useState(48)
  const [newRate, setNewRate] = useState(9.5)
  const [newTenure, setNewTenure] = useState(60)
  const [processingFee, setProcessingFee] = useState(5_000)

  const result = useMemo(() => {
    const currentEMI = emi(outstanding, currentRate, currentTenure)
    const newEMI = emi(outstanding, newRate, newTenure)

    const currentTotal = currentEMI * clamp0(currentTenure)
    const newTotal = newEMI * clamp0(newTenure) + clamp0(processingFee)

    return {
      currentEMI,
      newEMI,
      monthlyDiff: newEMI - currentEMI,
      currentTotal,
      newTotal,
      totalDiff: newTotal - currentTotal
    }
  }, [outstanding, currentRate, currentTenure, newRate, newTenure, processingFee])

  return (
    <FinancialCalculatorTemplate
      title="Loan Restructuring"
      description="Compare EMI and total repayment before vs after restructuring."
      icon={TrendingDown}
      calculate={() => {}}
      values={[outstanding, currentRate, currentTenure, newRate, newTenure, processingFee]}
      onClear={() => {
        setOutstanding(12_00_000)
        setCurrentRate(11)
        setCurrentTenure(48)
        setNewRate(9.5)
        setNewTenure(60)
        setProcessingFee(5_000)
      }}
      onRestoreAction={(vals) => {
        setOutstanding(Number(vals[0] ?? 12_00_000))
        setCurrentRate(Number(vals[1] ?? 11))
        setCurrentTenure(Number(vals[2] ?? 48))
        setNewRate(Number(vals[3] ?? 9.5))
        setNewTenure(Number(vals[4] ?? 60))
        setProcessingFee(Number(vals[5] ?? 5_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Amount" value={outstanding} onChange={setOutstanding} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Current Interest Rate" value={currentRate} onChange={setCurrentRate} min={0} max={40} step={0.1} suffix="%" />
          <InputGroup label="Current Tenure" value={currentTenure} onChange={setCurrentTenure} min={1} max={600} step={1} suffix=" months" />
          <InputGroup label="New Interest Rate" value={newRate} onChange={setNewRate} min={0} max={40} step={0.1} suffix="%" />
          <InputGroup label="New Tenure" value={newTenure} onChange={setNewTenure} min={1} max={600} step={1} suffix=" months" />
          <InputGroup label="Processing Fee" value={processingFee} onChange={setProcessingFee} min={0} max={1e9} step={100} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Current EMI" value={fmtINR(result.currentEMI)} />
          <ResultCard label="New EMI" value={fmtINR(result.newEMI)} type="highlight" />
          <ResultCard
            label="Monthly Change"
            value={`${result.monthlyDiff >= 0 ? "+" : "-"}${fmtINR(Math.abs(result.monthlyDiff))}`}
            type={result.monthlyDiff <= 0 ? "success" : "warning"}
          />
          <ResultCard label="Current Total" value={fmtINR(result.currentTotal)} />
          <ResultCard label="New Total (+fee)" value={fmtINR(result.newTotal)} type="highlight" />
          <ResultCard
            label="Total Change"
            value={`${result.totalDiff >= 0 ? "+" : "-"}${fmtINR(Math.abs(result.totalDiff))}`}
            type={result.totalDiff <= 0 ? "success" : "warning"}
          />
        </div>
      }
    />
  )
}

export function LoanDefaultPenalty() {
  const [overdueAmount, setOverdueAmount] = useState(25_000)
  const [penaltyRateAnnual, setPenaltyRateAnnual] = useState(24)
  const [daysLate, setDaysLate] = useState(20)
  const [fixedFee, setFixedFee] = useState(500)

  const result = useMemo(() => {
    const penaltyInterest = clamp0(overdueAmount) * (clamp0(penaltyRateAnnual) / 100) * (clamp0(daysLate) / 365)
    const totalPenalty = penaltyInterest + clamp0(fixedFee)
    return { penaltyInterest, totalPenalty }
  }, [overdueAmount, penaltyRateAnnual, daysLate, fixedFee])

  return (
    <FinancialCalculatorTemplate
      title="Loan Default Penalty"
      description="Estimate penalty interest and fees for delayed payment."
      icon={FileWarning}
      calculate={() => {}}
      values={[overdueAmount, penaltyRateAnnual, daysLate, fixedFee]}
      onClear={() => {
        setOverdueAmount(25_000)
        setPenaltyRateAnnual(24)
        setDaysLate(20)
        setFixedFee(500)
      }}
      onRestoreAction={(vals) => {
        setOverdueAmount(Number(vals[0] ?? 25_000))
        setPenaltyRateAnnual(Number(vals[1] ?? 24))
        setDaysLate(Number(vals[2] ?? 20))
        setFixedFee(Number(vals[3] ?? 500))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Overdue Amount" value={overdueAmount} onChange={setOverdueAmount} min={0} max={1e10} step={100} prefix="₹" />
          <InputGroup label="Penalty Rate (annual)" value={penaltyRateAnnual} onChange={setPenaltyRateAnnual} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Days Late" value={daysLate} onChange={setDaysLate} min={0} max={3650} step={1} />
          <InputGroup label="Fixed Fee (if any)" value={fixedFee} onChange={setFixedFee} min={0} max={1e8} step={50} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Penalty Interest" value={fmtINR(result.penaltyInterest, 2)} />
          <ResultCard label="Total Penalty" value={fmtINR(result.totalPenalty, 2)} type="highlight" />
        </div>
      }
    />
  )
}

export function GuarantorLiability() {
  const [outstanding, setOutstanding] = useState(8_00_000)
  const [guaranteePct, setGuaranteePct] = useState(100)
  const [expectedRecoveryPct, setExpectedRecoveryPct] = useState(30)
  const [legalCosts, setLegalCosts] = useState(25_000)

  const result = useMemo(() => {
    const maxLiability = (clamp0(outstanding) * clamp0(guaranteePct)) / 100
    const expectedRecovery = (maxLiability * clamp0(expectedRecoveryPct)) / 100
    const expectedPayout = Math.max(0, maxLiability - expectedRecovery) + clamp0(legalCosts)
    return { maxLiability, expectedRecovery, expectedPayout }
  }, [outstanding, guaranteePct, expectedRecoveryPct, legalCosts])

  return (
    <FinancialCalculatorTemplate
      title="Guarantor Liability"
      description="Estimate max and expected liability for a loan guarantor."
      icon={Scale}
      calculate={() => {}}
      values={[outstanding, guaranteePct, expectedRecoveryPct, legalCosts]}
      onClear={() => {
        setOutstanding(8_00_000)
        setGuaranteePct(100)
        setExpectedRecoveryPct(30)
        setLegalCosts(25_000)
      }}
      onRestoreAction={(vals) => {
        setOutstanding(Number(vals[0] ?? 8_00_000))
        setGuaranteePct(Number(vals[1] ?? 100))
        setExpectedRecoveryPct(Number(vals[2] ?? 30))
        setLegalCosts(Number(vals[3] ?? 25_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Loan" value={outstanding} onChange={setOutstanding} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Guarantee Coverage" value={guaranteePct} onChange={setGuaranteePct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Expected Recovery" value={expectedRecoveryPct} onChange={setExpectedRecoveryPct} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Legal / Other Costs" value={legalCosts} onChange={setLegalCosts} min={0} max={1e9} step={100} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Max Liability" value={fmtINR(result.maxLiability)} type="highlight" />
          <ResultCard label="Expected Recovery" value={fmtINR(result.expectedRecovery)} />
          <ResultCard label="Expected Payout" value={fmtINR(result.expectedPayout)} type="warning" />
        </div>
      }
    />
  )
}

export function LoanAgainstProperty() {
  const [propertyValue, setPropertyValue] = useState(80_00_000)
  const [ltvPct, setLtvPct] = useState(60)
  const [rate, setRate] = useState(10)
  const [tenure, setTenure] = useState(180)

  const result = useMemo(() => {
    const maxLoan = (clamp0(propertyValue) * clamp0(ltvPct)) / 100
    const monthlyEmi = emi(maxLoan, rate, tenure)
    const total = monthlyEmi * clamp0(tenure)
    return { maxLoan, monthlyEmi, total }
  }, [propertyValue, ltvPct, rate, tenure])

  return (
    <FinancialCalculatorTemplate
      title="Loan Against Property"
      description="Estimate eligible loan (via LTV) and EMI."
      icon={Landmark}
      calculate={() => {}}
      values={[propertyValue, ltvPct, rate, tenure]}
      onClear={() => {
        setPropertyValue(80_00_000)
        setLtvPct(60)
        setRate(10)
        setTenure(180)
      }}
      onRestoreAction={(vals) => {
        setPropertyValue(Number(vals[0] ?? 80_00_000))
        setLtvPct(Number(vals[1] ?? 60))
        setRate(Number(vals[2] ?? 10))
        setTenure(Number(vals[3] ?? 180))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Property Value" value={propertyValue} onChange={setPropertyValue} min={0} max={1e13} step={1000} prefix="₹" />
          <InputGroup label="Loan-to-Value (LTV)" value={ltvPct} onChange={setLtvPct} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Interest Rate" value={rate} onChange={setRate} min={0} max={40} step={0.1} suffix="%" />
          <InputGroup label="Tenure" value={tenure} onChange={setTenure} min={1} max={600} step={1} suffix=" months" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Max Loan" value={fmtINR(result.maxLoan)} type="highlight" />
          <ResultCard label="Estimated EMI" value={fmtINR(result.monthlyEmi)} />
          <ResultCard label="Total Repayment" value={fmtINR(result.total)} />
        </div>
      }
    />
  )
}

export function CarLeaseVsBuy() {
  const [carPrice, setCarPrice] = useState(10_00_000)
  const [downPayment, setDownPayment] = useState(2_00_000)
  const [loanRate, setLoanRate] = useState(9.5)
  const [loanMonths, setLoanMonths] = useState(60)

  const [leaseMonthly, setLeaseMonthly] = useState(22_000)
  const [leaseMonths, setLeaseMonths] = useState(36)
  const [leaseFees, setLeaseFees] = useState(15_000)

  const [expectedResaleValue, setExpectedResaleValue] = useState(5_00_000)

  const result = useMemo(() => {
    const loanPrincipal = Math.max(0, clamp0(carPrice) - clamp0(downPayment))
    const buyEmi = emi(loanPrincipal, loanRate, loanMonths)
    const buyTotalPaid = clamp0(downPayment) + buyEmi * clamp0(loanMonths)
    const buyNetCost = Math.max(0, buyTotalPaid - clamp0(expectedResaleValue))

    const leaseTotalPaid = clamp0(leaseMonthly) * clamp0(leaseMonths) + clamp0(leaseFees)

    return {
      buyEmi,
      buyTotalPaid,
      buyNetCost,
      leaseTotalPaid,
      diff: leaseTotalPaid - buyNetCost
    }
  }, [carPrice, downPayment, loanRate, loanMonths, leaseMonthly, leaseMonths, leaseFees, expectedResaleValue])

  const leaseCheaper = result.diff < 0

  return (
    <FinancialCalculatorTemplate
      title="Car Lease vs Buy"
      description="Compare lease total cost vs buying on loan (net of resale value)."
      icon={Car}
      calculate={() => {}}
      values={[carPrice, downPayment, loanRate, loanMonths, leaseMonthly, leaseMonths, leaseFees, expectedResaleValue]}
      onClear={() => {
        setCarPrice(10_00_000)
        setDownPayment(2_00_000)
        setLoanRate(9.5)
        setLoanMonths(60)
        setLeaseMonthly(22_000)
        setLeaseMonths(36)
        setLeaseFees(15_000)
        setExpectedResaleValue(5_00_000)
      }}
      onRestoreAction={(vals) => {
        setCarPrice(Number(vals[0] ?? 10_00_000))
        setDownPayment(Number(vals[1] ?? 2_00_000))
        setLoanRate(Number(vals[2] ?? 9.5))
        setLoanMonths(Number(vals[3] ?? 60))
        setLeaseMonthly(Number(vals[4] ?? 22_000))
        setLeaseMonths(Number(vals[5] ?? 36))
        setLeaseFees(Number(vals[6] ?? 15_000))
        setExpectedResaleValue(Number(vals[7] ?? 5_00_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Car Price" value={carPrice} onChange={setCarPrice} min={0} max={1e13} step={1000} prefix="₹" />
          <InputGroup label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={1e13} step={1000} prefix="₹" />
          <InputGroup label="Loan Rate" value={loanRate} onChange={setLoanRate} min={0} max={40} step={0.1} suffix="%" />
          <InputGroup label="Loan Tenure" value={loanMonths} onChange={setLoanMonths} min={1} max={600} step={1} suffix=" months" />
          <InputGroup label="Lease Monthly" value={leaseMonthly} onChange={setLeaseMonthly} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Lease Tenure" value={leaseMonths} onChange={setLeaseMonths} min={1} max={120} step={1} suffix=" months" />
          <InputGroup label="Lease Fees" value={leaseFees} onChange={setLeaseFees} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Expected Resale Value (Buy)" value={expectedResaleValue} onChange={setExpectedResaleValue} min={0} max={1e13} step={1000} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Buy EMI" value={fmtINR(result.buyEmi)} />
          <ResultCard label="Buy Net Cost" value={fmtINR(result.buyNetCost)} type="highlight" />
          <ResultCard label="Lease Total" value={fmtINR(result.leaseTotalPaid)} type="highlight" />
          <ResultCard
            label="Lease − Buy"
            value={`${result.diff >= 0 ? "+" : "-"}${fmtINR(Math.abs(result.diff))}`}
            type={leaseCheaper ? "success" : "warning"}
          />
        </div>
      }
    />
  )
}

export function ZeroCostEMICalculator() {
  const [productPrice, setProductPrice] = useState(50_000)
  const [upfrontDiscount, setUpfrontDiscount] = useState(2_500)
  const [tenureMonths, setTenureMonths] = useState(12)

  const result = useMemo(() => {
    const price = clamp0(productPrice)
    const discount = clamp0(upfrontDiscount)
    const n = Math.max(1, Math.round(clamp0(tenureMonths)))

    const upfront = Math.max(0, price - discount)
    const emiAmount = price / n // typical “zero cost”: total EMI equals product MRP

    const monthlyRate = solveMonthlyRate(upfront, emiAmount, n)
    const apr = monthlyRate * 12 * 100

    const extraPaid = price - upfront

    return { upfront, emiAmount, apr, extraPaid }
  }, [productPrice, upfrontDiscount, tenureMonths])

  return (
    <FinancialCalculatorTemplate
      title="Zero Cost EMI Reality"
      description="See the implied APR when you lose an upfront discount for choosing EMI."
      icon={TrendingDown}
      calculate={() => {}}
      values={[productPrice, upfrontDiscount, tenureMonths]}
      onClear={() => {
        setProductPrice(50_000)
        setUpfrontDiscount(2_500)
        setTenureMonths(12)
      }}
      onRestoreAction={(vals) => {
        setProductPrice(Number(vals[0] ?? 50_000))
        setUpfrontDiscount(Number(vals[1] ?? 2_500))
        setTenureMonths(Number(vals[2] ?? 12))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Product Price" value={productPrice} onChange={setProductPrice} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Upfront Discount (cashback/offer)" value={upfrontDiscount} onChange={setUpfrontDiscount} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="EMI Tenure" value={tenureMonths} onChange={setTenureMonths} min={1} max={60} step={1} suffix=" months" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Upfront Cost" value={fmtINR(result.upfront)} type="highlight" />
          <ResultCard label="EMI (Approx)" value={fmtINR(result.emiAmount, 2)} />
          <ResultCard label="Extra Paid vs Upfront" value={fmtINR(result.extraPaid)} type="warning" />
          <ResultCard label="Implied APR" value={`${result.apr.toFixed(2)}%`} type="highlight" />
        </div>
      }
    />
  )
}

export function PaydayLoanAPR() {
  const [loanAmount, setLoanAmount] = useState(10_000)
  const [fee, setFee] = useState(500)
  const [termDays, setTermDays] = useState(14)

  const result = useMemo(() => {
    const principal = clamp0(loanAmount)
    const charge = clamp0(fee)
    const days = Math.max(1, Math.round(clamp0(termDays)))

    const apr = principal === 0 ? 0 : (charge / principal) * (365 / days) * 100
    return { apr }
  }, [loanAmount, fee, termDays])

  return (
    <FinancialCalculatorTemplate
      title="Payday Loan APR"
      description="Estimate APR from payday loan fee and term."
      icon={FileWarning}
      calculate={() => {}}
      values={[loanAmount, fee, termDays]}
      onClear={() => {
        setLoanAmount(10_000)
        setFee(500)
        setTermDays(14)
      }}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals[0] ?? 10_000))
        setFee(Number(vals[1] ?? 500))
        setTermDays(Number(vals[2] ?? 14))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Fee" value={fee} onChange={setFee} min={0} max={1e9} step={10} prefix="₹" />
          <InputGroup label="Term" value={termDays} onChange={setTermDays} min={1} max={365} step={1} suffix=" days" />
        </div>
      }
      result={<ResultCard label="Estimated APR" value={`${result.apr.toFixed(2)}%`} type="highlight" />}
    />
  )
}

export function MicrofinanceLoan() {
  const [principal, setPrincipal] = useState(30_000)
  const [weeklyInstallment, setWeeklyInstallment] = useState(750)
  const [weeks, setWeeks] = useState(52)

  const result = useMemo(() => {
    const p = clamp0(principal)
    const pay = clamp0(weeklyInstallment)
    const n = Math.max(1, Math.round(clamp0(weeks)))

    const totalRepay = pay * n
    const totalInterest = Math.max(0, totalRepay - p)
    const aprApprox = p === 0 ? 0 : (totalInterest / p) * (52 / n) * 100

    return { totalRepay, totalInterest, aprApprox }
  }, [principal, weeklyInstallment, weeks])

  return (
    <FinancialCalculatorTemplate
      title="Microfinance Loan"
      description="Estimate total repayment and approximate APR from weekly installments."
      icon={Landmark}
      calculate={() => {}}
      values={[principal, weeklyInstallment, weeks]}
      onClear={() => {
        setPrincipal(30_000)
        setWeeklyInstallment(750)
        setWeeks(52)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals[0] ?? 30_000))
        setWeeklyInstallment(Number(vals[1] ?? 750))
        setWeeks(Number(vals[2] ?? 52))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Principal" value={principal} onChange={setPrincipal} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Weekly Installment" value={weeklyInstallment} onChange={setWeeklyInstallment} min={0} max={1e7} step={10} prefix="₹" />
          <InputGroup label="Weeks" value={weeks} onChange={setWeeks} min={1} max={520} step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Repayment" value={fmtINR(result.totalRepay)} type="highlight" />
          <ResultCard label="Total Interest" value={fmtINR(result.totalInterest)} type="warning" />
          <ResultCard label="Approx APR" value={`${result.aprApprox.toFixed(2)}%`} />
        </div>
      }
    />
  )
}

export function EducationLoanTaxBenefit() {
  const [annualInterestPaid, setAnnualInterestPaid] = useState(1_20_000)
  const [marginalTaxRate, setMarginalTaxRate] = useState(30)

  const result = useMemo(() => {
    const saved = (clamp0(annualInterestPaid) * clamp0(marginalTaxRate)) / 100
    return { saved }
  }, [annualInterestPaid, marginalTaxRate])

  return (
    <FinancialCalculatorTemplate
      title="Education Loan Tax Benefit"
      description="Estimate tax saved from interest deduction (illustrative)."
      icon={Scale}
      calculate={() => {}}
      values={[annualInterestPaid, marginalTaxRate]}
      onClear={() => {
        setAnnualInterestPaid(1_20_000)
        setMarginalTaxRate(30)
      }}
      onRestoreAction={(vals) => {
        setAnnualInterestPaid(Number(vals[0] ?? 1_20_000))
        setMarginalTaxRate(Number(vals[1] ?? 30))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Interest Paid" value={annualInterestPaid} onChange={setAnnualInterestPaid} min={0} max={1e12} step={100} prefix="₹" />
          <InputGroup label="Marginal Tax Rate" value={marginalTaxRate} onChange={setMarginalTaxRate} min={0} max={50} step={0.5} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Tax Saved" value={fmtINR(result.saved)} type="highlight" />}
    />
  )
}

export function MudraLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(2_00_000)
  const [rate, setRate] = useState(12)
  const [tenure, setTenure] = useState(36)

  const result = useMemo(() => {
    const monthlyEmi = emi(loanAmount, rate, tenure)
    const total = monthlyEmi * clamp0(tenure)
    const interest = Math.max(0, total - clamp0(loanAmount))
    return { monthlyEmi, total, interest }
  }, [loanAmount, rate, tenure])

  return (
    <FinancialCalculatorTemplate
      title="Mudra Loan Calculator"
      description="Estimate EMI and total interest for a Mudra loan (illustrative)."
      icon={Landmark}
      calculate={() => {}}
      values={[loanAmount, rate, tenure]}
      onClear={() => {
        setLoanAmount(2_00_000)
        setRate(12)
        setTenure(36)
      }}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals[0] ?? 2_00_000))
        setRate(Number(vals[1] ?? 12))
        setTenure(Number(vals[2] ?? 36))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Loan Amount" value={loanAmount} onChange={setLoanAmount} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Interest Rate" value={rate} onChange={setRate} min={0} max={40} step={0.1} suffix="%" />
          <InputGroup label="Tenure" value={tenure} onChange={setTenure} min={1} max={240} step={1} suffix=" months" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="EMI" value={fmtINR(result.monthlyEmi)} type="highlight" />
          <ResultCard label="Total Interest" value={fmtINR(result.interest)} type="warning" />
          <ResultCard label="Total Repayment" value={fmtINR(result.total)} />
        </div>
      }
    />
  )
}
