/** @type {import('next').NextConfig} */
const enableStandalone =
  process.env.NEXT_OUTPUT === 'standalone' || process.env.NEXT_OUTPUT_STANDALONE === 'true'

const webpack = require('webpack')

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,

  // Avoid Next.js auto-selecting a parent folder as the workspace root when
  // multiple lockfiles exist on the machine.
  outputFileTracingRoot: __dirname,
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select'],
    optimizeCss: true,
    scrollRestoration: true,
    // Turbopack support for faster dev builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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
  webpack: (config, { isServer, dev }) => {
    // Some dependencies use `node:`-prefixed core-module imports (e.g. `node:fs`).
    // Webpack in this setup doesn't handle the `node:` scheme, so normalize it.
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '')
      })
    )

    // Optimize bundle size in production
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate recharts into its own chunk (heavy library)
            recharts: {
              name: 'recharts',
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            // Separate radix-ui components
            radix: {
              name: 'radix-ui',
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            // Common vendor libraries
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common components used across pages
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    // Minimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        http: false,
        https: false,
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
            value: 'camera=(), microphone=(self), geolocation=()'
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
      // Redirect www to non-www (FIRST - highest priority)
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
      
      // Legacy HTML site redirects - Old folder structure to new
      // Math calculators: /Math/Law-of-Sines-Calculator -> /calculator/law-of-sines-calculator
      {
        source: '/Math/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/math/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Financial calculators: /financial-calculators/* -> /calculator/*
      {
        source: '/financial-calculators/:path*',
        destination: '/calculator/:path*',
        permanent: true,
      },
      {
        source: '/Financial-calculators/:path*',
        destination: '/calculator/:path*',
        permanent: true,
      },
      
      // Physics calculators
      {
        source: '/Physics/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/physics/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Health calculators
      {
        source: '/Health/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/health/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Education calculators
      {
        source: '/Education/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/education/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Construction calculators
      {
        source: '/Construction/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/construction/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Technology calculators
      {
        source: '/Technology/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/technology/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Scientific calculators
      {
        source: '/Scientific/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/scientific/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // DateTime calculators
      {
        source: '/DateTime/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/datetime/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Everyday calculators
      {
        source: '/Everyday/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/everyday/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Business calculators
      {
        source: '/Business/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      {
        source: '/business/:calculator',
        destination: '/calculator/:calculator',
        permanent: true,
      },
      
      // Remove .html extensions from old site
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
      
      // Old _tools directory
      {
        source: '/_tools/:calculator',
        destination: '/calculator/:calculator',
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

