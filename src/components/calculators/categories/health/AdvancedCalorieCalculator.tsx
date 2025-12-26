"use client"

import { useState, useEffect } from "react"
import { Utensils } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { CalorieSeoContent } from "@/components/calculators/seo/HealthSeo"
import { FAQSection, getHealthFAQs } from "@/components/calculators/ui/FAQSection"
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from "recharts"
import { Label } from "@/components/ui/label"
import { calculateMacros, MacroResult, Gender, ActivityLevel, Goal, DietType } from "@/lib/logic/health"
import { useTranslation } from "@/hooks/useTranslation"

export function AdvancedCalorieCalculator() {
  const { t } = useTranslation()
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<Gender>('male')
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(70)
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')
  const [dietType, setDietType] = useState<DietType>('balanced')

  const [result, setResult] = useState<MacroResult | null>(null)

  const handleCalculate = () => {
    const res = calculateMacros(weight, height, age, gender, activity, goal, dietType)
    setResult(res)
  }

  useEffect(() => {
    handleCalculate()
  }, [age, gender, height, weight, activity, goal, dietType])

  const chartData = result ? [
    { name: t('health.protein'), value: result.macros.protein * 4, grams: result.macros.protein, color: '#3b82f6' }, // Blue
    { name: t('health.fats'), value: result.macros.fats * 9, grams: result.macros.fats, color: '#eab308' }, // Yellow
    { name: t('health.carbs'), value: result.macros.carbs * 4, grams: result.macros.carbs, color: '#22c55e' }, // Green
  ] : []

  return (
    <FinancialCalculatorTemplate
      title={t('health.calorie_title')}
      description={t('health.calorie_desc')}
      icon={Utensils}
      calculate={handleCalculate}
      onClear={() => {
        setAge(30)
        setWeight(70)
        setHeight(170)
        setGoal('maintain')
      }}
      seoContent={<FAQSection faqs={getHealthFAQs('advanced-calorie')} />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('health.gender')}</Label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setGender('male')}
                  className={`flex-1 p-2 rounded-md border ${gender === 'male' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                >{t('health.male')}</button>
                <button 
                  onClick={() => setGender('female')}
                  className={`flex-1 p-2 rounded-md border ${gender === 'female' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                >{t('health.female')}</button>
              </div>
            </div>
            <InputGroup label={t('health.age')} value={age} onChange={setAge} min={15} max={100} />
            <InputGroup label={t('health.height')} value={height} onChange={setHeight} suffix="cm" min={100} max={250} />
            <InputGroup label={t('health.weight')} value={weight} onChange={setWeight} suffix="kg" min={30} max={200} />
          </div>

          <div className="space-y-2">
            <Label>{t('health.activity_level')}</Label>
            <select 
              value={activity} 
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full p-2 rounded-md border bg-background"
            >
              <option value="sedentary">{t('health.activity.sedentary')}</option>
              <option value="light">{t('health.activity.light')}</option>
              <option value="moderate">{t('health.activity.moderate')}</option>
              <option value="active">{t('health.activity.active')}</option>
              <option value="veryActive">{t('health.activity.very_active')}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('health.goal')}</Label>
              <select 
                value={goal} 
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="lose_extreme">{t('health.goals.lose_extreme')}</option>
                <option value="lose_standard">{t('health.goals.lose_standard')}</option>
                <option value="lose_mild">{t('health.goals.lose_mild')}</option>
                <option value="maintain">{t('health.goals.maintain')}</option>
                <option value="gain_mild">{t('health.goals.gain_mild')}</option>
                <option value="gain_standard">{t('health.goals.gain_standard')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>{t('health.diet_type')}</Label>
              <select 
                value={dietType} 
                onChange={(e) => setDietType(e.target.value as DietType)}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="balanced">{t('health.diet_types.balanced')}</option>
                <option value="high-protein">{t('health.diet_types.high_protein')}</option>
                <option value="low-carb">{t('health.diet_types.low_carb')}</option>
                <option value="keto">{t('health.diet_types.keto')}</option>
              </select>
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label={t('health.target_calories')} 
              value={result.targetCalories.toString()} 
              type="highlight" 
              subtext={t(`health.goals.${goal}`)}
            />
            <ResultCard 
              label={t('health.tdee')} 
              value={result.tdee.toString()} 
              type="default" 
            />
            <ResultCard 
              label={t('health.bmr')} 
              value={result.bmr.toString()} 
              type="default" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      const grams = (props as any)?.payload?.grams
                      return [`${grams ?? ''}g`, name] as any
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 flex flex-col justify-center">
              <h3 className="font-semibold text-lg">Daily Macros</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="font-medium text-blue-700">{t('health.protein')}</span>
                  <span className="font-bold text-blue-900">{result.macros.protein}g</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                  <span className="font-medium text-green-700">{t('health.carbs')}</span>
                  <span className="font-bold text-green-900">{result.macros.carbs}g</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <span className="font-medium text-yellow-700">{t('health.fats')}</span>
                  <span className="font-bold text-yellow-900">{result.macros.fats}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}
