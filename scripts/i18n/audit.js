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

const ROOT = '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026';
const OUT  = '/tmp/i18n-audit';
fs.mkdirSync(OUT, { recursive: true });

const LANG_DIR = path.join(ROOT, 'assets/i18n');
const LANGS = ['zh','en','ja','ko','ar','ru','fr','de','es','pt'];

// 1) 收集 [data-en] 属性 -----------------------------------------------
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dataEnAttrs = [...html.matchAll(/data-en="([^"]*)"/g)].map(m => m[1]);
const dataEn = [...new Set(dataEnAttrs)].filter(s => !s.includes('${esc(') && s.trim());

// 2) 收集 index.html 内的 OPENCSG_EN 字典（const EN={...}）--------------
const enStart = html.indexOf('const EN={');
const enEndMarker = '    };';
let enEnd = html.indexOf(enEndMarker, enStart);
const enDictSrc = html.slice(enStart + 'const EN={'.length, enEnd);
const EN_DICT = {};
enDictSrc.split('\n').forEach(line => {
  const m = line.match(/^[\s]*"([^"]+)":"([^"]*)"[\s,]*$/);
  if (m) EN_DICT[m[1]] = m[2];
});
const enDictEn = new Set(Object.values(EN_DICT));

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
const enExtraEn = new Set(Object.values(EN_EXTRA));

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
    if (!m[1].includes('${esc(')) dataEnFromJs.add(m[1]);
  });
  // tx(zh, en[, ...]) 第二参数（字符串字面量）
  // 容忍单引号 / 双引号 / 多行
  const txRe = /tx\(\s*['"]([^'"]*)['"]\s*,\s*['"]([^'"]*)['"]/g;
  [...src.matchAll(txRe)].forEach(m => txEn.add(m[2]));
});

// 5) 汇总 S1 (HTML data-en) ∪ S1_js ∪ tx ∪ en dict (en 值) ∪ en extra (en 值)
const S1 = new Set([...dataEn, ...dataEnFromJs]);
const TX = txEn;
const EN_VALS = new Set([...enDictEn, ...enExtraEn]);

// 6) 读取 8 国语言包的 phrases keys ------------------------------------
const packPhrases = {};
LANGS.forEach(code => {
  const json = JSON.parse(fs.readFileSync(path.join(LANG_DIR, `${code}.json`), 'utf8'));
  packPhrases[code] = new Set(Object.keys(json.phrases || {}));
});

// 7) 计算 U = 所有需要翻译的英文源文 ∪ phrases 中已有的 key
const U = new Set([...S1, ...TX, ...EN_VALS, ...packPhrases.zh, ...packPhrases.en]);
// 也加入非中文包里的 keys（确保覆盖）
LANGS.forEach(code => { if (code !== 'zh' && code !== 'en') packPhrases[code].forEach(k => U.add(k)); });

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
  log(`  ${code}.json: ${packPhrases[code].size} 个 phrases`);
});
log('');

log('== 必须翻译 key (U) 覆盖情况 ==');
log(`  U 总大小: ${U.size}`);
LANGS.forEach(code => {
  let hit = 0;
  U.forEach(k => {
    if (packPhrases[code].has(k)) hit++;
    else {
      // 归一化后再试一次：i18n 框架里 normalizeKey() 会做 HTML 实体 decode + 全角空格折叠 + trim
      const kk = k.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\u3000/g,' ').trim();
      if (packPhrases[code].has(kk)) hit++;
    }
  });
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
    criticalReport[en][code] = packPhrases[code].has(en);
  });
});
const criticalLines = ['en_key\t' + LANGS.join('\t')];
[...CRITICAL].forEach(en => {
  if (!U.has(en)) return;
  criticalLines.push(`${en}\t${LANGS.map(c => criticalReport[en][c] ? '✓' : '✗').join('\t')}`);
});
fs.writeFileSync(path.join(OUT, 'critical.csv'), criticalLines.join('\n'));

// U \ 各语言 phrases = 该语言缺失清单（用归一化后的 key 找）
function normalize(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\u3000/g,' ').trim();
}
const normMap = new Map();
U.forEach(k => normMap.set(k, normalize(k)));
const missPerLang = {};
LANGS.forEach(code => {
  missPerLang[code] = [...U].filter(k => !packPhrases[code].has(k) && !packPhrases[code].has(normMap.get(k)));
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