
"use client"

import { Button } from "@/components/ui/button"
import { Calculator, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"
import { SmartSearch } from "@/components/ui/SmartSearch"

export function HeroSection() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)

  return (
    <section className="relative w-full pt-8 pb-16 sm:py-24 md:py-32 overflow-hidden bg-background" aria-labelledby="hero-heading">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-500/10 rounded-[100%] blur-3xl opacity-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm shadow-sm animate-fadeIn hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Secure • 100% Free • No Signup Required</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight animate-fadeInUp leading-[1.1] px-2 sm:px-0 bg-gradient-to-r from-[#00D4FF] via-[#8B5CF6] to-[#FF0080] bg-clip-text text-transparent pb-2">
              {t.hero.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeInUp leading-relaxed px-4 sm:px-0" style={{ animationDelay: "0.1s" }}>
              {t.hero.subtitle}
            </p>
          </div>

          {/* Smart Search */}
          <div className="w-full max-w-2xl px-4 sm:px-0 animate-fadeInUp relative z-10" style={{ animationDelay: "0.15s" }}>
            <div className="p-1 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-[1px]">
              <div className="bg-white dark:bg-gray-950 rounded-2xl p-2 shadow-xl">
                <SmartSearch />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp pt-4" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105" asChild>
              <Link href="#popular">
                <Calculator className="mr-2 h-5 w-5" />
                {t.hero.popularTools}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105" asChild>
              <Link href="#categories">
                <TrendingUp className="mr-2 h-5 w-5" />
                {t.nav.categories}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
