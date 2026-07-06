(() => {
  const esc = (s = "") => s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const tx = (zh, en, tag = "span", cls = "") =>
    `<${tag}${cls ? ` class="${cls}"` : ""} data-en="${esc(en)}">${zh}</${tag}>`;
  const section = document.getElementById("slide-03");
  if (!section) return;

  const milestones = [
    ["2008", "GitHub", "代码协作成为开放基础设施", "Code collaboration becomes open infrastructure", "コード協業がオープンインフラに", "코드 협업이 오픈 인프라로"],
    ["2012", "GitHub", "开源分发进入规模化阶段", "Open-source distribution reaches scale", "オープンソースの配布が規模化", "오픈소스 배포가 규모화로"],
    ["2016", "GitLab", "私有化 DevOps 获得企业采用", "Self-hosted DevOps wins enterprise adoption", "セルフホスト DevOps が企業に浸透", "자체 호스팅 DevOps가 기업에 채택"],
    ["2018", "Hugging Face", "模型与数据成为新型开放资产", "Models and data become new open assets", "モデルとデータが新しいオープン資産に", "모델과 데이터가 새로운 오픈 자산으로"],
    ["2021", "GitLab", "DevOps 商业模式被资本市场验证", "The DevOps business model is market-validated", "DevOps のビジネスモデルが資本市場で検証", "DevOps 비즈니스 모델이 자본시장에서 검증"],
    ["2023", "AI Hub", "模型分发走向推理、评测与部署", "Model distribution expands into inference, evaluation and deployment", "モデル配布が推論・評価・デプロイへ", "모델 배포가 추론·평가·배포로 확장"],
    ["2024", "OpenCSG", "AgenticOps 贯通资产、Agent 与运营", "AgenticOps connects assets, agents and operations", "AgenticOps が資産・Agent・運用を貫通", "AgenticOps가 자산·Agent·운영을 연결"]
  ];

  section.className = "slide light slide03-redesign";
  section.dataset.layout = "EVOLUTION-REDESIGN";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
    <div class="topline"></div>
    <div class="section"><span class="section-zh" data-en="Paradigm Evolution　">范式演进　</span><span class="section-en">From DevOps to AgenticOps</span></div>
    <h2 class="title" data-i18n="slide03.title">DevOps 管理软件交付，AgenticOps 管理 AI 生产与持续进化</h2>

    <div class="evo3-modern">
      <section class="evo3-compare-ref" aria-label="DevOps 与 AgenticOps 原稿复刻">
        <figure class="evo3-ref-panel">
          <img src="assets/cases/slide03-left-reference.png?v=20260705b" alt="DevOps 原稿参考图">
        </figure>
        <div class="evo3-ref-arrow" aria-hidden="true">
          <small>AI NATIVE</small>
          <i></i>
        </div>
        <figure class="evo3-ref-panel">
          <img src="assets/cases/slide03-right-reference.png?v=20260705b" alt="AgenticOps 原稿参考图">
        </figure>
      </section>

      <section class="evo3-evidence">
        <header>
          <small data-i18n="slide03.evidenceLabel">WHY NOW</small>
          <b data-i18n="slide03.evidenceTitle">范式跃迁的产业证据</b>
          <p data-i18n="slide03.evidenceLead">开放资产从代码扩展到模型、数据与 Agent，生产系统也从交付转向持续运营。</p>
        </header>
        <div class="evo3-timeline">
          ${milestones.map(([year, brand, zh, en, ja, ko], index) => `
            <article class="${index === milestones.length - 1 ? "active" : ""}">
              <time>${year}</time>
              <i></i>
              <b>${brand}</b>
              <p data-i18n="slide03.milestone.${index}">${esc(zh)}</p>
            </article>`).join("")}
        </div>
      </section>
      <div class="evo3-trust-strip">
        <span class="evo3-trust-label" data-i18n="slide03.coBuildLabel">共建方</span>
        <div class="evo3-trust-logos">
          <img src="assets/case-logos/image49.png" alt="中国联通">
          <img src="assets/case-logos/image53.png" alt="中国移动">
          <img src="assets/case-logos/image56.png" alt="中国电信">
          <img src="assets/case-logos/image50.png" alt="中国一汽">
          <img src="assets/case-logos/image54.png" alt="三一重工">
          <img src="assets/case-logos/image52.png" alt="浪潮">
          <img src="assets/case-logos/image51.png" alt="Lenovo">
          <img src="assets/case-logos/image57.png" alt="Microsoft">
        </div>
        <span class="evo3-trust-tail" data-i18n="slide03.coBuildTail">+ 30 家生产环境共建方</span>
      </div>
    </div>
    <div class="foot"><span data-i18n="slide03.foot">DevOps 让软件交付工业化，AgenticOps 让智能系统生产与进化工业化</span><span>03</span></div>`;
})();
