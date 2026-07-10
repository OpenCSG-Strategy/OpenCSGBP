#!/usr/bin/env node
import fs from 'fs';
import { pathToFileURL } from 'url';
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const pdfPath = process.argv[2] || 'tmp/test_zh_16x9_v3.pdf';
const outPath = process.argv[3] || 'tmp/qa-pdf/extract.txt';

const data = new Uint8Array(fs.readFileSync(pdfPath));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true, disableFontFace: true, verbosity: 0 }).promise;
const lines = [];
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
  lines.push(`=== page ${i} (${text.length} chars) ===`);
  lines.push(text.slice(0, 500));
}
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`✔ extracted ${doc.numPages} pages → ${outPath}`);
