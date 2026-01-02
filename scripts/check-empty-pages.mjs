import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '../src/app');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file === 'page.tsx' || file === 'page.js' || file === 'page.jsx') {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const pages = getAllFiles(rootDir);
const suspiciousPages = [];

function hasEmptyDefaultExportReturn(content) {
  // Heuristic: only scan the default export's body (avoid false positives in helper functions)
  const m = content.match(/export\s+default\s+(?:async\s+)?function\s+\w*\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/m);
  const body = m?.[1];
  if (!body) return false;

  return (
    /return\s+null\s*;?/.test(body) ||
    /return\s*<\s*><\s*\/\s*>\s*;?/.test(body) ||
    /return\s*<\s*\/\s*>\s*;?/.test(body) ||
    /return\s*<div\s*><\s*\/div\s*>\s*;?/.test(body) ||
    /return\s*<div\s*\/\s*>\s*;?/.test(body)
  );
}

pages.forEach(page => {
  const content = fs.readFileSync(page, 'utf8');
  const lines = content.split('\n').length;
  const size = fs.statSync(page).size;
  
  // Check for "empty" indicators
  const isSmall = size < 300; // Less than 300 bytes is very small
  const hasComingSoon = content.toLowerCase().includes('coming soon');
  const hasUnderConstruction = content.toLowerCase().includes('under construction');
  const hasTodo = content.includes('TODO');
  const isEmptyReturn = hasEmptyDefaultExportReturn(content);

  if (isSmall || hasComingSoon || hasUnderConstruction || hasTodo || isEmptyReturn) {
    suspiciousPages.push({
      path: page.replace(rootDir, ''),
      reason: [
        isSmall ? 'Small file size' : null,
        hasComingSoon ? '"Coming Soon" text' : null,
        hasUnderConstruction ? '"Under Construction" text' : null,
        hasTodo ? 'TODO marker' : null,
        isEmptyReturn ? 'Empty return' : null
      ].filter(Boolean).join(', '),
      size,
      lines
    });
  }
});

console.log(JSON.stringify(suspiciousPages, null, 2));
