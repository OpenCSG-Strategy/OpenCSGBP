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

// Phrases that should stay in English across all languages (proper nouns, brands, placeholders, etc.)
const keepEnglish = new Set([
  '${esc(en)}', '${esc(stage.enTitle)}', '${esc(stage.enBody)}',
  '(OPC)', '200K+', '3M+', '2023 · Angel', '2025 · Angel+',
  '>7.0× / RMB 40.44M', '{current} / {total}',
  'CAICT', 'CALB', 'CATL', 'MIIT', 'CNCF Ambassador',
  'CLI', 'GUI', 'PLC', 'REST API', 'PDF', 'PDF + PPTX',
  'CPU / GPU / Multiple backends',
  'CSGHub-Lite · CSGClaw · CSGHub',
  'China Mobile', 'China Unicom',
  'CodeSouler', 'DataFlow', 'Fit2Cloud', 'JiHu GitLab',
  'miHoYo', 'Bilibili', 'SiliconFlow', 'OpenCore', 'OpenMind',
  'ModelScope / OpenMind', 'ModelScope / Shizhi',
  'Hugging Face · ModelScope · Shizhi',
  'SiliconFlow · Fireworks · Replicate · vLLM',
  'OpenCSG_Investor_Deck_2026_EN.pdf',
  'OpenCSG Open Building', 'LONGGANG 1 + 5 + 2',
  'WECHAT · OpenCSG', 'WeChat Official Account · OpenCSG',
  'Sam Chen', 'Ran Chen', 'Weifeng Liu', 'Da Lei', 'Hao Chen', 'Fang Chen',
  'Stanford HPL', 'Wharton MBA', 'Linux Foundation Ambassador',
  'Lenovo Capital', 'Guoxin Zhongshu', 'Zhongke Shengzhe (Sugon)', 'Zhongkuang',
  'Hong Kong Cyberport', 'Hong Kong FinTech Forum', 'Singapore IMDA SPARK', 'WAIC OPC Challenge',
  'Lite + CSGClaw', 'Lenovo Capital · Guoxin Zhongshu',
  'Shanghai', 'Yancheng', 'Yichang', 'Chongqing', 'Leshan', 'Dongfang', 'Hong Kong',
  'Shenzhen Longgang', 'Sichuan · Leshan', 'Longgang',
  'AGV / Vision', 'CNC / Robot',
  '4:3 STANDARD', 'A4 PORTRAIT', 'FORMAT', 'IMAGE PPTX',
  'INVESTOR LITE',
]);

// Phrases that contain brand/proper-noun components but still have translatable parts
// — these still get sent to translation with instructions to preserve brand names
const preserveInTranslation = [
  'Assets → Build → Evaluate → Release → Run → Govern → OPC',
  'Benchmarks: ModelScope · Hugging Face · SiliconFlow',
  'Chief Architect · USTC',
  'Head of Product · Tsinghua',
  'Co-founder · cloud-native adoption',
  'Competitive thesis: enterprise control × production lifecycle × hardware neutrality × open foundation',
  'Open-source evidence:',
  'PERSONAL AI / OPC',
  'Community + Enterprise / Atlas',
  'Open core + Enterprise / Cloud',
  'Repo + Apache-2.0',
  'RBAC · Audit · SSO',
  'Multi-tenant / RBAC / SSO',
  'MaaS / Inference',
  'Model-as-a-Service',
  'Cloud / private / on-prem / air-gapped',
  'Heterogeneous compute · cross-chip',
  'CSGHub-Lite · CSGClaw · CSGHub',
  'ModelScope / OpenMind',
  'ModelScope / Shizhi',
  'Hugging Face · ModelScope · Shizhi',
  'SiliconFlow · Fireworks · Replicate · vLLM',
];

function collectSameAsKey(lang) {
  const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
  const phrases = pack.phrases || {};
  return Object.entries(phrases)
    .filter(([k, v]) => v && v === k && !keepEnglish.has(k))
    .map(([k]) => k);
}

async function translateBatch(batch, language, attempt = 1) {
  const source = Object.fromEntries(batch.map((text, i) => [String(i), text]));
  const message = `Translate every JSON value from English to ${languageNames[language]} for a professional investor presentation. Keep every key unchanged. Preserve brand names, product names, URLs, numbers, currency, symbols, placeholders, and abbreviations exactly as-is. Return only one valid JSON object with the same keys.\n${JSON.stringify(source)}`;
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
      return [
        ...await translateBatch(batch.slice(0, mid), language),
        ...await translateBatch(batch.slice(mid), language)
      ];
    }
    if (attempt >= 4) throw error;
    await new Promise(r => setTimeout(r, 1500 * attempt));
    return translateBatch(batch, language, attempt + 1);
  }
}

async function fixLanguage(lang) {
  const missing = collectSameAsKey(lang);
  if (missing.length === 0) {
    console.log(`${lang}: 0 missing — skip`);
    return;
  }
  console.log(`${lang}: ${missing.length} phrases to translate`);

  const batchSize = 25;
  const batches = [];
  for (let i = 0; i < missing.length; i += batchSize) {
    batches.push(missing.slice(i, i + batchSize));
  }

  const translations = {};
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    process.stdout.write(`${lang}: batch ${i+1}/${batches.length} (${batch.length} phrases)... `);
    const results = await translateBatch(batch, lang);
    batch.forEach((text, j) => { translations[text] = results[j]; });
    console.log('done');
  }

  const filePath = path.join(i18nDir, `${lang}.json`);
  const pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  pack.phrases = {...pack.phrases, ...translations};
  fs.writeFileSync(filePath, `${JSON.stringify(pack, null, 2)}\n`);

  const stillMissing = collectSameAsKey(lang);
  console.log(`${lang}: ${stillMissing.length} still untranslated after fix`);
}

async function main() {
  for (const lang of languages) {
    await fixLanguage(lang);
  }
  console.log('\n=== Summary ===');
  for (const lang of languages) {
    const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    const phrases = pack.phrases || {};
    const sameAsKey = Object.entries(phrases).filter(([k, v]) => v && v === k).length;
    console.log(`${lang}: ${Object.keys(phrases).length} phrases, ${sameAsKey} sameAsKey (should be proper nouns only)`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
