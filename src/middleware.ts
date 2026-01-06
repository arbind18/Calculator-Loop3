import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Handle calculator URLs with case-insensitive slugs
  // Example: /calculator/Law-of-Sines-Calculator -> /calculator/law-of-sines-calculator
  if (path.startsWith('/calculator/')) {
    const slug = path.replace('/calculator/', '');
    const lowercaseSlug = slug.toLowerCase();
    
    // If the slug contains uppercase or .html extension, redirect to lowercase without extension
    if (slug !== lowercaseSlug || slug.endsWith('.html')) {
      const cleanSlug = lowercaseSlug.replace(/\.html?$/i, '');
      url.pathname = `/calculator/${cleanSlug}`;
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // Handle category URLs with case-insensitive slugs
  if (path.startsWith('/category/')) {
    const slug = path.replace('/category/', '');
    const lowercaseSlug = slug.toLowerCase();
    
    if (slug !== lowercaseSlug) {
      url.pathname = `/category/${lowercaseSlug}`;
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // Remove trailing slashes except for root
  if (path !== '/' && path.endsWith('/')) {
    url.pathname = path.slice(0, -1);
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
