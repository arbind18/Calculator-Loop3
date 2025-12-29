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
import { generateReport } from "@/lib/downloadUtils"

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
      onClear={() => {
        setRate(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setRate(Number(vals[0] ?? 10))
        setResult(null)
      }}
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
      onClear={() => {
        setNominal(12)
        setInflation(6)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setNominal(Number(vals[0] ?? 12))
        setInflation(Number(vals[1] ?? 6))
        setResult(null)
      }}
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
      onClear={() => {
        setInitial(100000)
        setMonthly(10000)
        setReturnRate(12)
        setYears(10)
        setDelayMonths(12)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setInitial(Number(vals[0] ?? 100000))
        setMonthly(Number(vals[1] ?? 10000))
        setReturnRate(Number(vals[2] ?? 12))
        setYears(Number(vals[3] ?? 10))
        setDelayMonths(Number(vals[4] ?? 12))
        setResult(null)
      }}
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
      onClear={() => {
        setEquity(60)
        setDebt(30)
        setGold(10)
        setCash(0)
        setPortfolio(1000000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setEquity(Number(vals[0] ?? 60))
        setDebt(Number(vals[1] ?? 30))
        setGold(Number(vals[2] ?? 10))
        setCash(Number(vals[3] ?? 0))
        setPortfolio(Number(vals[4] ?? 1000000))
        setResult(null)
      }}
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
      onClear={() => {
        setDiscountRate(12)
        setInitialOutflow(100000)
        setCf1(30000)
        setCf2(30000)
        setCf3(30000)
        setCf4(30000)
        setCf5(30000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setDiscountRate(Number(vals[0] ?? 12))
        setInitialOutflow(Number(vals[1] ?? 100000))
        setCf1(Number(vals[2] ?? 30000))
        setCf2(Number(vals[3] ?? 30000))
        setCf3(Number(vals[4] ?? 30000))
        setCf4(Number(vals[5] ?? 30000))
        setCf5(Number(vals[6] ?? 30000))
        setResult(null)
      }}
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
      onClear={() => {
        setPortfolioReturn(14)
        setRiskFree(6)
        setStdDev(18)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPortfolioReturn(Number(vals[0] ?? 14))
        setRiskFree(Number(vals[1] ?? 6))
        setStdDev(Number(vals[2] ?? 18))
        setResult(null)
      }}
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
      onClear={() => {
        setPortfolioReturn(14)
        setRiskFree(6)
        setBeta(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPortfolioReturn(Number(vals[0] ?? 14))
        setRiskFree(Number(vals[1] ?? 6))
        setBeta(Number(vals[2] ?? 1))
        setResult(null)
      }}
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
      onClear={() => {
        setPortfolioReturn(14)
        setMarketReturn(12)
        setRiskFree(6)
        setBeta(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPortfolioReturn(Number(vals[0] ?? 14))
        setMarketReturn(Number(vals[1] ?? 12))
        setRiskFree(Number(vals[2] ?? 6))
        setBeta(Number(vals[3] ?? 1))
        setResult(null)
      }}
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
      onClear={() => {
        setCorrelation(0.8)
        setPortfolioVol(18)
        setMarketVol(16)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setCorrelation(Number(vals[0] ?? 0.8))
        setPortfolioVol(Number(vals[1] ?? 18))
        setMarketVol(Number(vals[2] ?? 16))
        setResult(null)
      }}
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
  const [result, setResult] = useState<{
    startNow: number;
    delayed: number;
    loss: number;
    schedule: Array<{ year: number; startNow: number; delayed: number; loss: number }>;
  } | null>(null)

  const calculate = () => {
    const months = Math.max(0, Math.round(years * 12))
    const delay = Math.max(0, Math.round(delayMonths))
    const rm = (returnRate / 100) / 12

    let startNowBal = 0
    let delayedBal = 0
    const schedule: Array<{ year: number; startNow: number; delayed: number; loss: number }> = []

    for (let m = 1; m <= months; m++) {
      // Start now: contribute each month then earn returns
      startNowBal += monthly
      startNowBal += startNowBal * rm

      // Delayed: contribute only after the delay, then earn returns
      if (m > delay) {
        delayedBal += monthly
      }
      delayedBal += delayedBal * rm

      if (m % 12 === 0 || m === months) {
        const y = Math.ceil(m / 12)
        schedule.push({
          year: y,
          startNow: Math.round(startNowBal),
          delayed: Math.round(delayedBal),
          loss: Math.round(startNowBal - delayedBal)
        })
      }
    }

    const startNow = schedule.length ? schedule[schedule.length - 1].startNow : 0
    const delayed = schedule.length ? schedule[schedule.length - 1].delayed : 0
    setResult({ startNow, delayed, loss: startNow - delayed, schedule })
  }

  const handleDownload = (format: string, options?: any) => {
    if (!result) return
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

    const headers = ['Year', 'Corpus (Start Now)', 'Corpus (Delayed)', 'Loss']
    const data = scheduleData.map((row) => [row.year, row.startNow, row.delayed, row.loss])

    generateReport(format, 'sip_delay_cost_report', headers, data, 'SIP Delay Cost Report', {
      'Monthly SIP Amount': `₹${monthly}`,
      'Expected Annual Return': `${returnRate}%`,
      'Total Investment Period': `${years} years`,
      'Delay': `${delayMonths} months`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="SIP Delay Cost Calculator"
      description="Compare SIP corpus if you start now vs after a delay."
      icon={Target}
      calculate={calculate}
      onDownload={handleDownload}
      values={[monthly, returnRate, years, delayMonths]}
      onClear={() => {
        setMonthly(10000)
        setReturnRate(12)
        setYears(10)
        setDelayMonths(12)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setMonthly(Number(vals[0] ?? 10000))
        setReturnRate(Number(vals[1] ?? 12))
        setYears(Number(vals[2] ?? 10))
        setDelayMonths(Number(vals[3] ?? 12))
        setResult(null)
      }}
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
      schedule={
        result && (
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Year</th>
                <th className="text-right p-3">Start Now</th>
                <th className="text-right p-3">Delayed</th>
                <th className="text-right p-3">Loss</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.year} className="border-b last:border-b-0">
                  <td className="p-3">{row.year}</td>
                  <td className="p-3 text-right">₹{row.startNow.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{row.delayed.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{Math.max(0, row.loss).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const [result, setResult] = useState<{
    fvLump: number;
    fvSip: number;
    breakEvenYear: number | null;
    schedule: Array<{ year: number; fvLump: number; fvSip: number; diff: number }>;
  } | null>(null)

  const calculate = () => {
    const y = Math.max(0, Math.round(years))
    const schedule: Array<{ year: number; fvLump: number; fvSip: number; diff: number }> = []
    let breakEvenYear: number | null = null

    for (let year = 1; year <= y; year++) {
      const fvLump = fvLumpsum(lumpsum, returnRate, year)
      const fvSipValue = fvSIP(sip, returnRate, Math.round(year * 12))
      const diff = fvSipValue - fvLump
      schedule.push({ year, fvLump, fvSip: fvSipValue, diff })
      if (breakEvenYear === null && diff >= 0) {
        breakEvenYear = year
      }
    }

    const last = schedule.length ? schedule[schedule.length - 1] : { fvLump: 0, fvSip: 0 }
    setResult({
      fvLump: last.fvLump,
      fvSip: last.fvSip,
      breakEvenYear,
      schedule
    })
  }

  const handleDownload = (format: string, options?: any) => {
    if (!result) return
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

    const headers = ['Year', 'Lumpsum Value', 'SIP Value', 'SIP - Lumpsum']
    const data = scheduleData.map((row) => [row.year, Math.round(row.fvLump), Math.round(row.fvSip), Math.round(row.diff)])

    generateReport(format, 'lumpsum_vs_sip_report', headers, data, 'Lumpsum vs SIP Report', {
      'Lumpsum Amount': `₹${lumpsum}`,
      'Monthly SIP': `₹${sip}`,
      'Expected Annual Return': `${returnRate}%`,
      'Time Period': `${years} years`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Lumpsum vs SIP Calculator"
      description="Compare future value of a lumpsum investment vs a monthly SIP."
      icon={TrendingUp}
      calculate={calculate}
      onDownload={handleDownload}
      values={[lumpsum, sip, returnRate, years]}
      onClear={() => {
        setLumpsum(500000)
        setSip(10000)
        setReturnRate(12)
        setYears(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setLumpsum(Number(vals[0] ?? 500000))
        setSip(Number(vals[1] ?? 10000))
        setReturnRate(Number(vals[2] ?? 12))
        setYears(Number(vals[3] ?? 10))
        setResult(null)
      }}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Lumpsum Future Value" value={toMoneyINR(result.fvLump)} type="highlight" />
            <ResultCard label="SIP Future Value" value={toMoneyINR(result.fvSip)} />
            <ResultCard
              label="Break-even (SIP ≥ Lumpsum)"
              value={result.breakEvenYear ? `${result.breakEvenYear} years` : "Not reached"}
              type={result.breakEvenYear ? "success" : "warning"}
            />
          </div>
        )
      }
      schedule={
        result && (
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Year</th>
                <th className="text-right p-3">Lumpsum Value</th>
                <th className="text-right p-3">SIP Value</th>
                <th className="text-right p-3">SIP - Lumpsum</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.year} className="border-b last:border-b-0">
                  <td className="p-3">{row.year}</td>
                  <td className="p-3 text-right">₹{Math.round(row.fvLump).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{Math.round(row.fvSip).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{Math.round(row.diff).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      onClear={() => {
        setInitial(500000)
        setMonthlyTransfer(25000)
        setSourceReturn(6)
        setTargetReturn(12)
        setMonths(24)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setInitial(Number(vals[0] ?? 500000))
        setMonthlyTransfer(Number(vals[1] ?? 25000))
        setSourceReturn(Number(vals[2] ?? 6))
        setTargetReturn(Number(vals[3] ?? 12))
        setMonths(Number(vals[4] ?? 24))
        setResult(null)
      }}
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
      onClear={() => {
        setPrincipal(500000)
        setDividendYield(2)
        setPriceGrowth(10)
        setYears(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals[0] ?? 500000))
        setDividendYield(Number(vals[1] ?? 2))
        setPriceGrowth(Number(vals[2] ?? 10))
        setYears(Number(vals[3] ?? 10))
        setResult(null)
      }}
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
      onClear={() => {
        setCurrentPrice(200)
        setSubscriptionPrice(150)
        setExistingShares(100)
        setRatioExistingPerNew(4)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setCurrentPrice(Number(vals[0] ?? 200))
        setSubscriptionPrice(Number(vals[1] ?? 150))
        setExistingShares(Number(vals[2] ?? 100))
        setRatioExistingPerNew(Number(vals[3] ?? 4))
        setResult(null)
      }}
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
      onClear={() => {
        setPrincipal(200000)
        setGoldAppreciation(8)
        setInterestRate(2.5)
        setYears(8)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals[0] ?? 200000))
        setGoldAppreciation(Number(vals[1] ?? 8))
        setInterestRate(Number(vals[2] ?? 2.5))
        setYears(Number(vals[3] ?? 8))
        setResult(null)
      }}
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
      onClear={() => {
        setMonthly(5000)
        setReturnRate(10)
        setYears(25)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setMonthly(Number(vals[0] ?? 5000))
        setReturnRate(Number(vals[1] ?? 10))
        setYears(Number(vals[2] ?? 25))
        setResult(null)
      }}
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
      onClear={() => {
        setMonthly(5000)
        setReturnRate(12)
        setYears(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setMonthly(Number(vals[0] ?? 5000))
        setReturnRate(Number(vals[1] ?? 12))
        setYears(Number(vals[2] ?? 10))
        setResult(null)
      }}
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
      onClear={() => {
        setPrincipal(100000)
        setMonthly(0)
        setRate(props.defaultRate)
        setYears(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals[0] ?? 100000))
        setMonthly(Number(vals[1] ?? 0))
        setRate(Number(vals[2] ?? props.defaultRate))
        setYears(Number(vals[3] ?? 10))
        setResult(null)
      }}
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
      onClear={() => {
        setYearlyPremium(100000)
        setYears(15)
        setGrossReturn(10)
        setCharges(2)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setYearlyPremium(Number(vals[0] ?? 100000))
        setYears(Number(vals[1] ?? 15))
        setGrossReturn(Number(vals[2] ?? 10))
        setCharges(Number(vals[3] ?? 2))
        setResult(null)
      }}
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
      onClear={() => {
        setPortfolioValue(1000000)
        setEqNow(60)
        setDebtNow(30)
        setGoldNow(10)
        setEqTarget(50)
        setDebtTarget(40)
        setGoldTarget(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPortfolioValue(Number(vals[0] ?? 1000000))
        setEqNow(Number(vals[1] ?? 60))
        setDebtNow(Number(vals[2] ?? 30))
        setGoldNow(Number(vals[3] ?? 10))
        setEqTarget(Number(vals[4] ?? 50))
        setDebtTarget(Number(vals[5] ?? 40))
        setGoldTarget(Number(vals[6] ?? 10))
        setResult(null)
      }}
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
      onClear={() => {
        setMonthlyExpenses(50000)
        setMonths(6)
        setCurrentSavings(100000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setMonthlyExpenses(Number(vals[0] ?? 50000))
        setMonths(Number(vals[1] ?? 6))
        setCurrentSavings(Number(vals[2] ?? 100000))
        setResult(null)
      }}
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
  const [inflationRate, setInflationRate] = useState(6)
  const [result, setResult] = useState<{
    futureGoal: number;
    requiredMonthly: number;
    projectedFV: number;
    surplusOrShortfall: number;
    schedule: Array<{ year: number; invested: number; value: number; shortfall: number }>;
  } | null>(null)

  const calculate = () => {
    const y = Math.max(0, Math.round(years))
    const months = Math.max(0, Math.round(y * 12))
    const rm = (returnRate / 100) / 12

    // Inflate the goal amount to future value if inflationRate > 0
    const futureGoal = goalAmount * Math.pow(1 + (inflationRate / 100), y)

    // Compute required monthly SIP (ordinary annuity FV) to bridge gap after initial investment
    const fvInitial = fvLumpsum(initial, returnRate, y)
    const remainingGoal = Math.max(0, futureGoal - fvInitial)

    let requiredMonthly = 0
    if (months <= 0) {
      requiredMonthly = 0
    } else if (rm === 0) {
      requiredMonthly = remainingGoal / months
    } else {
      requiredMonthly = remainingGoal / (((Math.pow(1 + rm, months) - 1) / rm) || 1)
    }

    // Build a yearly schedule by simulating month-by-month
    let balance = initial
    const schedule: Array<{ year: number; invested: number; value: number; shortfall: number }> = []

    for (let m = 1; m <= months; m++) {
      balance += requiredMonthly
      balance += balance * rm

      if (m % 12 === 0 || m === months) {
        const year = Math.ceil(m / 12)
        const invested = initial + requiredMonthly * m
        const value = Math.round(balance)
        const shortfall = Math.max(0, Math.round(futureGoal - balance))
        schedule.push({ year, invested: Math.round(invested), value, shortfall })
      }
    }

    const projectedFV = schedule.length ? schedule[schedule.length - 1].value : Math.round(fvInitial)
    const surplusOrShortfall = Math.round(projectedFV - futureGoal)
    setResult({
      futureGoal: Math.round(futureGoal),
      requiredMonthly: Math.round(requiredMonthly),
      projectedFV,
      surplusOrShortfall,
      schedule
    })
  }

  const handleDownload = (format: string, options?: any) => {
    if (!result) return
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

    const headers = ['Year', 'Total Invested', 'Projected Value', 'Shortfall vs Goal']
    const data = scheduleData.map((row) => [row.year, row.invested, row.value, row.shortfall])

    generateReport(format, 'goal_based_investment_report', headers, data, 'Goal-Based Investment Report', {
      'Goal Amount (Today)': `₹${goalAmount}`,
      'Goal Inflation (p.a)': `${inflationRate}%`,
      'Time to Goal': `${years} years`,
      'Expected Annual Return': `${returnRate}%`,
      'Initial Investment': `₹${initial}`,
      'Inflation-adjusted Future Goal': `₹${result.futureGoal}`
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Goal-Based Investment Calculator"
      description="Estimate required monthly investment to reach a future goal (with optional inflation adjustment)."
      icon={Target}
      calculate={calculate}
      onDownload={handleDownload}
      values={[goalAmount, years, returnRate, initial, inflationRate]}
      onClear={() => {
        setGoalAmount(5000000)
        setYears(10)
        setReturnRate(12)
        setInitial(0)
        setInflationRate(6)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setGoalAmount(Number(vals[0] ?? 5000000))
        setYears(Number(vals[1] ?? 10))
        setReturnRate(Number(vals[2] ?? 12))
        setInitial(Number(vals[3] ?? 0))
        setInflationRate(Number(vals[4] ?? 6))
        setResult(null)
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Goal Amount" value={goalAmount} onChange={setGoalAmount} min={0} max={1000000000} step={10000} prefix="₹" />
          <InputGroup label="Time to Goal" value={years} onChange={setYears} min={1} max={50} step={1} suffix=" years" />
          <InputGroup label="Expected Annual Return" value={returnRate} onChange={setReturnRate} min={0} max={30} step={0.1} suffix="%" />
          <InputGroup label="Goal Inflation (Optional)" value={inflationRate} onChange={setInflationRate} min={0} max={20} step={0.1} suffix="%" />
          <InputGroup label="Initial Investment (Optional)" value={initial} onChange={setInitial} min={0} max={1000000000} step={1000} prefix="₹" />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard label="Inflation-adjusted Goal" value={toMoneyINR(result.futureGoal)} type="highlight" />
            <ResultCard label="Required Monthly Investment" value={toMoneyINR(result.requiredMonthly)} type="success" />
            <ResultCard label="Projected Value" value={toMoneyINR(result.projectedFV)} />
            <ResultCard
              label="Surplus / Shortfall"
              value={toMoneyINR(Math.abs(result.surplusOrShortfall))}
              type={result.surplusOrShortfall >= 0 ? "success" : "warning"}
            />
          </div>
        )
      }
      schedule={
        result && (
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Year</th>
                <th className="text-right p-3">Total Invested</th>
                <th className="text-right p-3">Projected Value</th>
                <th className="text-right p-3">Shortfall vs Goal</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.year} className="border-b last:border-b-0">
                  <td className="p-3">{row.year}</td>
                  <td className="p-3 text-right">₹{row.invested.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{row.value.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{row.shortfall.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    />
  )
}
