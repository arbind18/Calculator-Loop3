/**
 * Image Optimization Utility
 * Converts images to WebP/AVIF and generates blur placeholders
 */

interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
}

/**
 * Generate optimized image URL
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const { width, height, quality = 80, format = 'auto' } = options

  // For Next.js Image Optimization
  const params = new URLSearchParams()
  
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  params.append('q', quality.toString())
  
  if (format !== 'auto') {
    params.append('f', format)
  }

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a minimal SVG blur placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <filter id="blur">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <rect width="100%" height="100%" fill="#f3f4f6" filter="url(#blur)" />
    </svg>
  `
  
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low') {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.fetchPriority = priority
  
  document.head.appendChild(link)
}

/**
 * Get responsive image srcset
 */
export function getResponsiveSrcSet(src: string, sizes: number[]): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, { width: size })} ${size}w`)
    .join(', ')
}

/**
 * Get image dimensions from URL
 */
export async function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = src
  })
}

/**
 * Compress image client-side (for user uploads)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      const ratio = img.width / img.height
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        width = maxWidth
        height = width / ratio
      }

      canvas.width = width
      canvas.height = height

      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to compress image'))
        },
        'image/webp',
        quality
      )
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Check if browser supports modern image formats
 */
export function checkImageFormatSupport() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  return {
    webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0,
    avif: canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0,
  }
}

/**
 * Get optimal image format for current browser
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'webp'
  
  const support = checkImageFormatSupport()
  
  if (support.avif) return 'avif'
  if (support.webp) return 'webp'
  return 'jpeg'
}
