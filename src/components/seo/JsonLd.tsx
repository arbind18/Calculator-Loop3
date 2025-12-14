export function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Calculator Loop",
    "alternateName": "Calculator Loop - All-in-One Calculator Suite",
    "url": "https://calculatorloop.com/",
    "description": "300+ Free Online Calculator Tools for Financial Planning, Health Metrics, Math Calculations, and More",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://calculatorloop.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculator Loop",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Modern browser recommended.",
    "url": "https://calculatorloop.com/",
    "description": "Comprehensive online calculator suite with 300+ calculators for financial planning, health metrics, mathematical operations, date-time calculations, and more.",
    "datePublished": "2024-01-01",
    "dateModified": "2025-11-11",
    "author": {
      "@type": "Organization",
      "name": "Calculator Loop"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Calculator Loop",
      "logo": {
        "@type": "ImageObject",
        "url": "https://calculatorloop.com/logo.png"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "EMI Calculator",
      "SIP Calculator",
      "BMI Calculator",
      "Age Calculator",
      "Percentage Calculator",
      "Loan Calculator",
      "Investment Calculator",
      "Tax Calculator",
      "GST Calculator",
      "Retirement Calculator",
      "Mortgage Calculator",
      "Compound Interest Calculator",
      "Simple Interest Calculator",
      "Calorie Calculator",
      "GPA Calculator",
      "Tip Calculator",
      "Currency Converter",
      "Unit Converter",
      "Discount Calculator",
      "Date Difference Calculator",
      "Body Fat Calculator",
      "Ideal Weight Calculator",
      "Scientific Calculator",
      "Area Calculator",
      "Volume Calculator",
      "Distance Calculator",
      "Password Generator"
    ],
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2547",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Calculator Loop",
    "url": "https://calculatorloop.com/",
    "logo": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='fgrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300D4FF' /%3E%3Cstop offset='100%25' style='stop-color:%238B5CF6' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='20' fill='url(%23fgrad)'/%3E%3Ctext x='50' y='70' font-family='Arial,sans-serif' font-size='60' font-weight='bold' text-anchor='middle' fill='white'%3EC%3C/text%3E%3C/svg%3E",
    "description": "Calculator Loop provides 300+ free online calculators for everyone. From financial planning to health metrics, we make complex calculations simple.",
    "sameAs": [
      "https://twitter.com/calculatorloop",
      "https://facebook.com/calculatorloop",
      "https://linkedin.com/company/calculatorloop"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "availableLanguage": "English"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
