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
const http = require('http');
const os = require('os');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
// pdf-lib is optional; the exporter will fall back to a single-pass page.pdf()
// render if it can't be loaded.
let PDFLib = null;
try { PDFLib = require('pdf-lib'); } catch (_) { PDFLib = null; }

const root = path.resolve(__dirname, '..');
let ownedStaticServer = null;

// We must serve the deck over HTTP so that `fetch('assets/i18n/*.json')` works;
// Chromium refuses to fetch file:// URLs from a file:// document. When the user
// doesn't supply a DECK_BASE_URL, we spin up a tiny static server for the
// duration of the export and tear it down on exit.
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function createStaticServer(directory) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0] || '/');
    const safe = urlPath === '/' ? '/index.html' : urlPath;
    const resolved = path.resolve(directory, `.${safe}`);
    if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    fs.stat(resolved, (err, stat) => {
      if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(resolved).toLowerCase()] || 'application/octet-stream',
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(resolved).pipe(res);
    });
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function resolveHtmlUrl() {
  if (process.env.DECK_BASE_URL) {
    return process.env.DECK_BASE_URL.replace(/\/$/, '') + '/index.html';
  }
  const { server, baseUrl } = await createStaticServer(root);
  ownedStaticServer = server;
  process.on('exit', () => { try { server.close(); } catch (_) {} });
  process.on('SIGINT', () => { server.close(() => process.exit(130)); });
  return baseUrl + '/index.html';
}
let htmlUrlPromise = null;
function getHtmlUrl() {
  if (!htmlUrlPromise) htmlUrlPromise = resolveHtmlUrl();
  return htmlUrlPromise;
}

function closeOwnedStaticServer() {
  if (!ownedStaticServer) return Promise.resolve();
  const server = ownedStaticServer;
  ownedStaticServer = null;
  return new Promise((resolve) => server.close(() => resolve()));
}

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
// We deliberately reuse the centering rules already present in the page's
// own `@media print` block (left:50%/top:50% + negative margin) and only
// override the size, scale and page-break behaviour. Trying to relayout
// `.slide` from scratch breaks all the inline left/top positioning of
// children (cards, labels, the AgenticOps infinity loop, etc.).
function buildPrintStyle({ width, height, designW, designH }) {
  const scaleX = width / designW;
  const scaleY = height / designH;
  const isNativeWideDeck = width === 1600 && height === 900 && designW === 1600 && designH === 900;
  const pdfSafeScale = isNativeWideDeck ? 0.965 : 1;
  const yOffset = isNativeWideDeck ? '-10px' : '0px';
  const scale = Math.min(scaleX, scaleY) * pdfSafeScale;
  return `
@page { size: ${width}px ${height}px; margin: 0 }
@media print {
  :root { --print-w: ${width}px; --print-h: ${height}px; --print-scale: ${scale}; --print-y-offset: ${yOffset}; }
  html, body { width: ${width}px; height: ${height}px; margin: 0; padding: 0; background: #fff; overflow: hidden; }
  .toolbar, .nav, .mobile-reader { display: none !important; }
  .slide-wrap {
    width: ${width}px !important;
    height: ${height}px !important;
    page-break-after: always !important;
    break-after: page !important;
    break-inside: avoid !important;
    contain: layout paint size !important;
    transform: translateZ(0) !important;
  }
  .slide-wrap:last-of-type { page-break-after: auto !important; break-after: auto !important; }
  .slide-wrap[style*="display: none"], .slide-wrap.short-hidden, .slide-wrap[data-section="appendix"]:not(:has(#slide-40)) { display: none !important; }
  /* Keep the 1600x900 design canvas centered inside the new ratio even
     when the page is no longer 16:9. Use translate(-50%,-50%) to center
     before scaling so the design stays anchored to the page center. */
  .slide {
    left: 50% !important;
    top: calc(50% + var(--print-y-offset)) !important;
    width: ${designW}px !important;
    height: ${designH}px !important;
    margin: 0 !important;
    transform: translate(-50%, -50%) scale(var(--print-scale)) !important;
    transform-origin: center center !important;
  }
}`;
}

async function exportDeck(browser, options) {
  const ratio = RATIOS[options.ratio] || RATIOS['16:9'];
  const { width, height, designW, designH } = ratio;
  // We always render at the *design* resolution so the slide canvas is 1:1
  // and never sub-pixel. The output PDF still uses the requested ratio.
  const page = await browser.newPage({ viewport: { width: designW, height: designH } });

  const params = new URLSearchParams();
  params.set('lang', options.lang);
  if (options.sections && options.sections.length && options.sections.length !== 5) {
    params.set('sections', options.sections.join(','));
  }
  if (options.pages) params.set('pages', options.pages);
  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);
  await page.goto(`${await getHtmlUrl()}?${params.toString()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load');
  // Wait for i18n to finish loading AND for the i18n 'ready' event before
  // we attempt to take a snapshot, otherwise English / non-zh exports will
  // be missing translated copy and fall back to Chinese placeholders.
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap:not(.short-hidden):not([data-section="appendix"]), .slide-wrap[data-section="appendix"]:has(#slide-40)').length >= 1);
  await page.waitForFunction(() => Boolean(window.__i18nReady || document.documentElement.lang), null, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(400);

  // Ensure the exported PDF has exactly one watermark source: the current
  // CLI/server option. Do not rely on page query flags or previous page state,
  // because those can leave stale watermark text in cached/local browser state.
  await page.evaluate((watermark) => {
    const text = String(watermark || '').trim();
    document.body.classList.toggle('watermark', Boolean(text));
    document.querySelectorAll('.slide-wrap').forEach((wrap) => {
      wrap.setAttribute('data-watermark-text', text);
    });
  }, options.watermark);

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
    const wraps = [...document.querySelectorAll('.slide-wrap:not(.short-hidden):not([data-section="appendix"]), .slide-wrap[data-section="appendix"]:has(#slide-40)')];
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
    const wrapList = [...document.querySelectorAll('.slide-wrap:not(.short-hidden):not([data-section="appendix"]), .slide-wrap[data-section="appendix"]:has(#slide-40)')];
    wrapList.forEach((w, i) => {
      w.style.display = indexes.includes(i + 1) ? '' : 'none';
    });
  }, visibleIndexes);

  const filename = options.out || defaultFilename(options);
  const output = path.join(root, filename);

  // Strategy A: render each visible slide-wrap to a PNG via Playwright, then
  // assemble a multi-page PDF with pdf-lib. This avoids the long-standing
  // Playwright bug where `page.pdf()` collapses a print-emulated document
  // into a single page when the @page size matches the viewport.
  if (PDFLib && PDFLib.PDFDocument) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opencsg-pdf-'));
    try {
      const pngPaths = [];
      for (let k = 0; k < visibleIndexes.length; k++) {
        const idx = visibleIndexes[k];
        // Reveal only the k-th visible slide.
        await page.evaluate((targetIdx) => {
          const wrapList = [...document.querySelectorAll('.slide-wrap:not(.short-hidden):not([data-section="appendix"]), .slide-wrap[data-section="appendix"]:has(#slide-40)')];
          wrapList.forEach((w, i) => {
            w.style.display = (i + 1) === targetIdx ? '' : 'none';
          });
          window.scrollTo(0, 0);
        }, idx);
        await page.waitForTimeout(80);
        const pngPath = path.join(tmpDir, `slide-${String(k + 1).padStart(3, '0')}.png`);
        // Use the print stylesheet layout (16:9 ish), screenshot the viewport.
        await page.screenshot({ path: pngPath, type: 'png', fullPage: false });
        pngPaths.push(pngPath);
      }

      // Restore all selected slides for a clean shutdown.
      await page.evaluate((indexes) => {
        const wrapList = [...document.querySelectorAll('.slide-wrap:not(.short-hidden):not([data-section="appendix"]), .slide-wrap[data-section="appendix"]:has(#slide-40)')];
        wrapList.forEach((w, i) => {
          w.style.display = indexes.includes(i + 1) ? '' : 'none';
        });
      }, visibleIndexes);

      const pdfDoc = await PDFLib.PDFDocument.create();
      for (const pngPath of pngPaths) {
        const bytes = fs.readFileSync(pngPath);
        const img = await pdfDoc.embedPng(bytes);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }
      const out = await pdfDoc.save();
      fs.writeFileSync(output, out);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (err) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      throw err;
    }
  } else {
    // Fallback: single page.pdf() call (may produce 1 page only).
    await page.pdf({
      path: output,
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
  }

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
    process.exitCode = 1;
  } finally {
    await browser.close();
    await closeOwnedStaticServer();
  }
})();
