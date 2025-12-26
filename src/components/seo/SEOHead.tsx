import Head from "next/head"

interface SEOHeadProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: "website" | "article"
  keywords?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  category?: string
  noindex?: boolean
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage = "/og-image.png",
  ogType = "website",
  keywords = "calculator, online calculator, free calculator, India",
  author = "Calculator Hub India",
  publishedTime,
  modifiedTime,
  category,
  noindex = false
}: SEOHeadProps) {
  const siteName = "Calculator Hub India"
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const siteUrl = "https://calculatorhub.in"
  const canonicalUrl = canonical || siteUrl
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      
      {/* Article Specific */}
      {ogType === "article" && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {category && <meta property="article:section" content={category} />}
          <meta property="article:author" content={author} />
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:creator" content="@calculatorhub" />
      <meta name="twitter:site" content="@calculatorhub" />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#6366f1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Calculator Hub" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <link rel="apple-touch-icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Alternative Languages */}
      <link rel="alternate" hrefLang="en-in" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi-in" href={`${canonicalUrl}?lang=hi`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Head>
  )
}

// Utility function to generate keywords for calculators
export function generateCalculatorKeywords(calculatorName: string, category: string): string {
  const baseKeywords = [
    "calculator",
    "online calculator",
    "free calculator",
    "India calculator",
    calculatorName.toLowerCase(),
    `${calculatorName.toLowerCase()} calculator`,
    `online ${calculatorName.toLowerCase()}`,
    `free ${calculatorName.toLowerCase()} calculator`,
    category.toLowerCase(),
    `${category.toLowerCase()} calculator`
  ]
  
  // Add category-specific keywords
  if (category === "Financial" || category === "Loan") {
    baseKeywords.push("EMI", "interest rate", "loan calculator", "financial planning", "rupees")
  } else if (category === "Tax") {
    baseKeywords.push("income tax", "GST", "tax calculation", "tax saving", "India tax")
  } else if (category === "Health") {
    baseKeywords.push("BMI", "health calculator", "fitness", "weight", "calories")
  } else if (category === "Investment") {
    baseKeywords.push("SIP", "mutual fund", "investment planning", "returns", "portfolio")
  }
  
  return baseKeywords.join(", ")
}
