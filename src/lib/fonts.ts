// Font optimization utilities for Next.js
import { Inter, Poppins, Roboto, Manrope } from 'next/font/google'

// Optimize Google Fonts - keep payload small
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})

export const poppins = Poppins({
  weight: ['400', '600', '700'], // Reduced from 4 to 3 weights
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: false, // Not critical - load async
  fallback: ['system-ui', 'arial'],
})

export const roboto = Roboto({
  weight: ['400', '700'], // Reduced from 3 to 2 weights
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  preload: false, // Load on demand
  fallback: ['system-ui', 'arial'],
})

export const manrope = Manrope({
  // Used mainly for the logo (bold). Keep it minimal.
  weight: ['800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  preload: false,
  fallback: ['system-ui', 'arial'],
})

// Font class names for easy usage
export const fontClassNames = `${inter.variable} ${poppins.variable} ${manrope.variable}`

