(() => {
  const A = "assets/appendix/";
  const esc = (s = "") => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const tx = (zh, en, tag = "span", cls = "") => `<${tag}${cls ? ` class="${cls}"` : ""} data-en="${esc(en)}">${zh}</${tag}>`;
  const header = (num, kickerZh, kickerEn, titleZh, titleEn, footZh = "OPENCSG · APPENDIX", footEn = "OPENCSG · APPENDIX") => `
    <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
    <div class="section">${tx(kickerZh, kickerEn, "span", "section-zh")}</div>
    ${titleZh ? tx(titleZh, titleEn, "h2", "title") : ""}
    <div class="foot">${tx(footZh, footEn)}<span>${String(num).padStart(2, "0")}</span></div>`;
  const slide = (num, kickerZh, kickerEn, titleZh, titleEn, body, extra = "") =>
    `<div class="slide-wrap"><section class="slide light appendix-slide ${extra}" data-layout="APP-${num}" id="slide-${String(num).padStart(2, "0")}">${header(num, kickerZh, kickerEn, titleZh, titleEn)}${body}</section></div>`;

  const appendixSlides = [
    `<div class="slide-wrap"><section class="slide light appendix-slide appendix-divider" data-layout="APP-DIVIDER" id="slide-16">
      <div class="app-index">APPENDIX · 01</div>
      <div class="app-big">01</div>
      ${tx("重点客户与生产验证", "Key Customers & Production Validation", "div", "app-name")}
      <div class="app-rule"></div>
      <div class="app-list">
        <div><b>01–03</b>${tx("区域 AI 平台与运营商", "Regional AI platforms & telecom", "span")}</div>
        <div><b>04–05</b>${tx("产业园区与区域生态", "Industrial parks & regional ecosystems", "span")}</div>
        <div><b>06–07</b>${tx("科研机构与数据飞轮", "Research institutions & data flywheel", "span")}</div>
        <div><b>PROOF</b>${tx("从单点项目走向可复制生产系统", "From one-off projects to repeatable production systems", "span")}</div>
      </div>
      <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
      <div class="foot"><span>OPENCSG · CUSTOMER PROOF</span><span>16</span></div>
    </section></div>`,

    slide(17, "客户案例 · 区域 AI 平台", "Customer Case · Regional AI Platform",
      "宜昌点军算法生态社区：把异构算力转化为持续运营的 AI 生态",
      "Yichang Dianjun: turning heterogeneous compute into an operating AI ecosystem", `
      <div class="app-stage app-split">
        <div>
          <div class="app-media contain" style="height:445px"><img src="${A}slide-02-image-04.png" alt="三峡传神社区平台"></div>
          <div class="app-two-media" style="height:220px;margin-top:14px;grid-template-columns:1.25fr .75fr">
            <div class="app-media"><img src="${A}slide-02-image-02.png" alt="区域算力与资源分布"></div>
            <div class="app-media contain"><img src="${A}slide-02-image-03.png" alt="平台运营数据"></div>
          </div>
        </div>
        <div class="case-narrative">
          ${tx("案例简介", "Case summary", "div", "app-kicker")}
          ${tx("OpenCSG 基于 CSGHub 打造“三峡传神社区”，连接异构算力、模型、数据集、Agent 应用与开发者生态。", "Built on CSGHub, the Three Gorges AI Community connects heterogeneous compute, models, datasets, agents and developers.", "p", "app-lead")}
          <div class="case-brief-grid">
            <div class="app-card">
              ${tx("客户需求", "Customer need", "h3")}
              ${tx("把分散的异构算力与模型资源变成开发者可直接使用、区域运营方可持续经营的公共 AI 服务。", "Turn fragmented compute and model resources into usable public AI services that regional operators can continuously run.", "p")}
            </div>
            <div class="app-card">
              ${tx("原始问题", "Original problem", "h3")}
              ${tx("资源只有目录，没有应用入口、治理机制和场景运营，存量算力难利用，项目交付后也难持续活跃。", "Resources existed only as a catalog without applications, governance or scenario operations, leaving compute underused and the platform inactive after delivery.", "p")}
            </div>
          </div>
          <div class="app-metrics" style="margin-top:18px">
            <div class="app-metric"><b>DATASET</b>${tx("数据集治理与共享", "Dataset governance & sharing", "span")}</div>
            <div class="app-metric"><b>SPACE</b>${tx("应用空间与原型验证", "Application spaces & prototypes", "span")}</div>
            <div class="app-metric"><b>MODEL</b>${tx("模型资产与推理服务", "Model assets & inference", "span")}</div>
            <div class="app-metric"><b>AGENT</b>${tx("行业 Agent 场景孵化", "Industry agent incubation", "span")}</div>
            <div class="app-metric"><b>ECOSYSTEM</b>${tx("开发者与产业协同", "Developer & industry network", "span")}</div>
            <div class="app-metric"><b>COMPUTE</b>${tx("异构算力统一接入", "Unified heterogeneous compute", "span")}</div>
          </div>
          <div class="app-three case-value-three">
            <div class="app-card">${tx("自主运营", "Autonomous operation", "h3")}${tx("平台、资产和运行规则由区域运营方掌握。", "The regional operator controls the platform, assets and operating rules.", "p")}</div>
            <div class="app-card">${tx("资源变现", "Resource monetization", "h3")}${tx("把闲置算力与模型能力转化为可交付服务。", "Convert idle compute and model capabilities into deliverable services.", "p")}</div>
            <div class="app-card">${tx("区域复制", "Regional replication", "h3")}${tx("产品底座与运营方法能够复制到更多区域。", "Replicate the product foundation and operating playbook across regions.", "p")}</div>
          </div>
        </div>
      </div>`, "客户价值：资源可见、场景可用、生态可运营", "Customer value: visible resources, usable scenarios, operable ecosystem"),

    slide(18, "客户案例 · 国际开源生态", "Customer Case · Global Open Ecosystem",
      "香港数码港：港版 Hugging Face + Web3 的开放 AI 基础设施",
      "Hong Kong Cyberport: open AI infrastructure combining Hugging Face and Web3", `
      <div class="app-stage app-split">
        <div class="case-narrative case-narrative-cyberport">
          ${tx("案例简介", "Case summary", "div", "app-kicker")}
          ${tx("以本地开发者和创作者为核心，构建融合 AI 模型仓库、开源开发工具、Web3 基础设施与创作者经济的社区型平台。", "A community platform for local developers and creators, combining an AI model hub, open development tools, Web3 infrastructure and a creator economy.", "p", "app-lead")}
          <div class="case-brief-grid">
            <div class="app-card">${tx("客户需求", "Customer need", "h3")}${tx("形成面向香港与国际开发者的开放 AI 资产入口，并把模型、工具、创作者和跨境协作连接起来。", "Create an open AI asset gateway for Hong Kong and global developers, connecting models, tools, creators and cross-border collaboration.", "p")}</div>
            <div class="app-card">${tx("原始问题", "Original problem", "h3")}${tx("开发者资源分散，AI 资产难沉淀，Web3 与 AI 社区彼此割裂，活动结束后无法形成长期网络。", "Developer resources were fragmented, AI assets were not retained, and Web3 and AI communities remained disconnected after events.", "p")}</div>
          </div>
          <div class="app-three case-solution-three">
            <div class="app-card">${tx("开源资产 Hub", "Open asset hub", "h3")}${tx("统一模型、数据、工具和应用入口，持续沉淀社区资产。", "Unify models, data, tools and applications into a persistent community asset layer.", "p")}</div>
            <div class="app-card">${tx("开发者生产环境", "Developer production environment", "h3")}${tx("从发现、试用到构建与发布，缩短创新项目进入场景的路径。", "Shorten the path from discovery and prototyping to build and release.", "p")}</div>
            <div class="app-card">${tx("跨境协作机制", "Cross-border collaboration", "h3")}${tx("连接香港、内地与海外生态伙伴，形成开放协作与价值分配网络。", "Connect Hong Kong, mainland China and global partners through an open collaboration and value network.", "p")}</div>
          </div>
          <div class="case-value-band">
            <div>${tx("持续社区", "Persistent community", "b")}${tx("从一次性活动升级为长期资产与开发者运营", "Move from one-off events to long-term asset and developer operations", "span")}</div>
            <div>${tx("国际入口", "Global gateway", "b")}${tx("形成香港连接全球开源 AI 生态的产品入口", "Create Hong Kong's product gateway to the global open AI ecosystem", "span")}</div>
            <div>${tx("创新转化", "Innovation conversion", "b")}${tx("让模型、工具和创作者项目更快进入真实场景", "Move models, tools and creator projects into real use cases faster", "span")}</div>
          </div>
        </div>
        <div>
          <div class="app-media contain" style="height:405px"><img src="${A}slide-03-image-03.png" alt="Cyberport OpenCSG AI 生态"></div>
          <div class="app-media contain" style="height:238px;margin-top:16px"><img src="${A}slide-03-image-01.png" alt="合作生态伙伴"></div>
        </div>
      </div>`, "开放生态不是展示页，而是开发者、资产与商业机制的连接层", "An open ecosystem connects developers, assets and commercial mechanisms"),

    slide(19, "客户案例 · 运营商", "Customer Case · Telecom",
      "中国联通：从总部 SaaS 走向自主可控的多模型生产平台",
      "China Unicom: from central SaaS to a controllable multi-model production platform", `
      <div class="app-stage telecom-case">
        <div class="telecom-head">
          <div class="telecom-logo"><img src="${A}slide-04-image-02.png" alt="中国联通"></div>
          <div>${tx("客户需求", "Customer need", "div", "app-kicker")}${tx("在本地业务边界内统一管理多模型、数据和权限，同时保留总部平台无法提供的自部署、审计和持续运营能力。", "Unify multiple models, data and permissions within the local business boundary while adding self-hosting, audit and continuous operations unavailable from the central platform.", "p", "app-lead")}</div>
          <div class="app-media contain"><img src="${A}slide-04-image-01.png" alt="中国联通模型平台流程"></div>
        </div>
        <div class="app-compare">
          <div class="app-compare-col">
            ${tx("原总部 SaaS 平台", "Original central SaaS", "h3")}
            ${tx("缺乏直接管理大模型的能力", "No direct large-model management", "div", "app-compare-row")}
            ${tx("仅支持 SaaS，业务方无法完全掌握产品", "SaaS-only; the business unit lacked control", "div", "app-compare-row")}
            ${tx("固定 LLMOps 流程，难以切换多模型", "Fixed LLMOps flow; limited model switching", "div", "app-compare-row")}
            ${tx("模型、数据和许可证合规缺乏保障", "Weak model, data and license compliance", "div", "app-compare-row")}
          </div>
          <div class="app-vs">VS</div>
          <div class="app-compare-col target">
            <h3>CSGHub</h3>
            ${tx("统一管理模型、数据集与代码仓库", "Unified models, datasets and code repositories", "div", "app-compare-row")}
            ${tx("支持多种自部署方式，平台完全自主可控", "Multiple self-hosting modes with full control", "div", "app-compare-row")}
            ${tx("支持多模型切换、灵活部署和数据治理", "Multi-model switching, flexible deployment and data governance", "div", "app-compare-row")}
            ${tx("自动 + 人工审核，支持许可证检查与溯源", "Automated + human review with license checks and provenance", "div", "app-compare-row")}
          </div>
        </div>
        <div class="case-value-band telecom-values">
          <div>${tx("本地自主", "Local control", "b")}${tx("模型、数据、部署和版本节奏由业务方掌握", "The business unit controls models, data, deployment and release cadence", "span")}</div>
          <div>${tx("多模型连续运营", "Multi-model continuity", "b")}${tx("统一接入、切换、评测与回滚，降低单一模型依赖", "Unify access, switching, evaluation and rollback to reduce single-model dependency", "span")}</div>
          <div>${tx("可审计合规", "Auditable compliance", "b")}${tx("许可证、权限、发布与操作全过程可追溯", "Trace licenses, permissions, releases and operations end to end", "span")}</div>
          <div>${tx("生产效率", "Production efficiency", "b")}${tx("一套平台支撑模型资产、业务应用与后续扩容", "One platform supports model assets, business applications and expansion", "span")}</div>
        </div>
      </div>`, "关键验证：企业私有化是正式生产需求，不是单一政策需求", "Proof: enterprise self-hosting is a production need, not a policy-only demand"),

    slide(20, "客户案例 · 区域产业生态", "Customer Case · Regional Industry Ecosystem",
      "开放东方社区：海南自贸港 AI 产业标杆与东南亚创新入口",
      "Open Oriental Community: Hainan AI benchmark and Southeast Asia gateway", `
      <div class="app-stage app-building">
        <div class="app-media"><img src="${A}slide-05-image-01.png" alt="开放东方社群产业园"></div>
        <div class="app-value-stack">
          <div class="app-value-row"><b>${tx("客户需求", "Customer need")}</b>${tx("不是再建一个展示园区，而是形成能招商、能交付、能持续运营的 AI 产业载体。", "Build an AI industry vehicle that can attract companies, deliver services and operate continuously—not another showcase park.")}${tx("同时承接海南自贸港开放政策与东南亚市场连接。", "Align Hainan Free Trade Port policy with a Southeast Asia market gateway.")}</div>
          <div class="app-value-row"><b>${tx("原始问题", "Original problem")}</b>${tx("园区同质化；企业拿不到低成本算力、模型、数据和应用工具。", "The park lacked differentiation; companies could not access affordable compute, models, data or application tools.")}${tx("招商、技术服务和生态活动彼此割裂，难形成长期留存。", "Investment promotion, technical services and ecosystem programs were disconnected and failed to retain companies.")}</div>
          <div class="app-value-row"><b>${tx("OpenCSG 方案", "OpenCSG solution")}</b><span>CSGHub + Compute + Data + Models</span>${tx("Agent 应用专区 + 开发者社区 + 伙伴交付 + 持续运营", "Agent application zone + developer community + partner delivery + ongoing operations")}</div>
          <div class="app-value-row"><b>${tx("客户价值", "Customer value")}</b>${tx("园区获得可持续招商与企业服务能力，而非一次性系统。", "The park gains persistent investment-attraction and enterprise-service capacity instead of a one-off system.")}${tx("形成海南 AI 标杆、东南亚入口和可复制的区域运营方法。", "Create a Hainan AI benchmark, Southeast Asia gateway and repeatable regional operating model.")}</div>
        </div>
        <div class="app-media contain" style="position:absolute;left:52px;bottom:26px;width:330px;height:236px;background:#fff"><img src="${A}slide-05-image-02.png" alt="海南 AI 产业生态关系"></div>
      </div>`, "项目价值：区域平台建设 + 持续生态运营 + 跨境连接", "Project value: regional platform + ecosystem operations + cross-border connectivity"),

    slide(21, "产品验证 · 数据飞轮", "Product Proof · Data Flywheel",
      "AgenticHub 数据飞轮：别人消耗模型，我们持续进化模型",
      "AgenticHub data flywheel: others consume models; we continuously improve them", `
      <div class="app-stage app-flywheel">
        <div class="app-media contain"><img src="${A}slide-06-image-01.png" alt="AgenticHub 数据飞轮"></div>
        <div class="app-cycle-list">
          <div class="flywheel-case-intro">${tx("案例背景", "Case context", "div", "app-kicker")}${tx("某企业希望把内部知识与员工使用反馈变成可持续进化的专属 Agent，而不是每次调用都把数据和价值留给外部模型。", "An enterprise wanted internal knowledge and employee feedback to continuously improve its own agents instead of leaving data and value with external models.", "p")}</div>
          <div class="app-cycle-grid">
            <div class="app-cycle" data-n="01">${tx("私域数据输入", "Private data input", "b")}${tx("代码、文档、SOP 与业务资料进入企业边界内。", "Code, documents, SOPs and business materials enter the enterprise boundary.", "span")}</div>
            <div class="app-cycle" data-n="02">${tx("业务使用", "Business usage", "b")}${tx("员工通过 Agent 完成对话、工具调用与任务执行。", "Employees use agents for conversation, tools and task execution.", "span")}</div>
            <div class="app-cycle" data-n="03">${tx("运行反馈", "Runtime feedback", "b")}${tx("沉淀日志、执行结果、用户反馈和异常信息。", "Capture logs, outcomes, user feedback and exceptions.", "span")}</div>
            <div class="app-cycle" data-n="04">${tx("知识增强", "Knowledge augmentation", "b")}${tx("通过 RAG / Context 构建企业本地知识。", "Build local enterprise knowledge through RAG and context.", "span")}</div>
            <div class="app-cycle" data-n="05">${tx("数据沉淀", "Data accumulation", "b")}${tx("形成可评测、可训练、可追溯的高质量数据。", "Create high-quality data that is evaluable, trainable and traceable.", "span")}</div>
            <div class="app-cycle" data-n="06">${tx("能力回流", "Capability return", "b")}${tx("持续提升企业专属智能体的准确性和业务适配。", "Continuously improve enterprise-agent accuracy and business fit.", "span")}</div>
          </div>
          <div class="flywheel-value">${tx("客户价值", "Customer value", "b")}${tx("数据不出域、知识持续沉淀、Agent 越用越懂业务；企业获得属于自己的智能资产和模型进化闭环。", "Data stays in-boundary, knowledge accumulates and agents improve with use—creating proprietary intelligence and a model-evolution loop.", "span")}</div>
        </div>
      </div>`, "数据飞轮形成不可复制的企业 AI 智能资产", "The data flywheel creates proprietary enterprise AI assets"),

    slide(22, "客户案例 · 信创生态", "Customer Case · Local Technology Ecosystem",
      "开放龙数社区：深圳本土版 Hugging Face + 信创生态",
      "Open Longshu Community: Shenzhen's Hugging Face plus local technology ecosystem", `
      <div class="app-stage">
        <div class="app-two-media" style="height:390px;grid-template-columns:1fr 1fr">
          <div class="app-media contain"><img src="${A}slide-07-image-01.png" alt="开放龙数生态架构"></div>
          <div class="app-media contain"><img src="${A}slide-07-image-02.png" alt="龙数产业生态服务平台"></div>
        </div>
        <div class="longshu-story">
          <div class="app-card">${tx("客户需求", "Customer need", "h3")}${tx("为深圳本地企业与科研机构提供可自主部署、兼容国产算力和开源模型的公共 AI 生产平台。", "Provide Shenzhen enterprises and research institutions with a self-hosted public AI production platform compatible with domestic compute and open models.", "p")}</div>
          <div class="app-card">${tx("原始问题", "Original problem", "h3")}${tx("算力、模型仓库、训推工具和产业应用分属不同系统；企业需要重复集成，资产无法复用，项目交付周期长。", "Compute, model repositories, training tools and applications lived in separate systems, forcing repeated integration and slow delivery.", "p")}</div>
          <div class="app-card">${tx("OpenCSG 方案", "OpenCSG solution", "h3")}${tx("以 CSGHub 统一模型与数据资产，连接算力调度、训推评测、API 服务和行业应用，形成一体化信创 AI 底座。", "Use CSGHub to unify model and data assets and connect compute scheduling, training, evaluation, APIs and industry applications.", "p")}</div>
          <div class="app-card">${tx("客户价值", "Customer value", "h3")}${tx("企业获得即开即用的国产 AI 工具链；区域运营方获得可持续承载客户、资产与场景的技术平台。", "Enterprises gain a ready-to-use domestic AI toolchain; the regional operator gains a platform that continuously hosts customers, assets and scenarios.", "p")}</div>
          <div class="longshu-capabilities">
            <span>${tx("统一算力调度", "Unified compute scheduling")}</span><span>${tx("模型资产复用", "Reusable model assets")}</span><span>${tx("训推评测闭环", "Training and evaluation loop")}</span><span>${tx("产业应用交付", "Industry application delivery")}</span>
          </div>
        </div>
      </div>`, "区域级验证：算力、模型、工具链与产业应用必须一体化运营", "Regional proof: compute, models, toolchains and applications must operate as one system"),

    slide(23, "客户案例 · 科研机构", "Customer Case · Research Institution",
      "广东智能研究院：统一数据、模型服务与科研协同工作空间",
      "Guangdong Institute of Intelligence: unified data, model services and research collaboration", `
      <div class="app-stage app-solution-grid">
        <div class="app-problem">
          <div class="institute-brand"><span>GIIST</span><b>${tx("广东省智能科学与技术研究院", "Guangdong Institute of Intelligence Science and Technology")}</b></div>
          ${tx("科研生产的三类阻塞", "Three research-production blockers", "div", "app-kicker")}
          ${tx("客户需求：为脑科学、认知科学与类脑计算研究建立统一科研生产环境，让数据、模型、实验与协作过程可复用、可审计。", "Customer need: create a unified research-production environment for brain science, cognitive science and brain-inspired computing so data, models, experiments and collaboration become reusable and auditable.", "p", "app-lead")}
          <ul>
            ${tx("模型训练门槛高：环境复杂、周期长", "High training barrier: complex environments and long cycles", "li")}
            ${tx("数据资产分散：实验数据难复用、难沉淀", "Fragmented data: experiments are hard to reuse and retain", "li")}
            ${tx("系统环境割裂：存储、训练、运维彼此分离", "Disconnected systems: storage, training and operations are separated", "li")}
          </ul>
          <div class="research-value-note">${tx("项目价值", "Project value", "b")}${tx("研究人员不再重复搭环境和找数据；研究院可以沉淀跨团队科研资产、缩短验证周期，并保留完整的数据权限与实验血缘。", "Researchers stop rebuilding environments and searching for data; the institute retains cross-team assets, shortens validation cycles and preserves access and experiment lineage.", "span")}</div>
          <div class="research-delivery">
            <b>${tx("数据纳管", "Govern data")}</b><i>→</i>
            <b>${tx("模型服务化", "Serve models")}</b><i>→</i>
            <b>${tx("实验协同复用", "Reuse experiments")}</b>
          </div>
        </div>
        <div class="app-solution">
          <div class="app-sol">${tx("统一数据湖 · Unified Data Lake", "Unified Data Lake", "b")}${tx("集中管理结构化与非结构化科研数据，建立血缘、权限和可复用边界。", "Centralize structured and unstructured research data with lineage, access and reuse boundaries.", "p")}</div>
          <div class="app-sol">${tx("模型即服务 · Model-as-a-Service", "Model-as-a-Service", "b")}${tx("把模型能力 API 化，降低训练与调用门槛，加速研究验证。", "Expose models through APIs to reduce training and access barriers and accelerate validation.", "p")}</div>
          <div class="app-sol">${tx("协同工作空间 · Collaborative Workspace", "Collaborative Workspace", "b")}${tx("共享实验、数据和运行环境，让研究过程可复盘、可协作、可持续。", "Share experiments, data and runtime environments so research becomes collaborative and reproducible.", "p")}</div>
        </div>
        <div class="app-outcomes">
          <div>${tx("激活数据价值", "Activate data value", "b")}${tx("提升数据复用和资产化能力", "Improve data reuse and assetization", "span")}</div>
          <div>${tx("加速创新验证", "Accelerate validation", "b")}${tx("缩短科研验证与成果转化周期", "Shorten research validation and transfer cycles", "span")}</div>
          <div>${tx("提升运维效率", "Improve operations", "b")}${tx("降低环境和系统维护成本", "Reduce environment and system maintenance costs", "span")}</div>
        </div>
      </div>`, "科研机构需要的不是单个模型，而是可复用、可审计的研究生产系统", "Research institutions need a reusable, auditable production system—not a single model"),

    `<div class="slide-wrap"><section class="slide light appendix-slide appendix-divider" data-layout="APP-DIVIDER" id="slide-24">
      <div class="app-index">APPENDIX · 02</div>
      <div class="app-big">02</div>
      ${tx("产品与技术方案", "Products & Technical Solutions", "div", "app-name")}
      <div class="app-rule"></div>
      <div class="app-list">
        <div><b>01</b>${tx("AgenticHub 企业级智能体平台", "AgenticHub enterprise agent platform", "span")}</div>
        <div><b>02</b>${tx("AgenticOps 制造业全链路架构", "Manufacturing AgenticOps architecture", "span")}</div>
        <div><b>03–05</b>${tx("CSGHub-Lite · CSGClaw · CSGHub", "CSGHub-Lite · CSGClaw · CSGHub", "span")}</div>
        <div><b>06</b>${tx("技术文档与试用入口", "Documentation & trial access", "span")}</div>
      </div>
      <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
      <div class="foot"><span>OPENCSG · PRODUCT & TECHNOLOGY</span><span>24</span></div>
    </section></div>`,

    slide(25, "产品方案 · 组织型 AgenticOps", "Product · Organizational AgenticOps",
      "AgenticHub：企业级一站式 AI 原生智能体平台",
      "AgenticHub: an enterprise all-in-one AI-native agent platform", `
      <div class="app-stage app-product-layout">
        <div class="app-product-visual"><img src="${A}slide-10-image-01.png" alt="AgenticHub 产品能力图"></div>
        <div class="app-feature-grid">
          <div class="app-feature">${tx("双模式智能体支持", "Dual-mode agent development", "b")}${tx("无代码可视化拖拽与代码脚本接口并存，从快速构建到深度定制。", "No-code visual building and code interfaces support both speed and deep customization.", "p")}${tx("NO-CODE · CODE · SANDBOX", "NO-CODE · CODE · SANDBOX", "small")}</div>
          <div class="app-feature">${tx("模型与工具一体化管理", "Unified model & tool management", "b")}${tx("直接调用多类型模型、内置工具和企业自定义工具。", "Use multiple models, built-in tools and enterprise-registered tools in one place.", "p")}${tx("LLM · TOOLS · ENTERPRISE API", "LLM · TOOLS · ENTERPRISE API", "small")}</div>
          <div class="app-feature">${tx("可视化流程编排", "Visual workflow orchestration", "b")}${tx("高级逻辑控制、实时调试与复杂工作流稳定运行。", "Advanced logic, live debugging and reliable complex workflows.", "p")}${tx("WORKFLOW · DEBUG · VERSION", "WORKFLOW · DEBUG · VERSION", "small")}</div>
          <div class="app-feature">${tx("全生命周期闭环", "Full lifecycle loop", "b")}${tx("从提示词、构建、测试到部署、运营和重训，全程可追踪。", "Trace prompts, build, test, deployment, operations and retraining end to end.", "p")}${tx("BUILD · TEST · RELEASE · OPERATE", "BUILD · TEST · RELEASE · OPERATE", "small")}</div>
          <div class="app-feature">${tx("AgenticOps 助力转型", "AgenticOps transformation", "b")}${tx("一键部署、反馈闭环与持续强化，推动企业进入 AI 原生运营。", "One-click deployment, feedback loops and continuous improvement enable AI-native operations.", "p")}${tx("DEPLOY · FEEDBACK · DATA FLYWHEEL", "DEPLOY · FEEDBACK · DATA FLYWHEEL", "small")}</div>
          <div class="app-feature">${tx("开放扩展生态", "Open extensibility", "b")}${tx("兼容外部模型、工具、MCP 与现有业务系统。", "Integrate external models, tools, MCP and existing business systems.", "p")}${tx("API · MCP · BUSINESS SYSTEMS", "API · MCP · BUSINESS SYSTEMS", "small")}</div>
        </div>
      </div>`, "方法论：数据治理 → 模型管理 → Agent 调度 → 应用反馈", "Methodology: data governance → model management → agent operations → feedback"),

    slide(26, "技术架构 · 制造业", "Architecture · Manufacturing",
      "AgenticOps 全链路架构：AI 驱动的制造协同体系",
      "Full-stack AgenticOps architecture for AI-driven manufacturing collaboration", `
      <div class="app-stage app-architecture">
        <div class="app-arch-notes">
          <div>${tx("双飞轮构建", "Dual flywheels", "b")}${tx("业务反馈与模型能力相互强化", "Business feedback and model capability reinforce each other", "span")}</div>
          <div>${tx("全链路动态优化", "End-to-end optimization", "b")}${tx("从云端模型到边缘设备持续优化", "Continuous optimization from cloud models to edge devices", "span")}</div>
          <div>${tx("预测性闭环管理", "Predictive closed loop", "b")}${tx("状态、异常、决策和执行形成闭环", "Connect status, exceptions, decisions and execution", "span")}</div>
          <div>${tx("低门槛场景适配", "Low-barrier adaptation", "b")}${tx("通过 Agent、数据与协议适配多元产线", "Adapt diverse production lines through agents, data and protocols", "span")}</div>
          <div style="height:250px;border:1px solid var(--line);padding:15px;display:grid;grid-template-rows:repeat(3,1fr)">
            <div style="display:grid;grid-template-columns:92px 1fr;border-bottom:1px solid var(--line);align-items:center"><b style="color:var(--teal)">CLOUD</b>${tx("模型训推 · Agent 运营 · 远程运维", "Model training · Agent operations · Remote O&M")}</div>
            <div style="display:grid;grid-template-columns:92px 1fr;border-bottom:1px solid var(--line);align-items:center"><b style="color:var(--teal)">EDGE</b>${tx("本地推理 · 实时控制 · 数据管理", "Local inference · Real-time control · Data management")}</div>
            <div style="display:grid;grid-template-columns:92px 1fr;align-items:center"><b style="color:var(--teal)">DEVICE</b>${tx("工业网关 · PLC · CNC · Robot · Sensor", "Gateway · PLC · CNC · Robot · Sensor")}</div>
          </div>
        </div>
        <div class="factory-map">
          <div class="factory-layer" style="top:24px"><div class="fl-name">${tx("云端智能", "Cloud intelligence")}</div><div class="fl-cells"><span>CSGHub</span><span>AgenticHub</span>${tx("模型训推", "Model training")}${tx("远程运维", "Remote operations")}</div></div>
          <div class="factory-link" style="top:106px"></div>
          <div class="factory-layer" style="top:128px"><div class="fl-name">${tx("边缘算力", "Edge computing")}</div><div class="fl-cells"><span>5G / Wi-Fi</span>${tx("边缘推理", "Edge inference")}${tx("数据管理", "Data management")}${tx("实时控制", "Real-time control")}</div></div>
          <div class="factory-link" style="top:210px"></div>
          <div class="factory-layer" style="top:232px"><div class="fl-name">${tx("工业连接", "Industrial connectivity")}</div><div class="fl-cells"><span>DTU</span>${tx("工业网关", "Industrial gateway")}${tx("逻辑控制器", "PLC")}${tx("数控网关", "CNC gateway")}</div></div>
          <div class="factory-link" style="top:314px"></div>
          <div class="factory-layer" style="top:336px"><div class="fl-name">${tx("设备与场景", "Devices & scenarios")}</div><div class="fl-cells">${tx("CNC / Robot", "CNC / Robot")}${tx("AGV / 视觉", "AGV / Vision")}${tx("传感 / DAQ", "Sensors / DAQ")}${tx("OA / 知识库", "OA / Knowledge")}</div></div>
          <div class="factory-link" style="top:418px"></div>
          <div class="factory-layer" style="top:440px"><div class="fl-name">${tx("数据闭环", "Data loop")}</div><div class="fl-cells">${tx("采集", "Collect")}${tx("清洗", "Clean")}${tx("分析", "Analyze")}${tx("反馈进化", "Feedback & evolve")}</div></div>
        </div>
      </div>`, "跨系统、高移动性、低时延、高安全的制造 AgenticOps", "Cross-system, mobile, low-latency and secure manufacturing AgenticOps"),

    slide(27, "产品方案 · 个人 OPC", "Product · Personal OPC",
      "CSGHub-Lite：个人 OPC 向组织型 OPC 升级的本地运行底座",
      "CSGHub-Lite: the local runtime foundation from personal to organizational OPC", `
      <div class="app-stage">
        <div class="app-lite-grid">
          <div class="lite-stack">
            <div class="lite-row"><b>${tx("用户交互", "User interfaces")}</b><div><span>CLI</span><span>GUI</span><span>AI App</span><span>REST API</span></div></div>
            <div class="lite-row"><b>CSGHub-Lite</b><div>${tx("推理引擎", "Inference engine")}${tx("格式转换", "Format conversion")}${tx("AI 应用", "AI applications")}${tx("API 服务", "API services")}</div></div>
            <div class="lite-row"><b>${tx("核心能力", "Core capabilities")}</b><div>${tx("一键启动", "One-click start")}${tx("私有部署", "Private deployment")}${tx("断点续传", "Resume downloads")}${tx("OpenAI 兼容", "OpenAI-compatible")}</div></div>
            <div class="lite-row"><b>${tx("平台支持", "Platform support")}</b><div><span>macOS</span><span>Windows x86</span><span>Linux x86</span><span>Linux ARM</span></div></div>
          </div>
          <div>
            <div class="app-media contain" style="height:250px"><img src="${A}slide-12-image-01.png" alt="CSGHub-Lite 界面"></div>
            <div class="app-card" style="height:154px;margin-top:16px">
              ${tx("开箱即用的本地大模型运行", "Out-of-the-box local model runtime", "h3")}
              ${tx("面向 OPC 独立环境，支持离线运行、本地推理与 REST API。开发者能快速搭建原型，普通用户通过命令行和 Web 界面直接使用。", "Designed for independent OPC environments with offline runtime, local inference and REST APIs. Developers can prototype quickly while non-technical users operate through CLI and web interfaces.", "p")}
            </div>
          </div>
        </div>
        <div class="app-six">
          <div>${tx("访问私有模型", "Private models", "b")}${tx("登录验证后安全下载并运行私有模型，适合内网与隔离环境。", "Securely download and run private models after authentication, suited for intranet and isolated setups.", "span")}</div>
          <div>${tx("REST API 调用", "REST API", "b")}${tx("兼容 Ollama 规范，便于本地集成与脚本化调用。", "Ollama-compatible for local integration and scripted usage.", "span")}</div>
          <div>${tx("一键安装", "One-click install", "b")}${tx("跨平台脚本自动配置运行环境，减少安装和调试成本。", "Cross-platform scripts configure the runtime automatically and reduce setup cost.", "span")}</div>
          <div>${tx("断点续传", "Resume downloads", "b")}${tx("网络中断后继续下载，无需重来，适合大模型文件。", "Continue interrupted downloads without restarting, ideal for large model files.", "span")}</div>
          <div>${tx("可视化界面", "Visual interface", "b")}${tx("仪表盘、模型管理、聊天与任务日志一屏可见。", "Dashboard, model management, chat and task logs in one view.", "span")}</div>
          <div>${tx("国产适配", "Domestic adaptation", "b")}${tx("适配国产模型与 Claude Code、Codex，以及 ARM / x86 混合环境。", "Supports domestic models, Claude Code and Codex, plus ARM/x86 mixed environments.", "span")}</div>
        </div>
      </div>`, "设计理念：能自动就不手动，能本地就不外传", "Design principle: automate by default; keep data local by default"),

    slide(28, "产品方案 · 个人 OPC", "Product · Personal OPC",
      "CSGClaw：OPC 原生的协同多智能体工作系统",
      "CSGClaw: an OPC-native collaborative multi-agent work system", `
      <div class="app-stage app-product-layout">
        <div class="app-product-visual"><img src="${A}slide-13-image-01.png" alt="CSGClaw 多智能体协作架构"></div>
        <div class="app-feature-grid">
          <div class="app-feature">${tx("智能意图拆解", "Intent decomposition", "b")}${tx("Manager 理解最终目标并自动拆解为可执行任务。", "A Manager understands the goal and decomposes it into executable tasks.", "p")}${tx("GOAL · PLAN · TASK", "GOAL · PLAN · TASK", "small")}</div>
          <div class="app-feature">${tx("隔离化专业分工", "Isolated specialization", "b")}${tx("Workers 在独立沙箱中各司其职，避免权限与上下文污染。", "Workers operate in isolated sandboxes to prevent permission and context contamination.", "p")}${tx("WORKER · SANDBOX · PERMISSION", "WORKER · SANDBOX · PERMISSION", "small")}</div>
          <div class="app-feature">${tx("人机协同闭环", "Human-in-the-loop", "b")}${tx("关键决策节点支持人工确认与干预，保障准确性和安全性。", "Human approval at critical decisions ensures accuracy and safety.", "p")}${tx("APPROVAL · AUDIT · ROLLBACK", "APPROVAL · AUDIT · ROLLBACK", "small")}</div>
          <div class="app-feature">${tx("跨平台生态互联", "Cross-platform connectivity", "b")}${tx("可接入飞书等 IM 工具，随时调度智能体集群。", "Integrates with IM tools such as Feishu to orchestrate agent teams anywhere.", "p")}${tx("IM · API · REMOTE CONTROL", "IM · API · REMOTE CONTROL", "small")}</div>
          <div class="app-feature" style="grid-column:1/3;background:var(--mint)">
            ${tx("一个人，就是一支队伍。", "One person can operate as a team.", "b")}
            ${tx("CSGHub-Lite 提供本地算力与模型，CSGClaw 组织多 Agent 协同执行，形成个人 OPC 的生产系统。", "CSGHub-Lite provides local compute and models while CSGClaw organizes multi-agent execution into a personal OPC production system.", "p")}
          </div>
        </div>
      </div>`, "Manager–Worker · Sandbox · Human Approval · IM Integration", "Manager–Worker · Sandbox · Human Approval · IM Integration"),

    slide(29, "产品方案 · 组织型 AgenticOps", "Product · Organizational AgenticOps",
      "CSGHub：组织型 OPC 的 AI 资产全生命周期管理平台",
      "CSGHub: full-lifecycle AI asset management for organizational OPC", `
      <div class="app-stage app-product-layout">
        <div class="app-product-visual"><img src="${A}slide-14-image-04.png" alt="CSGHub AI 大模型社区平台"></div>
        <div>
          ${tx("以“资产管得好、模型迭代快、应用看得见”为核心，统一管理模型、数据集、代码和智能体资产。", "Built around well-governed assets, rapid model iteration and visible applications, CSGHub unifies models, datasets, code and agent assets.", "p", "app-lead")}
          <div class="app-feature-grid" style="margin-top:24px">
            <div class="app-feature">${tx("一站式资产管理", "All-in-one asset management", "b")}${tx("兼具开放生态与私有化治理优势，实现可管、可查、可复用。", "Combines an open ecosystem with private governance for manageable, searchable and reusable assets.", "p")}</div>
            <div class="app-feature">${tx("模型闭环服务", "Closed-loop model services", "b")}${tx("训练、微调、推理、评测和 Notebook 环境形成完整闭环。", "Training, tuning, inference, evaluation and notebook environments form a complete loop.", "p")}</div>
            <div class="app-feature">${tx("智能体应用生态", "Agent application ecosystem", "b")}${tx("快速展示模型能力，构建和验证 AI 应用原型。", "Show model capabilities and build and validate AI application prototypes.", "p")}</div>
            <div class="app-feature">${tx("开放集成与开源信任", "Open integration & trust", "b")}${tx("标准 API 对接企业系统；开放仓库和资产社区建立信任。", "Standard APIs integrate enterprise systems; open repositories and assets build trust.", "p")}</div>
          </div>
          <div class="app-three" style="height:170px;margin-top:16px">
            <div class="app-media contain"><img src="${A}slide-14-image-01.png" alt="CSGHub 资产管理"></div>
            <div class="app-media contain"><img src="${A}slide-14-image-02.png" alt="CSGHub 模型服务"></div>
            <div class="app-media contain"><img src="${A}slide-14-image-03.png" alt="CSGHub 智能体应用"></div>
          </div>
        </div>
      </div>`, "开放集成：标准 API · 开源信任：opencsg.com/models", "Open integration: standard APIs · Open trust: opencsg.com/models"),

    slide(30, "技术资料与试用", "Documentation & Trial Access",
      "技术文档、开源仓库与产品试用入口",
      "Documentation, open-source repositories and product trial access", `
      <div class="app-stage app-docs">
        <div class="app-doc-media">
          <a class="doc-media-card" href="https://opencsg.com/docs" data-href-zh="https://opencsg.com/docs" data-href-en="https://opencsg.com/docs/en/" target="_blank"><div class="app-media contain"><img src="${A}slide-15-image-01.png" alt="CSGHub 文档"></div><b>${tx("产品文档中心", "Product documentation")}</b><span>${tx("安装、部署、管理与 API 指南", "Installation, deployment, administration and API guides")}</span></a>
          <a class="doc-media-card" href="https://opencsg.com/csghub" target="_blank"><div class="app-media contain"><img src="assets/product-csghub.png" alt="CSGHub 产品界面"></div><b>${tx("CSGHub 产品与版本", "CSGHub product and editions")}</b><span>${tx("Lite、Community、Enterprise 功能与服务边界", "Lite, Community and Enterprise feature boundaries")}</span></a>
          <a class="doc-media-card" href="https://github.com/OpenCSGs/csghub" target="_blank"><div class="app-media contain"><img src="assets/repo.png" alt="OpenCSG 开源仓库"></div><b>${tx("开源仓库与版本", "Open-source repository")}</b><span>${tx("代码、Issue、Release 与社区贡献", "Code, issues, releases and community contributions")}</span></a>
        </div>
        <div class="app-doc-links">
          <div>
            ${tx("技术资料下载", "Technical resources", "b")}
            <a href="https://opencsg.com/docs" data-href-zh="https://opencsg.com/docs" data-href-en="https://opencsg.com/docs/en/" target="_blank">${tx("CSGHub 官方文档：安装、管理员手册、功能说明与 API", "CSGHub official docs: install, admin, features and APIs")}</a>
            <a href="https://github.com/OpenCSGs/csghub" target="_blank">${tx("CSGHub 开源仓库：Apache-2.0、代码、Issue 与 Release", "CSGHub repository: Apache-2.0, code, issues and releases")}</a>
            <a href="https://github.com/OpenCSGs/csglite" target="_blank">${tx("CSGHub-Lite 开源仓库：本地模型运行与跨平台客户端", "CSGHub-Lite repository: local model runtime and cross-platform client")}</a>
            <a href="https://opencsg.com/docs/csghub/101/function/csghub-lite/intro" data-href-zh="https://opencsg.com/docs/csghub/101/function/csghub-lite/intro" data-href-en="https://opencsg.com/docs/en/csghub/101/function/csghub-lite/intro" target="_blank">${tx("CSGHub-Lite 使用指南：下载、推理、API 与开发工具", "CSGHub-Lite guide: download, inference, APIs and developer tools")}</a>
          </div>
          <div>
            ${tx("平台试用入口", "Product trials", "b")}
            <a href="https://opencsg.com" target="_blank">${tx("OpenCSG SaaS：在线体验模型、数据集与 Agent 资产", "OpenCSG SaaS: explore models, datasets and agent assets online")}</a>
            <a href="https://opencsg.com/form/license_apply" target="_blank">${tx("企业版试用：申请 License、私有部署与技术咨询", "Enterprise trial: request a license, private deployment and consultation")}</a>
            <a href="https://opencsg.com/csghub#install" target="_blank">${tx("私有化安装：Docker / Kubernetes 部署入口", "Private installation: Docker / Kubernetes deployment")}</a>
            <a href="https://opencsg.com/education" target="_blank">${tx("高校版方案：教学、科研与校内 AI 资产平台", "Education edition: teaching, research and campus AI assets")}</a>
          </div>
        </div>
      </div>`, "所有链接均为独立可点击 HTML 元素", "Every link is an independent clickable HTML element"),

    `<div class="slide-wrap"><section class="slide light appendix-slide appendix-divider city-divider" data-layout="APP-DIVIDER" id="slide-31">
      <div class="app-index">APPENDIX · 03</div>
      <div class="app-big">03</div>
      ${tx("城市级 AI 基础设施", "City-scale AI Infrastructure", "div", "app-name")}
      <div class="app-rule"></div>
      <div class="app-list">
        <div><b>01</b>${tx("建设背景、必要性与收益", "Background, urgency and benefits", "span")}</div>
        <div><b>02–03</b>${tx("建设内容、运营主体与产业载体", "What to build, the operator and physical hub", "span")}</div>
        <div><b>04–05</b>${tx("东方定位、实施路径与运营回报", "Dongfang positioning, delivery and returns", "span")}</div>
        <div><b>06</b>${tx("已有工作、阶段结果与复制验证", "Work completed, stage results and repeatability", "span")}</div>
      </div>
      <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
      <div class="foot"><span>OPENCSG · CITY-SCALE AI</span><span>31</span></div>
    </section></div>`,

    slide(32, "城市级方案 · 建设背景", "City Solution · Background & Rationale",
      "为什么城市现在必须建设自己的 AI 公共基础设施",
      "Why cities must build their own AI public infrastructure now", `
      <div class="app-stage city-why">
        <div class="city-why-problems">
          <div class="app-kicker">THE URGENCY</div>
          ${tx("城市不缺算力、园区、政策和场景，缺的是把这些资源连接成生产系统并持续运营的统一平台。", "Cities already have compute, parks, policies and scenarios. What they lack is a unified platform that turns those resources into a production system and operates it continuously.", "p", "app-lead")}
          <div class="city-blockers">
            <article><span>01</span><b>${tx("资源分散，重复建设", "Fragmented resources and duplicated investment")}</b><p>${tx("算力、数据、模型、工具和项目分布在不同部门与园区，无法复用和统一计量。", "Compute, data, models, tools and projects sit across departments and parks without reuse or unified metering.")}</p></article>
            <article><span>02</span><b>${tx("平台交付后缺少运营", "Platforms stop after delivery")}</b><p>${tx("只有门户和资源目录，没有企业服务、开发者运营、资产沉淀与商业闭环。", "Portals and resource catalogs lack enterprise services, developer operations, asset accumulation and a commercial loop.")}</p></article>
            <article><span>03</span><b>${tx("外部模型难以承担城市责任", "External models cannot carry city-level responsibility")}</b><p>${tx("数据边界、国产适配、多模型替换、审计和公共服务能力必须掌握在本地。", "Data boundaries, domestic adaptation, model replacement, audit and public services must remain under local control.")}</p></article>
            <article><span>04</span><b>${tx("项目投入没有转化为产业", "Project spending does not become an industry")}</b><p>${tx("技术项目、活动和补贴彼此割裂，难形成企业集聚、人才网络与财政回流。", "Technology projects, events and subsidies remain disconnected, failing to create company clusters, talent networks or fiscal returns.")}</p></article>
          </div>
        </div>
        <div class="city-before-after">
          <div class="city-ba-head">
            <div><small>BEFORE</small><b>${tx("传统“算力 + 项目”建设", "Traditional compute + project model")}</b></div>
            <i>→</i>
            <div><small>AFTER</small><b>${tx("城市 AI 公共基础设施", "City AI public infrastructure")}</b></div>
          </div>
          <div class="city-ba-grid">
            <span>${tx("采购算力与设备", "Purchase compute and hardware")}</span><b>${tx("统一调度与计量的城市算力服务", "City compute service with unified scheduling and metering")}</b>
            <span>${tx("建设模型门户", "Build a model portal")}</span><b>${tx("可治理、可评测、可发布的 AI 资产 Hub", "Governed, evaluated and deployable AI asset hub")}</b>
            <span>${tx("交付单点应用", "Deliver isolated applications")}</span><b>${tx("Agent 构建、运行、反馈与持续进化", "Agent build, operation, feedback and continuous evolution")}</b>
            <span>${tx("举办活动与招商", "Run events and attraction campaigns")}</span><b>${tx("开发者、企业、资本和场景的常态运营", "Ongoing operations across developers, enterprises, capital and scenarios")}</b>
          </div>
          <div class="city-context">
            <article><b>${tx("宜昌", "Yichang")}</b><span>${tx("需要把城市载体、算力和开发者转化为长期运营生态", "Turn a physical hub, compute and developers into a durable operating ecosystem")}</span></article>
            <article><b>${tx("东方", "Dongfang")}</b><span>${tx("需要把自贸港区位转化为东南亚数字服务接口", "Turn free-trade-port positioning into a Southeast Asian digital-service gateway")}</span></article>
            <article><b>${tx("龙岗", "Longgang")}</b><span>${tx("需要把国产异构算力转化为企业可直接使用的生产平台", "Turn domestic heterogeneous compute into a production platform enterprises can use directly")}</span></article>
          </div>
        </div>
        <div class="city-benefits">
          <div class="app-kicker">WHO BENEFITS</div>
          <article><small>GOVERNMENT</small><b>${tx("治理与主权收益", "Governance and sovereignty")}</b><p>${tx("掌握城市 AI 资产、数据边界、审计规则和公共服务入口。", "Own city AI assets, data boundaries, audit rules and the public-service entry point.")}</p></article>
          <article><small>ENTERPRISE</small><b>${tx("降本与生产收益", "Lower cost and production value")}</b><p>${tx("共享算力与模型服务，同时保留企业私有化和业务控制权。", "Share compute and model services while retaining private deployment and business control.")}</p></article>
          <article><small>INDUSTRY</small><b>${tx("招商与生态收益", "Industry attraction and ecosystem value")}</b><p>${tx("聚集企业、科研、开发者、人才与资本，形成产业协同网络。", "Cluster enterprises, research, developers, talent and capital into an industry network.")}</p></article>
          <article><small>FISCAL</small><b>${tx("运营与财政回报", "Operating and fiscal returns")}</b><p>${tx("形成算力、订阅、数据、解决方案和生态交易收入，并带动税收与投资。", "Generate compute, subscription, data, solution and ecosystem revenue, while driving tax and investment.")}</p></article>
        </div>
      </div>`, "建设逻辑：从“资源投入”升级为“城市可持续运营的 AI 生产与产业系统”", "Construction thesis: move from resource spending to an operating AI production and industry system"),

    slide(33, "城市级方案 · 建设全景", "City Solution · Construction Blueprint",
      "一座城市真正要建设的，是“治理主体 + 开放底座 + 产业运营”的 AI 公共基础设施",
      "A city must build an AI public infrastructure combining governance, an open foundation and industry operations", `
      <div class="app-stage city-system-overview">
        <div class="city-governance">
          <div class="app-kicker">WHO OWNS & OPERATES</div>
          ${tx("不是采购一个模型或软件，而是建立城市长期掌握的 AI 资产、规则与运营权。", "This is not the purchase of a model or software package; it establishes city-owned AI assets, rules and long-term operating rights.", "p", "app-lead")}
          <div class="city-governance-ring">
            <div class="city-governance-core">${tx("城市 AI 运营主体", "City AI operator", "b")}${tx("资产 · 规则 · 收益", "Assets · rules · revenue", "span")}</div>
            <span class="cg-foundation">${tx("开源基金会", "Open-source foundation")}</span>
            <span class="cg-platform">${tx("开放平台", "Open platform")}</span>
            <span class="cg-incubator">${tx("产业孵化器", "Industry incubator")}</span>
          </div>
          <div class="city-operator-roles">
            <span>${tx("政府：政策与公共资源", "Government: policy and public resources")}</span>
            <span>${tx("运营公司：建设、招商与年度运营", "Operator: delivery, attraction and annual operations")}</span>
            <span>${tx("基金会：开源治理与生态共建", "Foundation: open governance and ecosystem")}</span>
          </div>
        </div>
        <div class="city-stack">
          <div class="city-stack-scenes">
            <span>${tx("具身智能", "Embodied AI")}</span><span>Edge</span><span>${tx("数字空间", "Digital space")}</span><span>IDE</span>
          </div>
          <div class="city-stack-assets">
            <span>${tx("算力", "Compute")}</span><span>${tx("数据", "Data")}</span><span>${tx("大模型", "Models")}</span><span>Agent</span><span>${tx("生态", "Ecosystem")}</span>
          </div>
          <div class="city-stack-hub"><small>OPEN CONTROL PLANE</small><b>CSGHub + AgenticOps</b><p>${tx("统一资产目录、模型服务、Agent 构建、身份权限、评测、审计与运营计量", "Unified asset catalog, model services, agent building, identity, evaluation, audit and operating metering")}</p></div>
          <div class="city-stack-infra"><b>Open AI Infra</b><span>${tx("混合云 · 国产芯片 · 数据空间 · 安全合规", "Hybrid cloud · domestic chips · data space · security")}</span></div>
          <div class="city-stack-hardware"><b>Open AI Hardware</b><span>${tx("城市算力池 · 边缘节点 · 产业设备", "City compute pool · edge nodes · industry devices")}</span></div>
        </div>
        <div class="city-service-rail">
          <article><small>PUBLIC SERVICE</small><b>${tx("城市公共 AI 服务", "City public AI services")}</b><p>${tx("为政务、园区、科研与公共机构提供共享底座。", "A shared foundation for government, parks, research and public institutions.")}</p></article>
          <article><small>ENTERPRISE</small><b>${tx("企业生产与私有化", "Enterprise production & private deployment")}</b><p>${tx("企业在本地边界内调用模型、数据与 Agent。", "Enterprises use models, data and agents inside their own boundary.")}</p></article>
          <article><small>DEVELOPER</small><b>${tx("开发者与创新孵化", "Developers & innovation incubation")}</b><p>${tx("提供资产、工具、算力、沙箱和应用发布入口。", "Assets, tools, compute, sandboxes and application release.")}</p></article>
          <article><small>ECOSYSTEM</small><b>${tx("产业招商与生态交易", "Industry attraction & ecosystem transactions")}</b><p>${tx("把技术平台转化为企业、项目、人才和交易网络。", "Convert the platform into a network of companies, projects, talent and transactions.")}</p></article>
        </div>
      </div>`, "城市级平台的交付物：公共控制层、运营主体、产业服务与长期生态，而不只是软件", "Deliverables: a public control plane, an operator, industry services and a durable ecosystem - not just software"),

    slide(34, "城市级方案 · 产业载体", "City Solution · Industry Hub",
      "城市载体不是一栋办公楼，而是 AI 产业的运营中枢",
      "The physical hub is not an office building; it is the operating center of the city AI industry", `
      <div class="app-stage city-building-plan">
        <div class="building-goals">
          <div class="app-kicker">THREE-YEAR DEVELOPMENT TARGETS</div>
          <div class="building-goal-grid">
            <article><span>01</span><b>${tx("产业空间", "Industry space")}</b><p>${tx("形成模型、Agent 与开发工具企业集聚空间，承载招商与公共服务。", "Create a cluster for model, agent and developer-tool companies, supporting attraction and public services.")}</p></article>
            <article><span>02</span><b>${tx("创新策源", "Innovation engine")}</b><p>${tx("以创新联合体、开源基金会和应用智能体持续形成技术成果。", "Use an innovation consortium, open foundation and applied agents to continuously create technology outcomes.")}</p></article>
            <article><span>03</span><b>${tx("生态构建", "Ecosystem building")}</b><p>${tx("聚集企业、开发者、科研机构、资本与场景方，形成长期协作网络。", "Bring together companies, developers, research, capital and scenario owners into a durable network.")}</p></article>
            <article><span>04</span><b>${tx("平台运营", "Platform operations")}</b><p>${tx("统一运营算力、数据、模型、Agent、活动、人才与产业服务。", "Operate compute, data, models, agents, events, talent and industry services as one system.")}</p></article>
          </div>
          <div class="building-why">
            <b>${tx("物理空间的价值", "Why the physical hub matters")}</b>
            <p>${tx("把线上平台的资产与流量，转化为线下企业入驻、场景验证、人才服务与区域品牌。", "Convert online platform assets and traffic into company residency, scenario validation, talent services and a regional brand.")}</p>
          </div>
        </div>
        <div class="building-visual">
          <svg viewBox="735 185 390 545" preserveAspectRatio="xMidYMid slice" aria-label="宜昌点军 AI 宜居城市项目开放传神开源大厦">
            <image href="assets/city-yichang-blueprint-source.png" x="0" y="0" width="1440" height="810"/>
          </svg>
          <div class="building-caption"><small>YICHANG DIANJUN · OPENCSG OPEN BUILDING</small><b>${tx("开放传神开源大厦", "OpenCSG Open Building")}</b><span>${tx("城市 AI 公共服务与产业运营中心", "City AI public service and industry operations center")}</span></div>
          <div class="floor-label floor-top"><b>${tx("AI 生态专区中心", "AI ecosystem center")}</b><span>${tx("企业服务 · 展示 · 国际连接", "Enterprise service · showcase · global links")}</span></div>
          <div class="floor-label floor-mid"><b>${tx("模型与 Agent 创新中心", "Model & agent innovation center")}</b><span>${tx("研发、评测、孵化与发布", "R&D · evaluation · incubation · release")}</span></div>
          <div class="floor-label floor-low"><b>${tx("孵化与交互中心", "Incubation & interaction center")}</b><span>${tx("开发者、活动与场景验证", "Developers · events · scenario validation")}</span></div>
          <div class="floor-label floor-base"><b>${tx("1-3F 配套商业区", "Floors 1-3: supporting commerce")}</b><span>${tx("人才、会展与企业服务", "Talent · events · enterprise services")}</span></div>
        </div>
        <div class="building-operation">
          <div class="building-one-three">
            <div><small>ONE CONSORTIUM</small><b>${tx("一体创新联合体", "Integrated innovation consortium")}</b><p>${tx("政府、平台公司、科研院校、企业与基金共同定义技术底座和应用场景。", "Government, operator, research, enterprises and funds jointly define the technology foundation and use cases.")}</p></div>
            <div class="three-platforms">
              <article><b>${tx("算力服务平台", "Compute service platform")}</b><span>${tx("调度、计量与资源运营", "Scheduling, metering and resource operations")}</span></article>
              <article><b>${tx("数据语料平台", "Data corpus platform")}</b><span>${tx("数据空间、治理与交易", "Data spaces, governance and transactions")}</span></article>
              <article><b>${tx("算法调用平台", "Model and agent platform")}</b><span>${tx("模型、Agent 与应用服务", "Models, agents and applications")}</span></article>
            </div>
          </div>
          <div class="building-support">
            <article><small>POLICY PACKAGE</small><b>${tx("政策配套", "Policy package")}</b><p>${tx("AI 生态专项政策、招商政策和场景开放机制。", "AI ecosystem policies, investment attraction and scenario-opening mechanisms.")}</p></article>
            <article><small>TALENT · 1+5+1</small><b>${tx("人才服务体系", "Talent service system")}</b><p>${tx("人才集聚、培养平台、创新平台与专项基金协同。", "Talent attraction, training, innovation platforms and dedicated funds.")}</p></article>
            <article><small>COMMUNITY</small><b>${tx("开发者与特色生态", "Developer and sector ecosystems")}</b><p>${tx("黑客松、技术活动、产业社群、会展与城市品牌持续运营。", "Continuous hackathons, technical events, industry communities, exhibitions and city branding.")}</p></article>
          </div>
        </div>
      </div>`, "参考：宜昌点军 AI 宜居城市项目规划；大楼为方案原始视觉", "Reference: Yichang Dianjun AI Livable City plan; building visual from the original proposal"),

    slide(35, "城市级方案 · 东方定位", "City Solution · Dongfang Positioning",
      "东方：从自贸港通道城市，升级为面向东南亚的国家级数字接口",
      "Dongfang: from a free-trade corridor to a national digital gateway for Southeast Asia", `
      <div class="app-stage dongfang-position">
        <div class="dongfang-thesis">
          <div class="app-kicker">HAINAN FREE TRADE PORT × SOUTHEAST ASIA</div>
          ${tx("以最小政府启动投入建设开放 AI 底座，再以产业运营、跨境数字服务和生态交易形成自增长。", "Start with a focused public investment in an open AI foundation, then create self-sustaining growth through industry operations, cross-border digital services and ecosystem transactions.", "p", "app-lead")}
          <div class="dongfang-number"><b>¥54M</b><span>${tx("起步投资锚点", "Illustrative starting investment")}</span><em>${tx("方案测算：第 4 年现金流转正，第 5 年形成财政正循环", "Plan model: cash-flow positive in year 4 and fiscal positive loop in year 5")}</em></div>
          <div class="dongfang-advantages">
            <article><b>${tx("政策与制度试验场", "Policy and institutional sandbox")}</b><p>${tx("利用海南自贸港的数据流通、跨境服务与数字贸易制度空间。", "Use the Hainan Free Trade Port as a testbed for data circulation, cross-border services and digital trade.")}</p></article>
            <article><b>${tx("东南亚区位接口", "Gateway to Southeast Asia")}</b><p>${tx("连接香港、新加坡及东南亚市场，输出算力、模型与数字服务。", "Connect Hong Kong, Singapore and Southeast Asia with compute, model and digital services.")}</p></article>
            <article><b>${tx("开放生态聚集器", "Open ecosystem magnet")}</b><p>${tx("通过 CSGHub 汇聚模型、数据、Agent、开发者和产业伙伴。", "Use CSGHub to attract models, data, agents, developers and industry partners.")}</p></article>
          </div>
        </div>
        <div class="dongfang-network" aria-label="东方连接东南亚数字网络">
          <svg viewBox="0 0 650 620">
            <defs>
              <linearGradient id="dfg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#E7F5F2"/><stop offset="1" stop-color="#C9E9E3"/></linearGradient>
            </defs>
            <path d="M108 317C184 219 276 177 354 205S493 291 558 207" fill="none" stroke="#9EC9C2" stroke-width="2" stroke-dasharray="7 8"/>
            <path d="M108 317C212 346 325 399 535 410" fill="none" stroke="#23877B" stroke-width="3"/>
            <path d="M108 317C253 266 392 304 558 207" fill="none" stroke="#23877B" stroke-width="3"/>
            <circle cx="108" cy="317" r="74" fill="url(#dfg)" stroke="#23877B" stroke-width="3"/>
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
          <div class="dongfang-services">
            <span>${tx("区域算力服务", "Regional compute services")}</span>
            <span>${tx("跨境数据服务", "Cross-border data services")}</span>
            <span>${tx("模型与 Agent 出海", "Models & agents going global")}</span>
            <span>${tx("数字贸易与结算", "Digital trade & settlement")}</span>
          </div>
        </div>
      </div>`, "资料来源：《打造“东方新加坡”的国家级数字枢纽工程》方案测算", "Source: National Digital Hub — Building the “Dongfang Singapore” plan"),

    slide(36, "城市级方案 · 东方实施", "City Solution · Dongfang Delivery",
      "三阶段建设，五类收入引擎：让城市 AI 平台从“建成”走向“自增长”",
      "Three phases and five revenue engines move a city platform from delivery to self-growth", `
      <div class="app-stage dongfang-roadmap">
        <div class="city-phase-row">
          <article><span>01 · 0–12M</span><b>${tx("建设底座", "Build the foundation")}</b><p>${tx("接入算力、数据与国产软硬件；上线 CSGHub、模型服务和安全治理。", "Connect compute, data and domestic stacks; launch CSGHub, model services and security governance.")}</p><em>${tx("交付：城市 AI 公共控制层", "Deliverable: city public AI control plane")}</em></article>
          <i>→</i>
          <article><span>02 · 12–36M</span><b>${tx("运营场景", "Operate scenarios")}</b><p>${tx("面向园区企业、政企客户与开发者提供 Agent 构建、推理、评测和年度运营。", "Provide agent build, inference, evaluation and annual operations for parks, enterprises and developers.")}</p><em>${tx("结果：企业聚集与持续服务收入", "Outcome: enterprise cluster and recurring services")}</em></article>
          <i>→</i>
          <article><span>03 · 36–60M</span><b>${tx("复制网络", "Replicate the network")}</b><p>${tx("向东南亚输出区域节点、跨境数据服务、模型与数字交易能力。", "Export regional nodes, cross-border data services, models and digital transactions to Southeast Asia.")}</p><em>${tx("结果：区域数字接口与财政回流", "Outcome: regional digital gateway and fiscal return")}</em></article>
        </div>
        <div class="revenue-engine-head">
          <div><small>OPERATING MODEL</small><b>${tx("同一底座，五类持续收入", "One foundation, five recurring revenue streams")}</b></div>
          <p>${tx("政府投入只负责启动公共底座；后续由使用量、企业服务与生态交易驱动增长。", "Public investment starts the common foundation; usage, enterprise services and ecosystem transactions drive growth thereafter.")}</p>
        </div>
        <div class="revenue-engines">
          <article><span>01</span><b>${tx("算力服务", "Compute services")}</b><p>${tx("租赁、调度、推理与算力共享", "Leasing, scheduling, inference and sharing")}</p></article>
          <article><span>02</span><b>${tx("平台订阅", "Platform subscription")}</b><p>${tx("企业 License、年度运营与治理", "Enterprise licenses, annual operations and governance")}</p></article>
          <article><span>03</span><b>${tx("数据服务", "Data services")}</b><p>${tx("数据空间、交易、处理与跨境合规", "Data spaces, transactions, processing and cross-border compliance")}</p></article>
          <article><span>04</span><b>${tx("定制开发", "Solution delivery")}</b><p>${tx("行业 Agent、模型适配与场景集成", "Industry agents, model adaptation and scenario integration")}</p></article>
          <article><span>05</span><b>${tx("生态交易", "Ecosystem transactions")}</b><p>${tx("Agent / Skill 市场、活动与伙伴分成", "Agent/Skill marketplace, events and partner revenue share")}</p></article>
        </div>
        <div class="city-fiscal-line"><span>${tx("建设", "BUILD")}</span><i></i><span>${tx("运营", "OPERATE")}</span><i></i><span>${tx("聚集", "CLUSTER")}</span><i></i><span>${tx("交易", "TRANSACT")}</span><i></i><span>${tx("财政正循环", "FISCAL LOOP")}</span></div>
      </div>`, "核心判断：城市平台的价值不只在技术交付，而在持续运营权与区域网络效应", "Core insight: value comes from operating rights and regional network effects, not only technology delivery"),

    slide(37, "城市级方案 · 阶段结果", "City Solution · Stage Results",
      "OpenCSG 已形成三类城市方案与阶段性结果",
      "OpenCSG has developed three city models with tangible stage results", `
      <div class="app-stage city-case-templates">
        <div class="city-template-grid">
          <article class="city-template yichang">
            <div class="template-head"><span>01</span><div><small>YICHANG DIANJUN</small><b>${tx("产业载体型", "Industry hub model")}</b></div></div>
            <div class="template-status">${tx("已验证", "VALIDATED")}<span>${tx("区域 AI 社区、城市载体与运营路径已形成实践", "Regional AI community, physical hub and operating path validated in practice")}</span></div>
            <div class="template-visual">
              <svg viewBox="750 210 350 500" preserveAspectRatio="xMidYMid slice" aria-label="宜昌点军 AI 产业载体"><image href="assets/city-yichang-blueprint-source.png" x="0" y="0" width="1440" height="810"/></svg>
            </div>
            <h3>${tx("以开源大厦承载公共服务、企业集聚和城市品牌", "Use an open building to host public services, enterprise clustering and city branding")}</h3>
            <p>${tx("核心抓手：物理空间 + 三平台 + 创新联合体 + 人才政策服务。", "Core levers: physical hub + three platforms + innovation consortium + talent and policy services.")}</p>
            <div class="template-tags"><span>${tx("产业空间", "Industry space")}</span><span>${tx("招商运营", "Attraction")}</span><span>${tx("城市品牌", "City brand")}</span></div>
          </article>
          <article class="city-template dongfang">
            <div class="template-head"><span>02</span><div><small>HAINAN DONGFANG</small><b>${tx("区域接口型", "Regional gateway model")}</b></div></div>
            <div class="template-status">${tx("方案完成", "PLAN COMPLETED")}<span>${tx("完成国家级数字枢纽定位、建设内容与五年运营测算", "National digital-hub positioning, construction plan and five-year operating model completed")}</span></div>
            <div class="template-network">
              <b>${tx("东方", "Dongfang")}</b><i></i><span>${tx("香港 / 新加坡", "Hong Kong / Singapore")}</span><i></i><strong>${tx("东南亚", "Southeast Asia")}</strong>
            </div>
            <h3>${tx("以自贸港制度与开放 AI 底座，建设跨境数字服务接口", "Use free-trade-port institutions and open AI infrastructure to build a cross-border digital-service gateway")}</h3>
            <p>${tx("核心抓手：区域算力、跨境数据、模型与 Agent 出海、数字贸易与结算。", "Core levers: regional compute, cross-border data, global model and agent services, digital trade and settlement.")}</p>
            <div class="template-tags"><span>${tx("制度创新", "Policy innovation")}</span><span>${tx("跨境服务", "Cross-border services")}</span><span>${tx("财政循环", "Fiscal loop")}</span></div>
          </article>
          <article class="city-template longgang">
            <div class="template-head"><span>03</span><div><small>SHENZHEN LONGGANG</small><b>${tx("技术底座型", "Technology foundation model")}</b></div></div>
            <div class="template-status">${tx("可研完成", "FEASIBILITY COMPLETED")}<span>${tx("完成国产异构算力平台可研与“1+5+2”建设架构", "Feasibility study and 1+5+2 architecture for a domestic heterogeneous-compute platform completed")}</span></div>
            <div class="template-152">
              <span><b>1</b>${tx("基础设施层", "Infrastructure")}</span>
              <span><b>5</b>${tx("公共平台能力", "Platform capabilities")}</span>
              <span><b>2</b>${tx("产业生态区", "Industry zones")}</span>
            </div>
            <h3>${tx("以国产异构算力适配与“1+5+2”架构服务本地企业", "Serve local enterprises through domestic heterogeneous compute and a 1+5+2 architecture")}</h3>
            <p>${tx("核心抓手：算力调度、资产管理、模型服务、Agent 开发、沙箱与产业专区。", "Core levers: compute scheduling, asset management, model services, agent development, sandboxes and industry zones.")}</p>
            <div class="template-tags"><span>${tx("国产适配", "Domestic stack")}</span><span>${tx("企业生产", "Enterprise production")}</span><span>${tx("技术验证", "Technical validation")}</span></div>
          </article>
        </div>
        <div class="city-common-standard">
          <div><small>COMMON FOUNDATION</small><b>${tx("四个可复制标准件", "Four repeatable building blocks")}</b></div>
          <span><b>01</b>${tx("开源 AgenticOps 控制层", "Open AgenticOps control plane")}</span>
          <span><b>02</b>${tx("城市运营主体与治理机制", "City operator and governance")}</span>
          <span><b>03</b>${tx("算力、平台、运营与生态收入", "Compute, platform, operations and ecosystem revenue")}</span>
          <span><b>04</b>${tx("产业场景、人才与开发者网络", "Industry scenarios, talent and developer network")}</span>
        </div>
      </div>`, "可复制的不是一张软件清单，而是“技术底座 + 城市运营 + 产业生态”的完整方法", "What repeats is not a software checklist, but the full method: technology foundation + city operations + industry ecosystem"),

    `<div class="slide-wrap"><section class="slide light appendix-slide app-closing closing-hero" data-layout="APP-CLOSING" id="slide-38">
      <div class="closing-grid">
        <div class="closing-left">
          <div class="label">OPENCSG · AI SOVEREIGNTY</div>
          <h2>${tx("未来的 AI，", "The future of AI", "span")}${tx("必须掌握在自己手中。", "must be yours to control.", "strong")}</h2>
          ${tx("OpenCSG 让国家与区域、企业组织和个人 OPC，都拥有自主、可控、可演进的 AI。", "OpenCSG gives sovereign regions, enterprises and personal OPC autonomous, controllable and continuously evolving AI.", "p", "closing-lead")}
          <div class="closing-pillars">
            ${tx("开源", "OPEN SOURCE", "span")}<i></i>
            ${tx("开放", "OPEN", "span")}<i></i>
            ${tx("自主", "AUTONOMOUS", "span")}<i></i>
            ${tx("可信", "TRUSTED", "span")}
          </div>
          <div class="closing-contact"><span>opencsg.com</span><span>ir@opencsg.com</span></div>
        </div>
        <div class="closing-command">
          <div class="closing-ai-ghost">AI</div>
          <div class="closing-command-tags"><span>MODEL</span><span>DATA</span><span>AGENT</span><span>RUNTIME</span><span>GOVERNANCE</span></div>
          <div class="closing-command-copy">
            <small>OPENCSG / AGENTICOPS</small>
            <b>AI YOU<br>CONTROL.</b>
            <b>AI YOU<br>TRUST.</b>
            <p>OPEN ASSETS IN.<br>SOVEREIGN INTELLIGENCE OUT.</p>
          </div>
          <div class="closing-page">38</div>
        </div>
      </div>
      <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
      <div class="foot"><span>OPEN SOURCE · SOVEREIGN AI · AGENTICOPS</span><span>INVESTOR PRESENTATION · 2026</span></div>
    </section></div>`
  ];

  document.body.insertAdjacentHTML("beforeend", appendixSlides.join(""));

  const enterprise = [
    { step: "Step 1 · AgenticHub", zh: "AI 原生", en: "AI Native", descZh: "理解用户意图，自动化执行任务", descEn: "Automate tasks by user intent" },
    { step: "Step 1 · CSGShip", zh: "CodeSouler", en: "CodeSouler", descZh: "在 IDE 环境中输入提示词", descEn: "Enter prompts in the IDE" },
    { step: "Step 2 · CSGShip", zh: "代码生成与审查", en: "Code Generation & Review", descZh: "调用模型进行代码生成、审阅与测试", descEn: "Generate, review and test code" },
    { step: "Step 3 · CSGShip", zh: "Agent 构建", en: "Agent Builder", descZh: "构建 Agent 与 AI 应用", descEn: "Build agents and AI apps" },
    { step: "Step 4 · CSGShip", zh: "Agent 测试", en: "Agent Testing", descZh: "在虚拟环境中评测 Agent", descEn: "Evaluate agents in a test environment" },
    { step: "Step 5 · CSGShip", zh: "Agent 发布", en: "Agent Deployment", descZh: "将 Agent 发布到生产环境", descEn: "Release agents to production" },
    { step: "Step 6 · CSGHub", zh: "推理实例 / 公共实例", en: "Endpoint / Serverless API", descZh: "部署模型推理实例", descEn: "Deploy model inference instances" },
    { step: "Step 7 · AgenticHub", zh: "智能助手", en: "AI Assistant", descZh: "智能对话与自动化，持续收集反馈", descEn: "Conversational automation with continuous feedback" },
    { step: "Step 7 · CSGHub", zh: "DataFlow", en: "DataFlow", descZh: "一站式数据处理与沉淀", descEn: "All-in-one data processing and accumulation" },
    { step: "Step 8 · CSGHub", zh: "模型微调与评测", en: "Finetune & Evaluation", descZh: "迭代升级 AI 应用与 Agent", descEn: "Iterate and upgrade AI apps and agents" }
  ];
  const opc = [
    { step: "Step 1 · AgenticHub", zh: "组织型 OPC", en: "Organizational OPC", descZh: "理解用户意图，自动执行任务", descEn: "Understand intent and execute tasks automatically" },
    { step: "Step 1 · CSGClaw", zh: "Manager", en: "Manager", descZh: "在 OPC 房间中输入目标", descEn: "Enter goals in the OPC workspace" },
    { step: "Step 2 · CSGClaw", zh: "Agent 生成与管理", en: "Agent Generation & Management", descZh: "按需创建 OPC Agent", descEn: "Create OPC agents on demand" },
    { step: "Step 3 · CSGClaw", zh: "Agent 构建", en: "Agent Development", descZh: "构建 OPC Agent", descEn: "Build OPC agents" },
    { step: "Step 4 · CSGClaw", zh: "Agent 测试", en: "Agent Testing", descZh: "在虚拟环境中测试 OPC Agent", descEn: "Test OPC agents in a virtual environment" },
    { step: "Step 5 · CSGClaw", zh: "Agent 发布", en: "Agent Release", descZh: "将 OPC Agent 发布到生产环境", descEn: "Release OPC agents to production" },
    { step: "Step 6 · CSGHub-Lite", zh: "资产管理", en: "Asset Management", descZh: "部署个人 OPC 推理实例", descEn: "Deploy personal OPC inference instances" },
    { step: "Step 7 · CSGClaw", zh: "智能助手", en: "Intelligent Assistant", descZh: "持续对话、执行和收集数据", descEn: "Converse, execute and collect data continuously" },
    { step: "Step 7 · CSGHub", zh: "组织型 DataFlow", en: "Organizational DataFlow", descZh: "持续沉淀企业数据资产", descEn: "Continuously accumulate enterprise data assets" },
    { step: "Step 8 · CSGHub", zh: "组织型 OPC 模型微调", en: "Organizational OPC Tuning", descZh: "迭代企业团队的 AI 应用和 Agent", descEn: "Improve AI apps and agents for enterprise teams" }
  ];
  const products = [
    { id: "agentichub", name: "AgenticHub", zh: "智能体全生命周期统一管理", en: "Unified full-lifecycle agent management", tags: "TOOLS · WORKFLOW · ASSISTANT", art: "roadMap_card_autohub" },
    { id: "csgship", name: "CSGShip", zh: "智能代码与 Agent 协作平台", en: "Intelligent code and agent collaboration", tags: "CODE · BUILD · TEST · RELEASE", art: "roadMap_card_starship" },
    { id: "csghub", name: "CSGHub", zh: "开源可信的模型与 Agent 资产平台", en: "Open and trusted model and agent asset platform", tags: "ASSET · DEPLOY · DATA · RETRAIN", art: "roadMap_card_csghub" }
  ];
  const segmentToStep = [0, 2, 3, 4, 5, 6, 7, 9];
  const phaseNames = ["PROMPT", "CODE", "BUILD", "TEST", "RELEASE", "DEPLOY", "OPERATE", "RETRAIN"];
  const phaseColors = ["#0E9384", "#107569", "#0E7090", "#088AB2", "#06AED4", "#22CCEE", "#2ED3B7", "#15B79E"];
  const stepArt = (step = "") => step.includes("AgenticHub")
    ? "roadMap_step_card_autohub.png"
    : step.includes("CSGHub")
      ? "roadMap_step_card_csghub.png"
      : "roadMap_step_card_starship.png";

  window.renderRoadmap = (lang = "zh") => {
    const app = document.querySelector(".roadmap-app");
    if (!app) return;
    const mode = app.dataset.mode || "enterprise";
    const items = mode === "opc" ? opc : enterprise;
    let active = Number(app.dataset.active || 0);
    if (active > 9) active = 0;
    const stepToPhase = (index) => Math.max(0, segmentToStep.findIndex((step, phaseIndex) => {
      const next = segmentToStep[phaseIndex + 1] ?? 10;
      return index >= step && index < next;
    }));
    app.querySelector(".official-step-layer").innerHTML = items.map((item, index) => {
      const phase = stepToPhase(index);
      return `<button type="button" class="official-step-card pos-${index}${index === active ? " active" : ""}" data-road-step="${index}" style="--phase:${phaseColors[phase]}">
        <span class="osc-step">${item.step}</span>
        <b>${lang === "en" ? item.en : item.zh}</b>
        <small>${lang === "en" ? item.descEn : item.descZh}</small>
        <img src="assets/roadmap/${stepArt(item.step)}" alt="">
      </button>`;
    }).join("");
    app.querySelector(".official-phase-layer").innerHTML = phaseNames.map((name, phase) =>
      `<button type="button" class="official-phase phase-${phase}${segmentToStep[phase] === active ? " active" : ""}" data-road-phase="${phase}" style="--phase:${phaseColors[phase]}">${name}</button>`
    ).join("");
    app.querySelectorAll(".roadmap-tabs button").forEach(b => b.classList.toggle("active", b.dataset.roadMode === mode));
    const mobileMap = app.querySelector(".official-map-mobile");
    if (mobileMap) mobileMap.src = `assets/roadmap/${mode === "opc" ? "roadMap_opc_mobile_bg.png" : "roadMap_mobile_bg.png"}`;
    const productsLayer = app.querySelector(".roadmap-products");
    if (productsLayer) {
      productsLayer.innerHTML = products.map((product) => `
        <button type="button" class="roadmap-product${app.dataset.product === product.id ? " active" : ""}" data-road-product="${product.id}">
          <b>${product.name}</b>
          <span>${lang === "en" ? product.en : product.zh}</span>
          <small>${product.tags}</small>
          <img class="orp-art" src="assets/roadmap/${product.art}${app.dataset.product === product.id ? "_active" : ""}.png" alt="">
        </button>`).join("");
    }
    app.querySelectorAll("[data-road-step]").forEach(b => b.addEventListener("click", () => {
      app.dataset.active = b.dataset.roadStep;
      delete app.dataset.product;
      window.renderRoadmap(lang);
    }));
    app.querySelectorAll("[data-road-phase]").forEach(b => b.addEventListener("click", () => {
      app.dataset.active = String(segmentToStep[Number(b.dataset.roadPhase)]);
      delete app.dataset.product;
      window.renderRoadmap(lang);
    }));
    app.querySelectorAll("[data-road-product]").forEach(button => button.addEventListener("click", () => {
      app.dataset.product = button.dataset.roadProduct;
      window.renderRoadmap(lang);
    }));
  };

  const roadmap = document.querySelector(".roadmap-app");
  if (roadmap) {
    roadmap.querySelectorAll("[data-road-mode]").forEach(button => button.addEventListener("click", () => {
      roadmap.dataset.mode = button.dataset.roadMode;
      roadmap.dataset.active = "0";
      window.renderRoadmap(document.documentElement.lang === "en" ? "en" : "zh");
    }));
    window.renderRoadmap("zh");
  }
})();
