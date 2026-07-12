/* OpenCSG Deck · i18n core */
(function(){
  // SGVersion/IMDA is distributed as an English-only investor deck.
  const SUPPORTED = ['en'];
  const DEFAULT = 'en';
  const STORAGE_KEY = 'opencsg.deck.lang';
  const I18N_DIR = 'assets/i18n/';

  function detectLang(){
    return DEFAULT;
  }

  async function loadPack(code){
    const url = `${I18N_DIR}${code}.json`;
    const r = await fetch(url, {cache:'no-cache'});
    if (!r.ok) throw new Error('i18n load failed: ' + url);
    return r.json();
  }

  // 在控制台输出 phrases 字典覆盖率（开发期自检）。
  // 调用方式：__opencsgI18nAudit({en:[...]})，传入英文源文集合。
  // 通常由 audit-bootstrap.js 在 window.__i18nAuditKeys 存在时自动调用。
  function auditCoverage(pack, lang, keySet){
    const phrases = pack.phrases || {};
    let hit = 0, miss = 0;
    const missing = [];
    keySet.forEach(k => {
      const norm = normalizeKey(k);
      if (phrases[k] || (norm && phrases[norm])) hit++;
      else { miss++; missing.push(k); }
    });
    const total = keySet.size;
    const pct = total ? (hit / total * 100).toFixed(1) : '100.0';
    // eslint-disable-next-line no-console
    console.groupCollapsed(`[i18n] ${lang}: ${hit}/${total} (${pct}%) phrases hit`);
    if (missing.length){
      // eslint-disable-next-line no-console
      console.warn(`[i18n] ${lang} 缺失 ${missing.length} 个短语：`, missing);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  // 暴露给外部调用
  window.__opencsgI18nAudit = function(keySet){
    if (!(keySet instanceof Set)) keySet = new Set(keySet || []);
    Promise.all(SUPPORTED.map(async code => {
      try {
        const pack = await loadPack(code);
        auditCoverage(pack, code, keySet);
      } catch(_){ /* ignore */ }
    }));
  };

  // 暴露 phrase() 和 normalizeKey()，方便 QA / 测试。
  window.__opencsgI18n = Object.assign(window.__opencsgI18n || {}, {
    phrase,
    normalizeKey,
    normalizeZh: s => normalizeKey(s),
    langs: SUPPORTED,
    packs: {},
  });

  function lookup(pack, dotted){
    return dotted.split('.').reduce((acc,k)=> acc && acc[k], pack);
  }

  function format(template, vars){
    if (!template || !vars) return template || '';
    return template.replace(/\{(\w+)\}/g, (_,k)=> (k in vars ? vars[k] : `{${k}}`));
  }

  function decode(value){
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value || '';
    return textarea.value;
  }

  // 对短语 key 做 HTML 实体归一化。HTML 里 [data-en] 通常写成 `Founder &amp; CEO`，
  // phrases 字典里我们约定存字面 `&`。查找前先把候选 key 全部 decode，
  // 这样 `&amp; / &lt; / &gt; / &quot; / &#39;` 五种常见实体都能正确命中。
  // 同时把全角空格 (\u3000) 折叠成半角空格并 trim，避免"Paradigm Evolution　"与
  // "Paradigm Evolution" 对不上。
  function normalizeKey(value){
    if (!value) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = String(value);
    return textarea.value.replace(/\u3000/g, ' ').trim();
  }

  function phrase(pack, lang, zh, en){
    if (lang === 'zh') return zh;
    const phrases = pack.phrases || {};
    // 1) 英文源文命中
    if (en){
      const enNorm = normalizeKey(en);
      if (phrases[en]) return phrases[en];
      if (enNorm && phrases[enNorm]) return phrases[enNorm];
    }
    // 2) 中文源文命中
    if (zh){
      const zhNorm = normalizeKey(zh);
      if (phrases[zh]) return phrases[zh];
      if (zhNorm && phrases[zhNorm]) return phrases[zhNorm];
    }
    // 3) 兜底
    return en || zh;
  }

  function rememberElement(el){
    if (!el.dataset.i18nSourceZh){
      el.dataset.i18nSourceZh = el.getAttribute('data-zh') || el.textContent.trim();
    }
    if (!el.dataset.i18nSourceEn){
      el.dataset.i18nSourceEn = decode(el.getAttribute('data-en') || '').trim();
    }
  }

  function translateLegacyElements(root, pack, lang){
    const elements = [];
    if (root.nodeType === 1 && root.matches('[data-en]')) elements.push(root);
    if (root.querySelectorAll) elements.push(...root.querySelectorAll('[data-en]'));
    elements.forEach(el=>{
      rememberElement(el);
      const value = phrase(pack, lang, el.dataset.i18nSourceZh, el.dataset.i18nSourceEn);
      if (typeof value === 'string' && el.textContent !== value) el.textContent = value;
    });
  }

  function translateTextNodes(root, pack, lang){
    const englishMap = window.OPENCSG_EN || {};
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,[data-en],[data-i18n]')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if (typeof node.__deckI18nZh !== 'string') node.__deckI18nZh = node.nodeValue;
      const raw = node.__deckI18nZh;
      const core = raw.trim();
      if (!core) return;
      const start = raw.indexOf(core);
      const lead = raw.slice(0, start);
      const trail = raw.slice(start + core.length);
      const en = englishMap[core] || core;
      const value = phrase(pack, lang, core, en);
      node.nodeValue = lead + value + trail;
    });
  }

  function translatePlaceholders(root, pack, lang){
    const elements = [];
    if (root.nodeType === 1 && root.matches('input[data-en-placeholder],textarea[data-en-placeholder]')) elements.push(root);
    if (root.querySelectorAll) elements.push(...root.querySelectorAll('input[data-en-placeholder],textarea[data-en-placeholder]'));
    elements.forEach(el=>{
      const zh = el.getAttribute('data-zh-placeholder') || el.getAttribute('placeholder') || '';
      const en = el.getAttribute('data-en-placeholder') || zh;
      el.setAttribute('placeholder', phrase(pack, lang, zh, en));
    });
  }

  function translateTree(root, pack, lang){
    if (!root) return;
    translateLegacyElements(root, pack, lang);
    translateTextNodes(root, pack, lang);
    translatePlaceholders(root, pack, lang);
  }

  let currentPack = null;
  let currentLang = DEFAULT;

  function apply(pack, lang){
    currentPack = pack;
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    // Only flip document direction for languages whose meta says so. We deliberately
    // avoid mirroring deck layout: the deck itself stays LTR and we only tag the
    // body for RTL-aware consumers (Arabic glyphs still render correctly).
    const dir = pack._meta.dir || 'ltr';
    if (dir === 'rtl'){
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.setAttribute('lang-dir', 'rtl');
      document.body.classList.add('lang-rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.setAttribute('lang-dir', 'ltr');
      document.body.classList.remove('lang-rtl');
    }

    // Text content keys
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const v = lookup(pack, el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });

    // Placeholder keys (form inputs)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const v = lookup(pack, el.getAttribute('data-i18n-placeholder'));
      if (typeof v === 'string') el.setAttribute('placeholder', v);
    });

    translateTree(document.body, pack, lang);
    if (typeof window.renderRoadmap === 'function'){
      window.renderRoadmap(lang === 'zh' ? 'zh' : 'en');
      const roadmap = document.querySelector('.roadmap-app');
      if (roadmap) translateTree(roadmap, pack, lang);
    }

    // Update the current-language chip
    const chip = document.getElementById('langCurrent');
    if (chip){
      const flag = chip.querySelector('.lang-flag');
      const code = chip.querySelector('.lang-code');
      if (flag){ flag.textContent = pack._meta.flag || lang.toUpperCase(); flag.setAttribute('data-flag', lang); }
      if (code){ code.textContent = lang.toUpperCase(); }
    }

    document.dispatchEvent(new CustomEvent('deck:i18n', {detail:{lang, pack}}));
  }

  async function setLang(code){
    if (!SUPPORTED.includes(code)) code = DEFAULT;
    try {
      const pack = await loadPack(code);
      apply(pack, code);
      localStorage.setItem(STORAGE_KEY, code);
      // Reflect in URL for shareable links without forcing reload.
      const url = new URL(location.href);
      url.searchParams.set('lang', code);
      history.replaceState(null, '', url.toString());
    } catch(err){
      console.warn(err);
    }
  }

  // Build the language dropdown
  function buildMenu(packs){
    const menu = document.querySelector('#langSwitch .lang-menu');
    if (!menu) return;
    menu.innerHTML = '';
    SUPPORTED.forEach(code=>{
      const meta = (packs[code] && packs[code]._meta) || {name:code, nativeName:code, flag:code.toUpperCase()};
      const li = document.createElement('li');
      li.setAttribute('role','option');
      li.dataset.lang = code;
      li.innerHTML = `
        <span class="lang-flag">${meta.flag || code.toUpperCase()}</span>
        <span class="lang-native">${meta.nativeName || meta.name || code}</span>
        <span class="lang-name">${meta.name || code}</span>
      `;
      li.addEventListener('click', ()=>{
        setLang(code);
        toggleMenu(false);
      });
      menu.appendChild(li);
    });
  }

  function highlight(target){
    const menu = document.querySelector('#langSwitch .lang-menu');
    if (!menu) return;
    menu.querySelectorAll('li').forEach(li=> li.removeAttribute('aria-selected'));
    if (target){ target.setAttribute('aria-selected','true'); target.scrollIntoView({block:'nearest'}); }
  }

  function moveFocus(delta){
    const menu = document.querySelector('#langSwitch .lang-menu');
    if (!menu) return;
    const items = Array.from(menu.querySelectorAll('li'));
    if (!items.length) return;
    const currentIdx = items.findIndex(li=> li.getAttribute('aria-selected')==='true');
    let nextIdx = currentIdx + delta;
    if (nextIdx < 0) nextIdx = items.length - 1;
    if (nextIdx >= items.length) nextIdx = 0;
    highlight(items[nextIdx]);
  }

  function toggleMenu(force){
    const sw = document.getElementById('langSwitch');
    if (!sw) return;
    const menu = sw.querySelector('.lang-menu');
    const btn = sw.querySelector('#langCurrent');
    const open = typeof force === 'boolean' ? force : !sw.classList.contains('open');
    sw.classList.toggle('open', open);
    btn && btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (menu) menu.style.display = open ? 'block' : 'none';
    if (open){
      const active = menu.querySelector(`[data-lang="${localStorage.getItem(STORAGE_KEY) || DEFAULT}"]`);
      highlight(active);
    }
  }

  document.addEventListener('click', (e)=>{
    const sw = document.getElementById('langSwitch');
    if (!sw) return;
    if (!sw.contains(e.target)) toggleMenu(false);
  });

  // Init
  function init(){
    // Preload all packs so the menu can render native names.
    const packs = {};
    return Promise.all(SUPPORTED.map(async code=>{
      try { packs[code] = await loadPack(code); } catch(_){ packs[code] = {_meta:{name:code, nativeName:code, flag:code.toUpperCase()}}; }
    })).then(async ()=>{
      buildMenu(packs);
      const btn = document.getElementById('langCurrent');
      if (btn && !btn.dataset.i18nBound){ btn.dataset.i18nBound = '1'; btn.addEventListener('click', (e)=>{ e.stopPropagation(); toggleMenu(); }); }
      const initial = detectLang();
      const pack0 = packs[initial] || await loadPack(initial);
      apply(pack0, initial);

      // Re-apply on next frame so any late-injected nodes (e.g. replica.js that
      // replaces #slide-03 innerHTML after DOMContentLoaded) are picked up too.
      const reapply = ()=> apply(packs[localStorage.getItem(STORAGE_KEY) || initial] || pack0, localStorage.getItem(STORAGE_KEY) || initial);
      requestAnimationFrame(()=> requestAnimationFrame(reapply));
      window.addEventListener('load', reapply, {once:true});

      const observer = new MutationObserver(records=>{
        const lang = localStorage.getItem(STORAGE_KEY) || initial;
        const pack = packs[lang] || pack0;
        records.forEach(record=>record.addedNodes.forEach(node=>{
          if (node.nodeType === 1) translateTree(node, pack, lang);
        }));
      });
      observer.observe(document.body, {childList:true, subtree:true});
    });
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
  document.addEventListener('keydown', (e)=>{
    const sw = document.getElementById('langSwitch');
    const open = sw && sw.classList.contains('open');
    if (e.key === 'Escape' && open){ toggleMenu(false); return; }
    if (!open) return;
    if (e.key === 'ArrowDown'){ e.preventDefault(); moveFocus(1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); moveFocus(-1); }
    else if (e.key === 'Home'){ e.preventDefault(); const items=document.querySelectorAll('#langSwitch .lang-menu li'); items.length && highlight(items[0]); }
    else if (e.key === 'End'){ e.preventDefault(); const items=document.querySelectorAll('#langSwitch .lang-menu li'); items.length && highlight(items[items.length-1]); }
    else if (e.key === 'Enter'){
      const sel = document.querySelector('#langSwitch .lang-menu li[aria-selected="true"]');
      if (sel){ e.preventDefault(); setLang(sel.dataset.lang); toggleMenu(false); }
    }
  });

  // Expose for legacy callers (deck-extra.js still does language toggling)
  function t(en, zh){
    if (!currentPack) return en || zh || '';
    return phrase(currentPack, currentLang, zh || en, en);
  }
  window.DeckI18n = { setLang, SUPPORTED, translateTree, t, get lang(){ return currentLang; }, get pack(){ return currentPack; } };
  window.__t = t;
})();
