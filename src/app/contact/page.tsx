import Link from "next/link"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-10">
        <div className="space-y-3 text-center md:text-left">
          <p className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground max-w-3xl">
            Have feedback or need a calculator added? Reach out—we respond quickly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Email</h2>
            <p className="text-muted-foreground">support@calculatorloop.com</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Social</h2>
            <p className="text-muted-foreground">Twitter / X: @calculatorloop</p>
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
