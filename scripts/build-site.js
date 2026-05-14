const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const MarkdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const katex = require("katex");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");
const assetsDir = path.join(docsDir, "assets");
const vaultConfigDir = path.join(root, ".obsidian");

const noteFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

const graphConfig = readJson(path.join(vaultConfigDir, "graph.json"), {});
const workspaceConfig = readJson(path.join(vaultConfigDir, "workspace.json"), {});

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

installMathRule(md);
installHeadingAnchors(md);
md.use(markdownItFootnote);

const fileToSlug = new Map();
const titleToSlug = new Map();

for (const file of noteFiles) {
  const title = basename(file);
  const slug = slugify(title);
  fileToSlug.set(file, slug);
  titleToSlug.set(title.toLowerCase(), slug);
}

const rawNotes = noteFiles.map((file) => {
  const markdown = fs.readFileSync(path.join(root, file), "utf8");
  const title = basename(file);
  const slug = fileToSlug.get(file);
  const links = collectWikiLinks(markdown);
  const tags = collectTags(markdown);
  const headings = collectHeadings(markdown);
  const excerpt = collectExcerpt(markdown);

  return {
    file,
    title,
    slug,
    markdown,
    links,
    tags,
    headings,
    excerpt,
  };
});

const backlinks = new Map(rawNotes.map((note) => [note.slug, []]));
for (const note of rawNotes) {
  for (const target of note.links) {
    if (!backlinks.has(target.slug)) backlinks.set(target.slug, []);
    backlinks.get(target.slug).push({
      slug: note.slug,
      title: note.title,
    });
  }
}

const notes = rawNotes.map((note) => {
  const prepared = prepareMarkdown(note.markdown);
  const html = md.render(prepared);

  return {
    file: note.file,
    title: note.title,
    slug: note.slug,
    tags: note.tags,
    headings: note.headings,
    excerpt: note.excerpt,
    links: note.links,
    backlinks: backlinks.get(note.slug) || [],
    html,
  };
});

const tagCounts = new Map();
for (const note of notes) {
  for (const tag of note.tags) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
}

const graph = buildGraph(notes, graphConfig);
const defaultSlug = inferDefaultSlug(workspaceConfig) || notes[0]?.slug || "";
const siteData = {
  defaultSlug,
  notes,
  tags: [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  graph,
  graphConfig: normalizeGraphConfig(graphConfig),
  workspace: {
    lastOpenFiles: workspaceConfig.lastOpenFiles || [],
  },
};
const stylesCss = buildStylesCss();
const appJs = buildAppJs();
const siteDataJs = `window.NOTIVERSE_DATA = ${JSON.stringify(siteData, null, 2)};\n`;
const assetVersion = contentHash(stylesCss, appJs, siteDataJs);

fs.mkdirSync(assetsDir, { recursive: true });

writeFile("index.html", buildIndexHtml(assetVersion));
writeFile("assets/styles.css", stylesCss);
writeFile("assets/app.js", appJs);
writeFile("assets/site-data.js", siteDataJs);
writeFile(".nojekyll", "");

copyKatexAssets();

console.log(`Built ${notes.length} notes into ${path.relative(root, docsDir)}`);

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function basename(file) {
  return path.basename(file, ".md");
}

function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "note";
}

function collectWikiLinks(markdown) {
  const links = [];
  const seen = new Set();
  const wikiLink = /!?\[\[([^\]]+)\]\]/g;
  let match;

  while ((match = wikiLink.exec(markdown))) {
    const rawTarget = match[1].split("|")[0].trim();
    const [rawPage, rawHeading = ""] = rawTarget.split("#");
    const targetTitle = rawPage.trim();
    const slug = titleToSlug.get(targetTitle.toLowerCase());
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    links.push({
      slug,
      title: targetTitle,
      heading: rawHeading.trim(),
    });
  }

  return links;
}

function collectTags(markdown) {
  const tags = new Set();
  const tagPattern = /(^|\s)#([A-Za-z0-9_/-]+)/g;
  let match;

  while ((match = tagPattern.exec(markdown))) {
    tags.add(match[2]);
  }

  return [...tags].sort((a, b) => a.localeCompare(b));
}

function collectHeadings(markdown) {
  const headings = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const match = /^(#{1,4})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = stripMarkdown(match[2]);
    headings.push({
      level: match[1].length,
      text,
      id: headingId(text),
    });
  }
  return headings;
}

function collectExcerpt(markdown) {
  const withoutCallout = markdown.replace(/^>\s*\[![^\]]+\].*$/gm, "");
  const paragraph = withoutCallout
    .split(/\n{2,}/)
    .map((block) => stripMarkdown(block).trim())
    .find((block) => block && !block.startsWith("#") && block.length > 24);
  return paragraph ? paragraph.slice(0, 220) : "";
}

function stripMarkdown(input) {
  return input
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/!?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function prepareMarkdown(markdown) {
  return normalizeDisplayMath(transformCallouts(markdown))
    .replace(/!?\[\[([^\]]+)\]\]/g, (_, body) => {
      const [target, alias] = body.split("|");
      const [page, heading] = target.split("#");
      const title = page.trim();
      const slug = titleToSlug.get(title.toLowerCase());
      const label = (alias || heading || title).trim();
      if (!slug) return `<span class="missing-link">${escapeHtml(label)}</span>`;
      const hash = heading ? `#${headingId(heading.trim())}` : "";
      return `<a class="internal-link" href="#/note/${slug}${hash}">${escapeHtml(label)}</a>`;
    })
    .replace(/(^|\s)#([A-Za-z0-9_/-]+)/g, (_, prefix, tag) => {
      return `${prefix}<a class="tag-link" href="#/tag/${encodeURIComponent(tag)}">#${escapeHtml(tag)}</a>`;
    });
}

function normalizeDisplayMath(markdown) {
  return markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_, body) => {
    const math = body.trim();
    if (!math) return "";
    return `\n\n$$\n${math}\n$$\n\n`;
  });
}

function transformCallouts(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  let callout = null;

  const flushCallout = () => {
    if (!callout) return;
    const body = normalizeDisplayMath(callout.lines.join("\n").trim());
    output.push("");
    output.push(`<div class="callout callout-${escapeHtml(callout.type)}">`);
    output.push(`<div class="callout-title">${escapeHtml(callout.title)}</div>`);
    if (body) output.push(md.render(body));
    output.push("</div>");
    output.push("");
    callout = null;
  };

  for (const line of lines) {
    const start = /^>\s*\[!(\w+)\]\s*(.*)$/.exec(line);
    if (start) {
      flushCallout();
      callout = {
        type: start[1].toLowerCase(),
        title: start[2].trim() || start[1],
        lines: [],
      };
      continue;
    }

    if (callout) {
      const quoted = /^>\s?(.*)$/.exec(line);
      if (quoted) {
        callout.lines.push(quoted[1]);
        continue;
      }
      flushCallout();
    }

    output.push(line);
  }

  flushCallout();
  return output.join("\n");
}

function installMathRule(markdownIt) {
  markdownIt.inline.ruler.before("escape", "math_inline", (state, silent) => {
    const start = state.pos;
    if (state.src[start] !== "$" || state.src[start + 1] === "$") return false;
    const end = state.src.indexOf("$", start + 1);
    if (end < 0) return false;
    if (!silent) {
      const token = state.push("math_inline", "math", 0);
      token.content = state.src.slice(start + 1, end);
    }
    state.pos = end + 1;
    return true;
  });

  markdownIt.block.ruler.before("fence", "math_block", (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const firstLine = state.src.slice(start, max).trim();
    if (firstLine !== "$$") return false;

    let nextLine = startLine + 1;
    let content = "";
    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineEnd = state.eMarks[nextLine];
      const line = state.src.slice(lineStart, lineEnd);
      if (line.trim() === "$$") {
        if (!silent) {
          const token = state.push("math_block", "math", 0);
          token.block = true;
          token.content = content;
          token.map = [startLine, nextLine];
        }
        state.line = nextLine + 1;
        return true;
      }
      content += `${line}\n`;
      nextLine += 1;
    }
    return false;
  });

  markdownIt.renderer.rules.math_inline = (tokens, idx) =>
    renderMath(tokens[idx].content, false);
  markdownIt.renderer.rules.math_block = (tokens, idx) =>
    `<div class="math-block">${renderMath(tokens[idx].content, true)}</div>`;
}

function installHeadingAnchors(markdownIt) {
  markdownIt.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx];
    const inline = tokens[idx + 1];
    const text = inline?.children
      ?.filter((child) => child.type === "text" || child.type === "code_inline")
      .map((child) => child.content)
      .join("") || inline?.content || "";
    return `<${token.tag} id="${headingId(text)}">`;
  };
}

function renderMath(source, displayMode) {
  try {
    return katex.renderToString(source, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      output: "html",
    });
  } catch {
    return `<code>${escapeHtml(source)}</code>`;
  }
}

function buildGraph(notes, config) {
  const colorGroups = normalizeColorGroups(config.colorGroups || []);
  const nodes = notes.map((note) => {
    const color = pickNodeColor(note, colorGroups);
    return {
      id: note.slug,
      title: note.title,
      file: note.file,
      tags: note.tags,
      color,
      radius: 6 + Math.min(7, note.links.length + note.backlinks.length),
      type: note.tags[0] || "note",
    };
  });

  const links = [];
  const seen = new Set();
  for (const note of notes) {
    for (const link of note.links) {
      const key = [note.slug, link.slug].sort().join("::");
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({
        source: note.slug,
        target: link.slug,
      });
    }
  }

  return {
    nodes,
    links,
    colorGroups,
  };
}

function normalizeColorGroups(groups) {
  return groups.map((group) => ({
    query: group.query || "",
    color: rgbIntToHex(group.color?.rgb || 0x8b5cf6),
  }));
}

function normalizeGraphConfig(config) {
  return {
    showTags: Boolean(config.showTags),
    showAttachments: Boolean(config.showAttachments),
    hideUnresolved: Boolean(config.hideUnresolved),
    showOrphans: config.showOrphans !== false,
    showArrow: Boolean(config.showArrow),
    textFadeMultiplier: Number(config.textFadeMultiplier || 0),
    nodeSizeMultiplier: Number(config.nodeSizeMultiplier || 1),
    lineSizeMultiplier: Number(config.lineSizeMultiplier || 1),
    centerStrength: Number(config.centerStrength || 0.5),
    repelStrength: Number(config.repelStrength || 10),
    linkStrength: Number(config.linkStrength || 1),
    linkDistance: Number(config.linkDistance || 250),
    scale: Number(config.scale || 1),
  };
}

function pickNodeColor(note, colorGroups) {
  for (const group of colorGroups) {
    const tag = /tag:#?([A-Za-z0-9_/-]+)/.exec(group.query);
    if (tag && note.tags.includes(tag[1])) return group.color;
  }
  return "#8b5cf6";
}

function rgbIntToHex(value) {
  return `#${Number(value).toString(16).padStart(6, "0").slice(-6)}`;
}

function inferDefaultSlug(workspace) {
  const activeFile = workspace?.main?.children?.[0]?.children?.[0]?.state?.state?.file;
  if (activeFile && fileToSlug.has(activeFile)) return fileToSlug.get(activeFile);

  for (const file of workspace.lastOpenFiles || []) {
    if (fileToSlug.has(file)) return fileToSlug.get(file);
  }

  return null;
}

function headingId(text) {
  return slugify(text);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeFile(relativePath, contents) {
  const file = path.join(docsDir, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function contentHash(...values) {
  const hash = crypto.createHash("sha256");
  for (const value of values) hash.update(value);
  return hash.digest("hex").slice(0, 12);
}

function copyKatexAssets() {
  const katexDir = path.dirname(require.resolve("katex/package.json"));
  const css = fs.readFileSync(path.join(katexDir, "dist", "katex.min.css"), "utf8");
  writeFile("assets/katex.min.css", css);

  const sourceFonts = path.join(katexDir, "dist", "fonts");
  const targetFonts = path.join(assetsDir, "fonts");
  fs.rmSync(targetFonts, { recursive: true, force: true });
  fs.cpSync(sourceFonts, targetFonts, { recursive: true });
}

function buildIndexHtml(assetVersion) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <title>Notiverse</title>
    <link rel="stylesheet" href="assets/katex.min.css?v=${assetVersion}">
    <link rel="stylesheet" href="assets/styles.css?v=${assetVersion}">
  </head>
  <body>
    <div class="app-shell">
      <aside class="ribbon" aria-label="Workspace tools">
        <button class="ribbon-button active" data-route="note" title="Files" aria-label="Files">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/></svg>
        </button>
        <button class="ribbon-button" data-route="graph" title="Graph view" aria-label="Graph view">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="11.5" r="3"/><circle cx="17" cy="6.5" r="3"/><circle cx="17" cy="17.5" r="3"/><path d="m9.6 10.1 4.8-2.4M9.6 12.9l4.8 2.4"/></svg>
        </button>
      </aside>

      <aside class="left-pane" aria-label="Vault navigation">
        <div class="pane-tabs">
          <button class="pane-tab active">Files</button>
        </div>
        <label class="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="search-input" type="search" placeholder="Search notes">
        </label>
        <nav id="file-list" class="file-list"></nav>
        <div class="tag-block">
          <div class="sidebar-title">Tags</div>
          <div id="tag-list" class="tag-list"></div>
        </div>
      </aside>

      <main class="workspace">
        <div class="workspace-tabs">
          <button id="note-tab" class="workspace-tab active">
            <span id="note-tab-title">Note</span>
          </button>
          <button id="graph-tab" class="workspace-tab">
            <svg class="tab-graph-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="11.5" r="3"/><circle cx="17" cy="6.5" r="3"/><circle cx="17" cy="17.5" r="3"/><path d="m9.6 10.1 4.8-2.4M9.6 12.9l4.8 2.4"/></svg>
            <span>Graph view</span>
          </button>
          <div class="top-actions">
            <button id="right-sidebar-toggle" class="top-action-button active" title="Toggle right sidebar" aria-label="Toggle right sidebar" aria-pressed="true">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="5" width="15" height="14" rx="2.5"/><path d="M15.5 7.5v9"/></svg>
            </button>
          </div>
        </div>

        <section id="note-view" class="view note-view">
          <article id="note-content" class="markdown-body"></article>
        </section>

        <section id="graph-view" class="view graph-view hidden">
          <canvas id="graph-canvas"></canvas>
          <div class="graph-toolbar" aria-label="Graph controls">
            <button id="fit-graph" title="Fit graph" aria-label="Fit graph">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4M16 21h4a1 1 0 0 0 1-1v-4"/></svg>
            </button>
            <button id="pause-graph" title="Pause layout" aria-label="Pause layout">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
            </button>
          </div>
          <div id="graph-tip" class="graph-tip hidden"></div>
        </section>
      </main>

      <aside class="right-pane" aria-label="Context">
        <div class="context-card">
          <div class="sidebar-title">Backlinks</div>
          <div id="backlink-list" class="context-list"></div>
        </div>
        <div class="context-card">
          <div class="sidebar-title">Outgoing links</div>
          <div id="outgoing-list" class="context-list"></div>
        </div>
        <div class="context-card">
          <div class="sidebar-title">Outline</div>
          <div id="outline-list" class="context-list outline-list"></div>
        </div>
      </aside>
    </div>
    <script src="assets/site-data.js?v=${assetVersion}"></script>
    <script src="assets/app.js?v=${assetVersion}"></script>
  </body>
</html>
`;
}

function buildStylesCss() {
  return `:root {
  color-scheme: dark;
  --bg: #19151f;
  --bg-deep: #100e14;
  --surface: #211b2b;
  --surface-2: #272131;
  --surface-3: #31283d;
  --border: #3b3148;
  --border-soft: #30283a;
  --text: #d9d2e8;
  --text-bright: #f2edff;
  --muted: #91879f;
  --faint: #6e637c;
  --accent: #8b5cf6;
  --accent-2: #b38cff;
  --green: #64d39b;
  --blue: #66b7ff;
  --orange: #f0a45d;
  --danger: #ef6f8f;
  --shadow: #08060c;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  background: var(--bg-deep);
  color: var(--text);
}

body {
  overflow: hidden;
}

button,
input {
  font: inherit;
}

button {
  color: inherit;
}

a {
  color: var(--accent-2);
  text-decoration: none;
}

a:hover {
  color: var(--text-bright);
  text-decoration: underline;
}

.app-shell {
  display: grid;
  grid-template-columns: 44px minmax(200px, 250px) minmax(0, 1fr) var(--right-pane-width);
  height: 100vh;
  min-height: 0;
  background: var(--bg);
  --right-pane-width: 280px;
  transition: grid-template-columns 140ms ease-out;
}

.app-shell.right-pane-hidden {
  --right-pane-width: 0px;
}

.ribbon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 6px;
  border-right: 1px solid var(--border-soft);
  background: #15111b;
}

.ribbon-button,
.graph-toolbar button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.ribbon-button:hover,
.ribbon-button.active,
.graph-toolbar button:hover {
  background: var(--surface-3);
  border-color: var(--border);
}

.ribbon-button svg,
.graph-toolbar svg,
.search-box svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ribbon-button svg path:first-child:not(:only-child) {
  fill: none;
}

.left-pane,
.right-pane {
  min-width: 0;
  overflow: hidden;
  background: var(--surface);
}

.left-pane {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-soft);
}

.right-pane {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  border-left: 1px solid var(--border-soft);
  opacity: 1;
  visibility: visible;
  transition: opacity 100ms ease-out, padding 140ms ease-out, border-color 140ms ease-out;
}

.app-shell.right-pane-hidden .right-pane {
  width: 0;
  padding: 12px 0;
  border-left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.pane-tabs,
.workspace-tabs {
  display: flex;
  align-items: stretch;
  height: 38px;
  border-bottom: 1px solid var(--border-soft);
  background: #18131f;
}

.pane-tab,
.workspace-tab {
  border: 0;
  border-right: 1px solid var(--border-soft);
  border-radius: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.pane-tab {
  padding: 0 14px;
  font-size: 12px;
}

.pane-tab.active,
.workspace-tab.active {
  background: var(--surface);
  color: var(--text-bright);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px;
  padding: 6px 9px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #16121d;
  color: var(--faint);
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font-size: 13px;
}

.file-list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 8px 10px;
}

.file-item,
.context-link,
.tag-pill {
  display: flex;
  align-items: center;
  min-width: 0;
  border-radius: 4px;
  color: var(--text);
}

.file-item {
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
}

.file-item:hover,
.file-item.active,
.context-link:hover,
.tag-pill:hover,
.tag-pill.active {
  background: var(--surface-3);
  text-decoration: none;
}

.file-title,
.workspace-tab span:last-child,
.context-link span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-block {
  padding: 8px 12px 14px;
  border-top: 1px solid var(--border-soft);
}

.sidebar-title {
  margin-bottom: 8px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-pill {
  padding: 3px 7px;
  border: 1px solid var(--border);
  font-size: 12px;
}

.workspace {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  background: var(--bg);
}

.workspace-tabs {
  flex: 0 0 auto;
}

.workspace-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 270px;
  padding: 0 14px;
  font-size: 13px;
}

.top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  padding: 0 8px;
}

.top-action-button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.top-action-button:hover {
  border-color: var(--border);
  background: var(--surface-3);
  color: var(--text-bright);
}

.top-action-button.active {
  color: var(--text-bright);
}

.top-action-button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tab-graph-icon {
  width: 17px;
  height: 17px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.view {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.view.hidden {
  display: none;
}

.note-view {
  overflow: auto;
  background: #1b1622;
}

.markdown-body {
  width: min(880px, calc(100% - 52px));
  margin: 0 auto;
  padding: 42px 0 84px;
  color: var(--text);
  line-height: 1.68;
  font-size: 16px;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  color: var(--text-bright);
  line-height: 1.25;
  letter-spacing: 0;
}

.markdown-body h1 {
  margin: 0 0 26px;
  font-size: 30px;
}

.markdown-body h2 {
  margin: 34px 0 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-soft);
  font-size: 23px;
}

.markdown-body h3 {
  margin: 26px 0 10px;
  font-size: 19px;
}

.markdown-body h4 {
  margin: 22px 0 8px;
  font-size: 16px;
}

.markdown-body p,
.markdown-body ul,
.markdown-body ol,
.markdown-body blockquote,
.markdown-body pre,
.markdown-body table {
  margin: 12px 0;
}

.markdown-body code {
  padding: 0.12em 0.32em;
  border-radius: 3px;
  background: #100d15;
  color: #d7c5ff;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.9em;
}

.markdown-body pre {
  overflow: auto;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #100d15;
}

.markdown-body pre code {
  padding: 0;
  background: transparent;
}

.markdown-body blockquote {
  margin-left: 0;
  padding: 6px 0 6px 16px;
  border-left: 3px solid var(--border);
  color: var(--muted);
}

.markdown-body hr {
  border: 0;
  border-top: 1px solid var(--border-soft);
  margin: 28px 0;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
}

.markdown-body th,
.markdown-body td {
  padding: 8px 10px;
  border: 1px solid var(--border);
}

.internal-link,
.tag-link {
  color: #b899ff;
}

.missing-link {
  color: var(--danger);
}

.callout {
  margin: 16px 0;
  padding: 11px 14px;
  border: 1px solid #4f4260;
  border-left: 4px solid var(--accent);
  border-radius: 4px;
  background: #20192a;
}

.callout-title {
  margin-bottom: 6px;
  color: var(--text-bright);
  font-weight: 650;
}

.callout p {
  margin: 6px 0;
}

.math-block {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
}

.right-pane .context-card {
  min-height: 0;
}

.context-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 28vh;
  overflow: auto;
}

.context-link {
  gap: 7px;
  padding: 5px 7px;
  color: var(--text);
  font-size: 12px;
}

.context-empty {
  color: var(--faint);
  font-size: 12px;
}

.outline-list .context-link {
  color: var(--muted);
}

.outline-level-2 {
  padding-left: 14px;
}

.outline-level-3,
.outline-level-4 {
  padding-left: 24px;
}

.graph-view {
  background: #15111b;
}

#graph-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}

#graph-canvas.dragging {
  cursor: grabbing;
}

.graph-toolbar {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #211b2b;
}

.graph-tip {
  position: absolute;
  z-index: 3;
  max-width: 260px;
  padding: 7px 9px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #100d15;
  color: var(--text-bright);
  font-size: 12px;
  pointer-events: none;
}

.hidden {
  display: none;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: #4a3c5c;
  border: 2px solid var(--surface);
}

::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 1040px) {
  .app-shell {
    grid-template-columns: minmax(0, 1fr);
    --right-pane-width: 0px;
  }

  .ribbon,
  .left-pane,
  .right-pane {
    display: none;
  }

  .top-actions {
    display: none;
  }

  .workspace-tabs {
    height: 44px;
  }
}

@media (max-width: 760px) {
  body {
    overflow: auto;
  }

  .app-shell {
    grid-template-columns: minmax(0, 1fr);
    height: 100dvh;
  }

  .workspace {
    min-width: 0;
  }

  .markdown-body {
    width: calc(100% - 32px);
    padding-top: 28px;
    font-size: 15px;
  }
}
`;
}

function buildAppJs() {
  return `(() => {
  const data = window.NOTIVERSE_DATA;
  const notes = data.notes;
  const noteBySlug = new Map(notes.map((note) => [note.slug, note]));
  const graphConfig = data.graphConfig;

  const elements = {
    fileList: document.getElementById("file-list"),
    tagList: document.getElementById("tag-list"),
    search: document.getElementById("search-input"),
    noteView: document.getElementById("note-view"),
    graphView: document.getElementById("graph-view"),
    noteContent: document.getElementById("note-content"),
    noteTab: document.getElementById("note-tab"),
    noteTabTitle: document.getElementById("note-tab-title"),
    graphTab: document.getElementById("graph-tab"),
    rightSidebarToggle: document.getElementById("right-sidebar-toggle"),
    backlinkList: document.getElementById("backlink-list"),
    outgoingList: document.getElementById("outgoing-list"),
    outlineList: document.getElementById("outline-list"),
    canvas: document.getElementById("graph-canvas"),
    tip: document.getElementById("graph-tip"),
    fitGraph: document.getElementById("fit-graph"),
    pauseGraph: document.getElementById("pause-graph"),
  };

  let currentSlug = data.defaultSlug || notes[0]?.slug;
  let currentTag = null;
  let currentView = "note";
  let rightSidebarVisible = true;

  renderSidebar();
  bindEvents();
  const graph = createGraph(elements.canvas, data.graph, graphConfig, {
    onOpen: (slug) => navigateNote(slug),
    onHover: showGraphTip,
  });
  window.NOTIVERSE_GRAPH = graph;

  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();

  if (window.EventSource && location.hostname === "localhost") {
    const events = new EventSource("/__events");
    events.addEventListener("reload", () => location.reload());
  }

  function bindEvents() {
    elements.search.addEventListener("input", renderSidebar);
    elements.noteTab.addEventListener("click", () => navigateNote(currentSlug));
    elements.graphTab.addEventListener("click", () => navigateGraph());
    elements.rightSidebarToggle.addEventListener("click", toggleRightSidebar);
    elements.fitGraph.addEventListener("click", () => graph.fit());
    elements.pauseGraph.addEventListener("click", () => graph.togglePause());
    window.addEventListener("resize", handleWindowResize);

    document.querySelectorAll("[data-route]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.route === "graph") navigateGraph();
        if (button.dataset.route === "note") navigateNote(currentSlug);
      });
    });
  }

  function routeFromHash() {
    const hash = decodeURIComponent(location.hash || "");
    if (hash.startsWith("#/graph")) {
      showGraph();
      return;
    }
    if (hash.startsWith("#/tag/")) {
      currentTag = hash.slice("#/tag/".length);
      renderSidebar();
      const first = notes.find((note) => note.tags.includes(currentTag));
      if (first) renderNote(first.slug);
      return;
    }
    if (hash.startsWith("#/note/")) {
      const target = hash.slice("#/note/".length).split("#")[0];
      currentTag = null;
      renderSidebar();
      renderNote(noteBySlug.has(target) ? target : currentSlug);
      return;
    }
    navigateNote(currentSlug);
  }

  function navigateNote(slug) {
    location.hash = "#/note/" + encodeURIComponent(slug || currentSlug);
  }

  function navigateGraph() {
    location.hash = "#/graph";
  }

  function renderNote(slug) {
    const note = noteBySlug.get(slug) || notes[0];
    if (!note) return;
    currentSlug = note.slug;
    currentView = "note";

    elements.noteView.classList.remove("hidden");
    elements.graphView.classList.add("hidden");
    elements.noteTab.classList.add("active");
    elements.graphTab.classList.remove("active");
    elements.noteTabTitle.textContent = note.title;
    elements.noteContent.innerHTML = '<h1>' + escapeHtml(note.title) + '</h1>' + note.html;

    renderContext(note);
    updateActiveStates();
    graph.setActive(note.slug);
    setRibbon("note");

    requestAnimationFrame(() => {
      const anchor = decodeURIComponent(location.hash.split("#").slice(2).join("#"));
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: "start" });
      else elements.noteView.scrollTop = 0;
    });
  }

  function showGraph() {
    currentView = "graph";
    elements.noteView.classList.add("hidden");
    elements.graphView.classList.remove("hidden");
    elements.noteTab.classList.remove("active");
    elements.graphTab.classList.add("active");
    setRibbon("graph");
    requestAnimationFrame(() => {
      graph.resize();
      graph.fit();
      graph.warm();
      setTimeout(() => currentView === "graph" && graph.fit(), 250);
      setTimeout(() => currentView === "graph" && graph.fit(), 900);
    });
  }

  function renderSidebar() {
    const query = elements.search.value.trim().toLowerCase();
    const filtered = notes.filter((note) => {
      const matchesQuery = !query || note.title.toLowerCase().includes(query) || note.excerpt.toLowerCase().includes(query);
      const matchesTag = !currentTag || note.tags.includes(currentTag);
      return matchesQuery && matchesTag;
    });

    elements.fileList.innerHTML = filtered
      .map((note) => '<a class="file-item" data-slug="' + note.slug + '" href="#/note/' + encodeURIComponent(note.slug) + '"><span class="file-title">' + escapeHtml(note.title) + '</span></a>')
      .join("");

    elements.tagList.innerHTML = data.tags
      .map((tag) => '<a class="tag-pill" data-tag="' + escapeHtml(tag.name) + '" href="#/tag/' + encodeURIComponent(tag.name) + '">#' + escapeHtml(tag.name) + ' <span>' + tag.count + '</span></a>')
      .join("");

    updateActiveStates();
  }

  function renderContext(note) {
    elements.backlinkList.innerHTML = renderContextLinks(note.backlinks);
    elements.outgoingList.innerHTML = renderContextLinks(note.links);
    elements.outlineList.innerHTML = note.headings.length
      ? note.headings.map((heading) => '<a class="context-link outline-level-' + heading.level + '" href="#/note/' + encodeURIComponent(note.slug) + '#' + encodeURIComponent(heading.id) + '"><span>' + escapeHtml(heading.text) + '</span></a>').join("")
      : '<div class="context-empty">No headings</div>';
  }

  function renderContextLinks(links) {
    if (!links.length) return '<div class="context-empty">No links</div>';
    return links.map((link) => '<a class="context-link" href="#/note/' + encodeURIComponent(link.slug) + '"><span>' + escapeHtml(link.title) + '</span></a>').join("");
  }

  function updateActiveStates() {
    document.querySelectorAll(".file-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.slug === currentSlug);
    });
    document.querySelectorAll(".tag-pill").forEach((item) => {
      item.classList.toggle("active", item.dataset.tag === currentTag);
    });
  }

  function setRibbon(route) {
    document.querySelectorAll(".ribbon-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.route === route);
    });
  }

  function toggleRightSidebar() {
    rightSidebarVisible = !rightSidebarVisible;
    document.querySelector(".app-shell").classList.toggle("right-pane-hidden", !rightSidebarVisible);
    elements.rightSidebarToggle.classList.toggle("active", rightSidebarVisible);
    elements.rightSidebarToggle.setAttribute("aria-pressed", String(rightSidebarVisible));
    if (currentView === "graph") requestAnimationFrame(() => {
      graph.resize();
      graph.fit();
    });
  }

  function handleWindowResize() {
    if (currentView !== "graph") return;
    requestAnimationFrame(() => {
      graph.resize();
      graph.fit();
      setTimeout(() => currentView === "graph" && graph.fit(), 160);
    });
  }

  function showGraphTip(node, point) {
    if (!node) {
      elements.tip.classList.add("hidden");
      return;
    }
    elements.tip.classList.remove("hidden");
    elements.tip.textContent = node.title;
    elements.tip.style.left = Math.round(point.x + 14) + "px";
    elements.tip.style.top = Math.round(point.y + 14) + "px";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function createGraph(canvas, sourceGraph, config, callbacks) {
    const ctx = canvas.getContext("2d");
    const nodes = sourceGraph.nodes.map((node, index) => ({
      ...node,
      x: Math.cos(index * 2.399) * 180,
      y: Math.sin(index * 2.399) * 180,
      vx: 0,
      vy: 0,
      fixed: false,
    }));
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const links = sourceGraph.links
      .map((link) => ({ source: byId.get(link.source), target: byId.get(link.target) }))
      .filter((link) => link.source && link.target);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let camera = { x: 0, y: 0, scale: clamp(config.scale || 1, 0.55, 2.4) };
    let alpha = 1;
    let running = true;
    let draggingNode = null;
    let draggingCanvas = false;
    let lastPointer = null;
    let movedPointer = false;
    let activeId = null;
    let hovered = null;

    requestAnimationFrame(() => {
      resize();
      tick();
    });
    window.addEventListener("resize", resize);

    canvas.addEventListener("pointerdown", (event) => {
      const point = eventPoint(event);
      const node = pickNode(point);
      lastPointer = point;
      movedPointer = false;
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("dragging");
      if (node) {
        draggingNode = node;
        node.fixed = true;
        const world = screenToWorld(point);
        node.x = world.x;
        node.y = world.y;
      } else {
        draggingCanvas = true;
      }
    });

    canvas.addEventListener("pointermove", (event) => {
      const point = eventPoint(event);
      if (lastPointer && distance(point, lastPointer) > 2) movedPointer = true;
      if (draggingNode) {
        const world = screenToWorld(point);
        draggingNode.x = world.x;
        draggingNode.y = world.y;
        draggingNode.vx = 0;
        draggingNode.vy = 0;
        alpha = Math.max(alpha, 0.35);
      } else if (draggingCanvas && lastPointer) {
        camera.x += point.x - lastPointer.x;
        camera.y += point.y - lastPointer.y;
      } else {
        const node = pickNode(point);
        if (node !== hovered) {
          hovered = node;
          callbacks.onHover?.(node, point);
        } else if (node) {
          callbacks.onHover?.(node, point);
        }
      }
      lastPointer = point;
      draw();
    });

    canvas.addEventListener("pointerup", (event) => {
      const point = eventPoint(event);
      const clicked = draggingNode && !movedPointer ? draggingNode : pickNode(point);
      if (draggingNode) draggingNode.fixed = false;
      if (clicked && !draggingCanvas) callbacks.onOpen?.(clicked.id);
      draggingNode = null;
      draggingCanvas = false;
      lastPointer = null;
      movedPointer = false;
      canvas.classList.remove("dragging");
    });

    canvas.addEventListener("pointerleave", () => {
      hovered = null;
      callbacks.onHover?.(null);
    });

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const point = eventPoint(event);
      const before = screenToWorld(point);
      const zoom = Math.exp(-event.deltaY * 0.001);
      camera.scale = clamp(camera.scale * zoom, 0.25, 4);
      const after = worldToScreen(before);
      camera.x += point.x - after.x;
      camera.y += point.y - after.y;
      draw();
    }, { passive: false });

    canvas.addEventListener("dblclick", (event) => {
      const node = pickNode(eventPoint(event));
      if (node) callbacks.onOpen?.(node.id);
    });

    function tick() {
      if (running) simulate();
      draw();
      requestAnimationFrame(tick);
    }

    function simulate() {
      if (alpha < 0.01) return;
      const center = (config.centerStrength || 0.5) * 0.012;
      const repel = (config.repelStrength || 10) * 7.5;
      const linkDistance = config.linkDistance || 250;
      const linkStrength = (config.linkStrength || 1) * 0.006;

      for (const node of nodes) {
        node.vx += -node.x * center * alpha;
        node.vy += -node.y * center * alpha;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let distSq = dx * dx + dy * dy;
          if (distSq < 0.01) {
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
            distSq = dx * dx + dy * dy;
          }
          const force = repel * alpha / distSq;
          a.vx -= dx * force;
          a.vy -= dy * force;
          b.vx += dx * force;
          b.vy += dy * force;
        }
      }

      for (const link of links) {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const force = (dist - linkDistance) * linkStrength * alpha;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        link.source.vx += fx;
        link.source.vy += fy;
        link.target.vx -= fx;
        link.target.vy -= fy;
      }

      for (const node of nodes) {
        if (!node.fixed) {
          node.vx *= 0.86;
          node.vy *= 0.86;
          node.x += node.vx;
          node.y += node.vy;
          if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
            node.x = (Math.random() - 0.5) * 200;
            node.y = (Math.random() - 0.5) * 200;
            node.vx = 0;
            node.vy = 0;
          }
        }
      }

      alpha *= 0.985;
    }

    function draw() {
      if (width < 10 || height < 10) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(camera.x + width / 2, camera.y + height / 2);
      ctx.scale(camera.scale, camera.scale);

      ctx.lineWidth = (config.lineSizeMultiplier || 1) / camera.scale;
      for (const link of links) {
        const active = activeId && (link.source.id === activeId || link.target.id === activeId);
        ctx.strokeStyle = active ? "rgba(184, 153, 255, 0.72)" : "rgba(117, 104, 137, 0.32)";
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
      }

      for (const node of nodes) {
        const radius = node.radius * (config.nodeSizeMultiplier || 1);
        const isActive = node.id === activeId;
        const isHovered = node === hovered;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + (isActive ? 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#f2edff" : node.color;
        ctx.fill();
        ctx.lineWidth = (isHovered || isActive ? 2.3 : 1.2) / camera.scale;
        ctx.strokeStyle = isHovered || isActive ? "#d8c5ff" : "#2f263a";
        ctx.stroke();

        const shouldShowLabel = camera.scale > 0.75 || isHovered || isActive;
        if (shouldShowLabel) {
          ctx.font = \`\${12 / camera.scale}px Inter, system-ui, sans-serif\`;
          ctx.fillStyle = isActive ? "#f2edff" : "rgba(217, 210, 232, 0.86)";
          ctx.textAlign = "center";
          ctx.fillText(node.title, node.x, node.y + radius + 15 / camera.scale);
        }
      }

      ctx.restore();
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return false;
      dpr = window.devicePixelRatio || 1;
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      return true;
    }

    function fit() {
      if (!nodes.length) return;
      const minX = Math.min(...nodes.map((node) => node.x));
      const maxX = Math.max(...nodes.map((node) => node.x));
      const minY = Math.min(...nodes.map((node) => node.y));
      const maxY = Math.max(...nodes.map((node) => node.y));
      const graphWidth = Math.max(1, maxX - minX);
      const graphHeight = Math.max(1, maxY - minY);
      camera.scale = clamp(Math.min(width / (graphWidth + 180), height / (graphHeight + 180)), 0.35, 2.2);
      camera.x = -((minX + maxX) / 2) * camera.scale;
      camera.y = -((minY + maxY) / 2) * camera.scale;
      alpha = Math.max(alpha, 0.25);
      draw();
    }

    function warm() {
      alpha = Math.max(alpha, 0.4);
      draw();
    }

    function togglePause() {
      running = !running;
      if (running) alpha = Math.max(alpha, 0.25);
    }

    function setActive(id) {
      activeId = id;
      draw();
    }

    function pickNode(point) {
      const world = screenToWorld(point);
      for (let i = nodes.length - 1; i >= 0; i -= 1) {
        const node = nodes[i];
        const radius = node.radius + 6 / camera.scale;
        if (Math.hypot(world.x - node.x, world.y - node.y) <= radius) return node;
      }
      return null;
    }

    function screenToWorld(point) {
      return {
        x: (point.x - width / 2 - camera.x) / camera.scale,
        y: (point.y - height / 2 - camera.y) / camera.scale,
      };
    }

    function worldToScreen(point) {
      return {
        x: point.x * camera.scale + width / 2 + camera.x,
        y: point.y * camera.scale + height / 2 + camera.y,
      };
    }

    function nodeScreenPositions() {
      const rect = canvas.getBoundingClientRect();
      return nodes.map((node) => {
        const point = worldToScreen(node);
        return {
          id: node.id,
          title: node.title,
          x: rect.left + point.x,
          y: rect.top + point.y,
        };
      });
    }

    function eventPoint(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function distance(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    return { resize, fit, warm, togglePause, setActive, nodeScreenPositions };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
`;
}
