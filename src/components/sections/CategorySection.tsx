
import Link from 'next/link'
import { Calculator, Heart, Calendar, DollarSign, Binary } from "lucide-react"
import { toolsData } from '@/lib/toolsData'
import { implementedCalculatorIds } from '@/lib/implementedCalculators'

export function CategorySection() {
  const categoryMeta: Record<string, { name: string; description: string; icon: any; color: string }> = {
    financial: {
      name: "Financial",
      description: "EMI, loan, investment, and tax calculators",
      icon: DollarSign,
      color: "from-blue-500 to-cyan-500",
    },
    health: {
      name: "Health & Fitness",
      description: "BMI, calorie, body fat, and fitness calculators",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
    },
    math: {
      name: "Math",
      description: "Algebra, geometry, statistics, and more",
      icon: Binary,
      color: "from-purple-500 to-indigo-500",
    },
    datetime: {
      name: "Date & Time",
      description: "Age, date difference, and time calculators",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
    },
  }

  const categories = Object.entries(toolsData)
    .map(([id, data]) => {
      const calculators = Object.values(data.subcategories ?? {}).flatMap((subcategory) =>
        subcategory.calculators.filter((calc) => implementedCalculatorIds.has(calc.id))
      )
      return {
        id,
        count: calculators.length,
        ...categoryMeta[id],
      }
    })
    .filter((category) => category.count > 0 && categoryMeta[category.id])

  return (
    <section id="categories" className="w-full py-16 md:py-24 bg-gradient-to-b from-background via-secondary/30 to-background" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Browse</span>
          </div>
          <h2 id="categories-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Calculator Categories
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Explore calculators organized by category
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg text-left block"
              >
                {/* Content */}
                <div className="relative space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {category.count} calculators
                    </span>
                    <span className="text-sm font-medium text-primary">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
