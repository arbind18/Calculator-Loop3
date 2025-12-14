'use client'

import Link from 'next/link'
import { Search, Home, Calculator, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center opacity-20">
            <Search className="h-16 w-16 text-white" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-bold">Calculator Not Found</h2>
          <p className="text-muted-foreground">
            The calculator you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="p-4 bg-secondary/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Use the search feature or browse our calculator categories to find what you need.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>

          <Link href="/#categories" className="w-full">
            <Button variant="outline" className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Browse Calculators
            </Button>
          </Link>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
