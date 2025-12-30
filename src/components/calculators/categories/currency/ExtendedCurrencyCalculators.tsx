"use client"

import { useMemo, useState } from "react"
import { Calculator, TrendingUp, Activity, ArrowUpDown } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

function parsePair(pair: string) {
  const cleaned = (pair || "").replace("/", "").trim().toUpperCase()
  const base = cleaned.slice(0, 3)
  const quote = cleaned.slice(3, 6)
  return { base, quote }
}

function getDefaultPipSize(pair: string) {
  const { quote } = parsePair(pair)
  return quote === "JPY" ? 0.01 : 0.0001
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

function parseCsvNumbers(input: string) {
  const parts = (input || "")
    .split(/[,\n\t\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)

  const values: number[] = []
  for (const part of parts) {
    const n = Number(part)
    if (Number.isFinite(n)) values.push(n)
  }
  return values
}

function mean(values: number[]) {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function stdev(values: number[]) {
  if (values.length < 2) return 0
  const m = mean(values)
  const variance = values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

function pearsonCorrelation(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length)
  if (n < 2) return 0
  const xs = x.slice(0, n)
  const ys = y.slice(0, n)
  const mx = mean(xs)
  const my = mean(ys)
  let num = 0
  let dx = 0
  let dy = 0
  for (let i = 0; i < n; i++) {
    const vx = xs[i] - mx
    const vy = ys[i] - my
    num += vx * vy
    dx += vx * vx
    dy += vy * vy
  }
  const den = Math.sqrt(dx * dy)
  return den === 0 ? 0 : num / den
}

function computePipValueInAccountCurrency(args: {
  units: number
  pipSize: number
  price: number
  accountCurrency: string
  pair: string
  quoteToAccountRate: number | null
}) {
  const { base, quote } = parsePair(args.pair)
  const account = (args.accountCurrency || "").trim().toUpperCase()

  const units = args.units
  const pipSize = args.pipSize
  const price = args.price

  // Value of 1 pip move in QUOTE currency (since units are in base currency)
  const pipValueInQuote = units * pipSize

  if (account === quote) return pipValueInQuote

  // If account currency is base, convert quote->base by dividing by price (base/quote rate)
  if (account === base) return pipValueInQuote / price

  // Otherwise need explicit quote -> account conversion rate
  if (!args.quoteToAccountRate || args.quoteToAccountRate <= 0) return null
  return pipValueInQuote * args.quoteToAccountRate
}

export function PipValueCalculator() {
  const [pair, setPair] = useState("EURUSD")
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [price, setPrice] = useState(1.1)
  const [pipSize, setPipSize] = useState(getDefaultPipSize("EURUSD"))

  const [sizeMode, setSizeMode] = useState<"standard" | "mini" | "micro" | "custom">("standard")
  const [customUnits, setCustomUnits] = useState(100000)
  const [quoteToAccountRate, setQuoteToAccountRate] = useState(83.12)
  const [pips, setPips] = useState(10)

  const [result, setResult] = useState<null | {
    pipValuePerPip: number
    pipValueForMove: number
    pipValueStandard: number | null
    pipValueMini: number | null
    pipValueMicro: number | null
    note?: string
  }>(null)

  const units = useMemo(() => {
    if (sizeMode === "standard") return 100000
    if (sizeMode === "mini") return 10000
    if (sizeMode === "micro") return 1000
    return clampNumber(customUnits, 1, 100000000)
  }, [sizeMode, customUnits])

  const calculate = () => {
    const safePrice = clampNumber(price, 0.0000001, 100000000)
    const safePipSize = clampNumber(pipSize, 0.00000001, 1000)
    const safePips = clampNumber(pips, 1, 1000000)

    const pipValuePerPip = computePipValueInAccountCurrency({
      units,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate: quoteToAccountRate,
    })

    const standard = computePipValueInAccountCurrency({
      units: 100000,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    const mini = computePipValueInAccountCurrency({
      units: 10000,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    const micro = computePipValueInAccountCurrency({
      units: 1000,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    if (pipValuePerPip === null) {
      setResult({
        pipValuePerPip: 0,
        pipValueForMove: 0,
        pipValueStandard: standard,
        pipValueMini: mini,
        pipValueMicro: micro,
        note: "Quote → Account conversion rate required for this pair/account currency.",
      })
      return
    }

    setResult({
      pipValuePerPip,
      pipValueForMove: pipValuePerPip * safePips,
      pipValueStandard: standard,
      pipValueMini: mini,
      pipValueMicro: micro,
    })
  }

  const handlePairChange = (next: string) => {
    setPair(next)
    setPipSize(getDefaultPipSize(next))

    // Provide sane default price for popular pairs
    const defaults: Record<string, number> = {
      EURUSD: 1.1,
      GBPUSD: 1.25,
      USDJPY: 145,
      USDINR: 83.12,
      EURINR: 91.5,
      GBPINR: 104.5,
    }
    if (defaults[next]) setPrice(defaults[next])
  }

  return (
    <FinancialCalculatorTemplate
      title="Pip Value Calculator"
      description="Calculate pip value per trade size and estimate profit/loss for a given pip move."
      icon={TrendingUp}
      calculate={calculate}
      values={[pair, accountCurrency, price, pipSize, sizeMode, customUnits, quoteToAccountRate, pips]}
      onClear={() => {
        setPair("EURUSD")
        setAccountCurrency("USD")
        setPrice(1.1)
        setPipSize(getDefaultPipSize("EURUSD"))
        setSizeMode("standard")
        setCustomUnits(100000)
        setQuoteToAccountRate(83.12)
        setPips(10)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPair(String(vals?.[0] ?? "EURUSD"))
        setAccountCurrency(String(vals?.[1] ?? "USD"))
        setPrice(Number(vals?.[2] ?? 1.1))
        setPipSize(Number(vals?.[3] ?? getDefaultPipSize("EURUSD")))
        setSizeMode(((vals?.[4] ?? "standard") as any) as "standard" | "mini" | "micro" | "custom")
        setCustomUnits(Number(vals?.[5] ?? 100000))
        setQuoteToAccountRate(Number(vals?.[6] ?? 83.12))
        setPips(Number(vals?.[7] ?? 10))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency Pair</label>
              <select
                value={pair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="EURUSD">🇪🇺 EUR/USD 🇺🇸</option>
                <option value="GBPUSD">🇬🇧 GBP/USD 🇺🇸</option>
                <option value="USDJPY">🇺🇸 USD/JPY 🇯🇵</option>
                <option value="USDINR">🇺🇸 USD/INR 🇮🇳</option>
                <option value="EURINR">🇪🇺 EUR/INR 🇮🇳</option>
                <option value="GBPINR">🇬🇧 GBP/INR 🇮🇳</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Currency</label>
              <select
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="INR">🇮🇳 INR</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="JPY">🇯🇵 JPY</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Current Price (Exchange Rate)"
              value={price}
              onChange={setPrice}
              min={0.0000001}
              max={100000000}
              step={0.0001}
            />
            <InputGroup
              label="Pip Size"
              value={pipSize}
              onChange={setPipSize}
              min={0.00000001}
              max={1}
              step={0.00001}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trade Size</label>
              <select
                value={sizeMode}
                onChange={(e) => setSizeMode(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="standard">Standard Lot (100,000 units)</option>
                <option value="mini">Mini Lot (10,000 units)</option>
                <option value="micro">Micro Lot (1,000 units)</option>
                <option value="custom">Custom Units</option>
              </select>
            </div>

            {sizeMode === "custom" ? (
              <InputGroup
                label="Custom Units (Base Currency)"
                value={customUnits}
                onChange={setCustomUnits}
                min={1}
                max={100000000}
                step={1000}
              />
            ) : (
              <InputGroup
                label="Units (auto)"
                value={units}
                onChange={() => {}}
                min={0}
                max={0}
                step={1}
              />
            )}
          </div>

          <InputGroup
            label="Pip Move (for P/L estimate)"
            value={pips}
            onChange={setPips}
            min={1}
            max={1000000}
            step={1}
            suffix=" pips"
          />

          <InputGroup
            label="Quote → Account conversion rate (only if needed)"
            value={quoteToAccountRate}
            onChange={setQuoteToAccountRate}
            min={0.0000001}
            max={100000000}
            step={0.0001}
          />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            {result.note ? (
              <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
                {result.note}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                label="Pip Value (per 1 pip)"
                value={`${result.pipValuePerPip.toFixed(4)} ${accountCurrency.toUpperCase()}`}
                type="highlight"
              />
              <ResultCard
                label={`P/L for ${pips} pips`}
                value={`${result.pipValueForMove.toFixed(4)} ${accountCurrency.toUpperCase()}`}
                type={result.pipValueForMove >= 0 ? "success" : "warning"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard
                label="Standard Lot pip value"
                value={result.pipValueStandard === null ? "—" : `${result.pipValueStandard.toFixed(4)} ${accountCurrency.toUpperCase()}`}
                type="default"
              />
              <ResultCard
                label="Mini Lot pip value"
                value={result.pipValueMini === null ? "—" : `${result.pipValueMini.toFixed(4)} ${accountCurrency.toUpperCase()}`}
                type="default"
              />
              <ResultCard
                label="Micro Lot pip value"
                value={result.pipValueMicro === null ? "—" : `${result.pipValueMicro.toFixed(4)} ${accountCurrency.toUpperCase()}`}
                type="default"
              />
            </div>
          </div>
        )
      }
    />
  )
}

export function ForexPositionSizeCalculator() {
  const [pair, setPair] = useState("EURUSD")
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [price, setPrice] = useState(1.1)
  const [pipSize, setPipSize] = useState(getDefaultPipSize("EURUSD"))
  const [quoteToAccountRate, setQuoteToAccountRate] = useState(83.12)

  const [accountBalance, setAccountBalance] = useState(10000)
  const [riskPercent, setRiskPercent] = useState(1)
  const [stopLossPips, setStopLossPips] = useState(20)

  const [result, setResult] = useState<null | {
    riskAmount: number
    units: number
    lots: number
    pipValuePerPip: number
  }>(null)

  const calculate = () => {
    const safeBalance = clampNumber(accountBalance, 0, 1000000000)
    const safeRiskPercent = clampNumber(riskPercent, 0.01, 100)
    const safeStopLoss = clampNumber(stopLossPips, 1, 1000000)
    const safePrice = clampNumber(price, 0.0000001, 100000000)
    const safePipSize = clampNumber(pipSize, 0.00000001, 1000)

    const riskAmount = safeBalance * (safeRiskPercent / 100)

    // pip value per 1 unit in account currency
    const perUnit = computePipValueInAccountCurrency({
      units: 1,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    if (perUnit === null) {
      setResult(null)
      return
    }

    const units = riskAmount / (safeStopLoss * perUnit)
    const lots = units / 100000

    const pipValuePerPip = computePipValueInAccountCurrency({
      units,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    setResult({
      riskAmount,
      units,
      lots,
      pipValuePerPip: pipValuePerPip ?? 0,
    })
  }

  const handlePairChange = (next: string) => {
    setPair(next)
    setPipSize(getDefaultPipSize(next))
    const defaults: Record<string, number> = {
      EURUSD: 1.1,
      GBPUSD: 1.25,
      USDJPY: 145,
      USDINR: 83.12,
      EURINR: 91.5,
      GBPINR: 104.5,
    }
    if (defaults[next]) setPrice(defaults[next])
  }

  return (
    <FinancialCalculatorTemplate
      title="Position Size Calculator"
      description="Calculate position size based on account risk, stop-loss distance, and pip value."
      icon={Calculator}
      calculate={calculate}
      values={[pair, accountCurrency, price, pipSize, quoteToAccountRate, accountBalance, riskPercent, stopLossPips]}
      onClear={() => {
        setPair("EURUSD")
        setAccountCurrency("USD")
        setPrice(1.1)
        setPipSize(getDefaultPipSize("EURUSD"))
        setQuoteToAccountRate(83.12)
        setAccountBalance(10000)
        setRiskPercent(1)
        setStopLossPips(20)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPair(String(vals?.[0] ?? "EURUSD"))
        setAccountCurrency(String(vals?.[1] ?? "USD"))
        setPrice(Number(vals?.[2] ?? 1.1))
        setPipSize(Number(vals?.[3] ?? getDefaultPipSize("EURUSD")))
        setQuoteToAccountRate(Number(vals?.[4] ?? 83.12))
        setAccountBalance(Number(vals?.[5] ?? 10000))
        setRiskPercent(Number(vals?.[6] ?? 1))
        setStopLossPips(Number(vals?.[7] ?? 20))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency Pair</label>
              <select
                value={pair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="EURUSD">🇪🇺 EUR/USD 🇺🇸</option>
                <option value="GBPUSD">🇬🇧 GBP/USD 🇺🇸</option>
                <option value="USDJPY">🇺🇸 USD/JPY 🇯🇵</option>
                <option value="USDINR">🇺🇸 USD/INR 🇮🇳</option>
                <option value="EURINR">🇪🇺 EUR/INR 🇮🇳</option>
                <option value="GBPINR">🇬🇧 GBP/INR 🇮🇳</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Currency</label>
              <select
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="INR">🇮🇳 INR</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="JPY">🇯🇵 JPY</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Current Price (Exchange Rate)"
              value={price}
              onChange={setPrice}
              min={0.0000001}
              max={100000000}
              step={0.0001}
            />
            <InputGroup
              label="Pip Size"
              value={pipSize}
              onChange={setPipSize}
              min={0.00000001}
              max={1}
              step={0.00001}
            />
          </div>

          <InputGroup
            label="Quote → Account conversion rate (only if needed)"
            value={quoteToAccountRate}
            onChange={setQuoteToAccountRate}
            min={0.0000001}
            max={100000000}
            step={0.0001}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup
              label="Account Balance"
              value={accountBalance}
              onChange={setAccountBalance}
              min={0}
              max={1000000000}
              step={100}
              prefix={accountCurrency.toUpperCase() + " "}
            />
            <InputGroup
              label="Risk %"
              value={riskPercent}
              onChange={setRiskPercent}
              min={0.01}
              max={100}
              step={0.1}
              suffix="%"
            />
            <InputGroup
              label="Stop Loss"
              value={stopLossPips}
              onChange={setStopLossPips}
              min={1}
              max={1000000}
              step={1}
              suffix=" pips"
            />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Tip: For cross pairs where account currency is neither base nor quote, set an accurate “Quote → Account” conversion.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                label="Risk Amount"
                value={`${result.riskAmount.toFixed(2)} ${accountCurrency.toUpperCase()}`}
                type="warning"
              />
              <ResultCard
                label="Position Size (lots)"
                value={result.lots.toFixed(3)}
                type="highlight"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                label="Position Size (units)"
                value={Math.round(result.units).toLocaleString()}
                type="default"
              />
              <ResultCard
                label="Pip Value (for this position)"
                value={`${result.pipValuePerPip.toFixed(4)} ${accountCurrency.toUpperCase()} / pip`}
                type="success"
              />
            </div>
          </div>
        )
      }
    />
  )
}

export function ForexCompoundingCalculator() {
  const [initialCapital, setInitialCapital] = useState(10000)
  const [returnPerPeriod, setReturnPerPeriod] = useState(5)
  const [periods, setPeriods] = useState(12)
  const [contribution, setContribution] = useState(0)
  const [contributionAtStart, setContributionAtStart] = useState<"start" | "end">("start")

  const [result, setResult] = useState<null | {
    finalBalance: number
    totalContributions: number
    totalProfit: number
    totalReturnPercent: number
    schedule: Array<{ period: number; start: number; contribution: number; profit: number; end: number }>
  }>(null)

  const calculate = () => {
    const safeInitial = clampNumber(initialCapital, 0, 1000000000)
    const safeReturn = clampNumber(returnPerPeriod, -99.99, 1000)
    const safePeriods = Math.round(clampNumber(periods, 1, 1200))
    const safeContribution = clampNumber(contribution, 0, 1000000000)

    const r = safeReturn / 100

    let balance = safeInitial
    let totalContributions = 0
    const schedule: Array<{ period: number; start: number; contribution: number; profit: number; end: number }> = []

    for (let i = 1; i <= safePeriods; i++) {
      const start = balance
      const contrib = safeContribution

      if (contributionAtStart === "start") {
        balance = start + contrib
        totalContributions += contrib
        const profit = balance * r
        const end = balance + profit
        schedule.push({ period: i, start, contribution: contrib, profit, end })
        balance = end
      } else {
        const profit = start * r
        const end = start + profit + contrib
        totalContributions += contrib
        schedule.push({ period: i, start, contribution: contrib, profit, end })
        balance = end
      }
    }

    const finalBalance = balance
    const totalInvested = safeInitial + totalContributions
    const totalProfit = finalBalance - totalInvested
    const totalReturnPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

    setResult({ finalBalance, totalContributions, totalProfit, totalReturnPercent, schedule })
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Compounding Calculator"
      description="Model account growth over multiple periods with compounding and optional periodic contributions."
      icon={TrendingUp}
      calculate={calculate}
      values={[initialCapital, returnPerPeriod, periods, contribution, contributionAtStart]}
      onClear={() => {
        setInitialCapital(10000)
        setReturnPerPeriod(5)
        setPeriods(12)
        setContribution(0)
        setContributionAtStart("start")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setInitialCapital(Number(vals?.[0] ?? 10000))
        setReturnPerPeriod(Number(vals?.[1] ?? 5))
        setPeriods(Number(vals?.[2] ?? 12))
        setContribution(Number(vals?.[3] ?? 0))
        setContributionAtStart((String(vals?.[4] ?? "start") as any) as "start" | "end")
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Initial Capital"
              value={initialCapital}
              onChange={setInitialCapital}
              min={0}
              max={1000000000}
              step={100}
              prefix="$ "
            />
            <InputGroup
              label="Return per Period"
              value={returnPerPeriod}
              onChange={setReturnPerPeriod}
              min={-99.99}
              max={1000}
              step={0.1}
              suffix="%"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Number of Periods"
              value={periods}
              onChange={setPeriods}
              min={1}
              max={1200}
              step={1}
            />
            <InputGroup
              label="Contribution per Period"
              value={contribution}
              onChange={setContribution}
              min={0}
              max={1000000000}
              step={50}
              prefix="$ "
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contribution Timing</label>
            <select
              value={contributionAtStart}
              onChange={(e) => setContributionAtStart(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="start">At start of period</option>
              <option value="end">At end of period</option>
            </select>
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                label="Final Balance"
                value={`$${result.finalBalance.toFixed(2)}`}
                type="highlight"
              />
              <ResultCard
                label="Total Return"
                value={`${result.totalReturnPercent.toFixed(2)}%`}
                type={result.totalReturnPercent >= 0 ? "success" : "warning"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                label="Total Contributions"
                value={`$${result.totalContributions.toFixed(2)}`}
                type="default"
              />
              <ResultCard
                label="Total Profit"
                value={`$${result.totalProfit.toFixed(2)}`}
                type={result.totalProfit >= 0 ? "success" : "warning"}
              />
            </div>

            <div className="bg-secondary/50 p-4 rounded-xl">
              <div className="text-sm font-medium mb-3">Compounding Schedule (first 12 periods)</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-4">Period</th>
                      <th className="py-2 pr-4">Start</th>
                      <th className="py-2 pr-4">Contribution</th>
                      <th className="py-2 pr-4">Profit</th>
                      <th className="py-2 pr-0">End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, 12).map((row) => (
                      <tr key={row.period} className="border-t border-border/60">
                        <td className="py-2 pr-4">{row.period}</td>
                        <td className="py-2 pr-4">${row.start.toFixed(2)}</td>
                        <td className="py-2 pr-4">${row.contribution.toFixed(2)}</td>
                        <td className="py-2 pr-4">${row.profit.toFixed(2)}</td>
                        <td className="py-2 pr-0">${row.end.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.schedule.length > 12 ? (
                <div className="mt-3 text-xs text-muted-foreground">
                  Showing first 12 periods. Final balance already includes all periods.
                </div>
              ) : null}
            </div>
          </div>
        )
      }
    />
  )
}

function roundTo(value: number, decimals: number) {
  const p = Math.pow(10, decimals)
  return Math.round(value * p) / p
}

export function ForexRiskRewardRatio() {
  const [direction, setDirection] = useState<"long" | "short">("long")
  const [entry, setEntry] = useState(1.1)
  const [stopLoss, setStopLoss] = useState(1.095)
  const [takeProfit, setTakeProfit] = useState(1.11)
  const [accountBalance, setAccountBalance] = useState(10000)
  const [riskPercent, setRiskPercent] = useState(1)

  const [result, setResult] = useState<null | {
    riskPerUnit: number
    rewardPerUnit: number
    rr: number
    riskAmount: number
    rewardAmount: number
    breakevenWinRate: number
  }>(null)

  const calculate = () => {
    const e = clampNumber(entry, 0.0000001, 100000000)
    const sl = clampNumber(stopLoss, 0.0000001, 100000000)
    const tp = clampNumber(takeProfit, 0.0000001, 100000000)
    const bal = clampNumber(accountBalance, 0, 1000000000)
    const rp = clampNumber(riskPercent, 0.01, 100)

    const riskPerUnit = direction === "long" ? e - sl : sl - e
    const rewardPerUnit = direction === "long" ? tp - e : e - tp

    if (riskPerUnit <= 0 || rewardPerUnit <= 0) {
      setResult(null)
      return
    }

    const rr = rewardPerUnit / riskPerUnit
    const riskAmount = bal * (rp / 100)
    const rewardAmount = riskAmount * rr
    const breakevenWinRate = 1 / (1 + rr)

    setResult({
      riskPerUnit,
      rewardPerUnit,
      rr,
      riskAmount,
      rewardAmount,
      breakevenWinRate,
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Risk Reward Ratio"
      description="Evaluate trade risk/reward, breakeven win-rate, and expected reward for a chosen account risk."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[direction, entry, stopLoss, takeProfit, accountBalance, riskPercent]}
      onClear={() => {
        setDirection("long")
        setEntry(1.1)
        setStopLoss(1.095)
        setTakeProfit(1.11)
        setAccountBalance(10000)
        setRiskPercent(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        const d = String(vals?.[0] ?? "long")
        setDirection(d === "short" ? "short" : "long")
        setEntry(Number(vals?.[1] ?? 1.1))
        setStopLoss(Number(vals?.[2] ?? 1.095))
        setTakeProfit(Number(vals?.[3] ?? 1.11))
        setAccountBalance(Number(vals?.[4] ?? 10000))
        setRiskPercent(Number(vals?.[5] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
            <InputGroup
              label="Account Balance"
              value={accountBalance}
              onChange={setAccountBalance}
              min={0}
              max={1000000000}
              step={100}
              prefix="$ "
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Entry" value={entry} onChange={setEntry} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Stop Loss" value={stopLoss} onChange={setStopLoss} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Take Profit" value={takeProfit} onChange={setTakeProfit} min={0.0000001} max={100000000} step={0.0001} />
          </div>

          <InputGroup
            label="Risk % of Account"
            value={riskPercent}
            onChange={setRiskPercent}
            min={0.01}
            max={100}
            step={0.1}
            suffix="%"
          />

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            If inputs are invalid (e.g., stop-loss on wrong side), results will be empty.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Risk/Reward (R:R)" value={`1:${result.rr.toFixed(2)}`} type="highlight" />
              <ResultCard label="Breakeven Win-rate" value={`${(result.breakevenWinRate * 100).toFixed(2)}%`} type="default" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Risk Amount" value={`$${result.riskAmount.toFixed(2)}`} type="warning" />
              <ResultCard label="Reward Amount" value={`$${result.rewardAmount.toFixed(2)}`} type="success" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Risk (price units)" value={result.riskPerUnit.toFixed(6)} type="default" />
              <ResultCard label="Reward (price units)" value={result.rewardPerUnit.toFixed(6)} type="default" />
            </div>
          </div>
        )
      }
    />
  )
}

function computeClassicPivots(high: number, low: number, close: number) {
  const pivot = (high + low + close) / 3
  const r1 = 2 * pivot - low
  const s1 = 2 * pivot - high
  const r2 = pivot + (high - low)
  const s2 = pivot - (high - low)
  const r3 = high + 2 * (pivot - low)
  const s3 = low - 2 * (high - pivot)
  return { pivot, r1, r2, r3, s1, s2, s3 }
}

function computeWoodiePivots(high: number, low: number, close: number) {
  const pivot = (high + low + 2 * close) / 4
  const r1 = 2 * pivot - low
  const s1 = 2 * pivot - high
  const r2 = pivot + (high - low)
  const s2 = pivot - (high - low)
  return { pivot, r1, r2, s1, s2 }
}

function computeCamarillaPivots(high: number, low: number, close: number) {
  const range = high - low
  const r1 = close + range * 1.1 / 12
  const r2 = close + range * 1.1 / 6
  const r3 = close + range * 1.1 / 4
  const r4 = close + range * 1.1 / 2
  const s1 = close - range * 1.1 / 12
  const s2 = close - range * 1.1 / 6
  const s3 = close - range * 1.1 / 4
  const s4 = close - range * 1.1 / 2
  return { r1, r2, r3, r4, s1, s2, s3, s4 }
}

function computeFibonacciPivots(high: number, low: number, close: number) {
  const pivot = (high + low + close) / 3
  const range = high - low
  const r1 = pivot + 0.382 * range
  const r2 = pivot + 0.618 * range
  const r3 = pivot + 1.0 * range
  const s1 = pivot - 0.382 * range
  const s2 = pivot - 0.618 * range
  const s3 = pivot - 1.0 * range
  return { pivot, r1, r2, r3, s1, s2, s3 }
}

export function ForexPivotPointCalculator() {
  const [method, setMethod] = useState<"classic" | "fibonacci" | "woodie" | "camarilla">("classic")
  const [high, setHigh] = useState(1.12)
  const [low, setLow] = useState(1.09)
  const [close, setClose] = useState(1.1)
  const [decimals, setDecimals] = useState(5)

  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const h = clampNumber(high, 0.0000001, 100000000)
    const l = clampNumber(low, 0.0000001, 100000000)
    const c = clampNumber(close, 0.0000001, 100000000)
    const d = Math.round(clampNumber(decimals, 0, 8))

    if (l >= h) {
      setResult(null)
      return
    }

    let levels: any
    if (method === "classic") levels = computeClassicPivots(h, l, c)
    else if (method === "fibonacci") levels = computeFibonacciPivots(h, l, c)
    else if (method === "woodie") levels = computeWoodiePivots(h, l, c)
    else levels = computeCamarillaPivots(h, l, c)

    const rounded: any = {}
    for (const [k, v] of Object.entries(levels)) {
      rounded[k] = roundTo(v as number, d)
    }
    setResult({ method, levels: rounded, decimals: d })
  }

  const rows: Array<{ label: string; key: string }> =
    method === "camarilla"
      ? [
          { label: "R4", key: "r4" },
          { label: "R3", key: "r3" },
          { label: "R2", key: "r2" },
          { label: "R1", key: "r1" },
          { label: "S1", key: "s1" },
          { label: "S2", key: "s2" },
          { label: "S3", key: "s3" },
          { label: "S4", key: "s4" },
        ]
      : [
          { label: "Pivot", key: "pivot" },
          { label: "R1", key: "r1" },
          { label: "R2", key: "r2" },
          { label: "R3", key: "r3" },
          { label: "S1", key: "s1" },
          { label: "S2", key: "s2" },
          { label: "S3", key: "s3" },
        ]

  return (
    <FinancialCalculatorTemplate
      title="Pivot Point Calculator"
      description="Compute pivot levels (Classic, Fibonacci, Woodie, Camarilla) from previous session OHLC."
      icon={Activity}
      calculate={calculate}
      values={[method, high, low, close, decimals]}
      onClear={() => {
        setMethod("classic")
        setHigh(1.12)
        setLow(1.09)
        setClose(1.1)
        setDecimals(5)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        const m = String(vals?.[0] ?? "classic")
        setMethod((m === "fibonacci" || m === "woodie" || m === "camarilla" ? m : "classic") as any)
        setHigh(Number(vals?.[1] ?? 1.12))
        setLow(Number(vals?.[2] ?? 1.09))
        setClose(Number(vals?.[3] ?? 1.1))
        setDecimals(Number(vals?.[4] ?? 5))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="classic">Classic</option>
                <option value="fibonacci">Fibonacci</option>
                <option value="woodie">Woodie</option>
                <option value="camarilla">Camarilla</option>
              </select>
            </div>
            <InputGroup label="Decimals" value={decimals} onChange={setDecimals} min={0} max={8} step={1} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="High" value={high} onChange={setHigh} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Low" value={low} onChange={setLow} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Close" value={close} onChange={setClose} min={0.0000001} max={100000000} step={0.0001} />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Use previous session’s OHLC (e.g., yesterday’s daily candle) for intraday pivot levels.
          </div>
        </div>
      }
      result={
        result && (
          <div className="bg-secondary/50 p-4 rounded-xl">
            <div className="text-sm font-medium mb-3">Levels ({result.method})</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {rows.map((r) => (
                <ResultCard
                  key={r.key}
                  label={r.label}
                  value={String(result.levels[r.key] ?? "—")}
                  type={r.label === "Pivot" ? "highlight" : r.label.startsWith("R") ? "success" : "warning"}
                />
              ))}
            </div>
          </div>
        )
      }
    />
  )
}

export function FibonacciRetracementCalculator() {
  const [swingHigh, setSwingHigh] = useState(1.12)
  const [swingLow, setSwingLow] = useState(1.09)
  const [decimals, setDecimals] = useState(5)
  const [result, setResult] = useState<null | {
    trend: "up" | "down"
    levels: Array<{ label: string; price: number }>
    extensions: Array<{ label: string; price: number }>
  }>(null)

  const calculate = () => {
    const h = clampNumber(swingHigh, 0.0000001, 100000000)
    const l = clampNumber(swingLow, 0.0000001, 100000000)
    const d = Math.round(clampNumber(decimals, 0, 8))

    if (h === l) {
      setResult(null)
      return
    }

    const trend = h > l ? "up" : "down"
    const high = Math.max(h, l)
    const low = Math.min(h, l)
    const range = high - low

    const retracements = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
    const extensions = [1.272, 1.618]

    const levels = retracements.map((f) => {
      const price = trend === "up" ? high - range * f : low + range * f
      return { label: `${(f * 100).toFixed(1)}%`, price: roundTo(price, d) }
    })

    const ext = extensions.map((f) => {
      const price = trend === "up" ? high + range * (f - 1) : low - range * (f - 1)
      return { label: `${f.toFixed(3)}x`, price: roundTo(price, d) }
    })

    setResult({ trend, levels, extensions: ext })
  }

  return (
    <FinancialCalculatorTemplate
      title="Fibonacci Retracement"
      description="Calculate Fibonacci retracement levels and common extensions from a swing high/low."
      icon={TrendingUp}
      calculate={calculate}
      values={[swingHigh, swingLow, decimals]}
      onClear={() => {
        setSwingHigh(1.12)
        setSwingLow(1.09)
        setDecimals(5)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSwingHigh(Number(vals?.[0] ?? 1.12))
        setSwingLow(Number(vals?.[1] ?? 1.09))
        setDecimals(Number(vals?.[2] ?? 5))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Swing High" value={swingHigh} onChange={setSwingHigh} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Swing Low" value={swingLow} onChange={setSwingLow} min={0.0000001} max={100000000} step={0.0001} />
          </div>
          <InputGroup label="Decimals" value={decimals} onChange={setDecimals} min={0} max={8} step={1} />
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Enter the two swing points; calculator auto-detects trend and computes levels.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <div className="bg-secondary/50 p-4 rounded-xl">
              <div className="text-sm font-medium mb-3">Retracement Levels (trend: {result.trend})</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.levels.map((l) => (
                  <ResultCard key={l.label} label={l.label} value={String(l.price)} type={l.label === "61.8%" ? "highlight" : "default"} />
                ))}
              </div>
            </div>

            <div className="bg-secondary/50 p-4 rounded-xl">
              <div className="text-sm font-medium mb-3">Extensions</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.extensions.map((l) => (
                  <ResultCard key={l.label} label={l.label} value={String(l.price)} type="success" />
                ))}
              </div>
            </div>
          </div>
        )
      }
    />
  )
}

export function ForexProfitCalculator() {
  const [pair, setPair] = useState("EURUSD")
  const [direction, setDirection] = useState<"buy" | "sell">("buy")
  const [units, setUnits] = useState(100000)
  const [entry, setEntry] = useState(1.1)
  const [exit, setExit] = useState(1.105)
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [quoteToAccountRate, setQuoteToAccountRate] = useState(83.12)
  const [pipSize, setPipSize] = useState(getDefaultPipSize("EURUSD"))

  const [result, setResult] = useState<null | {
    pips: number
    pnlAccount: number | null
    pnlQuote: number
    pipValueAccount: number | null
  }>(null)

  const calculate = () => {
    const u = clampNumber(units, 1, 100000000)
    const e = clampNumber(entry, 0.0000001, 100000000)
    const x = clampNumber(exit, 0.0000001, 100000000)
    const ps = clampNumber(pipSize, 0.00000001, 1000)

    const { base, quote } = parsePair(pair)
    const pips = ((x - e) / ps) * (direction === "buy" ? 1 : -1)
    const pnlQuote = (x - e) * u * (direction === "buy" ? 1 : -1)

    const pipValueAccount = computePipValueInAccountCurrency({
      units: u,
      pipSize: ps,
      price: e,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    let pnlAccount: number | null
    if ((accountCurrency || "").trim().toUpperCase() === quote) pnlAccount = pnlQuote
    else if ((accountCurrency || "").trim().toUpperCase() === base) pnlAccount = pnlQuote / e
    else pnlAccount = quoteToAccountRate > 0 ? pnlQuote * quoteToAccountRate : null

    setResult({ pips, pnlAccount, pnlQuote, pipValueAccount })
  }

  const handlePairChange = (next: string) => {
    setPair(next)
    setPipSize(getDefaultPipSize(next))
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Profit Calculator"
      description="Estimate profit/loss in pips and account currency for a forex trade."
      icon={TrendingUp}
      calculate={calculate}
      values={[pair, direction, units, entry, exit, accountCurrency, quoteToAccountRate, pipSize]}
      onClear={() => {
        setPair("EURUSD")
        setDirection("buy")
        setUnits(100000)
        setEntry(1.1)
        setExit(1.105)
        setAccountCurrency("USD")
        setQuoteToAccountRate(83.12)
        setPipSize(getDefaultPipSize("EURUSD"))
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        const nextPair = String(vals?.[0] ?? "EURUSD")
        setPair(nextPair)
        const side = String(vals?.[1] ?? "buy")
        setDirection(side === "sell" ? "sell" : "buy")
        setUnits(Number(vals?.[2] ?? 100000))
        setEntry(Number(vals?.[3] ?? 1.1))
        setExit(Number(vals?.[4] ?? 1.105))
        setAccountCurrency(String(vals?.[5] ?? "USD"))
        setQuoteToAccountRate(Number(vals?.[6] ?? 83.12))
        setPipSize(Number(vals?.[7] ?? getDefaultPipSize(nextPair)))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pair</label>
              <select
                value={pair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="EURUSD">🇪🇺 EUR/USD 🇺🇸</option>
                <option value="GBPUSD">🇬🇧 GBP/USD 🇺🇸</option>
                <option value="USDJPY">🇺🇸 USD/JPY 🇯🇵</option>
                <option value="USDINR">🇺🇸 USD/INR 🇮🇳</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Side</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <InputGroup label="Units" value={units} onChange={setUnits} min={1} max={100000000} step={1000} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Entry Price" value={entry} onChange={setEntry} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Exit Price" value={exit} onChange={setExit} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Pip Size" value={pipSize} onChange={setPipSize} min={0.00000001} max={1} step={0.00001} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Currency</label>
              <select
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="INR">🇮🇳 INR</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="JPY">🇯🇵 JPY</option>
              </select>
            </div>
            <InputGroup
              label="Quote → Account rate (only if needed)"
              value={quoteToAccountRate}
              onChange={setQuoteToAccountRate}
              min={0.0000001}
              max={100000000}
              step={0.0001}
            />
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Pips" value={result.pips.toFixed(2)} type={result.pips >= 0 ? "success" : "warning"} />
              <ResultCard
                label="P/L (Quote currency)"
                value={result.pnlQuote.toFixed(2)}
                type={result.pnlQuote >= 0 ? "success" : "warning"}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard
                label="P/L (Account currency)"
                value={result.pnlAccount === null ? "—" : result.pnlAccount.toFixed(2)}
                type={result.pnlAccount !== null && result.pnlAccount >= 0 ? "success" : "warning"}
              />
              <ResultCard
                label="Pip Value (account / pip)"
                value={result.pipValueAccount === null ? "—" : result.pipValueAccount.toFixed(4)}
                type="default"
              />
            </div>
          </div>
        )
      }
    />
  )
}

export function ForexSwapCalculator() {
  const [direction, setDirection] = useState<"long" | "short">("long")
  const [units, setUnits] = useState(100000)
  const [swapPerDay, setSwapPerDay] = useState(-3.5)
  const [daysHeld, setDaysHeld] = useState(7)
  const [tripleSwapDayCount, setTripleSwapDayCount] = useState(1)
  const [swapCurrency, setSwapCurrency] = useState("USD")
  const [toAccountRate, setToAccountRate] = useState(1)

  const [result, setResult] = useState<null | {
    dailySwap: number
    totalSwap: number
    totalSwapAccount: number
  }>(null)

  const calculate = () => {
    const u = clampNumber(units, 1, 100000000)
    const spd = swapPerDay
    const d = Math.round(clampNumber(daysHeld, 1, 3650))
    const t = Math.round(clampNumber(tripleSwapDayCount, 0, 10))
    const rate = clampNumber(toAccountRate, 0.0000001, 100000000)

    // This is a generalized model: swapPerDay is per 1 standard lot? We'll interpret as per 1 standard lot (100,000 units).
    const lots = u / 100000
    const dailySwap = spd * lots * (direction === "long" ? 1 : 1)

    const totalSwap = dailySwap * d + dailySwap * 2 * t
    const totalSwapAccount = totalSwap * rate

    setResult({ dailySwap, totalSwap, totalSwapAccount })
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Swap Calculator"
      description="Estimate overnight swap/rollover cost or credit over a holding period (supports triple-swap days)."
      icon={Activity}
      calculate={calculate}
      values={[direction, units, swapPerDay, daysHeld, tripleSwapDayCount, swapCurrency, toAccountRate]}
      onClear={() => {
        setDirection("long")
        setUnits(100000)
        setSwapPerDay(-3.5)
        setDaysHeld(7)
        setTripleSwapDayCount(1)
        setSwapCurrency("USD")
        setToAccountRate(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        const d = String(vals?.[0] ?? "long")
        setDirection(d === "short" ? "short" : "long")
        setUnits(Number(vals?.[1] ?? 100000))
        setSwapPerDay(Number(vals?.[2] ?? -3.5))
        setDaysHeld(Number(vals?.[3] ?? 7))
        setTripleSwapDayCount(Number(vals?.[4] ?? 1))
        setSwapCurrency(String(vals?.[5] ?? "USD"))
        setToAccountRate(Number(vals?.[6] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
            <InputGroup label="Units" value={units} onChange={setUnits} min={1} max={100000000} step={1000} />
            <InputGroup
              label="Swap per day (per 1 standard lot)"
              value={swapPerDay}
              onChange={setSwapPerDay}
              min={-1000}
              max={1000}
              step={0.1}
              suffix={` ${swapCurrency}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Days held" value={daysHeld} onChange={setDaysHeld} min={1} max={3650} step={1} />
            <InputGroup
              label="# of triple-swap days"
              value={tripleSwapDayCount}
              onChange={setTripleSwapDayCount}
              min={0}
              max={10}
              step={1}
            />
            <InputGroup
              label={`${swapCurrency} → Account rate`}
              value={toAccountRate}
              onChange={setToAccountRate}
              min={0.0000001}
              max={100000000}
              step={0.0001}
            />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Enter swap as your broker quotes it (often per standard lot per day). Triple-swap days vary by broker/instrument.
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Daily Swap"
              value={`${result.dailySwap.toFixed(2)} ${swapCurrency}`}
              type={result.dailySwap >= 0 ? "success" : "warning"}
            />
            <ResultCard
              label="Total Swap"
              value={`${result.totalSwap.toFixed(2)} ${swapCurrency}`}
              type={result.totalSwap >= 0 ? "success" : "warning"}
            />
            <ResultCard
              label="Total (Account)"
              value={result.totalSwapAccount.toFixed(2)}
              type={result.totalSwapAccount >= 0 ? "success" : "warning"}
            />
          </div>
        )
      }
    />
  )
}

export function ForexPositionSizerAdvanced() {
  const [pair, setPair] = useState("EURUSD")
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [price, setPrice] = useState(1.1)
  const [pipSize, setPipSize] = useState(getDefaultPipSize("EURUSD"))
  const [quoteToAccountRate, setQuoteToAccountRate] = useState(83.12)
  const [accountBalance, setAccountBalance] = useState(10000)
  const [stopLossPips, setStopLossPips] = useState(20)
  const [riskA, setRiskA] = useState(0.5)
  const [riskB, setRiskB] = useState(1)
  const [riskC, setRiskC] = useState(2)

  const [result, setResult] = useState<null | {
    perUnitPipValue: number
    rows: Array<{ riskPercent: number; riskAmount: number; units: number; lots: number }>
  }>(null)

  const calculate = () => {
    const bal = clampNumber(accountBalance, 0, 1000000000)
    const sl = clampNumber(stopLossPips, 1, 1000000)
    const safePrice = clampNumber(price, 0.0000001, 100000000)
    const ps = clampNumber(pipSize, 0.00000001, 1000)

    const perUnitPipValue = computePipValueInAccountCurrency({
      units: 1,
      pipSize: ps,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })

    if (perUnitPipValue === null) {
      setResult(null)
      return
    }

    const riskPercents = [riskA, riskB, riskC].map((x) => clampNumber(x, 0.01, 100))
    const rows = riskPercents.map((rp) => {
      const riskAmount = bal * (rp / 100)
      const units = riskAmount / (sl * perUnitPipValue)
      return { riskPercent: rp, riskAmount, units, lots: units / 100000 }
    })

    setResult({ perUnitPipValue, rows })
  }

  const handlePairChange = (next: string) => {
    setPair(next)
    setPipSize(getDefaultPipSize(next))
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Position Sizer"
      description="Advanced position sizing: compute lot size for multiple risk presets given stop-loss in pips."
      icon={Calculator}
      calculate={calculate}
      values={[pair, accountCurrency, price, pipSize, quoteToAccountRate, accountBalance, stopLossPips, riskA, riskB, riskC]}
      onClear={() => {
        setPair("EURUSD")
        setAccountCurrency("USD")
        setPrice(1.1)
        setPipSize(getDefaultPipSize("EURUSD"))
        setQuoteToAccountRate(83.12)
        setAccountBalance(10000)
        setStopLossPips(20)
        setRiskA(0.5)
        setRiskB(1)
        setRiskC(2)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        const nextPair = String(vals?.[0] ?? "EURUSD")
        setPair(nextPair)
        setAccountCurrency(String(vals?.[1] ?? "USD"))
        setPrice(Number(vals?.[2] ?? 1.1))
        setPipSize(Number(vals?.[3] ?? getDefaultPipSize(nextPair)))
        setQuoteToAccountRate(Number(vals?.[4] ?? 83.12))
        setAccountBalance(Number(vals?.[5] ?? 10000))
        setStopLossPips(Number(vals?.[6] ?? 20))
        setRiskA(Number(vals?.[7] ?? 0.5))
        setRiskB(Number(vals?.[8] ?? 1))
        setRiskC(Number(vals?.[9] ?? 2))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pair</label>
              <select
                value={pair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="EURUSD">🇪🇺 EUR/USD 🇺🇸</option>
                <option value="GBPUSD">🇬🇧 GBP/USD 🇺🇸</option>
                <option value="USDJPY">🇺🇸 USD/JPY 🇯🇵</option>
                <option value="USDINR">🇺🇸 USD/INR 🇮🇳</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Currency</label>
              <select
                value={accountCurrency}
                onChange={(e) => setAccountCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="INR">🇮🇳 INR</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="JPY">🇯🇵 JPY</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Price" value={price} onChange={setPrice} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Pip Size" value={pipSize} onChange={setPipSize} min={0.00000001} max={1} step={0.00001} />
            <InputGroup
              label="Quote → Account rate (only if needed)"
              value={quoteToAccountRate}
              onChange={setQuoteToAccountRate}
              min={0.0000001}
              max={100000000}
              step={0.0001}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Account Balance" value={accountBalance} onChange={setAccountBalance} min={0} max={1000000000} step={100} prefix="$ " />
            <InputGroup label="Stop Loss (pips)" value={stopLossPips} onChange={setStopLossPips} min={1} max={1000000} step={1} suffix=" pips" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Risk A" value={riskA} onChange={setRiskA} min={0.01} max={100} step={0.1} suffix="%" />
            <InputGroup label="Risk B" value={riskB} onChange={setRiskB} min={0.01} max={100} step={0.1} suffix="%" />
            <InputGroup label="Risk C" value={riskC} onChange={setRiskC} min={0.01} max={100} step={0.1} suffix="%" />
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Pip value per 1 unit" value={result.perUnitPipValue.toFixed(8)} type="default" />
              <ResultCard label="Stop-loss" value={`${stopLossPips} pips`} type="warning" />
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl">
              <div className="text-sm font-medium mb-3">Recommended sizes</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-4">Risk %</th>
                      <th className="py-2 pr-4">Risk $</th>
                      <th className="py-2 pr-4">Units</th>
                      <th className="py-2 pr-0">Lots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r) => (
                      <tr key={r.riskPercent} className="border-t border-border/60">
                        <td className="py-2 pr-4">{r.riskPercent.toFixed(2)}%</td>
                        <td className="py-2 pr-4">${r.riskAmount.toFixed(2)}</td>
                        <td className="py-2 pr-4">{Math.round(r.units).toLocaleString()}</td>
                        <td className="py-2 pr-0">{r.lots.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }
    />
  )
}

export function CryptoMarketCapCalculator() {
  const [price, setPrice] = useState(100)
  const [circulatingSupply, setCirculatingSupply] = useState(1000000)
  const [totalSupply, setTotalSupply] = useState(1000000)
  const [currency, setCurrency] = useState("USD")
  const [result, setResult] = useState<null | {
    marketCap: number
    fdv: number
  }>(null)

  const calculate = () => {
    const p = clampNumber(price, 0, 1e12)
    const circ = clampNumber(circulatingSupply, 0, 1e18)
    const total = clampNumber(totalSupply, 0, 1e18)
    const marketCap = p * circ
    const fdv = p * total
    setResult({ marketCap, fdv })
  }

  return (
    <FinancialCalculatorTemplate
      title="Crypto Market Cap"
      description="Calculate market capitalization and fully diluted valuation (FDV) from token price and supply."
      icon={TrendingUp}
      calculate={calculate}
      values={[price, circulatingSupply, totalSupply, currency]}
      onClear={() => {
        setPrice(100)
        setCirculatingSupply(1000000)
        setTotalSupply(1000000)
        setCurrency("USD")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrice(Number(vals?.[0] ?? 100))
        setCirculatingSupply(Number(vals?.[1] ?? 1000000))
        setTotalSupply(Number(vals?.[2] ?? 1000000))
        const c = String(vals?.[3] ?? "USD")
        setCurrency(c === "INR" || c === "EUR" ? c : "USD")
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Token Price" value={price} onChange={setPrice} min={0} max={1e12} step={0.01} prefix={`${currency} `} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="INR">🇮🇳 INR</option>
                <option value="EUR">🇪🇺 EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Circulating Supply" value={circulatingSupply} onChange={setCirculatingSupply} min={0} max={1e18} step={1000} />
            <InputGroup label="Total Supply" value={totalSupply} onChange={setTotalSupply} min={0} max={1e18} step={1000} />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Market Cap = Price × Circulating Supply. FDV = Price × Total Supply.
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Market Cap" value={`${currency} ${Math.round(result.marketCap).toLocaleString()}`} type="highlight" />
            <ResultCard label="FDV" value={`${currency} ${Math.round(result.fdv).toLocaleString()}`} type="default" />
          </div>
        )
      }
    />
  )
}

export function CryptoStakingCalculator() {
  const [principal, setPrincipal] = useState(1000)
  const [apr, setApr] = useState(12)
  const [durationDays, setDurationDays] = useState(365)
  const [compounding, setCompounding] = useState<"daily" | "weekly" | "monthly" | "none">("daily")
  const [extraContribution, setExtraContribution] = useState(0)
  const [contribFrequency, setContribFrequency] = useState<"weekly" | "monthly">("monthly")
  const [result, setResult] = useState<null | {
    final: number
    rewards: number
    apy: number
  }>(null)

  const calculate = () => {
    const p0 = clampNumber(principal, 0, 1e12)
    const r = clampNumber(apr, -99.99, 1000) / 100
    const days = Math.round(clampNumber(durationDays, 1, 36500))
    const contrib = clampNumber(extraContribution, 0, 1e12)

    const periodsPerYear = compounding === "daily" ? 365 : compounding === "weekly" ? 52 : compounding === "monthly" ? 12 : 0
    const contribPeriod = contribFrequency === "weekly" ? 7 : 30

    let balance = p0
    let contributed = 0

    for (let day = 1; day <= days; day++) {
      // periodic contribution
      if (contrib > 0 && day % contribPeriod === 0) {
        balance += contrib
        contributed += contrib
      }

      // compounding step
      if (periodsPerYear > 0) {
        const stepDays = compounding === "daily" ? 1 : compounding === "weekly" ? 7 : 30
        if (day % stepDays === 0) {
          const stepRate = r / periodsPerYear
          balance *= 1 + stepRate
        }
      }
    }

    const invested = p0 + contributed
    const rewards = balance - invested
    const years = days / 365
    const apy = years > 0 && invested > 0 ? (Math.pow(balance / invested, 1 / years) - 1) * 100 : 0

    setResult({ final: balance, rewards, apy })
  }

  return (
    <FinancialCalculatorTemplate
      title="Crypto Staking Rewards"
      description="Estimate staking rewards with optional compounding and periodic contributions."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, apr, durationDays, compounding, extraContribution, contribFrequency]}
      onClear={() => {
        setPrincipal(1000)
        setApr(12)
        setDurationDays(365)
        setCompounding("daily")
        setExtraContribution(0)
        setContribFrequency("monthly")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals?.[0] ?? 1000))
        setApr(Number(vals?.[1] ?? 12))
        setDurationDays(Number(vals?.[2] ?? 365))
        const comp = String(vals?.[3] ?? "daily")
        setCompounding((comp === "weekly" || comp === "monthly" || comp === "none" ? comp : "daily") as any)
        setExtraContribution(Number(vals?.[4] ?? 0))
        const cf = String(vals?.[5] ?? "monthly")
        setContribFrequency((cf === "weekly" ? "weekly" : "monthly") as any)
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Principal" value={principal} onChange={setPrincipal} min={0} max={1e12} step={10} prefix="$ " />
            <InputGroup label="APR" value={apr} onChange={setApr} min={-99.99} max={1000} step={0.1} suffix="%" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Duration (days)" value={durationDays} onChange={setDurationDays} min={1} max={36500} step={1} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Compounding</label>
              <select
                value={compounding}
                onChange={(e) => setCompounding(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Extra Contribution" value={extraContribution} onChange={setExtraContribution} min={0} max={1e12} step={10} prefix="$ " />
            <div className="space-y-2">
              <label className="text-sm font-medium">Contribution Frequency</label>
              <select
                value={contribFrequency}
                onChange={(e) => setContribFrequency(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Final Balance" value={`$${result.final.toFixed(2)}`} type="highlight" />
            <ResultCard label="Total Rewards" value={`$${result.rewards.toFixed(2)}`} type={result.rewards >= 0 ? "success" : "warning"} />
            <ResultCard label="Effective APY" value={`${result.apy.toFixed(2)}%`} type="default" />
          </div>
        )
      }
    />
  )
}

export function CryptoMiningProfitability() {
  const [dailyCoins, setDailyCoins] = useState(0.0005)
  const [coinPrice, setCoinPrice] = useState(100000)
  const [poolFee, setPoolFee] = useState(1)
  const [powerWatts, setPowerWatts] = useState(1200)
  const [electricityCost, setElectricityCost] = useState(0.12)
  const [hardwareCost, setHardwareCost] = useState(2000)
  const [result, setResult] = useState<null | {
    dailyRevenue: number
    dailyFee: number
    dailyElectricity: number
    dailyProfit: number
    monthlyProfit: number
    breakevenDays: number | null
  }>(null)

  const calculate = () => {
    const coins = clampNumber(dailyCoins, 0, 1e9)
    const price = clampNumber(coinPrice, 0, 1e12)
    const feePct = clampNumber(poolFee, 0, 100) / 100
    const watts = clampNumber(powerWatts, 0, 1e7)
    const kwhCost = clampNumber(electricityCost, 0, 1000)
    const hw = clampNumber(hardwareCost, 0, 1e12)

    const dailyRevenue = coins * price
    const dailyFee = dailyRevenue * feePct
    const dailyElectricity = (watts / 1000) * 24 * kwhCost
    const dailyProfit = dailyRevenue - dailyFee - dailyElectricity
    const monthlyProfit = dailyProfit * 30
    const breakevenDays = dailyProfit > 0 && hw > 0 ? hw / dailyProfit : null

    setResult({ dailyRevenue, dailyFee, dailyElectricity, dailyProfit, monthlyProfit, breakevenDays })
  }

  return (
    <FinancialCalculatorTemplate
      title="Mining Profitability"
      description="Estimate mining profitability using your expected daily coin output, fees, and electricity costs."
      icon={Activity}
      calculate={calculate}
      values={[dailyCoins, coinPrice, poolFee, powerWatts, electricityCost, hardwareCost]}
      onClear={() => {
        setDailyCoins(0.0005)
        setCoinPrice(100000)
        setPoolFee(1)
        setPowerWatts(1200)
        setElectricityCost(0.12)
        setHardwareCost(2000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setDailyCoins(Number(vals?.[0] ?? 0.0005))
        setCoinPrice(Number(vals?.[1] ?? 100000))
        setPoolFee(Number(vals?.[2] ?? 1))
        setPowerWatts(Number(vals?.[3] ?? 1200))
        setElectricityCost(Number(vals?.[4] ?? 0.12))
        setHardwareCost(Number(vals?.[5] ?? 2000))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Daily Coins Earned" value={dailyCoins} onChange={setDailyCoins} min={0} max={1e9} step={0.0001} />
            <InputGroup label="Coin Price" value={coinPrice} onChange={setCoinPrice} min={0} max={1e12} step={10} prefix="$ " />
            <InputGroup label="Pool Fee" value={poolFee} onChange={setPoolFee} min={0} max={100} step={0.1} suffix="%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Power Draw" value={powerWatts} onChange={setPowerWatts} min={0} max={1e7} step={10} suffix=" W" />
            <InputGroup label="Electricity Cost" value={electricityCost} onChange={setElectricityCost} min={0} max={1000} step={0.01} suffix=" $/kWh" />
            <InputGroup label="Hardware Cost" value={hardwareCost} onChange={setHardwareCost} min={0} max={1e12} step={50} prefix="$ " />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            This model uses your estimated daily coin production (you can get this from a mining calculator / pool stats).
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Daily Revenue" value={`$${result.dailyRevenue.toFixed(2)}`} type="default" />
              <ResultCard label="Daily Electricity" value={`$${result.dailyElectricity.toFixed(2)}`} type="warning" />
              <ResultCard label="Daily Profit" value={`$${result.dailyProfit.toFixed(2)}`} type={result.dailyProfit >= 0 ? "success" : "warning"} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Daily Fees" value={`$${result.dailyFee.toFixed(2)}`} type="default" />
              <ResultCard label="Monthly Profit (30d)" value={`$${result.monthlyProfit.toFixed(2)}`} type={result.monthlyProfit >= 0 ? "success" : "warning"} />
              <ResultCard
                label="Breakeven (days)"
                value={result.breakevenDays === null ? "—" : `${Math.ceil(result.breakevenDays).toLocaleString()}`}
                type="highlight"
              />
            </div>
          </div>
        )
      }
    />
  )
}

export function DollarCostAveragingCrypto() {
  const [investmentPerPeriod, setInvestmentPerPeriod] = useState(100)
  const [periods, setPeriods] = useState(12)
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("monthly")
  const [startPrice, setStartPrice] = useState(100)
  const [endPrice, setEndPrice] = useState(150)
  const [result, setResult] = useState<null | {
    invested: number
    units: number
    avgCost: number
    valueNow: number
    profit: number
    roi: number
  }>(null)

  const calculate = () => {
    const amt = clampNumber(investmentPerPeriod, 0, 1e12)
    const n = Math.round(clampNumber(periods, 1, 10000))
    const p0 = clampNumber(startPrice, 0.0000001, 1e12)
    const p1 = clampNumber(endPrice, 0.0000001, 1e12)

    let units = 0
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 1 : i / (n - 1)
      const price = p0 + (p1 - p0) * t
      units += price > 0 ? amt / price : 0
    }

    const invested = amt * n
    const avgCost = units > 0 ? invested / units : 0
    const valueNow = units * p1
    const profit = valueNow - invested
    const roi = invested > 0 ? (profit / invested) * 100 : 0

    setResult({ invested, units, avgCost, valueNow, profit, roi })
  }

  return (
    <FinancialCalculatorTemplate
      title="Crypto DCA Calculator"
      description="Estimate results of a DCA plan. Uses a simple linear price path from start → end across periods."
      icon={TrendingUp}
      calculate={calculate}
      values={[investmentPerPeriod, periods, frequency, startPrice, endPrice]}
      onClear={() => {
        setInvestmentPerPeriod(100)
        setPeriods(12)
        setFrequency("monthly")
        setStartPrice(100)
        setEndPrice(150)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setInvestmentPerPeriod(Number(vals?.[0] ?? 100))
        setPeriods(Number(vals?.[1] ?? 12))
        const f = String(vals?.[2] ?? "monthly")
        setFrequency((f === "weekly" ? "weekly" : "monthly") as any)
        setStartPrice(Number(vals?.[3] ?? 100))
        setEndPrice(Number(vals?.[4] ?? 150))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Investment per period" value={investmentPerPeriod} onChange={setInvestmentPerPeriod} min={0} max={1e12} step={10} prefix="$ " />
            <InputGroup label="# of periods" value={periods} onChange={setPeriods} min={1} max={10000} step={1} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Start price" value={startPrice} onChange={setStartPrice} min={0.0000001} max={1e12} step={0.01} prefix="$ " />
            <InputGroup label="End price" value={endPrice} onChange={setEndPrice} min={0.0000001} max={1e12} step={0.01} prefix="$ " />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            This is an estimate. For real DCA, prices vary each period; this model assumes a smooth price path.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Total Invested" value={`$${result.invested.toFixed(2)}`} type="default" />
              <ResultCard label="Total Units" value={result.units.toFixed(6)} type="highlight" />
              <ResultCard label="Avg Cost" value={`$${result.avgCost.toFixed(4)}`} type="default" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Value (at end price)" value={`$${result.valueNow.toFixed(2)}`} type="highlight" />
              <ResultCard label="Profit/Loss" value={`$${result.profit.toFixed(2)}`} type={result.profit >= 0 ? "success" : "warning"} />
              <ResultCard label="ROI" value={`${result.roi.toFixed(2)}%`} type={result.roi >= 0 ? "success" : "warning"} />
            </div>
          </div>
        )
      }
    />
  )
}

export function ArbitrageCalculator() {
  const [buyPrice, setBuyPrice] = useState(100)
  const [sellPrice, setSellPrice] = useState(102)
  const [quantity, setQuantity] = useState(1)
  const [buyFeePct, setBuyFeePct] = useState(0.1)
  const [sellFeePct, setSellFeePct] = useState(0.1)
  const [withdrawFeeCoin, setWithdrawFeeCoin] = useState(0.001)
  const [fixedNetworkFee, setFixedNetworkFee] = useState(0)
  const [result, setResult] = useState<null | {
    gross: number
    fees: number
    net: number
    roi: number
    effectiveQty: number
  }>(null)

  const calculate = () => {
    const bp = clampNumber(buyPrice, 0, 1e12)
    const sp = clampNumber(sellPrice, 0, 1e12)
    const q = clampNumber(quantity, 0, 1e12)
    const bf = clampNumber(buyFeePct, 0, 100) / 100
    const sf = clampNumber(sellFeePct, 0, 100) / 100
    const w = clampNumber(withdrawFeeCoin, 0, 1e9)
    const netFee = clampNumber(fixedNetworkFee, 0, 1e12)

    const buyCost = bp * q
    const buyFee = buyCost * bf
    const effectiveQty = Math.max(0, q - w)
    const sellGross = sp * effectiveQty
    const sellFee = sellGross * sf
    const gross = sellGross - buyCost
    const fees = buyFee + sellFee + netFee
    const net = gross - fees
    const roi = buyCost > 0 ? (net / buyCost) * 100 : 0

    setResult({ gross, fees, net, roi, effectiveQty })
  }

  return (
    <FinancialCalculatorTemplate
      title="Arbitrage Calculator"
      description="Estimate net arbitrage profit after buy/sell fees and withdrawal/network costs."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[buyPrice, sellPrice, quantity, buyFeePct, sellFeePct, withdrawFeeCoin, fixedNetworkFee]}
      onClear={() => {
        setBuyPrice(100)
        setSellPrice(102)
        setQuantity(1)
        setBuyFeePct(0.1)
        setSellFeePct(0.1)
        setWithdrawFeeCoin(0.001)
        setFixedNetworkFee(0)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setBuyPrice(Number(vals?.[0] ?? 100))
        setSellPrice(Number(vals?.[1] ?? 102))
        setQuantity(Number(vals?.[2] ?? 1))
        setBuyFeePct(Number(vals?.[3] ?? 0.1))
        setSellFeePct(Number(vals?.[4] ?? 0.1))
        setWithdrawFeeCoin(Number(vals?.[5] ?? 0.001))
        setFixedNetworkFee(Number(vals?.[6] ?? 0))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Buy Price" value={buyPrice} onChange={setBuyPrice} min={0} max={1e12} step={0.01} prefix="$ " />
            <InputGroup label="Sell Price" value={sellPrice} onChange={setSellPrice} min={0} max={1e12} step={0.01} prefix="$ " />
            <InputGroup label="Quantity (coin)" value={quantity} onChange={setQuantity} min={0} max={1e12} step={0.01} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="Buy fee" value={buyFeePct} onChange={setBuyFeePct} min={0} max={100} step={0.01} suffix="%" />
            <InputGroup label="Sell fee" value={sellFeePct} onChange={setSellFeePct} min={0} max={100} step={0.01} suffix="%" />
            <InputGroup label="Withdrawal fee" value={withdrawFeeCoin} onChange={setWithdrawFeeCoin} min={0} max={1e9} step={0.0001} suffix=" coin" />
            <InputGroup label="Fixed network cost" value={fixedNetworkFee} onChange={setFixedNetworkFee} min={0} max={1e12} step={0.01} prefix="$ " />
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Effective Qty Sold" value={result.effectiveQty.toFixed(6)} type="default" />
              <ResultCard label="Net ROI" value={`${result.roi.toFixed(2)}%`} type={result.roi >= 0 ? "success" : "warning"} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Gross P/L" value={`$${result.gross.toFixed(2)}`} type={result.gross >= 0 ? "success" : "warning"} />
              <ResultCard label="Total Fees" value={`$${result.fees.toFixed(2)}`} type="warning" />
              <ResultCard label="Net Profit" value={`$${result.net.toFixed(2)}`} type={result.net >= 0 ? "success" : "warning"} />
            </div>
          </div>
        )
      }
    />
  )
}

export function InflationAdjustedExchangeRate() {
  const [nominalChangePercent, setNominalChangePercent] = useState(2)
  const [domesticInflation, setDomesticInflation] = useState(6)
  const [foreignInflation, setForeignInflation] = useState(2)
  const [result, setResult] = useState<null | {
    realChangePercent: number
    approxRealChangePercent: number
    note: string
  }>(null)

  const calculate = () => {
    const n = clampNumber(nominalChangePercent, -99.99, 1000) / 100
    const piD = clampNumber(domesticInflation, -99.99, 1000) / 100
    const piF = clampNumber(foreignInflation, -99.99, 1000) / 100

    // Real change in FX (domestic per foreign) adjusted for inflation differential.
    // Using exact Fisher style adjustment: (1+n) * (1+piF)/(1+piD) - 1
    const exact = (1 + n) * (1 + piF) / (1 + piD) - 1
    const approx = n + piF - piD

    setResult({
      realChangePercent: exact * 100,
      approxRealChangePercent: approx * 100,
      note: "Exact uses (1+nominal)×(1+foreignInflation)/(1+domesticInflation) − 1. Approx uses nominal + foreign − domestic.",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Inflation Adjusted Rate"
      description="Convert nominal FX change into real (inflation-adjusted) change using inflation differential."
      icon={Activity}
      calculate={calculate}
      values={[nominalChangePercent, domesticInflation, foreignInflation]}
      onClear={() => {
        setNominalChangePercent(2)
        setDomesticInflation(6)
        setForeignInflation(2)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setNominalChangePercent(Number(vals?.[0] ?? 2))
        setDomesticInflation(Number(vals?.[1] ?? 6))
        setForeignInflation(Number(vals?.[2] ?? 2))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Nominal FX change" value={nominalChangePercent} onChange={setNominalChangePercent} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Domestic inflation" value={domesticInflation} onChange={setDomesticInflation} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Foreign inflation" value={foreignInflation} onChange={setForeignInflation} min={-99.99} max={1000} step={0.1} suffix="%" />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Assumes FX quote is “domestic currency per 1 unit of foreign currency”.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Real change (exact)" value={`${result.realChangePercent.toFixed(2)}%`} type="highlight" />
              <ResultCard label="Real change (approx)" value={`${result.approxRealChangePercent.toFixed(2)}%`} type="default" />
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function PurchasingPowerParity() {
  const [domesticBasketPrice, setDomesticBasketPrice] = useState(100)
  const [foreignBasketPrice, setForeignBasketPrice] = useState(1.25)
  const [marketRate, setMarketRate] = useState(83)
  const [result, setResult] = useState<null | {
    pppRate: number
    overUnderPercent: number
  }>(null)

  const calculate = () => {
    const d = clampNumber(domesticBasketPrice, 0.0000001, 1e12)
    const f = clampNumber(foreignBasketPrice, 0.0000001, 1e12)
    const m = clampNumber(marketRate, 0.0000001, 1e12)

    // PPP rate (domestic per 1 foreign) ≈ domestic price level / foreign price level
    const pppRate = d / f
    const overUnderPercent = ((m - pppRate) / pppRate) * 100
    setResult({ pppRate, overUnderPercent })
  }

  return (
    <FinancialCalculatorTemplate
      title="Purchasing Power Parity"
      description="Compute PPP exchange rate and estimate over/undervaluation vs market rate."
      icon={TrendingUp}
      calculate={calculate}
      values={[domesticBasketPrice, foreignBasketPrice, marketRate]}
      onClear={() => {
        setDomesticBasketPrice(100)
        setForeignBasketPrice(1.25)
        setMarketRate(83)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setDomesticBasketPrice(Number(vals?.[0] ?? 100))
        setForeignBasketPrice(Number(vals?.[1] ?? 1.25))
        setMarketRate(Number(vals?.[2] ?? 83))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Domestic basket price" value={domesticBasketPrice} onChange={setDomesticBasketPrice} min={0.0000001} max={1e12} step={1} />
            <InputGroup label="Foreign basket price" value={foreignBasketPrice} onChange={setForeignBasketPrice} min={0.0000001} max={1e12} step={0.01} />
            <InputGroup label="Market FX rate" value={marketRate} onChange={setMarketRate} min={0.0000001} max={1e12} step={0.01} />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            PPP rate is returned as “domestic currency per 1 unit foreign currency”.
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Implied PPP rate" value={result.pppRate.toFixed(4)} type="highlight" />
            <ResultCard
              label="Over/Undervaluation"
              value={`${result.overUnderPercent.toFixed(2)}%`}
              type={result.overUnderPercent >= 0 ? "warning" : "success"}
            />
          </div>
        )
      }
    />
  )
}

export function RealEffectiveExchangeRate() {
  const [neerIndex, setNeerIndex] = useState(100)
  const [domesticCpiIndex, setDomesticCpiIndex] = useState(100)
  const [foreignCpiIndex, setForeignCpiIndex] = useState(100)
  const [base, setBase] = useState(100)
  const [result, setResult] = useState<null | {
    reerIndex: number
    interpretation: string
  }>(null)

  const calculate = () => {
    const neer = clampNumber(neerIndex, 0.0000001, 1e12)
    const cpiD = clampNumber(domesticCpiIndex, 0.0000001, 1e12)
    const cpiF = clampNumber(foreignCpiIndex, 0.0000001, 1e12)
    const b = clampNumber(base, 0.0000001, 1e12)

    // Simple REER: REER = NEER * (Foreign CPI / Domestic CPI), rebased.
    const reer = (neer * (cpiF / cpiD))
    const reerIndexOut = (reer / b) * 100

    const interpretation = reerIndexOut > 100
      ? "REER above 100 can indicate a stronger real exchange rate (potentially less competitive exports), depending on definitions."
      : "REER below 100 can indicate a weaker real exchange rate (potentially more competitive exports), depending on definitions."

    setResult({ reerIndex: reerIndexOut, interpretation })
  }

  return (
    <FinancialCalculatorTemplate
      title="Real Effective Exchange Rate"
      description="Calculate a simplified REER index from NEER and CPI indices."
      icon={Activity}
      calculate={calculate}
      values={[neerIndex, domesticCpiIndex, foreignCpiIndex, base]}
      onClear={() => {
        setNeerIndex(100)
        setDomesticCpiIndex(100)
        setForeignCpiIndex(100)
        setBase(100)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setNeerIndex(Number(vals?.[0] ?? 100))
        setDomesticCpiIndex(Number(vals?.[1] ?? 100))
        setForeignCpiIndex(Number(vals?.[2] ?? 100))
        setBase(Number(vals?.[3] ?? 100))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="NEER index" value={neerIndex} onChange={setNeerIndex} min={0.0000001} max={1e12} step={0.1} />
            <InputGroup label="Domestic CPI index" value={domesticCpiIndex} onChange={setDomesticCpiIndex} min={0.0000001} max={1e12} step={0.1} />
            <InputGroup label="Foreign CPI index" value={foreignCpiIndex} onChange={setForeignCpiIndex} min={0.0000001} max={1e12} step={0.1} />
            <InputGroup label="Base (rebase to 100)" value={base} onChange={setBase} min={0.0000001} max={1e12} step={0.1} />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Formula used: REER = NEER × (Foreign CPI / Domestic CPI). Output is rebased so “Base” becomes 100.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <ResultCard label="REER Index" value={result.reerIndex.toFixed(2)} type="highlight" />
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.interpretation}</div>
          </div>
        )
      }
    />
  )
}

export function CurrencyDevaluationCalculator() {
  const [oldRate, setOldRate] = useState(83)
  const [newRate, setNewRate] = useState(86)
  const [result, setResult] = useState<null | {
    percentChange: number
    direction: "devaluation" | "revaluation"
  }>(null)

  const calculate = () => {
    const o = clampNumber(oldRate, 0.0000001, 1e12)
    const n = clampNumber(newRate, 0.0000001, 1e12)
    const pct = ((n - o) / o) * 100
    setResult({ percentChange: pct, direction: pct >= 0 ? "devaluation" : "revaluation" })
  }

  return (
    <FinancialCalculatorTemplate
      title="Currency Devaluation"
      description="Compute devaluation/revaluation percentage from old and new FX rates."
      icon={TrendingUp}
      calculate={calculate}
      values={[oldRate, newRate]}
      onClear={() => {
        setOldRate(83)
        setNewRate(86)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setOldRate(Number(vals?.[0] ?? 83))
        setNewRate(Number(vals?.[1] ?? 86))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Old rate" value={oldRate} onChange={setOldRate} min={0.0000001} max={1e12} step={0.01} />
            <InputGroup label="New rate" value={newRate} onChange={setNewRate} min={0.0000001} max={1e12} step={0.01} />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Assumes quote is “domestic currency per 1 unit foreign currency”. Higher rate = domestic currency weaker.
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Change" value={`${result.percentChange.toFixed(2)}%`} type={result.percentChange >= 0 ? "warning" : "success"} />
            <ResultCard label="Interpretation" value={result.direction} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function TravelBudgetCalculator() {
  const [days, setDays] = useState(7)
  const [dailySpend, setDailySpend] = useState(50)
  const [flightCost, setFlightCost] = useState(0)
  const [accommodationPerNight, setAccommodationPerNight] = useState(60)
  const [localTransport, setLocalTransport] = useState(100)
  const [visaInsurance, setVisaInsurance] = useState(0)
  const [bufferPercent, setBufferPercent] = useState(10)
  const [fxRate, setFxRate] = useState(83)
  const [result, setResult] = useState<null | {
    subtotalForeign: number
    bufferForeign: number
    totalForeign: number
    totalDomestic: number
  }>(null)

  const calculate = () => {
    const d = Math.round(clampNumber(days, 1, 365))
    const perDay = clampNumber(dailySpend, 0, 1e9)
    const flight = clampNumber(flightCost, 0, 1e12)
    const room = clampNumber(accommodationPerNight, 0, 1e9)
    const transport = clampNumber(localTransport, 0, 1e12)
    const visa = clampNumber(visaInsurance, 0, 1e12)
    const buffer = clampNumber(bufferPercent, 0, 200) / 100
    const rate = clampNumber(fxRate, 0.0000001, 1e12)

    const living = d * perDay
    const stay = d * room
    const subtotalForeign = living + stay + transport + visa + flight
    const bufferForeign = subtotalForeign * buffer
    const totalForeign = subtotalForeign + bufferForeign
    const totalDomestic = totalForeign * rate

    setResult({ subtotalForeign, bufferForeign, totalForeign, totalDomestic })
  }

  return (
    <FinancialCalculatorTemplate
      title="Travel Budget Calculator"
      description="Plan trip costs and convert totals using an exchange rate."
      icon={Calculator}
      calculate={calculate}
      values={[days, dailySpend, flightCost, accommodationPerNight, localTransport, visaInsurance, bufferPercent, fxRate]}
      onClear={() => {
        setDays(7)
        setDailySpend(50)
        setFlightCost(0)
        setAccommodationPerNight(60)
        setLocalTransport(100)
        setVisaInsurance(0)
        setBufferPercent(10)
        setFxRate(83)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setDays(Number(vals?.[0] ?? 7))
        setDailySpend(Number(vals?.[1] ?? 50))
        setFlightCost(Number(vals?.[2] ?? 0))
        setAccommodationPerNight(Number(vals?.[3] ?? 60))
        setLocalTransport(Number(vals?.[4] ?? 100))
        setVisaInsurance(Number(vals?.[5] ?? 0))
        setBufferPercent(Number(vals?.[6] ?? 10))
        setFxRate(Number(vals?.[7] ?? 83))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="Days" value={days} onChange={setDays} min={1} max={365} step={1} />
            <InputGroup label="Daily spend" value={dailySpend} onChange={setDailySpend} min={0} max={1e9} step={5} prefix="$ " />
            <InputGroup label="Accommodation / night" value={accommodationPerNight} onChange={setAccommodationPerNight} min={0} max={1e9} step={5} prefix="$ " />
            <InputGroup label="Flights (total)" value={flightCost} onChange={setFlightCost} min={0} max={1e12} step={10} prefix="$ " />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="Local transport" value={localTransport} onChange={setLocalTransport} min={0} max={1e12} step={10} prefix="$ " />
            <InputGroup label="Visa + insurance" value={visaInsurance} onChange={setVisaInsurance} min={0} max={1e12} step={10} prefix="$ " />
            <InputGroup label="Buffer" value={bufferPercent} onChange={setBufferPercent} min={0} max={200} step={1} suffix="%" />
            <InputGroup label="FX rate (domestic per $1)" value={fxRate} onChange={setFxRate} min={0.0000001} max={1e12} step={0.01} />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Currency is generic ($). Use the FX rate to convert to your domestic currency.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Subtotal ($)" value={`$${result.subtotalForeign.toFixed(2)}`} type="default" />
              <ResultCard label="Buffer ($)" value={`$${result.bufferForeign.toFixed(2)}`} type="warning" />
              <ResultCard label="Total ($)" value={`$${result.totalForeign.toFixed(2)}`} type="highlight" />
            </div>
            <ResultCard label="Total (domestic)" value={result.totalDomestic.toFixed(2)} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function ForexFeeCalculator() {
  const [pair, setPair] = useState("EURUSD")
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [price, setPrice] = useState(1.1)
  const [pipSize, setPipSize] = useState(getDefaultPipSize("EURUSD"))
  const [lots, setLots] = useState(1)
  const [spreadPips, setSpreadPips] = useState(1.2)
  const [slippagePips, setSlippagePips] = useState(0)
  const [commissionPerLotRoundTrip, setCommissionPerLotRoundTrip] = useState(0)
  const [quoteToAccountRate, setQuoteToAccountRate] = useState(1)

  const [result, setResult] = useState<null | {
    pipValuePerPip: number | null
    spreadCost: number | null
    slippageCost: number | null
    commissionCost: number
    totalCost: number | null
    totalCostPips: number | null
    note?: string
  }>(null)

  const calculate = () => {
    const safeLots = clampNumber(lots, 0.01, 100000)
    const units = Math.round(safeLots * 100000)
    const safePrice = clampNumber(price, 0.0000001, 100000000)
    const safePipSize = clampNumber(pipSize, 0.00000001, 1000)
    const safeSpread = clampNumber(spreadPips, 0, 1000000)
    const safeSlippage = clampNumber(slippagePips, 0, 1000000)
    const safeCommission = clampNumber(commissionPerLotRoundTrip, 0, 1e9)

    const pipValuePerPip = computePipValueInAccountCurrency({
      units,
      pipSize: safePipSize,
      price: safePrice,
      accountCurrency,
      pair,
      quoteToAccountRate: quoteToAccountRate,
    })

    const spreadCost = pipValuePerPip === null ? null : safeSpread * pipValuePerPip
    const slipCost = pipValuePerPip === null ? null : safeSlippage * pipValuePerPip
    const commissionCost = safeCommission * safeLots
    const totalCost = pipValuePerPip === null ? null : (safeSpread + safeSlippage) * pipValuePerPip + commissionCost
    const totalCostPips = pipValuePerPip === null ? null : safeSpread + safeSlippage + commissionCost / pipValuePerPip

    setResult({
      pipValuePerPip,
      spreadCost,
      slippageCost: slipCost,
      commissionCost,
      totalCost,
      totalCostPips,
      note:
        pipValuePerPip === null
          ? "Unable to compute pip value for this account currency without a valid quote→account rate."
          : "Costs are estimates: spread + slippage (in pips) plus commission (per lot, round-trip).",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Fee Calculator"
      description="Estimate all-in trading cost from spread, slippage and commission (in account currency and pips)."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[pair, accountCurrency, price, pipSize, lots, spreadPips, slippagePips, commissionPerLotRoundTrip, quoteToAccountRate]}
      onClear={() => {
        setPair("EURUSD")
        setAccountCurrency("USD")
        setPrice(1.1)
        setPipSize(getDefaultPipSize("EURUSD"))
        setLots(1)
        setSpreadPips(1.2)
        setSlippagePips(0)
        setCommissionPerLotRoundTrip(0)
        setQuoteToAccountRate(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        const nextPair = String(vals?.[0] ?? "EURUSD")
        setPair(nextPair)
        setAccountCurrency(String(vals?.[1] ?? "USD"))
        setPrice(Number(vals?.[2] ?? 1.1))
        setPipSize(Number(vals?.[3] ?? getDefaultPipSize(nextPair)))
        setLots(Number(vals?.[4] ?? 1))
        setSpreadPips(Number(vals?.[5] ?? 1.2))
        setSlippagePips(Number(vals?.[6] ?? 0))
        setCommissionPerLotRoundTrip(Number(vals?.[7] ?? 0))
        setQuoteToAccountRate(Number(vals?.[8] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pair</label>
              <input
                value={pair}
                onChange={(e) => {
                  const next = (e.target.value || "").replace(/\s+/g, "").toUpperCase()
                  setPair(next)
                  setPipSize(getDefaultPipSize(next))
                }}
                placeholder="EURUSD"
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account currency</label>
              <input
                value={accountCurrency}
                onChange={(e) => setAccountCurrency((e.target.value || "").trim().toUpperCase())}
                placeholder="USD"
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <InputGroup label="Price" value={price} onChange={setPrice} min={0.0000001} max={100000000} step={0.0001} />
            <InputGroup label="Pip size" value={pipSize} onChange={setPipSize} min={0.00000001} max={1} step={0.0001} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="Lots" value={lots} onChange={setLots} min={0.01} max={100000} step={0.01} />
            <InputGroup label="Spread" value={spreadPips} onChange={setSpreadPips} min={0} max={1000000} step={0.1} suffix=" pips" />
            <InputGroup label="Slippage" value={slippagePips} onChange={setSlippagePips} min={0} max={1000000} step={0.1} suffix=" pips" />
            <InputGroup label="Commission / lot (RT)" value={commissionPerLotRoundTrip} onChange={setCommissionPerLotRoundTrip} min={0} max={1e9} step={0.1} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Quote → account rate" value={quoteToAccountRate} onChange={setQuoteToAccountRate} min={0.0000001} max={1e12} step={0.0001} />
            <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
              If your account currency is not the quote currency, provide quote→account conversion rate.
            </div>
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Pip value (per pip)" value={result.pipValuePerPip === null ? "—" : result.pipValuePerPip.toFixed(4)} type="default" />
              <ResultCard label="Total cost" value={result.totalCost === null ? "—" : result.totalCost.toFixed(2)} type="highlight" />
              <ResultCard label="All-in cost" value={result.totalCostPips === null ? "—" : `${result.totalCostPips.toFixed(2)} pips`} type="highlight" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Spread cost" value={result.spreadCost === null ? "—" : result.spreadCost.toFixed(2)} type="default" />
              <ResultCard label="Slippage cost" value={result.slippageCost === null ? "—" : result.slippageCost.toFixed(2)} type="default" />
              <ResultCard label="Commission cost" value={result.commissionCost.toFixed(2)} type="default" />
            </div>
            {result.note && <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>}
          </div>
        )
      }
    />
  )
}

export function RemittanceCostCalculator() {
  const [sendAmount, setSendAmount] = useState(1000)
  const [fixedFee, setFixedFee] = useState(5)
  const [percentFee, setPercentFee] = useState(1)
  const [midRate, setMidRate] = useState(1)
  const [providerRate, setProviderRate] = useState(0.98)

  const [result, setResult] = useState<null | {
    totalFee: number
    netSend: number
    received: number
    effectiveRate: number
    feePercentOfSend: number
    fxMarkupPercent: number
  }>(null)

  const calculate = () => {
    const amt = clampNumber(sendAmount, 0.01, 1e12)
    const f = clampNumber(fixedFee, 0, 1e12)
    const p = clampNumber(percentFee, 0, 100) / 100
    const mid = clampNumber(midRate, 0.0000001, 1e12)
    const prov = clampNumber(providerRate, 0.0000001, 1e12)

    const variableFee = amt * p
    const totalFee = f + variableFee
    const netSend = Math.max(0, amt - totalFee)
    const received = netSend * prov
    const effectiveRate = received / amt
    const feePercentOfSend = (totalFee / amt) * 100
    const fxMarkupPercent = ((mid - prov) / mid) * 100

    setResult({ totalFee, netSend, received, effectiveRate, feePercentOfSend, fxMarkupPercent })
  }

  return (
    <FinancialCalculatorTemplate
      title="Remittance Cost"
      description="Estimate total remittance cost from fees and FX markup (provider rate vs mid-market)."
      icon={TrendingUp}
      calculate={calculate}
      values={[sendAmount, fixedFee, percentFee, midRate, providerRate]}
      onClear={() => {
        setSendAmount(1000)
        setFixedFee(5)
        setPercentFee(1)
        setMidRate(1)
        setProviderRate(0.98)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSendAmount(Number(vals?.[0] ?? 1000))
        setFixedFee(Number(vals?.[1] ?? 5))
        setPercentFee(Number(vals?.[2] ?? 1))
        setMidRate(Number(vals?.[3] ?? 1))
        setProviderRate(Number(vals?.[4] ?? 0.98))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InputGroup label="Send amount" value={sendAmount} onChange={setSendAmount} min={0.01} max={1e12} step={10} />
            <InputGroup label="Fixed fee" value={fixedFee} onChange={setFixedFee} min={0} max={1e12} step={1} />
            <InputGroup label="Percent fee" value={percentFee} onChange={setPercentFee} min={0} max={100} step={0.1} suffix="%" />
            <InputGroup label="Mid-market rate" value={midRate} onChange={setMidRate} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Provider rate" value={providerRate} onChange={setProviderRate} min={0.0000001} max={1e12} step={0.0001} />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Rates are “receiver currency per 1 sender currency”. Provider rate below mid-market implies FX markup.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Total fee" value={result.totalFee.toFixed(2)} type="warning" />
              <ResultCard label="Net sent (after fees)" value={result.netSend.toFixed(2)} type="default" />
              <ResultCard label="Receiver gets" value={result.received.toFixed(2)} type="highlight" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Effective rate" value={result.effectiveRate.toFixed(6)} type="default" />
              <ResultCard label="Fee as % of send" value={`${result.feePercentOfSend.toFixed(2)}%`} type="warning" />
            </div>
            <ResultCard label="FX markup vs mid" value={`${result.fxMarkupPercent.toFixed(2)}%`} type={result.fxMarkupPercent > 0 ? "warning" : "success"} />
          </div>
        )
      }
    />
  )
}

export function HedgingCostCalculator() {
  const [exposureForeign, setExposureForeign] = useState(100000)
  const [spotRate, setSpotRate] = useState(83)
  const [forwardRate, setForwardRate] = useState(84)
  const [hedgeRatioPercent, setHedgeRatioPercent] = useState(100)
  const [bankFeePercent, setBankFeePercent] = useState(0)

  const [result, setResult] = useState<null | {
    hedgedForeign: number
    unhedgedForeign: number
    spotValueHedged: number
    forwardLocked: number
    forwardPremium: number
    bankFee: number
    totalHedgeCost: number
    effectiveHedgeRate: number
  }>(null)

  const calculate = () => {
    const exp = clampNumber(exposureForeign, 0.01, 1e15)
    const spot = clampNumber(spotRate, 0.0000001, 1e12)
    const fwd = clampNumber(forwardRate, 0.0000001, 1e12)
    const hr = clampNumber(hedgeRatioPercent, 0, 100) / 100
    const fee = clampNumber(bankFeePercent, 0, 100) / 100

    const hedgedForeign = exp * hr
    const unhedgedForeign = exp - hedgedForeign

    const spotValueHedged = hedgedForeign * spot
    const forwardLocked = hedgedForeign * fwd
    const forwardPremium = forwardLocked - spotValueHedged
    const bankFee = forwardLocked * fee
    const totalHedgeCost = forwardPremium + bankFee
    const effectiveHedgeRate = hedgedForeign > 0 ? (forwardLocked + bankFee) / hedgedForeign : 0

    setResult({
      hedgedForeign,
      unhedgedForeign,
      spotValueHedged,
      forwardLocked,
      forwardPremium,
      bankFee,
      totalHedgeCost,
      effectiveHedgeRate,
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Hedging Cost"
      description="Estimate forward-hedge premium/discount plus bank fees for a currency exposure."
      icon={Activity}
      calculate={calculate}
      values={[exposureForeign, spotRate, forwardRate, hedgeRatioPercent, bankFeePercent]}
      onClear={() => {
        setExposureForeign(100000)
        setSpotRate(83)
        setForwardRate(84)
        setHedgeRatioPercent(100)
        setBankFeePercent(0)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setExposureForeign(Number(vals?.[0] ?? 100000))
        setSpotRate(Number(vals?.[1] ?? 83))
        setForwardRate(Number(vals?.[2] ?? 84))
        setHedgeRatioPercent(Number(vals?.[3] ?? 100))
        setBankFeePercent(Number(vals?.[4] ?? 0))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InputGroup label="Exposure (foreign units)" value={exposureForeign} onChange={setExposureForeign} min={0.01} max={1e15} step={1000} />
            <InputGroup label="Spot rate" value={spotRate} onChange={setSpotRate} min={0.0000001} max={1e12} step={0.01} />
            <InputGroup label="Forward rate" value={forwardRate} onChange={setForwardRate} min={0.0000001} max={1e12} step={0.01} />
            <InputGroup label="Hedge ratio" value={hedgeRatioPercent} onChange={setHedgeRatioPercent} min={0} max={100} step={1} suffix="%" />
            <InputGroup label="Bank fee" value={bankFeePercent} onChange={setBankFeePercent} min={0} max={100} step={0.1} suffix="%" />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Quotes assume “domestic per 1 foreign”. Forward premium = (F − S) × hedged notional.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Hedged exposure" value={result.hedgedForeign.toFixed(2)} type="default" />
              <ResultCard label="Unhedged exposure" value={result.unhedgedForeign.toFixed(2)} type="default" />
              <ResultCard label="Effective hedge rate" value={result.effectiveHedgeRate.toFixed(6)} type="highlight" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Forward locked (domestic)" value={result.forwardLocked.toFixed(2)} type="default" />
              <ResultCard label="Forward premium" value={result.forwardPremium.toFixed(2)} type={result.forwardPremium >= 0 ? "warning" : "success"} />
              <ResultCard label="Bank fee" value={result.bankFee.toFixed(2)} type="warning" />
            </div>
            <ResultCard label="Total hedge cost" value={result.totalHedgeCost.toFixed(2)} type={result.totalHedgeCost >= 0 ? "warning" : "success"} />
          </div>
        )
      }
    />
  )
}

export function ForwardRateCalculator() {
  const [spot, setSpot] = useState(1.1)
  const [domesticRate, setDomesticRate] = useState(6)
  const [foreignRate, setForeignRate] = useState(3)
  const [days, setDays] = useState(90)
  const [mode, setMode] = useState<"simple" | "continuous">("simple")

  const [result, setResult] = useState<null | {
    forward: number
    points: number
    annualizedCarryPercent: number
    note: string
  }>(null)

  const calculate = () => {
    const s = clampNumber(spot, 0.0000001, 1e12)
    const rd = clampNumber(domesticRate, -99.99, 1000) / 100
    const rf = clampNumber(foreignRate, -99.99, 1000) / 100
    const d = Math.round(clampNumber(days, 1, 3650))
    const t = d / 365

    const forward = mode === "continuous" ? s * Math.exp((rd - rf) * t) : s * ((1 + rd * t) / (1 + rf * t))
    const points = forward - s
    const annualizedCarryPercent = ((forward / s) - 1) * (1 / t) * 100

    setResult({
      forward,
      points,
      annualizedCarryPercent,
      note: mode === "continuous" ? "Continuous compounding: F = S·e^{(rd−rf)t}" : "Simple interest: F = S·(1+rd·t)/(1+rf·t)",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Forward Rate"
      description="Compute forward FX rate from interest rate parity (domestic vs foreign rates)."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[spot, domesticRate, foreignRate, days, mode]}
      onClear={() => {
        setSpot(1.1)
        setDomesticRate(6)
        setForeignRate(3)
        setDays(90)
        setMode("simple")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSpot(Number(vals?.[0] ?? 1.1))
        setDomesticRate(Number(vals?.[1] ?? 6))
        setForeignRate(Number(vals?.[2] ?? 3))
        setDays(Number(vals?.[3] ?? 90))
        const m = String(vals?.[4] ?? "simple")
        setMode((m === "continuous" ? "continuous" : "simple") as any)
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="Spot rate" value={spot} onChange={setSpot} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Domestic rate" value={domesticRate} onChange={setDomesticRate} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Foreign rate" value={foreignRate} onChange={setForeignRate} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Tenor" value={days} onChange={setDays} min={1} max={3650} step={1} suffix=" days" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
              Mode: {mode === "simple" ? "Simple interest" : "Continuous"}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${mode === "simple" ? "bg-secondary" : "bg-background"}`}
                onClick={() => setMode("simple")}
              >
                Simple
              </button>
              <button
                type="button"
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${mode === "continuous" ? "bg-secondary" : "bg-background"}`}
                onClick={() => setMode("continuous")}
              >
                Continuous
              </button>
            </div>
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Forward rate" value={result.forward.toFixed(6)} type="highlight" />
              <ResultCard label="Forward points" value={result.points.toFixed(6)} type={result.points >= 0 ? "warning" : "success"} />
              <ResultCard label="Annualized carry" value={`${result.annualizedCarryPercent.toFixed(2)}%`} type="default" />
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function CrossRateCalculator() {
  const [pair1, setPair1] = useState("EURUSD")
  const [rate1, setRate1] = useState(1.1)
  const [pair2, setPair2] = useState("USDJPY")
  const [rate2, setRate2] = useState(150)

  const [result, setResult] = useState<null | {
    crossPair: string
    crossRate: number | null
    inverseRate: number | null
    note?: string
  }>(null)

  const calculate = () => {
    const { base: a, quote: b } = parsePair(pair1)
    const { base: x, quote: y } = parsePair(pair2)
    const r1 = clampNumber(rate1, 0.0000001, 1e12)
    const r2 = clampNumber(rate2, 0.0000001, 1e12)

    let cross: number | null = null
    let c = ""
    let note = ""

    if (x === b) {
      c = y
      cross = r1 * r2
      note = `Using ${a}${b} × ${b}${c}`
    } else if (y === b) {
      c = x
      cross = r1 * (1 / r2)
      note = `Using ${a}${b} × (1/${c}${b})`
    } else {
      c = y
      cross = null
      note = `Pairs do not share the middle currency (${b}). Try something like ${a}${b} and ${b}${c}.`
    }

    setResult({
      crossPair: `${a}${c}`,
      crossRate: cross,
      inverseRate: cross ? 1 / cross : null,
      note,
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Cross Rate"
      description="Calculate a cross FX rate from two related currency pairs."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[pair1, rate1, pair2, rate2]}
      onClear={() => {
        setPair1("EURUSD")
        setRate1(1.1)
        setPair2("USDJPY")
        setRate2(150)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPair1(String(vals?.[0] ?? "EURUSD"))
        setRate1(Number(vals?.[1] ?? 1.1))
        setPair2(String(vals?.[2] ?? "USDJPY"))
        setRate2(Number(vals?.[3] ?? 150))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pair 1</label>
              <input
                value={pair1}
                onChange={(e) => setPair1((e.target.value || "").replace(/\s+/g, "").toUpperCase())}
                placeholder="EURUSD"
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <InputGroup label="Rate 1" value={rate1} onChange={setRate1} min={0.0000001} max={1e12} step={0.0001} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Pair 2</label>
              <input
                value={pair2}
                onChange={(e) => setPair2((e.target.value || "").replace(/\s+/g, "").toUpperCase())}
                placeholder="USDJPY"
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <InputGroup label="Rate 2" value={rate2} onChange={setRate2} min={0.0000001} max={1e12} step={0.0001} />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Example: EURUSD and USDJPY → EURJPY.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label={`Cross ${result.crossPair}`} value={result.crossRate === null ? "—" : result.crossRate.toFixed(6)} type="highlight" />
              <ResultCard label={`Inverse ${result.crossPair.slice(3)}${result.crossPair.slice(0, 3)}`} value={result.inverseRate === null ? "—" : result.inverseRate.toFixed(6)} type="default" />
            </div>
            {result.note && <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>}
          </div>
        )
      }
    />
  )
}

export function CurrencyStrengthCalculator() {
  const [eurUsd, setEurUsd] = useState(0)
  const [gbpUsd, setGbpUsd] = useState(0)
  const [jpyUsd, setJpyUsd] = useState(0)
  const [audUsd, setAudUsd] = useState(0)
  const [cadUsd, setCadUsd] = useState(0)
  const [chfUsd, setChfUsd] = useState(0)
  const [nzdUsd, setNzdUsd] = useState(0)
  const [inrUsd, setInrUsd] = useState(0)

  const [result, setResult] = useState<null | {
    ranked: Array<{ currency: string; score: number }>
    note: string
  }>(null)

  const calculate = () => {
    // Inputs are % change vs USD (approx). Positive means currency stronger vs USD.
    const scores = [
      { currency: "EUR", score: clampNumber(eurUsd, -1000, 1000) },
      { currency: "GBP", score: clampNumber(gbpUsd, -1000, 1000) },
      { currency: "JPY", score: clampNumber(jpyUsd, -1000, 1000) },
      { currency: "AUD", score: clampNumber(audUsd, -1000, 1000) },
      { currency: "CAD", score: clampNumber(cadUsd, -1000, 1000) },
      { currency: "CHF", score: clampNumber(chfUsd, -1000, 1000) },
      { currency: "NZD", score: clampNumber(nzdUsd, -1000, 1000) },
      { currency: "INR", score: clampNumber(inrUsd, -1000, 1000) },
    ]

    const m = mean(scores.map((s) => s.score))
    const s = stdev(scores.map((x) => x.score))
    const ranked = scores
      .map((x) => ({ currency: x.currency, score: s > 0 ? (x.score - m) / s : 0 }))
      .sort((a, b) => b.score - a.score)

    setResult({
      ranked,
      note: "Scores are z-scores computed from each currency’s % change vs USD. This is a simple strength snapshot, not a live index.",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Currency Strength"
      description="Rank currencies by relative strength using % change vs USD inputs (simple z-score ranking)."
      icon={TrendingUp}
      calculate={calculate}
      values={[eurUsd, gbpUsd, jpyUsd, audUsd, cadUsd, chfUsd, nzdUsd, inrUsd]}
      onClear={() => {
        setEurUsd(0)
        setGbpUsd(0)
        setJpyUsd(0)
        setAudUsd(0)
        setCadUsd(0)
        setChfUsd(0)
        setNzdUsd(0)
        setInrUsd(0)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setEurUsd(Number(vals?.[0] ?? 0))
        setGbpUsd(Number(vals?.[1] ?? 0))
        setJpyUsd(Number(vals?.[2] ?? 0))
        setAudUsd(Number(vals?.[3] ?? 0))
        setCadUsd(Number(vals?.[4] ?? 0))
        setChfUsd(Number(vals?.[5] ?? 0))
        setNzdUsd(Number(vals?.[6] ?? 0))
        setInrUsd(Number(vals?.[7] ?? 0))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="EUR vs USD" value={eurUsd} onChange={setEurUsd} min={-1000} max={1000} step={0.1} suffix="%" />
            <InputGroup label="GBP vs USD" value={gbpUsd} onChange={setGbpUsd} min={-1000} max={1000} step={0.1} suffix="%" />
            <InputGroup label="JPY vs USD" value={jpyUsd} onChange={setJpyUsd} min={-1000} max={1000} step={0.1} suffix="%" />
            <InputGroup label="AUD vs USD" value={audUsd} onChange={setAudUsd} min={-1000} max={1000} step={0.1} suffix="%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="CAD vs USD" value={cadUsd} onChange={setCadUsd} min={-1000} max={1000} step={0.1} suffix="%" />
            <InputGroup label="CHF vs USD" value={chfUsd} onChange={setChfUsd} min={-1000} max={1000} step={0.1} suffix="%" />
            <InputGroup label="NZD vs USD" value={nzdUsd} onChange={setNzdUsd} min={-1000} max={1000} step={0.1} suffix="%" />
            <InputGroup label="INR vs USD" value={inrUsd} onChange={setInrUsd} min={-1000} max={1000} step={0.1} suffix="%" />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Enter the same time-window % change for each currency vs USD.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.ranked.slice(0, 6).map((r) => (
                <ResultCard key={r.currency} label={r.currency} value={r.score.toFixed(2)} type={r.score >= 0 ? "success" : "warning"} />
              ))}
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function VolatilityCalculator() {
  const [spot, setSpot] = useState(1.1)
  const [annualVol, setAnnualVol] = useState(12)
  const [days, setDays] = useState(30)
  const [confidence, setConfidence] = useState<"68" | "95">("68")
  const [result, setResult] = useState<null | {
    sigma: number
    moveAbs: number
    movePct: number
    low: number
    high: number
    z: number
  }>(null)

  const calculate = () => {
    const s = clampNumber(spot, 0.0000001, 1e12)
    const vol = clampNumber(annualVol, 0, 1000) / 100
    const d = Math.round(clampNumber(days, 1, 3650))
    const z = confidence === "95" ? 1.96 : 1
    const sigma = vol * Math.sqrt(d / 252)
    const moveAbs = s * sigma * z
    const low = s - moveAbs
    const high = s + moveAbs
    setResult({ sigma, moveAbs, movePct: sigma * z * 100, low, high, z })
  }

  return (
    <FinancialCalculatorTemplate
      title="Volatility Calculator"
      description="Estimate expected price range from annualized volatility (normal approximation)."
      icon={Activity}
      calculate={calculate}
      values={[spot, annualVol, days, confidence]}
      onClear={() => {
        setSpot(1.1)
        setAnnualVol(12)
        setDays(30)
        setConfidence("68")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSpot(Number(vals?.[0] ?? 1.1))
        setAnnualVol(Number(vals?.[1] ?? 12))
        setDays(Number(vals?.[2] ?? 30))
        const c = String(vals?.[3] ?? "68")
        setConfidence((c === "95" ? "95" : "68") as any)
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <InputGroup label="Spot price" value={spot} onChange={setSpot} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Annual volatility" value={annualVol} onChange={setAnnualVol} min={0} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Horizon" value={days} onChange={setDays} min={1} max={3650} step={1} suffix=" days" />
            <div className="space-y-2">
              <label className="text-sm font-medium">Confidence</label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="68">~68% (1σ)</option>
                <option value="95">~95% (1.96σ)</option>
              </select>
            </div>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Uses: horizon sigma = annualVol × sqrt(days/252), range ≈ spot ± z×sigma×spot.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResultCard label="Horizon σ" value={`${(result.sigma * 100).toFixed(2)}%`} type="default" />
              <ResultCard label="Expected move" value={`${result.movePct.toFixed(2)}%`} type="highlight" />
              <ResultCard label="Low" value={result.low.toFixed(6)} type="default" />
              <ResultCard label="High" value={result.high.toFixed(6)} type="default" />
            </div>
          </div>
        )
      }
    />
  )
}

export function CorrelationMatrixCalculator() {
  const [seriesA, setSeriesA] = useState("0.1, 0.2, -0.1, 0.05")
  const [seriesB, setSeriesB] = useState("0.05, 0.1, -0.05, 0.02")
  const [seriesC, setSeriesC] = useState("")
  const [result, setResult] = useState<null | {
    corrAB: number | null
    corrAC: number | null
    corrBC: number | null
    n: number
    note: string
  }>(null)

  const calculate = () => {
    const a = parseCsvNumbers(seriesA)
    const b = parseCsvNumbers(seriesB)
    const c = parseCsvNumbers(seriesC)
    const n = Math.min(a.length, b.length, c.length ? c.length : Math.min(a.length, b.length))

    const corrAB = n >= 2 ? pearsonCorrelation(a, b) : null
    const corrAC = c.length && Math.min(a.length, c.length) >= 2 ? pearsonCorrelation(a, c) : null
    const corrBC = c.length && Math.min(b.length, c.length) >= 2 ? pearsonCorrelation(b, c) : null

    setResult({
      corrAB,
      corrAC,
      corrBC,
      n,
      note: "Paste comma/space separated return series. Correlations use Pearson on aligned samples (min length).",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Correlation Matrix"
      description="Compute Pearson correlations for 2–3 series (simple matrix)."
      icon={Activity}
      calculate={calculate}
      values={[seriesA, seriesB, seriesC]}
      onClear={() => {
        setSeriesA("0.1, 0.2, -0.1, 0.05")
        setSeriesB("0.05, 0.1, -0.05, 0.02")
        setSeriesC("")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSeriesA(String(vals?.[0] ?? "0.1, 0.2, -0.1, 0.05"))
        setSeriesB(String(vals?.[1] ?? "0.05, 0.1, -0.05, 0.02"))
        setSeriesC(String(vals?.[2] ?? ""))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Series A</label>
              <textarea
                value={seriesA}
                onChange={(e) => setSeriesA(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Series B</label>
              <textarea
                value={seriesB}
                onChange={(e) => setSeriesB(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Series C (optional)</label>
              <textarea
                value={seriesC}
                onChange={(e) => setSeriesC(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
            Tip: use returns (%, decimal, or log-returns) consistently across series.
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <ResultCard label="Sample size (aligned)" value={String(result.n)} type="default" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Corr(A,B)" value={result.corrAB === null ? "—" : result.corrAB.toFixed(4)} type="highlight" />
              <ResultCard label="Corr(A,C)" value={result.corrAC === null ? "—" : result.corrAC.toFixed(4)} type="default" />
              <ResultCard label="Corr(B,C)" value={result.corrBC === null ? "—" : result.corrBC.toFixed(4)} type="default" />
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function CarryTradeCalculator() {
  const [spot, setSpot] = useState(1.1)
  const [domesticRate, setDomesticRate] = useState(6)
  const [foreignRate, setForeignRate] = useState(3)
  const [days, setDays] = useState(90)
  const [expectedSpotEnd, setExpectedSpotEnd] = useState(1.1)
  const [includeFxMove, setIncludeFxMove] = useState(true)

  const [result, setResult] = useState<null | {
    carryReturnPercent: number
    totalReturnPercent: number
    forwardImplied: number
    note: string
  }>(null)

  const calculate = () => {
    const s = clampNumber(spot, 0.0000001, 1e12)
    const rd = clampNumber(domesticRate, -99.99, 1000) / 100
    const rf = clampNumber(foreignRate, -99.99, 1000) / 100
    const d = Math.round(clampNumber(days, 1, 3650))
    const t = d / 365

    const forwardImplied = s * ((1 + rd * t) / (1 + rf * t))
    const carryReturnPercent = ((forwardImplied / s) - 1) * 100
    const expEnd = clampNumber(expectedSpotEnd, 0.0000001, 1e12)
    const totalReturnPercent = includeFxMove ? ((expEnd / s) * (1 + carryReturnPercent / 100) - 1) * 100 : carryReturnPercent

    setResult({
      carryReturnPercent,
      totalReturnPercent,
      forwardImplied,
      note: includeFxMove
        ? "Total return ≈ FX move × carry. Carry uses interest differential with simple interest."
        : "Carry only (ignores FX move).",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Carry Trade"
      description="Estimate carry return from interest rate differential (optionally include expected FX move)."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[spot, domesticRate, foreignRate, days, expectedSpotEnd, includeFxMove]}
      onClear={() => {
        setSpot(1.1)
        setDomesticRate(6)
        setForeignRate(3)
        setDays(90)
        setExpectedSpotEnd(1.1)
        setIncludeFxMove(true)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSpot(Number(vals?.[0] ?? 1.1))
        setDomesticRate(Number(vals?.[1] ?? 6))
        setForeignRate(Number(vals?.[2] ?? 3))
        setDays(Number(vals?.[3] ?? 90))
        setExpectedSpotEnd(Number(vals?.[4] ?? 1.1))
        setIncludeFxMove(Boolean(vals?.[5] ?? true))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InputGroup label="Spot" value={spot} onChange={setSpot} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Domestic rate" value={domesticRate} onChange={setDomesticRate} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Foreign rate" value={foreignRate} onChange={setForeignRate} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Days" value={days} onChange={setDays} min={1} max={3650} step={1} />
            <InputGroup label="Expected spot (end)" value={expectedSpotEnd} onChange={setExpectedSpotEnd} min={0.0000001} max={1e12} step={0.0001} />
          </div>

          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground flex items-center justify-between">
            <div>Include expected FX move</div>
            <button
              type="button"
              className={`rounded-lg border px-3 py-2 text-sm ${includeFxMove ? "bg-secondary" : "bg-background"}`}
              onClick={() => setIncludeFxMove((v) => !v)}
            >
              {includeFxMove ? "On" : "Off"}
            </button>
          </div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Carry return" value={`${result.carryReturnPercent.toFixed(3)}%`} type="highlight" />
              <ResultCard label="Implied forward" value={result.forwardImplied.toFixed(6)} type="default" />
              <ResultCard label="Total return" value={`${result.totalReturnPercent.toFixed(3)}%`} type={result.totalReturnPercent >= 0 ? "success" : "warning"} />
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function InterestRateParityCalculator() {
  const [spot, setSpot] = useState(1.1)
  const [forward, setForward] = useState(1.11)
  const [domesticRate, setDomesticRate] = useState(6)
  const [foreignRate, setForeignRate] = useState(3)
  const [days, setDays] = useState(90)
  const [result, setResult] = useState<null | {
    forwardFromRates: number
    impliedDiffPercent: number
    forwardPremiumPercent: number
    note: string
  }>(null)

  const calculate = () => {
    const s = clampNumber(spot, 0.0000001, 1e12)
    const f = clampNumber(forward, 0.0000001, 1e12)
    const rd = clampNumber(domesticRate, -99.99, 1000) / 100
    const rf = clampNumber(foreignRate, -99.99, 1000) / 100
    const d = Math.round(clampNumber(days, 1, 3650))
    const t = d / 365

    const forwardFromRates = s * ((1 + rd * t) / (1 + rf * t))
    const forwardPremiumPercent = ((f / s) - 1) * 100
    // Approx rd - rf from forward premium: (F/S - 1)/t
    const impliedDiffPercent = t > 0 ? (((f / s) - 1) / t) * 100 : 0

    setResult({
      forwardFromRates,
      impliedDiffPercent,
      forwardPremiumPercent,
      note: "Covered IRP: F = S·(1+rd·t)/(1+rf·t). Implied (rd−rf) approximated from (F/S−1)/t.",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Interest Rate Parity"
      description="Compare market forward vs forward implied by interest rate parity (covered IRP)."
      icon={ArrowUpDown}
      calculate={calculate}
      values={[spot, forward, domesticRate, foreignRate, days]}
      onClear={() => {
        setSpot(1.1)
        setForward(1.11)
        setDomesticRate(6)
        setForeignRate(3)
        setDays(90)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setSpot(Number(vals?.[0] ?? 1.1))
        setForward(Number(vals?.[1] ?? 1.11))
        setDomesticRate(Number(vals?.[2] ?? 6))
        setForeignRate(Number(vals?.[3] ?? 3))
        setDays(Number(vals?.[4] ?? 90))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <InputGroup label="Spot" value={spot} onChange={setSpot} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Forward (market)" value={forward} onChange={setForward} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Domestic rate" value={domesticRate} onChange={setDomesticRate} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Foreign rate" value={foreignRate} onChange={setForeignRate} min={-99.99} max={1000} step={0.1} suffix="%" />
            <InputGroup label="Days" value={days} onChange={setDays} min={1} max={3650} step={1} />
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">Quotes assume “domestic per 1 foreign”.</div>
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Forward (IRP)" value={result.forwardFromRates.toFixed(6)} type="highlight" />
              <ResultCard label="Forward premium" value={`${result.forwardPremiumPercent.toFixed(3)}%`} type={result.forwardPremiumPercent >= 0 ? "warning" : "success"} />
              <ResultCard label="Implied (rd−rf)" value={`${result.impliedDiffPercent.toFixed(2)}%`} type="default" />
            </div>
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function BigMacIndexCalculator() {
  const [localPrice, setLocalPrice] = useState(250)
  const [usPrice, setUsPrice] = useState(5.5)
  const [marketRate, setMarketRate] = useState(83)
  const [result, setResult] = useState<null | {
    impliedPpp: number
    overUnder: number
  }>(null)

  const calculate = () => {
    const lp = clampNumber(localPrice, 0.0000001, 1e12)
    const up = clampNumber(usPrice, 0.0000001, 1e12)
    const mr = clampNumber(marketRate, 0.0000001, 1e12)
    const impliedPpp = lp / up
    const overUnder = ((mr - impliedPpp) / impliedPpp) * 100
    setResult({ impliedPpp, overUnder })
  }

  return (
    <FinancialCalculatorTemplate
      title="Big Mac Index"
      description="Estimate PPP exchange rate using Big Mac prices and compare against market rate."
      icon={TrendingUp}
      calculate={calculate}
      values={[localPrice, usPrice, marketRate]}
      onClear={() => {
        setLocalPrice(250)
        setUsPrice(5.5)
        setMarketRate(83)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setLocalPrice(Number(vals?.[0] ?? 250))
        setUsPrice(Number(vals?.[1] ?? 5.5))
        setMarketRate(Number(vals?.[2] ?? 83))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Local Big Mac price" value={localPrice} onChange={setLocalPrice} min={0.0000001} max={1e12} step={1} />
            <InputGroup label="US Big Mac price" value={usPrice} onChange={setUsPrice} min={0.0000001} max={1e12} step={0.01} />
            <InputGroup label="Market rate (local per $1)" value={marketRate} onChange={setMarketRate} min={0.0000001} max={1e12} step={0.01} />
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Implied PPP" value={result.impliedPpp.toFixed(4)} type="highlight" />
            <ResultCard label="Over/Undervaluation" value={`${result.overUnder.toFixed(2)}%`} type={result.overUnder >= 0 ? "warning" : "success"} />
          </div>
        )
      }
    />
  )
}

export function GoldSilverRatioCalculator() {
  const [gold, setGold] = useState(2000)
  const [silver, setSilver] = useState(25)
  const [targetRatio, setTargetRatio] = useState(80)
  const [result, setResult] = useState<null | {
    ratio: number
    impliedSilver: number
  }>(null)

  const calculate = () => {
    const g = clampNumber(gold, 0.0000001, 1e12)
    const s = clampNumber(silver, 0.0000001, 1e12)
    const tr = clampNumber(targetRatio, 0.0000001, 1e12)
    setResult({ ratio: g / s, impliedSilver: g / tr })
  }

  return (
    <FinancialCalculatorTemplate
      title="Gold Silver Ratio"
      description="Compute the gold/silver ratio and implied silver price for a target ratio."
      icon={Activity}
      calculate={calculate}
      values={[gold, silver, targetRatio]}
      onClear={() => {
        setGold(2000)
        setSilver(25)
        setTargetRatio(80)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setGold(Number(vals?.[0] ?? 2000))
        setSilver(Number(vals?.[1] ?? 25))
        setTargetRatio(Number(vals?.[2] ?? 80))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Gold price" value={gold} onChange={setGold} min={0.0000001} max={1e12} step={1} />
          <InputGroup label="Silver price" value={silver} onChange={setSilver} min={0.0000001} max={1e12} step={0.01} />
          <InputGroup label="Target ratio" value={targetRatio} onChange={setTargetRatio} min={0.0000001} max={1e12} step={0.1} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Current ratio" value={result.ratio.toFixed(2)} type="highlight" />
            <ResultCard label="Implied silver @ target" value={result.impliedSilver.toFixed(2)} type="default" />
          </div>
        )
      }
    />
  )
}

export function PlatinumGoldRatioCalculator() {
  const [platinum, setPlatinum] = useState(950)
  const [gold, setGold] = useState(2000)
  const [targetRatio, setTargetRatio] = useState(1)
  const [result, setResult] = useState<null | {
    ratio: number
    impliedPlatinum: number
  }>(null)

  const calculate = () => {
    const p = clampNumber(platinum, 0.0000001, 1e12)
    const g = clampNumber(gold, 0.0000001, 1e12)
    const tr = clampNumber(targetRatio, 0.0000001, 1e12)
    setResult({ ratio: p / g, impliedPlatinum: g * tr })
  }

  return (
    <FinancialCalculatorTemplate
      title="Platinum Gold Ratio"
      description="Compute platinum/gold ratio and implied platinum price at a target ratio."
      icon={Activity}
      calculate={calculate}
      values={[platinum, gold, targetRatio]}
      onClear={() => {
        setPlatinum(950)
        setGold(2000)
        setTargetRatio(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPlatinum(Number(vals?.[0] ?? 950))
        setGold(Number(vals?.[1] ?? 2000))
        setTargetRatio(Number(vals?.[2] ?? 1))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Platinum price" value={platinum} onChange={setPlatinum} min={0.0000001} max={1e12} step={1} />
          <InputGroup label="Gold price" value={gold} onChange={setGold} min={0.0000001} max={1e12} step={1} />
          <InputGroup label="Target ratio (P/G)" value={targetRatio} onChange={setTargetRatio} min={0.0000001} max={1e12} step={0.01} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Current ratio" value={result.ratio.toFixed(4)} type="highlight" />
            <ResultCard label="Implied platinum @ target" value={result.impliedPlatinum.toFixed(2)} type="default" />
          </div>
        )
      }
    />
  )
}

export function BitcoinDominanceCalculator() {
  const [btcCap, setBtcCap] = useState(900_000_000_000)
  const [totalCap, setTotalCap] = useState(2_000_000_000_000)
  const [result, setResult] = useState<null | { dominance: number }>(null)

  const calculate = () => {
    const b = clampNumber(btcCap, 0, 1e18)
    const t = clampNumber(totalCap, 0.0000001, 1e18)
    setResult({ dominance: (b / t) * 100 })
  }

  return (
    <FinancialCalculatorTemplate
      title="Bitcoin Dominance"
      description="Calculate BTC dominance from BTC market cap and total crypto market cap."
      icon={TrendingUp}
      calculate={calculate}
      values={[btcCap, totalCap]}
      onClear={() => {
        setBtcCap(900_000_000_000)
        setTotalCap(2_000_000_000_000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setBtcCap(Number(vals?.[0] ?? 900_000_000_000))
        setTotalCap(Number(vals?.[1] ?? 2_000_000_000_000))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="BTC market cap" value={btcCap} onChange={setBtcCap} min={0} max={1e18} step={1_000_000_000} />
          <InputGroup label="Total market cap" value={totalCap} onChange={setTotalCap} min={0.0000001} max={1e18} step={1_000_000_000} />
        </div>
      }
      result={result && <ResultCard label="Dominance" value={`${result.dominance.toFixed(2)}%`} type="highlight" />}
    />
  )
}

export function EthGasFeeCalculator() {
  const [gasUnits, setGasUnits] = useState(21000)
  const [gasPriceGwei, setGasPriceGwei] = useState(20)
  const [ethPrice, setEthPrice] = useState(2500)
  const [result, setResult] = useState<null | { feeEth: number; feeUsd: number }>(null)

  const calculate = () => {
    const units = Math.round(clampNumber(gasUnits, 21000, 1e9))
    const gwei = clampNumber(gasPriceGwei, 0, 1e9)
    const price = clampNumber(ethPrice, 0, 1e9)
    const feeEth = units * gwei * 1e-9
    const feeUsd = feeEth * price
    setResult({ feeEth, feeUsd })
  }

  return (
    <FinancialCalculatorTemplate
      title="ETH Gas Fee"
      description="Estimate transaction fee from gas units and gas price (gwei)."
      icon={Calculator}
      calculate={calculate}
      values={[gasUnits, gasPriceGwei, ethPrice]}
      onClear={() => {
        setGasUnits(21000)
        setGasPriceGwei(20)
        setEthPrice(2500)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setGasUnits(Number(vals?.[0] ?? 21000))
        setGasPriceGwei(Number(vals?.[1] ?? 20))
        setEthPrice(Number(vals?.[2] ?? 2500))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Gas units" value={gasUnits} onChange={setGasUnits} min={21000} max={1e9} step={1} />
          <InputGroup label="Gas price" value={gasPriceGwei} onChange={setGasPriceGwei} min={0} max={1e9} step={0.1} suffix=" gwei" />
          <InputGroup label="ETH price" value={ethPrice} onChange={setEthPrice} min={0} max={1e9} step={1} prefix="$ " />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Fee (ETH)" value={result.feeEth.toFixed(6)} type="highlight" />
            <ResultCard label="Fee (USD)" value={`$${result.feeUsd.toFixed(2)}`} type="default" />
          </div>
        )
      }
    />
  )
}

export function CryptoBurnRateCalculator() {
  const [burnPerDay, setBurnPerDay] = useState(100000)
  const [tokenPrice, setTokenPrice] = useState(0.05)
  const [circulating, setCirculating] = useState(1_000_000_000)
  const [result, setResult] = useState<null | {
    usdPerDay: number
    usdPerYear: number
    burnPercentPerYear: number
  }>(null)

  const calculate = () => {
    const b = clampNumber(burnPerDay, 0, 1e18)
    const p = clampNumber(tokenPrice, 0, 1e9)
    const s = clampNumber(circulating, 0.0000001, 1e18)
    const usdPerDay = b * p
    const usdPerYear = usdPerDay * 365
    const burnPercentPerYear = ((b * 365) / s) * 100
    setResult({ usdPerDay, usdPerYear, burnPercentPerYear })
  }

  return (
    <FinancialCalculatorTemplate
      title="Crypto Burn Rate"
      description="Estimate burn value and annual burn percentage vs circulating supply."
      icon={Activity}
      calculate={calculate}
      values={[burnPerDay, tokenPrice, circulating]}
      onClear={() => {
        setBurnPerDay(100000)
        setTokenPrice(0.05)
        setCirculating(1_000_000_000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setBurnPerDay(Number(vals?.[0] ?? 100000))
        setTokenPrice(Number(vals?.[1] ?? 0.05))
        setCirculating(Number(vals?.[2] ?? 1_000_000_000))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup label="Tokens burned / day" value={burnPerDay} onChange={setBurnPerDay} min={0} max={1e18} step={1000} />
          <InputGroup label="Token price" value={tokenPrice} onChange={setTokenPrice} min={0} max={1e9} step={0.0001} prefix="$ " />
          <InputGroup label="Circulating supply" value={circulating} onChange={setCirculating} min={0.0000001} max={1e18} step={1000000} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label="Burn value / day" value={`$${result.usdPerDay.toFixed(2)}`} type="highlight" />
            <ResultCard label="Burn value / year" value={`$${result.usdPerYear.toFixed(2)}`} type="default" />
            <ResultCard label="Burn % / year" value={`${result.burnPercentPerYear.toFixed(4)}%`} type="warning" />
          </div>
        )
      }
    />
  )
}

export function ImpermanentLossCalculator() {
  const [priceChangePercent, setPriceChangePercent] = useState(50)
  const [depositUsd, setDepositUsd] = useState(1000)
  const [result, setResult] = useState<null | {
    ilPercent: number
    ilUsd: number
    hodlValue: number
    lpValue: number
    note: string
  }>(null)

  const calculate = () => {
    const pc = clampNumber(priceChangePercent, -99.99, 100000) / 100
    const r = 1 + pc
    const d = clampNumber(depositUsd, 0, 1e12)

    // Classic constant-product IL formula for 50/50 pool: IL = 2*sqrt(r)/(1+r) - 1
    const il = (2 * Math.sqrt(r)) / (1 + r) - 1
    const hodlValue = d * (0.5 * r + 0.5)
    const lpValue = hodlValue * (1 + il)
    const ilUsd = hodlValue - lpValue

    setResult({
      ilPercent: il * 100,
      ilUsd,
      hodlValue,
      lpValue,
      note: "Assumes a 50/50 constant-product AMM pool and no fees. Positive IL% means LP underperforms HODL.",
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Impermanent Loss"
      description="Compute impermanent loss for a 50/50 AMM pool from a price change."
      icon={Activity}
      calculate={calculate}
      values={[priceChangePercent, depositUsd]}
      onClear={() => {
        setPriceChangePercent(50)
        setDepositUsd(1000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPriceChangePercent(Number(vals?.[0] ?? 50))
        setDepositUsd(Number(vals?.[1] ?? 1000))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Price change" value={priceChangePercent} onChange={setPriceChangePercent} min={-99.99} max={100000} step={1} suffix="%" />
          <InputGroup label="Initial deposit (USD)" value={depositUsd} onChange={setDepositUsd} min={0} max={1e12} step={10} prefix="$ " />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="IL%" value={`${result.ilPercent.toFixed(4)}%`} type={result.ilPercent <= 0 ? "success" : "warning"} />
              <ResultCard label="HODL value" value={`$${result.hodlValue.toFixed(2)}`} type="default" />
              <ResultCard label="LP value" value={`$${result.lpValue.toFixed(2)}`} type="highlight" />
            </div>
            <ResultCard label="IL (USD)" value={`$${result.ilUsd.toFixed(2)}`} type={result.ilUsd <= 0 ? "success" : "warning"} />
            <div className="bg-secondary/50 p-4 rounded-xl text-xs text-muted-foreground">{result.note}</div>
          </div>
        )
      }
    />
  )
}

export function YieldFarmingCalculator() {
  const [depositUsd, setDepositUsd] = useState(1000)
  const [apr, setApr] = useState(30)
  const [compoundsPerYear, setCompoundsPerYear] = useState(365)
  const [platformFeePercent, setPlatformFeePercent] = useState(2)
  const [impermanentLossPercent, setImpermanentLossPercent] = useState(0)
  const [result, setResult] = useState<null | {
    grossRewards: number
    fee: number
    ilCost: number
    netProfit: number
    endValue: number
    apy: number
  }>(null)

  const calculate = () => {
    const d = clampNumber(depositUsd, 0, 1e12)
    const r = clampNumber(apr, -100, 100000) / 100
    const n = Math.round(clampNumber(compoundsPerYear, 1, 36500))
    const feePct = clampNumber(platformFeePercent, 0, 100) / 100
    const ilPct = clampNumber(impermanentLossPercent, 0, 100) / 100

    const grossFactor = (1 + r / n) ** n
    const grossRewards = d * (grossFactor - 1)
    const fee = grossRewards * feePct
    const ilCost = d * ilPct
    const netProfit = grossRewards - fee - ilCost
    const endValue = d + netProfit
    const apy = d > 0 ? ((endValue / d) - 1) * 100 : 0

    setResult({ grossRewards, fee, ilCost, netProfit, endValue, apy })
  }

  return (
    <FinancialCalculatorTemplate
      title="Yield Farming"
      description="Estimate yield-farming profit after platform fees and optional impermanent loss adjustment."
      icon={TrendingUp}
      calculate={calculate}
      values={[depositUsd, apr, compoundsPerYear, platformFeePercent, impermanentLossPercent]}
      onClear={() => {
        setDepositUsd(1000)
        setApr(30)
        setCompoundsPerYear(365)
        setPlatformFeePercent(2)
        setImpermanentLossPercent(0)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setDepositUsd(Number(vals?.[0] ?? 1000))
        setApr(Number(vals?.[1] ?? 30))
        setCompoundsPerYear(Number(vals?.[2] ?? 365))
        setPlatformFeePercent(Number(vals?.[3] ?? 2))
        setImpermanentLossPercent(Number(vals?.[4] ?? 0))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <InputGroup label="Deposit (USD)" value={depositUsd} onChange={setDepositUsd} min={0} max={1e12} step={10} prefix="$ " />
          <InputGroup label="APR" value={apr} onChange={setApr} min={-100} max={100000} step={0.1} suffix="%" />
          <InputGroup label="Compounds / year" value={compoundsPerYear} onChange={setCompoundsPerYear} min={1} max={36500} step={1} />
          <InputGroup label="Platform fee on rewards" value={platformFeePercent} onChange={setPlatformFeePercent} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Impermanent loss" value={impermanentLossPercent} onChange={setImpermanentLossPercent} min={0} max={100} step={0.1} suffix="%" />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard label="Gross rewards" value={`$${result.grossRewards.toFixed(2)}`} type="default" />
              <ResultCard label="Fees" value={`$${result.fee.toFixed(2)}`} type="warning" />
              <ResultCard label="IL cost" value={`$${result.ilCost.toFixed(2)}`} type="warning" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Net profit" value={`$${result.netProfit.toFixed(2)}`} type={result.netProfit >= 0 ? "success" : "warning"} />
              <ResultCard label="End value" value={`$${result.endValue.toFixed(2)}`} type="highlight" />
            </div>
            <ResultCard label="Effective APY" value={`${result.apy.toFixed(2)}%`} type="highlight" />
          </div>
        )
      }
    />
  )
}

export function AdvancedStakingRewardsCalculator() {
  const [principal, setPrincipal] = useState(1000)
  const [apr, setApr] = useState(8)
  const [validatorFeePercent, setValidatorFeePercent] = useState(5)
  const [months, setMonths] = useState(12)
  const [monthlyAdd, setMonthlyAdd] = useState(0)
  const [result, setResult] = useState<null | {
    endBalance: number
    totalAdded: number
    totalRewards: number
    effectiveApy: number
  }>(null)

  const calculate = () => {
    const p0 = clampNumber(principal, 0, 1e18)
    const r = clampNumber(apr, -100, 100000) / 100
    const fee = clampNumber(validatorFeePercent, 0, 100) / 100
    const m = Math.round(clampNumber(months, 1, 600))
    const add = clampNumber(monthlyAdd, 0, 1e18)

    const monthlyRate = (1 + r) ** (1 / 12) - 1
    let balance = p0
    let totalAdded = 0
    let totalRewards = 0
    for (let i = 0; i < m; i++) {
      balance += add
      totalAdded += add
      const reward = balance * monthlyRate
      const netReward = reward * (1 - fee)
      totalRewards += netReward
      balance += netReward
    }
    const invested = p0 + totalAdded
    const effectiveApy = invested > 0 ? ((balance / invested) ** (12 / m) - 1) * 100 : 0
    setResult({ endBalance: balance, totalAdded, totalRewards, effectiveApy })
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced Staking Rewards"
      description="Model staking rewards with validator fee and monthly contributions (monthly compounding simulation)."
      icon={TrendingUp}
      calculate={calculate}
      values={[principal, apr, validatorFeePercent, months, monthlyAdd]}
      onClear={() => {
        setPrincipal(1000)
        setApr(8)
        setValidatorFeePercent(5)
        setMonths(12)
        setMonthlyAdd(0)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals?.[0] ?? 1000))
        setApr(Number(vals?.[1] ?? 8))
        setValidatorFeePercent(Number(vals?.[2] ?? 5))
        setMonths(Number(vals?.[3] ?? 12))
        setMonthlyAdd(Number(vals?.[4] ?? 0))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <InputGroup label="Principal" value={principal} onChange={setPrincipal} min={0} max={1e18} step={10} />
          <InputGroup label="APR" value={apr} onChange={setApr} min={-100} max={100000} step={0.1} suffix="%" />
          <InputGroup label="Validator fee" value={validatorFeePercent} onChange={setValidatorFeePercent} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Months" value={months} onChange={setMonths} min={1} max={600} step={1} />
          <InputGroup label="Monthly add" value={monthlyAdd} onChange={setMonthlyAdd} min={0} max={1e18} step={10} />
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard label="End balance" value={result.endBalance.toFixed(4)} type="highlight" />
            <ResultCard label="Total added" value={result.totalAdded.toFixed(4)} type="default" />
            <ResultCard label="Total rewards" value={result.totalRewards.toFixed(4)} type="success" />
            <ResultCard label="Effective APY" value={`${result.effectiveApy.toFixed(2)}%`} type="default" />
          </div>
        )
      }
    />
  )
}

export function AdvancedMiningROICalculator() {
  const [hardwareCost, setHardwareCost] = useState(2000)
  const [dailyRevenue, setDailyRevenue] = useState(15)
  const [poolFeePercent, setPoolFeePercent] = useState(1)
  const [dailyPowerCost, setDailyPowerCost] = useState(6)
  const [dailyMaintenance, setDailyMaintenance] = useState(0)
  const [result, setResult] = useState<null | {
    netPerDay: number
    breakEvenDays: number | null
    netPerYear: number
    roiPercent: number
  }>(null)

  const calculate = () => {
    const hw = clampNumber(hardwareCost, 0, 1e12)
    const rev = clampNumber(dailyRevenue, 0, 1e9)
    const fee = clampNumber(poolFeePercent, 0, 100) / 100
    const power = clampNumber(dailyPowerCost, 0, 1e9)
    const maint = clampNumber(dailyMaintenance, 0, 1e9)

    const netPerDay = rev * (1 - fee) - power - maint
    const breakEvenDays = netPerDay > 0 ? hw / netPerDay : null
    const netPerYear = netPerDay * 365
    const roiPercent = hw > 0 ? (netPerYear / hw) * 100 : 0
    setResult({ netPerDay, breakEvenDays, netPerYear, roiPercent })
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced Mining ROI"
      description="Estimate mining ROI from revenue, pool fees, power and maintenance (simple cashflow)."
      icon={Activity}
      calculate={calculate}
      values={[hardwareCost, dailyRevenue, poolFeePercent, dailyPowerCost, dailyMaintenance]}
      onClear={() => {
        setHardwareCost(2000)
        setDailyRevenue(15)
        setPoolFeePercent(1)
        setDailyPowerCost(6)
        setDailyMaintenance(0)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setHardwareCost(Number(vals?.[0] ?? 2000))
        setDailyRevenue(Number(vals?.[1] ?? 15))
        setPoolFeePercent(Number(vals?.[2] ?? 1))
        setDailyPowerCost(Number(vals?.[3] ?? 6))
        setDailyMaintenance(Number(vals?.[4] ?? 0))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <InputGroup label="Hardware cost" value={hardwareCost} onChange={setHardwareCost} min={0} max={1e12} step={10} prefix="$ " />
          <InputGroup label="Daily revenue" value={dailyRevenue} onChange={setDailyRevenue} min={0} max={1e9} step={0.1} prefix="$ " />
          <InputGroup label="Pool fee" value={poolFeePercent} onChange={setPoolFeePercent} min={0} max={100} step={0.1} suffix="%" />
          <InputGroup label="Daily power cost" value={dailyPowerCost} onChange={setDailyPowerCost} min={0} max={1e9} step={0.1} prefix="$ " />
          <InputGroup label="Daily maintenance" value={dailyMaintenance} onChange={setDailyMaintenance} min={0} max={1e9} step={0.1} prefix="$ " />
        </div>
      }
      result={
        result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResultCard label="Net / day" value={`$${result.netPerDay.toFixed(2)}`} type={result.netPerDay >= 0 ? "success" : "warning"} />
              <ResultCard label="Net / year" value={`$${result.netPerYear.toFixed(2)}`} type="default" />
              <ResultCard label="ROI (annual)" value={`${result.roiPercent.toFixed(2)}%`} type="highlight" />
              <ResultCard label="Break-even" value={result.breakEvenDays === null ? "—" : `${result.breakEvenDays.toFixed(0)} days`} type="default" />
            </div>
          </div>
        )
      }
    />
  )
}

function hashMultiplier(unit: string) {
  const u = (unit || "").toUpperCase()
  if (u.startsWith("KH")) return 1e3
  if (u.startsWith("MH")) return 1e6
  if (u.startsWith("GH")) return 1e9
  if (u.startsWith("TH")) return 1e12
  if (u.startsWith("PH")) return 1e15
  if (u.startsWith("EH")) return 1e18
  return 1
}

export function HashRateConverter() {
  const [value, setValue] = useState(100)
  const [from, setFrom] = useState("TH/s")
  const [to, setTo] = useState("GH/s")
  const [result, setResult] = useState<null | { out: number }>(null)

  const calculate = () => {
    const v = clampNumber(value, 0, 1e30)
    const base = v * hashMultiplier(from)
    const out = base / hashMultiplier(to)
    setResult({ out })
  }

  const unitSelect = (label: string, v: string, setV: (x: string) => void) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
      >
        {[
          "H/s",
          "kH/s",
          "MH/s",
          "GH/s",
          "TH/s",
          "PH/s",
          "EH/s",
        ].map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <FinancialCalculatorTemplate
      title="Hash Rate Converter"
      description="Convert mining hash rates across H/s, kH/s, MH/s, GH/s, TH/s, PH/s and EH/s."
      icon={Calculator}
      calculate={calculate}
      values={[value, from, to]}
      onClear={() => {
        setValue(100)
        setFrom("TH/s")
        setTo("GH/s")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setValue(Number(vals?.[0] ?? 100))
        setFrom(String(vals?.[1] ?? "TH/s"))
        setTo(String(vals?.[2] ?? "GH/s"))
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputGroup label="Value" value={value} onChange={setValue} min={0} max={1e30} step={1} />
          {unitSelect("From", from, setFrom)}
          {unitSelect("To", to, setTo)}
          <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">Base unit is H/s.</div>
        </div>
      }
      result={result && <ResultCard label="Converted" value={result.out.toFixed(6)} type="highlight" />}
    />
  )
}

export function SatoshiConverter() {
  const [btc, setBtc] = useState(0.01)
  const [sats, setSats] = useState(1_000_000)
  const [mode, setMode] = useState<"btcToSats" | "satsToBtc">("btcToSats")
  const [result, setResult] = useState<null | { out: number }>(null)

  const calculate = () => {
    if (mode === "btcToSats") {
      const b = clampNumber(btc, 0, 1e18)
      setResult({ out: b * 100_000_000 })
    } else {
      const s = clampNumber(sats, 0, 1e30)
      setResult({ out: s / 100_000_000 })
    }
  }

  return (
    <FinancialCalculatorTemplate
      title="Satoshi Converter"
      description="Convert between BTC and satoshis."
      icon={Calculator}
      calculate={calculate}
      values={[btc, sats, mode]}
      onClear={() => {
        setBtc(0.01)
        setSats(1_000_000)
        setMode("btcToSats")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setBtc(Number(vals?.[0] ?? 0.01))
        setSats(Number(vals?.[1] ?? 1_000_000))
        const m = String(vals?.[2] ?? "btcToSats")
        setMode((m === "satsToBtc" ? "satsToBtc" : "btcToSats") as any)
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                <option value="btcToSats">BTC → sats</option>
                <option value="satsToBtc">sats → BTC</option>
              </select>
            </div>
            <InputGroup label="BTC" value={btc} onChange={setBtc} min={0} max={1e18} step={0.00000001} />
            <InputGroup label="Sats" value={sats} onChange={setSats} min={0} max={1e30} step={1} />
          </div>
        </div>
      }
      result={result && <ResultCard label="Result" value={result.out.toFixed(mode === "btcToSats" ? 0 : 8)} type="highlight" />}
    />
  )
}

export function WeiConverter() {
  const [eth, setEth] = useState(1)
  const [wei, setWei] = useState(1e18)
  const [mode, setMode] = useState<"ethToWei" | "weiToEth">("ethToWei")
  const [result, setResult] = useState<null | { out: number }>(null)

  const calculate = () => {
    if (mode === "ethToWei") {
      const e = clampNumber(eth, 0, 1e18)
      setResult({ out: e * 1e18 })
    } else {
      const w = clampNumber(wei, 0, 1e40)
      setResult({ out: w / 1e18 })
    }
  }

  return (
    <FinancialCalculatorTemplate
      title="Wei Converter"
      description="Convert between ETH and wei (1 ETH = 1e18 wei)."
      icon={Calculator}
      calculate={calculate}
      values={[eth, wei, mode]}
      onClear={() => {
        setEth(1)
        setWei(1e18)
        setMode("ethToWei")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setEth(Number(vals?.[0] ?? 1))
        setWei(Number(vals?.[1] ?? 1e18))
        const m = String(vals?.[2] ?? "ethToWei")
        setMode((m === "weiToEth" ? "weiToEth" : "ethToWei") as any)
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="ethToWei">ETH → wei</option>
              <option value="weiToEth">wei → ETH</option>
            </select>
          </div>
          <InputGroup label="ETH" value={eth} onChange={setEth} min={0} max={1e18} step={0.00000001} />
          <InputGroup label="Wei" value={wei} onChange={setWei} min={0} max={1e40} step={1} />
        </div>
      }
      result={result && <ResultCard label="Result" value={result.out.toFixed(mode === "ethToWei" ? 0 : 18)} type="highlight" />}
    />
  )
}

export function GweiConverter() {
  const [gwei, setGwei] = useState(1)
  const [eth, setEth] = useState(0.000000001)
  const [wei, setWei] = useState(1e9)
  const [mode, setMode] = useState<"gweiToEth" | "ethToGwei" | "gweiToWei" | "weiToGwei">("gweiToEth")
  const [result, setResult] = useState<null | { out: number }>(null)

  const calculate = () => {
    if (mode === "gweiToEth") {
      setResult({ out: clampNumber(gwei, 0, 1e30) * 1e-9 })
      return
    }
    if (mode === "ethToGwei") {
      setResult({ out: clampNumber(eth, 0, 1e18) * 1e9 })
      return
    }
    if (mode === "gweiToWei") {
      setResult({ out: clampNumber(gwei, 0, 1e30) * 1e9 })
      return
    }
    setResult({ out: clampNumber(wei, 0, 1e40) / 1e9 })
  }

  return (
    <FinancialCalculatorTemplate
      title="Gwei Converter"
      description="Convert between gwei, ETH and wei."
      icon={Calculator}
      calculate={calculate}
      values={[gwei, eth, wei, mode]}
      onClear={() => {
        setGwei(1)
        setEth(0.000000001)
        setWei(1e9)
        setMode("gweiToEth")
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setGwei(Number(vals?.[0] ?? 1))
        setEth(Number(vals?.[1] ?? 0.000000001))
        setWei(Number(vals?.[2] ?? 1e9))
        const m = String(vals?.[3] ?? "gweiToEth")
        const allowed = ["gweiToEth", "ethToGwei", "gweiToWei", "weiToGwei"]
        setMode((allowed.includes(m) ? (m as any) : "gweiToEth") as any)
      }}
      inputs={
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="gweiToEth">gwei → ETH</option>
              <option value="ethToGwei">ETH → gwei</option>
              <option value="gweiToWei">gwei → wei</option>
              <option value="weiToGwei">wei → gwei</option>
            </select>
          </div>
          <InputGroup label="gwei" value={gwei} onChange={setGwei} min={0} max={1e30} step={0.1} />
          <InputGroup label="ETH" value={eth} onChange={setEth} min={0} max={1e18} step={0.000000001} />
          <InputGroup label="wei" value={wei} onChange={setWei} min={0} max={1e40} step={1} />
        </div>
      }
      result={result && <ResultCard label="Result" value={result.out.toFixed(18)} type="highlight" />}
    />
  )
}

export function ForexPipAdvancedCalculator() {
  const [pair, setPair] = useState("EURUSD")
  const [accountCurrency, setAccountCurrency] = useState("USD")
  const [entry, setEntry] = useState(1.1)
  const [stop, setStop] = useState(1.095)
  const [lots, setLots] = useState(1)
  const [quoteToAccountRate, setQuoteToAccountRate] = useState(1)
  const [result, setResult] = useState<null | {
    pipSize: number
    pips: number
    pipValue: number | null
    risk: number | null
  }>(null)

  const calculate = () => {
    const safeLots = clampNumber(lots, 0.01, 100000)
    const units = Math.round(safeLots * 100000)
    const safeEntry = clampNumber(entry, 0.0000001, 1e12)
    const safeStop = clampNumber(stop, 0.0000001, 1e12)
    const pipSize = getDefaultPipSize(pair)
    const pips = Math.abs(safeEntry - safeStop) / pipSize
    const pipValue = computePipValueInAccountCurrency({
      units,
      pipSize,
      price: safeEntry,
      accountCurrency,
      pair,
      quoteToAccountRate,
    })
    const risk = pipValue === null ? null : pips * pipValue
    setResult({ pipSize, pips, pipValue, risk })
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Pip (Advanced)"
      description="Compute pip size, pip distance, pip value and risk between entry and stop for a given lot size."
      icon={Calculator}
      calculate={calculate}
      values={[pair, accountCurrency, entry, stop, lots, quoteToAccountRate]}
      onClear={() => {
        setPair("EURUSD")
        setAccountCurrency("USD")
        setEntry(1.1)
        setStop(1.095)
        setLots(1)
        setQuoteToAccountRate(1)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPair(String(vals?.[0] ?? "EURUSD"))
        setAccountCurrency(String(vals?.[1] ?? "USD"))
        setEntry(Number(vals?.[2] ?? 1.1))
        setStop(Number(vals?.[3] ?? 1.095))
        setLots(Number(vals?.[4] ?? 1))
        setQuoteToAccountRate(Number(vals?.[5] ?? 1))
      }}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pair</label>
              <input
                value={pair}
                onChange={(e) => setPair((e.target.value || "").replace(/\s+/g, "").toUpperCase())}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
                placeholder="EURUSD"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account currency</label>
              <input
                value={accountCurrency}
                onChange={(e) => setAccountCurrency((e.target.value || "").trim().toUpperCase())}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
                placeholder="USD"
              />
            </div>
            <InputGroup label="Entry" value={entry} onChange={setEntry} min={0.0000001} max={1e12} step={0.0001} />
            <InputGroup label="Stop" value={stop} onChange={setStop} min={0.0000001} max={1e12} step={0.0001} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Lots" value={lots} onChange={setLots} min={0.01} max={100000} step={0.01} />
            <InputGroup label="Quote → account rate" value={quoteToAccountRate} onChange={setQuoteToAccountRate} min={0.0000001} max={1e12} step={0.0001} />
            <div className="bg-secondary/50 p-4 rounded-xl text-sm text-muted-foreground">
              If account currency ≠ quote currency, provide quote→account rate.
            </div>
          </div>
        </div>
      }
      result={
        result && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard label="Pip size" value={result.pipSize.toString()} type="default" />
            <ResultCard label="Distance" value={`${result.pips.toFixed(1)} pips`} type="highlight" />
            <ResultCard label="Pip value" value={result.pipValue === null ? "—" : result.pipValue.toFixed(4)} type="default" />
            <ResultCard label="Risk" value={result.risk === null ? "—" : result.risk.toFixed(2)} type={result.risk === null ? "default" : "warning"} />
          </div>
        )
      }
    />
  )
}
