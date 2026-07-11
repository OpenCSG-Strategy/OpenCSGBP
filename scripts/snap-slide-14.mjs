import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const lang of ['zh', 'en']) {
    await page.goto('http://127.0.0.1:4173/?lang=' + lang + '#slide-14', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      document.querySelector('#slide-14').scrollIntoView({ block: 'start' });
      const tb = document.querySelector('.toolbar'); if (tb) tb.style.display='none';
      const nv = document.querySelector('.nav'); if (nv) nv.style.display='none';
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/.shots/slide-14-edu-' + lang + '.png', fullPage: false });
    console.log('shot ' + lang);
  }
} finally {
  await browser.close();
}
