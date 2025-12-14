"use client"
import { useState } from "react"
import { Briefcase, TrendingUp, Percent, Target, Wallet, Tag, Users } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import {
  MarginSeoContent,
  BreakEvenSeoContent,
  ROISeoContent,
  DiscountSeoContent,
  CPMSeoContent,
  CACSeoContent,
  CLVSeoContent,
  NPVSeoContent,
  VATSeoContent,
  GSTSeoContent
} from "@/components/calculators/seo/BusinessSeo"

export function ProfitMarginCalculator() {
  const [cost, setCost] = useState(1000)
  const [selling, setSelling] = useState(1500)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const profit = selling - cost
    const margin = (profit / selling) * 100
    const markup = (profit / cost) * 100
    setResult({ profit, margin: margin.toFixed(2), markup: markup.toFixed(2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Profit Margin Calculator"
      description="Calculate profit margin, markup percentage, and total profit based on cost and selling price."
      icon={TrendingUp}
      calculate={calculate}
      values={[cost, selling]}
      seoContent={<MarginSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Cost Price"
            value={cost}
            onChange={setCost}
            min={100}
            max={100000}
            step={100}
            prefix="₹"
          />
          <InputGroup
            label="Selling Price"
            value={selling}
            onChange={setSelling}
            min={100}
            max={200000}
            step={100}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            label="Profit"
            value={`₹${result.profit.toLocaleString('en-IN')}`}
            type="success"
          />
          <ResultCard
            label="Margin %"
            value={`${result.margin}%`}
            type="highlight"
          />
          <ResultCard
            label="Markup %"
            value={`${result.markup}%`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function BreakEvenCalculator() {
  const [fixedCost, setFixedCost] = useState(100000)
  const [variableCost, setVariableCost] = useState(50)
  const [sellingPrice, setSellingPrice] = useState(100)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const units = fixedCost / (sellingPrice - variableCost)
    const revenue = units * sellingPrice
    setResult({ units: Math.ceil(units), revenue: Math.round(revenue) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Break-Even Calculator"
      description="Determine the number of units you need to sell to cover your costs."
      icon={Target}
      calculate={calculate}
      values={[fixedCost, variableCost, sellingPrice]}
      seoContent={<BreakEvenSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Fixed Costs"
            value={fixedCost}
            onChange={setFixedCost}
            min={10000}
            max={1000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Variable Cost per Unit"
            value={variableCost}
            onChange={setVariableCost}
            min={10}
            max={1000}
            step={10}
            prefix="₹"
          />
          <InputGroup
            label="Selling Price per Unit"
            value={sellingPrice}
            onChange={setSellingPrice}
            min={50}
            max={2000}
            step={10}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Break-Even Units"
            value={`${result.units}`}
            type="highlight"
          />
          <ResultCard
            label="Break-Even Revenue"
            value={`₹${result.revenue.toLocaleString('en-IN')}`}
            type="success"
          />
        </div>
      )}
    />
  )
}

export function DiscountCalculator() {
  const [price, setPrice] = useState(5000)
  const [discount, setDiscount] = useState(20)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const saved = (price * discount) / 100
    const final = price - saved
    setResult({ saved: Math.round(saved), final: Math.round(final) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Discount Calculator"
      description="Calculate the final price and savings after applying a discount."
      icon={Tag}
      calculate={calculate}
      values={[price, discount]}
      seoContent={<DiscountSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Original Price"
            value={price}
            onChange={setPrice}
            min={100}
            max={100000}
            step={100}
            prefix="₹"
          />
          <InputGroup
            label="Discount Percentage"
            value={discount}
            onChange={setDiscount}
            min={5}
            max={90}
            step={5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="You Save"
            value={`₹${result.saved.toLocaleString('en-IN')}`}
            type="highlight"
          />
          <ResultCard
            label="Final Price"
            value={`₹${result.final.toLocaleString('en-IN')}`}
            type="success"
          />
        </div>
      )}
    />
  )
}

export function ROASCalculator() {
  const [adSpend, setAdSpend] = useState(50000)
  const [revenue, setRevenue] = useState(200000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const roas = revenue / adSpend
    const profit = revenue - adSpend
    const roi = ((revenue - adSpend) / adSpend) * 100
    setResult({ roas: roas.toFixed(2), profit, roi: roi.toFixed(2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="ROAS Calculator"
      description="Calculate Return on Ad Spend (ROAS) and ROI for your marketing campaigns."
      icon={TrendingUp}
      calculate={calculate}
      values={[adSpend, revenue]}
      seoContent={<ROISeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Ad Spend"
            value={adSpend}
            onChange={setAdSpend}
            min={5000}
            max={500000}
            step={5000}
            prefix="₹"
          />
          <InputGroup
            label="Revenue Generated"
            value={revenue}
            onChange={setRevenue}
            min={10000}
            max={2000000}
            step={10000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            label="ROAS"
            value={`${result.roas}:1`}
            type="highlight"
          />
          <ResultCard
            label="Profit"
            value={`₹${result.profit.toLocaleString('en-IN')}`}
            type="success"
          />
          <ResultCard
            label="ROI"
            value={`${result.roi}%`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function WorkingCapital() {
  const [current, setCurrent] = useState(500000)
  const [liabilities, setLiabilities] = useState(300000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const capital = current - liabilities
    const ratio = (current / liabilities).toFixed(2)
    setResult({ capital, ratio })
  }

  return (
    <FinancialCalculatorTemplate
      title="Working Capital Calculator"
      description="Calculate working capital and current ratio to assess short-term financial health."
      icon={Wallet}
      calculate={calculate}
      values={[current, liabilities]}
      seoContent={<NPVSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Current Assets"
            value={current}
            onChange={setCurrent}
            min={50000}
            max={5000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Current Liabilities"
            value={liabilities}
            onChange={setLiabilities}
            min={10000}
            max={3000000}
            step={10000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Working Capital"
            value={`₹${result.capital.toLocaleString('en-IN')}`}
            type="success"
          />
          <ResultCard
            label="Current Ratio"
            value={result.ratio}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function MarkupCalculator() {
  const [cost, setCost] = useState(1000)
  const [markup, setMarkup] = useState(40)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const selling = cost + (cost * markup / 100)
    const profit = selling - cost
    const margin = ((selling - cost) / selling) * 100
    setResult({ selling: Math.round(selling), profit: Math.round(profit), margin: margin.toFixed(2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Markup Calculator"
      description="Calculate selling price and profit margin based on cost and markup percentage."
      icon={Tag}
      calculate={calculate}
      values={[cost, markup]}
      seoContent={<MarginSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Cost Price"
            value={cost}
            onChange={setCost}
            min={100}
            max={100000}
            step={100}
            prefix="₹"
          />
          <InputGroup
            label="Markup Percentage"
            value={markup}
            onChange={setMarkup}
            min={10}
            max={200}
            step={5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard
            label="Selling Price"
            value={`₹${result.selling.toLocaleString('en-IN')}`}
            type="success"
          />
          <ResultCard
            label="Profit"
            value={`₹${result.profit.toLocaleString('en-IN')}`}
            type="highlight"
          />
          <ResultCard
            label="Margin %"
            value={`${result.margin}%`}
            type="highlight"
          />
        </div>
      )}
    />
  )
}

export function CommissionCalculator() {
  const [sales, setSales] = useState(100000)
  const [rate, setRate] = useState(5)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const commission = (sales * rate) / 100
    const net = sales - commission
    setResult({ commission: Math.round(commission), net: Math.round(net) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Commission Calculator"
      description="Calculate sales commission and net revenue."
      icon={Users}
      calculate={calculate}
      values={[sales, rate]}
      seoContent={<MarginSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Sales Amount"
            value={sales}
            onChange={setSales}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
          <InputGroup
            label="Commission Rate"
            value={rate}
            onChange={setRate}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
          />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            label="Commission"
            value={`₹${result.commission.toLocaleString('en-IN')}`}
            type="highlight"
          />
          <ResultCard
            label="Net Revenue"
            value={`₹${result.net.toLocaleString('en-IN')}`}
            type="success"
          />
        </div>
      )}
    />
  )
}
