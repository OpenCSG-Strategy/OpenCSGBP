#!/usr/bin/env node
const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');
const root = path.resolve(__dirname, '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto(`${url}?lang=zh`, { waitUntil: 'load' });
  await p.waitForFunction(() => document.querySelectorAll('.slide-wrap').length >= 15);
  await p.waitForTimeout(500);
  const debug = await p.evaluate(() => {
    const wraps = [...document.querySelectorAll('.slide-wrap')];
    return wraps.map((w, i) => {
      const r = w.getBoundingClientRect();
      const s = w.querySelector('.slide');
      const sr = s ? s.getBoundingClientRect() : null;
      return { i: i + 1, wrap: { h: r.height, top: r.top }, slide: sr ? { w: sr.width, h: sr.height, top: sr.top } : null };
    });
  });
  await p.emulateMedia({ media: 'print' });
  const debug2 = await p.evaluate(() => {
    const wraps = [...document.querySelectorAll('.slide-wrap')];
    return {
      docHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      samples: wraps.slice(0, 3).map((w, i) => {
        const r = w.getBoundingClientRect();
        return { i: i + 1, h: r.height, top: r.top };
      })
    };
  });
  console.log('SCREEN', JSON.stringify(debug.slice(0, 4), null, 2));
  console.log('PRINT', JSON.stringify(debug2, null, 2));
  await b.close();
})();
