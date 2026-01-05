"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { 
  Calculator, ChevronRight, DollarSign, Heart, Binary, Wrench, Briefcase, Home, GraduationCap, Calendar, Laptop, FlaskConical, ChevronDown,
  Scale, Activity, Zap, Ruler, Clock, Globe, Percent, TrendingUp, Landmark, PiggyBank, CreditCard, Building, Truck, BookOpen, 
  Coins, Banknote, Wallet, Receipt, BarChart3, PieChart, LineChart, ArrowRightLeft, Timer, Watch, Hourglass, Sun, Moon, 
  Cloud, Wind, Thermometer, Droplets, Hammer, HardHat, PaintBucket, Smartphone, Wifi, Signal, 
  Battery, Cpu, Database, Server, Code, Terminal, FileCode, FileJson, FileType, FileText, Image as ImageIcon, Music, Video, 
  Gamepad, Joystick, Dna, Microscope, Atom, Syringe, Pill, Stethoscope, Brain, Baby, User, Users, Key, QrCode, Network, Box,
  Apple, Dumbbell, Bed, Utensils, Goal, ShieldAlert, Package, Award, Sparkles, TrendingDown, Target, Shield, Lock,
  Umbrella, CircleDollarSign, Building2, Briefcase as BriefcaseIcon, MapPin, GraduationCap as EducationIcon, Languages,
  Plane, Ship, Store, Factory, BarChart, BookMarked, Layers, Settings, FileSpreadsheet, Repeat, AlertCircle, Info, Star
} from 'lucide-react'
import { BlogPost, formatDate } from '@/lib/blogData'
import { toolsData } from '@/lib/toolsData'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BlogDashboardProps {
  posts: BlogPost[]
  language: string
  dict: any
}

type DashboardPost = BlogPost & {
  toolId?: string
  subcategoryKey?: string
}

type DashboardSubcategory = {
  key: string
  name: string
  count: number
}

const FINANCIAL_SUBCATEGORY_ORDER: string[] = [
  'loan',
  'investment',
  'tax',
  'currency',
  'time-based-finance',
  'banking',
  'insurance',
  'real-estate',
  'credit-card',
  'retirement',
  'business',
  'misc',
]

const POPULAR_FINANCIAL_POSTS_BY_TOOL_ID: string[] = [
  'sip-calculator',
  'gst-calculator',
  'income-tax-calculator',
  'currency-converter',
  'personal-loan-emi',
  'savings-account-interest',
  'life-insurance-calculator',
  'rent-vs-buy',
  'credit-card-payoff',
  'fire-calculator',
  'profit-margin',
  'net-worth',
]

export function BlogDashboard({ posts, language, dict }: BlogDashboardProps) {
  const prefix = language && language !== 'en' ? `/${language}` : ''
  const withLocale = (path: string) => `${prefix}${path}`

  // Desktop dashboard should scroll inside panels (not the whole page).
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

  const categoryMeta = useMemo(() => {
    return {
      financial: { name: dict.nav?.financial || 'Financial', icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
      math: { name: dict.nav?.math || 'Math', icon: Binary, color: 'from-purple-500 to-indigo-500' },
      construction: { name: dict.nav?.construction || 'Construction', icon: Wrench, color: 'from-orange-500 to-red-500' },
      business: { name: dict.nav?.business || 'Business', icon: Briefcase, color: 'from-amber-500 to-yellow-500' },
      everyday: { name: dict.nav?.everyday || 'Everyday', icon: Home, color: 'from-green-500 to-emerald-500' },
      education: { name: dict.nav?.education || 'Education', icon: GraduationCap, color: 'from-sky-500 to-blue-500' },
      datetime: { name: dict.nav?.datetime || 'Date & Time', icon: Calendar, color: 'from-teal-500 to-cyan-500' },
      technology: { name: dict.nav?.technology || 'Technology', icon: Laptop, color: 'from-indigo-500 to-purple-500' },
      scientific: { name: dict.nav?.science || 'Scientific', icon: FlaskConical, color: 'from-violet-500 to-fuchsia-500' },
      investments: { name: 'Investments', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
      loans: { name: 'Loans', icon: Banknote, color: 'from-orange-500 to-red-500' },
      health: { name: dict.nav?.health || 'Health', icon: Heart, color: 'from-pink-500 to-rose-500' },
      'real-estate': { name: 'Real Estate', icon: Building, color: 'from-amber-500 to-yellow-500' },
      tax: { name: 'Tax', icon: Receipt, color: 'from-purple-500 to-indigo-500' },
      general: { name: 'General', icon: BookOpen, color: 'from-slate-500 to-gray-500' },
    } as Record<string, { name: string; icon: any; color: string }>
  }, [dict])

  const categories = useMemo(() => {
    const allCategories = Array.from(new Set(posts.map((p) => p.category)))

    const perCategory = allCategories
      .map((cat) => {
        const count = posts.filter((p) => p.category === cat).length
        const meta = categoryMeta[cat] || { name: cat, icon: BookOpen, color: 'from-primary/20 to-primary/10' }

        return {
          id: cat,
          name: meta.name,
          icon: meta.icon,
          color: meta.color,
          count,
        }
      })
      .sort((a, b) => b.count - a.count)

    return [
      {
        id: 'all',
        name: dict.nav?.categories || 'Categories',
        icon: Star,
        color: 'from-primary to-primary',
        count: posts.length,
      },
      ...perCategory,
    ]
  }, [posts, categoryMeta, dict])

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all')
  const [activeSubcategoryKey, setActiveSubcategoryKey] = useState<string | null>(null)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

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

  const activeCategory = categories.find((c) => c.id === activeCategoryId)

  const activeSubcategories = useMemo((): DashboardSubcategory[] => {
    if (activeCategoryId === 'all') return []

    // Prefer the same subcategory list as the tools dashboard for the Financial category.
    if (activeCategoryId === 'financial') {
      const category = (toolsData as any)?.financial
      const raw = category?.subcategories ?? {}
      const byKey = new Map<string, DashboardSubcategory>()

      for (const key of Object.keys(raw)) {
        const name = String(raw[key]?.name ?? key)
        const count = posts.filter(
          (p) => p.category === 'financial' && (p as DashboardPost).subcategoryKey === key
        ).length
        byKey.set(key, { key, name, count })
      }

      const orderedKeys = FINANCIAL_SUBCATEGORY_ORDER.filter((k) => byKey.has(k))
      const remaining = Array.from(byKey.keys())
        .filter((k) => !orderedKeys.includes(k))
        .sort((a, b) => a.localeCompare(b))

      return [...orderedKeys, ...remaining].map((k) => byKey.get(k) as DashboardSubcategory)
    }

    // Fallback: derive subcategories from blog data.
    const map = new Map<string, DashboardSubcategory>()
    for (const p of posts) {
      if (p.category !== activeCategoryId) continue
      const key = (p as DashboardPost).subcategoryKey
      if (!key) continue
      const existing = map.get(key)
      map.set(key, {
        key,
        name: key,
        count: (existing?.count ?? 0) + 1,
      })
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [activeCategoryId, posts])

  const selectedSubcategory = useMemo(() => {
    if (!activeSubcategoryKey) return null
    return activeSubcategories.find((s) => s.key === activeSubcategoryKey) ?? null
  }, [activeSubcategories, activeSubcategoryKey])

  const categoryPopularPosts = useMemo((): DashboardPost[] => {
    if (activeCategoryId === 'all') return []
    const inCategory = posts.filter((p) => p.category === activeCategoryId) as DashboardPost[]

    // For Financial, order by toolId priority where possible.
    if (activeCategoryId === 'financial') {
      const priorityIndex = new Map<string, number>()
      for (let i = 0; i < POPULAR_FINANCIAL_POSTS_BY_TOOL_ID.length; i++) {
        priorityIndex.set(POPULAR_FINANCIAL_POSTS_BY_TOOL_ID[i], i)
      }
      const ordered = [...inCategory].sort((a, b) => {
        const ai = a.toolId && priorityIndex.has(a.toolId) ? (priorityIndex.get(a.toolId) as number) : Number.POSITIVE_INFINITY
        const bi = b.toolId && priorityIndex.has(b.toolId) ? (priorityIndex.get(b.toolId) as number) : Number.POSITIVE_INFINITY
        if (ai !== bi) return ai - bi
        return a.title.localeCompare(b.title)
      })
      return ordered.slice(0, 12)
    }

    return [...inCategory].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 12)
  }, [activeCategoryId, posts])

  const filteredPosts = useMemo((): DashboardPost[] => {
    if (activeCategoryId === 'all') return posts as DashboardPost[]
    if (!activeSubcategoryKey) return posts.filter((p) => p.category === activeCategoryId) as DashboardPost[]
    return posts.filter((p) => p.category === activeCategoryId && (p as DashboardPost).subcategoryKey === activeSubcategoryKey) as DashboardPost[]
  }, [posts, activeCategoryId, activeSubcategoryKey])

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile View - Simple List */}
      <div className="lg:hidden container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">{dict.blog?.title || 'Blog'}</h1>
          <p className="text-muted-foreground">{dict.blog?.subtitle || 'Expert guides and articles'}</p>
        </div>
        
        <div className="grid gap-6">
          {filteredPosts.map(post => (
            <Link key={post.slug} href={withLocale(`/blog/${post.slug}`)}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop View - Dashboard Layout */}
      <div className="hidden lg:block h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-full w-full box-border px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
          <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="h-full rounded-xl border bg-card overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur px-3 py-3">
                    <div className="px-1 text-xs font-semibold text-muted-foreground">
                      {dict.blog?.categories || 'Categories'}
                    </div>
                  </div>

                  <div className="p-3 pr-2 space-y-1">
                    {categories.map((c, idx) => {
                      const isActive = c.id === activeCategoryId
                      const isExpanded = c.id !== 'all' && expandedCategoryId === c.id
                      const disabled = c.id !== 'all' && c.count === 0
                      const CategoryIcon = c.icon || BookOpen
                      
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
                              ? "bg-gradient-to-r " + (c.color || 'from-primary/20 to-primary/10') + " text-foreground shadow-lg shadow-primary/20 border-2 border-primary/30 scale-[1.02]"
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
                          
                          <div className={
                            "relative shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 " + 
                            (isActive 
                              ? `bg-gradient-to-br ${c.color} shadow-lg shadow-primary/30` 
                              : 'bg-secondary/80 group-hover:bg-gradient-to-br group-hover:' + (c.color || 'from-primary/20 to-primary/10') + ' group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md')
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
                            {c.id === 'financial' && isExpanded && activeCategoryId === c.id && activeSubcategories.length ? (
                              <ChevronDown className="h-4 w-4 text-primary" />
                            ) : null}
                          </div>
                          
                          {/* Bottom accent line for active */}
                          {isActive && (
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.color || 'from-primary to-primary'}`} />
                          )}
                        </button>

                        {/* Expand subcategories under selected category */}
                        {c.id === 'financial' && isExpanded && activeCategoryId === c.id && activeSubcategories.length ? (
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
                              {activeSubcategories.map((sub, sidx) => {
                                const isSubActive = sub.key === activeSubcategoryKey
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
                                    style={{ animationDelay: `${sidx * 30}ms` }}
                                  >
                                    <span className="truncate">{sub.name}</span>
                                    <span
                                      className={
                                        "ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors " +
                                        (isSubActive
                                          ? 'bg-primary/20 text-primary'
                                          : 'bg-secondary/80 text-muted-foreground group-hover:bg-primary/10')
                                      }
                                    >
                                      {sub.count}
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

            {/* Main Content */}
            <section className="min-w-0 h-full overflow-hidden">
              <div className="h-full overflow-y-auto rounded-xl border bg-card">
                {/* Sticky header */}
                <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur px-4 sm:px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {activeCategory?.name || 'Blog'}
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activeCategory?.count || 0} {dict.blog?.articles || 'articles'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-6">
                  {activeCategoryId === 'all' && (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                      {categories
                        .filter((c) => c.id !== 'all' && c.count > 0)
                        .map((c, idx) => {
                          const CategoryIcon = c.icon || BookOpen
                          const categoryColor = c.color || 'from-primary/20 to-primary/10'

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
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                                      {c.count} {dict.blog?.articles || 'articles'}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                                  </div>
                                </div>
                              </div>

                              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                            </button>
                          )
                        })}
                    </div>
                  )}

                  {activeCategoryId !== 'all' && activeCategory && !selectedSubcategory && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">Popular posts</h3>
                        <span className="text-xs text-muted-foreground">{categoryPopularPosts.length}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {categoryPopularPosts.map((post, idx) => {
                          const CategoryIcon = categoryMeta[post.category]?.icon || BookOpen

                          return (
                            <Link
                              key={post.slug}
                              href={withLocale(`/blog/${post.slug}`)}
                              className="group relative rounded-xl border border-border bg-gradient-to-br from-background to-secondary/20 p-5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                              <div className="relative flex items-start gap-4 mb-3">
                                <div className="shrink-0 mt-0.5 h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-primary/20">
                                  <CategoryIcon className="h-6 w-6 text-primary group-hover:text-primary transition-all duration-300" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                      {post.category}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">{post.readingTime} min read</span>
                                  </div>
                                  <div className="font-bold text-base leading-tight group-hover:text-primary transition-colors duration-200">
                                    {post.title}
                                  </div>
                                </div>
                              </div>

                              <div className="relative text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-foreground/80 transition-colors flex-1">
                                {post.description}
                              </div>

                              <div className="relative mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3" />
                                  <span>{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(post.publishedAt)}</span>
                                </div>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </Link>
                          )
                        })}
                      </div>

                      {activeSubcategories.length ? (
                        <div className="pt-2 text-center text-xs text-muted-foreground">
                          Select a subcategory from the left to see all posts.
                        </div>
                      ) : null}
                    </div>
                  )}

                  {selectedSubcategory && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">{selectedSubcategory.name}</h3>
                        <span className="text-xs text-muted-foreground">{selectedSubcategory.count}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredPosts.map((post, idx) => {
                          const CategoryIcon = categoryMeta[post.category]?.icon || BookOpen
                          return (
                            <Link
                              key={post.slug}
                              href={withLocale(`/blog/${post.slug}`)}
                              className="group relative rounded-xl border border-border bg-gradient-to-br from-background to-secondary/20 p-5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                              <div className="relative flex items-start gap-4 mb-3">
                                <div className="shrink-0 mt-0.5 h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-primary/20">
                                  <CategoryIcon className="h-6 w-6 text-primary group-hover:text-primary transition-all duration-300" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                      {post.category}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">{post.readingTime} min read</span>
                                  </div>
                                  <div className="font-bold text-base leading-tight group-hover:text-primary transition-colors duration-200">
                                    {post.title}
                                  </div>
                                </div>
                              </div>

                              <div className="relative text-sm text-muted-foreground line-clamp-3 leading-relaxed group-hover:text-foreground/80 transition-colors flex-1">
                                {post.description}
                              </div>

                              <div className="relative mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3" />
                                  <span>{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(post.publishedAt)}</span>
                                </div>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeCategoryId !== 'all' && selectedSubcategory && filteredPosts.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground">No posts found in this subcategory.</div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
