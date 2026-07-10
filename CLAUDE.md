# CLAUDE.md

> **Claude Code entry point** for `OpenCSG-Strategy/OpenCSGBP`.
>
> The canonical AI-agent instructions for this repo live in
> [`AGENTS.md`](./AGENTS.md) (the [agents.md spec](https://agents.md/)).
> This file is a short pointer that exists because Claude Code auto-loads
> `CLAUDE.md` by name.

## TL;DR for Claude

1. **Read [`AGENTS.md`](./AGENTS.md) in full before doing anything.**
2. **If the task touches any visible text, also read
   [`docs/CONTRIBUTING-i18n.md`](./docs/CONTRIBUTING-i18n.md).** The 3 hard
   rules there are non-negotiable — every Chinese change ships with
   translations in all 8 other languages, verified by
   `bash scripts/i18n/run-all.sh audit`.
3. Boot the project with:
   ```bash
   git clone https://github.com/OpenCSG-Strategy/OpenCSGBP.git
   cd OpenCSGBP
   npm install
   npm run serve    # → http://127.0.0.1:4173
   ```
4. Stay within the architecture in `AGENTS.md` §5: no frameworks, no
   build steps, single HTML file, PPTX is image-based by design.

## Common quick tasks

| User says | You do |
| --- | --- |
| "Open / preview the deck" | `npm run serve`, return the URL |
| "Translate X to all 10 languages" | Edit `index.html` + `data-en`, append 8 translations to `scripts/i18n/translation-pack.json`, run `apply` then `audit` |
| "Export a PDF" | `npm run export:pdf` or `npm run export:pdf-bilingual` |
| "Refresh README screenshots" | Boot server, then `node scripts/capture-readme-screenshots.mjs` |
| "Add a new slide" | See `AGENTS.md` §4 + `docs/CONTRIBUTING-i18n.md` §2 |

## What NOT to do

- Do NOT introduce a framework, bundler, or build step.
- Do NOT translate brand names (`OpenCSG`, `CSGHub`, `CSGClaw`,
  `AgenticHub`, `AgenticOps`, `CSGLite`, `OPC`, `OpenCore`, etc.).
- Do NOT rewrite founder / customer / investor facts from memory —
  ask the user.
- Do NOT claim a translation task is done without running
  `bash scripts/i18n/run-all.sh audit` and confirming zh/en 100% +
  8 others ≥ 99.8%.

When in doubt: read [`AGENTS.md`](./AGENTS.md).
