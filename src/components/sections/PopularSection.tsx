
"use client"

import Link from "next/link"
import { Calculator, TrendingUp, Clock, Heart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { localizeToolMeta } from "@/lib/toolLocalization"

export function PopularSection() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)

  const prefix = language && language !== 'en' ? `/${language}` : ''
  const withLocale = (href: string) => {
    if (!href) return href
    if (!href.startsWith('/')) return href
    if (!prefix) return href
    return href === '/' ? prefix : `${prefix}${href}`
  }

  const sipMeta = localizeToolMeta({
    dict: t,
    toolId: "sip-calculator",
    fallbackTitle: "SIP Calculator",
    fallbackDescription: "Calculate returns on your monthly investments",
  })

  const popularCalculators = [
    {
      id: "home-loan-emi",
      name: t.popular.emiCalculator,
      description: t.popular.emiDescription,
      icon: Calculator,
      category: t.nav.financial,
      uses: "125K",
      color: "from-blue-500 to-cyan-500",
      url: "/calculator/home-loan-emi"
    },
    {
      id: "bmi-calculator",
      name: t.popular.bmiCalculator,
      description: t.popular.bmiDescription,
      icon: Heart,
      category: t.nav.health,
      uses: "98K",
      color: "from-pink-500 to-rose-500",
      url: "/calculator/bmi-calculator"
    },
    {
      id: "age-calculator",
      name: t.popular.ageCalculator,
      description: t.popular.ageDescription,
      icon: Clock,
      category: t.nav.datetime,
      uses: "87K",
      color: "from-purple-500 to-indigo-500",
      url: "/calculator/age-calculator"
    },
    {
      id: "percentage-calculator",
      name: t.popular.percentageCalculator,
      description: t.popular.percentageDescription,
      icon: TrendingUp,
      category: t.nav.math,
      uses: "76K",
      color: "from-green-500 to-emerald-500",
      url: "/calculator/percentage-calculator"
    },
    {
      id: "gst-calculator",
      name: t.popular.gstCalculator,
      description: t.popular.gstDescription,
      icon: Calculator,
      category: t.nav.financial,
      uses: "65K",
      color: "from-orange-500 to-amber-500",
      url: "/calculator/gst-calculator"
    },
    {
      id: "sip-calculator",
      name: sipMeta.title,
      description: sipMeta.description,
      icon: TrendingUp,
      category: t.nav.financial,
      uses: "54K",
      color: "from-violet-500 to-purple-500",
      url: "/calculator/sip-calculator"
    },
  ]

  return (
    <section id="popular" className="w-full py-16 md:py-24 bg-background relative overflow-hidden" aria-labelledby="popular-heading">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{t.hero.popularTools}</span>
          </div>
          <h2 id="popular-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Most Used Calculators
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Trusted by thousands of users for daily calculations
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCalculators.map((calc, index) => {
            const Icon = calc.icon
            return (
              <Link
                key={calc.id}
                href={withLocale(calc.url)}
                className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Ranking Badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  #{index + 1}
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="uppercase tracking-wider">{calc.category}</span>
                    <span>•</span>
                    <span>{calc.uses} uses</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {calc.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  Use Calculator <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="rounded-full px-8 border-2 hover:bg-gray-50 dark:hover:bg-gray-800" asChild>
            <Link href={withLocale("/category/financial")}>
              View All Calculators
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
