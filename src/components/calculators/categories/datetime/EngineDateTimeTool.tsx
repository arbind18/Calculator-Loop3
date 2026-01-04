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
import { downloadFile, generateReport } from "@/lib/downloadUtils"

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

  // Set sensible defaults for specific tools.
  useEffect(() => {
    if (!def) return
    if (props.id === "time-zone-converter") {
      setValuesByName((prev) => {
        const next = { ...prev }

        if (next.inputMode === undefined || next.inputMode === "") {
          next.inputMode = "current"
        }

        if (next.timeFormat === undefined || next.timeFormat === "") {
          next.timeFormat = "24h"
        }

        // Provide defaults so defaultAutoCalculate doesn't error on first load.
        if (!next.date) {
          const d = new Date()
          const yyyy = d.getFullYear()
          const mm = String(d.getMonth() + 1).padStart(2, "0")
          const dd = String(d.getDate()).padStart(2, "0")
          next.date = `${yyyy}-${mm}-${dd}`
        }

        if (!next.time) {
          const d = new Date()
          const hh = String(d.getHours()).padStart(2, "0")
          const mi = String(d.getMinutes()).padStart(2, "0")
          const ss = String(d.getSeconds()).padStart(2, "0")
          next.time = `${hh}:${mi}:${ss}`
        }

        if (!next.fromZone) {
          try {
            next.fromZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
          } catch {
            next.fromZone = "Asia/Kolkata"
          }
        }

        if (!next.toZone) {
          next.toZone = "America/New_York"
        }

        return next
      })
    }
  }, [def, props.id])

  if (!def) {
    return null
  }

  const handleDownload = async (
    format: string,
    options?: { includeSummary?: boolean; includeChart?: boolean; includeSchedule?: boolean }
  ) => {
    if (!result) {
      toast.error("Calculate something first")
      return
    }

    const timestamp = new Date().toISOString().split("T")[0]
    const baseTitle = String(def.title || props.title || "calculator")
    const safeBase =
      baseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 60) || "calculator"

    const cleanItemLabel = (label: string) => {
      const s = String(label ?? "")
      // Remove UI emojis/icons from exported labels.
      // Otherwise Excel on Windows may mis-decode UTF-8 and show "Ø..." garbage.
      return s
        .replace(/[🌍📅⏱️🔄📍🕐☀️🔢⏰📝💡]/g, "")
        .replace(/\s+/g, " ")
        .trim()
    }

    const headers = ["Section", "Item", "Value", "Unit"]
    const data: (string | number)[][] = []

    const includeSummary = options?.includeSummary ?? true
    const computed = (result.results ?? []).filter((r) => String(r.value ?? "").trim() !== "")
    const breakdown = (result.breakdown ?? []).filter((r) => String(r.value ?? "").trim() !== "")

    // Map UI intent:
    // - "Result"   -> main conversion (first two computed rows)
    // - "Summary"  -> remaining computed rows (day change, time diff, comparisons)
    // - "Breakdown"-> details card
    const main = computed.slice(0, 2)
    const summary = computed.slice(2)

    for (const r of main) {
      data.push(["Result", cleanItemLabel(r.label), String(r.value), r.unit ?? ""])
    }

    if (includeSummary) {
      for (const r of summary) {
        data.push(["Summary", cleanItemLabel(r.label), String(r.value), r.unit ?? ""])
      }
    }

    for (const r of breakdown) {
      data.push(["Breakdown", cleanItemLabel(r.label), String(r.value), r.unit ?? ""])
    }

    const fullBase = `${safeBase}_${timestamp}`

    try {
      switch (format) {
        case "csv": {
          const csvContent = [
            headers.join(","),
            ...data.map((row) =>
              row
                .map((cell) => {
                  const cellStr = String(cell)
                  if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
                    return `"${cellStr.replace(/"/g, '""')}"`
                  }
                  return cellStr
                })
                .join(",")
            ),
          ].join("\n")
          // UTF-8 BOM for Excel compatibility.
          downloadFile(`\uFEFF${csvContent}`, `${fullBase}.csv`, "text/csv")
          toast.success(`Downloaded ${fullBase}.csv`)
          return
        }

        case "excel": {
          await generateReport("excel", fullBase, headers, data, "")
          return
        }

        case "pdf":
        case "pdf-encrypted": {
          await generateReport(format, fullBase, headers, data, "")
          return
        }

        case "json": {
          const jsonPayload = {
            result: main.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })),
            summary: includeSummary ? summary.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })) : [],
            breakdown: breakdown.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })),
          }

          downloadFile(JSON.stringify(jsonPayload, null, 2), `${fullBase}.json`, "application/json")
          toast.success(`Downloaded ${fullBase}.json`)
          return
        }

        case "html":
        case "docx": {
          const sectionTable = (section: string) => {
            const rows = data.filter((r) => r[0] === section)
            if (!rows.length) return ""
            const body = rows
              .map(
                (r) =>
                  `<tr><td>${String(r[1])}</td><td>${String(r[2])}</td><td>${String(r[3] ?? "")}</td></tr>`
              )
              .join("")
            return `
              <h2>${section}</h2>
              <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead><tr><th>Item</th><th>Value</th><th>Unit</th></tr></thead>
                <tbody>${body}</tbody>
              </table>
            `
          }

          const htmlContent = `
            <html>
              <head><meta charset="utf-8" /></head>
              <body>
                ${sectionTable("Summary")}
                ${sectionTable("Result")}
                ${sectionTable("Breakdown")}
              </body>
            </html>
          `

          if (format === "docx") {
            downloadFile(htmlContent, `${fullBase}.doc`, "application/msword")
            toast.success(`Downloaded ${fullBase}.doc`)
          } else {
            downloadFile(htmlContent, `${fullBase}.html`, "text/html")
            toast.success(`Downloaded ${fullBase}.html`)
          }
          return
        }

        case "xml": {
          const xmlSafe = (s: any) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<report>
  <rows>
    ${data
      .map(
        (row) =>
          `<row><section>${xmlSafe(row[0])}</section><item>${xmlSafe(row[1])}</item><value>${xmlSafe(row[2])}</value><unit>${xmlSafe(row[3] ?? "")}</unit></row>`
      )
      .join("\n    ")}
  </rows>
</report>`
          downloadFile(xmlContent, `${fullBase}.xml`, "application/xml")
          toast.success(`Downloaded ${fullBase}.xml`)
          return
        }

        case "sql":
        case "sqlite": {
          const tableName = safeBase || "calculator"
          const escaped = (s: any) => String(s).replace(/'/g, "''")
          const sql = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  section TEXT,
  item TEXT,
  value TEXT,
  unit TEXT
);

INSERT INTO ${tableName} (section, item, value, unit) VALUES
${data.map((r) => `('${escaped(r[0])}','${escaped(r[1])}','${escaped(r[2])}','${escaped(r[3] ?? "")}')`).join(",\n")};
          `.trim()
          downloadFile(sql, `${fullBase}.sql`, "application/sql")
          toast.success(`Downloaded ${fullBase}.sql`)
          return
        }

        case "zip":
        case "zip-encrypted": {
          const JSZip = (await import("jszip")).default
          const zip = new JSZip()

          const csvContent = [
            headers.join(","),
            ...data.map((row) =>
              row
                .map((cell) => {
                  const cellStr = String(cell)
                  if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
                    return `"${cellStr.replace(/"/g, '""')}"`
                  }
                  return cellStr
                })
                .join(",")
            ),
          ].join("\n")

          // UTF-8 BOM for Excel compatibility.
          zip.file(`${fullBase}.csv`, `\uFEFF${csvContent}`)
          zip.file(
            `${fullBase}.json`,
            JSON.stringify(
              {
                result: main.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })),
                summary: includeSummary ? summary.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })) : [],
                breakdown: breakdown.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })),
              },
              null,
              2
            )
          )

          const content = await zip.generateAsync({ type: "blob" })
          downloadFile(content, `${fullBase}.zip`, "application/zip")
          toast.success(`Downloaded ${fullBase}.zip`)
          return
        }

        case "png":
        case "jpg": {
          const element = document.getElementById("calculator-result-content")
          if (!element) throw new Error("Result content not found")

          const html2canvas = (await import("html2canvas")).default
          const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2 })
          const link = document.createElement("a")
          link.download = `${fullBase}.${format}`
          link.href = canvas.toDataURL(`image/${format === "jpg" ? "jpeg" : "png"}`)
          link.click()
          toast.success(`Downloaded ${fullBase}.${format}`)
          return
        }

        case "svg": {
          // Minimal SVG export of the table (text-only).
          const lineHeight = 18
          const pad = 20
          const lines = data.map((r) => `${r[0]}: ${r[1]} = ${r[2]}${r[3] ? " " + r[3] : ""}`)
          const height = pad * 2 + lineHeight * (lines.length + 1)
          const width = 1200
          const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#ffffff" />
  ${lines
    .map(
      (t, i) =>
        `<text x="${pad}" y="${pad + lineHeight * (i + 1)}" font-family="Arial, sans-serif" font-size="14" fill="#111">${String(t)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</text>`
    )
    .join("\n  ")}
</svg>`.trim()
          downloadFile(svg, `${fullBase}.svg`, "image/svg+xml")
          toast.success(`Downloaded ${fullBase}.svg`)
          return
        }

        case "api": {
          const jsonPayload = {
            result: main.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })),
            summary: includeSummary ? summary.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })) : [],
            breakdown: breakdown.map((r) => ({ item: cleanItemLabel(r.label), value: r.value, unit: r.unit })),
          }
          await navigator.clipboard.writeText(JSON.stringify(jsonPayload, null, 2))
          toast.success("Copied export JSON to clipboard")
          return
        }

        default: {
          // Prefer the generic generator for formats we don't custom-handle, but keep it minimal.
          await generateReport(format, fullBase, headers, data, "")
          return
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Download failed")
    }
  }

  const inputsNode = (
    <div className="space-y-4">
      {def.inputs.map((field) => {
        // Tool-specific conditional fields
        if (props.id === "time-zone-converter") {
          const mode = (valuesByName.inputMode || "current").toLowerCase()
          const ymdhms = new Set(["year", "month", "day", "hour", "minute", "second"])
          const datetime = new Set(["date", "time"])
          
          // Hide Y/M/D/H/M/S when mode is date-time or current
          if ((mode === "date-time" || mode === "current") && ymdhms.has(field.name)) return null
          
          // Hide date/time when mode is ymdhms
          if (mode === "ymdhms" && datetime.has(field.name)) return null
          
          // Hide date/time when mode is current (we use ctx.now)
          if (mode === "current" && datetime.has(field.name)) return null
        }

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
                {(field.options ?? []).map((opt, idx) => (
                  <option key={`${opt.value}-${idx}`} value={opt.value}>
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
          // Parse current value (YYYY-MM-DD) or default to today
          const parseDate = (val: string) => {
            if (!val || val === "") {
              const today = new Date()
              return {
                day: String(today.getDate()),
                month: String(today.getMonth() + 1),
                year: String(today.getFullYear()),
              }
            }
            const parts = val.split("-")
            return {
              year: parts[0] || String(new Date().getFullYear()),
              month: parts[1] || String(new Date().getMonth() + 1),
              day: parts[2] || String(new Date().getDate()),
            }
          }

          const dateObj = parseDate(value)
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ]

          const handleDateChange = (part: "day" | "month" | "year", newVal: string) => {
            const updated = { ...dateObj, [part]: newVal }
            // Validate and reconstruct YYYY-MM-DD
            const y = parseInt(updated.year, 10) || new Date().getFullYear()
            const m = parseInt(updated.month, 10) || 1
            const d = parseInt(updated.day, 10) || 1
            const isoDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
            setValue(isoDate)
          }

          return (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <div className="flex items-center gap-2">
                <select
                  value={monthNames[parseInt(dateObj.month, 10) - 1] || monthNames[0]}
                  onChange={(e) => {
                    const idx = monthNames.indexOf(e.target.value)
                    handleDateChange("month", String(idx + 1))
                  }}
                  className="h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {monthNames.map((name, idx) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={dateObj.day}
                  onChange={(e) => handleDateChange("day", e.target.value)}
                  className="h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={dateObj.year}
                  onChange={(e) => handleDateChange("year", e.target.value)}
                  placeholder="YYYY"
                  className="h-10 w-24"
                  min={1900}
                  max={2100}
                />
                <button
                  type="button"
                  className="h-10 w-10 rounded-md border border-input bg-background flex items-center justify-center hover:bg-accent"
                  onClick={() => {
                    // Calendar icon button (could open a calendar picker in future)
                  }}
                >
                  📅
                </button>
              </div>
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
    <div id="calculator-result-content" className="space-y-4">
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
      onDownload={props.id === "time-zone-converter" ? handleDownload : undefined}
      seoContent={<SeoContentGenerator title={def.title || props.title} description={def.description || props.description} categoryName="DateTime" />}
      faqs={(result?.faqs ?? ((def as any).faqs as any))}
    />
  )
}
