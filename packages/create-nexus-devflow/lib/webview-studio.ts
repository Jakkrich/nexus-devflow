import { readDashboardSnapshot, type DashboardSnapshot } from "./dashboard-snapshot.js";
import { evaluateGate, type GateReport } from "./gatekeeper.js";
import { detectGitDrift, type GitDriftReport } from "./drift-reconciler.js";
import { readIdeas } from "./ideas.js";

export interface StudioRenderOptions {
  theme?: "auto" | "dark" | "light";
  includeScripts?: boolean;
}

/**
 * Escapes HTML characters safely.
 */
function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/**
 * Renders a self-contained, interactive Webview Studio HTML page.
 */
export async function renderStudioHtml(
  projectRoot: string,
  options: StudioRenderOptions = {}
): Promise<string> {
  const snapshot = await readDashboardSnapshot(projectRoot);
  const gateReport = await evaluateGate(projectRoot, { strict: false });
  const driftReport = await detectGitDrift(projectRoot);
  const ideas = await readIdeas(projectRoot);

  const status = snapshot.status;
  const currentWork = status.currentWork;
  const projectName = status.project.name || "Nexus-DevFlow Project";
  const branch = status.git.branch || "main";
  const nextActionCmd = typeof status.nextAction === "string" ? status.nextAction : status.nextAction?.command || "/feature";
  const track = snapshot.workflow.track || (currentWork.state === "active" ? "fast" : "idle");

  const isGatePassed = gateReport.passed;
  const gatePillClass = isGatePassed ? "badge-pass" : "badge-blocked";
  const gatePillText = isGatePassed ? "✔ Gate Passed" : "✖ Gate Blocked";

  const ideasHtml = ideas.pending.length > 0
    ? ideas.pending.map((idea) => `
        <div class="card-item idea-item">
          <div class="item-header">
            <span class="badge-id">${escapeHtml(idea.id)}</span>
            <span class="item-title">${escapeHtml(idea.title || idea.rawInput.slice(0, 40))}</span>
          </div>
          <div class="item-tags">
            <span class="tag tag-feasibility">${escapeHtml(idea.feasibility || "Feasible")}</span>
            <span class="tag tag-value">${escapeHtml(idea.value || "Value: High")}</span>
          </div>
        </div>
      `).join("")
    : `<div class="empty-state">No pending ideas in inbox. Use <code>nexus-devflow idea add</code></div>`;


  const historyHtml = snapshot.history.items.length > 0
    ? snapshot.history.items.slice(0, 8).map((item) => {
        const runId = item.buildPlanItem || item.file.replace(/\.md$/, "");
        return `
          <div class="card-item history-item">
            <div class="item-header">
              <span class="badge-id badge-history">${escapeHtml(runId)}</span>
              <span class="item-title">${escapeHtml(item.title)}</span>
            </div>
            <div class="item-meta">
              <span class="tag tag-cat">${escapeHtml(item.type)}</span>
            </div>
          </div>
        `;
      }).join("")
    : `<div class="empty-state">No archived history records yet.</div>`;


  const completedCount = currentWork.completed;
  const totalTasks = currentWork.total;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return `<!DOCTYPE html>
<html lang="th" data-theme="${options.theme || "auto"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus-DevFlow Studio: ${escapeHtml(projectName)}</title>
  <style>
    :root {
      --bg: var(--vscode-editor-background, #090d16);
      --bg-panel: var(--vscode-sideBar-background, rgba(17, 24, 39, 0.75));
      --bg-card: rgba(30, 41, 59, 0.6);
      --border: var(--vscode-panel-border, rgba(255, 255, 255, 0.08));
      --border-accent: rgba(56, 189, 248, 0.3);
      --fg: var(--vscode-editor-foreground, #f8fafc);
      --fg-muted: var(--vscode-descriptionForeground, #94a3b8);
      --accent: #38bdf8;
      --accent-gradient: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      --green: #4ade80;
      --yellow: #facc15;
      --red: #f87171;
      --font-mono: var(--vscode-editor-font-family, 'Fira Code', Consolas, monospace);
      --font-sans: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg);
      color: var(--fg);
      padding: 16px;
      line-height: 1.5;
      font-size: 13px;
      overflow-x: hidden;
    }

    .studio-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Top Studio Header */
    .studio-header {
      background: var(--bg-panel);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .project-badge {
      font-weight: 700;
      font-size: 16px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .branch-pill {
      font-family: var(--font-mono);
      font-size: 12px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--accent);
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid var(--border-accent);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge-pass {
      background: rgba(74, 222, 128, 0.15);
      color: var(--green);
      border: 1px solid rgba(74, 222, 128, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }
    .badge-blocked {
      background: rgba(248, 113, 113, 0.15);
      color: var(--red);
      border: 1px solid rgba(248, 113, 113, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    /* Quick Action Dispatcher */
    .action-bar {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
    }
    .action-label {
      font-weight: 600;
      color: var(--fg-muted);
      font-size: 11px;
      text-transform: uppercase;
      margin-right: 4px;
      white-space: nowrap;
    }
    .btn-action {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--fg);
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: 12px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-action:hover {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--accent);
      color: var(--accent);
    }
    .btn-action.btn-primary {
      background: var(--accent-gradient);
      color: #040812;
      font-weight: 700;
      border: none;
    }

    /* 3-Pillars Kanban Grid */
    .kanban-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
    .kanban-col {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .col-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
    }
    .col-title {
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .col-count {
      font-size: 11px;
      background: var(--bg-card);
      padding: 2px 8px;
      border-radius: 10px;
      color: var(--fg-muted);
    }

    .col-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 480px;
      overflow-y: auto;
    }

    /* Card Items */
    .card-item {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .card-item:hover {
      border-color: var(--border-accent);
      transform: translateY(-1px);
    }
    .card-item.active-item {
      border-color: var(--accent);
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
    }

    .item-header {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .badge-id {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      background: rgba(56, 189, 248, 0.2);
      color: var(--accent);
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .badge-history {
      background: rgba(129, 140, 248, 0.2);
      color: #818cf8;
    }
    .item-title {
      font-weight: 600;
      font-size: 12px;
      flex: 1;
    }

    /* Progress bar */
    .progress-bar-container {
      background: rgba(0, 0, 0, 0.3);
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 4px;
    }
    .progress-bar-fill {
      background: var(--accent-gradient);
      height: 100%;
      transition: width 0.3s ease;
    }

    .item-tags, .item-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--fg-muted);
    }
    .tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
    }
    .tag-feasibility { color: var(--green); }
    .tag-value { color: var(--accent); }
    .tag-cat { color: var(--yellow); }

    .empty-state {
      text-align: center;
      padding: 24px;
      color: var(--fg-muted);
      font-size: 12px;
    }

    /* Pulse Notification */
    .pulse-panel {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="studio-container">
    
    <!-- Top Header -->
    <header class="studio-header">
      <div class="header-left">
        <span class="project-badge">⚡ ${escapeHtml(projectName)}</span>
        <span class="branch-pill">🌿 ${escapeHtml(branch)}</span>
        <span class="badge-track">Track: ${escapeHtml(track)}</span>
      </div>
      <div class="header-right">
        <span class="${gatePillClass}">${gatePillText}</span>
        <button class="btn-action btn-primary" onclick="dispatchCommand('${escapeHtml(nextActionCmd)}')">
          Next: ${escapeHtml(nextActionCmd)}
        </button>
      </div>
    </header>


    <!-- Quick Action Bar -->
    <div class="action-bar">
      <span class="action-label">Quick Actions:</span>
      <button class="btn-action" onclick="dispatchCommand('/feature')">/feature</button>
      <button class="btn-action" onclick="dispatchCommand('/implement')">/implement</button>
      <button class="btn-action" onclick="dispatchCommand('/check')">/check</button>
      <button class="btn-action" onclick="dispatchCommand('/complete')">/complete</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow slice --stage implement')">slice</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow drift')">drift</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow reconcile --fix')">reconcile</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow doctor')">doctor</button>
    </div>

    <!-- 3-Pillars Kanban View -->
    <main class="kanban-grid">
      
      <!-- 🔮 1. Future (Ideas Inbox) -->
      <section class="kanban-col">
        <div class="col-header">
          <span class="col-title">🔮 Future (Ideas Inbox)</span>
          <span class="col-count">${ideas.pending.length}</span>
        </div>
        <div class="col-content">
          ${ideasHtml}
        </div>
      </section>


      <!-- ⚡ 2. Present (Active Living Context) -->
      <section class="kanban-col">
        <div class="col-header">
          <span class="col-title">⚡ Present (Active Living Spec)</span>
          <span class="col-count">${completedCount}/${totalTasks} Tasks</span>
        </div>
        <div class="col-content">
          ${currentWork.state === "active" ? `
            <div class="card-item active-item">
              <div class="item-header">
                <span class="badge-id">${escapeHtml(currentWork.runId || "ACTIVE")}</span>
                <span class="item-title">${escapeHtml(currentWork.title || "Active Spec")}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
              <div class="item-meta">
                <span>Progress: ${progressPercent}%</span>
                <span>Remaining: ${currentWork.remaining} task(s)</span>
              </div>
            </div>
          ` : `
            <div class="empty-state">
              Idle workspace.<br>Run <code>/feature</code> or <code>/fix</code> to start a run.
            </div>
          `}
        </div>
      </section>

      <!-- 📦 3. Past (Release History Archive) -->
      <section class="kanban-col">
        <div class="col-header">
          <span class="col-title">📦 Past (History Archives)</span>
          <span class="col-count">${snapshot.history.total} Releases</span>
        </div>
        <div class="col-content">
          ${historyHtml}
        </div>
      </section>

    </main>

    <!-- Bottom Pulse -->
    <footer class="pulse-panel">
      <div>Findings Blockers: <strong>${gateReport.findingsBlockers}</strong> | Total Findings: <strong>${status.findings.total}</strong></div>
      <div>Git Drift: <strong>${driftReport.hasDrift ? "⚠ Drift Detected" : "✔ In Sync"}</strong></div>
    </footer>

  </div>

  <script>
    function dispatchCommand(cmd) {
      if (window.acquireVsCodeApi) {
        const vscode = window.acquireVsCodeApi();
        vscode.postMessage({ command: 'exec', text: cmd });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(cmd);
        alert('Copied command to clipboard: ' + cmd);
      }
    }
  </script>
</body>
</html>`;
}
