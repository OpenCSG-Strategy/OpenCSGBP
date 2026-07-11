#!/usr/bin/env node
/** Capture the README's representative slides from a locally running deck. */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const assetsDir = join(rootDir, 'docs', 'assets');
const baseUrl = process.env.DECK_BASE_URL || 'http://127.0.0.1:4173';
const viewport = { width: 1600, height: 900 };
const targets = [
  ['cover', 1], ['agentic-ops', 4], ['community', 6], ['case-study', 7],
  ['platform', 9], ['market', 10], ['business', 12], ['team', 14],
  ['revenue', 15], ['product-lineup', 25], ['appendix', 32], ['closing', 38]
];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function jumpTo(page, pageNumber) {
  await page.evaluate((index) => {
    document.querySelectorAll('.slide-wrap')[index - 1]?.scrollIntoView({
      behavior: 'instant', block: 'start'
    });
  }, pageNumber);
  await wait(900);
}

async function main() {
  fs.mkdirSync(assetsDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await wait(1500);
    for (const [name, pageNumber] of targets) {
      await jumpTo(page, pageNumber);
      await page.screenshot({ path: join(assetsDir, `${name}.png`), type: 'png' });
      console.log(`📸 ${name}.png`);
    }
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: join(assetsDir, 'ui-toolbar.png'), type: 'png' });
    console.log(`✨ Screenshots saved to ${assetsDir}`);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
