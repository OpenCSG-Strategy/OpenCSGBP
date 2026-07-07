const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const url = process.env.QA_URL || pathToFileURL(path.join(root, 'index.html')).href;
const LANGS = ['en', 'ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));

  await page.goto(`${url}?lang=zh`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);
  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide-wrap').length);
  console.log(`Slides detected: ${slideCount}`);

  for (const lang of LANGS) {
    await page.evaluate(async (l) => { await window.DeckI18n.setLang(l); }, lang);
    // give MutationObserver / reapply a beat
    await page.waitForTimeout(600);
    const report = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.slide-wrap').forEach((slide) => {
        const id = slide.id || '(no-id)';
        // collect visible text nodes containing CJK
        const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const p = node.parentElement;
            if (!p || p.closest('script,style')) return NodeFilter.FILTER_REJECT;
            // skip hidden
            const cs = getComputedStyle(p);
            if (cs.display === 'none' || cs.visibility === 'hidden') return NodeFilter.FILTER_REJECT;
            return /[㐀-鿿]/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        });
        const hits = [];
        while (walker.nextNode()) {
          const t = walker.currentNode.nodeValue.trim();
          if (t) hits.push(t);
        }
        if (hits.length) out.push({ id, hits });
      });
      return out;
    });
    const totalHits = report.reduce((n, r) => n + r.hits.length, 0);
    console.log(`\n===== ${lang.toUpperCase()} : ${totalHits} residual-Chinese text nodes across ${report.length} slides =====`);
    report.forEach((r) => {
      const uniq = [...new Set(r.hits)];
      console.log(`  ${r.id}: ${uniq.slice(0, 12).map((s) => JSON.stringify(s.length > 40 ? s.slice(0, 40) + '…' : s)).join(', ')}${uniq.length > 12 ? ` … (+${uniq.length - 12})` : ''}`);
    });
  }

  if (consoleErrors.length) {
    console.log('\n--- PAGE ERRORS ---');
    console.log([...new Set(consoleErrors)].join('\n'));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
