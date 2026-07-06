/* Slide 03 · Community Data Dashboard — real platform metrics, SVG charts, live reference. */
(() => {
  const esc = (s = "") => s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const section = document.getElementById("slide-03");
  if (!section) return;

  /* ── KPI data (company-level stats, consistent with slide-05) ── */
  const kpis = [
    { n: "300万+", en: "3M+", label: "社区用户", enLabel: "Community Users", icon: "users" },
    { n: "20万+", en: "200K+", label: "模型资产", enLabel: "Model Assets", icon: "model" },
    { n: "5,600+", en: "5,600+", label: "GitHub Stars", enLabel: "GitHub Stars", icon: "star" },
    { n: "34", en: "34", label: "开源仓库", enLabel: "Open-source Repos", icon: "repo" },
    { n: "30+", en: "30+", label: "国家与地区", enLabel: "Countries & Regions", icon: "globe" }
  ];

  /* ── Top models by downloads (opencsg.com hot models, Jul 2026) ── */
  const topModels = [
    { name: "MiniMax-M2.5", dl: 9984 },
    { name: "DeepSeek-OCR", dl: 2141 },
    { name: "DeepSeek-V3.2", dl: 1187 },
    { name: "Qwen3.5-2B", dl: 242 },
    { name: "HunyuanOCR", dl: 215 }
  ];

  /* ── Top datasets by downloads (opencsg.com hot datasets, Jul 2026) ── */
  const topDatasets = [
    { name: "Fineweb-Edu-Chinese-V2.1", dl: 15242 },
    { name: "chinese-fineweb-edu", dl: 14013 },
    { name: "smoltalk_chinese", dl: 1866 },
    { name: "chinese-cosmopedia", dl: 1277 },
    { name: "chinese-fineweb-edu-v2", dl: 1104 }
  ];

  /* ── GitHub repos by stars (OpenCSGs org, Jul 2026) ── */
  const topRepos = [
    { name: "csghub", stars: 4179, forks: 521 },
    { name: "csghub-server", stars: 1071, forks: 232 },
    { name: "llm-inference", stars: 95, forks: 17 },
    { name: "csglite", stars: 31, forks: 6 },
    { name: "coagent", stars: 29, forks: 5 }
  ];

  /* ── SVG bar chart generator ── */
  function barChart(data, opts = {}) {
    const { key = "dl", color = "#23877B", w = 420, h = 180 } = opts;
    const max = Math.max(...data.map(d => d[key]));
    const barH = 22;
    const gap = 8;
    const labelW = 150;
    const valW = 55;
    const chartW = w - labelW - valW - 20;
    const totalH = data.length * (barH + gap) + 10;
    let bars = "";
    data.forEach((d, i) => {
      const y = i * (barH + gap) + 8;
      const bw = Math.max(2, (d[key] / max) * chartW);
      const val = d[key] >= 1000 ? (d[key] / 1000).toFixed(1) + "K" : d[key];
      bars += `
        <text x="${labelW - 8}" y="${y + barH / 2 + 4}" font-size="10" fill="#3A4A47" text-anchor="end" font-family="Arial,sans-serif">${esc(d.name)}</text>
        <rect x="${labelW}" y="${y}" width="${bw}" height="${barH}" rx="3" fill="${color}" opacity="${0.7 + i * 0.06}"/>
        <text x="${labelW + bw + 6}" y="${y + barH / 2 + 4}" font-size="10" fill="#1C3430" font-weight="700" font-family="Arial,sans-serif">${val}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${totalH}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="overflow:visible">${bars}</svg>`;
  }

  /* ── KPI icon SVGs ── */
  const icons = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    model: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    repo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v6"/><path d="M6 3h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/></svg>'
  };

  /* ── Platform asset types (actual CSGHub platform features) ── */
  const assetTypes = [
    { n: "Models", zh: "模型", en: "Models" },
    { n: "Datasets", zh: "数据集", en: "Datasets" },
    { n: "Spaces", zh: "应用空间", en: "Spaces" },
    { n: "Codes", zh: "代码", en: "Codes" },
    { n: "Skills", zh: "技能", en: "Skills" },
    { n: "Prompts", zh: "提示词", en: "Prompts" },
    { n: "MCP Servers", zh: "MCP 服务", en: "MCP Servers" },
    { n: "Collections", zh: "合集", en: "Collections" }
  ];

  /* ── Platform live link card ── */
  const platformCard = `
    <div class="dash-platform">
      <div class="dash-platform-head">
        <img src="assets/logo-opencsg.png" alt="OpenCSG">
        <div>
          <b data-en="OpenCSG Community Platform">OpenCSG 社区平台</b>
          <span data-en="Hybrid HuggingFace+ · AgenticOps Platform">Hybrid HuggingFace+ · AgenticOps 平台</span>
        </div>
      </div>
      <div class="dash-platform-assets">
        ${assetTypes.map(a => `
          <div class="dash-asset-type">
            <i></i>
            <span data-en="${esc(a.en)}">${a.zh}</span>
          </div>`).join("")}
      </div>
      <a class="dash-platform-link" href="https://opencsg.com" target="_blank" rel="noopener">
        <span data-en="opencsg.com">opencsg.com</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>`;

  /* ── Build the slide ── */
  section.className = "slide light slide03-dashboard";
  section.dataset.layout = "COMMUNITY-DASHBOARD";
  section.innerHTML = `
    <img class="brand" src="assets/logo-opencsg.png" alt="OpenCSG">
    <div class="topline"></div>
    <div class="section"><span class="section-zh" data-en="Community Data　">社区数据全景　</span><span class="section-en">Community Data Dashboard</span></div>
    <h2 class="title" data-en="Real platform metrics: 3M+ users, 200K+ assets, 5,600+ GitHub stars across 30+ countries">真实社区数据：300万+用户、20万+资产、5,600+ GitHub Stars，覆盖30+国家与地区</h2>

    <div class="dash-body">
      <!-- KPI Row -->
      <div class="dash-kpi-row">
        ${kpis.map(k => `
          <div class="dash-kpi">
            <div class="dash-kpi-icon">${icons[k.icon]}</div>
            <div class="dash-kpi-val" data-en="${esc(k.en)}">${k.n}</div>
            <div class="dash-kpi-label" data-en="${esc(k.enLabel)}">${k.label}</div>
          </div>`).join("")}
      </div>

      <!-- Charts Row -->
      <div class="dash-charts">
        <div class="dash-chart-panel">
          <div class="dash-chart-head">
            <small data-en="TOP MODELS BY DOWNLOADS">热门模型下载量</small>
            <span data-en="opencsg.com · Jul 2026">opencsg.com · 2026.07</span>
          </div>
          <div class="dash-chart-body">${barChart(topModels, { key: "dl", color: "#23877B" })}</div>
        </div>
        <div class="dash-chart-panel">
          <div class="dash-chart-head">
            <small data-en="TOP DATASETS BY DOWNLOADS">热门数据集下载量</small>
            <span data-en="opencsg.com · Jul 2026">opencsg.com · 2026.07</span>
          </div>
          <div class="dash-chart-body">${barChart(topDatasets, { key: "dl", color: "#0E675F" })}</div>
        </div>
        <div class="dash-chart-panel">
          <div class="dash-chart-head">
            <small data-en="GITHUB STARS BY REPO">GitHub 仓库 Stars</small>
            <span data-en="github.com/OpenCSGs · Jul 2026">github.com/OpenCSGs · 2026.07</span>
          </div>
          <div class="dash-chart-body">${barChart(topRepos, { key: "stars", color: "#C88A2B" })}</div>
        </div>
      </div>

      <!-- Platform + Insight Row -->
      <div class="dash-bottom">
        ${platformCard}
        <div class="dash-insight">
          <small data-en="COMMUNITY AS STRATEGIC MOAT">社区即战略护城河</small>
          <b data-en="Open assets attract developers; the platform converts them into enterprise production systems">开放资产吸引开发者，平台将其转化为企业生产系统</b>
          <div class="dash-insight-tags">
            <span data-en="Open-source flywheel">开源飞轮</span>
            <span data-en="Asset → Production">资产 → 生产</span>
            <span data-en="Developer → Enterprise">开发者 → 企业</span>
            <span data-en="Community → Revenue">社区 → 收入</span>
          </div>
        </div>
      </div>
    </div>
    <div class="foot"><span data-en="Data: OpenCSG platform and GitHub, Jul 2026; community is the entry point, not the destination">数据来源：OpenCSG 平台与 GitHub 实时统计（2026.07）；社区是入口，不是终点</span><span>03</span></div>`;
})();
