import { toolsData } from '@/lib/toolsData'
import { RelatedCalculatorsClient } from '@/components/calculators/RelatedCalculatorsClient'

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

  return <RelatedCalculatorsClient tools={relatedTools} categoryId={categoryId} />
}
