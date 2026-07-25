# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An Obsidian vault of mathematics notes (English + Chinese) that compiles into a static, Obsidian-looking single-page site published to GitHub Pages. The Markdown notes at the repo root are both the source of truth for the vault and the input to the site build. There are no tests and no linter.

## Commands

```bash
npm install
npm run dev     # build once, serve docs/ on http://localhost:4173, rebuild + live-reload on note edits
npm run build   # one-shot build into docs/
```

`npm run dev` watches only the repo root and `.obsidian/` non-recursively (see [dev-server.js:79-96](scripts/dev-server.js#L79-L96)), so edits inside subdirectories like [讲义/](讲义/) do not trigger a rebuild.

## Architecture

The entire site generator is one file: [scripts/build-site.js](scripts/build-site.js) (~1800 lines). It has no bundler and no framework. `index.html`, `styles.css`, `app.js`, and `favicon.svg` are all emitted as JavaScript template strings from `buildIndexHtml`, `buildStylesCss`, `buildAppJs`, and `buildFaviconSvg`. **To change site CSS or client-side behavior, edit those template-string functions in the build script — never edit files in [docs/](docs/), which is generated output.**

Build pipeline (top of the script, lines 13-128, runs top-to-bottom at require time):

1. `fs.readdirSync(root)` collects `*.md` — **root level only, non-recursive**. Subdirectory notes are never published.
2. Every note gets a slug from `slugify(title)`; `titleToSlug` is populated first so wikilink resolution can be a single pass.
3. Per note: `collectWikiLinks` / `collectTags` / `collectHeadings` / `collectExcerpt` scrape metadata from raw Markdown, then backlinks are inverted from the link graph.
4. `prepareMarkdown` rewrites Obsidian syntax into HTML *before* markdown-it runs: callouts → `<div class="callout">`, `$$…$$` normalized onto its own lines, `[[wikilinks]]` → `#/note/<slug>` anchors, `#tags` → `#/tag/<tag>` anchors. Unresolvable wikilinks become `<span class="missing-link">` (styled red) rather than failing the build.
5. markdown-it renders with two custom rules from `installMathRule` (inline `$…$` and block `$$` → KaTeX server-side) and `installHeadingAnchors` (`id` = `slugify(heading text)`), plus `markdown-it-footnote`.
6. Everything is serialized into `window.NOTIVERSE_DATA` in `docs/assets/site-data.js`. Notes ship as pre-rendered HTML strings; the client never parses Markdown.
7. A content hash of the four generated assets becomes `?v=` on every asset URL for cache busting, so any content change rewrites `index.html` too.

The client ([`buildAppJs`](scripts/build-site.js#L1207)) is a hash router over that blob: `#/note/<slug>[#heading]`, `#/tag/<tag>`, `#/graph`. `createGraph` is a hand-rolled canvas force simulation seeded by `.obsidian/graph.json` (repel/link/center strengths, scale, node colors from `colorGroups`).

`.obsidian/` config is read as build input, not just editor state: `graph.json` drives graph physics and colors, and `workspace.json`'s active file / `lastOpenFiles` picks `defaultSlug`, the note shown at `/`. Both files are committed, so opening a different note in Obsidian changes build output.

## Known constraints to work within

- **`slugify` strips all non-ASCII.** CJK titles collapse to whatever ASCII survives: `01-实数的完备性.md` → `01`, and a title with no digits or Latin letters falls back to the literal `"note"`. Consequences: heading anchors inside the Chinese lecture notes collide heavily (many `id="note"`, and `定义 1.1` collides with section `1.1`), so outline links and `[[Note#Heading]]` deep links in those files land on the wrong element. Keep an ASCII-distinguishable prefix in Chinese filenames and headings if a stable anchor matters.
- **[讲义/](讲义/) is a mirror, not the published copy.** `讲义/00-…` through `讲义/09-…` are byte-identical duplicates of the root `00-…`–`09-…` files. Only the root copies build. Edit both, or the site and the folder drift.
- **Wikilinks resolve by title (filename without `.md`), case-insensitively.** Renaming a note silently breaks every inbound `[[link]]` into a red `missing-link` span — the build still exits 0. Grep for the old title after any rename.
- **`README.md` is built as a regular note** (slug `readme`) and appears in the sidebar and graph.
- **[docs/](docs/) is committed but also rebuilt by CI.** Running `npm run build` locally will dirty `docs/` whenever `.obsidian/workspace.json` has moved on. Don't commit that churn as part of an unrelated change; the Pages workflow builds from source on every push to `main` anyway.

## Note conventions

Callouts use Obsidian syntax `> [!info] Title` — types in use are `info`, `quote`, `example`, `tip`. All types render identically (one `.callout` style, purple left border); the type only becomes a `callout-<type>` class, so adding a new type needs matching CSS in `buildStylesCss`. Callout bodies are rendered by a nested `md.render()` call, so math and lists inside them work.

Math is KaTeX with `throwOnError: false, strict: "ignore"` — a broken formula renders as visible error markup or falls back to `<code>`, it never fails the build. Verify math visually in the dev server.

The Chinese lecture series ([讲义/README.md](讲义/README.md)) has a deliberate pedagogical structure worth preserving when editing it: each theorem is presented as 动机 (motivation) → 证明策略 (strategy) → 证明细节 (details), ⭐ marks load-bearing main theorems, 📎 marks technical scaffolding lemmas, and the whole series is a single dependency chain rooted in the completeness of ℝ.
