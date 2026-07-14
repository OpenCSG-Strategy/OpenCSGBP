#!/usr/bin/env node
/*
 * 把 translation-pack.json 写进 8 国语言包 phrases。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LANG_DIR = path.join(ROOT, 'assets/i18n');
const PACK_PATH = path.join(__dirname, 'translation-pack.json');
const pack = JSON.parse(fs.readFileSync(PACK_PATH, 'utf8'));
const TRANSLATIONS = pack.TRANSLATIONS;
const sourceKeys = new Set();
for (const code of ['zh', 'en']) {
  const source = JSON.parse(fs.readFileSync(path.join(LANG_DIR, `${code}.json`), 'utf8'));
  Object.keys(source.phrases || {}).forEach(key => sourceKeys.add(key));
}

const LANGS_8 = ['ja','ko','ar','ru','fr','de','es','pt'];

let total = 0;
LANGS_8.forEach(code => {
  const jsonPath = path.join(LANG_DIR, `${code}.json`);
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  json.phrases = json.phrases || {};
  let added = 0;
  Object.entries(TRANSLATIONS).forEach(([enKey, perLang]) => {
    if (!sourceKeys.has(enKey)) return;
    const val = perLang[code];
    if (val && !json.phrases[enKey]){
      json.phrases[enKey] = val;
      added++;
    } else if (val && json.phrases[enKey] !== val) {
      // 已存在但不一致 → 记录但不覆盖（保守策略，保护已有翻译）
      // 如要强制覆盖，改成 json.phrases[enKey] = val;
    }
  });
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log(`  ${code}.json: 新增 ${added} 条，phrases 总数 ${Object.keys(json.phrases).length}`);
  total += added;
});
console.log(`\n[apply-translations] 共新增 ${total} 条短语到 8 国语言包`);
