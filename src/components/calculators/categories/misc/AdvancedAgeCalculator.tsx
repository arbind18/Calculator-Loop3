"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Cake } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { AgeSeoContent } from "@/components/calculators/seo/MiscSeo"

export function AdvancedAgeCalculator() {
  const [dob, setDob] = useState('2000-01-01')
  const [result, setResult] = useState<any>(null)

  const calculateAge = () => {
    const birthDate = new Date(dob)
    const today = new Date()
    
    if (birthDate > today) {
      setResult({ error: "Date of birth cannot be in the future" })
      return
    }

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (days < 0) {
      months--
      // Get days in previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }
    
    if (months < 0) {
      years--
      months += 12
    }

    // Next Birthday
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }
    
    const diffTime = Math.abs(nextBirthday.getTime() - today.getTime())
    const daysToBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
    
    // Total stats
    const totalTime = today.getTime() - birthDate.getTime()
    const totalDays = Math.floor(totalTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalHours = Math.floor(totalTime / (1000 * 60 * 60))
    
    // Day of birth
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayBorn = daysOfWeek[birthDate.getDay()]

    setResult({
      years,
      months,
      days,
      nextBirthday: nextBirthday.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      daysToBirthday,
      totalDays: totalDays.toLocaleString(),
      totalWeeks: totalWeeks.toLocaleString(),
      totalHours: totalHours.toLocaleString(),
      dayBorn
    })
  }

  useEffect(() => {
    calculateAge()
  }, [dob])

  return (
    <FinancialCalculatorTemplate
      title="Advanced Age Calculator"
      description="Calculate your exact age and see interesting facts about your birth date."
      icon={Calendar}
      calculate={calculateAge}
      onClear={() => setDob('2000-01-01')}
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
      result={result && !result.error && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-primary/10 rounded-xl border border-primary/20 text-center space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">You are exactly</p>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {result.years} <span className="text-lg font-normal text-muted-foreground">Years</span> {result.months} <span className="text-lg font-normal text-muted-foreground">Months</span> {result.days} <span className="text-lg font-normal text-muted-foreground">Days</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard 
              label="Next Birthday" 
              value={result.nextBirthday} 
              type="highlight" 
              subtext={`in ${result.daysToBirthday} days`}
              icon={Cake}
            />
            <ResultCard 
              label="Day You Were Born" 
              value={result.dayBorn} 
              type="default" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Weeks</p>
              <p className="font-bold">{result.totalWeeks}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Days</p>
              <p className="font-bold">{result.totalDays}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Hours</p>
              <p className="font-bold">{result.totalHours}</p>
            </div>
          </div>
        </div>
      )}
    />
  )
}
