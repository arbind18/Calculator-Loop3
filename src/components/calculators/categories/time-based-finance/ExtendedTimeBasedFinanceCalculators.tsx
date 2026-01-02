"use client"

import { useMemo, useState } from "react"
import { Calculator, Calendar, Clock, Repeat, Wallet } from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { VoiceDateInput } from "@/components/ui/VoiceDateInput"

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0)

const fmtMoney = (n: number, digits = 2) => {
  if (!Number.isFinite(n)) return "-"
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: digits })}`
}

const fmtNum = (n: number, digits = 2) => {
  if (!Number.isFinite(n)) return "-"
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits })
}

export function HourlyToAnnualCalculator() {
  const [hourlyRate, setHourlyRate] = useState(500)
  const [hoursPerWeek, setHoursPerWeek] = useState(40)
  const [weeksPerYear, setWeeksPerYear] = useState(52)

  const result = useMemo(() => {
    const annual = clamp0(hourlyRate) * clamp0(hoursPerWeek) * clamp0(weeksPerYear)
    return { annual, monthly: annual / 12 }
  }, [hourlyRate, hoursPerWeek, weeksPerYear])

  return (
    <FinancialCalculatorTemplate
      title="Hourly to Annual Salary"
      description="Convert an hourly rate into estimated annual and monthly earnings."
      icon={Wallet}
      calculate={() => {}}
      values={[hourlyRate, hoursPerWeek, weeksPerYear]}
      onClear={() => {
        setHourlyRate(500)
        setHoursPerWeek(40)
        setWeeksPerYear(52)
      }}
      onRestoreAction={(vals) => {
        setHourlyRate(Number(vals?.[0] ?? 500))
        setHoursPerWeek(Number(vals?.[1] ?? 40))
        setWeeksPerYear(Number(vals?.[2] ?? 52))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Hourly Rate" value={hourlyRate} onChange={setHourlyRate} prefix="₹" step={10} />
          <InputGroup label="Hours per Week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" step={1} />
          <InputGroup label="Weeks per Year" value={weeksPerYear} onChange={setWeeksPerYear} suffix="weeks" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Annual" value={fmtMoney(result.annual)} type="highlight" />
          <ResultCard label="Monthly" value={fmtMoney(result.monthly)} type="success" />
        </div>
      }
    />
  )
}

export function AnnualToHourlyCalculator() {
  const [annualSalary, setAnnualSalary] = useState(12_00_000)
  const [hoursPerWeek, setHoursPerWeek] = useState(40)
  const [weeksPerYear, setWeeksPerYear] = useState(52)

  const result = useMemo(() => {
    const denom = Math.max(1, clamp0(hoursPerWeek) * clamp0(weeksPerYear))
    const hourly = clamp0(annualSalary) / denom
    return { hourly }
  }, [annualSalary, hoursPerWeek, weeksPerYear])

  return (
    <FinancialCalculatorTemplate
      title="Annual to Hourly Rate"
      description="Convert an annual salary into an estimated hourly rate."
      icon={Wallet}
      calculate={() => {}}
      values={[annualSalary, hoursPerWeek, weeksPerYear]}
      onClear={() => {
        setAnnualSalary(12_00_000)
        setHoursPerWeek(40)
        setWeeksPerYear(52)
      }}
      onRestoreAction={(vals) => {
        setAnnualSalary(Number(vals?.[0] ?? 12_00_000))
        setHoursPerWeek(Number(vals?.[1] ?? 40))
        setWeeksPerYear(Number(vals?.[2] ?? 52))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Salary" value={annualSalary} onChange={setAnnualSalary} prefix="₹" step={10_000} />
          <InputGroup label="Hours per Week" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" step={1} />
          <InputGroup label="Weeks per Year" value={weeksPerYear} onChange={setWeeksPerYear} suffix="weeks" step={1} />
        </div>
      }
      result={<ResultCard label="Hourly Rate" value={fmtMoney(result.hourly)} type="highlight" />}
    />
  )
}

export function PayPeriodCalculator() {
  const [annualSalary, setAnnualSalary] = useState(12_00_000)
  const [periodsPerYear, setPeriodsPerYear] = useState(12)

  const result = useMemo(() => {
    const perPeriod = clamp0(annualSalary) / Math.max(1, clamp0(periodsPerYear))
    return { perPeriod }
  }, [annualSalary, periodsPerYear])

  return (
    <FinancialCalculatorTemplate
      title="Pay Period Calculator"
      description="Estimate salary per pay period (monthly/bi-weekly/weekly)."
      icon={Calculator}
      calculate={() => {}}
      values={[annualSalary, periodsPerYear]}
      onClear={() => {
        setAnnualSalary(12_00_000)
        setPeriodsPerYear(12)
      }}
      onRestoreAction={(vals) => {
        setAnnualSalary(Number(vals?.[0] ?? 12_00_000))
        setPeriodsPerYear(Number(vals?.[1] ?? 12))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Salary" value={annualSalary} onChange={setAnnualSalary} prefix="₹" step={10_000} />
          <InputGroup label="Pay Periods per Year" value={periodsPerYear} onChange={setPeriodsPerYear} step={1} helpText="Monthly=12, Bi-weekly=26, Weekly=52" />
        </div>
      }
      result={<ResultCard label="Per Period" value={fmtMoney(result.perPeriod)} type="highlight" />}
    />
  )
}

export function TimeValueOfMoneyCalculator() {
  const [presentValue, setPresentValue] = useState(1_00_000)
  const [annualRate, setAnnualRate] = useState(8)
  const [years, setYears] = useState(10)

  const result = useMemo(() => {
    const fv = clamp0(presentValue) * Math.pow(1 + clamp0(annualRate) / 100, clamp0(years))
    return { fv }
  }, [presentValue, annualRate, years])

  return (
    <FinancialCalculatorTemplate
      title="Time Value of Money"
      description="Project future value of money with compounding (simplified)."
      icon={Repeat}
      calculate={() => {}}
      values={[presentValue, annualRate, years]}
      onClear={() => {
        setPresentValue(1_00_000)
        setAnnualRate(8)
        setYears(10)
      }}
      onRestoreAction={(vals) => {
        setPresentValue(Number(vals?.[0] ?? 1_00_000))
        setAnnualRate(Number(vals?.[1] ?? 8))
        setYears(Number(vals?.[2] ?? 10))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Present Value" value={presentValue} onChange={setPresentValue} prefix="₹" step={5_000} />
          <InputGroup label="Annual Rate" value={annualRate} onChange={setAnnualRate} suffix="%" step={0.1} />
          <InputGroup label="Years" value={years} onChange={setYears} suffix="Years" step={1} />
        </div>
      }
      result={<ResultCard label="Future Value" value={fmtMoney(result.fv)} type="success" icon={Repeat} />}
    />
  )
}

export function CompoundTimeCalculator() {
  const [presentValue, setPresentValue] = useState(1_00_000)
  const [futureValue, setFutureValue] = useState(2_00_000)
  const [annualRate, setAnnualRate] = useState(10)

  const result = useMemo(() => {
    const pv = Math.max(1, clamp0(presentValue))
    const fv = Math.max(pv, clamp0(futureValue))
    const r = clamp0(annualRate) / 100
    const years = r > 0 ? Math.log(fv / pv) / Math.log(1 + r) : 0
    return { years }
  }, [presentValue, futureValue, annualRate])

  return (
    <FinancialCalculatorTemplate
      title="Compound Time Calculator"
      description="Estimate time needed to grow from PV to FV at a given rate (simplified)."
      icon={Clock}
      calculate={() => {}}
      values={[presentValue, futureValue, annualRate]}
      onClear={() => {
        setPresentValue(1_00_000)
        setFutureValue(2_00_000)
        setAnnualRate(10)
      }}
      onRestoreAction={(vals) => {
        setPresentValue(Number(vals?.[0] ?? 1_00_000))
        setFutureValue(Number(vals?.[1] ?? 2_00_000))
        setAnnualRate(Number(vals?.[2] ?? 10))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Present Value" value={presentValue} onChange={setPresentValue} prefix="₹" step={5_000} />
          <InputGroup label="Future Value" value={futureValue} onChange={setFutureValue} prefix="₹" step={5_000} />
          <InputGroup label="Annual Rate" value={annualRate} onChange={setAnnualRate} suffix="%" step={0.1} />
        </div>
      }
      result={<ResultCard label="Time" value={`${fmtNum(result.years, 2)} years`} type="highlight" icon={Clock} />}
    />
  )
}

export function PayrollHoursCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(8)
  const [daysPerWeek, setDaysPerWeek] = useState(5)
  const [weeksPerMonth, setWeeksPerMonth] = useState(4.33)

  const result = useMemo(() => {
    const weekly = clamp0(hoursPerDay) * clamp0(daysPerWeek)
    const monthly = weekly * clamp0(weeksPerMonth)
    return { weekly, monthly }
  }, [hoursPerDay, daysPerWeek, weeksPerMonth])

  return (
    <FinancialCalculatorTemplate
      title="Payroll Hours Calculator"
      description="Estimate weekly and monthly working hours."
      icon={Clock}
      calculate={() => {}}
      values={[hoursPerDay, daysPerWeek, weeksPerMonth]}
      onClear={() => {
        setHoursPerDay(8)
        setDaysPerWeek(5)
        setWeeksPerMonth(4.33)
      }}
      onRestoreAction={(vals) => {
        setHoursPerDay(Number(vals?.[0] ?? 8))
        setDaysPerWeek(Number(vals?.[1] ?? 5))
        setWeeksPerMonth(Number(vals?.[2] ?? 4.33))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Hours per Day" value={hoursPerDay} onChange={setHoursPerDay} suffix="hrs" step={0.5} />
          <InputGroup label="Days per Week" value={daysPerWeek} onChange={setDaysPerWeek} suffix="days" step={1} />
          <InputGroup label="Weeks per Month" value={weeksPerMonth} onChange={setWeeksPerMonth} step={0.01} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Hours / Week" value={fmtNum(result.weekly)} type="highlight" />
          <ResultCard label="Hours / Month" value={fmtNum(result.monthly)} type="success" />
        </div>
      }
    />
  )
}

export function TimeOffAccrualCalculator() {
  const [accrualPerMonth, setAccrualPerMonth] = useState(1.5)
  const [monthsWorked, setMonthsWorked] = useState(12)
  const [usedDays, setUsedDays] = useState(2)

  const result = useMemo(() => {
    const accrued = clamp0(accrualPerMonth) * clamp0(monthsWorked)
    const balance = Math.max(0, accrued - clamp0(usedDays))
    return { accrued, balance }
  }, [accrualPerMonth, monthsWorked, usedDays])

  return (
    <FinancialCalculatorTemplate
      title="Time Off Accrual"
      description="Estimate accrued leave and remaining balance (simplified)."
      icon={Clock}
      calculate={() => {}}
      values={[accrualPerMonth, monthsWorked, usedDays]}
      onClear={() => {
        setAccrualPerMonth(1.5)
        setMonthsWorked(12)
        setUsedDays(2)
      }}
      onRestoreAction={(vals) => {
        setAccrualPerMonth(Number(vals?.[0] ?? 1.5))
        setMonthsWorked(Number(vals?.[1] ?? 12))
        setUsedDays(Number(vals?.[2] ?? 2))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Accrual per Month" value={accrualPerMonth} onChange={setAccrualPerMonth} suffix="days" step={0.1} />
          <InputGroup label="Months Worked" value={monthsWorked} onChange={setMonthsWorked} suffix="months" step={1} />
          <InputGroup label="Used Days" value={usedDays} onChange={setUsedDays} suffix="days" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Accrued" value={fmtNum(result.accrued)} suffix=" days" type="highlight" />
          <ResultCard label="Remaining" value={fmtNum(result.balance)} suffix=" days" type="success" />
        </div>
      }
    />
  )
}

export function SickLeaveCalculator() {
  const [dailyWage, setDailyWage] = useState(2_000)
  const [sickDays, setSickDays] = useState(5)
  const [paidPct, setPaidPct] = useState(100)

  const result = useMemo(() => {
    const gross = clamp0(dailyWage) * clamp0(sickDays)
    const paid = gross * (clamp0(paidPct) / 100)
    return { gross, paid, loss: gross - paid }
  }, [dailyWage, sickDays, paidPct])

  return (
    <FinancialCalculatorTemplate
      title="Sick Leave Calculator"
      description="Estimate paid amount during sick leave (simplified)."
      icon={Wallet}
      calculate={() => {}}
      values={[dailyWage, sickDays, paidPct]}
      onClear={() => {
        setDailyWage(2_000)
        setSickDays(5)
        setPaidPct(100)
      }}
      onRestoreAction={(vals) => {
        setDailyWage(Number(vals?.[0] ?? 2_000))
        setSickDays(Number(vals?.[1] ?? 5))
        setPaidPct(Number(vals?.[2] ?? 100))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Daily Wage" value={dailyWage} onChange={setDailyWage} prefix="₹" step={50} />
          <InputGroup label="Sick Days" value={sickDays} onChange={setSickDays} suffix="days" step={1} />
          <InputGroup label="Paid %" value={paidPct} onChange={setPaidPct} suffix="%" step={5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Gross" value={fmtMoney(result.gross)} type="highlight" />
          <ResultCard label="Paid" value={fmtMoney(result.paid)} type="success" />
          <ResultCard label="Income Loss" value={fmtMoney(result.loss)} type="warning" />
        </div>
      }
    />
  )
}

export function ContractDurationCalculator() {
  const [startDate, setStartDate] = useState("2026-01-01")
  const [endDate, setEndDate] = useState("2026-12-31")
  const [dailyRate, setDailyRate] = useState(3_000)

  const result = useMemo(() => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const ms = end.getTime() - start.getTime()
    const days = Number.isFinite(ms) ? Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)) + 1) : 0
    const earnings = clamp0(dailyRate) * days
    return { days, earnings }
  }, [startDate, endDate, dailyRate])

  return (
    <FinancialCalculatorTemplate
      title="Contract Duration Calculator"
      description="Estimate contract duration in days and gross earnings (simplified)."
      icon={Calendar}
      calculate={() => {}}
      values={[startDate, endDate, dailyRate]}
      onClear={() => {
        setStartDate("2026-01-01")
        setEndDate("2026-12-31")
        setDailyRate(3_000)
      }}
      onRestoreAction={(vals) => {
        setStartDate(typeof vals?.[0] === "string" ? (vals[0] as string) : "")
        setEndDate(typeof vals?.[1] === "string" ? (vals[1] as string) : "")
        setDailyRate(Number(vals?.[2] ?? 3_000))
      }}
      inputs={
        <div className="space-y-4">
          <VoiceDateInput label="Start Date" value={startDate} onChangeAction={setStartDate} />
          <VoiceDateInput label="End Date" value={endDate} onChangeAction={setEndDate} />
          <InputGroup label="Daily Rate" value={dailyRate} onChange={setDailyRate} prefix="₹" step={50} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Duration" value={result.days} suffix=" days" type="highlight" />
          <ResultCard label="Gross Earnings" value={fmtMoney(result.earnings)} type="success" />
        </div>
      }
    />
  )
}

export function SubscriptionCostTimeCalculator() {
  const [monthlyCost, setMonthlyCost] = useState(499)
  const [months, setMonths] = useState(12)
  const [annualDiscountPct, setAnnualDiscountPct] = useState(0)

  const result = useMemo(() => {
    const monthlyTotal = clamp0(monthlyCost) * clamp0(months)
    const annualTotal = clamp0(monthlyCost) * 12 * (1 - clamp0(annualDiscountPct) / 100)
    return { monthlyTotal, annualTotal }
  }, [monthlyCost, months, annualDiscountPct])

  return (
    <FinancialCalculatorTemplate
      title="Subscription Cost Over Time"
      description="Compare subscription costs over time (monthly vs annual discount)."
      icon={Repeat}
      calculate={() => {}}
      values={[monthlyCost, months, annualDiscountPct]}
      onClear={() => {
        setMonthlyCost(499)
        setMonths(12)
        setAnnualDiscountPct(0)
      }}
      onRestoreAction={(vals) => {
        setMonthlyCost(Number(vals?.[0] ?? 499))
        setMonths(Number(vals?.[1] ?? 12))
        setAnnualDiscountPct(Number(vals?.[2] ?? 0))
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Monthly Cost" value={monthlyCost} onChange={setMonthlyCost} prefix="₹" step={10} />
          <InputGroup label="Months" value={months} onChange={setMonths} suffix="months" step={1} />
          <InputGroup label="Annual Plan Discount" value={annualDiscountPct} onChange={setAnnualDiscountPct} suffix="%" step={0.5} helpText="0% if not applicable" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Cost for Selected Months" value={fmtMoney(result.monthlyTotal)} type="highlight" />
          <ResultCard label="Approx Annual Plan Cost" value={fmtMoney(result.annualTotal)} type="success" />
        </div>
      }
    />
  )
}
