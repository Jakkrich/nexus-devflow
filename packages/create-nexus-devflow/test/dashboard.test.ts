import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { startDashboardServer } from "../lib/dashboard.js";

test("startDashboardServer starts server and responds to / and /api/status", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-test-dash-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Instructions\n");

    const server = await startDashboardServer(tempDir);
    assert.equal(typeof server.url, "string");
    assert.equal(server.url.startsWith("http://127.0.0.1"), true);

    const rootRes = await fetchUrl(`${server.url}/`);
    assert.equal(rootRes.statusCode, 200);
    assert.equal(rootRes.body.includes("Nexus-DevFlow"), true);

    const apiRes = await fetchUrl(`${server.url}/api/status`);
    assert.equal(apiRes.statusCode, 200);
    const json = JSON.parse(apiRes.body) as { project: { root: string } };
    assert.equal(json.project.root, tempDir);

    await server.close();
  } finally {
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
