import type { Metadata } from 'next'
import { PopularSection } from '@/components/sections/PopularSection'

export const metadata: Metadata = {
  title: 'Popular Calculators - Calculator Loop',
  description: 'Browse the most popular calculators: EMI, SIP, tax, health, and more. Fast, accurate, and free.',
  alternates: {
    canonical: '/popular',
  },
}

export default function PopularPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="pt-8">
        <PopularSection />
      </div>
    </main>
  )
}
