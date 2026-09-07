import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ActiveContextEngine } from "../lib/active-context-engine.js";

async function setupDevFlowTestProject(dir: string): Promise<void> {
  await fs.mkdir(path.join(dir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(dir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(dir, "AGENTS.md"), "# DevFlow Instructions\n", "utf8");
}

test("ActiveContextEngine: resolves clean idle workspace", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-ctx-idle-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const engine = new ActiveContextEngine(tempDir);

    const context = await engine.getActiveContext();
    assert.equal(context.state, "idle");
    assert.equal(context.runId, null);
    assert.equal(context.currentWork.state, "idle");
    assert.equal(context.currentWork.total, 0);
    assert.equal(context.currentWork.remaining, 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("ActiveContextEngine: atomically resolves active fast-track task workspace", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-ctx-active-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const taskDir = path.join(tempDir, "devflow", "context", "001-test");
    await fs.mkdir(taskDir, { recursive: true });
    await fs.writeFile(
      path.join(taskDir, "spec.md"),
      `# 📐 [001-test] Test Feature\n\n## 3. Implementation Checklist\n- [x] Task 1: Setup\n- [ ] Task 2: Implement\n`
    );
    await fs.writeFile(
      path.join(taskDir, "stage.md"),
      `# Current Stage\n\n- Active Running ID: \`001-test\`\n- Track: \`fast\`\n- Current Stage: \`implement\`\n`
    );

    const engine = new ActiveContextEngine(tempDir);
    const context = await engine.getActiveContext();

    assert.equal(context.state, "active");
    assert.equal(context.runId, "001-test");
    assert.equal(context.track, "fast");
    assert.equal(context.stage, "implement");
    assert.equal(context.currentWork.total, 2);
    assert.equal(context.currentWork.completed, 1);
    assert.equal(context.currentWork.remaining, 1);
    assert.ok(context.paths.featureSpecPath.includes("001-test"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("ActiveContextEngine: detects pre-flight discovery state and supports caching", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-ctx-disc-"));

  try {
    await setupDevFlowTestProject(tempDir);
    const discDir = path.join(tempDir, "devflow", "discoveries", "DISC-001");
    await fs.mkdir(discDir, { recursive: true });
    await fs.writeFile(
      path.join(discDir, "discovery.md"),
      `# Discovery: Vector DB Migration\n\n- Date: 2026-09-07\n- Decision: Proceed\n`
    );

    const engine = new ActiveContextEngine(tempDir, { cacheTtlMs: 5000 });
    const discoveries = await engine.getDiscoveries();
    assert.equal(discoveries.total, 1);
    assert.equal(discoveries.recent[0].id, "DISC-001");

    const context1 = await engine.getActiveContext();
    assert.equal(context1.state, "pre-flight");
    assert.equal(context1.track, "deep");
    assert.ok(context1.discoveries.includes("DISC-001"));

    // Cache test: cached instance is returned
    const context2 = await engine.getActiveContext();
    assert.equal(context1, context2);

    // Invalidate cache
    engine.invalidate();
    const context3 = await engine.getActiveContext();
    assert.notEqual(context1, context3);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

