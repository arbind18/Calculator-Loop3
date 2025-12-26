"use client"

import { useState, useEffect } from "react"
import { Scale } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts"
import { calculateBMI, BMIResult } from "@/lib/logic/health"
import { useTranslation } from "@/hooks/useTranslation"

export function AdvancedBMICalculator() {
  const { t } = useTranslation()
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  
  const [result, setResult] = useState<BMIResult & { color: string } | null>(null)

  const handleCalculate = () => {
    const res = calculateBMI(weight, height)
    
    let color = ""
    switch(res.category) {
      case 'underweight': color = "#3b82f6"; break;
      case 'normal': color = "#22c55e"; break;
      case 'overweight': color = "#eab308"; break;
      case 'obese': color = "#ef4444"; break;
    }
    
    setResult({ ...res, color })
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
  const needleRotation = result ? 180 - (Math.min(Math.max(Number(result.bmi), 0), 40) / 40) * 180 : 90

  return (
    <FinancialCalculatorTemplate
      title={t('health.bmi_title')}
      description={t('health.bmi_desc')}
      icon={Scale}
      calculate={handleCalculate}
      onClear={() => {
        setWeight(70)
        setHeight(170)
      }}
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
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label={t('health.your_bmi')} 
              value={result.bmi.toString()} 
              type="highlight" 
              className="border-2"
              style={{ borderColor: result.color }}
            />
            <ResultCard 
              label={t('health.category')} 
              value={t(`health.categories.${result.category}`)} 
              type="default" 
              style={{ color: result.color, fontWeight: 'bold' }}
            />
            <ResultCard 
              label={t('health.ideal_weight_range')} 
              value={`${result.idealWeightMin} - ${result.idealWeightMax} kg`} 
              type="success" 
            />
          </div>

          <div className="relative h-48 w-full flex justify-center items-end overflow-hidden">
             {/* Custom Gauge Implementation using CSS/SVG or Recharts Pie */}
             <div className="relative w-64 h-32">
                <ResponsiveContainer width="100%" height="200%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Needle */}
                <div 
                  className="absolute bottom-0 left-1/2 w-1 h-20 bg-slate-800 origin-bottom transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `translateX(-50%) rotate(${needleRotation}deg) translateY(-10px)`,
                    zIndex: 10
                  }}
                />
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-slate-800 rounded-full -translate-x-1/2 translate-y-1/2 z-20" />
             </div>
          </div>
          
          <div className="flex justify-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> {t('health.categories.underweight')} (&lt;18.5)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> {t('health.categories.normal')} (18.5-25)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> {t('health.categories.overweight')} (25-30)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> {t('health.categories.obese')} (&gt;30)</div>
          </div>
        </div>
      )}
    />
  )
}
