"use client"

import { useState, useEffect } from "react"
import { Ruler, Scale, Activity, TrendingUp, TrendingDown, User, AlertCircle } from "lucide-react"
import { ComprehensiveHealthTemplate, HealthResult } from "@/components/calculators/templates/ComprehensiveHealthTemplate"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"
import { Card, CardContent } from "@/components/ui/card"

// Unit conversion utilities
const cmToInches = (cm: number) => cm / 2.54
const inchesToCm = (inches: number) => inches * 2.54
const kgToLbs = (kg: number) => kg * 2.20462
const lbsToKg = (lbs: number) => lbs / 2.20462

type UnitSystem = 'metric' | 'imperial'

// Body Surface Area Calculator (Mosteller Formula)
export function BodySurfaceAreaCalculator() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [result, setResult] = useState<HealthResult | null>(null)

  // Convert to metric for calculations
  const weightKg = unitSystem === 'imperial' ? lbsToKg(weight) : weight
  const heightCm = unitSystem === 'imperial' ? inchesToCm(height) : height

  const calculateBSA = () => {
    // Calculate using multiple formulas
    const bsaMosteller = Math.sqrt((heightCm * weightKg) / 3600)
    const bsaDuBois = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725)
    const bsaHaycock = 0.024265 * Math.pow(weightKg, 0.5378) * Math.pow(heightCm, 0.3964)
    const bsaGehanGeorge = 0.0235 * Math.pow(heightCm, 0.42246) * Math.pow(weightKg, 0.51456)
    const bsaBoyd = 0.0003207 * Math.pow(heightCm, 0.3) * Math.pow(weightKg * 1000, 0.7285 - (0.0188 * Math.log10(weightKg * 1000)))

    // Average BSA from all formulas
    const averageBSA = (bsaMosteller + bsaDuBois + bsaHaycock + bsaGehanGeorge) / 4

    // BMI for additional context
    const bmi = weightKg / Math.pow(heightCm / 100, 2)

    // Calculate clinical metrics
    const cardiacIndex = (5.0 / bsaMosteller) // Assuming normal cardiac output of 5 L/min
    const drugDosageFactor = bsaMosteller / 1.73 // Normalized to standard 1.73 m²

    // BSA Status
    let status: 'good' | 'normal' | 'warning' | 'danger' = 'normal'
    let bsaCategory = ""
    if (bsaMosteller < 1.4) {
      status = 'warning'
      bsaCategory = "Below Average"
    } else if (bsaMosteller >= 1.4 && bsaMosteller <= 2.2) {
      status = 'good'
      bsaCategory = "Normal Range"
    } else {
      status = 'normal'
      bsaCategory = "Above Average"
    }

    const healthResult: HealthResult = {
      primaryMetric: {
        label: "Body Surface Area (Mosteller)",
        value: bsaMosteller.toFixed(3),
        unit: "m²",
        status: status,
        description: `${bsaCategory} - Used for medical dosing and clinical calculations`,
        icon: Scale
      },
      metrics: [
        { label: "Weight", value: weightKg.toFixed(1), unit: "kg", status: 'normal', icon: Scale },
        { label: "Height", value: heightCm.toFixed(1), unit: "cm", status: 'normal', icon: Ruler },
        { label: "BMI", value: bmi.toFixed(1), unit: "kg/m²", status: bmi >= 18.5 && bmi <= 24.9 ? 'good' : 'warning', icon: Activity },
        { label: "BSA (Mosteller)", value: bsaMosteller.toFixed(3), unit: "m²", status: status, icon: Activity },
        { label: "BSA (DuBois)", value: bsaDuBois.toFixed(3), unit: "m²", status: status, icon: Activity },
        { label: "BSA (Haycock)", value: bsaHaycock.toFixed(3), unit: "m²", status: status, icon: Activity },
        { label: "BSA (Gehan-George)", value: bsaGehanGeorge.toFixed(3), unit: "m²", status: status, icon: Activity },
        { label: "Average BSA", value: averageBSA.toFixed(3), unit: "m²", status: status, icon: TrendingUp },
        { label: "Cardiac Index", value: cardiacIndex.toFixed(2), unit: "L/min/m²", status: cardiacIndex >= 2.5 && cardiacIndex <= 4.0 ? 'good' : 'warning', icon: Activity },
        { label: "Drug Dosage Factor", value: drugDosageFactor.toFixed(3), unit: "×", status: 'normal', icon: Activity },
      ],
      recommendations: [
        {
          title: "Clinical Applications",
          description: `BSA is essential for: Drug dosing (chemotherapy, antibiotics), Cardiac Index calculations (normal: 2.5-4.0 L/min/m²), Burn assessment (Wallace Rule of Nines), Renal function (GFR normalization), and Nutritional requirements.`,
          priority: 'high',
          category: "Medical"
        },
        {
          title: "Formula Comparison",
          description: `Mosteller (${bsaMosteller.toFixed(3)} m²) is most commonly used for its simplicity and accuracy. DuBois (${bsaDuBois.toFixed(3)} m²) is the original formula from 1916. Haycock (${bsaHaycock.toFixed(3)} m²) is preferred for pediatrics. Average of all formulas: ${averageBSA.toFixed(3)} m².`,
          priority: 'medium',
          category: "Formulas"
        },
        {
          title: "Normal BSA Ranges",
          description: "Adult male: 1.9-2.2 m² | Adult female: 1.6-1.9 m² | Children (10 years): ~1.1-1.3 m² | Infants: ~0.25-0.35 m². Your BSA of ${bsaMosteller.toFixed(2)} m² is ${bsaCategory.toLowerCase()}.",
          priority: 'medium',
          category: "Reference"
        },
        {
          title: "Drug Dosage Adjustment",
          description: `Your dosage factor is ${drugDosageFactor.toFixed(2)}× the standard dose (based on 1.73 m² reference). For example, if standard dose is 100mg/m², your dose would be approximately ${(100 * bsaMosteller).toFixed(0)}mg total.`,
          priority: 'high',
          category: "Dosing"
        },
        {
          title: "Cardiac Index Interpretation",
          description: `Estimated Cardiac Index: ${cardiacIndex.toFixed(2)} L/min/m². Normal range: 2.5-4.0 L/min/m². ${cardiacIndex < 2.5 ? 'Below normal - may indicate cardiac dysfunction' : cardiacIndex > 4.0 ? 'Above normal - may indicate high metabolic state' : 'Within normal range - indicates adequate cardiac output'}.`,
          priority: cardiacIndex >= 2.5 && cardiacIndex <= 4.0 ? 'low' : 'medium',
          category: "Cardiac"
        }
      ],
      detailedBreakdown: {
        "Weight": `${weightKg.toFixed(1)} kg (${kgToLbs(weightKg).toFixed(1)} lbs)`,
        "Height": `${heightCm.toFixed(1)} cm (${cmToInches(heightCm).toFixed(1)} inches, ${(heightCm / 100).toFixed(2)} meters)`,
        "BMI": `${bmi.toFixed(1)} kg/m²`,
        "BSA (Mosteller Formula)": `${bsaMosteller.toFixed(3)} m² - √[(height × weight)/3600]`,
        "BSA (DuBois Formula)": `${bsaDuBois.toFixed(3)} m² - 0.007184 × weight^0.425 × height^0.725`,
        "BSA (Haycock Formula)": `${bsaHaycock.toFixed(3)} m² - 0.024265 × weight^0.5378 × height^0.3964`,
        "BSA (Gehan-George Formula)": `${bsaGehanGeorge.toFixed(3)} m² - 0.0235 × height^0.42246 × weight^0.51456`,
        "Average BSA (All Formulas)": `${averageBSA.toFixed(3)} m²`,
        "Formula Variance": `${((Math.max(bsaMosteller, bsaDuBois, bsaHaycock, bsaGehanGeorge) - Math.min(bsaMosteller, bsaDuBois, bsaHaycock, bsaGehanGeorge)) * 100).toFixed(1)}% difference between formulas`,
        "Cardiac Index (Estimated)": `${cardiacIndex.toFixed(2)} L/min/m² (normal: 2.5-4.0)`,
        "Drug Dosage Factor": `${drugDosageFactor.toFixed(3)}× standard dose (normalized to 1.73 m²)`,
        "Clinical Category": bsaCategory
      },
      healthScore: status === 'good' ? 90 : status === 'normal' ? 80 : 65
    }

    setResult(healthResult)
  }

  const handleClear = () => {
    setWeight(unitSystem === 'imperial' ? 154 : 70)
    setHeight(unitSystem === 'imperial' ? 67 : 170)
    setResult(null)
  }

  const toggleUnitSystem = () => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric'
    if (newSystem === 'imperial') {
      setWeight(kgToLbs(weight))
      setHeight(cmToInches(height))
    } else {
      setWeight(lbsToKg(weight))
      setHeight(inchesToCm(height))
    }
    setUnitSystem(newSystem)
  }

  useEffect(() => {
    if (weight > 0 && height > 0) {
      calculateBSA()
    }
  }, [weight, height])

  return (
    <ComprehensiveHealthTemplate
      title="Body Surface Area Calculator"
      description="Calculate your body surface area (BSA) using multiple medical formulas for accurate drug dosing and medical assessments."
      icon={Scale}
      calculate={calculateBSA}
      onClear={handleClear}
      result={result}
      values={[weight, height, unitSystem]}
      categoryName="Health"
      toolId="body-surface-area"
      seoContent={<SeoContentGenerator title="Body Surface Area Calculator" description="Calculate BSA using Mosteller, DuBois, and Haycock formulas" categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          {/* Unit Toggle */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  <Label className="mb-0">{unitSystem === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, inches)'}</Label>
                </div>
                <Switch
                  checked={unitSystem === 'imperial'}
                  onCheckedChange={toggleUnitSystem}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min={unitSystem === 'imperial' ? 44 : 20}
                  max={unitSystem === 'imperial' ? 441 : 200}
                  step={0.1}
                  className="pr-20"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {unitSystem === 'imperial' ? 'lbs' : 'kg'}
                </div>
                <VoiceNumberButton
                  label="Weight"
                  onValueAction={(v) => setWeight(v)}
                  min={unitSystem === 'imperial' ? 44 : 20}
                  max={unitSystem === 'imperial' ? 441 : 200}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={unitSystem === 'imperial' ? 20 : 50}
                  max={unitSystem === 'imperial' ? 98 : 250}
                  step={0.1}
                  className="pr-20"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {unitSystem === 'imperial' ? 'in' : 'cm'}
                </div>
                <VoiceNumberButton
                  label="Height"
                  onValueAction={(v) => setHeight(v)}
                  min={unitSystem === 'imperial' ? 20 : 50}
                  max={unitSystem === 'imperial' ? 98 : 250}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}

// Waist-to-Height Ratio Calculator
export function WaistToHeightRatioCalculator() {
  const [waist, setWaist] = useState(80)
  const [height, setHeight] = useState(170)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [result, setResult] = useState<HealthResult | null>(null)

  const waistCm = unitSystem === 'imperial' ? inchesToCm(waist) : waist
  const heightCm = unitSystem === 'imperial' ? inchesToCm(height) : height

  const calculateWHtR = () => {
    const ratio = waistCm / heightCm
    const percentage = ratio * 100

    // Calculate target waist for healthy ratio (0.5)
    const targetWaist = heightCm * 0.5
    const waistDifference = waistCm - targetWaist

    // Calculate BMI equivalent for context
    const approximateBMI = (ratio - 0.3) * 50 // Rough estimation

    // Body shape analysis
    let bodyShape = ""
    if (ratio < 0.35) bodyShape = "Very Slim"
    else if (ratio < 0.43) bodyShape = "Slim"
    else if (ratio < 0.5) bodyShape = "Healthy Average"
    else if (ratio < 0.53) bodyShape = "Stocky"
    else if (ratio < 0.58) bodyShape = "Overweight"
    else bodyShape = "Obese"

    let status: 'good' | 'normal' | 'warning' | 'danger' = 'normal'
    let category = ""
    let risk = ""
    let diseaseRisk = ""

    if (ratio < 0.4) {
      status = 'warning'
      category = "Extremely Slim"
      risk = "May indicate underweight or malnutrition"
      diseaseRisk = "Low cardiovascular risk but possible nutritional deficiency"
    } else if (ratio < 0.5) {
      status = 'good'
      category = "Healthy Range"
      risk = "Optimal health risk profile"
      diseaseRisk = "Low risk for cardiovascular disease, diabetes, and metabolic syndrome"
    } else if (ratio < 0.6) {
      status = 'warning'
      category = "Increased Risk"
      risk = "Moderate health risk - lifestyle modification recommended"
      diseaseRisk = "Increased risk for Type 2 diabetes (2-3× higher), hypertension, and heart disease"
    } else {
      status = 'danger'
      category = "High Risk"
      risk = "Significant health risk - medical consultation strongly recommended"
      diseaseRisk = "High risk for cardiovascular disease (4-5× higher), Type 2 diabetes, stroke, and metabolic syndrome"
    }

    // Calculate years of life expectancy impact
    let lifeExpectancyImpact = ""
    if (ratio >= 0.6) lifeExpectancyImpact = "May reduce life expectancy by 3-7 years"
    else if (ratio >= 0.5) lifeExpectancyImpact = "May reduce life expectancy by 1-3 years"
    else lifeExpectancyImpact = "No significant impact on life expectancy"

    const healthResult: HealthResult = {
      primaryMetric: {
        label: "Waist-to-Height Ratio",
        value: ratio.toFixed(3),
        unit: `(${percentage.toFixed(1)}%)`,
        status: status,
        description: `${category} - ${bodyShape} body type`,
        icon: Ruler
      },
      metrics: [
        { label: "Waist", value: waistCm.toFixed(1), unit: "cm", status: 'normal', icon: Ruler },
        { label: "Height", value: heightCm.toFixed(1), unit: "cm", status: 'normal', icon: Ruler },
        { label: "WHtR", value: ratio.toFixed(3), status: status, icon: Activity },
        { label: "Percentage", value: percentage.toFixed(1), unit: "%", status: status, icon: TrendingUp },
        { label: "Target Waist", value: targetWaist.toFixed(1), unit: "cm", status: 'normal', icon: Ruler },
        { label: "Waist Difference", value: waistDifference > 0 ? `+${waistDifference.toFixed(1)}` : waistDifference.toFixed(1), unit: "cm", status: waistDifference > 0 ? 'warning' : 'good', icon: waistDifference > 0 ? TrendingUp : TrendingDown },
        { label: "Body Shape", value: bodyShape, status: status, icon: User },
        { label: "Health Category", value: category, status: status, icon: AlertCircle },
      ],
      recommendations: [
        {
          title: "Your Health Assessment",
          description: `${risk}. Your waist (${waistCm.toFixed(0)}cm) is ${waistDifference > 0 ? `${waistDifference.toFixed(0)}cm above` : `${Math.abs(waistDifference).toFixed(0)}cm below`} the healthy target of ${targetWaist.toFixed(0)}cm for your height.`,
          priority: status === 'danger' ? 'high' : status === 'warning' ? 'medium' : 'low',
          category: "Health Status"
        },
        {
          title: "Disease Risk Analysis",
          description: diseaseRisk,
          priority: status === 'danger' || status === 'warning' ? 'high' : 'low',
          category: "Medical"
        },
        {
          title: "Life Expectancy Impact",
          description: lifeExpectancyImpact + ". Maintaining a WHtR below 0.5 is associated with longer life expectancy and better quality of life.",
          priority: ratio >= 0.5 ? 'high' : 'low',
          category: "Longevity"
        },
        {
          title: "Target Guidelines (0.5 Rule)",
          description: `Keep your waist less than half your height. For your height (${heightCm.toFixed(0)}cm), ideal waist should be under ${targetWaist.toFixed(0)}cm. This simple rule applies across all ages and ethnicities.`,
          priority: 'high',
          category: "Goals"
        },
        {
          title: "Health Benefits of Reduction",
          description: ratio > 0.5 ? `Reducing waist by just ${(waistDifference / 2).toFixed(0)}cm (50% of excess) can: Reduce diabetes risk by 30-40%, Lower blood pressure by 5-10 mmHg, Improve cholesterol profile, Increase energy levels.` : "Maintain your healthy waist measurement through balanced diet and regular physical activity (150 minutes/week).",
          priority: 'medium',
          category: "Action Plan"
        },
        {
          title: "Measurement Technique",
          description: "For accurate measurements: Use a flexible tape measure at the narrowest point (typically just above navel). Measure after exhaling, standing upright with relaxed abdomen. Take measurement in the morning before eating for consistency.",
          priority: 'low',
          category: "Technique"
        },
        {
          title: "Comparison with Other Metrics",
          description: `WHtR (${ratio.toFixed(2)}) is considered more accurate than BMI for predicting health risks, especially cardiovascular disease. It accounts for height differences and abdominal fat distribution, which is strongly linked to metabolic diseases.`,
          priority: 'low',
          category: "Information"
        }
      ],
      detailedBreakdown: {
        "Current Waist": `${waistCm.toFixed(1)} cm (${cmToInches(waistCm).toFixed(1)} inches)`,
        "Height": `${heightCm.toFixed(1)} cm (${cmToInches(heightCm).toFixed(1)} inches)`,
        "WHtR Ratio": `${ratio.toFixed(3)} (${percentage.toFixed(1)}% of height)`,
        "Target Waist (Healthy)": `${targetWaist.toFixed(1)} cm (${cmToInches(targetWaist).toFixed(1)} inches)`,
        "Waist Difference": `${waistDifference > 0 ? '+' : ''}${waistDifference.toFixed(1)} cm (${waistDifference > 0 ? 'Above' : 'Below'} target)`,
        "Body Shape Classification": bodyShape,
        "Health Category": category,
        "Risk Level": risk,
        "Disease Risk Profile": diseaseRisk,
        "Life Expectancy Impact": lifeExpectancyImpact,
        "Cardiovascular Risk": ratio < 0.5 ? "Low" : ratio < 0.6 ? "Moderate (2× baseline)" : "High (4-5× baseline)",
        "Type 2 Diabetes Risk": ratio < 0.5 ? "Low" : ratio < 0.6 ? "Elevated (2-3× baseline)" : "High (5-6× baseline)",
        "Metabolic Syndrome Risk": ratio < 0.5 ? "Low (<10%)" : ratio < 0.6 ? "Moderate (30-40%)" : "High (60-70%)",
        "Recommended Action": ratio < 0.5 ? "Maintain current lifestyle" : ratio < 0.6 ? "Lifestyle modification (diet + exercise)" : "Medical consultation + intensive lifestyle changes"
      },
      healthScore: status === 'good' ? 95 : status === 'warning' ? 55 : 35
    }

    setResult(healthResult)
  }

  const handleClear = () => {
    setWaist(unitSystem === 'imperial' ? 31.5 : 80)
    setHeight(unitSystem === 'imperial' ? 67 : 170)
    setResult(null)
  }

  const toggleUnitSystem = () => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric'
    if (newSystem === 'imperial') {
      setWaist(cmToInches(waist))
      setHeight(cmToInches(height))
    } else {
      setWaist(inchesToCm(waist))
      setHeight(inchesToCm(height))
    }
    setUnitSystem(newSystem)
  }

  useEffect(() => {
    if (waist > 0 && height > 0) {
      calculateWHtR()
    }
  }, [waist, height])

  return (
    <ComprehensiveHealthTemplate
      title="Waist-to-Height Ratio Calculator"
      description="Calculate your waist-to-height ratio (WHtR) - a simple and accurate indicator of health risk and body fat distribution."
      icon={Ruler}
      calculate={calculateWHtR}
      onClear={handleClear}
      result={result}
      values={[waist, height, unitSystem]}
      categoryName="Health"
      toolId="waist-to-height-ratio"
      seoContent={<SeoContentGenerator title="Waist-to-Height Ratio Calculator" description="Calculate WHtR for health risk assessment" categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  <Label className="mb-0">{unitSystem === 'metric' ? 'Metric (cm)' : 'Imperial (inches)'}</Label>
                </div>
                <Switch
                  checked={unitSystem === 'imperial'}
                  onCheckedChange={toggleUnitSystem}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="waist">Waist Circumference</Label>
              <div className="relative">
                <Input
                  id="waist"
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  min={unitSystem === 'imperial' ? 12 : 30}
                  max={unitSystem === 'imperial' ? 79 : 200}
                  step={0.1}
                  className="pr-20"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {unitSystem === 'imperial' ? 'in' : 'cm'}
                </div>
                <VoiceNumberButton
                  label="Waist"
                  onValueAction={(v) => setWaist(v)}
                  min={unitSystem === 'imperial' ? 12 : 30}
                  max={unitSystem === 'imperial' ? 79 : 200}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={unitSystem === 'imperial' ? 20 : 50}
                  max={unitSystem === 'imperial' ? 98 : 250}
                  step={0.1}
                  className="pr-20"
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {unitSystem === 'imperial' ? 'in' : 'cm'}
                </div>
                <VoiceNumberButton
                  label="Height"
                  onValueAction={(v) => setHeight(v)}
                  min={unitSystem === 'imperial' ? 20 : 50}
                  max={unitSystem === 'imperial' ? 98 : 250}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Rule of Thumb:</strong> Keep your waist circumference less than half your height for optimal health.
            </p>
          </div>
        </div>
      }
    />
  )
}
