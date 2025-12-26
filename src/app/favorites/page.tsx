import type { Metadata } from 'next'
import { FavoritesManager } from '@/components/dashboard/FavoritesManager'

export const metadata: Metadata = {
  title: 'Favorites - Calculator Loop',
  description: 'Your favorite calculators.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <FavoritesManager />
      </div>
    </main>
  )
}
