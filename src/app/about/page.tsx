import Link from "next/link"
import type { Metadata } from 'next'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'About - Calculator Loop',
  description: 'Calculator Loop offers 1,778 calculators across 10 categories. AI-powered experience, fast results, and clean design.',
}

export default async function AboutPage() {
  const language = (await headers()).get('x-calculator-language') || 'en'
  const prefix = language === 'en' ? '' : `/${language}`
  const withLocale = (path: string) => `${prefix}${path}`

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-10">
        <div className="space-y-3 text-center md:text-left">
          <p className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">About</p>
          <h1 className="text-4xl md:text-5xl font-bold">About Calculator Loop</h1>
          <p className="text-muted-foreground max-w-3xl">
            Calculator Loop is an all-in-one calculator platform with 1,778 tools across 10 main categories.
            Our focus is fast, accurate, and mobile-friendly calculations — with a clean and reliable experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">How many tools are available?</h2>
            <p className="text-muted-foreground">
              The platform currently offers 1,778 calculators/templates across Finance, Health, Math, Date & Time, Education,
              Technology, Scientific, Construction, Business, and Everyday categories. Each category includes multiple subcategories
              and specialized tools for deeper, niche-level calculations.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Search visibility (Google indexing)</h2>
            <p className="text-muted-foreground">
              The site is structured with 10 categories, clear subcategories, and dedicated pages for all 1,778 tools. We focus on clean
              URLs, internal linking, and sitemap support so search engines can understand the site depth and scope. As crawl cycles
              complete, visibility naturally improves.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">The role of AI</h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>Smart tool discovery: suggests the right calculator for your goal</li>
              <li>Context-aware explanations: explains results in simple language</li>
              <li>Localization support: adapts content by language and intent</li>
              <li>Faster navigation: related calculators and next-step guidance</li>
              <li>Quality checks: highlights common input errors</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Calculator Loop advantages</h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>Speed: instant results without heavy steps</li>
              <li>Accuracy: tested formulas and reliable logic</li>
              <li>Clean UI: clutter-free and mobile-first design</li>
              <li>Wide coverage: from personal finance to construction tools</li>
              <li>Free access: most tools without login</li>
              <li>Trusted experience: consistent layouts and predictable outputs</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Who is it for?</h2>
            <p className="text-muted-foreground">
              Students, professionals, business owners, and everyday users who need quick, accurate calculations.
              Whether it is finance planning, academic work, or daily-life conversions, everything is in one place.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
            <h2 className="text-2xl font-semibold">Quality & reliability</h2>
            <p className="text-muted-foreground">
              Every calculator is designed with formula validation and edge-case checks. We focus on clear, consistent outputs
              that remain relevant for real-world use.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/60 shadow-lg space-y-3">
          <h2 className="text-2xl font-semibold">Our mission</h2>
          <p className="text-muted-foreground">
            Deliver fast, accurate, and easy calculators for everyone — from EMI and SIP to BMI, taxes, conversions,
            and time-based calculations. One simple platform for every category.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={withLocale('/')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">Back to Home</Link>
          <Link href={withLocale('/category/financial')} className="px-4 py-2 rounded-lg border border-border font-medium hover:border-primary hover:text-primary">Browse Calculators</Link>
        </div>
      </div>
    </main>
  )
}
