import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { calculatorComponents } from '@/lib/calculatorRegistry'
import { toolsData } from '@/lib/toolsData'
import { BackButton } from '@/components/ui/back-button'
import { StructuredData } from '@/components/seo/StructuredData'
import { RelatedCalculators } from '@/components/calculators/RelatedCalculators'
import { getMergedTranslations } from '@/lib/translations'
import { localizeToolMeta } from '@/lib/toolLocalization'

function findCategoryForCalculator(id: string): { categoryId: string; subcategoryKey: string; categoryName: string; tool: any } | null {
  for (const [categoryId, category] of Object.entries(toolsData)) {
    for (const [subKey, sub] of Object.entries(category.subcategories ?? {})) {
      const tool = sub.calculators.find((calc) => calc.id === id)
      if (tool) {
        return { categoryId, subcategoryKey: subKey, categoryName: sub.name, tool }
      }
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const info = findCategoryForCalculator(id)
  const language = (await headers()).get('x-calculator-language') || 'en'
  const dict = getMergedTranslations(language)
  
  if (!info) {
    return {
      title: 'Calculator Not Found',
      description: 'The requested calculator could not be found.'
    }
  }

  const meta = localizeToolMeta({
    dict,
    toolId: id,
    fallbackTitle: info.tool.title,
    fallbackDescription: info.tool.description,
  })

  const prefix = language !== 'en' ? `/${language}` : ''
  const pathname = `${prefix}/calculator/${id}`

  return {
    title: `${meta.title} - Free Online Calculator | Calculator Loop`,
    description: `${meta.description} Accurate, fast, and free online ${meta.title} with instant results.`,
    keywords: [meta.title, `${meta.title} online`, 'financial calculator', 'free calculator', info.categoryName],
    openGraph: {
      title: `${meta.title} - Free Online Calculator`,
      description: meta.description,
      type: 'website',
      url: `https://calculatorloop.com${pathname}`,
      siteName: 'Calculator Loop',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.title} - Free Online Calculator`,
      description: meta.description,
    }
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const CalculatorComponent = calculatorComponents[id]
  const categoryInfo = findCategoryForCalculator(id)
  const language = (await headers()).get('x-calculator-language') || 'en'
  const dict = getMergedTranslations(language)
  const prefix = language !== 'en' ? `/${language}` : ''

  const meta = categoryInfo
    ? localizeToolMeta({
        dict,
        toolId: id,
        fallbackTitle: categoryInfo.tool.title,
        fallbackDescription: categoryInfo.tool.description,
      })
    : null

  if (!CalculatorComponent || !categoryInfo) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <StructuredData 
        title={meta?.title ?? categoryInfo.tool.title}
        description={meta?.description ?? categoryInfo.tool.description}
        categoryName={categoryInfo.categoryName} 
        url={`${prefix}/calculator/${id}`} 
      />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <CalculatorComponent 
          id={id} 
          title={meta?.title ?? categoryInfo.tool.title}
          description={meta?.description ?? categoryInfo.tool.description}
        />
        
        <RelatedCalculators 
          currentToolId={id}
          categoryId={categoryInfo.categoryId}
          subcategoryKey={categoryInfo.subcategoryKey}
        />
      </div>
    </div>
  )
}
