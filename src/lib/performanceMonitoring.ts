// Performance monitoring for Next.js app

export function registerPerformanceObserver() {
  if (typeof window === 'undefined') return

  // Report Core Web Vitals to analytics
  const reportWebVital = (metric: any) => {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id
    })

    // Send to Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Send to custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_URL) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          timestamp: Date.now()
        }),
        keepalive: true
      }).catch(console.error)
    }
  }

  // Import and register web-vitals
  import('web-vitals').then(({ onCLS, onLCP, onFCP, onTTFB, onINP }) => {
    onCLS(reportWebVital)
    onLCP(reportWebVital)
    onFCP(reportWebVital)
    onTTFB(reportWebVital)
    onINP(reportWebVital)
  }).catch(err => console.error('Web vitals loading error:', err))

  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('[Long Task]', {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime)
            })
          }
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Long task observer not supported
    }
  }

  // Monitor layout shifts
  if ('PerformanceObserver' in window) {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue
          console.warn('[Layout Shift]', {
            value: (entry as any).value,
            sources: (entry as any).sources
          })
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // Layout shift observer not supported
    }
  }
}

// Monitor resource loading
export function monitorResourceTiming() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource')
    
    // Find slow resources
    const slowResources = resources
      .filter((r: any) => r.duration > 1000)
      .map((r: any) => ({
        name: r.name.split('/').pop(),
        duration: Math.round(r.duration),
        size: r.transferSize,
        type: r.initiatorType
      }))

    if (slowResources.length > 0) {
      console.warn('[Slow Resources]', slowResources)
    }

    // Calculate total transfer size
    const totalSize = resources.reduce((acc: number, r: any) => acc + (r.transferSize || 0), 0)
    console.log('[Page Weight]', `${(totalSize / 1024 / 1024).toFixed(2)} MB`)
  })
}

// Detect memory leaks
export function monitorMemory() {
  if (typeof window === 'undefined') return
  if (!(performance as any).memory) return

  setInterval(() => {
    const memory = (performance as any).memory
    const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
    const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
    const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)

    console.log('[Memory]', {
      used: `${usedMB} MB`,
      total: `${totalMB} MB`,
      limit: `${limitMB} MB`,
      usage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}%`
    })

    // Warn if memory usage is high
    if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
      console.warn('[Memory] High memory usage detected!')
    }
  }, 30000) // Check every 30 seconds
}

// Global performance monitoring initialization
export function initPerformanceMonitoring() {
  registerPerformanceObserver()
  monitorResourceTiming()
  
  if (process.env.NODE_ENV === 'development') {
    monitorMemory()
  }
}
