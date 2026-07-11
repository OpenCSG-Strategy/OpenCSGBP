#!/usr/bin/env node
/*
 * i18n 体检脚本
 *
 * 用途：扫描 HTML/JS 中所有需要翻译的文本（[data-en] / OPENCSG_EN / tx()），
 *      对照 8 国语言包的 phrases 字典，输出每国语言的覆盖率报告。
 *
 *  输出：把"必须翻译"列表（en 源文）、"8 国差异"和"全语言都缺的 key"写到
 *        /tmp/i18n-audit/。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const OUT  = '/tmp/i18n-audit';
fs.mkdirSync(OUT, { recursive: true });

const LANG_DIR = path.join(ROOT, 'assets/i18n');
const LANGS = ['zh','en','ja','ko','ar','ru','fr','de','es','pt'];

// 1) 收集 [data-en] 属性 -----------------------------------------------
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dataEnAttrs = [...html.matchAll(/data-en="([^"]*)"/g)].map(m => m[1]);
//   过滤 JS 模板变量（${xxx}）和空字符串——它们不是真要翻译的文本
function isTemplateOrEmpty(s){
  if (!s || !s.trim()) return true;
  if (/\$\{[^}]+\}/.test(s)) return true;  // 含 ${...} 的都是模板
  return false;
}
const dataEn = [...new Set(dataEnAttrs)].filter(s => !isTemplateOrEmpty(s));

// 2) 收集 deck-app.js 内的 OPENCSG_EN 字典（const EN={...}）------------
const app = fs.readFileSync(path.join(ROOT, 'assets/deck-app.js'), 'utf8');
const enStart = app.indexOf('const EN={');
const enEndMarker = '    };';
let enEnd = app.indexOf(enEndMarker, enStart);
const enDictSrc = app.slice(enStart + 'const EN={'.length, enEnd);
const EN_DICT = {};
enDictSrc.split('\n').forEach(line => {
  const m = line.match(/^[\s]*"([^"]+)":"([^"]*)"[\s,]*$/);
  if (m) EN_DICT[m[1]] = m[2];
});
const enDictEn = new Set(Object.values(EN_DICT).filter(v => !isTemplateOrEmpty(v)));

// 3) 收集 OPENCSG_EN_EXTRA (deck-en-extra.js) -------------------------
const extraPath = path.join(ROOT, 'assets/deck-en-extra.js');
const extra = fs.readFileSync(extraPath, 'utf8');
const EN_EXTRA = {};
extra.replace(/window\.OPENCSG_EN_EXTRA\s*=\s*\{([\s\S]*?)\n\};/, (_, body) => {
  body.split('\n').forEach(line => {
    const m = line.match(/^\s*"([^"]+)":"([^"]*)"\s*,?\s*$/);
    if (m) EN_EXTRA[m[1]] = m[2];
  });
});
const enExtraEn = new Set(Object.values(EN_EXTRA).filter(v => !isTemplateOrEmpty(v)));

// 4) 收集所有 deck-*.js / *.js 中的 data-en 和 tx() 第二参数 -----------
const jsFiles = ['deck-appendix.js','deck-city.js','deck-slide-03.js','deck-bp-humanize.js'];
const dataEnFromJs = new Set();
const txEn = new Set();
jsFiles.forEach(name => {
  const p = path.join(ROOT, 'assets', name);
  if (!fs.existsSync(p)) return;
  const src = fs.readFileSync(p, 'utf8');
  // data-en
  [...src.matchAll(/data-en="([^"]+)"/g)].forEach(m => {
    if (!isTemplateOrEmpty(m[1])) dataEnFromJs.add(m[1]);
  });
  // tx(zh, en[, ...]) 第二参数（字符串字面量）
  // 容忍单引号 / 双引号 / 多行
  const txRe = /tx\(\s*['"]([^'"]*)['"]\s*,\s*['"]([^'"]*)['"]/g;
  [...src.matchAll(txRe)].forEach(m => {
    if (!isTemplateOrEmpty(m[2])) txEn.add(m[2]);
  });
});

// 5) 汇总 S1 (HTML data-en) ∪ S1_js ∪ tx ∪ en dict (en 值) ∪ en extra (en 值)
const S1 = new Set([...dataEn, ...dataEnFromJs]);
const TX = txEn;
const EN_VALS = new Set([...enDictEn, ...enExtraEn]);

// 6) 读取 8 国语言包的 phrases (key → value) ----------------------------
//   改用 Map：audit 不只要看 key 在不在，还要看 value 是不是空字符串。
//   (之前只看 key 存在，导致 "Sovereign control plane" 这种 zh.json 留
//   空值的死 key 漏过 audit。)
const packPhrases = {};
LANGS.forEach(code => {
  const json = JSON.parse(fs.readFileSync(path.join(LANG_DIR, `${code}.json`), 'utf8'));
  const m = new Map();
  Object.entries(json.phrases || {}).forEach(([k, v]) => m.set(k, v));
  packPhrases[code] = m;
});

function hasNonEmptyValue(map, key){
  if (map.has(key)){
    const v = map.get(key);
    return typeof v === 'string' && v.length > 0;
  }
  return false;
}
function hasNonEmptyValueNorm(map, key){
  if (hasNonEmptyValue(map, key)) return true;
  const kk = key.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\u3000/g,' ').trim();
  return hasNonEmptyValue(map, kk);
}

// 7) 计算 U = 所有需要翻译的英文源文 ∪ phrases 中已有的 key
//   排除掉 JS 模板变量（${...}）和空字符串——它们不是真要翻译的文本
const U = new Set([...S1, ...TX, ...EN_VALS, ...packPhrases.zh.keys(), ...packPhrases.en.keys()]);
// 也加入非中文包里的 keys（确保覆盖）
LANGS.forEach(code => { if (code !== 'zh' && code !== 'en') packPhrases[code].forEach((_, k) => {
  if (!isTemplateOrEmpty(k)) U.add(k);
}); });
// 再次过滤 U 本身（防止 en.json 含模板）
[...U].forEach(k => { if (isTemplateOrEmpty(k)) U.delete(k); });

// 8) 输出报告 --------------------------------------------------------
function fmtSet(s, max=10) {
  if (s.size <= max) return [...s];
  return [...s].slice(0, max).concat([`... (+${s.size - max} more)`]);
}

const lines = [];
const log = (s='') => { lines.push(s); };

log('===== i18n 体检报告 =====\n');
log(`[S1] [data-en] 在 HTML+JS 中去重: ${S1.size}`);
log(`[TX] tx(zh, en) 第二参数去重: ${TX.size}`);
log(`[EN_DICT] const EN={...} 中 zh→en 字典: ${Object.keys(EN_DICT).length} 条 (en 值 ${enDictEn.size} 条)`);
log(`[EN_EXTRA] deck-en-extra.js 中 zh→en 字典: ${Object.keys(EN_EXTRA).length} 条 (en 值 ${enExtraEn.size} 条)`);
log('');
log(`[合并 EN 值] EN_DICT ∪ EN_EXTRA en 唯一值: ${EN_VALS.size}`);
log('');

log('== 语言包 phrases 规模 ==');
LANGS.forEach(code => {
  let total = 0, empty = 0;
  packPhrases[code].forEach(v => { total++; if (typeof v !== 'string' || v.length === 0) empty++; });
  log(`  ${code}.json: ${total} 个 phrases (空 value: ${empty})`);
});
log('');

log('== 必须翻译 key (U) 覆盖情况 (key 存在 + value 非空) ==');
log(`  U 总大小: ${U.size}`);
const missEmptyByLang = {};  // for follow-up reporting
LANGS.forEach(code => {
  let hit = 0;
  const miss = [];
  U.forEach(k => {
    if (hasNonEmptyValueNorm(packPhrases[code], k)) hit++;
    else miss.push(k);
  });
  missEmptyByLang[code] = miss;
  log(`  ${code}.json: ${hit}/${U.size} (${(hit/U.size*100).toFixed(1)}%)`);
});
log('');

// 列出每国语言中缺失的关键短语（dialog / CEO 页）
const CRITICAL = new Set([
  'RANGE','INVESTOR','CURRENT','RATIO','FORMAT','CANCEL',
  'EXPORT DECK','DOWNLOAD WATERMARKED PDF','GENERATE & DOWNLOAD','EXECUTING…',
  'Empowering everyone with large models.',
  'Repeat founder proven across IBM · HP · Mesosphere · GitLab → OpenCSG',
  'Founder & CEO of OpenCSG; former founder & CEO of JiHu GitLab. MIIT reserve talent · Open-source foundation strategy expert · Builder of AI sovereignty platform & ecosystem.',
  'Career Path',
  'Continuous founder: 0→1→N',
  'From cloud-native & DevOps to sovereign AI infrastructure.',
  'Global open-source ambassador',
  'Linux Foundation · CNCF · EleutherAI · OGA Chairman',
  'Builder of AI sovereignty ecosystem',
  'Key talent for China\'s digital economy & AI independence.',
  'MIIT Reserve Talent / Open-source Foundation Strategy Expert',
  'EleutherAI Contributor / Wharton MBA · Stanford HPL / Two-time YC Founder',
  'Core Team · 5 senior leaders across architecture, engineering, algorithm, product & governance',
  'R&D team accounts for 70%+ of the company.',
  'Ex-HP, D2iQ, JiHu GitLab; 10+ years in cloud-native, containers and DevOps.',
  'Ex-Kunlun, Amazon, Letv; high-concurrency distributed systems expert.',
  'HEAD OF AI LAB',
  'BOARD SECRETARY',
  'Ex-WuXi AppTec, Tencent; 8+ years in recommendation, NLP and LLM.',
  'Ex-Tencent, Kaya Medical; 10+ years in 3D graphics, 8+ years in AI products.',
  'Ex-Paradise Ventures, Fanta Tech; led GitLab China investment; AI best-seller author.',
]);

log('== 关键短语（dialog / CEO 页）逐国缺失情况 ==');
const criticalReport = {};
[...CRITICAL].forEach(en => {
  if (!U.has(en)) return;
  criticalReport[en] = {};
  LANGS.forEach(code => {
    criticalReport[en][code] = hasNonEmptyValue(packPhrases[code], en);
  });
});
const criticalLines = ['en_key\t' + LANGS.join('\t')];
[...CRITICAL].forEach(en => {
  if (!U.has(en)) return;
  criticalLines.push(`${en}\t${LANGS.map(c => criticalReport[en][c] ? '✓' : '✗').join('\t')}`);
});
fs.writeFileSync(path.join(OUT, 'critical.csv'), criticalLines.join('\n'));

// U \ 各语言 phrases = 该语言缺失清单（key 不存在 OR value 为空）
function normalize(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\u3000/g,' ').trim();
}
const normMap = new Map();
U.forEach(k => normMap.set(k, normalize(k)));
const missPerLang = {};
LANGS.forEach(code => {
  missPerLang[code] = [...U].filter(k => !hasNonEmptyValueNorm(packPhrases[code], k));
  fs.writeFileSync(path.join(OUT, `miss.${code}.txt`), missPerLang[code].join('\n'));
});

// 也把全集 U 输出
fs.writeFileSync(path.join(OUT, 'U.txt'), [...U].sort().join('\n'));
fs.writeFileSync(path.join(OUT, 'S1.txt'), [...S1].sort().join('\n'));
fs.writeFileSync(path.join(OUT, 'TX.txt'), [...TX].sort().join('\n'));

// EN 字典全集（中文源文 → 英文源文）
const enPairs = Object.entries({...EN_DICT, ...EN_EXTRA}).map(([zh, en]) => `${zh}\t${en}`);
fs.writeFileSync(path.join(OUT, 'EN_DICT.txt'), enPairs.sort().join('\n'));

fs.writeFileSync(path.join(OUT, 'report.txt'), lines.join('\n'));
console.log(lines.join('\n'));
console.log(`\n→ 详细报告写到 ${OUT}/`);
