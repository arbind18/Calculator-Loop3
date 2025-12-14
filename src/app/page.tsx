import { HeroSection } from '@/components/sections/HeroSection'
import { PopularSection } from '@/components/sections/PopularSection'
import { CategorySection } from '@/components/sections/CategorySection'
import { RecentSection } from '@/components/sections/RecentSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RecentSection />
      <PopularSection />
      <CategorySection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
