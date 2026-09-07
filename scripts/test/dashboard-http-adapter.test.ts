import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import path from "node:path";
import { startDashboardServer } from "../../packages/create-nexus-devflow/lib/dashboard.js";

const projectRoot = path.resolve(".");

function get(url: string): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers, body }));
    }).on("error", reject);
  });
}

function post(url: string, data: unknown): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode || 0, headers: res.headers, body }));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

describe("Dashboard HTTP Adapter Seam", () => {
  it("starts HTTP server, handles state and action routes, and shuts down cleanly", async () => {
    const server = await startDashboardServer(projectRoot, {
      port: 0,
      snapshotOptions: {
        fetchImpl: async () => { throw new Error("offline"); }
      }
    });

    try {
      assert.ok(server.url.startsWith("http://127.0.0.1:"));

      // 1. Root page
      const rootRes = await get(`${server.url}/`);
      assert.equal(rootRes.statusCode, 200);
      assert.ok(rootRes.body.includes("<!doctype html>"));
      assert.ok(rootRes.headers["content-security-policy"]);

      // 2. /api/status
      const statusRes = await get(`${server.url}/api/status`);
      assert.equal(statusRes.statusCode, 200);
      const statusData = JSON.parse(statusRes.body);
      assert.ok(statusData.project);

      // 3. /api/snapshot & /api/dashboard
      const snapRes = await get(`${server.url}/api/snapshot`);
      assert.equal(snapRes.statusCode, 200);
      const snapData = JSON.parse(snapRes.body);
      assert.equal(snapData.schemaVersion, 1);

      // 4. /api/codegraph & /api/graph
      const graphRes = await get(`${server.url}/api/codegraph`);
      assert.equal(graphRes.statusCode, 200);
      const graphData = JSON.parse(graphRes.body);
      assert.equal(typeof graphData.totalFiles, "number");

      // 5. /api/action POST
      const actionRes = await post(`${server.url}/api/action`, { type: "check-gate" });
      assert.equal(actionRes.statusCode, 200);
      const actionData = JSON.parse(actionRes.body);
      assert.equal(actionData.ok, true);

    } finally {
      await server.close();
    }
  });
});
