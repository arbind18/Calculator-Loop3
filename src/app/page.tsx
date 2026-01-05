"use client"

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { 
  Calculator, ChevronRight, DollarSign, Heart, Binary, Wrench, Briefcase, Home, GraduationCap, Calendar, Laptop, FlaskConical, ChevronDown,
  Scale, Activity, Zap, Ruler, Clock, Globe, Percent, TrendingUp, Landmark, PiggyBank, CreditCard, Building, Truck, BookOpen, 
  Coins, Banknote, Wallet, Receipt, BarChart3, PieChart, LineChart, ArrowRightLeft, Timer, Watch, Hourglass, Sun, Moon, 
  Cloud, Wind, Thermometer, Droplets, Hammer, HardHat, PaintBucket, Smartphone, Wifi, Signal, 
  Battery, Cpu, Database, Server, Code, Terminal, FileCode, FileJson, FileType, FileText, Image as ImageIcon, Music, Video, 
  Gamepad, Joystick, Dna, Microscope, Atom, Syringe, Pill, Stethoscope, Brain, Baby, User, Users, Key, QrCode, Network, Box,
  Apple, Dumbbell, Bed, Utensils, Goal, ShieldAlert, Package, Award, Sparkles, TrendingDown, Target, Shield, Lock,
  Umbrella, CircleDollarSign, Building2, Briefcase as BriefcaseIcon, MapPin, GraduationCap as EducationIcon, Languages,
  Plane, Ship, Store, Factory, BarChart, BookMarked, Layers, Settings, FileSpreadsheet, Repeat, AlertCircle, Info, Search, X
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

const POPULAR_TOOL_PRIORITY: string[] = [
  // Financial (commonly used)
  'emi-calculator',
  'home-loan-calculator',
  'personal-loan-calculator',
  'sip-calculator',
  'gst-calculator',
  'income-tax-calculator',
  'tax-calculator',
  'currency-converter',
  'salary-calculator',
  'cagr-calculator',
  'inflation-calculator',
  'discount-calculator',

  // Health
  'bmi-calculator',
  'bmr-calculator',
  'body-fat-calculator',
  'calorie-calculator',
  'ideal-weight-calculator',
  'water-intake-calculator',
  'heart-rate-calculator',
  'period-calculator',
  'ovulation-calculator',
  'pregnancy-calculator',

  // Math
  'percentage-calculator',
  'fraction-calculator',
  'scientific-calculator',
  'statistics-calculator',
  'random-number-generator',
  'matrix-calculator',

  // Date/Everyday
  'age-calculator',
  'date-calculator',
  'time-calculator',
]

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

  const tr = (key: string, fallback: string) => {
    const value = t(key)
    if (!value || value === key) return fallback
    return value
  }

  // Desktop dashboard should scroll inside panels (not the whole page).
  // This prevents the footer/page scroll from hijacking wheel/trackpad scrolling.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 1024px)')

    const apply = () => {
      if (mq.matches) document.body.classList.add('home-dashboard-lock')
      else document.body.classList.remove('home-dashboard-lock')
    }

    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      document.body.classList.remove('home-dashboard-lock')
    }
  }, [])

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
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchScope, setSearchScope] = useState<'category' | 'all'>('all')
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const searchWrapRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const selectCategory = (id: string) => {
    setActiveCategoryId(id)
    if (id === 'all') {
      setActiveSubcategoryKey(null)
      setExpandedCategoryId(null)
      return
    }
    setActiveSubcategoryKey(null)
    setExpandedCategoryId(id)
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

  useEffect(() => {
    if (activeCategoryId === 'all') setSearchScope('all')
    else setSearchScope('category')
  }, [activeCategoryId])

  useEffect(() => {
    if (!searchOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    const onMouseDown = (e: MouseEvent) => {
      const el = searchWrapRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setSearchOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 50)
    return () => window.clearTimeout(id)
  }, [searchOpen])

  const toolSearchIndex = useMemo(() => {
    type Item = {
      id: string
      title: string
      description: string
      categoryId: string
      categoryName: string
      subcategoryKey: string
      subcategoryName: string
    }

    const items: Item[] = []
    const order = [
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

    for (const categoryId of order) {
      const category = (toolsData as any)[categoryId]
      if (!category) continue
      const categoryName = (categoryMeta as any)[categoryId]?.name ?? categoryId

      for (const [subcategoryKey, sub] of Object.entries(category.subcategories ?? {}) as any) {
        const subcategoryName = String(sub?.name ?? subcategoryKey)
        const calculators = (sub?.calculators ?? []) as any[]
        for (const tool of calculators) {
          if (!tool?.id) continue
          if (!implementedCalculatorIds.has(tool.id)) continue

          const meta = localizeToolMeta({
            dict,
            toolId: String(tool.id),
            fallbackTitle: String(tool.title ?? tool.id),
            fallbackDescription: String(tool.description ?? ''),
          })

          items.push({
            id: String(tool.id),
            title: meta.title,
            description: meta.description || '',
            categoryId: String(categoryId),
            categoryName: String(categoryName),
            subcategoryKey: String(subcategoryKey),
            subcategoryName: String(subcategoryName),
          })
        }
      }
    }

    return items
  }, [categoryMeta, dict])

  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    const q = normalize(query)
    if (!q) return []

    const scope = activeCategoryId === 'all' ? 'all' : searchScope

    const score = (item: any) => {
      const title = normalize(item.title)
      const id = normalize(item.id)
      const sub = normalize(item.subcategoryName)
      const cat = normalize(item.categoryName)

      if (title.startsWith(q)) return 0
      if (id.startsWith(q)) return 1
      if (title.includes(` ${q}`)) return 2
      if (title.includes(q)) return 3
      if (id.includes(q)) return 4
      if (sub.includes(q)) return 5
      if (cat.includes(q)) return 6
      return 999
    }

    const filtered = toolSearchIndex
      .filter((item) => (scope === 'all' ? true : item.categoryId === activeCategoryId))
      .map((item) => ({ item, s: score(item) }))
      .filter(({ s }) => s < 999)
      .sort((a, b) => (a.s !== b.s ? a.s - b.s : a.item.title.localeCompare(b.item.title)))
      .slice(0, 10)
      .map(({ item }) => item)

    return filtered
  }, [activeCategoryId, searchQuery, searchScope, toolSearchIndex])

  useEffect(() => {
    setActiveSuggestionIndex(0)
  }, [searchQuery, searchScope, activeCategoryId])

  const categoryPopularTools = useMemo((): DashboardTool[] => {
    if (!activeCategory) return []

    const allTools = activeCategory.subcategoryList.flatMap((s) => s.calculators)
    const uniqueById = new Map<string, DashboardTool>()
    for (const tool of allTools) {
      if (!uniqueById.has(tool.id)) uniqueById.set(tool.id, tool)
    }

    const priorityIndex = new Map<string, number>()
    for (let i = 0; i < POPULAR_TOOL_PRIORITY.length; i++) priorityIndex.set(POPULAR_TOOL_PRIORITY[i], i)

    const ordered = Array.from(uniqueById.values()).sort((a, b) => {
      const ai = priorityIndex.has(a.id) ? (priorityIndex.get(a.id) as number) : Number.POSITIVE_INFINITY
      const bi = priorityIndex.has(b.id) ? (priorityIndex.get(b.id) as number) : Number.POSITIVE_INFINITY
      if (ai !== bi) return ai - bi
      return a.title.localeCompare(b.title)
    })

    return ordered.slice(0, 12)
  }, [activeCategory])

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
      <div className="hidden lg:block h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-full w-full box-border px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
          <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="h-full rounded-xl border bg-card overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur px-3 py-3">
                    <div className="px-1 text-xs font-semibold text-muted-foreground">
                      {t('nav.categories') || 'Categories'}
                    </div>
                  </div>

                  <div className="p-3 pr-2 space-y-1">
                    {categories.map((c, idx) => {
                    const isActive = c.id === activeCategoryId
                    const isExpanded = c.id !== 'all' && expandedCategoryId === c.id
                    const disabled = c.id !== 'all' && c.count === 0
                    const categoryIcon = c.id === 'all' ? null : (categoryMeta as any)[c.id]?.icon
                    const categoryColor = c.id === 'all' ? null : (categoryMeta as any)[c.id]?.color
                    const CategoryIcon = categoryIcon || Calculator

                    return (
                      <div key={c.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (disabled) return
                            if (c.id === 'all') {
                              selectCategory('all')
                              return
                            }
                            if (c.id === activeCategoryId) {
                              setExpandedCategoryId((prev) => (prev === c.id ? null : c.id))
                              return
                            }
                            selectCategory(c.id)
                          }}
                          disabled={disabled}
                          className={
                            "group relative w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 overflow-hidden " +
                            (disabled
                              ? "text-muted-foreground/50 cursor-not-allowed"
                              : isActive
                                ? "bg-gradient-to-r " + (categoryColor || 'from-primary/20 to-primary/10') + " text-foreground shadow-lg shadow-primary/20 border-2 border-primary/30 scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-secondary/60 hover:to-secondary/40 hover:scale-[1.03] hover:shadow-md hover:border hover:border-primary/20")
                          }
                          style={{
                            animationDelay: `${idx * 50}ms`,
                            animation: 'fadeInLeft 0.4s ease-out forwards'
                          }}
                        >
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          
                          {/* Animated glow effect for active state */}
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
                          )}
                          
                          {categoryIcon && (
                            <div className={
                              "relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 " + 
                              (isActive 
                                ? `bg-gradient-to-br ${categoryColor} shadow-lg shadow-primary/30` 
                                : 'bg-secondary/80 group-hover:bg-gradient-to-br group-hover:' + (categoryColor || 'from-primary/20 to-primary/10') + ' group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md')
                            }>
                              <CategoryIcon className={
                                "h-5 w-5 transition-all duration-300 " + 
                                (isActive ? 'text-white drop-shadow-sm' : 'text-muted-foreground group-hover:text-primary group-hover:scale-110')
                              } />
                              
                              {/* Icon glow on active */}
                              {isActive && (
                                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm" />
                              )}
                            </div>
                          )}
                          
                          <span className={
                            "relative truncate font-medium transition-all duration-200 " + 
                            (isActive ? 'font-bold text-base' : 'group-hover:font-semibold')
                          }>
                            {c.name}
                          </span>
                          
                          <div className="relative flex items-center gap-2 ml-auto">
                            <span className={
                              "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-300 " + 
                              (isActive 
                                ? 'bg-white/90 dark:bg-gray-900/90 text-primary shadow-sm scale-110' 
                                : 'bg-secondary/60 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-105')
                            }>
                              {c.count}
                            </span>
                            {isExpanded && activeCategoryId === c.id && activeCategory?.subcategoryList?.length ? (
                              <ChevronDown className="h-4 w-4 text-primary animate-bounce" />
                            ) : null}
                          </div>
                          
                          {/* Bottom accent line for active */}
                          {isActive && (
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${categoryColor || 'from-primary to-primary'}`} />
                          )}
                        </button>

                        {/* Expand subcategories under selected category */}
                        {isExpanded && activeCategoryId === c.id && activeCategory?.subcategoryList?.length ? (
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
              </div>
            </aside>

            {/* Main */}
            <section className="min-w-0 h-full overflow-hidden">
              <div className="h-full overflow-y-auto rounded-xl border bg-card">
                {/* Sticky header (right panel only) */}
                <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur px-4 sm:px-6 py-4">
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
                    <div className="flex items-center gap-2">
                      {/* Smart search */}
                      <div ref={searchWrapRef} className="relative hidden sm:block">
                        <div
                          className={
                            "flex items-center rounded-xl border bg-background/40 transition-all duration-300 overflow-hidden " +
                            (searchOpen ? "w-[360px] border-primary/40 shadow-lg shadow-primary/10" : "w-11 border-border")
                          }
                        >
                          <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            className="shrink-0 h-11 w-11 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Search tools"
                          >
                            <Search className="h-5 w-5" />
                          </button>

                          {searchOpen ? (
                            <>
                              <input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (!searchSuggestions.length) return
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    setActiveSuggestionIndex((i) => Math.min(i + 1, searchSuggestions.length - 1))
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault()
                                    setActiveSuggestionIndex((i) => Math.max(i - 1, 0))
                                  } else if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const item = searchSuggestions[activeSuggestionIndex]
                                    if (!item) return
                                    window.location.href = `${prefix}/calculator/${item.id}`
                                  } else if (e.key === 'Escape') {
                                    setSearchOpen(false)
                                  }
                                }}
                                placeholder={tr('common.searchTools', 'Search tools…')}
                                className="h-11 flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
                              />

                              {activeCategoryId !== 'all' ? (
                                <button
                                  type="button"
                                  onClick={() => setSearchScope((s) => (s === 'category' ? 'all' : 'category'))}
                                  className="mr-1 shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                                  aria-label="Toggle search scope"
                                >
                                  {searchScope === 'category' ? (activeCategory?.name ?? 'This category') : 'All'}
                                </button>
                              ) : null}

                              {searchQuery ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery('')
                                    searchInputRef.current?.focus()
                                  }}
                                  className="shrink-0 h-11 w-10 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Clear search"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setSearchOpen(false)}
                                  className="shrink-0 h-11 w-10 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Close search"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          ) : null}
                        </div>

                        {searchOpen ? (
                          <div
                            className="absolute right-0 mt-2 w-[420px] max-w-[90vw] rounded-xl border bg-card shadow-xl shadow-black/10 overflow-hidden"
                            style={{ animation: 'fadeInUp 0.25s ease-out forwards' }}
                          >
                            {searchQuery.trim() ? (
                              searchSuggestions.length ? (
                                <div className="max-h-[360px] overflow-y-auto">
                                  {searchSuggestions.map((item, idx) => {
                                    const isActive = idx === activeSuggestionIndex
                                    const SpecificIcon = toolIcons[item.id]
                                    const CategoryIcon = (categoryMeta as any)[item.categoryId]?.icon
                                    const DisplayIcon = SpecificIcon || CategoryIcon || Calculator
                                    return (
                                      <Link
                                        key={item.id}
                                        href={`${prefix}/calculator/${item.id}`}
                                        onClick={() => setSearchOpen(false)}
                                        className={
                                          "flex items-start gap-3 px-4 py-3 text-sm transition-colors " +
                                          (isActive
                                            ? 'bg-primary/10 text-foreground'
                                            : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground')
                                        }
                                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                                      >
                                        <div className="mt-0.5 shrink-0 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <DisplayIcon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="font-semibold truncate">{item.title}</div>
                                          {item.description ? (
                                            <div className="text-xs text-muted-foreground line-clamp-1">
                                              {item.description}
                                            </div>
                                          ) : null}
                                          <div className="text-xs text-muted-foreground truncate">
                                            {item.categoryName} • {item.subcategoryName}
                                          </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
                                      </Link>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className="px-4 py-4 text-sm text-muted-foreground">
                                  {tr('common.noResults', 'No matching tools found.')}
                                </div>
                              )
                            ) : (
                              <div className="px-4 py-4 text-sm text-muted-foreground">
                                {tr('common.searchHint', 'Type to search tools with smart suggestions.')}
                              </div>
                            )}

                            {activeCategoryId !== 'all' ? (
                              <div className="border-t px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
                                <span>
                                  {searchScope === 'category'
                                    ? `Searching in ${activeCategory?.name ?? 'this category'}`
                                    : 'Searching in all categories'}
                                </span>
                                <button
                                  type="button"
                                  className="font-semibold text-primary hover:underline"
                                  onClick={() => setSearchScope((s) => (s === 'category' ? 'all' : 'category'))}
                                >
                                  {searchScope === 'category' ? 'Search all' : 'Search category'}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
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
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-6 space-y-8">
                  {activeCategoryId === 'all' && (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                      {categories
                        .filter((c) => c.id !== 'all' && c.count > 0)
                        .map((c, idx) => {
                          const CategoryIcon = (categoryMeta as any)[c.id]?.icon || Calculator
                          const categoryColor = (categoryMeta as any)[c.id]?.color || 'from-primary/20 to-primary/10'
                          
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => selectCategory(c.id)}
                              className="group relative text-left rounded-xl border border-border bg-gradient-to-br from-background to-secondary/30 p-6 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                              style={{ 
                                animationDelay: `${idx * 60}ms`,
                                animation: 'fadeInUp 0.5s ease-out forwards',
                              }}
                            >
                              {/* Shine effect on hover */}
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Animated background gradient */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                              
                              <div className="relative flex items-start gap-4">
                                <div className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/30`}>
                                  <CategoryIcon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-lg truncate group-hover:text-primary transition-colors duration-200">
                                    {c.name}
                                  </div>
                                  <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                      {c.count} {t('common.tools') || 'Tools'}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                  </div>
                                </div>
                              </div>
                              
                              {/* Bottom accent line */}
                              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                            </button>
                          )
                        })}
                    </div>
                  )}

                  {activeCategoryId !== 'all' && activeCategory && !selectedSubcategory && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          {tr('common.popularTools', 'Popular tools')}
                        </h3>
                        <span className="text-xs text-muted-foreground">{categoryPopularTools.length}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {categoryPopularTools.map((tool, idx) => {
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

                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </Link>
                          )
                        })}
                      </div>

                      <div className="pt-2 text-center text-xs text-muted-foreground">
                        Select a subcategory from the left to see all tools.
                      </div>
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
