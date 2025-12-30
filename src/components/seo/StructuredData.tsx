interface StructuredDataProps {
  title: string
  description: string
  categoryName: string
  url: string
}

export function StructuredData({ title, description, categoryName, url }: StructuredDataProps) {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Instant Calculation",
      "Mobile Friendly",
      "Free to Use",
      "No Registration Required"
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://calculatorloop.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `https://calculatorloop.com/category/${url.split('/')[2]}` // Assuming url is /category/financial/calculator-id
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `https://calculatorloop.com${url}`
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([softwareApplicationSchema, breadcrumbSchema])
      }}
    />
  )
}
