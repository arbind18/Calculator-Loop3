import Link from 'next/link';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { allBlogPosts, formatDate } from '@/lib/blogData';
import { Calendar, Clock, User, ArrowRight, Star } from 'lucide-react';
import { getMergedTranslations } from '@/lib/translations';
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
  const prefix = language === 'en' ? '' : `/${language}`;
  const withLocale = (path: string) => `${prefix}${path}`;

  const featuredPosts = allBlogPosts.filter((post) => post.featured);
  const recentPosts = allBlogPosts.filter((post) => !post.featured);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-4 w-4 mr-2" />
            {dict.blog?.badge || 'Blog & Guides'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">{dict.blog?.title || 'Financial Wisdom'}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {dict.blog?.subtitle || 'Expert guides on loans, investments, and financial planning to help you make smarter money decisions.'}
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{dict.blog?.featured || 'Featured Articles'}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.slug} href={withLocale(`/blog/${post.slug}`)}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readingTime} min
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        {dict.blog?.readArticle || 'Read Article'}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{dict.blog?.all || 'All Articles'}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBlogPosts.map((post) => (
              <Link key={post.slug} href={withLocale(`/blog/${post.slug}`)}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingTime} min
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                      {dict.blog?.readMore || 'Read More'}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">{dict.blog?.readyToCalculate || 'Ready to Calculate?'}</h3>
              <p className="text-muted-foreground mb-6">
                {dict.blog?.readyToCalculateDesc || 'Use our free calculators to plan your finances better'}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href={withLocale('/calculator/emi-calculator')}>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
                    {dict.blog?.ctaEmi || 'EMI Calculator'}
                  </button>
                </Link>
                <Link href={withLocale('/calculator/sip-calculator')}>
                  <button className="px-6 py-3 border border-border rounded-lg font-medium hover:border-primary hover:text-primary">
                    {dict.blog?.ctaSip || 'SIP Calculator'}
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
