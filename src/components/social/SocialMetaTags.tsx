'use client';

import Head from 'next/head';

interface SocialMetaTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  siteName?: string;
  twitterHandle?: string;
}

/**
 * Client-side social meta tags component
 * Use this when you need dynamic meta tags based on client state
 */
export default function SocialMetaTags({
  title,
  description,
  url,
  image = '/images/og-default.jpg',
  type = 'website',
  siteName = 'Calculator Pro',
  twitterHandle = '@calculatorpro',
}: SocialMetaTagsProps) {
  return (
    <Head>
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <link rel="canonical" href={url} />
    </Head>
  );
}
