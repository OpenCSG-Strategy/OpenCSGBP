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
  section.className = "slide light slide03-replica";
  section.dataset.layout = "EVOLUTION-REPLICA";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.svg" alt="OpenCSG">
    <div class="section"><span class="section-zh" data-en="Paradigm Evolution">范式演进</span></div>
    <h2 class="title" data-en="The evolution of the AI era: from DevOps to AgenticOps">大模型时代的进化：从 DevOps 到 AgenticOps</h2>
    <div class="evo3">
      <div class="evo3-top">
        <article class="evo3-board evo3-devops">
          <header>${tx("传统开发范式——DevOps", "Traditional development paradigm — DevOps")}</header>
          <div class="evo3-wordmark gitlab-wordmark">
            <svg viewBox="0 0 40 36" aria-hidden="true"><path d="M20 35 3 22l5-18 7 9h10l7-9 5 18z" fill="#E24329"/><path d="m20 35-5-22h10z" fill="#FC6D26"/><path d="M3 22h34L20 35z" fill="#FCA326"/></svg>
            <b>GitLab</b>
          </div>
          <svg class="evo3-loop evo3-loop-dev" viewBox="0 0 720 265" aria-label="DevOps 双环">
            <defs>
              <marker id="dev-arrow-a" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" refX="15" refY="9" orient="auto"><path d="M0 0 18 9 0 18z" fill="#70C9F6"/></marker>
              <marker id="dev-arrow-b" markerUnits="userSpaceOnUse" markerWidth="18" markerHeight="18" refX="15" refY="9" orient="auto"><path d="M0 0 18 9 0 18z" fill="#089CEB"/></marker>
            </defs>
            <path d="M356 132C297 42 183 35 106 98C43 149 71 226 151 232C230 238 291 185 356 132" fill="none" stroke="#70C9F6" stroke-width="39" marker-end="url(#dev-arrow-a)"/>
            <path d="M356 132C415 42 529 35 606 98C669 149 641 226 561 232C482 238 421 185 356 132" fill="none" stroke="#079DEB" stroke-width="39" marker-end="url(#dev-arrow-b)"/>
            <path d="M297 83 356 132 414 83" fill="none" stroke="#fff" stroke-width="7"/>
            <path d="M297 181 356 132 414 181" fill="none" stroke="#fff" stroke-width="7"/>
            <g fill="#fff" font-family="Arial, sans-serif" font-weight="800" text-anchor="middle">
              <text x="210" y="147" font-size="42">Dev</text><text x="512" y="147" font-size="42">Ops</text>
              <text x="184" y="73" font-size="16">CODE</text><text x="293" y="83" font-size="15">PLAN</text>
              <text x="115" y="161" font-size="15" transform="rotate(-73 115 161)">BUILD</text><text x="250" y="220" font-size="15">TEST</text>
              <text x="415" y="84" font-size="15">RELEASE</text><text x="532" y="73" font-size="15">DEPLOY</text>
              <text x="613" y="161" font-size="15" transform="rotate(72 613 161)">OPERATE</text><text x="471" y="220" font-size="15">MONITOR</text>
            </g>
          </svg>
        </article>
        <div class="evo3-transition">
          <span data-en="Software delivery">软件交付</span>
          <svg viewBox="0 0 150 100" aria-hidden="true"><path d="M0 28h78V0l72 50-72 50V72H0z" fill="#67DDC9"/></svg>
          <b>AI NATIVE</b>
          <small data-en="Assets · Agents · Operations">资产 · Agent · 运营</small>
        </div>
        <article class="evo3-board evo3-agentic">
          <header>${tx("大模型时代开发范式——AgenticOps", "AI-native development paradigm — AgenticOps")}</header>
          <div class="evo3-wordmark opencsg-wordmark"><img src="assets/logo-opencsg.svg" alt="OpenCSG"><b>OpenCSG</b></div>
          <div class="evo3-agentic-stage">
            <img class="evo3-roadmap-bg" src="assets/roadmap/new_roadMap_bg.png" alt="AgenticOps 八阶段生命周期">
            <div class="evo3-step s1"><small>STEP 1 · AgenticHub</small><b>${tx("AI 原生", "AI Native")}</b></div>
            <div class="evo3-step s1b"><small>STEP 1 · CSGShip</small><b>CodeSouler</b></div>
            <div class="evo3-step s2"><small>STEP 2 · CSGShip</small><b>${tx("代码生成与审查", "Code generation & review")}</b></div>
            <div class="evo3-step s3"><small>STEP 3 · CSGShip</small><b>${tx("Agent 构建", "Agent build")}</b></div>
            <div class="evo3-step s4"><small>STEP 4 · CSGShip</small><b>${tx("Agent 测试", "Agent test")}</b></div>
            <div class="evo3-step s5"><small>STEP 5 · CSGShip</small><b>${tx("Agent 发布", "Agent release")}</b></div>
            <div class="evo3-step s6"><small>STEP 6 · CSGHub</small><b>${tx("推理实例 / 公共实例", "Inference / public instances")}</b></div>
            <div class="evo3-step s7"><small>STEP 7 · AgenticHub</small><b>${tx("智能助手", "Assistant")}</b></div>
            <div class="evo3-step s7b"><small>STEP 7 · CSGHub</small><b>DataFlow</b></div>
            <div class="evo3-step s8"><small>STEP 8 · CSGHub</small><b>${tx("模型微调与评测", "Tune & evaluate")}</b></div>
          </div>
        </article>
      </div>
      <div class="evo3-history">
        <div class="evo3-history-line"></div>
        <article class="evo3-event e2008">
          <div class="event-logo gh-logo"><span>GH</span><b>GitHub</b></div>
          <div class="event-card white"><b>${tx("GitHub 成立", "GitHub founded")}</b></div>
          <time>2008</time>
        </article>
        <article class="evo3-event e2012">
          <div class="event-logo combo-logo"><b>GitHub</b><i>×</i><strong>GitLab</strong><i>×</i><em>Alibaba</em></div>
          <div class="event-card dark">
            <b>${tx("GitHub 成为最大开源代码托管平台", "GitHub becomes the largest open code platform")}</b>
            <p>${tx("200 万用户 · 300 万代码库", "2M users · 3M repositories")}</p>
            <p>${tx("获 A16Z 等机构 1 亿美元融资", "$100M funding led by a16z and others")}</p>
          </div>
          <time>2012</time>
        </article>
        <article class="evo3-event e2016">
          <div class="event-card dark">
            <b>${tx("GitLab 获大量企业客户，线下部署成为趋势", "GitLab wins enterprise customers; self-hosting becomes mainstream")}</b>
            <p>${tx("高质量 DevOps + 私有化部署，满足数据安全与企业控制需求", "Production DevOps plus private deployment meets security and control requirements")}</p>
          </div>
          <time>2016</time>
        </article>
        <article class="evo3-event e2018">
          <div class="event-logo hf-logo"><span>HF</span><b>Hugging Face</b></div>
          <div class="event-card pale">
            <b>${tx("Hugging Face 转型为开源 AI 社区", "Hugging Face becomes an open AI community")}</b>
            <p>${tx("从 Chatbot 工具转向模型与开发者资产平台", "From chatbot tooling to a model and developer-asset platform")}</p>
            <p>${tx("微软以 75 亿美元收购 GitHub", "Microsoft acquires GitHub for $7.5B")}</p>
          </div>
          <time>2018</time>
        </article>
        <article class="evo3-event e2021">
          <div class="event-card pale">
            <b>${tx("GitLab 上市，市值约 148 亿美元", "GitLab lists at about $14.8B market value")}</b>
            <p>${tx("超 3000 万用户 · 超 100 万付费用户", "30M+ users · 1M+ paying users")}</p>
            <p>${tx("营收同比增长 69%", "Revenue grows 69% year over year")}</p>
          </div>
          <time>2021</time>
        </article>
        <article class="evo3-event e2023">
          <div class="event-card pale">
            <b>${tx("Hugging Face 成为 AI 模型分发和部署的重要平台", "Hugging Face becomes major AI distribution infrastructure")}</b>
            <p>${tx("超 100 万资源库 · 超 1 万家客户", "1M+ repositories · 10K+ customers")}</p>
            <p>${tx("融资 2.35 亿美元，估值 45 亿美元", "$235M funding at a $4.5B valuation")}</p>
          </div>
          <time>2023</time>
        </article>
        <article class="evo3-event e2024">
          <div class="event-logo opencsg-event"><img src="assets/logo-opencsg.svg" alt="OpenCSG"><b>OpenCSG</b></div>
          <div class="event-2024-grid">
            <div class="event-card dark"><b>${tx("推出一体化 AgenticOps 平台", "Launches an integrated AgenticOps platform")}</b><p>AgenticHub · CSGHub<br>CSGHub-Lite · CSGClaw</p></div>
            <div class="event-card pale"><b>${tx("300 万+社区用户", "3M+ community users")}</b><p>${tx("20 万+模型资产", "200K+ model assets")}</p></div>
            <div class="event-card pale"><b>${tx("城市与产业节点持续扩展", "City and industry nodes continue expanding")}</b><p>${tx("宜昌 · 香港 · 重庆等", "Yichang · Hong Kong · Chongqing and more")}</p></div>
          </div>
          <time>2024</time>
        </article>
      </div>
    </div>
    <div class="foot"><span data-en="DevOps industrialized software delivery; AgenticOps industrializes intelligent-system production and evolution">DevOps 让软件交付工业化，AgenticOps 让智能系统生产与进化工业化</span><span>03</span></div>`;
})();
