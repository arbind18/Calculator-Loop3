
"use client"

import { Zap, Shield, Smartphone, TrendingUp, Heart, Lock } from "lucide-react"
import { useSettings } from "@/components/providers/SettingsProvider"
import { getMergedTranslations } from "@/lib/translations"

export function FeaturesSection() {
  const { language } = useSettings()
  const t = getMergedTranslations(language)

  const features = [
    {
      icon: Zap,
      title: t.features.lightningFast,
      description: t.features.lightningDescription,
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: t.features.secure,
      description: t.features.secureDescription,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Smartphone,
      title: t.features.mobileFriendly,
      description: t.features.mobileDescription,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: t.features.alwaysUpdated,
      description: t.features.updatedDescription,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      title: t.features.freeForever,
      description: t.features.freeDescription,
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Lock,
      title: t.features.noSignup,
      description: t.features.noSignupDescription,
      color: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-secondary/30" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 id="features-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {t.features.whyChooseUs}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {t.features.whyChooseDescription}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
