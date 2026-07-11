(() => {
  const esc = (s = "") => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const tx = (zh, en, tag = "span", cls = "") =>
    `<${tag}${cls ? ` class="${cls}"` : ""} data-en="${esc(en)}">${zh}</${tag}>`;
  const communityHref = key => window.OpenCSGCommunity?.href(key) || "#";

  const setText = (selector, zh, en) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = zh;
    el.setAttribute("data-en", en);
  };

  const setPlatformDefault = () => {
    const slide = document.querySelector("#slide-09");
    if (!slide) return;
    slide.querySelectorAll("[data-arch-view]").forEach(button => {
      button.classList.toggle("active", button.dataset.archView === "platform");
    });
    slide.querySelectorAll("[data-arch-panel]").forEach(panel => {
      panel.classList.toggle("active", panel.dataset.archPanel === "platform");
    });
  };

  const replaceMarketVisual = () => {
    const fig = document.querySelector("#slide-10 .m10-hero-visual");
    if (!fig) return;
    fig.classList.add("m10-architecture-visual");
    fig.innerHTML = `
      <div class="m10-stack-scene" aria-label="AI 主权开放基础设施示意">
        <div class="m10-globe-ring"></div>
        <div class="m10-stack-core">
          <small>OPENCSG</small>
          <b data-en="Sovereign AI Control Layer">主权 AI 控制层</b>
          <span data-en="Models · Data · Compute · Agents">模型 · 数据 · 算力 · Agent</span>
        </div>
        <div class="m10-layer layer-assets"><b data-en="AI Assets">AI 资产</b><span>Models / Data / MCP</span></div>
        <div class="m10-layer layer-govern"><b data-en="Governance">治理</b><span>Audit / RBAC / Evaluation</span></div>
        <div class="m10-layer layer-runtime"><b data-en="Runtime">运行</b><span>Cloud / Local / Edge</span></div>
        <div class="m10-node node-enterprise"><small>01</small><b data-en="Enterprise production">企业生产</b></div>
        <div class="m10-node node-city"><small>02</small><b data-en="City infrastructure">城市基础设施</b></div>
        <div class="m10-node node-developer"><small>03</small><b data-en="Developer ecosystem">开发者生态</b></div>
        <div class="m10-pulse p1"></div><div class="m10-pulse p2"></div><div class="m10-pulse p3"></div>
        <div class="m10-policy-proof">
          <article><small>EU · INVESTAI</small><b data-en="EUR 20B AI Gigafactory fund">€20B AI Gigafactory 基金</b><span data-en="Up to five AI Gigafactories for sovereign compute.">面向主权算力建设最多 5 座 AI Gigafactory。</span></article>
          <article><small>CHINA · AI+</small><b data-en="70% by 2027 / 90% by 2030 adoption targets">2027 超 70% / 2030 超 90%</b><span data-en="Smart terminals and agent applications enter national targets.">智能终端与智能体应用进入国家目标。</span></article>
          <article><small>MCKINSEY · 2025</small><b data-en="88% of organizations use AI regularly">88% 组织常态化使用 AI</b><span data-en="Adoption is broad; production governance remains the gap.">采用已普及，生产治理仍是缺口。</span></article>
        </div>
      </div>
      <figcaption class="m10-tag m10-tag-tr" data-en="Policy accelerates build-out; enterprises pay for control and production.">政策推动建设，企业为控制权与生产能力付费</figcaption>
      <figcaption class="m10-tag m10-tag-bl" data-en="The opportunity is not another model API; it is the operating layer for sovereign AI.">机会不是另一个模型 API，而是主权 AI 的运营层</figcaption>`;
  };

  const refineSlide11 = () => {
    setText("#slide-11 .title",
      "OPC 的核心不是聊天，而是把模型、知识、工具和执行留在个人侧",
      "OPC is not chat; it keeps models, knowledge, tools and execution on the personal side");
    const stage = document.querySelector("#slide-11 .opc11");
    if (!stage || stage.classList.contains("opc11-story")) return;
    stage.className = "opc11 opc11-story";
    stage.innerHTML = `
      <section class="opc11-hero-system">
        <div class="opc11-hero-copy">
          <small>PERSONAL OPERATING COMPUTER</small>
          <b data-en="The next personal AI is a local work system, not another chat window.">下一代个人 AI 是本地工作系统，不是另一个聊天窗口。</b>
          <p data-en="Models, memory, private files, tools and multi-agent execution stay around the individual and run continuously.">模型、记忆、私有文件、工具和多 Agent 执行围绕个人持续运行。</p>
        </div>
        <div class="opc11-device-visual" aria-label="OPC personal AI work system">
          <div class="opc11-screen">
            <div class="opc11-screen-top"><span></span><span></span><span></span></div>
            <div class="opc11-person-core"><small>OPC</small><b data-en="Personal AI">个人 AI</b></div>
            <div class="opc11-module data"><b data-en="Private data">私有数据</b><span>Files · Notes · Context</span></div>
            <div class="opc11-module model"><b data-en="Local / cloud model">模型运行</b><span>Local · API · Hybrid</span></div>
            <div class="opc11-module tools"><b data-en="Tools">工具</b><span>Browser · IDE · Apps</span></div>
            <div class="opc11-module agents"><b data-en="Agents">Agent 执行</b><span>Plan · Run · Review</span></div>
            <svg viewBox="0 0 640 360" aria-hidden="true">
              <path d="M320 176 C226 88 140 100 114 184 C86 276 202 298 320 176Z"/>
              <path d="M320 176 C414 88 500 100 526 184 C554 276 438 298 320 176Z"/>
              <path d="M160 260 C236 326 404 326 480 260"/>
            </svg>
          </div>
          <div class="opc11-product-ribbon">
            <span><em>&#9312;</em><b>CSGHub-Lite</b><small data-en="Data accumulation entry">数据积累入口</small></span><i>&#8594;</i><span><em>&#9313;</em><b>CSGClaw</b><small data-en="Agent experiments">智能体实验</small></span><i>&#8594;</i><span class="step-org"><em>&#9314;</em><b data-en="Org OPC">组织型 OPC</b><small data-en="Hosted asset governance">资产托管治理</small></span><i>&#8594;</i><span class="step-hub"><em>&#9315;</em><b>AgenticHub</b><small data-en="Collaboration & monetization">协作商业化</small></span>
          </div>
        </div>
      </section>
      <aside class="opc11-evidence-panel">
        <div class="opc11-core-thesis">
          <small>INVESTMENT POINT</small>
          <b data-en="The market is forming where open-source developers, local AI hardware and agent workflows meet.">开源开发者、本地 AI 硬件与 Agent 工作流正在汇合成 OPC 市场。</b>
        </div>
        <div class="opc11-proof-stack">
          <article>
            <small>GITHUB · OCTOVERSE 2025</small>
            <b>180M+</b>
            <span data-en="Developers on GitHub; more than one new developer joins every second.">GitHub 开发者；每秒新增 1+ 开发者。</span>
            <a href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" target="_blank" rel="noopener">source</a>
          </article>
          <article>
            <small>AI REPOSITORIES</small>
            <b>1.1M</b>
            <span data-en="Public repositories using LLM SDKs, with 693K added in the past 12 months.">公开仓库使用 LLM SDK，过去 12 个月新增 693K。</span>
            <a href="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" target="_blank" rel="noopener">source</a>
          </article>
          <article>
            <small>GARTNER · AI PC</small>
            <b>114M</b>
            <span data-en="AI PC shipments projected in 2025; local inference becomes mainstream hardware capacity.">2025 年 AI PC 预计出货量，本地推理成为主流硬件能力。</span>
            <a href="https://www.gartner.com/en/newsroom/press-releases/2024-09-25-gartner-forecasts-worldwide-shipments-of-artificial-intelligence-pcs-to-account-for-43-percent-of-all-pcs-in-2025" target="_blank" rel="noopener">source</a>
          </article>
        </div>
        <div class="opc11-tam-card">
          <small>2026 BASE-CASE · BOTTOM-UP</small>
          <b>$2.16B</b>
          <em>≈ RMB 15.6B OPC TAM</em>
          <p data-en="180M GitHub developers × 10% OPC-ready professionals × $120 annual ARPU. OpenCSG base case, not a third-party forecast.">180M GitHub 开发者 × 10% OPC-ready 专业用户 × $120 年 ARPU。OpenCSG 基准假设，不是第三方预测。</p>
        </div>
        <div class="opc11-policy-strip">
          <span data-en="China AI+ targets intelligent-device and agent adoption above 70% by 2027.">中国 AI+：2027 年智能终端与智能体应用普及率超 70%。</span>
          <span data-en="EU Data Act strengthens user rights over connected-device data access and sharing.">EU Data Act：强化用户对联网设备数据的访问、使用与授权分享权利。</span>
        </div>
      </aside>`;
  };

  const refineSlide12 = () => {
    const open = document.querySelector("#slide-12 .open12");
    if (!open || open.querySelector(".oc12-flywheel")) return;
    open.insertAdjacentHTML("afterbegin", `
      <section class="oc12-flywheel">
        <article class="oc12-model-summary">
          <small>HOW OPENCORE WORKS</small>
          <b data-en="Open adoption, paid production boundaries">开放采用，生产边界付费</b>
          <p data-en="Keep the core open for distribution and trust. Monetize the production boundary: governance, scale, security, SLA and managed operations.">核心能力保持开放，获得分发与信任；生产边界向企业收费，承接治理、规模化、安全、SLA 与托管运营。</p>
        </article>
        <div class="oc12-model-flow">
          <span><em>01</em><strong data-en="Open product entry">开放产品入口</strong><small data-en="Repo, core features and public releases">Repo、核心功能与版本公开</small></span>
          <i>→</i>
          <span><em>02</em><strong data-en="Community adoption">社区采用</strong><small data-en="Assets and trust accumulate">资产沉淀与信任扩散</small></span>
          <i>→</i>
          <span><em>03</em><strong data-en="Production upgrade">企业生产增强</strong><small data-en="Compute, security and governance">算力、安全与组织治理</small></span>
          <i>→</i>
          <span><em>04</em><strong data-en="Recurring revenue">持续收入</strong><small data-en="License, SaaS and support services">License、SaaS 与支持服务</small></span>
        </div>
        <aside class="oc12-precedents" aria-label="OpenCore precedent examples">
          <small data-en="STAR CASES · PROVEN OPENCORE PATHS">明星案例 · 已验证路径</small>
          <div>
            <span><b>GitLab</b><em data-en="Open DevOps core → enterprise governance">开放 DevOps 核心 → 企业治理</em></span>
            <span><b>MongoDB</b><em data-en="Open database → Atlas cloud service">开放数据库 → Atlas 云服务</em></span>
            <span><b>Elastic</b><em data-en="Open search → cloud &amp; security">开放搜索 → 云与安全</em></span>
            <span><b>Grafana</b><em data-en="Open observability → enterprise stack">开放可观测 → 企业套件</em></span>
            <span><b>Confluent</b><em data-en="Open Kafka → managed streaming">开放 Kafka → 托管流式服务</em></span>
            <span><b>HashiCorp</b><em data-en="Open infra tools → team governance">开放基础设施 → 团队治理</em></span>
          </div>
        </aside>
      </section>`);
    // The current OpenCore layout already contains the flywheel, edition story,
    // capability matrix and delivery boundary. The former detail-grid was an
    // obsolete fallback; its styles are intentionally no longer loaded, so
    // injecting it here makes the slide flow out of the 900px canvas.
  };

  const refineSlide20 = () => {
    const slide = document.querySelector("#slide-20");
    if (!slide) return;
    const oldDiagram = slide.querySelector(".app-building > .app-media.contain[style*='position:absolute']");
    oldDiagram?.remove();
    const media = slide.querySelector(".app-building > .app-media");
    if (media && !media.querySelector(".oriental-system-map")) {
      media.insertAdjacentHTML("beforeend", `
        <div class="oriental-system-map" aria-label="区域 AI 产业生态示意">
          <div class="osm-core"><b data-en="Regional AI Hub">区域 AI Hub</b><span>OpenCSG</span></div>
          <div class="osm-node n1"><b data-en="Attract">招商</b><span>01</span></div>
          <div class="osm-node n2"><b data-en="Deliver">交付</b><span>02</span></div>
          <div class="osm-node n3"><b data-en="Operate">运营</b><span>03</span></div>
          <div class="osm-node n4"><b data-en="Export">出海</b><span>04</span></div>
          <svg viewBox="0 0 420 260" aria-hidden="true">
            <path d="M210 130 C128 62 72 82 62 142 C50 222 152 229 210 130Z"/>
            <path d="M210 130 C292 62 348 82 358 142 C370 222 268 229 210 130Z"/>
            <path d="M88 200 C158 244 264 244 332 200"/>
          </svg>
        </div>`);
    }
  };

  const refineSlide21 = () => {
    const slide = document.querySelector("#slide-21");
    if (!slide) return;
    setText("#slide-21 .section-zh", "产品验证 · AgenticHub", "Product Proof · AgenticHub");
    setText("#slide-21 .title",
      "企业专属 Agent 的数据飞轮",
      "The data flywheel for proprietary enterprise agents");
    if (!slide.querySelector(".slide21-subtitle")) {
      slide.querySelector(".title")?.insertAdjacentHTML("afterend", `
        <p class="slide21-subtitle" data-en="Not every usage call should leak value outward: OpenCSG keeps knowledge, feedback and improvement inside the enterprise boundary.">不是“别人消耗模型，我们持续进化模型”，而是：把知识、反馈和能力进化留在企业自己的边界内。</p>`);
    }
  };

  const refineSlide23 = () => {
    const slide = document.querySelector("#slide-22");
    if (!slide || slide.querySelector(".research-flow-visual")) return;
    const solution = slide.querySelector(".app-solution");
    solution?.insertAdjacentHTML("afterbegin", `
      <div class="research-flow-visual">
        <span>${tx("数据", "Data")}</span><i>→</i><span>${tx("模型", "Models")}</span><i>→</i><span>${tx("实验", "Experiments")}</span><i>→</i><span>${tx("协作", "Collaboration")}</span>
      </div>`);
  };

  const reframeSlide13 = () => {
    const slide = document.querySelector("#slide-13");
    const stage = slide?.querySelector(".comp13-v2");
    if (!stage || slide.classList.contains("comp13-bp-ready")) return;
    slide.classList.add("comp13-bp-ready");
    stage.className = "comp13-bp";
    stage.innerHTML = `
      <section class="comp13-bp-lead">
        <small>PREFERRED COMPETITIVE MESSAGE</small>
        <b data-en="From model discovery to enterprise AI production control">从模型发现，走向企业 AI 生产控制</b>
        <p data-en="Open AI Hub helps developers find and try models. OpenCSG helps organizations govern, deploy and operate models, datasets, prompts, code, applications and AI agents in secure production environments.">公开 AI Hub 帮助开发者发现并试用模型；OpenCSG 帮助企业在安全生产环境中托管、管理、治理并部署模型、数据集、Prompt、代码、应用和 AI Agent。</p>
      </section>
      <section class="comp13-bp-map" aria-label="Competitive positioning map">
        <div class="comp13-axis horizontal"><span data-en="Discovery / build">发现 / 构建</span><span data-en="Production / control">生产 / 控制</span></div>
        <div class="comp13-axis vertical"><span data-en="Cloud dependent">云端依赖</span><span data-en="Sovereign deployment">主权部署</span></div>
        <article class="comp13-bp-player p-hf">
          <img src="assets/brand-logos/huggingface.png" alt="">
          <b>Hugging Face</b>
          <span>Model Hub</span>
        </article>
        <article class="comp13-bp-player p-ms">
          <img src="assets/brand-logos/modelscope.png" alt="">
          <b data-en="ModelScope / Shizhi">魔搭 / 始智</b>
          <span data-en="Model community">模型社区</span>
        </article>
        <article class="comp13-bp-player p-dify">
          <img src="assets/brand-logos/dify.png" alt="">
          <b>Dify / Coze</b>
          <span data-en="Agent builder">Agent Builder</span>
        </article>
        <article class="comp13-bp-player p-ollama">
          <img src="assets/brand-logos/ollama.png" alt="">
          <b>Ollama</b>
          <span data-en="Local runtime">本地运行</span>
        </article>
        <article class="comp13-bp-player p-silicon">
          <img src="assets/brand-logos/siliconflow.png" alt="">
          <b data-en="SiliconFlow">硅基流动</b>
          <span data-en="Inference API">推理 API</span>
        </article>
        <article class="comp13-bp-opencsg">
          <img src="assets/logo-opencsg.png" alt="">
          <small>OPENCSG · AGENTICOPS</small>
          <b data-en="AI production control layer">AI 生产控制层</b>
          <span data-en="Assets · agents · deployment · governance · observability">资产 · Agent · 部署 · 治理 · 可观测</span>
        </article>
      </section>
      <section class="comp13-bp-proof">
        <article>
          <small>01</small>
          <b data-en="Enterprise control">企业控制</b>
          <span data-en="Not only model discovery; controls assets, permissions, audit and production workflows.">不只是模型发现，而是控制资产、权限、审计与生产流程。</span>
        </article>
        <article>
          <small>02</small>
          <b data-en="Private &amp; sovereign">私有化与主权部署</b>
          <span data-en="Cloud, private cloud, on-prem and air-gapped deployments keep data in-domain.">云、私有云、本地与隔离环境部署，数据不出域。</span>
        </article>
        <article>
          <small>03</small>
          <b data-en="Cross-model, cross-compute">跨模型、跨算力</b>
          <span data-en="Neutral to model source and compute stack, supporting heterogeneous chips and local runtime.">不绑定单一模型来源或算力栈，支持异构芯片与本地运行。</span>
        </article>
        <article>
          <small>04</small>
          <b data-en="Open core + enterprise governance">开源核心 + 企业治理</b>
          <span data-en="Open-source adoption with enterprise-grade governance, SLA, security and lifecycle controls.">用开源建立采用，用企业治理、SLA、安全和生命周期管理形成闭环。</span>
        </article>
      </section>
      <section class="comp13-bp-strip">
        <span data-en="Model / data / prompt / code assets">模型 / 数据 / Prompt / 代码资产</span>
        <i>→</i>
        <span data-en="AgenticOps control plane">AgenticOps 控制层</span>
        <i>→</i>
        <span data-en="Production deployment and governance">生产部署与治理</span>
      </section>`;
  };

  const rebuildSlide32 = () => {
    const slide = document.querySelector("#slide-32");
    const stage = slide?.querySelector(".app-stage");
    if (!stage || slide.classList.contains("city32-rebuilt")) return;
    slide.classList.add("city32-rebuilt");
    stage.className = "app-stage city32-new";
    stage.innerHTML = `
      <section class="c32-fragments">
        <small>THE GAP</small>
        <b data-en="Cities already have resources, but they are not yet a production system.">城市已经有资源，但还没有形成生产系统。</b>
        <div class="c32-frag-grid">
          <article><span>01</span><b>${tx("算力", "Compute")}</b><p>${tx("GPU、CPU、国产芯片分散采购，缺少统一调度与计量。", "GPUs, CPUs and regional accelerators are bought separately without unified scheduling or metering.")}</p></article>
          <article><span>02</span><b>${tx("园区", "Parks")}</b><p>${tx("空间和企业服务存在，但难以沉淀 AI 资产和持续使用。", "Physical space and services exist, but AI assets and usage are not retained.")}</p></article>
          <article><span>03</span><b>${tx("政策", "Policy")}</b><p>${tx("政策能启动项目，但需要平台承接治理、合规和长期运营。", "Policy can start projects, but a platform is needed for governance, compliance and operations.")}</p></article>
          <article><span>04</span><b>${tx("场景", "Scenarios")}</b><p>${tx("单点应用多，缺少可复用的模型、数据、Agent 和交付机制。", "Point applications are common; reusable models, data, agents and delivery mechanisms are missing.")}</p></article>
        </div>
      </section>
      <section class="c32-system-visual">
        <svg viewBox="0 0 760 430" aria-hidden="true">
          <path class="line l1" d="M80 88 C220 92 258 154 360 214"/>
          <path class="line l2" d="M80 190 C208 180 266 196 360 214"/>
          <path class="line l3" d="M80 292 C220 284 272 244 360 214"/>
          <path class="line l4" d="M80 390 C236 360 282 274 360 214"/>
          <path class="ring" d="M360 214 C450 92 632 116 680 214 C626 340 454 342 360 214Z"/>
        </svg>
        <div class="c32-core">
          <small>OPEN CITY AI</small>
          <b data-en="Public AI Production System">AI 公共生产系统</b>
          <span>CSGHub + AgenticOps</span>
        </div>
        <div class="c32-outcome o1"><b>${tx("治理与主权", "Governance & sovereignty")}</b><span>${tx("掌握资产、数据边界和公共入口", "Own assets, data boundaries and public entry")}</span></div>
        <div class="c32-outcome o2"><b>${tx("企业生产", "Enterprise production")}</b><span>${tx("私有化、可审计、可持续运营", "Private, auditable and operable")}</span></div>
        <div class="c32-outcome o3"><b>${tx("产业生态", "Industry ecosystem")}</b><span>${tx("招商、开发者、资本和服务交易", "Attraction, developers, capital and services")}</span></div>
      </section>
      <section class="c32-city-strip">
        <b>${tx("同一底座，适配不同城市任务", "One foundation, adapted to city missions")}</b>
        <span>${tx("宜昌 · 产业运营", "Yichang · industry operations")}</span>
        <span>${tx("东方 · 东南亚入口", "Dongfang · SEA gateway")}</span>
        <span>${tx("龙岗 · 异构算力", "Longgang · heterogeneous compute")}</span>
        <span>${tx("盐城 / 重庆 / 乐山 · 场景复制", "Yancheng / Chongqing / Leshan · replication")}</span>
      </section>`;
  };

  const shotCard = (src, title, label, alt = "") => {
    if (src) {
      return `<article class="product-shot-card"><img src="${src}" alt="${alt || title}"><b>${title}</b><span>${label}</span></article>`;
    }
    return `<article class="product-shot-card capability"><i></i><b>${title}</b><span>${label}</span></article>`;
  };

  const rebuildProductAppendix = () => {
    document.querySelectorAll(".slide").forEach(slide => {
      slide.querySelectorAll("[data-en]").forEach(el => {
        el.dataset.en = el.dataset.en.replaceAll("CSGHub-Lite", "CSGLite").replaceAll("CSGHub Lite", "CSGLite");
      });
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue.includes("CSGHub-Lite") || node.nodeValue.includes("CSGHub Lite")) {
          node.nodeValue = node.nodeValue.replaceAll("CSGHub-Lite", "CSGLite").replaceAll("CSGHub Lite", "CSGLite");
        }
      }
    });

    const products = [
      {
        id: "slide-26",
        title: ["AgenticHub：企业 Agent 构建、发布与运营工作台", "AgenticHub: enterprise agent build, release and operations workspace"],
        lead: ["企业 Agent 从构建、测试、发布到运行反馈，放在同一个工作台里闭环管理。", "Enterprise agents are managed in one workspace from build, test and release to runtime feedback."],
        main: ["assets/product-agentichub.png", "AgenticHub 主界面", "AgenticHub UI"],
        shots: [
          ["assets/appendix/slide-10-image-01.png", "流程编排 / 工具调用", "Workflow & tool use"],
          [null, "Agent 构建", "可视化配置、提示词、工具和代码脚本统一编排"],
          [null, "发布 / 运行监控", "版本发布、运行状态、反馈回流与持续优化"],
          [null, "企业工具接入", "通过 API、Webhook 与 MCP 连接业务系统"]
        ],
        proof: [
          ["双模式", "无代码拖拽 + 代码接口并存"],
          ["全生命周期", "构建、测试、发布、监控和反馈回流"],
          ["企业接入", "模型、工具、MCP 与业务系统统一管理"]
        ]
      },
      {
        id: "slide-27",
        title: ["CSGLite：让模型、数据和 AI 工具在个人设备本地运行", "CSGLite: run models, data and AI tools locally on personal devices"],
        lead: ["个人设备上完成模型运行、数据处理和 API 服务，把个人 AI 工作系统留在本地。", "Run models, data processing and API services on personal devices while keeping the personal AI work system local."],
        main: ["assets/product-lite.jpg", "CSGLite 本地运行界面", "CSGLite local runtime"],
        shots: [
          ["assets/appendix/slide-12-image-01.png", "本地模型运行", "Local model runtime"],
          [null, "模型下载 / 断点续传", "面向大模型文件的可靠下载、鉴权和恢复能力"],
          [null, "REST API / 命令行", "兼容本地脚本、开发工具和个人自动化流程"],
          [null, "跨平台安装", "覆盖 macOS、Windows、Linux、ARM / x86 环境"]
        ],
        proof: [
          ["本地优先", "模型、数据与权限留在个人设备"],
          ["OpenAI / Ollama 兼容", "用 REST API 接入个人工具链"],
          ["跨平台", "macOS、Windows、Linux、ARM / x86"]
        ]
      },
      {
        id: "slide-28",
        title: ["CSGClaw：让多个 AI Agent 像一支团队协同工作", "CSGClaw: coordinate multiple AI agents as one team"],
        lead: ["把一次性对话变成可分工、可审计、可回滚的多 Agent 协同执行系统。", "Turn one-off chats into multi-agent execution that supports division of labor, audit and rollback."],
        main: ["assets/product-claw.png", "CSGClaw 协同界面", "CSGClaw UI"],
        shots: [
          ["assets/appendix/slide-13-image-01.png", "Manager–Worker 架构", "Manager-worker architecture"],
          ["assets/appendix/slide-13-image-02.png", "任务拆解 / 沙箱", "Task decomposition and sandbox"],
          ["assets/appendix/slide-13-image-03.png", "协同执行流程", "Collaborative execution flow"],
          [null, "聊天 / 任务面板", "在 IM 或任务界面中调度、追踪和接管执行过程"]
        ],
        proof: [
          ["Manager–Worker", "目标拆解、分工执行、结果合并"],
          ["Human-in-loop", "关键节点确认、审计与回滚"],
          ["个人 OPC", "把一次性对话变成长期执行系统"]
        ]
      },
      {
        id: "slide-29",
        title: ["CSGHub：统一管理模型、数据和 Agent 等关键 AI 资产", "CSGHub: manage models, data and agents as critical AI assets"],
        lead: ["把模型、数据集、代码、应用空间和治理能力组织为可生产运行的 AI 资产目录。", "Organize models, datasets, code, spaces and governance as a production-ready AI asset catalog."],
        main: ["assets/product-csghub.png", "CSGHub 资产管理界面", "CSGHub asset management"],
        shots: [
          ["assets/appendix/slide-14-image-01.png", "模型 / 数据资产", "Model and data assets"],
          ["assets/appendix/slide-14-image-02.png", "模型评测 / 服务", "Model evaluation and services"],
          ["assets/appendix/slide-14-image-03.png", "应用空间 / Agent", "Spaces and agents"],
          ["assets/appendix/slide-14-image-04.png", "组织治理 / 权限", "Governance and access"]
        ],
        proof: [
          ["资产目录", "模型、数据集、代码、Prompt 与 Agent"],
          ["生产闭环", "推理、微调、评测、发布与回滚"],
          ["企业治理", "组织、权限、审计、License 与私有化部署"]
        ]
      }
    ];

    products.forEach(item => {
      const slide = document.querySelector(`#${item.id}`);
      const stage = slide?.querySelector(".app-stage");
      if (!slide || !stage || slide.classList.contains("product-shots-ready")) return;
      slide.classList.add("product-shots-ready");
      setText(`#${item.id} .title`, item.title[0], item.title[1]);
      stage.className = `app-stage product-shot-page ${item.id}-shots`;
      stage.innerHTML = `
        <section class="product-shot-main">
          <div class="product-shot-main-img"><img src="${item.main[0]}" alt="${item.main[1]}"></div>
          <div class="product-shot-main-copy">
            <small>PRODUCT EVIDENCE</small>
            <b data-en="${item.lead[1]}">${item.lead[0]}</b>
          </div>
        </section>
        <section class="product-shot-grid">
          ${item.shots.map(([src, zh, en]) => shotCard(src, zh, en)).join("")}
        </section>
        <section class="product-proof-strip">
          ${item.proof.map(([k, v]) => `<article><b>${k}</b><span>${v}</span></article>`).join("")}
        </section>`;
    });
  };

  const rebuildSlide33 = () => {
    const slide = document.querySelector("#slide-33");
    const stage = slide?.querySelector(".app-stage");
    if (!stage || slide.classList.contains("city33-diagram-ready")) return;
    slide.classList.add("city33-diagram-ready");
    setText("#slide-33 .title",
      "城市 AI 平台不是软件采购，而是“治理主体 + 开放底座 + 产业运营”的系统",
      "A city AI platform is not software procurement; it combines governance, open foundation and industry operations");
    stage.className = "app-stage city33-diagram";
    stage.innerHTML = `
      <section class="c33-left">
        <small>WHO OWNS & OPERATES</small>
        <b data-en="The city must own the operating rules, data boundaries and public service entry.">城市要掌握运行规则、数据边界与公共服务入口。</b>
        <article><span>01</span><b>${tx("治理主体", "Governance body")}</b><p>${tx("政府、基金、园区与运营公司共同定义资产、规则、收益和责任。", "Government, funds, parks and operators define assets, rules, revenue and accountability.")}</p></article>
        <article><span>02</span><b>${tx("开放底座", "Open foundation")}</b><p>${tx("CSGHub + AgenticOps 承接模型、数据、算力、Agent 和治理控制。", "CSGHub + AgenticOps carries models, data, compute, agents and governance controls.")}</p></article>
        <article><span>03</span><b>${tx("产业运营", "Industry operations")}</b><p>${tx("招商、开发者、场景验证与企业服务形成长期循环。", "Attraction, developers, scenario validation and enterprise services create a long-term loop.")}</p></article>
      </section>
      <section class="c33-city-visual">
        <svg viewBox="0 0 760 480" aria-hidden="true">
          <path class="c33-line" d="M118 102 C270 72 334 150 382 236"/>
          <path class="c33-line" d="M114 238 C238 238 305 238 382 238"/>
          <path class="c33-line" d="M118 374 C270 404 334 326 382 240"/>
          <path class="c33-ring" d="M382 238 C472 114 640 128 682 238 C632 366 470 366 382 238Z"/>
        </svg>
        <div class="c33-source s1"><b>${tx("治理与政策", "Governance & policy")}</b><span>${tx("规则、预算、公共入口", "Rules, budget, public entry")}</span></div>
        <div class="c33-source s2"><b>${tx("资源底座", "Resource base")}</b><span>${tx("算力、数据、模型资产", "Compute, data, model assets")}</span></div>
        <div class="c33-source s3"><b>${tx("场景与企业", "Scenarios & enterprises")}</b><span>${tx("行业需求、应用交付", "Industry demand, delivery")}</span></div>
        <div class="c33-core"><small>OPEN CITY AI</small><b>CSGHub + AgenticOps</b><span>${tx("资产目录 · 权限审计 · Agent 生产 · 持续运营", "Asset catalog · audit · agent production · operations")}</span></div>
        <div class="c33-output o1"><b>${tx("城市公共 AI 服务", "Public AI services")}</b></div>
        <div class="c33-output o2"><b>${tx("企业私有化生产", "Enterprise private production")}</b></div>
        <div class="c33-output o3"><b>${tx("招商与生态交易", "Attraction & ecosystem transactions")}</b></div>
      </section>
      <section class="c33-bottom">
        <span>${tx("不是采购一个模型", "Not buying one model")}</span><i>→</i>
        <span>${tx("而是建立城市 AI 资产与运营权", "Build city AI asset and operating rights")}</span><i>→</i>
        <span>${tx("最终形成可持续产业服务收入", "Create sustainable industry-service revenue")}</span>
      </section>`;
  };

  const rebuildDongfang = () => {
    const slide = document.querySelector("#slide-35");
    const stage = slide?.querySelector(".app-stage");
    if (!stage || slide.classList.contains("dongfang-merged-ready")) return;
    slide.classList.add("dongfang-merged-ready");
    setText("#slide-35 .title",
      "东方：用自贸港政策、开放 AI 底座和跨境服务，建设面向东南亚的数字接口",
      "Dongfang: a Southeast Asia digital gateway built on free-trade policy, open AI foundation and cross-border services");
    stage.className = "app-stage dongfang-merged";
    stage.innerHTML = `
      <section class="df-thesis">
        <small>WHY DONGFANG</small>
        <b data-en="Dongfang should not copy a generic park; it should turn policy, multilingual services and regional links into a digital gateway.">东方不应复制传统园区，而应把政策、多语言服务和区域连接变成数字接口。</b>
        <div class="df-anchor"><strong>5 YEARS</strong><span>${tx("政策窗口 × 技术窗口 × 区域市场窗口叠加", "Policy window × technology window × regional market window")}</span></div>
        <div class="df-shot-slot"><i></i><b>${tx("项目证据模块", "Project evidence module")}</b><span>${tx("园区服务、门户入口、东南亚连接和多语言服务共同构成可落地的区域接口。", "Park services, portal entry, Southeast Asia connectivity and multilingual services form a practical regional gateway.")}</span></div>
      </section>
      <section class="df-map">
        <svg viewBox="0 0 640 430" aria-hidden="true">
          <path class="df-sea" d="M122 215 C218 120 340 132 460 78"/>
          <path class="df-sea" d="M122 218 C232 246 374 296 520 282"/>
          <path class="df-dash" d="M184 155 C294 76 408 118 500 178"/>
        </svg>
        <a class="df-node main" href="${communityHref("dongfang")}" data-community-key="dongfang"><span data-en="Dongfang">东方</span><small>DONGFANG</small></a>
        <a class="df-node hk" href="${communityHref("hongkong")}" data-community-key="hongkong" data-en="Hong Kong">香港</a>
        <a class="df-node sg" href="${communityHref("singapore")}" data-community-key="singapore" data-en="Singapore">新加坡</a>
        <div class="df-node sea">东南亚</div>
        <div class="df-node ftp">海南自贸港</div>
        <div class="df-caption"><small>NATIONAL DIGITAL GATEWAY</small><b>${tx("连接海南自贸港、香港、新加坡与东南亚", "Connect Hainan FTP, Hong Kong, Singapore and Southeast Asia")}</b></div>
      </section>
      <section class="df-plan">
        <article><span>01</span><b>${tx("政府启动", "Government anchor")}</b><p>${tx("以开放 AI 底座承接政策、公共数据、园区服务和企业入驻。", "Use an open AI foundation to carry policy, public data, park services and enterprise onboarding.")}</p></article>
        <article><span>02</span><b>${tx("产业运营", "Industry operations")}</b><p>${tx("围绕多语言模型、Agent 出海、跨境合规和企业服务形成运营项目。", "Operate around multilingual models, agent export, cross-border compliance and enterprise services.")}</p></article>
        <article><span>03</span><b>${tx("区域放大", "Regional replication")}</b><p>${tx("连接香港、新加坡和东南亚市场，输出数据、模型、应用和服务能力。", "Connect Hong Kong, Singapore and Southeast Asia, exporting data, models, applications and services.")}</p></article>
      </section>
      <section class="df-revenue">
        <b>${tx("核心收入", "Core revenue")}</b>
        <span>${tx("建设 / 年度 / 项目", "Deployment / annual / project")}</span>
        <span>${tx("订阅 / 服务 / 运营", "Subscription / services / operations")}</span>
        <span>${tx("加工 / 服务 / 出海", "Processing / services / outbound")}</span>
      </section>`;

  };

  const rebuildSlide37 = () => {
    const slide = document.querySelector("#slide-37");
    const stage = slide?.querySelector(".app-stage");
    if (!stage || slide.classList.contains("city37-rebuilt")) return;
    slide.classList.add("city37-rebuilt");
    setText("#slide-37 .title",
      "三类城市任务，一套开放底座；用项目证据完成复制",
      "Three city missions, one open foundation, replicated with project evidence");
    stage.className = "app-stage city37-visual";
    stage.innerHTML = `
      <section class="c37-visual-lead">
        <small>THREE CITY MISSIONS</small>
        <b data-en="Repeat the foundation and operating method, not the city's positioning.">复制的是开放底座与运营方法，不是复制同一个城市定位。</b>
        <p data-en="The three screenshot slots below are intentionally reserved for project pages, park photos or architecture captures.">下面三个位置可直接放项目页面、园区照片或架构截图，让这页从“总结表”变成“证据板”。</p>
      </section>
      <section class="c37-shot-grid">
        <article class="c37-case-card yichang">
          <div class="c37-shot-slot">
            <span data-en="PROJECT EVIDENCE">项目证据</span>
            <b data-en="Yichang industry hub evidence">宜昌产业载体</b>
          </div>
          <small>01 · YICHANG</small>
          <h3 data-en="Industry hub and long-term operations">产业载体与长期运营</h3>
          <p data-en="City space, compute, enterprise services and developers are organized into an operating industry hub.">把城市空间、算力、企业服务和开发者生态组织为持续运营的产业中枢。</p>
          <a class="c37-community-link" href="${communityHref("yichang")}" data-community-key="yichang" data-en="Visit community ↗">访问社区 ↗</a>
        </article>
        <article class="c37-case-card dongfang">
          <div class="c37-shot-slot">
            <span data-en="PROJECT EVIDENCE">项目证据</span>
            <b data-en="Dongfang regional gateway evidence">东方区域接口</b>
          </div>
          <small>02 · DONGFANG</small>
          <h3 data-en="Regional gateway to Southeast Asia">面向东南亚的数字接口</h3>
          <p data-en="Free-trade policy, an open AI foundation and cross-border digital services create regional connection capacity.">以自贸港制度、开放 AI 底座和跨境数字服务形成区域连接能力。</p>
          <a class="c37-community-link" href="${communityHref("dongfang")}" data-community-key="dongfang" data-en="Visit community ↗">访问社区 ↗</a>
        </article>
        <article class="c37-case-card longgang">
          <div class="c37-shot-slot">
            <span data-en="PROJECT EVIDENCE">项目证据</span>
            <b data-en="Longgang compute adaptation evidence">龙岗算力适配</b>
          </div>
          <small>03 · LONGGANG</small>
          <h3 data-en="Domestic heterogeneous compute adaptation">国产异构算力适配</h3>
          <p data-en="A feasibility path around domestic compute, model assets, public services, Agent development and industry validation.">围绕国产算力、模型资产、公共服务、Agent 开发与行业验证建设实验平台。</p>
          <a class="c37-community-link" href="${communityHref("longgang")}" data-community-key="longgang" data-en="Visit community ↗">访问社区 ↗</a>
        </article>
      </section>
      <section class="c37-replication-path">
        <b data-en="Replication path">复制路径</b>
        <span data-en="Open foundation">开放底座</span>
        <i>→</i>
        <span data-en="City mission">城市任务</span>
        <i>→</i>
        <span data-en="Project evidence">项目证据</span>
        <i>→</i>
        <span data-en="Regional replication">区域复制</span>
      </section>
      <section class="c37-method-strip">
        <b data-en="Longgang 1 + 5 + 2 becomes a reusable module: infrastructure, assets, services, scheduling, agents, sandbox and industry zones.">龙岗“1 + 5 + 2”可以作为可复制模块：基础设施、资产、服务、调度、Agent、沙箱与行业专区。</b>
      </section>`;
  };

  const enhanceSlide08Evolution = () => {
    const slide = document.querySelector("#slide-08");
    if (!slide || slide.classList.contains("evolution-ready")) return;
    slide.classList.add("evolution-ready");

    const steps = [...slide.querySelectorAll("[data-evolution-step]")];
    const products = [...slide.querySelectorAll("[data-evolution-product]")];
    if (steps.length !== 4 || products.length !== 4) return;
    // Keep this page explanatory and still. The appendix carries the deeper product detail.
    const setStaticState = () => {
      slide.dataset.evolutionStage = "static";
      steps.forEach((step, index) => {
        const stage = index + 1;
        step.classList.remove("is-active", "is-complete", "is-feedback-target");
        step.dataset.evolutionStep = String(stage);
      });
      products.forEach(product => {
        product.classList.remove("is-evolution-active", "is-evolution-complete", "is-evolution-dim", "is-feedback-target");
        product.removeAttribute("aria-current");
        product.querySelector(".p8-connector")?.classList.remove("is-running");
      });
    };
    setStaticState();
  };

  const enhanceSlide05Proofs = () => {
    const slide = document.querySelector("#slide-05");
    if (!slide || document.querySelector(".deck-proof-modal")) return;

    const siteDetails = {
      shanghai: {
        zh: "上海",
        en: "Shanghai",
        kind: "Talent and innovation ecosystem",
        zhKind: "人才与创新生态",
        zhSummary: "上海节点代表长三角人才、产业服务与 AI 创新资源连接，适合承接企业服务、人才活动与生态合作。",
        enSummary: "The Shanghai node connects Yangtze River Delta talent, industry services and AI innovation resources for enterprise service and ecosystem cooperation.",
        tags: ["长三角", "人才服务", "创新生态"],
        enTags: ["Yangtze Delta", "Talent", "Innovation"]
      },
      yancheng: {
        zh: "盐城",
        en: "Yancheng",
        kind: "Regional services and scenario replication",
        zhKind: "区域服务与场景复制",
        zhSummary: "盐城节点用于承接区域产业场景、企业服务与公共技术平台复制，形成可扩展的城市服务入口。",
        enSummary: "The Yancheng node supports regional industry scenarios, enterprise services and public AI platform replication.",
        tags: ["区域平台", "产业场景", "企业服务"],
        enTags: ["Regional platform", "Industry scenarios", "Enterprise service"]
      },
      yichang: {
        zh: "三峡（宜昌）",
        en: "Yichang",
        kind: "Industry hub and long-term operations",
        zhKind: "产业载体与长期运营",
        zhSummary: "宜昌节点验证了城市级 AI 平台从一次性建设转向持续运营的路径，连接算力、企业、开发者和产业服务。",
        enSummary: "The Yichang node validates a city-level AI platform moving from one-off build-out to continuous operations.",
        tags: ["产业平台", "持续运营", "开发者生态"],
        enTags: ["Industry hub", "Operations", "Developers"]
      },
      chongqing: {
        zh: "重庆",
        en: "Chongqing",
        kind: "Western China regional node",
        zhKind: "西部区域节点",
        zhSummary: "重庆节点承接西部地区产业、政企服务与开发者生态连接，适合作为区域复制和服务网络的枢纽。",
        enSummary: "The Chongqing node connects western-region industry, public-sector services and developer ecosystems as a replication hub.",
        tags: ["西部节点", "政企服务", "生态连接"],
        enTags: ["Western node", "Gov-enterprise", "Ecosystem"]
      },
      leshan: {
        zh: "乐山",
        en: "Leshan",
        kind: "Regional public service scenarios",
        zhKind: "区域公共服务场景",
        zhSummary: "乐山节点用于承接区域公共服务、产业数字化与 AI 应用场景验证，补足区域网络的纵深。",
        enSummary: "The Leshan node supports public-service, industrial digitization and AI application scenarios within the regional network.",
        tags: ["公共服务", "产业数字化", "场景验证"],
        enTags: ["Public service", "Digitization", "Validation"]
      },
      dongfang: {
        zh: "海南东方",
        en: "Dongfang",
        kind: "Free-trade-port gateway",
        zhKind: "自贸港区域接口",
        zhSummary: "东方节点面向海南自贸港和东南亚连接，验证区域平台、跨境数字服务和多语言能力的组合价值。",
        enSummary: "The Dongfang node connects the Hainan free-trade-port context with Southeast Asia through regional platform and multilingual services.",
        tags: ["海南自贸港", "东南亚接口", "跨境服务"],
        enTags: ["Hainan FTP", "Southeast Asia", "Cross-border"]
      },
      longgang: {
        zh: "深圳龙岗",
        en: "Longgang",
        kind: "Domestic heterogeneous compute adaptation",
        zhKind: "国产异构算力适配",
        zhSummary: "龙岗节点验证国产算力、模型资产、公共服务与 Agent 开发环境的组合，适合形成可复制的技术模块。",
        enSummary: "The Longgang node validates domestic compute, model assets, public services and agent development environments as a reusable module.",
        tags: ["国产算力", "模型资产", "Agent 开发"],
        enTags: ["Domestic compute", "Model assets", "Agent dev"]
      },
      hongkong: {
        zh: "香港",
        en: "Hong Kong",
        kind: "International ecosystem connection",
        zhKind: "国际生态连接",
        zhSummary: "香港数码港节点连接国际开源生态、金融科技与跨境产业资源，是 OpenCSG 全球化叙事的重要支点。",
        enSummary: "The Hong Kong Cyberport node connects global open-source, fintech and cross-border industry resources.",
        tags: ["数码港", "国际生态", "跨境资源"],
        enTags: ["Cyberport", "Global ecosystem", "Cross-border"]
      },
      singapore: {
        zh: "新加坡",
        en: "Singapore",
        kind: "Southeast Asia innovation bridge",
        zhKind: "东南亚创新连接",
        zhSummary: "新加坡节点代表东南亚创新、监管与产业合作接口，支撑 OpenCSG 面向国际市场的连接能力。",
        enSummary: "The Singapore node represents a Southeast Asia innovation, regulatory and industry-cooperation bridge for international expansion.",
        tags: ["东南亚", "国际合作", "创新生态"],
        enTags: ["Southeast Asia", "Global cooperation", "Innovation"]
      },
      caict: {
        zh: "工信部 · 中国信通院",
        en: "MIIT · CAICT AI Hub",
        kind: "National AI open community",
        zhKind: "国家级 AI 开放社区",
        zhSummary: "工信部与中国信通院社区连接国家级产业资源、标准研究、开发者与人工智能资产服务。",
        enSummary: "The MIIT and CAICT AI Hub connects national industry resources, standards research, developers and AI asset services.",
        tags: ["国家级社区", "产业标准", "AI 资产"],
        enTags: ["National hub", "Industry standards", "AI assets"]
      }
    };

    const modal = document.createElement("div");
    modal.className = "deck-proof-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="deck-proof-scrim" data-proof-close></div>
      <section class="deck-proof-dialog" role="dialog" aria-modal="true" aria-label="OpenCSG proof details">
        <button class="deck-proof-close" type="button" data-proof-close aria-label="Close">×</button>
        <div class="deck-proof-content"></div>
      </section>`;
    document.body.appendChild(modal);

    const content = modal.querySelector(".deck-proof-content");
    const renderSiteModal = (pin) => {
      const cityKey = [...pin.classList].find(cls => siteDetails[cls]) || "yichang";
      const detail = siteDetails[cityKey];
      const url = pin.href;
      return `
        <div class="proof-site-layout">
          <section class="proof-site-browser" aria-label="Site preview">
            <div class="proof-browser-bar">
              <i></i><i></i><i></i>
              <span>${esc(url)}</span>
            </div>
            <div class="proof-iframe-wrap">
              <iframe class="proof-site-iframe" src="${esc(url)}" title="${esc(detail.zh)} site preview" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </section>
        </div>`;
    };

    const openModal = (kind, pin = null) => {
      if (pin) {
        content.innerHTML = renderSiteModal(pin);
      } else {
        content.innerHTML = `
        <header><small>CUSTOMER PROOF</small><h3 data-en="Key customers and national-level industry connections">重点客户与国家级产业连接</h3><p data-en="The proof is not a logo wall; it shows national institutions, central SOEs, industrial leaders and ecosystem partners already connected to OpenCSG.">这不是商标墙，而是国家机构、央企、产业龙头与生态伙伴已经连接到 OpenCSG 的证明。</p></header>
        <div class="proof-customer-detail">
          <article><small>NATIONAL INSTITUTION</small><b data-en="MIIT">工业和信息化部</b><span data-en="National industry connection">国家级产业连接</span><a class="proof-community-link" href="${communityHref("caict")}" data-community-key="caict" data-en="Visit MIIT / CAICT AI Hub ↗">访问工信部社区 ↗</a></article>
          <article><small>CENTRAL SOE</small><b data-en="China Mobile / China Unicom">中国移动 / 中国联通</b><span data-en="Carrier production and sovereign deployment boundary">运营商生产与自主可控边界</span></article>
          <article><small>INDUSTRIAL LEADERS</small><b>CATL / CALB</b><span data-en="New-energy manufacturing and industrial AI scenarios">新能源制造与产业 AI 场景</span></article>
          <article><small>ECOSYSTEM</small><b data-en="Cambricon, Muxi, Lenovo, Inspur and more">寒武纪、沐曦、联想、浪潮等</b><span data-en="Compute, hardware and enterprise software ecosystem">算力、硬件与企业软件生态</span></article>
        </div>`;
      }
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("proof-modal-open");
      window.OpenCSGCommunity?.apply(content);
      if (window.DeckI18n?.translateTree) window.DeckI18n.translateTree(content, window.DeckI18n.pack, window.DeckI18n.lang);
    };

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("proof-modal-open");
      content.querySelectorAll("iframe").forEach(frame => frame.removeAttribute("src"));
    };

    modal.querySelectorAll("[data-proof-close]").forEach(el => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
    slide.querySelectorAll(".region-map-restored .city-pin").forEach(pin => {
      pin.removeAttribute("target");
      pin.addEventListener("click", (event) => {
        event.preventDefault();
        slide.querySelectorAll(".region-map-restored .city-pin").forEach(item => item.classList.remove("active"));
        pin.classList.add("active");
        openModal("site", pin);
      });
    });
  };

  setPlatformDefault();
  replaceMarketVisual();
  refineSlide11();
  refineSlide12();
  refineSlide20();
  refineSlide21();
  refineSlide23();
  reframeSlide13();
  rebuildProductAppendix();
  rebuildSlide32();
  rebuildSlide33();
  rebuildDongfang();
  rebuildSlide37();
  enhanceSlide08Evolution();
  enhanceSlide05Proofs();
})();
