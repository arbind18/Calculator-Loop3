'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
          <div className="max-w-lg w-full text-center space-y-6 bg-card p-8 rounded-2xl border shadow-xl">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold">Something went wrong!</h1>
              <p className="text-muted-foreground text-lg">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm font-mono text-left break-all">
                {error.message || 'An unexpected error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={reset}
                className="w-full bg-gradient-to-r from-primary to-purple-600 text-white text-lg py-6"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>

              <a href="/" className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              If this problem persists, try clearing your browser cache or contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
