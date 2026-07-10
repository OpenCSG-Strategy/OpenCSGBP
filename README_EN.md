<div align="center">

# OpenCSG Investor Deck 2026

**Empowering everyone with large models · 让大模型赋能每一个人**

> Investor pitch deck · 40 slides · 10 languages · single HTML file

[![Version](https://img.shields.io/badge/Version-2026.07.1-blue?style=flat-square)](#)
[![Slides](https://img.shields.io/badge/Slides-40-teal?style=flat-square)](#)
[![i18n](https://img.shields.io/badge/i18n-10%20languages-23877B?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-Internal-lightgrey?style=flat-square)](#)

</div>

---

<div align="center">

### 🌐 Language / 语言

| [🇨🇳 简体中文](./README.md) | [🇺🇸 English](./README_EN.md) |

> GitHub renders whichever README matches the viewer's account/browser language. The two files cross-link at the top and bottom.

</div>

---

## ⚡ 30-Second Start

Pick the path that fits you:

| You are | Use this | Time |
| --- | --- | --- |
| Developer / want to edit locally | [Path A · Local Node setup](#-path-a--local-node-setup) | ~2 min |
| **AI Coding Agent user** (Codex / Claude Code / Cursor / Workbuddy / CSGLite) | [Path B · Hand it to an AI agent](#-path-b--hand-it-to-an-ai-coding-agent) | ~30 s |
| Just want to view, no install | [Path C · GitHub Pages live demo](#-path-c--github-pages-live-demo) | 0 s |

---

## 🅰️ Path A · Local Node setup

Requirements: **Node.js ≥ 18**, **npm ≥ 9**, GitHub access.

```bash
# 1. Clone the repo
git clone https://github.com/OpenCSG-Strategy/OpenCSGBP.git
cd OpenCSGBP

# 2. Install dependencies (Playwright auto-downloads Chromium)
npm install

# 3. Start the local server (default 127.0.0.1:4173)
npm run serve
```

Open **http://127.0.0.1:4173** in your browser.

> Port already taken? `PORT=4180 npm run serve` to pick another.
> Playwright download slow? `PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrators/playwright npm install`.

## 🅱️ Path B · Hand it to an AI Coding Agent

Paste this prompt block into your AI agent (Codex / Claude Code / Cursor Composer / Workbuddy / CSGLite / etc.) and the agent will clone + install + start + open the deck for you:

```text
Please boot the OpenCSG investor pitch deck for me:

  git clone https://github.com/OpenCSG-Strategy/OpenCSGBP.git
  cd OpenCSGBP
  npm install
  npm run serve

Once it's running, open http://127.0.0.1:4173 in a browser tab.
Default language is Chinese. Use the language pill in the top-right
toolbar to switch to English / 日本語 / 한국어 / العربية / Русский /
Français / Deutsch / Español / Português.

If anything blocks you, first read AGENTS.md at the repo root and
docs/CONTRIBUTING-i18n.md — they describe the project's intent,
how to start it, and the hard rule that any text change must ship
with 10-language translations.
```

**Per-agent entry points:**

| Agent | Recommended entry |
| --- | --- |
| **Codex CLI / Cursor Composer / Continue.dev** | Paste the prompt block above directly into the chat; long-context friendly |
| **Claude Code / Workbuddy / CSGLite** | `@repo` the GitHub URL first, then paste the prompt; supports in-place repo edits |
| **OpenCode / Aider / Devin / Gemini CLI** | `clone` the repo — the tool will auto-load `AGENTS.md` and understand the project |
| **Generic web AI** (ChatGPT, Gemini App, etc.) | Paste the prompt; they won't actually clone, but will walk you through the steps |

> 📌 **Why this works**: the repo root has an `AGENTS.md` following the [agents.md spec](https://agents.md/). Codex / Claude Code / Cursor / Devin / Gemini CLI / OpenCode all auto-load it. So even if you only say *"boot this repo"* to the AI, it will read AGENTS.md and know exactly what to do.

## 🅲️ Path C · GitHub Pages live demo

GitHub Pages is enabled on this repo. Just visit:

> 🌐 **<https://OpenCSG-Strategy.github.io/OpenCSGBP/>**

Zero install. Full feature parity with the local build (PDF export is supported, PPTX export is local-only because it bundles images).

---

## 📖 Overview

This repository hosts the **OpenCSG 2026 investor pitch deck as a single self-contained HTML file** — 40 slides, designed at 1600×900 (16:9), with on-screen navigation, PDF / PPTX export, language switching, keyboard controls, thumbnail overview mode, and inline QR codes.

The deck is plain HTML / CSS / vanilla JS — **no front-end framework, no build step**. A small set of Node scripts covers the operational side:

- Local static server with an export API (`npm run serve`)
- Headless PDF rendering (`npm run export:pdf`)
- Image-based PPTX packaging (`npm run export:pptx`)
- README screenshot capture from the live deck (`node scripts/capture-readme-screenshots.mjs`)

Built for **investor-facing scenarios where content, typography, and cross-locale consistency matter more than framework ergonomics**.

![AgenticOps methodology](./docs/assets/agentic-ops.png)

## ✨ Features

![Platform overview](./docs/assets/platform.png)

| Module | Highlights |
| --- | --- |
| 📑 **Multi-section deck** | 40 slides in 5 sections — `cover` / `main` / `case` / `product` / `appendix`; each is exportable on its own |
| 🌍 **10 languages** | zh / en / ja / ko / ar (RTL) / ru / fr / de / es / pt |
| ⌨️ **Keyboard & touch** | `←` `→` to page, `↑` `↓` to jump section, `Home` / `End` to first/last, `Esc` to leave fullscreen, `Space` / `F` for fullscreen |
| 🧭 **Top toolbar** | Language switcher, page counter, "View PDF", PPT-ready pill, jump-to-top |
| 🔍 **Overview grid** | Top-bar "Overview" button opens a thumbnail grid of every slide |
| 🌐 **RTL support** | Arabic auto-flips the whole body to right-to-left |
| 💧 **Watermark** | Diagonal watermark on PDF / PPTX exports |
| 🖨 **Print styles** | `@media print` page-break handling for A4 / 16:9 handouts |
| 📤 **Multi-format export** | PDF (vector + image, 16:9 / 4:3 / A4 / Letter) and PPTX (full-bleed image) |
| 🔁 **PDF caching** | Server-side cache keyed by `lang + ratio + sections + watermark` so the second request is instant |
| 🎨 **Brand-locked palette** | Teal `#23877B` + amber `#C88A2B` accents, mirrored inside exported PPTX |

More slide previews:

| Community & honors | Business flywheel | Founders |
| --- | --- | --- |
| ![Community](./docs/assets/community.png) | ![Business model](./docs/assets/business.png) | ![Founders](./docs/assets/team.png) |

## 📁 Repo Layout

```
OpenCSGBP/
├── index.html                # Entry — all 40 slides live here
├── AGENTS.md                 # AI Coding Agent entrypoint (agents.md spec)
├── CLAUDE.md                 # Claude Code specific (mirrors AGENTS.md)
├── assets/
│   ├── deck-*.css / .js      # Slide styles & behaviour
│   ├── i18n/                 # 10-language translation packs
│   ├── brand-logos/          # Open-source / vendor brand marks
│   ├── founder-logos/        # Founder background logos
│   ├── cases/                # Case-study reference imagery
│   ├── roadmap/              # Roadmap & OPC visual assets
│   ├── appendix/             # Appendix illustrations
│   └── *.png / *.jpg / *.svg # Shared imagery
├── scripts/
│   ├── serve-deck.cjs        # Static server + export API
│   ├── export-pdf.cjs        # PDF renderer
│   ├── export-pptx.cjs       # PPTX (image-based) packager
│   ├── export-pdf-bilingual.cjs / export-pptx-bilingual.cjs
│   ├── capture-readme-screenshots.mjs
│   └── i18n/                 # Translation audit / gen / apply
├── docs/
│   ├── CONTRIBUTING-i18n.md  # Hard rules for text changes
│   └── assets/               # Real screenshots used by this README
└── package.json
```

## 🛠 Scripts

| Command | Description |
| --- | --- |
| `npm run serve` | Boot the static server (with `/api/export`) on `127.0.0.1:4173` |
| `npm run export:pdf` | Export the full deck to PDF with default options (zh / 16:9) under `.exports/` |
| `npm run export:pdf-bilingual` | Export the bilingual (zh + en) PDF bundle in one shot |
| `npm run export:pptx` | Export image-based PPTX |
| `npm run export:pptx-bilingual` | Export the bilingual (zh + en) PPTX bundle in one shot |
| `node scripts/capture-readme-screenshots.mjs` | Pull README screenshots from `127.0.0.1:4173` into `docs/assets/` |
| `bash scripts/i18n/run-all.sh audit` | Check 10-language translation coverage |
| `bash scripts/i18n/run-all.sh apply` | Write hand translations into the 8 other language packs |

### Export flags

```bash
# Language / ratio / section
node scripts/export-pdf.cjs --lang=en --ratio=16:9 --sections=cover,main

# Manual page list (overrides --sections)
node scripts/export-pdf.cjs --lang=zh --pages=1,3,5-8

# Range + watermark
node scripts/export-pdf.cjs --from=1 --to=10 --watermark="CONFIDENTIAL" --out=draft.pdf
```

Supported languages: `zh` `en` `ja` `ko` `ar` `ru` `fr` `de` `es` `pt`
Supported ratios:   `16:9` `4:3` `a4-portrait` `a4-landscape` `letter-landscape`
Supported sections: `cover` `main` `case` `product` `appendix`

> You can also call the REST endpoint directly:
> `POST http://127.0.0.1:4173/api/export` with a JSON body
> `{ lang, ratio, format, scope, sections, watermarkEnabled, watermarkText, filename, disposition }`.

## 🌍 i18n

![UI toolbar](./docs/assets/ui-toolbar.png)

- 10 translation packs live in `assets/i18n/*.json`; `zh.json` is the source of truth.
- HTML elements are marked with `data-en` / `data-i18n`; the runtime swaps text based on the current language.
- Missing translations fall back to English, never to a blank string.

> **🚨 Read this before changing any copy**: [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)
> These are **hard rules**: change Chinese → update `data-en` → append 8-language translations to `translation-pack.json` → `apply` → `audit` 100% before merge.
> PRs that violate the rule are sent back. No "merge now, translate later".

Workflow for adding or updating a phrase:

```bash
# 1. Update the Chinese copy in index.html + the matching data-en attribute
# 2. Append the human translations to scripts/i18n/translation-pack.json
# 3. Apply them to the 8 other packs and verify coverage
bash scripts/i18n/run-all.sh apply
bash scripts/i18n/run-all.sh audit
```

See [`assets/i18n/README.md`](./assets/i18n/README.md) for full conventions and [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md) for the 3 ironclad rules + common pitfalls + brand-name whitelist.

## 📤 Export PDF / PPTX

### In-browser export

The **"View PDF"** button in the top toolbar triggers `ensureCachedPdf()` on the server: the first request for a given `lang + ratio + sections + watermark` combination generates the PDF and writes it to `.exports/pdf-cache/`; subsequent identical requests hit the cache.

### CLI export

```bash
# Bilingual PDF bundle
npm run export:pdf-bilingual

# Bilingual PPTX bundle
npm run export:pptx-bilingual

# Custom watermark
node scripts/export-pptx.cjs --lang=zh --watermark="DRAFT"
```

The PPTX is **fully image-based** — every slide is rendered to a 1600×900 PNG by Playwright, then packaged with `pptxgenjs`. The trade-off: layout is preserved 100% across platforms, but text is not editable inside PowerPoint. To change copy, edit `index.html` and re-export.

## 🎨 Design Tokens

| Token | Value | Role |
| --- | --- | --- |
| `--teal` | `#23877B` | Primary brand color (logo, toolbar, buttons) |
| `--teal2` | `#0E675F` | Primary dark (hover / emphasis) |
| `--mint` | `#EAF4F2` | Soft background fill |
| `--amber` | `#C88A2B` | Accent for numbers and key metrics |
| `--ink` | `#111817` | Body text |
| `--muted` | `#66716F` | Secondary text |
| `--paper` | `#FCFDFD` | Page background |

> Tokens are centralized in the `:root` block of `assets/deck-base.css`; changing them once propagates everywhere.

## ❓ FAQ

<details>
<summary><b>Q1. The page is blank after starting the server.</b></summary>

- Confirm <code>npm install</code> finished (Playwright bundles a browser that needs to download).
- Check the terminal log. 80% of the time the error is <code>EADDRINUSE</code> — pick a different port with <code>PORT=4180 npm run serve</code>.
</details>

<details>
<summary><b>Q2. Japanese / Korean text shows as tofu boxes.</b></summary>

Your system is missing a CJK font. macOS / Windows ship with PingFang / Microsoft YaHei / Noto by default. The Playwright-bundled Chromium used for PDF export also relies on system fonts; if exports show tofu, install Noto Sans CJK.
</details>

<details>
<summary><b>Q3. The exported PPTX text looks blurry in PowerPoint.</b></summary>

That's intentional. The PPTX is fully image-based (1600×900 PNG per slide) for cross-platform pixel-perfect layout. If you need editable text, export to PDF and run it through a "PDF → PPTX" converter.
</details>

<details>
<summary><b>Q4. i18n didn't refresh after I edited <code>index.html</code>.</b></summary>

In the browser console:

```js
localStorage.removeItem('opencsg.deck.lang');
location.reload();
```

Or force a language via the URL: <code>?lang=zh</code>.
</details>

<details>
<summary><b>Q5. I want to add a new slide.</b></summary>

1. Duplicate an existing <code>&lt;section class="slide-wrap" data-section="main"&gt;…&lt;/section&gt;</code> and rewrite the copy.
2. Wrap every key phrase with <code>data-en="English source text"</code> and append the phrase to <code>scripts/i18n/translation-pack.json</code>.
3. <code>bash scripts/i18n/run-all.sh apply &amp;&amp; bash scripts/i18n/run-all.sh audit</code>.
4. <code>node scripts/capture-readme-screenshots.mjs</code> to refresh README screenshots.
</details>

<details>
<summary><b>Q6. Best way to use an AI agent (Codex / Claude / Workbuddy / CSGLite) to edit this repo?</b></summary>

The repo root ships an <a href="./AGENTS.md"><code>AGENTS.md</code></a> following the <a href="https://agents.md/">agents.md spec</a> that all major AI Coding Agents auto-load.
Just hand the agent a plain-English instruction, e.g.:
<ul>
<li><i>"Translate the founder bio on slide 14 into all 8 other languages."</i></li>
<li><i>"Change the cover headline to XXX and update all 10 language packs."</i></li>
<li><i>"Export the current deck to a bilingual PDF under <code>.exports/</code>."</i></li>
</ul>
The agent will read <code>AGENTS.md</code> + <code>docs/CONTRIBUTING-i18n.md</code> first, then follow the rules — including the 10-language coverage gate.
</details>

## 🛡 Maintainers

- Repo: [github.com/OpenCSG-Strategy/OpenCSGBP](https://github.com/OpenCSG-Strategy/OpenCSGBP)
- AI Agent entry: [`AGENTS.md`](./AGENTS.md)
- i18n rules: [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)
- i18n tooling: `scripts/i18n/run-all.sh {audit|gen|apply|all}`
- Screenshot script: `scripts/capture-readme-screenshots.mjs`

---

<div align="center">

🇨🇳 [简体中文](./README.md) · 🇺🇸 [English](./README_EN.md)

Made with ☕ for OpenCSG investor relations.

</div>

> This repository is currently distributed as **internal investor material**. For external use, please contact the OpenCSG brand team for licensing.
