(() => {
  const esc = (s = "") => s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const section = document.getElementById("slide-03");
  if (!section) return;

  const stages = [
    {
      period: "2008",
      code: "01 · GLOBAL COMMUNITY",
      cls: "stage-community",
      zhTitle: "内容、问答与开发者社区",
      enTitle: "Content, Q&A & developer community",
      zhBody: "资讯、问答、项目索引与协作社区，先解决“在哪里发现开源”。",
      enBody: "News, Q&A, project discovery and collaboration answer where open source is found.",
      zhObject: "资讯 / 问答 / 项目",
      enObject: "Knowledge / Q&A / projects",
      logos: [
        {
          src: "assets/brand-logos/oschina.jpg",
          alt: "开源中国 OSCHINA",
          label: "OSCHINA",
          url: "https://www.oschina.net/home/about"
        },
        {
          src: "assets/brand-logos/github.png",
          alt: "GitHub",
          label: "GitHub",
          url: "https://github.com/about/press"
        },
        {
          alt: "Stack Overflow",
          label: "Stack Overflow",
          cls: "stack text-only",
          url: "https://stackoverflow.co/company/"
        }
      ]
    },
    {
      period: "2008–2016",
      code: "02 · CODE / DEVOPS",
      zhTitle: "代码托管与研发协作",
      enTitle: "Code hosting & DevOps",
      zhBody: "代码协作、CI/CD 与企业研发，解决“怎样持续交付软件”。",
      enBody: "Collaboration, CI/CD and enterprise delivery answer how software ships.",
      zhObject: "代码 / 流水线",
      enObject: "Code / pipelines",
      logos: [
        {
          src: "assets/brand-logos/github.png",
          alt: "GitHub",
          label: "GitHub",
          url: "https://github.com/about/press"
        },
        {
          src: "assets/brand-logos/gitee.png",
          alt: "Gitee",
          label: "Gitee",
          url: "https://gitee.com/about_us"
        }
      ]
    },
    {
      period: "2018–2022",
      code: "03 · AI ASSET HUB",
      zhTitle: "模型与数据资产社区",
      enTitle: "Model & dataset hubs",
      zhBody: "模型、数据集成为新型开放资产，社区从代码扩展到 AI。",
      enBody: "Models and datasets become open assets as communities expand into AI.",
      zhObject: "模型 / 数据集",
      enObject: "Models / datasets",
      logos: [
        {
          src: "assets/brand-logos/huggingface.png",
          alt: "Hugging Face",
          label: "Hugging Face",
          url: "https://huggingface.co/blog/series-c"
        },
        {
          src: "assets/brand-logos/modelscope.png",
          alt: "魔搭 ModelScope",
          label: "ModelScope",
          url: "https://community.modelscope.cn/66988b50962e585a2563af79.html"
        }
      ]
    },
    {
      period: "2023–2024",
      code: "04 · TOKEN FACTORY",
      zhTitle: "Token 工厂 / MaaS",
      enTitle: "Token factory / MaaS",
      zhBody: "统一 API 与推理加速，把模型变成可规模消费的 Token。",
      enBody: "Unified APIs and inference turn models into tokens consumed at scale.",
      zhObject: "Token / API",
      enObject: "Tokens / APIs",
      logos: [
        {
          src: "assets/brand-logos/siliconflow.png",
          alt: "硅基流动 SiliconFlow",
          label: "SiliconFlow",
          url: "https://siliconflow.cn/about"
        }
      ]
    },
    {
      period: "2024+",
      code: "05 · AGENTICOPS",
      zhTitle: "AI 生产与持续进化",
      enTitle: "AI production & evolution",
      zhBody: "贯通资产、算力、Agent、评测发布、运行反馈与再训练。",
      enBody: "Connect assets, compute, agents, release gates, operations and retraining.",
      zhObject: "Agent / 运行数据",
      enObject: "Agents / runtime data",
      logos: [
        {
          src: "assets/logo-opencsg.png",
          alt: "OpenCSG",
          label: "",
          cls: "opencsg",
          url: "https://opencsg.com/docs/en/other/agenticops"
        }
      ],
      active: true
    }
  ];

  const renderLogo = ({ src, alt, label, cls = "", url }) => `
    <a class="evo3-brand-chip ${cls}" href="${url}" target="_blank" rel="noopener" title="${alt} · Official source">
      ${src ? `<img src="${src}" alt="${alt}">` : ""}
      ${label ? `<b>${label}</b>` : ""}
    </a>`;

  const devOpsLoop = `
    <svg class="evo3-loop" viewBox="0 0 720 260" aria-label="DevOps infinity lifecycle">
      <defs>
        <linearGradient id="evo3DevLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7FC4F0"/>
          <stop offset="100%" stop-color="#3FA8E5"/>
        </linearGradient>
        <linearGradient id="evo3DevRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3FA8E5"/>
          <stop offset="100%" stop-color="#1F7FC4"/>
        </linearGradient>
      </defs>
      <path d="M360 135C295 35 150 30 70 135C150 240 295 235 360 135" fill="none" stroke="url(#evo3DevLeft)" stroke-width="38" stroke-linecap="round"/>
      <path d="M360 135C425 35 570 30 650 135C570 240 425 235 360 135" fill="none" stroke="url(#evo3DevRight)" stroke-width="38" stroke-linecap="round"/>
      <path d="M70 135C150 30 295 35 360 135C425 235 570 240 650 135" fill="none" stroke="#1F7FC4" stroke-width="31" stroke-linecap="round"/>
      <text x="190" y="151" font-size="40" font-weight="800" fill="#3FA8E5" text-anchor="middle">Dev</text>
      <text x="530" y="151" font-size="40" font-weight="800" fill="#1F7FC4" text-anchor="middle">Ops</text>
      <g font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.1">
        <text x="196" y="57">CODE</text><text x="311" y="66">PLAN</text>
        <text x="196" y="220">BUILD</text><text x="311" y="224">TEST</text>
        <text x="409" y="66">RELEASE</text><text x="540" y="72">DEPLOY</text>
        <text x="540" y="207">OPERATE</text><text x="409" y="220">MONITOR</text>
      </g>
    </svg>`;

  const agenticOpsLoop = `
    <svg class="evo3-loop" viewBox="0 0 720 260" aria-label="AgenticOps infinity lifecycle">
      <defs>
        <linearGradient id="evo3AgentLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2EAFA0"/>
          <stop offset="100%" stop-color="#167A70"/>
        </linearGradient>
        <linearGradient id="evo3AgentRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7BDBC8"/>
          <stop offset="100%" stop-color="#2EAFA0"/>
        </linearGradient>
      </defs>
      <path d="M360 135C295 35 150 30 70 135C150 240 295 235 360 135" fill="none" stroke="url(#evo3AgentLeft)" stroke-width="38" stroke-linecap="round"/>
      <path d="M360 135C425 35 570 30 650 135C570 240 425 235 360 135" fill="none" stroke="url(#evo3AgentRight)" stroke-width="38" stroke-linecap="round"/>
      <path d="M70 135C150 30 295 35 360 135C425 235 570 240 650 135" fill="none" stroke="#167A70" stroke-width="31" stroke-linecap="round"/>
      <text x="190" y="149" font-size="31" font-weight="800" fill="#167A70" text-anchor="middle">Agentic</text>
      <text x="530" y="151" font-size="40" font-weight="800" fill="#2EAFA0" text-anchor="middle">Ops</text>
      <g font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.1">
        <text x="196" y="57">CODE</text><text x="311" y="66">PROMPT</text>
        <text x="196" y="220">BUILD</text><text x="311" y="224">TEST</text>
        <text x="409" y="66">RELEASE</text><text x="540" y="72">DEPLOY</text>
        <text x="540" y="207">OPERATE</text><text x="409" y="220">RETRAIN</text>
      </g>
    </svg>`;

  section.className = "slide light slide03-community-evolution";
  section.dataset.layout = "COMMUNITY-EVOLUTION";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.png" alt="OpenCSG">
    <div class="topline"></div>
    <div class="section"><span class="section-zh" data-en="Community Evolution　">社区范式演进　</span><span class="section-en">From Open-source Community to AI Production</span></div>
    <h2 class="title" data-en="Communities evolved from discovering open source to producing AI; OpenCSG connects the entire AgenticOps loop">社区从“发现开源”走向“生产 AI”，OpenCSG 贯通 AgenticOps 完整闭环</h2>

    <div class="evo3-community">
      <section class="evo3-compare-ref" aria-label="DevOps 与 AgenticOps 原版无穷号对比图">
        <figure class="evo3-ref-panel">
          <img src="assets/cases/slide03-left-reference.png?v=20260705b" alt="DevOps 原版无穷号">
        </figure>
        <div class="evo3-ref-arrow" aria-hidden="true">
          <small>AI NATIVE</small>
          <i></i>
        </div>
        <figure class="evo3-ref-panel">
          <img src="assets/cases/slide03-right-reference.png?v=20260705b" alt="AgenticOps 原版无穷号">
        </figure>
      </section>

      <section class="evo3-generation" aria-label="开源社区五阶段演进">
        <header>
          <small>5-STAGE EVOLUTION</small>
          <b data-en="What the community carries keeps expanding">社区承载的对象持续变化</b>
          <p data-en="Knowledge → code → models → tokens → intelligent systems">资讯 → 代码 → 模型 → Token → 智能系统</p>
          <span data-en="Dates: official brand sources; classification: OpenCSG research, Jul 2026">年份据各品牌官方资料；分类为 OpenCSG 研究口径（2026.07）</span>
        </header>
        <div class="evo3-stages">
          ${stages.map((stage, index) => `
            <article class="${stage.active ? "active" : ""} ${stage.cls || ""}">
              <div class="evo3-stage-head"><time>${stage.period}</time><i>${String(index + 1).padStart(2, "0")}</i></div>
              <small>${stage.code}</small>
              <div class="evo3-stage-logos">${stage.logos.map(renderLogo).join("")}</div>
              <b data-en="${esc(stage.enTitle)}">${esc(stage.zhTitle)}</b>
              <p data-en="${esc(stage.enBody)}">${esc(stage.zhBody)}</p>
              <em data-en="${esc(stage.enObject)}">${esc(stage.zhObject)}</em>
            </article>`).join("")}
        </div>
      </section>

      <div class="evo3-thesis">
        <div>
          <small>WHY OPENCSG IS DIFFERENT</small>
          <b data-en="The community is the entry point—not the destination">社区是入口，不是终点</b>
          <span data-en="OpenCSG does not stop at single-layer distribution; it connects open assets with an AI production loop that organizations and individuals can control.">OpenCSG 不停留在单层分发，而是把开放资产与组织、个人可控的 AI 生产闭环接在一起。</span>
        </div>
        <p>
          <span data-en="Open assets">开放资产</span><i>×</i>
          <span data-en="Private compute">私有算力</span><i>×</i>
          <span data-en="Agent build">Agent 构建</span><i>×</i>
          <span data-en="Evaluation & release">评测发布</span><i>×</i>
          <span data-en="Operate & retrain">运行反馈 / 再训练</span>
        </p>
      </div>
    </div>
    <div class="foot"><span data-en="OpenCSG is not another model hub or token factory—it is an open AgenticOps production system">OpenCSG 不是另一个模型社区或 Token 工厂，而是开放的 AgenticOps 生产系统</span><span>03</span></div>`;
})();
