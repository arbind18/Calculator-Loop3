import { headers } from 'next/headers';
import { allBlogPosts } from '@/lib/blogData';
import { getMergedTranslations } from '@/lib/translations';
import { BlogDashboard } from '@/components/blog/BlogDashboard';
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const language = (await headers()).get('x-calculator-language') || 'en';
  const dict = getMergedTranslations(language);

  return {
    title: `${dict.nav.blog} - Calculator Loop`,
    description: dict.blog?.metaDescription || 'Expert guides on EMI, loans, investments, and planning.',
  };
}

export default async function BlogPage() {
  const language = (await headers()).get('x-calculator-language') || 'en';
  const dict = getMergedTranslations(language);

  return <BlogDashboard posts={allBlogPosts} language={language} dict={dict} />;
}
