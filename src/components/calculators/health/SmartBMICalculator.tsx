"use client"

import { useState } from "react"
import { Activity } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { calculateBMI } from "@/lib/logic/health"
import { useTranslation } from "@/hooks/useTranslation"

// This component is now "Language Agnostic" in its logic
// It only handles UI state and calls the pure logic function
export function SmartBMICalculator() {
  const { t, lang, changeLanguage } = useTranslation()
  
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(175)
  const [bmiResult, setBmiResult] = useState(0)
  const [categoryKey, setCategoryKey] = useState('')

  const handleCalculate = () => {
    const result = calculateBMI(weight, height)
    setBmiResult(result.bmi)
    setCategoryKey(result.category)
  }

  // Initial calculation
  if (bmiResult === 0) handleCalculate()

  return (
    <div className="space-y-4">
      {/* Language Switcher for Demo */}
      <div className="flex justify-end gap-2 mb-4">
        <button 
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('hi')}
          className={`px-3 py-1 rounded ${lang === 'hi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          हिंदी
        </button>
      </div>

      <FinancialCalculatorTemplate
        title={t('bmi.title')}
        description={t('bmi.description')}
        icon={Activity}
        calculate={handleCalculate}
        onDownload={() => {}} // Download logic would also need to be i18n aware
        inputs={
          <div className="space-y-6">
            <InputGroup 
              label={t('bmi.weight_label')} 
              value={weight} 
              onChange={(v) => { setWeight(v); handleCalculate(); }} 
              step={0.5} 
            />
            <InputGroup 
              label={t('bmi.height_label')} 
              value={height} 
              onChange={(v) => { setHeight(v); handleCalculate(); }} 
              step={1} 
            />
          </div>
        }
        result={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard 
              label={t('bmi.your_bmi')} 
              value={bmiResult.toFixed(1)} 
              type="highlight" 
            />
            <ResultCard 
              label={t('bmi.category_label')} 
              value={categoryKey ? t(`bmi.categories.${categoryKey}`) : '-'} 
              type="default" 
            />
          </div>
        }
      />
    </div>
  )
}
