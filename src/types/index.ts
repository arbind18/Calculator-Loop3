export interface Calculator {
  id: string
  slug: string
  title: string
  description: string
  category: string
  subcategory?: string
  icon: string
  gradient: string
  popular: boolean
  featured: boolean
  views: number
  implemented: boolean
  url?: string
}

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AnalyticsData {
  totalVisits: number
  totalCalculations: number
  totalSearches: number
  themeChanges: number
  sessionStart: number
  lastVisit: number
}

export * from './calculator'
export * from './user'
export * from './analytics'
