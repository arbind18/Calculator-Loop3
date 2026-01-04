import { HeroSection } from '@/components/sections/HeroSection'
import { PopularSection } from '@/components/sections/PopularSection'
import { RecentSection } from '@/components/sections/RecentSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <RecentSection />
      <PopularSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
