"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Currency = {
  code: string
  symbol: string
  name: string
  rate: number // Relative to USD or base currency
  flag?: string
}

export type Language = {
  code: string
  name: string
  nativeName: string
  flag?: string
}

const currencies: Currency[] = [
  // Note: `rate` is currently not used across the app; keep values as placeholders.
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1, flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012, flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0095, flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011, flag: '🇪🇺' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 0.06, flag: '🇧🇷' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', rate: 0.21, flag: '🇲🇽' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 157, flag: '🇮🇩' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.044, flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 0.045, flag: '🇸🇦' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 3.3, flag: '🇵🇰' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 1.4, flag: '🇧🇩' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar', rate: 0.016, flag: '🇨🇦' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1.78, flag: '🇯🇵' },
]

const languages: Language[] = [
  // India (existing)
  // English: showing 🇺🇸 (most widely recognized; used by India/USA/UK/Canada)
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  // Bengali: showing 🇧🇩 (Bangladesh)
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },

  // International
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
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

  const setLanguageCookie = (code: string) => {
    try {
      // Persist for middleware (locale redirect) + server metadata.
      // 1 year expiry.
      const maxAge = 60 * 60 * 24 * 365
      document.cookie = `calculator-language=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`
    } catch {
      // ignore
    }
  }

  const getCookie = (name: string): string | null => {
    try {
      const cookie = document.cookie || ''
      const parts = cookie.split(';')
      for (const part of parts) {
        const [k, ...rest] = part.trim().split('=')
        if (k === name) return decodeURIComponent(rest.join('='))
      }
    } catch {
      // ignore
    }
    return null
  }

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

    // 2.5) Cookie fallback (helps server-rendered pages + middleware redirect)
    const cookieLanguage = getCookie('calculator-language')

    if (savedCurrency) {
      const found = currencies.find(c => c.code === savedCurrency)
      if (found) setCurrencyState(found)
    }

    const initialLanguage =
      pathLang ??
      (isValidLang(cookieLanguage) ? cookieLanguage : undefined) ??
      (isValidLang(savedLanguage) ? savedLanguage : 'en')
    setLanguageState(initialLanguage)
    localStorage.setItem('calculator-language', initialLanguage)
    setLanguageCookie(initialLanguage)
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
    setLanguageCookie(code)
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
