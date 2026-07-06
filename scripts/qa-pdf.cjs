#!/usr/bin/env node
/*
 * QA: render the deck at the same viewport Playwright uses for PDF export,
 * then for every slide-wrap capture:
 *  - exact bounding box vs. page viewport
 *  - any horizontal/vertical overflow
 *  - presence of stray text overflow (scrollWidth > clientWidth)
 *  - broken image references
 * Output goes to tmp/qa-pdf/<name>-NN.png plus a JSON summary.
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'tmp', 'qa-pdf');
fs.mkdirSync(out, { recursive: true });
const url = pathToFileURL(path.join(root, 'index.html')).href;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(`${url}?lang=zh`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);

  const summary = await page.evaluate(() => {
    const wraps = [...document.querySelectorAll('.slide-wrap')];
    return wraps.map((w, i) => {
      const r = w.getBoundingClientRect();
      const slide = w.querySelector('.slide');
      const sRect = slide ? slide.getBoundingClientRect() : null;
      return {
        idx: i + 1,
        id: w.querySelector('section')?.id || '',
        wrap: { w: r.width, h: r.height, x: r.x, y: r.y },
        slide: sRect ? { w: sRect.width, h: sRect.height, x: sRect.x, y: sRect.y } : null,
        overflowX: w.scrollWidth - w.clientWidth,
        overflowY: w.scrollHeight - w.clientHeight
      };
    });
  });

  // Render the visible viewport per page (simulating what PDF print sees).
  const total = await page.evaluate(() => document.querySelectorAll('.slide-wrap').length);
  const metrics = [];
  for (let i = 1; i <= total; i++) {
    await page.evaluate((n) => {
      const wraps = [...document.querySelectorAll('.slide-wrap')];
      wraps.forEach((w, idx) => { w.style.display = (idx + 1) === n ? '' : 'none'; });
      window.scrollTo(0, 0);
    }, i);
    await page.waitForTimeout(120);
    const wrap = page.locator('.slide-wrap').first();
    await wrap.screenshot({ path: path.join(out, `slide-${String(i).padStart(2, '0')}.png`) });
    const m = await page.evaluate(() => {
      const w = document.querySelector('.slide-wrap');
      if (!w) return null;
      const r = w.getBoundingClientRect();
      return { w: r.width, h: r.height, sx: w.scrollWidth, sy: w.scrollHeight };
    });
    metrics.push({ page: i, ...m });
  }

  const broken = await page.evaluate(() => [...document.images]
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.src));

  fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify({ summary, metrics, broken, errors }, null, 2));
  console.log('broken images:', broken.length, '| console errors:', errors.length);
  console.log('output:', out);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
