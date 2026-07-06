const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');
const {promisify} = require('util');
const execFileAsync = promisify(execFile);

const root = path.resolve(__dirname, '..');
const targets = ['ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt'];
const provider = process.env.TRANSLATION_PROVIDER || 'google';
const languageNames = {
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  ru: 'Russian',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  pt: 'Portuguese'
};
const sourceFiles = [
  'index.html',
  'assets/deck-appendix.js',
  'assets/deck-city-reframe.js',
  'assets/deck-slide03-replica.js'
].filter(relativePath => fs.existsSync(path.join(root, relativePath)));

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function unescapeQuoted(value) {
  return JSON.parse(`"${value}"`);
}

function collectPhrases() {
  const phrases = [];
  const combined = sourceFiles.map(read).join('\n');

  for (const pattern of [/data-en="([^"]*)"/g, /data-en-placeholder="([^"]*)"/g]) {
    for (const match of combined.matchAll(pattern)) phrases.push(match[1]);
  }

  for (const relativePath of sourceFiles.slice(1)) {
    const source = read(relativePath);
    for (const match of source.matchAll(/tx\(\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) {
      phrases.push(unescapeQuoted(match[1]));
    }
    for (const match of source.matchAll(/\b(?:en|descEn|enTitle|enBody):\s*"((?:\\.|[^"\\])*)"/g)) {
      phrases.push(unescapeQuoted(match[1]));
    }
    for (const match of source.matchAll(/slide\(\s*\d+\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) {
      phrases.push(unescapeQuoted(match[1]), unescapeQuoted(match[2]));
    }
  }

  const index = read('index.html');
  const start = index.indexOf('const EN={');
  const end = index.indexOf('};\n    Object.assign(EN', start);
  for (const match of index.slice(start, end).matchAll(/:\s*"((?:\\.|[^"\\])*)"/g)) {
    phrases.push(unescapeQuoted(match[1]));
  }

  const extra = read('assets/deck-en-extra.js');
  for (const match of extra.matchAll(/:\s*"((?:\\.|[^"\\])*)"/g)) {
    phrases.push(unescapeQuoted(match[1]));
  }

  const englishPack = JSON.parse(read('assets/i18n/en.json'));
  const walk = value => {
    if (typeof value === 'string') phrases.push(value);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  Object.entries(englishPack).filter(([key]) => key !== '_meta').forEach(([, value]) => walk(value));

  return [...new Set(phrases
    .map(value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').trim())
    .filter(value => value && !value.includes('${')))];
}

async function requestTranslation(text, language) {
  const {stdout} = await execFileAsync('curl', [
    '-sS',
    '--max-time', '30',
    'https://translate.googleapis.com/translate_a/single',
    '--data-urlencode', 'client=gtx',
    '--data-urlencode', 'sl=en',
    '--data-urlencode', `tl=${language}`,
    '--data-urlencode', 'dt=t',
    '--data-urlencode', `q=${text}`
  ], {maxBuffer: 10 * 1024 * 1024});
  const parsed = JSON.parse(stdout);
  return parsed[0].map(part => part[0]).join('');
}

async function translateBatch(batch, language, attempt = 1) {
  const input = batch.length === 1
    ? batch[0].text
    : batch.map(({ index, text }) => `<<<${index}>>> ${text}`).join('\n');
  let translated;
  try {
    translated = await requestTranslation(input, language);
  } catch (error) {
    if (attempt >= 6) throw error;
    await new Promise(resolve => setTimeout(resolve, 5000 * attempt));
    return translateBatch(batch, language, attempt + 1);
  }
  if (batch.length === 1) return new Map([[batch[0].index, translated.trim()]]);

  const result = new Map();
  const pattern = /<<<(\d+)>>>\s*([\s\S]*?)(?=\n?<<<\d+>>>|$)/g;
  for (const match of translated.matchAll(pattern)) result.set(Number(match[1]), match[2].trim());
  if (result.size === batch.length) return result;

  const middle = Math.ceil(batch.length / 2);
  const halves = await Promise.all([
    translateBatch(batch.slice(0, middle), language),
    translateBatch(batch.slice(middle), language)
  ]);
  return new Map(halves.flatMap(half => [...half]));
}

async function translateBatchWithMmx(batch, language, attempt = 1) {
  const source = Object.fromEntries(batch.map(({index, text}) => [String(index), text]));
  const message = `Translate every JSON value from English to ${languageNames[language]} for a professional investor presentation. Keep every key unchanged and return only one valid JSON object.\n${JSON.stringify(source)}`;
  try {
    const {stdout} = await execFileAsync('mmx', [
      'text', 'chat',
      '--model', 'MiniMax-M2.7-highspeed',
      '--temperature', '0.1',
      '--max-tokens', '16000',
      '--system', 'You are a professional localization engine. Preserve brand names, product names, URLs, numbers, currency, symbols, placeholders, and abbreviations. Translate every supplied value. Return only valid JSON.',
      '--message', message,
      '--output', 'json'
    ], {maxBuffer: 20 * 1024 * 1024});
    const envelope = JSON.parse(stdout);
    const text = envelope.content?.find(item => item.type === 'text')?.text || '';
    const jsonText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const translated = JSON.parse(jsonText);
    const result = new Map();
    batch.forEach(({index}) => {
      if (typeof translated[index] === 'string') result.set(index, translated[index].trim());
    });
    if (result.size !== batch.length) throw new Error(`expected ${batch.length} entries, received ${result.size}`);
    return result;
  } catch (error) {
    if (batch.length > 1 && attempt >= 2) {
      const middle = Math.ceil(batch.length / 2);
      const halves = [];
      halves.push(await translateBatchWithMmx(batch.slice(0, middle), language));
      halves.push(await translateBatchWithMmx(batch.slice(middle), language));
      return new Map(halves.flatMap(half => [...half]));
    }
    if (attempt >= 4) throw error;
    await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
    return translateBatchWithMmx(batch, language, attempt + 1);
  }
}

async function generateLanguage(language, phrases) {
  const filePath = path.join(root, 'assets/i18n', `${language}.json`);
  const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const existing = pack.phrases || {};
  const missing = phrases.filter(text => !existing[text]);
  const batches = [];
  const batchSize = provider === 'mmx' ? 150 : 30;
  for (let index = 0; index < missing.length; index += batchSize) {
    batches.push(missing.slice(index, index + batchSize).map((text, offset) => ({index:index + offset, text})));
  }

  const translated = {...existing};
  const concurrency = provider === 'mmx' ? 1 : 2;
  for (let index = 0; index < batches.length; index += concurrency) {
    const group = batches.slice(index, index + concurrency);
    const results = await Promise.all(group.map(batch => provider === 'mmx'
      ? translateBatchWithMmx(batch, language)
      : translateBatch(batch, language)));
    results.forEach(result => result.forEach((value, phraseIndex) => {
      translated[missing[phraseIndex]] = value;
    }));
    pack.phrases = translated;
    fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`);
    process.stdout.write(`${language}: ${Math.min(index + group.length, batches.length)}/${batches.length} batches\n`);
  }

  pack.phrases = Object.fromEntries(phrases.map(text => [text, translated[text] || existing[text] || text]));
  fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`);
}

function shouldReviewUnchanged(text) {
  const protectedTerms = new Set([
    'PDF', 'PDF + PPTX', '(OPC)', 'CLI', 'GUI', 'PLC', 'REST API', '3M+', '200K+',
    'CATL', 'CALB', 'CAICT', 'MIIT', 'miHoYo', 'Bilibili', 'Fit2Cloud',
    'Sam Chen', 'Ran Chen', 'Weifeng Liu', 'Da Lei', 'Hao Chen', 'Fang Chen',
    'JiHu GitLab', 'OpenCore', 'CodeSouler', 'DataFlow', 'OpenMind',
    'SiliconFlow', 'Longgang', 'Shanghai', 'Yancheng', 'Yichang', 'Chongqing',
    'Leshan', 'Dongfang', 'Hong Kong', 'Shenzhen', 'Sanxia'
  ]);
  if (protectedTerms.has(text)) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (text.includes('${') || text.includes('{current}') || /https?:|github\.com|opencsg\.com/.test(text)) return false;
  if (/^[\d\s+×.$%/:·→–—-]+[A-Za-z0-9\s+×.$%/:·→–—-]*$/.test(text)) return false;
  return true;
}

async function reviewUnchanged(language) {
  const filePath = path.join(root, 'assets/i18n', `${language}.json`);
  const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const candidates = Object.entries(pack.phrases || {})
    .filter(([source, translated]) => source === translated && shouldReviewUnchanged(source))
    .map(([text], index) => ({index, text}));
  if (!candidates.length) return;

  const corrected = {};
  for (let index = 0; index < candidates.length; index += 120) {
    const batch = candidates.slice(index, index + 120);
    const result = await translateBatchWithMmx(batch, language);
    result.forEach((value, candidateIndex) => {
      corrected[candidates[candidateIndex].text] = value;
    });
  }
  Object.assign(pack.phrases, corrected);
  fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`);
  process.stdout.write(`${language}: reviewed ${candidates.length} unchanged phrases\n`);
}

async function main() {
  const phrases = collectPhrases();
  process.stdout.write(`Collected ${phrases.length} English phrases.\n`);
  if (provider === 'mmx') {
    await Promise.all(targets.map(language => generateLanguage(language, phrases)));
  } else {
    for (const language of targets) await generateLanguage(language, phrases);
  }
  if (process.env.REVIEW_UNCHANGED === '1') {
    await Promise.all(targets.map(language => reviewUnchanged(language)));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
