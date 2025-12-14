'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Calculator Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
          <p className="text-muted-foreground">
            This calculator encountered an error. Don't worry, we're here to help!
          </p>
        </div>

        <div className="p-4 bg-secondary rounded-lg text-sm text-left">
          <p className="font-semibold mb-1">Error Details:</p>
          <p className="text-muted-foreground">{error.message || 'Unknown error occurred'}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          If this problem persists, please refresh the page or try a different calculator.
        </p>
      </div>
    </div>
  )
}
