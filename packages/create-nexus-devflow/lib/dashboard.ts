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

    /* Live status dot animation */
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
      transition: border-color .3s ease, background-color .3s ease;
    }

    @keyframes livePulse {
      0% { transform: scale(1); opacity: 0.7; }
      70% { transform: scale(2.4); opacity: 0; }
      100% { transform: scale(2.4); opacity: 0; }
    }

    @keyframes livePulseBox {
      0% { box-shadow: 0 0 0 0 rgba(11, 122, 83, 0.5); }
      70% { box-shadow: 0 0 0 8px rgba(11, 122, 83, 0); }
      100% { box-shadow: 0 0 0 0 rgba(11, 122, 83, 0); }
    }

    .live-dot {
      position: relative;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--green);
      transition: background-color .3s ease;
    }

    .live-dot::after {
      content: "";
      position: absolute;
      display: block;
      inset: -4px;
      border-radius: 50%;
      background: var(--green);
      opacity: 0;
      pointer-events: none;
    }

    .live-dot.is-live {
      animation: livePulseBox 2.2s infinite;
    }

    .live-dot.is-live::after {
      animation: livePulse 2.2s ease-out infinite;
    }

    .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }

    /* Initial Load Card Entrance Animation */
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(10px); }
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
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }

    .card-enter {
      animation: cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(18, 24, 23, .08), 0 2px 6px rgba(18, 24, 23, .04);
      border-color: rgba(21, 94, 239, 0.4);
    }

    .card.wide { grid-column: span 8; }
    .card.full { grid-column: 1 / -1; }

    .card-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
    .label { color: var(--blue-dark); font: 600 11px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; }
    
    .value {
      color: var(--ink);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -.02em;
      transition: color .2s ease;
    }

    .muted { color: var(--ink-muted); font-size: 13px; line-height: 1.6; }

    /* Pill Transitions and Scale Pop */
    @keyframes pillPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.06); }
      100% { transform: scale(1); }
    }

    .pill {
      display: inline-block;
      padding: 5px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--ink-muted);
      background: var(--surface-muted);
      font: 600 10px/1 var(--font-mono);
      letter-spacing: .04em;
      text-transform: uppercase;
      transition: background-color .3s ease, border-color .3s ease, color .3s ease, transform .2s ease;
    }

    .pill-pop {
      animation: pillPop 300ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pill.ok, .pill.ready, .pill.active { border-color: #b9dfce; background: var(--green-soft); color: var(--green); }
    .pill.warning, .pill.blocked, .pill.needs_verification { border-color: #efd5a5; background: var(--amber-soft); color: var(--amber); }

    .facts { display: grid; gap: 12px; }
    .fact { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; padding-bottom: 11px; border-bottom: 1px solid var(--line); }
    .fact:last-child { padding-bottom: 0; border-bottom: 0; }
    .fact span:first-child { color: var(--ink-muted); font-size: 12px; }
    .fact span:last-child { max-width: 70%; overflow-wrap: anywhere; color: var(--ink-soft); font: 12px/1.45 var(--font-mono); text-align: right; }

    /* Progress bar with Shimmer and Increase Glow */
    .progress { height: 8px; margin: 16px 0 10px; overflow: hidden; border-radius: 999px; background: var(--surface-muted); }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes progressGlow {
      0% { box-shadow: 0 0 0 0 rgba(21, 94, 239, 0.6); }
      50% { box-shadow: 0 0 12px 2px rgba(21, 94, 239, 0.7); }
      100% { box-shadow: 0 0 0 0 rgba(21, 94, 239, 0); }
    }

    .progress-bar {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: var(--blue);
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .progress-bar.active-shimmer {
      background: linear-gradient(90deg, #155eef 0%, #4785ff 50%, #155eef 100%);
      background-size: 200% 100%;
      animation: shimmer 3s infinite linear;
    }

    .progress-glow {
      animation: progressGlow 400ms ease-out;
    }

    /* Highlight Flash for values */
    @keyframes flashGreen {
      0% { background-color: rgba(11, 122, 83, 0.2); }
      100% { background-color: transparent; }
    }

    @keyframes flashAmber {
      0% { background-color: rgba(154, 87, 0, 0.2); }
      100% { background-color: transparent; }
    }

    .flash-green { animation: flashGreen 600ms ease-out; border-radius: 4px; padding: 0 4px; }
    .flash-amber { animation: flashAmber 600ms ease-out; border-radius: 4px; padding: 0 4px; }

    /* Code Panel & Next Action Flip/Glow */
    @keyframes commandFlip {
      0% { opacity: 0; transform: translateY(-6px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes panelGlowPulse {
      0% { border-color: rgba(118, 168, 255, 0.9); box-shadow: 0 0 24px rgba(21, 94, 239, 0.35); }
      100% { border-color: var(--code-line); box-shadow: 0 24px 80px rgba(18, 24, 23, .12); }
    }

    .code-panel {
      color: var(--code-text);
      border-color: var(--code-line);
      background: var(--code);
      box-shadow: 0 24px 80px rgba(18, 24, 23, .12);
      backdrop-filter: none;
      transition: border-color .3s ease, box-shadow .3s ease;
    }

    .code-panel .label { color: var(--code-blue); }
    .code-panel .muted { color: var(--code-muted); }

    .next-action { padding: 24px; }
    
    .next-action-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .next-copy-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 6px;
      background: rgba(118, 168, 255, 0.12);
      color: var(--code-blue);
      border: 1px solid rgba(118, 168, 255, 0.3);
      font: 600 11px/1.3 var(--font-mono);
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease, color 0.2s ease;
      user-select: none;
    }
    .next-copy-btn:hover {
      background: var(--blue);
      color: #ffffff;
      border-color: var(--blue);
      transform: translateY(-1px);
    }
    .next-copy-btn:active {
      transform: translateY(0);
    }
    .next-copy-btn.copied {
      background: var(--green);
      color: #ffffff;
      border-color: var(--green);
    }

    .command {
      margin: 13px 0 8px;
      color: var(--code-blue);
      font: 600 clamp(20px, 3vw, 29px)/1.3 var(--font-mono);
      overflow-wrap: anywhere;
      cursor: pointer;
      border-radius: 6px;
      padding: 4px 6px;
      margin-left: -6px;
      transition: background-color 0.2s ease;
    }
    .command:hover {
      background: rgba(118, 168, 255, 0.08);
    }

    .command-flip { animation: commandFlip 300ms ease-out; }
    .next-action-pulse { animation: panelGlowPulse 800ms ease-out; }

    /* Staggered List Items Fade-in */
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

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
    /* Markdown Inline Formatting */
    .inline-code, code.inline-code {
      display: inline-block;
      padding: 1.5px 6px;
      margin: 0 2px;
      border-radius: 5px;
      background: var(--surface-muted);
      color: var(--blue-dark);
      font-family: var(--font-mono);
      font-size: 0.88em;
      font-weight: 600;
      border: 1px solid var(--line);
      line-height: 1.35;
      vertical-align: baseline;
      word-break: break-word;
    }
    strong {
      color: var(--ink);
      font-weight: 700;
    }
    em {
      font-style: italic;
      color: var(--ink-soft);
    }
    del {
      text-decoration: line-through;
      color: var(--ink-muted);
    }
    .inline-link {
      color: var(--blue);
      text-decoration: none;
      font-weight: 600;
    }
    .inline-link:hover {
      text-decoration: underline;
    }

    /* Idea Inbox Item Styling */
    .idea-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: var(--surface-solid);
      margin-bottom: 12px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }
    .idea-item:hover {
      border-color: var(--blue);
      box-shadow: 0 4px 16px rgba(21, 94, 239, 0.09);
      transform: translateY(-1px);
    }
    .idea-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .idea-id-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 9px;
      border-radius: 6px;
      background: rgba(21, 94, 239, 0.08);
      color: var(--blue-dark);
      font: 700 11px/1 var(--font-mono);
      letter-spacing: .04em;
    }
    .idea-title-text {
      color: var(--ink);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -.01em;
      line-height: 1.45;
    }
    .idea-title-text .inline-code {
      font-size: 0.85em;
      background: rgba(21, 94, 239, 0.06);
      border-color: rgba(21, 94, 239, 0.2);
    }
    .idea-desc-text {
      color: var(--ink-soft);
      font-size: 13px;
      line-height: 1.55;
    }
    .idea-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 2px;
      padding-top: 8px;
      border-top: 1px dashed var(--line);
    }
    .idea-feasibility-tag {
      color: var(--ink-soft);
      font-size: 12px;
      background: var(--surface-muted);
      padding: 4px 9px;
      border-radius: 6px;
      line-height: 1.4;
    }
    .idea-feasibility-tag strong {
      color: var(--ink);
    }
    .idea-feasibility-tag .inline-code {
      font-size: 0.85em;
      background: rgba(0, 0, 0, 0.04);
    }
    .idea-cmd-code {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--surface-muted);
      color: var(--blue-dark);
      font: 600 11px/1.3 var(--font-mono);
      cursor: pointer;
      border: 1px solid var(--line);
      transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      user-select: none;
    }
    .idea-cmd-code:hover {
      background: var(--blue);
      color: #ffffff;
      border-color: var(--blue);
    }

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

    /* Accessibility Reduced Motion Rule */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <div class="brand">
      <svg class="brand-mark" viewBox="0 0 48 48" role="img" aria-label="Nexus-DevFlow" aria-hidden="true">
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
      <div class="live"><span class="live-dot is-live" id="live-dot"></span><span id="live-label">Connecting</span></div>
    </header>

    <section class="grid">
      <article class="card card-enter" style="animation-delay: 0.04s;">
        <div class="card-head"><span class="label">Nexus-DevFlow</span><span class="pill" id="health-pill">Loading</span></div>
        <div class="facts">
          <div class="fact"><span>Version</span><span id="val-version">-</span></div>
          <div class="fact"><span>Adapters</span><span id="val-adapters">-</span></div>
          <div class="fact"><span>Architecture</span><span>3-Pillars Model</span></div>
        </div>
      </article>

      <article class="card wide card-enter" style="animation-delay: 0.08s;">
        <div class="card-head"><span class="label">Current Work</span><span class="pill" id="work-pill">Loading</span></div>
        <div class="value" id="work-title">Reading living spec...</div>
        <div class="progress"><span class="progress-bar" id="work-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-valuetext="Loading checklist steps..."></span></div>
        <div class="muted" id="work-meta">Loading checklist steps...</div>
      </article>

      <article class="card card-enter" style="animation-delay: 0.12s;">
        <div class="card-head"><span class="label">Git Status</span><span class="pill" id="git-pill">Loading</span></div>
        <div class="facts">
          <div class="fact"><span>Branch</span><span id="git-branch">-</span></div>
          <div class="fact"><span>Working Tree</span><span id="git-changed">-</span></div>
          <div class="fact"><span>Upstream</span><span id="git-upstream">-</span></div>
        </div>
      </article>

      <article class="card card-enter" style="animation-delay: 0.16s;">
        <div class="card-head"><span class="label">Findings</span><span class="value" id="findings-count">-</span></div>
        <ul id="findings-list" aria-live="polite"><li class="empty">Loading findings...</li></ul>
      </article>

      <article class="card card-enter" style="animation-delay: 0.20s;">
        <div class="card-head"><span class="label">Completion</span><span class="pill" id="completion-pill">Loading</span></div>
        <ul id="completion-list" aria-live="polite"><li class="empty">Checking readiness...</li></ul>
      </article>

      <article class="card card-enter" style="animation-delay: 0.24s;">
        <div class="card-head"><span class="label">Attention</span><span class="value" id="warnings-count">-</span></div>
        <ul id="warnings-list" aria-live="polite"><li class="empty">Loading warnings...</li></ul>
      </article>

      <article class="card full card-enter" style="animation-delay: 0.26s;">
        <div class="card-head"><span class="label">Idea Inbox & Backlog</span><span class="value" id="ideas-count">-</span></div>
        <div class="muted">Pending ideas from devflow/ideas.md. Start any idea with /feature IDEA-xxx or /00-explore IDEA-xxx.</div>
        <ul id="ideas-list" tabindex="0" aria-label="Idea Inbox"><li class="empty">Loading ideas...</li></ul>
      </article>

      <article class="card full card-enter" style="animation-delay: 0.28s;">
        <div class="card-head"><span class="label">Completed Work Archive</span><span class="value" id="history-count">-</span></div>
        <div class="muted">Categorized history of features, fixes, and rollbacks.</div>
        <ul id="history-list" tabindex="0" aria-label="Completed work archive"><li class="empty">Loading history archive...</li></ul>
      </article>

      <article class="card full code-panel next-action card-enter" style="animation-delay: 0.32s;" id="next-panel">
        <div class="next-action-header">
          <span class="label">Next Action</span>
          <button class="next-copy-btn" id="next-copy-btn" type="button" aria-label="Copy next command" title="Click to copy next action command">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span id="next-copy-text">Copy Command</span>
          </button>
        </div>
        <div class="command" id="next-command" aria-live="polite" title="Click to copy command">Loading...</div>
        <div class="muted" id="next-reason"></div>
      </article>
    </section>

    <footer>Read-only local DevFlow 2.0 dashboard. Refreshes every 2 seconds while process is active.</footer>
  </main>

  <script>
    const byId = (id) => document.getElementById(id);
    let prevData = null;
    let isFirstLoad = true;
    let refreshing = false;

    function setPill(id, value, label = value) {
      const node = byId(id);
      if (!node) return;
      const formatted = String(label || '').replaceAll("_", " ");
      const newClass = "pill " + (value || 'idle');
      
      if (!isFirstLoad && (node.textContent !== formatted || !node.className.includes(value))) {
        node.classList.remove('pill-pop');
        void node.offsetWidth;
        node.classList.add('pill-pop');
      }

      node.textContent = formatted;
      node.className = newClass + (node.classList.contains('pill-pop') ? ' pill-pop' : '');
    }

    function animateCount(node, start, end, duration = 400) {
      if (!node) return;
      if (start === end) {
        node.textContent = end;
        return;
      }
      const startTime = performance.now();
      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(start + (end - start) * progress);
        node.textContent = currentVal;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          node.textContent = end;
        }
      }
      requestAnimationFrame(step);
    }

    function triggerFlash(node, type) {
      if (!node) return;
      const className = type === 'green' ? 'flash-green' : 'flash-amber';
      node.classList.remove('flash-green', 'flash-amber');
      void node.offsetWidth;
      node.classList.add(className);
      setTimeout(() => node.classList.remove(className), 600);
    }

    function escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderMarkdownInline(text) {
      if (!text) return '';
      var str = escapeHtml(text);

      // Inline code
      str = str.replace(new RegExp('\\x60([^\\x60]+)\\x60', 'g'), '<code class="inline-code">$1</code>');

      // Bold
      str = str.replace(new RegExp('\\\\*\\\\*(.+?)\\\\*\\\\*', 'g'), '<strong>$1</strong>');
      str = str.replace(new RegExp('__(.+?)__', 'g'), '<strong>$1</strong>');

      // Strikethrough
      str = str.replace(new RegExp('~~(.+?)~~', 'g'), '<del>$1</del>');

      // Italic
      str = str.replace(new RegExp('(^|[^*])\\\\*([^*\\\\r\\\\n]+)\\\\*([^*]|$)', 'g'), '$1<em>$2</em>$3');
      str = str.replace(new RegExp('(^|[^_])_([^_\\\\r\\\\n]+)_([^_]|$)', 'g'), '$1<em>$2</em>$3');

      // Links
      str = str.replace(new RegExp('\\\\[([^\\\\]]+)\\\\]\\\\((https?:\\\\/\\\\/[^\\\\s\\\\)]+|#[^\\\\s\\\\)]+)\\\\)', 'g'), '<a href="$2" target="_blank" rel="noopener noreferrer" class="inline-link">$1</a>');

      return str;
    }

    function setList(id, values, emptyMessage) {
      const list = byId(id);
      if (!list) return;
      const prevItemsText = Array.from(list.children).map(c => c.textContent);
      list.replaceChildren();
      const items = values.length > 0 ? values : [emptyMessage];

      items.forEach((value, idx) => {
        const item = document.createElement("li");
        item.innerHTML = renderMarkdownInline(value);
        if (values.length === 0) {
          item.className = "empty";
        } else if (!isFirstLoad && !prevItemsText.includes(value)) {
          item.className = "fade-slide-in";
          item.style.animationDelay = (idx * 40) + 'ms';
        }
        list.append(item);
      });
    }

    function setIdeas(ideas) {
      const list = byId('ideas-list');
      if (!list) return;
      list.replaceChildren();

      const items = ideas && ideas.pending && ideas.pending.length > 0 ? ideas.pending : [];
      if (items.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty';
        emptyItem.textContent = 'No pending ideas in devflow/ideas.md';
        list.append(emptyItem);
        return;
      }

      items.forEach((idea, idx) => {
        const li = document.createElement('li');
        li.className = 'idea-item';
        if (!isFirstLoad) {
          li.classList.add('fade-slide-in');
          li.style.animationDelay = (idx * 40) + 'ms';
        }

        const headerDiv = document.createElement('div');
        headerDiv.className = 'idea-header';

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'idea-id-badge';
        badgeSpan.textContent = idea.id;

        const cmdCode = document.createElement('code');
        cmdCode.className = 'idea-cmd-code';
        cmdCode.textContent = '/feature ' + idea.id;
        cmdCode.title = 'Click to copy command';
        cmdCode.onclick = () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText('/feature ' + idea.id);
            const orig = cmdCode.textContent;
            cmdCode.textContent = 'Copied!';
            setTimeout(() => { cmdCode.textContent = orig; }, 1200);
          }
        };

        headerDiv.append(badgeSpan, cmdCode);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'idea-title-text';
        titleDiv.innerHTML = renderMarkdownInline(idea.title);

        li.append(headerDiv, titleDiv);

        if (idea.rawInput) {
          const descDiv = document.createElement('div');
          descDiv.className = 'idea-desc-text';
          descDiv.innerHTML = renderMarkdownInline(idea.rawInput);
          li.append(descDiv);
        }

        if (idea.feasibility || idea.value || idea.date) {
          const metaDiv = document.createElement('div');
          metaDiv.className = 'idea-meta-row';
          if (idea.feasibility) {
            const feasSpan = document.createElement('span');
            feasSpan.className = 'idea-feasibility-tag';
            feasSpan.innerHTML = '⚡ ' + renderMarkdownInline(idea.feasibility);
            metaDiv.append(feasSpan);
          }
          if (idea.date) {
            const dateSpan = document.createElement('span');
            dateSpan.className = 'muted';
            dateSpan.style.fontSize = '11px';
            dateSpan.textContent = idea.date;
            metaDiv.append(dateSpan);
          }
          li.append(metaDiv);
        }

        list.append(li);
      });
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
        byId('live-dot').classList.add('is-live');
        byId('live-label').textContent = 'Connected';

        byId('project-name').textContent = data.project?.name || 'Nexus-DevFlow';
        byId('project-path').textContent = data.project?.root || '';

        const healthIssues = (data.warnings || []).map((warning) => warning.message).concat(
          (data.findings?.blockers || []).map((finding) => "Blocking finding " + finding.id + ": " + finding.title)
        );
        const healthCount = healthIssues.length;
        setPill(
          'health-pill',
          data.health || 'ok',
          healthCount === 0 ? 'Clear' : healthCount + (healthCount === 1 ? ' issue' : ' issues')
        );

        byId('val-version').textContent = data.devflow?.version ? 'v' + data.devflow.version : '-';
        byId('val-adapters').textContent = (data.devflow?.adapters || []).join(', ') || 'none';

        const work = data.currentWork || {};
        setPill('work-pill', work.state || 'idle');
        byId('work-title').textContent = work.title || 'No active run in progress';
        const workSummary = work.state === 'active'
          ? (work.completed + ' of ' + work.total + ' steps completed')
          : 'Workspace is idle. Run /feature or /fix to start a new delivery run.';
        byId('work-meta').textContent = workSummary;
        
        const pct = work.total > 0 ? Math.round((work.completed / work.total) * 100) : 0;
        const progressBar = byId('work-progress-bar');
        progressBar.setAttribute('aria-valuenow', String(pct));
        progressBar.setAttribute('aria-valuetext', workSummary);
        
        const prevPct = prevData?.currentWork ? (prevData.currentWork.total > 0 ? Math.round((prevData.currentWork.completed / prevData.currentWork.total) * 100) : 0) : 0;
        if (!isFirstLoad && pct > prevPct) {
          progressBar.classList.remove('progress-glow');
          void progressBar.offsetWidth;
          progressBar.classList.add('progress-glow');
          setTimeout(() => progressBar.classList.remove('progress-glow'), 400);
        }

        if (work.state === 'active') {
          progressBar.classList.add('active-shimmer');
        } else {
          progressBar.classList.remove('active-shimmer');
        }
        progressBar.style.width = pct + '%';

        const git = data.git || {};
        setPill('git-pill', git.clean ? 'ok' : 'warning', !git.branch ? 'Unavailable' : git.clean ? 'Clean' : (git.changedFiles + ' changed'));
        byId('git-branch').textContent = git.branch || 'unknown';
        byId('git-changed').textContent = git.clean ? 'clean' : (git.changedFiles + ' changed files');
        byId('git-upstream').textContent = git.upstream || 'none';

        const findings = data.findings || { total: 0, blockers: [] };
        const prevFindingsCount = prevData?.findings?.total ?? 0;
        const findingsNode = byId('findings-count');
        if (!isFirstLoad && findings.total !== prevFindingsCount) {
          animateCount(findingsNode, prevFindingsCount, findings.total);
          triggerFlash(findingsNode, findings.total < prevFindingsCount ? 'green' : 'amber');
        } else {
          findingsNode.textContent = findings.total || '0';
        }
        setList('findings-list', findings.blockers.map(b => b.id + ': ' + b.title), 'No blocking findings');

        const comp = data.completion || { state: 'ready', blockers: [] };
        setPill('completion-pill', comp.state || 'ready');
        setList('completion-list', comp.blockers || [], 'All readiness checks passed');

        const warnings = data.warnings || [];
        const prevWarningsCount = prevData?.warnings?.length ?? 0;
        const warningsNode = byId('warnings-count');
        if (!isFirstLoad && warnings.length !== prevWarningsCount) {
          animateCount(warningsNode, prevWarningsCount, warnings.length);
          triggerFlash(warningsNode, warnings.length < prevWarningsCount ? 'green' : 'amber');
        } else {
          warningsNode.textContent = warnings.length;
        }
        setList('warnings-list', warnings.map(w => w.message), 'No active warnings or drift');

        const ideas = data.ideas || { totalPending: 0, pending: [] };
        const prevIdeasCount = prevData?.ideas?.totalPending ?? 0;
        const ideasNode = byId('ideas-count');
        if (!isFirstLoad && ideas.totalPending !== prevIdeasCount) {
          animateCount(ideasNode, prevIdeasCount, ideas.totalPending);
          triggerFlash(ideasNode, 'green');
        } else {
          ideasNode.textContent = ideas.totalPending + ' pending';
        }
        setIdeas(ideas);

        const historyItems = historyData.items || [];
        const prevHistoryCount = prevData?.historyCount ?? 0;
        const historyNode = byId('history-count');
        if (!isFirstLoad && historyItems.length !== prevHistoryCount) {
          animateCount(historyNode, prevHistoryCount, historyItems.length);
          triggerFlash(historyNode, 'green');
        } else {
          historyNode.textContent = historyItems.length;
        }
        setList('history-list', historyItems.map(h => h.type.toUpperCase() + ': ' + h.title + (h.status ? ' (' + h.status + ')' : '')), 'No completed work in history archive');

        const next = data.nextAction || {};
        const cmdNode = byId('next-command');
        const nextPanelNode = byId('next-panel');
        if (!isFirstLoad && prevData?.nextAction?.command !== next.command) {
          cmdNode.classList.remove('command-flip');
          nextPanelNode.classList.remove('next-action-pulse');
          void cmdNode.offsetWidth;
          cmdNode.classList.add('command-flip');
          nextPanelNode.classList.add('next-action-pulse');
          setTimeout(() => {
            cmdNode.classList.remove('command-flip');
            nextPanelNode.classList.remove('next-action-pulse');
          }, 800);
        }
        cmdNode.textContent = next.command || '/feature';
        byId('next-reason').textContent = next.reason || 'Ready for next feature';

        if (isFirstLoad) {
          requestAnimationFrame(() => document.body.classList.add('hydrated'));
        }

        prevData = {
          ...data,
          historyCount: historyItems.length
        };
      } catch (err) {
        byId('live-dot').style.background = '#a5333f';
        byId('live-dot').classList.remove('is-live');
        byId('live-label').textContent = 'Disconnected';
      } finally {
        isFirstLoad = false;
        refreshing = false;
      }
    }

    function setupNextActionCopy() {
      const copyBtn = byId('next-copy-btn');
      const cmdNode = byId('next-command');
      const copyText = byId('next-copy-text');

      const performCopy = () => {
        const textToCopy = cmdNode ? cmdNode.textContent.trim() : '';
        if (!textToCopy || textToCopy === 'Loading...') return;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy);
          if (copyBtn && copyText) {
            copyBtn.classList.add('copied');
            copyText.textContent = '✓ Copied!';
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyText.textContent = 'Copy Command';
            }, 1400);
          }
        }
      };

      if (copyBtn) copyBtn.onclick = performCopy;
      if (cmdNode) cmdNode.onclick = performCopy;
    }

    setupNextActionCopy();
    refreshStatus();
    setInterval(refreshStatus, 2000);
  </script>
</body>
</html>`;

export { openDashboard, startDashboardServer };

export type { DashboardServer, DashboardServerOptions };
