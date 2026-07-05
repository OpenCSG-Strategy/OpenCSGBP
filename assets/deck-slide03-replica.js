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
    ["2008", "GitHub", "代码协作成为开放基础设施", "Code collaboration becomes open infrastructure"],
    ["2012", "GitHub", "开源分发进入规模化阶段", "Open-source distribution reaches scale"],
    ["2016", "GitLab", "私有化 DevOps 获得企业采用", "Self-hosted DevOps wins enterprise adoption"],
    ["2018", "Hugging Face", "模型与数据成为新型开放资产", "Models and data become new open assets"],
    ["2021", "GitLab", "DevOps 商业模式被资本市场验证", "The DevOps business model is market-validated"],
    ["2023", "AI Hub", "模型分发走向推理、评测与部署", "Model distribution expands into inference, evaluation and deployment"],
    ["2024", "OpenCSG", "AgenticOps 贯通资产、Agent 与运营", "AgenticOps connects assets, agents and operations"]
  ];

  section.className = "slide light slide03-redesign";
  section.dataset.layout = "EVOLUTION-REDESIGN";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
    <div class="topline"></div>
    <div class="section"><span class="section-zh" data-en="Paradigm Evolution　">范式演进　</span><span class="section-en">From DevOps to AgenticOps</span></div>
    <h2 class="title" data-en="DevOps manages software delivery; AgenticOps manages AI production and continuous improvement">DevOps 管理软件交付，AgenticOps 管理 AI 生产与持续进化</h2>

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
          <small>WHY NOW</small>
          <b>${tx("范式跃迁的产业证据", "Industry evidence for the paradigm shift")}</b>
          <p>${tx("开放资产从代码扩展到模型、数据与 Agent，生产系统也从交付转向持续运营。", "Open assets expanded from code to models, data and agents; production systems moved from delivery to continuous operations.")}</p>
        </header>
        <div class="evo3-timeline">
          ${milestones.map(([year, brand, zh, en], index) => `
            <article class="${index === milestones.length - 1 ? "active" : ""}">
              <time>${year}</time>
              <i></i>
              <b>${brand}</b>
              <p data-en="${esc(en)}">${zh}</p>
            </article>`).join("")}
        </div>
      </section>
    </div>
    <div class="foot"><span data-en="DevOps industrialized software delivery; AgenticOps industrializes intelligent-system production and evolution">DevOps 让软件交付工业化，AgenticOps 让智能系统生产与进化工业化</span><span>03</span></div>`;
})();
