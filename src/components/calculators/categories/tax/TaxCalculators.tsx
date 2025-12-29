"use client"
import { useState } from "react"
import { Calculator, Receipt } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { IncomeTaxSeoContent, HRASeoContent } from "@/components/calculators/seo/TaxSeo"
import { ComprehensiveIncomeTaxSeo } from "@/components/calculators/seo/ComprehensiveTaxSeo"
import { GSTSeoContent } from "@/components/calculators/seo/BusinessSeo"
import { FAQSection, getTaxFAQs } from "@/components/calculators/ui/FAQSection"
import { calculateIncomeTax, calculateGST, calculateHRAExemption } from "@/lib/logic/tax"
import { useTranslation } from "@/hooks/useTranslation"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

export function IncomeTaxCalculator() {
  const { t, lang } = useTranslation()
  const [income, setIncome] = useState(800000)
  const [regime, setRegime] = useState<'old' | 'new'>('new')
  
  const result = calculateIncomeTax(income, regime)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.income_tax_title')}
        description={t('tax.income_tax_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[income, regime]}
        onClear={() => {
          setIncome(800000)
          setRegime('new')
        }}
        onRestoreAction={(vals) => {
          setIncome(Number(vals?.[0] ?? 800000))
          setRegime(((vals?.[1] as any) ?? 'new') as any)
        }}
        seoContent={
          lang === 'en' ? (
            <ComprehensiveIncomeTaxSeo />
          ) : (
            <SeoContentGenerator
              title={t('tax.income_tax_title')}
              description={t('tax.income_tax_desc')}
              categoryName={t('nav.financial')}
            />
          )
        }
        inputs={
          <div className="space-y-6">
            <InputGroup
              label={t('tax.annual_income')}
              value={income}
              onChange={setIncome}
              min={100000}
              max={10000000}
              step={10000}
              prefix="₹"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('tax.tax_regime')}</label>
              <select
                value={regime}
                onChange={(e) => setRegime(e.target.value as 'old' | 'new')}
                className="w-full p-3 rounded-lg bg-background border"
              >
                <option value="new">{t('tax.new_regime')}</option>
                <option value="old">{t('tax.old_regime')}</option>
              </select>
            </div>
          </div>
        }
        result={
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t('tax.total_tax')}
              value={result.total}
              type="warning"
              prefix="₹"
            />
            <ResultCard
              label={t('tax.in_hand_income')}
              value={result.inHand}
              type="success"
              prefix="₹"
            />
            <ResultCard
              label={t('tax.base_tax')}
              value={result.breakdown.baseTax}
              prefix="₹"
            />
            <ResultCard
              label={t('tax.cess')}
              value={result.breakdown.cess}
              prefix="₹"
            />
          </div>
        }
      />
    </div>
  )
}

export function GSTCalculator() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState(10000)
  const [gstRate, setGstRate] = useState(18)
  const [type, setType] = useState<'inclusive' | 'exclusive'>('exclusive')
  
  const result = calculateGST(amount, gstRate, type)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.gst_title')}
        description={t('tax.gst_desc')}
        icon={Receipt}
        calculate={() => {}}
        values={[amount, gstRate, type]}
        onClear={() => {
          setAmount(10000)
          setGstRate(18)
          setType('exclusive')
        }}
        onRestoreAction={(vals) => {
          setAmount(Number(vals?.[0] ?? 10000))
          setGstRate(Number(vals?.[1] ?? 18))
          setType(((vals?.[2] as any) ?? 'exclusive') as any)
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('gst')} />}
        inputs={
          <div className="space-y-6">
            <InputGroup
              label={t('tax.amount')}
              value={amount}
              onChange={setAmount}
              min={100}
              max={10000000}
              step={100}
              prefix="₹"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('tax.gst_rate')}</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full p-3 rounded-lg bg-background border"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('tax.tax_type')}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={type === 'exclusive'}
                    onChange={() => setType('exclusive')}
                    className="accent-primary"
                  />
                  {t('tax.exclusive')}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={type === 'inclusive'}
                    onChange={() => setType('inclusive')}
                    className="accent-primary"
                  />
                  {t('tax.inclusive')}
                </label>
              </div>
            </div>
          </div>
        }
        result={
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t('tax.total_amount')}
              value={result.totalAmount}
              type="highlight"
              prefix="₹"
            />
            <ResultCard
              label={t('tax.gst_amount')}
              value={result.gstAmount}
              type="warning"
              prefix="₹"
            />
            <ResultCard
              label={t('tax.net_amount')}
              value={result.netAmount}
              prefix="₹"
            />
            <div className="grid grid-cols-2 gap-4">
              <ResultCard
                label="CGST"
                value={result.cgst}
                prefix="₹"
              />
              <ResultCard
                label="SGST"
                value={result.sgst}
                prefix="₹"
              />
            </div>
          </div>
        }
      />

    </div>
  )
}

export function SalaryBreakup() {
  const [ctc, setCtc] = useState(1200000)
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const basic = ctc * 0.40
    const hra = basic * 0.50
    const da = ctc * 0.10
    const pf = basic * 0.12
    const pt = 2400
    const grossSalary = basic + hra + da
    const deductions = pf + pt
    const takeHome = grossSalary - deductions
    setResult({ basic, hra, da, pf, pt, gross: grossSalary, deductions, takeHome: Math.round(takeHome/12) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Salary Breakup Calculator"
      description="Estimate your in-hand salary from CTC."
      icon={Calculator}
      calculate={calculate}
      values={[ctc]}
      onClear={() => {
        setCtc(1200000)
        setResult(null)
      }}
      onRestoreAction={(vals) => {
        setCtc(Number(vals?.[0] ?? 1200000))
      }}
      seoContent={<FAQSection faqs={getTaxFAQs('salary-breakup')} />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Annual CTC"
            value={ctc}
            onChange={setCtc}
            min={300000}
            max={10000000}
            step={10000}
            prefix="₹"
          />
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Monthly In-Hand Salary"
            value={result.takeHome}
            type="success"
            prefix="₹"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label="Basic Salary"
              value={Math.round(result.basic)}
              prefix="₹"
            />
            <ResultCard
              label="HRA"
              value={Math.round(result.hra)}
              prefix="₹"
            />
            <ResultCard
              label="DA"
              value={Math.round(result.da)}
              prefix="₹"
            />
            <ResultCard
              label="PF Deduction"
              value={Math.round(result.pf)}
              type="warning"
              prefix="-₹"
            />
            <ResultCard
              label="PT Deduction"
              value={result.pt}
              type="warning"
              prefix="-₹"
            />
          </div>
        </div>
      )}
    />
  )
}

export function HRACalculator() {
  const { t } = useTranslation()
  const [basic, setBasic] = useState(50000)
  const [hra, setHra] = useState(25000)
  const [rent, setRent] = useState(20000)
  const [metro, setMetro] = useState(true)
  
  // Convert monthly to yearly for calculation
  const result = calculateHRAExemption(basic * 12, 0, hra * 12, rent * 12, metro)

  return (
    <div className="space-y-6">
      <FinancialCalculatorTemplate
        title={t('tax.hra_title')}
        description={t('tax.hra_desc')}
        icon={Calculator}
        calculate={() => {}}
        values={[basic, hra, rent, metro]}
        onClear={() => {
          setBasic(50000)
          setHra(25000)
          setRent(20000)
          setMetro(true)
        }}
        onRestoreAction={(vals) => {
          setBasic(Number(vals?.[0] ?? 50000))
          setHra(Number(vals?.[1] ?? 25000))
          setRent(Number(vals?.[2] ?? 20000))
          setMetro(Boolean(vals?.[3] ?? true))
        }}
        seoContent={<FAQSection faqs={getTaxFAQs('hra')} />}
        inputs={
          <div className="space-y-6">
            <InputGroup
              label="Basic Salary (monthly)"
              value={basic}
              onChange={setBasic}
              min={10000}
              max={200000}
              step={1000}
              prefix="₹"
            />
            <InputGroup
              label="HRA Received"
              value={hra}
              onChange={setHra}
              min={5000}
              max={100000}
              step={1000}
              prefix="₹"
            />
            <InputGroup
              label="Rent Paid"
              value={rent}
              onChange={setRent}
              min={5000}
              max={100000}
              step={1000}
              prefix="₹"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('tax.city_type')}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={metro}
                    onChange={(e) => setMetro(e.target.checked)}
                    className="accent-primary"
                  />
                  {t('tax.metro')}
                </label>
              </div>
            </div>
          </div>
        }
        result={
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t('tax.exempt_hra')}
              value={Math.round(result.exemptHRA / 12)}
              type="success"
              prefix="₹"
            />
            <ResultCard
              label={t('tax.taxable_hra')}
              value={Math.round(result.taxableHRA / 12)}
              type="warning"
              prefix="₹"
            />
          </div>
        }
      />

    </div>
  )
}
