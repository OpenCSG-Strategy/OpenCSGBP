const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');
const {promisify} = require('util');
const execFileAsync = promisify(execFile);

const root = path.resolve(__dirname, '..');
const i18nDir = path.join(root, 'assets', 'i18n');

const languages = ['ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt'];
const languageNames = {
  ja: 'Japanese', ko: 'Korean', ar: 'Arabic', ru: 'Russian',
  fr: 'French', de: 'German', es: 'Spanish', pt: 'Portuguese'
};

// The 25 missing phrases that need to be added to all language packs
// Some are URLs/numbers/brands that stay as-is, others need translation
const keepAsIs = new Set([
  'sanxia.opencsg.com',
  'opencsg.com · Jul 2026',
  'github.com/OpenCSGs · Jul 2026',
  '5,600+',
  '34',
  '30+',
  'WeChat Official Accounts · OpenCSG',
  'OFFICIAL · OpenCSG',
  'COMMUNITY · OpenCSG',
]);

const translatable = [
  'Live Community Platform',
  'Datasets',
  'Spaces',
  'GitHub Repos',
  'Community Data　',  // trailing fullwidth space
  'Real platform metrics: 3M+ users, 200K+ assets, 5,600+ GitHub stars across 30+ countries',
  'TOP MODELS BY DOWNLOADS',
  'TOP DATASETS BY DOWNLOADS',
  'GITHUB STARS BY REPO',
  'COMMUNITY AS STRATEGIC MOAT',
  'Open assets attract developers; the platform converts them into enterprise production systems',
  'Open-source flywheel',
  'Asset → Production',
  'Developer → Enterprise',
  'Community → Revenue',
  'Real-time data from OpenCSG platform and GitHub; community is the entry point, not the destination',
];

async function translateBatch(batch, language, attempt = 1) {
  const source = Object.fromEntries(batch.map((text, i) => [String(i), text]));
  const message = `Translate every JSON value from English to ${languageNames[language]} for a professional investor presentation. Keep every key unchanged. Preserve brand names (OpenCSG, GitHub), URLs, numbers, and symbols exactly as-is. Translate ALL other words. Return only one valid JSON object with the same keys.\n${JSON.stringify(source)}`;
  try {
    const {stdout} = await execFileAsync('mmx', [
      'text', 'chat',
      '--model', 'MiniMax-M2.7-highspeed',
      '--temperature', '0.1',
      '--max-tokens', '4000',
      '--system', 'You are a professional localization engine. Return ONLY valid JSON — no thinking, no markdown, no explanation.',
      '--message', message,
      '--output', 'json'
    ], {maxBuffer: 20 * 1024 * 1024});
    const envelope = JSON.parse(stdout);
    const text = envelope.content?.find(item => item.type === 'text')?.text || '';
    const jsonText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const translated = JSON.parse(jsonText);
    const result = [];
    for (let i = 0; i < batch.length; i++) {
      const val = translated[String(i)];
      if (typeof val === 'string' && val.trim()) result.push(val.trim());
      else throw new Error(`missing translation for index ${i}`);
    }
    return result;
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise(r => setTimeout(r, 1500 * attempt));
    return translateBatch(batch, language, attempt + 1);
  }
}

async function main() {
  for (const lang of languages) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!pack.phrases) pack.phrases = {};
    
    // Add keep-as-is phrases
    let added = 0;
    for (const phrase of keepAsIs) {
      if (!(phrase in pack.phrases)) {
        pack.phrases[phrase] = phrase;
        added++;
      }
    }
    
    // Translate translatable phrases
    const needTranslation = translatable.filter(p => !(p in pack.phrases));
    if (needTranslation.length > 0) {
      process.stdout.write(`${lang}: translating ${needTranslation.length} phrases... `);
      try {
        const results = await translateBatch(needTranslation, lang);
        needTranslation.forEach((text, i) => { pack.phrases[text] = results[i]; });
        console.log('done');
      } catch (error) {
        console.log('BATCH FAIL, trying one-by-one');
        for (const text of needTranslation) {
          try {
            const [result] = await translateBatch([text], lang);
            pack.phrases[text] = result;
            process.stdout.write('.');
          } catch (e) {
            console.log(`\n  FAIL: ${JSON.stringify(text)}`);
          }
        }
        console.log('');
      }
    } else {
      console.log(`${lang}: ${added} keep-as-is phrases added, 0 need translation`);
    }
    
    fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`);
  }
  
  // Verify
  console.log('\n=== Verification ===');
  const sourceFiles = ['index.html','assets/deck-appendix.js','assets/deck-city-reframe.js','assets/deck-slide03-replica.js'];
  function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
  function unescapeQuoted(v) { return JSON.parse(`"${v}"`); }
  const enPhrases = new Set();
  const combined = sourceFiles.map(read).join('\n');
  for (const pattern of [/data-en="([^"]*)"/g, /data-en-placeholder="([^"]*)"/g]) {
    for (const m of combined.matchAll(pattern)) enPhrases.add(m[1]);
  }
  for (const f of sourceFiles.slice(1)) {
    const src = read(f);
    for (const m of src.matchAll(/tx\(\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) enPhrases.add(unescapeQuoted(m[1]));
    for (const m of src.matchAll(/\b(?:en|descEn|enTitle|enBody):\s*"((?:\\.|[^"\\])*)"/g)) enPhrases.add(unescapeQuoted(m[1]));
    for (const m of src.matchAll(/slide\(\s*\d+\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) {
      enPhrases.add(unescapeQuoted(m[1]));
      enPhrases.add(unescapeQuoted(m[2]));
    }
  }
  const index = read('index.html');
  const start = index.indexOf('const EN={');
  const end = index.indexOf('};\n    Object.assign(EN', start);
  for (const m of index.slice(start, end).matchAll(/:\s*"((?:\\.|[^"\\])*)"/g)) enPhrases.add(unescapeQuoted(m[1]));
  const extra = read('assets/deck-en-extra.js');
  for (const m of extra.matchAll(/:\s*"((?:\\.|[^"\\])*)"/g)) enPhrases.add(unescapeQuoted(m[1]));
  const enPack = JSON.parse(read('assets/i18n/en.json'));
  const walk = v => { if (typeof v === 'string') enPhrases.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  Object.entries(enPack).filter(([k]) => k !== '_meta').forEach(([,v]) => walk(v));
  const normalized = [...new Set([...enPhrases].map(v => v.replaceAll('&amp;','&').replaceAll('&quot;','"').trim()).filter(Boolean))];
  
  for (const lang of languages) {
    const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    const phrases = pack.phrases || {};
    const missing = normalized.filter(en => !(en in phrases));
    console.log(`${lang}: ${Object.keys(phrases).length} phrases, ${missing.length} missing from source`);
    if (missing.length > 0) missing.forEach(m => console.log(`  MISSING: ${JSON.stringify(m)}`));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
