import Script from 'next/script'

export function PerformanceScripts() {
  return (
    <>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Critical CSS inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Critical above-the-fold styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
        }
        
        .loading-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />

      {/* Load non-critical CSS async */}
      <noscript>
        <link rel="stylesheet" href="/styles/non-critical.css" />
      </noscript>

      {/* Web Vitals tracking */}
      <Script
        id="web-vitals"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track Core Web Vitals
            if ('PerformanceObserver' in window) {
              // LCP
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
              }).observe({ type: 'largest-contentful-paint', buffered: true });

              // FID
              new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                  const fid = entry.processingStart - entry.startTime;
                  console.log('FID:', fid);
                });
              }).observe({ type: 'first-input', buffered: true });

              // CLS
              let clsValue = 0;
              new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                  }
                });
              }).observe({ type: 'layout-shift', buffered: true });
            }
          `,
        }}
      />

      {/* Resource hints */}
      {/* <link rel="preload" as="image" href="/hero-image.webp" /> */}
      <link rel="prefetch" as="script" href="/_next/static/chunks/pages/calculator.js" />
    </>
  )
}
