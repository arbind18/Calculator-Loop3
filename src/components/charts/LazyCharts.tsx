'use client'

import dynamic from 'next/dynamic'
import { ComponentType, Suspense } from 'react'

// Lazy load recharts components with loading fallback
export const LazyLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />
  }
)

export const LazyBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />
  }
)

export const LazyPieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />
  }
)

export const LazyAreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 animate-pulse rounded-lg" />
  }
)

// Export other recharts components
export const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false })
export const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false })
export const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false })
export const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false })
export const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false })
export const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false })
export const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false })
export const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false })
export const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false })
export const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false })
export const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false })
