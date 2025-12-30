import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { toolsData } from '@/lib/toolsData'
import { implementedCalculatorIds } from '@/lib/implementedCalculators'
import { CategoryPageClient } from '@/components/pages/CategoryPageClient'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const categoryId = id || ''
  const language = (await headers()).get('x-calculator-language') || 'en'
  const prefix = language === 'en' ? '' : `/${language}`

  const readableNames: Record<string, string> = {
    financial: 'Financial Calculators',
    health: 'Health & Fitness Calculators',
    math: 'Math Calculators',
    datetime: 'Date & Time Calculators',
    education: 'Education Calculators',
    technology: 'Technology Calculators',
    scientific: 'Science Calculators',
    construction: 'Construction Calculators',
    business: 'Business Calculators',
    everyday: 'Everyday Calculators'
  }

  const categoryData = toolsData[categoryId]
  if (!categoryData) {
    return {
      title: 'Category Not Found | Calculator Loop',
      description: 'The requested calculator category could not be found.',
      robots: { index: false, follow: false },
    }
  }

  const calculatorsCount = Object.values(categoryData.subcategories ?? {}).reduce((sum, sub) => {
    return sum + sub.calculators.filter((calc) => implementedCalculatorIds.has(calc.id)).length
  }, 0)

  const categoryName = readableNames[categoryId] || 'Calculators'
  const title = `${categoryName} (${calculatorsCount}+ Tools) | Calculator Loop`
  const description = `Explore ${categoryName.toLowerCase()} with ${calculatorsCount}+ free online tools. Fast, accurate, mobile-friendly calculators with instant results.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://calculatorloop.com${prefix}/category/${categoryId}`,
      siteName: 'Calculator Loop',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const categoryId = id || ''

  const readableNames: Record<string, string> = {
    financial: 'Financial Calculators',
    health: 'Health & Fitness',
    math: 'Math Calculators',
    datetime: 'Date & Time',
    education: 'Education',
    technology: 'Technology',
    scientific: 'Science',
    construction: 'Construction',
    business: 'Business',
    everyday: 'Everyday Life'
  }

  const categoryData = toolsData[categoryId]
  const subcategoryList = categoryData?.subcategories
    ? Object.entries(categoryData.subcategories).map(([key, sub]) => ({
        key,
        name: sub.name,
        calculators: sub.calculators.filter((calc) => implementedCalculatorIds.has(calc.id)),
      }))
    : []

  const allCalculators = subcategoryList.flatMap((s) => s.calculators)

  if (!categoryData) {
    notFound()
  }

  const categoryName = readableNames[categoryId] || 'Calculators'

  return (
    <CategoryPageClient
      categoryId={categoryId}
      categoryName={categoryName}
      subcategoryList={subcategoryList}
    />
  )
}
