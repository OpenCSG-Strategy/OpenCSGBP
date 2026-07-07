#!/usr/bin/env node
/*
 * i18n phrases 字典修复脚本
 *
 * 步骤：
 *   1) 收集"必须翻译"全集 U（HTML [data-en] / JS tx() / EN 字典）。
 *   2) 对每国语言包 phrases 字典：
 *      - 对 U 中已在 phrases 字典的 key：保留。
 *      - 对 U 中不在的 key：
 *          zh  → 用中文（phrases 字典缺中文时填中文）
 *          en  → 用英文源文（保证切英文也能完整）
 *          其他语言 → 当前版本用英文源文占位（占位条目后续由人工/mmx 翻译）
 *   3) 写回到 assets/i18n/*.json，保留 _meta / toolbar / nav / common / slide03。
 *
 * 注意：本脚本只生成 en / zh 的 phrases，8 国语言仅当 phrases 中已有时保留。
 *        真正缺的 67 个短语需要后续人工或 mmx 翻译补充（见 appendMissingTranslations.js）。
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026';
const LANG_DIR = path.join(ROOT, 'assets/i18n');
const LANGS = ['zh','en','ja','ko','ar','ru','fr','de','es','pt'];

// 收集 S1
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const S1 = new Set();
[...html.matchAll(/data-en="([^"]+)"/g)].forEach(m => {
  if (!m[1].includes('${esc(')) S1.add(m[1]);
});

// deck-*.js 里的 data-en / tx() 第二参数
const jsFiles = ['deck-appendix.js','deck-city-reframe.js','deck-slide03-replica.js'];
jsFiles.forEach(name => {
  const src = fs.readFileSync(path.join(ROOT,'assets',name),'utf8');
  [...src.matchAll(/data-en="([^"]+)"/g)].forEach(m => {
    if (!m[1].includes('${esc(')) S1.add(m[1]);
  });
  [...src.matchAll(/tx\(\s*['"]([^'"]*)['"]\s*,\s*['"]([^'"]*)['"]/g)].forEach(m => S1.add(m[2]));
});

// 把 8 国 phrases 现有 key 也并入 U（保证不丢现存翻译）
LANGS.forEach(code => {
  const j = JSON.parse(fs.readFileSync(path.join(LANG_DIR, `${code}.json`), 'utf8'));
  Object.keys(j.phrases || {}).forEach(k => S1.add(k));
});

// index.html 内的 EN 字典 en 值
const enStart = html.indexOf('const EN={');
const enEnd = html.indexOf('    };', enStart);
const enDictSrc = html.slice(enStart + 'const EN={'.length, enEnd);
enDictSrc.split('\n').forEach(line => {
  const m = line.match(/^\s*"([^"]+)":"([^"]*)"\s*,?\s*$/);
  if (m) S1.add(m[2]);
});

// deck-en-extra.js 里的 EN_EXTRA en 值
const extra = fs.readFileSync(path.join(ROOT, 'assets/deck-en-extra.js'), 'utf8');
extra.replace(/window\.OPENCSG_EN_EXTRA\s*=\s*\{([\s\S]*?)\n\};/, (_, body) => {
  body.split('\n').forEach(line => {
    const m = line.match(/^\s*"([^"]+)":"([^"]*)"\s*,?\s*$/);
    if (m) S1.add(m[2]);
  });
});

console.log(`[gen-phrases] 必须翻译英文源文 S1: ${S1.size} 条`);

// zh → en 反向字典（仅用于 zh.json 的 phrases value）
const zh2en = {};
enDictSrc.split('\n').forEach(line => {
  const m = line.match(/^\s*"([^"]+)":"([^"]*)"\s*,?\s*$/);
  if (m) zh2en[m[1]] = m[2];
});
extra.replace(/window\.OPENCSG_EN_EXTRA\s*=\s*\{([\s\S]*?)\n\};/, (_, body) => {
  body.split('\n').forEach(line => {
    const m = line.match(/^\s*"([^"]+)":"([^"]*)"\s*,?\s*$/);
    if (m) zh2en[m[1]] = m[2];
  });
});

function decodeHtml(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

const U = new Set();
S1.forEach(k => U.add(decodeHtml(k)));

// 读取每个语言包
LANGS.forEach(code => {
  const jsonPath = path.join(LANG_DIR, `${code}.json`);
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const orig = json.phrases || {};

  if (code === 'zh'){
    // zh phrases：key=英文源文（与 8 国对齐），value=中文
    // 1) 原 phrases 全部保留
    // 2) U 中新加的 key：
    //    - 如果 EN 字典的 en 值能映射回 zh，则 value 用中文
    //    - 否则 value 暂时空字符串（兜底用 key 自身——但 key 是英文，这会让中文模式展示英文）
    const newPhrases = { ...orig };
    U.forEach(enKey => {
      if (newPhrases[enKey]) return;
      // 找 en → zh 的映射：先尝试 zh2en 反查
      const zhText = Object.keys(zh2en).find(zh => zh2en[zh] === enKey);
      if (zhText) newPhrases[enKey] = zhText;
      else newPhrases[enKey] = ''; // 占位，待人工翻译
    });
    json.phrases = newPhrases;
  } else if (code === 'en'){
    // en phrases：key=英文源文，value=英文源文本身（保证切英文也能完整）
    const newPhrases = { ...orig };
    U.forEach(enKey => {
      if (newPhrases[enKey]) return;
      newPhrases[enKey] = enKey;
    });
    json.phrases = newPhrases;
  } else {
    // 8 国语言：仅保留 phrases 原有内容，不强行补齐（避免破坏现有翻译）
    // （真正缺的 67 条由 appendMissingTranslations 处理）
  }

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  const cnt = Object.keys(json.phrases || {}).length;
  console.log(`  → ${code}.json: phrases 字段 ${cnt} 条`);
});

console.log('\n[gen-phrases] 完成。zh/en 已补全 phrases，8 国保留现有。');
console.log('[gen-phrases] 接下来请运行 appendMissingTranslations.js 给 8 国补 67 条真正缺的翻译。');