"use client"

import { useState } from "react"
import { CreditCard, ArrowRightLeft, Percent } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import toast from "react-hot-toast"

export function CreditCardMinimumDue() {
  const [outstanding, setOutstanding] = useState(50000)
  const [interestRate, setInterestRate] = useState(3.5) // Monthly
  const [minDuePercent, setMinDuePercent] = useState(5)
  const [minDueRupees, setMinDueRupees] = useState(200)

  const calculate = () => {
    const startBalance = Number(outstanding)
    const rMonthly = Number(interestRate) / 100
    const minPct = Number(minDuePercent) / 100
    const minFixed = Number(minDueRupees)

    if (!Number.isFinite(startBalance) || startBalance <= 0) {
      return { error: "Outstanding balance must be greater than 0" as const }
    }
    if (!Number.isFinite(rMonthly) || rMonthly < 0) {
      return { error: "Monthly interest rate must be 0 or more" as const }
    }
    if (!Number.isFinite(minPct) || minPct < 0) {
      return { error: "Minimum due % must be 0 or more" as const }
    }
    if (!Number.isFinite(minFixed) || minFixed < 0) {
      return { error: "Minimum due (₹) must be 0 or more" as const }
    }

    let balance = startBalance
    let months = 0
    let totalInterest = 0
    const schedule: Array<{ month: number; payment: number; interest: number; principal: number; balance: number }> = []

    // Cap at 20 years (240 months) to avoid infinite loops.
    while (balance > 1 && months < 240) {
      const interest = balance * rMonthly

      let payment = Math.max(balance * minPct, minFixed)

      // Ensure the payment reduces principal, otherwise user is stuck forever.
      if (payment <= interest + 1) payment = interest + 1
      if (payment > balance + interest) payment = balance + interest

      const principal = payment - interest
      balance = balance + interest - payment
      totalInterest += interest
      months++

      schedule.push({
        month: months,
        payment: Math.round(payment),
        interest: Math.round(interest),
        principal: Math.round(principal),
        balance: Math.max(0, Math.round(balance)),
      })
    }

    return {
      months,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(startBalance + totalInterest),
      schedule,
    }
  }

  const computed = calculate()

  const renderSchedule = (schedule: Array<any>) => {
    if (!schedule?.length) return null
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead className="text-right">Interest</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((row: any) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.payment ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.interest ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.principal ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.balance ?? 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <FinancialCalculatorTemplate
      title="Credit Card Minimum Due Calculator"
      description="See how long it takes to clear debt paying only the minimum amount."
      icon={CreditCard}
      calculate={() => {
        const res = calculate()
        if ("error" in res) {
          const msg = res.error
          if (msg) toast.error(msg)
        }
      }}
      values={[outstanding, interestRate, minDuePercent, minDueRupees]}
      onClear={() => {
        setOutstanding(50000)
        setInterestRate(3.5)
        setMinDuePercent(5)
        setMinDueRupees(200)
      }}
      onRestoreAction={(vals) => {
        setOutstanding(Number(vals?.[0] ?? 50000))
        setInterestRate(Number(vals?.[1] ?? 3.5))
        setMinDuePercent(Number(vals?.[2] ?? 5))
        setMinDueRupees(Number(vals?.[3] ?? 200))
      }}
      onDownload={(format) => {
        if ("error" in computed) return
        generateReport(format, 'cc_min_due', 
          ['Metric', 'Value'], 
          [
            ['Time to Clear', `${computed.months} Months`],
            ['Total Interest Paid', `₹${computed.totalInterest}`],
            ['Total Amount Paid', `₹${computed.totalPaid}`]
          ], 
          'Credit Card Debt Report'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Outstanding Balance" value={outstanding} onChange={setOutstanding} prefix="₹" />
          <InputGroup label="Monthly Interest Rate" value={interestRate} onChange={setInterestRate} suffix="%" step={0.1} helpText="Usually 3-4% per month" />
          <InputGroup label="Minimum Due %" value={minDuePercent} onChange={setMinDuePercent} suffix="%" />
          <InputGroup label="Minimum Due (₹)" value={minDueRupees} onChange={setMinDueRupees} prefix="₹" step={50} helpText="Banks often have a fixed minimum (e.g. ₹200)" />
        </div>
      }
      result={
        computed && !("error" in computed) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600">Time to Clear</div>
              <div className="text-2xl font-bold text-red-700">
                {computed.months >= 240 ? "20+ Years" : `${(computed.months / 12).toFixed(1)} Years`}
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-600">Total Interest</div>
              <div className="text-2xl font-bold text-orange-700">₹{computed.totalInterest.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700">Total Paid</div>
              <div className="text-2xl font-bold text-green-800">₹{computed.totalPaid.toLocaleString()}</div>
            </div>
          </div>
        ) : null
      }
      schedule={computed && !("error" in computed) ? renderSchedule(computed.schedule) : null}
    />
  )
}

export function BalanceTransfer() {
  const [balance, setBalance] = useState(100000)
  const [currentRate, setCurrentRate] = useState(40) // Annual
  const [newRate, setNewRate] = useState(12) // Annual
  const [transferFee, setTransferFee] = useState(2) // %
  const [monthsToPay, setMonthsToPay] = useState(12)

  const calculate = () => {
    const principal = Number(balance)
    const aprCurrent = Number(currentRate)
    const aprNew = Number(newRate)
    const feePct = Number(transferFee)
    const targetMonths = Math.max(0, Math.round(Number(monthsToPay)))

    if (!Number.isFinite(principal) || principal <= 0) return { ok: false as const, error: "Transfer amount must be greater than 0" }
    if (!Number.isFinite(aprCurrent) || aprCurrent < 0) return { ok: false as const, error: "Current annual interest must be 0 or more" }
    if (!Number.isFinite(aprNew) || aprNew < 0) return { ok: false as const, error: "New annual interest must be 0 or more" }
    if (!Number.isFinite(feePct) || feePct < 0) return { ok: false as const, error: "Transfer fee must be 0 or more" }
    if (!Number.isFinite(targetMonths) || targetMonths <= 0) return { ok: false as const, error: "Months to pay off must be greater than 0" }

    const feeAmount = principal * (feePct / 100)
    const monthlyRateCurrent = aprCurrent / 100 / 12
    const monthlyRateNew = aprNew / 100 / 12

    const payment = (() => {
      if (targetMonths === 0) return 0
      if (monthlyRateCurrent === 0) return principal / targetMonths
      const pow = Math.pow(1 + monthlyRateCurrent, targetMonths)
      return (principal * monthlyRateCurrent * pow) / (pow - 1)
    })()

    const simulate = (startingBalance: number, monthlyRate: number) => {
      let bal = startingBalance
      let totalInterest = 0
      let months = 0
      let cumulativeCost = 0

      const schedule: Array<{ month: number; payment: number; interest: number; principal: number; balance: number; cumulativeCost: number }> = []

      while (bal > 1 && months < 600) {
        const interest = bal * monthlyRate
        if (payment <= interest + 1) {
          return { ok: false as const, error: "Monthly payment is too low to reduce balance" }
        }

        const paymentThisMonth = Math.min(payment, bal + interest)
        const principalPart = paymentThisMonth - interest
        bal = bal + interest - paymentThisMonth
        totalInterest += interest
        cumulativeCost += interest
        months++

        schedule.push({
          month: months,
          payment: Math.round(paymentThisMonth),
          interest: Math.round(interest),
          principal: Math.round(principalPart),
          balance: Math.max(0, Math.round(bal)),
          cumulativeCost: Math.round(cumulativeCost),
        })
      }

      return { ok: true as const, months, totalInterest: Math.round(totalInterest), schedule }
    }

    const current = simulate(principal, monthlyRateCurrent)
    if (!current.ok) return current

    // Assume transfer fee is added to the balance being repaid.
    const transferredBalance = principal + feeAmount
    const transferred = simulate(transferredBalance, monthlyRateNew)
    if (!transferred.ok) return transferred

    const currentTotalCost = principal + current.totalInterest
    const transferTotalCost = principal + feeAmount + transferred.totalInterest
    const savings = Math.round(currentTotalCost - transferTotalCost)

    // Break-even month: when (current cumulative interest) >= (fee + transfer cumulative interest)
    let breakEvenMonth: number | null = null
    const maxMonths = Math.max(current.schedule.length, transferred.schedule.length)
    for (let i = 0; i < maxMonths; i++) {
      const curCost = current.schedule[i]?.cumulativeCost ?? current.totalInterest
      const transCost = feeAmount + (transferred.schedule[i]?.cumulativeCost ?? transferred.totalInterest)
      if (curCost >= transCost) {
        breakEvenMonth = i + 1
        break
      }
    }

    const comparisonSchedule: Array<{
      month: number
      currentBalance: number
      transferBalance: number
      currentCumCost: number
      transferCumCost: number
      savingsSoFar: number
    }> = []

    for (let i = 0; i < maxMonths; i++) {
      const month = i + 1
      const currentBalance = current.schedule[i]?.balance ?? 0
      const transferBalance = transferred.schedule[i]?.balance ?? 0
      const currentCumCost = current.schedule[i]?.cumulativeCost ?? current.totalInterest
      const transferCumCost = Math.round(feeAmount + (transferred.schedule[i]?.cumulativeCost ?? transferred.totalInterest))
      comparisonSchedule.push({
        month,
        currentBalance,
        transferBalance,
        currentCumCost,
        transferCumCost,
        savingsSoFar: Math.round(currentCumCost - transferCumCost),
      })
    }

    return {
      ok: true as const,
      payment: Math.round(payment),
      fee: Math.round(feeAmount),
      savings,
      breakEvenMonth,
      currentMonths: current.months,
      transferMonths: transferred.months,
      currentInterest: current.totalInterest,
      transferInterest: transferred.totalInterest,
      comparisonSchedule,
    }
  }

  const computed = calculate()

  const renderSchedule = (rows: Array<any>) => {
    if (!rows?.length) return null
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Current Balance</TableHead>
              <TableHead className="text-right">Transfer Balance</TableHead>
              <TableHead className="text-right">Current Cost (Interest)</TableHead>
              <TableHead className="text-right">Transfer Cost (Fee+Interest)</TableHead>
              <TableHead className="text-right">Savings So Far</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.currentBalance ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.transferBalance ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.currentCumCost ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.transferCumCost ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.savingsSoFar ?? 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <FinancialCalculatorTemplate
      title="Balance Transfer Calculator"
      description="Calculate savings by transferring credit card balance to a lower interest loan/card."
      icon={ArrowRightLeft}
      calculate={() => {
        const res = calculate()
        if (!res.ok) toast.error(res.error)
      }}
      values={[balance, currentRate, newRate, transferFee, monthsToPay]}
      onClear={() => {
        setBalance(100000)
        setCurrentRate(40)
        setNewRate(12)
        setTransferFee(2)
        setMonthsToPay(12)
      }}
      onRestoreAction={(vals) => {
        setBalance(Number(vals?.[0] ?? 100000))
        setCurrentRate(Number(vals?.[1] ?? 40))
        setNewRate(Number(vals?.[2] ?? 12))
        setTransferFee(Number(vals?.[3] ?? 2))
        setMonthsToPay(Number(vals?.[4] ?? 12))
      }}
      onDownload={(format) => {
        if (!computed.ok) return
        generateReport(
          format,
          'balance_transfer',
          ['Metric', 'Value'],
          [
            ['Monthly Payment (assumed)', `₹${computed.payment}`],
            ['Transfer Fee', `₹${computed.fee}`],
            ['Total Interest (Current)', `₹${computed.currentInterest}`],
            ['Total Interest (After Transfer)', `₹${computed.transferInterest}`],
            ['Break-even Month', computed.breakEvenMonth ? `${computed.breakEvenMonth}` : 'Not reached'],
            ['Projected Savings', `₹${computed.savings}`],
          ],
          'Balance Transfer Report'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Transfer Amount" value={balance} onChange={setBalance} prefix="₹" />
          <InputGroup label="Current Annual Interest" value={currentRate} onChange={setCurrentRate} suffix="%" />
          <InputGroup label="New Annual Interest" value={newRate} onChange={setNewRate} suffix="%" />
          <InputGroup label="Transfer Fee" value={transferFee} onChange={setTransferFee} suffix="%" />
          <InputGroup label="Months to Pay Off" value={monthsToPay} onChange={setMonthsToPay} suffix="Months" />
        </div>
      }
      result={
        computed && computed.ok ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg border text-center">
                <div className="text-xs text-muted-foreground">Monthly Payment (assumed)</div>
                <div className="text-2xl font-bold">₹{computed.payment.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg border text-center">
                <div className="text-xs text-muted-foreground">Transfer Fee</div>
                <div className="text-2xl font-bold">₹{computed.fee.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border text-center">
                <div className="text-xs text-green-700">Projected Savings</div>
                <div className="text-2xl font-bold text-green-800">₹{computed.savings.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary/20 rounded-lg border">
                <div className="text-xs text-muted-foreground">Total Interest (Current)</div>
                <div className="text-lg font-semibold">₹{computed.currentInterest.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg border">
                <div className="text-xs text-muted-foreground">Total Interest (Transfer)</div>
                <div className="text-lg font-semibold">₹{computed.transferInterest.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg border">
                <div className="text-xs text-muted-foreground">Break-even</div>
                <div className="text-lg font-semibold">{computed.breakEvenMonth ? `Month ${computed.breakEvenMonth}` : 'Not reached'}</div>
              </div>
            </div>
          </div>
        ) : null
      }
      schedule={computed && computed.ok ? renderSchedule(computed.comparisonSchedule) : null}
    />
  )
}

export function CreditCardEMI() {
  const [amount, setAmount] = useState(50000)
  const [rate, setRate] = useState(15) // Annual
  const [months, setMonths] = useState(12)
  const [processingFee, setProcessingFee] = useState(1) // %

  const calculate = () => {
    const principal = Number(amount)
    const annualRate = Number(rate)
    const n = Math.max(0, Math.round(Number(months)))
    const feePct = Number(processingFee)

    if (!Number.isFinite(principal) || principal <= 0) return { error: "Amount must be greater than 0" as const }
    if (!Number.isFinite(annualRate) || annualRate < 0) return { error: "Interest rate must be 0 or more" as const }
    if (!Number.isFinite(n) || n <= 0) return { error: "Tenure must be greater than 0" as const }
    if (!Number.isFinite(feePct) || feePct < 0) return { error: "Processing fee must be 0 or more" as const }

    const r = annualRate / 12 / 100
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - principal
    const fee = principal * (feePct / 100)

    let balance = principal
    const schedule: Array<{ month: number; payment: number; interest: number; principal: number; balance: number }> = []
    for (let m = 1; m <= n; m++) {
      const interest = balance * r
      let principalPart = emi - interest
      if (principalPart > balance) principalPart = balance
      balance = balance - principalPart
      schedule.push({
        month: m,
        payment: Math.round(emi),
        interest: Math.round(interest),
        principal: Math.round(principalPart),
        balance: Math.max(0, Math.round(balance)),
      })
      if (balance <= 0) break
    }

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPayment),
      fee: Math.round(fee),
      totalCost: Math.round(totalPayment + fee),
      schedule,
    }
  }

  const computed = calculate()

  const renderSchedule = (schedule: Array<any>) => {
    if (!schedule?.length) return null
    return (
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Payment</TableHead>
              <TableHead className="text-right">Interest</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((row: any) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.payment ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.interest ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.principal ?? 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{Math.round(row.balance ?? 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <FinancialCalculatorTemplate
      title="Credit Card EMI Calculator"
      description="Calculate EMI for converting credit card purchases into installments."
      icon={CreditCard}
      calculate={() => {
        const res = calculate()
        if ("error" in res) {
          const msg = res.error
          if (msg) toast.error(msg)
        }
      }}
      values={[amount, rate, months, processingFee]}
      onClear={() => {
        setAmount(50000)
        setRate(15)
        setMonths(12)
        setProcessingFee(1)
      }}
      onRestoreAction={(vals) => {
        setAmount(Number(vals?.[0] ?? 50000))
        setRate(Number(vals?.[1] ?? 15))
        setMonths(Number(vals?.[2] ?? 12))
        setProcessingFee(Number(vals?.[3] ?? 1))
      }}
      onDownload={(format) => {
        if ("error" in computed) return
        generateReport(
          format,
          'cc_emi',
          ['Item', 'Value'],
          [
            ['EMI', `₹${computed.emi}`],
            ['Total Interest', `₹${computed.totalInterest}`],
            ['Processing Fee', `₹${computed.fee}`],
            ['Total Cost (EMIs + Fee)', `₹${computed.totalCost}`],
          ],
          'EMI Report'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Transaction Amount" value={amount} onChange={setAmount} prefix="₹" />
          <InputGroup label="Interest Rate (Annual)" value={rate} onChange={setRate} suffix="%" />
          <InputGroup label="Tenure" value={months} onChange={setMonths} suffix="Months" />
          <InputGroup label="Processing Fee" value={processingFee} onChange={setProcessingFee} suffix="%" />
        </div>
      }
      result={
        computed && !("error" in computed) ? (
          <div className="space-y-4">
            <div className="p-6 bg-primary/10 rounded-xl text-center">
              <div className="text-lg text-muted-foreground mb-2">Monthly EMI</div>
              <div className="text-4xl font-bold text-primary">₹{computed.emi.toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Total Interest</div>
                <div className="font-bold">₹{computed.totalInterest.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Processing Fee</div>
                <div className="font-bold">₹{computed.fee.toLocaleString()}</div>
              </div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg border text-center">
              <div className="text-xs text-muted-foreground">Total Cost (EMIs + Fee)</div>
              <div className="text-xl font-bold">₹{computed.totalCost.toLocaleString()}</div>
            </div>
          </div>
        ) : null
      }
      schedule={computed && !("error" in computed) ? renderSchedule(computed.schedule) : null}
    />
  )
}
