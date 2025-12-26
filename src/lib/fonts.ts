// Font optimization utilities for Next.js
import localFont from 'next/font/local'
import { Inter, Poppins, Roboto } from 'next/font/google'

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

// Local font example (if you have custom fonts)
export const customFont = localFont({
  src: [
    {
      path: '../../public/fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
  fallback: ['system-ui'],
  preload: true,
})

// Font class names for easy usage
export const fontClassNames = `${inter.variable} ${poppins.variable}`

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
