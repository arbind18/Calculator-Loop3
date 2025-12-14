export interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  totalCalculations: number
  totalSearches: number
  themeChanges: number
  lastVisit: Date
  favoriteCategory?: string
  mostUsedCalculator?: string
}

export interface UserAnalytics {
  id: string
  userId: string
  totalCalculations: number
  totalSearches: number
  themeChanges: number
  lastVisit: Date
  favoriteCategory?: string
  mostUsedCalculator?: string
  createdAt: Date
  updatedAt: Date
}

export interface Favorite {
  id: string
  userId: string
  calculatorId: string
  createdAt: Date
}
