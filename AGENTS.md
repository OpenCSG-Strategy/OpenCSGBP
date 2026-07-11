# AGENTS.md

> **This file follows the [agents.md spec](https://agents.md/).**
> It is auto-loaded by Codex CLI, Claude Code, Cursor, Devin, Gemini CLI,
> OpenCode, Aider, Workbuddy, CSGLite, and any agent that follows the spec.
>
> If you are an AI Coding Agent reading this: read the **whole file** before
> touching anything. The hard rules in §6 are non-negotiable.

---

## 1. What this repo is

**OpenCSG Investor Deck 2026** — a single self-contained HTML file
(`index.html`) that renders 39 slides of a 1600×900 (16:9) investor pitch
deck for OpenCSG. Supports 10 languages, on-screen navigation, PDF/PPTX
export, keyboard control, and thumbnail overview.

**Stack:** Plain HTML + CSS + vanilla JS. **No front-end framework, no
build step.** Node scripts handle serving, PDF rendering (Playwright
headless Chromium), and PPTX packaging (pptxgenjs).

**Audience:** This is an **investor-facing deliverable**. Every change
that affects what an investor sees is a product change, not a code change.
Typography, brand color, and cross-locale consistency are sacred.

## 2. Repository at a glance

```
OpenCSGBP/
├── index.html                # THE deck. 39 slides, ~5k lines.
├── assets/
│   ├── deck-*.css / .js      # Per-slide styles and behaviour
│   ├── i18n/*.json           # 10 language packs (zh/en/ja/ko/ar/ru/fr/de/es/pt)
│   ├── brand-logos/          # Vendor / partner logos
│   ├── founder-logos/        # Founder background logos
│   ├── cases/                # Case-study imagery
│   ├── roadmap/              # Roadmap & OPC visuals
│   ├── appendix/             # Appendix illustrations
│   └── *.png / *.jpg / *.svg # Shared imagery
├── scripts/
│   ├── serve-deck.cjs        # Local static server + /api/export
│   ├── export-pdf.cjs        # PDF renderer (Playwright + pdf-lib)
│   ├── export-pptx.cjs       # PPTX packager (Playwright + pptxgenjs)
│   ├── export-*-bilingual.cjs# Bilingual export bundles
│   ├── capture-readme-screenshots.mjs
│   └── i18n/                 # Translation audit / gen / apply tooling
├── docs/
│   ├── CONTRIBUTING-i18n.md  # Hard rules for any text change
│   └── assets/               # Real screenshots used by README
├── README.md / README_EN.md  # Bilingual entry points
└── package.json
```

## 3. How to boot the project

```bash
git clone https://github.com/OpenCSG-Strategy/OpenCSGBP.git
cd OpenCSGBP
npm install              # auto-downloads Playwright's Chromium
npm run serve            # → http://127.0.0.1:4173
```

If `npm install` stalls on Chromium, set a mirror:
`PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright npm install`.

If port 4173 is taken: `PORT=4180 npm run serve`.

## 4. Most common tasks

| The user asks… | Do this |
| --- | --- |
| "Open / preview the deck" | `npm run serve` and report `http://127.0.0.1:4173` |
| "Change the headline on slide N" | Edit `index.html`; update `data-en`; add the phrase to `scripts/i18n/translation-pack.json`; run `bash scripts/i18n/run-all.sh apply` then `audit` |
| "Translate X to all 10 languages" | Add the English source + 8 translations to `translation-pack.json`, run `apply` + `audit`. zh/en get auto-fill from gen-phrases |
| "Export a bilingual PDF" | `npm run export:pdf-bilingual` → lands in `.exports/` |
| "Export just the cover and main deck in Japanese" | `node scripts/export-pdf.cjs --lang=ja --sections=cover,main` |
| "Refresh the README screenshots" | Boot server, then `node scripts/capture-readme-screenshots.mjs` |
| "Add a new slide" | Duplicate a `<section class="slide-wrap" data-section="main">…</section>` block, edit copy, mark all visible text with `data-en="…"`, update translation pack, run `apply` + `audit` |
| "The page is blank" | Usually port conflict → `PORT=4180 npm run serve`. Or Playwright didn't finish downloading |
| "CJK looks like tofu" | Install Noto Sans CJK on the host. Playwright's Chromium uses system fonts |

## 5. Architecture decisions (do not violate)

- **No framework.** Don't add React, Vue, Tailwind, etc. The deck is plain
  HTML/CSS/JS by design — keeps the single-file deliverable lightweight and
  opens cleanly inside any browser / email preview / GitHub Pages.
- **PPTX is fully image-based.** Each slide is a 1600×900 PNG packed by
  `pptxgenjs`. This is intentional: 100% layout fidelity across platforms.
  Trade-off: text is not editable inside PowerPoint. If a user needs to
  edit text in PowerPoint, recommend PDF + a PDF-to-PPTX converter.
- **`zh.json` is the source of truth.** `data-en` attributes carry the
  English source. All other languages are derived from the English key.
  English-mode `phrases` entries are identity (`value === key`) so
  English PPTX export also works.
- **Brand colors are tokens.** All colors live as CSS custom properties at
  the top of `assets/deck-base.css`. To rebrand, change tokens — never
  inline a hex code in slide markup.
- **Fonts are tokens, too.** All font-family declarations must use
  `var(--body-font)` (sans body) or `var(--display-font)` (display
  headings) defined in `assets/deck-refine.css` §root. Never inline
  `font-family: 'Playfair Display', serif`, `font-family: Arial`, or
  any other orphan font. The full deck is meant to read as one
  type system; a single Playfair italic digit on slide 07 broke that
  (and forced 9-language retranslation). See §8 below.
- **HTML entity discipline.** Phrase keys in `assets/i18n/*.json` MUST NOT
  contain `&amp;`, `&lt;`, etc. — they are stored literally. The i18n
  framework's `normalizeKey()` decodes entities at lookup time. Storing
  `&amp;` in a key silently breaks lookup. See `docs/CONTRIBUTING-i18n.md`
  §6 for the bug history.

## 6. Hard rules (non-negotiable)

1. **Every visible string ships in 10 languages.** Changing any Chinese
   text means changing `data-en` AND appending the 8 non-zh translations
   to `scripts/i18n/translation-pack.json`. Run
   `bash scripts/i18n/run-all.sh apply && bash scripts/i18n/run-all.sh audit`
   before claiming the task is done. Coverage must be:
   - zh.json, en.json: **100.0%**
   - ja/ko/ar/ru/fr/de/es/pt.json: **≥ 99.8%** (the 0.2% delta is JS
     template placeholders, e.g. `${item.title}`, which are not
     translatable).

2. **Brand names stay verbatim.** Do NOT translate `OpenCSG`, `CSGHub`,
   `CSGHub-Lite`, `CSGClaw`, `AgenticHub`, `AgenticOps`, `CSGLite`, `OPC`,
   `OpenCore`, `DevOps`, `GitLab`, `MongoDB`, `Elastic`, `Grafana`,
   `Confluent`, `HashiCorp`, `Hugging Face`, `ModelScope`, `MIIT`, `CAICT`,
   etc. The full whitelist is in
   [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md) §4.

3. **Run `audit` before claiming done.** If you can't run it
   (e.g. no shell access), you can't claim a translation task is finished.

4. **Don't add new frameworks or build steps.** The whole point of this
   repo is that it stays a single HTML file. If you think you need a
   bundler, you don't.

5. **Don't edit `package-lock.json` by hand.** Use `npm install <pkg>` or
   `npm uninstall <pkg>`. If you need a new dep, justify it in your
   final report — Playwright and pdf-lib are the only two production
   deps today, plus pptxgenjs as a dev dep.

6. **The founder bio is sensitive.** Slide 14 (`#slide-14`) is the
   founder / team slide and has been corrected several times. If you are
   not 100% sure about a fact (e.g. "5× continuous founder", "Co-founder
   of Mesosphere"), do NOT rewrite it from memory. Ask the user or
   check the existing copy first. Same goes for the investor / customer
   logos and named partners (e.g. `miHoYo`, `CATL`, `CALB`).

7. **Internal-only distribution.** This deck is for **internal investor
   use**. Do not republish, rebrand, or screenshot for external
   marketing without explicit approval from the OpenCSG brand team.

## 7. What "done" means for a typical task

A translation task is "done" only when **all of the following** are true:

- [ ] `index.html` has the updated Chinese + matching `data-en`
- [ ] `scripts/i18n/translation-pack.json` has the new key with all 8 translations
- [ ] `bash scripts/i18n/run-all.sh apply` succeeded
- [ ] `bash scripts/i18n/run-all.sh audit` reports zh/en 100% and the 8 others ≥ 99.8%
- [ ] You have eyeballed the page in at least one non-English mode (`?lang=ja`) in a browser, or at minimum described the expected render

A content task (new slide, layout change) is "done" when:

- [ ] Visuals match design tokens
- [ ] All 10 languages are in sync
- [ ] Audit passes
- [ ] If a screenshot in `docs/assets/` now looks stale, run `node scripts/capture-readme-screenshots.mjs` and commit the updated PNG

## 8. Common pitfalls (already paid for in past debugging)

- **HTML entity duplicates in phrases keys.** Symptom: a specific
  phrase never translates in any language. Cause: the phrases key
  contains `&amp;` while the runtime normalizes to `&` at lookup. Fix:
  run the `decode-fix` pass on all 10 language packs (see
  `docs/CONTRIBUTING-i18n.md` §6A).
- **JS template placeholders show up as missing.** `data-en="${item.title}"`
  is an audit false positive — these aren't real strings, they're JS
  variable references. Don't try to "translate" them.
- **Dynamic HTML in `data-en="X">中文</...>` and `tx("中文", "EN")` is
  invisible to `gen-phrases.js`.** Use `scripts/i18n/zh-patch-v2.cjs`
  (if available) to backfill zh.json from these patterns.
- **Editing `data-en` without updating the 8-language phrases leaves
  the old translation in place.** This is the #1 way to ship "looks
  fine in English, broken in Japanese" bugs.
- **`data-en` on a parent that has child nodes silently nukes the
  children.** The legacy i18n path (`translateLegacyElements`) replaces
  `el.textContent` — that clears every descendant. Symptom: in non-zh
  modes a grid cell shows one long wrapped string instead of three
  distinct columns; the central card shows 中文 like "主权控制面"
  in English. Fix: never put `data-en` on a wrapping `<div>` /
  `<section>` that has structured children. Put `data-en` on each
  *leaf* that actually needs translation, and on layout elements that
  have only one text node it's fine. See `docs/CONTRIBUTING-i18n.md`
  §6F for the full rule.
- **Orphan serif / Arial fonts break the type system.** Any
  `font-family: '…Display', serif`, `font-family: Arial`, or
  `font-style: italic` introduced on a numeric or accent element
  looks "off" against the surrounding Inter. Audit by:
  `grep -rn "font-family.*serif\|font-family.*Arial\|font-style.*italic" assets/*.css`.
  Anything that matches and isn't on a known pull-quote (`#slide-10 .m10-jensen q`)
  is a regression.

## 9. Quick reference

- Repo URL: `https://github.com/OpenCSG-Strategy/OpenCSGBP`
- Default port: `127.0.0.1:4173`
- 10 languages: `zh` `en` `ja` `ko` `ar` `ru` `fr` `de` `es` `pt`
- Brand primary: `#23877B` (teal), accent: `#C88A2B` (amber)
- i18n rules: [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md)
- i18n framework: `assets/deck-i18n.js`
- i18n dict conventions: `assets/i18n/README.md`
- Audit gate: `bash scripts/i18n/run-all.sh audit`

## 10. Escalation

If a request seems to conflict with the rules above (e.g. "delete the
8-language fallback", "make it React", "translate the brand names"),
stop and ask the user. The rules exist because the deck ships to
external investors; relaxing them silently is how we lose trust.
