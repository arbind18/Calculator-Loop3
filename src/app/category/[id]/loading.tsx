export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="h-6 w-40 bg-secondary/50 rounded mb-6 animate-pulse" />

        {/* Header Skeleton */}
        <div className="mb-12 text-center md:text-left">
          <div className="h-8 w-32 bg-secondary/50 rounded-full mb-4 animate-pulse" />
          <div className="h-14 w-96 bg-secondary/50 rounded mb-4 animate-pulse" />
          <div className="h-6 w-48 bg-secondary/50 rounded animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-12">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-6">
              <div className="h-8 w-64 bg-secondary/50 rounded animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
                  <div
                    key={card}
                    className="p-6 rounded-2xl bg-card border border-border space-y-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-secondary/50 animate-pulse" />
                    <div className="h-6 w-3/4 bg-secondary/50 rounded animate-pulse" />
                    <div className="h-4 w-full bg-secondary/50 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-secondary/50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
