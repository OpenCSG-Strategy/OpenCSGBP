(() => {
  const esc = (s = "") => s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const tx = (zh, en, tag = "span", cls = "") =>
    `<${tag}${cls ? ` class="${cls}"` : ""} data-en="${esc(en)}">${zh}</${tag}>`;
  const render = (num, kickerZh, kickerEn, titleZh, titleEn, body, footZh, footEn) => {
    const section = document.getElementById(`slide-${String(num).padStart(2, "0")}`);
    if (!section) return;
    section.className = "slide light appendix-slide city-reframe";
    section.dataset.layout = `CITY-${num}`;
    section.innerHTML = `
      <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
      <div class="section">${tx(kickerZh, kickerEn, "span", "section-zh")}</div>
      ${tx(titleZh, titleEn, "h2", "title")}
      ${body}
      <div class="foot">${tx(footZh, footEn)}<span>${String(num).padStart(2, "0")}</span></div>`;
  };

  render(32,
    "城市级方案 · 为什么建", "City Solution · Why Build",
    "城市不是缺项目，而是缺一套持续运营的 AI 公共生产系统",
    "Cities do not lack projects; they lack an operating public AI production system", `
    <div class="app-stage city32">
      <div class="c32-problem">
        <div class="app-kicker">THE URGENCY</div>
        ${tx("算力、园区、政策和场景已经存在，但资源彼此割裂，项目交付后也难以持续形成生产力。", "Compute, parks, policies and scenarios already exist, but they remain fragmented and rarely become durable production capacity.", "p", "app-lead")}
        <div class="c32-blockers">
          <article><span>01</span><b>${tx("资源分散，重复建设", "Fragmented resources")}</b><p>${tx("算力、数据、模型和项目分布在不同部门与园区，无法复用和统一计量。", "Compute, data, models and projects sit across departments without reuse or unified metering.")}</p></article>
          <article><span>02</span><b>${tx("平台交付后缺少运营", "Platforms stop after delivery")}</b><p>${tx("只有门户和资源目录，没有企业服务、开发者运营和资产沉淀。", "Portals and catalogs lack enterprise services, developer operations and asset accumulation.")}</p></article>
          <article><span>03</span><b>${tx("外部模型难承担城市责任", "External models cannot carry city responsibility")}</b><p>${tx("数据边界、国产适配、模型替换、审计和公共服务必须掌握在本地。", "Data boundaries, domestic adaptation, model replacement, audit and public services must stay local.")}</p></article>
          <article><span>04</span><b>${tx("项目投入未转化为产业", "Projects do not become an industry")}</b><p>${tx("技术项目、活动和补贴彼此割裂，难形成企业集聚与财政回流。", "Projects, events and subsidies remain disconnected from company clustering and fiscal returns.")}</p></article>
        </div>
      </div>
      <div class="c32-shift">
        <div class="c32-shift-head">
          <div><small>BEFORE</small><b>${tx("传统“算力 + 项目”建设", "Traditional compute + project model")}</b></div>
          <i>→</i>
          <div><small>AFTER</small><b>${tx("城市 AI 公共基础设施", "City AI public infrastructure")}</b></div>
        </div>
        <div class="c32-shift-grid">
          <span>${tx("采购单一算力与设备", "Purchase a single compute stack")}</span><b>${tx("统一调度、计量并适配国产芯片、GPU、CPU 与异构算力池", "Schedule and meter domestic chips, GPUs, CPUs and heterogeneous compute pools")}</b>
          <span>${tx("建设模型门户", "Build a model portal")}</span><b>${tx("可治理、可评测、可发布的 AI 资产 Hub", "A governed, evaluated and deployable AI asset hub")}</b>
          <span>${tx("交付单点应用", "Deliver isolated applications")}</span><b>${tx("Agent 构建、运行、反馈与持续进化", "Agent build, operation, feedback and continuous evolution")}</b>
          <span>${tx("举办活动与招商", "Run events and attraction campaigns")}</span><b>${tx("开发者、企业、资本和场景的常态运营", "Ongoing operations across developers, enterprises, capital and scenarios")}</b>
        </div>
      </div>
      <div class="c32-benefits">
        <div class="app-kicker">WHO BENEFITS</div>
        <article><small>GOVERNMENT</small><b>${tx("治理与主权", "Governance & sovereignty")}</b><p>${tx("掌握城市 AI 资产、数据边界、规则和公共服务入口。", "Own city AI assets, data boundaries, rules and the public-service entry point.")}</p></article>
        <article><small>ENTERPRISE</small><b>${tx("降本与生产", "Lower cost & production")}</b><p>${tx("共享算力与模型服务，同时保留私有化和业务控制权。", "Share compute and model services while retaining private control.")}</p></article>
        <article><small>INDUSTRY</small><b>${tx("招商与生态", "Attraction & ecosystem")}</b><p>${tx("聚集企业、科研、开发者、人才与资本。", "Cluster enterprises, research, developers, talent and capital.")}</p></article>
        <article><small>FISCAL</small><b>${tx("运营与财政", "Operations & fiscal value")}</b><p>${tx("形成算力、订阅、数据和解决方案收入。", "Generate compute, subscription, data and solution revenue.")}</p></article>
      </div>
      <div class="c32-nodes">
        <div class="c32-node-label"><small>VALIDATED CITY NEEDS</small><b>${tx("同一底座，适配不同城市任务", "One foundation, adapted to different city missions")}</b></div>
        <article><b>${tx("宜昌", "Yichang")}</b><span>${tx("产业载体与长期运营", "Industry hub & operations")}</span></article>
        <article><b>${tx("东方", "Dongfang")}</b><span>${tx("自贸港与东南亚接口", "Free-trade gateway")}</span></article>
        <article><b>${tx("深圳龙岗", "Shenzhen Longgang")}</b><span>${tx("国产异构算力平台", "Domestic heterogeneous compute")}</span></article>
        <article><b>${tx("盐城", "Yancheng")}</b><span>${tx("产业算力与场景集群", "Compute & industry scenarios")}</span></article>
        <article><b>${tx("重庆", "Chongqing")}</b><span>${tx("区域节点与开发者生态", "Regional node & developers")}</span></article>
        <article><b>${tx("四川 · 乐山", "Sichuan · Leshan")}</b><span>${tx("特色产业与城市服务", "Sector AI & city services")}</span></article>
      </div>
    </div>`,
    "建设逻辑：从资源投入升级为可持续运营的 AI 生产与产业系统",
    "Construction thesis: move from resource spending to an operating AI production and industry system");

  render(33,
    "城市级方案 · 建什么", "City Solution · What to Build",
    "城市 AI 建设不是堆叠产品，而是“1 个底座 + 5 类平台 + 2 个产业专区”",
    "City AI is not a product stack; it is one foundation, five platforms and two industry zones", `
    <div class="app-stage city33">
      <div class="c33-governance">
        <div class="app-kicker">WHO OWNS & OPERATES</div>
        ${tx("不是采购一个模型或软件，而是建立城市长期掌握的 AI 资产、规则与运营权。", "This is not a model or software purchase. It establishes city-owned AI assets, rules and operating rights.", "p", "app-lead")}
        <div class="c33-operator">
          <small>${tx("城市 AI 运营主体", "CITY AI OPERATOR")}</small>
          <b>${tx("资产 · 规则 · 收益", "Assets · rules · revenue")}</b>
          <span>${tx("负责建设、招商、服务、计量与年度运营", "Responsible for delivery, attraction, services, metering and annual operations")}</span>
        </div>
        <div class="c33-partners">
          <article><b>${tx("政府", "Government")}</b><span>${tx("政策、公共资源与场景", "Policy, public resources and scenarios")}</span></article>
          <article><b>${tx("开源基金会", "Open-source foundation")}</b><span>${tx("开源治理、标准与社区", "Open governance, standards and community")}</span></article>
          <article><b>${tx("产业联盟", "Industry alliance")}</b><span>${tx("企业、科研与伙伴协同", "Enterprise, research and partner collaboration")}</span></article>
          <article><b>${tx("产业投资基金", "Industry venture fund")}</b><span>${tx("股权投资、项目孵化与生态放大", "Equity investment, incubation and ecosystem scaling")}</span></article>
        </div>
      </div>
      <div class="c33-system">
        <div class="c33-system-head">
          <span>1 + 5 + 2</span>
          <div><small>OPEN CITY AI ARCHITECTURE</small><b>${tx("一套可运营、可治理、可复制的城市 AI 系统", "An operable, governed and repeatable city AI system")}</b></div>
        </div>
        <div class="c33-control">
          <small>OPEN CONTROL PLANE</small>
          <b>CSGHub + AgenticOps</b>
          <p>${tx("贯通资产目录、模型服务、Agent 生命周期、身份权限、评测、审计与运营计量", "Connect assets, model services, the agent lifecycle, identity, evaluation, audit and operating metering")}</p>
        </div>
        <div class="c33-platforms">
          <article><span>01</span><b>${tx("算力服务", "Compute services")}</b><small>${tx("调度 · 计量 · 资源运营", "Scheduling · metering · operations")}</small></article>
          <article><span>02</span><b>${tx("数据语料", "Data & corpus")}</b><small>${tx("数据空间 · 治理 · 交易", "Data spaces · governance · exchange")}</small></article>
          <article><span>03</span><b>${tx("模型资产", "Model assets")}</b><small>${tx("托管 · 评测 · 发布", "Hosting · evaluation · release")}</small></article>
          <article><span>04</span><b>${tx("Agent 应用", "Agent applications")}</b><small>${tx("构建 · 运行 · 反馈", "Build · run · feedback")}</small></article>
          <article><span>05</span><b>${tx("运营治理", "Operations & governance")}</b><small>${tx("权限 · 审计 · 成本", "Access · audit · cost")}</small></article>
        </div>
        <div class="c33-foundation">
          <div><span>1</span><b>${tx("统一异构算力底座", "Unified heterogeneous-compute foundation")}</b></div>
          <p>${tx("兼容国产芯片、GPU、CPU、边缘节点与混合云；统一纳管、调度、计量并允许替换算力供应商。", "Supports domestic chips, GPUs, CPUs, edge nodes and hybrid cloud with unified management, scheduling, metering and vendor replaceability.")}</p>
        </div>
        <div class="c33-zones">
          <article><span>2A</span><b>${tx("城市公共服务专区", "City public-service zone")}</b><small>${tx("政务 · 科研 · 园区 · 公共机构", "Government · research · parks · public institutions")}</small></article>
          <article><span>2B</span><b>${tx("企业与产业孵化专区", "Enterprise & incubation zone")}</b><small>${tx("私有化生产 · 创业孵化 · 场景验证", "Private production · incubation · scenario validation")}</small></article>
        </div>
      </div>
      <div class="c33-outcomes">
        <div class="app-kicker">WHAT THE CITY OWNS</div>
        <article><small>PUBLIC SERVICE</small><b>${tx("城市公共 AI 服务", "City public AI services")}</b><p>${tx("为政务、园区、科研与公共机构提供共享底座。", "A shared foundation for government, parks, research and public institutions.")}</p></article>
        <article><small>ENTERPRISE</small><b>${tx("企业私有化生产", "Private enterprise production")}</b><p>${tx("企业在本地边界内安全使用模型、数据和 Agent。", "Enterprises use models, data and agents safely within their boundary.")}</p></article>
        <article><small>DEVELOPER</small><b>${tx("开发者与创新孵化", "Developers & incubation")}</b><p>${tx("提供工具、算力、沙箱、资本和应用发布入口。", "Tools, compute, sandboxes, capital and application release.")}</p></article>
        <article><small>INDUSTRY</small><b>${tx("招商与生态交易", "Industry attraction & transactions")}</b><p>${tx("形成企业、项目、人才、资本和服务交易网络。", "Build a network of companies, projects, talent, capital and services.")}</p></article>
      </div>
    </div>`,
    "交付物：异构算力底座、五类平台、两类专区、运营主体与产业生态",
    "Deliverables: heterogeneous compute, five platforms, two zones, an operator and an industry ecosystem");

  render(34,
    "城市级方案 · 怎么建", "City Solution · How to Build",
    "城市载体不是一栋办公楼，而是“技术底座 + 企业服务 + 生态运营”的产业中枢",
    "The physical hub is an industry center combining technology, enterprise services and ecosystem operations", `
    <div class="app-stage city34">
      <div class="c34-goals">
        <div class="app-kicker">WHAT THE HUB CONVERTS</div>
        ${tx("把线上平台的资产与流量，转化为企业入驻、场景验证、人才服务和区域品牌。", "Convert online platform assets and traffic into company residency, scenario validation, talent services and a regional brand.", "p", "app-lead")}
        <div class="c34-goal-list">
          <article><span>01</span><div><b>${tx("产业空间", "Industry space")}</b><p>${tx("承载模型、Agent、开发工具企业与公共服务。", "Host model, agent and developer-tool companies and public services.")}</p></div></article>
          <article><span>02</span><div><b>${tx("创新策源", "Innovation engine")}</b><p>${tx("联合科研、企业与基金持续形成成果。", "Connect research, enterprises and funds to create outcomes.")}</p></div></article>
          <article><span>03</span><div><b>${tx("生态构建", "Ecosystem building")}</b><p>${tx("聚集开发者、人才、资本和场景方。", "Cluster developers, talent, capital and scenario owners.")}</p></div></article>
          <article><span>04</span><div><b>${tx("平台运营", "Platform operations")}</b><p>${tx("持续运营算力、数据、模型、Agent 与产业服务。", "Operate compute, data, models, agents and industry services.")}</p></div></article>
        </div>
      </div>
      <div class="c34-building">
        <div class="c34-building-blueprint" aria-label="开放传神开源大厦功能分层示意图">
          <div class="c34-blueprint-head">
            <small>YICHANG DIANJUN · OPENCSG OPEN BUILDING</small>
            <b>${tx("开放传神开源大厦", "OpenCSG Open Building")}</b>
          </div>
          <div class="c34-tower-stage">
            <div class="c34-tower">
              <span class="tower-cap"></span>
              <span class="tower-high"></span>
              <span class="tower-mid"></span>
              <span class="tower-low"></span>
              <span class="tower-base"></span>
            </div>
            <div class="c34-floor-label label-1"><b>${tx("AI 生态专区中心", "AI ecosystem center")}</b><span>${tx("企业服务 · 展示 · 国际连接", "Enterprise services · showcase · global links")}</span></div>
            <div class="c34-floor-label label-2"><b>${tx("模型与 Agent 创新中心", "Model & agent innovation center")}</b><span>${tx("研发 · 评测 · 孵化与发布", "R&D · evaluation · incubation · release")}</span></div>
            <div class="c34-floor-label label-3"><b>${tx("大模型企业集聚区", "Foundation-model enterprise cluster")}</b><span>${tx("入驻企业 · 场景验证 · 产业协同", "Resident firms · validation · collaboration")}</span></div>
            <div class="c34-floor-label label-4"><b>${tx("孵化与交易中心", "Incubation & transaction center")}</b><span>${tx("开发者 · 活动 · 服务交易", "Developers · events · service exchange")}</span></div>
            <div class="c34-floor-label label-5"><b>${tx("1–3F 配套商业区", "Floors 1–3 service zone")}</b><span>${tx("人才 · 会展 · 企业公共服务", "Talent · events · shared enterprise services")}</span></div>
          </div>
          <div class="c34-blueprint-foundation">
            <span>${tx("算力服务", "Compute")}</span><span>${tx("数据语料", "Data")}</span><span>${tx("算法调用", "Model APIs")}</span>
          </div>
        </div>
        <div class="c34-building-caption">
          <small>YICHANG DIANJUN · OPENCSG OPEN BUILDING</small>
          <b>${tx("开放传神开源大厦", "OpenCSG Open Building")}</b>
          <span>${tx("城市 AI 公共服务与产业运营中心", "City AI public service and industry operations center")}</span>
        </div>
        <div class="c34-floors">
          <span>${tx("AI 生态专区", "AI ecosystem zone")}</span>
          <span>${tx("模型与 Agent 创新", "Model & agent innovation")}</span>
          <span>${tx("开发者与场景验证", "Developers & validation")}</span>
          <span>${tx("人才、会展与企业服务", "Talent, events & enterprise services")}</span>
        </div>
      </div>
      <div class="c34-formula">
        <div class="app-kicker">PHASE-1 ORGANIZATION</div>
        <div class="c34-foundation">
          <span>1</span>
          <div><b>${tx("统一异构算力底座", "Unified heterogeneous-compute foundation")}</b><p>${tx("纳管国产芯片、GPU、CPU、边缘节点和混合云，为城市平台提供可替换的算力基础。", "Manage domestic chips, GPUs, CPUs, edge nodes and hybrid cloud as a replaceable compute foundation.")}</p></div>
        </div>
        <div class="c34-consortium">
          <div class="c34-consortium-head"><span>4</span><b>${tx("四位一体创新联合体", "Four-in-one innovation consortium")}</b></div>
          <article><b>${tx("开放平台", "Open platform")}</b><span>${tx("技术与公共服务入口", "Technology & public-service entry")}</span></article>
          <article><b>${tx("数据基金", "Data fund")}</b><span>${tx("数据资产化与项目支持", "Data assets & project support")}</span></article>
          <article><b>${tx("产业孵化基金", "Industry incubation fund")}</b><span>${tx("股权投资与企业孵化", "Equity investment & incubation")}</span></article>
          <article><b>${tx("产业联盟", "Industry alliance")}</b><span>${tx("企业、科研和场景协同", "Enterprise, research & scenario collaboration")}</span></article>
        </div>
        <div class="c34-platform-chain">
          <div class="c34-platform-title"><span>3</span><b>${tx("三类可收费平台服务", "Three monetizable platform services")}</b></div>
          <article><small>01</small><b>${tx("算力服务平台", "Compute service platform")}</b><p>${tx("异构调度 → 使用计量 → 资源运营", "Scheduling → metering → resource operations")}</p></article>
          <i>→</i>
          <article><small>02</small><b>${tx("数据语料平台", "Data corpus platform")}</b><p>${tx("数据空间 → 治理加工 → 合规交易", "Data spaces → governance → compliant exchange")}</p></article>
          <i>→</i>
          <article><small>03</small><b>${tx("模型与 Agent 平台", "Model & agent platform")}</b><p>${tx("调用服务 → 应用构建 → 企业交付", "Invocation → application build → enterprise delivery")}</p></article>
        </div>
      </div>
    </div>`,
    "参考：宜昌点军 AI 宜居城市项目；建筑素材来自原方案，功能与组织关系均为独立 HTML 元素",
    "Reference: Yichang Dianjun plan; the building image comes from the source plan and all functional relationships are native HTML");

  render(35,
    "城市级方案 · 东方为什么", "City Solution · Why Dongfang",
    "东方：从自贸港通道城市，升级为面向东南亚的国家级数字接口",
    "Dongfang: from a free-trade corridor to a national digital gateway for Southeast Asia", `
    <div class="app-stage city35">
      <div class="c35-window">
        <div class="app-kicker">HAINAN FREE TRADE PORT × SOUTHEAST ASIA</div>
        ${tx("东方的机会不在复制传统园区，而在抓住政策、技术与区域市场同时打开的五年窗口。", "Dongfang should not replicate a traditional park. Its opportunity is the five-year window created by policy, technology and regional markets.", "p", "app-lead")}
        <div class="c35-window-number"><b>5 YEARS</b><span>${tx("政策 × 技术 × 区域市场的叠加窗口", "Converging window of policy, technology and regional markets")}</span></div>
        <div class="c35-triangle">
          <article><span>01</span><b>${tx("政策窗口", "Policy window")}</b><p>${tx("海南自贸港为数据流通、数字贸易和制度创新提供试验空间。", "The Hainan Free Trade Port enables experimentation in data circulation, digital trade and institutional innovation.")}</p></article>
          <article><span>02</span><b>${tx("技术窗口", "Technology window")}</b><p>${tx("开源模型、Agent 与异构算力让城市可以低成本拥有自己的 AI 底座。", "Open models, agents and heterogeneous compute let cities own an AI foundation at lower cost.")}</p></article>
          <article><span>03</span><b>${tx("区域窗口", "Regional window")}</b><p>${tx("连接香港、新加坡和东南亚，形成跨境数字服务与产业协作节点。", "Connect Hong Kong, Singapore and Southeast Asia as a cross-border digital-service and industry node.")}</p></article>
        </div>
      </div>
      <div class="c35-gateway" aria-label="东方连接东南亚数字网络">
        <svg viewBox="0 0 650 620">
          <path d="M108 317C184 219 276 177 354 205S493 291 558 207" fill="none" stroke="#9EC9C2" stroke-width="2" stroke-dasharray="7 8"/>
          <path d="M108 317C212 346 325 399 535 410" fill="none" stroke="#23877B" stroke-width="3"/>
          <path d="M108 317C253 266 392 304 558 207" fill="none" stroke="#23877B" stroke-width="3"/>
          <circle cx="108" cy="317" r="74" fill="#E7F5F2" stroke="#23877B" stroke-width="3"/>
          <circle cx="354" cy="205" r="38" fill="#fff" stroke="#86B7AF" stroke-width="2"/>
          <circle cx="558" cy="207" r="46" fill="#fff" stroke="#23877B" stroke-width="2"/>
          <circle cx="535" cy="410" r="46" fill="#fff" stroke="#23877B" stroke-width="2"/>
          <circle cx="315" cy="468" r="34" fill="#fff" stroke="#9CBDB7" stroke-width="2"/>
          <g font-family="Arial, sans-serif" text-anchor="middle" fill="#173E37">
            <text x="108" y="309" font-size="28" font-weight="700" data-en="Dongfang">东方</text><text x="108" y="338" font-size="13">DONGFANG</text>
            <text x="354" y="211" font-size="14" font-weight="700" data-en="Hong Kong">香港</text>
            <text x="558" y="213" font-size="15" font-weight="700" data-en="Singapore">新加坡</text>
            <text x="535" y="416" font-size="15" font-weight="700" data-en="Southeast Asia">东南亚</text>
            <text x="315" y="474" font-size="13" font-weight="700" data-en="Hainan Free Trade Port">海南自贸港</text>
          </g>
          <g fill="#23877B"><circle cx="228" cy="281" r="6"/><circle cx="425" cy="296" r="6"/><circle cx="372" cy="374" r="6"/></g>
        </svg>
        <div class="c35-gateway-caption"><small>NATIONAL DIGITAL GATEWAY</small><b>${tx("东方连接海南自贸港、香港、新加坡与东南亚", "Dongfang connects the Hainan Free Trade Port, Hong Kong, Singapore and Southeast Asia")}</b></div>
      </div>
      <div class="c35-services">
        <div class="app-kicker">WHAT THE GATEWAY ENABLES</div>
        <article><span>01</span><b>${tx("跨境数据合规服务", "Compliant cross-border data services")}</b><p>${tx("形成数据空间、规则验证、加工和交易服务。", "Provide data spaces, rule validation, processing and exchange.")}</p></article>
        <article><span>02</span><b>${tx("模型与 Agent 出海", "Models and agents going global")}</b><p>${tx("提供多语言适配、评测、托管与区域发布能力。", "Provide multilingual adaptation, evaluation, hosting and regional release.")}</p></article>
        <article><span>03</span><b>${tx("区域算力与开发服务", "Regional compute and developer services")}</b><p>${tx("连接区域算力、开发者和企业应用需求。", "Connect regional compute, developers and enterprise demand.")}</p></article>
        <article><span>04</span><b>${tx("数字贸易与产业协作", "Digital trade and industry collaboration")}</b><p>${tx("形成面向东南亚的服务出口、伙伴合作与结算入口。", "Create a service-export, partner and settlement gateway for Southeast Asia.")}</p></article>
      </div>
    </div>`,
    "资料来源：《打造“东方新加坡”的国家级数字枢纽工程》",
    "Source: National Digital Hub — Building the “Dongfang Singapore” plan");

  render(36,
    "城市级方案 · 东方怎么做", "City Solution · How Dongfang Works",
    "三阶段建设、三类核心收入：让城市 AI 平台从“政府启动”走向“自我造血”",
    "Three phases and three core revenue streams move the platform from public launch to self-sustaining growth", `
    <div class="app-stage city36">
      <div class="c36-anchor">
        <div><small>STARTING ANCHOR</small><b>¥54M</b></div>
        <p>${tx("首期投入用于建设“1 个统一底座 + 5 类平台 + 2 个产业专区”，不是重资产园区投资。", "Initial investment builds one unified foundation, five platforms and two industry zones — not a heavy-asset real-estate project.")}</p>
        <span>${tx("目标：3 个月平台上线，6 个月形成首批企业与场景", "Target: platform online in 3 months; first enterprises and scenarios in 6 months")}</span>
      </div>
      <div class="c36-phases">
        <article><span>01 · 0–12M</span><b>${tx("政府启动：建底座", "Public launch: build the foundation")}</b><p>${tx("接入异构算力、数据与国产软硬件，上线 CSGHub、AgenticOps 和安全治理。", "Connect heterogeneous compute, data and domestic stacks; launch CSGHub, AgenticOps and security governance.")}</p><em>${tx("从零到可用", "From zero to usable")}</em></article>
        <i>→</i>
        <article><span>02 · 12–36M</span><b>${tx("平台运营：开始造血", "Platform operations: generate revenue")}</b><p>${tx("面向企业与开发者提供算力、平台订阅、数据和 Agent 服务，形成持续收入。", "Sell compute, subscriptions, data and agent services to enterprises and developers.")}</p><em>${tx("从成本中心到收入中心", "From cost center to revenue center")}</em></article>
        <i>→</i>
        <article><span>03 · 36–60M</span><b>${tx("市场放大：财政回流", "Market scale: fiscal return")}</b><p>${tx("扩大企业集聚、跨境服务和生态交易，以税收、服务收入和再投资形成正循环。", "Scale enterprise clustering, cross-border services and ecosystem transactions into taxes, service revenue and reinvestment.")}</p><em>${tx("从平台收入到财政正循环", "From platform revenue to a fiscal loop")}</em></article>
      </div>
      <div class="c36-revenue-head">
        <div><small>THREE CORE REVENUE STREAMS</small><b>${tx("同一底座，三类可规模化收入", "One foundation, three scalable revenue streams")}</b></div>
        <p>${tx("政府只负责启动公共能力，后续由实际使用量和市场服务驱动增长。", "Public investment starts the shared capability; usage and market services drive growth thereafter.")}</p>
      </div>
      <div class="c36-revenues">
        <article><span>01</span><b>${tx("算力开始收费", "Compute becomes billable")}</b><p>${tx("训练、推理、项目算力、异构调度与资源运营。", "Training, inference, project compute, heterogeneous scheduling and resource operations.")}</p><small>${tx("按量 / 包年 / 项目", "Usage / annual / project")}</small></article>
        <article><span>02</span><b>${tx("平台开始收费", "Platform becomes billable")}</b><p>${tx("企业 License、订阅、年度运营、治理和开发者服务。", "Enterprise licenses, subscriptions, annual operations, governance and developer services.")}</p><small>${tx("订阅 / 服务 / 运营", "Subscription / service / operations")}</small></article>
        <article><span>03</span><b>${tx("数据开始变现", "Data becomes monetizable")}</b><p>${tx("数据空间、合规加工、跨境数据服务与项目引入。", "Data spaces, compliant processing, cross-border data services and project introduction.")}</p><small>${tx("加工 / 交易 / 跨境服务", "Processing / exchange / cross-border")}</small></article>
      </div>
      <div class="c36-loop"><span>${tx("政府点火", "PUBLIC IGNITION")}</span><i>→</i><span>${tx("平台运营", "PLATFORM OPERATIONS")}</span><i>→</i><span>${tx("市场放大", "MARKET SCALE")}</span><i>→</i><span>${tx("财政回流", "FISCAL RETURN")}</span><i>→</i><span>${tx("再投资", "REINVEST")}</span></div>
    </div>`,
    "核心判断：城市平台的价值不只在技术交付，而在持续运营权与区域网络效应",
    "Core insight: value comes from operating rights and regional network effects, not only technology delivery");

  render(37,
    "城市级方案 · 收益与复制", "City Solution · Returns & Replication",
    "城市 AI 平台最终要交付三层回报，并形成可复制的区域网络",
    "A city AI platform must deliver three layers of returns and create a repeatable regional network", `
    <div class="app-stage city37">
      <div class="c37-returns">
        <div class="app-kicker">THREE LAYERS OF RETURN</div>
        <article><span>01</span><div><small>DIRECT FISCAL RETURN</small><b>${tx("直接财政回报", "Direct fiscal return")}</b><p>${tx("算力与平台服务收入、税收、运营收入和政策红利。", "Compute and platform revenue, taxes, operating income and policy dividends.")}</p></div></article>
        <article><span>02</span><div><small>INDUSTRY DEPTH RETURN</small><b>${tx("产业深度回报", "Industry depth return")}</b><p>${tx("企业与算力服务商落地、高端就业、项目集聚与产业链形成。", "Company and compute-provider settlement, high-end jobs, projects and an industry chain.")}</p></div></article>
        <article><span>03</span><div><small>CITY CAPABILITY RETURN</small><b>${tx("城市能力与品牌回报", "City capability and brand return")}</b><p>${tx("形成数字接口城市、数据制度能力、人才网络和全国影响力。", "Create a digital gateway, data-governance capability, talent network and national influence.")}</p></div></article>
      </div>
      <div class="c37-flywheel">
        <div class="c37-flywheel-title"><small>THE CITY GROWTH FLYWHEEL</small><b>${tx("不是一次性项目，而是持续自我强化的运营系统", "Not a one-off project, but a continuously reinforcing operating system")}</b></div>
        <div class="c37-cycle">
          <article><span>01</span><b>${tx("政府点火", "Public ignition")}</b><small>${tx("公共底座与制度入口", "Infrastructure & policy entry")}</small></article><i>→</i>
          <article><span>02</span><b>${tx("平台运营", "Platform operations")}</b><small>${tx("算力、平台与数据收费", "Compute, platform & data billing")}</small></article><i>→</i>
          <article><span>03</span><b>${tx("企业集聚", "Enterprise clustering")}</b><small>${tx("项目、人才、资本进入", "Projects, talent & capital enter")}</small></article><i>→</i>
          <article><span>04</span><b>${tx("市场放大", "Market scale")}</b><small>${tx("跨境服务与生态交易", "Cross-border services & transactions")}</small></article><i>→</i>
          <article><span>05</span><b>${tx("财政回流", "Fiscal return")}</b><small>${tx("税收、收入与再投资", "Taxes, revenue & reinvestment")}</small></article>
        </div>
      </div>
      <div class="c37-network">
        <div class="c37-network-head"><small>REGIONAL REPLICATION NETWORK</small><b>${tx("技术底座可复制，城市定位不复制", "The technology foundation repeats; each city's positioning remains distinct")}</b></div>
        <article class="validated"><span>${tx("实践", "LIVE")}</span><b>${tx("宜昌", "Yichang")}</b><small>${tx("产业载体型", "Industry hub")}</small></article>
        <article class="planned"><span>${tx("方案", "PLAN")}</span><b>${tx("东方", "Dongfang")}</b><small>${tx("区域接口型", "Regional gateway")}</small></article>
        <article class="planned"><span>${tx("可研", "STUDY")}</span><b>${tx("深圳龙岗", "Shenzhen Longgang")}</b><small>${tx("技术底座型", "Technology foundation")}</small></article>
        <article><span>${tx("节点", "NODE")}</span><b>${tx("盐城", "Yancheng")}</b><small>${tx("产业算力型", "Industry compute")}</small></article>
        <article><span>${tx("节点", "NODE")}</span><b>${tx("重庆", "Chongqing")}</b><small>${tx("开发者生态型", "Developer ecosystem")}</small></article>
        <article><span>${tx("节点", "NODE")}</span><b>${tx("四川 · 乐山", "Sichuan · Leshan")}</b><small>${tx("特色产业型", "Sector-specific AI")}</small></article>
      </div>
      <div class="c37-standard"><b>${tx("共同标准件", "COMMON BUILDING BLOCKS")}</b><span>${tx("开源 AgenticOps 控制层", "Open AgenticOps control plane")}</span><span>${tx("异构算力与城市运营主体", "Heterogeneous compute and city operator")}</span><span>${tx("平台收入与产业生态", "Platform revenue and industry ecosystem")}</span></div>
    </div>`,
    "可复制的是“技术底座 + 城市运营 + 产业生态”，不是一张软件清单",
    "What repeats is the technology foundation, city operations and industry ecosystem — not a software checklist");
})();
