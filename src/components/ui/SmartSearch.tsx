"use client"

import * as React from "react"
import { Search, Calculator, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toolsData } from "@/lib/toolsData"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  category: string
  subcategory: string
  description: string
}

export function SmartSearch() {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Flatten tools data for searching
  const allTools = React.useMemo(() => {
    const tools: SearchResult[] = []
    Object.entries(toolsData).forEach(([catKey, catData]) => {
      Object.entries(catData.subcategories).forEach(([subKey, subData]) => {
        subData.calculators.forEach((tool) => {
          tools.push({
            id: tool.id,
            title: tool.title,
            category: catKey.charAt(0).toUpperCase() + catKey.slice(1),
            subcategory: subData.name,
            description: tool.description
          })
        })
      })
    })
    return tools
  }, [])

  const filteredTools = React.useMemo(() => {
    if (!query) return []
    const lowerQuery = query.toLowerCase()
    return allTools.filter((tool) => 
      tool.title.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery)
    ).slice(0, 5) // Limit to 5 results
  }, [query, allTools])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (toolId: string) => {
    router.push(`/calculator/${toolId}`)
    setIsOpen(false)
    setQuery("")
  }

  // Keyboard shortcut to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        document.getElementById("smart-search-input")?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const trendingSearches = [
    { id: "home-loan-emi", label: "Home Loan EMI" },
    { id: "bmi-calculator", label: "BMI" },
    { id: "age-calculator", label: "Age" },
    { id: "sip-calculator", label: "SIP" },
    { id: "percentage-calculator", label: "Percentage" },
  ]

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          id="smart-search-input"
          type="text"
          className="w-full h-14 pl-12 pr-24 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-lg placeholder:text-muted-foreground/70"
          placeholder="Search for any calculator..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Trending Chips - Show when not searching */}
      {!query && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 animate-fadeIn">
          <span className="text-xs text-muted-foreground font-medium mr-1">Trending:</span>
          {trendingSearches.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="px-2.5 py-1 rounded-full bg-secondary/50 hover:bg-secondary text-xs text-secondary-foreground transition-colors border border-transparent hover:border-primary/20"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelect(tool.id)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors text-left group"
                >
                  <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                      <span className="opacity-70">{tool.category}</span>
                      <ArrowRight className="h-3 w-3 opacity-50" />
                      <span className="text-primary/80 font-medium">{tool.subcategory}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No calculators found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
