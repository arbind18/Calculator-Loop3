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

export interface CalculatorCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  count: number
  gradient: string
  subcategories?: CalculatorSubcategory[]
}

export interface CalculatorSubcategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  count: number
  calculators: Calculator[]
}

export interface CalculatorFormData {
  [key: string]: number | string | boolean
}

export interface CalculatorResult {
  [key: string]: number | string | any
}

export interface CalculationHistory {
  id: string
  calculatorId: string
  calculatorName: string
  inputs: CalculatorFormData
  results: CalculatorResult
  timestamp: Date
}

export interface PopularCalculator {
  id: string
  title: string
  subtitle: string
  icon: string
  rank: string
  gradient: string
}

export interface RecentCalculator {
  id: string
  title: string
  icon: string
  time: string
}
