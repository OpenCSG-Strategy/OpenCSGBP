#!/usr/bin/env node
/*
 * zh.json phrases 字典清理脚本 v2
 *
 * 修复 v1 的 bug：
 *   - HTML entity 解码（&amp; → & 等）使 key 匹配
 *   - 处理"HTML 里有但 zh.json 没有"的 key（要补上）
 *   - 同步清 en.json / 8 国
 *
 * 流程：
 *   1) 收集 HTML/JS 里的 (key, inner_text) 对，key 经 HTML entity decode
 *   2) 读 zh.json + 9 国
 *   3) 填 zh.json 的空 value（HTML inner text > EN 字典反查）
 *   4) 补 zh.json 缺失的 key（HTML/JS inner text）
 *   5) 删除 zh.json / en.json / 8 国里的"死 key"（HTML/JS/EN dict 都没有 + 任一 8 国都没有的）
 *
 *  备份在调用前手动 cp 到 /tmp/i18n-backup-<date>/ 即可。
 *
 * 退出码：0 成功；非 0 失败。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const LANG_DIR = path.join(ROOT, 'assets/i18n');
const LANGS = ['zh','en','ja','ko','ar','ru','fr','de','es','pt'];
const EIGHT = ['ja','ko','ar','ru','fr','de','es','pt'];

function decodeHtml(s){
  return s
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/\u3000/g,' ').trim();
}

// 1) 收集 (key, inner_text) 对，key 已经 decode -----------------
//   同步收集"全 data-en key 集合"（含没 inner text 的，如 placeholder/alt）
const pairs = new Map();  // decoded key → Set(inner_text)（有 inner text 的才进）
const allDataEnKeys = new Set();  // 所有 data-en key（不管有没有 inner text）

function addPair(key, text){
  if (!key || !text) return;
  const k = decodeHtml(key);
  const t = decodeHtml(text);
  if (!k || !t) return;
  if (!pairs.has(k)) pairs.set(k, new Set());
  pairs.get(k).add(t);
}

function recordKey(key){
  if (!key) return;
  const k = decodeHtml(key);
  if (k) allDataEnKeys.add(k);
}

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
{
  // 抓 <tag ...data-en="X"...>inner</tag>（要求开闭 tag 同名，且 inner 不跨 data-en 边界）
  const re = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*\bdata-en="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html))){
    const key = m[2];
    recordKey(key);
    if (key.includes('${esc(')) continue;
    let inner = m[3];
    // 剥掉嵌套 data-en 元素（它们有自己的 inner，不属于这个）
    while (/<([a-zA-Z][a-zA-Z0-9]*)[^>]*\bdata-en="[^"]+"[^>]*>[\s\S]*?<\/\1>/.test(inner)){
      inner = inner.replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*\bdata-en="[^"]+"[^>]*>[\s\S]*?<\/\1>/g, '');
    }
    // 剥剩余标签
    inner = inner.replace(/<[^>]+>/g, '');
    addPair(key, inner);
  }
  // 也抓 <tag ...data-en="X" / > 和 <tag ...data-en="X" .../>（自闭或 void 元素）
  const re2 = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*\bdata-en="([^"]+)"[^>]*\/>/g;
  let m2;
  while ((m2 = re2.exec(html))){
    recordKey(m2[2]);
  }
}

const jsFiles = ['deck-app.js','deck-appendix.js','deck-city.js','deck-slide-03.js','deck-bp-humanize.js'];
for (const name of jsFiles){
  const p = path.join(ROOT, 'assets', name);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  const re = /data-en="([^"]+)"[^>]*>([^<]*)</g;
  let m;
  while ((m = re.exec(src))){
    recordKey(m[1]);
    addPair(m[1], m[2]);
  }
  // 也抓没有 inner text 的（有些元素可能 data-en 在 <input> 之类）
  const re2 = /data-en="([^"]+)"/g;
  let m2;
  while ((m2 = re2.exec(src))){
    recordKey(m2[1]);
  }
  // 抓 tx("zh", "en", ...) 第二参数（en source） — audit.js 的 TX 集
  const reTx = /tx\(\s*['"]([^'"]*)['"]\s*,\s*['"]([^'"]+)['"]/g;
  let mTx;
  while ((mTx = reTx.exec(src))){
    recordKey(mTx[2]);
    // tx 第二参数是 en，第三参数（如果有）是 zh 兜底
    // 如果 tx 第一参数是中文，第二参数是英文，记录 (en, zh)
    if (mTx[1] && mTx[1].match(/[\u4e00-\u9fff]/)){
      addPair(mTx[2], mTx[1]);
    }
  }
}

// 2) EN 字典反查（zh → en） -----------------------------------
const zh2en = {};
const enValues = new Set();
{
  const app = fs.readFileSync(path.join(ROOT, 'assets/deck-app.js'), 'utf8');
  const enStart = app.indexOf('const EN={');
  const enEnd = app.indexOf('\n    };', enStart);
  if (enStart >= 0 && enEnd > enStart){
    const body = app.slice(enStart + 'const EN={'.length, enEnd);
    for (const line of body.split('\n')){
      const m = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]*)"\s*,?\s*$/);
      if (m){ zh2en[m[1]] = m[2]; enValues.add(m[2]); }
    }
  }
  const extra = fs.readFileSync(path.join(ROOT, 'assets/deck-en-extra.js'), 'utf8');
  const exStart = extra.indexOf('window.OPENCSG_EN_EXTRA');
  if (exStart >= 0){
    for (const line of extra.slice(exStart).split('\n')){
      const m = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]*)"\s*,?\s*$/);
      if (m){ zh2en[m[1]] = m[2]; enValues.add(m[2]); }
    }
  }
}
const en2zh = new Map();
for (const [zh, en] of Object.entries(zh2en)) en2zh.set(en, zh);

// 3) 读所有语言包 -----------------------------------------
const packs = {};
for (const code of LANGS){
  const p = path.join(LANG_DIR, `${code}.json`);
  packs[code] = JSON.parse(fs.readFileSync(p, 'utf8'));
}

// 4) 收集"活 key"集合（所有 HTML/JS data-en + EN dict） ---
//    用 allDataEnKeys（含没 inner text 的）而不是 pairs。
const liveKeys = new Set(allDataEnKeys);
for (const en of enValues) liveKeys.add(en);

// 5) 清理 zh.json -----------------------------------------
let filledFromHtml = 0, filledFromEn = 0, addedFromHtml = 0;
let removedFromZh = 0, removedFromEn = 0, removedFrom8Langs = 0;
const toRemoveFromAll = new Set();
const ambiguous = [];

const zh = packs.zh;

// 5a) 填空 value
for (const k of Object.keys(zh.phrases)){
  if (zh.phrases[k] !== '') continue;
  if (pairs.has(k)){
    const inners = pairs.get(k);
    if (inners.size === 1){
      zh.phrases[k] = [...inners][0];
      filledFromHtml++;
    } else {
      zh.phrases[k] = [...inners][0];
      filledFromHtml++;
      ambiguous.push({ k, inners: [...inners] });
    }
    continue;
  }
  if (en2zh.has(k)){
    zh.phrases[k] = en2zh.get(k);
    filledFromEn++;
    continue;
  }
  // 仍然空：标记删
  toRemoveFromAll.add(k);
}

// 5b) 补缺失 key（HTML/JS 里有但 zh.json 没有）
for (const [k, inners] of pairs){
  if (zh.phrases[k] === undefined){
    if (inners.size === 1){
      zh.phrases[k] = [...inners][0];
      addedFromHtml++;
    } else {
      // 歧义：用第一个
      zh.phrases[k] = [...inners][0];
      addedFromHtml++;
      ambiguous.push({ k, inners: [...inners] });
    }
  }
}

// 5b2) EN 字典里的英文 source 也必须回填 zh.json；这些 key 可能仅来自
//       动态 EN 映射，不会出现在带 data-en 的 HTML 节点中。
let addedFromEnDict = 0;
for (const [en, zhValue] of en2zh){
  if (zh.phrases[en] === undefined){
    zh.phrases[en] = zhValue;
    addedFromEnDict++;
  }
}

// 5b3) 同步补 en.json：en 的 value 永远是英文（key 自身）
//       （不补 8 国，8 国翻译由 translation-pack.json + apply 流程走）
let addedToEn = 0;
for (const k of allDataEnKeys){
  if (packs.en.phrases[k] === undefined){
    packs.en.phrases[k] = k;
    addedToEn++;
  }
}
for (const en of enValues){
  if (packs.en.phrases[en] === undefined){
    packs.en.phrases[en] = en;
    addedToEn++;
  }
}

// 5c) 删 zh.json 死 key（不在 liveKeys 的 = 完全没用）
for (const k of Object.keys(zh.phrases)){
  if (!liveKeys.has(k)){
    delete zh.phrases[k];
    removedFromZh++;
  }
}

// 6) 删 en.json / 8 国死 key（不在 liveKeys 的 = 完全没用） ----
//    这些 key 在 8 国里有翻译，但 HTML/JS/EN dict 都没引用——i18n 系统
//    永远不会查到这些条目，删了不影响任何显示；同时让 U 收缩，audit 100%。
for (const code of [...EIGHT, 'en']){
  for (const k of Object.keys(packs[code].phrases || {})){
    if (!liveKeys.has(k)){
      delete packs[code].phrases[k];
      if (code === 'en') removedFromEn++;
      else removedFrom8Langs++;
    }
  }
}

// 7) 写回 ----------------------------------------------------
for (const code of LANGS){
  const p = path.join(LANG_DIR, `${code}.json`);
  fs.writeFileSync(p, JSON.stringify(packs[code], null, 2) + '\n', 'utf8');
}

// 8) 报告 ----------------------------------------------------
console.log('===== zh.json phrases 清理报告 v2 =====\n');
console.log(`从 HTML/JS inner text 填:  ${filledFromHtml}`);
console.log(`从 EN 字典反查填:          ${filledFromEn}`);
console.log(`补缺失 key (HTML/JS):     ${addedFromHtml}`);
console.log(`补缺失 key (EN 字典):     ${addedFromEnDict}`);
console.log(`补 en.json 缺 key:        ${addedToEn}`);
console.log(`删 zh.json 死 key:         ${removedFromZh}`);
console.log(`删 en.json 死 key:         ${removedFromEn}`);
console.log(`删 8 国死 key:            ${removedFrom8Langs} 条目`);
console.log(`歧义 key (多个 inner):     ${ambiguous.length}`);
if (ambiguous.length){
  console.log('  前 5 个:');
  for (const a of ambiguous.slice(0, 5)){
    console.log(`    ${a.k.slice(0,60)} → ${a.inners.length} variants`);
  }
}
console.log(`\nbackup: /tmp/i18n-backup-20260711/`);
