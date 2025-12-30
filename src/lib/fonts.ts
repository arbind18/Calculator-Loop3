// Font optimization utilities for Next.js
import { Inter, Poppins, Roboto, Manrope } from 'next/font/google'

// Optimize Google Fonts
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})

export const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  preload: false, // Load on demand
  fallback: ['system-ui', 'arial'],
})

export const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// Font class names for easy usage
export const fontClassNames = `${inter.variable} ${poppins.variable} ${manrope.variable}`

// Preload critical fonts
export function preloadFonts() {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }
}
