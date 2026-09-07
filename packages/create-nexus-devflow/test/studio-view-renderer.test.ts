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
});
