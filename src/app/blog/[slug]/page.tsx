import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { allBlogPosts, calculateReadingTime, formatDate, getRelatedPosts } from '@/lib/blogData';
import { getAllMarkdownBlogSlugs, getMarkdownBlogPostBySlug } from '@/lib/blogMarkdown';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';
import { ShareButtons } from '@/components/sections/ShareButtons';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const markdownSlugs = getAllMarkdownBlogSlugs();
  const slugs = new Set<string>([...allBlogPosts.map((p) => p.slug), ...markdownSlugs]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  if (post) {
    return {
      title: `${post.title} - Calculator Loop Blog`,
      description: post.description,
      keywords: post.tags,
      authors: [{ name: post.author.name }],
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        url: `https://calculatorloop.com/blog/${post.slug}`,
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        tags: post.tags,
        images: post.image ? [{ url: post.image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: post.image ? [post.image] : undefined,
      },
    };
  }

  const md = getMarkdownBlogPostBySlug(slug);
  if (md) {
    const title = md.frontmatter.title ?? md.slug;
    const description = md.frontmatter.description ?? 'Blog post';
    const publishedAt = md.frontmatter.publishedAt;
    const updatedAt = md.frontmatter.updatedAt;

    return {
      title: `${title} - Calculator Loop Blog`,
      description,
      alternates: {
        canonical: `/blog/${md.slug}`,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        url: `https://calculatorloop.com/blog/${md.slug}`,
        publishedTime: publishedAt,
        modifiedTime: updatedAt,
        images: md.frontmatter.image ? [{ url: md.frontmatter.image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: md.frontmatter.image ? [md.frontmatter.image] : undefined,
      },
    };
  }

  return { title: 'Post Not Found' };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = allBlogPosts.find((p) => p.slug === slug);
  const md = post ? null : getMarkdownBlogPostBySlug(slug);

  if (!post && !md) notFound();

  const normalizedPost = post
    ? post
    : {
        slug: md!.slug,
        title: md!.frontmatter.title ?? md!.slug,
        description: md!.frontmatter.description ?? '',
        content: md!.content,
        category: (md!.frontmatter.category as any) ?? 'general',
        tags: md!.frontmatter.tags ?? [],
        author: {
          name: md!.frontmatter.author ?? 'Calculator Loop',
          avatar: '/favicon.ico',
          bio: 'Calculator Loop Editorial',
        },
        publishedAt: md!.frontmatter.publishedAt ?? new Date().toISOString(),
        updatedAt: md!.frontmatter.updatedAt,
        readingTime: calculateReadingTime(md!.content),
        image: md!.frontmatter.image,
        featured: false,
      };

  const relatedPosts = post ? getRelatedPosts(post.slug, post.category) : [];
  const shareUrl = `https://calculatorloop.com/blog/${normalizedPost.slug}`;

  return (
    <main className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <Badge variant="secondary" className="text-sm">
            {normalizedPost.category}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{normalizedPost.title}</h1>

          <p className="text-xl text-muted-foreground">{normalizedPost.description}</p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{normalizedPost.author.name}</p>
                <p className="text-xs">{normalizedPost.author.bio}</p>
              </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(normalizedPost.publishedAt)}
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {normalizedPost.readingTime} min read
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {normalizedPost.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <Separator className="my-8" />

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: normalizedPost.content.replace(/\n/g, '<br />') }}
        />

        <Separator className="my-12" />

        {/* Share Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <span className="font-medium">Share this article:</span>
          </div>
          <ShareButtons
            url={shareUrl}
            title={normalizedPost.title}
            description={normalizedPost.description}
          />
        </div>

        <Separator className="my-12" />

        {/* Author Bio */}
        <Card>
          <CardContent className="p-6 flex gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{normalizedPost.author.name}</h3>
              <p className="text-muted-foreground">{normalizedPost.author.bio}</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <>
            <Separator className="my-12" />
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {relatedPost.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedPost.readingTime} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(relatedPost.publishedAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <Card className="mt-12 bg-primary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Try Our Calculators</h3>
            <p className="text-muted-foreground mb-6">
              Put this knowledge to use with our free financial calculators
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/calculator/emi-calculator">
                <Button size="lg">EMI Calculator</Button>
              </Link>
              <Link href="/calculator/sip-calculator">
                <Button size="lg" variant="outline">
                  SIP Calculator
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
