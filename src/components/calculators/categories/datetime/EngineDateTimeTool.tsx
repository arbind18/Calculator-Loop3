"use client"

import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { DateTimeCalculatorTemplate } from "@/components/calculators/templates/categories/DateTimeCalculatorTemplate"
import { VoiceTimeInput } from "@/components/ui/VoiceTimeInput"
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"
import { getDateTimeToolDefinitionOrNull } from "@/lib/datetime/definitions"
import type { DateTimeInputValue, DateTimeToolResult } from "@/lib/datetime/types"
import { listIanaTimeZones } from "@/lib/datetime/utils"

function toNumberOrString(value: string): number | string {
  const trimmed = (value ?? "").trim()
  if (trimmed === "") return ""
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : trimmed
}

export function EngineDateTimeTool(props: { id: string; title: string; description: string }) {
  const def = useMemo(() => getDateTimeToolDefinitionOrNull(props.id), [props.id])

  const [valuesByName, setValuesByName] = useState<Record<string, string>>({})
  const [result, setResult] = useState<DateTimeToolResult | null>(null)
  const [now, setNow] = useState(() => new Date())

  const tzOptions = useMemo(() => {
    try {
      return listIanaTimeZones()
    } catch {
      return [] as Array<{ value: string; label: string }>
    }
  }, [])

  const valuesArray = useMemo(() => {
    if (!def) return []
    return def.inputs.map((f) => {
      const raw = valuesByName[f.name]
      if (f.type === "number" || f.type === "latitude" || f.type === "longitude") {
        const asN = Number(raw)
        return Number.isFinite(asN) ? asN : 0
      }
      return raw ?? ""
    })
  }, [def, valuesByName])

  const restoreValuesFromArray = (arr: any[]) => {
    if (!def) return
    const next: Record<string, string> = {}
    def.inputs.forEach((f, idx) => {
      const v = arr?.[idx]
      if (v === null || v === undefined) {
        next[f.name] = ""
      } else {
        next[f.name] = String(v)
      }
    })
    setValuesByName(next)
  }

  const calculate = () => {
    if (!def) return

    try {
      const payload: Record<string, DateTimeInputValue> = {}
      for (const field of def.inputs) {
        const raw = valuesByName[field.name] ?? ""
        if (field.type === "number" || field.type === "latitude" || field.type === "longitude") {
          const v = toNumberOrString(raw)
          payload[field.name] = typeof v === "number" ? v : null
        } else {
          payload[field.name] = raw
        }
      }

      const ctx = { now, toolId: props.id }
      const computed = def.calculate(payload, ctx)
      const defFaqs = (def as any).faqs as Array<{ question: string; answer: string }> | undefined
      setResult({ ...computed, faqs: computed.faqs ?? defFaqs })
    } catch (err: any) {
      const message = err?.message || String(err)
      toast.error(message)
      setResult(null)
    }
  }

  // Live-refresh loop for tools that declare it.
  useEffect(() => {
    const refreshEveryMs = result?.live?.isLive ? (result?.live?.refreshEveryMs ?? 1000) : null
    if (!refreshEveryMs) return

    const t = window.setInterval(() => {
      setNow(new Date())
    }, refreshEveryMs)

    return () => {
      window.clearInterval(t)
    }
  }, [result?.live?.isLive, result?.live?.refreshEveryMs])

  // Recalculate when time ticks (for live tools).
  useEffect(() => {
    if (!result?.live?.isLive) return
    calculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  if (!def) {
    return null
  }

  const inputsNode = (
    <div className="space-y-4">
      {def.inputs.map((field) => {
        const value = valuesByName[field.name] ?? ""

        const setValue = (next: string) => {
          setValuesByName((prev) => ({ ...prev, [field.name]: next }))
        }

        if (field.type === "time") {
          return (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <VoiceTimeInput value={value} onChange={setValue} showSeconds={field.showSeconds} />
            </div>
          )
        }

        if (field.type === "select") {
          return (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select…</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        if (field.type === "timezone") {
          const listId = `tz-${props.id}-${field.name}`
          return (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={field.placeholder ?? "e.g., Asia/Kolkata"}
                list={listId}
              />
              {tzOptions.length > 0 && (
                <datalist id={listId}>
                  {tzOptions.map((tz) => (
                    <option key={tz.value} value={tz.value} />
                  ))}
                </datalist>
              )}
            </div>
          )
        }

        if (field.type === "date") {
          return (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={field.placeholder}
              />
            </div>
          )
        }

        const inputType =
          field.type === "number" || field.type === "latitude" || field.type === "longitude" ? "number" : "text"

        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={field.placeholder}
              min={field.min as any}
              max={field.max as any}
              step={field.step as any}
            />
          </div>
        )
      })}
    </div>
  )

  const resultNode = (
    <div className="space-y-4">
      {result?.results?.length ? (
        <Card className="p-4">
          <div className="space-y-2">
            {result.results.map((r, idx) => (
              <div key={`${r.label}-${idx}`} className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">{r.label}</div>
                <div className="text-sm font-semibold">
                  {r.value}
                  {r.unit ? ` ${r.unit}` : ""}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {result?.breakdown?.length ? (
        <Card className="p-4">
          <div className="text-sm font-semibold mb-2">Breakdown</div>
          <div className="space-y-2">
            {result.breakdown.map((r, idx) => (
              <div key={`${r.label}-${idx}`} className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">{r.label}</div>
                <div className="text-sm">
                  {r.value}
                  {r.unit ? ` ${r.unit}` : ""}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  )

  return (
    <DateTimeCalculatorTemplate
      title={def.title || props.title}
      description={def.description || props.description}
      calculatorId={props.id}
      inputs={inputsNode}
      result={result ? resultNode : null}
      calculate={calculate}
      defaultAutoCalculate={def.defaultAutoCalculate ?? false}
      values={valuesArray}
      onRestoreAction={restoreValuesFromArray}
      onClear={() => {
        setValuesByName({})
        setResult(null)
      }}
      seoContent={<SeoContentGenerator title={def.title || props.title} description={def.description || props.description} categoryName="DateTime" />}
      faqs={(result?.faqs ?? ((def as any).faqs as any))}
    />
  )
}
