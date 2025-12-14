import Link from "next/link"

const posts = [
  {
    title: "Choosing the right EMI calculator",
    summary: "How to compare EMIs, interest, and tenure in seconds.",
  },
  {
    title: "SIP vs Lumpsum: when to pick which",
    summary: "Quick rules to decide SIP or lumpsum for your goal.",
  },
  {
    title: "BMI, BMR, and calories explained",
    summary: "A simple guide to the health calculators you use daily.",
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-10">
        <div className="space-y-3 text-center md:text-left">
          <p className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold">Latest from Calculator Loop</h1>
          <p className="text-muted-foreground max-w-3xl">
            Short reads on getting the most out of finance, health, and everyday calculators.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <div key={post.title} className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-muted-foreground text-sm">{post.summary}</p>
              <button className="text-primary text-sm font-medium hover:underline">Read more</button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">Back to Home</Link>
          <Link href="/category/financial" className="px-4 py-2 rounded-lg border border-border font-medium hover:border-primary hover:text-primary">Browse Calculators</Link>
        </div>
      </div>
    </main>
  )
}
