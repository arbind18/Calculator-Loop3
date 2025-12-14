"use client"

import { useState } from "react"
import { Banknote, Calendar, CalendarDays, Percent, Fuel, Scale, Clock } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import {
  TipSeoContent,
  AgeSeoContent,
  FuelCostSeoContent,
  DateDifferenceSeoContent,
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
      seoContent={<TipSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Bill Amount" value={bill} onChange={setBill} prefix="₹" min={0} max={100000} />
          <InputGroup label="Tip Percentage" value={tip} onChange={setTip} suffix="%" min={0} max={100} />
          <InputGroup label="Number of People" value={people} onChange={setPeople} min={1} max={100} />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Tip Amount" value={result.tipAmount} prefix="₹" type="default" />
          <ResultCard label="Total Bill" value={result.total} prefix="₹" type="highlight" />
          <ResultCard label="Per Person" value={result.perPerson} prefix="₹" type="success" />
        </div>
      )}
    />
  )
}

export function AgeCalculator() {
  const [dob, setDob] = useState('2000-01-01')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const birth = new Date(dob)
    const today = new Date()
    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()
    
    if (days < 0) {
      months--
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }
    
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const totalMonths = years * 12 + months
    
    setResult({ years, months, days, totalDays, totalMonths })
  }

  return (
    <FinancialCalculatorTemplate
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days."
      icon={Calendar}
      calculate={calculate}
      values={[dob]}
      seoContent={<AgeSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
            <div className="relative">
              <input 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                className="w-full p-4 rounded-xl bg-secondary/20 border border-transparent hover:border-primary/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-lg"
              />
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard 
            label="Your Age" 
            value={`${result.years} Years, ${result.months} Months, ${result.days} Days`} 
            type="highlight" 
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard label="Total Months" value={result.totalMonths} type="default" />
            <ResultCard label="Total Days" value={result.totalDays} type="default" />
          </div>
        </div>
      )}
    />
  )
}

export function DateDifferenceCalculator() {
  const [from, setFrom] = useState('2024-01-01')
  const [to, setTo] = useState('2024-12-31')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const start = new Date(from)
    const end = new Date(to)
    const diff = Math.abs(end.getTime() - start.getTime())
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30.44)
    const years = Math.floor(days / 365.25)
    setResult({ days, weeks, months, years })
  }

  return (
    <FinancialCalculatorTemplate
      title="Date Difference Calculator"
      description="Calculate the number of days between two dates."
      icon={CalendarDays}
      calculate={calculate}
      values={[from, to]}
      seoContent={<DateDiffSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">From Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={from} 
                  onChange={(e) => setFrom(e.target.value)} 
                  className="w-full p-4 rounded-xl bg-secondary/20 border border-transparent hover:border-primary/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">To Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)} 
                  className="w-full p-4 rounded-xl bg-secondary/20 border border-transparent hover:border-primary/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="Days" value={result.days} type="highlight" />
          <ResultCard label="Weeks" value={result.weeks} type="default" />
          <ResultCard label="Months (approx)" value={result.months} type="default" />
          <ResultCard label="Years (approx)" value={result.years} type="default" />
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
      seoContent={<PercentageSeoContent />}
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
      seoContent={<FuelCostSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Distance" value={distance} onChange={setDistance} suffix="km" min={1} max={10000} />
          <InputGroup label="Mileage" value={mileage} onChange={setMileage} suffix="km/L" min={1} max={100} />
          <InputGroup label="Fuel Price" value={price} onChange={setPrice} prefix="₹" suffix="/L" min={1} max={200} />
        </div>
      }
      result={result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ResultCard label="Total Cost" value={result.cost} prefix="₹" type="highlight" />
          <ResultCard label="Fuel Needed" value={result.fuel} suffix="L" type="default" />
          <ResultCard label="Cost per km" value={result.perKm} prefix="₹" type="default" />
        </div>
      )}
    />
  )
}

export function BMICalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    let category = ''
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'
    setResult({ bmi: bmi.toFixed(1), category })
  }

  return (
    <FinancialCalculatorTemplate
      title="BMI Calculator"
      description="Calculate your Body Mass Index."
      icon={Scale}
      calculate={calculate}
      values={[weight, height]}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Weight" value={weight} onChange={setWeight} suffix="kg" min={10} max={300} />
          <InputGroup label="Height" value={height} onChange={setHeight} suffix="cm" min={50} max={300} />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard label="Your BMI" value={result.bmi} type="highlight" />
          <ResultCard 
            label="Category" 
            value={result.category} 
            type={result.category === 'Normal' ? 'success' : 'warning'} 
          />
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
      seoContent={<DatePlusDurationSeoContent />}
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
