"use client"

import { useMemo, useState } from "react"
import { Building, Calculator as CalculatorIcon, Home, IndianRupee, Ruler } from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"

const fmtNumber = (n: number, digits = 2) => {
  if (!Number.isFinite(n)) return "-"
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits })
}

const fmtINR = (n: number) => {
  if (!Number.isFinite(n)) return "-"
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
}

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0)

const calcEMI = (principal: number, annualRatePct: number, years: number) => {
  const P = clamp0(principal)
  const n = Math.max(0, Math.round(years * 12))
  const r = Math.max(0, annualRatePct) / 100 / 12

  if (n === 0) return { emi: 0, totalPayment: 0, totalInterest: 0 }
  if (r === 0) {
    const emi = P / n
    const totalPayment = emi * n
    return { emi, totalPayment, totalInterest: totalPayment - P }
  }

  const pow = Math.pow(1 + r, n)
  const emi = (P * r * pow) / (pow - 1)
  const totalPayment = emi * n
  const totalInterest = totalPayment - P
  return { emi, totalPayment, totalInterest }
}

export function ConstructionCostCalculator() {
  const [areaSqFt, setAreaSqFt] = useState(1200)
  const [costPerSqFt, setCostPerSqFt] = useState(2000)
  const [contingencyPct, setContingencyPct] = useState(5)

  const result = useMemo(() => {
    const base = clamp0(areaSqFt) * clamp0(costPerSqFt)
    const contingency = (base * clamp0(contingencyPct)) / 100
    return { base, contingency, total: base + contingency }
  }, [areaSqFt, costPerSqFt, contingencyPct])

  return (
    <FinancialCalculatorTemplate
      title="Construction Cost Calculator"
      description="Estimate construction cost using built-up area and rate per sq ft."
      icon={Building}
      calculate={() => {}}
      values={[areaSqFt, costPerSqFt, contingencyPct]}
      onClear={() => {
        setAreaSqFt(1200)
        setCostPerSqFt(2000)
        setContingencyPct(5)
      }}
      onRestoreAction={(vals) => {
        setAreaSqFt(Number(vals?.[0] ?? 1200))
        setCostPerSqFt(Number(vals?.[1] ?? 2000))
        setContingencyPct(Number(vals?.[2] ?? 5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Built-up Area" value={areaSqFt} onChange={setAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} min={0} max={100_000} step={1} prefix="₹" />
          <InputGroup label="Contingency" value={contingencyPct} onChange={setContingencyPct} min={0} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Base Cost" value={fmtINR(result.base)} />
          <ResultCard label="Contingency" value={fmtINR(result.contingency)} type="warning" />
          <ResultCard label="Estimated Total" value={fmtINR(result.total)} type="highlight" />
        </div>
      }
    />
  )
}

export function LandAreaConverter() {
  const units = useMemo(
    () =>
      ({
        "sq ft": 1,
        "sq m": 10.7639104167,
        acre: 43560,
        hectare: 107639.104,
        "sq yd": 9,
        "sq km": 10_763_910_416.7
      }) as const,
    []
  )

  const [value, setValue] = useState(1)
  const [from, setFrom] = useState<keyof typeof units>("acre")
  const [to, setTo] = useState<keyof typeof units>("sq ft")

  const converted = useMemo(() => {
    const sqft = value * units[from]
    return sqft / units[to]
  }, [value, from, to, units])

  return (
    <FinancialCalculatorTemplate
      title="Land Area Converter"
      description="Convert common land area units."
      icon={Ruler}
      calculate={() => {}}
      values={[value, from, to]}
      onClear={() => {
        setValue(1)
        setFrom("acre")
        setTo("sq ft")
      }}
      onRestoreAction={(vals) => {
        setValue(Number(vals?.[0] ?? 1))

        const maybeFrom = typeof vals?.[1] === "string" ? (vals[1] as string) : "acre"
        const maybeTo = typeof vals?.[2] === "string" ? (vals[2] as string) : "sq ft"
        setFrom((maybeFrom in units ? maybeFrom : "acre") as any)
        setTo((maybeTo in units ? maybeTo : "sq ft") as any)
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Value" value={value} onChange={setValue} min={0} max={1e18} step={0.01} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(units).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      }
      result={<ResultCard label="Converted" value={fmtNumber(converted, 6)} type="highlight" />}
    />
  )
}

export function PropertyCapitalGains() {
  const [purchasePrice, setPurchasePrice] = useState(50_00_000)
  const [salePrice, setSalePrice] = useState(75_00_000)
  const [improvementCost, setImprovementCost] = useState(0)
  const [taxRatePct, setTaxRatePct] = useState(20)

  const result = useMemo(() => {
    const gain = salePrice - purchasePrice - improvementCost
    const taxable = Math.max(0, gain)
    const tax = (taxable * clamp0(taxRatePct)) / 100
    return { gain, taxable, tax, netAfterTax: salePrice - tax }
  }, [purchasePrice, salePrice, improvementCost, taxRatePct])

  return (
    <FinancialCalculatorTemplate
      title="Property Capital Gains"
      description="A simple capital gains estimate (does not account for indexation or exemptions)."
      icon={IndianRupee}
      calculate={() => {}}
      values={[purchasePrice, salePrice, improvementCost, taxRatePct]}
      onClear={() => {
        setPurchasePrice(50_00_000)
        setSalePrice(75_00_000)
        setImprovementCost(0)
        setTaxRatePct(20)
      }}
      onRestoreAction={(vals) => {
        setPurchasePrice(Number(vals?.[0] ?? 50_00_000))
        setSalePrice(Number(vals?.[1] ?? 75_00_000))
        setImprovementCost(Number(vals?.[2] ?? 0))
        setTaxRatePct(Number(vals?.[3] ?? 20))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Sale Price" value={salePrice} onChange={setSalePrice} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Improvement Costs" value={improvementCost} onChange={setImprovementCost} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Tax Rate" value={taxRatePct} onChange={setTaxRatePct} min={0} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Gain" value={fmtINR(result.gain)} type={result.gain >= 0 ? "highlight" : "warning"} />
          <ResultCard label="Taxable Gain" value={fmtINR(result.taxable)} />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" />
          <ResultCard label="Net After Tax" value={fmtINR(result.netAfterTax)} type="success" />
        </div>
      }
    />
  )
}

export function PropertyTaxCalculator() {
  const [propertyValue, setPropertyValue] = useState(60_00_000)
  const [taxRatePct, setTaxRatePct] = useState(0.5)

  const annualTax = useMemo(() => (clamp0(propertyValue) * clamp0(taxRatePct)) / 100, [propertyValue, taxRatePct])

  return (
    <FinancialCalculatorTemplate
      title="Property Tax Estimator"
      description="Estimate annual property tax using a simple percentage rate."
      icon={Home}
      calculate={() => {}}
      values={[propertyValue, taxRatePct]}
      onClear={() => {
        setPropertyValue(60_00_000)
        setTaxRatePct(0.5)
      }}
      onRestoreAction={(vals) => {
        setPropertyValue(Number(vals?.[0] ?? 60_00_000))
        setTaxRatePct(Number(vals?.[1] ?? 0.5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Property Value" value={propertyValue} onChange={setPropertyValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Tax Rate" value={taxRatePct} onChange={setTaxRatePct} min={0} max={10} step={0.01} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Annual Tax" value={fmtINR(annualTax)} type="highlight" />}
    />
  )
}

export function PreEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(40_00_000)
  const [disbursedPct, setDisbursedPct] = useState(50)
  const [annualRate, setAnnualRate] = useState(9)

  const result = useMemo(() => {
    const disbursed = (clamp0(loanAmount) * clamp0(disbursedPct)) / 100
    const monthlyInterest = (disbursed * Math.max(0, annualRate)) / 100 / 12
    return { disbursed, monthlyInterest }
  }, [loanAmount, disbursedPct, annualRate])

  return (
    <FinancialCalculatorTemplate
      title="Pre-EMI Calculator"
      description="Estimate monthly interest-only payment on disbursed amount."
      icon={CalculatorIcon}
      calculate={() => {}}
      values={[loanAmount, disbursedPct, annualRate]}
      onClear={() => {
        setLoanAmount(40_00_000)
        setDisbursedPct(50)
        setAnnualRate(9)
      }}
      onRestoreAction={(vals) => {
        setLoanAmount(Number(vals?.[0] ?? 40_00_000))
        setDisbursedPct(Number(vals?.[1] ?? 50))
        setAnnualRate(Number(vals?.[2] ?? 9))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Loan Amount" value={loanAmount} onChange={setLoanAmount} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Disbursed %" value={disbursedPct} onChange={setDisbursedPct} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Interest Rate" value={annualRate} onChange={setAnnualRate} min={0} max={30} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Disbursed Amount" value={fmtINR(result.disbursed)} />
          <ResultCard label="Estimated Pre-EMI / Month" value={fmtINR(result.monthlyInterest)} type="highlight" />
        </div>
      }
    />
  )
}

export function PlotLoanCalculator() {
  const [principal, setPrincipal] = useState(25_00_000)
  const [rate, setRate] = useState(9)
  const [tenureYears, setTenureYears] = useState(15)

  const result = useMemo(() => calcEMI(principal, rate, tenureYears), [principal, rate, tenureYears])

  return (
    <FinancialCalculatorTemplate
      title="Plot Loan EMI"
      description="Estimate EMI for a plot/land loan."
      icon={Home}
      calculate={() => {}}
      values={[principal, rate, tenureYears]}
      onClear={() => {
        setPrincipal(25_00_000)
        setRate(9)
        setTenureYears(15)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals?.[0] ?? 25_00_000))
        setRate(Number(vals?.[1] ?? 9))
        setTenureYears(Number(vals?.[2] ?? 15))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Loan Amount" value={principal} onChange={setPrincipal} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Interest Rate" value={rate} onChange={setRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Tenure" value={tenureYears} onChange={setTenureYears} min={1} max={50} step={1} suffix=" years" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="EMI" value={fmtINR(result.emi)} type="highlight" />
          <ResultCard label="Total Interest" value={fmtINR(result.totalInterest)} type="warning" />
          <ResultCard label="Total Payment" value={fmtINR(result.totalPayment)} />
        </div>
      }
    />
  )
}

export function InteriorDesignCost() {
  const [areaSqFt, setAreaSqFt] = useState(900)
  const [costPerSqFt, setCostPerSqFt] = useState(1200)

  const total = useMemo(() => clamp0(areaSqFt) * clamp0(costPerSqFt), [areaSqFt, costPerSqFt])

  return (
    <FinancialCalculatorTemplate
      title="Interior Design Cost"
      description="Estimate interior design cost based on area and per sq ft rate."
      icon={Building}
      calculate={() => {}}
      values={[areaSqFt, costPerSqFt]}
      onClear={() => {
        setAreaSqFt(900)
        setCostPerSqFt(1200)
      }}
      onRestoreAction={(vals) => {
        setAreaSqFt(Number(vals?.[0] ?? 900))
        setCostPerSqFt(Number(vals?.[1] ?? 1200))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Area" value={areaSqFt} onChange={setAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} min={0} max={100_000} step={1} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function DownPaymentGoal() {
  const [propertyPrice, setPropertyPrice] = useState(80_00_000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [saved, setSaved] = useState(5_00_000)
  const [monthlySavings, setMonthlySavings] = useState(50_000)

  const result = useMemo(() => {
    const goal = (clamp0(propertyPrice) * clamp0(downPaymentPct)) / 100
    const remaining = Math.max(0, goal - clamp0(saved))
    const months = monthlySavings > 0 ? remaining / monthlySavings : Infinity
    return { goal, remaining, months }
  }, [propertyPrice, downPaymentPct, saved, monthlySavings])

  return (
    <FinancialCalculatorTemplate
      title="Down Payment Goal"
      description="Calculate required down payment and time to reach it based on monthly savings."
      icon={IndianRupee}
      calculate={() => {}}
      values={[propertyPrice, downPaymentPct, saved, monthlySavings]}
      onClear={() => {
        setPropertyPrice(80_00_000)
        setDownPaymentPct(20)
        setSaved(5_00_000)
        setMonthlySavings(50_000)
      }}
      onRestoreAction={(vals) => {
        setPropertyPrice(Number(vals?.[0] ?? 80_00_000))
        setDownPaymentPct(Number(vals?.[1] ?? 20))
        setSaved(Number(vals?.[2] ?? 5_00_000))
        setMonthlySavings(Number(vals?.[3] ?? 50_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Property Price" value={propertyPrice} onChange={setPropertyPrice} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Already Saved" value={saved} onChange={setSaved} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Monthly Savings" value={monthlySavings} onChange={setMonthlySavings} min={0} max={1e9} step={1000} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Down Payment Goal" value={fmtINR(result.goal)} type="highlight" />
          <ResultCard label="Remaining" value={fmtINR(result.remaining)} />
          <ResultCard
            label="Time to Goal"
            value={Number.isFinite(result.months) ? `${fmtNumber(result.months, 1)} months` : "-"}
            type="success"
          />
        </div>
      }
    />
  )
}

export function HomeLoanBalanceTransfer() {
  const [principal, setPrincipal] = useState(40_00_000)
  const [currentRate, setCurrentRate] = useState(9.5)
  const [newRate, setNewRate] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(15)
  const [processingFeePct, setProcessingFeePct] = useState(0.5)

  const result = useMemo(() => {
    const current = calcEMI(principal, currentRate, tenureYears)
    const newer = calcEMI(principal, newRate, tenureYears)
    const fee = (clamp0(principal) * clamp0(processingFeePct)) / 100
    const monthlySavings = current.emi - newer.emi
    const totalSavings = current.totalPayment - newer.totalPayment - fee
    return { current, newer, fee, monthlySavings, totalSavings }
  }, [principal, currentRate, newRate, tenureYears, processingFeePct])

  return (
    <FinancialCalculatorTemplate
      title="Home Loan Balance Transfer"
      description="Compare EMIs and estimated savings after switching to a lower interest rate."
      icon={Home}
      calculate={() => {}}
      values={[principal, currentRate, newRate, tenureYears, processingFeePct]}
      onClear={() => {
        setPrincipal(40_00_000)
        setCurrentRate(9.5)
        setNewRate(8.5)
        setTenureYears(15)
        setProcessingFeePct(0.5)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals?.[0] ?? 40_00_000))
        setCurrentRate(Number(vals?.[1] ?? 9.5))
        setNewRate(Number(vals?.[2] ?? 8.5))
        setTenureYears(Number(vals?.[3] ?? 15))
        setProcessingFeePct(Number(vals?.[4] ?? 0.5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Outstanding Principal" value={principal} onChange={setPrincipal} min={0} max={1e12} step={1000} prefix="₹" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Current Rate" value={currentRate} onChange={setCurrentRate} min={0} max={30} step={0.1} suffix="%" />
            <InputGroup label="New Rate" value={newRate} onChange={setNewRate} min={0} max={30} step={0.1} suffix="%" />
          </div>
          <InputGroup label="Remaining Tenure" value={tenureYears} onChange={setTenureYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Processing Fee" value={processingFeePct} onChange={setProcessingFeePct} min={0} max={5} step={0.01} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Current EMI" value={fmtINR(result.current.emi)} />
          <ResultCard label="New EMI" value={fmtINR(result.newer.emi)} type="success" />
          <ResultCard label="Monthly Savings" value={fmtINR(result.monthlySavings)} type="highlight" />
          <ResultCard label="Est. Total Savings" value={fmtINR(result.totalSavings)} type={result.totalSavings >= 0 ? "success" : "warning"} />
        </div>
      }
    />
  )
}

export function PMAYSubsidyCalculator() {
  const [eligibleLoan, setEligibleLoan] = useState(6_00_000)
  const [subsidyPct, setSubsidyPct] = useState(6.5)

  const result = useMemo(() => {
    const subsidy = (clamp0(eligibleLoan) * clamp0(subsidyPct)) / 100
    const effective = Math.max(0, eligibleLoan - subsidy)
    return { subsidy, effective }
  }, [eligibleLoan, subsidyPct])

  return (
    <FinancialCalculatorTemplate
      title="PMAY Subsidy Calculator"
      description="A simplified subsidy estimate based on eligible loan amount and subsidy %."
      icon={Home}
      calculate={() => {}}
      values={[eligibleLoan, subsidyPct]}
      onClear={() => {
        setEligibleLoan(6_00_000)
        setSubsidyPct(6.5)
      }}
      onRestoreAction={(vals) => {
        setEligibleLoan(Number(vals?.[0] ?? 6_00_000))
        setSubsidyPct(Number(vals?.[1] ?? 6.5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Eligible Loan Amount" value={eligibleLoan} onChange={setEligibleLoan} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Subsidy %" value={subsidyPct} onChange={setSubsidyPct} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Subsidy" value={fmtINR(result.subsidy)} type="highlight" />
          <ResultCard label="Effective Principal" value={fmtINR(result.effective)} type="success" />
        </div>
      }
    />
  )
}

export function CarpetAreaCalculator() {
  const [superBuiltUpSqFt, setSuperBuiltUpSqFt] = useState(1200)
  const [loadingPct, setLoadingPct] = useState(30)

  const result = useMemo(() => {
    const carpet = superBuiltUpSqFt / (1 + clamp0(loadingPct) / 100)
    return { carpet: clamp0(carpet) }
  }, [superBuiltUpSqFt, loadingPct])

  return (
    <FinancialCalculatorTemplate
      title="Carpet Area Calculator"
      description="Estimate carpet area from super built-up area and loading %."
      icon={Ruler}
      calculate={() => {}}
      values={[superBuiltUpSqFt, loadingPct]}
      onClear={() => {
        setSuperBuiltUpSqFt(1200)
        setLoadingPct(30)
      }}
      onRestoreAction={(vals) => {
        setSuperBuiltUpSqFt(Number(vals?.[0] ?? 1200))
        setLoadingPct(Number(vals?.[1] ?? 30))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Super Built-up Area" value={superBuiltUpSqFt} onChange={setSuperBuiltUpSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Loading" value={loadingPct} onChange={setLoadingPct} min={0} max={100} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Carpet Area" value={`${fmtNumber(result.carpet, 2)} sq ft`} type="highlight" />}
    />
  )
}

export function FSICalculator() {
  const [plotAreaSqFt, setPlotAreaSqFt] = useState(2000)
  const [fsi, setFsi] = useState(1.5)
  const [plannedBuiltUpSqFt, setPlannedBuiltUpSqFt] = useState(2500)

  const result = useMemo(() => {
    const maxBuildable = clamp0(plotAreaSqFt) * clamp0(fsi)
    const utilization = maxBuildable > 0 ? (clamp0(plannedBuiltUpSqFt) / maxBuildable) * 100 : 0
    const remaining = Math.max(0, maxBuildable - clamp0(plannedBuiltUpSqFt))
    return { maxBuildable, utilization, remaining }
  }, [plotAreaSqFt, fsi, plannedBuiltUpSqFt])

  return (
    <FinancialCalculatorTemplate
      title="FSI / FAR Calculator"
      description="Compute max permissible built-up area and utilization."
      icon={Ruler}
      calculate={() => {}}
      values={[plotAreaSqFt, fsi, plannedBuiltUpSqFt]}
      onClear={() => {
        setPlotAreaSqFt(2000)
        setFsi(1.5)
        setPlannedBuiltUpSqFt(2500)
      }}
      onRestoreAction={(vals) => {
        setPlotAreaSqFt(Number(vals?.[0] ?? 2000))
        setFsi(Number(vals?.[1] ?? 1.5))
        setPlannedBuiltUpSqFt(Number(vals?.[2] ?? 2500))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Plot Area" value={plotAreaSqFt} onChange={setPlotAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Permissible FSI / FAR" value={fsi} onChange={setFsi} min={0} max={10} step={0.01} />
          <InputGroup label="Planned Built-up Area" value={plannedBuiltUpSqFt} onChange={setPlannedBuiltUpSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Max Buildable" value={`${fmtNumber(result.maxBuildable, 2)} sq ft`} type="highlight" />
          <ResultCard label="Utilization" value={`${fmtNumber(result.utilization, 2)}%`} />
          <ResultCard label="Remaining" value={`${fmtNumber(result.remaining, 2)} sq ft`} type="success" />
        </div>
      }
    />
  )
}

export function RentalAgreementCost() {
  const [monthlyRent, setMonthlyRent] = useState(20_000)
  const [months, setMonths] = useState(11)
  const [stampDutyPct, setStampDutyPct] = useState(0.25)
  const [registrationFee, setRegistrationFee] = useState(1000)

  const result = useMemo(() => {
    const rentTotal = clamp0(monthlyRent) * clamp0(months)
    const stampDuty = (rentTotal * clamp0(stampDutyPct)) / 100
    const total = rentTotal + stampDuty + clamp0(registrationFee)
    return { rentTotal, stampDuty, total }
  }, [monthlyRent, months, stampDutyPct, registrationFee])

  return (
    <FinancialCalculatorTemplate
      title="Rental Agreement Cost"
      description="Estimate agreement cost using rent total + stamp duty + registration fee."
      icon={IndianRupee}
      calculate={() => {}}
      values={[monthlyRent, months, stampDutyPct, registrationFee]}
      onClear={() => {
        setMonthlyRent(20_000)
        setMonths(11)
        setStampDutyPct(0.25)
        setRegistrationFee(1000)
      }}
      onRestoreAction={(vals) => {
        setMonthlyRent(Number(vals?.[0] ?? 20_000))
        setMonths(Number(vals?.[1] ?? 11))
        setStampDutyPct(Number(vals?.[2] ?? 0.25))
        setRegistrationFee(Number(vals?.[3] ?? 1000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Rent" value={monthlyRent} onChange={setMonthlyRent} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Agreement Duration" value={months} onChange={setMonths} min={1} max={60} step={1} suffix=" months" />
          <InputGroup label="Stamp Duty" value={stampDutyPct} onChange={setStampDutyPct} min={0} max={5} step={0.01} suffix="%" />
          <InputGroup label="Registration Fee" value={registrationFee} onChange={setRegistrationFee} min={0} max={1e7} step={10} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Rent Total" value={fmtINR(result.rentTotal)} />
          <ResultCard label="Stamp Duty" value={fmtINR(result.stampDuty)} type="warning" />
          <ResultCard label="Estimated Total" value={fmtINR(result.total)} type="highlight" />
        </div>
      }
    />
  )
}

export function PaintCostCalculator() {
  const [areaSqFt, setAreaSqFt] = useState(1500)
  const [coverageSqFtPerL, setCoverageSqFtPerL] = useState(80)
  const [paintCostPerL, setPaintCostPerL] = useState(350)
  const [labourCostPerSqFt, setLabourCostPerSqFt] = useState(12)

  const result = useMemo(() => {
    const liters = coverageSqFtPerL > 0 ? clamp0(areaSqFt) / coverageSqFtPerL : 0
    const paint = liters * clamp0(paintCostPerL)
    const labour = clamp0(areaSqFt) * clamp0(labourCostPerSqFt)
    return { liters, paint, labour, total: paint + labour }
  }, [areaSqFt, coverageSqFtPerL, paintCostPerL, labourCostPerSqFt])

  return (
    <FinancialCalculatorTemplate
      title="Painting Cost Estimator"
      description="Estimate paint liters and total painting cost."
      icon={Building}
      calculate={() => {}}
      values={[areaSqFt, coverageSqFtPerL, paintCostPerL, labourCostPerSqFt]}
      onClear={() => {
        setAreaSqFt(1500)
        setCoverageSqFtPerL(80)
        setPaintCostPerL(350)
        setLabourCostPerSqFt(12)
      }}
      onRestoreAction={(vals) => {
        setAreaSqFt(Number(vals?.[0] ?? 1500))
        setCoverageSqFtPerL(Number(vals?.[1] ?? 80))
        setPaintCostPerL(Number(vals?.[2] ?? 350))
        setLabourCostPerSqFt(Number(vals?.[3] ?? 12))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Paintable Area" value={areaSqFt} onChange={setAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Coverage" value={coverageSqFtPerL} onChange={setCoverageSqFtPerL} min={1} max={10_000} step={1} suffix=" sq ft/L" />
          <InputGroup label="Paint Cost" value={paintCostPerL} onChange={setPaintCostPerL} min={0} max={100_000} step={1} prefix="₹" suffix=" /L" />
          <InputGroup label="Labour Cost" value={labourCostPerSqFt} onChange={setLabourCostPerSqFt} min={0} max={10_000} step={0.5} prefix="₹" suffix=" /sq ft" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Paint Needed" value={`${fmtNumber(result.liters, 2)} L`} type="highlight" />
          <ResultCard label="Paint Cost" value={fmtINR(result.paint)} />
          <ResultCard label="Labour Cost" value={fmtINR(result.labour)} />
          <ResultCard label="Estimated Total" value={fmtINR(result.total)} type="success" />
        </div>
      }
    />
  )
}

export function FlooringCostCalculator() {
  const [areaSqFt, setAreaSqFt] = useState(1000)
  const [costPerSqFt, setCostPerSqFt] = useState(150)

  const total = useMemo(() => clamp0(areaSqFt) * clamp0(costPerSqFt), [areaSqFt, costPerSqFt])

  return (
    <FinancialCalculatorTemplate
      title="Flooring Cost Calculator"
      description="Estimate flooring cost based on area and rate per sq ft."
      icon={Ruler}
      calculate={() => {}}
      values={[areaSqFt, costPerSqFt]}
      onClear={() => {
        setAreaSqFt(1000)
        setCostPerSqFt(150)
      }}
      onRestoreAction={(vals) => {
        setAreaSqFt(Number(vals?.[0] ?? 1000))
        setCostPerSqFt(Number(vals?.[1] ?? 150))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Area" value={areaSqFt} onChange={setAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} min={0} max={100_000} step={1} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function FalseCeilingCost() {
  const [areaSqFt, setAreaSqFt] = useState(500)
  const [costPerSqFt, setCostPerSqFt] = useState(120)

  const total = useMemo(() => clamp0(areaSqFt) * clamp0(costPerSqFt), [areaSqFt, costPerSqFt])

  return (
    <FinancialCalculatorTemplate
      title="False Ceiling Cost"
      description="Estimate false ceiling cost from area and per sq ft rate."
      icon={Building}
      calculate={() => {}}
      values={[areaSqFt, costPerSqFt]}
      onClear={() => {
        setAreaSqFt(500)
        setCostPerSqFt(120)
      }}
      onRestoreAction={(vals) => {
        setAreaSqFt(Number(vals?.[0] ?? 500))
        setCostPerSqFt(Number(vals?.[1] ?? 120))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Ceiling Area" value={areaSqFt} onChange={setAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} min={0} max={100_000} step={1} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function ModularKitchenCost() {
  const [lengthFt, setLengthFt] = useState(12)
  const [costPerRunningFt, setCostPerRunningFt] = useState(20_000)
  const [appliancesCost, setAppliancesCost] = useState(0)

  const total = useMemo(
    () => clamp0(lengthFt) * clamp0(costPerRunningFt) + clamp0(appliancesCost),
    [lengthFt, costPerRunningFt, appliancesCost]
  )

  return (
    <FinancialCalculatorTemplate
      title="Modular Kitchen Cost"
      description="Estimate modular kitchen cost using running feet and rate."
      icon={Home}
      calculate={() => {}}
      values={[lengthFt, costPerRunningFt, appliancesCost]}
      onClear={() => {
        setLengthFt(12)
        setCostPerRunningFt(20_000)
        setAppliancesCost(0)
      }}
      onRestoreAction={(vals) => {
        setLengthFt(Number(vals?.[0] ?? 12))
        setCostPerRunningFt(Number(vals?.[1] ?? 20_000))
        setAppliancesCost(Number(vals?.[2] ?? 0))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Kitchen Length" value={lengthFt} onChange={setLengthFt} min={0} max={500} step={0.5} suffix=" ft" />
          <InputGroup label="Cost per Running ft" value={costPerRunningFt} onChange={setCostPerRunningFt} min={0} max={1e7} step={100} prefix="₹" />
          <InputGroup label="Appliances (Optional)" value={appliancesCost} onChange={setAppliancesCost} min={0} max={1e9} step={1000} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function WardrobeCostCalculator() {
  const [lengthFt, setLengthFt] = useState(8)
  const [costPerRunningFt, setCostPerRunningFt] = useState(15_000)

  const total = useMemo(() => clamp0(lengthFt) * clamp0(costPerRunningFt), [lengthFt, costPerRunningFt])

  return (
    <FinancialCalculatorTemplate
      title="Wardrobe Cost Calculator"
      description="Estimate wardrobe cost using running feet and rate."
      icon={Home}
      calculate={() => {}}
      values={[lengthFt, costPerRunningFt]}
      onClear={() => {
        setLengthFt(8)
        setCostPerRunningFt(15_000)
      }}
      onRestoreAction={(vals) => {
        setLengthFt(Number(vals?.[0] ?? 8))
        setCostPerRunningFt(Number(vals?.[1] ?? 15_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Wardrobe Length" value={lengthFt} onChange={setLengthFt} min={0} max={500} step={0.5} suffix=" ft" />
          <InputGroup label="Cost per Running ft" value={costPerRunningFt} onChange={setCostPerRunningFt} min={0} max={1e7} step={100} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function SolarRooftopCalculator() {
  const [systemKW, setSystemKW] = useState(3)
  const [costPerKW, setCostPerKW] = useState(55_000)
  const [subsidyPct, setSubsidyPct] = useState(20)
  const [sunHoursPerDay, setSunHoursPerDay] = useState(4)
  const [tariff, setTariff] = useState(8)

  const result = useMemo(() => {
    const grossCost = clamp0(systemKW) * clamp0(costPerKW)
    const subsidy = (grossCost * clamp0(subsidyPct)) / 100
    const netCost = grossCost - subsidy

    const monthlyUnits = clamp0(systemKW) * clamp0(sunHoursPerDay) * 30
    const monthlySavings = monthlyUnits * clamp0(tariff)
    const paybackMonths = monthlySavings > 0 ? netCost / monthlySavings : Infinity

    return { grossCost, subsidy, netCost, monthlyUnits, monthlySavings, paybackMonths }
  }, [systemKW, costPerKW, subsidyPct, sunHoursPerDay, tariff])

  return (
    <FinancialCalculatorTemplate
      title="Solar Rooftop Calculator"
      description="Estimate solar rooftop setup cost and simple payback period."
      icon={Home}
      calculate={() => {}}
      values={[systemKW, costPerKW, subsidyPct, sunHoursPerDay, tariff]}
      onClear={() => {
        setSystemKW(3)
        setCostPerKW(55_000)
        setSubsidyPct(20)
        setSunHoursPerDay(4)
        setTariff(8)
      }}
      onRestoreAction={(vals) => {
        setSystemKW(Number(vals?.[0] ?? 3))
        setCostPerKW(Number(vals?.[1] ?? 55_000))
        setSubsidyPct(Number(vals?.[2] ?? 20))
        setSunHoursPerDay(Number(vals?.[3] ?? 4))
        setTariff(Number(vals?.[4] ?? 8))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="System Size" value={systemKW} onChange={setSystemKW} min={0} max={1000} step={0.1} suffix=" kW" />
          <InputGroup label="Cost per kW" value={costPerKW} onChange={setCostPerKW} min={0} max={1e7} step={100} prefix="₹" />
          <InputGroup label="Subsidy" value={subsidyPct} onChange={setSubsidyPct} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Avg Sun Hours" value={sunHoursPerDay} onChange={setSunHoursPerDay} min={0} max={12} step={0.1} suffix=" hours/day" />
          <InputGroup label="Electricity Tariff" value={tariff} onChange={setTariff} min={0} max={100} step={0.1} prefix="₹" suffix=" /kWh" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Net Cost" value={fmtINR(result.netCost)} type="highlight" />
          <ResultCard label="Est. Monthly Units" value={fmtNumber(result.monthlyUnits, 0)} />
          <ResultCard label="Monthly Savings" value={fmtINR(result.monthlySavings)} type="success" />
          <ResultCard
            label="Payback"
            value={Number.isFinite(result.paybackMonths) ? `${fmtNumber(result.paybackMonths, 1)} months` : "-"}
          />
        </div>
      }
    />
  )
}

export function BricksCalculator() {
  const [wallAreaSqFt, setWallAreaSqFt] = useState(1000)
  const [bricksPerSqFt, setBricksPerSqFt] = useState(7)
  const [wastagePct, setWastagePct] = useState(5)
  const [costPerBrick, setCostPerBrick] = useState(10)

  const result = useMemo(() => {
    const base = clamp0(wallAreaSqFt) * clamp0(bricksPerSqFt)
    const totalBricks = base * (1 + clamp0(wastagePct) / 100)
    const cost = totalBricks * clamp0(costPerBrick)
    return { totalBricks, cost }
  }, [wallAreaSqFt, bricksPerSqFt, wastagePct, costPerBrick])

  return (
    <FinancialCalculatorTemplate
      title="Bricks Calculator"
      description="Estimate brick quantity and cost based on wall area."
      icon={Building}
      calculate={() => {}}
      values={[wallAreaSqFt, bricksPerSqFt, wastagePct, costPerBrick]}
      onClear={() => {
        setWallAreaSqFt(1000)
        setBricksPerSqFt(7)
        setWastagePct(5)
        setCostPerBrick(10)
      }}
      onRestoreAction={(vals) => {
        setWallAreaSqFt(Number(vals?.[0] ?? 1000))
        setBricksPerSqFt(Number(vals?.[1] ?? 7))
        setWastagePct(Number(vals?.[2] ?? 5))
        setCostPerBrick(Number(vals?.[3] ?? 10))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Wall Area" value={wallAreaSqFt} onChange={setWallAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Bricks per sq ft" value={bricksPerSqFt} onChange={setBricksPerSqFt} min={0} max={50} step={0.1} />
          <InputGroup label="Wastage" value={wastagePct} onChange={setWastagePct} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Cost per Brick" value={costPerBrick} onChange={setCostPerBrick} min={0} max={1000} step={0.1} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Total Bricks" value={fmtNumber(result.totalBricks, 0)} type="highlight" />
          <ResultCard label="Estimated Cost" value={fmtINR(result.cost)} type="success" />
        </div>
      }
    />
  )
}

export function CementCalculator() {
  const [volumeM3, setVolumeM3] = useState(5)
  const [bagsPerM3, setBagsPerM3] = useState(7)
  const [bagPrice, setBagPrice] = useState(420)

  const result = useMemo(() => {
    const bags = clamp0(volumeM3) * clamp0(bagsPerM3)
    const cost = bags * clamp0(bagPrice)
    return { bags, cost }
  }, [volumeM3, bagsPerM3, bagPrice])

  return (
    <FinancialCalculatorTemplate
      title="Cement Calculator"
      description="Estimate cement bags and cost from concrete volume."
      icon={Building}
      calculate={() => {}}
      values={[volumeM3, bagsPerM3, bagPrice]}
      onClear={() => {
        setVolumeM3(5)
        setBagsPerM3(7)
        setBagPrice(420)
      }}
      onRestoreAction={(vals) => {
        setVolumeM3(Number(vals?.[0] ?? 5))
        setBagsPerM3(Number(vals?.[1] ?? 7))
        setBagPrice(Number(vals?.[2] ?? 420))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Concrete Volume" value={volumeM3} onChange={setVolumeM3} min={0} max={1e7} step={0.1} suffix=" m³" />
          <InputGroup label="Bags per m³" value={bagsPerM3} onChange={setBagsPerM3} min={0} max={50} step={0.1} />
          <InputGroup label="Price per Bag" value={bagPrice} onChange={setBagPrice} min={0} max={10_000} step={1} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Total Bags" value={fmtNumber(result.bags, 0)} type="highlight" />
          <ResultCard label="Estimated Cost" value={fmtINR(result.cost)} type="success" />
        </div>
      }
    />
  )
}

export function WaterTankCapacity() {
  const [lengthM, setLengthM] = useState(2)
  const [widthM, setWidthM] = useState(2)
  const [heightM, setHeightM] = useState(1.5)

  const liters = useMemo(() => clamp0(lengthM) * clamp0(widthM) * clamp0(heightM) * 1000, [lengthM, widthM, heightM])

  return (
    <FinancialCalculatorTemplate
      title="Water Tank Capacity"
      description="Compute tank capacity in liters using length × width × height."
      icon={CalculatorIcon}
      calculate={() => {}}
      values={[lengthM, widthM, heightM]}
      onClear={() => {
        setLengthM(2)
        setWidthM(2)
        setHeightM(1.5)
      }}
      onRestoreAction={(vals) => {
        setLengthM(Number(vals?.[0] ?? 2))
        setWidthM(Number(vals?.[1] ?? 2))
        setHeightM(Number(vals?.[2] ?? 1.5))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Length" value={lengthM} onChange={setLengthM} min={0} max={1000} step={0.01} suffix=" m" />
            <InputGroup label="Width" value={widthM} onChange={setWidthM} min={0} max={1000} step={0.01} suffix=" m" />
            <InputGroup label="Height" value={heightM} onChange={setHeightM} min={0} max={1000} step={0.01} suffix=" m" />
          </div>
        </div>
      }
      result={<ResultCard label="Capacity" value={`${fmtNumber(liters, 0)} L`} type="highlight" />}
    />
  )
}

export function ElectricalWiringCost() {
  const [areaSqFt, setAreaSqFt] = useState(1200)
  const [costPerSqFt, setCostPerSqFt] = useState(150)

  const total = useMemo(() => clamp0(areaSqFt) * clamp0(costPerSqFt), [areaSqFt, costPerSqFt])

  return (
    <FinancialCalculatorTemplate
      title="Electrical Wiring Cost"
      description="Estimate wiring cost using area and a per sq ft rate."
      icon={Home}
      calculate={() => {}}
      values={[areaSqFt, costPerSqFt]}
      onClear={() => {
        setAreaSqFt(1200)
        setCostPerSqFt(150)
      }}
      onRestoreAction={(vals) => {
        setAreaSqFt(Number(vals?.[0] ?? 1200))
        setCostPerSqFt(Number(vals?.[1] ?? 150))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Area" value={areaSqFt} onChange={setAreaSqFt} min={0} max={10_000_000} step={1} suffix=" sq ft" />
          <InputGroup label="Cost per sq ft" value={costPerSqFt} onChange={setCostPerSqFt} min={0} max={100_000} step={1} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function PlumbingCostCalculator() {
  const [bathrooms, setBathrooms] = useState(2)
  const [costPerBathroom, setCostPerBathroom] = useState(60_000)

  const total = useMemo(() => clamp0(bathrooms) * clamp0(costPerBathroom), [bathrooms, costPerBathroom])

  return (
    <FinancialCalculatorTemplate
      title="Plumbing Cost Estimator"
      description="Estimate plumbing cost based on number of bathrooms."
      icon={Home}
      calculate={() => {}}
      values={[bathrooms, costPerBathroom]}
      onClear={() => {
        setBathrooms(2)
        setCostPerBathroom(60_000)
      }}
      onRestoreAction={(vals) => {
        setBathrooms(Number(vals?.[0] ?? 2))
        setCostPerBathroom(Number(vals?.[1] ?? 60_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Bathrooms" value={bathrooms} onChange={setBathrooms} min={0} max={50} step={1} />
          <InputGroup label="Cost per Bathroom" value={costPerBathroom} onChange={setCostPerBathroom} min={0} max={1e8} step={1000} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function BathroomRenovationCost() {
  const [bathrooms, setBathrooms] = useState(1)
  const [costPerBathroom, setCostPerBathroom] = useState(1_50_000)

  const total = useMemo(() => clamp0(bathrooms) * clamp0(costPerBathroom), [bathrooms, costPerBathroom])

  return (
    <FinancialCalculatorTemplate
      title="Bathroom Renovation Cost"
      description="Estimate renovation cost based on number of bathrooms."
      icon={Home}
      calculate={() => {}}
      values={[bathrooms, costPerBathroom]}
      onClear={() => {
        setBathrooms(1)
        setCostPerBathroom(1_50_000)
      }}
      onRestoreAction={(vals) => {
        setBathrooms(Number(vals?.[0] ?? 1))
        setCostPerBathroom(Number(vals?.[1] ?? 1_50_000))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Bathrooms" value={bathrooms} onChange={setBathrooms} min={0} max={50} step={1} />
          <InputGroup label="Cost per Bathroom" value={costPerBathroom} onChange={setCostPerBathroom} min={0} max={1e9} step={1000} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function StaircaseCalculator() {
  const [floorHeightMm, setFloorHeightMm] = useState(3000)
  const [riserMm, setRiserMm] = useState(170)
  const [treadMm, setTreadMm] = useState(250)

  const result = useMemo(() => {
    const steps = riserMm > 0 ? Math.max(1, Math.ceil(clamp0(floorHeightMm) / riserMm)) : 0
    const actualRiser = steps > 0 ? clamp0(floorHeightMm) / steps : 0
    const runMm = steps > 1 ? (steps - 1) * clamp0(treadMm) : 0
    return { steps, actualRiser, runMm }
  }, [floorHeightMm, riserMm, treadMm])

  return (
    <FinancialCalculatorTemplate
      title="Staircase Calculator"
      description="Estimate number of steps and total run from floor height, riser, and tread."
      icon={Ruler}
      calculate={() => {}}
      values={[floorHeightMm, riserMm, treadMm]}
      onClear={() => {
        setFloorHeightMm(3000)
        setRiserMm(170)
        setTreadMm(250)
      }}
      onRestoreAction={(vals) => {
        setFloorHeightMm(Number(vals?.[0] ?? 3000))
        setRiserMm(Number(vals?.[1] ?? 170))
        setTreadMm(Number(vals?.[2] ?? 250))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Floor Height" value={floorHeightMm} onChange={setFloorHeightMm} min={0} max={100_000} step={1} suffix=" mm" />
          <InputGroup label="Target Riser" value={riserMm} onChange={setRiserMm} min={1} max={300} step={1} suffix=" mm" />
          <InputGroup label="Tread Depth" value={treadMm} onChange={setTreadMm} min={1} max={500} step={1} suffix=" mm" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Steps" value={fmtNumber(result.steps, 0)} type="highlight" />
          <ResultCard label="Actual Riser" value={`${fmtNumber(result.actualRiser, 1)} mm`} />
          <ResultCard label="Total Run" value={`${fmtNumber(result.runMm / 1000, 2)} m`} type="success" />
        </div>
      }
    />
  )
}

export function SepticTankSize() {
  const [users, setUsers] = useState(5)
  const [litersPerPersonPerDay, setLitersPerPersonPerDay] = useState(120)
  const [retentionDays, setRetentionDays] = useState(2)
  const [safetyPct, setSafetyPct] = useState(20)

  const result = useMemo(() => {
    const base = clamp0(users) * clamp0(litersPerPersonPerDay) * clamp0(retentionDays)
    const total = base * (1 + clamp0(safetyPct) / 100)
    return { liters: total, m3: total / 1000 }
  }, [users, litersPerPersonPerDay, retentionDays, safetyPct])

  return (
    <FinancialCalculatorTemplate
      title="Septic Tank Size"
      description="Estimate septic tank volume based on users and retention time."
      icon={Home}
      calculate={() => {}}
      values={[users, litersPerPersonPerDay, retentionDays, safetyPct]}
      onClear={() => {
        setUsers(5)
        setLitersPerPersonPerDay(120)
        setRetentionDays(2)
        setSafetyPct(20)
      }}
      onRestoreAction={(vals) => {
        setUsers(Number(vals?.[0] ?? 5))
        setLitersPerPersonPerDay(Number(vals?.[1] ?? 120))
        setRetentionDays(Number(vals?.[2] ?? 2))
        setSafetyPct(Number(vals?.[3] ?? 20))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Number of Users" value={users} onChange={setUsers} min={0} max={200} step={1} />
          <InputGroup label="Liters per Person per Day" value={litersPerPersonPerDay} onChange={setLitersPerPersonPerDay} min={0} max={1000} step={1} suffix=" L" />
          <InputGroup label="Retention Days" value={retentionDays} onChange={setRetentionDays} min={1} max={30} step={1} />
          <InputGroup label="Safety Margin" value={safetyPct} onChange={setSafetyPct} min={0} max={100} step={1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Volume" value={`${fmtNumber(result.liters, 0)} L`} type="highlight" />
          <ResultCard label="In m³" value={fmtNumber(result.m3, 2)} type="success" />
        </div>
      }
    />
  )
}

export function RainwaterHarvesting() {
  const [roofAreaSqM, setRoofAreaSqM] = useState(100)
  const [rainfallMm, setRainfallMm] = useState(800)
  const [runoffCoefficient, setRunoffCoefficient] = useState(0.85)
  const [efficiencyPct, setEfficiencyPct] = useState(80)

  const liters = useMemo(() => {
    const rainM = clamp0(rainfallMm) / 1000
    const collected = clamp0(roofAreaSqM) * rainM * clamp0(runoffCoefficient)
    const effective = collected * (clamp0(efficiencyPct) / 100)
    return effective * 1000
  }, [roofAreaSqM, rainfallMm, runoffCoefficient, efficiencyPct])

  return (
    <FinancialCalculatorTemplate
      title="Rainwater Harvesting"
      description="Estimate annual rainwater collection from roof area and rainfall."
      icon={Home}
      calculate={() => {}}
      values={[roofAreaSqM, rainfallMm, runoffCoefficient, efficiencyPct]}
      onClear={() => {
        setRoofAreaSqM(100)
        setRainfallMm(800)
        setRunoffCoefficient(0.85)
        setEfficiencyPct(80)
      }}
      onRestoreAction={(vals) => {
        setRoofAreaSqM(Number(vals?.[0] ?? 100))
        setRainfallMm(Number(vals?.[1] ?? 800))
        setRunoffCoefficient(Number(vals?.[2] ?? 0.85))
        setEfficiencyPct(Number(vals?.[3] ?? 80))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Roof Area" value={roofAreaSqM} onChange={setRoofAreaSqM} min={0} max={1e7} step={0.1} suffix=" m²" />
          <InputGroup label="Annual Rainfall" value={rainfallMm} onChange={setRainfallMm} min={0} max={10_000} step={1} suffix=" mm" />
          <InputGroup label="Runoff Coefficient" value={runoffCoefficient} onChange={setRunoffCoefficient} min={0} max={1} step={0.01} />
          <InputGroup label="System Efficiency" value={efficiencyPct} onChange={setEfficiencyPct} min={0} max={100} step={1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Annual Collection" value={`${fmtNumber(liters, 0)} L`} type="highlight" />}
    />
  )
}

export function FenceCostCalculator() {
  const [perimeterM, setPerimeterM] = useState(120)
  const [costPerM, setCostPerM] = useState(800)

  const total = useMemo(() => clamp0(perimeterM) * clamp0(costPerM), [perimeterM, costPerM])

  return (
    <FinancialCalculatorTemplate
      title="Fencing Cost Calculator"
      description="Estimate fencing cost using perimeter and per-meter rate."
      icon={Ruler}
      calculate={() => {}}
      values={[perimeterM, costPerM]}
      onClear={() => {
        setPerimeterM(120)
        setCostPerM(800)
      }}
      onRestoreAction={(vals) => {
        setPerimeterM(Number(vals?.[0] ?? 120))
        setCostPerM(Number(vals?.[1] ?? 800))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Perimeter" value={perimeterM} onChange={setPerimeterM} min={0} max={1e7} step={0.1} suffix=" m" />
          <InputGroup label="Cost per Meter" value={costPerM} onChange={setCostPerM} min={0} max={1e7} step={1} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function DrivewayCostCalculator() {
  const [areaSqM, setAreaSqM] = useState(50)
  const [costPerSqM, setCostPerSqM] = useState(1500)

  const total = useMemo(() => clamp0(areaSqM) * clamp0(costPerSqM), [areaSqM, costPerSqM])

  return (
    <FinancialCalculatorTemplate
      title="Driveway Cost Calculator"
      description="Estimate driveway cost from area and per m² rate."
      icon={Ruler}
      calculate={() => {}}
      values={[areaSqM, costPerSqM]}
      onClear={() => {
        setAreaSqM(50)
        setCostPerSqM(1500)
      }}
      onRestoreAction={(vals) => {
        setAreaSqM(Number(vals?.[0] ?? 50))
        setCostPerSqM(Number(vals?.[1] ?? 1500))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Driveway Area" value={areaSqM} onChange={setAreaSqM} min={0} max={1e7} step={0.1} suffix=" m²" />
          <InputGroup label="Cost per m²" value={costPerSqM} onChange={setCostPerSqM} min={0} max={1e7} step={1} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}

export function PoolCostCalculator() {
  const [areaSqM, setAreaSqM] = useState(25)
  const [costPerSqM, setCostPerSqM] = useState(12_000)
  const [extraFixedCost, setExtraFixedCost] = useState(0)

  const total = useMemo(
    () => clamp0(areaSqM) * clamp0(costPerSqM) + clamp0(extraFixedCost),
    [areaSqM, costPerSqM, extraFixedCost]
  )

  return (
    <FinancialCalculatorTemplate
      title="Swimming Pool Cost"
      description="Estimate pool cost based on surface area and rate per m²."
      icon={Home}
      calculate={() => {}}
      values={[areaSqM, costPerSqM, extraFixedCost]}
      onClear={() => {
        setAreaSqM(25)
        setCostPerSqM(12_000)
        setExtraFixedCost(0)
      }}
      onRestoreAction={(vals) => {
        setAreaSqM(Number(vals?.[0] ?? 25))
        setCostPerSqM(Number(vals?.[1] ?? 12_000))
        setExtraFixedCost(Number(vals?.[2] ?? 0))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Pool Surface Area" value={areaSqM} onChange={setAreaSqM} min={0} max={1e6} step={0.1} suffix=" m²" />
          <InputGroup label="Cost per m²" value={costPerSqM} onChange={setCostPerSqM} min={0} max={1e8} step={10} prefix="₹" />
          <InputGroup label="Extra Fixed Cost" value={extraFixedCost} onChange={setExtraFixedCost} min={0} max={1e12} step={1000} prefix="₹" />
        </div>
      }
      result={<ResultCard label="Estimated Cost" value={fmtINR(total)} type="highlight" />}
    />
  )
}
