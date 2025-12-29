"use client"
import { useState } from "react"
import { PiggyBank, HandCoins, TrendingDown, Percent, TrendingUp } from "lucide-react"
import { generateReport } from "@/lib/downloadUtils"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import {
  PPFSeoContent,
  LumpsumSeoContent,
  InflationSeoContent
} from "@/components/calculators/seo/InvestmentSeo"
import { CompoundInterestSeoContent } from "@/components/calculators/seo/BankingSeo"

export function PPFCalculator() {
  const [yearly, setYearly] = useState(100000)
  const [years, setYears] = useState(15)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const rate = 0.071 // Current PPF rate
    let corpus = 0
    for (let i = 1; i <= years; i++) {
      corpus = (corpus + yearly) * (1 + rate)
    }
    const invested = yearly * years
    const interest = corpus - invested
    setResult({ 
      corpus: Math.round(corpus), 
      invested, 
      interest: Math.round(interest) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="PPF Calculator"
      description="Calculate Public Provident Fund maturity amount and interest."
      icon={PiggyBank}
      calculate={calculate}
      values={[yearly, years]}
      onClear={() => {
        setYearly(100000)
        setYears(15)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setYearly(Number(vals?.[0] ?? 100000))
        setYears(Number(vals?.[1] ?? 15))
      }}
      seoContent={<PPFSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Yearly Investment"
            value={yearly}
            onChange={setYearly}
            min={500}
            max={150000}
            step={500}
            prefix="₹"
            helpText="Max ₹1.5 Lakh per year"
          />
          <InputGroup
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={15}
            max={50}
            suffix=" years"
            helpText="Min 15 years lock-in"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Invested" value={`₹${result.invested.toLocaleString('en-IN')}`} />
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Maturity Value" value={`₹${result.corpus.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function LumpsumCalculator() {
  const [amount, setAmount] = useState(500000)
  const [years, setYears] = useState(10)
  const [returns, setReturns] = useState(12)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const maturity = amount * Math.pow(1 + returns/100, years)
    const profit = maturity - amount
    setResult({ 
      maturity: Math.round(maturity), 
      profit: Math.round(profit) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Lumpsum Investment Calculator"
      description="Calculate returns on your one-time investment."
      icon={HandCoins}
      calculate={calculate}
      values={[amount, years, returns]}
      onClear={() => {
        setAmount(500000)
        setYears(10)
        setReturns(12)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setAmount(Number(vals?.[0] ?? 500000))
        setYears(Number(vals?.[1] ?? 10))
        setReturns(Number(vals?.[2] ?? 12))
      }}
      seoContent={<LumpsumSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Investment Amount"
            value={amount}
            onChange={setAmount}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Investment Period"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            suffix=" years"
          />
          <InputGroup
            label="Expected Returns"
            value={returns}
            onChange={setReturns}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Total Profit" value={`₹${result.profit.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Maturity Value" value={`₹${result.maturity.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function InflationImpact() {
  const [amount, setAmount] = useState(100000)
  const [years, setYears] = useState(10)
  const [inflation, setInflation] = useState(6)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const future = amount * Math.pow(1 + inflation/100, years)
    const purchasing = amount / Math.pow(1 + inflation/100, years)
    const loss = amount - purchasing
    setResult({ 
      future: Math.round(future), 
      purchasing: Math.round(purchasing), 
      loss: Math.round(loss) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Inflation Impact Calculator"
      description="Calculate how inflation affects your money's purchasing power."
      icon={TrendingDown}
      calculate={calculate}
      values={[amount, years, inflation]}
      onClear={() => {
        setAmount(100000)
        setYears(10)
        setInflation(6)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setAmount(Number(vals?.[0] ?? 100000))
        setYears(Number(vals?.[1] ?? 10))
        setInflation(Number(vals?.[2] ?? 6))
      }}
      seoContent={<InflationSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Current Amount"
            value={amount}
            onChange={setAmount}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            suffix=" years"
          />
          <InputGroup
            label="Inflation Rate"
            value={inflation}
            onChange={setInflation}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="bg-orange-500/10 p-6 rounded-xl text-center border border-orange-500/20">
            <p className="text-sm text-muted-foreground mb-2">Future cost of today's ₹{amount.toLocaleString('en-IN')}</p>
            <p className="text-3xl font-bold text-orange-500">₹{result.future.toLocaleString('en-IN')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label="Purchasing Power" value={`₹${result.purchasing.toLocaleString('en-IN')}`} subtext="Value after inflation" />
            <ResultCard label="Value Loss" value={`₹${result.loss.toLocaleString('en-IN')}`} type="warning" />
          </div>
        </div>
      )}
    />
  )
}

export function CompoundInterestInvestment() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(5)
  const [frequency, setFrequency] = useState(12)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const amount = principal * Math.pow(1 + (rate/100)/frequency, frequency * years)
    const interest = amount - principal
    setResult({ 
      amount: Math.round(amount), 
      interest: Math.round(interest) 
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Compound Interest Calculator"
      description="Calculate compound interest with different compounding frequencies."
      icon={Percent}
      calculate={calculate}
      values={[principal, rate, years, frequency]}
      onClear={() => {
        setPrincipal(100000)
        setRate(8)
        setYears(5)
        setFrequency(12)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setPrincipal(Number(vals?.[0] ?? 100000))
        setRate(Number(vals?.[1] ?? 8))
        setYears(Number(vals?.[2] ?? 5))
        setFrequency(Number(vals?.[3] ?? 12))
      }}
      seoContent={<CompoundInterestSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <InputGroup
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            suffix=" years"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Compounding Frequency</label>
            <select 
              value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="1">Yearly</option>
              <option value="2">Half-Yearly</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard label="Interest Earned" value={`₹${result.interest.toLocaleString('en-IN')}`} type="success" />
          <ResultCard label="Total Amount" value={`₹${result.amount.toLocaleString('en-IN')}`} type="highlight" />
        </div>
      )}
    />
  )
}

export function DividendYield() {
  const [sharePrice, setSharePrice] = useState(500)
  const [dividendPerShare, setDividendPerShare] = useState(20)

  const yieldPercent = (dividendPerShare / sharePrice) * 100

  return (
    <FinancialCalculatorTemplate
      title="Dividend Yield Calculator"
      description="Calculate the dividend yield of a stock."
      icon={TrendingUp}
      calculate={() => {}}
      values={[sharePrice, dividendPerShare]}
      onClear={() => {
        setSharePrice(500)
        setDividendPerShare(20)
      }}
      onRestoreAction={(vals) => {
        setSharePrice(Number(vals?.[0] ?? 500))
        setDividendPerShare(Number(vals?.[1] ?? 20))
      }}
      onDownload={(format) => generateReport(format, 'dividend_yield', ['Item', 'Value'], [['Yield', `${yieldPercent.toFixed(2)}%`]], 'Dividend Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Current Share Price" value={sharePrice} onChange={setSharePrice} prefix="₹" />
          <InputGroup label="Annual Dividend Per Share" value={dividendPerShare} onChange={setDividendPerShare} prefix="₹" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Dividend Yield</div>
          <div className="text-4xl font-bold text-primary">{yieldPercent.toFixed(2)}%</div>
        </div>
      }
    />
  )
}

export function StockReturn() {
  const [buyPrice, setBuyPrice] = useState(100)
  const [sellPrice, setSellPrice] = useState(150)
  const [quantity, setQuantity] = useState(100)
  const [dividends, setDividends] = useState(0)

  const calculate = () => {
    const investment = buyPrice * quantity
    const revenue = sellPrice * quantity
    const profit = revenue - investment + dividends
    const roi = (profit / investment) * 100
    return { profit: Math.round(profit), roi: roi.toFixed(2) }
  }

  const { profit, roi } = calculate()

  return (
    <FinancialCalculatorTemplate
      title="Stock Return Calculator"
      description="Calculate total profit and ROI from stock trading."
      icon={TrendingUp}
      calculate={() => {}}
      values={[buyPrice, sellPrice, quantity, dividends]}
      onClear={() => {
        setBuyPrice(100)
        setSellPrice(150)
        setQuantity(100)
        setDividends(0)
      }}
      onRestoreAction={(vals) => {
        setBuyPrice(Number(vals?.[0] ?? 100))
        setSellPrice(Number(vals?.[1] ?? 150))
        setQuantity(Number(vals?.[2] ?? 100))
        setDividends(Number(vals?.[3] ?? 0))
      }}
      onDownload={(format) => generateReport(format, 'stock_return', ['Item', 'Value'], [['Profit', `₹${profit}`], ['ROI', `${roi}%`]], 'Stock Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Buy Price" value={buyPrice} onChange={setBuyPrice} prefix="₹" />
          <InputGroup label="Sell Price" value={sellPrice} onChange={setSellPrice} prefix="₹" />
          <InputGroup label="Quantity" value={quantity} onChange={setQuantity} />
          <InputGroup label="Total Dividends Received" value={dividends} onChange={setDividends} prefix="₹" />
        </div>
      }
      result={
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600">Total Profit</div>
            <div className="text-2xl font-bold text-green-700">₹{profit.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">ROI</div>
            <div className="text-2xl font-bold text-blue-700">{roi}%</div>
          </div>
        </div>
      }
    />
  )
}

export function BondYield() {
  const [faceValue, setFaceValue] = useState(1000)
  const [couponRate, setCouponRate] = useState(8)
  const [marketPrice, setMarketPrice] = useState(950)

  const annualCoupon = faceValue * (couponRate / 100)
  const currentYield = (annualCoupon / marketPrice) * 100

  return (
    <FinancialCalculatorTemplate
      title="Bond Yield Calculator"
      description="Calculate Current Yield of a bond."
      icon={TrendingUp}
      calculate={() => {}}
      values={[faceValue, couponRate, marketPrice]}
      onClear={() => {
        setFaceValue(1000)
        setCouponRate(8)
        setMarketPrice(950)
      }}
      onRestoreAction={(vals) => {
        setFaceValue(Number(vals?.[0] ?? 1000))
        setCouponRate(Number(vals?.[1] ?? 8))
        setMarketPrice(Number(vals?.[2] ?? 950))
      }}
      onDownload={(format) => generateReport(format, 'bond_yield', ['Item', 'Value'], [['Current Yield', `${currentYield.toFixed(2)}%`]], 'Bond Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Face Value" value={faceValue} onChange={setFaceValue} prefix="₹" />
          <InputGroup label="Coupon Rate" value={couponRate} onChange={setCouponRate} suffix="%" />
          <InputGroup label="Current Market Price" value={marketPrice} onChange={setMarketPrice} prefix="₹" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Current Yield</div>
          <div className="text-4xl font-bold text-primary">{currentYield.toFixed(2)}%</div>
        </div>
      }
    />
  )
}
