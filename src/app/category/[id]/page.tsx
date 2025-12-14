import Link from 'next/link'
import * as Icons from 'lucide-react'
import { toolsData } from '@/lib/toolsData'
import { implementedCalculatorIds } from '@/lib/implementedCalculators'
import { ScrollToHash } from '@/components/logic/ScrollToHash'

export const dynamic = 'force-static'
export const revalidate = 3600

// Icon mapping for calculator types
const iconMap: Record<string, string> = {
  'personal-loan-emi': 'User',
  'home-loan-emi': 'Home',
  'car-loan-emi': 'Car',
  'education-loan-emi': 'GraduationCap',
  'business-loan-emi': 'Briefcase',
  'gold-loan-emi': 'Coins',
  'two-wheeler-loan': 'Bike',
  'loan-prepayment-impact': 'FastForward',
  'loan-eligibility': 'CheckCircle',
  'loan-comparison': 'ArrowLeftRight',
  'simple-interest-loan': 'Percent',
  'compound-interest-loan': 'Percent',
  'loan-amortization': 'Calendar',
  'remaining-loan-balance': 'Scale',
  'top-up-loan': 'ArrowUp',
  'sip-calculator': 'TrendingUp',
  'mutual-fund-returns': 'Briefcase',
  'compound-interest-investment': 'Percent',
  'cagr-calculator': 'ChartBar',
  'roi-calculator': 'PieChart',
  'fd-calculator': 'University',
  'rd-calculator': 'RotateCw',
  'nps-calculator': 'Umbrella',
  'ppf-calculator': 'PiggyBank',
  'retirement-corpus': 'Clock',
  'lumpsum-calculator': 'HandCoins',
  'inflation-impact': 'TrendingDown',
  'income-tax-calculator': 'FileText',
  'salary-breakup': 'Banknote',
  'hra-calculator': 'Home',
  'pf-calculator': 'Wallet',
  'gratuity-calculator': 'Gift',
  'tds-calculator': 'Receipt',
  'gst-calculator': 'FileText',
  'professional-tax': 'Briefcase',
  'advance-tax-calculator': 'CalendarCheck',
  'post-tax-income': 'HandCoins',
  'currency-converter': 'ArrowLeftRight',
  'crypto-profit-loss': 'Bitcoin',
  'forex-margin': 'TrendingUp',
  'exchange-rate-impact': 'Globe',
  'bitcoin-converter': 'Bitcoin',
  'import-export-duty': 'Ship',
  'gold-silver-price': 'Coins',
  'international-transfer': 'Send',
  'savings-account-interest': 'PiggyBank',
  'deposit-maturity': 'Activity',
  'interest-rate-comparison': 'Percent',
  'deposit-growth': 'TrendingUp',
  'rd-planner': 'Calendar',
  'bank-charges': 'Receipt',
  'atm-withdrawal-charges': 'Banknote',
  'loan-against-fd': 'University',
  'money-market-calculator': 'ChartBar',
  'profit-margin': 'Percent',
  'break-even-calculator': 'Scale',
  'discount-calculator': 'Receipt',
  'roas-calculator': 'TrendingUp',
  'working-capital': 'Briefcase',
  'markup-calculator': 'ArrowUp',
  'commission-calculator': 'HandCoins',
  'tip-calculator': 'Wallet',
  'age-calculator': 'Calendar',
  'date-difference': 'CalendarCheck',
  'percentage-calculator': 'Percent',
  'fuel-cost-calculator': 'Car',
  'bmi-calculator': 'Scale',
  'bmr-calculator': 'Flame',
  'body-fat-calculator': 'Scale',
  'calorie-calculator': 'Flame',
  'ideal-weight-calculator': 'Scale',
  'macro-calculator': 'PieChart',
  'tdee-calculator': 'Activity',
  'water-intake-calculator': 'Droplets',
  'lean-body-mass': 'Activity',
  'waist-hip-ratio': 'Ruler',
  'protein-calculator': 'ChartBar',
  'calories-burned': 'Activity',
  'target-heart-rate': 'HeartPulse',
  'sleep-calculator': 'Moon',
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = id || ''

  const readableNames: Record<string, string> = {
    financial: 'Financial Calculators',
    health: 'Health & Fitness',
    math: 'Math Calculators',
    datetime: 'Date & Time',
  }

  const categoryData = toolsData[categoryId]
  const subcategoryList = categoryData?.subcategories
    ? Object.entries(categoryData.subcategories).map(([key, sub]) => ({
        key,
        name: sub.name,
        calculators: sub.calculators.filter((calc) => implementedCalculatorIds.has(calc.id)),
      }))
    : []

  const allCalculators = subcategoryList.flatMap((s) => s.calculators)

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Category not found</h1>
          <Link href="/" className="text-primary font-medium">Go home</Link>
        </div>
      </div>
    )
  }

  const categoryName = readableNames[categoryId] || 'Calculators'

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <ScrollToHash />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/#categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>

        {/* Header with Gradient */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Icons.Calculator className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Category</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {categoryName}
          </h1>
          <p className="text-lg text-muted-foreground">
            {allCalculators.length} calculators available
          </p>
        </div>

        {/* Subcategory Sections */}
        <div className="space-y-12">
          {subcategoryList.map((sub, idx) => (
            <div key={sub.key} id={sub.key} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">{sub.name.split(' ')[0]}</span>
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {sub.name.split(' ').slice(1).join(' ')}
                  </span>
                </h2>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {sub.calculators.length} tools
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sub.calculators.map((calc) => {
                  const iconName = iconMap[calc.id] || 'Calculator'
                  const IconComponent = (Icons as any)[iconName] || Icons.Calculator
                  return (
                    <Link
                      key={calc.id}
                      href={`/calculator/${calc.id}`}
                      prefetch={true}
                      className="group relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative space-y-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-7 w-7 text-primary group-hover:text-purple-500 transition-colors" />
                        </div>
                        
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                          {calc.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {calc.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Calculate Now</span>
                          <Icons.ArrowLeft className="h-3 w-3 rotate-180" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {allCalculators.length === 0 && (
          <div className="text-center py-20">
            <Icons.Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No calculators found</h3>
            <p className="text-muted-foreground">
              This category doesn't have any calculators yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
