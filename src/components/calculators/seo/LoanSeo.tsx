"use client"

import React, { useMemo } from 'react'
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { useSettings } from '@/components/providers/SettingsProvider'
import { getMergedTranslations } from '@/lib/translations'

function useLoanSeoCopy() {
  const { language } = useSettings()
  const t = useMemo(() => getMergedTranslations(language), [language])
  const categoryLabelByLang: Record<string, string> = {
    en: 'Loan',
    hi: 'ऋण',
    ta: 'கடன்',
    te: 'రుణం',
    bn: 'ঋণ',
    mr: 'कर्ज',
    gu: 'લોન',
  }
  const categoryName = categoryLabelByLang[language] || categoryLabelByLang.en
  return { t, categoryName, language }
}

export function HomeLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.home_loan_title || 'Home Loan EMI Calculator'}
      description={t.loan?.home_loan_desc || 'Calculate your Home Loan EMI instantly. Plan your housing finance effectively with our accurate calculator.'}
      categoryName={categoryName}
    />
  )
}

export function PersonalLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.personal_loan_title || 'Personal Loan EMI Calculator'}
      description={t.loan?.personal_loan_desc || 'Calculate your Personal Loan EMI instantly. Plan your repayment schedule effectively for any personal financial need.'}
      categoryName={categoryName}
    />
  )
}

export function CarLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.car_loan_title || 'Car Loan EMI Calculator'}
      description={t.loan?.car_loan_desc || 'Calculate your Car Loan EMI instantly. Drive your dream car with a well-planned repayment schedule.'}
      categoryName={categoryName}
    />
  )
}

export function EducationLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.education_loan_title || 'Education Loan EMI Calculator'}
      description={t.loan?.education_loan_desc || 'Calculate your Education Loan EMI instantly. Invest in your future with a clear repayment plan.'}
      categoryName={categoryName}
    />
  )
}

export function AmortizationSeoContent() {
  const { categoryName, language } = useLoanSeoCopy()
  const title = language === 'hi' ? 'ऋण अमॉर्टाइज़ेशन शेड्यूल' : 'Loan Amortization Schedule'
  const description =
    language === 'hi'
      ? 'ऋण का विस्तृत अमॉर्टाइज़ेशन शेड्यूल बनाएं। समय के साथ मूलधन और ब्याज का विभाजन समझें।'
      : 'Generate a detailed Loan Amortization Schedule. Understand your principal and interest breakdown over time.'
  return <SeoContentGenerator title={title} description={description} categoryName={categoryName} />
}

export function LoanComparisonSeoContent() {
  const { categoryName, language } = useLoanSeoCopy()
  const title = language === 'hi' ? 'ऋण तुलना टूल' : 'Loan Comparison Tool'
  const description =
    language === 'hi'
      ? 'विभिन्न ऋण ऑफ़र की तुलना साथ-साथ करें। कम ब्याज और बेहतर शर्तों वाला ऋण चुनें।'
      : 'Compare different loan offers side-by-side. Choose the best loan with the lowest interest and best terms.'
  return <SeoContentGenerator title={title} description={description} categoryName={categoryName} />
}

export function LoanEligibilitySeoContent() {
  const { categoryName, language } = useLoanSeoCopy()
  const title = language === 'hi' ? 'ऋण पात्रता कैलकुलेटर' : 'Loan Eligibility Calculator'
  const description =
    language === 'hi'
      ? 'अपनी ऋण पात्रता तुरंत जांचें। आय और मौजूदा देनदारियों के आधार पर जानें कि आप कितना उधार ले सकते हैं।'
      : 'Check your Loan Eligibility instantly. Know how much you can borrow based on your income and existing debts.'
  return <SeoContentGenerator title={title} description={description} categoryName={categoryName} />
}

export function PrepaymentSeoContent() {
  const { categoryName, language } = useLoanSeoCopy()
  const title = language === 'hi' ? 'ऋण प्रीपेमेंट विश्लेषण' : 'Loan Prepayment Analysis'
  const description =
    language === 'hi'
      ? 'ऋण प्रीपेमेंट का प्रभाव समझें। जल्दी भुगतान करने पर आप कितना ब्याज बचा सकते हैं, देखें।'
      : 'Analyze the impact of Loan Prepayment. See how much interest you can save by paying off your loan early.'
  return <SeoContentGenerator title={title} description={description} categoryName={categoryName} />
}

export function BusinessLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.business_loan_title || 'Business Loan EMI Calculator'}
      description={t.loan?.business_loan_desc || 'Calculate your Business Loan EMI instantly. Plan your business finances and cash flow effectively.'}
      categoryName={categoryName}
    />
  )
}

export function GoldLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.gold_loan_title || 'Gold Loan EMI Calculator'}
      description={t.loan?.gold_loan_desc || 'Calculate your Gold Loan EMI instantly. Get quick funds against your gold ornaments with a clear repayment plan.'}
      categoryName={categoryName}
    />
  )
}

export function TwoWheelerLoanSeoContent() {
  const { t, categoryName } = useLoanSeoCopy()
  return (
    <SeoContentGenerator
      title={t.loan?.two_wheeler_loan_title || 'Two Wheeler Loan EMI Calculator'}
      description={t.loan?.two_wheeler_loan_desc || 'Calculate your Two Wheeler Loan EMI instantly. Plan your bike or scooter purchase with ease.'}
      categoryName={categoryName}
    />
  )
}
