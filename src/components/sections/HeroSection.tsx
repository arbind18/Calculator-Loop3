
import { Button } from "@/components/ui/button"
import { Calculator, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-32 overflow-hidden" aria-labelledby="hero-heading">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fadeIn">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">300+ Calculators Available</span>
          </div>

          {/* Heading */}
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fadeInUp leading-tight px-2 sm:px-0">
            All Your Calculations in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-shimmer inline-block">
              One Place
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl animate-fadeInUp leading-relaxed px-4 sm:px-0" style={{ animationDelay: "0.1s" }}>
            Access a comprehensive collection of <strong className="font-semibold text-foreground">300+ calculators</strong> for finance, health, math, and more. 
            Fast, accurate, and completely free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <Button size="xl" variant="gradient" className="gap-2 group" asChild>
              <Link href="#popular">
                <Calculator className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Explore Calculators
              </Link>
            </Button>
            <Button size="xl" variant="outline" className="gap-2" asChild>
              <Link href="#categories">
                <TrendingUp className="h-5 w-5" />
                Browse by Category
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 w-full max-w-3xl animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="space-y-1 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">300+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Calculators</div>
            </div>
            <div className="space-y-1 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-500">10+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="space-y-1 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:scale-105 transition-transform">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Free</div>
            </div>
          </div>

          {/* Features Badge */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Lightning Fast
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
              <Calculator className="h-4 w-4 text-primary" />
              Mobile Friendly
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              No Sign-up Required
            </div>
          </div>

          {/* Mobile CTA Section - Matches oldui.html */}
          <div className="md:hidden w-full mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[rgba(255,255,255,0.2)] text-center">
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-transparent">
              Start Calculating Now
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access 300+ free calculators for finance, health, math & more.
            </p>
            <Button className="w-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white border-none" asChild>
              <Link href="#categories">
                Explore All Tools
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
