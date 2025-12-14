"use client"
import { useState } from "react"
import { TrendingUp, ChartBar, PieChart, University, RotateCw } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import {
  MFSeoContent,
  SWPSeoContent,
  GoalSeoContent,
  RetirementSeoContent,
  CAGRSeoContent,
  InflationSeoContent
} from "@/components/calculators/seo/InvestmentSeo"

export function MutualFundReturns() {
  const [investment, setInvestment] = useState(100000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const maturity = investment * Math.pow((1 + returnRate/100), years)
    const returns = maturity - investment
    setResult({ 
      maturity: Math.round(maturity), 
      returns: Math.round(returns), 
      investment 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Mutual Fund Returns Calculator"
      description="Calculate the future value of your mutual fund investments."
      icon={TrendingUp}
      calculate={calculate}
      values={[investment, returnRate, years]}
      seoContent={<MFSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Investment Amount"
            value={investment}
            onChange={setInvestment}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Expected Return"
            value={returnRate}
            onChange={setReturnRate}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
          />
          <InputGroup
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Invested Amount" value={`₹${result.investment.toLocaleString('en-IN')}`} />
          <ResultCard label="Est. Returns" value={`₹${result.returns.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Total Value" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function CAGRCalculator() {
  const [initial, setInitial] = useState(100000)
  const [final, setFinal] = useState(200000)
  const [years, setYears] = useState(5)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const cagr = (Math.pow(final/initial, 1/years) - 1) * 100
    const totalReturn = ((final - initial) / initial) * 100
    setResult({ 
      cagr: cagr.toFixed(2), 
      totalReturn: totalReturn.toFixed(2), 
      absoluteGain: final - initial 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="CAGR Calculator"
      description="Calculate Compound Annual Growth Rate of your investments."
      icon={ChartBar}
      calculate={calculate}
      values={[initial, final, years]}
      seoContent={<CAGRSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Initial Value"
            value={initial}
            onChange={setInitial}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Final Value"
            value={final}
            onChange={setFinal}
            min={1000}
            max={50000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Duration"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="CAGR" value={`${result.cagr}%`} type="highlight" />
          <ResultCard label="Total Return" value={`${result.totalReturn}%`} type="success" />
          <ResultCard label="Absolute Gain" value={`₹${result.absoluteGain.toLocaleString('en-IN')}`} />
        </div>
      )}
    />
  )
}

export function ROICalculator() {
  const [investment, setInvestment] = useState(100000)
  const [returns, setReturns] = useState(150000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const roi = ((returns - investment) / investment) * 100
    const profit = returns - investment
    setResult({ roi: roi.toFixed(2), profit })
  }

  return (
    <FinancialCalculatorTemplate
      title="ROI Calculator"
      description="Calculate Return on Investment percentage."
      icon={PieChart}
      calculate={calculate}
      values={[investment, returns]}
      seoContent={<MFSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Invested Amount"
            value={investment}
            onChange={setInvestment}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Amount Returned"
            value={returns}
            onChange={setReturns}
            min={1000}
            max={50000000}
            step={1000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="ROI" value={`${result.roi}%`} type="highlight" />
          <ResultCard label="Total Profit" value={`₹${result.profit.toLocaleString('en-IN')}`} type="success" />
        </div>
      )}
    />
  )
}

export function FDCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(7)
  const [tenure, setTenure] = useState(5)
  const [frequency, setFrequency] = useState(4)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const r = rate / 100
    const n = frequency
    const t = tenure
    const maturity = principal * Math.pow((1 + r/n), n*t)
    const interest = maturity - principal
    setResult({ 
      maturity: Math.round(maturity), 
      interest: Math.round(interest), 
      principal 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Fixed Deposit Calculator"
      description="Calculate FD maturity amount and interest earned."
      icon={University}
      calculate={calculate}
      values={[principal, rate, tenure, frequency]}
      seoContent={<MFSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={10000}
            max={10000000}
            step={5000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={3}
            max={15}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={20}
            suffix=" years"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Compounding Frequency</label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="1">Annually</option>
              <option value="2">Semi-Annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Principal" value={`₹${result.principal.toLocaleString('en-IN')}`} />
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Maturity Value" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function RDCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(7)
  const [months, setMonths] = useState(60)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const r = rate / 100 / 12
    const n = months
    const maturity = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
    const invested = monthly * n
    const interest = maturity - invested
    setResult({ 
      maturity: Math.round(maturity), 
      interest: Math.round(interest), 
      invested 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Recurring Deposit Calculator"
      description="Calculate maturity amount for Recurring Deposits."
      icon={RotateCw}
      calculate={calculate}
      values={[monthly, rate, months]}
      seoContent={<MFSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Monthly Deposit"
            value={monthly}
            onChange={setMonthly}
            min={500}
            max={100000}
            step={500}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={3}
            max={15}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Duration"
            value={months}
            onChange={setMonths}
            min={6}
            max={120}
            step={6}
            suffix=" months"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Invested" value={`₹${result.invested.toLocaleString('en-IN')}`} />
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Maturity Value" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}
