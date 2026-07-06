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

  const stages = [
    {
      period: "2008",
      code: "01 · COMMUNITY",
      zhTitle: "内容与开发者社区",
      enTitle: "Knowledge & developer community",
      zhBody: "资讯、项目索引与交流，先解决“在哪里发现开源”。",
      enBody: "News, project discovery and discussion answer where open source is found.",
      logos: [
        { src: "assets/brand-logos/oschina.jpg", alt: "开源中国 OSCHINA", label: "OSCHINA" }
      ]
    },
    {
      period: "2008–2016",
      code: "02 · CODE / DEVOPS",
      zhTitle: "代码托管与研发协作",
      enTitle: "Code hosting & DevOps",
      zhBody: "代码协作、CI/CD 与企业研发，解决“怎样持续交付软件”。",
      enBody: "Collaboration, CI/CD and enterprise delivery answer how software ships.",
      logos: [
        { src: "assets/brand-logos/github.png", alt: "GitHub", label: "GitHub" },
        { src: "assets/brand-logos/gitee.png", alt: "Gitee", label: "Gitee" }
      ]
    },
    {
      period: "2018–2022",
      code: "03 · AI ASSET HUB",
      zhTitle: "模型与数据资产社区",
      enTitle: "Model & dataset hubs",
      zhBody: "模型、数据集成为新型开放资产，社区从代码扩展到 AI。",
      enBody: "Models and datasets become open assets as communities expand into AI.",
      logos: [
        { src: "assets/brand-logos/huggingface.png", alt: "Hugging Face", label: "Hugging Face" },
        { src: "assets/brand-logos/modelscope.png", alt: "魔搭 ModelScope", label: "ModelScope" }
      ]
    },
    {
      period: "2023–2024",
      code: "04 · TOKEN FACTORY",
      zhTitle: "Token 工厂 / MaaS",
      enTitle: "Token factory / MaaS",
      zhBody: "统一 API 与推理加速，把模型变成可规模消费的 Token。",
      enBody: "Unified APIs and inference turn models into tokens consumed at scale.",
      logos: [
        { src: "assets/brand-logos/siliconflow.png", alt: "硅基流动 SiliconFlow", label: "SiliconFlow" }
      ]
    },
    {
      period: "2024+",
      code: "05 · AGENTICOPS",
      zhTitle: "AI 生产与持续进化",
      enTitle: "AI production & evolution",
      zhBody: "贯通资产、算力、Agent、评测发布、运行反馈与再训练。",
      enBody: "Connect assets, compute, agents, release gates, operations and retraining.",
      logos: [
        { src: "assets/logo-opencsg.svg", alt: "OpenCSG", label: "OpenCSG", cls: "opencsg" }
      ],
      active: true
    }
  ];

  const renderLogo = ({ src, alt, label, cls = "" }) => `
    <span class="evo3-brand-chip ${cls}">
      <img src="${src}" alt="${alt}">
      ${label ? `<b>${label}</b>` : ""}
    </span>`;

  section.className = "slide light slide03-redesign";
  section.dataset.layout = "EVOLUTION-REDESIGN";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
    <div class="topline"></div>
    <div class="section"><span class="section-zh" data-en="Community Evolution　">社区范式演进　</span><span class="section-en">From Open-source Community to AI Production</span></div>
    <h2 class="title" data-en="Communities evolved from discovering open source to producing AI; OpenCSG connects the entire AgenticOps loop">社区从“发现开源”走向“生产 AI”，OpenCSG 贯通 AgenticOps 完整闭环</h2>

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

      <section class="evo3-evidence" aria-label="开源社区五阶段演进">
        <header>
          <small>5-STAGE EVOLUTION</small>
          <b data-en="What the community carries keeps expanding">社区承载的对象持续变化</b>
          <p data-en="Knowledge → code → models → tokens → intelligent systems">资讯 → 代码 → 模型 → Token → 智能系统</p>
          <span class="evo3-source" data-en="Dates: official brand sources; classification: OpenCSG research, Jul 2026">年份据各品牌官方资料；分类为 OpenCSG 研究口径（2026.07）</span>
        </header>
        <div class="evo3-timeline">
          ${stages.map((stage, index) => `
            <article class="${stage.active ? "active" : ""}">
              <div class="evo3-stage-head"><time>${stage.period}</time><i>${String(index + 1).padStart(2, "0")}</i></div>
              <small>${stage.code}</small>
              <div class="evo3-stage-logos">${stage.logos.map(renderLogo).join("")}</div>
              <b data-en="${esc(stage.enTitle)}">${esc(stage.zhTitle)}</b>
              <p data-en="${esc(stage.enBody)}">${esc(stage.zhBody)}</p>
            </article>`).join("")}
        </div>
      </section>
      <div class="evo3-differentiator">
        <div>
          <small>WHY OPENCSG IS DIFFERENT</small>
          <b data-en="The community is the entry point—not the destination">社区是入口，不是终点</b>
          <span data-en="OpenCSG turns open assets into production systems that organizations and individuals can control, operate and continuously improve.">OpenCSG 把开放资产变成组织与个人都能控制、运行、持续进化的生产系统。</span>
        </div>
        <p>
          <span data-en="Open asset entry">开放资产入口</span><i>×</i>
          <span data-en="Private compute">私有算力</span><i>×</i>
          <span data-en="Agent build">Agent 构建</span><i>×</i>
          <span data-en="Evaluation & release">评测发布</span><i>×</i>
          <span data-en="Operate & retrain">运行反馈 / 再训练</span>
        </p>
      </div>
    </div>
    <div class="foot"><span data-en="OpenCSG is not another model hub or token factory—it is an open AgenticOps production system">OpenCSG 不是另一个模型社区或 Token 工厂，而是开放的 AgenticOps 生产系统</span><span>03</span></div>`;
})();
