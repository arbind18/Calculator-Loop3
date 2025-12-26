"use client"

import { useEffect, ReactNode } from 'react'
import { initPerformanceMonitoring } from '@/lib/performanceMonitoring'

interface PerformanceMonitorProps {
  children: ReactNode;
}

export function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring()

    // Log initial page load performance
    if (typeof window !== 'undefined' && performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing
          const pageLoadTime = timing.loadEventEnd - timing.navigationStart
          const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart
          const renderTime = timing.domComplete - timing.domLoading

          console.log('[Page Performance]', {
            'Total Load Time': `${pageLoadTime}ms`,
            'DOM Ready': `${domReadyTime}ms`,
            'Render Time': `${renderTime}ms`,
            'DNS Lookup': `${timing.domainLookupEnd - timing.domainLookupStart}ms`,
            'TCP Connection': `${timing.connectEnd - timing.connectStart}ms`,
            'Server Response': `${timing.responseEnd - timing.requestStart}ms`,
            'DOM Processing': `${timing.domComplete - timing.domLoading}ms`
          })

          // Performance recommendations
          if (pageLoadTime > 3000) {
            console.warn('[Performance] Page load time is slow (>3s)')
          }
          if (domReadyTime > 1500) {
            console.warn('[Performance] DOM ready time is slow (>1.5s)')
          }
        }, 0)
      })
    }

    // Monitor frame rate (FPS)
    let frameCount = 0
    let lastTime = performance.now()
    
    const checkFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        if (fps < 30) {
          console.warn('[Performance] Low FPS detected:', fps)
        } else if (fps < 50) {
          console.log('[Performance] FPS:', fps)
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(checkFPS)
    }
    
    if (process.env.NODE_ENV === 'development') {
      requestAnimationFrame(checkFPS)
    }
  }, [])

  return null
}

/**
 * Performance Budget Checker
 * Warns if page exceeds performance budgets
 */
export function usePerformanceBudget() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource')
      
      // Define budgets (in KB)
      const budgets = {
        javascript: 200,
        css: 50,
        images: 500,
        fonts: 100,
        total: 1000
      }

      let sizes = {
        javascript: 0,
        css: 0,
        images: 0,
        fonts: 0,
        total: 0
      }

      resources.forEach((r: any) => {
        const sizeKB = (r.transferSize || 0) / 1024
        sizes.total += sizeKB

        if (r.name.match(/\.js$/)) sizes.javascript += sizeKB
        else if (r.name.match(/\.css$/)) sizes.css += sizeKB
        else if (r.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) sizes.images += sizeKB
        else if (r.name.match(/\.(woff|woff2|ttf|eot)$/)) sizes.fonts += sizeKB
      })

      console.log('[Performance Budget]', {
        JavaScript: `${sizes.javascript.toFixed(1)} KB / ${budgets.javascript} KB`,
        CSS: `${sizes.css.toFixed(1)} KB / ${budgets.css} KB`,
        Images: `${sizes.images.toFixed(1)} KB / ${budgets.images} KB`,
        Fonts: `${sizes.fonts.toFixed(1)} KB / ${budgets.fonts} KB`,
        Total: `${sizes.total.toFixed(1)} KB / ${budgets.total} KB`
      })

      // Warn about budget violations
      if (sizes.javascript > budgets.javascript) {
        console.warn(`⚠️ JavaScript budget exceeded: ${sizes.javascript.toFixed(1)} KB > ${budgets.javascript} KB`)
      }
      if (sizes.css > budgets.css) {
        console.warn(`⚠️ CSS budget exceeded: ${sizes.css.toFixed(1)} KB > ${budgets.css} KB`)
      }
      if (sizes.images > budgets.images) {
        console.warn(`⚠️ Images budget exceeded: ${sizes.images.toFixed(1)} KB > ${budgets.images} KB`)
      }
      if (sizes.total > budgets.total) {
        console.error(`🚨 Total page size budget exceeded: ${sizes.total.toFixed(1)} KB > ${budgets.total} KB`)
      }
    })
  }, [])

  return null
}
