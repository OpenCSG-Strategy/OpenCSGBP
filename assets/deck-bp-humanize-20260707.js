(() => {
  const esc = (s = "") => String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const tx = (zh, en, tag = "span", cls = "") =>
    `<${tag}${cls ? ` class="${cls}"` : ""} data-en="${esc(en)}">${zh}</${tag}>`;

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
          <b data-en="Sovereign AI Control Plane">主权 AI 控制层</b>
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
            <span>CSGHub-Lite</span><i>→</i><span>CSGClaw</span><i>→</i><span data-en="Personal AgenticOps">个人 AgenticOps</span>
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
        <div class="oc12-flywheel-step open"><small>01</small><b>Open Core</b><span data-en="Free adoption and trust">免费采用与信任</span></div>
        <i>→</i>
        <div class="oc12-flywheel-step enterprise"><small>02</small><b>Enterprise</b><span data-en="Governance, reliability and services">治理、可靠性与服务</span></div>
        <i>→</i>
        <div class="oc12-flywheel-step recurring"><small>03</small><b data-en="Recurring Revenue">持续收入</b><span data-en="License, subscription and operations">License、订阅与运营</span></div>
      </section>`);
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

  const replaceSlide22 = () => {
    const slide = document.querySelector("#slide-22");
    if (!slide || slide.classList.contains("regional-merged")) return;
    slide.classList.add("regional-merged");
    setText("#slide-22 .section-zh", "客户案例 · 区域平台合并视图", "Customer Cases · Regional Platform Synthesis");
    setText("#slide-22 .title",
      "同一 AI 公共底座，适配宜昌、数码港与龙岗三类区域任务",
      "One public AI foundation adapts to Yichang, Cyberport and Longgang");
    const stage = slide.querySelector(".app-stage");
    if (!stage) return;
    stage.innerHTML = `
      <div class="regional-merge-lead">
        <small>REPEATABLE PLAYBOOK</small>
        <b data-en="The difference is not the software stack, but the city mission: industry operations, global ecosystem, or heterogeneous compute.">差异不在软件栈，而在城市任务：产业运营、国际生态或异构算力。</b>
      </div>
      <div class="regional-merge-map" aria-hidden="true">
        <div class="rm-orbit"></div>
        <div class="rm-core"><b>CSGHub</b><span>AgenticOps</span></div>
        <div class="rm-node yichang"><small>01</small><b>${tx("宜昌", "Yichang")}</b><span>${tx("产业载体与长期运营", "Industry hub & long-term operations")}</span></div>
        <div class="rm-node cyberport"><small>02</small><b>${tx("香港数码港", "Hong Kong Cyberport")}</b><span>${tx("国际开源生态入口", "Global open-source ecosystem gateway")}</span></div>
        <div class="rm-node longgang"><small>03</small><b>${tx("深圳龙岗", "Shenzhen Longgang")}</b><span>${tx("国产异构算力适配", "Domestic heterogeneous compute")}</span></div>
      </div>
      <div class="regional-merge-cards">
        <article><small>YICHANG</small><b>${tx("把城市空间变成运营型产业中枢", "Turn city space into an operating industry hub")}</b><p>${tx("用同一底座承载算力服务、数据语料、算法调用与企业服务，形成可持续招商与产业运营。", "Use one foundation for compute, data, model APIs and enterprise services, creating continuous attraction and operations.")}</p></article>
        <article><small>CYBERPORT</small><b>${tx("把开发者与全球开源资产连接起来", "Connect developers with global open assets")}</b><p>${tx("围绕模型、工具、创作者和 Web3 伙伴形成开放社区，不止是一次性活动。", "Build an open community around models, tools, creators and Web3 partners, not one-off events.")}</p></article>
        <article><small>LONGGANG</small><b>${tx("把国产算力变成企业可用的生产平台", "Turn domestic compute into an enterprise production platform")}</b><p>${tx("围绕国产芯片、模型资产、公共服务、Agent 开发与行业验证建设实验平台。", "Build around domestic accelerators, model assets, public services, agent development and industry validation.")}</p></article>
      </div>
      <div class="regional-merge-bottom">
        <span>${tx("统一资产目录", "Unified asset catalog")}</span>
        <span>${tx("异构算力调度", "Heterogeneous compute scheduling")}</span>
        <span>${tx("AgenticOps 控制层", "AgenticOps control plane")}</span>
        <span>${tx("持续运营服务", "Continuous operations")}</span>
      </div>`;
  };

  const refineSlide23 = () => {
    const slide = document.querySelector("#slide-23");
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
          <b data-en="ModelScope">魔搭 / 始智</b>
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
          <b data-en="Sovereign deployment">私有化与主权部署</b>
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
            <span>SCREENSHOT SLOT</span>
            <b data-en="Yichang project / park / operation capture">宜昌截图位</b>
          </div>
          <small>01 · YICHANG</small>
          <h3 data-en="Industry hub and long-term operations">产业载体与长期运营</h3>
          <p data-en="City space, compute, enterprise services and developers are organized into an operating industry hub.">把城市空间、算力、企业服务和开发者生态组织为持续运营的产业中枢。</p>
        </article>
        <article class="c37-case-card dongfang">
          <div class="c37-shot-slot">
            <span>SCREENSHOT SLOT</span>
            <b data-en="Dongfang gateway / multilingual service capture">东方截图位</b>
          </div>
          <small>02 · DONGFANG</small>
          <h3 data-en="Regional gateway to Southeast Asia">面向东南亚的数字接口</h3>
          <p data-en="Free-trade policy, an open AI foundation and cross-border digital services create regional connection capacity.">以自贸港制度、开放 AI 底座和跨境数字服务形成区域连接能力。</p>
        </article>
        <article class="c37-case-card longgang">
          <div class="c37-shot-slot">
            <span>SCREENSHOT SLOT</span>
            <b data-en="Longgang compute / architecture capture">龙岗截图位</b>
          </div>
          <small>03 · LONGGANG</small>
          <h3 data-en="Domestic heterogeneous compute adaptation">国产异构算力适配</h3>
          <p data-en="A feasibility path around domestic compute, model assets, public services, Agent development and industry validation.">围绕国产算力、模型资产、公共服务、Agent 开发与行业验证建设实验平台。</p>
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
        <span data-en="Regional expansion">区域复制</span>
      </section>
      <section class="c37-method-strip">
        <b data-en="Longgang 1 + 5 + 2 becomes a reusable module: infrastructure, assets, services, scheduling, agents, sandbox and industry zones.">龙岗“1 + 5 + 2”可以作为可复制模块：基础设施、资产、服务、调度、Agent、沙箱与行业专区。</b>
      </section>`;
  };

  const enhanceSlide05Proofs = () => {
    const slide = document.querySelector("#slide-05");
    if (!slide || document.querySelector(".deck-proof-modal")) return;

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
    const openModal = (kind) => {
      const isRegion = kind === "region";
      content.innerHTML = isRegion ? `
        <header><small>REGIONAL PROOF</small><h3 data-en="Regional nodes and verified deployment areas">区域节点与已验证地区</h3><p data-en="A city-level AI platform is not a static display page; it connects government, industry, developers and capital into repeatable operations.">城市级 AI 平台不是静态展示页，而是把政府、产业、开发者与资本连接成可复制运营。</p></header>
        <div class="proof-region-detail">
          <div class="proof-map-large">
            <img src="assets/china-blank-map.svg" alt="OpenCSG regional nodes">
            <span class="pin shanghai" data-en="Shanghai">上海</span><span class="pin yancheng" data-en="Yancheng">盐城</span><span class="pin yichang" data-en="Yichang">宜昌</span><span class="pin chongqing" data-en="Chongqing">重庆</span><span class="pin leshan" data-en="Leshan">乐山</span><span class="pin dongfang" data-en="Dongfang">东方</span><span class="pin hongkong" data-en="Hong Kong">香港</span><span class="pin singapore">Singapore</span>
          </div>
          <div class="proof-region-list">
            <article><b data-en="Yichang">宜昌</b><span data-en="Industry hub and long-term operations">产业载体与长期运营</span></article>
            <article><b data-en="Hong Kong Cyberport">香港数码港</b><span data-en="International open-source ecosystem connection">国际开源生态连接</span></article>
            <article><b data-en="Dongfang">东方</b><span data-en="Free-trade-port gateway to Southeast Asia">自贸港面向东南亚接口</span></article>
            <article><b data-en="Longgang">龙岗</b><span data-en="Domestic heterogeneous compute adaptation">国产异构算力适配</span></article>
            <article><b data-en="Yancheng / Chongqing / Leshan">盐城 / 重庆 / 乐山</b><span data-en="Scenario replication and regional services">场景复制与区域服务</span></article>
          </div>
        </div>` : `
        <header><small>CUSTOMER PROOF</small><h3 data-en="Key customers and national-level industry connections">重点客户与国家级产业连接</h3><p data-en="The proof is not a logo wall; it shows national institutions, central SOEs, industrial leaders and ecosystem partners already connected to OpenCSG.">这不是商标墙，而是国家机构、央企、产业龙头与生态伙伴已经连接到 OpenCSG 的证明。</p></header>
        <div class="proof-customer-detail">
          <article><small>NATIONAL INSTITUTION</small><b data-en="MIIT">工业和信息化部</b><span data-en="National industry connection">国家级产业连接</span></article>
          <article><small>CENTRAL SOE</small><b data-en="China Mobile / China Unicom">中国移动 / 中国联通</b><span data-en="Carrier production and sovereign deployment boundary">运营商生产与自主可控边界</span></article>
          <article><small>INDUSTRIAL LEADERS</small><b>CATL / CALB</b><span data-en="New-energy manufacturing and industrial AI scenarios">新能源制造与产业 AI 场景</span></article>
          <article><small>ECOSYSTEM</small><b data-en="Cambricon, Muxi, Lenovo, Inspur and more">寒武纪、沐曦、联想、浪潮等</b><span data-en="Compute, hardware and enterprise software ecosystem">算力、硬件与企业软件生态</span></article>
        </div>`;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("proof-modal-open");
      if (window.__opencsgI18n?.apply) window.__opencsgI18n.apply();
    };

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("proof-modal-open");
    };

    slide.querySelector(".region-map-restored")?.addEventListener("click", () => openModal("region"));
    slide.querySelector(".customer-accounts")?.addEventListener("click", () => openModal("customer"));
    modal.querySelectorAll("[data-proof-close]").forEach(el => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  };

  setPlatformDefault();
  replaceMarketVisual();
  refineSlide11();
  refineSlide12();
  refineSlide20();
  refineSlide21();
  replaceSlide22();
  refineSlide23();
  reframeSlide13();
  rebuildSlide32();
  rebuildSlide37();
  enhanceSlide05Proofs();
})();
