import { Metadata } from "next"

interface GenerateMetadataProps {
  title: string
  description: string
  path?: string
  keywords?: string[]
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
}

export function generateCalculatorMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image = "/og-image.png",
  type = "website",
  publishedTime,
  modifiedTime,
}: GenerateMetadataProps): Metadata {
  const baseUrl = "https://calculatorloop.com"
  const url = `${baseUrl}${path}`
  const fullImage = image.startsWith("http") ? image : `${baseUrl}${image}`

  const defaultKeywords = [
    "online calculator",
    "free calculator",
    "India calculator",
    "calculator 2026",
    "financial calculator",
  ]

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | Calculator Loop`,
    },
    description,
    keywords: allKeywords,
    authors: [{ name: "Calculator Loop Team" }],
    creator: "Calculator Loop",
    publisher: "Calculator Loop",
    
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      type: type,
      locale: "en_IN",
      alternateLocale: ["hi_IN"],
      url: url,
      siteName: "Calculator Loop",
      title: title,
      description: description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      site: "@calculatorloop",
      creator: "@calculatorloop",
      title: title,
      description: description,
      images: [fullImage],
    },

    alternates: {
      canonical: url,
      languages: {
        "en-IN": url,
        "hi-IN": `${url}?lang=hi`,
      },
    },

    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
    },
  }

  return metadata
}

// Category-specific metadata generators
export function generateFinancialMetadata(calculatorName: string, description: string, path: string): Metadata {
  return generateCalculatorMetadata({
    title: `${calculatorName} | Free Online Financial Calculator`,
    description: description,
    path: path,
    keywords: [
      calculatorName.toLowerCase(),
      "EMI calculator",
      "loan calculator",
      "interest calculator",
      "financial planning",
      "India finance",
    ],
  })
}

export function generateHealthMetadata(calculatorName: string, description: string, path: string): Metadata {
  return generateCalculatorMetadata({
    title: `${calculatorName} | Free Online Health Calculator`,
    description: description,
    path: path,
    keywords: [
      calculatorName.toLowerCase(),
      "BMI calculator",
      "health calculator",
      "fitness calculator",
      "calorie calculator",
      "body fat calculator",
    ],
  })
}

export function generateTaxMetadata(calculatorName: string, description: string, path: string): Metadata {
  return generateCalculatorMetadata({
    title: `${calculatorName} | India Tax Calculator 2026-27`,
    description: description,
    path: path,
    keywords: [
      calculatorName.toLowerCase(),
      "income tax calculator",
      "GST calculator",
      "tax calculator India",
      "tax saving",
      "India tax 2026",
    ],
  })
}

export function generateInvestmentMetadata(calculatorName: string, description: string, path: string): Metadata {
  return generateCalculatorMetadata({
    title: `${calculatorName} | Free Investment Calculator India`,
    description: description,
    path: path,
    keywords: [
      calculatorName.toLowerCase(),
      "SIP calculator",
      "mutual fund calculator",
      "investment planning",
      "portfolio calculator",
      "returns calculator",
    ],
  })
}
