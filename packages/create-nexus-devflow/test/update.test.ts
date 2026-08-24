import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  adapterListFromMode,
  applyPreparedUpdate,
  createManifest,
  prepareUpdate,
  readManifest,
  type TemplateFile
} from "../lib/update.js";

test("adapterListFromMode resolves adapter aliases correctly", () => {
  assert.deepEqual(adapterListFromMode("both"), ["codex", "claude", "copilot", "antigravity", "opencode"]);
  assert.deepEqual(adapterListFromMode("all"), ["codex", "claude", "copilot", "antigravity", "opencode"]);
  assert.deepEqual(adapterListFromMode("copilot"), ["copilot"]);
  assert.deepEqual(adapterListFromMode("opencode"), ["opencode"]);
  assert.deepEqual(adapterListFromMode("antigravity"), ["antigravity", "codex"]);
  assert.deepEqual(adapterListFromMode("codex"), ["codex"]);
  assert.deepEqual(adapterListFromMode("claude"), ["claude"]);
  assert.throws(() => adapterListFromMode("invalid"), /Unknown adapter mode/);
});

test("createManifest constructs valid manifest metadata", () => {
  const templateFiles = new Map<string, TemplateFile>([
    ["AGENTS.md", { source: "/tmp/AGENTS.md", hash: "hash123" }],
    ["CLAUDE.md", { source: "/tmp/CLAUDE.md", hash: "hash456" }]
  ]);

  const manifest = createManifest("2.0.0", ["codex", "claude"], templateFiles);

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.version, "2.0.0");
  assert.deepEqual(manifest.adapters, ["claude", "codex"]);
  assert.equal(manifest.managedFiles["AGENTS.md"], "hash123");
  assert.equal(manifest.managedFiles["CLAUDE.md"], "hash456");
});

test("prepareUpdate and applyPreparedUpdate overlay files into clean directory", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-test-"));
  const templateRoot = path.join(tempDir, "template");

  await fs.mkdir(path.join(templateRoot, "devflow"), { recursive: true });
  await fs.mkdir(path.join(templateRoot, ".agents", "skills"), { recursive: true });

  await fs.writeFile(path.join(templateRoot, "AGENTS.md"), "# AGENTS\n");
  await fs.writeFile(path.join(templateRoot, "CLAUDE.md"), "# CLAUDE\n");
  await fs.writeFile(path.join(templateRoot, "LICENSE"), "MIT\n");
  await fs.writeFile(path.join(templateRoot, "devflow", "test.txt"), "hello\n");
  await fs.writeFile(
    path.join(templateRoot, ".agents", "skills", "test.md"),
    "skill\n"
  );

  const targetDir = path.join(tempDir, "target");
  await fs.mkdir(targetDir, { recursive: true });

  try {
    const prepared = await prepareUpdate({
      targetDir,
      templateRoot,
      version: "2.0.0",
      adapter: "both"
    });

    assert.equal(prepared.createList.length > 0, true);
    assert.equal(prepared.conflictList.length, 0);

    const result = await applyPreparedUpdate(prepared);
    assert.equal(result.appliedCount > 0, true);
    assert.equal(result.backupDir, null); // Fresh install should not create backup

    const installedManifest = await readManifest(targetDir);
    assert.notEqual(installedManifest, null);
    assert.equal(installedManifest!.version, "2.0.0");

    const targetAgents = await fs.readFile(path.join(targetDir, "AGENTS.md"), "utf8");
    assert.equal(targetAgents, "# AGENTS\n");

    const ignoreContent = await fs.readFile(path.join(targetDir, ".nexus", ".gitignore"), "utf8");
    assert.match(ignoreContent, /backups\//);
    assert.match(ignoreContent, /staging\//);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("applyPreparedUpdate creates backup directory and backup.json when updating modified files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-backup-test-"));
  const templateRoot1 = path.join(tempDir, "template1");
  const templateRoot2 = path.join(tempDir, "template2");
  const targetDir = path.join(tempDir, "target");

  await fs.mkdir(path.join(templateRoot1, "devflow"), { recursive: true });
  await fs.mkdir(path.join(templateRoot2, "devflow"), { recursive: true });
  await fs.mkdir(targetDir, { recursive: true });

  await fs.writeFile(path.join(templateRoot1, "AGENTS.md"), "# V1 AGENTS\n");
  await fs.writeFile(path.join(templateRoot1, "LICENSE"), "MIT V1\n");

  await fs.writeFile(path.join(templateRoot2, "AGENTS.md"), "# V2 AGENTS\n");
  await fs.writeFile(path.join(templateRoot2, "LICENSE"), "MIT V2\n");

  try {
    // 1. Initial Install (v1)
    const prep1 = await prepareUpdate({
      targetDir,
      templateRoot: templateRoot1,
      version: "1.0.0",
      adapter: "both"
    });
    const res1 = await applyPreparedUpdate(prep1);
    assert.equal(res1.backupDir, null);

    // 2. Update to v2
    const prep2 = await prepareUpdate({
      targetDir,
      templateRoot: templateRoot2,
      version: "2.0.0",
      adapter: "both"
    });
    const res2 = await applyPreparedUpdate(prep2);
    assert.notEqual(res2.backupDir, null);

    // Verify backup contents
    const backupJsonPath = path.join(res2.backupDir!, "backup.json");
    const backupMeta = JSON.parse(await fs.readFile(backupJsonPath, "utf8"));
    assert.equal(backupMeta.fromVersion, "1.0.0");
    assert.equal(backupMeta.toVersion, "2.0.0");
    assert.deepEqual(backupMeta.replaced.sort(), ["AGENTS.md", "LICENSE"].sort());

    const backedUpAgents = await fs.readFile(path.join(res2.backupDir!, "files", "AGENTS.md"), "utf8");
    assert.equal(backedUpAgents, "# V1 AGENTS\n");

    const updatedAgents = await fs.readFile(path.join(targetDir, "AGENTS.md"), "utf8");
    assert.equal(updatedAgents, "# V2 AGENTS\n");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

