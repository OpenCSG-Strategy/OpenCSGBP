const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'tmp', 'qa-city');
fs.mkdirSync(out, { recursive: true });
const url = pathToFileURL(path.join(root, 'index.html')).href;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  for (const viewport of [{ width: 1600, height: 900, name: 'desktop' }, { width: 859, height: 759, name: 'compact' }]) {
    const page = await browser.newPage({ viewport });
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`${viewport.name}: ${msg.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`${viewport.name}: ${error.message}`));
    await page.goto(`${url}?lang=zh`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length === 38);
    for (const num of [32, 33, 34, 35, 36, 37]) {
      const slide = page.locator(`#slide-${num}`);
      await slide.screenshot({ path: path.join(out, `${viewport.name}-${num}.png`) });
    }
    const metrics = await page.evaluate(() => ({
      slides: document.querySelectorAll('.slide-wrap').length,
      brokenImages: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
      cityOverflow: [...document.querySelectorAll('#slide-32,#slide-33,#slide-34,#slide-35,#slide-36,#slide-37')]
        .filter((el) => el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2)
        .map((el) => ({ id: el.id, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }))
    }));
    console.log(viewport.name, JSON.stringify(metrics));
    await page.click('#langEn');
    const english = await page.evaluate(() => ({
      residualChinese: [...document.querySelectorAll('#slide-32,#slide-33,#slide-34,#slide-35,#slide-36,#slide-37')]
        .flatMap((slide) => (slide.innerText.match(/[\u3400-\u9fff]+/g) || []))
        .slice(0, 20),
      downloadLabel: document.querySelector('#pdfDownloadBtn')?.textContent,
      exportLabel: document.querySelector('#pdfExportBtn')?.textContent
    }));
    console.log(`${viewport.name}-en`, JSON.stringify(english));
    await page.close();
  }
  await browser.close();
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
