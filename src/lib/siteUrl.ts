const FALLBACK_SITE_URL = 'https://calculatorloop.com'

export function normalizeSiteUrl(raw: string | undefined | null): string {
  const trimmed = String(raw ?? '').trim()
  if (!trimmed) return FALLBACK_SITE_URL

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    return new URL(withProtocol).origin
  } catch {
    return FALLBACK_SITE_URL
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
}
