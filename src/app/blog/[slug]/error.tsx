'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/components/providers/SettingsProvider'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { language } = useSettings()
  const prefix = language === 'en' ? '' : `/${language}`
  const withLocale = (path: string) => `${prefix}${path}`

  useEffect(() => {
    console.error('Blog slug render error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-gradient-ai opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Oops — unable to load this article</h1>
          <p className="text-base text-muted-foreground">Kuch problem aa gaya. Kripya dobara try karein ya home par jaayein.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="sm">
            Try Again
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={withLocale('/')}>Go Home</Link>
          </Button>
        </div>

        {error?.message && (
          <p className="text-sm text-muted-foreground">{error.message}</p>
        )}
      </div>
    </div>
  )
}
