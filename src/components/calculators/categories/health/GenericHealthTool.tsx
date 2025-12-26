"use client"

import { useMemo, useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ComprehensiveHealthTemplate, HealthResult } from "@/components/calculators/templates/ComprehensiveHealthTemplate"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toolsData } from "@/lib/toolsData"
import { Heart, Activity, Zap, TrendingUp, Copy, Check, Lightbulb, RefreshCw, Sparkles, BarChart3 } from 'lucide-react'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
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

  const [value, setValue] = useState<number>(50)
  const [result, setResult] = useState<HealthResult | null>(null)

  const title = tool?.title ?? "Health Calculator"
  const description = tool?.description ?? "Calculate and generate a health report."

  const calculate = () => {
    const score = clamp(Math.round(value), 0, 100)

    const status: "good" | "normal" | "warning" | "danger" =
      score >= 75 ? "good" : score >= 50 ? "normal" : score >= 25 ? "warning" : "danger"

    const recommendations =
      score >= 75
        ? [
            {
              title: "Maintain your routine",
              description: "Your score looks strong. Keep consistent habits and monitor changes over time.",
              priority: "low" as const,
              category: "Lifestyle",
            },
          ]
        : score >= 50
          ? [
              {
                title: "Improve gradually",
                description: "Track this metric weekly and aim for small improvements through sleep, nutrition, and activity.",
                priority: "medium" as const,
                category: "Habits",
              },
            ]
          : [
              {
                title: "Seek guidance",
                description: "If you have symptoms or concerns, consider consulting a qualified healthcare professional.",
                priority: "high" as const,
                category: "Safety",
              },
            ]

    const risks: string[] = []
    if (value < 20) risks.push("Very low input value — double-check your entry.")
    if (value > 80) risks.push("High input value — track trends and context.")

    setResult({
      primaryMetric: {
        label: "Health Score",
        value: score,
        unit: "/100",
        status,
        description: "A generic score derived from your input value.",
      },
      metrics: [
        { label: "Input Value", value, status: "normal", description: "The value you entered." },
        { label: "Calculated Score", value: score, unit: "/100", status },
      ],
      recommendations,
      riskFactors: risks,
      healthScore: score,
      detailedBreakdown: {
        toolId: toolId ?? "unknown",
        toolTitle: title,
      },
    })
  }

  const inputs = (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="generic-health-value">Value (0–100)</Label>
        <Input
          id="generic-health-value"
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => setValue(Number(e.target.value))}
          placeholder="Enter a number"
          min={0}
          max={100}
        />
      </div>
    </div>
  )

  return (
    <ComprehensiveHealthTemplate
      title={title}
      description={description}
      inputs={inputs}
      result={result}
      calculate={calculate}
      calculateLabel="Calculate"
      values={[value]}
      categoryName="Health"
      toolId={toolId ?? "health-tool"}
      seoContent={<SeoContentGenerator title={title} description={description} categoryName="Health" />}
    />
  )
}
