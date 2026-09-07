import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { DashboardStateEngine } from "../../packages/create-nexus-devflow/lib/dashboard-engine.js";

const projectRoot = path.resolve(".");

describe("DashboardStateEngine Seam", () => {
  it("initializes and queries project status in-memory", async () => {
    const engine = new DashboardStateEngine(projectRoot);
    const status = await engine.getStatus();
    assert.ok(status);
    assert.ok(status.project);
    assert.equal(typeof status.project.root, "string");
  });

  it("queries dashboard snapshot and caches in-memory", async () => {
    const engine = new DashboardStateEngine(projectRoot);
    const snapshot1 = await engine.getSnapshot();
    assert.ok(snapshot1);
    assert.ok(snapshot1.status);
    assert.ok(snapshot1.generatedAt);

    // Second call should return cached instance
    const snapshot2 = await engine.getSnapshot();
    assert.equal(snapshot1.generatedAt, snapshot2.generatedAt);
  });

  it("builds code graph and calculates blast radius in-memory", async () => {
    const engine = new DashboardStateEngine(projectRoot);
    const graph = await engine.getCodeGraph();
    assert.ok(graph);

    const blastRadius = await engine.getBlastRadius("packages/create-nexus-devflow/lib/ui.ts");
    assert.ok(blastRadius);
    assert.ok(Array.isArray(blastRadius.directDependents));
  });

  it("composes GatekeeperEngine and dispatches gate and reconcile actions", async () => {
    const engine = new DashboardStateEngine(projectRoot);
    assert.ok(engine.gatekeeper);
    assert.equal(typeof engine.gatekeeper.evaluate, "function");
    assert.equal(typeof engine.gatekeeper.reconcile, "function");

    const gateResult = await engine.dispatchAction({ type: "check-gate" });
    assert.equal(gateResult.ok, true);
    assert.ok(gateResult.data);

    const reconcileResult = await engine.dispatchAction({ type: "reconcile" });
    assert.equal(reconcileResult.ok, true);
    assert.ok(reconcileResult.data);
  });
});

