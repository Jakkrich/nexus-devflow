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
    assert.equal(dashboardJson.workflow.track, "idle");
    assert.equal(dashboardJson.update.state, "offline");
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
