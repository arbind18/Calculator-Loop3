import fs from 'fs';
import path from 'path';

// Import project data (adjust path if your tools data lives elsewhere)
import { toolsData } from '../src/lib/toolsData';
import { getSiteUrl } from '../src/lib/siteUrl';

// Configuration
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps');
const MAX_URLS_PER_SITEMAP = 2000;

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath: string, content: string) {
  const full = path.join(process.cwd(), 'public', relativePath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, 'utf8');
}

function urlEntry(loc: string, lastmod?: string) {
  return `  <url>\n    <loc>${loc}</loc>\n    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}\n  </url>\n`;
}

function sitemapXml(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('')}\n</urlset>`;
}

function sitemapIndexXml(files: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files
    .map((f) => `  <sitemap>\n    <loc>${f}</loc>\n  </sitemap>`)\n    .join('\n')}\n</sitemapindex>`;
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function collectUrls() {
  const urls: Record<string, string[]> = {};

  const site = getSiteUrl();
  const langs = ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'es', 'pt', 'fr', 'de', 'id', 'ar', 'ur', 'ja'];

  // Include a few top-level pages by lang
  langs.forEach((lang) => {
    urls[lang] = [];
    urls[lang].push(`${site}/${lang}/`);
    urls[lang].push(`${site}/${lang}/tools`);
  });

  // Walk toolsData to collect category and calculator URLs
  for (const category of Object.values(toolsData)) {
    // category id and pages
    const categoryId = (category as any).id || (category as any).categoryId || (category as any).slug || '';
    if (!categoryId) continue;

    for (const lang of langs) {
      urls[lang].push(`${site}/${lang}/${categoryId}`);
    }

    // subcategories -> calculators
    const subcats = (category as any).subcategories || [];
    for (const sub of subcats) {
      const calculators = sub.calculators || [];
      for (const calc of calculators) {
        const calcId = calc.id || calc.slug || calc.href || ''; // adapt to your data shape
        if (!calcId) continue;
        for (const lang of langs) {
          urls[lang].push(`${site}/${lang}/${categoryId}/${calcId}`);
        }
      }
    }
  }

  // Deduplicate
  for (const lang of Object.keys(urls)) {
    urls[lang] = Array.from(new Set(urls[lang]));
  }

  return urls;
}

async function main() {
  try {
    ensureDir(OUTPUT_DIR);

    const allUrlsByLang = collectUrls();
    const sitemapFiles: string[] = [];

    for (const [lang, urls] of Object.entries(allUrlsByLang)) {
      const chunks = chunk(urls, MAX_URLS_PER_SITEMAP);
      for (let i = 0; i < chunks.length; i++) {
        const fileName = `sitemap-${lang}-${i + 1}.xml`;
        const filePath = `sitemaps/${fileName}`;
        const xml = sitemapXml(chunks[i].map((u) => urlEntry(u)));
        writeFile(filePath, xml);
        sitemapFiles.push(`${SITE_URL}/${filePath}`);
        console.log(`Wrote ${filePath} (${chunks[i].length} URLs)`);
      }
    }

    // Write sitemap index at /sitemap.xml
    const indexXml = sitemapIndexXml(sitemapFiles);
    writeFile('sitemap.xml', indexXml);
    console.log('Wrote sitemap.xml with', sitemapFiles.length, 'sitemaps');

    // Write robots.txt referencing sitemap index
    const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    writeFile('robots.txt', robots);
    console.log('Wrote robots.txt');
  } catch (err) {
    console.error('Sitemap generation failed:', err);
    process.exit(1);
  }
}

main();
