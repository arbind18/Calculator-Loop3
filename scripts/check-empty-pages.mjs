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

pages.forEach(page => {
  const content = fs.readFileSync(page, 'utf8');
  const lines = content.split('\n').length;
  const size = fs.statSync(page).size;
  
  // Check for "empty" indicators
  const isSmall = size < 300; // Less than 300 bytes is very small
  const hasComingSoon = content.toLowerCase().includes('coming soon');
  const hasUnderConstruction = content.toLowerCase().includes('under construction');
  const hasTodo = content.includes('TODO');
  const isEmptyReturn = content.includes('return null') || content.includes('return <></>') || content.includes('return <div></div>');

  if (isSmall || hasComingSoon || hasUnderConstruction || isEmptyReturn) {
    suspiciousPages.push({
      path: page.replace(rootDir, ''),
      reason: [
        isSmall ? 'Small file size' : null,
        hasComingSoon ? '"Coming Soon" text' : null,
        hasUnderConstruction ? '"Under Construction" text' : null,
        isEmptyReturn ? 'Empty return' : null
      ].filter(Boolean).join(', '),
      size,
      lines
    });
  }
});

console.log(JSON.stringify(suspiciousPages, null, 2));
