#!/usr/bin/env node
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { fromPath } = require('pdf2pic');

const pdfPath = process.argv[2] || 'tmp/test_zh_16x9_v3.pdf';
const outDir = process.argv[3] || 'tmp/qa-pdf/pages';
fs.mkdirSync(outDir, { recursive: true });

const converter = fromPath(pdfPath, {
  density: 100,
  format: 'png',
  savePath: outDir,
  saveFilename: 'page'
});
const data = fs.readFileSync(pdfPath);
const size = data.length;
console.log('source size:', size);
const result = await converter.bulk(-1, { responseType: 'image' });
console.log('rendered', result.length, 'pages →', outDir);
