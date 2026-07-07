#!/usr/bin/env node
// 把 miss.ja.txt 与 ja.json 的 phrases key 做"HTML 实体归一化"对比
const fs = require('fs');
const ja = JSON.parse(fs.readFileSync('/Users/fangchen/Baidu/GitHub/OpenCSG_BP_HTML_2026/assets/i18n/ja.json','utf8'));
const phrases = new Set(Object.keys(ja.phrases||{}));
const miss = fs.readFileSync('/tmp/i18n-audit/miss.ja.txt','utf8').trim().split('\n');

const decode = s => s
  .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
  .replace(/\u3000/g,' ')   // 全角空格 → 半角
  .trim();

const resolved = [];
const unresolved = [];
miss.forEach(m => {
  const norm = decode(m);
  if (phrases.has(norm)) resolved.push([m, norm]);
  else unresolved.push(m);
});

console.log(`HTML 实体归一化后能匹配: ${resolved.length}/${miss.length}`);
console.log(`--- 已解决（去掉 &amp; 后能命中 phrases）---`);
resolved.forEach(([m,n]) => console.log(`  ${m}  →  ${n}`));
console.log(`--- 仍然缺（真的没有翻译）---`);
unresolved.forEach(m => console.log(`  ${m}`));