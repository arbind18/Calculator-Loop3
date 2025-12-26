"use client"

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(false)
      
      // Show success message
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        console.log('✅ Back online! Syncing data...')
        // Trigger background sync
        navigator.serviceWorker.ready.then((registration) => {
          if ('sync' in registration) {
            ;(registration as any).sync.register('sync-calculations')
          }
        })
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (isOnline || !showBanner) return null

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-5">
      <div className="bg-orange-500 text-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3">
        <WifiOff className="h-5 w-5 animate-pulse" />
        <div>
          <p className="font-semibold text-sm">You're offline</p>
          <p className="text-xs opacity-90">Calculators still work!</p>
        </div>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20 ml-2"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
