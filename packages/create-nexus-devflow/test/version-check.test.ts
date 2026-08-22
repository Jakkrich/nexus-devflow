import assert from "node:assert/strict";
import test from "node:test";

import { checkPackageVersion, clearVersionCheckCache } from "../lib/version-check.js";

test("checkPackageVersion reports current and available versions", async () => {
  clearVersionCheckCache();
  const current = await checkPackageVersion({
    installedVersion: "2.0.25",
    fetchImpl: async () => new Response(JSON.stringify({ version: "2.0.25" }), { status: 200 }),
    cacheTtlMs: 0
  });
  assert.equal(current.state, "current");
  const available = await checkPackageVersion({
    installedVersion: "2.0.25",
    packageName: "example-next",
    fetchImpl: async () => new Response(JSON.stringify({ version: "2.1.0" }), { status: 200 }),
    cacheTtlMs: 0
  });
  assert.equal(available.state, "available");
  assert.equal(available.latestVersion, "2.1.0");
});

test("checkPackageVersion degrades safely when registry is offline", async () => {
  clearVersionCheckCache();
  const result = await checkPackageVersion({
    installedVersion: "2.0.25",
    fetchImpl: async () => { throw new Error("offline"); },
    cacheTtlMs: 0
  });
  assert.equal(result.state, "offline");
  assert.equal(result.installedVersion, "2.0.25");
});

test("checkPackageVersion reuses a cached result", async () => {
  clearVersionCheckCache();
  let calls = 0;
  const fetchImpl = async (): Promise<Response> => {
    calls += 1;
    return new Response(JSON.stringify({ version: "2.0.25" }), { status: 200 });
  };
  await checkPackageVersion({ installedVersion: "2.0.25", fetchImpl, cacheTtlMs: 1000, now: () => 100 });
  await checkPackageVersion({ installedVersion: "2.0.25", fetchImpl, cacheTtlMs: 1000, now: () => 200 });
  assert.equal(calls, 1);
});
