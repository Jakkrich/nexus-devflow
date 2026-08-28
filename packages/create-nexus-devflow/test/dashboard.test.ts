import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { startDashboardServer } from "../lib/dashboard.js";

test("startDashboardServer starts server and responds to / and /api/status", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-test-dash-"));
  let server: Awaited<ReturnType<typeof startDashboardServer>> | undefined;
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Instructions\n");

    server = await startDashboardServer(tempDir, {
      snapshotOptions: {
        fetchImpl: async () => { throw new Error("offline"); }
      }
    });
    assert.equal(typeof server.url, "string");
    assert.equal(server.url.startsWith("http://127.0.0.1"), true);

    const rootRes = await fetchUrl(`${server.url}/`);
    assert.equal(rootRes.statusCode, 200);
    assert.equal(rootRes.body.includes("Nexus-DevFlow"), true);
    assert.equal(rootRes.body.includes("Google Sans Thai"), true);
    assert.equal(rootRes.body.includes("#dual-track{overflow:hidden}"), true);
    assert.equal(rootRes.body.includes(".cmd:focus:after"), true);
    assert.equal(rootRes.body.includes('id="dual-track"'), true);
    assert.equal(rootRes.body.includes('id="command-list"'), true);
    assert.equal(rootRes.body.indexOf('id="dual-track"') < rootRes.body.indexOf('id="next-panel"'), true);
    assert.equal(rootRes.body.indexOf('id="next-panel"') < rootRes.body.indexOf('class="stats"'), true);

    const apiRes = await fetchUrl(`${server.url}/api/status`);
    assert.equal(apiRes.statusCode, 200);
    const json = JSON.parse(apiRes.body) as { project: { root: string } };
    const expectedRoot = await fs.realpath(tempDir);
    assert.equal(json.project.root, expectedRoot);

    const dashboardRes = await fetchUrl(`${server.url}/api/dashboard`);
    assert.equal(dashboardRes.statusCode, 200);
    const dashboardJson = JSON.parse(dashboardRes.body) as {
      schemaVersion: number;
      status: { project: { root: string } };
      workflow: { track: string };
      update: { state: string };
    };
    assert.equal(dashboardJson.schemaVersion, 1);
    assert.equal(dashboardJson.status.project.root, expectedRoot);
    const graphRes = await fetchUrl(`${server.url}/api/graph`);
    assert.equal(graphRes.statusCode, 200);
    const graphJson = JSON.parse(graphRes.body) as { totalFiles: number };
    assert.equal(typeof graphJson.totalFiles, "number");

    const reconcileRes = await fetchUrl(`${server.url}/api/reconcile`);
    assert.equal(reconcileRes.statusCode, 200);
    const reconcileJson = JSON.parse(reconcileRes.body) as { reconciled: boolean; healedStage: boolean };
    assert.equal(typeof reconcileJson.reconciled, "boolean");
  } finally {
    if (server) {
      await server.close();
    }
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("dashboard renders multi-task living spec workspaces from devflow/context/{xxx-slug}/", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-test-multitask-dash-"));
  let server: Awaited<ReturnType<typeof startDashboardServer>> | undefined;
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context", "001-auth"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "context", "002-billing"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Instructions\n");

    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "001-auth", "spec.md"),
      `# 📐 [001-auth] Authentication Module\n\n## 3. Implementation Checklist\n- [x] Task 1\n- [ ] Task 2\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(tempDir, "devflow", "context", "002-billing", "spec.md"),
      `# 📐 [002-billing] Invoicing Module\n\n## 3. Implementation Checklist\n- [ ] Task 1\n`,
      "utf8"
    );

    server = await startDashboardServer(tempDir, {
      snapshotOptions: {
        fetchImpl: async () => { throw new Error("offline"); }
      }
    });

    const rootRes = await fetchUrl(`${server.url}/`);
    assert.equal(rootRes.statusCode, 200);
    assert.ok(rootRes.body.includes('id="active-workspaces-list"'));
    assert.ok(rootRes.body.includes("renderActiveWorkspaces"));

    const dashboardRes = await fetchUrl(`${server.url}/api/dashboard`);
    assert.equal(dashboardRes.statusCode, 200);
    const json = JSON.parse(dashboardRes.body) as {
      status: { activeRuns: Array<{ runId: string; title: string }> };
    };
    assert.equal(json.status.activeRuns.length, 2);
    assert.equal(json.status.activeRuns[0].runId, "001-auth");
    assert.equal(json.status.activeRuns[1].runId, "002-billing");
  } finally {
    if (server) {
      await server.close();
    }
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});



async function fetchUrl(url: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => { resolve({ statusCode: res.statusCode || 500, body: data }); });
    }).on("error", reject);
  });
}
