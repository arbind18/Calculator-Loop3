import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00D4FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0E27' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://calculatorloop.com'),
  title: {
    default: 'Calculator Loop - 300+ Free Online Calculators | EMI, SIP, BMI, GST, Age & Tax Calculator',
    template: '%s | Calculator Loop',
  },
  description: 'Free online calculator tools for 2025! Calculate EMI, SIP returns, BMI, GST, income tax, loan payments, retirement planning & 300+ more. Fast, accurate & mobile-friendly calculators. No signup required.',
  keywords: [
    'online calculator',
    'free calculator 2025',
    'EMI calculator India',
    'SIP calculator',
    'GST calculator India',
    'BMI calculator',
    'age calculator',
    'percentage calculator',
    'loan calculator',
    'home loan EMI',
    'investment calculator',
    'income tax calculator 2025',
  ],
  authors: [{ name: 'Calculator Loop' }],
  creator: 'Calculator Loop',
  publisher: 'Calculator Loop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://calculatorloop.com',
    siteName: 'Calculator Loop',
    title: 'Calculator Loop - 300+ Free Online Calculators | EMI, SIP, BMI, Tax Calculator',
    description: 'Free online calculators for 2025! Calculate EMI, SIP returns, BMI, GST, income tax & more. Fast, accurate & mobile-friendly. 300+ calculator tools available.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calculator Loop - 300+ Free Online Calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@calculatorloop',
    creator: '@calculatorloop',
    title: 'Calculator Loop - 300+ Free Online Calculators | EMI, SIP, BMI, Tax',
    description: 'Free online calculators for 2025! Calculate EMI, SIP returns, BMI, GST, income tax & more. Fast, accurate & mobile-friendly. 300+ tools available.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://calculatorloop.com',
    languages: {
      'en': 'https://calculatorloop.com',
      'hi': 'https://calculatorloop.com/hi',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  manifest: '/manifest.json',
}

// Add cache control
export const revalidate = 3600 // Cache for 1 hour

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pt-20">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
