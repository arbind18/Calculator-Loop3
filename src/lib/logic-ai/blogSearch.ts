import fs from 'fs';
import path from 'path';

export interface BlogPost {
  title: string;
  content: string;
  toolId?: string;
  path: string;
}

export interface SearchResult {
  post: BlogPost;
  score: number;
  matchingParagraph: string;
}

const STOPWORDS = new Set([
  // English
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'from', 'by', 'as', 'is', 'are', 'was', 'were',
  'be', 'been', 'it', 'this', 'that', 'these', 'those', 'your', 'you', 'we', 'our',
  // Hindi (Roman)
  'kya', 'ka', 'ki', 'ke', 'se', 'me', 'mein', 'mera', 'meri', 'mere', 'aap', 'ap', 'tum', 'hum', 'hai', 'hain',
  'tha', 'thi', 'the', 'hoga', 'hogi', 'hogaa', 'kab', 'kaise', 'kitna', 'kitni', 'kyu', 'kyun', 'aur', 'ya', 'par',
]);

const tokenize = (query: string): string[] => {
  return query
    .toLowerCase()
    .replace(/[₹,]/g, ' ')
    .replace(/[^\p{L}\p{N}%]+/gu, ' ') // unicode letters+numbers
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length >= 3)
    .filter((t) => !STOPWORDS.has(t));
};

// Helper to recursively get all markdown files
const getFiles = (dir: string): string[] => {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.reduce<string[]>((a, f) => a.concat(f), []);
};

export const searchContent = (query: string): SearchResult[] => {
  const contentDir = path.join(process.cwd(), 'src/content');
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = getFiles(contentDir).filter(f => f.endsWith('.md'));
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  const queryTerms = tokenize(query);

  // If we can't extract meaningful tokens, avoid returning random matches.
  if (queryTerms.length === 0) return [];

  // Tune these if needed.
  const MIN_SCORE = 6;
  const MIN_PARAGRAPH_MATCHES = 2;

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple frontmatter parsing (assuming --- ... --- format)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    const body = content.replace(/^---\n[\s\S]*?\n---/, '');

    // Extract title from frontmatter
    const titleMatch = frontmatter.match(/title:\s*(.*)/);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
    
    const toolIdMatch = frontmatter.match(/toolId:\s*(.*)/);
    const toolId = toolIdMatch ? toolIdMatch[1].trim() : undefined;

    let score = 0;
    let bestParagraph = '';
    let maxParagraphScore = 0;

    // Split body into paragraphs for better context
    const paragraphs = body.split(/\n\s*\n/);

    paragraphs.forEach(para => {
      let paraScore = 0;
      const lowerPara = para.toLowerCase();
      
      // Count unique token hits in this paragraph
      for (const term of queryTerms) {
        if (lowerPara.includes(term)) paraScore += 1;
      }

      if (paraScore > maxParagraphScore) {
        maxParagraphScore = paraScore;
        bestParagraph = para;
      }
    });

    // Scoring logic
    if (title.toLowerCase().includes(lowerQuery)) score += 10;
    // Partial title hits
    for (const term of queryTerms) {
      if (title.toLowerCase().includes(term)) score += 3;
    }
    score += maxParagraphScore * 2;

    // Avoid very weak / accidental matches
    if (score >= MIN_SCORE && maxParagraphScore >= MIN_PARAGRAPH_MATCHES) {
      results.push({
        post: { title, content: body, toolId, path: filePath },
        score,
        matchingParagraph: bestParagraph.slice(0, 300) + (bestParagraph.length > 300 ? '...' : '') // Truncate
      });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
};

// Backward compatibility alias
export const searchBlogs = searchContent;
