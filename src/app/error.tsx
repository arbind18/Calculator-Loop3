'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="relative mx-auto h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-gradient-ai opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">⚠️</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
          <p className="text-lg text-muted-foreground">
            Kuch galat ho gaya. Kripya dobara try karein.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-sm text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
