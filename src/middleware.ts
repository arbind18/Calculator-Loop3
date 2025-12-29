import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LANGS = new Set(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu']);

function getLocaleFromPath(pathname: string): string | null {
  const parts = pathname.split('/');
  const maybe = parts[1];
  if (maybe && SUPPORTED_LANGS.has(maybe)) return maybe;
  return null;
}

function stripLocaleFromPath(pathname: string, locale: string): string {
  const prefix = `/${locale}`;
  if (!pathname.startsWith(prefix)) return pathname;
  const stripped = pathname.slice(prefix.length);
  return stripped.length ? stripped : '/';
}

/**
 * Global middleware for security headers and rate limiting
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Locale routing (skip API routes)
  if (!pathname.startsWith('/api')) {
    const pathLocale = getLocaleFromPath(pathname);

    // If URL contains a locale prefix, rewrite to the underlying route and persist the locale.
    if (pathLocale) {
      const rewrittenPath = stripLocaleFromPath(pathname, pathLocale);
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = rewrittenPath;
      const response = NextResponse.rewrite(rewriteUrl);
      response.cookies.set('calculator-language', pathLocale, { path: '/', sameSite: 'lax' });

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
      );
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');

      if (process.env.NODE_ENV === 'production') {
        response.headers.set(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload'
        );
      }

      if (request.nextUrl.pathname.startsWith('/api/v1')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, OPTIONS'
        );
        response.headers.set(
          'Access-Control-Allow-Headers',
          'Content-Type, Authorization, X-API-Key'
        );
        response.headers.set('Access-Control-Max-Age', '86400');
      }

      if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: response.headers,
        });
      }

      return response;
    }

    // If URL has no locale prefix, redirect to the saved locale to keep the locale in the URL.
    const savedLocale = request.cookies.get('calculator-language')?.value;
    if (savedLocale && SUPPORTED_LANGS.has(savedLocale) && savedLocale !== 'en') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${savedLocale}${pathname}`;
      // search is preserved by clone, but keep this explicit to avoid regressions
      redirectUrl.search = search;
      return NextResponse.redirect(redirectUrl);
    }
  }

  const response = NextResponse.next();

  // Security Headers
  
  // Content Security Policy
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
  );

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(self), geolocation=()'
  );

  // HSTS (HTTP Strict Transport Security)
  // Enable only in production with HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-API-Key'
    );
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

/**
 * Configure which routes should use this middleware
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
};
