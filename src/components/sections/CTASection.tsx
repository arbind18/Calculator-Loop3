
"use client"

import { Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function CTASection() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)

  return (
    <section className="w-full py-12 md:py-16 bg-[#0A0E27] text-white text-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
          <div className="p-3 rounded-full bg-white/10 w-fit">
            <Grid3x3 className="h-6 w-6 text-[#00D4FF]" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-transparent">
            {t.cta.findCalculator}
          </h2>
          
          <p className="text-muted-foreground">
            {t.cta.browseDescription}
          </p>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white border-none hover:opacity-90 rounded-xl px-8"
            asChild
          >
            <Link href="#categories">
              {t.cta.exploreCategories}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
