import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "../bin/create-nexus-devflow.js";
import { applyUninstall, prepareUninstall } from "../lib/uninstall.js";

test("parseArgs parses uninstall and eject commands correctly", () => {
  const uninstallOptions = parseArgs(["uninstall", "./my-app", "-y", "--keep-history"]);
  assert.equal(uninstallOptions.command, "uninstall");
  assert.equal(uninstallOptions.target, "./my-app");
  assert.equal(uninstallOptions.yes, true);
  assert.equal(uninstallOptions.keepHistory, true);

  const ejectOptions = parseArgs(["eject", "--dry-run", "--json"]);
  assert.equal(ejectOptions.command, "eject");
  assert.equal(ejectOptions.target, ".");
  assert.equal(ejectOptions.dryRun, true);
  assert.equal(ejectOptions.json, true);
});

test("prepareUninstall identifies all DevFlow files and directories", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-uninstall-test-"));

  try {
    // Setup mock DevFlow structure + user app files
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "devflow", "context", "project-overview.md"), "# Overview");
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, ".agents", "skills", "test.md"), "skill");
    await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
    await fs.writeFile(path.join(tempDir, ".nexus", "nexus-devflow.json"), "{}");
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Agents");
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), "# Claude");

    // User files that must NOT be touched
    await fs.mkdir(path.join(tempDir, "src"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "src", "index.ts"), "console.log('hello');");
    await fs.writeFile(path.join(tempDir, "package.json"), "{\"name\": \"my-app\"}");

    const prepared = await prepareUninstall({ targetDir: tempDir });

    assert.equal(prepared.itemsToDelete.includes("AGENTS.md"), true);
    assert.equal(prepared.itemsToDelete.includes("CLAUDE.md"), true);
    assert.equal(prepared.itemsToDelete.includes("devflow"), true);
    assert.equal(prepared.itemsToDelete.includes(".agents"), true);
    assert.equal(prepared.itemsToDelete.includes(".claude"), true);
    assert.equal(prepared.itemsToDelete.includes(".nexus"), true);
    assert.equal(prepared.itemsToDelete.includes("src"), false);
    assert.equal(prepared.itemsToDelete.includes("package.json"), false);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("applyUninstall in dryRun mode does not delete files from disk", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-uninstall-dry-test-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Agents");

    const prepared = await prepareUninstall({ targetDir: tempDir });
    const result = await applyUninstall(prepared, { dryRun: true });

    assert.equal(result.success, true);
    assert.equal(result.deletedCount, 2);

    // Verify files still exist on disk
    const agentsStat = await fs.stat(path.join(tempDir, "AGENTS.md"));
    assert.equal(agentsStat.isFile(), true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("applyUninstall completely removes DevFlow files leaving user files intact", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-uninstall-apply-test-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "devflow", "context", "project-overview.md"), "# Overview");
    await fs.mkdir(path.join(tempDir, ".agents"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".claude"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Agents");
    await fs.writeFile(path.join(tempDir, "CLAUDE.md"), "# Claude");

    // User app files
    await fs.mkdir(path.join(tempDir, "src"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "src", "index.ts"), "export const a = 1;");
    await fs.writeFile(path.join(tempDir, "package.json"), "{\"name\":\"user-app\"}");

    const prepared = await prepareUninstall({ targetDir: tempDir });
    const result = await applyUninstall(prepared);

    assert.equal(result.success, true);
    assert.equal(result.deletedCount >= 6, true);

    // Check that DevFlow files are gone
    await assert.rejects(fs.stat(path.join(tempDir, "AGENTS.md")));
    await assert.rejects(fs.stat(path.join(tempDir, "CLAUDE.md")));
    await assert.rejects(fs.stat(path.join(tempDir, "devflow")));
    await assert.rejects(fs.stat(path.join(tempDir, ".agents")));
    await assert.rejects(fs.stat(path.join(tempDir, ".claude")));
    await assert.rejects(fs.stat(path.join(tempDir, ".nexus")));

    // Check that User files remain untouched
    const srcStat = await fs.stat(path.join(tempDir, "src", "index.ts"));
    assert.equal(srcStat.isFile(), true);
    const pkgStat = await fs.stat(path.join(tempDir, "package.json"));
    assert.equal(pkgStat.isFile(), true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("prepareUninstall with keepHistory: true preserves devflow/history directory", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-uninstall-history-test-"));

  try {
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "devflow", "context", "project-overview.md"), "# Overview");
    await fs.mkdir(path.join(tempDir, "devflow", "history"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "devflow", "history", "HISTORY.md"), "# History");
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# Agents");

    const prepared = await prepareUninstall({ targetDir: tempDir, keepHistory: true });
    const result = await applyUninstall(prepared);

    assert.equal(result.success, true);

    // Verify history directory is still there
    const historyStat = await fs.stat(path.join(tempDir, "devflow", "history", "HISTORY.md"));
    assert.equal(historyStat.isFile(), true);

    // Verify other context and root files are deleted
    await assert.rejects(fs.stat(path.join(tempDir, "devflow", "context")));
    await assert.rejects(fs.stat(path.join(tempDir, "AGENTS.md")));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
