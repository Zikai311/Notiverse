# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

An Obsidian vault of mathematics notes (English + Chinese) that compiles into a static, Obsidian-looking single-page site published to GitHub Pages. The Markdown inside the `*.world/` folders is both the vault content and the input to the site build. There are no tests and no linter.

## Commands

```bash
npm install
npm run dev     # build once, serve docs/ on http://localhost:4173, rebuild + live-reload on edits
npm run build   # one-shot build into docs/
```

`npm run dev` watches the repo root recursively (see [dev-server.js:80-97](scripts/dev-server.js#L80-L97)), so edits anywhere inside a world folder or `.obsidian/` trigger a rebuild; `docs/`, `node_modules/`, and `.git/` are ignored.

## Worlds

A **world** is a top-level folder whose name ends in `.world`. Worlds are the unit of categorisation: each one owns its own sidebar file list, tag list, and graph. Currently [Math I.world/](Math%20I.world/) (the Chinese analysis lecture series) and [Math II.world/](Math%20II.world/) (standalone English/Chinese notes).

- **Only `*.world/` folders are published.** Markdown at the repo root — including `README.md` and this file — is not built. Adding a note means putting a `.md` file inside a world folder (nested subfolders inside a world are scanned recursively).
- **Creating a world is just `mkdir "Name.world"`** plus a note inside it; the switcher, graph, and routing pick it up with no code change. World order in the UI is `localeCompare` on folder name, and the first world is the default one shown at `/`.
- With no `*.world/` folder present, the build falls back to treating the vault root as one implicit world named `Vault`, so the site still builds.
- Each world's landing note (`defaultSlug`) is its first note by path sort order.

## Architecture

The entire site generator is one file: [scripts/build-site.js](scripts/build-site.js) (~2200 lines). No bundler, no framework. `index.html`, `styles.css`, `app.js`, and `favicon.svg` are all emitted as JavaScript template strings from `buildIndexHtml`, `buildStylesCss`, `buildAppJs`, and `buildFaviconSvg`. **To change site CSS or client-side behavior, edit those template-string functions in the build script — never edit files in [docs/](docs/), which is generated output.**

Build pipeline (top of the script, runs top-to-bottom at require time):

1. Scan root for `*.world/` dirs, then `collectMarkdown` each one recursively. Every note carries its `world` from that point on.
2. Assign slugs. `titleIndex` maps lowercased title → all notes with that title, so wikilink resolution can prefer the linking note's own world.
3. **First render pass** (`renderNoteHtml(entry, { collectOnly: true })`) exists only to learn each note's heading ids, so that `[[Note#Heading]]` links in the second pass can resolve against real ids.
4. `collectLinks` / `collectTags` / `collectExcerpt` scrape metadata; backlinks are inverted from the link graph.
5. **Second render pass.** `prepareMarkdown` rewrites Obsidian syntax into HTML *before* markdown-it runs: callouts → `<div class="callout">`, `$$…$$` normalized onto its own lines, `[[wikilinks]]` and relative `*.md` links → `#/note/<slug>` anchors, `#tags` → `#/tag/<tag>` anchors. Unresolvable wikilinks become `<span class="missing-link">` (styled red) and are reported in a build warning list rather than failing the build.
6. markdown-it renders with custom rules from `installMathRule` (inline `$…$`, block `$$` → KaTeX server-side) and `installHeadingAnchors`, plus `markdown-it-footnote`.
7. Per world, notes are partitioned and `buildGraph` builds that world's node/edge set.
8. Everything is serialized into `window.NOTIVERSE_DATA` in `docs/assets/site-data.js` as `{ worlds, defaultWorld, notes, graphConfig }`. Notes ship as pre-rendered HTML; the client never parses Markdown.
9. A content hash of the generated assets becomes `?v=` on every asset URL, so any content change also rewrites `index.html`.

The client ([`buildAppJs`](scripts/build-site.js#L1518)) is a hash router over that blob: `#/note/<slug>[#heading]`, `#/tag/<tag>`, `#/graph`, `#/world/<slug>`. Sidebar, search, tags, and graph are all scoped to `currentWorld` via `worldNotes()`.

- `#/world/<slug>` is an **action, not a destination**: `routeFromHash` calls `setWorld` and then immediately redirects to `#/graph` (if the graph was open) or the world's default note, so the world hash never sticks in the address bar.
- A `#/note/` route pointing at another world's note calls `setWorld` first, so cross-world links just work.
- `createGraph` is a hand-rolled canvas force simulation. `graph.setData(world.graph)` reseeds nodes/links in place on a world switch — the simulation is created once and never rebuilt.
- `.obsidian/graph.json` is build input, not just editor state: it drives graph physics (repel/link/center strengths, scale) and node colors via `colorGroups`. It is committed, so changing graph settings in Obsidian changes build output. `workspace.json` is **not** read (it used to pick the default note, which made every build depend on which file was last open).

## Known constraints to work within

- **Slugs are one flat namespace** because routes are `#/note/<slug>`. Two notes in different worlds with the same title get a short deterministic hash suffix on the second one. `slugify` preserves Unicode letters and digits, so CJK titles keep distinguishable slugs (`01-实数的完备性`).
- **Heading ids are allocated by the renderer**, not by a separate text-scraping pass, and deduped per note (`base`, `base-2`, …). The outline is collected in the same pass, which is what keeps outline links and `id` attributes in lockstep. Don't add a second heading-id computation — resolve through `headingsBySlug` / `noteHeadingId` instead.
- **Wikilinks resolve by title (filename without `.md`), case-insensitively**, preferring the linking note's own world and falling back to a unique match elsewhere. Renaming a note silently turns every inbound `[[link]]` into a red `missing-link` span — the build prints a warning but still exits 0. Grep for the old title after any rename.
- **Relative `*.md` links are rewritten to hash routes** (the Math I table of contents relies on this). A relative link that escapes the vault or doesn't resolve is left alone and will 404 on the site.
- **[docs/](docs/) is committed but also rebuilt by CI.** The Pages workflow builds from source on every push to `main`, so don't sweat committing `docs/` churn alongside unrelated changes.

## Note conventions

Callouts use Obsidian syntax `> [!info] Title` — types in use are `info`, `quote`, `example`, `tip`. All types render identically (one `.callout` style, purple left border); the type only becomes a `callout-<type>` class, so a new type needs matching CSS in `buildStylesCss`. Callout bodies are rendered by a nested `md.render()` call, so math and lists inside them work; that nested call is flagged via `renderContext.inCallout` so callout headings consume ids without polluting the outline.

Math is KaTeX with `throwOnError: false, strict: "ignore"` — a broken formula renders as visible error markup or falls back to `<code>`, it never fails the build. Verify math visually in the dev server.

The Math I series ([Math I.world/Math I intro.md](Math%20I.world/Math%20I%20intro.md)) has a deliberate pedagogical structure worth preserving when editing it: each theorem goes 动机 (motivation) → 证明策略 (strategy) → 证明细节 (details), ⭐ marks load-bearing main theorems, 📎 marks technical scaffolding lemmas, and the series is one dependency chain rooted in the completeness of ℝ.
