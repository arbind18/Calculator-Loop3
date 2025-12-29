// public/sw.js - Service Worker for Caching

const CACHE_NAME = 'calculator-loop-v3'
const RUNTIME_CACHE = 'calculator-runtime-v3'

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/logo.svg',
  '/icon',
  '/apple-icon',
]

const NETWORK_FIRST_PATHS = new Set([
  '/manifest.json',
  '/logo.svg',
  '/icon',
  '/apple-icon',
  '/favicon.ico',
])

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching critical assets')
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip API requests (always fetch fresh)
  if (url.pathname.startsWith('/api/')) return

  // Skip external requests
  if (url.origin !== location.origin) return

  // Never cache Next.js internals (especially in dev). These change frequently.
  if (url.pathname.startsWith('/_next/')) return

  // Network-first for icons/manifest to avoid sticky old branding
  if (NETWORK_FIRST_PATHS.has(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Cache-first strategy for static assets
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request).then((response) => {
          // Clone the response
          const responseToCache = response.clone()

          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
      }).catch(() => {
        // Return offline fallback for images
        if (request.destination === 'image') {
          return caches.match('/offline-image.svg')
        }
      })
    )
    return
  }

  // Network-first strategy for pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Return offline page
          return caches.match('/offline')
        })
      })
  )
})

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
})

async function syncAnalytics() {
  // Sync pending analytics when online
  const cache = await caches.open('analytics-queue')
  const requests = await cache.keys()
  
  for (const request of requests) {
    try {
      await fetch(request)
      await cache.delete(request)
    } catch (error) {
      console.error('[SW] Analytics sync failed:', error)
    }
  }
}

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        )
      })
    )
  }
})

// Push Notification Handler
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/logo.svg',
      badge: data.badge || '/logo.svg',
      vibrate: data.vibrate || [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      },
      actions: data.actions || []
    }
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification Click Handler
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received.')
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
