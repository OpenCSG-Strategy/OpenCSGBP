import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const lang of ['zh', 'en']) {
    await page.goto('http://127.0.0.1:4173/?lang=' + lang, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const tb = document.querySelector('.toolbar'); if (tb) tb.style.display='none';
      const nv = document.querySelector('.nav'); if (nv) nv.style.display='none';
    });
    for (const num of [27, 28, 29]) {
      await page.evaluate((n) => {
        const s = document.querySelector('#slide-' + String(n).padStart(2, '0'));
        if (s) s.scrollIntoView({ block: 'start' });
      }, num);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/.shots/slide-${num}-${lang}.png`, fullPage: false });
    }
    console.log('shot ' + lang);
  }
} finally {
  await browser.close();
}
