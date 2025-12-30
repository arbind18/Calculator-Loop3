
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Clock, History, Calculator, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { localizeToolMeta } from "@/lib/toolLocalization"

type HistoryRecord = {
  id: string
  calculatorType: string
  calculatorName: string
  category: string
  timestamp?: string
  createdAt?: string
  result?: unknown
}

type RecentItem = {
  id: string
  name: string
  result: string
  time: string
  calculatorType: string
  icon: typeof Calculator
  color: string
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return "just now"
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
}

function formatResult(result: unknown): string {
  if (typeof result === "string") return result
  if (typeof result === "number") return result.toLocaleString("en-IN")

  if (result && typeof result === "object") {
    const entries = Object.entries(result as Record<string, unknown>)
      .filter(([key, value]) =>
        typeof key === "string" &&
        !["schedule", "chartData"].includes(key) &&
        (typeof value === "number" || typeof value === "string")
      )
    const first = entries[0]?.[1]
    if (typeof first === "number") return first.toLocaleString("en-IN")
    if (typeof first === "string") return first
  }

  return ""
}

export function RecentSection() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)

  const prefix = language && language !== 'en' ? `/${language}` : ''
  const withLocale = (href: string) => {
    if (!href) return href
    if (!href.startsWith('/')) return href
    if (!prefix) return href
    return href === '/' ? prefix : `${prefix}${href}`
  }

  const router = useRouter()
  const { data: session } = useSession()

  const colors = useMemo(
    () => [
      "from-blue-500 to-cyan-500",
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
    ],
    []
  )

  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [isClearing, setIsClearing] = useState(false)

  const loadRecent = async () => {
    try {
      if (session?.user) {
        const res = await fetch("/api/user/history?limit=3")
        if (!res.ok) {
          setRecentItems([])
          return
        }

        const data = await res.json()
        const calculations: HistoryRecord[] = Array.isArray(data?.calculations) ? data.calculations : []
        const mapped = calculations.slice(0, 3).map((record, index) => {
          const when = record.createdAt ? new Date(record.createdAt) : new Date()
          return {
            id: record.id,
            name: record.calculatorName,
            result: formatResult(record.result) || "—",
            time: formatRelativeTime(when),
            calculatorType: record.calculatorType,
            icon: Calculator,
            color: colors[index % colors.length],
          }
        })
        setRecentItems(mapped)
      } else {
        const stored = localStorage.getItem("calculationHistory")
        const parsed: HistoryRecord[] = stored ? JSON.parse(stored) : []
        const mapped = (Array.isArray(parsed) ? parsed : []).slice(0, 3).map((record, index) => {
          const when = record.timestamp ? new Date(record.timestamp) : new Date()
          return {
            id: record.id,
            name: record.calculatorName,
            result: formatResult(record.result) || "—",
            time: formatRelativeTime(when),
            calculatorType: record.calculatorType,
            icon: Calculator,
            color: colors[index % colors.length],
          }
        })
        setRecentItems(mapped)
      }
    } catch (e) {
      console.error("Failed to load recent history", e)
      setRecentItems([])
    }
  }

  useEffect(() => {
    loadRecent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    const onUpdated = () => loadRecent()
    window.addEventListener("history-updated", onUpdated)
    return () => window.removeEventListener("history-updated", onUpdated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const handleViewFullHistory = () => {
    router.push(withLocale("/history"))
  }

  const handleClearHistory = async () => {
    if (isClearing) return
    if (!confirm("Are you sure you want to clear history? This cannot be undone.")) return

    setIsClearing(true)
    try {
      if (session?.user) {
        await fetch("/api/user/history", { method: "DELETE" })
      } else {
        localStorage.setItem("calculationHistory", JSON.stringify([]))
        window.dispatchEvent(new Event("history-updated"))
      }
      await loadRecent()
    } catch (e) {
      console.error("Failed to clear history", e)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <section className="w-full py-16 md:py-24 bg-secondary/30" aria-labelledby="recent-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 shadow-lg animate-fadeIn">
            <History className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">{t.recent.yourActivity}</span>
          </div>
          <h2 id="recent-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {t.recent.recentCalculations}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {t.recent.recentDescription}
          </p>
        </div>

        {/* Recent Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {recentItems.length > 0 ? recentItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  const toolId = item.calculatorType === 'home-loan' ? 'home-loan-emi' : item.calculatorType
                  router.push(withLocale(`/calculator/${toolId}`))
                }}
              >
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative flex items-start gap-4">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex-shrink-0`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors truncate">
                      {localizeToolMeta({
                        dict: t,
                        toolId: item.calculatorType === 'home-loan' ? 'home-loan-emi' : item.calculatorType,
                        fallbackTitle: item.name,
                        fallbackDescription: '',
                      }).title}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-primary mb-1 truncate">
                      {item.result}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              {t.recent.recentDescription}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" onClick={handleViewFullHistory}>
            <History className="h-5 w-5" />
            {t.recent.viewFullHistory}
          </Button>
          <Button
            size="lg"
            variant="gradient"
            className="gap-2 w-full sm:w-auto group"
            onClick={handleClearHistory}
            disabled={isClearing}
          >
            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            {t.recent.clearHistory}
          </Button>
        </div>
      </div>
    </section>
  )
}
