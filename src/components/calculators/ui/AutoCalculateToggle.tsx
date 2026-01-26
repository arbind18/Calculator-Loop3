"use client"

import { useState } from 'react'
import { Calculator } from 'lucide-react'

interface AutoCalculateToggleProps {
    enabled: boolean
    onChange: (enabled: boolean) => void
    className?: string
}

export function AutoCalculateToggle({ enabled, onChange, className = '' }: AutoCalculateToggleProps) {
    return (
        <div className={`flex items-center gap-2.5 px-3 py-2 bg-card rounded-lg border ${className}`}>
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Auto Calculate</span>
            <button
                role="switch"
                aria-checked={enabled}
                onClick={() => onChange(!enabled)}
                className={`
          relative inline-flex h-5 w-9 items-center rounded-full transition-colors
          ${enabled ? 'bg-primary' : 'bg-muted'}
        `}
            >
                <span
                    className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform
            ${enabled ? 'translate-x-4' : 'translate-x-0.5'}
          `}
                />
                <span className="sr-only">Toggle auto calculate</span>
            </button>
        </div>
    )
}
