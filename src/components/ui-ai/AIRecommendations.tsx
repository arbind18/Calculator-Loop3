"use client"

import { useEffect, useMemo, useState } from 'react'
import { Sparkles, TrendingUp, Calculator } from 'lucide-react'
import Link from 'next/link'
import { implementedCalculatorList } from '@/lib/implementedCalculators'
import { useSettings } from '@/components/providers/SettingsProvider'
import { getMergedTranslations } from '@/lib/translations'
import { localizeToolMeta } from '@/lib/toolLocalization'

const EMPTY_HISTORY: string[] = []

interface CalculatorRecommendation {
  id: string
  name: string
  category: string
  reason: string
  relevanceScore: number
}

interface AIRecommendationsProps {
  currentCalculator?: string
  userHistory?: string[]
  limit?: number
}

export function AIRecommendations({ 
  currentCalculator, 
  userHistory,
  limit = 4 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<CalculatorRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  const { language } = useSettings()
  const dict = useMemo(() => getMergedTranslations(language), [language])

  const prefix = language && language !== 'en' ? `/${language}` : ''

  const withLocale = (href: string) => {
    if (!href) return href
    if (href.startsWith('#')) return `${prefix}/${href}`
    if (!href.startsWith('/')) return href
    if (!prefix) return href
    if (href === '/') return prefix
    return `${prefix}${href}`
  }

  const history = userHistory ?? EMPTY_HISTORY
  const historyKey = useMemo(() => history.join('|'), [history])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    
    // Simulate AI recommendation engine
    // In production, this would call your ML API
    const allCalculators = [
      // Financial cluster
      // NOTE: Use implemented calculator IDs only to avoid 404s.
      { id: 'personal-loan-emi', name: 'EMI Calculator', category: 'loan', cluster: 'financial', keywords: ['loan', 'emi', 'interest'] },
      { id: 'sip-calculator', name: 'SIP Calculator', category: 'investment', cluster: 'financial', keywords: ['investment', 'mutual fund', 'sip'] },
      { id: 'home-loan-emi', name: 'Home Loan EMI', category: 'loan', cluster: 'financial', keywords: ['home', 'loan', 'property'] },
      { id: 'fd-calculator', name: 'FD Calculator', category: 'banking', cluster: 'financial', keywords: ['fixed deposit', 'savings', 'interest'] },
      
      // Tax cluster
      { id: 'income-tax-calculator', name: 'Income Tax Calculator', category: 'tax', cluster: 'tax', keywords: ['tax', 'income', 'salary'] },
      { id: 'gst-calculator', name: 'GST Calculator', category: 'tax', cluster: 'tax', keywords: ['gst', 'tax', 'business'] },
      { id: 'hra-calculator', name: 'HRA Calculator', category: 'tax', cluster: 'tax', keywords: ['hra', 'rent', 'tax'] },
      
      // Health cluster
      { id: 'bmi-calculator', name: 'BMI Calculator', category: 'health', cluster: 'health', keywords: ['bmi', 'weight', 'health'] },
      { id: 'calorie-calculator', name: 'Calorie Calculator', category: 'health', cluster: 'health', keywords: ['calories', 'diet', 'nutrition'] },
      
      // Real Estate cluster
      { id: 'rental-yield', name: 'Rental Yield Calculator', category: 'real-estate', cluster: 'property', keywords: ['rental', 'property', 'investment'] },
      { id: 'stamp-duty', name: 'Stamp Duty Calculator', category: 'real-estate', cluster: 'property', keywords: ['stamp duty', 'property', 'registration'] },
    ]

    const scored = allCalculators
      .filter(calc => implementedCalculatorList.includes(calc.id))
      .filter(calc => calc.id !== currentCalculator)
      .map(calc => {
        let score = 0
        
        // User history based scoring
        const historyCount = history.filter(h => h === calc.id).length
        score += historyCount * 10
        
        // Category affinity
        const currentCalc = allCalculators.find(c => c.id === currentCalculator)
        if (currentCalc && calc.cluster === currentCalc.cluster) {
          score += 30
        }
        
        // Popularity bonus (simulate)
        const popularCalcs = ['personal-loan-emi', 'sip-calculator', 'income-tax-calculator', 'bmi-calculator']
        if (popularCalcs.includes(calc.id)) {
          score += 15
        }
        
        // Contextual recommendations
        if (currentCalculator === 'home-loan-emi' && calc.id === 'stamp-duty') score += 40
        if (currentCalculator === 'sip-calculator' && calc.id === 'income-tax-calculator') score += 35
        if (currentCalculator === 'bmi-calculator' && calc.id === 'calorie-calculator') score += 35
        
        // Generate reason
        let reason = ''
        if (score > 40) reason = 'Highly relevant to your current calculation'
        else if (historyCount > 0) reason = 'You used this recently'
        else if (currentCalc && calc.cluster === currentCalc.cluster) reason = `Related ${calc.cluster} tool`
        else reason = 'Popular calculator'
        
        return {
          ...calc,
          reason,
          relevanceScore: score
        }
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return
      setRecommendations(scored)
      setLoading(false)
    }, 500)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [currentCalculator, limit, historyKey])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <span>AI Recommendations</span>
      </div>

      <div className="grid gap-3">
        {recommendations.map((rec) => (
          (() => {
            const title = localizeToolMeta({
              dict,
              toolId: rec.id,
              fallbackTitle: rec.name,
              fallbackDescription: '',
            }).title
            const href = withLocale(`/calculator/${rec.id}`)

            return (
          <Link
            key={rec.id}
            href={href}
            className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  {rec.reason}
                </p>
              </div>
              
              {rec.relevanceScore > 40 && (
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold px-2 py-1 rounded-full">
                  Top Pick
                </div>
              )}
            </div>
          </Link>
            )
          })()
        ))}
      </div>
    </div>
  )
}
