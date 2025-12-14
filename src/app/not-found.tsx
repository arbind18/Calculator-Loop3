import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="relative mx-auto h-32 w-32">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-ai opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            Page nahi mila. Shayad aap galat link par click kar diye.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/calculators">Browse Calculators</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
