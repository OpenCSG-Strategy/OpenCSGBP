/* OpenCSG Deck · i18n core
 * - Loads a JSON language pack and replaces every [data-i18n] / [data-i18n-placeholder] node.
 * - Falls back to the original HTML text if a key is missing in the pack.
 * - Supports RTL (e.g. Arabic) by toggling <html dir="rtl"> and a `[lang-dir]` body attribute.
 * - Persists the chosen language in localStorage and dispatches a `deck:i18n` event
 *   so the existing deck JS can keep working.
 */
(function(){
  const SUPPORTED = ['zh','en','ja','ko','ar','ru','fr','de','es','pt'];
  const DEFAULT = 'zh';
  const STORAGE_KEY = 'opencsg.deck.lang';
  const I18N_DIR = 'assets/i18n/';

  function detectLang(){
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const qs = new URLSearchParams(location.search);
    const q = qs.get('lang');
    if (q && SUPPORTED.includes(q)) return q;
    const nav = (navigator.language || '').slice(0,2).toLowerCase();
    if (SUPPORTED.includes(nav)) return nav;
    return DEFAULT;
  }

  async function loadPack(code){
    const url = `${I18N_DIR}${code}.json`;
    const r = await fetch(url, {cache:'no-cache'});
    if (!r.ok) throw new Error('i18n load failed: ' + url);
    return r.json();
  }

  function lookup(pack, dotted){
    return dotted.split('.').reduce((acc,k)=> acc && acc[k], pack);
  }

  function format(template, vars){
    if (!template || !vars) return template || '';
    return template.replace(/\{(\w+)\}/g, (_,k)=> (k in vars ? vars[k] : `{${k}}`));
  }

  function apply(pack, lang){
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

    // Legacy data-en / data-zh bilingual nodes — let the new lang take precedence.
    document.querySelectorAll('[data-en]').forEach(el=>{
      // The original Chinese text remains the default. Only override when switching to a non-zh lang
      // and we have a matching key under "legacy.<hash>".
      if (lang === 'zh') return;
      const hash = el.getAttribute('data-en').trim();
      if (!hash) return;
      const key = 'legacy.' + hash;
      const v = lookup(pack, key);
      if (typeof v === 'string') el.textContent = v;
    });

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
  window.DeckI18n = { setLang, SUPPORTED };
})();