"use client"

import { useState } from "react"
import { Calculator, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { generateReport } from "@/lib/downloadUtils"
import { calculateAdvancedTax } from "@/lib/logic/tax"
import { useTranslation } from "@/hooks/useTranslation"

export function AdvancedIncomeTax() {
  const { t } = useTranslation()
  // Income Details
  const [salary, setSalary] = useState(1200000)
  const [interestIncome, setInterestIncome] = useState(10000)
  const [otherIncome, setOtherIncome] = useState(0)
  
  // Deductions
  const [section80C, setSection80C] = useState(150000)
  const [section80D, setSection80D] = useState(25000)
  const [section80CCD, setSection80CCD] = useState(50000) // NPS
  const [hraExemption, setHraExemption] = useState(0)
  const [homeLoanInterest, setHomeLoanInterest] = useState(0)
  const [otherDeductions, setOtherDeductions] = useState(0)

  const [showDeductions, setShowDeductions] = useState(true)
  
  const grossIncome = salary + interestIncome + otherIncome
  const result = calculateAdvancedTax(
    grossIncome,
    section80C,
    section80D,
    section80CCD,
    hraExemption,
    homeLoanInterest,
    otherDeductions
  )

  const handleDownload = (format: string) => {
    const headers = ['Category', 'Old Regime', 'New Regime']
    const data = [
      ['Gross Income', grossIncome, grossIncome],
      ['Total Deductions', result.oldRegime.taxableIncome - grossIncome, result.newRegime.taxableIncome - grossIncome], // Simplified deduction calc for display
      ['Taxable Income', result.oldRegime.taxableIncome, result.newRegime.taxableIncome],
      ['Base Tax', result.oldRegime.tax, result.newRegime.tax],
      ['Cess (4%)', result.oldRegime.cess, result.newRegime.cess],
      ['Total Tax', result.oldRegime.total, result.newRegime.total]
    ]

    generateReport(format, 'income_tax_comparison', headers, data, 'Income Tax Comparison (FY 2024-25)', {
      'Gross Income': `₹${grossIncome}`,
      'Better Regime': result.recommendation === 'new' ? 'New Regime' : 'Old Regime',
      'Potential Savings': `₹${result.savings}`
    })
  }

  const chartData = [
    {
      name: 'Tax Payable',
      'Old Regime': Math.round(result.oldRegime.total),
      'New Regime': Math.round(result.newRegime.total)
    }
  ]

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.advanced_tax_title')}
        description={t('tax.advanced_tax_desc')}
        icon={Calculator}
        calculate={() => {}}
        onDownload={handleDownload}
        onClear={() => {
          setSalary(1200000)
          setSection80C(150000)
          setHraExemption(0)
        }}
        inputs={
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <Info className="h-4 w-4" /> Income Sources
              </h3>
              <InputGroup label={t('tax.salary_income')} value={salary} onChange={setSalary} prefix="₹" step={10000} min={0} max={100000000} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label={t('tax.interest_income')} value={interestIncome} onChange={setInterestIncome} prefix="₹" min={0} max={10000000} />
                <InputGroup label={t('tax.other_income')} value={otherIncome} onChange={setOtherIncome} prefix="₹" min={0} max={10000000} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <Info className="h-4 w-4" /> Deductions (Old Regime)
                </h3>
                <button 
                  onClick={() => setShowDeductions(!showDeductions)}
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  {showDeductions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showDeductions ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showDeductions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                  <InputGroup label={t('tax.deductions_80c')} value={section80C} onChange={setSection80C} prefix="₹" min={0} max={150000} />
                  <InputGroup label={t('tax.deductions_80d')} value={section80D} onChange={setSection80D} prefix="₹" min={0} max={100000} />
                  <InputGroup label={t('tax.deductions_80ccd')} value={section80CCD} onChange={setSection80CCD} prefix="₹" min={0} max={50000} />
                  <InputGroup label={t('tax.exempt_hra')} value={hraExemption} onChange={setHraExemption} prefix="₹" helpText="Calculate separately if needed" min={0} max={1000000} />
                  <InputGroup label={t('tax.home_loan_interest')} value={homeLoanInterest} onChange={setHomeLoanInterest} prefix="₹" min={0} max={200000} />
                  <InputGroup label={t('tax.other_deductions')} value={otherDeductions} onChange={setOtherDeductions} prefix="₹" min={0} max={1000000} />
                </div>
              )}
            </div>
          </div>
        }
        result={
          <div className="mt-8 space-y-6">
            {/* Recommendation Banner */}
            <div className={`p-6 rounded-xl border-2 ${result.recommendation === 'new' ? 'border-blue-500/20 bg-blue-500/10' : 'border-purple-500/20 bg-purple-500/10'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${result.recommendation === 'new' ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {t('tax.better_option', { regime: result.recommendation === 'new' ? t('tax.new_regime') : t('tax.old_regime') })}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('tax.savings')}: <span className="font-bold text-foreground">₹{result.savings.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="grid grid-cols-3 bg-muted/50 p-4 text-sm font-medium">
                <div>Particulars</div>
                <div className="text-right">{t('tax.old_regime')}</div>
                <div className="text-right">{t('tax.new_regime')}</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-3 p-4 text-sm">
                  <div className="text-muted-foreground">Gross Income</div>
                  <div className="text-right font-medium">₹{grossIncome.toLocaleString()}</div>
                  <div className="text-right font-medium">₹{grossIncome.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm bg-muted/20">
                  <div className="font-medium">Taxable Income</div>
                  <div className="text-right font-bold">₹{result.oldRegime.taxableIncome.toLocaleString()}</div>
                  <div className="text-right font-bold">₹{result.newRegime.taxableIncome.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-3 p-4 text-sm">
                  <div className="font-bold text-primary">Total Tax Payable</div>
                  <div className={`text-right font-bold ${result.recommendation === 'old' ? 'text-green-600' : ''}`}>
                    ₹{Math.round(result.oldRegime.total).toLocaleString()}
                  </div>
                  <div className={`text-right font-bold ${result.recommendation === 'new' ? 'text-green-600' : ''}`}>
                    ₹{Math.round(result.newRegime.total).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="p-4 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-4">Tax Comparison</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => {
                        const raw = Array.isArray(value) ? value[0] : value
                        const n = typeof raw === 'number' ? raw : Number(raw ?? 0)
                        return `₹${(Number.isFinite(n) ? n : 0).toLocaleString()}`
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Old Regime" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="New Regime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}
