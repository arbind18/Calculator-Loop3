
import { Clock, History, Calculator, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentSection() {
  // Sample recent calculations data
  const recentItems = [
    {
      id: 1,
      name: "EMI Calculator",
      result: "₹15,234/month",
      time: "2 hours ago",
      icon: Calculator,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "BMI Calculator",
      result: "22.5 (Normal)",
      time: "5 hours ago",
      icon: Calculator,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 3,
      name: "Age Calculator",
      result: "28 years 5 months",
      time: "1 day ago",
      icon: Calculator,
      color: "from-purple-500 to-indigo-500",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-secondary/30" aria-labelledby="recent-heading">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 shadow-lg animate-fadeIn">
            <History className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Your Activity</span>
          </div>
          <h2 id="recent-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Recent Calculations
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Quick access to your recently used calculators and saved results
          </p>
        </div>

        {/* Recent Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {recentItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative flex items-start gap-4">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex-shrink-0`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-primary mb-1 truncate">
                      {item.result}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
          <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
            <History className="h-5 w-5" />
            View Full History
          </Button>
          <Button size="lg" variant="gradient" className="gap-2 w-full sm:w-auto group">
            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            Clear History
          </Button>
        </div>
      </div>
    </section>
  )
}
