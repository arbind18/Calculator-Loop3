"use client"

import { useState } from "react"
import { Activity, Scale, Utensils, Heart, Droplets, Moon, Dumbbell, Ruler, User, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { ChartToggle } from "@/components/calculators/ui/ChartToggle"
import {
  BMRSeoContent,
  BodyFatSeoContent,
  CalorieSeoContent,
  IdealWeightSeoContent,
  MacroSeoContent,
  TDEESeoContent,
  WaterIntakeSeoContent,
  LeanBodyMassSeoContent,
  WaistHipRatioSeoContent,
  ProteinSeoContent,
  CaloriesBurnedSeoContent,
  TargetHeartRateSeoContent,
  SleepSeoContent
} from "@/components/calculators/seo/HealthSeo"

// BMR Calculator
export function BMRCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<any>(null)

  const calculateBMR = () => {
    let bmr = 0
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const activityLevels = {
      sedentary: bmr * 1.2,
      light: bmr * 1.375,
      moderate: bmr * 1.55,
      active: bmr * 1.725,
      veryActive: bmr * 1.9
    }

    setResult({ bmr: Math.round(bmr), activityLevels })
  }

  return (
    <FinancialCalculatorTemplate
      title="BMR Calculator"
      description="Calculate your Basal Metabolic Rate (BMR) and daily calorie needs."
      icon={Activity}
      calculate={calculateBMR}
      values={[weight, height, age, gender]}
      seoContent={<BMRSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <InputGroup
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={30}
            max={200}
            suffix="kg"
          />
          <InputGroup
            label="Height"
            value={height}
            onChange={setHeight}
            min={120}
            max={220}
            suffix="cm"
          />
          <InputGroup
            label="Age"
            value={age}
            onChange={setAge}
            min={15}
            max={100}
            suffix="years"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard
            label="Basal Metabolic Rate"
            value={result.bmr}
            subtext="calories/day"
            type="highlight"
          />

          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Daily Calorie Needs</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl border border-border/50">
                <span className="text-sm">Sedentary</span>
                <span className="font-bold text-primary">{Math.round(result.activityLevels.sedentary)} cal</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl border border-border/50">
                <span className="text-sm">Light Exercise</span>
                <span className="font-bold text-primary">{Math.round(result.activityLevels.light)} cal</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl border border-border/50">
                <span className="text-sm">Moderate Exercise</span>
                <span className="font-bold text-primary">{Math.round(result.activityLevels.moderate)} cal</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl border border-border/50">
                <span className="text-sm">Active</span>
                <span className="font-bold text-primary">{Math.round(result.activityLevels.active)} cal</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-xl border border-border/50">
                <span className="text-sm">Very Active</span>
                <span className="font-bold text-primary">{Math.round(result.activityLevels.veryActive)} cal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}

// Body Fat Calculator
export function BodyFatCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [neck, setNeck] = useState(37)
  const [waist, setWaist] = useState(85)
  const [hip, setHip] = useState(95)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<number | null>(null)

  const calculateBodyFat = () => {
    let bodyFat = 0
    
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450
    }

    setResult(Math.round(bodyFat * 10) / 10)
  }

  return (
    <FinancialCalculatorTemplate
      title="Body Fat Calculator"
      description="Estimate your body fat percentage based on body measurements."
      icon={Scale}
      calculate={calculateBodyFat}
      values={[weight, height, age, neck, waist, hip, gender]}
      seoContent={<BodyFatSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Weight"
              value={weight}
              onChange={setWeight}
              min={30}
              max={200}
              suffix="kg"
            />
            <InputGroup
              label="Height"
              value={height}
              onChange={setHeight}
              min={120}
              max={220}
              suffix="cm"
            />
            <InputGroup
              label="Age"
              value={age}
              onChange={setAge}
              min={15}
              max={100}
              suffix="years"
            />
            <InputGroup
              label="Neck"
              value={neck}
              onChange={setNeck}
              min={20}
              max={60}
              suffix="cm"
            />
            <InputGroup
              label="Waist"
              value={waist}
              onChange={setWaist}
              min={50}
              max={150}
              suffix="cm"
            />
            {gender === 'female' && (
              <InputGroup
                label="Hip"
                value={hip}
                onChange={setHip}
                min={50}
                max={150}
                suffix="cm"
              />
            )}
          </div>
        </div>
      }
      result={result !== null && (
        <div className="space-y-6">
          <ResultCard
            label="Body Fat Percentage"
            value={result}
            subtext="%"
            type="highlight"
          />
          <div className="bg-secondary/30 p-4 rounded-xl text-center border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Category</p>
            <p className="text-xl font-bold text-primary">
              {result < 14 ? 'Athletic' : result < 18 ? 'Fit' : result < 25 ? 'Average' : 'Above Average'}
            </p>
          </div>
        </div>
      )}
    />
  )
}

// Calorie Calculator
export function CalorieCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain')
  const [result, setResult] = useState<any>(null)

  const calculateCalories = () => {
    let bmr = 0
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }

    const tdee = bmr * activityMultipliers[activity]
    
    let targetCalories = tdee
    if (goal === 'lose') targetCalories = tdee - 500
    if (goal === 'gain') targetCalories = tdee + 500

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Daily Calorie Calculator"
      description="Calculate your daily calorie needs based on your goal."
      icon={Utensils}
      calculate={calculateCalories}
      values={[weight, height, age, gender, activity, goal]}
      seoContent={<CalorieSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <InputGroup
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={40}
            max={150}
            suffix="kg"
          />
          <InputGroup
            label="Height"
            value={height}
            onChange={setHeight}
            min={140}
            max={210}
            suffix="cm"
          />
          <InputGroup
            label="Age"
            value={age}
            onChange={setAge}
            min={15}
            max={80}
            suffix="years"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="veryActive">Very Active (intense daily)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Goal</label>
            <ChartToggle
              view={goal}
              onChange={setGoal}
              options={[
                { value: 'lose', label: 'Lose Weight', icon: TrendingDown },
                { value: 'maintain', label: 'Maintain', icon: Minus },
                { value: 'gain', label: 'Gain Weight', icon: TrendingUp }
              ]}
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <ResultCard
            label="BMR (Basal Metabolic Rate)"
            value={result.bmr}
            subtext="cal/day"
            type="default"
          />
          <ResultCard
            label="TDEE (Maintenance Calories)"
            value={result.tdee}
            subtext="cal/day"
            type="default"
          />
          <ResultCard
            label={`Target Calories (${goal})`}
            value={result.target}
            subtext="cal/day"
            type="highlight"
          />
        </div>
      )}
    />
  )
}

// Ideal Weight Calculator
export function IdealWeightCalculator() {
  const [height, setHeight] = useState(170)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<any>(null)

  const calculateIdealWeight = () => {
    const heightInInches = height / 2.54
    let hamwi, devine, robinson, miller

    if (gender === 'male') {
      hamwi = 48 + 2.7 * (heightInInches - 60)
      devine = 50 + 2.3 * (heightInInches - 60)
      robinson = 52 + 1.9 * (heightInInches - 60)
      miller = 56.2 + 1.41 * (heightInInches - 60)
    } else {
      hamwi = 45.5 + 2.2 * (heightInInches - 60)
      devine = 45.5 + 2.3 * (heightInInches - 60)
      robinson = 49 + 1.7 * (heightInInches - 60)
      miller = 53.1 + 1.36 * (heightInInches - 60)
    }

    const average = (hamwi + devine + robinson + miller) / 4
    const bmi = (22 * height * height) / 10000

    setResult({
      hamwi: Math.round(hamwi),
      devine: Math.round(devine),
      robinson: Math.round(robinson),
      miller: Math.round(miller),
      average: Math.round(average),
      bmiIdeal: Math.round(bmi)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Ideal Weight Calculator"
      description="Calculate your ideal weight range using various formulas."
      icon={Scale}
      calculate={calculateIdealWeight}
      values={[height, gender]}
      seoContent={<IdealWeightSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <InputGroup
            label="Height"
            value={height}
            onChange={setHeight}
            min={140}
            max={210}
            suffix="cm"
          />
        </div>
      }
      result={result && (
        <div className="space-y-6">
          <ResultCard
            label="Recommended Weight Range"
            value={result.average}
            subtext="kg"
            type="highlight"
          />
          
          <div className="space-y-3">
            <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Different Formulas</p>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
                <span className="text-sm">Hamwi Formula</span>
                <span className="font-bold">{result.hamwi} kg</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
                <span className="text-sm">Devine Formula</span>
                <span className="font-bold">{result.devine} kg</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
                <span className="text-sm">Robinson Formula</span>
                <span className="font-bold">{result.robinson} kg</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
                <span className="text-sm">Miller Formula</span>
                <span className="font-bold">{result.miller} kg</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
                <span className="text-sm">BMI-based (BMI 22)</span>
                <span className="font-bold">{result.bmiIdeal} kg</span>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}

// Macro Calculator
export function MacroCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain')
  const [result, setResult] = useState<any>(null)

  const calculateMacros = () => {
    let bmr = gender === 'male' 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
    }

    let calories = bmr * activityMultipliers[activity]
    if (goal === 'lose') calories -= 500
    if (goal === 'gain') calories += 500

    const protein = weight * 2.2
    const fat = (calories * 0.25) / 9
    const carbs = (calories - (protein * 4) - (fat * 9)) / 4

    setResult({
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Macro Calculator"
      description="Calculate your daily macronutrient needs (protein, carbs, fat)."
      icon={Utensils}
      calculate={calculateMacros}
      values={[weight, height, age, gender, activity, goal]}
      seoContent={<MacroSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup
              label="Weight"
              value={weight}
              onChange={setWeight}
              min={40}
              max={150}
              suffix="kg"
            />
            <InputGroup
              label="Height"
              value={height}
              onChange={setHeight}
              min={140}
              max={210}
              suffix="cm"
            />
            <InputGroup
              label="Age"
              value={age}
              onChange={setAge}
              min={15}
              max={100}
              suffix="years"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="active">Very Active</option>
              <option value="veryActive">Extremely Active</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Goal</label>
            <ChartToggle
              view={goal}
              onChange={setGoal}
              options={[
                { value: 'lose', label: 'Lose', icon: TrendingDown },
                { value: 'maintain', label: 'Maintain', icon: Minus },
                { value: 'gain', label: 'Gain', icon: TrendingUp }
              ]}
            />
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResultCard
            label="Calories"
            value={result.calories}
            type="highlight"
          />
          <ResultCard
            label="Protein"
            value={result.protein}
            subtext="g"
            type="success"
          />
          <ResultCard
            label="Carbs"
            value={result.carbs}
            subtext="g"
            type="success"
          />
          <ResultCard
            label="Fat"
            value={result.fat}
            subtext="g"
            type="success"
          />
        </div>
      )}
    />
  )
}

// TDEE Calculator
export function TDEECalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [activity, setActivity] = useState('moderate')
  const [result, setResult] = useState<any>(null)

  const calculate = () => {
    const bmr = gender === 'male' 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

    const multipliers: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9
    }

    const tdee = bmr * multipliers[activity]
    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      loseWeight: Math.round(tdee - 500),
      gainWeight: Math.round(tdee + 500)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="TDEE Calculator"
      description="Calculate your Total Daily Energy Expenditure (TDEE)."
      icon={Activity}
      calculate={calculate}
      values={[weight, height, age, gender, activity]}
      seoContent={<TDEESeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <InputGroup
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={40}
            max={150}
            suffix="kg"
          />
          <InputGroup
            label="Height"
            value={height}
            onChange={setHeight}
            min={140}
            max={210}
            suffix="cm"
          />
          <InputGroup
            label="Age"
            value={age}
            onChange={setAge}
            min={15}
            max={80}
            suffix="years"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="veryActive">Very Active</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <ResultCard
            label="BMR"
            value={result.bmr}
            subtext="cal"
            type="default"
          />
          <ResultCard
            label="TDEE"
            value={result.tdee}
            subtext="cal"
            type="highlight"
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Weight Loss"
              value={result.loseWeight}
              subtext="cal"
              type="success"
            />
            <ResultCard
              label="Weight Gain"
              value={result.gainWeight}
              subtext="cal"
              type="success"
            />
          </div>
        </div>
      )}
    />
  )
}

// Water Intake Calculator
export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70)
  const [activity, setActivity] = useState('moderate')
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    let water = weight * 35
    if (activity === 'light') water += 500
    if (activity === 'moderate') water += 1000
    if (activity === 'high') water += 1500
    setResult(Math.round(water))
  }

  return (
    <FinancialCalculatorTemplate
      title="Water Intake Calculator"
      description="Calculate your recommended daily water intake."
      icon={Droplets}
      calculate={calculate}
      values={[weight, activity]}
      seoContent={<WaterIntakeSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={30}
            max={150}
            suffix="kg"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light Exercise</option>
              <option value="moderate">Moderate Exercise</option>
              <option value="high">High Exercise</option>
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <ResultCard
            label="Daily Water Intake"
            value={result}
            subtext="ml"
            type="highlight"
          />
          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="In Liters"
              value={(result / 1000).toFixed(1)}
              subtext="liters"
              type="success"
            />
            <ResultCard
              label="In Glasses (approx)"
              value={Math.round(result / 250)}
              subtext="glasses"
              type="success"
            />
          </div>
        </div>
      )}
    />
  )
}

// Lean Body Mass Calculator (Boer formula)
export function LeanBodyMassCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<string>('')

  const calculate = () => {
    const lbm = gender === 'male'
      ? 0.407 * weight + 0.267 * height - 19.2
      : 0.252 * weight + 0.473 * height - 48.3
    setResult(lbm.toFixed(1))
  }

  return (
    <FinancialCalculatorTemplate
      title="Lean Body Mass Calculator"
      description="Calculate your Lean Body Mass (LBM) using the Boer formula."
      icon={Dumbbell}
      calculate={calculate}
      values={[weight, height, gender]}
      seoContent={<LeanBodyMassSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <ChartToggle
              view={gender}
              onChange={setGender}
              options={[
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User }
              ]}
            />
          </div>

          <InputGroup
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={40}
            max={150}
            suffix="kg"
          />
          <InputGroup
            label="Height"
            value={height}
            onChange={setHeight}
            min={140}
            max={210}
            suffix="cm"
          />
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <ResultCard
            label="Lean Body Mass"
            value={result}
            subtext="kg"
            type="highlight"
          />
        </div>
      )}
    />
  )
}

// Waist-Hip Ratio Calculator
export function WaistHipRatioCalculator() {
  const [waist, setWaist] = useState(80)
  const [hip, setHip] = useState(95)
  const [result, setResult] = useState<{ ratio: string; risk: string } | null>(null)

  const calcRisk = (ratio: number) => {
    if (ratio < 0.8) return 'Low risk'
    if (ratio < 0.9) return 'Moderate risk'
    if (ratio < 1.0) return 'High risk'
    return 'Very high risk'
  }

  const calculate = () => {
    if (!hip) return
    const ratio = waist / hip
    setResult({ ratio: ratio.toFixed(2), risk: calcRisk(ratio) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Waist-to-Hip Ratio"
      description="Calculate your Waist-to-Hip Ratio (WHR) to assess health risk."
      icon={Ruler}
      calculate={calculate}
      values={[waist, hip]}
      seoContent={<WaistHipRatioSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Waist"
            value={waist}
            onChange={setWaist}
            min={50}
            max={150}
            suffix="cm"
          />
          <InputGroup
            label="Hip"
            value={hip}
            onChange={setHip}
            min={50}
            max={150}
            suffix="cm"
          />
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <ResultCard
            label="Waist-Hip Ratio"
            value={result.ratio}
            type="highlight"
          />
          <ResultCard
            label="Health Risk"
            value={result.risk}
            type={result.risk === 'Low risk' ? 'success' : 'warning'}
          />
        </div>
      )}
    />
  )
}

// Protein Calculator
export function ProteinCalculator() {
  const [weight, setWeight] = useState(70)
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain')
  const [grams, setGrams] = useState<number | null>(null)

  const multipliers: Record<string, number> = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    high: 1.6,
  }

  const calculate = () => {
    let perKg = multipliers[activity]
    if (goal === 'lose') perKg += 0.2
    if (goal === 'gain') perKg += 0.1
    setGrams(Math.round(weight * perKg))
  }

  return (
    <FinancialCalculatorTemplate
      title="Protein Intake Calculator"
      description="Calculate your daily protein needs based on activity and goals."
      icon={Dumbbell}
      calculate={calculate}
      values={[weight, activity, goal]}
      seoContent={<ProteinSeoContent />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={40}
            max={150}
            suffix="kg"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="high">Heavy Training</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              <option value="maintain">Maintain</option>
              <option value="lose">Lose Fat</option>
              <option value="gain">Gain Muscle</option>
            </select>
          </div>
        </div>
      }
      result={grams && (
        <div className="space-y-4">
          <ResultCard
            label="Daily Protein Target"
            value={grams}
            subtext="g"
            type="highlight"
          />
          <p className="text-center text-sm text-muted-foreground">
            Based on weight, activity, and goal
          </p>
        </div>
      )}
    />
  )
}

// Calories Burned Calculator (MET-based)
export function CaloriesBurnedCalculator() {
  const [weight, setWeight] = useState(70)
  const [duration, setDuration] = useState(30)
  const [met, setMet] = useState(6)
  const [result, setResult] = useState<number | null>(null)

  const activities: Record<string, number> = {
    Walking: 3.5,
    Jogging: 7,
    Cycling: 6,
    Swimming: 8,
    HIIT: 10,
  }

  const calculate = () => {
    const hours = duration / 60
    const calories = met * weight * hours
    setResult(Math.round(calories))
  }

  return (
    <FinancialCalculatorTemplate
      title="Calories Burned Calculator"
      description="Estimate calories burned during various activities."
      icon={Activity}
      calculate={calculate}
      values={[weight, duration, met]}
      seoContent={<CaloriesBurnedSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Weight"
              value={weight}
              onChange={setWeight}
              min={40}
              max={150}
              suffix="kg"
            />
            <InputGroup
              label="Duration"
              value={duration}
              onChange={setDuration}
              min={10}
              max={180}
              suffix="minutes"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Activity</label>
            <select
              value={met}
              onChange={(e) => setMet(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
            >
              {Object.entries(activities).map(([name, value]) => (
                <option key={name} value={value}>{name} (MET {value})</option>
              ))}
            </select>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-4">
          <ResultCard
            label="Estimated Calories Burned"
            value={result}
            subtext="kcal"
            type="highlight"
          />
        </div>
      )}
    />
  )
}

// Target Heart Rate Zones
export function TargetHeartRateCalculator() {
  const [age, setAge] = useState(30)
  const [resting, setResting] = useState(70)
  const [result, setResult] = useState<{ max: number; fatBurn: number; cardio: number; peak: number } | null>(null)

  const calculate = () => {
    const max = 220 - age
    const reserve = max - resting
    setResult({
      max,
      fatBurn: Math.round(resting + reserve * 0.6),
      cardio: Math.round(resting + reserve * 0.75),
      peak: Math.round(resting + reserve * 0.85),
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Target Heart Rate"
      description="Calculate your target heart rate zones for effective training."
      icon={Heart}
      calculate={calculate}
      values={[age, resting]}
      seoContent={<TargetHeartRateSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Age"
              value={age}
              onChange={setAge}
              min={15}
              max={80}
              suffix="years"
            />
            <InputGroup
              label="Resting HR"
              value={resting}
              onChange={setResting}
              min={40}
              max={100}
              suffix="bpm"
            />
          </div>
        </div>
      }
      result={result && (
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            label="Max HR"
            value={result.max}
            subtext="bpm"
            type="highlight"
          />
          <ResultCard
            label="Fat Burn"
            value={result.fatBurn}
            subtext="bpm"
            type="success"
          />
          <ResultCard
            label="Cardio"
            value={result.cardio}
            subtext="bpm"
            type="success"
          />
          <ResultCard
            label="Peak"
            value={result.peak}
            subtext="bpm"
            type="warning"
          />
        </div>
      )}
    />
  )
}

// Sleep Calculator (bedtime suggestion)
export function SleepCalculator() {
  const [wakeTime, setWakeTime] = useState('07:00')
  const [cycles, setCycles] = useState(5)

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  const suggestions = () => {
    const [h, m] = wakeTime.split(':').map(Number)
    const wake = new Date()
    wake.setHours(h, m, 0, 0)
    return Array.from({ length: cycles }, (_, i) => {
      const bedtime = new Date(wake.getTime() - (i + 3) * 90 * 60000) // 90-min cycles starting at 4.5h back
      return formatTime(bedtime)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Sleep Calculator"
      description="Calculate optimal bedtime based on sleep cycles."
      icon={Moon}
      calculate={() => {}} // No explicit calculate button needed as it updates live, but template requires it.
      values={[wakeTime, cycles]}
      seoContent={<SleepSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wake-up Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-input hover:border-primary/50 transition-colors"
              />
            </div>
            <InputGroup
              label="Sleep Cycles (90 min)"
              value={cycles}
              onChange={setCycles}
              min={4}
              max={6}
              step={1}
            />
          </div>
          <p className="text-xs text-muted-foreground">Recommended 4-6 cycles (6–9 hours)</p>
        </div>
      }
      result={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions().map((time, idx) => (
            <ResultCard
              key={idx}
              label="Bedtime option"
              value={time}
              type="highlight"
            />
          ))}
        </div>
      }
    />
  )
}
