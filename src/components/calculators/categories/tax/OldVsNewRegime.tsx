"use client"

import { useState } from "react"
import { Scale, CheckCircle, TrendingUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { useTranslation } from "@/hooks/useTranslation"
import { generateReport } from "@/lib/downloadUtils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { calculateRegimeComparison } from "@/lib/logic/tax"

export function OldVsNewRegime() {
  const { t } = useTranslation()
  const [income, setIncome] = useState(1500000)
  const [currentDeductions, setCurrentDeductions] = useState(250000)

  const { taxNew, taxOld, savings, betterRegime, breakevenDeductions } = calculateRegimeComparison(income, currentDeductions)

  const chartData = [
    { name: t('tax.new_regime'), tax: Math.round(taxNew), fill: '#3b82f6' },
    { name: t('tax.old_regime'), tax: Math.round(taxOld), fill: '#a855f7' },
  ]

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.old_vs_new_title')}
        description={t('tax.old_vs_new_desc')}
        icon={Scale}
        calculate={() => {}}
        onDownload={(format) => generateReport(format, 'regime_comparison', ['Item', 'Value'], [['New Regime Tax', `₹${taxNew}`], ['Old Regime Tax', `₹${taxOld}`], ['Recommendation', betterRegime]], 'Tax Regime Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.gross_annual_income')} value={income} onChange={setIncome} min={100000} max={10000000} step={10000} prefix="₹" />
            <InputGroup label={t('tax.total_deductions_80c_80d')} value={currentDeductions} onChange={setCurrentDeductions} min={0} max={1000000} step={5000} prefix="₹" />
          </div>
        }
        result={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label={t('tax.tax_under_new_regime')} value={`₹${taxNew.toLocaleString()}`} type="default" />
              <ResultCard label={t('tax.tax_under_old_regime')} value={`₹${taxOld.toLocaleString()}`} type="default" />
            </div>
            
            <div className={`p-6 rounded-xl border-2 ${betterRegime === 'New Regime' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className={`w-6 h-6 ${betterRegime === 'New Regime' ? 'text-blue-600' : 'text-purple-600'}`} />
                <h3 className="text-lg font-bold">{t('tax.recommendation')}: {betterRegime === 'New Regime' ? t('tax.better_regime_new') : t('tax.better_regime_old')}</h3>
              </div>
              <p className="text-muted-foreground">
                {t('tax.tax_savings')}: <span className="font-bold text-green-600">₹{savings.toLocaleString()}</span>
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="tax" name="Tax Liability">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">{t('tax.breakeven_point')}</span>
              </div>
              <p className="text-sm text-yellow-700">
                {t('tax.breakeven_desc')}: <span className="font-bold">₹{breakevenDeductions.toLocaleString()}</span>
              </p>
            </div>
          </div>
        }
      />
    </div>
  )
}
