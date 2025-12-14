export interface AnalyticsData {
  totalVisits: number
  totalCalculations: number
  totalSearches: number
  themeChanges: number
  sessionStart: number
  lastVisit: number
  calculatorUsage: Record<string, CalculatorUsage>
  categoryViews: Record<string, number>
  searchQueries: SearchQuery[]
  failedSearches: FailedSearch[]
}

export interface CalculatorUsage {
  name: string
  opens: number
  calculations: number
  lastUsed: number | null
}

export interface SearchQuery {
  query: string
  results: number
  timestamp: number
}

export interface FailedSearch {
  query: string
  timestamp: number
}

export interface AnalyticsSummary {
  totalVisits: number
  totalCalculations: number
  themeChanges: number
  searchesPerformed: number
  failedSearches: number
  sessionDuration: number
  mostUsedCategory: string
  popularCalculators: PopularCalculatorAnalytics[]
}

export interface PopularCalculatorAnalytics {
  id: string
  name: string
  opens: number
  calculations: number
}

export interface TrackingEvent {
  event: 'calculator_open' | 'calculator_calculate' | 'category_view' | 'search' | 'theme_change'
  data: Record<string, any>
  timestamp: number
}
