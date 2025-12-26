"use client"

import { useEffect, useState, useRef, ComponentType } from 'react'

interface LazyComponentProps {
  fallback?: React.ReactNode
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
}

/**
 * Lazy load component when it enters viewport
 */
export function LazyLoad({ 
  children, 
  fallback = <div className="animate-pulse bg-muted h-64 rounded-lg" />,
  threshold = 0.1,
  rootMargin = '50px'
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}

/**
 * Lazy load images with blur-up effect
 */
interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  blurDataURL?: string
}

export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  blurDataURL 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {!isLoaded && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !blurDataURL && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  )
}

/**
 * Defer component loading until page is interactive
 */
export function useDeferredLoad(delay: number = 0) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for page to be interactive
    if (document.readyState === 'complete') {
      const timer = setTimeout(() => setIsReady(true), delay)
      return () => clearTimeout(timer)
    } else {
      const handleLoad = () => {
        const timer = setTimeout(() => setIsReady(true), delay)
        return () => clearTimeout(timer)
      }
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [delay])

  return isReady
}

/**
 * Preload critical resources
 */
export function usePreloadResources(resources: string[]) {
  useEffect(() => {
    resources.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      
      if (url.endsWith('.woff2') || url.endsWith('.woff')) {
        link.as = 'font'
        link.type = url.endsWith('.woff2') ? 'font/woff2' : 'font/woff'
        link.crossOrigin = 'anonymous'
      } else if (url.endsWith('.css')) {
        link.as = 'style'
      } else if (url.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        link.as = 'image'
      } else if (url.endsWith('.js')) {
        link.as = 'script'
      }
      
      link.href = url
      document.head.appendChild(link)
    })
  }, [resources])
}

/**
 * Dynamically import component with loading state
 */
export function useDynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <div>Loading...</div>
) {
  const [Component, setComponent] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    importFunc()
      .then(module => setComponent(() => module.default))
      .catch(err => setError(err))
  }, [])

  return { Component, error, isLoading: !Component && !error, fallback }
}
