"use client"
import { useState } from "react"
import { RefreshCw, Bitcoin, TrendingUp, Globe, Coins, ArrowRightLeft } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { CurrencyConverterSeoContent } from "@/components/calculators/seo/CurrencySeo"

export function CurrencyConverter() {
  const [amount, setAmount] = useState(1000)
  const [from, setFrom] = useState('INR')
  const [to, setTo] = useState('USD')
  const [result, setResult] = useState<any>(null)

  const rates: any = {
    INR: 1, USD: 83.12, EUR: 90.25, GBP: 104.50, AED: 22.63, SAR: 22.16,
    AUD: 54.89, CAD: 61.23, SGD: 61.78, JPY: 0.56
  }

  const calculate = () => {
    const inINR = amount * rates[from]
    const converted = inINR / rates[to]
    setResult({ converted: converted.toFixed(2), rate: (rates[to] / rates[from]).toFixed(4) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Currency Converter"
      description="Convert between major world currencies with live exchange rates."
      icon={RefreshCw}
      calculate={calculate}
      values={[amount, from, to]}
      seoContent={<CurrencyConverterSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Amount"
            value={amount}
            onChange={setAmount}
            min={1}
            max={1000000}
            step={100}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select 
                value={from} 
                onChange={(e) => setFrom(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select 
                value={to} 
                onChange={(e) => setTo(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              >
                {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="bg-primary/10 p-6 rounded-xl text-center border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">{amount} {from} =</p>
            <p className="text-4xl font-bold text-primary">{result.converted} {to}</p>
          </div>
          <div className="bg-secondary/50 p-4 rounded-xl text-center">
            <p className="text-sm">Exchange Rate: 1 {from} = {result.rate} {to}</p>
          </div>
        </div>
      )}
    />
  )
}

export function CryptoProfitLoss() {
  const [buy, setBuy] = useState(30000)
  const [sell, setSell] = useState(35000)
  const [quantity, setQuantity] = useState(0.5)
  const [fees, setFees] = useState(1)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const invested = buy * quantity
    const returns = sell * quantity
    const fee = (invested + returns) * (fees/100)
    const profit = returns - invested - fee
    const percentage = (profit / invested) * 100
    setResult({ profit: profit.toFixed(2), percentage: percentage.toFixed(2), fee: fee.toFixed(2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Crypto Profit/Loss Calculator"
      description="Calculate your profit or loss from cryptocurrency trades including fees."
      icon={Bitcoin}
      calculate={calculate}
      values={[buy, sell, quantity, fees]}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Buy Price"
            value={buy}
            onChange={setBuy}
            min={100}
            max={5000000}
            step={100}
            prefix="₹"
          />
          <InputGroup
            label="Sell Price"
            value={sell}
            onChange={setSell}
            min={100}
            max={5000000}
            step={100}
            prefix="₹"
          />
          <InputGroup
            label="Quantity"
            value={quantity}
            onChange={setQuantity}
            min={0.01}
            max={10}
            step={0.01}
          />
          <InputGroup
            label="Trading Fee"
            value={fees}
            onChange={setFees}
            min={0}
            max={5}
            step={0.1}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Profit/Loss"
            value={`₹${result.profit}`}
            type={parseFloat(result.profit) >= 0 ? "success" : "warning"}
          />
          <ResultCard
            label="Return %"
            value={`${result.percentage}%`}
            type="highlight"
          />
          <div className="md:col-span-2">
            <ResultCard
              label="Trading Fees"
              value={`₹${result.fee}`}
              type="default"
            />
          </div>
        </div>
      )}
    />
  )
}

export function ForexMargin() {
  const [lotSize, setLotSize] = useState(1)
  const [leverage, setLeverage] = useState(100)
  const [currency, setCurrency] = useState('USDINR')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const prices: any = { USDINR: 83.12, EURINR: 90.25, GBPINR: 104.50 }
    const contractValue = 1000 * lotSize * prices[currency]
    const margin = contractValue / leverage
    setResult({ contractValue: Math.round(contractValue), margin: Math.round(margin) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Forex Margin Calculator"
      description="Calculate required margin for forex trades based on leverage."
      icon={TrendingUp}
      calculate={calculate}
      values={[lotSize, leverage, currency]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency Pair</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="USDINR">USD/INR</option>
              <option value="EURINR">EUR/INR</option>
              <option value="GBPINR">GBP/INR</option>
            </select>
          </div>
          <InputGroup
            label="Lot Size"
            value={lotSize}
            onChange={setLotSize}
            min={1}
            max={100}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Leverage</label>
            <select 
              value={leverage} 
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="50">1:50</option>
              <option value="100">1:100</option>
              <option value="200">1:200</option>
              <option value="500">1:500</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Contract Value"
            value={`₹${result.contractValue.toLocaleString('en-IN')}`}
            type="default"
          />
          <ResultCard
            label="Required Margin"
            value={`₹${result.margin.toLocaleString('en-IN')}`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function BitcoinConverter() {
  const [btc, setBtc] = useState(0.1)
  const [price, setPrice] = useState(3500000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const inr = btc * price
    const usd = inr / 83.12
    setResult({ inr: Math.round(inr), usd: Math.round(usd) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Bitcoin Converter"
      description="Convert Bitcoin to INR and USD based on current market price."
      icon={Bitcoin}
      calculate={calculate}
      values={[btc, price]}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Bitcoin Amount"
            value={btc}
            onChange={setBtc}
            min={0.001}
            max={10}
            step={0.001}
            suffix=" BTC"
          />
          <InputGroup
            label="BTC Price (INR)"
            value={price}
            onChange={setPrice}
            min={1000000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Value in INR"
            value={`₹${result.inr.toLocaleString('en-IN')}`}
            type="highlight"
          />
          <ResultCard
            label="Value in USD"
            value={`$${result.usd.toLocaleString('en-US')}`}
            type="success"
          />
        </div>
      )}
    />
  )
}

export function ExchangeRateImpact() {
  const [amount, setAmount] = useState(100000)
  const [oldRate, setOldRate] = useState(80)
  const [newRate, setNewRate] = useState(83)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const oldValue = amount / oldRate
    const newValue = amount / newRate
    const impact = newValue - oldValue
    const percentage = ((newValue - oldValue) / oldValue) * 100
    setResult({ oldValue: Math.round(oldValue), newValue: Math.round(newValue), impact: Math.round(impact), percentage: percentage.toFixed(2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Exchange Rate Impact"
      description="Calculate how exchange rate fluctuations affect your money."
      icon={ArrowRightLeft}
      calculate={calculate}
      values={[amount, oldRate, newRate]}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Amount (INR)"
            value={amount}
            onChange={setAmount}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Old Exchange Rate"
            value={oldRate}
            onChange={setOldRate}
            min={60}
            max={100}
            step={0.1}
            prefix="₹"
          />
          <InputGroup
            label="New Exchange Rate"
            value={newRate}
            onChange={setNewRate}
            min={60}
            max={100}
            step={0.1}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Old Value (USD)"
            value={`$${result.oldValue}`}
            type="default"
          />
          <ResultCard
            label="New Value (USD)"
            value={`$${result.newValue}`}
            type="default"
          />
          <ResultCard
            label="Impact"
            value={`$${result.impact}`}
            type={result.impact >= 0 ? "success" : "warning"}
          />
          <ResultCard
            label="Change %"
            value={`${result.percentage}%`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function ImportExportDuty() {
  const [value, setValue] = useState(100000)
  const [dutyRate, setDutyRate] = useState(10)
  const [gst, setGst] = useState(18)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const duty = (value * dutyRate) / 100
    const assessable = value + duty
    const gstAmount = (assessable * gst) / 100
    const total = value + duty + gstAmount
    setResult({ duty: Math.round(duty), gstAmount: Math.round(gstAmount), total: Math.round(total) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Import/Export Duty Calculator"
      description="Calculate customs duty, GST, and total landed cost for imports."
      icon={Globe}
      calculate={calculate}
      values={[value, dutyRate, gst]}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Goods Value"
            value={value}
            onChange={setValue}
            min={10000}
            max={5000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Customs Duty"
            value={dutyRate}
            onChange={setDutyRate}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">GST Rate</label>
            <select 
              value={gst} 
              onChange={(e) => setGst(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Customs Duty"
              value={`₹${result.duty.toLocaleString('en-IN')}`}
              type="warning"
            />
            <ResultCard
              label="GST"
              value={`₹${result.gstAmount.toLocaleString('en-IN')}`}
              type="default"
            />
          </div>
          <ResultCard
            label="Total Landed Cost"
            value={`₹${result.total.toLocaleString('en-IN')}`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function GoldSilverPrice() {
  const [grams, setGrams] = useState(10)
  const [metal, setMetal] = useState('gold')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const prices: any = { gold: 6200, silver: 75 }
    const pricePerGram = prices[metal]
    const total = grams * pricePerGram
    const makingCharge = total * 0.15
    const gst = (total + makingCharge) * 0.03
    const final = total + makingCharge + gst
    setResult({ price: Math.round(total), making: Math.round(makingCharge), gst: Math.round(gst), final: Math.round(final) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Gold/Silver Price Calculator"
      description="Calculate the final price of gold or silver including making charges and GST."
      icon={Coins}
      calculate={calculate}
      values={[grams, metal]}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Metal Type</label>
            <select 
              value={metal} 
              onChange={(e) => setMetal(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="gold">Gold (24K)</option>
              <option value="silver">Silver</option>
            </select>
          </div>
          <InputGroup
            label="Quantity"
            value={grams}
            onChange={setGrams}
            min={1}
            max={500}
            suffix="g"
          />
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Base Price"
              value={`₹${result.price.toLocaleString('en-IN')}`}
              type="default"
            />
            <ResultCard
              label="Making Charges (15%)"
              value={`₹${result.making.toLocaleString('en-IN')}`}
              type="warning"
            />
            <ResultCard
              label="GST (3%)"
              value={`₹${result.gst.toLocaleString('en-IN')}`}
              type="default"
            />
          </div>
          <ResultCard
            label="Final Price"
            value={`₹${result.final.toLocaleString('en-IN')}`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function InternationalTransfer() {
  const [amount, setAmount] = useState(100000)
  const [rate, setRate] = useState(83)
  const [fees, setFees] = useState(2)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const transferFee = (amount * fees) / 100
    const netAmount = amount - transferFee
    const received = netAmount / rate
    setResult({ fee: Math.round(transferFee), net: Math.round(netAmount), received: Math.round(received) })
  }

  return (
    <FinancialCalculatorTemplate
      title="International Money Transfer"
      description="Calculate fees and final amount received for international transfers."
      icon={Globe}
      calculate={calculate}
      values={[amount, rate, fees]}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Amount (INR)"
            value={amount}
            onChange={setAmount}
            min={10000}
            max={1000000}
            step={1000}
            prefix="₹"
          />
          <InputGroup
            label="Exchange Rate (₹/$)"
            value={rate}
            onChange={setRate}
            min={70}
            max={95}
            step={0.1}
            prefix="₹"
          />
          <InputGroup
            label="Transfer Fee"
            value={fees}
            onChange={setFees}
            min={0}
            max={5}
            step={0.1}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            label="Transfer Fee"
            value={`₹${result.fee.toLocaleString('en-IN')}`}
            type="warning"
          />
          <ResultCard
            label="Net Amount"
            value={`₹${result.net.toLocaleString('en-IN')}`}
            type="default"
          />
          <ResultCard
            label="Received (USD)"
            value={`$${result.received}`}
            type="success"
          />
        </div>
      )}
    />
  )
}
