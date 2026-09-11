import assert from "node:assert";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  isDecadeNumberedLayout,
  resolveWorkspacePaths,
  type WorkspacePaths
} from "../lib/workspace-paths.js";

test("resolveWorkspacePaths: resolves legacy flat layout when 00-context is absent", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-legacy-"));
  try {
    await fs.mkdir(path.join(tmpDir, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "history"), { recursive: true });

    assert.strictEqual(await isDecadeNumberedLayout(tmpDir), false);

    const paths = await resolveWorkspacePaths(tmpDir);
    assert.strictEqual(paths.contextDir, "devflow/context");
    assert.strictEqual(paths.tasksDir, "devflow/context");
    assert.strictEqual(paths.historyDir, "devflow/history");
    assert.strictEqual(paths.isDecadeNumbered, false);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test("resolveWorkspacePaths: resolves decade-numbered layout when 00-context is present", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-decade-"));
  try {
    await fs.mkdir(path.join(tmpDir, "devflow", "00-context"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "10-ideation"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "20-discovery"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "30-planning"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "40-tasks"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "50-history"), { recursive: true });
    await fs.mkdir(path.join(tmpDir, "devflow", "60-docs"), { recursive: true });

    assert.strictEqual(await isDecadeNumberedLayout(tmpDir), true);

    const paths = await resolveWorkspacePaths(tmpDir);
    assert.strictEqual(paths.contextDir, "devflow/00-context");
    assert.strictEqual(paths.ideationDir, "devflow/10-ideation");
    assert.strictEqual(paths.discoveryDir, "devflow/20-discovery");
    assert.strictEqual(paths.planningDir, "devflow/30-planning");
    assert.strictEqual(paths.tasksDir, "devflow/40-tasks");
    assert.strictEqual(paths.historyDir, "devflow/50-history");
    assert.strictEqual(paths.docsDir, "devflow/60-docs");
    assert.strictEqual(paths.isDecadeNumbered, true);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});

test("resolveWorkspacePaths: respects custom workspace paths from manifest", async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-manifest-"));
  try {
    await fs.mkdir(path.join(tmpDir, ".nexus"), { recursive: true });
    const manifest = {
      schemaVersion: 1,
      workspace: {
        contextDir: "devflow/custom-context",
        tasksDir: "devflow/custom-tasks",
        historyDir: "devflow/custom-history"
      }
    };
    await fs.writeFile(
      path.join(tmpDir, ".nexus", "nexus-devflow.json"),
      JSON.stringify(manifest, null, 2),
      "utf8"
    );

    const paths = await resolveWorkspacePaths(tmpDir);
    assert.strictEqual(paths.contextDir, "devflow/custom-context");
    assert.strictEqual(paths.tasksDir, "devflow/custom-tasks");
    assert.strictEqual(paths.historyDir, "devflow/custom-history");
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
});
