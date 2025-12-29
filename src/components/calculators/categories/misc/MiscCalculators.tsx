"use client"

import { useState } from "react"
import { Banknote, Percent, Fuel, Clock, Calculator } from "lucide-react"
import { generateReport } from "@/lib/downloadUtils"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { VoiceDateInput } from "@/components/ui/VoiceDateInput"
import { FAQSection, getMiscFAQs } from "@/components/calculators/ui/FAQSection"
import {
  TipSeoContent,
  FuelCostSeoContent,
  DatePlusDurationSeoContent,
  PercentageSeoContent
} from "@/components/calculators/seo/MiscSeo"

export function TipCalculator() {
  const [bill, setBill] = useState(1000)
  const [tip, setTip] = useState(10)
  const [people, setPeople] = useState(2)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const tipAmount = (bill * tip) / 100
    const total = bill + tipAmount
    const perPerson = total / people
    setResult({ tipAmount: Math.round(tipAmount), total: Math.round(total), perPerson: Math.round(perPerson) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Tip Calculator"
      description="Calculate tip amount and split bills easily."
      icon={Banknote}
      calculate={calculate}
      values={[bill, tip, people]}
      seoContent={<FAQSection faqs={getMiscFAQs('tip')} />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Bill Amount" value={bill} onChange={setBill} prefix="₹" min={0} max={100000} />
          <InputGroup label="Tip Percentage" value={tip} onChange={setTip} suffix="%" min={0} max={100} />
          <InputGroup label="Number of People" value={people} onChange={setPeople} min={1} max={100} />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Tip Amount" value={`₹${result.tipAmount}`} type="default" />
          <ResultCard label="Total Bill" value={`₹${result.total}`} type="highlight" />
          <ResultCard label="Per Person" value={`₹${result.perPerson}`} type="success" />
        </div>
      )}
    />
  )
}

export function PercentageCalculator() {
  const [number, setNumber] = useState(500)
  const [percent, setPercent] = useState(20)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const value = (number * percent) / 100
    const total = number + value
    setResult({ value: Math.round(value), total: Math.round(total) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Percentage Calculator"
      description="Calculate percentages easily."
      icon={Percent}
      calculate={calculate}
      values={[number, percent]}
      seoContent={<FAQSection faqs={getMiscFAQs('percentage')} />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Number" value={number} onChange={setNumber} min={0} max={1000000} />
          <InputGroup label="Percentage" value={percent} onChange={setPercent} suffix="%" min={0} max={100} />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard 
            label={`${percent}% of ${number}`} 
            value={result.value} 
            type="highlight" 
          />
          <ResultCard 
            label={`Total (${number} + ${percent}%)`} 
            value={result.total} 
            type="success" 
          />
        </div>
      )}
    />
  )
}

export function FuelCostCalculator() {
  const [distance, setDistance] = useState(100)
  const [mileage, setMileage] = useState(15)
  const [price, setPrice] = useState(100)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const fuelNeeded = distance / mileage
    const cost = fuelNeeded * price
    const costPerKm = cost / distance
    setResult({ fuel: fuelNeeded.toFixed(2), cost: Math.round(cost), perKm: costPerKm.toFixed(2) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Fuel Cost Calculator"
      description="Calculate the fuel cost for your trip."
      icon={Fuel}
      calculate={calculate}
      values={[distance, mileage, price]}
      seoContent={<FAQSection faqs={getMiscFAQs('fuel-cost')} />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Distance" value={distance} onChange={setDistance} suffix="km" min={1} max={10000} />
          <InputGroup label="Mileage" value={mileage} onChange={setMileage} suffix="km/L" min={1} max={100} />
          <InputGroup label="Fuel Price" value={price} onChange={setPrice} prefix="₹" suffix="/L" min={1} max={200} />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Cost" value={`₹${result.cost}`} type="highlight" />
          <ResultCard label="Fuel Needed" value={`${result.fuel} L`} type="default" />
          <ResultCard label="Cost per km" value={`₹${result.perKm}`} type="default" />
        </div>
      )}
    />
  )
}

export function DatePlusDurationCalculator() {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16))
  const [years, setYears] = useState(0)
  const [months, setMonths] = useState(0)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const date = new Date(startDate)
    date.setFullYear(date.getFullYear() + years)
    date.setMonth(date.getMonth() + months)
    date.setDate(date.getDate() + days)
    date.setHours(date.getHours() + hours)
    date.setMinutes(date.getMinutes() + minutes)
    
    setResult({
      date: date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      iso: date.toISOString()
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Date + Duration Calculator"
      description="Add years, months, days, hours, and minutes to a date."
      icon={Clock}
      calculate={calculate}
      values={[startDate, years, months, days, hours, minutes]}
      seoContent={<FAQSection faqs={getMiscFAQs('date-plus-duration')} />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Start Date & Time</label>
            <div className="relative">
              <input 
                type="datetime-local" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="w-full p-4 rounded-xl bg-secondary/20 border border-transparent hover:border-primary/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <InputGroup label="Years" value={years} onChange={setYears} min={-100} max={100} />
             <InputGroup label="Months" value={months} onChange={setMonths} min={-1200} max={1200} />
             <InputGroup label="Days" value={days} onChange={setDays} min={-36500} max={36500} />
             <InputGroup label="Hours" value={hours} onChange={setHours} min={-10000} max={10000} />
             <InputGroup label="Minutes" value={minutes} onChange={setMinutes} min={-100000} max={100000} />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard 
            label="Resulting Date" 
            value={result.date} 
            subtext={result.time}
            type="highlight" 
          />
        </div>
      )}
    />
  )
}

export function ElectricityBill() {
  const [units, setUnits] = useState(250)
  const [rate, setRate] = useState(7)
  const [fixedCharge, setFixedCharge] = useState(100)

  const bill = units * rate + fixedCharge

  return (
    <FinancialCalculatorTemplate
      title="Electricity Bill Estimator"
      description="Estimate your monthly electricity bill."
      icon={Calculator}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'electricity_bill', ['Item', 'Value'], [['Estimated Bill', `₹${bill}`]], 'Bill Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Units Consumed" value={units} onChange={setUnits} />
          <InputGroup label="Rate per Unit" value={rate} onChange={setRate} prefix="₹" step={0.1} />
          <InputGroup label="Fixed Charges" value={fixedCharge} onChange={setFixedCharge} prefix="₹" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Estimated Bill</div>
          <div className="text-4xl font-bold text-primary">₹{bill.toLocaleString()}</div>
        </div>
      }
    />
  )
}

export function WaterBill() {
  const [usage, setUsage] = useState(20) // KL
  const [rate, setRate] = useState(15) // per KL
  const [sewerageCharge, setSewerageCharge] = useState(20) // % of water charge

  const waterCharge = usage * rate
  const sewerage = waterCharge * (sewerageCharge / 100)
  const total = waterCharge + sewerage

  return (
    <FinancialCalculatorTemplate
      title="Water Bill Estimator"
      description="Estimate your monthly water bill."
      icon={Calculator}
      calculate={() => {}}
      onDownload={(format) => generateReport(format, 'water_bill', ['Item', 'Value'], [['Total Bill', `₹${total}`]], 'Bill Report')}
      inputs={
        <div className="space-y-4">
          <InputGroup label="Water Usage (KL)" value={usage} onChange={setUsage} suffix="KL" />
          <InputGroup label="Rate per KL" value={rate} onChange={setRate} prefix="₹" />
          <InputGroup label="Sewerage Charge %" value={sewerageCharge} onChange={setSewerageCharge} suffix="%" />
        </div>
      }
      result={
        <div className="p-6 bg-primary/10 rounded-xl text-center">
          <div className="text-lg text-muted-foreground mb-2">Estimated Bill</div>
          <div className="text-4xl font-bold text-primary">₹{total.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-2">Includes Sewerage Charge</p>
        </div>
      }
    />
  )
}
