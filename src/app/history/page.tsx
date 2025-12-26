import type { Metadata } from 'next'
import { CalculationHistory } from "@/components/dashboard/CalculationHistory"

export const metadata: Metadata = {
  title: 'History - Calculator Loop',
  description: 'Your calculator history.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CalculationHistory />
    </div>
  )
}
