'use client'

import { useEffect, useState } from 'react'
import { Calculator } from 'lucide-react'

export default function Loading() {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-2xl animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 bg-background rounded-xl flex items-center justify-center">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Loading Calculator{dots}</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your calculator
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
