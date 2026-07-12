(() => {
  const section = document.getElementById("slide-03");
  if (!section) return;

  const pains = [
    {
      n: "01",
      zh: "模型迭代太快，底层依赖失控",
      en: "Models evolve too fast for unmanaged dependencies",
      zhBody: "模型、价格、接口和权限持续变化，企业需要可替换、可评测、可回滚的迭代流程。",
      enBody: "Models, pricing, APIs and permissions keep changing; enterprises need replaceable, evaluable and rollback-ready iteration."
    },
    {
      n: "02",
      zh: "生产流程不能随模型变动中断",
      en: "Production workflows cannot stop when models change",
      zhBody: "AI 一旦进入客服、研发与风控，切换、升级和故障恢复必须在不中断业务的前提下完成。",
      enBody: "Once AI enters service, R&D and risk, switching, upgrading and recovery must happen without interrupting the business."
    },
    {
      n: "03",
      zh: "多模型、多工具与算力碎片化",
      en: "Models, tools and compute are fragmented",
      zhBody: "多云、多芯片、多模型和 Agent 工具彼此割裂，缺少统一资产、运行和观测视图。",
      enBody: "Multi-cloud, multi-chip, multi-model and agent tools are disconnected, without a unified asset, runtime and observability view."
    },
    {
      n: "04",
      zh: "可训练数据少，核心数据又不能外流",
      en: "Trainable data is scarce while core data cannot leave",
      zhBody: "企业缺少高质量可训练语料；客户、交易、设计与科研数据又必须留在自己的边界内。",
      enBody: "Enterprises lack high-quality trainable data, while customer, transaction, design and research data must remain inside their own boundary."
    },
    {
      n: "05",
      zh: "治理与安全必须内建于运行时",
      en: "Governance and security must be native to runtime",
      zhBody: "身份、权限、审计、回滚、沙箱和人工确认不能事后补丁，必须贯穿完整生命周期。",
      enBody: "Identity, access, audit, rollback, sandboxing and human approval must span the full lifecycle rather than arrive as afterthoughts."
    },
    {
      n: "06",
      zh: "成本与效果难以持续优化",
      en: "Cost and outcomes are hard to optimize continuously",
      zhBody: "Token、推理、GPU、Agent 调用与业务效果需要统一计量、路由、评测和持续优化。",
      enBody: "Tokens, inference, GPUs, agent calls and business outcomes require unified metering, routing, evaluation and continuous optimization."
    }
  ];

  section.className = "slide light slide03-pain-points";
  section.dataset.layout = "L10";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.png" alt="OpenCSG">
    <div class="topline"></div>
    <div class="section"><span class="section-zh" data-en="Industry Pain Points">行业痛点</span><span style="font-size:13px;color:#697472;font-weight:400">AI Production Pain Points</span></div>
    <h2 class="title" data-en="Enterprise AI must be sovereign, controllable and secure — integrated with the systems that run the business.">企业 AI 必须主权、可控、安全，并与真正运行业务的系统结合。</h2>

    <div class="pain-list">
      ${pains.map(item => `
        <div class="pain-item">
          <span class="pn">${item.n}</span>
          <h3 data-en="${item.en}">${item.zh}</h3>
          <p data-en="${item.enBody}">${item.zhBody}</p>
        </div>`).join("")}
    </div>

    <div class="foot"><span data-en="GitHub made software collaboration open; AgenticOps makes agents accountable in production">GitHub 让软件协作开放，AgenticOps 让智能体在生产中可控、可审计、可持续进化</span><span>03</span></div>`;

  window.DeckI18n?.translateTree?.(section);
})();
