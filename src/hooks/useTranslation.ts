"use client"

import { useCallback, useMemo } from 'react'
import { useSettings } from '@/components/providers/SettingsProvider'
import { getMergedTranslations } from '@/lib/translations'

export function useTranslation() {
  const { language, setLanguage } = useSettings()

  const dict = useMemo(() => getMergedTranslations(language), [language])

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      const keys = key.split('.')
      let value: any = dict
      for (const k of keys) value = value?.[k]

      if (typeof value === 'string' && params) {
        return value.replace(/\{(\w+)\}/g, (_, paramKey) => params[paramKey] || `{${paramKey}}`)
      }
      return (typeof value === 'string' ? value : undefined) || key
    },
    [dict]
  )

  const changeLanguage = useCallback(
    (newLang: string) => {
      setLanguage(newLang)
    },
    [setLanguage]
  )

  return { t, lang: language, changeLanguage, dict }
}
