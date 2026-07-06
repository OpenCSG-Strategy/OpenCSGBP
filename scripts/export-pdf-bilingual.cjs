#!/usr/bin/env node
/*
 * Bilingual exporter — runs the regular exporter for ZH then EN,
 * and writes both filenames so the user can download either or both.
 *
 * Usage:
 *   node scripts/export-pdf-bilingual.cjs [--ratio=16:9] [--sections=cover,main] ...
 */

const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const script = path.join(__dirname, 'export-pdf.cjs');

function run(lang, args) {
  const finalArgs = ['--lang', lang, ...args];
  console.log(`\n→ Exporting ${lang.toUpperCase()}...`);
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