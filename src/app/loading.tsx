export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-ai opacity-20" />
      </div>
    </div>
  )
}
