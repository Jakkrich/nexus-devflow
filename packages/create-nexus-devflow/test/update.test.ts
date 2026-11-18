import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
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

test("applyPreparedUpdate removes retired status and doctor skill folders and installs devflow-status and devflow-doctor", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-rename-update-"));
  const templateRoot1 = path.join(tempDir, "template1");
  const templateRoot2 = path.join(tempDir, "template2");
  const targetDir = path.join(tempDir, "target");

  try {
    for (const adapter of [".agents", ".claude"]) {
      await fs.mkdir(path.join(templateRoot1, adapter, "skills", "status"), { recursive: true });
      await fs.mkdir(path.join(templateRoot1, adapter, "skills", "doctor", "scripts"), { recursive: true });
      await fs.writeFile(path.join(templateRoot1, adapter, "skills", "status", "SKILL.md"), "# status\n");
      await fs.writeFile(path.join(templateRoot1, adapter, "skills", "doctor", "SKILL.md"), "# doctor\n");
      await fs.writeFile(path.join(templateRoot1, adapter, "skills", "doctor", "scripts", "run-state.mjs"), "// v1\n");

      await fs.mkdir(path.join(templateRoot2, adapter, "skills", "devflow-status"), { recursive: true });
      await fs.mkdir(path.join(templateRoot2, adapter, "skills", "devflow-doctor", "scripts"), { recursive: true });
      await fs.writeFile(path.join(templateRoot2, adapter, "skills", "devflow-status", "SKILL.md"), "# devflow-status\n");
      await fs.writeFile(path.join(templateRoot2, adapter, "skills", "devflow-doctor", "SKILL.md"), "# devflow-doctor\n");
      await fs.writeFile(path.join(templateRoot2, adapter, "skills", "devflow-doctor", "scripts", "run-state.mjs"), "// v2\n");
    }
    await fs.mkdir(path.join(templateRoot1, "devflow"), { recursive: true });
    await fs.mkdir(path.join(templateRoot2, "devflow"), { recursive: true });
    await fs.writeFile(path.join(templateRoot1, "AGENTS.md"), "# AGENTS\n");
    await fs.writeFile(path.join(templateRoot2, "AGENTS.md"), "# AGENTS\n");
    await fs.mkdir(targetDir, { recursive: true });

    const prep1 = await prepareUpdate({
      targetDir,
      templateRoot: templateRoot1,
      version: "2.19.4",
      adapter: "both"
    });
    await applyPreparedUpdate(prep1);

    const prep2 = await prepareUpdate({
      targetDir,
      templateRoot: templateRoot2,
      version: "2.20.0",
      adapter: "both"
    });
    await applyPreparedUpdate(prep2);

    for (const adapter of [".agents", ".claude"]) {
      await assert.rejects(fs.stat(path.join(targetDir, adapter, "skills", "status")), { code: "ENOENT" });
      await assert.rejects(fs.stat(path.join(targetDir, adapter, "skills", "doctor")), { code: "ENOENT" });
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "devflow-status", "SKILL.md")));
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "devflow-doctor", "scripts", "run-state.mjs")));
    }

    const updatedManifest = await readManifest(targetDir);
    assert.ok(updatedManifest, "manifest should exist after update");
    assert.ok(updatedManifest.lifecycle.companionCommands.includes("devflow"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("devflow-doctor"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("devflow-status"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("try"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("report-html"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("doctor"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("applyPreparedUpdate prunes retired 115b skills from existing installations", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-115b-prune-"));
  const templateRoot1 = path.join(tempDir, "template1");
  const templateRoot2 = path.join(tempDir, "template2");
  const targetDir = path.join(tempDir, "target");

  try {
    const retired = ["try", "report-html", "ponytail", "setup-tests", "ci", "release", "rollback", "vendor"];
    for (const adapter of [".agents", ".claude"]) {
      await fs.mkdir(path.join(templateRoot1, adapter, "skills", "feature"), { recursive: true });
      await fs.writeFile(path.join(templateRoot1, adapter, "skills", "feature", "SKILL.md"), "# feature\n");
      for (const name of retired) {
        await fs.mkdir(path.join(templateRoot1, adapter, "skills", name), { recursive: true });
        await fs.writeFile(path.join(templateRoot1, adapter, "skills", name, "SKILL.md"), `# ${name}\n`);
      }

      await fs.mkdir(path.join(templateRoot2, adapter, "skills", "feature"), { recursive: true });
      await fs.writeFile(path.join(templateRoot2, adapter, "skills", "feature", "SKILL.md"), "# feature\n");
    }
    await fs.mkdir(path.join(templateRoot1, "devflow"), { recursive: true });
    await fs.mkdir(path.join(templateRoot2, "devflow"), { recursive: true });
    await fs.writeFile(path.join(templateRoot1, "AGENTS.md"), "# AGENTS\n");
    await fs.writeFile(path.join(templateRoot2, "AGENTS.md"), "# AGENTS\n");
    await fs.mkdir(targetDir, { recursive: true });

    const prep1 = await prepareUpdate({
      targetDir,
      templateRoot: templateRoot1,
      version: "2.19.4",
      adapter: "both"
    });
    await applyPreparedUpdate(prep1);

    const prep2 = await prepareUpdate({
      targetDir,
      templateRoot: templateRoot2,
      version: "2.20.0",
      adapter: "both"
    });
    await applyPreparedUpdate(prep2);

    for (const adapter of [".agents", ".claude"]) {
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "feature", "SKILL.md")));
      for (const name of retired) {
        await assert.rejects(fs.stat(path.join(targetDir, adapter, "skills", name)), { code: "ENOENT" });
      }
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("applyPreparedUpdate prunes consolidated 115c skills from existing installations", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-115c-prune-"));
  const templateRoot1 = path.join(tempDir, "template1");
  const templateRoot2 = path.join(tempDir, "template2");
  const targetDir = path.join(tempDir, "target");

  try {
    const consolidated = ["adopt", "analyze", "brainstorm", "brief", "continuous", "devflow-doctor", "devflow-status", "grill", "test"];
    for (const adapter of [".agents", ".claude"]) {
      await fs.mkdir(path.join(templateRoot1, adapter, "skills", "devflow"), { recursive: true });
      await fs.writeFile(path.join(templateRoot1, adapter, "skills", "devflow", "SKILL.md"), "# devflow v1\n");
      for (const name of consolidated) {
        await fs.mkdir(path.join(templateRoot1, adapter, "skills", name), { recursive: true });
        await fs.writeFile(path.join(templateRoot1, adapter, "skills", name, "SKILL.md"), `# ${name}\n`);
      }

      await fs.mkdir(path.join(templateRoot2, adapter, "skills", "devflow", "scripts"), { recursive: true });
      await fs.writeFile(path.join(templateRoot2, adapter, "skills", "devflow", "SKILL.md"), "# devflow v2\n");
      await fs.writeFile(path.join(templateRoot2, adapter, "skills", "devflow", "scripts", "run-state.mjs"), "// v2\n");
    }
    await fs.mkdir(path.join(templateRoot1, "devflow"), { recursive: true });
    await fs.mkdir(path.join(templateRoot2, "devflow"), { recursive: true });
    await fs.writeFile(path.join(templateRoot1, "AGENTS.md"), "# AGENTS\n");
    await fs.writeFile(path.join(templateRoot2, "AGENTS.md"), "# AGENTS\n");
    await fs.mkdir(targetDir, { recursive: true });

    const prep1 = await prepareUpdate({ targetDir, templateRoot: templateRoot1, version: "2.19.4", adapter: "both" });
    await applyPreparedUpdate(prep1);

    const prep2 = await prepareUpdate({ targetDir, templateRoot: templateRoot2, version: "2.20.0", adapter: "both" });
    await applyPreparedUpdate(prep2);

    for (const adapter of [".agents", ".claude"]) {
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "devflow", "scripts", "run-state.mjs")));
      for (const name of consolidated) {
        await assert.rejects(fs.stat(path.join(targetDir, adapter, "skills", name)), { code: "ENOENT" });
      }
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("handleExtrasSkillsSetup replaces Superpower Community prompt with interactive extras checkbox", async () => {
  const cliMod = await import("../bin/create-nexus-devflow.js");
  const { createStyle } = await import("../lib/ui.js");
  assert.equal(typeof (cliMod as Record<string, unknown>).handleExtrasSkillsSetup, "function");

  const handleExtrasSkillsSetup = (cliMod as {
    handleExtrasSkillsSetup: (
      targetDir: string,
      options: { json: boolean; dryRun: boolean; yes: boolean; force: boolean },
      style: ReturnType<typeof createStyle>,
      isUpdate: boolean,
      io?: { input?: NodeJS.ReadableStream; stream?: NodeJS.WriteStream; isInteractive?: boolean; extrasRoot?: string }
    ) => Promise<string[]>;
  }).handleExtrasSkillsSetup;

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-extras-step3-"));
  const repoExtrasRoot = path.resolve(import.meta.dirname, "..", "..", "..", "extras");
  try {
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });

    // 1. Fresh install: starts unchecked; Space selects first item (setup-tests), Enter confirms
    const installInput = new PassThrough();
    const installOut = new PassThrough();
    const installChunks: string[] = [];
    installOut.on("data", (chunk) => installChunks.push(chunk.toString()));

    const installPromise = handleExtrasSkillsSetup(
      tempDir,
      { json: false, dryRun: false, yes: false, force: false },
      createStyle(false),
      false,
      {
        input: installInput,
        stream: installOut as unknown as NodeJS.WriteStream,
        isInteractive: true,
        extrasRoot: repoExtrasRoot
      }
    );
    installInput.write(" ");
    installInput.write("\r");
    const installed = await installPromise;
    const installText = installChunks.join("");

    assert.deepEqual(installed, ["setup-tests"]);
    assert.ok(!installText.includes("Superpower Community"));
    assert.ok(installText.includes("Configuring Extras Skills..."));
    assert.ok(!installText.includes("publish-devflow"));
    await assert.doesNotReject(fs.stat(path.join(tempDir, ".agents", "skills", "setup-tests", "SKILL.md")));

    // 2. Update: pre-checks installed skills; unticking setup-tests does NOT delete it, while keeping Space off + Enter skips cleanly
    const updateInput = new PassThrough();
    const updateOut = new PassThrough();
    const updateChunks: string[] = [];
    updateOut.on("data", (chunk) => updateChunks.push(chunk.toString()));

    const updatePromise = handleExtrasSkillsSetup(
      tempDir,
      { json: false, dryRun: false, yes: false, force: false },
      createStyle(false),
      true,
      {
        input: updateInput,
        stream: updateOut as unknown as NodeJS.WriteStream,
        isInteractive: true,
        extrasRoot: repoExtrasRoot
      }
    );
    // setup-tests is index 0 and pre-checked -> Space unchecks it, Enter skips without deleting
    updateInput.write(" ");
    updateInput.write("\r");
    const updated = await updatePromise;
    const updateText = updateChunks.join("");

    assert.deepEqual(updated, []);
    assert.ok(updateText.includes("[installed]"));
    await assert.doesNotReject(fs.stat(path.join(tempDir, ".agents", "skills", "setup-tests", "SKILL.md")));

    // 3. --yes skips interactive extras setup cleanly
    const yesResult = await handleExtrasSkillsSetup(
      tempDir,
      { json: false, dryRun: false, yes: true, force: false },
      createStyle(false),
      false,
      { isInteractive: true, extrasRoot: repoExtrasRoot }
    );
    assert.deepEqual(yesResult, []);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

