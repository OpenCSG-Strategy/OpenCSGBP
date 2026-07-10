const path = require('path');
const { chromium } = require('playwright');
const url = process.env.QA_URL || 'http://127.0.0.1:4173/index.html';
const LANG = process.env.QA_LANG || 'zh';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`${url}?lang=${LANG}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);
  await page.waitForTimeout(600);

  const findings = await page.evaluate(() => {
    const TOL = 2; // px tolerance in slide-space
    const out = [];
    document.querySelectorAll('.slide-wrap').forEach((wrap, i) => {
      const slide = wrap.querySelector('.slide');
      if (!slide) return;
      const idx = i + 1;
      const label = slide.id || `wrap#${idx}`;
      // scale factor of this slide
      const sr = slide.getBoundingClientRect();
      const scale = sr.width / 1600 || 1;
      const sTop = sr.top, sLeft = sr.left;
      // slide-space converter
      const toSlide = (r) => ({
        left: (r.left - sLeft) / scale,
        top: (r.top - sTop) / scale,
        right: (r.right - sLeft) / scale,
        bottom: (r.bottom - sTop) / scale,
        w: r.width / scale,
        h: r.height / scale,
      });

      // 1) slide content overflow (clipped)
      const overflow = { x: slide.scrollWidth - 1600, y: slide.scrollHeight - 900 };

      // 2) per-element overflow beyond 1600x900 (visible, has text/box)
      const overflowEls = [];
      const overlapPairs = [];
      const boxes = [];
      slide.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        const b = toSlide(r);
        const txt = (el.childElementCount === 0 ? el.textContent.trim() : '').slice(0, 30);
        // overflow beyond slide bounds
        const over = [];
        if (b.right > 1600 + TOL) over.push(`right+${Math.round(b.right - 1600)}`);
        if (b.bottom > 900 + TOL) over.push(`bottom+${Math.round(b.bottom - 900)}`);
        if (b.left < -TOL) over.push(`left${Math.round(b.left)}`);
        if (b.top < -TOL) over.push(`top${Math.round(b.top)}`);
        if (over.length && (txt || el.matches('img,svg,.card,[class*=card],[class*=box],[class*=chip],[class*=tag]'))) {
          overflowEls.push({ tag: el.tagName.toLowerCase(), cls: el.className.toString().slice(0, 40), over: over.join(','), txt });
        }
        // collect leaf text boxes for overlap check
        if (el.childElementCount === 0 && txt) boxes.push({ b, txt, cls: el.className.toString().slice(0, 30) });
      });

      // 3) overlap among leaf text boxes (significant area intersection)
      for (let a = 0; a < boxes.length; a++) {
        for (let c = a + 1; c < boxes.length; c++) {
          const A = boxes[a].b, B = boxes[c].b;
          const ix = Math.min(A.right, B.right) - Math.max(A.left, B.left);
          const iy = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (ix > 3 && iy > 3) {
            const inter = ix * iy;
            const minArea = Math.min(A.w * A.h, B.w * B.h);
            if (minArea > 0 && inter / minArea > 0.35) {
              overlapPairs.push({ a: boxes[a].txt, b: boxes[c].txt, pct: Math.round(inter / minArea * 100) });
            }
          }
        }
      }

      if (overflow.x > TOL || overflow.y > TOL || overflowEls.length || overlapPairs.length) {
        out.push({ idx, label, overflow, overflowEls: overflowEls.slice(0, 8), overlapPairs: overlapPairs.slice(0, 6) });
      }
    });
    return out;
  });

  console.log(`LANG=${LANG} — ${findings.length} slides with issues:\n`);
  findings.forEach((f) => {
    console.log(`SLIDE ${f.idx} (${f.label})`);
    if (f.overflow.x > 2 || f.overflow.y > 2) console.log(`  ⤢ content overflow: x=${f.overflow.x} y=${f.overflow.y}`);
    f.overflowEls.forEach((e) => console.log(`  ↗ overflow [${e.over}] <${e.tag} .${e.cls}> ${JSON.stringify(e.txt)}`));
    f.overlapPairs.forEach((p) => console.log(`  ✕ overlap ${p.pct}%: ${JSON.stringify(p.a)} ∩ ${JSON.stringify(p.b)}`));
    console.log('');
  });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
