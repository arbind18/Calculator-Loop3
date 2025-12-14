
import { Zap, Shield, Smartphone, TrendingUp, Heart, Lock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant calculations with optimized algorithms",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your data stays private and secure",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Works perfectly on all devices",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Always Updated",
      description: "Regular updates with new calculators",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      title: "Free Forever",
      description: "No subscriptions or hidden fees",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Lock,
      title: "No Sign-up Required",
      description: "Start calculating instantly",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-secondary/30" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 id="features-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Why Choose Us?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The best calculator platform with features you'll love
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
