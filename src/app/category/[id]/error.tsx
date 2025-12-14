'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Home, Grid3x3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Category Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-orange-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Category Error</h1>
          <p className="text-muted-foreground">
            We couldn't load this category. Please try again.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
