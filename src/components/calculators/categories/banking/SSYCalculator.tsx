"use client"

import { useState, useEffect } from "react"
import { Baby, TrendingUp, PieChart as PieChartIcon, Download, ChevronDown, ChevronUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { generateReport } from "@/lib/downloadUtils"

export function SSYCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000)
  const [childAge, setChildAge] = useState(5)
  const [startYear, setStartYear] = useState(new Date().getFullYear())
  const [interestRate, setInterestRate] = useState(8.2) // Current SSY Rate
  
  const [showSchedule, setShowSchedule] = useState(false)
  const [chartView, setChartView] = useState<'growth' | 'breakdown'>('growth')
  const [result, setResult] = useState<any>(null)

  const calculateSSY = () => {
    // SSY Rules:
    // Maturity is 21 years from account opening.
    // Deposits only for first 15 years.
    
    const maturityYears = 21
    const depositYears = 15
    let balance = 0
    let totalInvested = 0
    const schedule = []

    for (let i = 1; i <= maturityYears; i++) {
      const currentYear = startYear + i - 1
      const currentAge = childAge + i - 1
      let deposit = 0
      
      if (i <= depositYears) {
        deposit = yearlyInvestment
        totalInvested += deposit
      }
      
      const openingBalance = balance
      // Interest is compounded annually on (Opening Balance + Deposit)
      
      const interest = (openingBalance + deposit) * (interestRate / 100)
      balance = openingBalance + deposit + interest

      schedule.push({
        year: currentYear,
        age: currentAge,
        openingBalance: Math.round(openingBalance),
        deposit: Math.round(deposit),
        interest: Math.round(interest),
        closingBalance: Math.round(balance),
        investedToDate: Math.round(totalInvested)
      })
    }

    setResult({
      maturityAmount: Math.round(balance),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(balance - totalInvested),
      maturityYear: startYear + maturityYears,
      schedule
    })
  }

  useEffect(() => {
    calculateSSY()
  }, [yearlyInvestment, childAge, interestRate, startYear])

  const handleDownload = (format: string, options?: any) => {
    if (!result) return

    let scheduleData = [...result.schedule]
    
    if (options?.scheduleRange === '1yr') {
        scheduleData = scheduleData.slice(0, 1)
    } else if (options?.scheduleRange === '5yr') {
        scheduleData = scheduleData.slice(0, 5)
    } else if (options?.scheduleRange === 'custom' && options.customRangeStart && options.customRangeEnd) {
        // SSY schedule is 21 years fixed.
        // We can filter by year index (1 to 21) or calendar year.
        // Assuming user enters relative year (1 to 21).
        const start = Math.max(0, options.customRangeStart - 1)
        const end = Math.min(scheduleData.length, options.customRangeEnd)
        scheduleData = scheduleData.slice(start, end)
    }

    const headers = ['Year', 'Age', 'Deposit', 'Interest', 'Balance']
    const data = scheduleData.map((row: any) => [
      row.year,
      row.age,
      row.deposit,
      row.interest,
      row.closingBalance
    ])

    generateReport(format, 'ssy_schedule', headers, data, 'Sukanya Samriddhi Yojana Report', {
      'Yearly Investment': `₹${yearlyInvestment}`,
      'Child Age': `${childAge} Years`,
      'Interest Rate': `${interestRate}%`,
      'Maturity Year': result.maturityYear
    })
  }

  const pieData = result ? [
    { name: 'Total Invested', value: result.totalInvested, color: '#3b82f6' },
    { name: 'Interest Earned', value: result.totalInterest, color: '#ec4899' }
  ] : []

  return (
    <FinancialCalculatorTemplate
      title="Sukanya Samriddhi Yojana (SSY)"
      description="Calculate returns for your daughter's future under the SSY scheme with detailed yearly schedule."
      icon={Baby}
      calculate={calculateSSY}
      onDownload={handleDownload}
      onClear={() => {
        setYearlyInvestment(150000)
        setChildAge(5)
        setStartYear(new Date().getFullYear())
      }}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label="Yearly Investment" 
            value={yearlyInvestment} 
            onChange={setYearlyInvestment} 
            prefix="₹" 
            min={250} 
            max={150000} 
            step={500}
            helpText="Min ₹250, Max ₹1.5L per year" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="Girl Child's Age" 
              value={childAge} 
              onChange={setChildAge} 
              suffix="years" 
              min={0} 
              max={10} 
              helpText="Max age 10 years to open account"
            />
            <InputGroup 
              label="Start Year" 
              value={startYear} 
              onChange={setStartYear} 
              min={2015} 
              max={2050} 
            />
          </div>
          <InputGroup 
            label="Interest Rate" 
            value={interestRate} 
            onChange={setInterestRate} 
            suffix="%" 
            min={0} 
            max={15} 
            step={0.1}
            helpText="Current Govt Rate ~8.2%" 
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label="Maturity Amount"
              value={`₹${result.maturityAmount.toLocaleString()}`}
              type="highlight"
              subtext={`in Year ${result.maturityYear}`}
            />
            <ResultCard
              label="Total Invested"
              value={`₹${result.totalInvested.toLocaleString()}`}
              type="default"
            />
            <ResultCard
              label="Total Interest"
              value={`₹${result.totalInterest.toLocaleString()}`}
              type="highlight"
            />
          </div>

          {/* Charts */}
          <div className="p-4 rounded-xl border bg-card">
            <ChartToggle 
              view={chartView} 
              onChange={setChartView} 
              options={[
                { value: 'growth', label: 'Growth Chart', icon: TrendingUp },
                { value: 'breakdown', label: 'Breakdown', icon: PieChartIcon }
              ]}
            />
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'growth' ? (
                  <AreaChart data={result.schedule}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                    <Tooltip
                      formatter={(value) => {
                        const raw = Array.isArray(value) ? value[0] : value
                        const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                        return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                      }}
                    />
                    <Area type="monotone" dataKey="closingBalance" stroke="#ec4899" fillOpacity={1} fill="url(#colorBalance)" name="Balance" />
                    <Area type="monotone" dataKey="investedToDate" stroke="#94a3b8" fill="none" strokeDasharray="5 5" name="Invested" />
                  </AreaChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => {
                        const raw = Array.isArray(value) ? value[0] : value
                        const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                        return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                      }}
                    />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowSchedule(!showSchedule)}
            >
              <span className="font-semibold">Yearly Schedule</span>
              {showSchedule ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showSchedule && (
              <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead className="text-right">Deposit</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.schedule.map((row: any) => (
                      <TableRow key={row.year}>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell className="text-right">₹{row.deposit.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{row.interest.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{row.closingBalance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}
    />
  )
}
