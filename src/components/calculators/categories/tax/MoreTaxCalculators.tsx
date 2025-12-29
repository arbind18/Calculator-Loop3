"use client"

import { useState } from "react"
import { Calculator, PiggyBank } from "lucide-react"
import { generateReport } from "@/lib/downloadUtils"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { useTranslation } from "@/hooks/useTranslation"
import { Label } from "@/components/ui/label"
import { GratuitySeoContent, IncomeTaxSeoContent } from "@/components/calculators/seo/TaxSeo"
import { RetirementSeoContent } from "@/components/calculators/seo/InvestmentSeo"
import { FAQSection, getTaxFAQs } from "@/components/calculators/ui/FAQSection"
import { 
  calculatePF, 
  calculateGratuity, 
  calculateTDS, 
  calculateProfessionalTax, 
  calculateAdvanceTaxLiability, 
  calculatePostTaxIncome, 
  calculateLeaveEncashment, 
  calculateVRS 
} from "@/lib/logic/tax"

export function PFCalculator() {
  const { t } = useTranslation()
  const [basic, setBasic] = useState(50000)
  const [years, setYears] = useState(10)

  const { monthly, total, interest, maturity } = calculatePF(basic, years)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.pf_calculator_title')}
        description={t('tax.pf_calculator_desc')}
        icon={PiggyBank}
        calculate={() => {}}
        values={[basic, years]}
        onClear={() => {
          setBasic(50000)
          setYears(10)
        }}
        onRestoreAction={(vals) => {
          setBasic(Number(vals?.[0] ?? 50000))
          setYears(Number(vals?.[1] ?? 10))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('pf-calculator')} />}
        onDownload={(format) => generateReport(format, 'pf_maturity', ['Item', 'Value'], [['Maturity Amount', `₹${maturity}`]], 'PF Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.basic_salary_monthly')} value={basic} onChange={setBasic} min={10000} max={200000} step={1000} prefix="₹" />
            <InputGroup label={t('tax.service_years')} value={years} onChange={setYears} min={1} max={40} step={1} suffix="years" />
          </div>
        }
        result={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label={t('tax.maturity_amount')} value={`₹${maturity.toLocaleString()}`} type="highlight" />
            <ResultCard label={t('tax.total_contribution')} value={`₹${total.toLocaleString()}`} type="default" />
            <ResultCard label={t('tax.interest_earned')} value={`₹${interest.toLocaleString()}`} type="default" />
            <ResultCard label={t('tax.monthly_contribution')} value={`₹${monthly.toLocaleString()}`} type="default" />
          </div>
        }
      />
    </div>
  )
}

export function GratuityCalculator() {
  const { t } = useTranslation()
  const [basic, setBasic] = useState(40000)
  const [years, setYears] = useState(15)

  const { gratuity, eligible } = calculateGratuity(basic, years)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.gratuity_calculator_title')}
        description={t('tax.gratuity_calculator_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[basic, years]}
        onClear={() => {
          setBasic(40000)
          setYears(15)
        }}
        onRestoreAction={(vals) => {
          setBasic(Number(vals?.[0] ?? 40000))
          setYears(Number(vals?.[1] ?? 15))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('gratuity')} />}
        onDownload={(format) => generateReport(format, 'gratuity', ['Item', 'Value'], [['Gratuity', `₹${gratuity}`]], 'Gratuity Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.last_drawn_basic_salary')} value={basic} onChange={setBasic} min={10000} max={200000} step={1000} prefix="₹" />
            <InputGroup label={t('tax.service_years')} value={years} onChange={setYears} min={1} max={40} step={1} suffix="years" />
          </div>
        }
        result={
          eligible ? (
            <ResultCard label={t('tax.gratuity_amount')} value={`₹${gratuity.toLocaleString()}`} type="highlight" subtext="Formula: (Basic × Years × 15) / 26" />
          ) : (
            <div className="p-6 bg-destructive/10 rounded-xl text-center border border-destructive/20">
              <p className="text-lg font-bold text-destructive">{t('tax.not_eligible')}</p>
              <p className="text-sm text-muted-foreground mt-2">{t('tax.min_5_years_service')}</p>
            </div>
          )
        }
      />
    </div>
  )
}

export function TDSCalculator() {
  const { t } = useTranslation()
  const [income, setIncome] = useState(50000)
  const [category, setCategory] = useState('salary')

  const { tds, rate, net } = calculateTDS(income, category)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.tds_calculator_title')}
        description={t('tax.tds_calculator_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[income, category]}
        onClear={() => {
          setIncome(50000)
          setCategory('salary')
        }}
        onRestoreAction={(vals) => {
          setIncome(Number(vals?.[0] ?? 50000))
          setCategory(String(vals?.[1] ?? 'salary'))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('tds')} />}
        onDownload={(format) => generateReport(format, 'tds_calculation', ['Item', 'Value'], [['TDS', `₹${tds}`]], 'TDS Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.income_amount')} value={income} onChange={setIncome} min={10000} max={1000000} step={1000} prefix="₹" />
            <div className="space-y-2">
              <Label>{t('tax.income_category')}</Label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="salary">{t('tax.salary')}</option>
                <option value="professional">{t('tax.professional_fees')}</option>
                <option value="interest">{t('tax.interest_income')}</option>
                <option value="rent">{t('tax.rent')}</option>
                <option value="commission">{t('tax.commission')}</option>
              </select>
            </div>
          </div>
        }
        result={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard label={t('tax.net_amount')} value={`₹${net.toLocaleString()}`} type="highlight" />
            <ResultCard label={t('tax.tds_deducted_label')} value={`₹${tds.toLocaleString()}`} type="default" />
            <ResultCard label={t('tax.tds_rate')} value={`${rate}%`} />
          </div>
        }
      />
    </div>
  )
}

export function ProfessionalTax() {
  const { t } = useTranslation()
  const [salary, setSalary] = useState(40000)
  const [state, setState] = useState('maharashtra')

  const { monthly, annual } = calculateProfessionalTax(salary, state)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.professional_tax_title')}
        description={t('tax.professional_tax_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[salary, state]}
        onClear={() => {
          setSalary(40000)
          setState('maharashtra')
        }}
        onRestoreAction={(vals) => {
          setSalary(Number(vals?.[0] ?? 40000))
          setState(String(vals?.[1] ?? 'maharashtra'))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('professional-tax')} />}
        onDownload={(format) => generateReport(format, 'professional_tax', ['Item', 'Value'], [['Annual PT', `₹${annual}`]], 'PT Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.monthly_salary')} value={salary} onChange={setSalary} min={5000} max={200000} step={1000} prefix="₹" />
            <div className="space-y-2">
              <Label>{t('tax.state')}</Label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={state} 
                onChange={(e) => setState(e.target.value)}
              >
                <option value="maharashtra">{t('tax.maharashtra')}</option>
                <option value="karnataka">{t('tax.karnataka')}</option>
                <option value="west-bengal">{t('tax.west_bengal')}</option>
              </select>
            </div>
          </div>
        }
        result={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label={t('tax.monthly_pt')} value={`₹${monthly.toLocaleString()}`} type="default" />
            <ResultCard label={t('tax.annual_pt')} value={`₹${annual.toLocaleString()}`} type="default" />
          </div>
        }
      />
    </div>
  )
}

export function AdvanceTaxCalculator() {
  const { t } = useTranslation()
  const [income, setIncome] = useState(800000)

  const { total, q1, q2, q3, q4 } = calculateAdvanceTaxLiability(income)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.advance_tax_liability_title')}
        description={t('tax.advance_tax_liability_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[income]}
        onClear={() => {
          setIncome(800000)
        }}
        onRestoreAction={(vals) => {
          setIncome(Number(vals?.[0] ?? 800000))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('advance-tax')} />}
        onDownload={(format) => generateReport(format, 'advance_tax_liability', ['Item', 'Value'], [['Total Tax', `₹${total}`]], 'Advance Tax Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.estimated_annual_income')} value={income} onChange={setIncome} min={100000} max={5000000} step={10000} prefix="₹" />
          </div>
        }
        result={
          <div className="space-y-4">
            <ResultCard label={t('tax.total_tax_liability_label')} value={`₹${total.toLocaleString()}`} type="highlight" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label={t('tax.q1_june')} value={`₹${q1.toLocaleString()}`} type="default" />
              <ResultCard label={t('tax.q2_sep')} value={`₹${q2.toLocaleString()}`} type="default" />
              <ResultCard label={t('tax.q3_dec')} value={`₹${q3.toLocaleString()}`} type="default" />
              <ResultCard label={t('tax.q4_mar')} value={`₹${q4.toLocaleString()}`} type="default" />
            </div>
          </div>
        }
      />
    </div>
  )
}

export function PostTaxIncome() {
  const { t } = useTranslation()
  const [income, setIncome] = useState(1000000)
  const [deductions, setDeductions] = useState(150000)

  const { taxable, tax, postTax, monthly } = calculatePostTaxIncome(income, deductions)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.post_tax_income_title')}
        description={t('tax.post_tax_income_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[income, deductions]}
        onClear={() => {
          setIncome(1000000)
          setDeductions(150000)
        }}
        onRestoreAction={(vals) => {
          setIncome(Number(vals?.[0] ?? 1000000))
          setDeductions(Number(vals?.[1] ?? 150000))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('post-tax-income')} />}
        onDownload={(format) => generateReport(format, 'post_tax_income', ['Item', 'Value'], [['Post Tax Income', `₹${postTax}`]], 'Income Report')}
        inputs={
          <div className="space-y-6">
            <InputGroup label={t('tax.annual_income')} value={income} onChange={setIncome} min={100000} max={10000000} step={10000} prefix="₹" />
            <InputGroup label={t('tax.deductions_80c')} value={deductions} onChange={setDeductions} min={0} max={500000} step={5000} prefix="₹" />
          </div>
        }
        result={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard label={t('tax.post_tax_annual_income')} value={`₹${postTax.toLocaleString()}`} type="highlight" />
            <ResultCard label={t('tax.monthly_in_hand')} value={`₹${monthly.toLocaleString()}`} type="default" />
            <ResultCard label={t('tax.total_tax_payable')} value={`₹${tax.toLocaleString()}`} type="default" />
            <ResultCard label={t('tax.taxable_income')} value={`₹${taxable.toLocaleString()}`} type="default" />
          </div>
        }
      />
    </div>
  )
}

export function LeaveEncashment() {
  const { t } = useTranslation()
  const [basicSalary, setBasicSalary] = useState(50000)
  const [yearsService, setYearsService] = useState(20)
  const [leaveBalance, setLeaveBalance] = useState(300)
  const [amountReceived, setAmountReceived] = useState(1000000)

  const { exempt, taxable } = calculateLeaveEncashment(basicSalary, yearsService, leaveBalance, amountReceived)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.leave_encashment_title')}
        description={t('tax.leave_encashment_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[basicSalary, yearsService, leaveBalance, amountReceived]}
        onClear={() => {
          setBasicSalary(50000)
          setYearsService(20)
          setLeaveBalance(300)
          setAmountReceived(1000000)
        }}
        onRestoreAction={(vals) => {
          setBasicSalary(Number(vals?.[0] ?? 50000))
          setYearsService(Number(vals?.[1] ?? 20))
          setLeaveBalance(Number(vals?.[2] ?? 300))
          setAmountReceived(Number(vals?.[3] ?? 1000000))
        }}
        onDownload={(format) => generateReport(format, 'leave_encashment', ['Item', 'Value'], [['Exempt Amount', `₹${exempt}`]], 'Leave Encashment Report')}
        inputs={
          <div className="space-y-4">
            <InputGroup label={t('tax.avg_monthly_basic')} value={basicSalary} onChange={setBasicSalary} prefix="₹" />
            <InputGroup label={t('tax.service_years')} value={yearsService} onChange={setYearsService} suffix="Years" />
            <InputGroup label={t('tax.earned_leave_balance')} value={leaveBalance} onChange={setLeaveBalance} suffix="Days" />
            <InputGroup label={t('tax.amount_received')} value={amountReceived} onChange={setAmountReceived} prefix="₹" />
          </div>
        }
        result={
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">{t('tax.exempt_amount')}</div>
              <div className="text-2xl font-bold text-green-700">₹{exempt.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600">{t('tax.taxable_amount')}</div>
              <div className="text-2xl font-bold text-red-700">₹{taxable.toLocaleString()}</div>
            </div>
          </div>
        }
      />
    </div>
  )
}

export function VRSCompensation() {
  const { t } = useTranslation()
  const [amountReceived, setAmountReceived] = useState(1000000)
  
  const { exempt, taxable } = calculateVRS(amountReceived)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.vrs_compensation_title')}
        description={t('tax.vrs_compensation_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[amountReceived]}
        onClear={() => {
          setAmountReceived(1000000)
        }}
        onRestoreAction={(vals) => {
          setAmountReceived(Number(vals?.[0] ?? 1000000))
        }}
        onDownload={(format) => generateReport(format, 'vrs_tax', ['Item', 'Value'], [['Exempt Amount', `₹${exempt}`]], 'VRS Report')}
        inputs={
          <div className="space-y-4">
            <InputGroup label={t('tax.compensation_received')} value={amountReceived} onChange={setAmountReceived} prefix="₹" />
          </div>
        }
        result={
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">{t('tax.exempt_max_5l')}</div>
              <div className="text-2xl font-bold text-green-700">₹{exempt.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-sm text-red-600">{t('tax.taxable_amount')}</div>
              <div className="text-2xl font-bold text-red-700">₹{taxable.toLocaleString()}</div>
            </div>
          </div>
        }
      />
    </div>
  )
}
