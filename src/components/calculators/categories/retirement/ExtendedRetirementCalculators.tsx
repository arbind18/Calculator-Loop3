"use client"

import { useMemo, useState } from "react"
import {
  Activity,
  BadgePercent,
  Briefcase,
  Calendar,
  HeartPulse,
  Home,
  PiggyBank,
  Plane,
  Shield,
  TrendingUp,
  Wallet
} from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0)

const fmtNum = (n: number, digits = 0) => {
  if (!Number.isFinite(n)) return "-"
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits })
}

const monthlyRate = (annualRatePct: number) => clamp0(annualRatePct) / 100 / 12

const fvOfMonthlyContrib = (pmt: number, annualRatePct: number, months: number) => {
  const n = Math.max(0, Math.round(clamp0(months)))
  const r = monthlyRate(annualRatePct)
  if (n === 0) return 0
  if (r === 0) return clamp0(pmt) * n
  return clamp0(pmt) * ((Math.pow(1 + r, n) - 1) / r)
}

const fvLumpSum = (principal: number, annualRatePct: number, years: number) => {
  const p = clamp0(principal)
  const t = clamp0(years)
  const r = clamp0(annualRatePct) / 100
  return p * Math.pow(1 + r, t)
}

const pmtFromPV = (pv: number, annualRatePct: number, months: number) => {
  const n = Math.max(0, Math.round(clamp0(months)))
  const r = monthlyRate(annualRatePct)
  const P = clamp0(pv)
  if (n === 0) return 0
  if (r === 0) return P / n
  return (P * r) / (1 - Math.pow(1 + r, -n))
}

export function EPFCalculator() {
  const [basicMonthly, setBasicMonthly] = useState(30_000)
  const [employeePct, setEmployeePct] = useState(12)
  const [employerPct, setEmployerPct] = useState(12)
  const [interest, setInterest] = useState(8.15)
  const [years, setYears] = useState(20)
  const [startingBalance, setStartingBalance] = useState(0)

  const result = useMemo(() => {
    const emp = clamp0(basicMonthly) * (clamp0(employeePct) / 100)
    const er = clamp0(basicMonthly) * (clamp0(employerPct) / 100)
    const monthlyContrib = emp + er
    const months = Math.round(clamp0(years) * 12)

    const fvContrib = fvOfMonthlyContrib(monthlyContrib, interest, months)
    const fvStart = fvOfMonthlyContrib(0, interest, 0) // keeps structure; no-op
    const fvStartBalance = clamp0(startingBalance) * Math.pow(1 + monthlyRate(interest), months)

    return {
      monthlyContrib,
      fv: fvContrib + fvStart + fvStartBalance
    }
  }, [basicMonthly, employeePct, employerPct, interest, years, startingBalance])

  return (
    <FinancialCalculatorTemplate
      title="EPF Calculator"
      description="Estimate your EPF corpus from monthly contributions and interest rate."
      icon={PiggyBank}
      calculate={() => {}}
      values={[basicMonthly, employeePct, employerPct, interest, years, startingBalance]}
      onClear={() => {
        setBasicMonthly(30_000)
        setEmployeePct(12)
        setEmployerPct(12)
        setInterest(8.15)
        setYears(20)
        setStartingBalance(0)
      }}
      onRestoreAction={(vals) => {
        setBasicMonthly(Number(vals?.[0] ?? 30_000))
        setEmployeePct(Number(vals?.[1] ?? 12))
        setEmployerPct(Number(vals?.[2] ?? 12))
        setInterest(Number(vals?.[3] ?? 8.15))
        setYears(Number(vals?.[4] ?? 20))
        setStartingBalance(Number(vals?.[5] ?? 0))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Basic + DA" value={basicMonthly} onChange={setBasicMonthly} prefix="₹" step={500} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Employee Contribution" value={employeePct} onChange={setEmployeePct} suffix="%" step={0.5} />
            <InputGroup label="Employer Contribution" value={employerPct} onChange={setEmployerPct} suffix="%" step={0.5} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Annual Interest" value={interest} onChange={setInterest} suffix="%" step={0.05} />
            <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
          </div>
          <InputGroup label="Starting Balance (Optional)" value={startingBalance} onChange={setStartingBalance} prefix="₹" step={10_000} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Monthly Contribution" value={fmtNum(result.monthlyContrib)} prefix="₹" type="highlight" icon={Wallet} />
          <ResultCard label="Estimated Corpus" value={fmtNum(result.fv)} prefix="₹" type="success" icon={TrendingUp} />
        </div>
      }
    />
  )
}

export function VPFCalculator() {
  const [basicMonthly, setBasicMonthly] = useState(30_000)
  const [epfPct, setEpfPct] = useState(12)
  const [vpfExtraPct, setVpfExtraPct] = useState(10)
  const [employerPct, setEmployerPct] = useState(12)
  const [interest, setInterest] = useState(8.15)
  const [years, setYears] = useState(20)

  const result = useMemo(() => {
    const employee = clamp0(basicMonthly) * ((clamp0(epfPct) + clamp0(vpfExtraPct)) / 100)
    const employer = clamp0(basicMonthly) * (clamp0(employerPct) / 100)
    const monthlyContrib = employee + employer
    const months = Math.round(clamp0(years) * 12)
    const fv = fvOfMonthlyContrib(monthlyContrib, interest, months)
    return { employee, employer, monthlyContrib, fv }
  }, [basicMonthly, epfPct, vpfExtraPct, employerPct, interest, years])

  return (
    <FinancialCalculatorTemplate
      title="VPF Calculator"
      description="Estimate corpus with Voluntary Provident Fund (VPF) extra contribution."
      icon={PiggyBank}
      calculate={() => {}}
      values={[basicMonthly, epfPct, vpfExtraPct, employerPct, interest, years]}
      onClear={() => {
        setBasicMonthly(30_000)
        setEpfPct(12)
        setVpfExtraPct(10)
        setEmployerPct(12)
        setInterest(8.15)
        setYears(20)
      }}
      onRestoreAction={(vals) => {
        setBasicMonthly(Number(vals?.[0] ?? 30_000))
        setEpfPct(Number(vals?.[1] ?? 12))
        setVpfExtraPct(Number(vals?.[2] ?? 10))
        setEmployerPct(Number(vals?.[3] ?? 12))
        setInterest(Number(vals?.[4] ?? 8.15))
        setYears(Number(vals?.[5] ?? 20))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Basic + DA" value={basicMonthly} onChange={setBasicMonthly} prefix="₹" step={500} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="EPF %" value={epfPct} onChange={setEpfPct} suffix="%" step={0.5} />
            <InputGroup label="VPF Extra %" value={vpfExtraPct} onChange={setVpfExtraPct} suffix="%" step={0.5} />
            <InputGroup label="Employer %" value={employerPct} onChange={setEmployerPct} suffix="%" step={0.5} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Annual Interest" value={interest} onChange={setInterest} suffix="%" step={0.05} />
            <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Employee (Monthly)" value={fmtNum(result.employee)} prefix="₹" type="highlight" />
          <ResultCard label="Employer (Monthly)" value={fmtNum(result.employer)} prefix="₹" />
          <ResultCard label="Estimated Corpus" value={fmtNum(result.fv)} prefix="₹" type="success" icon={TrendingUp} />
        </div>
      }
    />
  )
}

export function InflationPensionCalculator() {
  const [monthlyPensionToday, setMonthlyPensionToday] = useState(30_000)
  const [inflation, setInflation] = useState(6)
  const [years, setYears] = useState(20)

  const result = useMemo(() => {
    const t = clamp0(years)
    const inf = clamp0(inflation) / 100
    const futureMonthly = clamp0(monthlyPensionToday) * Math.pow(1 + inf, t)
    return { futureMonthly }
  }, [monthlyPensionToday, inflation, years])

  return (
    <FinancialCalculatorTemplate
      title="Inflation-Adjusted Pension"
      description="Estimate the pension you’d need in the future to match today’s purchasing power."
      icon={BadgePercent}
      calculate={() => {}}
      values={[monthlyPensionToday, inflation, years]}
      onClear={() => {
        setMonthlyPensionToday(30_000)
        setInflation(6)
        setYears(20)
      }}
      onRestoreAction={(vals) => {
        setMonthlyPensionToday(Number(vals?.[0] ?? 30_000))
        setInflation(Number(vals?.[1] ?? 6))
        setYears(Number(vals?.[2] ?? 20))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Pension (Today)" value={monthlyPensionToday} onChange={setMonthlyPensionToday} prefix="₹" step={500} />
          <InputGroup label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
          <InputGroup label="Years Until Retirement" value={years} onChange={setYears} suffix="Years" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Future Equivalent (Monthly)" value={fmtNum(result.futureMonthly)} prefix="₹" type="success" icon={TrendingUp} />
          <ResultCard
            label="Future Equivalent (Yearly)"
            value={fmtNum(result.futureMonthly * 12)}
            prefix="₹"
            type="highlight"
          />
        </div>
      }
    />
  )
}

export function SuperannuationCalculator() {
  const [annualContribution, setAnnualContribution] = useState(1_00_000)
  const [years, setYears] = useState(20)
  const [returnRate, setReturnRate] = useState(8)

  const result = useMemo(() => {
    const n = Math.round(clamp0(years))
    const r = clamp0(returnRate) / 100
    const pmt = clamp0(annualContribution)
    let fv = 0
    for (let i = 0; i < n; i++) {
      fv = (fv + pmt) * (1 + r)
    }
    return { fv }
  }, [annualContribution, years, returnRate])

  return (
    <FinancialCalculatorTemplate
      title="Superannuation Calculator"
      description="Estimate the future value of yearly superannuation contributions."
      icon={Briefcase}
      calculate={() => {}}
      values={[annualContribution, years, returnRate]}
      onClear={() => {
        setAnnualContribution(1_00_000)
        setYears(20)
        setReturnRate(8)
      }}
      onRestoreAction={(vals) => {
        setAnnualContribution(Number(vals?.[0] ?? 1_00_000))
        setYears(Number(vals?.[1] ?? 20))
        setReturnRate(Number(vals?.[2] ?? 8))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Yearly Contribution" value={annualContribution} onChange={setAnnualContribution} prefix="₹" step={10_000} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
          <InputGroup label="Expected Return" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Corpus" value={fmtNum(result.fv)} prefix="₹" type="success" icon={TrendingUp} />
          <ResultCard label="Total Contributions" value={fmtNum(clamp0(annualContribution) * clamp0(years))} prefix="₹" />
        </div>
      }
    />
  )
}

export function PostRetirementBudget() {
  const [pensionMonthly, setPensionMonthly] = useState(40_000)
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState(10_000)
  const [housing, setHousing] = useState(15_000)
  const [food, setFood] = useState(12_000)
  const [medical, setMedical] = useState(8_000)
  const [utilities, setUtilities] = useState(4_000)
  const [travel, setTravel] = useState(5_000)
  const [misc, setMisc] = useState(6_000)

  const result = useMemo(() => {
    const income = clamp0(pensionMonthly) + clamp0(otherIncomeMonthly)
    const expense = clamp0(housing) + clamp0(food) + clamp0(medical) + clamp0(utilities) + clamp0(travel) + clamp0(misc)
    const surplus = income - expense
    return { income, expense, surplus }
  }, [pensionMonthly, otherIncomeMonthly, housing, food, medical, utilities, travel, misc])

  return (
    <FinancialCalculatorTemplate
      title="Post-Retirement Budget"
      description="Plan your monthly retirement income vs expenses."
      icon={Wallet}
      calculate={() => {}}
      values={[pensionMonthly, otherIncomeMonthly, housing, food, medical, utilities, travel, misc]}
      onClear={() => {
        setPensionMonthly(40_000)
        setOtherIncomeMonthly(10_000)
        setHousing(15_000)
        setFood(12_000)
        setMedical(8_000)
        setUtilities(4_000)
        setTravel(5_000)
        setMisc(6_000)
      }}
      onRestoreAction={(vals) => {
        setPensionMonthly(Number(vals?.[0] ?? 40_000))
        setOtherIncomeMonthly(Number(vals?.[1] ?? 10_000))
        setHousing(Number(vals?.[2] ?? 15_000))
        setFood(Number(vals?.[3] ?? 12_000))
        setMedical(Number(vals?.[4] ?? 8_000))
        setUtilities(Number(vals?.[5] ?? 4_000))
        setTravel(Number(vals?.[6] ?? 5_000))
        setMisc(Number(vals?.[7] ?? 6_000))
      }}
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Monthly Pension" value={pensionMonthly} onChange={setPensionMonthly} prefix="₹" step={500} />
            <InputGroup label="Other Monthly Income" value={otherIncomeMonthly} onChange={setOtherIncomeMonthly} prefix="₹" step={500} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Housing" value={housing} onChange={setHousing} prefix="₹" step={500} />
            <InputGroup label="Food" value={food} onChange={setFood} prefix="₹" step={500} />
            <InputGroup label="Medical" value={medical} onChange={setMedical} prefix="₹" step={500} />
            <InputGroup label="Utilities" value={utilities} onChange={setUtilities} prefix="₹" step={500} />
            <InputGroup label="Travel" value={travel} onChange={setTravel} prefix="₹" step={500} />
            <InputGroup label="Misc" value={misc} onChange={setMisc} prefix="₹" step={500} />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Monthly Income" value={fmtNum(result.income)} prefix="₹" type="highlight" />
          <ResultCard label="Monthly Expense" value={fmtNum(result.expense)} prefix="₹" />
          <ResultCard
            label={result.surplus >= 0 ? "Monthly Surplus" : "Monthly Shortfall"}
            value={fmtNum(Math.abs(result.surplus))}
            prefix="₹"
            type={result.surplus >= 0 ? "success" : "warning"}
            icon={result.surplus >= 0 ? TrendingUp : Activity}
          />
        </div>
      }
    />
  )
}

export function SWPTaxCalculator() {
  const [cost, setCost] = useState(10_00_000)
  const [currentValue, setCurrentValue] = useState(15_00_000)
  const [withdrawal, setWithdrawal] = useState(1_20_000)
  const [taxRate, setTaxRate] = useState(10)

  const result = useMemo(() => {
    const c = clamp0(cost)
    const v = Math.max(c, clamp0(currentValue))
    const w = Math.min(clamp0(withdrawal), v)
    const gainsPortion = v > 0 ? (Math.max(0, v - c) / v) * w : 0
    const tax = gainsPortion * (clamp0(taxRate) / 100)
    const net = w - tax
    return { gainsPortion, tax, net }
  }, [cost, currentValue, withdrawal, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="SWP Tax Calculator"
      description="Rough estimate of tax on withdrawals based on gains proportion (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      values={[cost, currentValue, withdrawal, taxRate]}
      onClear={() => {
        setCost(10_00_000)
        setCurrentValue(15_00_000)
        setWithdrawal(1_20_000)
        setTaxRate(10)
      }}
      onRestoreAction={(vals) => {
        setCost(Number(vals?.[0] ?? 10_00_000))
        setCurrentValue(Number(vals?.[1] ?? 15_00_000))
        setWithdrawal(Number(vals?.[2] ?? 1_20_000))
        setTaxRate(Number(vals?.[3] ?? 10))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Total Cost (Invested)" value={cost} onChange={setCost} prefix="₹" step={10_000} />
          <InputGroup label="Current Value" value={currentValue} onChange={setCurrentValue} prefix="₹" step={10_000} />
          <InputGroup label="Annual Withdrawal" value={withdrawal} onChange={setWithdrawal} prefix="₹" step={5_000} />
          <InputGroup label="Tax Rate (Approx)" value={taxRate} onChange={setTaxRate} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Taxable Gains Portion" value={fmtNum(result.gainsPortion)} prefix="₹" type="highlight" />
          <ResultCard label="Estimated Tax" value={fmtNum(result.tax)} prefix="₹" type="warning" />
          <ResultCard label="Net Withdrawal" value={fmtNum(result.net)} prefix="₹" type="success" />
        </div>
      }
    />
  )
}

export function NPSTier2Calculator() {
  const [lumpSum, setLumpSum] = useState(5_00_000)
  const [monthlyAdd, setMonthlyAdd] = useState(5_000)
  const [years, setYears] = useState(10)
  const [returnRate, setReturnRate] = useState(10)

  const result = useMemo(() => {
    const t = clamp0(years)
    const months = Math.round(t * 12)
    const fvMonthly = fvOfMonthlyContrib(monthlyAdd, returnRate, months)
    const fvStart = clamp0(lumpSum) * Math.pow(1 + monthlyRate(returnRate), months)
    return { fv: fvStart + fvMonthly }
  }, [lumpSum, monthlyAdd, years, returnRate])

  return (
    <FinancialCalculatorTemplate
      title="NPS Tier-2 Calculator"
      description="Estimate corpus growth for NPS Tier-2 style investing (simplified)."
      icon={TrendingUp}
      calculate={() => {}}
      values={[lumpSum, monthlyAdd, years, returnRate]}
      onClear={() => {
        setLumpSum(5_00_000)
        setMonthlyAdd(5_000)
        setYears(10)
        setReturnRate(10)
      }}
      onRestoreAction={(vals) => {
        setLumpSum(Number(vals?.[0] ?? 5_00_000))
        setMonthlyAdd(Number(vals?.[1] ?? 5_000))
        setYears(Number(vals?.[2] ?? 10))
        setReturnRate(Number(vals?.[3] ?? 10))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Starting Amount" value={lumpSum} onChange={setLumpSum} prefix="₹" step={10_000} />
          <InputGroup label="Monthly Add" value={monthlyAdd} onChange={setMonthlyAdd} prefix="₹" step={500} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
          <InputGroup label="Expected Return" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Value" value={fmtNum(result.fv)} prefix="₹" type="success" icon={TrendingUp} />
          <ResultCard label="Total Invested" value={fmtNum(clamp0(lumpSum) + clamp0(monthlyAdd) * clamp0(years) * 12)} prefix="₹" />
        </div>
      }
    />
  )
}

export function RetirementShortfall() {
  const [targetCorpus, setTargetCorpus] = useState(2_00_00_000)
  const [currentSavings, setCurrentSavings] = useState(10_00_000)
  const [monthlySaving, setMonthlySaving] = useState(25_000)
  const [years, setYears] = useState(20)
  const [returnRate, setReturnRate] = useState(10)
  const [inflation, setInflation] = useState(6)

  const result = useMemo(() => {
    const t = clamp0(years)
    const months = Math.round(t * 12)
    const fvStart = clamp0(currentSavings) * Math.pow(1 + monthlyRate(returnRate), months)
    const fvAdd = fvOfMonthlyContrib(monthlySaving, returnRate, months)
    const expected = fvStart + fvAdd
    const futureTarget = clamp0(targetCorpus) * Math.pow(1 + clamp0(inflation) / 100, t)
    const shortfall = Math.max(0, futureTarget - expected)

    // Year-wise schedule (computed via month-by-month simulation)
    const schedule: Array<{ year: number; corpus: number; target: number; shortfall: number }> = []
    let balance = clamp0(currentSavings)
    const rm = monthlyRate(returnRate)
    const inf = clamp0(inflation) / 100
    const baseTarget = clamp0(targetCorpus)

    for (let m = 1; m <= months; m++) {
      balance += clamp0(monthlySaving)
      balance += balance * rm

      if (m % 12 === 0 || m === months) {
        const y = Math.ceil(m / 12)
        const targetY = baseTarget * Math.pow(1 + inf, y)
        schedule.push({
          year: y,
          corpus: Math.round(balance),
          target: Math.round(targetY),
          shortfall: Math.max(0, Math.round(targetY - balance))
        })
      }
    }

    return { expected, futureTarget, shortfall, schedule }
  }, [targetCorpus, currentSavings, monthlySaving, years, returnRate, inflation])

  const handleDownload = (format: string, options?: any) => {
    let scheduleData = [...result.schedule]

    if (options?.scheduleRange === '1yr') {
      scheduleData = scheduleData.slice(0, 1)
    } else if (options?.scheduleRange === '5yr') {
      scheduleData = scheduleData.slice(0, 5)
    } else if (options?.scheduleRange === 'custom' && options.customRangeStart && options.customRangeEnd) {
      const start = Math.max(0, options.customRangeStart - 1)
      const end = Math.min(scheduleData.length, options.customRangeEnd)
      scheduleData = scheduleData.slice(start, end)
    }

    const headers = ['Year', 'Projected Corpus', 'Inflation-Adjusted Target', 'Shortfall']
    const data = scheduleData.map((row) => [row.year, row.corpus, row.target, row.shortfall])

    generateReport(format, 'retirement_shortfall_report', headers, data, 'Retirement Shortfall Report', {
      'Target Corpus (Today)': `₹${targetCorpus}`,
      'Inflation (p.a.)': `${inflation}%`,
      'Time Horizon': `${years} years`,
      'Expected Return (p.a.)': `${returnRate}%`,
      'Current Savings': `₹${currentSavings}`,
      'Monthly Investment': `₹${monthlySaving}`,
      'Inflation-Adjusted Target (Future)': `₹${Math.round(result.futureTarget)}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Retirement Shortfall Calculator"
      description="Estimate whether your plan meets your inflation-adjusted target retirement corpus."
      icon={TrendingUp}
      calculate={() => {}}
      onDownload={handleDownload}
      values={[targetCorpus, currentSavings, monthlySaving, years, returnRate, inflation]}
      onClear={() => {
        setTargetCorpus(2_00_00_000)
        setCurrentSavings(10_00_000)
        setMonthlySaving(25_000)
        setYears(20)
        setReturnRate(10)
        setInflation(6)
      }}
      onRestoreAction={(vals) => {
        setTargetCorpus(Number(vals?.[0] ?? 2_00_00_000))
        setCurrentSavings(Number(vals?.[1] ?? 10_00_000))
        setMonthlySaving(Number(vals?.[2] ?? 25_000))
        setYears(Number(vals?.[3] ?? 20))
        setReturnRate(Number(vals?.[4] ?? 10))
        setInflation(Number(vals?.[5] ?? 6))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Target Corpus" value={targetCorpus} onChange={setTargetCorpus} prefix="₹" step={100_000} />
          <InputGroup label="Current Savings" value={currentSavings} onChange={setCurrentSavings} prefix="₹" step={50_000} />
          <InputGroup label="Monthly Investment" value={monthlySaving} onChange={setMonthlySaving} prefix="₹" step={500} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
            <InputGroup label="Expected Return" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
          </div>
          <InputGroup label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} helpText="Used to inflate target corpus" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Projected Corpus" value={fmtNum(result.expected)} prefix="₹" type="highlight" />
          <ResultCard label="Inflation-Adjusted Target" value={fmtNum(result.futureTarget)} prefix="₹" />
          <ResultCard label="Estimated Shortfall" value={fmtNum(result.shortfall)} prefix="₹" type={result.shortfall > 0 ? "warning" : "success"} />
        </div>
      }
      schedule={
        <table className="min-w-[760px] w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Year</th>
              <th className="text-right p-3">Projected Corpus</th>
              <th className="text-right p-3">Target (Inflation-Adjusted)</th>
              <th className="text-right p-3">Shortfall</th>
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((row) => (
              <tr key={row.year} className="border-b last:border-b-0">
                <td className="p-3">{row.year}</td>
                <td className="p-3 text-right">₹{row.corpus.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right">₹{row.target.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right">₹{row.shortfall.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    />
  )
}

export function EarlyRetirementCalculator() {
  const [annualExpenseToday, setAnnualExpenseToday] = useState(6_00_000)
  const [currentSavings, setCurrentSavings] = useState(10_00_000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(25_000)
  const [returnRate, setReturnRate] = useState(10)
  const [yearsToFI, setYearsToFI] = useState(15)
  const [inflation, setInflation] = useState(6)
  const [swr, setSwr] = useState(4)

  const result = useMemo(() => {
    const t = clamp0(yearsToFI)
    const months = Math.round(t * 12)
    const inf = clamp0(inflation) / 100
    const futureExpense = clamp0(annualExpenseToday) * Math.pow(1 + inf, t)
    const fiNumber = clamp0(swr) > 0 ? futureExpense / (clamp0(swr) / 100) : 0

    const rm = monthlyRate(returnRate)
    const pvGrowth = clamp0(currentSavings) * Math.pow(1 + rm, months)
    const fvGap = Math.max(0, fiNumber - pvGrowth)
    const annuityFactor = rm === 0 ? months : (Math.pow(1 + rm, months) - 1) / rm
    const requiredMonthly = annuityFactor > 0 ? fvGap / annuityFactor : 0

    const schedule: Array<{ year: number; corpus: number; required: number; annualExpense: number }> = []
    let balance = clamp0(currentSavings)
    let expense = clamp0(annualExpenseToday)
    let achievedYear: number | null = null

    for (let m = 1; m <= months; m++) {
      if (m % 12 === 1 && m > 1) {
        expense = expense * (1 + inf)
      }

      balance += clamp0(monthlyInvestment)
      balance += balance * rm

      if (m % 12 === 0 || m === months) {
        const y = Math.ceil(m / 12)
        const required = clamp0(swr) > 0 ? (expense / (clamp0(swr) / 100)) : 0
        const corpus = Math.round(balance)
        schedule.push({
          year: y,
          corpus,
          required: Math.round(required),
          annualExpense: Math.round(expense)
        })
        if (achievedYear === null && required > 0 && corpus >= required) {
          achievedYear = y
        }
      }
    }

    const projectedCorpus = schedule.length ? schedule[schedule.length - 1].corpus : Math.round(pvGrowth)
    const targetMet = projectedCorpus >= fiNumber && fiNumber > 0

    return {
      futureExpense: Math.round(futureExpense),
      fiNumber: Math.round(fiNumber),
      projectedCorpus,
      targetMet,
      achievedYear,
      requiredMonthly: Math.round(requiredMonthly),
      schedule
    }
  }, [annualExpenseToday, currentSavings, monthlyInvestment, returnRate, yearsToFI, inflation, swr])

  const handleDownload = (format: string, options?: any) => {
    let scheduleData = [...result.schedule]

    if (options?.scheduleRange === '1yr') {
      scheduleData = scheduleData.slice(0, 1)
    } else if (options?.scheduleRange === '5yr') {
      scheduleData = scheduleData.slice(0, 5)
    } else if (options?.scheduleRange === 'custom' && options.customRangeStart && options.customRangeEnd) {
      const start = Math.max(0, options.customRangeStart - 1)
      const end = Math.min(scheduleData.length, options.customRangeEnd)
      scheduleData = scheduleData.slice(start, end)
    }

    const headers = ['Year', 'Corpus', 'Required FI Corpus', 'Annual Expense (Infl. adj.)']
    const data = scheduleData.map((row) => [row.year, row.corpus, row.required, row.annualExpense])

    generateReport(format, 'fire_pro_report', headers, data, 'FIRE Calculator (Pro) Report', {
      'Annual Expense (Today)': `₹${annualExpenseToday}`,
      'Current Savings': `₹${currentSavings}`,
      'Monthly Investment': `₹${monthlyInvestment}`,
      'Expected Return (p.a.)': `${returnRate}%`,
      'Inflation (p.a.)': `${inflation}%`,
      'Safe Withdrawal Rate': `${swr}%`,
      'Target Horizon': `${yearsToFI} years`,
      'FI Number (at horizon)': `₹${result.fiNumber}`,
      'Projected Corpus (at horizon)': `₹${result.projectedCorpus}`,
      'Meets FI by horizon': result.targetMet ? 'Yes' : 'No'
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="FIRE Calculator (Pro)"
      description="Estimate your Financial Independence (FI) number using a safe withdrawal rate."
      icon={TrendingUp}
      calculate={() => {}}
      onDownload={handleDownload}
      values={[annualExpenseToday, currentSavings, monthlyInvestment, returnRate, yearsToFI, inflation, swr]}
      onClear={() => {
        setAnnualExpenseToday(6_00_000)
        setCurrentSavings(10_00_000)
        setMonthlyInvestment(25_000)
        setReturnRate(10)
        setYearsToFI(15)
        setInflation(6)
        setSwr(4)
      }}
      onRestoreAction={(vals) => {
        setAnnualExpenseToday(Number(vals?.[0] ?? 6_00_000))
        setCurrentSavings(Number(vals?.[1] ?? 10_00_000))
        setMonthlyInvestment(Number(vals?.[2] ?? 25_000))
        setReturnRate(Number(vals?.[3] ?? 10))
        setYearsToFI(Number(vals?.[4] ?? 15))
        setInflation(Number(vals?.[5] ?? 6))
        setSwr(Number(vals?.[6] ?? 4))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Expenses (Today)" value={annualExpenseToday} onChange={setAnnualExpenseToday} prefix="₹" step={10_000} />
          <InputGroup label="Current Savings" value={currentSavings} onChange={setCurrentSavings} prefix="₹" step={50_000} />
          <InputGroup label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} prefix="₹" step={500} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Expected Return" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
            <InputGroup label="Years to FI" value={yearsToFI} onChange={setYearsToFI} suffix="Years" step={1} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
            <InputGroup label="Safe Withdrawal Rate" value={swr} onChange={setSwr} suffix="%" step={0.1} helpText="Common assumption: 3%–4%" />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Future Annual Expenses" value={fmtNum(result.futureExpense)} prefix="₹" type="highlight" />
          <ResultCard label="FI Number (at horizon)" value={fmtNum(result.fiNumber)} prefix="₹" />
          <ResultCard label="Projected Corpus (at horizon)" value={fmtNum(result.projectedCorpus)} prefix="₹" type={result.targetMet ? "success" : "warning"} icon={PiggyBank} />
          <ResultCard label="FI Achieved" value={result.achievedYear ? `${result.achievedYear} years` : "Not yet"} type={result.achievedYear ? "success" : "warning"} />
          {!result.targetMet && (
            <div className="md:col-span-4">
              <ResultCard label="Suggested Monthly Investment (to meet horizon)" value={fmtNum(result.requiredMonthly)} prefix="₹" type="highlight" />
            </div>
          )}
        </div>
      }
      schedule={
        <table className="min-w-[760px] w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Year</th>
              <th className="text-right p-3">Corpus</th>
              <th className="text-right p-3">Required FI Corpus</th>
              <th className="text-right p-3">Annual Expense</th>
            </tr>
          </thead>
          <tbody>
            {result.schedule.map((row) => (
              <tr key={row.year} className="border-b last:border-b-0">
                <td className="p-3">{row.year}</td>
                <td className="p-3 text-right">₹{row.corpus.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right">₹{row.required.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right">₹{row.annualExpense.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    />
  )
}

export function GratuityCalculator() {
  const [lastDrawnSalary, setLastDrawnSalary] = useState(50_000)
  const [yearsOfService, setYearsOfService] = useState(12)

  const result = useMemo(() => {
    const gratuity = (clamp0(lastDrawnSalary) * 15 * clamp0(yearsOfService)) / 26
    return { gratuity }
  }, [lastDrawnSalary, yearsOfService])

  return (
    <FinancialCalculatorTemplate
      title="Gratuity at Retirement"
      description="Estimate gratuity using the common formula: Salary × 15/26 × Years."
      icon={Briefcase}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Last Drawn Salary (Monthly)" value={lastDrawnSalary} onChange={setLastDrawnSalary} prefix="₹" step={500} />
          <InputGroup label="Years of Service" value={yearsOfService} onChange={setYearsOfService} suffix="Years" step={1} />
        </div>
      }
      result={<ResultCard label="Estimated Gratuity" value={fmtNum(result.gratuity)} prefix="₹" type="success" icon={PiggyBank} />}
    />
  )
}

export function LeaveEncashmentCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(50_000)
  const [unusedDays, setUnusedDays] = useState(60)

  const result = useMemo(() => {
    const amount = (clamp0(monthlySalary) / 30) * clamp0(unusedDays)
    return { amount }
  }, [monthlySalary, unusedDays])

  return (
    <FinancialCalculatorTemplate
      title="Leave Encashment at Retirement"
      description="Estimate leave encashment amount based on salary and unused leave days."
      icon={Calendar}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Salary" value={monthlySalary} onChange={setMonthlySalary} prefix="₹" step={500} />
          <InputGroup label="Unused Leave Days" value={unusedDays} onChange={setUnusedDays} suffix="Days" step={1} />
        </div>
      }
      result={<ResultCard label="Estimated Encashment" value={fmtNum(result.amount)} prefix="₹" type="highlight" />}
    />
  )
}

export function VRSCompensationCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(60_000)
  const [exGratiaMonths, setExGratiaMonths] = useState(12)
  const [noticePayMonths, setNoticePayMonths] = useState(2)
  const [otherBenefits, setOtherBenefits] = useState(0)

  const result = useMemo(() => {
    const exGratia = clamp0(monthlySalary) * clamp0(exGratiaMonths)
    const noticePay = clamp0(monthlySalary) * clamp0(noticePayMonths)
    const total = exGratia + noticePay + clamp0(otherBenefits)
    return { exGratia, noticePay, total }
  }, [monthlySalary, exGratiaMonths, noticePayMonths, otherBenefits])

  return (
    <FinancialCalculatorTemplate
      title="VRS (Voluntary Retirement) Calculator"
      description="Estimate total VRS payout (simplified)."
      icon={Briefcase}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Salary" value={monthlySalary} onChange={setMonthlySalary} prefix="₹" step={500} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Ex-Gratia (Months)" value={exGratiaMonths} onChange={setExGratiaMonths} suffix="Months" step={1} />
            <InputGroup label="Notice Pay (Months)" value={noticePayMonths} onChange={setNoticePayMonths} suffix="Months" step={1} />
          </div>
          <InputGroup label="Other Benefits (Optional)" value={otherBenefits} onChange={setOtherBenefits} prefix="₹" step={5_000} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Ex-Gratia" value={fmtNum(result.exGratia)} prefix="₹" type="highlight" />
          <ResultCard label="Notice Pay" value={fmtNum(result.noticePay)} prefix="₹" />
          <ResultCard label="Estimated Total" value={fmtNum(result.total)} prefix="₹" type="success" />
        </div>
      }
    />
  )
}

export function SeniorCitizenSavingsScheme() {
  const [principal, setPrincipal] = useState(10_00_000)
  const [rate, setRate] = useState(8.2)
  const [tenure, setTenure] = useState(5)

  const result = useMemo(() => {
    const yearlyInterest = clamp0(principal) * (clamp0(rate) / 100)
    const quarterlyInterest = yearlyInterest / 4
    const totalInterest = yearlyInterest * clamp0(tenure)
    return { yearlyInterest, quarterlyInterest, totalInterest }
  }, [principal, rate, tenure])

  return (
    <FinancialCalculatorTemplate
      title="SCSS (Senior Citizen Savings Scheme)"
      description="Estimate interest payouts for SCSS (simplified)."
      icon={Shield}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Deposit Amount" value={principal} onChange={setPrincipal} prefix="₹" step={10_000} />
          <InputGroup label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
          <InputGroup label="Tenure" value={tenure} onChange={setTenure} suffix="Years" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Quarterly Interest" value={fmtNum(result.quarterlyInterest)} prefix="₹" type="highlight" />
          <ResultCard label="Yearly Interest" value={fmtNum(result.yearlyInterest)} prefix="₹" />
          <ResultCard label="Total Interest" value={fmtNum(result.totalInterest)} prefix="₹" type="success" />
        </div>
      }
    />
  )
}

export function PMVVYSchemeCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(10_00_000)
  const [rate, setRate] = useState(7.4)
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "half-yearly" | "yearly">("monthly")

  const result = useMemo(() => {
    const yearlyPension = clamp0(purchasePrice) * (clamp0(rate) / 100)
    const divisor = frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : frequency === "half-yearly" ? 2 : 1
    const payout = yearlyPension / divisor
    return { yearlyPension, payout }
  }, [purchasePrice, rate, frequency])

  return (
    <FinancialCalculatorTemplate
      title="PMVVY Scheme Calculator"
      description="Estimate pension payout from PMVVY-style annuity (simplified)."
      icon={Shield}
      calculate={() => {}}
      values={[purchasePrice, rate, frequency]}
      onClear={() => {
        setPurchasePrice(15_00_000)
        setRate(7.4)
        setFrequency("monthly")
      }}
      onRestoreAction={(vals) => {
        setPurchasePrice(Number(vals?.[0] ?? 15_00_000))
        setRate(Number(vals?.[1] ?? 7.4))
        setFrequency(typeof vals?.[2] === "string" ? (vals[2] as any) : "monthly")
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="₹" step={10_000} />
          <InputGroup label="Annual Rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Payout Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-Yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Payout per Period" value={fmtNum(result.payout)} prefix="₹" type="success" icon={TrendingUp} />
          <ResultCard label="Yearly Pension" value={fmtNum(result.yearlyPension)} prefix="₹" type="highlight" />
        </div>
      }
    />
  )
}

export function ReverseMortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState(80_00_000)
  const [ltv, setLtv] = useState(60)
  const [rate, setRate] = useState(10)
  const [tenureYears, setTenureYears] = useState(15)

  const result = useMemo(() => {
    const pv = clamp0(propertyValue) * (clamp0(ltv) / 100)
    const months = Math.round(clamp0(tenureYears) * 12)
    const monthlyPayout = pmtFromPV(pv, rate, months)
    return { eligibleLoan: pv, monthlyPayout }
  }, [propertyValue, ltv, rate, tenureYears])

  return (
    <FinancialCalculatorTemplate
      title="Reverse Mortgage Calculator"
      description="Estimate a monthly payout based on property value and LTV (simplified)."
      icon={Home}
      calculate={() => {}}
      values={[propertyValue, ltv, rate, tenureYears]}
      onClear={() => {
        setPropertyValue(80_00_000)
        setLtv(60)
        setRate(10)
        setTenureYears(15)
      }}
      onRestoreAction={(vals) => {
        setPropertyValue(Number(vals?.[0] ?? 80_00_000))
        setLtv(Number(vals?.[1] ?? 60))
        setRate(Number(vals?.[2] ?? 10))
        setTenureYears(Number(vals?.[3] ?? 15))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Property Value" value={propertyValue} onChange={setPropertyValue} prefix="₹" step={50_000} />
          <InputGroup label="Loan-to-Value (LTV)" value={ltv} onChange={setLtv} suffix="%" step={1} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Interest Rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
            <InputGroup label="Tenure" value={tenureYears} onChange={setTenureYears} suffix="Years" step={1} />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Eligible Loan (Approx)" value={fmtNum(result.eligibleLoan)} prefix="₹" type="highlight" />
          <ResultCard label="Monthly Payout (Approx)" value={fmtNum(result.monthlyPayout)} prefix="₹" type="success" icon={Wallet} />
        </div>
      }
    />
  )
}

export function MedicalInflationCalculator() {
  const [annualCostToday, setAnnualCostToday] = useState(1_00_000)
  const [inflation, setInflation] = useState(10)
  const [years, setYears] = useState(20)

  const result = useMemo(() => {
    const fv = clamp0(annualCostToday) * Math.pow(1 + clamp0(inflation) / 100, clamp0(years))
    return { fv }
  }, [annualCostToday, inflation, years])

  return (
    <FinancialCalculatorTemplate
      title="Medical Inflation Calculator"
      description="Project future medical expenses using medical inflation."
      icon={HeartPulse}
      calculate={() => {}}
      values={[annualCostToday, inflation, years]}
      onClear={() => {
        setAnnualCostToday(1_00_000)
        setInflation(10)
        setYears(20)
      }}
      onRestoreAction={(vals) => {
        setAnnualCostToday(Number(vals?.[0] ?? 1_00_000))
        setInflation(Number(vals?.[1] ?? 10))
        setYears(Number(vals?.[2] ?? 20))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Medical Cost (Today)" value={annualCostToday} onChange={setAnnualCostToday} prefix="₹" step={5_000} />
          <InputGroup label="Medical Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
        </div>
      }
      result={<ResultCard label="Future Annual Cost" value={fmtNum(result.fv)} prefix="₹" type="warning" icon={Activity} />}
    />
  )
}

export function BucketStrategyCalculator() {
  const [corpus, setCorpus] = useState(1_50_00_000)
  const [annualExpense, setAnnualExpense] = useState(6_00_000)
  const [bucket1Years, setBucket1Years] = useState(3)
  const [bucket2Years, setBucket2Years] = useState(7)
  const [bucket3Years, setBucket3Years] = useState(10)

  const result = useMemo(() => {
    const b1 = clamp0(annualExpense) * clamp0(bucket1Years)
    const b2 = clamp0(annualExpense) * clamp0(bucket2Years)
    const b3 = clamp0(annualExpense) * clamp0(bucket3Years)
    const total = b1 + b2 + b3
    const remaining = Math.max(0, clamp0(corpus) - total)
    return { b1, b2, b3, total, remaining }
  }, [corpus, annualExpense, bucket1Years, bucket2Years, bucket3Years])

  return (
    <FinancialCalculatorTemplate
      title="Retirement Bucket Strategy"
      description="Split your corpus into short/medium/long-term buckets (simplified)."
      icon={PiggyBank}
      calculate={() => {}}
      values={[corpus, annualExpense, bucket1Years, bucket2Years, bucket3Years]}
      onClear={() => {
        setCorpus(1_50_00_000)
        setAnnualExpense(6_00_000)
        setBucket1Years(3)
        setBucket2Years(7)
        setBucket3Years(10)
      }}
      onRestoreAction={(vals) => {
        setCorpus(Number(vals?.[0] ?? 1_50_00_000))
        setAnnualExpense(Number(vals?.[1] ?? 6_00_000))
        setBucket1Years(Number(vals?.[2] ?? 3))
        setBucket2Years(Number(vals?.[3] ?? 7))
        setBucket3Years(Number(vals?.[4] ?? 10))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Total Corpus" value={corpus} onChange={setCorpus} prefix="₹" step={200_000} />
          <InputGroup label="Annual Expenses" value={annualExpense} onChange={setAnnualExpense} prefix="₹" step={10_000} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Bucket 1 (Years)" value={bucket1Years} onChange={setBucket1Years} suffix="Years" step={1} />
            <InputGroup label="Bucket 2 (Years)" value={bucket2Years} onChange={setBucket2Years} suffix="Years" step={1} />
            <InputGroup label="Bucket 3 (Years)" value={bucket3Years} onChange={setBucket3Years} suffix="Years" step={1} />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResultCard label="Bucket 1" value={fmtNum(result.b1)} prefix="₹" type="highlight" />
          <ResultCard label="Bucket 2" value={fmtNum(result.b2)} prefix="₹" />
          <ResultCard label="Bucket 3" value={fmtNum(result.b3)} prefix="₹" />
          <ResultCard label="Remaining" value={fmtNum(result.remaining)} prefix="₹" type={result.remaining > 0 ? "success" : "warning"} />
        </div>
      }
    />
  )
}

export function AnnuityYieldCalculator() {
  const [corpus, setCorpus] = useState(50_00_000)
  const [rate, setRate] = useState(6)

  const result = useMemo(() => {
    const yearly = clamp0(corpus) * (clamp0(rate) / 100)
    return { yearly, monthly: yearly / 12 }
  }, [corpus, rate])

  return (
    <FinancialCalculatorTemplate
      title="Annuity Yield Calculator"
      description="Estimate annuity payout from a corpus and annuity rate (simplified)."
      icon={Shield}
      calculate={() => {}}
      values={[corpus, rate]}
      onClear={() => {
        setCorpus(50_00_000)
        setRate(6)
      }}
      onRestoreAction={(vals) => {
        setCorpus(Number(vals?.[0] ?? 50_00_000))
        setRate(Number(vals?.[1] ?? 6))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annuity Purchase Amount" value={corpus} onChange={setCorpus} prefix="₹" step={50_000} />
          <InputGroup label="Annuity Rate" value={rate} onChange={setRate} suffix="%" step={0.1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Monthly Payout" value={fmtNum(result.monthly)} prefix="₹" type="success" icon={Wallet} />
          <ResultCard label="Yearly Payout" value={fmtNum(result.yearly)} prefix="₹" type="highlight" />
        </div>
      }
    />
  )
}

export function LifeExpectancyCalculator() {
  const [currentAge, setCurrentAge] = useState(35)
  const [expectedLifespan, setExpectedLifespan] = useState(85)
  const [retirementAge, setRetirementAge] = useState(60)

  const result = useMemo(() => {
    const yearsLeft = Math.max(0, clamp0(expectedLifespan) - clamp0(currentAge))
    const yearsToRetire = Math.max(0, clamp0(retirementAge) - clamp0(currentAge))
    const yearsInRetirement = Math.max(0, clamp0(expectedLifespan) - clamp0(retirementAge))
    return { yearsLeft, yearsToRetire, yearsInRetirement }
  }, [currentAge, expectedLifespan, retirementAge])

  return (
    <FinancialCalculatorTemplate
      title="Life Expectancy Planner"
      description="Simple planning helper for years left, years to retire, and years in retirement."
      icon={Calendar}
      calculate={() => {}}
      values={[currentAge, expectedLifespan, retirementAge]}
      onClear={() => {
        setCurrentAge(35)
        setExpectedLifespan(85)
        setRetirementAge(60)
      }}
      onRestoreAction={(vals) => {
        setCurrentAge(Number(vals?.[0] ?? 35))
        setExpectedLifespan(Number(vals?.[1] ?? 85))
        setRetirementAge(Number(vals?.[2] ?? 60))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Current Age" value={currentAge} onChange={setCurrentAge} suffix="Years" step={1} />
          <InputGroup label="Expected Lifespan" value={expectedLifespan} onChange={setExpectedLifespan} suffix="Years" step={1} />
          <InputGroup label="Retirement Age" value={retirementAge} onChange={setRetirementAge} suffix="Years" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Years Left" value={fmtNum(result.yearsLeft)} suffix=" Years" type="highlight" />
          <ResultCard label="Years to Retire" value={fmtNum(result.yearsToRetire)} suffix=" Years" />
          <ResultCard label="Years in Retirement" value={fmtNum(result.yearsInRetirement)} suffix=" Years" type="success" />
        </div>
      }
    />
  )
}

export function TravelFundCalculator() {
  const [tripCostToday, setTripCostToday] = useState(2_00_000)
  const [years, setYears] = useState(5)
  const [inflation, setInflation] = useState(6)

  const result = useMemo(() => {
    const fv = clamp0(tripCostToday) * Math.pow(1 + clamp0(inflation) / 100, clamp0(years))
    return { fv }
  }, [tripCostToday, years, inflation])

  return (
    <FinancialCalculatorTemplate
      title="Travel Fund Planner"
      description="Project your travel budget into the future using inflation."
      icon={Plane}
      calculate={() => {}}
      values={[tripCostToday, years, inflation]}
      onClear={() => {
        setTripCostToday(2_00_000)
        setYears(5)
        setInflation(6)
      }}
      onRestoreAction={(vals) => {
        setTripCostToday(Number(vals?.[0] ?? 2_00_000))
        setYears(Number(vals?.[1] ?? 5))
        setInflation(Number(vals?.[2] ?? 6))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Trip Cost (Today)" value={tripCostToday} onChange={setTripCostToday} prefix="₹" step={5_000} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
          <InputGroup label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
        </div>
      }
      result={<ResultCard label="Future Budget" value={fmtNum(result.fv)} prefix="₹" type="highlight" icon={Plane} />}
    />
  )
}

export function LegacyPlannerCalculator() {
  const [desiredLegacy, setDesiredLegacy] = useState(1_00_00_000)
  const [years, setYears] = useState(15)
  const [returnRate, setReturnRate] = useState(8)

  const result = useMemo(() => {
    const pv = clamp0(desiredLegacy) / Math.pow(1 + clamp0(returnRate) / 100, clamp0(years))
    return { pv }
  }, [desiredLegacy, years, returnRate])

  return (
    <FinancialCalculatorTemplate
      title="Legacy Planner"
      description="Estimate how much you need today to leave a desired legacy (simplified)."
      icon={Shield}
      calculate={() => {}}
      values={[desiredLegacy, years, returnRate]}
      onClear={() => {
        setDesiredLegacy(1_00_00_000)
        setYears(15)
        setReturnRate(8)
      }}
      onRestoreAction={(vals) => {
        setDesiredLegacy(Number(vals?.[0] ?? 1_00_00_000))
        setYears(Number(vals?.[1] ?? 15))
        setReturnRate(Number(vals?.[2] ?? 8))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Desired Legacy (Future Value)" value={desiredLegacy} onChange={setDesiredLegacy} prefix="₹" step={100_000} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
          <InputGroup label="Expected Return" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
        </div>
      }
      result={<ResultCard label="Required Today (PV)" value={fmtNum(result.pv)} prefix="₹" type="success" icon={PiggyBank} />}
    />
  )
}

export function CareCostCalculator() {
  const [monthlyCostToday, setMonthlyCostToday] = useState(25_000)
  const [inflation, setInflation] = useState(8)
  const [yearsUntilNeeded, setYearsUntilNeeded] = useState(15)
  const [durationYears, setDurationYears] = useState(5)

  const result = useMemo(() => {
    const futureMonthly = clamp0(monthlyCostToday) * Math.pow(1 + clamp0(inflation) / 100, clamp0(yearsUntilNeeded))
    const totalNominal = futureMonthly * 12 * clamp0(durationYears)
    return { futureMonthly, totalNominal }
  }, [monthlyCostToday, inflation, yearsUntilNeeded, durationYears])

  return (
    <FinancialCalculatorTemplate
      title="Elder Care Cost Planner"
      description="Project future monthly care costs and total requirement (simplified)."
      icon={HeartPulse}
      calculate={() => {}}
      values={[monthlyCostToday, inflation, yearsUntilNeeded, durationYears]}
      onClear={() => {
        setMonthlyCostToday(25_000)
        setInflation(8)
        setYearsUntilNeeded(15)
        setDurationYears(5)
      }}
      onRestoreAction={(vals) => {
        setMonthlyCostToday(Number(vals?.[0] ?? 25_000))
        setInflation(Number(vals?.[1] ?? 8))
        setYearsUntilNeeded(Number(vals?.[2] ?? 15))
        setDurationYears(Number(vals?.[3] ?? 5))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Care Cost (Today)" value={monthlyCostToday} onChange={setMonthlyCostToday} prefix="₹" step={500} />
          <InputGroup label="Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Years Until Needed" value={yearsUntilNeeded} onChange={setYearsUntilNeeded} suffix="Years" step={1} />
            <InputGroup label="Duration" value={durationYears} onChange={setDurationYears} suffix="Years" step={1} />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Future Monthly Cost" value={fmtNum(result.futureMonthly)} prefix="₹" type="warning" icon={Activity} />
          <ResultCard label="Total (Nominal)" value={fmtNum(result.totalNominal)} prefix="₹" type="highlight" />
        </div>
      }
    />
  )
}

export function PensionTaxCalculator() {
  const [annualPension, setAnnualPension] = useState(6_00_000)
  const [taxRate, setTaxRate] = useState(10)

  const result = useMemo(() => {
    const tax = clamp0(annualPension) * (clamp0(taxRate) / 100)
    const net = clamp0(annualPension) - tax
    return { tax, net }
  }, [annualPension, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="Pension Tax Calculator"
      description="Estimate tax and net pension from an effective tax rate (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      values={[annualPension, taxRate]}
      onClear={() => {
        setAnnualPension(6_00_000)
        setTaxRate(10)
      }}
      onRestoreAction={(vals) => {
        setAnnualPension(Number(vals?.[0] ?? 6_00_000))
        setTaxRate(Number(vals?.[1] ?? 10))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Pension Income" value={annualPension} onChange={setAnnualPension} prefix="₹" step={10_000} />
          <InputGroup label="Effective Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Tax" value={fmtNum(result.tax)} prefix="₹" type="warning" />
          <ResultCard label="Net Pension" value={fmtNum(result.net)} prefix="₹" type="success" />
        </div>
      }
    />
  )
}

export function EPSPensionCalculator() {
  const [pensionableSalary, setPensionableSalary] = useState(15_000)
  const [serviceYears, setServiceYears] = useState(20)

  const result = useMemo(() => {
    const monthly = (clamp0(pensionableSalary) * clamp0(serviceYears)) / 70
    return { monthly, yearly: monthly * 12 }
  }, [pensionableSalary, serviceYears])

  return (
    <FinancialCalculatorTemplate
      title="EPS Pension Calculator"
      description="Estimate EPS pension using the common formula: Salary × Service / 70."
      icon={Shield}
      calculate={() => {}}
      values={[pensionableSalary, serviceYears]}
      onClear={() => {
        setPensionableSalary(15_000)
        setServiceYears(20)
      }}
      onRestoreAction={(vals) => {
        setPensionableSalary(Number(vals?.[0] ?? 15_000))
        setServiceYears(Number(vals?.[1] ?? 20))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Pensionable Salary" value={pensionableSalary} onChange={setPensionableSalary} prefix="₹" step={100} />
          <InputGroup label="Service Years" value={serviceYears} onChange={setServiceYears} suffix="Years" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Monthly Pension" value={fmtNum(result.monthly)} prefix="₹" type="success" icon={Wallet} />
          <ResultCard label="Yearly Pension" value={fmtNum(result.yearly)} prefix="₹" type="highlight" />
        </div>
      }
    />
  )
}

export function HealthPremiumProjector() {
  const [annualPremiumToday, setAnnualPremiumToday] = useState(25_000)
  const [inflation, setInflation] = useState(10)
  const [years, setYears] = useState(20)

  const result = useMemo(() => {
    const fv = clamp0(annualPremiumToday) * Math.pow(1 + clamp0(inflation) / 100, clamp0(years))
    return { fv, monthly: fv / 12 }
  }, [annualPremiumToday, inflation, years])

  return (
    <FinancialCalculatorTemplate
      title="Health Premium Projector"
      description="Project future health insurance premium using medical inflation (simplified)."
      icon={HeartPulse}
      calculate={() => {}}
      values={[annualPremiumToday, inflation, years]}
      onClear={() => {
        setAnnualPremiumToday(25_000)
        setInflation(10)
        setYears(20)
      }}
      onRestoreAction={(vals) => {
        setAnnualPremiumToday(Number(vals?.[0] ?? 25_000))
        setInflation(Number(vals?.[1] ?? 10))
        setYears(Number(vals?.[2] ?? 20))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Premium (Today)" value={annualPremiumToday} onChange={setAnnualPremiumToday} prefix="₹" step={500} />
          <InputGroup label="Medical Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Future Annual Premium" value={fmtNum(result.fv)} prefix="₹" type="warning" icon={Activity} />
          <ResultCard label="Future Monthly Premium" value={fmtNum(result.monthly)} prefix="₹" type="highlight" />
        </div>
      }
    />
  )
}
