#!/usr/bin/env node
/**
 * Capture README screenshots from the locally running deck.
 * Slides are referenced by 1-based page index in `TARGETS` below; they map to
 * real pages inside index.html. Re-run after every deck overhaul.
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const assetsDir = join(rootDir, 'docs', 'assets');
const BASE_URL = process.env.DECK_BASE_URL || 'http://127.0.0.1:4173';
const VIEWPORT = { width: 1600, height: 900 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1-based page indexes chosen from the current deck. Update if you refactor slides.
const TARGETS = [
  { name: 'cover',         page: 1,  caption: 'Sovereign AI cover' },
  { name: 'agentic-ops',   page: 4,  caption: 'AgenticOps methodology' },
  { name: 'community',     page: 6,  caption: 'Community / honors' },
  { name: 'case-study',    page: 7,  caption: 'Enterprise AI control layer' },
  { name: 'platform',      page: 9,  caption: 'Unified platform overview' },
  { name: 'market',        page: 10, caption: '$4.2T market + sovereign AI' },
  { name: 'business',      page: 12, caption: 'Open-core + enterprise flywheel' },
  { name: 'team',          page: 14, caption: 'Founders & global team' },
  { name: 'revenue',       page: 15, caption: 'Three-engine revenue model' },
  { name: 'product-lineup',page: 25, caption: 'AgenticHub product deep-dive' },
  { name: 'appendix',      page: 32, caption: 'Appendix: city AI platform' },
  { name: 'closing',       page: 38, caption: 'Closing / contact' },
];

async function jumpTo(page, oneBasedIndex) {
  await page.evaluate((idx) => {
    const wraps = [...document.querySelectorAll('.slide-wrap')];
    if (!wraps[idx - 1]) return;
    wraps[idx - 1].scrollIntoView({ behavior: 'instant', block: 'start' });
  }, oneBasedIndex);
  await sleep(900);
}

async function capture(page, name) {
  const path = join(assetsDir, `${name}.png`);
  await page.screenshot({ path, type: 'png' });
  console.log(`📸 ${name}.png`);
}

async function main() {
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('🌐 Loading deck…');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await sleep(1500);

  for (const t of TARGETS) {
    console.log(`➡️  ${t.name} → page #${t.page}`);
    await jumpTo(page, t.page);
    await capture(page, t.name);
  }

  // Toolbar / language switcher full-viewport shot.
  console.log('➡️  ui-toolbar → first viewport');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await sleep(1500);
  await page.screenshot({ path: join(assetsDir, 'ui-toolbar.png'), type: 'png' });

  await browser.close();
  console.log(`\n✨ All screenshots saved to ${assetsDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
