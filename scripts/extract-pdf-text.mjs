import fs from 'fs';
import zlib from 'zlib';

// Minimal ASCII85 decoder (Adobe) for data between <~ and ~>
function ascii85Decode(input) {
  let s = input.trim();
  // Remove any whitespace
  s = s.replace(/\s+/g, '');
  // Some PDFs omit <~ ~> markers in stream; handle both.
  if (s.startsWith('<~')) s = s.slice(2);
  if (s.endsWith('~>')) s = s.slice(0, -2);

  const out = [];
  let group = [];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === 'z') {
      if (group.length !== 0) {
        // z is only valid at group boundary
        continue;
      }
      out.push(0, 0, 0, 0);
      continue;
    }
    if (ch === '~') break;
    const code = ch.charCodeAt(0);
    if (code < 33 || code > 117) continue;
    group.push(code - 33);
    if (group.length === 5) {
      let acc = 0;
      for (let j = 0; j < 5; j++) acc = acc * 85 + group[j];
      out.push((acc >>> 24) & 0xff, (acc >>> 16) & 0xff, (acc >>> 8) & 0xff, acc & 0xff);
      group = [];
    }
  }

  if (group.length > 0) {
    // Pad with 'u' (117 -> 84)
    const pad = 5 - group.length;
    for (let i = 0; i < pad; i++) group.push(84);
    let acc = 0;
    for (let j = 0; j < 5; j++) acc = acc * 85 + group[j];
    const bytes = [(acc >>> 24) & 0xff, (acc >>> 16) & 0xff, (acc >>> 8) & 0xff, acc & 0xff];
    // Only output (group.length - 1) bytes
    for (let i = 0; i < 4 - pad; i++) out.push(bytes[i]);
  }

  return Buffer.from(out);
}

function unescapePdfString(str) {
  // Basic PDF string unescape
  return str
    .replace(/\\\\/g, '\\')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f');
}

function extractTextFromDecodedStream(decoded) {
  const text = decoded.toString('latin1');
  const results = [];

  // Extract strings used with Tj operator: (text) Tj
  const tjRe = /\(((?:\\.|[^\\)])*)\)\s*Tj/g;
  let m;
  while ((m = tjRe.exec(text))) {
    const raw = m[1] ?? '';
    const clean = unescapePdfString(raw);
    if (clean.trim()) results.push(clean);
  }

  // Extract TJ arrays: [(a) 120 (b)] TJ
  const tjArrayRe = /\[(.*?)\]\s*TJ/g;
  while ((m = tjArrayRe.exec(text))) {
    const body = m[1] ?? '';
    const parts = [];
    const partRe = /\(((?:\\.|[^\\)])*)\)/g;
    let pm;
    while ((pm = partRe.exec(body))) {
      const raw = pm[1] ?? '';
      const clean = unescapePdfString(raw);
      if (clean) parts.push(clean);
    }
    const combined = parts.join('');
    if (combined.trim()) results.push(combined);
  }

  return results;
}

function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: node scripts/extract-pdf-text.mjs <path-to-pdf>');
    process.exit(1);
  }

  const buf = fs.readFileSync(pdfPath);
  const s = buf.toString('latin1');

  // Find all streams that look like /ASCII85Decode/FlateDecode
  const streamRe = /<</g;
  const streams = [];

  // Very simple: find occurrences of "stream\n...endstream" then look backward for filter
  const blockRe = /(<<[\s\S]{0,400}?\/Filter\s*\[\/ASCII85Decode\s*\/FlateDecode\][\s\S]{0,400}?>>\s*stream\r?\n)([\s\S]*?)(\r?\nendstream)/g;
  let m;
  while ((m = blockRe.exec(s))) {
    streams.push(m[2]);
  }

  // Also support /Filter/ASCII85Decode (single) with Flate later (rare in this file, but keep)
  const blockRe2 = /(<<[\s\S]{0,400}?\/Filter\s*\/ASCII85Decode[\s\S]{0,400}?>>\s*stream\r?\n)([\s\S]*?)(\r?\nendstream)/g;
  while ((m = blockRe2.exec(s))) {
    streams.push(m[2]);
  }

  const allText = [];

  for (const rawStream of streams) {
    try {
      const a85 = ascii85Decode(rawStream);
      let inflated;
      try {
        inflated = zlib.inflateSync(a85);
      } catch {
        // Some streams might already be inflated or not flate
        continue;
      }
      const extracted = extractTextFromDecodedStream(inflated);
      allText.push(...extracted);
    } catch {
      // ignore
    }
  }

  // De-dup while preserving order
  const seen = new Set();
  const unique = [];
  for (const t of allText) {
    const key = t.replace(/\s+/g, ' ').trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(key);
  }

  console.log(unique.join('\n'));
}

main();
