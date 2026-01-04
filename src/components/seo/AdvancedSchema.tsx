import { getSiteUrl } from '@/lib/siteUrl'

interface SchemaProps {
  type: "calculator" | "faq" | "breadcrumb" | "organization" | "website"
  data?: any
}

const getBaseUrl = () => getSiteUrl()

// Organization Schema for Homepage
export function OrganizationSchema() {
  const baseUrl = getBaseUrl()
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Calculator Loop",
    alternateName: "CalculatorLoop",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    description: "Free online calculator platform with calculators for EMI, Tax, GST, SIP, BMI, Age, Math and more.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India"
    },
    foundingDate: "2024",
    keywords: "calculator, financial calculator, EMI calculator, tax calculator, GST calculator, SIP calculator, loan calculator, India"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Website Schema
export function WebsiteSchema() {
  const baseUrl = getBaseUrl()
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Calculator Loop",
    url: baseUrl,
    description: "Free online calculators for financial planning, health, education, and more. Calculate EMI, Tax, GST, SIP, BMI instantly.",
    inLanguage: ["en-IN", "hi-IN"]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Calculator Tool Schema
interface CalculatorSchemaProps {
  name: string
  description: string
  url: string
  category: string
  ratingValue?: number
  ratingCount?: number
}

export function CalculatorSchema({ 
  name, 
  description, 
  url, 
  category,
  ratingValue,
  ratingCount
}: CalculatorSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    url: url,
    applicationCategory: "FinanceApplication",
    applicationSubCategory: category,
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR"
    },
    featureList: [
      "Free to use",
      "No registration required",
      "Instant results",
      "Mobile friendly",
      "Download PDF reports",
      "Share results"
    ],
    softwareVersion: "2.0",
    author: {
      "@type": "Organization",
      name: "Calculator Loop"
    },
    inLanguage: "en-IN",
    countriesSupported: "IN"
  }

  if (typeof ratingValue === 'number' && typeof ratingCount === 'number') {
    ;(schema as any).aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toString(),
      ratingCount: ratingCount.toString(),
      bestRating: "5",
      worstRating: "1",
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ Schema
interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// How-To Schema for Calculator Guides
interface HowToSchemaProps {
  name: string
  description: string
  steps: string[]
  totalTime?: string
}

export function HowToSchema({ name, description, steps, totalTime = "PT2M" }: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name,
    description: description,
    totalTime: totalTime,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
      name: `Step ${index + 1}`
    })),
    tool: [{
      "@type": "HowToTool",
      name: "Calculator Loop"
    }]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Article Schema for Blog Posts
interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  authorName?: string
  imageUrl?: string
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "Calculator Loop Team",
  imageUrl
}: ArticleSchemaProps) {
  const baseUrl = getBaseUrl()
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Organization",
      name: authorName
    },
    publisher: {
      "@type": "Organization",
      name: "Calculator Loop",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.svg`
      }
    },
    image: imageUrl ?? `${baseUrl}/opengraph-image`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Video Schema for Tutorial Videos
interface VideoSchemaProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration: string
  contentUrl: string
}

export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl
}: VideoSchemaProps) {
  const baseUrl = getBaseUrl()
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: name,
    description: description,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    duration: duration,
    contentUrl: contentUrl,
    embedUrl: contentUrl,
    publisher: {
      "@type": "Organization",
      name: "Calculator Loop",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.svg`
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
