import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { calculatorComponents } from '@/lib/calculatorRegistry'
import { toolsData } from '@/lib/toolsData'
import { BackButton } from '@/components/ui/back-button'
import { StructuredData } from '@/components/seo/StructuredData'
import { RelatedCalculators } from '@/components/calculators/RelatedCalculators'

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
  
  if (!info) {
    return {
      title: 'Calculator Not Found',
      description: 'The requested calculator could not be found.'
    }
  }

  return {
    title: `${info.tool.title} - Free Online Calculator | Calculator Loop`,
    description: `${info.tool.description} Accurate, fast, and free online ${info.tool.title} for your financial planning needs.`,
    keywords: [info.tool.title, `${info.tool.title} online`, 'financial calculator', 'free calculator', info.categoryName],
    alternates: {
      canonical: `https://calculatorloop.com/calculator/${id}`
    },
    openGraph: {
      title: `${info.tool.title} - Free Online Calculator`,
      description: info.tool.description,
      type: 'website',
      url: `https://calculatorloop.com/calculator/${id}`,
      siteName: 'Calculator Loop',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${info.tool.title} - Free Online Calculator`,
      description: info.tool.description,
    }
  }
}

export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const CalculatorComponent = calculatorComponents[id]
  const categoryInfo = findCategoryForCalculator(id)

  if (!CalculatorComponent || !categoryInfo) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <StructuredData 
        tool={categoryInfo.tool} 
        categoryName={categoryInfo.categoryName} 
        url={`/calculator/${id}`} 
      />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <BackButton />
        </div>
        
        <CalculatorComponent />
        
        <RelatedCalculators 
          currentToolId={id}
          categoryId={categoryInfo.categoryId}
          subcategoryKey={categoryInfo.subcategoryKey}
        />
      </div>
    </div>
  )
}
