"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Currency = {
  code: string
  symbol: string
  name: string
  rate: number // Relative to USD or base currency
}

export type Language = {
  code: string
  name: string
  nativeName: string
}

const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0095 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1.78 },
]

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
]

interface SettingsContextType {
  currency: Currency
  setCurrency: (code: string) => void
  language: string
  setLanguage: (code: string) => void
  availableCurrencies: Currency[]
  availableLanguages: Language[]
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0])
  const [language, setLanguageState] = useState<string>('en')

  // Load from local storage on mount
  useEffect(() => {
    const isValidLang = (code: string | null | undefined): code is string =>
      !!code && languages.some(l => l.code === code)

    // 1) Read URL locale prefix (highest priority)
    let pathLang: string | undefined
    try {
      const path = window.location.pathname || '/'
      const maybe = path.split('/')[1]
      if (isValidLang(maybe)) pathLang = maybe
    } catch {
      // ignore
    }

    // 2) Local storage fallback
    const savedCurrency = localStorage.getItem('calculator-currency')
    const savedLanguage = localStorage.getItem('calculator-language')

    if (savedCurrency) {
      const found = currencies.find(c => c.code === savedCurrency)
      if (found) setCurrencyState(found)
    }

    const initialLanguage = (pathLang ?? (isValidLang(savedLanguage) ? savedLanguage : 'en'))
    setLanguageState(initialLanguage)
    localStorage.setItem('calculator-language', initialLanguage)
    document.documentElement.lang = initialLanguage
    document.documentElement.dir = initialLanguage === 'ar' || initialLanguage === 'ur' ? 'rtl' : 'ltr'
  }, [])

  const setCurrency = (code: string) => {
    const found = currencies.find(c => c.code === code)
    if (found) {
      setCurrencyState(found)
      localStorage.setItem('calculator-currency', code)
    }
  }

  const setLanguage = (code: string) => {
    setLanguageState(code)
    localStorage.setItem('calculator-language', code)
    // Set document direction for RTL languages (future support)
    document.documentElement.dir = code === 'ar' || code === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
  }

  return (
    <SettingsContext.Provider value={{
      currency,
      setCurrency,
      language,
      setLanguage,
      availableCurrencies: currencies,
      availableLanguages: languages
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
