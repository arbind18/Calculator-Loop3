"use client"

import { useState } from "react"
import { Calculator, TrendingUp, Clock, DollarSign } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { generateReport } from "@/lib/downloadUtils"

export function AtalPensionYojana() {
  const [age, setAge] = useState(25)
  const [pensionAmount, setPensionAmount] = useState(5000)

  const calculate = () => {
    // Simplified APY Contribution Chart Logic (Approximate)
    // Data based on standard APY charts
    // Age 18: 1000->42, 2000->84, 3000->126, 4000->168, 5000->210
    // Age 25: 1000->76, 2000->151, 3000->226, 4000->301, 5000->376
    // Age 30: 1000->116, 2000->231, 3000->347, 4000->462, 5000->577
    // Age 39: 1000->264, 2000->528, 3000->792, 4000->1054, 5000->1318
    
    // Linear interpolation for estimation
    let baseFactor = 0
    if (age <= 20) baseFactor = 4.5
    else if (age <= 25) baseFactor = 7.5
    else if (age <= 30) baseFactor = 11.5
    else if (age <= 35) baseFactor = 18
    else baseFactor = 26

    const monthlyContribution = Math.round((pensionAmount / 1000) * baseFactor * (1 + (age - 18) * 0.05)) // Rough approximation
    const totalYears = 60 - age
    const totalInvestment = monthlyContribution * 12 * totalYears
    
    return { monthlyContribution, totalInvestment, totalYears }
  }

  const { monthlyContribution, totalInvestment, totalYears } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Atal Pension Yojana (APY)"
      description="Calculate monthly contribution for guaranteed pension under APY scheme."
      icon={TrendingUp}
      calculate={() => {}}
      values={[age, pensionAmount]}
      onClear={() => {
        setAge(25)
        setPensionAmount(5000)
      }}
      onRestoreAction={(vals) => {
        setAge(Number(vals?.[0] ?? 25))
        setPensionAmount(Number(vals?.[1] ?? 5000))
      }}
      onDownload={(format) => {
        generateReport(format, 'apy_report', 
          ['Metric', 'Value'], 
          [
            ['Monthly Contribution', `₹${monthlyContribution}`],
            ['Total Investment', `₹${totalInvestment}`],
            ['Investment Period', `${totalYears} Years`]
          ], 
          'APY Report'
        )
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Entry Age" value={age} onChange={setAge} min={18} max={39} suffix="Years" helpText="Must be between 18 and 39" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Desired Monthly Pension</label>
            <select 
              value={pensionAmount} 
              onChange={(e) => setPensionAmount(Number(e.target.value))}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value={1000}>₹1,000</option>
              <option value={2000}>₹2,000</option>
              <option value={3000}>₹3,000</option>
              <option value={4000}>₹4,000</option>
              <option value={5000}>₹5,000</option>
            </select>
          </div>
        </div>
      }
      result={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-sm text-muted-foreground">Monthly Contribution</div>
            <div className="text-2xl font-bold">₹{monthlyContribution}</div>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Investment</div>
            <div className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Duration</div>
            <div className="text-2xl font-bold">{totalYears} Years</div>
          </div>
        </div>
      }
    />
  )
}

export function InflationAdjustedWithdrawal() {
  const [corpus, setCorpus] = useState(10000000)
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(50000)
  const [inflation, setInflation] = useState(6)
  const [returnRate, setReturnRate] = useState(8)

  const calculate = () => {
    let balance = corpus
    let currentWithdrawal = monthlyWithdrawal * 12
    let years = 0
    
    // Simulate for max 50 years
    while (balance > 0 && years < 50) {
      const growth = balance * (returnRate / 100)
      balance = balance + growth - currentWithdrawal
      currentWithdrawal = currentWithdrawal * (1 + inflation / 100)
      years++
    }
    
    return years >= 50 ? "50+" : years
  }

  const yearsLasting = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Corpus Longevity Calculator"
      description="How long will your retirement corpus last with inflation-adjusted withdrawals?"
      icon={Clock}
      calculate={() => {}}
      values={[corpus, monthlyWithdrawal, inflation, returnRate]}
      onClear={() => {
        setCorpus(10000000)
        setMonthlyWithdrawal(50000)
        setInflation(6)
        setReturnRate(8)
      }}
      onRestoreAction={(vals) => {
        setCorpus(Number(vals?.[0] ?? 10000000))
        setMonthlyWithdrawal(Number(vals?.[1] ?? 50000))
        setInflation(Number(vals?.[2] ?? 6))
        setReturnRate(Number(vals?.[3] ?? 8))
      }}
      onDownload={(format) => {
        generateReport(format, 'corpus_longevity', ['Metric', 'Value'], [['Years Lasting', `${yearsLasting} Years`]], 'Corpus Report')
      }}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Current Corpus" value={corpus} onChange={setCorpus} prefix="₹" step={100000} />
          <InputGroup label="Monthly Withdrawal" value={monthlyWithdrawal} onChange={setMonthlyWithdrawal} prefix="₹" step={1000} />
          <InputGroup label="Expected Inflation" value={inflation} onChange={setInflation} suffix="%" step={0.1} />
          <InputGroup label="Return on Corpus" value={returnRate} onChange={setReturnRate} suffix="%" step={0.1} />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Your Corpus Will Last</div>
          <div className="text-4xl font-bold text-primary">{yearsLasting} Years</div>
        </div>
      }
    />
  )
}

export function NPSWithdrawal() {
  const [corpus, setCorpus] = useState(5000000)
  const [annuityRate, setAnnuityRate] = useState(6)
  
  const calculate = () => {
    // Max 60% lump sum tax free
    const lumpSum = corpus * 0.60
    const annuityCorpus = corpus * 0.40
    const monthlyPension = (annuityCorpus * (annuityRate / 100)) / 12
    
    return { lumpSum: Math.round(lumpSum), annuityCorpus: Math.round(annuityCorpus), monthlyPension: Math.round(monthlyPension) }
  }

  const { lumpSum, annuityCorpus, monthlyPension } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="NPS Withdrawal Calculator"
      description="Calculate Lump Sum and Monthly Pension from your NPS maturity corpus."
      icon={TrendingUp}
      calculate={() => {}}
      values={[corpus, annuityRate]}
      onClear={() => {
        setCorpus(5000000)
        setAnnuityRate(6)
      }}
      onRestoreAction={(vals) => {
        setCorpus(Number(vals?.[0] ?? 5000000))
        setAnnuityRate(Number(vals?.[1] ?? 6))
      }}
      onDownload={(format) => generateReport(format, 'nps_withdrawal', ['Item', 'Value'], [['Lump Sum', `₹${lumpSum}`], ['Monthly Pension', `₹${monthlyPension}`]], 'NPS Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Total NPS Corpus" value={corpus} onChange={setCorpus} prefix="₹" step={100000} />
          <InputGroup label="Annuity Rate" value={annuityRate} onChange={setAnnuityRate} suffix="%" step={0.1} helpText="Current annuity rates approx 6-7%" />
        </div>
      }
      result={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Lump Sum (Tax Free)</div>
              <div className="text-2xl font-bold text-green-700">₹{lumpSum.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Monthly Pension</div>
              <div className="text-2xl font-bold text-blue-700">₹{monthlyPension.toLocaleString()}</div>
            </div>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Based on 60% withdrawal and 40% annuity purchase.
          </div>
        </div>
      }
    />
  )
}
