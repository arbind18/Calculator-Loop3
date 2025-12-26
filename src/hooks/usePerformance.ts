"use client"

import { useEffect } from 'react'

interface PerformanceMetrics {
  LCP?: number // Largest Contentful Paint
  INP?: number // Interaction to Next Paint
  CLS?: number // Cumulative Layout Shift
  FCP?: number // First Contentful Paint
  TTFB?: number // Time to First Byte
}

export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const metrics: PerformanceMetrics = {}

    // Monitor Core Web Vitals
    const reportMetric = (metric: any) => {
      console.log(`[Performance] ${metric.name}:`, metric.value, metric.rating)
      
      // Send to analytics (replace with your analytics endpoint)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
    }

    // Import web-vitals library dynamically
    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(reportMetric)
      onINP(reportMetric)
      onLCP(reportMetric)
      onFCP(reportMetric)
      onTTFB(reportMetric)
    })

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('[Performance] Long Task detected:', entry.duration, 'ms')
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Long task API not supported
      }
    }

    // Monitor resource timing
    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource')
      const slowResources = resources.filter((r: any) => r.duration > 1000)
      
      if (slowResources.length > 0) {
        console.warn('[Performance] Slow resources detected:', slowResources.map((r: any) => ({
          name: r.name,
          duration: Math.round(r.duration),
          size: r.transferSize
        })))
      }
    }
  }, [])
}

// Hook to detect slow network
export function useNetworkStatus() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (connection) {
      const checkConnection = () => {
        const effectiveType = connection.effectiveType
        console.log('[Network]', {
          effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        })

        // Show warning for slow connections
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          console.warn('[Network] Slow connection detected. Consider reducing resources.')
        }
      }

      checkConnection()
      connection.addEventListener('change', checkConnection)

      return () => connection.removeEventListener('change', checkConnection)
    }
  }, [])
}

// Monitor component render performance
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const renderTime = performance.now() - startTime
      if (renderTime > 100) {
        console.warn(`[Render] ${componentName} took ${Math.round(renderTime)}ms to render`)
      }
    }
  })
}
