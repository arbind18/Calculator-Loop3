interface SchemaProps {
  type: "calculator" | "faq" | "breadcrumb" | "organization" | "website"
  data?: any
}

// Organization Schema for Homepage
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Calculator Loop",
    alternateName: "Calculator Loop",
    url: "https://calculatorloop.com",
    logo: "https://calculatorloop.com/logo.png",
    description: "Free online calculator platform with 300+ calculators for EMI, Tax, GST, SIP, BMI, and more.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@calculatorloop.com",
      availableLanguage: ["en", "hi"]
    },
    sameAs: [
      "https://twitter.com/calculatorloop",
      "https://facebook.com/calculatorloop",
      "https://linkedin.com/company/calculatorloop"
    ],
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Calculator Loop",
    url: "https://calculatorloop.com",
    description: "Free online calculators for financial planning, health, education, and more. Calculate EMI, Tax, GST, SIP, BMI instantly.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://calculatorloop.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
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
  ratingValue = 4.8,
  ratingCount = 12500
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toString(),
      ratingCount: ratingCount.toString(),
      bestRating: "5",
      worstRating: "1"
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
      name: "Calculator Hub India"
    },
    inLanguage: "en-IN",
    countriesSupported: "IN"
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
      name: "Calculator Hub"
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
  authorName = "Calculator Hub Team",
  imageUrl = "https://calculatorhub.in/og-image.png"
}: ArticleSchemaProps) {
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
      name: "Calculator Hub India",
      logo: {
        "@type": "ImageObject",
        url: "https://calculatorhub.in/logo.png"
      }
    },
    image: imageUrl,
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
      name: "Calculator Hub India",
      logo: {
        "@type": "ImageObject",
        url: "https://calculatorhub.in/logo.png"
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
