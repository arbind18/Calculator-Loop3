"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ComprehensiveHealthTemplate, HealthResult } from "@/components/calculators/templates/ComprehensiveHealthTemplate"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"
import { toolsData } from "@/lib/toolsData"
import { Activity } from 'lucide-react'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

type FieldType = "number" | "select"

type Field = {
  name: string
  label: string
  type: FieldType
  unit?: string
  min?: number
  max?: number
  step?: number
  defaultValue: number | string
  options?: { value: string; label: string }[]
}

type HealthCalculatorConfig = {
  id: string
  title: string
  description: string
  fields: Field[]
  calculate: (inputs: Record<string, number | string>) => HealthResult
}

function nval(inputs: Record<string, number | string>, key: string, fallback = 0) {
  const raw = inputs[key]
  const parsed = typeof raw === "number" ? raw : Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sval(inputs: Record<string, number | string>, key: string, fallback = "") {
  const raw = inputs[key]
  return typeof raw === "string" ? raw : String(raw ?? fallback)
}

function format1(n: number) {
  return Number.isFinite(n) ? n.toFixed(1) : "0.0"
}

function bmiFrom(weightKg: number, heightCm: number) {
  const h = heightCm / 100
  if (h <= 0) return 0
  return weightKg / (h * h)
}

function mostellerBsa(weightKg: number, heightCm: number) {
  return Math.sqrt((heightCm * weightKg) / 3600)
}

function getHealthCalculatorConfig(toolId: string, toolTitle: string, toolDescription: string): HealthCalculatorConfig {
  // Pattern helpers
  const measurementTracker = (unit: string, label = "Measurement"):
    HealthCalculatorConfig => ({
      id: toolId,
      title: toolTitle,
      description: toolDescription,
      fields: [
        { name: "value", label, type: "number", unit, min: 0, max: 999, step: 0.1, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const value = clamp(nval(inputs, "value"), 0, 999)
        return {
          primaryMetric: {
            label,
            value: format1(value),
            unit,
            status: "normal",
            description: "Save this value and track changes over time.",
          },
          metrics: [
            { label: "Value", value: format1(value), unit, status: "normal" },
          ],
          recommendations: [
            {
              title: "Track trends, not single points",
              description: "Measurements vary day-to-day. Recheck under similar conditions (time, hydration, posture).",
              priority: "low",
              category: "Tracking",
            },
          ],
          riskFactors: [],
          detailedBreakdown: { toolId },
        }
      },
    })

  switch (toolId) {
    case "body-surface-area": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
          { name: "weightKg", label: "Weight", type: "number", unit: "kg", min: 10, max: 300, step: 0.1, defaultValue: 70 },
        ],
        calculate: (inputs) => {
          const heightCm = clamp(nval(inputs, "heightCm"), 50, 250)
          const weightKg = clamp(nval(inputs, "weightKg"), 10, 300)
          const bsa = mostellerBsa(weightKg, heightCm)

          return {
            primaryMetric: {
              label: "Body Surface Area (Mosteller)",
              value: format1(bsa),
              unit: "m²",
              status: "normal",
              description: "Often used in medical dosing calculations. This is an estimate.",
            },
            metrics: [
              { label: "Height", value: format1(heightCm), unit: "cm" },
              { label: "Weight", value: format1(weightKg), unit: "kg" },
            ],
            recommendations: [
              {
                title: "Use clinician guidance for dosing",
                description: "If you’re using BSA for medication dosing, follow a clinician/pharmacist’s instructions.",
                priority: "high",
                category: "Safety",
              },
            ],
            detailedBreakdown: { toolId, formula: "Mosteller" },
          }
        },
      }
    }

    case "waist-to-height-ratio": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "waistCm", label: "Waist", type: "number", unit: "cm", min: 30, max: 200, step: 0.1, defaultValue: 80 },
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
        ],
        calculate: (inputs) => {
          const waistCm = clamp(nval(inputs, "waistCm"), 30, 200)
          const heightCm = clamp(nval(inputs, "heightCm"), 50, 250)
          const ratio = waistCm / heightCm
          const status = ratio < 0.5 ? "good" : ratio < 0.6 ? "warning" : "danger"

          return {
            primaryMetric: {
              label: "Waist-to-Height Ratio",
              value: ratio.toFixed(3),
              status,
              description: ratio < 0.5 ? "Generally considered a lower risk range." : "Higher ratios may indicate increased central adiposity risk.",
            },
            metrics: [
              { label: "Waist", value: format1(waistCm), unit: "cm" },
              { label: "Height", value: format1(heightCm), unit: "cm" },
            ],
            recommendations: [
              {
                title: "Re-measure consistently",
                description: "Measure waist at the same spot and time (e.g., morning, after exhale) for trend accuracy.",
                priority: "low",
                category: "Tracking",
              },
            ],
            healthScore: clamp(Math.round((1 - ratio) * 100), 0, 100),
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "waist-circumference": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          {
            name: "sex",
            label: "Sex",
            type: "select",
            defaultValue: "male",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ],
          },
          { name: "waistCm", label: "Waist", type: "number", unit: "cm", min: 30, max: 200, step: 0.1, defaultValue: 80 },
        ],
        calculate: (inputs) => {
          const sex = sval(inputs, "sex", "male")
          const waistCm = clamp(nval(inputs, "waistCm"), 30, 200)

          const highRiskThreshold = sex === "female" ? 88 : 102
          const moderateThreshold = sex === "female" ? 80 : 94

          const status = waistCm < moderateThreshold ? "good" : waistCm < highRiskThreshold ? "warning" : "danger"

          return {
            primaryMetric: {
              label: "Waist Circumference",
              value: format1(waistCm),
              unit: "cm",
              status,
              description: "A screening metric for central adiposity. Thresholds vary by guideline and population.",
            },
            metrics: [
              { label: "Sex", value: sex === "female" ? "Female" : "Male" },
              { label: "Moderate threshold", value: moderateThreshold, unit: "cm" },
              { label: "High threshold", value: highRiskThreshold, unit: "cm" },
            ],
            recommendations: [
              {
                title: "Use it with other metrics",
                description: "Combine with weight, activity, diet, and blood markers for a fuller picture.",
                priority: "medium",
                category: "Context",
              },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "body-adiposity-index": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "hipCm", label: "Hip", type: "number", unit: "cm", min: 50, max: 200, step: 0.1, defaultValue: 95 },
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
        ],
        calculate: (inputs) => {
          const hipCm = clamp(nval(inputs, "hipCm"), 50, 200)
          const heightM = clamp(nval(inputs, "heightCm"), 50, 250) / 100
          const bai = hipCm / Math.pow(heightM, 1.5) - 18

          return {
            primaryMetric: {
              label: "Body Adiposity Index (BAI)",
              value: format1(bai),
              unit: "%",
              status: "normal",
              description: "An estimate of body fat % using hip circumference and height.",
            },
            metrics: [
              { label: "Hip", value: format1(hipCm), unit: "cm" },
              { label: "Height", value: format1(heightM * 100), unit: "cm" },
            ],
            recommendations: [
              {
                title: "Treat as an estimate",
                description: "BAI is a rough estimate and may not match lab-grade measurements.",
                priority: "low",
                category: "Accuracy",
              },
            ],
            detailedBreakdown: { toolId, formula: "BAI = hip(cm)/height(m)^1.5 − 18" },
          }
        },
      }
    }

    case "ponderal-index": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
          { name: "weightKg", label: "Weight", type: "number", unit: "kg", min: 10, max: 300, step: 0.1, defaultValue: 70 },
        ],
        calculate: (inputs) => {
          const heightM = clamp(nval(inputs, "heightCm"), 50, 250) / 100
          const weightKg = clamp(nval(inputs, "weightKg"), 10, 300)
          const pi = heightM > 0 ? weightKg / Math.pow(heightM, 3) : 0
          return {
            primaryMetric: {
              label: "Ponderal Index",
              value: format1(pi),
              unit: "kg/m³",
              status: "normal",
              description: "A body mass index variant emphasizing height cubed.",
            },
            metrics: [
              { label: "BMI", value: format1(bmiFrom(weightKg, heightM * 100)) },
              { label: "Height", value: format1(heightM * 100), unit: "cm" },
              { label: "Weight", value: format1(weightKg), unit: "kg" },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "bmi-prime-calculator": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
          { name: "weightKg", label: "Weight", type: "number", unit: "kg", min: 10, max: 300, step: 0.1, defaultValue: 70 },
        ],
        calculate: (inputs) => {
          const heightCm = clamp(nval(inputs, "heightCm"), 50, 250)
          const weightKg = clamp(nval(inputs, "weightKg"), 10, 300)
          const bmi = bmiFrom(weightKg, heightCm)
          const prime = bmi / 25
          const status = prime < 1 ? "good" : prime < 1.2 ? "warning" : "danger"

          return {
            primaryMetric: {
              label: "BMI Prime",
              value: prime.toFixed(3),
              status,
              description: "BMI Prime is BMI normalized to 25.",
            },
            metrics: [
              { label: "BMI", value: format1(bmi) },
              { label: "Reference", value: "25.0" },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "a-body-shape-index-absi": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "waistCm", label: "Waist", type: "number", unit: "cm", min: 30, max: 200, step: 0.1, defaultValue: 80 },
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
          { name: "weightKg", label: "Weight", type: "number", unit: "kg", min: 10, max: 300, step: 0.1, defaultValue: 70 },
        ],
        calculate: (inputs) => {
          const waistM = clamp(nval(inputs, "waistCm"), 30, 200) / 100
          const heightM = clamp(nval(inputs, "heightCm"), 50, 250) / 100
          const weightKg = clamp(nval(inputs, "weightKg"), 10, 300)
          const bmi = bmiFrom(weightKg, heightM * 100)
          const denom = Math.pow(bmi, 2 / 3) * Math.pow(heightM, 1 / 2)
          const absi = denom > 0 ? waistM / denom : 0

          return {
            primaryMetric: {
              label: "ABSI",
              value: absi.toFixed(5),
              status: "normal",
              description: "ABSI contextualizes waist size relative to height and weight.",
            },
            metrics: [
              { label: "BMI", value: format1(bmi) },
              { label: "Waist", value: format1(waistM * 100), unit: "cm" },
              { label: "Height", value: format1(heightM * 100), unit: "cm" },
            ],
            recommendations: [
              {
                title: "Use ABSI as a comparator",
                description: "ABSI is typically interpreted using population percentiles. Use it to track trends over time.",
                priority: "low",
                category: "Context",
              },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "body-roundness-index": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "waistCm", label: "Waist", type: "number", unit: "cm", min: 30, max: 200, step: 0.1, defaultValue: 80 },
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
        ],
        calculate: (inputs) => {
          const waistM = clamp(nval(inputs, "waistCm"), 30, 200) / 100
          const heightM = clamp(nval(inputs, "heightCm"), 50, 250) / 100

          const r = waistM / (2 * Math.PI)
          const halfHeight = heightM / 2
          const inside = 1 - (r * r) / (halfHeight * halfHeight)
          const bri = 364.2 - 365.5 * Math.sqrt(Math.max(0, inside))

          return {
            primaryMetric: {
              label: "Body Roundness Index (BRI)",
              value: format1(bri),
              status: "normal",
              description: "An index derived from waist and height. Treat as an estimate.",
            },
            metrics: [
              { label: "Waist", value: format1(waistM * 100), unit: "cm" },
              { label: "Height", value: format1(heightM * 100), unit: "cm" },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "conicity-index": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "waistCm", label: "Waist", type: "number", unit: "cm", min: 30, max: 200, step: 0.1, defaultValue: 80 },
          { name: "heightCm", label: "Height", type: "number", unit: "cm", min: 50, max: 250, step: 0.1, defaultValue: 170 },
          { name: "weightKg", label: "Weight", type: "number", unit: "kg", min: 10, max: 300, step: 0.1, defaultValue: 70 },
        ],
        calculate: (inputs) => {
          const waistM = clamp(nval(inputs, "waistCm"), 30, 200) / 100
          const heightM = clamp(nval(inputs, "heightCm"), 50, 250) / 100
          const weightKg = clamp(nval(inputs, "weightKg"), 10, 300)
          const denom = 0.109 * Math.sqrt(weightKg / heightM)
          const ci = denom > 0 ? waistM / denom : 0

          return {
            primaryMetric: {
              label: "Conicity Index",
              value: ci.toFixed(3),
              status: "normal",
              description: "A central adiposity indicator derived from waist, height, and weight.",
            },
            metrics: [
              { label: "Waist", value: format1(waistM * 100), unit: "cm" },
              { label: "Height", value: format1(heightM * 100), unit: "cm" },
              { label: "Weight", value: format1(weightKg), unit: "kg" },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "meal-planner": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "dailyCalories", label: "Daily Calories", type: "number", unit: "kcal", min: 800, max: 6000, step: 10, defaultValue: 2000 },
          { name: "meals", label: "Meals per day", type: "number", min: 1, max: 10, step: 1, defaultValue: 3 },
        ],
        calculate: (inputs) => {
          const dailyCalories = clamp(nval(inputs, "dailyCalories"), 800, 6000)
          const meals = clamp(Math.round(nval(inputs, "meals")), 1, 10)
          const perMeal = dailyCalories / meals

          return {
            primaryMetric: {
              label: "Calories per meal",
              value: Math.round(perMeal),
              unit: "kcal",
              status: "normal",
              description: "A simple even split across meals.",
            },
            metrics: [
              { label: "Daily calories", value: Math.round(dailyCalories), unit: "kcal" },
              { label: "Meals", value: meals },
            ],
            recommendations: [
              {
                title: "Adjust for your routine",
                description: "You can allocate more calories to workouts or higher-hunger periods (e.g., lunch).",
                priority: "low",
                category: "Planning",
              },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }

    case "glycemic-load-calculator": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "gi", label: "Glycemic Index (GI)", type: "number", min: 0, max: 100, step: 1, defaultValue: 55 },
          { name: "carbsG", label: "Available carbs", type: "number", unit: "g", min: 0, max: 300, step: 1, defaultValue: 30 },
        ],
        calculate: (inputs) => {
          const gi = clamp(nval(inputs, "gi"), 0, 100)
          const carbsG = clamp(nval(inputs, "carbsG"), 0, 300)
          const gl = (gi * carbsG) / 100
          const status = gl < 10 ? "good" : gl < 20 ? "warning" : "danger"

          return {
            primaryMetric: {
              label: "Glycemic Load (GL)",
              value: format1(gl),
              status,
              description: gl < 10 ? "Low" : gl < 20 ? "Medium" : "High",
            },
            metrics: [
              { label: "GI", value: Math.round(gi) },
              { label: "Carbs", value: format1(carbsG), unit: "g" },
            ],
            detailedBreakdown: { toolId, formula: "GL = GI × carbs(g) / 100" },
          }
        },
      }
    }

    case "glycemic-index-calculator": {
      return {
        id: toolId,
        title: toolTitle,
        description: toolDescription,
        fields: [
          { name: "gi", label: "Glycemic Index (GI)", type: "number", min: 0, max: 100, step: 1, defaultValue: 55 },
        ],
        calculate: (inputs) => {
          const gi = clamp(nval(inputs, "gi"), 0, 100)
          const status = gi < 55 ? "good" : gi < 70 ? "warning" : "danger"

          return {
            primaryMetric: {
              label: "Glycemic Index",
              value: Math.round(gi),
              status,
              description: gi < 55 ? "Low" : gi < 70 ? "Medium" : "High",
            },
            recommendations: [
              {
                title: "Consider GL too",
                description: "GI doesn’t account for portion size. Use Glycemic Load (GL) for portion-aware impact.",
                priority: "low",
                category: "Nutrition",
              },
            ],
            detailedBreakdown: { toolId },
          }
        },
      }
    }
  }

  // Heuristic fallbacks to keep every generic health tool useful.
  if (toolId.includes("circumference")) return measurementTracker("cm", "Circumference")
  if (toolId.includes("skinfold")) return measurementTracker("mm", "Skinfold Thickness")
  if (toolId.includes("length") || toolId.includes("width") || toolId.includes("diameter")) return measurementTracker("cm", "Measurement")
  if (toolId.includes("ratio")) {
    return {
      id: toolId,
      title: toolTitle,
      description: toolDescription,
      fields: [
        { name: "a", label: "Value A", type: "number", min: 0, max: 999, step: 0.1, defaultValue: 1 },
        { name: "b", label: "Value B", type: "number", min: 0.0001, max: 999, step: 0.1, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const a = nval(inputs, "a", 0)
        const b = Math.max(0.0001, nval(inputs, "b", 1))
        const ratio = a / b
        return {
          primaryMetric: { label: "Ratio", value: ratio.toFixed(4), status: "normal", description: "A ÷ B" },
          metrics: [
            { label: "A", value: format1(a) },
            { label: "B", value: format1(b) },
          ],
          detailedBreakdown: { toolId },
        }
      },
    }
  }

  // Generic numeric tool (non-empty, non-score-only)
  return {
    id: toolId,
    title: toolTitle,
    description: toolDescription,
    fields: [
      { name: "value", label: "Value", type: "number", min: 0, max: 1000000, step: 0.1, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const value = nval(inputs, "value", 0)
      return {
        primaryMetric: {
          label: "Value",
          value: format1(value),
          status: "normal",
          description: "A simple calculation output for this tool.",
        },
        metrics: [{ label: "Input", value: format1(value) }],
        recommendations: [
          {
            title: "Add more context",
            description: "If this tool needs more inputs, tell us which ones and we’ll upgrade it.",
            priority: "low",
            category: "Improve",
          },
        ],
        detailedBreakdown: { toolId },
      }
    },
  }
}

function findToolById(toolId: string | undefined) {
  if (!toolId) return null
  const health = toolsData.health
  if (!health) return null

  for (const sub of Object.values(health.subcategories)) {
    const tool = sub.calculators.find(c => c.id === toolId)
    if (tool) return tool
  }

  return null
}

export function GenericHealthTool() {
  const params = useParams<{ id: string }>()
  const toolId = params?.id

  const tool = useMemo(() => findToolById(toolId), [toolId])

  const config = useMemo(() => {
    const title = tool?.title ?? "Health Calculator"
    const description = tool?.description ?? "Calculate and generate a health report."
    return getHealthCalculatorConfig(toolId ?? "health-tool", title, description)
  }, [toolId, tool?.title, tool?.description])

  const [inputsState, setInputsState] = useState<Record<string, number | string>>(() => {
    const initial: Record<string, number | string> = {}
    for (const field of config.fields) initial[field.name] = field.defaultValue
    return initial
  })
  const [result, setResult] = useState<HealthResult | null>(null)

  // Reset inputs when tool changes (keeps per-tool defaults sensible)
  useEffect(() => {
    const next: Record<string, number | string> = {}
    for (const field of config.fields) next[field.name] = field.defaultValue
    setInputsState(next)
    setResult(null)
  }, [config.id])

  const calculate = () => {
    setResult(config.calculate(inputsState))
  }

  const inputs = (
    <div className="space-y-4">
      {config.fields.map((field) => {
        const id = `health-${config.id}-${field.name}`
        const value = inputsState[field.name]

        if (field.type === "select") {
          return (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={id}>{field.label}</Label>
              <select
                id={id}
                value={String(value ?? "")}
                onChange={(e) => setInputsState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full p-3 rounded-xl bg-secondary/20 border border-transparent hover:border-primary/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
              >
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        return (
          <div key={field.name} className="space-y-1">
            <Label htmlFor={id}>{field.label}{field.unit ? ` (${field.unit})` : ""}</Label>
            <div className="relative">
              <Input
                id={id}
                type="number"
                value={typeof value === "number" ? value : Number(value ?? field.defaultValue)}
                onChange={(e) => setInputsState((prev) => ({ ...prev, [field.name]: Number(e.target.value) }))}
                min={field.min}
                max={field.max}
                step={field.step}
                className="pr-12"
              />
              <VoiceNumberButton
                label={field.label}
                onValueAction={(v) => setInputsState((prev) => ({ ...prev, [field.name]: v }))}
                min={field.min}
                max={field.max}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <ComprehensiveHealthTemplate
      title={config.title}
      description={config.description}
      inputs={inputs}
      result={result}
      calculate={calculate}
      calculateLabel="Calculate"
      values={config.fields.map((f) => inputsState[f.name])}
      categoryName="Health"
      toolId={toolId ?? "health-tool"}
      seoContent={<SeoContentGenerator title={config.title} description={config.description} categoryName="Health" />}
      icon={Activity}
    />
  )
}
