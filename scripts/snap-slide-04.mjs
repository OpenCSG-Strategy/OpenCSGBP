import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  // zh
  await page.goto('http://127.0.0.1:4173/?lang=zh#slide-04', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelector('#slide-04').scrollIntoView({ block: 'start' });
    const tb = document.querySelector('.toolbar'); if (tb) tb.style.display='none';
    const nv = document.querySelector('.nav'); if (nv) nv.style.display='none';
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/.shots/slide-04-zh-v2.png', fullPage: false });
  // en
  await page.goto('http://127.0.0.1:4173/?lang=en#slide-04', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    document.querySelector('#slide-04').scrollIntoView({ block: 'start' });
    const tb = document.querySelector('.toolbar'); if (tb) tb.style.display='none';
    const nv = document.querySelector('.nav'); if (nv) nv.style.display='none';
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/.shots/slide-04-en-v2.png', fullPage: false });
  // opc
  await page.goto('http://127.0.0.1:4173/?lang=zh&mode=opc#slide-04', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const app = document.querySelector('.roadmap-app');
    if (app) app.dataset.mode = 'opc';
    // trigger re-render
    if (window.renderRoadmap) window.renderRoadmap('zh');
    document.querySelector('#slide-04').scrollIntoView({ block: 'start' });
    const tb = document.querySelector('.toolbar'); if (tb) tb.style.display='none';
    const nv = document.querySelector('.nav'); if (nv) nv.style.display='none';
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/.shots/slide-04-opc-v2.png', fullPage: false });
  console.log('all done');
} finally {
  await browser.close();
}
