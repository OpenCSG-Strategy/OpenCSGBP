<div align="center">

# OpenCSG SGVersion / IMDA · International Investor Deck 2026

**Agentic-AI — controlled, auditable agents operating in production.**

> 国际化投资人短版 · 9 张 slide · English-only · 单 HTML 文件

[![Version](https://img.shields.io/badge/Version-SGVersion%2FIMDA-blue?style=flat-square)](#)
[![Slides](https://img.shields.io/badge/Slides-9-teal?style=flat-square)](#)
[![Language](https://img.shields.io/badge/Language-English--only-23877B?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-Internal-lightgrey?style=flat-square)](#)

</div>

---

<div align="center">

### 🌐 语言 / Language

| [🇨🇳 简体中文](./README.md) | [🇺🇸 English](./README_EN.md) |

> GitHub 渲染时,顶部 README 跟着浏览器/账户语言自动出现,两个文件互链。

</div>

---

## ⚡ 30 秒启动

挑一个适合你的方式:

| 你是 | 用这个 | 耗时 |
| --- | --- | --- |
| 开发者 / 想本地改 | [方式 A · 本地 Node 启动](#-方式-a--本地-node-启动) | ~2 min |
| **AI Coding Agent 用户**(Codex / Claude Code / Cursor / Workbuddy / CSGLite) | [方式 B · 丢给 AI 启动](#-方式-b--丢给-ai-coding-agent-启动) | ~30 s |
| 只想看,不想装环境 | [方式 C · Vercel 在线版](#-方式-c--vercel-在线版) | 0 s |

---

## 🅰️ 方式 A · 本地 Node 启动

环境要求:**Node.js ≥ 18**、**npm ≥ 9**、可访问 GitHub。

```bash
# 1. 克隆仓库
git clone https://github.com/OpenCSG-Strategy/OpenCSGBP.git
cd OpenCSGBP

# 2. 安装依赖(Playwright 会自动下载 Chromium)
npm install

# 3. 启动本地预览(默认 127.0.0.1:4173)
npm run serve
```

浏览器打开 **http://127.0.0.1:4173** 即可。

> 端口被占?`PORT=4180 npm run serve` 换一个。
> Playwright 下载慢?`PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright npm install`。

## 🅱️ 方式 B · 丢给 AI Coding Agent 启动

把下面这段**整段粘**到你的 AI Agent(Codex / Claude Code / Cursor Composer / Workbuddy / CSGLite 等)的对话框里,AI 会自动 clone + 安装 + 启动并在浏览器里打开:

```text
请帮我启动这个 OpenCSG 投资人路演项目:

  git clone https://github.com/OpenCSG-Strategy/OpenCSGBP.git
  cd OpenCSGBP
  npm install
  npm run serve

启动后,在浏览器里打开 http://127.0.0.1:4173,
当前 SGVersion/IMDA 版本固定使用 English,不显示语言切换入口。

如果遇到问题,请先阅读仓库根目录的 AGENTS.md 和 docs/CONTRIBUTING-i18n.md,
它们描述了项目意图、启动方式、以及改文案时的内容与资源同步要求。
```

**不同 AI 工具的入口:**

| 工具 | 推荐入口 |
| --- | --- |
| **Codex CLI / Cursor Composer / Continue.dev** | 把上面 prompt 直接粘到 chat;支持长上下文 |
| **Claude Code / Workbuddy / CSGLite** | `@repo` 先 @ 这个 GitHub 仓库 URL,再粘 prompt;支持直接对仓库改写 |
| **OpenCode / Aider / Devin / Gemini CLI** | 直接 `clone` 这个仓库,工具会自动读取 `AGENTS.md` 理解项目 |
| **通用 Web AI**(ChatGPT / Gemini App 等) | 把整段 prompt 粘进对话框;它们不会真的 clone,但会告诉你步骤 |

> 📌 **为什么这样设计**:仓库根目录的 `AGENTS.md` 是 [agents.md 规范](https://agents.md/),Codex / Claude Code / Cursor / Devin / Gemini CLI / OpenCode 等工具都会自动加载它。所以即使你只给 AI 一句"启动这个 repo",它读了 AGENTS.md 也能立刻知道该做什么。

## 🅲️ 方式 C · Vercel 在线版

当前 SGVersion/IMDA 英文短版已部署到 Vercel,直接访问:

> 🌐 **<https://opencsg-sgversion-imda.vercel.app>**

打开即用,不用装 Node。页面固定为英文单语版本。

---

## 📖 项目简介

这是一个 **单 HTML 文件的 OpenCSG 国际化投资人短版**,共 9 页、1600×900 16:9 设计稿,聚焦 Agentic-AI 生产控制、Company Overview、GitHub 开源证明、IMDA SPARK、OpenCore 商业模式、客户伙伴与海外联系方式。

整个 deck 由纯 HTML / CSS / 原生 JS 组成,**不依赖任何前端框架**。配套 Node 脚本负责:

- 起一个本地静态服务(`npm run serve`)
- 把整本 deck 渲染成 PDF(`npm run export:pdf`)
- 把整本 deck 渲染成图片式 PPTX(`npm run export:pptx`)
- 自动从浏览器里抓 README 用的真实截图(`node scripts/capture-readme-screenshots.mjs`)

适合**对内容确定性、排版一致性、跨语种一致要求高**的对外路演场景。

![AgenticOps methodology](./docs/assets/agentic-ops.png)

## ✨ 功能一览

![Platform overview](./docs/assets/platform.png)

| 模块 | 关键能力 |
| --- | --- |
| 📑 **国际化短版** | 9 页,cover / pain points / company / product / OpenCore / customers / closing |
| 🇬🇧 **英文单语** | 页面与导出固定使用 English,不显示语言切换入口 |
| ⌨️ **键盘 & 触控** | ← → 翻页、↑↓ 跳节、Home / End 头尾、Esc 退出全屏、Space / F 全屏 |
| 🧭 **顶栏胶囊** | 页面计数、查看 PDF、PPT 已就绪、回到顶部 |
| 🔍 **缩略图概览** | 顶栏"概览"按钮进入全部页面缩略图网格 |
| 🌐 **RTL 支持** | 阿拉伯语自动整页 RTL 切换 |
| 💧 **水印** | 导出 PDF / PPTX 时可叠加对角线水印 |
| 🖨 **打印样式** | `@media print` 做了分页处理,一键打印成 A4 / 16:9 讲义 |
| 📤 **多格式导出** | PDF(矢量+图片,比例 16:9 / 4:3 / A4 / Letter)、PPTX(全图,适合再编辑) |
| 🔁 **PDF 缓存** | 服务端按 `lang+ratio+sections+watermark` 哈希缓存 PDF,避免重复导出 |
| 🎨 **品牌色锁定** | 顶栏深青绿 `#23877B`、点缀琥珀 `#C88A2B`,整套 PPTX 也内嵌母版 |

更多页面预览:

| 社区荣誉 | 商业飞轮 | 团队 |
| --- | --- | --- |
| ![Community](./docs/assets/community.png) | ![Business model](./docs/assets/business.png) | ![Founders](./docs/assets/team.png) |

## 📁 目录结构

```
OpenCSGBP/
├── index.html                # 入口页面,9 张 SGVersion/IMDA slide 全部写在这里
├── AGENTS.md                 # 给 AI Coding Agent 读的入口(agents.md 规范)
├── CLAUDE.md                 # Claude Code 专用(等同 AGENTS.md)
├── assets/
│   ├── deck-*.css / .js      # 幻灯样式与脚本
│   ├── i18n/                 # 与 main branch 兼容的翻译资源
│   ├── brand-logos/          # 品牌 logo
│   ├── founder-logos/        # 创始人履历 logo
│   ├── cases/                # 案例参考图
│   ├── roadmap/              # 路线图 / OPC 视觉资源
│   ├── appendix/             # 附录页插图
│   └── *.png / *.jpg / *.svg # 通用图片素材
├── scripts/
│   ├── serve-deck.cjs        # 本地静态服务 + 导出 API
│   ├── export-pdf.cjs        # PDF 渲染器
│   ├── export-pptx.cjs       # PPTX(图片式)打包
│   ├── export-pdf-bilingual.cjs / export-pptx-bilingual.cjs
│   ├── capture-readme-screenshots.mjs
│   └── i18n/                 # 翻译体检 / 修复 / 增补脚本
├── docs/
│   ├── CONTRIBUTING-i18n.md  # 改文案必读(铁律 / 工作流 / 品牌白名单)
│   └── assets/               # README 用的真实截图
└── package.json
```

## 🛠 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run serve` | 启动本地静态服务(含 `/api/export` 导出接口),默认 `127.0.0.1:4173` |
| `npm run export:pdf` | 用默认参数导出 PDF(全本 / 中文 / 16:9)到 `.exports/` |
| `npm run export:pdf-bilingual` | 一次性导出中英双语 PDF 包 |
| `npm run export:pptx` | 导出图片式 PPTX |
| `npm run export:pptx-bilingual` | 一次性导出中英双语 PPTX 包 |
| `node scripts/capture-readme-screenshots.mjs` | 从本地 `127.0.0.1:4173` 抓 README 截图到 `docs/assets/` |
| `bash scripts/i18n/run-all.sh audit` | 检查翻译资源覆盖率 |
| `bash scripts/i18n/run-all.sh apply` | 把手工翻译写进 8 国语言包 |

### 导出参数

```bash
# 指定语言 / 比例 / 节
node scripts/export-pdf.cjs --lang=en --ratio=16:9 --sections=cover,main

# 导出指定页码(覆盖 sections)
node scripts/export-pdf.cjs --lang=zh --pages=1,3,5-8

# 范围 + 水印
node scripts/export-pdf.cjs --from=1 --to=10 --watermark="CONFIDENTIAL" --out=draft.pdf
```

当前线上版本固定语言:`en`
支持的比例:`16:9` `4:3` `a4-portrait` `a4-landscape` `letter-landscape`
支持的节:`cover` `main` `case` `product` `appendix`

> 也可以直接调 REST 接口:
> `POST http://127.0.0.1:4173/api/export`,body 是 `{ lang, ratio, format, scope, sections, watermarkEnabled, watermarkText, filename, disposition }`。

## 🌍 语言资源说明

![UI toolbar](./docs/assets/ui-toolbar.png)

- 当前 SGVersion/IMDA 运行版固定使用 English,并隐藏语言切换入口。
- 仓库仍保留 `assets/i18n/*.json` 语言资源,便于与 main branch 的源代码和审计工具保持兼容。
- 修改可见文案时仍建议保留 `data-en` 标注,并运行 i18n audit 检查资源完整性。

> **🚨 修改任何文案前必读**:[`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)
> 这份规范是**硬性要求**:改一个中文字 → 改 `data-en` → 8 国翻译补到 `translation-pack.json` → `apply` → `audit` 100% 才准合并。
> 违反规则的 PR 直接打回,不接受"先合了再补翻译"。

新增 / 修改翻译的工作流:

```bash
# 1. 修改 HTML 中的文案 + data-en
# 2. 同步手工翻译到 scripts/i18n/translation-pack.json
# 3. 一键写回 8 国语言包 + 验证
bash scripts/i18n/run-all.sh apply
bash scripts/i18n/run-all.sh audit
```

详细字典约定见 [`assets/i18n/README.md`](./assets/i18n/README.md);铁律 / 常见错误 / 批量翻译 / 品牌白名单见 [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)。

## 📤 导出 PDF / PPTX

### 浏览器内导出

顶栏右侧的 **"查看 PDF"** 按钮会触发后端 `ensureCachedPdf()`:第一次按 `lang + ratio + sections + watermark` 生成 PDF 并写入 `.exports/pdf-cache/`,后续同组合直接命中缓存。

### 命令行导出

```bash
# 中英双语 PDF
npm run export:pdf-bilingual

# 中英双语 PPTX
npm run export:pptx-bilingual

# 自定义水印
node scripts/export-pptx.cjs --lang=zh --watermark="DRAFT"
```

PPTX 是**全图片式**:每张幻灯由 Playwright 截成 1600×900 PNG,再由 `pptxgenjs` 打包成 PPTX。优点是排版 100% 还原,缺点是不可在 PowerPoint 里直接编辑文字——需要改文案请回到 `index.html`。

## 🎨 设计系统

| Token | 值 | 用途 |
| --- | --- | --- |
| `--teal` | `#23877B` | OpenCSG 主色,logo、按钮、顶栏 |
| `--teal2` | `#0E675F` | 主色加深(hover / 强调) |
| `--mint` | `#EAF4F2` | 浅色背景块 |
| `--amber` | `#C88A2B` | 数字 / 关键指标点缀色 |
| `--ink` | `#111817` | 主文本 |
| `--muted` | `#66716F` | 次要文本 |
| `--paper` | `#FCFDFD` | 纸面背景 |

> 所有色值集中在 `assets/deck-base.css` 顶部的 `:root`,一处改、全局生效。

## ❓ 常见问题

<details>
<summary><b>Q1: 启动后浏览器一片空白?</b></summary>

- 确认 <code>npm install</code> 已成功执行(Playwright 浏览器可能未下载完成)。
- 看终端报错;常见 80% 是 <code>EADDRINUSE</code> → 用 <code>PORT=4180 npm run serve</code> 换个端口。
</details>

<details>
<summary><b>Q2: 切到日语/韩语后出现方块字?</b></summary>

- 浏览器没有对应 CJK 字体。macOS / Windows 都有自带 PingFang / Microsoft YaHei / Noto。
- 导出 PDF 用了 Playwright 捆绑的 Chromium,也会自动使用系统字体;如果导出 PDF 时仍是方块,装一下 Noto Sans CJK。
</details>

<details>
<summary><b>Q3: 导出 PPTX 在 PowerPoint 里字看起来糊?</b></summary>

PPTX 是<strong>全图片式</strong>,每页都是 1600×900 PNG;这是预期行为,目的是为了<strong>跨平台 100% 排版一致</strong>。如果需要在 PPT 里编辑文字,请使用 <code>npm run export:pdf</code> + 第三方"PDF → PPTX"工具。
</details>

<details>
<summary><b>Q4: 修改 <code>index.html</code> 后顶栏 i18n 没刷新?</b></summary>

打开浏览器 console:

```js
localStorage.removeItem('opencsg.deck.lang');
location.reload();
```

或者直接 <code>?lang=zh</code> 强制指定。
</details>

<details>
<summary><b>Q5: 想加新的一页幻灯?</b></summary>

1. 复制现有 <code>&lt;section class="slide-wrap" data-section="main"&gt;…&lt;/section&gt;</code> 改文案。
2. 关键文本加 <code>data-en="English source text"</code>,并把新短语补到 <code>scripts/i18n/translation-pack.json</code>。
3. <code>bash scripts/i18n/run-all.sh apply &amp;&amp; bash scripts/i18n/run-all.sh audit</code>。
4. <code>node scripts/capture-readme-screenshots.mjs</code> 刷新 README 截图。
</details>

<details>
<summary><b>Q6: 让 AI Agent(Codex / Claude / Workbuddy / CSGLite)改东西的推荐姿势?</b></summary>

仓库根目录有 <a href="./AGENTS.md"><code>AGENTS.md</code></a>(<a href="https://agents.md/">agents.md 规范</a>),所有主流 AI Coding Agent 都会自动加载它。
直接给 AI 一句自然语言指令,例如:
<ul>
<li><i>"把 slide 14 的 founder bio 翻译到 8 国语言"</i></li>
<li><i>"封面主标题换成 XXX,同步更新英文源文案与相关资源"</i></li>
<li><i>"导出当前 deck 的中英双语 PDF 到 <code>.exports/</code>"</i></li>
</ul>
AI 会先读 <code>AGENTS.md</code> + <code>docs/CONTRIBUTING-i18n.md</code>,然后按规范操作,不会乱改 8 国翻译。
</details>

## 🛡 维护者

- 项目主页:[github.com/OpenCSG-Strategy/OpenCSGBP](https://github.com/OpenCSG-Strategy/OpenCSGBP)
- SGVersion/IMDA 在线版:[opencsg-sgversion-imda.vercel.app](https://opencsg-sgversion-imda.vercel.app)
- AI Agent 入口:[`AGENTS.md`](./AGENTS.md)
- i18n 规范:[`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)
- i18n 工具:`scripts/i18n/run-all.sh {audit|gen|apply|all}`
- 截图脚本:`scripts/capture-readme-screenshots.mjs`

---

<div align="center">

🇨🇳 [简体中文](./README.md) · 🇺🇸 [English](./README_EN.md)

Made with ☕ for OpenCSG investor relations.

</div>

> 仓库目前仅作内部路演材料分发;如需对外使用请联系 OpenCSG 品牌团队获取授权。
