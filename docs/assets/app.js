(() => {
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
    let resizeObserver = null;

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
          ctx.font = `${12 / camera.scale}px Inter, system-ui, sans-serif`;
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

    return { resize, fit, warm, togglePause, setActive, nodeScreenPositions };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
})();
