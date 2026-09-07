import type { DashboardSnapshot } from "./dashboard-snapshot.js";
import { DASHBOARD_PAGE_HTML } from "./dashboard-page.js";
import type { IdeasSummary } from "./ideas.js";

export interface StudioViewRendererOptions {
  defaultTheme?: "auto" | "dark" | "light";
}

export interface RenderStyleOptions {
  mode?: "web" | "webview";
  theme?: "auto" | "dark" | "light";
}

export interface WebviewRenderOptions {
  theme?: "auto" | "dark" | "light";
  includeScripts?: boolean;
}

const WEBVIEW_STUDIO_CSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg);
      color: var(--ink);
      padding: 16px;
      line-height: 1.5;
      font-size: 13px;
      overflow-x: hidden;
    }

    .studio-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .studio-header {
      background: var(--bg-deep);
      backdrop-filter: blur(12px);
      border: 1px solid var(--line);
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
      flex-wrap: wrap;
    }
    .project-badge {
      font-weight: 800;
      font-size: 16px;
      background: linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .branch-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      background: var(--cyan-soft);
      color: var(--cyan);
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid var(--line-strong);
    }
    .multitask-pill {
      font-family: var(--font-mono);
      font-size: 11px;
      background: var(--violet-soft);
      color: var(--violet);
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid rgba(184, 164, 255, 0.3);
      font-weight: 700;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge-pass {
      background: var(--mint-soft);
      color: var(--mint);
      border: 1px solid rgba(111, 227, 180, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 11px;
    }
    .badge-blocked {
      background: var(--red-soft);
      color: var(--red);
      border: 1px solid rgba(255, 112, 97, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 11px;
    }

    .action-bar {
      background: var(--bg-deep);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
    }
    .action-label {
      font-weight: 700;
      color: var(--muted);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-right: 4px;
      white-space: nowrap;
    }
    .btn-action {
      background: var(--panel);
      border: 1px solid var(--line);
      color: var(--ink);
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: 11px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-action:hover {
      background: var(--cyan-soft);
      border-color: var(--cyan);
      color: var(--cyan);
    }
    .btn-action.btn-primary {
      background: linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%);
      color: var(--bg-deep);
      font-weight: 700;
      border: none;
    }

    .stepper-section {
      background: var(--bg-deep);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .stepper-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
    }
    .badge-track {
      padding: 2px 8px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
    }
    .track-fast { background: var(--violet-soft); color: var(--violet); border: 1px solid rgba(184, 164, 255, 0.3); }
    .track-pre-flight { background: var(--cyan-soft); color: var(--cyan); border: 1px solid rgba(125, 216, 255, 0.3); }
    .track-idle { background: var(--panel); color: var(--muted); border: 1px solid var(--line); }
    .stepper-track {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow-x: auto;
    }
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      min-width: 80px;
    }
    .step-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      border: 2px solid var(--line-strong);
      background: var(--bg-deep);
      color: var(--muted);
      font: 700 9px var(--font-mono);
      margin-bottom: 4px;
    }
    .step.active .step-dot {
      border-color: var(--gold);
      color: var(--gold);
      box-shadow: 0 0 0 4px var(--gold-soft);
    }
    .step-name { font-size: 10px; font-weight: 600; color: var(--soft); }
    .step-cmd { font-size: 9px; color: var(--muted); font-family: var(--font-mono); }

    .kanban-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
    .kanban-col {
      background: var(--bg-deep);
      border: 1px solid var(--line);
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
      border-bottom: 1px solid var(--line);
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
      font-size: 10px;
      font-family: var(--font-mono);
      font-weight: 600;
      background: var(--panel);
      padding: 2px 8px;
      border-radius: 10px;
      color: var(--muted);
      border: 1px solid var(--line);
    }

    .col-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 520px;
      overflow-y: auto;
    }

    .card-item {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .card-item:hover {
      border-color: var(--line-strong);
      transform: translateY(-1px);
    }
    .card-item.active-item {
      border-color: var(--line-strong);
      box-shadow: 0 0 12px rgba(125, 216, 255, 0.12);
    }

    .item-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .badge-id {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      background: var(--cyan-soft);
      color: var(--cyan);
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .badge-history {
      background: var(--violet-soft);
      color: var(--violet);
    }
    .badge-stage {
      font-family: var(--font-mono);
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 1px 6px;
      border-radius: 4px;
      background: var(--gold-soft);
      color: var(--gold);
      border: 1px solid rgba(242, 193, 78, 0.3);
    }
    .badge-stage.stage-check {
      background: var(--mint-soft);
      color: var(--mint);
      border-color: rgba(111, 227, 180, 0.3);
    }
    .item-title {
      font-weight: 600;
      font-size: 12px;
      flex: 1;
    }

    .progress-bar-container {
      background: rgba(0, 0, 0, 0.3);
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      margin-top: 4px;
    }
    .progress-bar-fill {
      background: linear-gradient(135deg, var(--cyan), var(--violet));
      height: 100%;
      transition: width 0.3s ease;
    }

    .item-tags, .item-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      font-size: 11px;
      color: var(--muted);
      flex-wrap: wrap;
    }
    .tag {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--line);
    }
    .tag-feasibility { color: var(--mint); }
    .tag-value { color: var(--cyan); }
    .tag-cat { color: var(--gold); }
    .tag-finding-clean { color: var(--mint); }
    .tag-finding-warn { color: var(--red); background: var(--red-soft); border-color: rgba(255, 112, 97, 0.3); }

    .card-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      padding-top: 6px;
      border-top: 1px dashed var(--line);
      flex-wrap: wrap;
    }
    .btn-card-action {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--line);
      color: var(--ink);
      padding: 2px 7px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-card-action:hover {
      background: var(--cyan-soft);
      color: var(--cyan);
      border-color: var(--cyan);
    }

    .empty-state {
      text-align: center;
      padding: 24px;
      color: var(--muted);
      font-size: 12px;
    }

    .pulse-panel {
      background: var(--bg-deep);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
`;

export class StudioViewRenderer {
  private defaultTheme: "auto" | "dark" | "light";

  constructor(options: StudioViewRendererOptions = {}) {
    this.defaultTheme = options.defaultTheme || "auto";
  }

  /**
   * Escapes HTML characters safely to prevent XSS.
   */
  escapeHtml(str: string | null | undefined): string {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Safe JSON serializer for HTML script tags.
   * Escapes `<` to `\u003c` and `>` to `\u003e` to prevent script tag injection and HTML breakout.
   */
  escapeJsonForHtml(data: unknown): string {
    return JSON.stringify(data).replace(/</g, "\\u003c");
  }

  /**
   * Renders the top header block with project info, git branch, gate status, and next action.
   */
  renderHeaderBlock(snapshot: DashboardSnapshot): string {
    const status = snapshot.status || ({} as any);
    const projectName = status.project?.name || "Nexus-DevFlow Project";
    const branch = status.git?.branch || "main";
    const activeRuns = status.activeRuns || [];
    const gateReport = snapshot.gatekeeper || { passed: true };
    const nextActionCmd = typeof status.nextAction === "string" ? status.nextAction : status.nextAction?.command || "/feature";

    const isGatePassed = gateReport.passed;
    const gatePillClass = isGatePassed ? "badge-pass" : "badge-blocked";
    const gatePillText = isGatePassed ? "✔ Gate Passed" : "✖ Gate Blocked";

    return `
      <header class="studio-header">
        <div class="header-left">
          <span class="project-badge">⚡ ${this.escapeHtml(projectName)}</span>
          <span class="branch-pill">🌿 ${this.escapeHtml(branch)}</span>
          ${activeRuns.length > 0 ? `<span class="multitask-pill">🗂️ ${activeRuns.length} Active Workspaces</span>` : ""}
        </div>
        <div class="header-right">
          <span class="${gatePillClass}">${gatePillText}</span>
          <button class="btn-action btn-primary" onclick="dispatchCommand('${this.escapeHtml(nextActionCmd)}')">
            Next: ${this.escapeHtml(nextActionCmd)}
          </button>
        </div>
      </header>
    `.trim();
  }

  /**
   * Renders the dual-track stepper reflecting current track and stage.
   */
  renderDualTrackStepper(snapshot: DashboardSnapshot): string {
    const track = snapshot.workflow?.track || "fast";
    const currentStage = (snapshot.workflow as any)?.stage || (snapshot.status?.currentWork?.status) || "feature";

    const fastSteps = [
      { name: "Discover & Spec", cmd: "/feature", id: "feature" },
      { name: "Implement (TDD)", cmd: "/implement", id: "implement" },
      { name: "Verify & Gate", cmd: "/check", id: "check" },
      { name: "Release & Archive", cmd: "/complete", id: "complete" },
    ];

    const preflightSteps = [
      { name: "SA Ingestion", cmd: "/analyze", id: "analyze" },
      { name: "Align & ADR", cmd: "/grill", id: "grill" },
      { name: "Brainstorm", cmd: "/brainstorm", id: "brainstorm" },
      { name: "Exploration", cmd: "/discovery", id: "discovery" },
    ];

    const steps = (track as string) === "pre-flight" || track === "deep" ? preflightSteps : fastSteps;

    const stepsHtml = steps.map((step, idx) => {
      const isCurrent = currentStage.toLowerCase().includes(step.id);
      const stepClass = isCurrent ? "step active" : "step";
      return `
        <div class="${stepClass}">
          <div class="step-dot">${idx + 1}</div>
          <div class="step-name">${this.escapeHtml(step.name)}</div>
          <div class="step-cmd">${this.escapeHtml(step.cmd)}</div>
        </div>
      `;
    }).join("");

    return `
      <section class="stepper-section">
        <div class="stepper-header">
          <span class="badge-track track-${this.escapeHtml(track)}">Track: ${this.escapeHtml(track.toUpperCase())}</span>
          <span class="step-label">Stage: <strong>${this.escapeHtml(currentStage)}</strong></span>
        </div>
        <div class="stepper-track">
          ${stepsHtml}
        </div>
      </section>
    `.trim();
  }

  /**
   * Renders the 3-Pillars cards (Future: Ideas, Present: Active Specs, Past: History).
   */
  render3PillarsCards(snapshot: DashboardSnapshot, ideas?: IdeasSummary | null): string {
    const status = snapshot.status || ({} as any);
    const currentWork = status.currentWork || ({} as any);
    const activeRuns = status.activeRuns || [];
    const pendingIdeas = ideas?.pending || [];
    const historyItems = snapshot.history?.items || [];
    const historyTotal = snapshot.history?.total ?? historyItems.length;

    // Pillar 1: Future Ideas HTML
    const ideasHtml = pendingIdeas.length > 0
      ? pendingIdeas.map((idea: any) => `
          <div class="card-item idea-item">
            <div class="item-header">
              <span class="badge-id">${this.escapeHtml(idea.id)}</span>
              <span class="item-title">${this.escapeHtml(idea.title || idea.rawInput?.slice(0, 40))}</span>
            </div>
            <div class="item-tags">
              <span class="tag tag-feasibility">${this.escapeHtml(idea.feasibility || "Feasible")}</span>
              <span class="tag tag-value">${this.escapeHtml(idea.value || "Value: High")}</span>
            </div>
          </div>
        `).join("")
      : `<div class="empty-state">No pending ideas in inbox. Use <code>nexus-devflow idea add</code></div>`;

    // Pillar 2: Present Active HTML
    let presentHtml = "";
    let totalActiveTasks = 0;
    let totalActiveCompleted = 0;

    if (activeRuns.length > 0) {
      totalActiveTasks = activeRuns.reduce((acc: number, r: any) => acc + (r.totalTasks || 0), 0);
      totalActiveCompleted = activeRuns.reduce((acc: number, r: any) => acc + (r.completedTasks || 0), 0);
      presentHtml = activeRuns.map((run: any) => {
        const pct = run.totalTasks > 0 ? Math.round((run.completedTasks / run.totalTasks) * 100) : 0;
        const stageBadgeClass = (run.status || "").includes("check") ? "badge-stage stage-check" : "badge-stage";
        const findingTag = run.hasOpenFindings 
          ? `<span class="tag tag-finding-warn">⚠ Open Findings</span>`
          : `<span class="tag tag-finding-clean">✔ Clean</span>`;

        return `
          <div class="card-item active-item">
            <div class="item-header">
              <span class="badge-id">${this.escapeHtml(run.runId)}</span>
              <span class="${stageBadgeClass}">${this.escapeHtml(run.status || "active")}</span>
            </div>
            <div class="item-title">${this.escapeHtml(run.title || "Living Spec")}</div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="item-meta">
              <span>🌿 <code>${this.escapeHtml(run.branch || "main")}</code></span>
              ${findingTag}
            </div>
            <div class="item-tags">
              <span>Progress: <strong>${pct}%</strong> (${run.completedTasks}/${run.totalTasks})</span>
              <span>Remaining: ${run.remainingTasks}</span>
            </div>
            <div class="card-actions">
              <button class="btn-card-action" onclick="dispatchCommand('/implement ${this.escapeHtml(run.runId)}')">▶ /implement ${this.escapeHtml(run.runId)}</button>
              <button class="btn-card-action" onclick="dispatchCommand('/check ${this.escapeHtml(run.runId)}')">🧪 /check ${this.escapeHtml(run.runId)}</button>
              <button class="btn-card-action" onclick="dispatchCommand('/complete ${this.escapeHtml(run.runId)}')">📦 /complete ${this.escapeHtml(run.runId)}</button>
            </div>
          </div>
        `;
      }).join("");
    } else if (currentWork.state === "active") {
      totalActiveTasks = currentWork.total || 0;
      totalActiveCompleted = currentWork.completed || 0;
      const progressPercent = totalActiveTasks > 0 ? Math.round((totalActiveCompleted / totalActiveTasks) * 100) : 0;
      const runId = currentWork.runId || "ACTIVE";
      presentHtml = `
        <div class="card-item active-item">
          <div class="item-header">
            <span class="badge-id">${this.escapeHtml(runId)}</span>
            <span class="badge-stage">${this.escapeHtml(currentWork.status || "active")}</span>
          </div>
          <div class="item-title">${this.escapeHtml(currentWork.title || "Active Spec")}</div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="item-meta">
            <span>Progress: <strong>${progressPercent}%</strong> (${currentWork.completed}/${currentWork.total})</span>
            <span>Remaining: ${currentWork.remaining}</span>
          </div>
          <div class="card-actions">
            <button class="btn-card-action" onclick="dispatchCommand('/implement ${this.escapeHtml(runId)}')">▶ /implement ${this.escapeHtml(runId)}</button>
            <button class="btn-card-action" onclick="dispatchCommand('/check ${this.escapeHtml(runId)}')">🧪 /check ${this.escapeHtml(runId)}</button>
            <button class="btn-card-action" onclick="dispatchCommand('/complete ${this.escapeHtml(runId)}')">📦 /complete ${this.escapeHtml(runId)}</button>
          </div>
        </div>
      `;
    } else {
      presentHtml = `
        <div class="empty-state">
          Idle workspace.<br>Run <code>/feature</code> or <code>/fix</code> to start a run.
        </div>
      `;
    }

    const presentCountLabel = activeRuns.length > 0
      ? `${activeRuns.length} Active Runs · ${totalActiveCompleted}/${totalActiveTasks} Tasks`
      : `${totalActiveCompleted}/${totalActiveTasks} Tasks`;

    // Pillar 3: Past History HTML
    const historyHtml = historyItems.length > 0
      ? historyItems.slice(0, 8).map((item: any) => {
          const runId = item.buildPlanItem || item.file?.replace(/\.md$/, "") || "RELEASE";
          return `
            <div class="card-item history-item">
              <div class="item-header">
                <span class="badge-id badge-history">${this.escapeHtml(runId)}</span>
                <span class="item-title">${this.escapeHtml(item.title)}</span>
              </div>
              <div class="item-meta">
                <span class="tag tag-cat">${this.escapeHtml(item.type)}</span>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="empty-state">No archived history records yet.</div>`;

    return `
      <main class="kanban-grid">
        <!-- 🔮 1. Future (Ideas Inbox) -->
        <section class="kanban-col" id="pillar-future">
          <div class="col-header">
            <span class="col-title">🔮 Future (Ideas Inbox)</span>
            <span class="col-count">${pendingIdeas.length}</span>
          </div>
          <div class="col-content">
            ${ideasHtml}
          </div>
        </section>

        <!-- ⚡ 2. Present (Active Living Context) -->
        <section class="kanban-col" id="pillar-present">
          <div class="col-header">
            <span class="col-title">⚡ Present (Active Living Spec)</span>
            <span class="col-count">${presentCountLabel}</span>
          </div>
          <div class="col-content">
            ${presentHtml}
          </div>
        </section>

        <!-- 📦 3. Past (Release History Archive) -->
        <section class="kanban-col" id="pillar-past">
          <div class="col-header">
            <span class="col-title">📦 Past (History Archives)</span>
            <span class="col-count">${historyTotal} Releases</span>
          </div>
          <div class="col-content">
            ${historyHtml}
          </div>
        </section>
      </main>
    `.trim();
  }

  /**
   * Generates adaptive CSS styles for web or webview mode.
   */
  renderStyles(options: RenderStyleOptions = {}): string {
    const mode = options.mode || "web";
    const isWebview = mode === "webview";

    if (isWebview) {
      return `
    :root {
      --font-display: "Google Sans Thai", "Google Sans", "Noto Sans Thai", "Space Grotesk", sans-serif;
      --font-sans: "Google Sans Thai", "Google Sans", "Noto Sans Thai", sans-serif;
      --font-mono: "IBM Plex Mono", monospace;
      --bg: var(--vscode-editor-background, #0a2540);
      --bg-deep: var(--vscode-sideBar-background, #061a2e);
      --panel: var(--vscode-editorWidget-background, rgba(255, 255, 255, 0.04));
      --panel-strong: var(--vscode-editorGroupHeader-tabsBackground, #0c2b49);
      --ink: var(--vscode-editor-foreground, #edf6ff);
      --soft: var(--vscode-descriptionForeground, #b7d3ef);
      --muted: var(--vscode-disabledForeground, #7598ba);
      --line: var(--vscode-widget-border, rgba(191, 224, 255, 0.17));
      --line-strong: var(--vscode-focusBorder, rgba(191, 224, 255, 0.36));
      --cyan: #7dd8ff;
      --mint: #6fe3b4;
      --gold: #f2c14e;
      --red: #ff7061;
      --violet: #b8a4ff;
      --cyan-soft: rgba(125, 216, 255, 0.14);
      --mint-soft: rgba(111, 227, 180, 0.14);
      --gold-soft: rgba(242, 193, 78, 0.14);
      --red-soft: rgba(255, 112, 97, 0.14);
      --violet-soft: rgba(184, 164, 255, 0.14);
    }
      `.trim();
    }

    return `
    :root {
      --font-display: "Google Sans Thai", "Google Sans", "Noto Sans Thai", "Space Grotesk", sans-serif;
      --font-sans: "Google Sans Thai", "Google Sans", "Noto Sans Thai", sans-serif;
      --font-mono: "IBM Plex Mono", monospace;
      --bg: #0a2540;
      --bg-deep: #061a2e;
      --panel: rgba(255, 255, 255, 0.04);
      --panel-strong: #0c2b49;
      --ink: #edf6ff;
      --soft: #b7d3ef;
      --muted: #7598ba;
      --line: rgba(191, 224, 255, 0.17);
      --line-strong: rgba(191, 224, 255, 0.36);
      --cyan: #7dd8ff;
      --mint: #6fe3b4;
      --gold: #f2c14e;
      --red: #ff7061;
      --violet: #b8a4ff;
      --cyan-soft: rgba(125, 216, 255, 0.14);
      --mint-soft: rgba(111, 227, 180, 0.14);
      --gold-soft: rgba(242, 193, 78, 0.14);
      --red-soft: rgba(255, 112, 97, 0.14);
      --violet-soft: rgba(184, 164, 255, 0.14);
    }
    `.trim();
  }

  /**
   * Renders the complete web dashboard HTML document with optional initial snapshot injection.
   */
  renderWebDashboard(snapshot?: DashboardSnapshot | null): string {
    if (!snapshot) {
      return DASHBOARD_PAGE_HTML;
    }
    const serialized = this.escapeJsonForHtml(snapshot);
    return DASHBOARD_PAGE_HTML.replace(
      "window.__INITIAL_SNAPSHOT__ = null;",
      `window.__INITIAL_SNAPSHOT__ = ${serialized};`
    );
  }

  /**
   * Renders the complete Webview Studio HTML document with VS Code bridge scripts.
   */
  renderWebviewStudio(
    snapshot: DashboardSnapshot,
    ideas?: IdeasSummary | null,
    options: WebviewRenderOptions = {}
  ): string {
    const status = snapshot.status || ({} as any);
    const projectName = status.project?.name || "Nexus-DevFlow Project";
    const headerHtml = this.renderHeaderBlock(snapshot);
    const stepperHtml = this.renderDualTrackStepper(snapshot);
    const pillarsHtml = this.render3PillarsCards(snapshot, ideas);
    const gateReport = snapshot.gatekeeper || { findingsBlockers: 0 };
    const driftReport = snapshot.drift || { hasDrift: false };
    const activeRuns = status.activeRuns || [];
    const currentWork = status.currentWork || ({} as any);

    return `<!DOCTYPE html>
<html lang="th" data-theme="${options.theme || this.defaultTheme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus-DevFlow Studio: ${this.escapeHtml(projectName)}</title>
  <style>
    ${this.renderStyles({ mode: "webview", theme: options.theme || this.defaultTheme })}
    ${WEBVIEW_STUDIO_CSS}
  </style>
</head>
<body>
  <div class="studio-container">
    ${headerHtml}

    <!-- Quick Action Bar -->
    <div class="action-bar">
      <span class="action-label">Quick Actions:</span>
      <button class="btn-action" onclick="dispatchCommand('/feature')">/feature</button>
      <button class="btn-action" onclick="dispatchCommand('/implement')">/implement</button>
      <button class="btn-action" onclick="dispatchCommand('/check')">/check</button>
      <button class="btn-action" onclick="dispatchCommand('/complete')">/complete</button>
      <button class="btn-action" onclick="dispatchCommand('/continuous')">/continuous</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow check-gate')">check-gate</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow drift')">drift</button>
      <button class="btn-action" onclick="dispatchCommand('nexus-devflow doctor')">doctor</button>
    </div>

    ${stepperHtml}

    ${pillarsHtml}

    <!-- Bottom Pulse -->
    <footer class="pulse-panel">
      <div>Findings Blockers: <strong>${gateReport.findingsBlockers}</strong> | Active Findings: <strong>${status.findings?.total || 0}</strong></div>
      <div>Git Drift: <strong>${driftReport.hasDrift ? "⚠ Drift Detected" : "✔ In Sync"}</strong> | Workspaces: <strong>${activeRuns.length || (currentWork.state === "active" ? 1 : 0)} Active</strong></div>
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
}
