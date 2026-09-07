import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { StudioViewRenderer } from "../lib/studio-view-renderer.js";
import { renderDashboardPage, DASHBOARD_PAGE_HTML } from "../lib/dashboard-page.js";
import type { DashboardSnapshot } from "../lib/dashboard-snapshot.js";

describe("StudioViewRenderer Presentation Engine Seam", () => {
  it("renders base dashboard HTML without circular dependency", () => {
    const renderer = new StudioViewRenderer();
    const html = renderer.renderWebDashboard();
    assert.ok(typeof html === "string");
    assert.ok(html.includes("<!doctype html>"));
    assert.ok(html.includes("Nexus-DevFlow Enterprise Dashboard"));
    assert.ok(html.includes("window.__INITIAL_SNAPSHOT__ = null;"));
  });

  it("injects serialized initial snapshot safely into window.__INITIAL_SNAPSHOT__", () => {
    const renderer = new StudioViewRenderer();
    const fakeSnapshot = {
      project: { name: "test-app", root: "/path/to/test" },
      status: {
        health: "ok",
        project: { name: "test-app", root: "/path/to/test" },
        devflow: { version: "2.14.0", adapters: [] }
      }
    } as unknown as DashboardSnapshot;

    const html = renderer.renderWebDashboard(fakeSnapshot);
    assert.ok(html.includes('"name":"test-app"'));
    assert.ok(!html.includes("window.__INITIAL_SNAPSHOT__ = null;"));
    assert.ok(html.includes("window.__INITIAL_SNAPSHOT__ = {"));
  });

  it("escapes opening script tags to prevent XSS during injection", () => {
    const renderer = new StudioViewRenderer();
    const payloadWithTag = {
      project: { name: "<script>alert('xss')</script>" }
    } as unknown as DashboardSnapshot;

    const html = renderer.renderWebDashboard(payloadWithTag);
    assert.ok(!html.includes("<script>alert"));
    assert.ok(html.includes("\\u003cscript>alert") || html.includes("\\u003cscript"));
  });

  it("backward-compatible facade renderDashboardPage works identically", () => {
    const html = renderDashboardPage();
    assert.ok(html.length > 5000);
    assert.equal(html, DASHBOARD_PAGE_HTML);
  });

  it("includes Archify dynamic workflow visualizer and recommended skills sections", () => {
    const renderer = new StudioViewRenderer();
    const html = renderer.renderWebDashboard();
    assert.ok(html.includes('id="workflow-visualizer-panel"'), "contains workflow visualizer panel");
    assert.ok(html.includes('id="visualizer-container"'), "contains visualizer canvas container");
    assert.ok(html.includes('id="viz-btn-macro"'), "contains macro toggle button");
    assert.ok(html.includes('id="viz-btn-micro"'), "contains micro toggle button");
    assert.ok(html.includes('id="recommended-skills-panel"'), "contains recommended skills panel");
    assert.ok(html.includes('id="recommended-skills-list"'), "contains recommended skills list");
  });

  it("de-clutters dashboard by removing swarm roster tab", () => {
    const renderer = new StudioViewRenderer();
    const html = renderer.renderWebDashboard();
    assert.ok(!html.includes('id="tab-swarm"'), "tab-swarm is removed");
    assert.ok(!html.includes('id="view-swarm"'), "view-swarm is removed");
  });

  it("removes legacy Unified Living Spec Model (DevFlow 2.5.0) section and retains Code Graph tab", () => {
    const renderer = new StudioViewRenderer();
    const html = renderer.renderWebDashboard();
    assert.ok(!html.includes("Unified Living Spec Model (DevFlow 2.5.0)"), "legacy title removed");
    assert.ok(!html.includes('id="dual-track"'), "legacy dual-track panel removed");
    assert.ok(html.includes('id="viz-btn-graph"'), "code graph tab integrated into visualizer");
    assert.ok(html.includes('id="visualizer-container"'), "visualizer container exists");
    // Verify server-side SVG injection
    assert.ok(html.includes('<div class="visualizer-canvas-container" id="visualizer-container"><svg'), "initial SVG is rendered server-side");
  });

  it("renders macro lifecycle SVG with active stage and completed stages highlighted", () => {
    const renderer = new StudioViewRenderer();
    const svgFeature = renderer.renderMacroLifecycleSvg("feature");
    assert.ok(svgFeature.includes("<svg"), "returns valid SVG element");
    assert.ok(svgFeature.includes("/feature"), "includes /feature stage");
    assert.ok(svgFeature.includes("/implement"), "includes /implement stage");
    assert.ok(svgFeature.includes("/check"), "includes /check stage");
    assert.ok(svgFeature.includes("/complete"), "includes /complete stage");
    assert.ok(svgFeature.includes("is-active"), "active stage has is-active class");

    const svgCheck = renderer.renderMacroLifecycleSvg("check");
    assert.ok(svgCheck.includes("✔ Done"), "previous stages marked done");
    assert.ok(svgCheck.includes("● Active"), "current stage marked active");
    assert.ok(svgCheck.includes("viz-active-trace"), "active stage has animated trace motion");
  });

  it("renders micro tickets DAG SVG with dependency connections", () => {
    const renderer = new StudioViewRenderer();
    const tickets = [
      { id: "080-01", title: "Snapshot Enrichment", status: "done" as const, blockedBy: [] },
      { id: "080-02", title: "Archify Visualizer", status: "in_progress" as const, blockedBy: ["080-01"] },
      { id: "080-03", title: "Recommended Skills", status: "blocked" as const, blockedBy: ["080-02"] },
    ];
    const svg = renderer.renderTicketsDagSvg(tickets);
    assert.ok(svg.includes("<svg"), "returns valid SVG");
    assert.ok(svg.includes("080-01"), "renders ticket 080-01");
    assert.ok(svg.includes("080-02"), "renders ticket 080-02");
    assert.ok(svg.includes("080-03"), "renders ticket 080-03");
    assert.ok(svg.includes("marker-end="), "renders dependency marker arrow");
  });
});
