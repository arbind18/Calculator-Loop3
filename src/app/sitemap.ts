import { MetadataRoute } from 'next'
import { toolsData } from '@/lib/toolsData'
import { implementedCalculatorIds } from '@/lib/implementedCalculators'
import { allBlogPosts } from '@/lib/blogData'
import { getAllMarkdownBlogPosts } from '@/lib/blogMarkdown'
import { getSiteUrl } from '@/lib/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const currentDate = new Date()

  const locales = ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'es', 'pt', 'fr', 'de', 'id', 'ar', 'ur', 'ja'] as const

  const withLocales = (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`
    return locales.map((loc) => {
      if (loc === 'en') return `${baseUrl}${normalized === '/' ? '' : normalized}`
      return `${baseUrl}/${loc}${normalized === '/' ? '' : normalized}`
    })
  }

  const makeItem = (
    url: string,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number,
    lastModified: Date = currentDate
  ) => {
    return {
      url,
      lastModified,
      changeFrequency,
      priority,
    } satisfies MetadataRoute.Sitemap[number]
  }

  const staticLocalizedPages: MetadataRoute.Sitemap = [
    ...withLocales('/').map((url) => makeItem(url, 'daily', url === baseUrl ? 1 : 0.8)),
    ...withLocales('/about').map((url) => makeItem(url, 'monthly', 0.7)),
    ...withLocales('/contact').map((url) => makeItem(url, 'monthly', 0.6)),
    ...withLocales('/blog').map((url) => makeItem(url, 'weekly', 0.8)),
    ...withLocales('/popular').map((url) => makeItem(url, 'daily', 0.9)),
    ...withLocales('/pricing').map((url) => makeItem(url, 'monthly', 0.4)),
    ...withLocales('/privacy').map((url) => makeItem(url, 'yearly', 0.3)),
    ...withLocales('/terms').map((url) => makeItem(url, 'yearly', 0.3)),
  ]

  const categoryIds = Object.keys(toolsData)
  const categoryPages: MetadataRoute.Sitemap = categoryIds.flatMap((id) =>
    withLocales(`/category/${id}`).map((url) => ({
      url,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  const calculatorIds = Array.from(implementedCalculatorIds)
  const calculatorPages: MetadataRoute.Sitemap = calculatorIds.flatMap((id) =>
    withLocales(`/calculator/${id}`).map((url) => ({
      url,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  const markdownBlogPages: MetadataRoute.Sitemap = getAllMarkdownBlogPosts().flatMap((post) => {
    const lastModified = new Date(post.frontmatter.updatedAt ?? post.frontmatter.publishedAt ?? currentDate)
    return withLocales(`/blog/${post.slug}`).map((url) => ({
      url,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }))
  })

  const blogPages: MetadataRoute.Sitemap = allBlogPosts.flatMap((post) => {
    const lastModified = new Date(post.updatedAt ?? post.publishedAt)
    const priority = post.featured ? 0.7 : 0.5
    return withLocales(`/blog/${post.slug}`).map((url) => ({
      url,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    }))
  })

  // De-dupe (defensive)
  const all = [...staticLocalizedPages, ...categoryPages, ...calculatorPages, ...blogPages, ...markdownBlogPages]
  const seen = new Set<string>()
  return all.filter((item) => {
    if (seen.has(item.url)) return false
    seen.add(item.url)
    return true
  })
}
