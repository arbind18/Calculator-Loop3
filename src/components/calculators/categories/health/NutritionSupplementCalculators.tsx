"use client"

import { useMemo, useState } from "react"
import {
  Activity,
  Baby,
  Beaker,
  Bolt,
  Coffee,
  Droplets,
  FlaskConical,
  Leaf,
  Scale,
  TrendingUp
} from "lucide-react"
import {
  FinancialCalculatorTemplate,
  InputGroup,
  ResultCard
} from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function safeDiv(n: number, d: number) {
  return d === 0 ? 0 : n / d
}

function SupplementServingCalculator(props: {
  title: string
  description: string
  icon: any
  defaultTargetGrams: number
  defaultProteinPerServing?: number
  defaultServingSizeGrams?: number
  targetLabel: string
  servingLabel: string
  unit: "g" | "mg"
  disclaimer?: string
}) {
  const {
    title,
    description,
    icon: Icon,
    defaultTargetGrams,
    defaultProteinPerServing = 25,
    defaultServingSizeGrams = 30,
    targetLabel,
    servingLabel,
    unit,
    disclaimer
  } = props

  const [target, setTarget] = useState(defaultTargetGrams)
  const [perServing, setPerServing] = useState(defaultProteinPerServing)
  const [servingSize, setServingSize] = useState(defaultServingSizeGrams)
  const [result, setResult] = useState<{ servings: number; perServing: number } | null>(null)

  const calculate = () => {
    const servings = perServing > 0 ? target / perServing : 0
    setResult({ servings: round2(servings), perServing: round2(perServing) })
  }

  return (
    <FinancialCalculatorTemplate
      title={title}
      description={description}
      icon={Icon}
      calculate={calculate}
      values={[target, perServing, servingSize]}
      category="Health"
      calculatorId={title.toLowerCase().replace(/\s+/g, "-")}
      seoContent={<SeoContentGenerator title={title} description={description} categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <InputGroup
            label={targetLabel}
            value={target}
            onChange={setTarget}
            min={0}
            max={unit === "g" ? 250 : 5000}
            step={unit === "g" ? 1 : 25}
            suffix={` ${unit}`}
          />
          <InputGroup
            label={servingLabel}
            value={perServing}
            onChange={setPerServing}
            min={0}
            max={unit === "g" ? 100 : 2000}
            step={unit === "g" ? 1 : 25}
            suffix={` ${unit}`}
          />
          <InputGroup
            label="Serving size"
            value={servingSize}
            onChange={setServingSize}
            min={0}
            max={200}
            step={1}
            suffix=" g"
            helpText="Optional label detail (does not change the math)."
          />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard
              label="Servings needed"
              value={result.servings}
              subtext="per day"
              type="highlight"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Target" value={round2(target)} suffix={` ${unit}`} />
              <ResultCard label="Per serving" value={result.perServing} suffix={` ${unit}`} />
            </div>
            {disclaimer && (
              <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground">{disclaimer}</p>
              </div>
            )}
          </div>
        )
      }
    />
  )
}

export function CaffeineHalfLifeCalculator() {
  const [initialMg, setInitialMg] = useState(200)
  const [hoursElapsed, setHoursElapsed] = useState(4)
  const [halfLifeHours, setHalfLifeHours] = useState(5)
  const [thresholdMg, setThresholdMg] = useState(25)
  const [result, setResult] = useState<{
    remainingMg: number
    remainingPct: number
    hoursToThreshold: number
  } | null>(null)

  const calculate = () => {
    const hl = halfLifeHours > 0 ? halfLifeHours : 5
    const remaining = initialMg * Math.pow(0.5, hoursElapsed / hl)
    const pct = initialMg > 0 ? (remaining / initialMg) * 100 : 0

    const hoursToThreshold =
      initialMg > 0 && thresholdMg > 0 && initialMg > thresholdMg
        ? hl * (Math.log(initialMg / thresholdMg) / Math.log(2))
        : 0

    setResult({ remainingMg: round2(remaining), remainingPct: round2(pct), hoursToThreshold: round2(hoursToThreshold) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Caffeine Half-Life Calculator"
      description="Estimate how much caffeine remains after a given time using an adjustable half-life."
      icon={Coffee}
      calculate={calculate}
      values={[initialMg, hoursElapsed, halfLifeHours, thresholdMg]}
      category="Health"
      calculatorId="caffeine-half-life"
      seoContent={
        <SeoContentGenerator
          title="Caffeine Half-Life Calculator"
          description="Estimate how much caffeine remains after a given time using an adjustable half-life."
          categoryName="Health"
        />
      }
      inputs={
        <div className="space-y-6">
          <InputGroup label="Initial caffeine" value={initialMg} onChange={setInitialMg} min={0} max={800} step={5} suffix=" mg" />
          <InputGroup label="Hours elapsed" value={hoursElapsed} onChange={setHoursElapsed} min={0} max={24} step={0.5} suffix=" h" />
          <InputGroup label="Half-life" value={halfLifeHours} onChange={setHalfLifeHours} min={1} max={12} step={0.5} suffix=" h" helpText="Half-life varies widely by person (sleep, genetics, medications, pregnancy, etc.)." />
          <InputGroup label="Threshold" value={thresholdMg} onChange={setThresholdMg} min={0} max={200} step={5} suffix=" mg" helpText="Optional: estimate time to drop below this amount." />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard label="Caffeine remaining" value={result.remainingMg} suffix=" mg" type="highlight" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Remaining" value={result.remainingPct} suffix=" %" />
              <ResultCard label="Time to threshold" value={result.hoursToThreshold} suffix=" h" />
            </div>
          </div>
        )
      }
    />
  )
}

export function CreatineIntakeCalculator() {
  const [weightKg, setWeightKg] = useState(70)
  const [doseGPerKg, setDoseGPerKg] = useState(0.05)
  const [gramsPerScoop, setGramsPerScoop] = useState(5)
  const [result, setResult] = useState<{ gramsPerDay: number; scoopsPerDay: number } | null>(null)

  const calculate = () => {
    const gramsPerDay = weightKg * doseGPerKg
    const scoopsPerDay = gramsPerScoop > 0 ? gramsPerDay / gramsPerScoop : 0
    setResult({ gramsPerDay: round2(gramsPerDay), scoopsPerDay: round2(scoopsPerDay) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Creatine Intake Calculator"
      description="Convert a weight-based creatine target into grams/day and scoops/day."
      icon={FlaskConical}
      calculate={calculate}
      values={[weightKg, doseGPerKg, gramsPerScoop]}
      category="Health"
      calculatorId="creatine-intake"
      seoContent={<SeoContentGenerator title="Creatine Intake Calculator" description="Convert a weight-based creatine target into grams/day and scoops/day." categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Body weight" value={weightKg} onChange={setWeightKg} min={30} max={200} step={0.5} suffix=" kg" />
          <InputGroup
            label="Dose target"
            value={doseGPerKg}
            onChange={setDoseGPerKg}
            min={0}
            max={0.2}
            step={0.005}
            suffix=" g/kg/day"
            helpText="Informational math tool. If you’re unsure about a target dose (or have kidney disease / take medications), consult a clinician."
          />
          <InputGroup label="Creatine per scoop" value={gramsPerScoop} onChange={setGramsPerScoop} min={0} max={20} step={0.5} suffix=" g" />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard label="Target creatine" value={result.gramsPerDay} suffix=" g/day" type="highlight" />
            <ResultCard label="Estimated scoops" value={result.scoopsPerDay} subtext="per day" />
          </div>
        )
      }
    />
  )
}

export function BetaAlanineDosageCalculator() {
  const [weightKg, setWeightKg] = useState(70)
  const [doseMgPerKg, setDoseMgPerKg] = useState(45)
  const [servingsPerDay, setServingsPerDay] = useState(4)
  const [result, setResult] = useState<{ gramsPerDay: number; gramsPerServing: number } | null>(null)

  const calculate = () => {
    const gramsPerDay = (weightKg * doseMgPerKg) / 1000
    const gramsPerServing = servingsPerDay > 0 ? gramsPerDay / servingsPerDay : gramsPerDay
    setResult({ gramsPerDay: round2(gramsPerDay), gramsPerServing: round2(gramsPerServing) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Beta-Alanine Dosage Calculator"
      description="Calculate a beta-alanine daily amount from mg/kg/day and optionally split it into servings."
      icon={Beaker}
      calculate={calculate}
      values={[weightKg, doseMgPerKg, servingsPerDay]}
      category="Health"
      calculatorId="beta-alanine-dosage"
      seoContent={<SeoContentGenerator title="Beta-Alanine Dosage Calculator" description="Calculate a beta-alanine daily amount from mg/kg/day and optionally split it into servings." categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Body weight" value={weightKg} onChange={setWeightKg} min={30} max={200} step={0.5} suffix=" kg" />
          <InputGroup label="Dose target" value={doseMgPerKg} onChange={setDoseMgPerKg} min={0} max={120} step={1} suffix=" mg/kg/day" />
          <InputGroup label="Servings per day" value={servingsPerDay} onChange={setServingsPerDay} min={1} max={8} step={1} />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard label="Total per day" value={result.gramsPerDay} suffix=" g/day" type="highlight" />
            <ResultCard label="Per serving" value={result.gramsPerServing} suffix=" g" subtext={`${servingsPerDay} servings/day`} />
          </div>
        )
      }
    />
  )
}

export function CitrullineMalateCalculator() {
  return (
    <SupplementServingCalculator
      title="Citrulline Malate Calculator"
      description="Convert a citrulline malate target amount into servings based on your product label."
      icon={Bolt}
      defaultTargetGrams={6}
      defaultProteinPerServing={3}
      defaultServingSizeGrams={10}
      targetLabel="Target amount"
      servingLabel="Citrulline malate per serving"
      unit="g"
      disclaimer="This calculator performs label math only and does not provide medical advice."
    />
  )
}

export function BCAADosageCalculator() {
  return (
    <SupplementServingCalculator
      title="BCAA Dosage Calculator"
      description="Calculate servings needed to hit a BCAA target based on grams per serving."
      icon={Activity}
      defaultTargetGrams={10}
      defaultProteinPerServing={5}
      defaultServingSizeGrams={10}
      targetLabel="Target BCAA"
      servingLabel="BCAA per serving"
      unit="g"
      disclaimer="Informational tool for supplement label math only."
    />
  )
}

export function EAADosageCalculator() {
  return (
    <SupplementServingCalculator
      title="EAA Dosage Calculator"
      description="Calculate servings needed to hit an EAA target based on grams per serving."
      icon={TrendingUp}
      defaultTargetGrams={12}
      defaultProteinPerServing={6}
      defaultServingSizeGrams={10}
      targetLabel="Target EAA"
      servingLabel="EAA per serving"
      unit="g"
      disclaimer="Informational tool for supplement label math only."
    />
  )
}

export function GlutamineDosageCalculator() {
  return (
    <SupplementServingCalculator
      title="Glutamine Dosage Calculator"
      description="Calculate servings needed to hit a glutamine target based on grams per serving."
      icon={Beaker}
      defaultTargetGrams={10}
      defaultProteinPerServing={5}
      defaultServingSizeGrams={10}
      targetLabel="Target glutamine"
      servingLabel="Glutamine per serving"
      unit="g"
      disclaimer="Informational tool for supplement label math only."
    />
  )
}

export function CollagenDosageCalculator() {
  return (
    <SupplementServingCalculator
      title="Collagen Dosage Calculator"
      description="Calculate servings needed to hit a collagen target based on grams per serving."
      icon={Droplets}
      defaultTargetGrams={15}
      defaultProteinPerServing={10}
      defaultServingSizeGrams={12}
      targetLabel="Target collagen"
      servingLabel="Collagen per serving"
      unit="g"
      disclaimer="Informational tool for supplement label math only."
    />
  )
}

export function WheyProteinCalculator() {
  return (
    <SupplementServingCalculator
      title="Whey Protein Calculator"
      description="Calculate how many whey servings you need to reach your daily protein target."
      icon={Scale}
      defaultTargetGrams={120}
      defaultProteinPerServing={24}
      defaultServingSizeGrams={30}
      targetLabel="Protein target"
      servingLabel="Protein per serving"
      unit="g"
      disclaimer="Protein targets vary by goals and health conditions. If unsure, consult a dietitian/clinician."
    />
  )
}

export function CaseinProteinCalculator() {
  return (
    <SupplementServingCalculator
      title="Casein Protein Calculator"
      description="Calculate how many casein servings you need to reach your daily protein target."
      icon={Scale}
      defaultTargetGrams={120}
      defaultProteinPerServing={24}
      defaultServingSizeGrams={33}
      targetLabel="Protein target"
      servingLabel="Protein per serving"
      unit="g"
      disclaimer="Protein targets vary by goals and health conditions."
    />
  )
}

export function PlantProteinCalculator() {
  return (
    <SupplementServingCalculator
      title="Plant Protein Calculator"
      description="Calculate how many plant-protein servings you need to reach your daily protein target."
      icon={Leaf}
      defaultTargetGrams={120}
      defaultProteinPerServing={20}
      defaultServingSizeGrams={35}
      targetLabel="Protein target"
      servingLabel="Protein per serving"
      unit="g"
      disclaimer="If you have allergies or medical conditions, consult a professional."
    />
  )
}

export function PostBariatricProteinCalculator() {
  return (
    <SupplementServingCalculator
      title="Post-Bariatric Protein Calculator"
      description="Estimate servings needed to hit a protein goal after bariatric surgery using your product label."
      icon={Scale}
      defaultTargetGrams={80}
      defaultProteinPerServing={25}
      defaultServingSizeGrams={30}
      targetLabel="Protein goal"
      servingLabel="Protein per serving"
      unit="g"
      disclaimer="Post-surgery nutrition should be personalized. This tool only helps with serving math; follow your surgeon/dietitian’s plan."
    />
  )
}

export function ToddlerCalorieCalculator() {
  const [weightKg, setWeightKg] = useState(12)
  const [kcalPerKg, setKcalPerKg] = useState(90)
  const [rangePct, setRangePct] = useState(10)
  const [result, setResult] = useState<{ estimate: number; low: number; high: number } | null>(null)

  const calculate = () => {
    const estimate = weightKg * kcalPerKg
    const low = estimate * (1 - rangePct / 100)
    const high = estimate * (1 + rangePct / 100)
    setResult({ estimate: Math.round(estimate), low: Math.round(low), high: Math.round(high) })
  }

  return (
    <FinancialCalculatorTemplate
      title="Toddler Calorie Calculator"
      description="Estimate daily calories using a simple kcal/kg method (informational only)."
      icon={Baby}
      calculate={calculate}
      values={[weightKg, kcalPerKg, rangePct]}
      category="Health"
      calculatorId="toddler-calorie"
      seoContent={<SeoContentGenerator title="Toddler Calorie Calculator" description="Estimate daily calories using a simple kcal/kg method (informational only)." categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Child weight" value={weightKg} onChange={setWeightKg} min={6} max={25} step={0.1} suffix=" kg" />
          <InputGroup label="Calories per kg" value={kcalPerKg} onChange={setKcalPerKg} min={50} max={140} step={1} suffix=" kcal/kg" helpText="Different toddlers have different needs. Use this as a rough estimate only." />
          <InputGroup label="Range" value={rangePct} onChange={setRangePct} min={0} max={30} step={1} suffix=" %" helpText="Adds a +/- range around the estimate." />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard label="Estimated calories" value={result.estimate} suffix=" kcal/day" type="highlight" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Low" value={result.low} suffix=" kcal/day" />
              <ResultCard label="High" value={result.high} suffix=" kcal/day" />
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground">
                This is not medical advice. For growth concerns, feeding difficulties, or medical conditions, consult a pediatrician or pediatric dietitian.
              </p>
            </div>
          </div>
        )
      }
    />
  )
}

export function ElectrolyteBalanceCalculator() {
  const [sodiumMg, setSodiumMg] = useState(2300)
  const [potassiumMg, setPotassiumMg] = useState(3500)
  const [magnesiumMg, setMagnesiumMg] = useState(350)
  const [calciumMg, setCalciumMg] = useState(1000)

  const [result, setResult] = useState<{
    naKRatioMg: number
    naKRatioMmol: number
    sodiumMmol: number
    potassiumMmol: number
    totalElectrolytesMg: number
  } | null>(null)

  const calculate = () => {
    const sodiumMmol = sodiumMg / 23
    const potassiumMmol = potassiumMg / 39.1

    setResult({
      naKRatioMg: round2(safeDiv(sodiumMg, potassiumMg)),
      naKRatioMmol: round2(safeDiv(sodiumMmol, potassiumMmol)),
      sodiumMmol: round2(sodiumMmol),
      potassiumMmol: round2(potassiumMmol),
      totalElectrolytesMg: Math.round(sodiumMg + potassiumMg + magnesiumMg + calciumMg)
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Electrolyte Balance Calculator"
      description="Calculate simple electrolyte totals and sodium-to-potassium ratios from your daily intake."
      icon={Bolt}
      calculate={calculate}
      values={[sodiumMg, potassiumMg, magnesiumMg, calciumMg]}
      category="Health"
      calculatorId="electrolyte-balance"
      seoContent={<SeoContentGenerator title="Electrolyte Balance Calculator" description="Calculate simple electrolyte totals and sodium-to-potassium ratios from your daily intake." categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Sodium" value={sodiumMg} onChange={setSodiumMg} min={0} max={8000} step={10} suffix=" mg" />
          <InputGroup label="Potassium" value={potassiumMg} onChange={setPotassiumMg} min={0} max={8000} step={10} suffix=" mg" />
          <InputGroup label="Magnesium" value={magnesiumMg} onChange={setMagnesiumMg} min={0} max={1000} step={5} suffix=" mg" />
          <InputGroup label="Calcium" value={calciumMg} onChange={setCalciumMg} min={0} max={3000} step={10} suffix=" mg" />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard label="Na:K ratio (mg)" value={result.naKRatioMg} type="highlight" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Na:K ratio (mmol)" value={result.naKRatioMmol} />
              <ResultCard label="Total electrolytes" value={result.totalElectrolytesMg} suffix=" mg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard label="Sodium" value={result.sodiumMmol} suffix=" mmol" />
              <ResultCard label="Potassium" value={result.potassiumMmol} suffix=" mmol" />
            </div>
          </div>
        )
      }
    />
  )
}

export function LeucineThresholdCalculator() {
  const [proteinPerMeal, setProteinPerMeal] = useState(30)
  const [leucinePercent, setLeucinePercent] = useState(8)
  const [thresholdG, setThresholdG] = useState(2.5)
  const [result, setResult] = useState<{
    leucineG: number
    meets: boolean
    proteinNeededG: number
  } | null>(null)

  const computed = useMemo(() => {
    const leucineG = (proteinPerMeal * leucinePercent) / 100
    const proteinNeededG = leucinePercent > 0 ? thresholdG / (leucinePercent / 100) : 0
    return {
      leucineG: round2(leucineG),
      proteinNeededG: round2(proteinNeededG)
    }
  }, [proteinPerMeal, leucinePercent, thresholdG])

  const calculate = () => {
    setResult({
      leucineG: computed.leucineG,
      meets: computed.leucineG >= thresholdG,
      proteinNeededG: computed.proteinNeededG
    })
  }

  return (
    <FinancialCalculatorTemplate
      title="Leucine Threshold Calculator"
      description="Estimate leucine per meal from protein grams and a leucine percentage, then compare to a chosen threshold."
      icon={Activity}
      calculate={calculate}
      values={[proteinPerMeal, leucinePercent, thresholdG]}
      category="Health"
      calculatorId="leucine-threshold"
      seoContent={<SeoContentGenerator title="Leucine Threshold Calculator" description="Estimate leucine per meal from protein grams and a leucine percentage, then compare to a chosen threshold." categoryName="Health" />}
      inputs={
        <div className="space-y-6">
          <InputGroup label="Protein per meal" value={proteinPerMeal} onChange={setProteinPerMeal} min={0} max={120} step={1} suffix=" g" />
          <InputGroup label="Leucine percent" value={leucinePercent} onChange={setLeucinePercent} min={0} max={20} step={0.1} suffix=" %" helpText="Example: 8% means 8 g leucine per 100 g protein." />
          <InputGroup label="Target leucine (threshold)" value={thresholdG} onChange={setThresholdG} min={0} max={6} step={0.1} suffix=" g" />
        </div>
      }
      result={
        result && (
          <div className="space-y-6">
            <ResultCard label="Estimated leucine" value={result.leucineG} suffix=" g" type={result.meets ? "success" : "warning"} />
            <ResultCard label="Protein to hit threshold" value={result.proteinNeededG} suffix=" g/meal" />
          </div>
        )
      }
    />
  )
}
