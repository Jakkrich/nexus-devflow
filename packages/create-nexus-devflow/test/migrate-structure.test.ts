import assert from "node:assert";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { migrateDevflowStructure } from "../lib/tooling/commands/migrate-structure.js";
import { isDecadeNumberedLayout, resolveWorkspacePaths } from "../lib/workspace-paths.js";

test("migrateDevflowStructure: successfully migrates legacy layout to decade-numbered structure", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-migrate-"));
  try {
    // Scaffold legacy structure
    const devflowDir = path.join(tmpDir, "devflow");
    await fs.mkdir(path.join(devflowDir, "context", "001-sample-task"), { recursive: true });
    await fs.writeFile(path.join(devflowDir, "context", "project-overview.md"), "# Overview", "utf8");
    await fs.writeFile(path.join(devflowDir, "context", "coding-standards.md"), "# Standards", "utf8");
    await fs.writeFile(path.join(devflowDir, "context", "001-sample-task", "spec.md"), "# Spec", "utf8");

    await fs.mkdir(path.join(devflowDir, "history", "features"), { recursive: true });
    await fs.writeFile(path.join(devflowDir, "history", "HISTORY.md"), "# History", "utf8");

    await fs.writeFile(path.join(devflowDir, "ideas.md"), "# Ideas", "utf8");
    await fs.writeFile(path.join(devflowDir, "project-plan.md"), "# Project Plan", "utf8");
    await fs.writeFile(path.join(devflowDir, "build-plan.md"), "# Build Plan", "utf8");

    await fs.mkdir(path.join(devflowDir, "discoveries"), { recursive: true });
    await fs.writeFile(path.join(devflowDir, "discoveries", "disc-1.md"), "# Discovery", "utf8");

    await fs.mkdir(path.join(devflowDir, "runs"), { recursive: true }); // legacy empty folder

    await fs.mkdir(path.join(tmpDir, ".nexus"), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, ".nexus", "nexus-devflow.json"),
      JSON.stringify({
        schemaVersion: 1,
        workspace: {
          contextDir: "devflow/context",
          historyDir: "devflow/history",
          runsDir: "devflow/runs"
        }
      }, null, 2),
      "utf8"
    );

    // Verify it starts as legacy
    assert.strictEqual(await isDecadeNumberedLayout(tmpDir), false);

    // Run migration
    const result = await migrateDevflowStructure(tmpDir);
    assert.strictEqual(result.success, true);
    assert.strictEqual(await isDecadeNumberedLayout(tmpDir), true);

    // Verify 00-context
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "00-context", "project-overview.md"), "utf8"),
      "# Overview"
    );

    // Verify 10-ideation
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "10-ideation", "ideas.md"), "utf8"),
      "# Ideas"
    );

    // Verify 20-discovery
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "20-discovery", "discoveries", "disc-1.md"), "utf8"),
      "# Discovery"
    );

    // Verify 30-planning
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "30-planning", "project-plan.md"), "utf8"),
      "# Project Plan"
    );
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "30-planning", "build-plan.md"), "utf8"),
      "# Build Plan"
    );

    // Verify 40-tasks
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "40-tasks", "001-sample-task", "spec.md"), "utf8"),
      "# Spec"
    );

    // Verify 50-history
    assert.strictEqual(
      await fs.readFile(path.join(devflowDir, "50-history", "HISTORY.md"), "utf8"),
      "# History"
    );

    // Verify legacy runs folder is removed
    let runsExists = false;
    try {
      await fs.stat(path.join(devflowDir, "runs"));
      runsExists = true;
    } catch {
      runsExists = false;
    }
    const paths = await resolveWorkspacePaths(tmpDir);
    assert.strictEqual(paths.contextDir, "devflow/00-context");
    assert.strictEqual(paths.tasksDir, "devflow/40-tasks");
    assert.strictEqual(paths.historyDir, "devflow/50-history");
    assert.strictEqual(paths.isDecadeNumbered, true);

    // Run migration again on already-migrated workspace (should be a safe no-op)
    const secondRun = await migrateDevflowStructure(tmpDir);
    assert.strictEqual(secondRun.success, true);
    assert.strictEqual(secondRun.moved.length, 0);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

