"use client"

import { useMemo, useState } from "react"
import { BadgePercent, Calculator, Landmark, ReceiptIndianRupee } from "lucide-react"
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

// -------------------------
// Chapter VI-A Deductions
// -------------------------

export function Deduction80CCalculator() {
  const [investments, setInvestments] = useState(1_50_000)
  const [limit, setLimit] = useState(1_50_000)
  const [marginalRate, setMarginalRate] = useState(20)

  const result = useMemo(() => {
    const eligible = Math.min(clamp0(investments), clamp0(limit))
    const savings = eligible * (clamp0(marginalRate) / 100)
    return { eligible, savings }
  }, [investments, limit, marginalRate])

  return (
    <FinancialCalculatorTemplate
      title="80C Deduction Calculator"
      description="Estimate eligible 80C deduction and approximate tax savings (simplified)."
      icon={ReceiptIndianRupee}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Total 80C Investments" value={investments} onChange={setInvestments} prefix="₹" step={5_000} />
          <InputGroup label="80C Limit" value={limit} onChange={setLimit} prefix="₹" step={5_000} />
          <InputGroup label="Your Marginal Tax Rate" value={marginalRate} onChange={setMarginalRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Eligible Deduction" value={fmtINR(result.eligible)} type="highlight" />
          <ResultCard label="Approx Tax Savings" value={fmtINR(result.savings)} type="success" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function Deduction80DCalculator() {
  const [premium, setPremium] = useState(25_000)
  const [limit, setLimit] = useState(25_000)
  const [marginalRate, setMarginalRate] = useState(20)

  const result = useMemo(() => {
    const eligible = Math.min(clamp0(premium), clamp0(limit))
    const savings = eligible * (clamp0(marginalRate) / 100)
    return { eligible, savings }
  }, [premium, limit, marginalRate])

  return (
    <FinancialCalculatorTemplate
      title="80D Deduction Calculator"
      description="Estimate eligible health insurance deduction under 80D and approximate tax savings (simplified)."
      icon={ReceiptIndianRupee}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Premium Paid" value={premium} onChange={setPremium} prefix="₹" step={1_000} />
          <InputGroup label="Applicable 80D Limit" value={limit} onChange={setLimit} prefix="₹" step={1_000} />
          <InputGroup label="Your Marginal Tax Rate" value={marginalRate} onChange={setMarginalRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Eligible Deduction" value={fmtINR(result.eligible)} type="highlight" />
          <ResultCard label="Approx Tax Savings" value={fmtINR(result.savings)} type="success" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function Deduction80GCalculator() {
  const [donation, setDonation] = useState(25_000)
  const [deductionPct, setDeductionPct] = useState(50)
  const [marginalRate, setMarginalRate] = useState(20)

  const result = useMemo(() => {
    const eligible = clamp0(donation) * (clamp0(deductionPct) / 100)
    const savings = eligible * (clamp0(marginalRate) / 100)
    return { eligible, savings }
  }, [donation, deductionPct, marginalRate])

  return (
    <FinancialCalculatorTemplate
      title="80G Donation Deduction"
      description="Estimate eligible deduction on donations and approximate tax savings (simplified)."
      icon={ReceiptIndianRupee}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Donation Amount" value={donation} onChange={setDonation} prefix="₹" step={1_000} />
          <InputGroup label="Deduction %" value={deductionPct} onChange={setDeductionPct} suffix="%" step={5} helpText="Common: 50% or 100% depending on fund." />
          <InputGroup label="Your Marginal Tax Rate" value={marginalRate} onChange={setMarginalRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Eligible Deduction" value={fmtINR(result.eligible)} type="highlight" />
          <ResultCard label="Approx Tax Savings" value={fmtINR(result.savings)} type="success" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function Deduction80TTACalculator() {
  const [interestEarned, setInterestEarned] = useState(12_000)
  const [limit, setLimit] = useState(10_000)
  const [marginalRate, setMarginalRate] = useState(20)

  const result = useMemo(() => {
    const eligible = Math.min(clamp0(interestEarned), clamp0(limit))
    const savings = eligible * (clamp0(marginalRate) / 100)
    return { eligible, savings }
  }, [interestEarned, limit, marginalRate])

  return (
    <FinancialCalculatorTemplate
      title="80TTA Deduction Calculator"
      description="Estimate deduction on savings interest under 80TTA and approximate tax savings (simplified)."
      icon={ReceiptIndianRupee}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Savings Interest Earned" value={interestEarned} onChange={setInterestEarned} prefix="₹" step={500} />
          <InputGroup label="80TTA Limit" value={limit} onChange={setLimit} prefix="₹" step={500} />
          <InputGroup label="Your Marginal Tax Rate" value={marginalRate} onChange={setMarginalRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Eligible Deduction" value={fmtINR(result.eligible)} type="highlight" />
          <ResultCard label="Approx Tax Savings" value={fmtINR(result.savings)} type="success" icon={BadgePercent} />
        </div>
      }
    />
  )
}

// -------------------------
// Capital gains & special incomes
// -------------------------

export function CapitalGainsIndexationCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(10_00_000)
  const [salePrice, setSalePrice] = useState(15_00_000)
  const [ciiPurchase, setCiiPurchase] = useState(280)
  const [ciiSale, setCiiSale] = useState(348)
  const [taxRate, setTaxRate] = useState(20)

  const result = useMemo(() => {
    const indexedCost = clamp0(purchasePrice) * (clamp0(ciiSale) / Math.max(1, clamp0(ciiPurchase)))
    const gain = Math.max(0, clamp0(salePrice) - indexedCost)
    const tax = gain * (clamp0(taxRate) / 100)
    return { indexedCost, gain, tax }
  }, [purchasePrice, salePrice, ciiPurchase, ciiSale, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="Capital Gains Indexation"
      description="Estimate indexed cost and taxable LTCG using CII (simplified)."
      icon={Calculator}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} prefix="₹" step={10_000} />
          <InputGroup label="Sale Price" value={salePrice} onChange={setSalePrice} prefix="₹" step={10_000} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="CII (Purchase Year)" value={ciiPurchase} onChange={setCiiPurchase} step={1} />
            <InputGroup label="CII (Sale Year)" value={ciiSale} onChange={setCiiSale} step={1} />
          </div>
          <InputGroup label="Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Indexed Cost" value={fmtINR(result.indexedCost)} type="highlight" />
          <ResultCard label="Taxable Gain" value={fmtINR(result.gain)} />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function CryptoTaxCalculator() {
  const [buyValue, setBuyValue] = useState(2_00_000)
  const [sellValue, setSellValue] = useState(2_50_000)
  const [taxRate, setTaxRate] = useState(30)

  const result = useMemo(() => {
    const gain = Math.max(0, clamp0(sellValue) - clamp0(buyValue))
    const tax = gain * (clamp0(taxRate) / 100)
    return { gain, tax, netAfterTax: gain - tax }
  }, [buyValue, sellValue, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="Crypto Tax Calculator"
      description="Estimate tax on crypto gains using a flat rate (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Buy Value" value={buyValue} onChange={setBuyValue} prefix="₹" step={5_000} />
          <InputGroup label="Sell Value" value={sellValue} onChange={setSellValue} prefix="₹" step={5_000} />
          <InputGroup label="Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Gain" value={fmtINR(result.gain)} type="highlight" />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" />
          <ResultCard label="Net After Tax" value={fmtINR(result.netAfterTax)} type="success" />
        </div>
      }
    />
  )
}

export function LotteryTaxCalculator() {
  const [winnings, setWinnings] = useState(1_00_000)
  const [taxRate, setTaxRate] = useState(30)

  const result = useMemo(() => {
    const tax = clamp0(winnings) * (clamp0(taxRate) / 100)
    return { tax, net: clamp0(winnings) - tax }
  }, [winnings, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="Lottery Tax Calculator"
      description="Estimate tax and net winnings (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Winnings" value={winnings} onChange={setWinnings} prefix="₹" step={1_000} />
          <InputGroup label="Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" />
          <ResultCard label="Net Winnings" value={fmtINR(result.net)} type="success" />
        </div>
      }
    />
  )
}

export function GiftTaxCalculator() {
  const [giftAmount, setGiftAmount] = useState(2_00_000)
  const [exemptAmount, setExemptAmount] = useState(50_000)
  const [marginalRate, setMarginalRate] = useState(20)

  const result = useMemo(() => {
    const taxable = Math.max(0, clamp0(giftAmount) - clamp0(exemptAmount))
    const tax = taxable * (clamp0(marginalRate) / 100)
    return { taxable, tax }
  }, [giftAmount, exemptAmount, marginalRate])

  return (
    <FinancialCalculatorTemplate
      title="Gift Tax Calculator"
      description="Estimate taxable gift amount above basic exemption (simplified)."
      icon={Calculator}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Gift Amount" value={giftAmount} onChange={setGiftAmount} prefix="₹" step={5_000} />
          <InputGroup label="Exemption Threshold" value={exemptAmount} onChange={setExemptAmount} prefix="₹" step={1_000} helpText="Often ₹50,000 for non-relative gifts (rules vary)." />
          <InputGroup label="Your Marginal Tax Rate" value={marginalRate} onChange={setMarginalRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Taxable Amount" value={fmtINR(result.taxable)} type="highlight" />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function RentalIncomeTaxCalculator() {
  const [annualRent, setAnnualRent] = useState(3_60_000)
  const [standardDeductionPct, setStandardDeductionPct] = useState(30)
  const [taxRate, setTaxRate] = useState(20)

  const result = useMemo(() => {
    const netAnnual = clamp0(annualRent)
    const deduction = netAnnual * (clamp0(standardDeductionPct) / 100)
    const taxable = Math.max(0, netAnnual - deduction)
    const tax = taxable * (clamp0(taxRate) / 100)
    return { deduction, taxable, tax }
  }, [annualRent, standardDeductionPct, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="Rental Income Tax (Simplified)"
      description="Estimate taxable rental income using a standard deduction assumption."
      icon={Landmark}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Annual Rent Received" value={annualRent} onChange={setAnnualRent} prefix="₹" step={5_000} />
          <InputGroup label="Standard Deduction" value={standardDeductionPct} onChange={setStandardDeductionPct} suffix="%" step={1} />
          <InputGroup label="Your Marginal Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Deduction" value={fmtINR(result.deduction)} type="highlight" />
          <ResultCard label="Taxable Rent" value={fmtINR(result.taxable)} />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function PresumptiveTaxCalculator() {
  const [grossReceipts, setGrossReceipts] = useState(30_00_000)
  const [presumptivePct, setPresumptivePct] = useState(8)
  const [taxRate, setTaxRate] = useState(20)

  const result = useMemo(() => {
    const deemedProfit = clamp0(grossReceipts) * (clamp0(presumptivePct) / 100)
    const tax = deemedProfit * (clamp0(taxRate) / 100)
    return { deemedProfit, tax }
  }, [grossReceipts, presumptivePct, taxRate])

  return (
    <FinancialCalculatorTemplate
      title="Presumptive Tax Calculator"
      description="Estimate tax liability using presumptive income % (simplified)."
      icon={Calculator}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Gross Receipts/Turnover" value={grossReceipts} onChange={setGrossReceipts} prefix="₹" step={10_000} />
          <InputGroup label="Presumptive %" value={presumptivePct} onChange={setPresumptivePct} suffix="%" step={0.5} />
          <InputGroup label="Your Marginal Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={1} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Deemed Income" value={fmtINR(result.deemedProfit)} type="highlight" />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" icon={BadgePercent} />
        </div>
      }
    />
  )
}

export function AdvanceTaxCalculator() {
  const [estimatedAnnualTax, setEstimatedAnnualTax] = useState(1_50_000)
  const [tdsTcs, setTdsTcs] = useState(60_000)

  const result = useMemo(() => {
    const payable = Math.max(0, clamp0(estimatedAnnualTax) - clamp0(tdsTcs))
    return { payable }
  }, [estimatedAnnualTax, tdsTcs])

  return (
    <FinancialCalculatorTemplate
      title="Advance Tax Calculator"
      description="Estimate remaining advance tax payable after TDS/TCS (simplified)."
      icon={Calculator}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Estimated Total Tax for Year" value={estimatedAnnualTax} onChange={setEstimatedAnnualTax} prefix="₹" step={5_000} />
          <InputGroup label="TDS/TCS Already Covered" value={tdsTcs} onChange={setTdsTcs} prefix="₹" step={5_000} />
        </div>
      }
      result={<ResultCard label="Advance Tax Payable" value={fmtINR(result.payable)} type="highlight" icon={ReceiptIndianRupee} />}
    />
  )
}

export function SurchargeCalculator() {
  const [baseTax, setBaseTax] = useState(2_00_000)
  const [surchargePct, setSurchargePct] = useState(10)
  const [cessPct, setCessPct] = useState(4)

  const result = useMemo(() => {
    const surcharge = clamp0(baseTax) * (clamp0(surchargePct) / 100)
    const taxPlusSurcharge = clamp0(baseTax) + surcharge
    const cess = taxPlusSurcharge * (clamp0(cessPct) / 100)
    const total = taxPlusSurcharge + cess
    return { surcharge, cess, total }
  }, [baseTax, surchargePct, cessPct])

  return (
    <FinancialCalculatorTemplate
      title="Surcharge Calculator"
      description="Estimate surcharge and cess on a base tax amount (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Base Tax" value={baseTax} onChange={setBaseTax} prefix="₹" step={5_000} />
          <InputGroup label="Surcharge %" value={surchargePct} onChange={setSurchargePct} suffix="%" step={0.5} />
          <InputGroup label="Cess %" value={cessPct} onChange={setCessPct} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Surcharge" value={fmtINR(result.surcharge)} type="highlight" />
          <ResultCard label="Cess" value={fmtINR(result.cess)} />
          <ResultCard label="Total Tax" value={fmtINR(result.total)} type="warning" />
        </div>
      }
    />
  )
}

export function MarginalReliefCalculator() {
  const [income, setIncome] = useState(50_00_000)
  const [threshold, setThreshold] = useState(50_00_000)
  const [taxRate, setTaxRate] = useState(30)
  const [surchargePct, setSurchargePct] = useState(10)

  const result = useMemo(() => {
    const excess = Math.max(0, clamp0(income) - clamp0(threshold))
    const baseTax = clamp0(income) * (clamp0(taxRate) / 100)
    const surcharge = baseTax * (clamp0(surchargePct) / 100)
    const total = baseTax + surcharge
    const relief = Math.max(0, total - (baseTax + excess))
    return { excess, baseTax, surcharge, relief, totalAfterRelief: total - relief }
  }, [income, threshold, taxRate, surchargePct])

  return (
    <FinancialCalculatorTemplate
      title="Marginal Relief (Simplified)"
      description="Approximate marginal relief around a surcharge threshold (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Total Income" value={income} onChange={setIncome} prefix="₹" step={50_000} />
          <InputGroup label="Surcharge Threshold" value={threshold} onChange={setThreshold} prefix="₹" step={50_000} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Tax Rate" value={taxRate} onChange={setTaxRate} suffix="%" step={0.5} />
            <InputGroup label="Surcharge %" value={surchargePct} onChange={setSurchargePct} suffix="%" step={0.5} />
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Excess Income" value={fmtINR(result.excess)} type="highlight" />
          <ResultCard label="Relief (Approx)" value={fmtINR(result.relief)} type={result.relief > 0 ? "success" : "default"} />
          <ResultCard label="Tax After Relief" value={fmtINR(result.totalAfterRelief)} type="warning" />
        </div>
      }
    />
  )
}

export function Rebate87ACalculator() {
  const [taxableIncome, setTaxableIncome] = useState(6_50_000)
  const [rebateLimit, setRebateLimit] = useState(7_00_000)
  const [taxBeforeRebate, setTaxBeforeRebate] = useState(25_000)

  const result = useMemo(() => {
    const eligible = clamp0(taxableIncome) <= clamp0(rebateLimit)
    const rebate = eligible ? Math.min(clamp0(taxBeforeRebate), 25_000) : 0
    const netTax = Math.max(0, clamp0(taxBeforeRebate) - rebate)
    return { eligible, rebate, netTax }
  }, [taxableIncome, rebateLimit, taxBeforeRebate])

  return (
    <FinancialCalculatorTemplate
      title="87A Rebate Calculator"
      description="Check eligibility and estimate 87A rebate impact (simplified)."
      icon={BadgePercent}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Taxable Income" value={taxableIncome} onChange={setTaxableIncome} prefix="₹" step={10_000} />
          <InputGroup label="Rebate Eligibility Limit" value={rebateLimit} onChange={setRebateLimit} prefix="₹" step={10_000} />
          <InputGroup label="Tax Before Rebate" value={taxBeforeRebate} onChange={setTaxBeforeRebate} prefix="₹" step={1_000} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Eligible" value={result.eligible ? "Yes" : "No"} type={result.eligible ? "success" : "warning"} />
          <ResultCard label="Rebate" value={fmtINR(result.rebate)} type="highlight" />
          <ResultCard label="Net Tax" value={fmtINR(result.netTax)} type="warning" />
        </div>
      }
    />
  )
}

export function AgriIncomeTaxCalculator() {
  const [agriIncome, setAgriIncome] = useState(2_00_000)
  const [otherIncome, setOtherIncome] = useState(6_00_000)
  const [effectiveRate, setEffectiveRate] = useState(10)

  const result = useMemo(() => {
    const taxable = clamp0(otherIncome)
    const tax = taxable * (clamp0(effectiveRate) / 100)
    return { taxable, tax }
  }, [otherIncome, effectiveRate])

  return (
    <FinancialCalculatorTemplate
      title="Agricultural Income Tax (Simplified)"
      description="Estimate tax on non-agricultural income with agricultural income disclosed (simplified)."
      icon={Landmark}
      calculate={() => {}}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Agricultural Income" value={agriIncome} onChange={setAgriIncome} prefix="₹" step={5_000} helpText="Agricultural income may affect slab in some cases." />
          <InputGroup label="Other Taxable Income" value={otherIncome} onChange={setOtherIncome} prefix="₹" step={5_000} />
          <InputGroup label="Effective Tax Rate" value={effectiveRate} onChange={setEffectiveRate} suffix="%" step={0.5} />
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Other Taxable Income" value={fmtINR(result.taxable)} type="highlight" />
          <ResultCard label="Estimated Tax" value={fmtINR(result.tax)} type="warning" icon={BadgePercent} />
        </div>
      }
    />
  )
}
