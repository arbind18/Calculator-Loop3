import fs from 'fs';
import path from 'path';

export type QAItem = {
  id: string;
  q: string;
  a: string;
  topic:
    | 'gst'
    | 'gst-reverse'
    | 'emi'
    | 'compound'
    | 'sip'
    | 'cagr'
    | 'fd'
    | 'rd'
    | 'profit-loss';
  lang: 'hi' | 'en' | 'mix';
  tags?: string[];
};

type LoadedBank = {
  items: QAItem[];
  loadedAtMs: number;
  mtimeMs: number;
};

let cache: LoadedBank | null = null;

const STOPWORDS = new Set([
  // English
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'from', 'by', 'as', 'is', 'are', 'was', 'were',
  'be', 'been', 'it', 'this', 'that', 'these', 'those', 'your', 'you', 'we', 'our', 'please', 'tell', 'calculate',
  // Hindi (roman)
  'kya', 'ka', 'ki', 'ke', 'se', 'me', 'mein', 'mera', 'meri', 'mere', 'aap', 'ap', 'tum', 'hum', 'hai', 'hain',
  'tha', 'thi', 'the', 'hoga', 'hogi', 'kab', 'kaise', 'kitna', 'kitni', 'kyun', 'aur', 'ya', 'par', 'batao', 'nikalo',
]);

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[₹,]/g, ' ')
    .replace(/[^\p{L}\p{N}%]+/gu, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length >= 3)
    .filter((t) => !STOPWORDS.has(t));
};

const jaccard = (a: string[], b: string[]) => {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return inter / union;
};

const loadFinanceBank = (): QAItem[] => {
  const filePath = path.join(process.cwd(), 'src/content/qa/finance.generated.json');
  if (!fs.existsSync(filePath)) return [];

  const stat = fs.statSync(filePath);
  if (cache && cache.mtimeMs === stat.mtimeMs) {
    return cache.items;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as QAItem[];
  cache = {
    items: parsed,
    loadedAtMs: Date.now(),
    mtimeMs: stat.mtimeMs,
  };
  return parsed;
};

export const findBestFinanceQA = (query: string): { item: QAItem; score: number } | null => {
  const items = loadFinanceBank();
  if (items.length === 0) return null;

  const qTokens = tokenize(query);
  if (qTokens.length === 0) return null;

  let best: QAItem | null = null;
  let bestScore = 0;

  for (const item of items) {
    const itemTokens = tokenize(item.q);
    const score = jaccard(qTokens, itemTokens);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  // Keep threshold fairly high to avoid wrong answers.
  if (!best || bestScore < 0.55) return null;
  return { item: best, score: bestScore };
};
