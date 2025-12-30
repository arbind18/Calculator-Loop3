"use client"

import { useMemo, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Star, Trash2, TrendingUp, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { useSettings } from '@/components/providers/SettingsProvider'
import { getMergedTranslations } from '@/lib/translations'
import { localizeToolMeta } from '@/lib/toolLocalization'

interface FavoriteCalculator {
  id: string
  name: string
  category: string
  description: string
  usageCount: number
  lastUsed?: Date
  addedAt: Date
}

export function FavoritesManager() {
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

  const [favorites, setFavorites] = useState<FavoriteCalculator[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [session])

  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      if (session?.user) {
        const response = await fetch('/api/user/favorites')
        if (response.ok) {
          const data = await response.json()
          // Map API response to FavoriteCalculator interface
          const formattedData = (data.favorites || []).map((item: any) => ({
            id: item.calculatorId, // Using calculatorId as id for frontend consistency
            name: item.calculatorName,
            category: item.category,
            description: item.description,
            usageCount: item.usageCount,
            lastUsed: item.lastUsed,
            addedAt: item.createdAt
          }))
          setFavorites(formattedData)
        }
      } else {
        const stored = localStorage.getItem('favoriteCalculators')
        const data = stored ? JSON.parse(stored) : []
        setFavorites(data.sort((a: FavoriteCalculator, b: FavoriteCalculator) => b.usageCount - a.usageCount))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFavorite = async (id: string) => {
    try {
      if (session?.user) {
        const response = await fetch(`/api/user/favorites?calculatorId=${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) throw new Error('Failed to remove favorite')
        
        const updated = favorites.filter(fav => fav.id !== id)
        setFavorites(updated)
      } else {
        const updated = favorites.filter(fav => fav.id !== id)
        setFavorites(updated)
        localStorage.setItem('favoriteCalculators', JSON.stringify(updated))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const clearAllFavorites = async () => {
    if (confirm('Remove all favorite calculators?')) {
      try {
        if (session?.user) {
          // Since there's no bulk delete endpoint, we'll delete one by one
          // or we could add a bulk delete endpoint. For now, let's just clear local state
          // and warn or implement loop.
          // Better approach: Loop through and delete.
          await Promise.all(favorites.map(fav => 
            fetch(`/api/user/favorites?calculatorId=${fav.id}`, { method: 'DELETE' })
          ))
          setFavorites([])
        } else {
          setFavorites([])
          localStorage.setItem('favoriteCalculators', JSON.stringify([]))
        }
      } catch (error) {
        console.error('Error clearing favorites:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            Favorite Calculators
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {favorites.length} calculators saved
          </p>
        </div>
        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFavorites}>
            Clear All
          </Button>
        )}
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start adding your frequently used calculators to favorites
          </p>
          <Link href={withLocale("/")}>
            <Button>
              Browse Calculators
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <Card
              key={favorite.id}
              className="group relative overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <Link href={withLocale(`/calculator/${favorite.id}`)}>
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                      {favorite.category}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 rounded-xl w-fit mb-4">
                    <Calculator className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {localizeToolMeta({
                      dict,
                      toolId: favorite.id,
                      fallbackTitle: favorite.name,
                      fallbackDescription: favorite.description,
                    }).title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {localizeToolMeta({
                      dict,
                      toolId: favorite.id,
                      fallbackTitle: favorite.name,
                      fallbackDescription: favorite.description,
                    }).description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Used {favorite.usageCount} times</span>
                    </div>
                    {favorite.lastUsed && (
                      <span>
                        {new Date(favorite.lastUsed).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Remove Button */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    removeFavorite(favorite.id)
                  }}
                  className="bg-white dark:bg-gray-800"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>

              {/* Favorite Star */}
              <div className="absolute top-3 left-3">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
