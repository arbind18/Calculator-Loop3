import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calculatorloop.com'
  const currentDate = new Date()

  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Calculator categories - high priority
  const categories = [
    'financial',
    'health',
    'math',
    'date-time',
    'education',
    'technology',
    'science',
    'construction',
    'business',
    'everyday-life',
    'loan',
    'investment',
    'tax',
    'insurance',
    'real-estate',
    'retirement',
    'banking',
    'currency',
    'credit-card',
  ]

  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Popular calculators - very high priority
  const popularCalculators = [
    // Financial
    { id: 'emi-calculator', category: 'loan', priority: 1.0 },
    { id: 'home-loan-emi', category: 'loan', priority: 0.95 },
    { id: 'personal-loan-emi', category: 'loan', priority: 0.95 },
    { id: 'car-loan-emi', category: 'loan', priority: 0.9 },
    
    // Investment
    { id: 'sip-calculator', category: 'investment', priority: 1.0 },
    { id: 'lumpsum-calculator', category: 'investment', priority: 0.9 },
    { id: 'mutual-fund-returns', category: 'investment', priority: 0.9 },
    { id: 'ppf-calculator', category: 'investment', priority: 0.85 },
    { id: 'cagr-calculator', category: 'investment', priority: 0.85 },
    
    // Tax
    { id: 'income-tax-calculator', category: 'tax', priority: 1.0 },
    { id: 'gst-calculator', category: 'tax', priority: 0.95 },
    { id: 'hra-calculator', category: 'tax', priority: 0.9 },
    { id: 'nps-calculator', category: 'tax', priority: 0.85 },
    
    // Banking
    { id: 'fd-calculator', category: 'banking', priority: 0.9 },
    { id: 'rd-calculator', category: 'banking', priority: 0.85 },
    { id: 'simple-interest', category: 'banking', priority: 0.8 },
    { id: 'compound-interest', category: 'banking', priority: 0.8 },
    
    // Health
    { id: 'bmi-calculator', category: 'health', priority: 0.95 },
    { id: 'bmr-calculator', category: 'health', priority: 0.85 },
    { id: 'calorie-calculator', category: 'health', priority: 0.85 },
    { id: 'body-fat-calculator', category: 'health', priority: 0.8 },
    
    // Insurance
    { id: 'term-insurance', category: 'insurance', priority: 0.9 },
    { id: 'life-insurance', category: 'insurance', priority: 0.85 },
    
    // Real Estate
    { id: 'rental-yield', category: 'real-estate', priority: 0.85 },
    { id: 'home-affordability', category: 'real-estate', priority: 0.85 },
    { id: 'stamp-duty', category: 'real-estate', priority: 0.8 },
    
    // Business
    { id: 'gst-calculator-business', category: 'business', priority: 0.9 },
    { id: 'margin-calculator', category: 'business', priority: 0.85 },
    { id: 'break-even', category: 'business', priority: 0.8 },
    
    // Retirement
    { id: 'retirement-corpus', category: 'retirement', priority: 0.85 },
    { id: 'fire-calculator', category: 'retirement', priority: 0.8 },
    
    // Currency
    { id: 'currency-converter', category: 'currency', priority: 0.9 },
    
    // Misc/Everyday
    { id: 'age-calculator', category: 'everyday-life', priority: 0.85 },
    { id: 'percentage-calculator', category: 'math', priority: 0.85 },
    { id: 'tip-calculator', category: 'everyday-life', priority: 0.75 },
    { id: 'fuel-cost', category: 'everyday-life', priority: 0.75 },
  ]

  const calculatorPages = popularCalculators.map(calc => ({
    url: `${baseUrl}/calculator/${calc.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: calc.priority,
  }))

  // Combine all URLs
  return [...staticPages, ...categoryPages, ...calculatorPages]
}
