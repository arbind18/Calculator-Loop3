import Link from 'next/link'
import { FolderX, Home, Grid3x3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <FolderX className="h-12 w-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Category Not Found</h2>
          <p className="text-muted-foreground">
            This calculator category doesn't exist.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/#categories" className="w-full">
            <Button className="w-full">
              <Grid3x3 className="mr-2 h-4 w-4" />
              Browse All Categories
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
