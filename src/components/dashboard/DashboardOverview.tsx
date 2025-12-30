"use client"

import { useMemo, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calculator, Heart, Clock, TrendingUp, Star, Bookmark, Activity, Trophy, Medal, Award, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useSettings } from '@/components/providers/SettingsProvider'
import { getMergedTranslations } from '@/lib/translations'
import { localizeToolMeta } from '@/lib/toolLocalization'

interface DashboardStats {
  totalCalculations: number
  favoriteCalculators: number
  recentActivity: number
  savedResults: number
}

interface RecentCalculation {
  id: string
  calculatorType: string
  calculatorName: string
  timestamp: Date
  inputs: Record<string, any>
  result: any
}

export function DashboardOverview() {
  const { data: session } = useSession()
  const { language } = useSettings()
  const dict = useMemo(() => getMergedTranslations(language), [language])

  const prefix = language && language !== 'en' ? `/${language}` : ''
  const withLocale = (href: string) => {
    if (!href) return href
    if (!href.startsWith('/')) return href
    if (!prefix) return href

    const [path, hash] = href.split('#')
    const localizedPath = path === '/' ? prefix : `${prefix}${path}`
    return hash ? `${localizedPath}#${hash}` : localizedPath
  }

  const [stats, setStats] = useState<DashboardStats>({
    totalCalculations: 0,
    favoriteCalculators: 0,
    recentActivity: 0,
    savedResults: 0
  })
  const [recentCalculations, setRecentCalculations] = useState<RecentCalculation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [session])

  const loadDashboardData = async () => {
    try {
      let history = []
      let favorites = []
      let saved = []

      if (session?.user) {
        // Fetch from API for logged in users
        const [historyRes, savedRes] = await Promise.all([
          fetch('/api/user/history?limit=50'),
          fetch('/api/user/saved')
        ])

        const historyData = await historyRes.json()
        const savedData = await savedRes.json()

        if (historyData.calculations) {
          history = historyData.calculations.map((item: any) => ({
            ...item,
            timestamp: new Date(item.createdAt)
          }))
        }

        if (savedData.savedResults) {
          saved = savedData.savedResults
        }

        // Favorites are currently local-only, but we could sync them later
        favorites = JSON.parse(localStorage.getItem('favoriteCalculators') || '[]')
      } else {
        // Load from localStorage for guests
        history = JSON.parse(localStorage.getItem('calculationHistory') || '[]')
        favorites = JSON.parse(localStorage.getItem('favoriteCalculators') || '[]')
        saved = JSON.parse(localStorage.getItem('savedCalculations') || '[]')
      }

      setStats({
        totalCalculations: history.length,
        favoriteCalculators: favorites.length,
        recentActivity: history.filter((h: any) => {
          const dayAgo = Date.now() - (24 * 60 * 60 * 1000)
          return new Date(h.timestamp).getTime() > dayAgo
        }).length,
        savedResults: saved.length
      })

      setRecentCalculations(
        history
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
      )

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Calculations
            </CardTitle>
            <Calculator className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCalculations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time calculations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favorites
            </CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.favoriteCalculators}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Saved calculators
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Results
            </CardTitle>
            <Bookmark className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.savedResults}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Bookmarked calculations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-yellow-100 dark:border-yellow-900/30 bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>Unlock badges as you use more tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Newbie Badge */}
              <div className={`flex flex-col items-center p-3 rounded-lg border ${stats.totalCalculations >= 1 ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800 shadow-sm' : 'opacity-50 grayscale border-transparent'}`}>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold">Newbie</span>
                <span className="text-xs text-muted-foreground">1st Calc</span>
              </div>

              {/* Regular Badge */}
              <div className={`flex flex-col items-center p-3 rounded-lg border ${stats.totalCalculations >= 10 ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800 shadow-sm' : 'opacity-50 grayscale border-transparent'}`}>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                  <Medal className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-semibold">Regular</span>
                <span className="text-xs text-muted-foreground">10 Calcs</span>
              </div>

              {/* Pro Badge */}
              <div className={`flex flex-col items-center p-3 rounded-lg border ${stats.totalCalculations >= 50 ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800 shadow-sm' : 'opacity-50 grayscale border-transparent'}`}>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-semibold">Pro</span>
                <span className="text-xs text-muted-foreground">50 Calcs</span>
              </div>

              {/* Saver Badge */}
              <div className={`flex flex-col items-center p-3 rounded-lg border ${stats.savedResults >= 1 ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800 shadow-sm' : 'opacity-50 grayscale border-transparent'}`}>
                <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-2">
                  <Bookmark className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-sm font-semibold">Saver</span>
                <span className="text-xs text-muted-foreground">1 Saved</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts to your most used features</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href={withLocale("/calculator/home-loan-emi")}>
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">New Calculation</p>
                  <p className="text-xs text-muted-foreground">Start a fresh home loan plan</p>
                </div>
              </div>
            </Link>
            <Link href={withLocale("/profile#history")}>
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">Resume Work</p>
                  <p className="text-xs text-muted-foreground">Continue where you left off</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Calculations
          </CardTitle>
          <CardDescription>
            Your latest calculator usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentCalculations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No calculations yet</p>
              <p className="text-sm mt-1">Start using calculators to see your history here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCalculations.map((calc) => (
                <Link
                  key={calc.id}
                  href={{
                    pathname: withLocale(`/calculator/${calc.calculatorType === 'home-loan' ? 'home-loan-emi' : calc.calculatorType}`),
                    query: calc.inputs
                  }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                      <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {localizeToolMeta({
                          dict,
                          toolId: calc.calculatorType === 'home-loan' ? 'home-loan-emi' : calc.calculatorType,
                          fallbackTitle: calc.calculatorName,
                          fallbackDescription: '',
                        }).title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(calc.timestamp).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href={withLocale("/profile#history")}>
          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Full History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View all your calculations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={withLocale("/profile#favorites")}>
          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage favorite calculators
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={withLocale("/profile#saved")}>
          <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-purple-500" />
                Saved Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access saved calculations
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
