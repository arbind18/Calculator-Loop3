"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChartToggle({ 
  view, 
  onChange, 
  options 
}: { 
  view: string, 
  onChange: (v: any) => void, 
  options: { value: string, label: string, icon: LucideIcon }[] 
}) {
  return (
    <div className="flex bg-secondary/30 p-1.5 rounded-xl border border-border/50 w-full max-w-full overflow-x-auto justify-start sm:justify-center mx-auto mb-8 shadow-inner">
      {options.map((opt) => {
        const Icon = opt.icon
        const isActive = view === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
              isActive 
                ? "bg-background text-primary shadow-md scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
