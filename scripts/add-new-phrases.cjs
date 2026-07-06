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

// Collect all English phrases from source files
function collectPhrases() {
  const phrases = new Set();
  const sourceFiles = ['index.html','assets/deck-appendix.js','assets/deck-city-reframe.js','assets/deck-slide03-replica.js'];
  function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
  function unescapeQuoted(v) { return JSON.parse(`"${v}"`); }
  
  const combined = sourceFiles.map(read).join('\n');
  for (const pattern of [/data-en="([^"]*)"/g, /data-en-placeholder="([^"]*)"/g]) {
    for (const m of combined.matchAll(pattern)) phrases.add(m[1]);
  }
  for (const f of sourceFiles.slice(1)) {
    const src = read(f);
    for (const m of src.matchAll(/tx\(\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) phrases.add(unescapeQuoted(m[1]));
    for (const m of src.matchAll(/\b(?:en|descEn|enTitle|enBody):\s*"((?:\\.|[^"\\])*)"/g)) phrases.add(unescapeQuoted(m[1]));
    for (const m of src.matchAll(/slide\(\s*\d+\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) {
      phrases.add(unescapeQuoted(m[1]));
      phrases.add(unescapeQuoted(m[2]));
    }
  }
  const index = read('index.html');
  const start = index.indexOf('const EN={');
  const end = index.indexOf('};\n    Object.assign(EN', start);
  for (const m of index.slice(start, end).matchAll(/:\s*"((?:\\.|[^"\\])*)"/g)) phrases.add(unescapeQuoted(m[1]));
  const extra = read('assets/deck-en-extra.js');
  for (const m of extra.matchAll(/:\s*"((?:\\.|[^"\\])*)"/g)) phrases.add(unescapeQuoted(m[1]));
  const enPack = JSON.parse(read('assets/i18n/en.json'));
  const walk = v => { if (typeof v === 'string') phrases.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  Object.entries(enPack).filter(([k]) => k !== '_meta').forEach(([,v]) => walk(v));
  
  return [...new Set([...phrases].map(v => v.replaceAll('&amp;','&').replaceAll('&quot;','"').trim()).filter(Boolean))];
}

async function translateBatch(batch, language, attempt = 1) {
  const source = Object.fromEntries(batch.map((text, i) => [String(i), text]));
  const message = `Translate every JSON value from English to ${languageNames[language]} for a professional investor presentation. Keep every key unchanged. Preserve brand names (OpenCSG, CSGHub, GitHub, NVIDIA, WAIC, B.ai, Ollama, GGUF, SafeTensors, MCP, Webhook, REST, API, OPC, AgenticOps, Manager, Worker, Solo, CAICT, IMDA, PIF, HUMAIN, IndiaAI), URLs, numbers, currency symbols, and abbreviations exactly as-is. Translate ALL other words. Return only one valid JSON object with the same keys.\n${JSON.stringify(source)}`;
  try {
    const {stdout} = await execFileAsync('mmx', [
      'text', 'chat',
      '--model', 'MiniMax-M2.7-highspeed',
      '--temperature', '0.1',
      '--max-tokens', '8000',
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
    if (batch.length > 1 && attempt >= 2) {
      const mid = Math.ceil(batch.length / 2);
      return [...await translateBatch(batch.slice(0, mid), language), ...await translateBatch(batch.slice(mid), language)];
    }
    if (attempt >= 4) throw error;
    await new Promise(r => setTimeout(r, 1500 * attempt));
    return translateBatch(batch, language, attempt + 1);
  }
}

async function main() {
  const allPhrases = collectPhrases();
  console.log(`Total source phrases: ${allPhrases.length}`);
  
  for (const lang of languages) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!pack.phrases) pack.phrases = {};
    
    const missing = allPhrases.filter(p => !(p in pack.phrases));
    if (missing.length === 0) {
      console.log(`${lang}: 0 missing ✓`);
      continue;
    }
    
    console.log(`${lang}: ${missing.length} missing`);
    const batchSize = 20;
    const batches = [];
    for (let i = 0; i < missing.length; i += batchSize) {
      batches.push(missing.slice(i, i + batchSize));
    }
    
    const translations = {};
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      process.stdout.write(`  batch ${i+1}/${batches.length}... `);
      try {
        const results = await translateBatch(batch, lang);
        batch.forEach((text, j) => { translations[text] = results[j]; });
        console.log('done');
      } catch (error) {
        console.log('FAIL: ' + error.message);
      }
    }
    
    pack.phrases = {...pack.phrases, ...translations};
    fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`);
  }
  
  // Final verification
  console.log('\n=== Final Verification ===');
  let allGood = true;
  for (const lang of languages) {
    const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    const phrases = pack.phrases || {};
    const missing = allPhrases.filter(p => !(p in phrases));
    if (missing.length === 0) {
      console.log(`${lang}: ${Object.keys(phrases).length} phrases, 0 missing ✓`);
    } else {
      allGood = false;
      console.log(`${lang}: ${missing.length} MISSING ✗`);
      missing.forEach(m => console.log(`  ${JSON.stringify(m).slice(0,80)}`));
    }
  }
  console.log(allGood ? '\n✓ All covered!' : '\n✗ Still missing');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
