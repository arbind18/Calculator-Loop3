import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-10">
        <div className="space-y-3 text-center md:text-left">
          <p className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">About</p>
          <h1 className="text-4xl md:text-5xl font-bold">About Calculator Loop</h1>
          <p className="text-muted-foreground max-w-3xl">
            We built Calculator Loop to make 300+ calculators fast, accurate, and free. Finance, health, math, time—everything in one clean experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">What you get</h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>Lightning-fast calculations with no paywalls</li>
              <li>Mobile-first design that works everywhere</li>
              <li>Clear results you can trust</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Our mission</h2>
            <p className="text-muted-foreground">
              Help everyone solve everyday calculations quickly—whether it&apos;s EMI, SIP, BMI, taxes, conversions, or time math.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">Back to Home</Link>
          <Link href="/category/financial" className="px-4 py-2 rounded-lg border border-border font-medium hover:border-primary hover:text-primary">Browse Calculators</Link>
        </div>
      </div>
    </main>
  )
}
