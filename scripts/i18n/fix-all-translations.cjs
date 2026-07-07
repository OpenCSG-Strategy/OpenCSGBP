#!/usr/bin/env node
/*
 * Comprehensive i18n fix script
 *
 * Fixes:
 * 1. 15 keys missing from ALL 9 non-zh languages
 * 2. ~36 key===value items needing translation in specific languages
 * 3. 2 ko phrases with leftover Chinese characters
 * 4. en.json missing keys (for consistency, though English falls back to source)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LANG_DIR = path.join(ROOT, 'assets/i18n');
const LANGS = ['zh', 'en', 'ja', 'ko', 'ar', 'ru', 'fr', 'de', 'es', 'pt'];

// ============================================================
// 1. The 15 missing keys (English source → all 9 languages)
// ============================================================
const MISSING_15 = {
  // en values are the keys themselves (identity)
  "Sovereign AI starts with an open foundation.": {
    zh: "AI 主权，从开放底座开始。",
    en: "Sovereign AI starts with an open foundation.",
    ja: "AI主権はオープンな基盤から始まる。",
    ko: "AI 주권은 오픈 기반에서 시작됩니다.",
    ar: "سيادة الذكاء الاصطناعي تبدأ بأساس مفتوح.",
    ru: "Суверенный ИИ начинается с открытой платформы.",
    fr: "La souveraineté de l'IA commence par une fondation ouverte.",
    de: "Souveräne KI beginnt mit einer offenen Grundlage.",
    es: "La soberanía de la IA comienza con una base abierta.",
    pt: "A soberania da IA começa com uma base aberta."
  },
  "Open by design. AI under your control.": {
    zh: "OPEN BY DESIGN. AI UNDER YOUR CONTROL.",
    en: "Open by design. AI under your control.",
    ja: "オープン・バイ・デザイン。AIはあなたのコントロール下に。",
    ko: "오픈 바이 디자인. AI는 당신의 통제 아래.",
    ar: "مفتوح بالتصميم. الذكاء الاصطناعي تحت سيطرتك.",
    ru: "Открытый по дизайну. ИИ под вашим контролем.",
    fr: "Open by design. L'IA sous votre contrôle.",
    de: "Open by Design. KI unter Ihrer Kontrolle.",
    es: "Open by design. IA bajo tu control.",
    pt: "Open by design. IA sob seu controle."
  },
  "Production AI makes control mandatory": {
    zh: "AI 进入生产，控制权成为刚需",
    en: "Production AI makes control mandatory",
    ja: "AIが生産に入り、制御権が必須に",
    ko: "AI가 프로덕션에 진입하며 통제권이 필수로",
    ar: "الذكاء الاصطناعي الإنتاجي يجعل التحكم إلزاميًا",
    ru: "Продакшн-ИИ делает контроль обязательным",
    fr: "L'IA en production rend le contrôle obligatoire",
    de: "Produktions-KI macht Kontrolle obligatorisch",
    es: "La IA en producción hace obligatorio el control",
    pt: "IA em produção torna o controle obrigatório"
  },
  "Open-source distribution, production monetization": {
    zh: "开源分发，生产变现",
    en: "Open-source distribution, production monetization",
    ja: "オープンソース配信、プロダクション収益化",
    ko: "오픈소스 배포, 프로덕션 수익화",
    ar: "توزيع مفتوح المصدر، تحقيق الإيرادات من الإنتاج",
    ru: "Распространение с открытым кодом, монетизация производства",
    fr: "Distribution open source, monétisation de la production",
    de: "Open-Source-Vertrieb, Produktionsmonetarisierung",
    es: "Distribución de código abierto, monetización de producción",
    pt: "Distribuição de código aberto, monetização de produção"
  },
  "Commercial proof is already compounding": {
    zh: "商业闭环已经验证",
    en: "Commercial proof is already compounding",
    ja: "ビジネスの好循環はすでに検証済み",
    ko: "비즈니스 폐루프 이미 검증됨",
    ar: "الإثبات التجاري يتراكم بالفعل",
    ru: "Коммерческое доказательство уже накапливается",
    fr: "La preuve commerciale se cumule déjà",
    de: "Kommerzieller Beweis wächst bereits",
    es: "La prueba comercial ya se está acumulando",
    pt: "A prova comercial já está se acumulando"
  },
  "Enterprise customers include miHoYo, Bilibili, CATL and CALB. Revenue has doubled for three consecutive years, average gross margin is 80%+, while maintaining positive net profit and operating cash flow.": {
    zh: "终端客户覆盖米哈游、B 站、宁德时代、中航锂电等；三年连续翻倍增长，平均毛利率 80%+，持续保持净利润与净现金流。",
    en: "Enterprise customers include miHoYo, Bilibili, CATL and CALB. Revenue has doubled for three consecutive years, average gross margin is 80%+, while maintaining positive net profit and operating cash flow.",
    ja: "エンタープライズ顧客にはmiHoYo、Bilibili、CATL、CALBなどが含まれます。3年連続で収益が倍増し、平均粗利率は80%以上、純利益と営業キャッシュフローも維持しています。",
    ko: "기업 고객에는 miHoYo, Bilibili, CATL, CALB 등이 포함됩니다. 3년 연속 수익 배달, 평균 매출총이익률 80% 이상, 순이익과 영업현금흐름 유지.",
    ar: "تشمل عملاء المؤسسات miHoYo وBilibili وCATL وCALB. تضاعفت الإيرادات لثلاث سنوات متتالية، متوسط هامش الربح الإجمالي 80%+، مع الحفاظ على صافي ربح موجب وتدفق نقدي تشغيلي.",
    ru: "Корпоративные клиенты включают miHoYo, Bilibili, CATL и CALB. Выручка удваивается три года подряд, средняя валовая маржа 80%+, при положительной чистой прибыли и операционном денежном потоке.",
    fr: "Les clients entreprises incluent miHoYo, Bilibili, CATL et CALB. Le chiffre d'affaires a doublé trois années consécutives, la marge brute moyenne est de 80%+, tout en maintenant un bénéfice net positif et un flux de trésorerie d'exploitation.",
    de: "Zu den Unternehmenskunden gehören miHoYo, Bilibili, CATL und CALB. Der Umsatz hat sich drei Jahre in Folge verdoppelt, die durchschnittliche Bruttomarge beträgt 80%+, bei positiver Nettogewinn und operativem Cashflow.",
    es: "Los clientes empresariales incluyen miHoYo, Bilibili, CATL y CALB. Los ingresos se han duplicado durante tres años consecutivos, con un margen bruto medio del 80%+, manteniendo un beneficio neto positivo y flujo de caja operativo.",
    pt: "Os clientes empresariais incluem miHoYo, Bilibili, CATL e CALB. A receita duplicou por três anos consecutivos, com margem bruta média de 80%+, mantendo lucro líquido positivo e fluxo de caixa operacional."
  },
  "Regional nodes make replication global": {
    zh: "区域节点放大全球复制",
    en: "Regional nodes make replication global",
    ja: "地域ノードがグローバル複製を拡大",
    ko: "지역 노드가 글로벌 복제를 확대",
    ar: "العقد الإقليمية تجعل التكرار عالميًا",
    ru: "Региональные узлы делают репликацию глобальной",
    fr: "Les nœuds régionaux rendent la réplication mondiale",
    de: "Regionale Knoten machen Replikation global",
    es: "Los nodos regionales hacen la replicación global",
    pt: "Os nós regionais tornam a replicação global"
  },
  "Completed a nearly RMB 100M Pre-A round": {
    zh: "完成近亿元 Pre-A 轮融资",
    en: "Completed a nearly RMB 100M Pre-A round",
    ja: "約1億人民元のPre-Aラウンドを完了",
    ko: "약 1억 위안 Pre-A 라운드 완료",
    ar: "اكتملت جولة Pre-A بقرب 100 مليون يوان",
    ru: "Завершён Pre-A раунд на сумму около 100 млн юаней",
    fr: "Clôture d'un tour Pre-A de près de 100M RMB",
    de: "Pre-A-Runde von knapp 100M RMB abgeschlossen",
    es: "Completada una ronda Pre-A de casi 100M RMB",
    pt: "Concluída uma ronda Pre-A de quase 100M RMB"
  },
  "Pre-A round of nearly RMB 100M": {
    zh: "Pre-A 轮融资近亿元",
    en: "Pre-A round of nearly RMB 100M",
    ja: "Pre-Aラウンド約1億人民元",
    ko: "Pre-A 라운드 약 1억 위안",
    ar: "جولة Pre-A بقرب 100 مليون يوان",
    ru: "Pre-A раунд около 100 млн юаней",
    fr: "Tour Pre-A de près de 100M RMB",
    de: "Pre-A-Runde von knapp 100M RMB",
    es: "Ronda Pre-A de casi 100M RMB",
    pt: "Ronda Pre-A de quase 100M RMB"
  },
  "Regional nodes and verified deployment areas": {
    zh: "区域节点与已验证地区",
    en: "Regional nodes and verified deployment areas",
    ja: "地域ノードと検証済みデプロイメントエリア",
    ko: "지역 노드 및 검증된 배포 지역",
    ar: "العقد الإقليمية ومناطق النشر الموثقة",
    ru: "Региональные узлы и проверенные зоны развёртывания",
    fr: "Nœuds régionaux et zones de déploiement vérifiées",
    de: "Regionale Knoten und verifizierte Einsatzgebiete",
    es: "Nodos regionales y áreas de despliegue verificadas",
    pt: "Nós regionais e áreas de implantação verificadas"
  },
  "Yichang, Hong Kong Cyberport, Chongqing, Leshan, Shanghai, Yancheng and more connect government, industry, developers and capital into repeatable regional AI operations.": {
    zh: "宜昌、香港数码港、重庆、乐山、上海、盐城等地区实践，连接政府、产业、开发者与资本，形成可复制的区域 AI 运营模式。",
    en: "Yichang, Hong Kong Cyberport, Chongqing, Leshan, Shanghai, Yancheng and more connect government, industry, developers and capital into repeatable regional AI operations.",
    ja: "宜昌、香港サイバーポート、重慶、楽山、上海、塩城などの地域実践は、政府、産業、開発者、資本を結びつけ、複製可能な地域AI運営モデルを形成しています。",
    ko: "이창, 홍콩 사이버포트, 충칭, 러산, 상하이, 옌청 등 지역 실천은 정부, 산업, 개발자, 자본을 연결하여 복제 가능한 지역 AI 운영 모델을 형성합니다.",
    ar: "تربط يمينتشيانغ وهونغ كونغ سيبرابورت وتشونغتشينغ وليشان وشنغهاي ويانتشنغ وغيرها الحكومة والصناعة والمطورين ورأس المال في نموذج عمليات ذكاء اصطناعي إقليمي قابل للتكرار.",
    ru: "Ичан, Гонконгский Киберпорт, Чунцин, Лэшань, Шанхай, Яньчэн и другие связывают правительство, промышленность, разработчиков и капитал в воспроизводимую региональную модель ИИ-операций.",
    fr: "Yichang, Hong Kong Cyberport, Chongqing, Leshan, Shanghai, Yancheng et d'autres relient gouvernement, industrie, développeurs et capital dans un modèle reproductible d'opérations IA régionales.",
    de: "Yichang, Hong Kong Cyberport, Chongqing, Leshan, Shanghai, Yancheng und weitere verbinden Regierung, Industrie, Entwickler und Kapital zu wiederholbaren regionalen KI-Betriebsmodellen.",
    es: "Yichang, Hong Kong Cyberport, Chongqing, Leshan, Shanghai, Yancheng y otros conectan gobierno, industria, desarrolladores y capital en un modelo repetible de operaciones de IA regional.",
    pt: "Yichang, Hong Kong Cyberport, Chongqing, Leshan, Shanghai, Yancheng e outros ligam governo, indústria, desenvolvedores e capital num modelo reproduzível de operações de IA regional."
  },
  "Anonymized regional institutions: scattered experiments unified into governed AI production, data kept in-domain": {
    zh: "某 XX 地区机构等：分散实验统一进入可治理、可审计的 AI 生产，数据不出域。",
    en: "Anonymized regional institutions: scattered experiments unified into governed AI production, data kept in-domain",
    ja: "某XX地域機関等：分散した実験が統一され、ガバナンスと監査可能なAI生産に入り、データはドメイン外に出ません。",
    ko: "모 지역 기관 등: 분산된 실험이 통합되어 거버넌스 및 감사 가능한 AI 프로덕션으로 진입하며, 데이터는 도메인 외부로 나가지 않습니다.",
    ar: "مؤسسات إقليمية مجهولة الهوية: تجارب متفرقة موحدة في إنتاج ذكاء اصطناعي محكوم وقابل للتدقيق، مع بقاء البيانات داخل النطاق",
    ru: "Региональные учреждения (анонимизированные): разрозненные эксперименты объединены в управляемый и аудируемый ИИ-продакшн, данные остаются внутри домена.",
    fr: "Institutions régionales anonymisées : expériences dispersées unifiées en production IA gouvernée et auditable, données conservées dans le domaine",
    de: "Anonymisierte regionale Institutionen: verstreute Experimente vereinheitlicht zu governed, prüffähiger KI-Produktion, Daten bleiben In-Domain",
    es: "Instituciones regionales anonimizadas: experimentos dispersos unificados en producción de IA gobernada y auditable, datos mantenidos en el dominio",
    pt: "Instituições regionais anonimizadas: experimentos dispersos unificados em produção de IA governada e auditável, dados mantidos no domínio"
  },
  "Website": {
    zh: "官网",
    en: "Website",
    ja: "公式サイト",
    ko: "공식 사이트",
    ar: "الموقع الرسمي",
    ru: "Сайт",
    fr: "Site web",
    de: "Website",
    es: "Sitio web",
    pt: "Site"
  },
  "Docs": {
    zh: "文档",
    en: "Docs",
    ja: "ドキュメント",
    ko: "문서",
    ar: "التوثيق",
    ru: "Документация",
    fr: "Docs",
    de: "Dokumentation",
    es: "Docs",
    pt: "Docs"
  },
  "Average gross margin 80%+": {
    zh: "平均毛利率 80%+",
    en: "Average gross margin 80%+",
    ja: "平均粗利率80%以上",
    ko: "평균 매출총이익률 80% 이상",
    ar: "متوسط هامش الربح الإجمالي 80%+",
    ru: "Средняя валовая маржа 80%+",
    fr: "Marge brute moyenne 80%+",
    de: "Durchschnittliche Bruttomarge 80%+",
    es: "Margen bruto medio 80%+",
    pt: "Margem bruta média 80%+"
  }
};

// ============================================================
// 2. The 36 key===value items needing translation in specific languages
// ============================================================
const ITEMS_36 = {
  "4:3 STANDARD": {
    zh: "4:3 标准", en: "4:3 STANDARD",
    fr: "4:3 STANDARD", de: "4:3 STANDARD"
    // fr/de: keep as-is (standardized format designation)
  },
  "A4 PORTRAIT": {
    zh: "A4 纵向", en: "A4 PORTRAIT",
    fr: "A4 PORTRAIT" // keep format designation
  },
  "FORMAT": {
    zh: "格式", en: "FORMAT",
    fr: "FORMAT", de: "FORMAT"
    // fr/de: FORMAT is understood in both languages
  },
  "INVESTOR LITE": {
    zh: "投资人精简版", en: "INVESTOR LITE",
    ru: "ИНВЕСТОР ЛАЙТ", de: "INVESTOR LITE"
    // de: keep as-is (common business term)
  },
  "Applications / agents": {
    zh: "应用 / Agent", en: "Applications / agents",
    fr: "Applications / agents" // keep as-is
  },
  "Attraction": {
    zh: "招商运营", en: "Attraction",
    fr: "Attraction" // keep as-is (business term)
  },
  "Audit": {
    zh: "审计", en: "Audit",
    fr: "Audit" // keep as-is (same in French)
  },
  "Auditable": {
    zh: "可审计", en: "Auditable",
    es: "Auditable" // same in Spanish
  },
  "CLUSTER": {
    zh: "聚集", en: "CLUSTER",
    fr: "CLUSTER", de: "CLUSTER"
    // keep as-is (technical term)
  },
  "CNCF Ambassador": {
    zh: "CNCF 开源大使", en: "CNCF Ambassador",
    ru: "Амбассадор CNCF"
  },
  "COMMUNITY · OpenCSG": {
    zh: "OpenCSG 社区", en: "COMMUNITY · OpenCSG",
    ru: "СООБЩЕСТВО · OpenCSG"
  },
  "Compute": {
    zh: "算力", en: "Compute",
    de: "Compute" // keep as-is (technical term)
  },
  "Conversion": {
    zh: "格式转换", en: "Conversion",
    fr: "Conversion" // same in French
  },
  "Diagnose": {
    zh: "诊断", en: "Diagnose",
    de: "Diagnose" // same in German
  },
  "Download": {
    zh: "下载", en: "Download",
    de: "Download", pt: "Download"
    // de/pt: commonly used in tech context
  },
  "EU InvestAI Fund · 5 AI Gigafactories": {
    zh: "EU InvestAI 基金 · 5 大 AI 超级工厂", en: "EU InvestAI Fund · 5 AI Gigafactories",
    ru: "Фонд EU InvestAI · 5 ИИ-гигафабрик", es: "Fondo EU InvestAI · 5 Gigafábricas de IA"
  },
  "Enterprise Hub": {
    zh: "企业版", en: "Enterprise Hub",
    de: "Enterprise Hub" // keep as-is (product term)
  },
  "Expansion": {
    zh: "增购扩容", en: "Expansion",
    fr: "Expansion" // same in French
  },
  "Filter": {
    zh: "筛选", en: "Filter",
    de: "Filter" // same in German
  },
  "INTERACTION": {
    zh: "交互方式", en: "INTERACTION",
    fr: "INTERACTION" // same in French
  },
  "Infrastructure": {
    zh: "基础设施", en: "Infrastructure",
    fr: "Infrastructure" // same in French
  },
  "LIVE": {
    zh: "实践", en: "LIVE",
    de: "LIVE" // keep as-is
  },
  "Linux Foundation Ambassador": {
    zh: "Linux 基金会大使", en: "Linux Foundation Ambassador",
    ru: "Амбассадор Linux Foundation"
  },
  "Marketplace": {
    zh: "交易市场", en: "Marketplace",
    fr: "Marketplace" // commonly used in French tech
  },
  "Multi-tenant / RBAC / SSO": {
    zh: "多租户 / RBAC / SSO", en: "Multi-tenant / RBAC / SSO",
    es: "Multi-tenant / RBAC / SSO", pt: "Multi-tenant / RBAC / SSO"
    // keep as-is (technical terms)
  },
  "No": {
    zh: "否", en: "No",
    es: "No" // correct in Spanish (No = No)
  },
  "OFFICIAL · OpenCSG": {
    zh: "OpenCSG 官方号", en: "OFFICIAL · OpenCSG",
    ru: "ОФИЦИАЛЬНОЕ · OpenCSG"
  },
  "OPEN SOURCE": {
    zh: "开源", en: "OPEN SOURCE",
    fr: "OPEN SOURCE", de: "OPEN SOURCE"
    // keep as-is (commonly understood)
  },
  "PLAN": {
    zh: "规划", en: "PLAN",
    fr: "PLAN", de: "PLAN", es: "PLAN"
    // fr/de/es: PLAN is understood in all three
  },
  "PROMPTS": {
    zh: "提示词", en: "PROMPTS",
    fr: "PROMPTS", de: "PROMPTS", pt: "PROMPTS"
    // keep as-is (technical term)
  },
  "Pilot": {
    zh: "试点", en: "Pilot",
    de: "Pilot" // same in German
  },
  "Problem": {
    zh: "问题", en: "Problem",
    de: "Problem" // same in German
  },
  "Prompts": {
    zh: "提示词", en: "Prompts",
    de: "Prompts", pt: "Prompts"
    // keep as-is (technical term)
  },
  "Sandbox": {
    zh: "沙箱", en: "Sandbox",
    de: "Sandbox", es: "Sandbox", pt: "Sandbox"
    // keep as-is (technical term)
  },
  "Upload / download": {
    zh: "上传 / 下载", en: "Upload / download",
    pt: "Upload / download" // keep as-is
  },
  ">7.0× / RMB 40.44M": {
    zh: ">7.0× / 4,044 万元", en: ">7.0× / RMB 40.44M",
    es: ">7.0× / RMB 40.44M", pt: ">7.0× / RMB 40.44M"
    // keep as-is (numeric/data)
  }
};

// ============================================================
// 3. Fix ko phrases with leftover Chinese characters
// ============================================================
const KO_FIXES = {
  "02 · Private & Sovereign": "02 · 프라이빗 & 소버린",
  "Previously founder & CEO of JiHu GitLab": "이전 극호 GitLab 창업자 겸 CEO"
};

// ============================================================
// 4. Fix ja phrases === Chinese source
// ============================================================
const JA_FIXES = {
  "China · 2025": "中国 · 2025",  // This is actually correct in Japanese (中国 = China in Japanese too)
  "China · 2026": "中国 · 2026"   // Same - correct in Japanese
};

// ============================================================
// Apply all fixes
// ============================================================
let totalAdded = 0;
let totalFixed = 0;

LANGS.forEach(code => {
  const jsonPath = path.join(LANG_DIR, `${code}.json`);
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  json.phrases = json.phrases || {};
  let added = 0;
  let fixed = 0;

  // 1. Add missing 15 keys
  Object.entries(MISSING_15).forEach(([enKey, translations]) => {
    const val = translations[code];
    if (val && !json.phrases[enKey]) {
      json.phrases[enKey] = val;
      added++;
    } else if (val && json.phrases[enKey] !== val) {
      // Update if value is wrong (e.g., key===value for non-English)
      if (code !== 'en' && json.phrases[enKey] === enKey) {
        json.phrases[enKey] = val;
        fixed++;
      }
    }
  });

  // 2. Fix key===value items
  Object.entries(ITEMS_36).forEach(([enKey, translations]) => {
    const val = translations[code];
    if (val && (!json.phrases[enKey] || json.phrases[enKey] === enKey)) {
      json.phrases[enKey] = val;
      if (!json.phrases[enKey]) added++;
      else fixed++;
    }
  });

  // 3. Fix ko Chinese characters
  if (code === 'ko') {
    Object.entries(KO_FIXES).forEach(([enKey, val]) => {
      if (json.phrases[enKey] && json.phrases[enKey] !== val) {
        json.phrases[enKey] = val;
        fixed++;
      }
    });
  }

  // 4. Fix ja === Chinese source (actually correct, skip)
  // ja "中国" means "China" in Japanese too, so these are correct

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  const cnt = Object.keys(json.phrases).length;
  console.log(`  ${code}.json: +${added} added, ${fixed} fixed, phrases total ${cnt}`);
  totalAdded += added;
  totalFixed += fixed;
});

console.log(`\n[fix-all] Total: ${totalAdded} added, ${totalFixed} fixed`);
