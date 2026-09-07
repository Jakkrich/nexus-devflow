import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { StudioViewRenderer } from "../lib/studio-view-renderer.js";

describe("StudioViewRenderer - Ticket 01: Core & Escaping & Design Tokens", () => {
  it("escapes special HTML characters safely", () => {
    const renderer = new StudioViewRenderer();
    assert.equal(renderer.escapeHtml(null), "");
    assert.equal(renderer.escapeHtml(undefined), "");
    assert.equal(renderer.escapeHtml(""), "");
    assert.equal(
      renderer.escapeHtml('<div class="test" data-val=\'abc\'>&hello</div>'),
      "&lt;div class=&quot;test&quot; data-val=&#039;abc&#039;&gt;&amp;hello&lt;/div&gt;"
    );
  });

  it("escapes JSON for HTML embedding without tag breakout", () => {
    const renderer = new StudioViewRenderer();
    const malicious = {
      tag: "</script><script>alert('pwned')</script>",
      gt: ">test<",
    };
    const escaped = renderer.escapeJsonForHtml(malicious);
    assert.ok(!escaped.includes("</script>"));
    assert.ok(escaped.includes("\\u003c/script>\\u003cscript>alert('pwned')\\u003c/script>"));
    assert.ok(escaped.includes(">test\\u003c"));
  });

  it("generates adaptive CSS design tokens supporting VS Code variables", () => {
    const renderer = new StudioViewRenderer();
    const webviewStyles = renderer.renderStyles({ mode: "webview" });
    assert.ok(webviewStyles.includes("var(--vscode-editor-background"));
    assert.ok(webviewStyles.includes("var(--vscode-editor-foreground"));

    const webStyles = renderer.renderStyles({ mode: "web" });
    assert.ok(webStyles.includes("#0a2540"));
    assert.ok(webStyles.includes("#edf6ff"));
  });
});

describe("StudioViewRenderer - Ticket 02: Shared 3-Pillars Card Components", () => {
  const mockSnapshot = {
    schemaVersion: 1,
    generatedAt: "2026-09-07T12:00:00.000Z",
    status: {
      project: { name: "Nexus Pro", path: "/test" },
      git: { branch: "feature/047-studio", clean: true },
      nextAction: { command: "/implement", reason: "Ready" },
      currentWork: {
        state: "active",
        runId: "047-studio",
        title: "Studio Feature",
        total: 2,
        completed: 1,
        remaining: 1,
        status: "implementing"
      },
      activeRuns: [
        {
          runId: "047-studio",
          title: "Studio Feature",
          status: "implementing",
          branch: "feature/047-studio",
          completedTasks: 1,
          totalTasks: 2,
          remainingTasks: 1,
          hasOpenFindings: false
        }
      ],
      findings: { total: 0, active: [] }
    },
    workflow: { track: "fast", stage: "implement" },
    history: {
      total: 3,
      items: [
        { file: "001-init.md", title: "Initial release", type: "features", buildPlanItem: "001" }
      ]
    },
    gatekeeper: { passed: true, findingsBlockers: 0 },
    drift: { clean: true, hasDrift: false }
  } as any;

  const mockIdeas = {
    pending: [
      { id: "IDEA-01", title: "AI Agent Autopilot", feasibility: "High", value: "High", rawInput: "AI Agent Autopilot" }
    ],
    totalPending: 1
  } as any;

  it("renders header and project metadata block correctly", () => {
    const renderer = new StudioViewRenderer();
    const headerHtml = renderer.renderHeaderBlock(mockSnapshot);
    assert.ok(headerHtml.includes("Nexus Pro"));
    assert.ok(headerHtml.includes("feature/047-studio"));
    assert.ok(headerHtml.includes("Gate Passed"));
    assert.ok(headerHtml.includes("/implement"));
  });

  it("renders dual-track stepper correctly reflecting track and stage", () => {
    const renderer = new StudioViewRenderer();
    const stepperHtml = renderer.renderDualTrackStepper(mockSnapshot);
    assert.ok(stepperHtml.includes("FAST"));
    assert.ok(stepperHtml.includes("/feature"));
    assert.ok(stepperHtml.includes("/implement"));
    assert.ok(stepperHtml.includes("/check"));
    assert.ok(stepperHtml.includes("/complete"));
  });

  it("renders 3-Pillars cards correctly with Future, Present, and Past data", () => {
    const renderer = new StudioViewRenderer();
    const pillarsHtml = renderer.render3PillarsCards(mockSnapshot, mockIdeas);
    assert.ok(pillarsHtml.includes("Future (Ideas Inbox)"));
    assert.ok(pillarsHtml.includes("AI Agent Autopilot"));
    assert.ok(pillarsHtml.includes("Present (Active Living Spec)"));
    assert.ok(pillarsHtml.includes("047-studio"));
    assert.ok(pillarsHtml.includes("Studio Feature"));
    assert.ok(pillarsHtml.includes("Past (History Archives)"));
    assert.ok(pillarsHtml.includes("001"));
    assert.ok(pillarsHtml.includes("Initial release"));
  });
});

describe("StudioViewRenderer - Ticket 03: Pluggable Shells (renderWebDashboard & renderWebviewStudio)", () => {
  const mockSnapshot = {
    schemaVersion: 1,
    generatedAt: "2026-09-07T12:00:00.000Z",
    status: {
      project: { name: "Web Nexus", path: "/test" },
      git: { branch: "main", clean: true },
      nextAction: { command: "/feature", reason: "Ready" },
      currentWork: { state: "idle", total: 0, completed: 0, remaining: 0 },
      activeRuns: [],
      findings: { total: 0, active: [] }
    },
    workflow: { track: "idle", stage: "idle" },
    history: { total: 0, items: [] },
    gatekeeper: { passed: true, findingsBlockers: 0 },
    drift: { clean: true, hasDrift: false }
  } as any;

  it("renders web dashboard HTML shell with initial snapshot injection and REST polling", () => {
    const renderer = new StudioViewRenderer();
    const htmlWithoutSnapshot = renderer.renderWebDashboard(null);
    assert.ok(htmlWithoutSnapshot.includes("<!doctype html>"));
    assert.ok(htmlWithoutSnapshot.includes("<title>Nexus-DevFlow Enterprise Dashboard</title>"));
    assert.ok(htmlWithoutSnapshot.includes("window.__INITIAL_SNAPSHOT__ = null;"));
    assert.ok(htmlWithoutSnapshot.includes("fetch('/api/dashboard')"));

    const htmlWithSnapshot = renderer.renderWebDashboard(mockSnapshot);
    assert.ok(htmlWithSnapshot.includes("window.__INITIAL_SNAPSHOT__ = {"));
    assert.ok(htmlWithSnapshot.includes('"Web Nexus"'));
    assert.ok(!htmlWithSnapshot.includes("window.__INITIAL_SNAPSHOT__ = null;"));
  });

  it("renders webview studio HTML shell with VS Code postMessage bridge", () => {
    const renderer = new StudioViewRenderer();
    const html = renderer.renderWebviewStudio(mockSnapshot);
    assert.ok(html.includes("<!DOCTYPE html>"));
    assert.ok(html.includes("Nexus-DevFlow Studio: Web Nexus"));
    assert.ok(html.includes("acquireVsCodeApi"));
    assert.ok(html.includes("vscode.postMessage"));
    assert.ok(html.includes("🔮 Future (Ideas Inbox)"));
    assert.ok(html.includes("⚡ Present (Active Living Spec)"));
    assert.ok(html.includes("📦 Past (History Archives)"));
  });
});

describe("StudioViewRenderer - Ticket 04: Backward-Compatible Facades", () => {
  it("verifies renderDashboardPage delegates to StudioViewRenderer and re-exports it", async () => {
    const { renderDashboardPage, StudioViewRenderer: ExportedFromDashboard } = await import(
      "../lib/dashboard-page.js"
    );
    assert.equal(typeof renderDashboardPage, "function");
    assert.equal(typeof ExportedFromDashboard, "function");
    const html = renderDashboardPage();
    assert.ok(html.includes("<!doctype html>"));
  });

  it("verifies renderStudioHtml delegates to StudioViewRenderer and re-exports it", async () => {
    const { renderStudioHtml, StudioViewRenderer: ExportedFromWebview } = await import(
      "../lib/webview-studio.js"
    );
    assert.equal(typeof renderStudioHtml, "function");
    assert.equal(typeof ExportedFromWebview, "function");
  });
});
