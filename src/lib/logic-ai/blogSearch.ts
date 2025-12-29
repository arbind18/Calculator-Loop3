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

// Helper to recursively get all markdown files
const getFiles = (dir: string): string[] => {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.reduce<string[]>((a, f) => a.concat(f), []);
};

export const searchBlogs = (query: string): SearchResult[] => {
  const blogDir = path.join(process.cwd(), 'src/content/blogs');
  
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = getFiles(blogDir).filter(f => f.endsWith('.md'));
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(' ').filter(t => t.length > 3); // Only significant words

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
      
      queryTerms.forEach(term => {
        if (lowerPara.includes(term)) paraScore += 1;
      });

      if (paraScore > maxParagraphScore) {
        maxParagraphScore = paraScore;
        bestParagraph = para;
      }
    });

    // Scoring logic
    if (title.toLowerCase().includes(lowerQuery)) score += 10;
    score += maxParagraphScore * 2;

    if (score > 0) {
      results.push({
        post: { title, content: body, toolId, path: filePath },
        score,
        matchingParagraph: bestParagraph.slice(0, 300) + (bestParagraph.length > 300 ? '...' : '') // Truncate
      });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
};
