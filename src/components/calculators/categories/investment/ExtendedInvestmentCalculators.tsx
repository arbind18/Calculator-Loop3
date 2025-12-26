"use client"

import { useState } from "react"
import {
  TrendingUp,
  Percent,
  PieChart,
  Target,
  BarChart3,
  Shield,
  Activity,
  Calculator as CalculatorIcon,
  RefreshCw
} from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"

const toMoneyINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`

const fvLumpsum = (principal: number, annualRatePct: number, years: number) => {
  const r = annualRatePct / 100
  return principal * Math.pow(1 + r, years)
}

const fvSIP = (monthly: number, annualRatePct: number, months: number) => {
  const r = annualRatePct / 100
  const rm = r / 12
  if (months <= 0) return 0
  if (rm === 0) return monthly * months
  // Assume contribution at end of month
  return monthly * ((Math.pow(1 + rm, months) - 1) / rm)
}

export function RuleOf72Calculator() {
  const [rate, setRate] = useState(10)
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
      title="Rule of 72 Calculator"
      description="Estimate how long it takes to double an investment based on the annual return rate."
      icon={Percent}
      calculate={calculate}
      values={[rate]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Annual Return Rate" value={rate} onChange={setRate} min={0.1} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Approx. Years to Double" value={`${result.years.toFixed(2)} years`} type="highlight" />
            <ResultCard label="Assumption" value="Constant annual return" />
          </div>
        )
      }
    />
  )
}

export function RealRateReturnCalculator() {
  const [nominal, setNominal] = useState(12)
  const [inflation, setInflation] = useState(6)
  const [result, setResult] = useState<{ real: number } | null>(null)

  const calculate = () => {
    const rn = nominal / 100
    const ri = inflation / 100
    const real = ((1 + rn) / (1 + ri) - 1) * 100
    setResult({ real })
  }

  return (
    <FinancialCalculatorTemplate
      title="Real Rate of Return Calculator"
      description="Calculate inflation-adjusted (real) return using the Fisher equation."
      icon={TrendingUp}
      calculate={calculate}
      values={[nominal, inflation]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Nominal Return" value={nominal} onChange={setNominal} min={-50} max={100} step={0.1} suffix="%" />
          <InputGroup label="Inflation Rate" value={inflation} onChange={setInflation} min={-10} max={50} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Real Return" value={`${result.real.toFixed(2)}%`} type="highlight" />
            <ResultCard label="Meaning" value="Purchasing-power growth" />
          </div>
        )
      }
    />
  )
}

export function CostOfDelayCalculator() {
  const [initial, setInitial] = useState(100000)
  const [monthly, setMonthly] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)
  const [delayMonths, setDelayMonths] = useState(12)
  const [result, setResult] = useState<{ now: number; delayed: number; difference: number } | null>(null)

  const calculate = () => {
    const months = Math.round(years * 12)
    const delay = Math.max(0, Math.round(delayMonths))

    const now = fvLumpsum(initial, returnRate, years) + fvSIP(monthly, returnRate, months)
    const delayed = fvLumpsum(initial, returnRate, years) + fvSIP(monthly, returnRate, Math.max(0, months - delay))
    const difference = now - delayed

    setResult({ now, delayed, difference })
  }

  return (
    <FinancialCalculatorTemplate
      title="Cost of Delay Calculator"
      description="Estimate how much you may lose by delaying monthly investing."
      icon={Target}
      calculate={calculate}
      values={[initial, monthly, returnRate, years, delayMonths]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Initial Investment" value={initial} onChange={setInitial} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Monthly Investment" value={monthly} onChange={setMonthly} min={0} max={1000000} step={500} prefix="₹" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Time Horizon" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Delay" value={delayMonths} onChange={setDelayMonths} min={0} max={240} step={1} suffix=" months" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Value If Start Now" value={toMoneyINR(result.now)} type="highlight" />
            <ResultCard label="Value If Delayed" value={toMoneyINR(result.delayed)} />
            <ResultCard label="Estimated Cost of Delay" value={toMoneyINR(Math.max(0, result.difference))} type="warning" />
          </div>
        )
      }
    />
  )
}

export function AssetAllocationCalculator() {
  const [equity, setEquity] = useState(60)
  const [debt, setDebt] = useState(30)
  const [gold, setGold] = useState(10)
  const [cash, setCash] = useState(0)
  const [portfolio, setPortfolio] = useState(1000000)
  const [result, setResult] = useState<{ sum: number; normalized: { equity: number; debt: number; gold: number; cash: number }; amounts: { equity: number; debt: number; gold: number; cash: number } } | null>(null)

  const calculate = () => {
    const sum = equity + debt + gold + cash
    const denom = sum === 0 ? 1 : sum
    const normalized = {
      equity: (equity / denom) * 100,
      debt: (debt / denom) * 100,
      gold: (gold / denom) * 100,
      cash: (cash / denom) * 100
    }
    const amounts = {
      equity: (portfolio * normalized.equity) / 100,
      debt: (portfolio * normalized.debt) / 100,
      gold: (portfolio * normalized.gold) / 100,
      cash: (portfolio * normalized.cash) / 100
    }
    setResult({ sum, normalized, amounts })
  }

  return (
    <FinancialCalculatorTemplate
      title="Asset Allocation Calculator"
      description="Convert target allocation percentages into amounts and normalize if totals do not equal 100%."
      icon={PieChart}
      calculate={calculate}
      values={[equity, debt, gold, cash, portfolio]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Portfolio Value" value={portfolio} onChange={setPortfolio} min={0} max={1000000000} step={10000} prefix="₹" />
          <InputGroup label="Equity" value={equity} onChange={setEquity} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Debt" value={debt} onChange={setDebt} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Gold" value={gold} onChange={setGold} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Cash" value={cash} onChange={setCash} min={0} max={100} step={1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResultCard label="Equity" value={`${result.normalized.equity.toFixed(1)}%`} type="highlight" />
              <ResultCard label="Debt" value={`${result.normalized.debt.toFixed(1)}%`} />
              <ResultCard label="Gold" value={`${result.normalized.gold.toFixed(1)}%`} />
              <ResultCard label="Cash" value={`${result.normalized.cash.toFixed(1)}%`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResultCard label="Equity Amount" value={toMoneyINR(result.amounts.equity)} type="highlight" />
              <ResultCard label="Debt Amount" value={toMoneyINR(result.amounts.debt)} />
              <ResultCard label="Gold Amount" value={toMoneyINR(result.amounts.gold)} />
              <ResultCard label="Cash Amount" value={toMoneyINR(result.amounts.cash)} />
            </div>
            <div className="text-sm text-muted-foreground">Entered total: {result.sum.toFixed(1)}% (auto-normalized)</div>
          </div>
        )
      }
    />
  )
}

export function NPVCalculator() {
  const [discountRate, setDiscountRate] = useState(12)
  const [initialOutflow, setInitialOutflow] = useState(100000)
  const [cf1, setCf1] = useState(30000)
  const [cf2, setCf2] = useState(30000)
  const [cf3, setCf3] = useState(30000)
  const [cf4, setCf4] = useState(30000)
  const [cf5, setCf5] = useState(30000)
  const [result, setResult] = useState<{ npv: number; pvInflows: number } | null>(null)

  const calculate = () => {
    const r = discountRate / 100
    const inflows = [cf1, cf2, cf3, cf4, cf5]
    const pvInflows = inflows.reduce((sum, cf, idx) => sum + cf / Math.pow(1 + r, idx + 1), 0)
    const total = pvInflows - initialOutflow
    setResult({ npv: total, pvInflows })
  }

  return (
    <FinancialCalculatorTemplate
      title="NPV Calculator"
      description="Calculate Net Present Value from an initial outflow and future cash inflows."
      icon={CalculatorIcon}
      calculate={calculate}
      values={[discountRate, initialOutflow, cf1, cf2, cf3, cf4, cf5]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Discount Rate" value={discountRate} onChange={setDiscountRate} min={-50} max={100} step={0.1} suffix="%" />
          <InputGroup label="Initial Investment (Outflow)" value={initialOutflow} onChange={setInitialOutflow} min={0} max={1000000000} step={1000} prefix="₹" />
          <InputGroup label="Year 1 Cash Flow" value={cf1} onChange={setCf1} min={-1000000000} max={1000000000} step={1000} prefix="₹" />
          <InputGroup label="Year 2 Cash Flow" value={cf2} onChange={setCf2} min={-1000000000} max={1000000000} step={1000} prefix="₹" />
          <InputGroup label="Year 3 Cash Flow" value={cf3} onChange={setCf3} min={-1000000000} max={1000000000} step={1000} prefix="₹" />
          <InputGroup label="Year 4 Cash Flow" value={cf4} onChange={setCf4} min={-1000000000} max={1000000000} step={1000} prefix="₹" />
          <InputGroup label="Year 5 Cash Flow" value={cf5} onChange={setCf5} min={-1000000000} max={1000000000} step={1000} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="NPV" value={toMoneyINR(result.npv)} type={result.npv >= 0 ? "success" : "warning"} />
            <ResultCard label="PV of Inflows" value={toMoneyINR(result.pvInflows)} />
          </div>
        )
      }
    />
  )
}

export function SharpeRatioCalculator() {
  const [portfolioReturn, setPortfolioReturn] = useState(14)
  const [riskFree, setRiskFree] = useState(6)
  const [stdDev, setStdDev] = useState(18)
  const [result, setResult] = useState<{ sharpe: number } | null>(null)

  const calculate = () => {
    if (stdDev <= 0) {
      setResult(null)
      return
    }
    const sharpe = (portfolioReturn - riskFree) / stdDev
    setResult({ sharpe })
  }

  return (
    <FinancialCalculatorTemplate
      title="Sharpe Ratio Calculator"
      description="Measure risk-adjusted return: (Rp - Rf) / σp."
      icon={Activity}
      calculate={calculate}
      values={[portfolioReturn, riskFree, stdDev]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Portfolio Return" value={portfolioReturn} onChange={setPortfolioReturn} min={-50} max={100} step={0.1} suffix="%" />
          <InputGroup label="Risk-free Rate" value={riskFree} onChange={setRiskFree} min={-10} max={30} step={0.1} suffix="%" />
          <InputGroup label="Portfolio Volatility (Std Dev)" value={stdDev} onChange={setStdDev} min={0.1} max={100} step={0.1} suffix="%" />
        </div>
      }
      result={result && <ResultCard label="Sharpe Ratio" value={result.sharpe.toFixed(3)} type="highlight" />}
    />
  )
}

export function TreynorRatioCalculator() {
  const [portfolioReturn, setPortfolioReturn] = useState(14)
  const [riskFree, setRiskFree] = useState(6)
  const [beta, setBeta] = useState(1)
  const [result, setResult] = useState<{ treynor: number } | null>(null)

  const calculate = () => {
    if (beta === 0) {
      setResult(null)
      return
    }
    const treynor = (portfolioReturn - riskFree) / beta
    setResult({ treynor })
  }

  return (
    <FinancialCalculatorTemplate
      title="Treynor Ratio Calculator"
      description="Measure return per unit of systematic risk: (Rp - Rf) / β."
      icon={BarChart3}
      calculate={calculate}
      values={[portfolioReturn, riskFree, beta]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Portfolio Return" value={portfolioReturn} onChange={setPortfolioReturn} min={-50} max={100} step={0.1} suffix="%" />
          <InputGroup label="Risk-free Rate" value={riskFree} onChange={setRiskFree} min={-10} max={30} step={0.1} suffix="%" />
          <InputGroup label="Beta" value={beta} onChange={setBeta} min={-5} max={5} step={0.01} />
        </div>
      }
      result={result && <ResultCard label="Treynor Ratio" value={result.treynor.toFixed(3)} type="highlight" />}
    />
  )
}

export function AlphaCalculator() {
  const [portfolioReturn, setPortfolioReturn] = useState(14)
  const [marketReturn, setMarketReturn] = useState(12)
  const [riskFree, setRiskFree] = useState(6)
  const [beta, setBeta] = useState(1)
  const [result, setResult] = useState<{ alpha: number; expected: number } | null>(null)

  const calculate = () => {
    const expected = riskFree + beta * (marketReturn - riskFree)
    const alpha = portfolioReturn - expected
    setResult({ alpha, expected })
  }

  return (
    <FinancialCalculatorTemplate
      title="Alpha Calculator"
      description="Estimate Jensen's alpha relative to a benchmark market return."
      icon={TrendingUp}
      calculate={calculate}
      values={[portfolioReturn, marketReturn, riskFree, beta]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Portfolio Return" value={portfolioReturn} onChange={setPortfolioReturn} min={-50} max={100} step={0.1} suffix="%" />
          <InputGroup label="Market Return" value={marketReturn} onChange={setMarketReturn} min={-50} max={100} step={0.1} suffix="%" />
          <InputGroup label="Risk-free Rate" value={riskFree} onChange={setRiskFree} min={-10} max={30} step={0.1} suffix="%" />
          <InputGroup label="Beta" value={beta} onChange={setBeta} min={-5} max={5} step={0.01} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Expected Return (CAPM)" value={`${result.expected.toFixed(2)}%`} />
            <ResultCard label="Alpha" value={`${result.alpha.toFixed(2)}%`} type={result.alpha >= 0 ? "success" : "warning"} />
          </div>
        )
      }
    />
  )
}

export function BetaCalculator() {
  const [correlation, setCorrelation] = useState(0.8)
  const [portfolioVol, setPortfolioVol] = useState(18)
  const [marketVol, setMarketVol] = useState(16)
  const [result, setResult] = useState<{ beta: number } | null>(null)

  const calculate = () => {
    if (marketVol <= 0) {
      setResult(null)
      return
    }
    const beta = correlation * (portfolioVol / marketVol)
    setResult({ beta })
  }

  return (
    <FinancialCalculatorTemplate
      title="Beta Calculator"
      description="Estimate beta using correlation and volatilities: β = ρ × (σp/σm)."
      icon={BarChart3}
      calculate={calculate}
      values={[correlation, portfolioVol, marketVol]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Correlation (ρ)" value={correlation} onChange={setCorrelation} min={-1} max={1} step={0.01} />
          <InputGroup label="Portfolio Volatility (σp)" value={portfolioVol} onChange={setPortfolioVol} min={0.1} max={100} step={0.1} suffix="%" />
          <InputGroup label="Market Volatility (σm)" value={marketVol} onChange={setMarketVol} min={0.1} max={100} step={0.1} suffix="%" />
        </div>
      }
      result={result && <ResultCard label="Estimated Beta" value={result.beta.toFixed(3)} type="highlight" />}
    />
  )
}

export function SIPDelayCostCalculator() {
  const [monthly, setMonthly] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)
  const [delayMonths, setDelayMonths] = useState(12)
  const [result, setResult] = useState<{ startNow: number; delayed: number; loss: number } | null>(null)

  const calculate = () => {
    const months = Math.round(years * 12)
    const delay = Math.max(0, Math.round(delayMonths))
    const startNow = fvSIP(monthly, returnRate, months)
    const delayed = fvSIP(monthly, returnRate, Math.max(0, months - delay))
    setResult({ startNow, delayed, loss: startNow - delayed })
  }

  return (
    <FinancialCalculatorTemplate
      title="SIP Delay Cost Calculator"
      description="Compare SIP corpus if you start now vs after a delay."
      icon={Target}
      calculate={calculate}
      values={[monthly, returnRate, years, delayMonths]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly SIP Amount" value={monthly} onChange={setMonthly} min={0} max={1000000} step={500} prefix="₹" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Total Investment Period" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Delay" value={delayMonths} onChange={setDelayMonths} min={0} max={240} step={1} suffix=" months" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Corpus (Start Now)" value={toMoneyINR(result.startNow)} type="highlight" />
            <ResultCard label="Corpus (Delayed)" value={toMoneyINR(result.delayed)} />
            <ResultCard label="Estimated Loss" value={toMoneyINR(Math.max(0, result.loss))} type="warning" />
          </div>
        )
      }
    />
  )
}

export function LumpsumVsSIPCalculator() {
  const [lumpsum, setLumpsum] = useState(500000)
  const [sip, setSip] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<{ fvLump: number; fvSip: number } | null>(null)

  const calculate = () => {
    const fvLump = fvLumpsum(lumpsum, returnRate, years)
    const fvSipValue = fvSIP(sip, returnRate, Math.round(years * 12))
    setResult({ fvLump, fvSip: fvSipValue })
  }

  return (
    <FinancialCalculatorTemplate
      title="Lumpsum vs SIP Calculator"
      description="Compare future value of a lumpsum investment vs a monthly SIP."
      icon={TrendingUp}
      calculate={calculate}
      values={[lumpsum, sip, returnRate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Lumpsum Amount" value={lumpsum} onChange={setLumpsum} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Monthly SIP" value={sip} onChange={setSip} min={0} max={1000000} step={500} prefix="₹" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Time Period" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Lumpsum Future Value" value={toMoneyINR(result.fvLump)} type="highlight" />
            <ResultCard label="SIP Future Value" value={toMoneyINR(result.fvSip)} />
          </div>
        )
      }
    />
  )
}

export function STPCalculator() {
  const [initial, setInitial] = useState(500000)
  const [monthlyTransfer, setMonthlyTransfer] = useState(25000)
  const [sourceReturn, setSourceReturn] = useState(6)
  const [targetReturn, setTargetReturn] = useState(12)
  const [months, setMonths] = useState(24)
  const [result, setResult] = useState<{ source: number; target: number; total: number } | null>(null)

  const calculate = () => {
    let source = initial
    let target = 0
    const rs = sourceReturn / 100 / 12
    const rt = targetReturn / 100 / 12

    for (let i = 0; i < Math.max(0, Math.round(months)); i++) {
      source *= (1 + rs)
      target *= (1 + rt)
      const transfer = Math.min(source, monthlyTransfer)
      source -= transfer
      target += transfer
    }

    setResult({ source, target, total: source + target })
  }

  return (
    <FinancialCalculatorTemplate
      title="STP Calculator"
      description="Simulate a Systematic Transfer Plan from a source fund to a target fund."
      icon={RefreshCw}
      calculate={calculate}
      values={[initial, monthlyTransfer, sourceReturn, targetReturn, months]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Initial Amount (Source)" value={initial} onChange={setInitial} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Monthly Transfer" value={monthlyTransfer} onChange={setMonthlyTransfer} min={0} max={10000000} step={500} prefix="₹" />
          <InputGroup label="Source Return" value={sourceReturn} onChange={setSourceReturn} min={-20} max={20} step={0.1} suffix="%" />
          <InputGroup label="Target Return" value={targetReturn} onChange={setTargetReturn} min={-20} max={30} step={0.1} suffix="%" />
          <InputGroup label="Duration" value={months} onChange={setMonths} min={1} max={600} step={1} suffix=" months" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Source Balance" value={toMoneyINR(result.source)} />
            <ResultCard label="Target Balance" value={toMoneyINR(result.target)} type="highlight" />
            <ResultCard label="Total" value={toMoneyINR(result.total)} type="success" />
          </div>
        )
      }
    />
  )
}

export function DividendReinvestmentCalculator() {
  const [principal, setPrincipal] = useState(500000)
  const [dividendYield, setDividendYield] = useState(2)
  const [priceGrowth, setPriceGrowth] = useState(10)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<{ finalValue: number; totalReturn: number } | null>(null)

  const calculate = () => {
    // Simple total-return approximation with annual reinvestment
    const totalReturn = ((1 + priceGrowth / 100) * (1 + dividendYield / 100) - 1) * 100
    const finalValue = fvLumpsum(principal, totalReturn, years)
    setResult({ finalValue, totalReturn })
  }

  return (
    <FinancialCalculatorTemplate
      title="Dividend Reinvestment (DRIP) Calculator"
      description="Estimate growth when dividends are reinvested (approximate total-return model)."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, dividendYield, priceGrowth, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Initial Investment" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Dividend Yield" value={dividendYield} onChange={setDividendYield} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Price Growth (CAGR)" value={priceGrowth} onChange={setPriceGrowth} min={-50} max={50} step={0.1} suffix="%" />
          <InputGroup label="Time Period" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Approx. Total Return" value={`${result.totalReturn.toFixed(2)}%`} />
            <ResultCard label="Estimated Final Value" value={toMoneyINR(result.finalValue)} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function RightsIssueCalculator() {
  const [currentPrice, setCurrentPrice] = useState(200)
  const [subscriptionPrice, setSubscriptionPrice] = useState(150)
  const [existingShares, setExistingShares] = useState(100)
  const [ratioExistingPerNew, setRatioExistingPerNew] = useState(4)
  const [result, setResult] = useState<{ newShares: number; terp: number; rightValue: number } | null>(null)

  const calculate = () => {
    const ratio = Math.max(1, Math.round(ratioExistingPerNew))
    const newShares = Math.floor(existingShares / ratio)
    const old = existingShares
    const terp = (old * currentPrice + newShares * subscriptionPrice) / (old + newShares)
    const rightValue = Math.max(0, currentPrice - terp)
    setResult({ newShares, terp, rightValue })
  }

  return (
    <FinancialCalculatorTemplate
      title="Rights Issue Calculator"
      description="Estimate TERP and approximate value of a right in a rights issue."
      icon={CalculatorIcon}
      calculate={calculate}
      values={[currentPrice, subscriptionPrice, existingShares, ratioExistingPerNew]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Current Share Price" value={currentPrice} onChange={setCurrentPrice} min={0} max={100000} step={1} prefix="₹" />
          <InputGroup label="Subscription Price" value={subscriptionPrice} onChange={setSubscriptionPrice} min={0} max={100000} step={1} prefix="₹" />
          <InputGroup label="Existing Shares" value={existingShares} onChange={setExistingShares} min={0} max={10000000} step={1} />
          <InputGroup label="Rights Ratio (Existing Shares per 1 New Share)" value={ratioExistingPerNew} onChange={setRatioExistingPerNew} min={1} max={100} step={1} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Eligible New Shares" value={result.newShares.toLocaleString("en-IN")} />
            <ResultCard label="TERP" value={`₹${result.terp.toFixed(2)}`} type="highlight" />
            <ResultCard label="Approx. Right Value" value={`₹${result.rightValue.toFixed(2)}`} type="success" />
          </div>
        )
      }
    />
  )
}

export function SovereignGoldBondCalculator() {
  const [principal, setPrincipal] = useState(200000)
  const [goldAppreciation, setGoldAppreciation] = useState(8)
  const [interestRate, setInterestRate] = useState(2.5)
  const [years, setYears] = useState(8)
  const [result, setResult] = useState<{ valueAtMaturity: number; totalInterest: number; totalValue: number } | null>(null)

  const calculate = () => {
    const valueAtMaturity = fvLumpsum(principal, goldAppreciation, years)
    const totalInterest = principal * (interestRate / 100) * years
    const totalValue = valueAtMaturity + totalInterest
    setResult({ valueAtMaturity, totalInterest, totalValue })
  }

  return (
    <FinancialCalculatorTemplate
      title="Sovereign Gold Bond (SGB) Calculator"
      description="Estimate maturity value and interest earned for a Sovereign Gold Bond (simplified)."
      icon={Shield}
      calculate={calculate}
      values={[principal, goldAppreciation, interestRate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Investment Amount" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Gold Price Appreciation" value={goldAppreciation} onChange={setGoldAppreciation} min={-20} max={30} step={0.1} suffix="%" />
          <InputGroup label="SGB Interest Rate" value={interestRate} onChange={setInterestRate} min={0} max={10} step={0.1} suffix="%" />
          <InputGroup label="Holding Period" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Value from Gold Appreciation" value={toMoneyINR(result.valueAtMaturity)} type="highlight" />
            <ResultCard label="Total Interest (Paid Out)" value={toMoneyINR(result.totalInterest)} />
            <ResultCard label="Estimated Total" value={toMoneyINR(result.totalValue)} type="success" />
          </div>
        )
      }
    />
  )
}

export function NPSTier1Calculator() {
  const [monthly, setMonthly] = useState(5000)
  const [returnRate, setReturnRate] = useState(10)
  const [years, setYears] = useState(25)
  const [result, setResult] = useState<{ invested: number; corpus: number } | null>(null)

  const calculate = () => {
    const months = Math.round(years * 12)
    const corpus = fvSIP(monthly, returnRate, months)
    const invested = monthly * months
    setResult({ invested, corpus })
  }

  return (
    <FinancialCalculatorTemplate
      title="NPS Tier 1 Calculator"
      description="Estimate NPS Tier 1 corpus using monthly contributions and expected return (simplified)."
      icon={TrendingUp}
      calculate={calculate}
      values={[monthly, returnRate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Contribution" value={monthly} onChange={setMonthly} min={0} max={1000000} step={100} prefix="₹" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Investment Period" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Total Invested" value={toMoneyINR(result.invested)} />
            <ResultCard label="Estimated Corpus" value={toMoneyINR(result.corpus)} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function ELSSCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<{ invested: number; corpus: number } | null>(null)

  const calculate = () => {
    const months = Math.round(years * 12)
    const corpus = fvSIP(monthly, returnRate, months)
    const invested = monthly * months
    setResult({ invested, corpus })
  }

  return (
    <FinancialCalculatorTemplate
      title="ELSS Calculator"
      description="Estimate ELSS corpus using monthly investments (simplified; lock-in rules not modeled)."
      icon={Shield}
      calculate={calculate}
      values={[monthly, returnRate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Investment" value={monthly} onChange={setMonthly} min={0} max={150000} step={500} prefix="₹" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Total Invested" value={toMoneyINR(result.invested)} />
            <ResultCard label="Estimated Value" value={toMoneyINR(result.corpus)} type="highlight" />
          </div>
        )
      }
    />
  )
}

function SimpleFundReturnsTemplate(props: {
  title: string
  description: string
  icon: any
  defaultRate: number
}) {
  const [principal, setPrincipal] = useState(100000)
  const [monthly, setMonthly] = useState(0)
  const [rate, setRate] = useState(props.defaultRate)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<{ invested: number; value: number } | null>(null)

  const calculate = () => {
    const months = Math.round(years * 12)
    const fv = fvLumpsum(principal, rate, years) + fvSIP(monthly, rate, months)
    const invested = principal + monthly * months
    setResult({ invested, value: fv })
  }

  return (
    <FinancialCalculatorTemplate
      title={props.title}
      description={props.description}
      icon={props.icon}
      calculate={calculate}
      values={[principal, monthly, rate, years]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Initial Investment" value={principal} onChange={setPrincipal} min={0} max={100000000} step={1000} prefix="₹" />
          <InputGroup label="Monthly Investment (Optional)" value={monthly} onChange={setMonthly} min={0} max={1000000} step={500} prefix="₹" />
          <InputGroup label="Expected Annual Return" value={rate} onChange={setRate} min={-20} max={30} step={0.1} suffix="%" />
          <InputGroup label="Time Period" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Total Invested" value={toMoneyINR(result.invested)} />
            <ResultCard label="Estimated Value" value={toMoneyINR(result.value)} type="highlight" />
            <ResultCard label="Estimated Gain" value={toMoneyINR(Math.max(0, result.value - result.invested))} type="success" />
          </div>
        )
      }
    />
  )
}

export function IndexFundReturnsCalculator() {
  return (
    <SimpleFundReturnsTemplate
      title="Index Fund Returns Calculator"
      description="Estimate returns for an index fund using expected annual return."
      icon={TrendingUp}
      defaultRate={12}
    />
  )
}

export function DebtFundReturnsCalculator() {
  return (
    <SimpleFundReturnsTemplate
      title="Debt Fund Returns Calculator"
      description="Estimate returns for a debt fund (typically lower volatility)."
      icon={BarChart3}
      defaultRate={7}
    />
  )
}

export function HybridFundCalculator() {
  return (
    <SimpleFundReturnsTemplate
      title="Hybrid Fund Calculator"
      description="Estimate returns for a hybrid fund (mix of equity and debt)."
      icon={PieChart}
      defaultRate={9}
    />
  )
}

export function ETFReturnsCalculator() {
  return (
    <SimpleFundReturnsTemplate
      title="ETF Returns Calculator"
      description="Estimate returns for an ETF using expected annual return."
      icon={TrendingUp}
      defaultRate={11}
    />
  )
}

export function ULIPCalculator() {
  const [yearlyPremium, setYearlyPremium] = useState(100000)
  const [years, setYears] = useState(15)
  const [grossReturn, setGrossReturn] = useState(10)
  const [charges, setCharges] = useState(2)
  const [result, setResult] = useState<{ invested: number; corpus: number; netReturn: number } | null>(null)

  const calculate = () => {
    const netReturn = grossReturn - charges
    const r = netReturn / 100
    let corpus = 0
    for (let i = 0; i < Math.max(0, Math.round(years)); i++) {
      corpus = (corpus + yearlyPremium) * (1 + r)
    }
    setResult({ invested: yearlyPremium * years, corpus, netReturn })
  }

  return (
    <FinancialCalculatorTemplate
      title="ULIP Calculator"
      description="Estimate ULIP corpus using yearly premiums and net return after charges (simplified)."
      icon={Shield}
      calculate={calculate}
      values={[yearlyPremium, years, grossReturn, charges]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Yearly Premium" value={yearlyPremium} onChange={setYearlyPremium} min={0} max={10000000} step={1000} prefix="₹" />
          <InputGroup label="Policy Term" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" years" />
          <InputGroup label="Expected Gross Return" value={grossReturn} onChange={setGrossReturn} min={-20} max={30} step={0.1} suffix="%" />
          <InputGroup label="Estimated Annual Charges" value={charges} onChange={setCharges} min={0} max={10} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Net Return" value={`${result.netReturn.toFixed(2)}%`} />
            <ResultCard label="Total Invested" value={toMoneyINR(result.invested)} />
            <ResultCard label="Estimated Corpus" value={toMoneyINR(result.corpus)} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function PortfolioRebalancingCalculator() {
  const [portfolioValue, setPortfolioValue] = useState(1000000)
  const [eqNow, setEqNow] = useState(60)
  const [debtNow, setDebtNow] = useState(30)
  const [goldNow, setGoldNow] = useState(10)

  const [eqTarget, setEqTarget] = useState(50)
  const [debtTarget, setDebtTarget] = useState(40)
  const [goldTarget, setGoldTarget] = useState(10)

  const [result, setResult] = useState<{
    current: { eq: number; debt: number; gold: number }
    target: { eq: number; debt: number; gold: number }
    trades: { eq: number; debt: number; gold: number }
  } | null>(null)

  const calculate = () => {
    const sumNow = eqNow + debtNow + goldNow
    const sumTarget = eqTarget + debtTarget + goldTarget

    const now = {
      eq: (portfolioValue * (eqNow / (sumNow || 1))) / 100,
      debt: (portfolioValue * (debtNow / (sumNow || 1))) / 100,
      gold: (portfolioValue * (goldNow / (sumNow || 1))) / 100
    }

    const target = {
      eq: (portfolioValue * (eqTarget / (sumTarget || 1))) / 100,
      debt: (portfolioValue * (debtTarget / (sumTarget || 1))) / 100,
      gold: (portfolioValue * (goldTarget / (sumTarget || 1))) / 100
    }

    const trades = {
      eq: target.eq - now.eq,
      debt: target.debt - now.debt,
      gold: target.gold - now.gold
    }

    setResult({ current: now, target, trades })
  }

  const tradeLabel = (x: number) => (x >= 0 ? `Buy ${toMoneyINR(x)}` : `Sell ${toMoneyINR(Math.abs(x))}`)

  return (
    <FinancialCalculatorTemplate
      title="Portfolio Rebalancing Calculator"
      description="Calculate target amounts and buy/sell adjustments to rebalance your portfolio."
      icon={PieChart}
      calculate={calculate}
      values={[portfolioValue, eqNow, debtNow, goldNow, eqTarget, debtTarget, goldTarget]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Total Portfolio Value" value={portfolioValue} onChange={setPortfolioValue} min={0} max={1000000000} step={10000} prefix="₹" />

          <div className="text-sm font-medium">Current Allocation</div>
          <InputGroup label="Equity" value={eqNow} onChange={setEqNow} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Debt" value={debtNow} onChange={setDebtNow} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Gold" value={goldNow} onChange={setGoldNow} min={0} max={100} step={1} suffix="%" />

          <div className="text-sm font-medium">Target Allocation</div>
          <InputGroup label="Equity" value={eqTarget} onChange={setEqTarget} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Debt" value={debtTarget} onChange={setDebtTarget} min={0} max={100} step={1} suffix="%" />
          <InputGroup label="Gold" value={goldTarget} onChange={setGoldTarget} min={0} max={100} step={1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Equity" value={tradeLabel(result.trades.eq)} type={result.trades.eq >= 0 ? "highlight" : "warning"} />
              <ResultCard label="Debt" value={tradeLabel(result.trades.debt)} type={result.trades.debt >= 0 ? "highlight" : "warning"} />
              <ResultCard label="Gold" value={tradeLabel(result.trades.gold)} type={result.trades.gold >= 0 ? "highlight" : "warning"} />
            </div>
            <div className="text-sm text-muted-foreground">Positive means buy; negative means sell. Percentages are normalized if totals are not 100%.</div>
          </div>
        )
      }
    />
  )
}

export function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)
  const [months, setMonths] = useState(6)
  const [currentSavings, setCurrentSavings] = useState(100000)
  const [result, setResult] = useState<{ required: number; shortfall: number } | null>(null)

  const calculate = () => {
    const required = monthlyExpenses * months
    const shortfall = Math.max(0, required - currentSavings)
    setResult({ required, shortfall })
  }

  return (
    <FinancialCalculatorTemplate
      title="Emergency Fund Calculator"
      description="Estimate the emergency fund you need based on monthly expenses and desired coverage."
      icon={Shield}
      calculate={calculate}
      values={[monthlyExpenses, months, currentSavings]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Monthly Expenses" value={monthlyExpenses} onChange={setMonthlyExpenses} min={0} max={10000000} step={1000} prefix="₹" />
          <InputGroup label="Coverage" value={months} onChange={setMonths} min={1} max={36} step={1} suffix=" months" />
          <InputGroup label="Current Emergency Savings" value={currentSavings} onChange={setCurrentSavings} min={0} max={100000000} step={1000} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Recommended Fund" value={toMoneyINR(result.required)} type="highlight" />
            <ResultCard label="Shortfall" value={toMoneyINR(result.shortfall)} type={result.shortfall > 0 ? "warning" : "success"} />
          </div>
        )
      }
    />
  )
}

export function GoalBasedInvestmentCalculator() {
  const [goalAmount, setGoalAmount] = useState(5000000)
  const [years, setYears] = useState(10)
  const [returnRate, setReturnRate] = useState(12)
  const [initial, setInitial] = useState(0)
  const [result, setResult] = useState<{ requiredMonthly: number; currentPlanFV: number } | null>(null)

  const calculate = () => {
    const months = Math.round(years * 12)
    const r = returnRate / 100 / 12

    const fvInitial = fvLumpsum(initial, returnRate, years)
    const remainingGoal = Math.max(0, goalAmount - fvInitial)

    if (months <= 0) {
      setResult({ requiredMonthly: 0, currentPlanFV: fvInitial })
      return
    }

    let requiredMonthly = 0
    if (r === 0) {
      requiredMonthly = remainingGoal / months
    } else {
      // FV of ordinary annuity: PMT * (( (1+r)^n - 1 ) / r)
      requiredMonthly = remainingGoal / (((Math.pow(1 + r, months) - 1) / r) || 1)
    }

    const currentPlanFV = fvInitial + fvSIP(requiredMonthly, returnRate, months)
    setResult({ requiredMonthly, currentPlanFV })
  }

  return (
    <FinancialCalculatorTemplate
      title="Goal-Based Investment Calculator"
      description="Estimate required monthly investment to reach a future goal (simplified)."
      icon={Target}
      calculate={calculate}
      values={[goalAmount, years, returnRate, initial]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Goal Amount" value={goalAmount} onChange={setGoalAmount} min={0} max={1000000000} step={10000} prefix="₹" />
          <InputGroup label="Time to Goal" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Initial Investment (Optional)" value={initial} onChange={setInitial} min={0} max={1000000000} step={1000} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Required Monthly Investment" value={toMoneyINR(result.requiredMonthly)} type="highlight" />
            <ResultCard label="Projected Value (with required SIP)" value={toMoneyINR(result.currentPlanFV)} type="success" />
          </div>
        )
      }
    />
  )
}
