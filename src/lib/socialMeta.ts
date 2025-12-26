import { Metadata } from 'next';

export interface SocialMetaOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
}

/**
 * Generate comprehensive Open Graph and Twitter Card metadata
 * for better social media sharing
 */
export function generateSocialMeta(options: SocialMetaOptions): Metadata {
  const {
    title,
    description,
    url,
    image = '/images/og-default.jpg',
    imageAlt = title,
    type = 'website',
    siteName = 'Calculator Pro',
    locale = 'en_IN',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    twitterCard = 'summary_large_image',
    twitterSite = '@calculatorpro',
    twitterCreator,
  } = options;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type,
      images: [
        {
          url: image,
          alt: imageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [image],
      site: twitterSite,
      creator: twitterCreator || twitterSite,
    },
  };

  // Add article-specific metadata
  if (type === 'article' && metadata.openGraph) {
    (metadata.openGraph as any).type = 'article';
    (metadata.openGraph as any).article = {
      publishedTime,
      modifiedTime,
      author,
      section,
      tags,
    };
  }

  return metadata;
}

/**
 * Generate calculator-specific social metadata
 */
export function generateCalculatorMeta(
  calculatorName: string,
  description: string,
  category: string,
  slug: string
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculatorpro.com';
  const url = `${baseUrl}/calculator/${slug}`;
  
  return generateSocialMeta({
    title: `${calculatorName} | Free Online Calculator`,
    description,
    url,
    image: `${baseUrl}/api/og?title=${encodeURIComponent(calculatorName)}&category=${encodeURIComponent(category)}`,
    imageAlt: `${calculatorName} - ${description}`,
    type: 'website',
    section: category,
    tags: [calculatorName, category, 'Calculator', 'Free Tool'],
  });
}

/**
 * Generate blog post social metadata
 */
export function generateBlogMeta(
  title: string,
  excerpt: string,
  slug: string,
  author: string,
  publishedTime: string,
  modifiedTime: string,
  category: string,
  tags: string[],
  featuredImage?: string
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calculatorpro.com';
  const url = `${baseUrl}/blog/${slug}`;
  const image = featuredImage || `${baseUrl}/api/og?title=${encodeURIComponent(title)}&type=blog`;
  
  return generateSocialMeta({
    title: `${title} | Calculator Pro Blog`,
    description: excerpt,
    url,
    image,
    imageAlt: title,
    type: 'article',
    publishedTime,
    modifiedTime,
    author,
    section: category,
    tags,
  });
}

/**
 * Generate structured data for social sharing
 */
export function generateShareData(
  title: string,
  description: string,
  url: string,
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    image: image || '/images/og-default.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Calculator Pro',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.svg',
      },
    },
  };
}

/**
 * Get WhatsApp share URL
 */
export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Get Twitter share URL
 */
export function getTwitterShareUrl(
  text: string,
  url: string,
  hashtags: string[] = []
): string {
  const hashtagString = hashtags.join(',');
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}${hashtags.length > 0 ? `&hashtags=${hashtagString}` : ''}`;
}

/**
 * Get Facebook share URL
 */
export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * Get LinkedIn share URL
 */
export function getLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

/**
 * Get Telegram share URL
 */
export function getTelegramShareUrl(text: string, url: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/**
 * Get Reddit share URL
 */
export function getRedditShareUrl(title: string, url: string): string {
  return `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
}

/**
 * Get Email share URL
 */
export function getEmailShareUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
