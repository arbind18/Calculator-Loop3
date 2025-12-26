"use client"

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isWorking, setIsWorking] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) return
    if (!('serviceWorker' in navigator)) return

    const currentPermission = Notification.permission
    setPermission(currentPermission)

    // Show prompt after 60 seconds if not already granted/denied
    if (currentPermission === 'default') {
      const hasDeclined = localStorage.getItem('push-declined')
      if (!hasDeclined) {
        setTimeout(() => setShowPrompt(true), 60000)
      }
    }
  }, [])

  useEffect(() => {
    const open = () => {
      if (!('Notification' in window)) return
      setPermission(Notification.permission)
      setShowPrompt(true)
    }

    window.addEventListener('calculatorloop:open-push-prompt', open)
    return () => window.removeEventListener('calculatorloop:open-push-prompt', open)
  }, [])

  useEffect(() => {
    const syncSubscriptionState = async () => {
      if (!showPrompt) return
      if (!('serviceWorker' in navigator)) return

      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch {
        setIsSubscribed(false)
      }
    }

    syncSubscriptionState()
  }, [showPrompt])

  const requestPermission = async () => {
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      if (!publicKey) {
        console.error('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY')
        setShowPrompt(false)
        return
      }

      const permission = await Notification.requestPermission()
      setPermission(permission)
      
      if (permission === 'granted') {
        console.log('✅ Push notifications enabled')
        
        // Subscribe to push notifications
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            publicKey
          ) as unknown as BufferSource,
        })
        
        // Send subscription to server
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        })
        if (!res.ok) {
          console.error('Failed to save subscription')
        }

        setIsSubscribed(true)
        
        // Show welcome notification
        registration.showNotification('Calculator Loop', {
          body: 'You will now receive updates about new calculators!',
          icon: '/logo.svg',
          badge: '/logo.svg',
          vibrate: [200, 100, 200],
          tag: 'welcome',
        } as any)
      } else {
        localStorage.setItem('push-declined', Date.now().toString())
      }
      
      setShowPrompt(false)
    } catch (error) {
      console.error('Push notification error:', error)
      setShowPrompt(false)
    }
  }

  const unsubscribe = async () => {
    setIsWorking(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        const endpoint = subscription.endpoint
        await subscription.unsubscribe()
        await fetch('/api/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        })
      }
      setIsSubscribed(false)
      setShowPrompt(false)
    } catch (error) {
      console.error('Unsubscribe error:', error)
      setShowPrompt(false)
    } finally {
      setIsWorking(false)
    }
  }

  const sendTestNotification = async () => {
    setIsWorking(true)
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Calculator Loop',
          body: 'Test notification working ✅',
          url: '/',
          icon: '/logo.svg',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        console.error('Test notification failed', data)
      }

      setShowPrompt(false)
    } catch (error) {
      console.error('Test notification error:', error)
      setShowPrompt(false)
    } finally {
      setIsWorking(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('push-declined', Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-20 right-4 max-w-sm z-50 animate-in slide-in-from-top-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <div className="flex-1">
            {permission === 'default' && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Get notified about new calculators, tips, and updates.
                </p>

                <div className="flex gap-2">
                  <Button onClick={requestPermission} size="sm" className="flex-1" disabled={isWorking}>
                    Enable Notifications
                  </Button>
                  <Button onClick={handleDismiss} variant="outline" size="sm" disabled={isWorking}>
                    Not Now
                  </Button>
                </div>
              </>
            )}

            {permission === 'granted' && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Status: {isSubscribed ? 'Enabled' : 'Not subscribed'}
                </p>

                <div className="flex gap-2">
                  <Button onClick={sendTestNotification} size="sm" className="flex-1" disabled={isWorking || !isSubscribed}>
                    Send Test
                  </Button>
                  <Button onClick={unsubscribe} variant="outline" size="sm" disabled={isWorking || !isSubscribed}>
                    Disable
                  </Button>
                </div>

                {!isSubscribed && (
                  <div className="mt-3">
                    <Button onClick={requestPermission} size="sm" className="w-full" disabled={isWorking}>
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </>
            )}

            {permission === 'denied' && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Notifications Blocked
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Browser settings me is site ke liye notifications allow kijiye.
                </p>
                <Button onClick={handleDismiss} variant="outline" size="sm" className="w-full">
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  
  const rawData = window.atob(base64)
  const arrayBuffer = new ArrayBuffer(rawData.length)
  const outputArray = new Uint8Array(arrayBuffer)
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
