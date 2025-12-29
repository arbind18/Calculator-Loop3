"use client"

import { useMemo, useState } from "react"
import { Briefcase, Car, HeartPulse, Home, Leaf, Package, Plane, Shield, Smartphone, Umbrella } from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"

const fmtNumber = (n: number, digits = 2) => {
  if (!Number.isFinite(n)) return "-"
  return n.toLocaleString("en-IN", { maximumFractionDigits: digits })
}

const fmtINR = (n: number, digits = 0) => {
  if (!Number.isFinite(n)) return "-"
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: digits })}`
}

const clamp0 = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0)

const fvAnnuityMonthly = (monthly: number, annualRatePct: number, years: number) => {
  const pmt = clamp0(monthly)
  const n = Math.max(0, Math.round(clamp0(years) * 12))
  const r = clamp0(annualRatePct) / 100 / 12
  if (n === 0) return 0
  if (r === 0) return pmt * n
  return pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

const ncbDiscountPct = (claimFreeYears: number) => {
  const y = Math.max(0, Math.floor(claimFreeYears))
  if (y >= 5) return 50
  if (y === 4) return 45
  if (y === 3) return 35
  if (y === 2) return 25
  if (y === 1) return 20
  return 0
}

export function InsuranceGSTCalculator() {
  const [premium, setPremium] = useState(10_000)
  const [gstRatePct, setGstRatePct] = useState(18)
  const [isInclusive, setIsInclusive] = useState(false)

  const result = useMemo(() => {
    const rate = clamp0(gstRatePct) / 100
    const p = clamp0(premium)

    if (rate === 0) {
      return { base: p, gst: 0, total: p }
    }

    if (isInclusive) {
      const base = p / (1 + rate)
      const gst = p - base
      return { base, gst, total: p }
    }

    const gst = p * rate
    const total = p + gst
    return { base: p, gst, total }
  }, [premium, gstRatePct, isInclusive])

  return (
    <FinancialCalculatorTemplate
      title="Insurance GST Calculator"
      description="Calculate GST amount on an insurance premium (exclusive or inclusive)."
      icon={Briefcase}
      calculate={() => {}}
      values={[premium, gstRatePct, isInclusive]}
      onClear={() => {
        setPremium(10_000)
        setGstRatePct(18)
        setIsInclusive(false)
      }}
      onRestoreAction={(vals) => {
        setPremium(Number(vals?.[0] ?? 10_000))
        setGstRatePct(Number(vals?.[1] ?? 18))
        setIsInclusive(Boolean(vals?.[2] ?? false))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Premium Amount" value={premium} onChange={setPremium} min={0} max={1e10} step={100} prefix="₹" />
          <InputGroup label="GST Rate" value={gstRatePct} onChange={setGstRatePct} min={0} max={50} step={0.1} suffix="%" />
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Premium includes GST</span>
            <input
              type="checkbox"
              checked={isInclusive}
              onChange={(e) => setIsInclusive(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Base Premium" value={fmtINR(result.base)} />
          <ResultCard label="GST Amount" value={fmtINR(result.gst)} type="highlight" />
          <ResultCard label="Total Premium" value={fmtINR(result.total)} type="success" />
        </div>
      }
    />
  )
}

export function MotorInsuranceCalculator() {
  const [vehicleValue, setVehicleValue] = useState(8_00_000)
  const [baseRatePct, setBaseRatePct] = useState(2.5)
  const [claimFreeYears, setClaimFreeYears] = useState(2)
  const [addOnCost, setAddOnCost] = useState(2_500)

  const result = useMemo(() => {
    const basePremium = (clamp0(vehicleValue) * clamp0(baseRatePct)) / 100
    const discPct = ncbDiscountPct(claimFreeYears)
    const discount = (basePremium * discPct) / 100
    const net = basePremium - discount + clamp0(addOnCost)
    return { basePremium, discPct, discount, net }
  }, [vehicleValue, baseRatePct, claimFreeYears, addOnCost])

  return (
    <FinancialCalculatorTemplate
      title="Motor Insurance Premium"
      description="Estimate own-damage premium using vehicle value, base rate, and NCB discount."
      icon={Car}
      calculate={() => {}}
      values={[vehicleValue, baseRatePct, claimFreeYears, addOnCost]}
      onClear={() => {
        setVehicleValue(8_00_000)
        setBaseRatePct(2.5)
        setClaimFreeYears(2)
        setAddOnCost(2_500)
      }}
      onRestoreAction={(vals) => {
        setVehicleValue(Number(vals?.[0] ?? 8_00_000))
        setBaseRatePct(Number(vals?.[1] ?? 2.5))
        setClaimFreeYears(Number(vals?.[2] ?? 2))
        setAddOnCost(Number(vals?.[3] ?? 2_500))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Vehicle Value (IDV)" value={vehicleValue} onChange={setVehicleValue} min={0} max={1e10} step={1000} prefix="₹" />
          <InputGroup label="Base Rate" value={baseRatePct} onChange={setBaseRatePct} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Claim-free Years" value={claimFreeYears} onChange={setClaimFreeYears} min={0} max={10} step={1} />
          <InputGroup label="Add-on Cost (Optional)" value={addOnCost} onChange={setAddOnCost} min={0} max={1e8} step={100} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ResultCard label="Base Premium" value={fmtINR(result.basePremium)} />
          <ResultCard label="NCB" value={`${result.discPct}%`} type="highlight" />
          <ResultCard label="Discount" value={fmtINR(result.discount)} type="success" />
          <ResultCard label="Estimated Premium" value={fmtINR(result.net)} type="highlight" />
        </div>
      }
    />
  )
}

export function EndowmentCalculator() {
  const [monthlyPremium, setMonthlyPremium] = useState(3000)
  const [termYears, setTermYears] = useState(20)
  const [assumedReturn, setAssumedReturn] = useState(6)

  const maturity = useMemo(
    () => fvAnnuityMonthly(monthlyPremium, assumedReturn, termYears),
    [monthlyPremium, assumedReturn, termYears]
  )

  const invested = useMemo(() => clamp0(monthlyPremium) * clamp0(termYears) * 12, [monthlyPremium, termYears])
  const gain = useMemo(() => maturity - invested, [maturity, invested])

  return (
    <FinancialCalculatorTemplate
      title="Endowment Policy"
      description="Simple maturity estimate using monthly premium and assumed return."
      icon={Shield}
      calculate={() => {}}
      values={[monthlyPremium, termYears, assumedReturn]}
      onClear={() => {
        setMonthlyPremium(3000)
        setTermYears(20)
        setAssumedReturn(6)
      }}
      onRestoreAction={(vals) => {
        setMonthlyPremium(Number(vals?.[0] ?? 3000))
        setTermYears(Number(vals?.[1] ?? 20))
        setAssumedReturn(Number(vals?.[2] ?? 6))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Premium" value={monthlyPremium} onChange={setMonthlyPremium} min={0} max={1e8} step={100} prefix="₹" />
          <InputGroup label="Policy Term" value={termYears} onChange={setTermYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Assumed Annual Return" value={assumedReturn} onChange={setAssumedReturn} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Premium Paid" value={fmtINR(invested)} />
          <ResultCard label="Estimated Maturity" value={fmtINR(maturity)} type="highlight" />
          <ResultCard label="Estimated Gain" value={fmtINR(gain)} type="success" />
        </div>
      }
    />
  )
}

export function ChildPlanCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(2000)
  const [years, setYears] = useState(15)
  const [assumedReturn, setAssumedReturn] = useState(8)

  const fv = useMemo(
    () => fvAnnuityMonthly(monthlyInvestment, assumedReturn, years),
    [monthlyInvestment, assumedReturn, years]
  )
  const invested = useMemo(() => clamp0(monthlyInvestment) * clamp0(years) * 12, [monthlyInvestment, years])

  return (
    <FinancialCalculatorTemplate
      title="Child Plan"
      description="Estimate future value from monthly investment for your child’s education goals."
      icon={HeartPulse}
      calculate={() => {}}
      values={[monthlyInvestment, years, assumedReturn]}
      onClear={() => {
        setMonthlyInvestment(2000)
        setYears(15)
        setAssumedReturn(8)
      }}
      onRestoreAction={(vals) => {
        setMonthlyInvestment(Number(vals?.[0] ?? 2000))
        setYears(Number(vals?.[1] ?? 15))
        setAssumedReturn(Number(vals?.[2] ?? 8))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Investment" value={monthlyInvestment} onChange={setMonthlyInvestment} min={0} max={1e8} step={100} prefix="₹" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" years" />
          <InputGroup label="Assumed Annual Return" value={assumedReturn} onChange={setAssumedReturn} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Invested" value={fmtINR(invested)} />
          <ResultCard label="Estimated Value" value={fmtINR(fv)} type="highlight" />
          <ResultCard label="Estimated Gain" value={fmtINR(fv - invested)} type="success" />
        </div>
      }
    />
  )
}

export function NCBCalculator() {
  const [basePremium, setBasePremium] = useState(12_000)
  const [claimFreeYears, setClaimFreeYears] = useState(3)

  const result = useMemo(() => {
    const pct = ncbDiscountPct(claimFreeYears)
    const discount = (clamp0(basePremium) * pct) / 100
    const net = clamp0(basePremium) - discount
    return { pct, discount, net }
  }, [basePremium, claimFreeYears])

  return (
    <FinancialCalculatorTemplate
      title="No Claim Bonus (NCB)"
      description="Estimate NCB discount and net premium."
      icon={Car}
      calculate={() => {}}
      values={[basePremium, claimFreeYears]}
      onClear={() => {
        setBasePremium(12_000)
        setClaimFreeYears(3)
      }}
      onRestoreAction={(vals) => {
        setBasePremium(Number(vals?.[0] ?? 12_000))
        setClaimFreeYears(Number(vals?.[1] ?? 3))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Base Premium" value={basePremium} onChange={setBasePremium} min={0} max={1e8} step={100} prefix="₹" />
          <InputGroup label="Claim-free Years" value={claimFreeYears} onChange={setClaimFreeYears} min={0} max={10} step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="NCB %" value={`${result.pct}%`} type="highlight" />
          <ResultCard label="Discount" value={fmtINR(result.discount)} type="success" />
          <ResultCard label="Net Premium" value={fmtINR(result.net)} type="highlight" />
        </div>
      }
    />
  )
}

export function TermVsInvestCalculator() {
  const [annualTermPremium, setAnnualTermPremium] = useState(12_000)
  const [years, setYears] = useState(25)
  const [annualInvestmentReturn, setAnnualInvestmentReturn] = useState(10)

  const fv = useMemo(
    () => fvAnnuityMonthly(annualTermPremium / 12, annualInvestmentReturn, years),
    [annualTermPremium, annualInvestmentReturn, years]
  )
  const cost = useMemo(() => clamp0(annualTermPremium) * clamp0(years), [annualTermPremium, years])

  return (
    <FinancialCalculatorTemplate
      title="Term vs Invest"
      description="Illustration: invest the annual term premium amount and see estimated future value."
      icon={Umbrella}
      calculate={() => {}}
      values={[annualTermPremium, years, annualInvestmentReturn]}
      onClear={() => {
        setAnnualTermPremium(12_000)
        setYears(25)
        setAnnualInvestmentReturn(10)
      }}
      onRestoreAction={(vals) => {
        setAnnualTermPremium(Number(vals?.[0] ?? 12_000))
        setYears(Number(vals?.[1] ?? 25))
        setAnnualInvestmentReturn(Number(vals?.[2] ?? 10))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Term Premium" value={annualTermPremium} onChange={setAnnualTermPremium} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Years" value={years} onChange={setYears} min={1} max={60} step={1} suffix=" years" />
          <InputGroup label="Assumed Return" value={annualInvestmentReturn} onChange={setAnnualInvestmentReturn} min={0} max={25} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Premium Paid" value={fmtINR(cost)} />
          <ResultCard label="Invested FV (Illustration)" value={fmtINR(fv)} type="highlight" />
          <ResultCard label="FV − Cost" value={fmtINR(fv - cost)} type="success" />
        </div>
      }
    />
  )
}

export function PLICalculator() {
  const [sumAssured, setSumAssured] = useState(5_00_000)
  const [termYears, setTermYears] = useState(20)
  const [ratePerThousand, setRatePerThousand] = useState(5)

  const annual = useMemo(
    () => (clamp0(sumAssured) / 1000) * clamp0(ratePerThousand),
    [sumAssured, ratePerThousand]
  )
  const total = useMemo(() => annual * clamp0(termYears), [annual, termYears])

  return (
    <FinancialCalculatorTemplate
      title="PLI Calculator"
      description="Simple Postal Life Insurance premium illustration using a per-thousand rate."
      icon={Shield}
      calculate={() => {}}
      values={[sumAssured, termYears, ratePerThousand]}
      onClear={() => {
        setSumAssured(5_00_000)
        setTermYears(20)
        setRatePerThousand(5)
      }}
      onRestoreAction={(vals) => {
        setSumAssured(Number(vals?.[0] ?? 5_00_000))
        setTermYears(Number(vals?.[1] ?? 20))
        setRatePerThousand(Number(vals?.[2] ?? 5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Sum Assured" value={sumAssured} onChange={setSumAssured} min={0} max={1e10} step={1000} prefix="₹" />
          <InputGroup label="Policy Term" value={termYears} onChange={setTermYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Rate per ₹1000 (annual)" value={ratePerThousand} onChange={setRatePerThousand} min={0} max={100} step={0.1} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Annual Premium" value={fmtINR(annual)} type="highlight" />
          <ResultCard label="Total Premium (Term)" value={fmtINR(total)} />
        </div>
      }
    />
  )
}

export function TravelInsuranceCost() {
  const [days, setDays] = useState(7)
  const [age, setAge] = useState(30)
  const [coverage, setCoverage] = useState(5_00_000)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(() => {
    const base = 200
    const ageFactor = age <= 40 ? 1 : age <= 60 ? 1.6 : 2.2
    const coverFactor = clamp0(coverage) / 5_00_000
    return base * clamp0(days) * ageFactor * coverFactor * clamp0(riskMultiplier)
  }, [days, age, coverage, riskMultiplier])

  return (
    <FinancialCalculatorTemplate
      title="Travel Insurance Cost"
      description="Estimate travel insurance cost based on trip duration, age, and cover."
      icon={Plane}
      calculate={() => {}}
      values={[days, age, coverage, riskMultiplier]}
      onClear={() => {
        setDays(7)
        setAge(30)
        setCoverage(5_00_000)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setDays(Number(vals?.[0] ?? 7))
        setAge(Number(vals?.[1] ?? 30))
        setCoverage(Number(vals?.[2] ?? 5_00_000))
        setRiskMultiplier(Number(vals?.[3] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Trip Days" value={days} onChange={setDays} min={1} max={365} step={1} />
          <InputGroup label="Traveler Age" value={age} onChange={setAge} min={0} max={100} step={1} />
          <InputGroup label="Coverage Amount" value={coverage} onChange={setCoverage} min={0} max={1e9} step={10_000} prefix="₹" />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function HomeInsuranceCalculator() {
  const [homeValue, setHomeValue] = useState(60_00_000)
  const [coveragePct, setCoveragePct] = useState(80)
  const [ratePct, setRatePct] = useState(0.2)

  const result = useMemo(() => {
    const insured = (clamp0(homeValue) * clamp0(coveragePct)) / 100
    const premium = (insured * clamp0(ratePct)) / 100
    return { insured, premium }
  }, [homeValue, coveragePct, ratePct])

  return (
    <FinancialCalculatorTemplate
      title="Home Insurance"
      description="Estimate premium using home insured value and rate."
      icon={Home}
      calculate={() => {}}
      values={[homeValue, coveragePct, ratePct]}
      onClear={() => {
        setHomeValue(60_00_000)
        setCoveragePct(80)
        setRatePct(0.2)
      }}
      onRestoreAction={(vals) => {
        setHomeValue(Number(vals?.[0] ?? 60_00_000))
        setCoveragePct(Number(vals?.[1] ?? 80))
        setRatePct(Number(vals?.[2] ?? 0.2))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Home Value" value={homeValue} onChange={setHomeValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Coverage" value={coveragePct} onChange={setCoveragePct} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={5} step={0.01} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Sum Insured" value={fmtINR(result.insured)} />
          <ResultCard label="Estimated Premium" value={fmtINR(result.premium)} type="highlight" />
        </div>
      }
    />
  )
}

export function CriticalIllnessCover() {
  const [age, setAge] = useState(35)
  const [cover, setCover] = useState(10_00_000)
  const [smoker, setSmoker] = useState(false)

  const premium = useMemo(() => {
    const baseRate = 0.7 + Math.max(0, age - 30) * 0.03
    const smokerFactor = smoker ? 1.4 : 1
    return (clamp0(cover) * baseRate * smokerFactor) / 100
  }, [age, cover, smoker])

  return (
    <FinancialCalculatorTemplate
      title="Critical Illness Cover"
      description="Approximate annual premium based on age, cover, and smoking status."
      icon={HeartPulse}
      calculate={() => {}}
      values={[age, cover, smoker]}
      onClear={() => {
        setAge(35)
        setCover(10_00_000)
        setSmoker(false)
      }}
      onRestoreAction={(vals) => {
        setAge(Number(vals?.[0] ?? 35))
        setCover(Number(vals?.[1] ?? 10_00_000))
        setSmoker(Boolean(vals?.[2] ?? false))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Age" value={age} onChange={setAge} min={0} max={100} step={1} />
          <InputGroup label="Cover Amount" value={cover} onChange={setCover} min={0} max={1e10} step={10_000} prefix="₹" />
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Smoker</span>
            <input
              type="checkbox"
              checked={smoker}
              onChange={(e) => setSmoker(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
        </div>
      }
      result={<ResultCard label="Estimated Annual Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function CyberInsuranceCalculator() {
  const [cover, setCover] = useState(5_00_000)
  const [devices, setDevices] = useState(3)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(() => {
    const base = 500
    const coverFactor = clamp0(cover) / 5_00_000
    const deviceFactor = 1 + Math.max(0, devices - 1) * 0.15
    return base * coverFactor * deviceFactor * clamp0(riskMultiplier)
  }, [cover, devices, riskMultiplier])

  return (
    <FinancialCalculatorTemplate
      title="Cyber Insurance"
      description="Estimate annual cyber insurance premium based on cover and number of devices."
      icon={Smartphone}
      calculate={() => {}}
      values={[cover, devices, riskMultiplier]}
      onClear={() => {
        setCover(5_00_000)
        setDevices(3)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setCover(Number(vals?.[0] ?? 5_00_000))
        setDevices(Number(vals?.[1] ?? 3))
        setRiskMultiplier(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Cover Amount" value={cover} onChange={setCover} min={0} max={1e9} step={10_000} prefix="₹" />
          <InputGroup label="Devices" value={devices} onChange={setDevices} min={1} max={50} step={1} />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function SurrenderValueCalculator() {
  const [annualPremium, setAnnualPremium] = useState(30_000)
  const [yearsPaid, setYearsPaid] = useState(5)
  const [policyTermYears, setPolicyTermYears] = useState(20)
  const [surrenderFactorPct, setSurrenderFactorPct] = useState(30)

  const result = useMemo(() => {
    const paid = clamp0(annualPremium) * clamp0(yearsPaid)
    const vestingFactor = Math.min(1, clamp0(yearsPaid) / Math.max(1, clamp0(policyTermYears)))
    const gross = paid * vestingFactor
    const surrender = (gross * clamp0(surrenderFactorPct)) / 100
    return { paid, gross, surrender }
  }, [annualPremium, yearsPaid, policyTermYears, surrenderFactorPct])

  return (
    <FinancialCalculatorTemplate
      title="Surrender Value"
      description="Illustrative surrender value based on premiums paid and a surrender factor."
      icon={Shield}
      calculate={() => {}}
      values={[annualPremium, yearsPaid, policyTermYears, surrenderFactorPct]}
      onClear={() => {
        setAnnualPremium(30_000)
        setYearsPaid(5)
        setPolicyTermYears(20)
        setSurrenderFactorPct(30)
      }}
      onRestoreAction={(vals) => {
        setAnnualPremium(Number(vals?.[0] ?? 30_000))
        setYearsPaid(Number(vals?.[1] ?? 5))
        setPolicyTermYears(Number(vals?.[2] ?? 20))
        setSurrenderFactorPct(Number(vals?.[3] ?? 30))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Premium" value={annualPremium} onChange={setAnnualPremium} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Years Paid" value={yearsPaid} onChange={setYearsPaid} min={0} max={60} step={1} />
          <InputGroup label="Policy Term" value={policyTermYears} onChange={setPolicyTermYears} min={1} max={60} step={1} suffix=" years" />
          <InputGroup label="Surrender Factor" value={surrenderFactorPct} onChange={setSurrenderFactorPct} min={0} max={100} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Premiums Paid" value={fmtINR(result.paid)} />
          <ResultCard label="Vested Amount" value={fmtINR(result.gross)} />
          <ResultCard label="Estimated Surrender" value={fmtINR(result.surrender)} type="highlight" />
        </div>
      }
    />
  )
}

export function PetInsuranceCalculator() {
  const [petAge, setPetAge] = useState(3)
  const [cover, setCover] = useState(50_000)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(() => {
    const base = 1200
    const ageFactor = petAge <= 4 ? 1 : petAge <= 8 ? 1.4 : 1.9
    const coverFactor = clamp0(cover) / 50_000
    return base * ageFactor * coverFactor * clamp0(riskMultiplier)
  }, [petAge, cover, riskMultiplier])

  return (
    <FinancialCalculatorTemplate
      title="Pet Insurance"
      description="Estimate pet insurance premium based on pet age and cover amount."
      icon={HeartPulse}
      calculate={() => {}}
      values={[petAge, cover, riskMultiplier]}
      onClear={() => {
        setPetAge(3)
        setCover(50_000)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setPetAge(Number(vals?.[0] ?? 3))
        setCover(Number(vals?.[1] ?? 50_000))
        setRiskMultiplier(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Pet Age" value={petAge} onChange={setPetAge} min={0} max={30} step={1} suffix=" years" />
          <InputGroup label="Cover Amount" value={cover} onChange={setCover} min={0} max={1e7} step={1000} prefix="₹" />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Annual Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function BicycleInsuranceCalculator() {
  const [bikeValue, setBikeValue] = useState(40_000)
  const [theftAddOn, setTheftAddOn] = useState(true)

  const premium = useMemo(() => {
    const base = (clamp0(bikeValue) * 2.5) / 100
    const addOn = theftAddOn ? 300 : 0
    return base + addOn
  }, [bikeValue, theftAddOn])

  return (
    <FinancialCalculatorTemplate
      title="Bicycle Insurance"
      description="Simple bicycle insurance premium estimate."
      icon={Package}
      calculate={() => {}}
      values={[bikeValue, theftAddOn]}
      onClear={() => {
        setBikeValue(40_000)
        setTheftAddOn(true)
      }}
      onRestoreAction={(vals) => {
        setBikeValue(Number(vals?.[0] ?? 40_000))
        setTheftAddOn(Boolean(vals?.[1] ?? true))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Bicycle Value" value={bikeValue} onChange={setBikeValue} min={0} max={1e8} step={100} prefix="₹" />
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span>Theft Add-on</span>
            <input
              type="checkbox"
              checked={theftAddOn}
              onChange={(e) => setTheftAddOn(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
        </div>
      }
      result={<ResultCard label="Estimated Annual Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function MobileInsuranceCalculator() {
  const [phoneValue, setPhoneValue] = useState(30_000)
  const [ratePct, setRatePct] = useState(4)

  const premium = useMemo(() => (clamp0(phoneValue) * clamp0(ratePct)) / 100, [phoneValue, ratePct])

  return (
    <FinancialCalculatorTemplate
      title="Mobile Insurance"
      description="Estimate premium based on phone value and rate %."
      icon={Smartphone}
      calculate={() => {}}
      values={[phoneValue, ratePct]}
      onClear={() => {
        setPhoneValue(30_000)
        setRatePct(4)
      }}
      onRestoreAction={(vals) => {
        setPhoneValue(Number(vals?.[0] ?? 30_000))
        setRatePct(Number(vals?.[1] ?? 4))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Phone Value" value={phoneValue} onChange={setPhoneValue} min={0} max={1e9} step={100} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Annual Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function WeddingInsuranceCalculator() {
  const [weddingBudget, setWeddingBudget] = useState(10_00_000)
  const [ratePct, setRatePct] = useState(1.5)

  const premium = useMemo(() => (clamp0(weddingBudget) * clamp0(ratePct)) / 100, [weddingBudget, ratePct])

  return (
    <FinancialCalculatorTemplate
      title="Wedding Insurance"
      description="Estimate wedding insurance premium using budget and rate %."
      icon={Umbrella}
      calculate={() => {}}
      values={[weddingBudget, ratePct]}
      onClear={() => {
        setWeddingBudget(10_00_000)
        setRatePct(1.5)
      }}
      onRestoreAction={(vals) => {
        setWeddingBudget(Number(vals?.[0] ?? 10_00_000))
        setRatePct(Number(vals?.[1] ?? 1.5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Wedding Budget" value={weddingBudget} onChange={setWeddingBudget} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={10} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function GroupHealthInsurancePremium() {
  const [employees, setEmployees] = useState(25)
  const [sumInsuredPerEmployee, setSumInsuredPerEmployee] = useState(2_00_000)
  const [basePremiumPerEmployee, setBasePremiumPerEmployee] = useState(2500)
  const [dependentMultiplier, setDependentMultiplier] = useState(1.2)

  const result = useMemo(() => {
    const coverFactor = clamp0(sumInsuredPerEmployee) / 2_00_000
    const perEmployee = clamp0(basePremiumPerEmployee) * coverFactor * clamp0(dependentMultiplier)
    const total = clamp0(employees) * perEmployee
    return { perEmployee, total }
  }, [employees, sumInsuredPerEmployee, basePremiumPerEmployee, dependentMultiplier])

  return (
    <FinancialCalculatorTemplate
      title="Group Health Insurance"
      description="Estimate annual group health premium using employee count and per-employee premium."
      icon={Briefcase}
      calculate={() => {}}
      values={[employees, sumInsuredPerEmployee, basePremiumPerEmployee, dependentMultiplier]}
      onClear={() => {
        setEmployees(25)
        setSumInsuredPerEmployee(2_00_000)
        setBasePremiumPerEmployee(2500)
        setDependentMultiplier(1.2)
      }}
      onRestoreAction={(vals) => {
        setEmployees(Number(vals?.[0] ?? 25))
        setSumInsuredPerEmployee(Number(vals?.[1] ?? 2_00_000))
        setBasePremiumPerEmployee(Number(vals?.[2] ?? 2500))
        setDependentMultiplier(Number(vals?.[3] ?? 1.2))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Employees" value={employees} onChange={setEmployees} min={1} max={1000000} step={1} />
          <InputGroup label="Sum Insured per Employee" value={sumInsuredPerEmployee} onChange={setSumInsuredPerEmployee} min={0} max={1e9} step={10_000} prefix="₹" />
          <InputGroup label="Base Premium per Employee" value={basePremiumPerEmployee} onChange={setBasePremiumPerEmployee} min={0} max={1e7} step={50} prefix="₹" />
          <InputGroup label="Dependent Multiplier" value={dependentMultiplier} onChange={setDependentMultiplier} min={1} max={3} step={0.05} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Per Employee" value={fmtINR(result.perEmployee)} />
          <ResultCard label="Estimated Total" value={fmtINR(result.total)} type="highlight" />
        </div>
      }
    />
  )
}

export function KeymanInsuranceCalculator() {
  const [cover, setCover] = useState(50_00_000)
  const [age, setAge] = useState(40)
  const [termYears, setTermYears] = useState(10)

  const annualPremium = useMemo(() => {
    const baseRate = 0.8 + Math.max(0, age - 35) * 0.03
    const termFactor = 1 + Math.max(0, termYears - 5) * 0.02
    return (clamp0(cover) * baseRate * termFactor) / 100
  }, [cover, age, termYears])

  return (
    <FinancialCalculatorTemplate
      title="Keyman Insurance"
      description="Estimate annual premium for key person cover (illustrative)."
      icon={Briefcase}
      calculate={() => {}}
      values={[cover, age, termYears]}
      onClear={() => {
        setCover(50_00_000)
        setAge(40)
        setTermYears(10)
      }}
      onRestoreAction={(vals) => {
        setCover(Number(vals?.[0] ?? 50_00_000))
        setAge(Number(vals?.[1] ?? 40))
        setTermYears(Number(vals?.[2] ?? 10))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Cover Amount" value={cover} onChange={setCover} min={0} max={1e12} step={100000} prefix="₹" />
          <InputGroup label="Age" value={age} onChange={setAge} min={0} max={100} step={1} />
          <InputGroup label="Term" value={termYears} onChange={setTermYears} min={1} max={30} step={1} suffix=" years" />
        </div>
      }
      result={<ResultCard label="Estimated Annual Premium" value={fmtINR(annualPremium)} type="highlight" />}
    />
  )
}

export function MarineInsuranceCalculator() {
  const [cargoValue, setCargoValue] = useState(20_00_000)
  const [ratePct, setRatePct] = useState(0.8)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(
    () => (clamp0(cargoValue) * clamp0(ratePct) * clamp0(riskMultiplier)) / 100,
    [cargoValue, ratePct, riskMultiplier]
  )

  return (
    <FinancialCalculatorTemplate
      title="Marine Insurance"
      description="Estimate marine cargo insurance premium using cargo value and rate."
      icon={Package}
      calculate={() => {}}
      values={[cargoValue, ratePct, riskMultiplier]}
      onClear={() => {
        setCargoValue(20_00_000)
        setRatePct(0.8)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setCargoValue(Number(vals?.[0] ?? 20_00_000))
        setRatePct(Number(vals?.[1] ?? 0.8))
        setRiskMultiplier(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Cargo Value" value={cargoValue} onChange={setCargoValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={10} step={0.01} suffix="%" />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function FireInsuranceCalculator() {
  const [propertyValue, setPropertyValue] = useState(80_00_000)
  const [ratePct, setRatePct] = useState(0.15)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(
    () => (clamp0(propertyValue) * clamp0(ratePct) * clamp0(riskMultiplier)) / 100,
    [propertyValue, ratePct, riskMultiplier]
  )

  return (
    <FinancialCalculatorTemplate
      title="Fire Insurance"
      description="Estimate fire insurance premium using property value and rate."
      icon={Home}
      calculate={() => {}}
      values={[propertyValue, ratePct, riskMultiplier]}
      onClear={() => {
        setPropertyValue(80_00_000)
        setRatePct(0.15)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setPropertyValue(Number(vals?.[0] ?? 80_00_000))
        setRatePct(Number(vals?.[1] ?? 0.15))
        setRiskMultiplier(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Property Value" value={propertyValue} onChange={setPropertyValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={5} step={0.01} suffix="%" />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function BurglaryInsuranceCalculator() {
  const [contentsValue, setContentsValue] = useState(10_00_000)
  const [ratePct, setRatePct] = useState(0.25)

  const premium = useMemo(() => (clamp0(contentsValue) * clamp0(ratePct)) / 100, [contentsValue, ratePct])

  return (
    <FinancialCalculatorTemplate
      title="Burglary Insurance"
      description="Estimate burglary insurance premium based on contents value."
      icon={Home}
      calculate={() => {}}
      values={[contentsValue, ratePct]}
      onClear={() => {
        setContentsValue(10_00_000)
        setRatePct(0.25)
      }}
      onRestoreAction={(vals) => {
        setContentsValue(Number(vals?.[0] ?? 10_00_000))
        setRatePct(Number(vals?.[1] ?? 0.25))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Contents Value" value={contentsValue} onChange={setContentsValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={10} step={0.01} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function PublicLiabilityInsurance() {
  const [coverage, setCoverage] = useState(1_00_00_000)
  const [ratePct, setRatePct] = useState(0.08)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(
    () => (clamp0(coverage) * clamp0(ratePct) * clamp0(riskMultiplier)) / 100,
    [coverage, ratePct, riskMultiplier]
  )

  return (
    <FinancialCalculatorTemplate
      title="Public Liability"
      description="Estimate public liability premium using coverage and rate."
      icon={Umbrella}
      calculate={() => {}}
      values={[coverage, ratePct, riskMultiplier]}
      onClear={() => {
        setCoverage(1_00_00_000)
        setRatePct(0.08)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setCoverage(Number(vals?.[0] ?? 1_00_00_000))
        setRatePct(Number(vals?.[1] ?? 0.08))
        setRiskMultiplier(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Coverage Limit" value={coverage} onChange={setCoverage} min={0} max={1e13} step={10000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={5} step={0.01} suffix="%" />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function WorkmensCompensation() {
  const [employees, setEmployees] = useState(20)
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(18_000)
  const [ratePct, setRatePct] = useState(1.5)

  const premium = useMemo(() => {
    const annualWageBill = clamp0(employees) * clamp0(avgMonthlyWage) * 12
    return (annualWageBill * clamp0(ratePct)) / 100
  }, [employees, avgMonthlyWage, ratePct])

  return (
    <FinancialCalculatorTemplate
      title="Workmen's Compensation"
      description="Estimate annual WC premium based on wage bill and rate."
      icon={Briefcase}
      calculate={() => {}}
      values={[employees, avgMonthlyWage, ratePct]}
      onClear={() => {
        setEmployees(20)
        setAvgMonthlyWage(18_000)
        setRatePct(1.5)
      }}
      onRestoreAction={(vals) => {
        setEmployees(Number(vals?.[0] ?? 20))
        setAvgMonthlyWage(Number(vals?.[1] ?? 18_000))
        setRatePct(Number(vals?.[2] ?? 1.5))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Employees" value={employees} onChange={setEmployees} min={0} max={1e7} step={1} />
          <InputGroup label="Avg Monthly Wage" value={avgMonthlyWage} onChange={setAvgMonthlyWage} min={0} max={1e7} step={100} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={<ResultCard label="Estimated Annual Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function DirectorsOfficersLiability() {
  const [annualRevenue, setAnnualRevenue] = useState(5_00_00_000)
  const [limit, setLimit] = useState(1_00_00_000)
  const [rateBps, setRateBps] = useState(25)

  const premium = useMemo(() => {
    const base = clamp0(limit) * (clamp0(rateBps) / 10_000)
    const revenueFactor = 1 + Math.min(2, clamp0(annualRevenue) / 10_00_00_000)
    return base * revenueFactor
  }, [annualRevenue, limit, rateBps])

  return (
    <FinancialCalculatorTemplate
      title="Directors & Officers (D&O)"
      description="Estimate D&O premium using limit and simple bps rate."
      icon={Briefcase}
      calculate={() => {}}
      values={[annualRevenue, limit, rateBps]}
      onClear={() => {
        setAnnualRevenue(5_00_00_000)
        setLimit(1_00_00_000)
        setRateBps(25)
      }}
      onRestoreAction={(vals) => {
        setAnnualRevenue(Number(vals?.[0] ?? 5_00_00_000))
        setLimit(Number(vals?.[1] ?? 1_00_00_000))
        setRateBps(Number(vals?.[2] ?? 25))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Revenue" value={annualRevenue} onChange={setAnnualRevenue} min={0} max={1e15} step={100000} prefix="₹" />
          <InputGroup label="Coverage Limit" value={limit} onChange={setLimit} min={0} max={1e15} step={100000} prefix="₹" />
          <InputGroup label="Rate (bps)" value={rateBps} onChange={setRateBps} min={0} max={500} step={1} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function ProfessionalIndemnity() {
  const [coverage, setCoverage] = useState(50_00_000)
  const [ratePct, setRatePct] = useState(0.3)
  const [riskMultiplier, setRiskMultiplier] = useState(1)

  const premium = useMemo(
    () => (clamp0(coverage) * clamp0(ratePct) * clamp0(riskMultiplier)) / 100,
    [coverage, ratePct, riskMultiplier]
  )

  return (
    <FinancialCalculatorTemplate
      title="Professional Indemnity"
      description="Estimate PI premium using coverage and rate."
      icon={Briefcase}
      calculate={() => {}}
      values={[coverage, ratePct, riskMultiplier]}
      onClear={() => {
        setCoverage(50_00_000)
        setRatePct(0.3)
        setRiskMultiplier(1)
      }}
      onRestoreAction={(vals) => {
        setCoverage(Number(vals?.[0] ?? 50_00_000))
        setRatePct(Number(vals?.[1] ?? 0.3))
        setRiskMultiplier(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Coverage" value={coverage} onChange={setCoverage} min={0} max={1e13} step={10000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={10} step={0.01} suffix="%" />
          <InputGroup label="Risk Multiplier" value={riskMultiplier} onChange={setRiskMultiplier} min={0.5} max={3} step={0.05} />
        </div>
      }
      result={<ResultCard label="Estimated Premium" value={fmtINR(premium)} type="highlight" />}
    />
  )
}

export function CropInsuranceCalculator() {
  const [acres, setAcres] = useState(2)
  const [sumInsuredPerAcre, setSumInsuredPerAcre] = useState(30_000)
  const [premiumRatePct, setPremiumRatePct] = useState(2)

  const result = useMemo(() => {
    const sumInsured = clamp0(acres) * clamp0(sumInsuredPerAcre)
    const premium = (sumInsured * clamp0(premiumRatePct)) / 100
    return { sumInsured, premium }
  }, [acres, sumInsuredPerAcre, premiumRatePct])

  return (
    <FinancialCalculatorTemplate
      title="Crop Insurance (PMFBY)"
      description="Estimate crop insurance premium using land area and premium rate."
      icon={Leaf}
      calculate={() => {}}
      values={[acres, sumInsuredPerAcre, premiumRatePct]}
      onClear={() => {
        setAcres(2)
        setSumInsuredPerAcre(30_000)
        setPremiumRatePct(2)
      }}
      onRestoreAction={(vals) => {
        setAcres(Number(vals?.[0] ?? 2))
        setSumInsuredPerAcre(Number(vals?.[1] ?? 30_000))
        setPremiumRatePct(Number(vals?.[2] ?? 2))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Area" value={acres} onChange={setAcres} min={0} max={1e7} step={0.1} suffix=" acres" />
          <InputGroup label="Sum Insured per Acre" value={sumInsuredPerAcre} onChange={setSumInsuredPerAcre} min={0} max={1e7} step={100} prefix="₹" />
          <InputGroup label="Premium Rate" value={premiumRatePct} onChange={setPremiumRatePct} min={0} max={20} step={0.1} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Sum Insured" value={fmtINR(result.sumInsured)} />
          <ResultCard label="Estimated Premium" value={fmtINR(result.premium)} type="highlight" />
        </div>
      }
    />
  )
}

export function ShopkeepersInsurance() {
  const [stockValue, setStockValue] = useState(5_00_000)
  const [fixturesValue, setFixturesValue] = useState(2_00_000)
  const [ratePct, setRatePct] = useState(0.35)

  const result = useMemo(() => {
    const sumInsured = clamp0(stockValue) + clamp0(fixturesValue)
    const premium = (sumInsured * clamp0(ratePct)) / 100
    return { sumInsured, premium }
  }, [stockValue, fixturesValue, ratePct])

  return (
    <FinancialCalculatorTemplate
      title="Shopkeeper's Insurance"
      description="Estimate premium using stock + fixtures insured value and a rate %."
      icon={Home}
      calculate={() => {}}
      values={[stockValue, fixturesValue, ratePct]}
      onClear={() => {
        setStockValue(5_00_000)
        setFixturesValue(2_00_000)
        setRatePct(0.35)
      }}
      onRestoreAction={(vals) => {
        setStockValue(Number(vals?.[0] ?? 5_00_000))
        setFixturesValue(Number(vals?.[1] ?? 2_00_000))
        setRatePct(Number(vals?.[2] ?? 0.35))
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Stock Value" value={stockValue} onChange={setStockValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Fixtures Value" value={fixturesValue} onChange={setFixturesValue} min={0} max={1e12} step={1000} prefix="₹" />
          <InputGroup label="Rate" value={ratePct} onChange={setRatePct} min={0} max={10} step={0.01} suffix="%" />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Sum Insured" value={fmtINR(result.sumInsured)} />
          <ResultCard label="Estimated Premium" value={fmtINR(result.premium)} type="highlight" />
        </div>
      }
    />
  )
}
