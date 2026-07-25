const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs");
const port = Number(process.env.PORT || 4173);
const clients = new Set();
let buildTimer = null;
let building = false;

build();

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === "/__events") {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    response.write("\n");
    clients.add(response);
    request.on("close", () => clients.delete(response));
    return;
  }

  const file = resolveRequestPath(url.pathname);
  if (!file.startsWith(docsDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, contents) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType(file) });
    response.end(contents);
  });
});

server.listen(port, () => {
  console.log(`Notiverse dev server: http://localhost:${port}`);
});

// Recursive so that edits inside `*.world/` folders (where every note now lives)
// and inside `.obsidian/` trigger a rebuild.
watch(root);

function resolveRequestPath(pathname) {
  const safePath = decodeURIComponent(pathname)
    .replace(/^\/+/, "")
    .replace(/\.\.+/g, "");
  const file = safePath ? path.join(docsDir, safePath) : path.join(docsDir, "index.html");
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    return path.join(file, "index.html");
  }
  return fs.existsSync(file) ? file : path.join(docsDir, "index.html");
}

function contentType(file) {
  const ext = path.extname(file);
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
  }[ext] || "application/octet-stream";
}

function watch(dir) {
  fs.watch(dir, { recursive: true }, (event, filename) => {
    if (!filename || shouldIgnore(filename)) return;
    scheduleBuild();
  });
}

function shouldIgnore(filename) {
  const normalized = filename.toString();
  return (
    normalized.startsWith("docs") ||
    normalized.startsWith("node_modules") ||
    normalized.startsWith(".git") ||
    normalized === "package-lock.json" ||
    normalized.endsWith(".swp") ||
    normalized.endsWith("~")
  );
}

function scheduleBuild() {
  clearTimeout(buildTimer);
  buildTimer = setTimeout(() => {
    build();
    for (const client of clients) client.write("event: reload\ndata: now\n\n");
  }, 180);
}

function build() {
  if (building) return;
  building = true;
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "build-site.js")], {
    cwd: root,
    stdio: "inherit",
  });
  building = false;
  if (result.status !== 0) {
    console.error("Build failed");
  }
}
