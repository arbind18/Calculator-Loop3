"use client"

import { useState, useEffect } from "react"
import { Home, Key } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { formatCompactNumber } from "@/lib/utils"
import { HomeLoanSeoContent } from "@/components/calculators/seo/LoanSeo"
import { calculateRentVsBuy, RentVsBuyResult } from "@/lib/logic/real-estate"
import { useTranslation } from "@/hooks/useTranslation"

export function RentVsBuy() {
  const { t } = useTranslation()
  // Buy Inputs
  const [propertyPrice, setPropertyPrice] = useState(5000000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [loanRate, setLoanRate] = useState(8.5)
  const [loanTenure, setLoanTenure] = useState(20)
  const [appreciationRate, setAppreciationRate] = useState(5)
  const [maintenanceCost, setMaintenanceCost] = useState(3000) // Monthly

  // Rent Inputs
  const [monthlyRent, setMonthlyRent] = useState(15000)
  const [rentIncreaseRate, setRentIncreaseRate] = useState(5)
  const [investmentReturnRate, setInvestmentReturnRate] = useState(12) // Returns on money saved if renting

  const [result, setResult] = useState<RentVsBuyResult | null>(null)

  const handleCalculate = () => {
    const res = calculateRentVsBuy(
      propertyPrice,
      downPaymentPercent,
      loanRate,
      loanTenure,
      appreciationRate,
      maintenanceCost,
      monthlyRent,
      rentIncreaseRate,
      investmentReturnRate
    )
    setResult(res)
  }

  useEffect(() => {
    handleCalculate()
  }, [propertyPrice, downPaymentPercent, loanRate, loanTenure, appreciationRate, maintenanceCost, monthlyRent, rentIncreaseRate, investmentReturnRate])

  return (
    <FinancialCalculatorTemplate
      title={t('real_estate.rent_vs_buy_title')}
      description={t('real_estate.rent_vs_buy_desc')}
      icon={Home}
      calculate={handleCalculate}
      values={[
        propertyPrice,
        downPaymentPercent,
        loanRate,
        loanTenure,
        appreciationRate,
        maintenanceCost,
        monthlyRent,
        rentIncreaseRate,
        investmentReturnRate,
      ]}
      onClear={() => {
        setResult(null)
        setPropertyPrice(5000000)
        setDownPaymentPercent(20)
        setLoanRate(8.5)
        setLoanTenure(20)
        setAppreciationRate(5)
        setMaintenanceCost(3000)
        setMonthlyRent(15000)
        setRentIncreaseRate(5)
        setInvestmentReturnRate(12)
      }}
      onRestoreAction={(vals) => {
        setPropertyPrice(Number(vals?.[0] ?? 5000000))
        setDownPaymentPercent(Number(vals?.[1] ?? 20))
        setLoanRate(Number(vals?.[2] ?? 8.5))
        setLoanTenure(Number(vals?.[3] ?? 20))
        setAppreciationRate(Number(vals?.[4] ?? 5))
        setMaintenanceCost(Number(vals?.[5] ?? 3000))
        setMonthlyRent(Number(vals?.[6] ?? 15000))
        setRentIncreaseRate(Number(vals?.[7] ?? 5))
        setInvestmentReturnRate(Number(vals?.[8] ?? 12))
      }}
      seoContent={<HomeLoanSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary flex items-center gap-2"><Key className="h-4 w-4" /> {t('real_estate.buying_details')}</h3>
              <InputGroup label={t('real_estate.property_price')} value={propertyPrice} onChange={setPropertyPrice} prefix="₹" min={100000} max={100000000} />
              <InputGroup label="Down Payment" value={downPaymentPercent} onChange={setDownPaymentPercent} suffix="%" min={0} max={90} />
              <InputGroup label={t('real_estate.loan_rate')} value={loanRate} onChange={setLoanRate} suffix="%" min={1} max={20} />
              <InputGroup label={t('real_estate.appreciation_rate')} value={appreciationRate} onChange={setAppreciationRate} suffix="%" helpText="Exp. property growth" min={0} max={20} />
              <InputGroup label={t('real_estate.maintenance_cost')} value={maintenanceCost} onChange={setMaintenanceCost} prefix="₹" min={0} max={100000} />
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-primary flex items-center gap-2"><Home className="h-4 w-4" /> {t('real_estate.renting_details')}</h3>
              <InputGroup label={t('real_estate.monthly_rent')} value={monthlyRent} onChange={setMonthlyRent} prefix="₹" min={1000} max={500000} />
              <InputGroup label={t('real_estate.rent_increase')} value={rentIncreaseRate} onChange={setRentIncreaseRate} suffix="%" min={0} max={20} />
              <InputGroup label={t('real_estate.investment_return')} value={investmentReturnRate} onChange={setInvestmentReturnRate} suffix="%" helpText="Returns on saved cash" min={1} max={30} />
              <InputGroup label={t('real_estate.loan_tenure')} value={loanTenure} onChange={setLoanTenure} suffix="yrs" min={1} max={30} />
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              label={t('real_estate.recommendation')}
              value={result.recommendation === 'buy' ? t('real_estate.buying_better') : t('real_estate.renting_better')}
              type="highlight"
            />
            <ResultCard
              label={t('real_estate.final_wealth_buy')}
              value={`₹${formatCompactNumber(result.finalWealthBuy)}`}
              type="default"
              subtext={`After ${loanTenure} years`}
            />
            <ResultCard
              label={t('real_estate.final_wealth_rent')}
              value={`₹${formatCompactNumber(result.finalWealthRent)}`}
              type="default"
              subtext={`After ${loanTenure} years`}
            />
          </div>

        </div>
      )}
      charts={result && (
        <div className="h-[400px] w-full mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `₹${formatCompactNumber(value)}`} />
              <Tooltip
                formatter={(value) => {
                  const raw = Array.isArray(value) ? value[0] : value
                  const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                  return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                }}
              />
              <Legend />
              <Bar dataKey="wealthBuy" name={t('real_estate.final_wealth_buy')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wealthRent" name={t('real_estate.final_wealth_rent')} fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    />
  )
}
