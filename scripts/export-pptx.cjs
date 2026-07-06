#!/usr/bin/env node
/*
 * OpenCSG Investor Deck → Image-based PPTX exporter.
 *
 * Renders each selected slide to a PNG via Playwright, then packs every
 * slide into a single PPTX where each slide is a full-bleed image.
 * Convenient for sharing / importing into PowerPoint / Keynote while
 * preserving exact layout & typography.
 *
 * Usage examples:
 *   node scripts/export-pptx.cjs
 *   node scripts/export-pptx.cjs --lang=en --ratio=16:9
 *   node scripts/export-pptx.cjs --lang=zh --sections=cover,main --watermark="DRAFT"
 *   node scripts/export-pptx.cjs --from=1 --to=10 --ratio=4:3
 *   node scripts/export-pptx.cjs --ratio=a4-landscape --file=OpenCSG_Deck_Lite.pptx
 *
 * Requires: pptxgenjs (installed automatically on first run via the
 * project's `package.json` dependencies below).
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
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
  '16:9':             { width: 1600, height: 900 },
  '4:3':              { width: 1600, height: 1200 },
  'a4-portrait':      { width: 794,  height: 1123 },
  'a4-landscape':     { width: 1123, height: 794 },
  'letter-landscape': { width: 1100, height: 850 }
};

const SECTION_PRESETS = {
  all:     ['cover','main','case','product','appendix'],
  main:    ['cover','main'],
  core:    ['cover','main'],
  product: ['product'],
  case:    ['case'],
  appendix:['appendix']
};

function defaultFilename({ lang, ratio, sections }) {
  const langTag = lang === 'en' ? 'EN' : 'ZH';
  const ratioTag = ratio.replace(/[:]/g, 'x');
  const allSet = ['cover','main','case','product','appendix'];
  const isAll = sections.length === allSet.length && allSet.every((s) => sections.includes(s));
  const sectionTag = isAll ? '' : `_${sections.sort().join('+')}`;
  return `OpenCSG_Investor_Deck_2026_${langTag}_${ratioTag}${sectionTag}.pptx`;
}

async function selectSlides(page, options) {
  return page.evaluate(({ sections, pages, from, to }) => {
    const allow = new Set(sections && sections.length
      ? sections
      : ['cover','main','case','product','appendix']);

    const wraps = [...document.querySelectorAll('.slide-wrap')];
    let indexes = wraps.map((w, i) => ({
      i: i + 1,
      section: w.getAttribute('data-section') || 'main'
    })).filter((s) => allow.has(s.section)).map((s) => s.i);

    if (pages) {
      // Manual page list overrides sections entirely.
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
}

async function captureSlides(browser, options) {
  const { width, height } = RATIOS[options.ratio] || RATIOS['16:9'];
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });

  const params = new URLSearchParams();
  params.set('lang', options.lang);
  if (options.section && options.section !== 'all') params.set('section', options.section);
  if (options.pages) params.set('pages', options.pages);
  if (options.from) params.set('from', options.from);
  if (options.to) params.set('to', options.to);
  if (options.watermark) params.set('watermark', options.watermark);

  await page.goto(`${htmlUrl}?${params.toString()}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);

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

  const indexes = await selectSlides(page, options);
  if (indexes.length === 0) {
    await page.close();
    throw new Error('当前过滤条件没有匹配的幻灯片，请调整 section / pages / from / to 参数。');
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opencsg-pptx-'));
  const captures = [];

  for (const idx of indexes) {
    // Scroll target slide into view to ensure the responsive scaling kicks in.
    await page.evaluate((target) => {
      const wrapList = [...document.querySelectorAll('.slide-wrap')];
      const el = wrapList[target - 1];
      if (el) el.scrollIntoView({ block: 'start' });
    }, idx);
    await page.waitForTimeout(400);
    await page.evaluate((target) => {
      const wrapList = [...document.querySelectorAll('.slide-wrap')];
      const el = wrapList[target - 1];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.position = 'fixed';
      el.style.left = '0';
      el.style.top = '0';
      el.style.width = '1600px';
      el.style.height = '900px';
      el.style.transform = 'none';
      el.style.zIndex = '99999';
      // Hide all other slides during the screenshot.
      wrapList.forEach((w, i) => {
        if (i + 1 !== target) {
          w.dataset._prevDisplay = w.style.display;
          w.style.display = 'none';
        }
      });
    }, idx);

    const file = path.join(tmpDir, `slide-${String(idx).padStart(2, '0')}.png`);
    const target = await page.$('.slide-wrap:not([style*="display: none"])');
    if (!target) {
      await page.close();
      throw new Error(`未找到第 ${idx} 张幻灯片元素。`);
    }
    await target.screenshot({ path: file, type: 'png', omitBackground: false });
    captures.push({ index: idx, file });

    // Restore layout so the next iteration scrolls cleanly.
    await page.evaluate(() => {
      const wrapList = [...document.querySelectorAll('.slide-wrap')];
      wrapList.forEach((w) => {
        w.style.position = '';
        w.style.left = '';
        w.style.top = '';
        w.style.width = '';
        w.style.height = '';
        w.style.transform = '';
        w.style.zIndex = '';
        if (w.dataset._prevDisplay !== undefined) {
          w.style.display = w.dataset._prevDisplay;
          delete w.dataset._prevDisplay;
        }
      });
    });
  }

  await page.close();
  return { captures, width, height, tmpDir };
}

async function buildPptx({ captures, width, height, tmpDir, options, output }) {
  let pptxgen;
  try {
    pptxgen = require('pptxgenjs');
  } catch (error) {
    console.error('缺少依赖 pptxgenjs。请先运行：npm install pptxgenjs --save-dev');
    throw error;
  }

  const pptx = new pptxgen();
  pptx.author = 'OpenCSG';
  pptx.company = 'OpenCSG';
  pptx.subject = 'Investor Deck 2026';
  pptx.title = `OpenCSG Investor Deck 2026 (${options.lang.toUpperCase()})`;
  // PPTX uses inches; EMU per inch = 914400.
  const widthIn = width / 96;
  const heightIn = height / 96;
  pptx.defineLayout({ name: 'OPENCSG_DECK', width: widthIn, height: heightIn });
  pptx.layout = 'OPENCSG_DECK';

  for (const { file, index } of captures) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addImage({
      path: file,
      x: 0,
      y: 0,
      w: widthIn,
      h: heightIn,
      sizing: { type: 'cover', w: widthIn, h: heightIn }
    });
    slide.addNotes(`Slide ${index} · ${options.lang.toUpperCase()} · ratio=${options.ratio}`);
  }

  await pptx.writeFile({ fileName: output });
}

(async () => {
  const args = parseArgs(process.argv);
  const options = {
    lang: args.lang || 'zh',
    ratio: args.ratio || '16:9',
    sections: args.sections
      ? args.sections.split(',').map((s) => s.trim()).filter((s) => ['cover','main','case','product','appendix'].includes(s))
      : ['cover','main','case','product','appendix'],
    pages: args.pages || '',
    from: args.from || '',
    to: args.to || '',
    watermark: typeof args.watermark === 'string' ? args.watermark : '',
    file: args.file || ''
  };

  if (!RATIOS[options.ratio]) {
    console.error(`不支持的比例: ${options.ratio}\n可选: ${Object.keys(RATIOS).join(', ')}`);
    process.exit(2);
  }

  const filename = options.file || defaultFilename({ ...options, sections: options.sections });
  const output = path.join(root, filename);

  const browser = await chromium.launch({ headless: true });
  try {
    console.log(`▶ Rendering ${options.lang.toUpperCase()} slides (${options.ratio}, ${options.sections.join('+')})...`);
    const result = await captureSlides(browser, options);
    console.log(`▶ Packing ${result.captures.length} images into PPTX...`);
    await buildPptx({
      captures: result.captures,
      width: result.width,
      height: result.height,
      tmpDir: result.tmpDir,
      options,
      output
    });
    const size = fs.statSync(output).size;
    console.log(`✔ ${output}  (${result.captures.length} 页 · ${options.ratio} · ${(size / 1024 / 1024).toFixed(2)} MB)`);
    // Clean tmp.
    fs.rmSync(result.tmpDir, { recursive: true, force: true });
  } catch (error) {
    console.error('导出失败:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();