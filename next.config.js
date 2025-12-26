/** @type {import('next').NextConfig} */
const enableStandalone =
  process.env.NEXT_OUTPUT === 'standalone' || process.env.NEXT_OUTPUT_STANDALONE === 'true'

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,

  // Ensure Turbopack uses this project folder as root (prevents it from
  // incorrectly selecting a parent directory when multiple lockfiles exist).
  turbopack: {
    root: __dirname,
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeCss: true,
    scrollRestoration: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle analyzer (optional)
  webpack: (config, { isServer }) => {
    // Tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    }

    // Minimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // HTTP Headers for SEO and Security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache images
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.calculatorloop.com',
          },
        ],
        destination: 'https://calculatorloop.com/:path*',
        permanent: true,
      },
    ]
  },

  // Clean URL rewrites
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/tools/:calculator',
          destination: '/calculator/:calculator',
        },
        {
          source: '/calc/:calculator',
          destination: '/calculator/:calculator',
        },
      ],
    }
  },

  // Configure trailing slash
  trailingSlash: false,

  // Output optimization
  ...(enableStandalone ? { output: 'standalone' } : {}),
}

module.exports = nextConfig

