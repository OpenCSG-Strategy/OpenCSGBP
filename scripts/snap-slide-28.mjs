import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const lang of ['zh', 'en']) {
    for (const [name, num] of [['27', 27], ['28', 28], ['29', 29]]) {
      await page.goto('http://127.0.0.1:4173/?lang=' + lang + '#slide-' + String(num).padStart(2, '0'), { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await page.evaluate(() => {
        const tb = document.querySelector('.toolbar'); if (tb) tb.style.display='none';
        const nv = document.querySelector('.nav'); if (nv) nv.style.display='none';
      });
      await page.waitForTimeout(300);
      await page.screenshot({ path: `/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/.shots/slide-${name}-${lang}.png`, fullPage: false });
    }
    console.log('shot ' + lang);
  }
  const total = await page.evaluate(() => document.querySelectorAll('.slide-wrap').length);
  console.log('total slide-wraps:', total);
} finally {
  await browser.close();
}
