<div align="center">

# OpenCSG Investor Deck 2026
> 全球开源 · AgenticOps · AI 主权 · 投资人路演材料
> Global Open Source · AgenticOps · AI Sovereignty · Investor Materials

![OpenCSG Investor Deck](./docs/assets/cover.png)

![Version](https://img.shields.io/badge/Version-2026.07.1-blue?style=flat-square)
![Pages](https://img.shields.io/badge/Slides-40-teal?style=flat-square)
![Languages](https://img.shields.io/badge/i18n-10%20languages-23877B?style=flat-square)
![License](https://img.shields.io/badge/License-Internal-lightgrey?style=flat-square)

[项目简介](#-项目简介) · [快速开始](#-快速开始) · [功能一览](#-功能一览) · [目录结构](#-目录结构) · [常用脚本](#-常用脚本) · [多语言](#-多语言) · [导出 PDF / PPTX](#-导出-pdf--pptx) · [常见问题](#-常见问题)

__简体中文__ | [English](./README_EN.md)

</div>

> **最新更新 (2026-07)**:
> - **封面文案** — 主标题改为"让大模型赋能每一个人",底部标签改为"核心开源 · 混合方案 · Agentic驱动 · 主权AI"(per IR 参考)
> - **附录页修复** — slide 25 能力对比卡高度统一;slide 26 场景卡描述与底部对齐
> - **10 国语言** — 封面 4 个新 tag 全部翻译到位(ja/ko/ar/ru/fr/de/es/pt 不再回退到英文)

---

## 项目简介

这是一个 **单 HTML 文件的 OpenCSG 投资人路演材料**，共 40 页、1600×900 16:9 设计稿，支持在线演示、导出 PDF / PPTX（图片式）、多语言切换、键盘翻页、缩略图概览、嵌入式二维码等。

整个 deck 由纯 HTML / CSS / 原生 JS 组成，不依赖任何前端框架。配套 Node 脚本负责：

- 起一个本地静态服务（`npm run serve`）
- 把整本 deck 渲染成 PDF（`npm run export:pdf`）
- 把整本 deck 渲染成图片式 PPTX（`npm run export:pptx`）
- 自动从浏览器里抓 README 用的真实截图（`node scripts/capture-readme-screenshots.mjs`）

适合**对内容确定性、排版一致性、跨语种一致要求高**的对外路演场景。

![AgenticOps methodology](./docs/assets/agentic-ops.png)

## 快速开始

### 环境要求

| 工具 | 版本 | 用途 |
| --- | --- | --- |
| Node.js | ≥ 18 | 运行脚本 |
| npm | ≥ 9 | 安装依赖 |
| Google Chrome / Chromium | latest | 导出 PDF / PPTX 时的渲染引擎 |
| Playwright | 1.61+ | 脚本里已带 |

### 三步上手

```bash
# 1. 克隆 & 安装
git clone git@github.com:OpenCSG-Strategy/OpenCSGBP.git
cd OpenCSGBP
npm install

# 2. 启动本地预览（默认 127.0.0.1:4173）
npm run serve
# 浏览器打开 http://127.0.0.1:4173
```

> 如果端口被占用：`PORT=4174 npm run serve`

## 功能一览

![Platform overview](./docs/assets/platform.png)

| 模块 | 关键能力 |
| --- | --- |
| 📑 **多页幻灯** | 40 页，cover / main / case / product / appendix 五大分节，每节可独立导出 |
| 🌍 **10 国语言** | 中文 / 英文 / 日文 / 韩文 / 阿拉伯（RTL）/ 俄文 / 法文 / 德文 / 西班牙文 / 葡萄牙文 |
| ⌨️ **键盘 & 触控** | ← → 翻页、↑↓ 跳节、Home / End 头尾、Esc 退出全屏、Space / F 全屏 |
| 🧭 **顶栏胶囊** | 语言切换、页面计数、查看 PDF、PPT 已就绪、回到顶部 |
| 🔍 **缩略图概览** | 顶栏"概览"按钮进入全部页面缩略图网格 |
| 🌐 **RTL 支持** | 阿拉伯语自动整页 RTL 切换 |
| 💧 **水印** | 导出 PDF / PPTX 时可叠加对角线水印 |
| 🖨 **打印样式** | `@media print` 做了分页处理，一键打印成 A4 / 16:9 讲义 |
| 📤 **多格式导出** | PDF（矢量+图片，比例 16:9 / 4:3 / A4 / Letter）、PPTX（全图，适合再编辑） |
| 🔁 **PDF 缓存** | 服务端按 `lang+ratio+sections+watermark` 哈希缓存 PDF，避免重复导出 |
| 🎨 **品牌色锁定** | 顶栏深青绿 `#23877B`、点缀琥珀 `#C88A2B`，整套 PPTX 也内嵌母版 |

更多页面预览：

| 社区荣誉 | 商业飞轮 | 团队 |
| --- | --- | --- |
| ![Community](./docs/assets/community.png) | ![Business model](./docs/assets/business.png) | ![Founders](./docs/assets/team.png) |

## 目录结构

```
OpenCSGBP/
├── index.html                # 入口页面，40 张 slide 全部写在这里
├── assets/
│   ├── deck-*.css / .js      # 幻灯样式与脚本
│   ├── i18n/                 # 10 国翻译包
│   ├── brand-logos/          # 品牌 logo
│   ├── case-logos/           # 案例 logo
│   ├── customer-logos/       # 客户 logo
│   ├── founder-logos/        # 创始人履历 logo
│   ├── roadmap/              # 路线图 / OPC 视觉资源
│   ├── appendix/             # 附录页插图
│   ├── cases/                # 案例参考图
│   └── *.png / *.jpg / *.svg # 通用图片素材
├── scripts/
│   ├── serve-deck.cjs        # 本地静态服务 + 导出 API
│   ├── export-pdf.cjs        # PDF 渲染器
│   ├── export-pptx.cjs       # PPTX（图片式）打包
│   ├── export-pdf-bilingual.cjs / export-pptx-bilingual.cjs
│   ├── capture-readme-screenshots.mjs
│   └── i18n/                 # 翻译体检 / 修复 / 增补脚本
├── docs/
│   └── assets/               # README 用的真实截图
└── package.json
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run serve` | 启动本地静态服务（含 `/api/export` 导出接口），默认 `127.0.0.1:4173` |
| `npm run export:pdf` | 用默认参数导出 PDF（全本 / 中文 / 16:9）到 `.exports/` |
| `npm run export:pdf-bilingual` | 一次性导出中英双语 PDF 包 |
| `npm run export:pptx` | 导出图片式 PPTX |
| `npm run export:pptx-bilingual` | 一次性导出中英双语 PPTX 包 |
| `node scripts/capture-readme-screenshots.mjs` | 从本地 `127.0.0.1:4173` 抓 README 截图到 `docs/assets/` |

### 导出参数

```bash
# 指定语言 / 比例 / 节
node scripts/export-pdf.cjs --lang=en --ratio=16:9 --sections=cover,main

# 导出指定页码（覆盖 sections）
node scripts/export-pdf.cjs --lang=zh --pages=1,3,5-8

# 范围 + 水印
node scripts/export-pdf.cjs --from=1 --to=10 --watermark="CONFIDENTIAL" --out=draft.pdf
```

支持的语言：`zh` `en` `ja` `ko` `ar` `ru` `fr` `de` `es` `pt`
支持的比例：`16:9` `4:3` `a4-portrait` `a4-landscape` `letter-landscape`
支持的节：`cover` `main` `case` `product` `appendix`

> 也可以直接调 REST 接口：
> `POST http://127.0.0.1:4173/api/export`，body 是 `{ lang, ratio, format, scope, sections, watermarkEnabled, watermarkText, filename, disposition }`。

## 多语言

![UI toolbar](./docs/assets/ui-toolbar.png)

- 10 国语言包位于 `assets/i18n/*.json`，`zh.json` 是 source of truth。
- HTML 元素用 `data-en` / `data-i18n` 标注源文，i18n 框架自动按当前语言替换。
- 缺翻译时回退到英文，不会出现空白。

> **🚨 修改任何文案前必读**：[`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)
> 这份规范是**硬性要求**:改一个中文字 → 改 `data-en` → 8 国翻译补到 `translation-pack.json` → `apply` → `audit` 100% 才准合并。
> 违反规则的 PR 直接打回,不接受"先合了再补翻译"。

新增 / 修改翻译的工作流：

```bash
# 1. 修改 HTML 中的文案 + data-en
# 2. 同步手工翻译到 scripts/i18n/translation-pack.json
# 3. 一键写回 8 国语言包 + 验证
bash scripts/i18n/run-all.sh apply
bash scripts/i18n/run-all.sh audit
```

详细字典约定见 [`assets/i18n/README.md`](./assets/i18n/README.md)；铁律 / 常见错误 / 批量翻译 / 品牌白名单见 [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)。

## 导出 PDF / PPTX

### 浏览器内导出

顶栏右侧的 **"查看 PDF"** 按钮会触发后端 `ensureCachedPdf()`：第一次按 `lang + ratio + sections + watermark` 生成 PDF 并写入 `.exports/pdf-cache/`，后续同组合直接命中缓存。

### 命令行导出

```bash
# 中英双语 PDF
npm run export:pdf-bilingual

# 中英双语 PPTX
npm run export:pptx-bilingual

# 自定义水印
node scripts/export-pptx.cjs --lang=zh --watermark="DRAFT"
```

PPTX 是**全图片式**：每张幻灯由 Playwright 截成 1600×900 PNG，再由 `pptxgenjs` 打包成 PPTX。优点是排版 100% 还原，缺点是不可在 PowerPoint 里直接编辑文字——需要改文案请回到 `index.html`。

## 设计系统

| Token | 值 | 用途 |
| --- | --- | --- |
| `--teal` | `#23877B` | OpenCSG 主色，logo、按钮、顶栏 |
| `--teal2` | `#0E675F` | 主色加深（hover / 强调） |
| `--mint` | `#EAF4F2` | 浅色背景块 |
| `--amber` | `#C88A2B` | 数字 / 关键指标点缀色 |
| `--ink` | `#111817` | 主文本 |
| `--muted` | `#66716F` | 次要文本 |
| `--paper` | `#FCFDFD` | 纸面背景 |

> 所有色值集中在 `assets/deck-base.css` 顶部的 `:root`，一处改、全局生效。

## 常见问题

<details>
<summary><b>Q1: 启动后浏览器一片空白？</b></summary>

- 确认 `npm install` 已成功执行（Playwright 浏览器可能未下载完成）。
- 看终端报错；常见 80% 是 `EADDRINUSE` → 用 `PORT=4180 npm run serve` 换个端口。
</details>

<details>
<summary><b>Q2: 切到日语/韩语后出现方块字？</b></summary>

- 浏览器没有对应 CJK 字体。macOS / Windows 都有自带 PingFang / Microsoft YaHei / Noto。
- 导出 PDF 用了 Playwright 捆绑的 Chromium，也会自动使用系统字体；如果导出 PDF 时仍是方块，装一下 Noto Sans CJK。
</details>

<details>
<summary><b>Q3: 导出 PPTX 在 PowerPoint 里字看起来糊？</b></summary>

PPTX 是**全图片式**，每页都是 1600×900 PNG；这是预期行为，目的是为了**跨平台 100% 排版一致**。如果需要在 PPT 里编辑文字，请使用 `npm run export:pdf` + 第三方"PDF → PPTX"工具。
</details>

<details>
<summary><b>Q4: 修改 `index.html` 后顶栏 i18n 没刷新？</b></summary>

打开浏览器 console：

```js
localStorage.removeItem('opencsg.deck.lang');
location.reload();
```

或者直接 `?lang=zh` 强制指定。
</details>

<details>
<summary><b>Q5: 想加新的一页幻灯？</b></summary>

1. 复制现有 `<section class="slide-wrap" data-section="main">…</section>` 改文案。
2. 关键文本加 `data-en="English source text"`，并把新短语补到 `scripts/i18n/translation-pack.json`。
3. `bash scripts/i18n/run-all.sh apply && bash scripts/i18n/run-all.sh audit`。
4. `node scripts/capture-readme-screenshots.mjs` 刷新 README 截图。
</details>

## 维护者

- 项目主页：[github.com/OpenCSG-Strategy/OpenCSGBP](https://github.com/OpenCSG-Strategy/OpenCSGBP)
- 截图脚本：`scripts/capture-readme-screenshots.mjs`
- i18n 工具：`scripts/i18n/run-all.sh {audit|gen|apply|all}`

> 仓库目前仅作内部路演材料分发；如需对外使用请联系 OpenCSG 品牌团队获取授权。
