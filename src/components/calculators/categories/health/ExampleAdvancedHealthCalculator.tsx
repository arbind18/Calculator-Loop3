"use client"

import { useState } from "react"
import { Heart, Activity, Scale, TrendingUp, Droplets, Moon } from "lucide-react"
import {
  AdvancedHealthCalculatorTemplate,
  InputGroup,
  ResultCard,
  HealthResult,
  HealthMetric,
  HealthRecommendation
} from "@/components/calculators/templates/AdvancedHealthCalculatorTemplate"
import { calculateBMI, BMIResult } from "@/lib/logic/health"

/**
 * Example Advanced BMI & Health Assessment Calculator
 * Demonstrates the use of AdvancedHealthCalculatorTemplate with:
 * - Detailed metrics
 * - Health recommendations
 * - Risk factors
 * - Multiple download formats
 */
export function AdvancedBMIHealthCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'>('moderate')
  const [result, setResult] = useState<HealthResult | null>(null)

  const calculate = () => {
    // Calculate BMI
    const bmiData: BMIResult = calculateBMI(weight, height)
    
    // Calculate additional health metrics
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    // Calculate BMR (Basal Metabolic Rate)
    let bmr = 0
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }
    const tdee = Math.round(bmr * activityMultipliers[activityLevel])

    // Calculate ideal weight range (using BMI 18.5-25)
    const minIdealWeight = Math.round(18.5 * heightInMeters * heightInMeters)
    const maxIdealWeight = Math.round(25 * heightInMeters * heightInMeters)

    // Calculate body water percentage (rough estimate)
    const waterPercentage = gender === 'male' ? 60 : 55
    const bodyWater = Math.round((weight * waterPercentage) / 100)

    // Calculate health score (0-100)
    let healthScore = 100
    if (bmi < 18.5) healthScore -= 20
    else if (bmi >= 25 && bmi < 30) healthScore -= 15
    else if (bmi >= 30) healthScore -= 30
    if (age > 50) healthScore -= 5
    if (activityLevel === 'sedentary') healthScore -= 10
    else if (activityLevel === 'veryActive') healthScore += 5

    // Prepare primary metric
    const primaryMetric: HealthMetric = {
      label: "Body Mass Index (BMI)",
      value: bmi.toFixed(1),
      unit: "kg/m²",
      status: bmiData.category === 'normal' ? 'normal' : 
              bmiData.category === 'underweight' ? 'warning' : 
              bmiData.category === 'overweight' ? 'warning' : 'danger',
      description: `Your BMI indicates you are ${bmiData.category}`,
      icon: Scale
    }

    // Prepare additional metrics
    const metrics: HealthMetric[] = [
      {
        label: "Basal Metabolic Rate",
        value: Math.round(bmr),
        unit: "kcal/day",
        status: 'normal',
        description: "Calories burned at rest",
        icon: Activity
      },
      {
        label: "Total Daily Energy Expenditure",
        value: tdee,
        unit: "kcal/day",
        status: 'normal',
        description: "Total calories needed per day",
        icon: TrendingUp
      },
      {
        label: "Ideal Weight Range",
        value: `${minIdealWeight}-${maxIdealWeight}`,
        unit: "kg",
        status: weight >= minIdealWeight && weight <= maxIdealWeight ? 'good' : 'warning',
        description: "Based on healthy BMI range",
        icon: Scale
      },
      {
        label: "Body Water Content",
        value: bodyWater,
        unit: "kg",
        status: 'normal',
        description: "Estimated total body water",
        icon: Droplets
      },
      {
        label: "Recommended Sleep",
        value: age < 18 ? "8-10" : age < 65 ? "7-9" : "7-8",
        unit: "hours",
        status: 'normal',
        description: "Based on your age group",
        icon: Moon
      }
    ]

    // Prepare recommendations
    const recommendations: HealthRecommendation[] = []

    if (bmi < 18.5) {
      recommendations.push({
        title: "Increase Caloric Intake",
        description: "Consider eating more nutrient-dense foods and consulting with a nutritionist to gain weight healthily.",
        priority: 'high',
        category: 'Nutrition'
      })
    } else if (bmi >= 25 && bmi < 30) {
      recommendations.push({
        title: "Weight Management",
        description: "Consider a balanced diet and regular exercise to reach a healthier weight range.",
        priority: 'medium',
        category: 'Lifestyle'
      })
    } else if (bmi >= 30) {
      recommendations.push({
        title: "Consult Healthcare Provider",
        description: "Your BMI indicates obesity. Please consult with a healthcare provider for a personalized weight loss plan.",
        priority: 'high',
        category: 'Medical'
      })
    }

    if (activityLevel === 'sedentary') {
      recommendations.push({
        title: "Increase Physical Activity",
        description: "Aim for at least 150 minutes of moderate aerobic activity per week.",
        priority: 'high',
        category: 'Exercise'
      })
    }

    if (age > 40) {
      recommendations.push({
        title: "Regular Health Checkups",
        description: "Annual health screenings become increasingly important after age 40.",
        priority: 'medium',
        category: 'Prevention'
      })
    }

    recommendations.push({
      title: "Stay Hydrated",
      description: `Aim to drink at least ${Math.round(weight * 0.033)} liters of water daily.`,
      priority: 'medium',
      category: 'Nutrition'
    })

    recommendations.push({
      title: "Maintain Sleep Hygiene",
      description: "Consistent sleep schedule and quality sleep are crucial for overall health.",
      priority: 'low',
      category: 'Lifestyle'
    })

    // Prepare risk factors
    const riskFactors: string[] = []
    
    if (bmi >= 30) {
      riskFactors.push("Increased risk of cardiovascular disease")
      riskFactors.push("Higher risk of type 2 diabetes")
      riskFactors.push("Elevated risk of certain cancers")
    }
    
    if (bmi < 18.5) {
      riskFactors.push("Potential nutritional deficiencies")
      riskFactors.push("Weakened immune system")
      riskFactors.push("Osteoporosis risk")
    }
    
    if (activityLevel === 'sedentary') {
      riskFactors.push("Sedentary lifestyle increases chronic disease risk")
    }
    
    if (age > 50 && bmi >= 25) {
      riskFactors.push("Age and weight combination increases metabolic syndrome risk")
    }

    // Prepare detailed breakdown
    const detailedBreakdown = {
      'Weight Status': bmiData.category.toUpperCase(),
      'Weight Difference from Ideal': weight >= minIdealWeight && weight <= maxIdealWeight 
        ? 'Within ideal range' 
        : weight < minIdealWeight 
          ? `${minIdealWeight - weight} kg below minimum`
          : `${weight - maxIdealWeight} kg above maximum`,
      'Activity Level': activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1),
      'Age Group': age < 18 ? 'Youth' : age < 40 ? 'Young Adult' : age < 60 ? 'Middle Age' : 'Senior',
      'Gender': gender.charAt(0).toUpperCase() + gender.slice(1),
      'Daily Calorie Surplus/Deficit for Weight Loss': `${Math.round(tdee - 500)} kcal (500 cal deficit)`,
      'Daily Calorie Surplus for Weight Gain': `${Math.round(tdee + 500)} kcal (500 cal surplus)`
    }

    setResult({
      primaryMetric,
      metrics,
      recommendations,
      riskFactors: riskFactors.length > 0 ? riskFactors : undefined,
      healthScore: Math.max(0, Math.min(100, healthScore)),
      detailedBreakdown
    })
  }

  const handleClear = () => {
    setWeight(70)
    setHeight(170)
    setAge(30)
    setGender('male')
    setActivityLevel('moderate')
    setResult(null)
  }

  return (
    <AdvancedHealthCalculatorTemplate
      title="Advanced BMI & Health Assessment"
      description="Comprehensive body mass index calculation with personalized health insights, recommendations, and risk assessments."
      icon={Heart}
      calculate={calculate}
      calculateLabel="Calculate Health Metrics"
      onClear={handleClear}
      result={result}
      values={[weight, height, age, gender, activityLevel]}
      categoryName="Health & Fitness"
      toolId="advanced-bmi-health"
      inputs={
        <div className="space-y-6">
          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGender('male')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  gender === 'male'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  gender === 'female'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Weight Input */}
          <InputGroup
            label="Weight"
            value={weight}
            onChangeAction={setWeight}
            min={30}
            max={200}
            suffix="kg"
            description="Your current body weight"
          />

          {/* Height Input */}
          <InputGroup
            label="Height"
            value={height}
            onChangeAction={setHeight}
            min={120}
            max={220}
            suffix="cm"
            description="Your height in centimeters"
          />

          {/* Age Input */}
          <InputGroup
            label="Age"
            value={age}
            onChangeAction={setAge}
            min={15}
            max={100}
            suffix="years"
            description="Your current age"
          />

          {/* Activity Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background hover:border-primary/50 transition-all"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="light">Light (Exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
              <option value="active">Active (Exercise 6-7 days/week)</option>
              <option value="veryActive">Very Active (Intense exercise daily)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Select your typical weekly physical activity level
            </p>
          </div>
        </div>
      }
      seoContent={
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-3">Understanding Your BMI</h2>
            <p>
              Body Mass Index (BMI) is a widely used screening tool to categorize body weight relative to height.
              While BMI has limitations (it doesn't distinguish between muscle and fat mass), it provides a useful
              starting point for assessing health risks associated with weight.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-3">BMI Categories</h2>
            <ul className="space-y-2">
              <li><strong>Underweight:</strong> BMI below 18.5 - May indicate malnutrition or other health issues</li>
              <li><strong>Normal weight:</strong> BMI 18.5-24.9 - Associated with lowest health risks</li>
              <li><strong>Overweight:</strong> BMI 25-29.9 - May increase risk of certain health conditions</li>
              <li><strong>Obese:</strong> BMI 30 or higher - Significantly increased health risks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Why Use This Advanced Calculator?</h2>
            <p>
              This calculator goes beyond simple BMI calculation by providing comprehensive health metrics including
              BMR, TDEE, ideal weight ranges, and personalized recommendations. It helps you understand your current
              health status and provides actionable insights for improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Download Your Health Report</h2>
            <p>
              Export your complete health assessment in multiple formats including PDF, Excel, CSV, JSON, and more.
              Keep track of your progress over time and share results with healthcare providers if needed.
            </p>
          </section>
        </div>
      }
    />
  )
}
