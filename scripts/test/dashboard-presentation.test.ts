import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderDashboardPage } from "../../packages/create-nexus-devflow/lib/dashboard-page.js";
import type { DashboardSnapshot } from "../../packages/create-nexus-devflow/lib/dashboard-snapshot.js";

describe("Dashboard Presentation Seam", () => {
  it("renders default dashboard page without initial snapshot", () => {
    const html = renderDashboardPage();
    assert.ok(html.includes("<!doctype html>"));
    assert.ok(html.includes("<title>Nexus-DevFlow Enterprise Dashboard</title>"));
    assert.ok(html.includes("window.__INITIAL_SNAPSHOT__ = null;"));
  });

  it("injects serialized snapshot into window.__INITIAL_SNAPSHOT__", () => {
    const mockSnapshot = {
      schemaVersion: 1,
      generatedAt: "2026-09-07T12:00:00.000Z",
      status: {
        project: { name: "test-project" }
      }
    } as unknown as DashboardSnapshot;

    const html = renderDashboardPage(mockSnapshot);
    assert.ok(html.includes("window.__INITIAL_SNAPSHOT__ = {"));
    assert.ok(html.includes('"test-project"'));
    assert.ok(!html.includes("window.__INITIAL_SNAPSHOT__ = null;"));
  });

  it("safely escapes opening tags and < characters to \\u003c", () => {
    const mockSnapshot = {
      schemaVersion: 1,
      generatedAt: "2026-09-07T12:00:00.000Z",
      status: {
        project: { name: "</script><script>alert(1)</script>" }
      }
    } as unknown as DashboardSnapshot;

    const html = renderDashboardPage(mockSnapshot);
    assert.ok(!html.includes("</script><script>alert(1)</script>"));
    assert.ok(html.includes("\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"));
  });
});
