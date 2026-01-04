import { redirect } from 'next/navigation'

function normalizeLegacySlug(raw: string) {
  const slug = decodeURIComponent(String(raw ?? '')).trim().toLowerCase()

  // Remove legacy extensions like .html
  const noExt = slug.replace(/\.(html?|php)$/i, '')

  // Normalize separators
  const normalized = noExt.replace(/_/g, '-').replace(/\s+/g, '-')

  // Common legacy alias: timezone-* -> time-zone-*
  const timezoneNormalized = normalized.replace(/^timezone-/, 'time-zone-').replace(/-timezone-/, '-time-zone-')

  // Exact legacy filenames without hyphen
  if (timezoneNormalized === 'timezone-converter') return 'time-zone-converter'

  return timezoneNormalized
}

export default async function LegacyDateTimeToolRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const toolId = normalizeLegacySlug(slug)

  // If it looks like a calculator id, redirect to the canonical calculator route.
  // Otherwise, go to the DateTime category page.
  if (toolId) {
    redirect(`/calculator/${toolId}`)
  }

  redirect('/category/datetime')
}
