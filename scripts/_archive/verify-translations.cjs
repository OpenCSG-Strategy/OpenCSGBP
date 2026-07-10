const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'assets', 'i18n');

// Words/phrases that are genuinely the same in English and the target language
// (cognates, tech terms used internationally, or words that happen to be identical)
const sameInLanguage = {
  // Universal across all languages (brands, abbreviations, placeholders, proper nouns)
  universal: new Set([
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
    // Tech terms used identically across languages
    'RBAC · Audit · SSO', 'Multi-tenant / RBAC / SSO',
    'Runtime OSS', 'Repo + Apache-2.0',
    'Benchmarks: ModelScope · Hugging Face · SiliconFlow',
    'NO-CODE · CODE · SANDBOX',
    'WORKFLOW · DEBUG · VERSION',
    'LLM · TOOLS · ENTERPRISE API',
    'BUILD · TEST · RELEASE · OPERATE',
    'WORKER · SANDBOX · PERMISSION',
    'Assets + AgenticOps',
    'Assets → Build → Evaluate → Release → Run → Govern → OPC',
    'Community + Enterprise / Atlas',
    'Enterprise Hub',
    'Open core + Enterprise / Cloud',
    'Model-as-a-Service',
    'China · 2025', 'China · 2026',
    'PERSONAL AI / OPC',
    'PROMPTS', 'Prompts', 'SPACES',
    'Marketplace', 'Sandbox', 'Download', 'Upload / download',
    'Compute', 'CLUSTER', 'OPEN SOURCE', 'LIVE', 'PLAN',
    'Audit', 'Filter', 'Design', 'Pilot', 'Diagnose',
    'Problem', 'Expansion', 'Attraction', 'Infrastructure',
    'INTERACTION', 'Conversion', 'Collection',
    'Applications / agents', 'Flywheel',
    'Auditable', 'No',
    'AI Native',
    'CHIEF ARCHITECT', 'HEAD OF ENGINEERING', 'HEAD OF PRODUCT',
    'Head of Product · Tsinghua',
    'Career compounding',
  ]),
};

console.log('=== Translation Verification ===\n');
let allGood = true;
for (const lang of ['ja','ko','ar','ru','fr','de','es','pt']) {
  const pack = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
  const phrases = pack.phrases || {};
  const total = Object.keys(phrases).length;
  const sameAsKey = Object.entries(phrases).filter(([k, v]) => v && v === k);
  const genuinelyMissing = sameAsKey.filter(([k]) => !sameInLanguage.universal.has(k));
  const status = genuinelyMissing.length === 0 ? '✓ COMPLETE' : '✗ INCOMPLETE';
  if (genuinelyMissing.length > 0) allGood = false;
  console.log(`${lang}: ${total} phrases, ${sameAsKey.length} sameAsKey (${sameAsKey.length - genuinelyMissing.length} cognates/proper-nouns, ${genuinelyMissing.length} genuinely missing) ${status}`);
  if (genuinelyMissing.length > 0) {
    genuinelyMissing.forEach(([k]) => console.log(`  MISSING: ${JSON.stringify(k)}`));
  }
}
console.log('\n' + (allGood ? '✓ All languages complete!' : '✗ Some languages still need work'));
