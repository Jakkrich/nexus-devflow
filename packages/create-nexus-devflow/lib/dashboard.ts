import { spawn } from "node:child_process";
import http from "node:http";

import { readHistory } from "./history.js";
import { readProjectStatus } from "./status.js";

interface DashboardServer {
  close: () => Promise<void>;
  url: string;
}

interface DashboardServerOptions {
  port?: number;
}

const DASHBOARD_HOST = "127.0.0.1";

async function startDashboardServer(
  startPath: string = process.cwd(),
  options: DashboardServerOptions = {}
): Promise<DashboardServer> {
  const initialStatus = await readProjectStatus(startPath);
  const projectRoot = initialStatus.project.root;
  const server = http.createServer((request, response) => {
    void handleRequest(projectRoot, request, response);
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = (): void => {
      server.off("error", onError);
      resolve();
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(options.port ?? 0, DASHBOARD_HOST);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    await closeServer(server);
    throw new Error("Nexus-DevFlow dashboard could not determine its local address.");
  }

  return {
    url: `http://${DASHBOARD_HOST}:${address.port}`,
    close: () => closeServer(server)
  };
}

async function handleRequest(
  projectRoot: string,
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> {
  const method = request.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendResponse(response, method, 405, "text/plain; charset=utf-8", "Method not allowed.\n");
    return;
  }

  const pathname = new URL(request.url || "/", `http://${DASHBOARD_HOST}`).pathname;

  if (pathname === "/") {
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src * 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    );
    sendResponse(response, method, 200, "text/html; charset=utf-8", DASHBOARD_HTML);
    return;
  }

  if (pathname === "/api/status") {
    try {
      const status = await readProjectStatus(projectRoot);
      sendResponse(
        response,
        method,
        200,
        "application/json; charset=utf-8",
        `${JSON.stringify(status)}\n`
      );
    } catch (error: unknown) {
      sendResponse(
        response,
        method,
        500,
        "application/json; charset=utf-8",
        `${JSON.stringify({
          error: error instanceof Error ? error.message : "Unable to read Nexus-DevFlow status."
        })}\n`
      );
    }
    return;
  }

  if (pathname === "/api/history") {
    try {
      const history = await readHistory(projectRoot);
      sendResponse(
        response,
        method,
        200,
        "application/json; charset=utf-8",
        `${JSON.stringify(history)}\n`
      );
    } catch (error: unknown) {
      sendResponse(
        response,
        method,
        500,
        "application/json; charset=utf-8",
        `${JSON.stringify({
          error: error instanceof Error ? error.message : "Unable to read DevFlow history."
        })}\n`
      );
    }
    return;
  }

  if (pathname === "/favicon.ico") {
    sendResponse(response, method, 204, "text/plain; charset=utf-8", "");
    return;
  }

  sendResponse(response, method, 404, "text/plain; charset=utf-8", "Not found.\n");
}

function sendResponse(
  response: http.ServerResponse,
  method: string,
  statusCode: number,
  contentType: string,
  body: string
): void {
  response.statusCode = statusCode;
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", contentType);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(method === "HEAD" ? undefined : body);
}

async function closeServer(server: http.Server): Promise<void> {
  if (!server.listening) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function openDashboard(url: string): Promise<void> {
  const command = process.platform === "darwin"
    ? "open"
    : process.platform === "win32"
      ? "cmd"
      : "xdg-open";
  const args = process.platform === "win32"
    ? ["/c", "start", "", url]
    : [url];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore"
    });

    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

const DASHBOARD_HTML: string = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nexus-DevFlow Dashboard</title>
  <style>
    :root {
      color-scheme: light;
      --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
      --paper: #f5f6f3;
      --surface: rgba(255, 255, 255, .84);
      --surface-solid: #ffffff;
      --surface-muted: #eef1ed;
      --ink: #121817;
      --ink-soft: #45504d;
      --ink-muted: #717b78;
      --line: #d9ded9;
      --line-strong: #bdc7c1;
      --blue: #155eef;
      --blue-dark: #0b43ba;
      --green: #0b7a53;
      --green-soft: #e7f5ee;
      --amber: #9a5700;
      --amber-soft: #fff2d9;
      --red: #a5333f;
      --red-soft: #fdebed;
      --code: #111715;
      --code-line: #2c3532;
      --code-text: #d9dfdc;
      --code-muted: #9ba7a2;
      --code-blue: #76a8ff;
      --code-green: #70d5a9;
      font-family: var(--font-sans);
      background: var(--paper);
      color: var(--ink);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-width: 320px;
      min-height: 100vh;
      background:
        linear-gradient(rgba(21, 94, 239, .09) 1px, transparent 1px),
        linear-gradient(90deg, rgba(21, 94, 239, .09) 1px, transparent 1px),
        radial-gradient(circle at 12% 0%, rgba(21, 94, 239, .08), transparent 34rem),
        var(--paper);
      background-size: 40px 40px, 40px 40px, auto, auto;
      -webkit-font-smoothing: antialiased;
    }

    .shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 38px 0 64px; }

    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 30px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 11px;
      margin-bottom: 28px;
      color: var(--ink);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -.02em;
      cursor: pointer;
    }

    .brand-mark {
      width: 28px;
      height: 28px;
      flex: 0 0 auto;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .brand:hover .brand-mark {
      transform: rotate(15deg) scale(1.12);
    }

    .brand-context { color: var(--ink-muted); font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; }
    .brand-separator { width: 1px; height: 17px; background: var(--line-strong); }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--blue-dark);
      font: 600 11px/1 var(--font-mono);
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .eyebrow::before { width: 22px; height: 1px; content: ""; background: var(--blue); }

    h1 { margin: 13px 0 8px; color: var(--ink); font-size: clamp(32px, 4vw, 50px); letter-spacing: -.045em; }
    .path { max-width: 760px; overflow-wrap: anywhere; color: var(--ink-muted); font: 12px/1.6 var(--font-mono); }

    /* Live indicator dot animation */
    .live {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border: 1px solid var(--line-strong);
      border-radius: 999px;
      background: rgba(255, 255, 255, .92);
      color: var(--ink-soft);
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(18, 24, 23, .06);
      transition: all 0.3s ease;
    }

    @keyframes livePulse {
      0% { box-shadow: 0 0 0 0 rgba(11, 122, 83, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(11, 122, 83, 0); }
      100% { box-shadow: 0 0 0 0 rgba(11, 122, 83, 0); }
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--green);
      animation: livePulse 2s infinite;
    }

    .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }

    /* Staggered Entrance Animations & Hover Motion */
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      grid-column: span 4;
      min-width: 0;
      padding: 22px;
      border: 1px solid rgba(189, 199, 193, .78);
      border-radius: 14px;
      background: var(--surface);
      box-shadow: 0 1px 2px rgba(18, 24, 23, .05), 0 10px 30px rgba(18, 24, 23, .04);
      backdrop-filter: blur(14px);
      animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease, border-color 0.28s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 40px rgba(18, 24, 23, .09), 0 2px 6px rgba(18, 24, 23, .04);
      border-color: rgba(21, 94, 239, 0.4);
    }

    .card:nth-child(1) { animation-delay: 0.04s; }
    .card:nth-child(2) { animation-delay: 0.08s; }
    .card:nth-child(3) { animation-delay: 0.12s; }
    .card:nth-child(4) { animation-delay: 0.16s; }
    .card:nth-child(5) { animation-delay: 0.20s; }
    .card:nth-child(6) { animation-delay: 0.24s; }
    .card:nth-child(7) { animation-delay: 0.28s; }
    .card:nth-child(8) { animation-delay: 0.32s; }

    .card.wide { grid-column: span 8; }
    .card.full { grid-column: 1 / -1; }

    .card-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
    .label { color: var(--blue-dark); font: 600 11px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; }
    .value { color: var(--ink); font-size: 20px; font-weight: 700; letter-spacing: -.02em; }
    .muted { color: var(--ink-muted); font-size: 13px; line-height: 1.6; }

    .pill {
      padding: 5px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--ink-muted);
      background: var(--surface-muted);
      font: 600 10px/1 var(--font-mono);
      letter-spacing: .04em;
      text-transform: uppercase;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .pill:hover { transform: scale(1.06); }
    .pill.ok, .pill.ready, .pill.active { border-color: #b9dfce; background: var(--green-soft); color: var(--green); }
    .pill.warning, .pill.blocked, .pill.needs_verification { border-color: #efd5a5; background: var(--amber-soft); color: var(--amber); }

    .facts { display: grid; gap: 12px; }
    .fact { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; padding-bottom: 11px; border-bottom: 1px solid var(--line); }
    .fact:last-child { padding-bottom: 0; border-bottom: 0; }
    .fact span:first-child { color: var(--ink-muted); font-size: 12px; }
    .fact span:last-child { max-width: 70%; overflow-wrap: anywhere; color: var(--ink-soft); font: 12px/1.45 var(--font-mono); text-align: right; }

    /* Shimmering animated progress bar */
    .progress { height: 8px; margin: 16px 0 10px; overflow: hidden; border-radius: 999px; background: var(--surface-muted); }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .progress-bar {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #155eef 0%, #4785ff 50%, #155eef 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite linear;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Code Panel Glow Motion */
    @keyframes codeGlow {
      0%, 100% { border-color: var(--code-line); box-shadow: 0 24px 80px rgba(18, 24, 23, .12); }
      50% { border-color: rgba(118, 168, 255, 0.35); box-shadow: 0 24px 80px rgba(21, 94, 239, .14); }
    }

    .code-panel {
      color: var(--code-text);
      border-color: var(--code-line);
      background: var(--code);
      animation: codeGlow 4s ease-in-out infinite;
      backdrop-filter: none;
    }
    .code-panel:hover {
      transform: translateY(-2px);
    }
    .code-panel .label { color: var(--code-blue); }
    .code-panel .muted { color: var(--code-muted); }

    .next-action { padding: 24px; }
    .command { margin: 13px 0 8px; color: var(--code-blue); font: 600 clamp(20px, 3vw, 29px)/1.3 var(--font-mono); overflow-wrap: anywhere; }

    ul { margin: 0; padding: 0; list-style: none; }
    li {
      padding: 11px 10px;
      border-bottom: 1px solid var(--line);
      color: var(--ink-soft);
      font-size: 13px;
      line-height: 1.5;
      border-radius: 6px;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }
    li:hover {
      background-color: rgba(21, 94, 239, 0.04);
      transform: translateX(3px);
    }
    li:last-child { border-bottom: 0; }
    li.empty { color: var(--ink-muted); }
    li.empty:hover { background-color: transparent; transform: none; }

    footer { margin-top: 24px; color: var(--ink-muted); font: 11px/1.6 var(--font-mono); }

    @media (max-width: 860px) {
      .card, .card.wide { grid-column: span 6; }
      .card.full { grid-column: 1 / -1; }
    }

    @media (max-width: 620px) {
      .shell { width: min(100% - 24px, 1180px); padding-top: 24px; }
      header { flex-direction: column; }
      .brand { margin-bottom: 22px; }
      .card, .card.wide, .card.full { grid-column: 1 / -1; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <div class="brand">
      <svg class="brand-mark" viewBox="0 0 48 48" role="img" aria-label="Nexus-DevFlow">
        <path fill="#155eef" d="M4 4h25.2L16.3 44H4zM39.7 4H44v40H26.8z"></path>
      </svg>
      <span>Nexus-DevFlow</span>
      <span class="brand-separator" aria-hidden="true"></span>
      <span class="brand-context">Dashboard</span>
    </div>
    <header>
      <div>
        <div class="eyebrow">Local 3-Pillars Workspace Status</div>
        <h1 id="project-name">Loading project...</h1>
        <div class="path" id="project-path">...</div>
      </div>
      <div class="live"><span class="live-dot" id="live-dot"></span><span id="live-label">Connecting</span></div>
    </header>

    <section class="grid">
      <article class="card">
        <div class="card-head"><span class="label">Nexus-DevFlow</span><span class="pill" id="health-pill">Loading</span></div>
        <div class="facts">
          <div class="fact"><span>Version</span><span id="val-version">-</span></div>
          <div class="fact"><span>Adapters</span><span id="val-adapters">-</span></div>
          <div class="fact"><span>Architecture</span><span>3-Pillars Model</span></div>
        </div>
      </article>

      <article class="card wide">
        <div class="card-head"><span class="label">Current Work</span><span class="pill" id="work-pill">Loading</span></div>
        <div class="value" id="work-title">Reading living spec...</div>
        <div class="progress"><span class="progress-bar" id="work-progress-bar"></span></div>
        <div class="muted" id="work-meta">Loading checklist steps...</div>
      </article>

      <article class="card">
        <div class="card-head"><span class="label">Git Status</span><span class="pill" id="git-pill">Loading</span></div>
        <div class="facts">
          <div class="fact"><span>Branch</span><span id="git-branch">-</span></div>
          <div class="fact"><span>Working Tree</span><span id="git-changed">-</span></div>
          <div class="fact"><span>Upstream</span><span id="git-upstream">-</span></div>
        </div>
      </article>

      <article class="card">
        <div class="card-head"><span class="label">Findings</span><span class="value" id="findings-count">-</span></div>
        <ul id="findings-list"><li class="empty">Loading findings...</li></ul>
      </article>

      <article class="card">
        <div class="card-head"><span class="label">Completion</span><span class="pill" id="completion-pill">Loading</span></div>
        <ul id="completion-list"><li class="empty">Checking readiness...</li></ul>
      </article>

      <article class="card">
        <div class="card-head"><span class="label">Attention</span><span class="value" id="warnings-count">-</span></div>
        <ul id="warnings-list"><li class="empty">Loading warnings...</li></ul>
      </article>

      <article class="card full">
        <div class="card-head"><span class="label">Completed Work Archive</span><span class="value" id="history-count">-</span></div>
        <div class="muted">Categorized history of features, fixes, and rollbacks.</div>
        <ul id="history-list"><li class="empty">Loading history archive...</li></ul>
      </article>

      <article class="card full code-panel next-action">
        <span class="label">Next Action</span>
        <div class="command" id="next-command">Loading...</div>
        <div class="muted" id="next-reason"></div>
      </article>
    </section>

    <footer>Read-only local DevFlow 2.0 dashboard. Refreshes every 2 seconds while process is active.</footer>
  </main>

  <script>
    const byId = (id) => document.getElementById(id);
    let refreshing = false;

    function setPill(id, value) {
      const node = byId(id);
      if (!node) return;
      node.textContent = String(value || '').replaceAll("_", " ");
      node.className = "pill " + (value || 'idle');
    }

    function setList(id, values, emptyMessage) {
      const list = byId(id);
      if (!list) return;
      list.replaceChildren();
      const items = values.length > 0 ? values : [emptyMessage];
      for (const value of items) {
        const item = document.createElement("li");
        item.textContent = value;
        if (values.length === 0) item.className = "empty";
        list.append(item);
      }
    }

    async function refreshStatus() {
      if (refreshing) return;
      refreshing = true;
      try {
        const [resStatus, resHistory] = await Promise.all([
          fetch('/api/status'),
          fetch('/api/history').catch(() => null)
        ]);

        if (!resStatus.ok) throw new Error('HTTP ' + resStatus.status);
        const data = await resStatus.json();
        const historyData = resHistory && resHistory.ok ? await resHistory.json() : { items: [] };

        byId('live-dot').style.background = '#0b7a53';
        byId('live-label').textContent = 'Live';

        byId('project-name').textContent = data.project?.name || 'Nexus-DevFlow';
        byId('project-path').textContent = data.project?.root || '';

        setPill('health-pill', data.health || 'ok');
        byId('val-version').textContent = data.devflow?.version ? 'v' + data.devflow.version : '-';
        byId('val-adapters').textContent = (data.devflow?.adapters || []).join(', ') || 'none';

        const work = data.currentWork || {};
        setPill('work-pill', work.state || 'idle');
        byId('work-title').textContent = work.title || 'No active run in progress';
        byId('work-meta').textContent = work.state === 'active'
          ? (work.completed + ' of ' + work.total + ' steps completed')
          : 'Workspace is idle. Run /feature or /fix to start a new delivery run.';
        
        const pct = work.total > 0 ? Math.round((work.completed / work.total) * 100) : 0;
        byId('work-progress-bar').style.width = pct + '%';

        const git = data.git || {};
        setPill('git-pill', git.clean ? 'ok' : 'warning');
        byId('git-branch').textContent = git.branch || 'unknown';
        byId('git-changed').textContent = git.clean ? 'clean' : (git.changedFiles + ' changed files');
        byId('git-upstream').textContent = git.upstream || 'none';

        const findings = data.findings || { total: 0, blockers: [] };
        byId('findings-count').textContent = findings.total || '0';
        setList('findings-list', findings.blockers.map(b => b.id + ': ' + b.title), 'No blocking findings');

        const comp = data.completion || { state: 'ready', blockers: [] };
        setPill('completion-pill', comp.state || 'ready');
        setList('completion-list', comp.blockers || [], 'All readiness checks passed');

        const warnings = data.warnings || [];
        byId('warnings-count').textContent = warnings.length;
        setList('warnings-list', warnings.map(w => w.message), 'No active warnings or drift');

        const historyItems = historyData.items || [];
        byId('history-count').textContent = historyItems.length;
        setList('history-list', historyItems.map(h => h.type.toUpperCase() + ': ' + h.title + (h.status ? ' (' + h.status + ')' : '')), 'No completed work in history archive');

        const next = data.nextAction || {};
        byId('next-command').textContent = next.command || '/feature';
        byId('next-reason').textContent = next.reason || 'Ready for next feature';

      } catch (err) {
        byId('live-dot').style.background = '#a5333f';
        byId('live-label').textContent = 'Disconnected';
      } finally {
        refreshing = false;
      }
    }

    refreshStatus();
    setInterval(refreshStatus, 2000);
  </script>
</body>
</html>`;

export { openDashboard, startDashboardServer };

export type { DashboardServer, DashboardServerOptions };
