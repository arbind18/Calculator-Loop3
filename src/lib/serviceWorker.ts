"use client"

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Allow SW in dev mode for testing push notifications
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[SW] Service Worker registered:', registration.scope)

            // Check for updates every hour
            setInterval(() => {
              registration.update()
            }, 60 * 60 * 1000)

            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New version available
                    if (confirm('New version available! Reload to update?')) {
                      newWorker.postMessage({ type: 'SKIP_WAITING' })
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error('[SW] Service Worker registration failed:', error)
          })

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      })
    }
  }, [])

  return null
}

/**
 * Hook to check if user is online/offline
 */
export function useOnlineStatus() {
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Back online')
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('You are back online!', {
          icon: '/logo.svg',
          badge: '/logo.svg'
        })
      }
    }

    const handleOffline = () => {
      console.log('[Network] Gone offline')
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('You are offline', {
          body: 'Some features may not be available',
          icon: '/logo.svg',
          badge: '/logo.svg'
        })
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
}

/**
 * Preload critical resources for better performance
 */
export function useResourcePreload(resources: string[]) {
  useEffect(() => {
    resources.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })
  }, [resources])
}

/**
 * Clear service worker cache
 */
export async function clearServiceWorkerCache() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready
    if (registration.active) {
      registration.active.postMessage({ type: 'CLEAR_CACHE' })
    }
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage() {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    const isPersisted = await navigator.storage.persist()
    console.log(`[Storage] Persistent storage: ${isPersisted ? 'granted' : 'denied'}`)
    return isPersisted
  }
  return false
}

/**
 * Check storage quota
 */
export async function checkStorageQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const percentUsed = ((estimate.usage || 0) / (estimate.quota || 1)) * 100
    
    console.log('[Storage] Usage:', {
      used: `${((estimate.usage || 0) / 1024 / 1024).toFixed(2)} MB`,
      quota: `${((estimate.quota || 0) / 1024 / 1024).toFixed(2)} MB`,
      percentUsed: `${percentUsed.toFixed(2)}%`
    })

    if (percentUsed > 80) {
      console.warn('[Storage] Storage quota is running low!')
    }

    return estimate
  }
  return null
}
