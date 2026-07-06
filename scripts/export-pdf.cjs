#!/usr/bin/env node
/*
 * OpenCSG Investor Deck — Flexible PDF exporter.
 *
 * Renders the deck into a PDF that fits the requested aspect ratio
 * (16:9 / 4:3 / A4 portrait / A4 landscape / Letter landscape).
 * Each page is built by scaling the original 1600x900 design so the
 * layout remains intact regardless of the chosen ratio.
 *
 * Usage examples:
 *   node scripts/export-pdf.cjs
 *   node scripts/export-pdf.cjs --lang=en --ratio=16:9 --sections=cover,main
 *   node scripts/export-pdf.cjs --lang=zh --ratio=a4-landscape --watermark="CONFIDENTIAL"
 *   node scripts/export-pdf.cjs --lang=en --sections=main,case --pages=1,2,5
 *   node scripts/export-pdf.cjs --from=1 --to=10 --ratio=4:3
 *
 * Flags:
 *   --lang=zh|en|ja|ko|ar|ru|fr|de|es|pt
 *                                  Language version (default: zh)
 *   --ratio=16:9|4:3|a4-portrait|a4-landscape|letter-landscape
 *   --sections=cover,main,case,product,appendix
 *                                  Comma-separated section list (default: cover,main,case,product,appendix)
 *   --pages=1,3,5-8               Manual page list (overrides sections if set)
 *   --from=N --to=M               Inclusive page range
 *   --watermark="TEXT"            Diagonal watermark text (empty to disable)
 *   --out=name.pdf                Custom output filename (default auto-generated)
 *   --headless=false              Run Playwright with a visible window
 */

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const htmlUrl = pathToFileURL(path.join(root, 'index.html')).href;

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    if (!arg.startsWith('--')) continue;
    const [key, ...rest] = arg.slice(2).split('=');
    args[key] = rest.length ? rest.join('=') : true;
  }
  return args;
}

const RATIOS = {
  '16:9':             { width: 1600, height: 900,  designW: 1600, designH: 900 },
  '4:3':              { width: 1600, height: 1200, designW: 1600, designH: 1200 },
  'a4-portrait':      { width: 794,  height: 1123, designW: 794,  designH: 1123 },
  'a4-landscape':     { width: 1123, height: 794,  designW: 1123, designH: 794 },
  'letter-landscape': { width: 1100, height: 850,  designW: 1100, designH: 850 }
};

function parseSectionList(raw) {
  if (!raw) return ['cover','main','case','product','appendix'];
  return raw.split(',').map((s) => s.trim()).filter((s) =>
    ['cover','main','case','product','appendix'].includes(s)
  );
}

function parsePageList(raw, total) {
  if (!raw) return null;
  const set = new Set();
  raw.split(/[,\s]+/).forEach((token) => {
    const t = token.trim();
    if (!t) return;
    if (t.includes('-')) {
      const [a, b] = t.split('-').map((v) => parseInt(v, 10));
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
          if (i >= 1 && i <= total) set.add(i);
        }
      }
    } else {
      const n = parseInt(t, 10);
      if (!isNaN(n) && n >= 1 && n <= total) set.add(n);
    }
  });
  return set;
}

function defaultFilename({ lang, ratio, sections }) {
  const langTag = String(lang || 'zh').toUpperCase();
  const ratioTag = ratio.replace(/[:]/g, 'x');
  const allSet = ['cover','main','case','product','appendix'];
  const isAll = sections.length === allSet.length && allSet.every((s) => sections.includes(s));
  const sectionTag = isAll ? '' : `_${sections.sort().join('+')}`;
  return `OpenCSG_Investor_Deck_2026_${langTag}_${ratioTag}${sectionTag}.pdf`;
}

// Inject print-mode CSS that scales the design canvas into the requested ratio.
function buildPrintStyle({ width, height, designW, designH }) {
  const scaleX = width / designW;
  const scaleY = height / designH;
  const scale = Math.min(scaleX, scaleY);
  return `
@page { size: ${width}px ${height}px; margin: 0 }
@media print {
  :root { --print-w: ${width}px; --print-h: ${height}px; --print-scale: ${scale}; }
  html, body { width: ${width}px; margin: 0; padding: 0; background: #fff; }
  .toolbar, .nav, .mobile-reader { display: none !important; }
  .slide-wrap {
    width: ${width}px !important;
    height: ${height}px !important;
    position: relative !important;
    overflow: hidden !important;
    page-break-after: always !important;
    break-after: page !important;
    margin: 0 !important; padding: 0 !important;
    background: #fff !important;
    border: 0 !important;
    display: block !important;
    transform: translateZ(0);
  }
  .slide-wrap:last-of-type { page-break-after: auto !important; break-after: auto !important; }
  .slide-wrap[style*="display: none"] { display: none !important; }
  .slide {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: ${designW}px !important;
    height: ${designH}px !important;
    transform: scale(${scale}) !important;
    transform-origin: top left !important;
    overflow: hidden !important;
    background: #fff !important;
  }
}`;
}

async function exportDeck(browser, options) {
  const ratio = RATIOS[options.ratio] || RATIOS['16:9'];
  const { width, height, designW, designH } = ratio;
  const page = await browser.newPage({ viewport: { width, height } });

  const params = new URLSearchParams();
  params.set('lang', options.lang);
  if (options.sections && options.sections.length && options.sections.length !== 5) {
    params.set('sections', options.sections.join(','));
  }
  if (options.pages) params.set('pages', options.pages);
  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);
  if (options.watermark) params.set('watermark', options.watermark);

  await page.goto(`${htmlUrl}?${params.toString()}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);

  // Inject responsive print CSS that scales the design to fit the chosen ratio.
  await page.addStyleTag({ content: buildPrintStyle(ratio) });

  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? Promise.resolve() : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })
      )
    );
  });

  await page.emulateMedia({ media: 'print' });

  // Determine visible slide indexes by combining section + page filters.
  const visibleIndexes = await page.evaluate(({ sections, pages, from, to }) => {
    const allow = new Set(sections && sections.length ? sections
      : ['cover','main','case','product','appendix']);
    const wraps = [...document.querySelectorAll('.slide-wrap')];
    let indexes = wraps.map((w, i) => ({
      i: i + 1,
      section: w.getAttribute('data-section') || 'main'
    })).filter((s) => allow.has(s.section)).map((s) => s.i);

    // manual page list takes priority
    if (pages) {
      // When a manual page list is provided, it overrides sections entirely.
      indexes = [];
      pages.split(/[,\s]+/).forEach((token) => {
        const t = token.trim();
        if (!t) return;
        if (t.includes('-')) {
          const [a, b] = t.split('-').map((v) => parseInt(v, 10));
          if (!isNaN(a) && !isNaN(b)) {
            for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
              if (i >= 1 && i <= wraps.length) indexes.push(i);
            }
          }
        } else {
          const n = parseInt(t, 10);
          if (!isNaN(n) && n >= 1 && n <= wraps.length) indexes.push(n);
        }
      });
      indexes = [...new Set(indexes)].sort((a, b) => a - b);
    } else if (from || to) {
      // Range filter narrows the section-based selection (intersection).
      const lo = parseInt(from || '1', 10);
      const hi = parseInt(to || String(wraps.length), 10);
      indexes = indexes.filter((n) => n >= lo && n <= hi);
    }
    return indexes;
  }, {
    sections: options.sections,
    pages: options.pages,
    from: options.from,
    to: options.to
  });

  if (visibleIndexes.length === 0) {
    await page.close();
    throw new Error('当前过滤条件没有匹配的幻灯片，请调整 sections / pages / from / to 参数。');
  }

  // Hide non-selected slides.
  await page.evaluate((indexes) => {
    const wrapList = [...document.querySelectorAll('.slide-wrap')];
    wrapList.forEach((w, i) => {
      w.style.display = indexes.includes(i + 1) ? '' : 'none';
    });
  }, visibleIndexes);

  const filename = options.out || defaultFilename(options);
  const output = path.join(root, filename);

  await page.pdf({
    path: output,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  await page.close();
  return { output, pages: visibleIndexes.length, ratio: options.ratio };
}

(async () => {
  const args = parseArgs(process.argv);
  const options = {
    lang: args.lang || 'zh',
    ratio: args.ratio || '16:9',
    sections: parseSectionList(args.sections),
    pages: args.pages || '',
    from: args.from || '',
    to: args.to || '',
    watermark: typeof args.watermark === 'string' ? args.watermark : '',
    out: args.out || '',
    headless: args.headless === undefined ? true : args.headless !== 'false'
  };

  if (!RATIOS[options.ratio]) {
    console.error(`不支持的比例: ${options.ratio}\n可选: ${Object.keys(RATIOS).join(', ')}`);
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: options.headless });
  try {
    const result = await exportDeck(browser, options);
    const size = fs.statSync(result.output).size;
    console.log(`✔ ${result.output}  (${result.pages} 页 · ${result.ratio} · ${(size / 1024).toFixed(1)} KB)`);
  } catch (error) {
    console.error('导出失败:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
