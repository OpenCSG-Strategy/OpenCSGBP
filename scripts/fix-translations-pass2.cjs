const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');
const {promisify} = require('util');
const execFileAsync = promisify(execFile);

const root = path.resolve(__dirname, '..');
const i18nDir = path.join(root, 'assets', 'i18n');

const languages = ['ru', 'fr', 'de', 'es', 'pt'];
const languageNames = {
  ja: 'Japanese', ko: 'Korean', ar: 'Arabic', ru: 'Russian',
  fr: 'French', de: 'German', es: 'Spanish', pt: 'Portuguese'
};

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

function collectSameAsKey(lang) {
  const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
  const phrases = pack.phrases || {};
  return Object.entries(phrases)
    .filter(([k, v]) => v && v === k && !keepEnglish.has(k))
    .map(([k]) => k);
}

async function translateOne(text, language, attempt = 1) {
  const message = `Translate this English UI label to ${languageNames[language]} for a professional investor presentation. Preserve brand names (OpenCSG, CSGHub, ModelScope, Hugging Face, SiliconFlow, Apache, USTC, Tsinghua), abbreviations (AI, OPC, OSS, RBAC, SSO, LLM, API, MaaS, CLI, GUI, NO-CODE), numbers, and symbols exactly as-is. Translate ALL other words. Return ONLY the translation, nothing else — no quotes, no explanation.\n\nEnglish: ${text}`;
  try {
    const {stdout} = await execFileAsync('mmx', [
      'text', 'chat',
      '--model', 'MiniMax-M2.7-highspeed',
      '--temperature', '0.1',
      '--max-tokens', '500',
      '--system', 'You are a professional localization engine. You ALWAYS translate. You NEVER return the original English. Return ONLY the translated text.',
      '--message', message,
      '--output', 'json'
    ], {maxBuffer: 20 * 1024 * 1024});
    const envelope = JSON.parse(stdout);
    const content = envelope.content?.find(item => item.type === 'text')?.text || '';
    // Strip any markdown quotes or formatting
    let result = content.trim().replace(/^["'"']+|["'"']+$/g, '').trim();
    if (!result || result === text) throw new Error('returned same or empty');
    return result;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise(r => setTimeout(r, 1000 * attempt));
    return translateOne(text, language, attempt + 1);
  }
}

async function fixLanguage(lang) {
  const missing = collectSameAsKey(lang);
  if (missing.length === 0) {
    console.log(`${lang}: 0 missing — skip`);
    return;
  }
  console.log(`${lang}: ${missing.length} phrases to translate (one-by-one)`);

  const translations = {};
  for (let i = 0; i < missing.length; i++) {
    const text = missing[i];
    process.stdout.write(`${lang}: ${i+1}/${missing.length} "${text.slice(0,50)}"... `);
    try {
      const result = await translateOne(text, lang);
      translations[text] = result;
      console.log('OK');
    } catch (error) {
      console.log('FAIL: ' + error.message);
    }
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
  console.log('\n=== Final Summary ===');
  for (const lang of ['ja','ko','ar','ru','fr','de','es','pt']) {
    const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
    const phrases = pack.phrases || {};
    const sameAsKey = Object.entries(phrases).filter(([k, v]) => v && v === k).length;
    const stillMissing = Object.entries(phrases).filter(([k, v]) => v && v === k && !keepEnglish.has(k)).length;
    console.log(`${lang}: ${Object.keys(phrases).length} phrases, ${sameAsKey} sameAsKey (${stillMissing} genuinely untranslated)`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
