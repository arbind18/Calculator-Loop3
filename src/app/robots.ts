import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculatorloop.com'

  const locales = ['hi', 'ta', 'te', 'bn', 'mr', 'gu', 'es', 'pt', 'fr', 'de', 'id', 'ar', 'ur', 'ja']
  const localeVariants = (path: string) => locales.map((l) => `/${l}${path}`)
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/profile',
          '/notifications',
          '/history',
          '/favorites',
          '/examples/',
          ...localeVariants('/login'),
          ...localeVariants('/register'),
          ...localeVariants('/profile'),
          ...localeVariants('/notifications'),
          ...localeVariants('/history'),
          ...localeVariants('/favorites'),
          ...localeVariants('/examples/'),
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
