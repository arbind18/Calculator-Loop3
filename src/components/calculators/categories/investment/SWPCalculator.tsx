"use client"

import { useState, useEffect } from "react"
import { ArrowDownCircle, Info } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { SWPSeoContent } from "@/components/calculators/seo/InvestmentSeo"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { calculateSWP, SWPResult } from "@/lib/logic/investment"
import { useTranslation } from "@/hooks/useTranslation"

export function SWPCalculator() {
  const { t } = useTranslation()
  const [totalInvestment, setTotalInvestment] = useState(5000000)
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(30000)
  const [expectedReturn, setExpectedReturn] = useState(8)
  const [timePeriod, setTimePeriod] = useState(10)
  
  const [result, setResult] = useState<SWPResult | null>(null)

  const handleCalculate = () => {
    const res = calculateSWP(totalInvestment, withdrawalPerMonth, expectedReturn, timePeriod)
    setResult(res)
  }

  useEffect(() => {
    handleCalculate()
  }, [totalInvestment, withdrawalPerMonth, expectedReturn, timePeriod])

  return (
    <FinancialCalculatorTemplate
      title={t('investment.swp_title')}
      description={t('investment.swp_desc')}
      icon={ArrowDownCircle}
      calculate={handleCalculate}
      onClear={() => {
        setTotalInvestment(5000000)
        setWithdrawalPerMonth(30000)
        setExpectedReturn(8)
      }}
      seoContent={<SWPSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup 
            label={t('investment.total_investment')} 
            value={totalInvestment} 
            onChange={setTotalInvestment} 
            prefix="₹" 
            min={100000} 
            max={100000000}
            step={10000}
          />
          <InputGroup 
            label={t('investment.withdrawal_per_month')} 
            value={withdrawalPerMonth} 
            onChange={setWithdrawalPerMonth} 
            prefix="₹" 
            min={500} 
            max={1000000}
            step={500}
          />
          <InputGroup 
            label={t('investment.expected_return')} 
            value={expectedReturn} 
            onChange={setExpectedReturn} 
            suffix="%" 
            min={1} 
            max={30} 
            step={0.1}
          />
          <InputGroup 
            label={t('investment.time_period')} 
            value={timePeriod} 
            onChange={setTimePeriod} 
            suffix={` ${t('investment.time_period').split(' ')[2] || 'Years'}`}
            min={1} 
            max={40} 
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label={t('investment.total_investment')} 
              value={`₹${totalInvestment.toLocaleString()}`} 
            />
            <ResultCard 
              label={t('investment.total_withdrawn')} 
              value={`₹${result.totalWithdrawn.toLocaleString()}`} 
              type="highlight" 
            />
            <ResultCard 
              label={t('investment.final_balance')} 
              value={`₹${result.finalBalance.toLocaleString()}`} 
              type={result.finalBalance > 0 ? "success" : "warning"}
            />
          </div>

          {result.finalBalance === 0 && (
             <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
               <Info className="h-5 w-5 text-red-600 mt-0.5" />
               <div>
                 <p className="font-semibold text-red-800 dark:text-red-200">{t('investment.corpus_depleted')}</p>
                 <p className="text-sm text-red-600/80 dark:text-red-400">
                   {t('investment.corpus_depleted_desc').replace('{years}', timePeriod.toString())}
                 </p>
               </div>
             </div>
          )}

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                <Legend />
                <Area type="monotone" dataKey="balance" stackId="1" stroke="#3b82f6" fill="#3b82f6" name={t('investment.balance')} />
                <Area type="monotone" dataKey="withdrawn" stackId="2" stroke="#22c55e" fill="#22c55e" name={t('investment.withdrawn')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    />
  )
}
