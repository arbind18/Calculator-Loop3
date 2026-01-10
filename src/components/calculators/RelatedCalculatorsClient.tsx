'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useSettings } from '@/components/providers/SettingsProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { localizeToolMeta } from '@/lib/toolLocalization'

type ToolItem = {
  id: string
  title: string
  description: string
}

export function RelatedCalculatorsClient({
  tools,
  categoryId,
}: {
  tools: ToolItem[]
  categoryId: string
}) {
  const { language } = useSettings()
  const { dict } = useTranslation()

  const prefix = language && language !== 'en' ? `/${language}` : ''

  if (!tools || tools.length === 0) return null

  return (
    <div className="mt-16 border-t border-border/50 pt-12">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Related Calculators</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => {
          const meta = localizeToolMeta({
            dict,
            toolId: tool.id,
            fallbackTitle: tool.title,
            fallbackDescription: tool.description,
          })

          return (
            <Link
              key={tool.id}
              href={`${prefix}/calculator/${tool.id}`}
              className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg transition-all"
            >
              <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">{meta.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{meta.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
