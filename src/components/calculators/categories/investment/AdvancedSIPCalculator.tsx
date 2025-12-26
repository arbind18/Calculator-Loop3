"use client"

import { useState, useEffect } from "react"
import { Calculator, TrendingUp, PieChart as PieChartIcon, Info, ArrowUpRight, Coins } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import { SIPSeoContent } from "@/components/calculators/seo/InvestmentSeo"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { generateReport } from "@/lib/downloadUtils"
import { calculateSIP, adjustForInflation as calcInflation, calculateLTCG } from "@/lib/logic/investment"
import { useTranslation } from "@/hooks/useTranslation"
import { AIAssistant } from "@/components/ai/AIAssistant"

export function AdvancedSIPCalculator() {
  const { t } = useTranslation()
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [timePeriod, setTimePeriod] = useState(10)
  
  // Advanced Features
  const [stepUpRate, setStepUpRate] = useState(0) // Annual Step Up %
  const [adjustForInflation, setAdjustForInflation] = useState(false)
  const [inflationRate, setInflationRate] = useState(6)
  const [includeTax, setIncludeTax] = useState(false) // LTCG Tax
  
  const [result, setResult] = useState<any>(null)
  const [chartView, setChartView] = useState<'pie' | 'graph'>('pie')

  const calculate = () => {
    // 1. Calculate Core SIP
    const sipResult = calculateSIP(monthlyInvestment, expectedReturn, timePeriod, stepUpRate)
    
    // 2. Calculate Tax
    let taxAmount = 0
    if (includeTax) {
      taxAmount = calculateLTCG(sipResult.totalReturns)
    }
    const postTaxMaturity = sipResult.totalValue - taxAmount

    // 3. Calculate Inflation Adjusted Value
    // We adjust the post-tax maturity value
    const realMaturityAmount = calcInflation(postTaxMaturity, inflationRate, timePeriod)

    setResult({
      maturityAmount: sipResult.totalValue,
      postTaxMaturity: Math.round(postTaxMaturity),
      realMaturityAmount: Math.round(realMaturityAmount),
      totalInvested: sipResult.totalInvested,
      returns: sipResult.totalReturns,
      taxAmount: Math.round(taxAmount),
      schedule: sipResult.schedule
    })
  }

  useEffect(() => {
    calculate()
  }, [monthlyInvestment, expectedReturn, timePeriod, stepUpRate, adjustForInflation, inflationRate, includeTax])

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

    const headers = ['Year', 'Invested Amount', 'Value', 'Returns']
    const data = scheduleData.map((row: any) => [
      row.year,
      row.invested,
      row.value,
      row.returns
    ])

    generateReport(format, 'sip_report', headers, data, 'Advanced SIP Report', {
      'Monthly Investment': `₹${monthlyInvestment}`,
      'Expected Return': `${expectedReturn}%`,
      'Time Period': `${timePeriod} Years`,
      'Step Up Rate': `${stepUpRate}%`,
      'Inflation Adjusted': adjustForInflation ? 'Yes' : 'No',
      'Taxation': includeTax ? 'Yes' : 'No'
    })
  }

  const chartData = result ? [
    { name: 'Invested Amount', value: result.totalInvested, color: '#3b82f6' },
    { name: 'Est. Returns', value: result.returns, color: '#22c55e' },
  ] : []
  
  // If tax is included, show tax in chart
  if (result && includeTax && result.taxAmount > 0) {
      // Adjust returns to be post-tax for the pie chart visual
      chartData[1].value = result.returns - result.taxAmount
      chartData[1].name = 'Post-Tax Returns'
      chartData.push({ name: 'Tax', value: result.taxAmount, color: '#ef4444' })
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced SIP Calculator"
      description="Calculate SIP returns with Step-Up, Inflation Adjustment, and Taxation."
      icon={Calculator}
      calculate={calculate}
      onDownload={handleDownload}
      onClear={() => {
        setMonthlyInvestment(5000)
        setExpectedReturn(12)
        setTimePeriod(10)
        setStepUpRate(0)
        setAdjustForInflation(false)
        setIncludeTax(false)
      }}
      seoContent={<SIPSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label="Monthly Investment" 
            value={monthlyInvestment} 
            onChange={setMonthlyInvestment} 
            prefix="₹" 
            min={500} 
            max={1000000} 
            step={500}
          />
          <InputGroup 
            label="Expected Return Rate (p.a)" 
            value={expectedReturn} 
            onChange={setExpectedReturn} 
            suffix="%" 
            min={1} 
            max={30} 
            step={0.1}
          />
          <InputGroup 
            label="Time Period" 
            value={timePeriod} 
            onChange={setTimePeriod} 
            suffix={` ${t('investment.time_period').split(' ')[2] || 'Years'}`}
            min={1} 
            max={40} 
          />
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Advanced Options</h3>
            
            {/* Step Up Option */}
            <div className="flex items-center justify-between">
                <Label className="text-base flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-blue-500" />
                    {t('investment.step_up_rate')}
                </Label>
                <div className="w-32">
                    <InputGroup 
                        label=""
                        value={stepUpRate}
                        onChange={setStepUpRate}
                        suffix="%"
                        min={0}
                        max={50}
                    />
                </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">Increase your investment amount every year</p>

            {/* Inflation Option */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                <Label className="text-base">{t('investment.inflation_adjusted')}</Label>
                <p className="text-xs text-muted-foreground">See returns in today's value</p>
                </div>
                <Switch checked={adjustForInflation} onCheckedChange={setAdjustForInflation} />
            </div>

            {adjustForInflation && (
                <div className="animate-in slide-in-from-top-2 pl-4 border-l-2 border-primary/20">
                <InputGroup 
                    label={t('investment.inflation_rate')} 
                    value={inflationRate} 
                    onChange={setInflationRate} 
                    suffix="%" 
                    min={1} 
                    max={15} 
                    step={0.1}
                />
                </div>
            )}
            
            {/* Tax Option */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                <Label className="text-base">{t('investment.tax_payable')}</Label>
                <p className="text-xs text-muted-foreground">Deduct 12.5% tax on gains &gt; ₹1.25L</p>
                </div>
                <Switch checked={includeTax} onCheckedChange={setIncludeTax} />
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label={t('investment.invested_amount')} 
              value={`₹${result.totalInvested.toLocaleString()}`} 
            />
            <ResultCard 
              label={t('investment.est_returns')} 
              value={`₹${result.returns.toLocaleString()}`} 
              type="success" 
            />
            <ResultCard 
              label={t('investment.total_value')} 
              value={`₹${result.maturityAmount.toLocaleString()}`} 
              type="highlight" 
            />
          </div>
          
          {/* Tax Info */}
          {includeTax && result.taxAmount > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm text-red-600 dark:text-red-400">{t('investment.tax_payable')}</p>
                        <p className="text-xl font-bold text-red-700 dark:text-red-300">- ₹{result.taxAmount.toLocaleString()}</p>
                    </div>
                    <Coins className="h-8 w-8 text-red-200 dark:text-red-800" />
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm text-green-600 dark:text-green-400">{t('investment.post_tax_value')}</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{result.postTaxMaturity.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200 dark:text-green-800" />
                </div>
             </div>
          )}

          {adjustForInflation && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">{t('investment.inflation_adjusted_value')}</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">₹{result.realMaturityAmount.toLocaleString()}</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400">
                  {t('investment.inflation_note')} ({inflationRate}%).
                </p>
              </div>
            </div>
          )}

          <div className="h-80 w-full">
            <div className="flex justify-end mb-4">
              <ChartToggle 
              view={chartView} 
              onChange={setChartView} 
              options={[
                { value: 'pie', label: t('common.distribution'), icon: PieChartIcon },
                { value: 'graph', label: t('common.growth_chart'), icon: TrendingUp }
              ]}
            />
            </div>
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'pie' ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
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
              ) : (
                <AreaChart data={result.schedule}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                  <Tooltip
                    formatter={(value) => {
                      const raw = Array.isArray(value) ? value[0] : value
                      const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                      return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                    }}
                  />
                  <Area type="monotone" dataKey="invested" stackId="1" stroke="#3b82f6" fill="#3b82f6" name={t('investment.invested')} />
                  <Area type="monotone" dataKey="returns" stackId="1" stroke="#22c55e" fill="#22c55e" name={t('investment.returns')} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
