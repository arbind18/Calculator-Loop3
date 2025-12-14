import Link from 'next/link'
import { toolsData } from '@/lib/toolsData'
import { ArrowRight } from 'lucide-react'

interface RelatedCalculatorsProps {
  currentToolId: string
  categoryId: string
  subcategoryKey: string
}

export function RelatedCalculators({ currentToolId, categoryId, subcategoryKey }: RelatedCalculatorsProps) {
  const category = toolsData[categoryId]
  if (!category || !category.subcategories) return null

  const subcategory = category.subcategories[subcategoryKey]
  if (!subcategory) return null

  // Get other calculators in the same subcategory
  const relatedTools = subcategory.calculators
    .filter(tool => tool.id !== currentToolId)
    .slice(0, 3) // Show max 3 related tools

  if (relatedTools.length === 0) return null

  return (
    <div className="mt-16 border-t border-border/50 pt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Related Calculators</h3>
        <Link 
          href={`/category/${categoryId}`}
          className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {relatedTools.map((tool) => (
          <Link 
            key={tool.id} 
            href={`/calculator/${tool.id}`}
            className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all"
          >
            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">{tool.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
