import fs from 'fs';
import path from 'path';

export type MarkdownBlogFrontmatter = {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: string;
  toolId?: string;
};

export type MarkdownBlogPost = {
  slug: string;
  frontmatter: MarkdownBlogFrontmatter;
  content: string;
  sourcePath: string;
};

const BLOG_DIR = path.join(process.cwd(), 'src/content/blogs');

const getFilesRecursive = (dir: string): string[] => {
  const entries = fs.readdirSync(dir);
  const files = entries.flatMap((entry) => {
    const resolved = path.resolve(dir, entry);
    return fs.statSync(resolved).isDirectory() ? getFilesRecursive(resolved) : [resolved];
  });
  return files;
};

const parseFrontmatter = (raw: string): { frontmatter: MarkdownBlogFrontmatter; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: {}, body: raw };

  const fmRaw = match[1] ?? '';
  const body = raw.slice(match[0].length);

  const frontmatter: MarkdownBlogFrontmatter = {};
  const lines = fmRaw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // tags: [a, b] OR tags: a, b
    const tagsArray = trimmed.match(/^tags:\s*\[(.*)\]\s*$/i);
    if (tagsArray?.[1] !== undefined) {
      frontmatter.tags = tagsArray[1]
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.replace(/^['"]|['"]$/g, ''));
      continue;
    }

    const kv = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1];
    const value = (kv[2] ?? '').trim().replace(/^['"]|['"]$/g, '');

    switch (key) {
      case 'title':
        frontmatter.title = value;
        break;
      case 'description':
      case 'excerpt':
        frontmatter.description = value;
        break;
      case 'category':
        frontmatter.category = value;
        break;
      case 'author':
        frontmatter.author = value;
        break;
      case 'publishedAt':
      case 'published':
      case 'date':
        frontmatter.publishedAt = value;
        break;
      case 'updatedAt':
      case 'updated':
        frontmatter.updatedAt = value;
        break;
      case 'image':
        frontmatter.image = value;
        break;
      case 'toolId':
        frontmatter.toolId = value;
        break;
      case 'tags':
        frontmatter.tags = value
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        break;
      default:
        // ignore unknown keys
        break;
    }
  }

  return { frontmatter, body };
};

const slugFromFilePath = (filePath: string) => path.basename(filePath).replace(/\.md$/i, '');

export const getAllMarkdownBlogPosts = (): MarkdownBlogPost[] => {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = getFilesRecursive(BLOG_DIR).filter((f) => f.toLowerCase().endsWith('.md'));

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(raw);
      const slug = slugFromFilePath(filePath);
      return {
        slug,
        frontmatter,
        content: body.trim(),
        sourcePath: filePath,
      } satisfies MarkdownBlogPost;
    })
    .sort((a, b) => {
      const ad = a.frontmatter.updatedAt ?? a.frontmatter.publishedAt ?? '';
      const bd = b.frontmatter.updatedAt ?? b.frontmatter.publishedAt ?? '';
      // Newest first (fallback to slug)
      if (ad && bd) return bd.localeCompare(ad);
      if (ad) return -1;
      if (bd) return 1;
      return a.slug.localeCompare(b.slug);
    });
};

export const getAllMarkdownBlogSlugs = () => getAllMarkdownBlogPosts().map((p) => p.slug);

export const getMarkdownBlogPostBySlug = (slug: string): MarkdownBlogPost | null => {
  if (!fs.existsSync(BLOG_DIR)) return null;

  // Fast path: check direct known paths not available; we scan.
  const files = getFilesRecursive(BLOG_DIR).filter((f) => f.toLowerCase().endsWith('.md'));
  const hit = files.find((f) => slugFromFilePath(f) === slug);
  if (!hit) return null;

  const raw = fs.readFileSync(hit, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(raw);
  return {
    slug,
    frontmatter,
    content: body.trim(),
    sourcePath: hit,
  };
};
