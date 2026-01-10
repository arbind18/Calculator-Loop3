"use client"

import { useState, useEffect } from "react"
import { Scale, Activity, User, TrendingUp } from "lucide-react"
import { ComprehensiveHealthTemplate, HealthResult } from "@/components/calculators/templates/ComprehensiveHealthTemplate"
import { InputGroup } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts"
import { calculateBMI, BMIResult } from "@/lib/logic/health"
import { useTranslation } from "@/hooks/useTranslation"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

export function AdvancedBMICalculator() {
  const { t } = useTranslation()
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  
  const [result, setResult] = useState<HealthResult | null>(null)

  const handleCalculate = () => {
    const res = calculateBMI(weight, height)
    
    let color = ""
    let status: 'normal' | 'warning' | 'danger' | 'good' = 'normal'
    switch(res.category) {
      case 'underweight': 
        color = "#3b82f6"
        status = 'warning'
        break;
      case 'normal': 
        color = "#22c55e"
        status = 'good'
        break;
      case 'overweight': 
        color = "#eab308"
        status = 'warning'
        break;
      case 'obese': 
        color = "#ef4444"
        status = 'danger'
        break;
    }
    
    const healthResult: HealthResult = {
      primaryMetric: {
        label: t('health.your_bmi'),
        value: res.bmi,
        unit: "",
        status: status,
        description: `Category: ${t(`health.categories.${res.category}`)}`,
        icon: Scale
      },
      metrics: [
        { 
          label: t('health.category'), 
          value: t(`health.categories.${res.category}`), 
          status: status, 
          icon: Activity 
        },
        { 
          label: t('health.ideal_weight_range'), 
          value: `${res.idealWeightMin} - ${res.idealWeightMax}`, 
          unit: "kg",
          status: 'normal', 
          icon: TrendingUp 
        },
      ],
      recommendations: [
        {
          title: "BMI Category",
          description: res.category === 'normal' 
            ? "Your BMI is in the healthy range. Maintain your current lifestyle."
            : res.category === 'underweight'
            ? "Consider consulting a healthcare provider for a proper nutrition plan."
            : "Consider a balanced diet and regular exercise. Consult a healthcare professional.",
          priority: res.category === 'normal' ? 'low' : 'high',
          category: "Health"
        }
      ],
      detailedBreakdown: {
        "Weight": `${weight} kg`,
        "Height": `${height} cm`,
        "BMI": res.bmi.toString(),
        "Category": t(`health.categories.${res.category}`)
      },
      healthScore: res.category === 'normal' ? 85 : res.category === 'overweight' ? 65 : res.category === 'underweight' ? 70 : 50
    }
    
    setResult(healthResult)
  }

  const handleClear = () => {
    setWeight(70)
    setHeight(170)
    setResult(null)
  }

  useEffect(() => {
    handleCalculate()
  }, [weight, height])

  // Gauge Chart Data
  const gaugeData = [
    { name: t('health.categories.underweight'), value: 18.5, color: '#3b82f6' },
    { name: t('health.categories.normal'), value: 6.5, color: '#22c55e' }, // 25 - 18.5
    { name: t('health.categories.overweight'), value: 5, color: '#eab308' }, // 30 - 25
    { name: t('health.categories.obese'), value: 10, color: '#ef4444' }, // 40 - 30
  ]

  // Needle rotation
  const needleRotation = result?.primaryMetric ? 180 - (Math.min(Math.max(Number(result.primaryMetric.value), 0), 40) / 40) * 180 : 90

  return (
    <ComprehensiveHealthTemplate
      title={t('health.bmi_title')}
      description={t('health.bmi_desc')}
      icon={Scale}
      calculate={handleCalculate}
      onClear={handleClear}
      result={result}
      values={[weight, height]}
      categoryName="Health"
      toolId="bmi-calculator"
      seoContent={<SeoContentGenerator title={t('health.bmi_title')} description={t('health.bmi_desc')} categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label={t('health.weight')} 
              value={weight} 
              onChange={setWeight} 
              suffix="kg" 
              min={20} 
              max={300} 
            />
            <InputGroup 
              label={t('health.height')} 
              value={height} 
              onChange={setHeight} 
              suffix="cm" 
              min={50} 
              max={250} 
            />
          </div>
        </div>
      }
    />
  )
}
