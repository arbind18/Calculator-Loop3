
import { Calculator, TrendingUp, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PopularSection() {
  const popularCalculators = [
    {
      id: "emi-calculator",
      name: "EMI Calculator",
      description: "Calculate your loan EMI with interest rates and tenure",
      icon: Calculator,
      category: "Financial",
      uses: "125K",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "bmi-calculator",
      name: "BMI Calculator",
      description: "Calculate your Body Mass Index and health status",
      icon: Heart,
      category: "Health",
      uses: "98K",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "age-calculator",
      name: "Age Calculator",
      description: "Calculate exact age in years, months, and days",
      icon: Clock,
      category: "Date & Time",
      uses: "87K",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "percentage-calculator",
      name: "Percentage Calculator",
      description: "Calculate percentages, increase/decrease, and more",
      icon: TrendingUp,
      category: "Math",
      uses: "76K",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "gst-calculator",
      name: "GST Calculator",
      description: "Calculate GST inclusive and exclusive amounts",
      icon: Calculator,
      category: "Financial",
      uses: "65K",
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "loan-calculator",
      name: "Loan Calculator",
      description: "Calculate loan payments and total interest",
      icon: Calculator,
      category: "Financial",
      uses: "54K",
      color: "from-violet-500 to-purple-500",
    },
  ]

  return (
    <section id="popular" className="w-full py-16 md:py-24 bg-gradient-to-b from-background via-secondary/20 to-background" aria-labelledby="popular-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Most Used</span>
          </div>
          <h2 id="popular-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Popular Calculators
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The most frequently used calculators by our community
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCalculators.map((calc, index) => {
            const Icon = calc.icon
            return (
              <button
                key={calc.id}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 text-left animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Ranking Badge */}
                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-orange-500 text-white text-xs font-bold shadow-sm">
                  #{index + 1}
                </div>

                {/* Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${calc.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                {/* Content */}
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${calc.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {calc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {calc.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Button size="lg" variant="outline" className="gap-2">
            View All Calculators
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
