import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/?lang=zh', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const data = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id^="slide-"]')).map(e => e.id);
    return {
      ids: ids.sort(),
      total: document.querySelectorAll('.slide-wrap').length,
      distinctIds: [...new Set(ids)].sort()
    };
  });
  console.log('Total wraps:', data.total, 'all-ids:', data.ids.length, 'distinct:', data.distinctIds.length);
  console.log('IDs:', data.distinctIds.join(', '));
} finally {
  await browser.close();
}
