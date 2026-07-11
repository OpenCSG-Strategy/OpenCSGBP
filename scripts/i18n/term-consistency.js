#!/usr/bin/env node
/*
 * 术语一致性体检
 *
 * 目的：同一个中文 key 在不同地方被映射到不同的英文（即"一词多译"），
 *       是最常见的"切到非英文语言时看起来怪怪的"类 bug 源头。
 *       例如 "主权控制面" 既被译成 "Sovereign control plane" 又被译成
 *       "Sovereign control layer"——后者才是对的，前者会让日语/韩语
 *       用户看到错位翻译。
 *
 *  收集来源：
 *   1) index.html / *.js 里的 [data-en="..."]X...</X> 对
 *   2) deck-app.js 里的 const EN={...}（zh→en 字典）
 *   3) deck-en-extra.js 里的 window.OPENCSG_EN_EXTRA={...}（zh→en 字典）
 *
 *  输出：每个"一词多译"的中文，列出它出现过的所有英文版本，附上文件位置。
 *        默认 non-fatal（不 abort），但 CI 里可以加 --strict 让 ≥2 个不同英文就退出 1。
 *
 *  退出码：
 *    0  = clean（每个中文对应唯一英文）
 *    1  = 有不一致（仅在 --strict 模式下）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const STRICT = process.argv.includes('--strict');

// 品牌名/不需要翻译的词（来自 docs/CONTRIBUTING-i18n.md 的"不译"清单）
const BRAND_WHITELIST = new Set([
  'OpenCSG','CSGHub','CSGHub-Lite','CSGClaw','AgenticHub','AgenticOps','OPC','OpenCore',
  'DevOps','GitLab','Mesosphere','IBM','HP','EleutherAI','YC','Beihang','Wharton',
  'Stanford','MIIT','CAICT','CALB','CATL','miHoYo','Bilibili','D2iQ','Kunlun',
  'Amazon','Letv','Tencent','WuXi AppTec','Kaya Medical','Paradise Ventures','Fanta',
  'Wharton MBA',
  // 度量单位 / 通用符号
  'AI','AI Lab','AGENTICHUB','AGENTICOPS','R&D','AI Production',
  'EU','MCP','RAG','NLP','LLM','LLMs','CTR','ACV','TAM','API','SDK',
  'SSO','LDAP','RBAC','MaaS','EE','CSGHub EE','M10','MIIT Reserve',
  'IP','K8s','CRD','GPU','AI Lab',
]);

// 1) 收集 (zh, en) 对 ----------------------------------------------

function scanHtmlDataEn(html){
  // 匹配 [data-en="..."]...content...</tag>
  // zh = inner text, en = data-en 值
  const pairs = [];
  // 简单的状态机：抓 data-en 起点 → 抓紧跟着的 >...< 之间的 inner text
  const re = /<[^>]+data-en="([^"]+)"[^>]*>([\s\S]*?)<\//g;
  let m;
  while ((m = re.exec(html))){
    const en = decode(m[1]).trim();
    // 取 inner text，剥掉内嵌标签
    const inner = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').trim();
    if (inner && en) pairs.push({ zh: inner, en, src: 'index.html' });
  }
  return pairs;
}

function scanJsDataEn(src, file){
  const pairs = [];
  const re = /data-en="([^"]+)"[^>]*>([^<]*)</g;
  let m;
  while ((m = re.exec(src))){
    const en = decode(m[1]).trim();
    const inner = m[2].replace(/&nbsp;/g,' ').trim();
    if (inner && en) pairs.push({ zh: inner, en, src: file });
  }
  return pairs;
}

function parseZhEnDict(src, file){
  // 解析 "zh-key":"en-value" 对（容忍 JS 对象字面量）
  const pairs = [];
  const re = /"([^"]+)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))){
    const zh = decode(m[1]).trim();
    const en = decode(m[2]).trim();
    if (zh && en && zh !== en) pairs.push({ zh, en, src: file });
  }
  return pairs;
}

function decode(s){
  return s
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/\\"/g,'"').replace(/\\n/g,'\n');
}

// 2) 收集全部 ----------------------------------------------------
const allPairs = [];

// HTML
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
allPairs.push(...scanHtmlDataEn(html));

// JS files
const jsFiles = ['deck-app.js','deck-appendix.js','deck-city.js','deck-slide-03.js','deck-bp-humanize.js'];
jsFiles.forEach(name => {
  const p = path.join(ROOT, 'assets', name);
  if (!fs.existsSync(p)) return;
  const src = fs.readFileSync(p, 'utf8');
  allPairs.push(...scanJsDataEn(src, `assets/${name}`));
});

// EN 字典
const appPath = path.join(ROOT, 'assets/deck-app.js');
const appSrc = fs.readFileSync(appPath, 'utf8');
const enStart = appSrc.indexOf('const EN={');
const enEnd = appSrc.indexOf('\n    };', enStart);
if (enStart >= 0 && enEnd > enStart){
  const dictSrc = appSrc.slice(enStart + 'const EN={'.length, enEnd);
  allPairs.push(...parseZhEnDict(dictSrc, 'assets/deck-app.js:EN_DICT'));
}
const extraPath = path.join(ROOT, 'assets/deck-en-extra.js');
const extraSrc = fs.readFileSync(extraPath, 'utf8');
const exStart = extraSrc.indexOf('window.OPENCSG_EN_EXTRA');
if (exStart >= 0){
  allPairs.push(...parseZhEnDict(extraSrc.slice(exStart), 'assets/deck-en-extra.js:EN_EXTRA'));
}

// 3) 过滤：只关心"术语"（短串），长段落不算 -----------------
function isTermLike(zh){
  if (zh.length === 0) return false;
  if (zh.length > 40) return false;        // 长段落不做一致性检查
  // 包含句号/问号/分号的视为段落
  if (/[。？！；]/.test(zh)) return false;
  // 数字+单位（如 "1M+"、"3.5M+用户"）通常是营销数据，不查
  if (/^\d/.test(zh)) return false;
  return true;
}

const termPairs = allPairs.filter(p => isTermLike(p.zh) && isTermLike(p.en));

// 4) 归一化：把 brand-only 英文跳过；同义词去重策略是"大小写不敏感 + 去空格"
function normEnglish(s){
  return s.toLowerCase().replace(/\s+/g,' ').trim();
}
function isBrandOnly(en){
  // 英文里没有中文字符、长度短、且全部是 brand whitelist → 跳过
  if (/[\u4e00-\u9fff]/.test(en)) return false;
  // 全是 brand token 的跳过（"OpenCSG" / "CSGHub EE" 等）
  const tokens = en.split(/[\s·•,()\/]+/).filter(Boolean);
  if (tokens.length === 0) return false;
  if (tokens.every(t => BRAND_WHITELIST.has(t) || /^[A-Z]{2,5}$/.test(t))) return true;
  return false;
}

const filtered = termPairs.filter(p => !isBrandOnly(p.en));

// 5) 反向索引：zh → Set(en) -----------------------------------
const zhToEn = new Map();  // zh_norm → { variants: Set(en), samples: [{en, src}] }
for (const p of filtered){
  const key = p.zh;
  if (!zhToEn.has(key)){
    zhToEn.set(key, { variants: new Map(), samples: [] });
  }
  const rec = zhToEn.get(key);
  const ne = normEnglish(p.en);
  if (!rec.variants.has(ne)){
    rec.variants.set(ne, p.en);  // 保留原始大小写
  }
  if (rec.samples.length < 3){
    rec.samples.push({ en: p.en, src: p.src });
  }
}

// 6) 报告 ------------------------------------------------------
const conflicts = [];
for (const [zh, rec] of zhToEn){
  if (rec.variants.size > 1){
    conflicts.push({ zh, enList: [...rec.variants.values()], samples: rec.samples });
  }
}

// 按 zh 长度从短到长（短词更关键，优先显示）
conflicts.sort((a, b) => a.zh.length - b.zh.length);

const out = [];
const log = (s='') => { out.push(s); };
log('===== 术语一致性体检 =====\n');
log(`总 (zh,en) 对：${allPairs.length}`);
log(`  - HTML/JS data-en：${allPairs.length - (allPairs.length - termPairs.length)}`);
log(`  - EN 字典（zh→en 字典）：动态统计`);
log(`筛后用于一致性检查的术语：${filtered.length}`);
log(`唯一中文 key：${zhToEn.size}`);
log(`一词多译的术语：${conflicts.length}`);
log('');

if (conflicts.length === 0){
  log('✅ 全部中文术语对应唯一英文，无冲突。');
} else {
  log('⚠️  以下中文术语在不同位置被映射到不同英文，建议统一：\n');
  for (const c of conflicts){
    log(`  · ${c.zh}`);
    log(`    出现过 ${c.enList.length} 个不同英文版本：`);
    for (const en of c.enList){
      log(`      - ${en}`);
    }
    log(`    出现位置（前 3 个）：`);
    for (const s of c.samples){
      log(`      - [${s.en}] @ ${s.src}`);
    }
    log('');
  }
}

const report = out.join('\n');
console.log(report);

const OUT_DIR = '/tmp/i18n-audit';
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'term-consistency.txt'), report);
fs.writeFileSync(path.join(OUT_DIR, 'term-conflicts.json'), JSON.stringify(conflicts, null, 2));

if (STRICT && conflicts.length > 0){
  console.log(`\n❌ --strict 模式：发现 ${conflicts.length} 个不一致，exit 1`);
  process.exit(1);
}
process.exit(0);
