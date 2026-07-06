#!/usr/bin/env node
/*
 * Bilingual PPTX exporter — runs export-pptx.cjs twice (ZH + EN).
 * Usage:
 *   node scripts/export-pptx-bilingual.cjs [--ratio=16:9] [--sections=cover,main] ...
 */

const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const script = path.join(__dirname, 'export-pptx.cjs');

function run(lang, args) {
  const finalArgs = ['--lang', lang, ...args];
  console.log(`\n→ Exporting ${lang.toUpperCase()} PPTX...`);
  const res = spawnSync(process.execPath, [script, ...finalArgs], {
    cwd: root,
    stdio: 'inherit'
  });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

const args = process.argv.slice(2);
run('zh', args);
run('en', args);