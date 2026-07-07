const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const url = process.env.QA_URL || 'http://127.0.0.1:4173/index.html';
const LANG = process.env.QA_LANG || 'zh';
const outDir = path.resolve(__dirname, '..', '.shots', 'layout-' + LANG);
fs.mkdirSync(outDir, { recursive: true });
const targets = (process.env.SLIDES || '1,9,10,12,19,38').split(',').map(Number);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(`${url}?lang=${LANG}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);
  await page.waitForTimeout(500);
  for (const n of targets) {
    const id = `#slide-${String(n).padStart(2, '0')}`;
    const loc = page.locator(id);
    if (!(await loc.count())) { console.log('missing', id); continue; }
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const f = path.join(outDir, `slide-${String(n).padStart(2, '0')}.png`);
    await loc.screenshot({ path: f }).catch(e => console.log('skip', id, e.message.split('\n')[0]));
    console.log('shot', f);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
