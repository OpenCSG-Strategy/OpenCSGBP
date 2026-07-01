const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'preview-slide-01-new.png' });
  
  // Go to slide 2
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'preview-slide-02-new.png' });

  // Go to slide 4
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'preview-slide-04-new.png' });
  
  await browser.close();
})();
