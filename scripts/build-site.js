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

const WORLD_SUFFIX = ".world";

const worldDirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.endsWith(WORLD_SUFFIX))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

// Only *.world folders are published. With no world folder present the vault
// root is treated as a single implicit world so the build still produces a site.
const worldSources = worldDirs.length
  ? worldDirs.map((dir) => ({ dir, name: dir.slice(0, -WORLD_SUFFIX.length) }))
  : [{ dir: "", name: "Vault" }];

const noteFiles = worldSources.flatMap((world) =>
  collectMarkdown(path.join(root, world.dir))
    .map((file) => path.relative(root, file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({ file, world: world.name, worldDir: world.dir })),
);

const graphConfig = readJson(path.join(vaultConfigDir, "graph.json"), {});

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

installMathRule(md);
installHeadingAnchors(md);
md.use(markdownItFootnote);

// Slugs live in one flat namespace because routes are `#/note/<slug>`. Two notes
// in different worlds may legitimately share a title, so collisions get a short
// deterministic suffix derived from the source path.
const fileToSlug = new Map();
const slugToFile = new Map();
const titleIndex = new Map();
const usedWorldSlugs = new Set();

// Per-note render state, set by renderNoteHtml and read by the markdown-it rules.
let renderContext = null;

for (const entry of noteFiles) {
  const title = basename(entry.file);
  const slug = uniqueSlug(slugify(title), entry.file);
  entry.title = title;
  entry.slug = slug;
  fileToSlug.set(entry.file, slug);
  slugToFile.set(slug, entry.file);

  const key = title.toLowerCase();
  if (!titleIndex.has(key)) titleIndex.set(key, []);
  titleIndex.get(key).push({ slug, title, world: entry.world });
}

// Two-pass render: the first pass only exists to learn each note's heading ids
// so that `[[Note#Heading]]` links in the second pass can resolve against them.
const headingsBySlug = new Map();
const unresolved = [];

for (const entry of noteFiles) {
  entry.markdown = fs.readFileSync(path.join(root, entry.file), "utf8");
  renderNoteHtml(entry, { collectOnly: true });
}

const rawNotes = noteFiles.map((entry) => ({
  file: entry.file,
  world: entry.world,
  worldDir: entry.worldDir,
  title: entry.title,
  slug: entry.slug,
  markdown: entry.markdown,
  links: collectLinks(entry),
  tags: collectTags(entry.markdown),
  excerpt: collectExcerpt(entry.markdown),
}));

const worldOfSlug = new Map(rawNotes.map((note) => [note.slug, note.world]));

const backlinks = new Map(rawNotes.map((note) => [note.slug, []]));
for (const note of rawNotes) {
  for (const target of note.links) {
    if (!backlinks.has(target.slug)) backlinks.set(target.slug, []);
    backlinks.get(target.slug).push({
      slug: note.slug,
      title: note.title,
      world: note.world,
    });
  }
}

const notes = rawNotes.map((note) => {
  const html = renderNoteHtml(note, { collectOnly: false });

  return {
    file: note.file,
    world: note.world,
    title: note.title,
    slug: note.slug,
    tags: note.tags,
    headings: headingsBySlug.get(note.slug) || [],
    excerpt: note.excerpt,
    links: note.links.map((link) => ({ ...link, world: worldOfSlug.get(link.slug) })),
    backlinks: backlinks.get(note.slug) || [],
    html,
  };
});

// Each world owns its own note list, tag cloud, and graph. Notes stay in one flat
// array on the client so cross-world links can still resolve by slug.
const worlds = worldSources.map((source) => {
  const worldNotes = notes.filter((note) => note.world === source.name);
  const tagCounts = new Map();
  for (const note of worldNotes) {
    for (const tag of note.tags) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }

  return {
    name: source.name,
    slug: uniqueWorldSlug(slugify(source.name)),
    dir: source.dir,
    noteSlugs: worldNotes.map((note) => note.slug),
    defaultSlug: worldNotes[0]?.slug || "",
    tags: [...tagCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    graph: buildGraph(worldNotes, graphConfig),
  };
});

if (unresolved.length) {
  console.warn(`\n${unresolved.length} unresolved link(s):`);
  for (const item of unresolved) console.warn(`  ${item.file}: ${item.target}`);
  console.warn("");
}

const siteData = {
  worlds,
  defaultWorld: worlds[0]?.slug || "",
  notes,
  graphConfig: normalizeGraphConfig(graphConfig),
};
const stylesCss = buildStylesCss();
const appJs = buildAppJs();
const siteDataJs = `window.NOTIVERSE_DATA = ${JSON.stringify(siteData, null, 2)};\n`;
const faviconSvg = buildFaviconSvg();
const assetVersion = contentHash(stylesCss, appJs, siteDataJs, faviconSvg);

fs.mkdirSync(assetsDir, { recursive: true });

writeFile("index.html", buildIndexHtml(assetVersion));
writeFile("assets/styles.css", stylesCss);
writeFile("assets/app.js", appJs);
writeFile("assets/site-data.js", siteDataJs);
writeFile("assets/favicon.svg", faviconSvg);
writeFile(".nojekyll", "");

copyKatexAssets();

const worldSummary = worlds.map((world) => `${world.name} (${world.noteSlugs.length})`).join(", ");
console.log(`Built ${notes.length} notes across ${worlds.length} world(s) into ${path.relative(root, docsDir)}: ${worldSummary}`);

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

// Keeps Unicode letters and digits, so CJK titles and headings stay distinguishable.
// Stripping down to ASCII used to collapse most Chinese headings onto one id.
function slugify(text) {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "") || "note";
}

function uniqueSlug(base, file) {
  if (!slugToFile.has(base)) return base;
  const suffix = contentHash(file).slice(0, 4);
  let candidate = `${base}-${suffix}`;
  let counter = 2;
  while (slugToFile.has(candidate)) {
    candidate = `${base}-${suffix}-${counter}`;
    counter += 1;
  }
  return candidate;
}

function uniqueWorldSlug(base) {
  let candidate = base;
  let counter = 2;
  while (usedWorldSlugs.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  usedWorldSlugs.add(candidate);
  return candidate;
}

function collectMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      // A nested *.world folder belongs to its own world, not this one.
      if (entry.name.endsWith(WORLD_SUFFIX)) continue;
      files.push(...collectMarkdown(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

// Wikilinks and relative *.md links both become graph edges. Both are resolved
// against the note's own world first, so two worlds can reuse a note title.
function collectLinks(entry) {
  const links = [];
  const seen = new Set();

  const push = (slug, title, heading) => {
    if (!slug || slug === entry.slug || seen.has(slug)) return;
    seen.add(slug);
    links.push({ slug, title, heading: heading || "" });
  };

  const wikiLink = /!?\[\[([^\]]+)\]\]/g;
  let match;
  while ((match = wikiLink.exec(entry.markdown))) {
    const target = parseWikiTarget(match[1]);
    if (!target.title) continue;
    push(resolveTitle(target.title, entry.world), target.title, target.heading);
  }

  const mdLink = /\[[^\]]*\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g;
  while ((match = mdLink.exec(entry.markdown))) {
    const resolved = resolveRelativeMd(match[1], entry);
    if (resolved) push(resolved.slug, resolved.title, "");
  }

  return links;
}

function parseWikiTarget(body) {
  const rawTarget = body.split("|")[0].trim();
  const hashIndex = rawTarget.indexOf("#");
  if (hashIndex === 0) return { title: "", heading: rawTarget.slice(1).trim() };
  if (hashIndex < 0) return { title: rawTarget, heading: "" };
  return {
    title: rawTarget.slice(0, hashIndex).trim(),
    heading: rawTarget.slice(hashIndex + 1).trim(),
  };
}

// Prefer a note in the same world; fall back to a unique match anywhere.
function resolveTitle(title, world) {
  const candidates = titleIndex.get(title.trim().toLowerCase());
  if (!candidates || !candidates.length) return null;
  const sameWorld = candidates.find((candidate) => candidate.world === world);
  return (sameWorld || candidates[0]).slug;
}

function resolveRelativeMd(href, entry) {
  let decoded = href;
  try {
    decoded = decodeURIComponent(href);
  } catch {
    // Leave the raw href alone if it is not valid percent-encoding.
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(decoded) || decoded.startsWith("/")) return null;

  const target = path.normalize(path.join(path.dirname(entry.file), decoded));
  const slug = fileToSlug.get(target);
  if (!slug) return null;
  return { slug, title: basename(target) };
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

// Heading ids are allocated by the renderer, and the outline is collected from the
// same pass. That keeps `id` attributes and outline links in lockstep even when a
// heading contains math or markup that a separate text-stripping pass would mangle.
function renderNoteHtml(entry, { collectOnly }) {
  renderContext = {
    note: entry,
    usedIds: new Map(),
    headings: [],
    inCallout: false,
  };

  const html = md.render(prepareMarkdown(entry.markdown, entry));
  headingsBySlug.set(entry.slug, renderContext.headings);
  renderContext = null;
  return collectOnly ? "" : html;
}

function allocateHeadingId(text) {
  const base = slugify(text);
  if (!renderContext) return base;
  const seen = renderContext.usedIds.get(base) || 0;
  renderContext.usedIds.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
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

function prepareMarkdown(markdown, entry) {
  return normalizeDisplayMath(transformCallouts(markdown))
    .replace(/!?\[\[([^\]]+)\]\]/g, (_, body) => {
      const alias = body.includes("|") ? body.slice(body.indexOf("|") + 1).trim() : "";
      const { title, heading } = parseWikiTarget(body);
      const label = (alias || heading || title).trim();

      // `[[#Heading]]` is a link inside the current note.
      if (!title) {
        return `<a class="internal-link" href="#${encodeURIComponent(noteHeadingId(entry, heading))}">${escapeHtml(label)}</a>`;
      }

      const slug = resolveTitle(title, entry.world);
      if (!slug) {
        recordUnresolved(entry, `[[${body}]]`);
        return `<span class="missing-link">${escapeHtml(label)}</span>`;
      }
      const hash = heading ? `#${encodeURIComponent(noteHeadingId(slug, heading))}` : "";
      return `<a class="internal-link" href="#/note/${encodeURIComponent(slug)}${hash}">${escapeHtml(label)}</a>`;
    })
    // Relative *.md links (used by the Math I table of contents) point at vault
    // files, which do not exist on the site. Rewrite them into hash routes.
    .replace(/\[([^\]]*)\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g, (whole, label, href, hash) => {
      const resolved = resolveRelativeMd(href, entry);
      if (!resolved) {
        recordUnresolved(entry, href);
        return `<span class="missing-link">${escapeHtml(label || href)}</span>`;
      }
      const anchor = hash ? `#${encodeURIComponent(noteHeadingId(resolved.slug, hash.slice(1)))}` : "";
      return `<a class="internal-link" href="#/note/${encodeURIComponent(resolved.slug)}${anchor}">${escapeHtml(label || resolved.title)}</a>`;
    })
    .replace(/(^|\s)#([A-Za-z0-9_/-]+)/g, (_, prefix, tag) => {
      return `${prefix}<a class="tag-link" href="#/tag/${encodeURIComponent(tag)}">#${escapeHtml(tag)}</a>`;
    });
}

// Resolve a heading reference against the ids the target note actually produced.
// Falls back to a plain slug when the target has not been rendered yet.
function noteHeadingId(slugOrEntry, heading) {
  const text = String(heading || "").trim();
  if (!text) return "";
  const slug = typeof slugOrEntry === "string" ? slugOrEntry : slugOrEntry?.slug;
  const headings = headingsBySlug.get(slug);
  const target = headings?.find((item) => item.text.toLowerCase() === text.toLowerCase());
  return target ? target.id : slugify(text);
}

function recordUnresolved(entry, target) {
  if (!entry) return;
  if (unresolved.some((item) => item.file === entry.file && item.target === target)) return;
  unresolved.push({ file: entry.file, target });
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
    if (body) {
      // This nested render happens before the main pass, so its headings must not
      // land in the outline; ids are still allocated to keep them unique.
      const outer = renderContext?.inCallout;
      if (renderContext) renderContext.inCallout = true;
      output.push(md.render(body));
      if (renderContext) renderContext.inCallout = outer;
    }
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
    const text = headingText(inline);
    const id = allocateHeadingId(text);

    if (renderContext && !renderContext.inCallout) {
      const level = Number(token.tag.slice(1)) || 1;
      if (level <= 4) renderContext.headings.push({ level, text, id });
    }

    return `<${token.tag} id="${id}">`;
  };
}

// Heading text for ids and the outline. Math and links keep their source text so a
// heading like `### 一个经典的洞：$\\sqrt{2}$` still yields a distinguishable id.
function headingText(inline) {
  if (!inline) return "";
  if (!inline.children?.length) return inline.content || "";
  return inline.children
    .map((child) => {
      if (child.type === "text" || child.type === "code_inline") return child.content;
      if (child.type === "math_inline") return child.content;
      if (child.type === "html_inline") return "";
      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
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

// One graph per world: only notes in that world become nodes, and an edge is kept
// only when both endpoints live in the world. Cross-world links still work as
// links, they just do not draw an edge into a graph that lacks the other node.
function buildGraph(worldNotes, config) {
  const colorGroups = normalizeColorGroups(config.colorGroups || []);
  const inWorld = new Set(worldNotes.map((note) => note.slug));

  const nodes = worldNotes.map((note) => {
    const color = pickNodeColor(note, colorGroups);
    const degree =
      note.links.filter((link) => inWorld.has(link.slug)).length +
      note.backlinks.filter((link) => inWorld.has(link.slug)).length;
    return {
      id: note.slug,
      title: note.title,
      file: note.file,
      world: note.world,
      tags: note.tags,
      color,
      radius: 6 + Math.min(7, degree),
      type: note.tags[0] || "note",
    };
  });

  const links = [];
  const seen = new Set();
  for (const note of worldNotes) {
    for (const link of note.links) {
      if (!inWorld.has(link.slug)) continue;
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
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg?v=${assetVersion}">
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
        <div class="world-switcher">
          <button id="world-button" class="world-button" aria-haspopup="listbox" aria-expanded="false">
            <svg class="world-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5Z"/></svg>
            <span id="world-name" class="world-name">World</span>
            <svg class="world-caret" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m7 10 5 5 5-5"/></svg>
          </button>
          <div id="world-menu" class="world-menu hidden" role="listbox" aria-label="Worlds"></div>
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
            <span id="graph-tab-title">Graph view</span>
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

.workspace-tabs {
  display: flex;
  align-items: stretch;
  height: 38px;
  border-bottom: 1px solid var(--border-soft);
  background: #18131f;
}

.workspace-tab {
  border: 0;
  border-right: 1px solid var(--border-soft);
  border-radius: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.workspace-tab.active {
  background: var(--surface);
  color: var(--text-bright);
}

.world-switcher {
  position: relative;
  flex: 0 0 auto;
  margin: 12px 12px 8px;
}

.world-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #1b1624;
  color: var(--text-bright);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 120ms ease-out, border-color 120ms ease-out;
}

.world-button:hover,
.world-button[aria-expanded="true"] {
  border-color: var(--accent);
  background: var(--surface-3);
}

.world-icon {
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  color: var(--accent-2);
}

.world-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.world-caret {
  flex: 0 0 auto;
  width: 13px;
  height: 13px;
  color: var(--muted);
}

.world-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  right: 0;
  left: 0;
  overflow: hidden auto;
  max-height: 264px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--surface-2);
  box-shadow: 0 12px 26px -12px var(--shadow);
}

.world-option {
  display: flex;
  align-items: baseline;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text);
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
}

.world-option:hover {
  background: var(--surface-3);
}

.world-option.active {
  color: var(--text-bright);
  background: var(--surface-3);
}

.world-option-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.world-option-count {
  flex: 0 0 auto;
  color: var(--faint);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 12px;
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

function buildFaviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 25">
  <path fill="#A88BFA" d="m6.91927 14.5955c.64053-.1907 1.67255-.4839 2.85923-.5565-.71191-1.7968-.88376-3.3691-.74554-4.76905.15962-1.61678.72977-2.9662 1.28554-4.11442.1186-.24501.2326-.47313.3419-.69198.1549-.30984.3004-.60109.4365-.8953.2266-.48978.3948-.92231.4798-1.32416.0836-.39515.0841-.74806-.0148-1.08657-.099-.338982-.3093-.703864-.7093-1.1038132-.5222-.1353116-1.1017-.0165173-1.53613.3742922l-5.15591 4.638241c-.28758.25871-.47636.60929-.53406.99179l-.44455 2.94723c.69903.6179 2.42435 2.41414 3.47374 4.90644.09364.2224.1819.4505.26358.6838z"/>
  <path fill="#A88BFA" d="m2.97347 10.3512c-.02431.1037-.05852.205-.10221.3024l-2.724986 6.0735c-.279882.6238-.15095061 1.3552.325357 1.8457l4.288349 4.4163c2.1899-3.2306 1.87062-6.2699.87032-8.6457-.75846-1.8013-1.90801-3.2112-2.65683-3.9922z"/>
  <path fill="#A88BFA" d="m5.7507 23.5094c.07515.012.15135.0192.2281.0215.81383.0244 2.18251.0952 3.29249.2997.90551.1669 2.70051.6687 4.17761 1.1005 1.1271.3294 2.2886-.5707 2.4522-1.7336.1192-.8481.343-1.8075.7553-2.6869l-.0095.0033c-.6982-1.9471-1.5865-3.2044-2.5178-4.0073-.9284-.8004-1.928-1.1738-2.8932-1.3095-1.60474-.2257-3.07497.1961-4.00103.4682.55465 2.3107.38396 5.0295-1.48417 7.8441z"/>
  <path fill="#A88BFA" d="m17.3708 19.3102c.9267-1.3985 1.5868-2.4862 1.9352-3.0758.1742-.295.1427-.6648-.0638-.9383-.5377-.7126-1.5666-2.1607-2.1272-3.5015-.5764-1.3785-.6624-3.51876-.6673-4.56119-.0019-.39626-.1275-.78328-.3726-1.09465l-3.3311-4.23183c-.0117.19075-.0392.37998-.0788.56747-.1109.52394-.32 1.04552-.5585 1.56101-.1398.30214-.3014.62583-.4646.95284-.1086.21764-.218.4368-.3222.652-.5385 1.11265-1.0397 2.32011-1.1797 3.73901-.1299 1.31514.0478 2.84484.8484 4.67094.1333.0113.2675.0262.4023.0452 1.1488.1615 2.3546.6115 3.4647 1.5685.9541.8226 1.8163 2.0012 2.5152 3.6463z"/>
</svg>
`;
}

function buildAppJs() {
  return `(() => {
  const data = window.NOTIVERSE_DATA;
  const notes = data.notes;
  const noteBySlug = new Map(notes.map((note) => [note.slug, note]));
  const worlds = data.worlds;
  const worldBySlug = new Map(worlds.map((world) => [world.slug, world]));
  const worldByName = new Map(worlds.map((world) => [world.name, world]));
  const graphConfig = data.graphConfig;

  const elements = {
    fileList: document.getElementById("file-list"),
    tagList: document.getElementById("tag-list"),
    search: document.getElementById("search-input"),
    worldButton: document.getElementById("world-button"),
    worldName: document.getElementById("world-name"),
    worldMenu: document.getElementById("world-menu"),
    graphTabTitle: document.getElementById("graph-tab-title"),
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

  let currentWorld = worldBySlug.get(data.defaultWorld) || worlds[0];
  let currentSlug = currentWorld?.defaultSlug || notes[0]?.slug;
  let currentTag = null;
  let currentView = "note";
  let rightSidebarVisible = true;

  renderWorldSwitcher();
  renderSidebar();
  bindEvents();
  const graph = createGraph(elements.canvas, currentWorld?.graph, graphConfig, {
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
    elements.worldButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleWorldMenu();
    });
    elements.worldMenu.addEventListener("click", (event) => {
      const option = event.target.closest(".world-option");
      if (!option) return;
      closeWorldMenu();
      if (option.dataset.world === currentWorld?.slug) return;
      location.hash = "#/world/" + encodeURIComponent(option.dataset.world);
    });
    document.addEventListener("click", (event) => {
      if (!elements.worldMenu.contains(event.target) && event.target !== elements.worldButton) closeWorldMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeWorldMenu();
    });
    elements.rightSidebarToggle.addEventListener("click", toggleRightSidebar);
    elements.fitGraph.addEventListener("click", () => graph.fit());
    elements.pauseGraph.addEventListener("click", () => graph.togglePause());
    elements.noteContent.addEventListener("click", handleNoteContentClick);
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
    if (hash.startsWith("#/world/")) {
      const target = worldBySlug.get(hash.slice("#/world/".length).split("#")[0]);
      if (target) {
        const wasGraph = currentView === "graph";
        setWorld(target);
        // The world route is an action, not a destination: it hands off to the
        // graph or to the world's first note so the hash always names a view.
        if (wasGraph) navigateGraph();
        else navigateNote(target.defaultSlug);
        return;
      }
    }
    if (hash.startsWith("#/graph")) {
      showGraph();
      return;
    }
    if (hash.startsWith("#/tag/")) {
      currentTag = hash.slice("#/tag/".length);
      renderSidebar();
      const first = worldNotes().find((note) => note.tags.includes(currentTag));
      if (first) renderNote(first.slug);
      else renderNote(currentSlug);
      return;
    }
    if (hash.startsWith("#/note/")) {
      const target = hash.slice("#/note/".length).split("#")[0];
      const note = noteBySlug.get(target);
      currentTag = null;
      // A link may point into another world; follow it and switch worlds.
      if (note && note.world !== currentWorld?.name) setWorld(worldByName.get(note.world));
      renderSidebar();
      renderNote(note ? target : currentSlug);
      return;
    }
    navigateNote(currentSlug);
  }

  function navigateNote(slug) {
    location.hash = "#/note/" + encodeURIComponent(slug || currentSlug);
  }

  function worldNotes() {
    if (!currentWorld) return notes;
    return currentWorld.noteSlugs.map((slug) => noteBySlug.get(slug)).filter(Boolean);
  }

  function setWorld(world) {
    if (!world || world === currentWorld) return;
    currentWorld = world;
    currentTag = null;
    elements.search.value = "";
    renderWorldSwitcher();
    renderSidebar();
    graph.setData(world.graph);
    if (currentView === "graph") {
      // Staying in the graph means renderNote never runs, so point the note tab at
      // the new world's default note instead of leaving the old world's note there.
      const fallback = noteBySlug.get(world.defaultSlug);
      if (fallback) {
        currentSlug = fallback.slug;
        elements.noteTabTitle.textContent = fallback.title;
        elements.noteContent.innerHTML = '<h1>' + escapeHtml(fallback.title) + '</h1>' + fallback.html;
        renderContext(fallback);
        updateActiveStates();
        graph.setActive(fallback.slug);
      }
      requestAnimationFrame(() => {
        graph.resize();
        graph.fit();
      });
    }
  }

  function renderWorldSwitcher() {
    elements.worldName.textContent = currentWorld?.name || "Vault";
    elements.worldButton.title = (currentWorld?.name || "Vault") + " · " + (currentWorld?.noteSlugs.length || 0) + " notes";
    if (elements.graphTabTitle) {
      elements.graphTabTitle.textContent = currentWorld ? "Graph view · " + currentWorld.name : "Graph view";
    }
    elements.worldMenu.innerHTML = worlds
      .map((world) => '<button type="button" role="option" class="world-option' + (world === currentWorld ? " active" : "") + '" data-world="' + escapeHtml(world.slug) + '" aria-selected="' + (world === currentWorld) + '"><span class="world-option-name">' + escapeHtml(world.name) + '</span><span class="world-option-count">' + world.noteSlugs.length + '</span></button>')
      .join("");
  }

  function toggleWorldMenu() {
    const open = elements.worldMenu.classList.contains("hidden");
    elements.worldMenu.classList.toggle("hidden", !open);
    elements.worldButton.setAttribute("aria-expanded", String(open));
  }

  function closeWorldMenu() {
    elements.worldMenu.classList.add("hidden");
    elements.worldButton.setAttribute("aria-expanded", "false");
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
      if (anchor) scrollNoteToAnchor(anchor);
      else elements.noteView.scrollTop = 0;
    });
  }

  function handleNoteContentClick(event) {
    const target = event.target instanceof Element ? event.target : event.target.parentElement;
    const link = target?.closest('a[href^="#"]');
    if (!link || !elements.noteContent.contains(link)) return;

    const href = link.getAttribute("href");
    if (!href || href === "#" || href.startsWith("#/")) return;

    const anchor = decodeURIComponent(href.slice(1));
    if (!anchor || !scrollNoteToAnchor(anchor)) return;

    event.preventDefault();
    history.replaceState(null, "", "#/note/" + encodeURIComponent(currentSlug) + "#" + encodeURIComponent(anchor));
  }

  function scrollNoteToAnchor(anchor) {
    const target = document.getElementById(anchor);
    if (!target || !elements.noteContent.contains(target)) return false;

    const viewRect = elements.noteView.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    elements.noteView.scrollTo({
      top: elements.noteView.scrollTop + targetRect.top - viewRect.top - 18,
      behavior: "auto",
    });
    return true;
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
    const filtered = worldNotes().filter((note) => {
      const matchesQuery = !query || note.title.toLowerCase().includes(query) || note.excerpt.toLowerCase().includes(query);
      const matchesTag = !currentTag || note.tags.includes(currentTag);
      return matchesQuery && matchesTag;
    });

    elements.fileList.innerHTML = filtered.length
      ? filtered
          .map((note) => '<a class="file-item" data-slug="' + escapeHtml(note.slug) + '" href="#/note/' + encodeURIComponent(note.slug) + '"><span class="file-title">' + escapeHtml(note.title) + '</span></a>')
          .join("")
      : '<div class="context-empty">No notes</div>';

    const tags = currentWorld?.tags || [];
    elements.tagList.innerHTML = tags.length
      ? tags
          .map((tag) => '<a class="tag-pill" data-tag="' + escapeHtml(tag.name) + '" href="#/tag/' + encodeURIComponent(tag.name) + '">#' + escapeHtml(tag.name) + ' <span>' + tag.count + '</span></a>')
          .join("")
      : '<div class="context-empty">No tags</div>';

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
      setTimeout(() => currentView === "graph" && graph.resize(), 170);
    });
  }

  function handleWindowResize() {
    if (currentView !== "graph") return;
    requestAnimationFrame(() => {
      graph.resize();
      setTimeout(() => currentView === "graph" && graph.resize(), 170);
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
    let nodes = [];
    let byId = new Map();
    let links = [];

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
    let resizeObserver = null;

    setData(sourceGraph);

    requestAnimationFrame(() => {
      resize();
      tick();
    });
    window.addEventListener("resize", resize);
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(canvas);
    }

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

    // Swapping worlds replaces the whole node/link set rather than rebuilding the
    // graph, so the canvas, listeners, and animation loop all survive the switch.
    function setData(nextGraph) {
      const source = nextGraph || { nodes: [], links: [] };
      nodes = source.nodes.map((node, index) => ({
        ...node,
        x: Math.cos(index * 2.399) * 180,
        y: Math.sin(index * 2.399) * 180,
        vx: 0,
        vy: 0,
        fixed: false,
      }));
      byId = new Map(nodes.map((node) => [node.id, node]));
      links = source.links
        .map((link) => ({ source: byId.get(link.source), target: byId.get(link.target) }))
        .filter((link) => link.source && link.target);
      camera = { x: 0, y: 0, scale: clamp(config.scale || 1, 0.55, 2.4) };
      alpha = 1;
      draggingNode = null;
      draggingCanvas = false;
      lastPointer = null;
      movedPointer = false;
      hovered = null;
      callbacks.onHover?.(null);
      draw();
    }

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
      const fitPadding = Math.max(360, Math.min(width, height) * 0.34);
      const fittedScale = Math.min(width / (graphWidth + fitPadding), height / (graphHeight + fitPadding)) * 0.82;
      camera.scale = clamp(fittedScale, 0.28, 1.25);
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

    return { resize, fit, warm, togglePause, setActive, setData, nodeScreenPositions };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
`;
}
