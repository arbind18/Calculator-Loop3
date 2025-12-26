"use client"

import { useEffect, useState } from 'react'
import { Wand2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AutofillSuggestion {
  field: string
  value: number | string
  confidence: number
  reason: string
}

interface AIAutofillProps {
  calculatorType: string
  userHistory?: any[]
  currentValues?: Record<string, any>
  onApplySuggestion: (field: string, value: any) => void
}

export function AIAutofill({ 
  calculatorType, 
  userHistory = [],
  currentValues = {},
  onApplySuggestion 
}: AIAutofillProps) {
  const [suggestions, setSuggestions] = useState<AutofillSuggestion[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    generateSuggestions()
  }, [calculatorType, userHistory, currentValues])

  const generateSuggestions = () => {
    const newSuggestions: AutofillSuggestion[] = []
    
    // Analyze user history for patterns
    const historyValues: Record<string, number[]> = {}
    userHistory.forEach(calc => {
      if (calc.type === calculatorType) {
        Object.keys(calc.inputs || {}).forEach(field => {
          if (!historyValues[field]) historyValues[field] = []
          historyValues[field].push(calc.inputs[field])
        })
      }
    })
    
    // Generate smart suggestions based on calculator type
    if (calculatorType === 'emi-calculator' || calculatorType === 'home-loan-emi') {
      // Average home loan in India: 30-50 lakh
      if (!currentValues.principal && !dismissed.has('principal')) {
        const avgFromHistory = historyValues.principal?.length 
          ? Math.round(historyValues.principal.reduce((a, b) => a + b) / historyValues.principal.length)
          : null
        
        newSuggestions.push({
          field: 'principal',
          value: avgFromHistory || 3500000,
          confidence: avgFromHistory ? 0.85 : 0.65,
          reason: avgFromHistory ? 'Based on your previous loans' : 'Average home loan amount in India'
        })
      }
      
      // Current market interest rates
      if (!currentValues.interestRate && !dismissed.has('interestRate')) {
        newSuggestions.push({
          field: 'interestRate',
          value: 8.5,
          confidence: 0.80,
          reason: 'Current market average interest rate'
        })
      }
      
      // Standard home loan tenure
      if (!currentValues.tenure && !dismissed.has('tenure')) {
        const avgTenure = historyValues.tenure?.length
          ? Math.round(historyValues.tenure.reduce((a, b) => a + b) / historyValues.tenure.length)
          : null
        
        newSuggestions.push({
          field: 'tenure',
          value: avgTenure || 20,
          confidence: avgTenure ? 0.90 : 0.70,
          reason: avgTenure ? 'Your typical loan duration' : 'Standard home loan tenure'
        })
      }
    }
    
    if (calculatorType === 'sip-calculator') {
      // Smart SIP suggestions based on income bracket
      if (!currentValues.monthlyInvestment && !dismissed.has('monthlyInvestment')) {
        const avgFromHistory = historyValues.monthlyInvestment?.length
          ? Math.round(historyValues.monthlyInvestment.reduce((a, b) => a + b) / historyValues.monthlyInvestment.length)
          : null
        
        newSuggestions.push({
          field: 'monthlyInvestment',
          value: avgFromHistory || 5000,
          confidence: avgFromHistory ? 0.88 : 0.60,
          reason: avgFromHistory ? 'Based on your investment pattern' : 'Recommended starter amount'
        })
      }
      
      // Expected market returns
      if (!currentValues.expectedReturn && !dismissed.has('expectedReturn')) {
        newSuggestions.push({
          field: 'expectedReturn',
          value: 12,
          confidence: 0.75,
          reason: 'Average equity mutual fund returns'
        })
      }
      
      // Long-term investment
      if (!currentValues.duration && !dismissed.has('duration')) {
        newSuggestions.push({
          field: 'duration',
          value: 10,
          confidence: 0.70,
          reason: 'Optimal duration for wealth creation'
        })
      }
    }
    
    if (calculatorType === 'bmi-calculator') {
      // Average Indian adult values
      if (!currentValues.weight && !dismissed.has('weight')) {
        newSuggestions.push({
          field: 'weight',
          value: 70,
          confidence: 0.50,
          reason: 'Average adult weight'
        })
      }
      
      if (!currentValues.height && !dismissed.has('height')) {
        newSuggestions.push({
          field: 'height',
          value: 170,
          confidence: 0.50,
          reason: 'Average adult height'
        })
      }
    }
    
    if (calculatorType === 'income-tax') {
      // Tax regime suggestion
      if (!currentValues.regime && !dismissed.has('regime')) {
        newSuggestions.push({
          field: 'regime',
          value: 'new',
          confidence: 0.65,
          reason: 'Most beneficial for salaries above ₹7.5L'
        })
      }
      
      // Standard deductions
      if (!currentValues.standardDeduction && !dismissed.has('standardDeduction')) {
        newSuggestions.push({
          field: 'standardDeduction',
          value: 50000,
          confidence: 0.95,
          reason: 'Standard deduction for FY 2024-25'
        })
      }
    }
    
    setSuggestions(newSuggestions.filter(s => s.confidence >= 0.5))
  }

  const applySuggestion = (suggestion: AutofillSuggestion) => {
    onApplySuggestion(suggestion.field, suggestion.value)
    setDismissed(prev => new Set([...prev, suggestion.field]))
  }

  const dismissSuggestion = (field: string) => {
    setDismissed(prev => new Set([...prev, field]))
  }

  if (suggestions.length === 0 || suggestions.every(s => dismissed.has(s.field))) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Wand2 className="h-4 w-4 text-purple-500" />
        <span>AI Smart Fill Suggestions</span>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          !dismissed.has(suggestion.field) && (
            <div
              key={suggestion.field}
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-gray-900 dark:text-white capitalize">
                    {suggestion.field.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-6 rounded ${
                          i < suggestion.confidence * 3
                            ? 'bg-purple-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mt-1">
                  {typeof suggestion.value === 'number' 
                    ? suggestion.value.toLocaleString('en-IN')
                    : suggestion.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {suggestion.reason}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => applySuggestion(suggestion)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissSuggestion(suggestion.field)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
