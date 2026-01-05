"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { 
  Calculator, ChevronRight, DollarSign, Heart, Binary, Wrench, Briefcase, Home, GraduationCap, Calendar, Laptop, FlaskConical, ChevronDown,
  Scale, Activity, Zap, Ruler, Clock, Globe, Percent, TrendingUp, Landmark, PiggyBank, CreditCard, Building, Truck, BookOpen, 
  Coins, Banknote, Wallet, Receipt, BarChart3, PieChart, LineChart, ArrowRightLeft, Timer, Watch, Hourglass, Sun, Moon, 
  Cloud, Wind, Thermometer, Droplets, Hammer, HardHat, PaintBucket, Smartphone, Wifi, Signal, 
  Battery, Cpu, Database, Server, Code, Terminal, FileCode, FileJson, FileType, FileText, Image as ImageIcon, Music, Video, 
  Gamepad, Joystick, Dna, Microscope, Atom, Syringe, Pill, Stethoscope, Brain, Baby, User, Users, Key, QrCode, Network, Box,
  Apple, Dumbbell, Bed, Utensils, Goal, ShieldAlert, Package, Award, Sparkles, TrendingDown, Target, Shield, Lock,
  Umbrella, CircleDollarSign, Building2, Briefcase as BriefcaseIcon, MapPin, GraduationCap as EducationIcon, Languages,
  Plane, Ship, Store, Factory, BarChart, BookMarked, Layers, Settings, FileSpreadsheet, Repeat, AlertCircle, Info
} from 'lucide-react'
import { HeroSection } from '@/components/sections/HeroSection'
import { RecentSection } from '@/components/sections/RecentSection'
import { PopularSection } from '@/components/sections/PopularSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { CTASection } from '@/components/sections/CTASection'
import { toolsData } from '@/lib/toolsData'
import { implementedCalculatorIds } from '@/lib/calculatorRegistry'
import { useSettings } from '@/components/providers/SettingsProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { localizeToolMeta } from '@/lib/toolLocalization'

type DashboardTool = {
  id: string
  title: string
  description: string
}

type DashboardSubcategory = {
  key: string
  name: string
  calculators: DashboardTool[]
}

type DashboardCategory = {
  id: string
  name: string
  count: number
  subcategoryList: DashboardSubcategory[]
}

const toolIcons: Record<string, any> = {
  // Financial
  'loan-calculator': Banknote,
  'personal-loan-calculator': Banknote,
  'home-loan-calculator': Home,
  'car-loan-calculator': Truck,
  'education-loan-calculator': GraduationCap,
  'business-loan-calculator': Briefcase,
  'gold-loan-calculator': Coins,
  'mortgage-calculator': Home,
  'interest-calculator': Percent,
  'investment-calculator': TrendingUp,
  'retirement-calculator': PiggyBank,
  'tax-calculator': Receipt,
  'income-tax-calculator': Receipt,
  'gst-calculator': Percent,
  'currency-converter': ArrowRightLeft,
  'salary-calculator': Wallet,
  'sip-calculator': TrendingUp,
  'ppf-calculator': PiggyBank,
  'fd-calculator': Landmark,
  'rd-calculator': Landmark,
  'emi-calculator': Calculator,
  'cagr-calculator': TrendingUp,
  'discount-calculator': Percent,
  'inflation-calculator': TrendingUp,
  
  // Health
  'bmi-calculator': Scale,
  'bmr-calculator': Activity,
  'body-fat-calculator': User,
  'calorie-calculator': Activity,
  'ideal-weight-calculator': Scale,
  'pregnancy-calculator': Baby,
  'ovulation-calculator': Calendar,
  'period-calculator': Calendar,
  'due-date-calculator': Baby,
  'water-intake-calculator': Droplets,
  'blood-alcohol-calculator': FlaskConical,
  'heart-rate-calculator': Heart,
  'breath-count-calculator': Wind,
  
  // Math
  'percentage-calculator': Percent,
  'fraction-calculator': PieChart,
  'scientific-calculator': Calculator,
  'random-number-generator': Binary,
  'statistics-calculator': BarChart3,
  'matrix-calculator': Binary,
  
  // Construction
  'concrete-calculator': Truck,
  'brick-calculator': Building,
  'tile-calculator': Ruler,
  'paint-calculator': PaintBucket,
  'flooring-calculator': Ruler,
  'roofing-calculator': Home,
  'wood-calculator': Hammer,
  
  // Business
  'margin-calculator': TrendingUp,
  'markup-calculator': TrendingUp,
  'break-even-calculator': BarChart3,
  'roi-calculator': TrendingUp,
  'cpm-calculator': DollarSign,
  'vat-calculator': Receipt,
  
  // Everyday
  'age-calculator': Calendar,
  'date-calculator': Calendar,
  'time-calculator': Clock,
  'fuel-calculator': Truck,
  'electricity-calculator': Zap,
  'tip-calculator': Coins,
  
  // Technology
  'data-storage-converter': Database,
  'bandwidth-calculator': Wifi,
  'password-generator': Key,
  'qr-code-generator': QrCode,
  'ip-subnet-calculator': Network,
  
  // Science
  'density-calculator': FlaskConical,
  'force-calculator': Zap,
  'power-calculator': Zap,
  'pressure-calculator': Activity,
  'speed-calculator': Activity,
  'volume-calculator': Box,
}

const subcategoryIcons: Record<string, any> = {
  // Financial subcategories
  'loan-emi-calculators': Banknote,
  'investment-returns-calculators': TrendingUp,
  'tax-income-calculators': Receipt,
  'currency-forex-calculators': ArrowRightLeft,
  'time-based-financial': Clock,
  'banking-savings-calculators': Landmark,
  'insurance-calculators': Shield,
  'real-estate-calculators': Building,
  'credit-card-calculators': CreditCard,
  'retirement-calculators': PiggyBank,
  'business-profitability-calculators': BarChart3,
  'miscellaneous-financial-tools': Wallet,
  
  // Health subcategories
  'body-measurements': Ruler,
  'nutrition-calories': Apple,
  'exercise-performance': Dumbbell,
  'heart-vital-health': Stethoscope,
  'pregnancy-fertility': Baby,
  'sleep-lifestyle': Bed,
  'weight-goal-management': Target,
  'disease-risk-prevention': Shield,
  'biological-time': Clock,
  
  // Math subcategories
  'basic-arithmetic': Calculator,
  'algebra-equations': Binary,
  'geometry-shapes': Box,
  'trigonometry': Activity,
  'probability-statistics': BarChart3,
  'unit-conversions': Repeat,
  'number-systems': FileCode,
  'graphs-formulas': LineChart,
  'matrices-vectors': Layers,
  'advanced-mathematics': Sparkles,
  
  // Construction subcategories
  'concrete-cement': Truck,
  'masonry': Building,
  'roofing': Home,
  'flooring': Ruler,
  'painting': PaintBucket,
  'lumber-wood': Hammer,
  'electrical': Zap,
  'plumbing': Droplets,
  'hvac': Wind,
  'excavation': HardHat,
  
  // Business subcategories
  'profit-margin': TrendingUp,
  'pricing': DollarSign,
  'financial-ratios': BarChart,
  'marketing': Target,
  'sales': Store,
  'inventory': Package,
  'hr-payroll': Users,
  'break-even': LineChart,
  'roi-analysis': CircleDollarSign,
  'business-loans': Briefcase,
  
  // Everyday subcategories
  'time-date': Calendar,
  'age-birthday': Baby,
  'travel-distance': Plane,
  'fuel-mileage': Truck,
  'cooking-recipes': Utensils,
  'shopping-budget': Store,
  'utilities': Zap,
  'tips-gratuity': Coins,
  'unit-conversion': ArrowRightLeft,
  'random-generators': Sparkles,
  
  // Education subcategories
  'grade-gpa': Award,
  'study-time': Clock,
  'student-loans': GraduationCap,
  'exam-prep': BookMarked,
  'course-planning': Calendar,
  'language-learning': Languages,
  'research-tools': Microscope,
  'academic-writing': FileText,
  
  // DateTime subcategories
  'date-calculator': Calendar,
  'time-calculator': Clock,
  'world-clock': Globe,
  'time-zone': MapPin,
  'calendar-tools': Calendar,
  'countdown-timer': Hourglass,
  'stopwatch': Watch,
  'alarm-reminder': AlertCircle,
  
  // Technology subcategories
  'data-storage': Database,
  'networking': Network,
  'programming': Code,
  'web-development': Laptop,
  'mobile-apps': Smartphone,
  'security': Lock,
  'cloud-computing': Cloud,
  'ai-ml': Brain,
  'software-tools': Settings,
  'hardware': Cpu,
  
  // Scientific subcategories
  'physics': Atom,
  'chemistry': FlaskConical,
  'biology': Dna,
  'astronomy': Moon,
  'earth-science': Globe,
  'environmental': Droplets,
  'laboratory': Microscope,
  'research': BookOpen,
  'measurements': Ruler,
  'conversions': Repeat,
}

export default function HomePage() {
  const { language } = useSettings()
  const { dict, t } = useTranslation()

  const prefix = language && language !== 'en' ? `/${language}` : ''
  const withLocale = (path: string) => `${prefix}${path}`

  const categoryMeta = useMemo(() => {
    return {
      financial: { name: t('nav.financial'), href: withLocale('/category/financial'), icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
      health: { name: t('nav.health'), href: withLocale('/category/health'), icon: Heart, color: 'from-pink-500 to-rose-500' },
      math: { name: t('nav.math'), href: withLocale('/category/math'), icon: Binary, color: 'from-purple-500 to-indigo-500' },
      construction: { name: t('nav.construction'), href: withLocale('/category/construction'), icon: Wrench, color: 'from-orange-500 to-red-500' },
      business: { name: t('nav.business'), href: withLocale('/category/business'), icon: Briefcase, color: 'from-amber-500 to-yellow-500' },
      everyday: { name: t('nav.everyday'), href: withLocale('/category/everyday'), icon: Home, color: 'from-green-500 to-emerald-500' },
      education: { name: t('nav.education'), href: withLocale('/category/education'), icon: GraduationCap, color: 'from-sky-500 to-blue-500' },
      datetime: { name: t('nav.datetime'), href: withLocale('/category/datetime'), icon: Calendar, color: 'from-teal-500 to-cyan-500' },
      technology: { name: t('nav.technology'), href: withLocale('/category/technology'), icon: Laptop, color: 'from-indigo-500 to-purple-500' },
      scientific: { name: t('nav.science'), href: withLocale('/category/scientific'), icon: FlaskConical, color: 'from-violet-500 to-fuchsia-500' },
    } satisfies Record<string, { name: string; href: string; icon: any; color: string }>
  }, [t, prefix])

  const categories = useMemo((): Array<{ id: string; name: string; href: string; count: number }> => {
    const order = [
      'all',
      'financial',
      'health',
      'math',
      'construction',
      'business',
      'everyday',
      'education',
      'datetime',
      'technology',
      'scientific',
    ]

    const perCategory = order
      .filter((id) => id !== 'all')
      .filter((id) => Boolean((toolsData as any)[id]) && Boolean((categoryMeta as any)[id]))
      .map((id) => {
        const category = (toolsData as any)[id]
        const calculators = Object.values(category.subcategories ?? {}).flatMap((sub: any) =>
          (sub.calculators ?? []).filter((tool: any) => implementedCalculatorIds.has(tool.id))
        )
        return {
          id,
          name: (categoryMeta as any)[id].name as string,
          href: (categoryMeta as any)[id].href as string,
          count: calculators.length,
        }
      })

    const totalCount = perCategory.reduce((sum, c) => sum + (c.count || 0), 0)

    return [
      {
        id: 'all',
        name: t('nav.categories'),
        href: withLocale('/'),
        count: totalCount,
      },
      ...perCategory,
    ]
  }, [categoryMeta])

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all')
  const [activeSubcategoryKey, setActiveSubcategoryKey] = useState<string | null>(null)

  const selectCategory = (id: string) => {
    setActiveCategoryId(id)
    setActiveSubcategoryKey(null)
  }

  const activeCategory = useMemo((): DashboardCategory | null => {
    if (activeCategoryId === 'all') return null
    const category = (toolsData as any)[activeCategoryId]
    if (!category) return null

    const subcategoryList: DashboardSubcategory[] = Object.entries(category.subcategories ?? {})
      .map(([key, sub]: any) => {
        const calculators: DashboardTool[] = (sub.calculators ?? [])
          .filter((tool: any) => implementedCalculatorIds.has(tool.id))
          .map((tool: any) => ({
            id: String(tool.id),
            title: String(tool.title),
            description: String(tool.description),
          }))

        return { key: String(key), name: String(sub.name), calculators }
      })
      .filter((s) => s.calculators.length > 0)

    const name = (categoryMeta as any)[activeCategoryId]?.name ?? activeCategoryId

    return {
      id: activeCategoryId,
      name,
      count: subcategoryList.flatMap((s) => s.calculators).length,
      subcategoryList,
    }
  }, [activeCategoryId, categoryMeta])

  const selectedSubcategory = useMemo(() => {
    if (!activeCategory || !activeSubcategoryKey) return null
    return activeCategory.subcategoryList.find((s) => s.key === activeSubcategoryKey) ?? null
  }, [activeCategory, activeSubcategoryKey])

  return (
    <main className="bg-background">
      {/* Mobile/Tablet: keep old landing experience */}
      <div className="lg:hidden">
        <HeroSection />
        <RecentSection />
        <PopularSection />
        <FeaturesSection />
        <CTASection />
      </div>

      {/* Desktop: professional sidebar + tools view */}
      <div className="hidden lg:block min-h-[calc(100vh-4rem)]">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 rounded-xl border bg-card p-3">
                <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">
                  {t('nav.categories') || 'Categories'}
                </div>
                <div className="space-y-1">
                  {categories.map((c) => {
                    const isActive = c.id === activeCategoryId
                    const disabled = c.id !== 'all' && c.count === 0
                    const categoryIcon = c.id === 'all' ? null : (categoryMeta as any)[c.id]?.icon
                    const categoryColor = c.id === 'all' ? null : (categoryMeta as any)[c.id]?.color
                    const CategoryIcon = categoryIcon || Calculator

                    return (
                      <div key={c.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => !disabled && selectCategory(c.id)}
                          disabled={disabled}
                          className={
                            "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 " +
                            (disabled
                              ? "text-muted-foreground/50 cursor-not-allowed"
                              : isActive
                                ? "bg-gradient-to-r " + (categoryColor || 'from-primary/20 to-primary/10') + " text-foreground shadow-md border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:scale-[1.02] hover:shadow-sm")
                          }
                        >
                          {categoryIcon && (
                            <div className={"shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 " + (isActive ? 'bg-white/90 dark:bg-gray-900/90 shadow-sm' : 'bg-secondary/80 group-hover:scale-110')}>
                              <CategoryIcon className={"h-4 w-4 " + (isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                            </div>
                          )}
                          <span className={"truncate font-medium " + (isActive ? 'font-semibold' : '')}>{c.name}</span>
                          <div className="flex items-center gap-2 ml-auto">
                            <span className={"shrink-0 rounded-full px-2 py-0.5 text-xs font-medium " + (isActive ? 'bg-white/80 dark:bg-gray-900/80 text-primary' : 'bg-secondary text-muted-foreground')}>
                              {c.count}
                            </span>
                            {isActive && c.id !== 'all' && activeCategory?.subcategoryList?.length ? (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : null}
                          </div>
                        </button>

                        {/* Expand subcategories under selected category */}
                        {isActive && c.id !== 'all' && activeCategory?.subcategoryList?.length ? (
                          <div className="ml-2 mr-1 mt-2 pb-2 space-y-1.5 border-l-2 border-primary/30 pl-3">
                            <div className="flex items-center justify-between px-1 py-1">
                              <span className="text-[11px] font-semibold text-primary">Subcategories</span>
                              {activeSubcategoryKey ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveSubcategoryKey(null)}
                                  className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  Clear
                                </button>
                              ) : null}
                            </div>

                            <div className="space-y-1">
                              {activeCategory.subcategoryList.map((sub, idx) => {
                                const isSubActive = sub.key === activeSubcategoryKey
                                const SubIcon = subcategoryIcons[sub.key] || Calculator
                                
                                return (
                                  <button
                                    key={sub.key}
                                    type="button"
                                    onClick={() => setActiveSubcategoryKey(sub.key)}
                                    className={
                                      "group relative w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all duration-200 " +
                                      (isSubActive
                                        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-foreground font-semibold shadow-sm border border-primary/30"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:scale-[1.02] hover:shadow-sm")
                                    }
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={"shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 " + (isSubActive ? 'bg-primary/20 shadow-sm' : 'bg-secondary/60 group-hover:bg-primary/10 group-hover:scale-110')}>
                                        <SubIcon className={"h-3.5 w-3.5 transition-colors " + (isSubActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
                                      </div>
                                      <span className="truncate">{sub.name}</span>
                                    </div>
                                    <span className={"ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors " + (isSubActive ? 'bg-primary/20 text-primary' : 'bg-secondary/80 text-muted-foreground group-hover:bg-primary/10')}>
                                      {sub.calculators.length}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            </aside>

            {/* Main */}
            <section className="min-w-0">
              <div className="rounded-xl border bg-card p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {activeCategoryId === 'all' ? (t('nav.categories') || 'Categories') : (activeCategory?.name ?? (t('nav.allCalculators') || 'Tools'))}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeCategoryId === 'all'
                        ? (t('cta.browseDescription') || 'Browse categories and pick a tool in seconds')
                        : (activeCategory ? `${activeCategory.count} ${t('common.tools') || 'tools'}` : '')}
                    </p>
                  </div>
                  {activeCategoryId !== 'all' && (
                    <Link
                      href={(categories.find((c) => c.id === activeCategoryId)?.href) ?? withLocale('/')}
                      className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {t('common.browseCategory') || 'Browse category'} <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                <div className="mt-6 space-y-8">
                  {activeCategoryId === 'all' && (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                      {categories
                        .filter((c) => c.id !== 'all' && c.count > 0)
                        .map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => selectCategory(c.id)}
                            className="text-left rounded-xl border bg-background p-4 hover:bg-secondary/40 hover:border-primary/30 transition-colors"
                          >
                            <div className="font-semibold truncate">{c.name}</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {c.count} {t('common.tools') || 'Tools'}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {activeCategoryId !== 'all' && activeCategory && !selectedSubcategory && (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      Select a subcategory from the left to see tools.
                    </div>
                  )}

                  {selectedSubcategory && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">{selectedSubcategory.name}</h3>
                        <span className="text-xs text-muted-foreground">{selectedSubcategory.calculators.length}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {selectedSubcategory.calculators.map((tool, idx) => {
                          const meta = localizeToolMeta({
                            dict,
                            toolId: tool.id,
                            fallbackTitle: tool.title,
                            fallbackDescription: tool.description,
                          })

                          const SpecificIcon = toolIcons[tool.id]
                          const CategoryIcon = (categoryMeta as any)[activeCategoryId]?.icon
                          const DisplayIcon = SpecificIcon || CategoryIcon || Calculator

                          return (
                            <Link
                              key={tool.id}
                              href={`${prefix}/calculator/${tool.id}`}
                              className="group relative rounded-xl border border-border bg-gradient-to-br from-background to-secondary/20 p-5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              {/* Shine effect on hover */}
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              <div className="relative flex items-start gap-4">
                                <div className="shrink-0 mt-0.5 h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-primary/20">
                                  <DisplayIcon className="h-6 w-6 text-primary group-hover:text-primary transition-all duration-300" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-base truncate group-hover:text-primary transition-colors duration-200 mb-1.5">
                                    {meta.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors">
                                    {meta.description}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Bottom accent line */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeCategoryId !== 'all' && !activeCategory?.subcategoryList?.length && (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      {t('common.noToolsFound') || 'No tools found in this category.'}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
