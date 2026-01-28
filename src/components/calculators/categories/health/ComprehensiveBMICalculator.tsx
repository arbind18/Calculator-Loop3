"use client"

import { useState, useEffect } from "react"
import { Scale, Activity, Heart, AlertTriangle, CheckCircle, Ruler, TrendingUp, Droplet, Download, Printer, Share2, RotateCcw, Trash2, Sparkles, FileSpreadsheet, FileText, FileJson, ImageIcon, Code, Globe, Link2, Database, Archive, Lock, Image as ImageIcon2 } from "lucide-react"
import type { HealthResult } from "@/components/calculators/templates/ComprehensiveHealthTemplate"
import { calculateBMI } from "@/lib/logic/health"
import { useTranslation } from "@/hooks/useTranslation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AdvancedCalculatorFeatures } from "@/components/AdvancedCalculatorFeatures"
import { saveToHistory } from "@/lib/history"
import { CustomDownloadModal } from "@/components/CustomDownloadModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

type UnitSystem = 'metric' | 'imperial'

interface BMIInputGroupProps {
  label: string
  value: number
  onChange: (val: number) => void
  suffix?: string
  min?: number
  max?: number
  step?: number
}

function BMIInputGroup({ label, value, onChange, suffix, min, max, step }: BMIInputGroupProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="pr-12"
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

export function ComprehensiveBMICalculator() {
  const { t } = useTranslation()
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [autoCalculate, setAutoCalculate] = useState(false)
  
  // Metric units
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [waist, setWaist] = useState(85)
  const [hip, setHip] = useState(95)
  const [neck, setNeck] = useState(35)
  
  const [result, setResult] = useState<HealthResult | null>(null)
  const [previousData, setPreviousData] = useState<any>(null)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState('csv')

  // Delete/Clear function - Set all to 0
  const handleReset = () => {
    // Store current data before clearing
    setPreviousData({
      weight,
      height,
      age,
      gender,
      waist,
      hip,
      neck,
      result
    })
    // Clear all to 0/defaults
    setWeight(0)
    setHeight(0)
    setAge(0)
    setGender('male')
    setWaist(0)
    setHip(0)
    setNeck(0)
    setResult(null)
  }

  // Reload function - Restore previous data
  const handleReload = () => {
    if (previousData) {
      setWeight(previousData.weight)
      setHeight(previousData.height)
      setAge(previousData.age)
      setGender(previousData.gender)
      setWaist(previousData.waist)
      setHip(previousData.hip)
      setNeck(previousData.neck)
      setResult(previousData.result)
    }
  }

  // Share function
  const handleShare = async () => {
    if (!result) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BMI Calculator Result',
          text: `My BMI is ${result.primaryMetric?.value} (${result.primaryMetric?.description})`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Unit conversion helpers
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 10) / 10
  const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462 * 10) / 10
  const cmToInches = (cm: number) => Math.round(cm * 0.393701 * 10) / 10
  const inchesToCm = (inches: number) => Math.round(inches / 0.393701 * 10) / 10

  // Get display values based on unit system
  const displayWeight = unitSystem === 'metric' ? weight : kgToLbs(weight)
  const displayHeight = unitSystem === 'metric' ? height : cmToInches(height)
  const displayWaist = unitSystem === 'metric' ? waist : cmToInches(waist)
  const displayHip = unitSystem === 'metric' ? hip : cmToInches(hip)
  const displayNeck = unitSystem === 'metric' ? neck : cmToInches(neck)

  // Calculate Body Fat Percentage (US Navy Method)
  const calculateBodyFat = (weightKg: number, heightCm: number, waistCm: number, neckCm: number, hipCm: number, genderType: 'male' | 'female') => {
    // Ensure positive values for log calculations to prevent NaN/Infinity
    const maleLogVal = Math.max(1, waistCm - neckCm);
    const femaleLogVal = Math.max(1, waistCm + hipCm - neckCm);
    const heightLogVal = Math.max(1, heightCm);

    if (genderType === 'male') {
      const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(maleLogVal) + 0.15456 * Math.log10(heightLogVal)) - 450
      return Math.max(0, Math.min(100, bodyFat))
    } else {
      const bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(femaleLogVal) + 0.22100 * Math.log10(heightLogVal)) - 450
      return Math.max(0, Math.min(100, bodyFat))
    }
  }

  // Calculate Waist to Hip Ratio
  const calculateWHR = (waistCm: number, hipCm: number) => {
    return waistCm / hipCm
  }

  // Get BMI category status color
  const getBMIStatus = (category: string): 'normal' | 'warning' | 'danger' | 'good' => {
    switch(category) {
      case 'underweight': return 'warning'
      case 'normal': return 'good'
      case 'overweight': return 'warning'
      case 'obese': return 'danger'
      default: return 'normal'
    }
  }

  // Generate BMI chart data
  const generateBMIChart = (bmiValue: number) => {
    return [
      { category: 'Underweight', range: '<18.5', min: 0, max: 18.5, current: bmiValue < 18.5, color: '#f59e0b' },
      { category: 'Normal', range: '18.5-24.9', min: 18.5, max: 24.9, current: bmiValue >= 18.5 && bmiValue < 25, color: '#10b981' },
      { category: 'Overweight', range: '25-29.9', min: 25, max: 29.9, current: bmiValue >= 25 && bmiValue < 30, color: '#f59e0b' },
      { category: 'Obese', range: '≥30', min: 30, max: 40, current: bmiValue >= 30, color: '#ef4444' }
    ]
  }

  const handleCalculate = () => {
    const res = calculateBMI(weight, height)
    const bmi = Number(res.bmi)
    
    // Calculate additional metrics
    const bodyFat = calculateBodyFat(weight, height, waist, neck, hip, gender)
    const whr = calculateWHR(waist, hip)
    const whrStatus = gender === 'male' 
      ? (whr < 0.90 ? 'good' : whr < 0.95 ? 'warning' : 'danger')
      : (whr < 0.80 ? 'good' : whr < 0.85 ? 'warning' : 'danger')
    
    const status = getBMIStatus(res.category)

    // Calculate Health Score (weighted average)
    const bmiDeviation = Math.abs(bmi - 22)
    const bmiScore = Math.max(0, Math.min(100, 100 - (bmiDeviation * 4)))
    
    const bodyFatIdeal = gender === 'male' ? 15 : 25
    const bodyFatScore = Math.max(0, Math.min(100, 100 - Math.abs(bodyFat - bodyFatIdeal) * 2))
    
    const whrIdeal = gender === 'male' ? 0.85 : 0.75
    const whrScore = Math.max(0, Math.min(100, 100 - Math.abs(whr - whrIdeal) * 200))
    
    const healthScore = Math.round((bmiScore * 0.4 + bodyFatScore * 0.4 + whrScore * 0.2))

    // Generate detailed recommendations
    const recommendations = []
    
    // Nutrition recommendations
    if (res.category === 'underweight') {
      recommendations.push({
        title: t('health.increaseCalories') || "Increase Caloric Intake",
        description: "Aim for a surplus of 300-500 calories per day. Focus on nutrient-dense foods like nuts, avocados, whole grains, lean proteins, and healthy fats.",
        priority: 'high' as const,
        category: "Nutrition"
      })
      recommendations.push({
        title: "Protein-Rich Diet",
        description: "Consume 1.6-2.2g of protein per kg of body weight daily to support muscle growth. Include chicken, fish, eggs, legumes, and dairy.",
        priority: 'high' as const,
        category: "Nutrition"
      })
    } else if (res.category === 'overweight' || res.category === 'obese') {
      const calorieDeficit = res.category === 'obese' ? '500-750' : '300-500'
      recommendations.push({
        title: t('health.reduceCalories') || "Create Caloric Deficit",
        description: `Reduce daily intake by ${calorieDeficit} calories for sustainable weight loss of 0.5-1kg per week. Use a food diary to track intake.`,
        priority: 'high' as const,
        category: "Nutrition"
      })
      recommendations.push({
        title: "Balanced Macros",
        description: "Aim for 40% carbs, 30% protein, 30% healthy fats. Avoid processed foods, sugary drinks, and excessive sodium.",
        priority: 'high' as const,
        category: "Nutrition"
      })
      recommendations.push({
        title: "Meal Timing",
        description: "Eat 4-5 smaller meals throughout the day to maintain metabolism. Avoid eating 2-3 hours before bedtime.",
        priority: 'medium' as const,
        category: "Nutrition"
      })
    } else {
      recommendations.push({
        title: "Maintain Balance",
        description: "Continue with balanced diet of whole foods, lean proteins, fruits, vegetables, and whole grains. Stay hydrated with 2-3 liters of water daily.",
        priority: 'low' as const,
        category: "Nutrition"
      })
    }

    // Exercise recommendations
    if (res.category === 'underweight') {
      recommendations.push({
        title: "Strength Training Focus",
        description: "3-4 days/week of resistance training. Focus on compound movements: squats, deadlifts, bench press, rows. Progressive overload is key.",
        priority: 'high' as const,
        category: "Exercise"
      })
      recommendations.push({
        title: "Limit Cardio",
        description: "Keep cardio to 2-3 sessions of 20-30 minutes per week to preserve calories for muscle building.",
        priority: 'medium' as const,
        category: "Exercise"
      })
    } else if (res.category === 'overweight' || res.category === 'obese') {
      recommendations.push({
        title: "Cardio Training",
        description: "150-300 minutes of moderate-intensity aerobic activity per week. Start with walking, cycling, or swimming. Gradually increase intensity.",
        priority: 'high' as const,
        category: "Exercise"
      })
      recommendations.push({
        title: "Resistance Training",
        description: "2-3 days/week of full-body strength training to preserve muscle mass during weight loss and boost metabolism.",
        priority: 'high' as const,
        category: "Exercise"
      })
      recommendations.push({
        title: "Daily Activity",
        description: "Increase NEAT (Non-Exercise Activity Thermogenesis): take stairs, walk during breaks, stand while working. Aim for 10,000 steps daily.",
        priority: 'medium' as const,
        category: "Lifestyle"
      })
    } else {
      recommendations.push({
        title: "Mixed Training",
        description: "Combine 150 minutes of cardio with 2-3 strength sessions weekly. Include flexibility and balance exercises.",
        priority: 'medium' as const,
        category: "Exercise"
      })
    }

    // Lifestyle recommendations
    if (bodyFat > (gender === 'male' ? 25 : 35)) {
      recommendations.push({
        title: "Sleep Optimization",
        description: "Get 7-9 hours of quality sleep. Poor sleep disrupts hunger hormones (leptin & ghrelin) and increases cravings.",
        priority: 'high' as const,
        category: "Lifestyle"
      })
      recommendations.push({
        title: "Stress Management",
        description: "Practice meditation, yoga, or deep breathing. Chronic stress elevates cortisol, promoting fat storage especially around the waist.",
        priority: 'medium' as const,
        category: "Lifestyle"
      })
    }

    // WHR specific recommendations
    if (whrStatus === 'danger') {
      recommendations.push({
        title: "Reduce Visceral Fat",
        description: "High waist-to-hip ratio indicates abdominal fat. Focus on reducing sugar, alcohol, and refined carbs. Increase fiber intake.",
        priority: 'high' as const,
        category: "Health"
      })
    }

    // Risk Factors
    const riskFactors = []
    if (bmi >= 30) {
      riskFactors.push("⚠️ High risk of Type 2 Diabetes (3-7x increased risk)")
      riskFactors.push("⚠️ Cardiovascular disease risk (2-3x higher)")
      riskFactors.push("⚠️ Hypertension and high cholesterol")
      riskFactors.push("⚠️ Joint stress, arthritis, and mobility issues")
      riskFactors.push("⚠️ Sleep apnea and breathing problems")
      riskFactors.push("⚠️ Increased cancer risk (certain types)")
    } else if (bmi >= 25) {
      riskFactors.push("⚡ Moderate risk of metabolic syndrome")
      riskFactors.push("⚡ Elevated blood pressure risk")
      riskFactors.push("⚡ Potential joint strain over time")
    } else if (bmi < 18.5) {
      riskFactors.push("⚠️ Risk of nutritional deficiencies (vitamins, minerals)")
      riskFactors.push("⚠️ Weakened immune system")
      riskFactors.push("⚠️ Osteoporosis and bone density loss")
      riskFactors.push("⚠️ Anemia and fatigue")
      riskFactors.push("⚠️ Fertility issues")
    }

    if (whrStatus === 'danger') {
      riskFactors.push("⚠️ High visceral fat increases heart disease risk")
      riskFactors.push("⚠️ Metabolic syndrome indicators present")
    }

    // BMI Chart data
    const chartData = generateBMIChart(bmi)

    setResult({
      primaryMetric: {
        label: t('health.yourBMI') || "Your BMI",
        value: res.bmi,
        status: status,
        description: `${t('health.category') || 'Category'}: ${res.category.charAt(0).toUpperCase() + res.category.slice(1)}`,
        icon: Scale
      },
      healthScore: healthScore,
      metrics: [
        {
          label: t('health.category') || "Weight Category",
          value: res.category.charAt(0).toUpperCase() + res.category.slice(1),
          status: status,
          icon: Activity,
          description: `BMI Range: ${chartData.find(c => c.current)?.range || ''}`
        },
        {
          label: "Body Fat %",
          value: bodyFat.toFixed(1),
          unit: "%",
          status: bodyFat < (gender === 'male' ? 25 : 35) ? 'good' : 'warning',
          icon: Droplet,
          description: `Ideal: ${gender === 'male' ? '10-20%' : '20-30%'}`
        },
        {
          label: "Waist-Hip Ratio",
          value: whr.toFixed(2),
          status: whrStatus,
          icon: Ruler,
          description: `${whrStatus === 'good' ? 'Healthy range' : whrStatus === 'warning' ? 'Borderline' : 'Action needed'}`
        },
        {
          label: t('health.idealWeight') || "Ideal Weight Range",
          value: `${res.idealWeightMin} - ${res.idealWeightMax}`,
          unit: unitSystem === 'metric' ? "kg" : "lbs",
          status: 'good',
          icon: TrendingUp,
          description: `Based on BMI 18.5-24.9`
        },
        {
          label: t('health.height') || "Height",
          value: displayHeight,
          unit: unitSystem === 'metric' ? "cm" : "in",
          status: 'normal',
          icon: Activity
        },
        {
          label: t('health.weight') || "Current Weight",
          value: displayWeight,
          unit: unitSystem === 'metric' ? "kg" : "lbs",
          status: status === 'good' ? 'normal' : status,
          icon: Scale
        }
      ],
      recommendations: recommendations,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
      chartData: chartData.map(item => ({
        name: item.category,
        range: item.range,
        value: item.current ? bmi : 0,
        fill: item.color,
        current: item.current
      })),
      detailedBreakdown: {
        "BMI": `${bmi.toFixed(1)} (${res.category})`,
        "BMI Prime": `${(bmi / 25).toFixed(2)} ${bmi / 25 > 1 ? '(Above ideal)' : '(Below ideal)'}`,
        "Body Fat %": `${bodyFat.toFixed(1)}% (${gender === 'male' ? 'Male' : 'Female'})`,
        "Waist-Hip Ratio": `${whr.toFixed(2)} (${whrStatus === 'good' ? 'Low risk' : whrStatus === 'warning' ? 'Moderate risk' : 'High risk'})`,
        "Ponderal Index": `${(weight / Math.pow(height/100, 3)).toFixed(2)} kg/m³`,
        "BMR (Basal Metabolic Rate)": `${(10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)).toFixed(0)} kcal/day`,
        "TDEE (Sedentary)": `${((10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)) * 1.2).toFixed(0)} kcal/day`,
        "TDEE (Moderate Activity)": `${((10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)) * 1.55).toFixed(0)} kcal/day`,
        "TDEE (Very Active)": `${((10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)) * 1.725).toFixed(0)} kcal/day`
      }
    })

    // Save to history for advanced features
    saveToHistory({
      category: 'health',
      tool: 'bmi-calculator',
      inputs: {
        weight: weight,
        height: height,
        age: age,
        gender: gender,
        unitSystem: unitSystem
      },
      result: {
        main: bmi,
        bmi: bmi,
        category: res.category,
        bodyFat: bodyFat.toFixed(1),
        whr: whr.toFixed(2),
        healthScore: healthScore,
        chartData: res.chartData
      },
      timestamp: new Date().toISOString()
    })

    // Debug: Check if advanced features are working
    console.log('🚀 BMI Calculator - Advanced Features Data:', {
      hasPrimaryMetric: !!result,
      hasChartData: !!chartData,
      chartDataLength: chartData?.length,
      bmiValue: bmi
    })
  }

  // Auto calculate effect
  useEffect(() => {
    if (autoCalculate && weight > 0 && height > 0) {
      const timer = setTimeout(() => {
        handleCalculate()
      }, 100) // Fast execution with minimal delay
      return () => clearTimeout(timer)
    }
  }, [autoCalculate, weight, height, age, gender, waist, hip, neck, unitSystem])

  // Handle auto calculate toggle
  const handleAutoCalculateToggle = (checked: boolean) => {
    setAutoCalculate(checked)
    if (checked && weight > 0 && height > 0) {
      handleCalculate() // Immediate calculation when enabled
    }
  }

  const handleWeightChange = (value: number) => {
    const newWeight = unitSystem === 'metric' ? value : lbsToKg(value)
    setWeight(newWeight)
  }

  const handleHeightChange = (value: number) => {
    const newHeight = unitSystem === 'metric' ? value : inchesToCm(value)
    setHeight(newHeight)
  }

  const handleWaistChange = (value: number) => {
    const newWaist = unitSystem === 'metric' ? value : inchesToCm(value)
    setWaist(newWaist)
  }

  const handleHipChange = (value: number) => {
    const newHip = unitSystem === 'metric' ? value : inchesToCm(value)
    setHip(newHip)
  }

  const handleNeckChange = (value: number) => {
    const newNeck = unitSystem === 'metric' ? value : inchesToCm(value)
    setNeck(newNeck)
  }

  const toggleUnitSystem = () => {
    setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-4">
            <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Health & Fitness</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('health.bmiCalculator') || 'Advanced BMI Calculator'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('health.bmiDescription') || 'Calculate your Body Mass Index with detailed health insights and personalized recommendations'}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Auto Calculate</span>
              <Switch
                checked={autoCalculate}
                onCheckedChange={handleAutoCalculateToggle}
                className="ml-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Reset calculator"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReload}
                title="Reload previous data"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                title="Share results"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrint}
                title="Print"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download options"
                    className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700 bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 max-h-[500px] overflow-y-auto">
                  <DropdownMenuLabel className="font-semibold">Download Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* BASIC & STANDARD */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">BASIC & STANDARD</div>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('csv'); setShowDownloadModal(true); }}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                    CSV (Excel)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('excel'); setShowDownloadModal(true); }}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('pdf'); setShowDownloadModal(true); }}>
                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                    PDF Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('json'); setShowDownloadModal(true); }}>
                    <FileJson className="mr-2 h-4 w-4 text-yellow-600" />
                    JSON Data
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* IMAGES & VISUALS */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">IMAGES & VISUALS</div>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('png'); setShowDownloadModal(true); }}>
                    <ImageIcon className="mr-2 h-4 w-4 text-purple-600" />
                    PNG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('jpg'); setShowDownloadModal(true); }}>
                    <ImageIcon className="mr-2 h-4 w-4 text-blue-600" />
                    JPG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('svg'); setShowDownloadModal(true); }}>
                    <Code className="mr-2 h-4 w-4 text-orange-600" />
                    SVG Vector
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* ADVANCED DOCS */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ADVANCED DOCS</div>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('html'); setShowDownloadModal(true); }}>
                    <Globe className="mr-2 h-4 w-4 text-blue-600" />
                    HTML Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('word'); setShowDownloadModal(true); }}>
                    <FileText className="mr-2 h-4 w-4 text-blue-600" />
                    Word (.docx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('ppt'); setShowDownloadModal(true); }}>
                    <FileText className="mr-2 h-4 w-4 text-orange-600" />
                    PowerPoint (.pptx)
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* DEVELOPER DATA */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">DEVELOPER DATA</div>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('xml'); setShowDownloadModal(true); }}>
                    <Code className="mr-2 h-4 w-4 text-purple-600" />
                    XML Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('api'); setShowDownloadModal(true); }}>
                    <Link2 className="mr-2 h-4 w-4 text-blue-600" />
                    API Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('sql'); setShowDownloadModal(true); }}>
                    <Database className="mr-2 h-4 w-4 text-green-600" />
                    SQL Insert
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('sqlite'); setShowDownloadModal(true); }}>
                    <Database className="mr-2 h-4 w-4 text-teal-600" />
                    SQLite DB
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* ARCHIVES & SECURITY */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">ARCHIVES & SECURITY</div>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('zip'); setShowDownloadModal(true); }}>
                    <Archive className="mr-2 h-4 w-4 text-gray-600" />
                    ZIP Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('encrypted-pdf'); setShowDownloadModal(true); }}>
                    <Lock className="mr-2 h-4 w-4 text-red-600" />
                    Encrypted PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDownloadFormat('password-zip'); setShowDownloadModal(true); }}>
                    <Lock className="mr-2 h-4 w-4 text-orange-600" />
                    Password ZIP
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        {/* Custom Download Modal */}
        <CustomDownloadModal
          open={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          data={{
            weight: unitSystem === 'metric' ? weight : kgToLbs(weight),
            height: unitSystem === 'metric' ? height : cmToInches(height),
            age,
            gender,
            bmi: result?.primaryMetric?.value || '',
            category: result?.primaryMetric?.description || '',
            recommendations: result?.recommendations || [],
            schedule: []
          }}
          title="BMI Calculator Results"
          format={downloadFormat}
        />

        {/* Main Calculator Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Unit Toggle */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl mb-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <Ruler className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">
                    {unitSystem === 'metric' ? '📏 Metric System' : '📐 Imperial System'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {unitSystem === 'metric' ? 'kg, cm' : 'lbs, inches'}
                  </p>
                </div>
              </div>
              <Switch
                checked={unitSystem === 'imperial'}
                onCheckedChange={toggleUnitSystem}
              />
            </div>

            {/* Input Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {t('health.basicInfo') || 'Basic Information'}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <BMIInputGroup 
                      label={t('health.weight') || 'Weight'} 
                      value={displayWeight} 
                      onChange={handleWeightChange} 
                      suffix={unitSystem === 'metric' ? 'kg' : 'lbs'} 
                      min={unitSystem === 'metric' ? 20 : 44} 
                      max={unitSystem === 'metric' ? 300 : 661}
                      step={unitSystem === 'metric' ? 0.1 : 0.2}
                    />
                    <BMIInputGroup 
                      label={t('health.height') || 'Height'} 
                      value={displayHeight} 
                      onChange={handleHeightChange} 
                      suffix={unitSystem === 'metric' ? 'cm' : 'in'} 
                      min={unitSystem === 'metric' ? 50 : 20} 
                      max={unitSystem === 'metric' ? 250 : 98}
                      step={unitSystem === 'metric' ? 0.1 : 0.5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <BMIInputGroup 
                      label={t('health.age') || 'Age'} 
                      value={age} 
                      onChange={setAge} 
                      min={2} 
                      max={120}
                      suffix={t('common.years') || 'years'}
                    />
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t('health.gender') || 'Gender'}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setGender('male')}
                          className={`py-2.5 px-3 rounded-lg border-2 transition-all font-medium text-sm ${
                            gender === 'male' 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                              : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          👨 {t('health.male') || 'Male'}
                        </button>
                        <button
                          onClick={() => setGender('female')}
                          className={`py-2.5 px-3 rounded-lg border-2 transition-all font-medium text-sm ${
                            gender === 'female' 
                              ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-600/20' 
                              : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          👩 {t('health.female') || 'Female'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    {t('health.bodyMeasurements') || 'Body Measurements'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    💡 {t('health.forAccuracy') || 'For accurate body fat % calculation'}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <BMIInputGroup 
                      label={t('health.waist') || 'Waist'} 
                      value={displayWaist} 
                      onChange={handleWaistChange} 
                      suffix={unitSystem === 'metric' ? 'cm' : 'in'} 
                      min={unitSystem === 'metric' ? 40 : 16} 
                      max={unitSystem === 'metric' ? 200 : 79}
                      step={unitSystem === 'metric' ? 0.1 : 0.5}
                    />
                    <BMIInputGroup 
                      label={t('health.hip') || 'Hip'} 
                      value={displayHip} 
                      onChange={handleHipChange} 
                      suffix={unitSystem === 'metric' ? 'cm' : 'in'} 
                      min={unitSystem === 'metric' ? 50 : 20} 
                      max={unitSystem === 'metric' ? 200 : 79}
                      step={unitSystem === 'metric' ? 0.1 : 0.5}
                    />
                    <BMIInputGroup 
                      label={t('health.neck') || 'Neck'} 
                      value={displayNeck} 
                      onChange={handleNeckChange} 
                      suffix={unitSystem === 'metric' ? 'cm' : 'in'} 
                      min={unitSystem === 'metric' ? 20 : 8} 
                      max={unitSystem === 'metric' ? 70 : 28}
                      step={unitSystem === 'metric' ? 0.1 : 0.5}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Scale className="h-5 w-5 mr-2" />
                  {t('common.calculate') || 'Calculate BMI'}
                </Button>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {result ? (
                  <div className="text-center p-8 bg-green-50 dark:bg-green-950/20 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Your BMI</p>
                    <p className="text-5xl font-bold text-green-600 dark:text-green-400">{result.primaryMetric?.value}</p>
                    <p className="text-lg mt-2 text-slate-700 dark:text-slate-300">{result.primaryMetric?.description}</p>
                  </div>
                ) : (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Scale className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Ready to Calculate
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Enter your measurements and click Calculate BMI to get your detailed health analysis
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
