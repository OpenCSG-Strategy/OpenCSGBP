#!/usr/bin/env node
/*
 * 把 8 国语言包 phrases 中的 key 做 HTML 实体归一化。
 *
 * 历史包袱：之前 phrases 字典的 key 保留了字面 `&amp;` / `&lt;` 等 HTML 实体。
 * 这次修复统一改成字面 `&` / `<` / `>`，与 HTML 元素 textContent（被浏览器 decode）
 * 后的实际值保持一致，避免 i18n 查找归一化时丢失匹配。
 */
const fs = require('fs');
const path = require('path');

const ROOT = '/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026';
const LANG_DIR = path.join(ROOT, 'assets/i18n');
const LANGS_8 = ['en','ja','ko','ar','ru','fr','de','es','pt'];

function decodeHtml(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

let totalMerged = 0;
LANGS_8.forEach(code => {
  const p = path.join(LANG_DIR, `${code}.json`);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const orig = j.phrases || {};
  const merged = {};
  let mergedCount = 0;
  Object.entries(orig).forEach(([k, v]) => {
    const kNorm = decodeHtml(k);
    if (kNorm !== k){
      if (merged[kNorm] && merged[kNorm] !== v){
        // 已存在归一化版，值不同 → 保留旧版（保守），但记录
        console.warn(`[${code}] key 冲突: "${kNorm}" 已存在="${merged[kNorm]}", 新="${v}"，保留原值`);
      } else {
        merged[kNorm] = v;
        mergedCount++;
      }
    } else {
      merged[k] = v;
    }
  });
  j.phrases = merged;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8');
  console.log(`  ${code}.json: 合并了 ${mergedCount} 个 `);
  totalMerged += mergedCount;
});
console.log(`\n[gen-en-phrases] 共合并 ${totalMerged} 个 HTML 实体 key`);