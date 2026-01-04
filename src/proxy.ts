import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LANGS = new Set([
  'en',
  'hi',
  'ta',
  'te',
  'bn',
  'mr',
  'gu',
  // International
  'es',
  'pt',
  'fr',
  'de',
  'id',
  'ar',
  'ur',
  'ja',
])

function getLocaleFromPath(pathname: string): string | null {
  const parts = pathname.split('/')
  const maybe = parts[1]
  if (maybe && SUPPORTED_LANGS.has(maybe)) return maybe
  return null
}

function stripLocaleFromPath(pathname: string, locale: string): string {
  const prefix = `/${locale}`
  if (!pathname.startsWith(prefix)) return pathname
  const stripped = pathname.slice(prefix.length)
  return stripped.length ? stripped : '/'
}

function normalizeLegacyCalculatorId(raw: string): string {
  const decoded = (() => {
    try {
      return decodeURIComponent(String(raw ?? ''))
    } catch {
      return String(raw ?? '')
    }
  })()

  const slug = decoded.trim().toLowerCase()
  const noExt = slug.replace(/\.(html?|php)$/i, '')
  const normalized = noExt.replace(/_/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-')
  return normalized
}

function getLastPathSegment(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

/**
 * Global proxy for legacy redirects, locale routing, and security headers.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Legacy URL redirects (SEO): handle old .html/.php calculator pages indexed by Google.
  // Supports locale-prefixed URLs too (e.g. /hi/financial-calculators/sip-calculator.html).
  if (!pathname.startsWith('/api')) {
    const pathLocale = getLocaleFromPath(pathname)
    const prefix = pathLocale ? `/${pathLocale}` : ''
    const basePath = pathLocale ? stripLocaleFromPath(pathname, pathLocale) : pathname

    const lowerBasePath = basePath.toLowerCase()

    // /index.html -> /
    if (/^\/index\.(html?|php)$/i.test(basePath)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `${prefix}/`
      redirectUrl.search = search
      return NextResponse.redirect(redirectUrl, 308)
    }

    // Any legacy extension: map to canonical calculator route.
    if (/\.(html?|php)$/i.test(lowerBasePath)) {
      const last = getLastPathSegment(basePath)
      const id = normalizeLegacyCalculatorId(last)
      if (id) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `${prefix}/calculator/${id}`
        redirectUrl.search = search
        return NextResponse.redirect(redirectUrl, 308)
      }
    }

    // Legacy folder patterns without extension (common in old sites): /financial-calculators/<id>
    // Only apply to paths that look like calculator listings to avoid accidental redirects.
    const baseParts = basePath.split('/').filter(Boolean)
    if (baseParts.length === 2 && baseParts[0].includes('calculators')) {
      const id = normalizeLegacyCalculatorId(baseParts[1])
      if (id) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `${prefix}/calculator/${id}`
        redirectUrl.search = search
        return NextResponse.redirect(redirectUrl, 308)
      }
    }
  }

  // Locale routing (skip API routes)
  if (!pathname.startsWith('/api')) {
    const pathLocale = getLocaleFromPath(pathname)

    // If URL contains a locale prefix, rewrite to the underlying route and persist the locale.
    if (pathLocale) {
      const rewrittenPath = stripLocaleFromPath(pathname, pathLocale)
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = rewrittenPath
      // Pass locale to the downstream render so server components can read it on the same request.
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-calculator-language', pathLocale)
      // Preserve the original pathname (including locale prefix) for canonical/hreflang.
      requestHeaders.set('x-original-pathname', pathname)
      const response = NextResponse.rewrite(rewriteUrl, {
        request: {
          headers: requestHeaders,
        },
      })
      response.cookies.set('calculator-language', pathLocale, { path: '/', sameSite: 'lax' })

      // Security Headers
      response.headers.set(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https: blob:",
          "connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://api.resend.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
      )
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')

      if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
      }

      if (request.nextUrl.pathname.startsWith('/api/v1')) {
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
        response.headers.set('Access-Control-Max-Age', '86400')
      }

      if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: response.headers,
        })
      }

      return response
    }

    // If URL has no locale prefix, redirect to the saved locale to keep the locale in the URL.
    const savedLocale = request.cookies.get('calculator-language')?.value
    if (savedLocale && SUPPORTED_LANGS.has(savedLocale) && savedLocale !== 'en') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${savedLocale}${pathname}`
      // search is preserved by clone, but keep this explicit to avoid regressions
      redirectUrl.search = search
      return NextResponse.redirect(redirectUrl)
    }
  }

  // For non-locale paths, still pass the original pathname to downstream rendering.
  // (Useful for canonical/hreflang; does not change routing.)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-original-pathname', pathname)
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Security Headers
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://api.resend.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    response.headers.set('Access-Control-Max-Age', '86400')
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    })
  }

  return response
}

/**
 * Configure which routes should use this proxy.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
