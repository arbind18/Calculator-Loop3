import fs from 'fs';
import path from 'path';
import { toolsData } from '../src/lib/toolsData';
import { getSiteUrl } from '../src/lib/siteUrl';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sitemaps');
const MAX_URLS_PER_SITEMAP = 2000;
const SITE_URL = getSiteUrl();

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relativePath: string, content: string) {
  const full = path.join(process.cwd(), 'public', relativePath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, 'utf8');
}

function buildUrlEntry(loc: string): string {
  let s = '  <url>\n';
  s += '    <loc>' + loc + '</loc>\n';
  s += '  </url>\n';
  return s;
}

function buildSitemapXml(urlStrings: string[]): string {
  let s = '<?xml version="1.0" encoding="UTF-8"?>\n';
  s += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urlStrings) {
    s += url;
  }
  s += '</urlset>';
  return s;
}

function buildSitemapIndexXml(files: string[]): string {
  let s = '<?xml version="1.0" encoding="UTF-8"?>\n';
  s += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const f of files) {
    s += '  <sitemap>\n';
    s += '    <loc>' + f + '</loc>\n';
    s += '  </sitemap>\n';
  }
  s += '</sitemapindex>';
  return s;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

function collectUrls(): Record<string, string[]> {
  const urls: Record<string, string[]> = {};
  const langs = ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu', 'es', 'pt', 'fr', 'de', 'id', 'ar', 'ur', 'ja'];

  for (const lang of langs) {
    urls[lang] = [];
    urls[lang].push(SITE_URL + '/' + lang + '/');
    urls[lang].push(SITE_URL + '/' + lang + '/tools');
  }

  for (const [categoryId, category] of Object.entries(toolsData)) {
    if (!categoryId) continue;

    for (const lang of langs) {
      urls[lang].push(SITE_URL + '/' + lang + '/' + categoryId);
    }

    const subcats = (category as any).subcategories || {};
    for (const sub of Object.values(subcats)) {
      const calculators = (sub as any).calculators || [];
      for (const calc of calculators) {
        const calcId = (calc as any).id || (calc as any).slug || '';
        if (!calcId) continue;
        for (const lang of langs) {
          urls[lang].push(SITE_URL + '/' + lang + '/' + categoryId + '/' + calcId);
        }
      }
    }
  }

  for (const lang of Object.keys(urls)) {
    urls[lang] = Array.from(new Set(urls[lang]));
  }

  return urls;
}

function main(): void {
  try {
    ensureDir(OUTPUT_DIR);

    const allUrlsByLang = collectUrls();
    const sitemapFiles: string[] = [];

    for (const [lang, urlList] of Object.entries(allUrlsByLang)) {
      const chunks = chunk(urlList, MAX_URLS_PER_SITEMAP);
      for (let i = 0; i < chunks.length; i++) {
        const fileName = 'sitemap-' + lang + '-' + (i + 1) + '.xml';
        const filePath = 'sitemaps/' + fileName;
        const urlEntries = chunks[i].map((u) => buildUrlEntry(u));
        const xml = buildSitemapXml(urlEntries);
        writeFile(filePath, xml);
        sitemapFiles.push(SITE_URL + '/' + filePath);
        console.log('Wrote ' + filePath + ' (' + chunks[i].length + ' URLs)');
      }
    }

    const indexXml = buildSitemapIndexXml(sitemapFiles);
    writeFile('sitemap.xml', indexXml);
    console.log('Wrote sitemap.xml with ' + sitemapFiles.length + ' sitemaps');

    const robots = 'User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + '/sitemap.xml\n';
    writeFile('robots.txt', robots);
    console.log('Wrote robots.txt');
  } catch (err) {
    console.error('Sitemap generation failed:', err);
    process.exit(1);
  }
}

main();
