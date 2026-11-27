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
import { readProjectConfig } from "../lib/project-config.js";
import { runDoctor } from "../lib/doctor.js";
import { FULL_ROLE_SKILLS, getSkillsForRole, type DevFlowRole } from "../lib/skill-manager.js";

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
    assert.ok(updatedManifest.lifecycle.companionCommands.includes("devflow-help"));
    assert.ok(updatedManifest.lifecycle.companionCommands.includes("devflow-mode"));
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

test("AC-1: applyPreparedUpdate migrates v2 workspace (prunes autopilot & devflow, installs devflow-mode & devflow-help, preserves customized config.json)", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-v2-v3-migrate-"));
  const v2Template = path.join(tempDir, "template-v2");
  const v3Template = path.join(tempDir, "template-v3");
  const targetDir = path.join(tempDir, "target");

  try {
    // 1. Setup synthetic v2 template (autopilot + devflow + v2 config.json)
    for (const adapter of [".agents", ".claude"]) {
      await fs.mkdir(path.join(v2Template, adapter, "skills", "autopilot"), { recursive: true });
      await fs.writeFile(path.join(v2Template, adapter, "skills", "autopilot", "SKILL.md"), "# autopilot v2\n", "utf8");
      await fs.mkdir(path.join(v2Template, adapter, "skills", "devflow", "reference"), { recursive: true });
      await fs.mkdir(path.join(v2Template, adapter, "skills", "devflow", "scripts"), { recursive: true });
      await fs.writeFile(path.join(v2Template, adapter, "skills", "devflow", "SKILL.md"), "# devflow v2\n", "utf8");
      await fs.writeFile(path.join(v2Template, adapter, "skills", "devflow", "reference", "doctor.md"), "# doctor v2\n", "utf8");
      await fs.writeFile(path.join(v2Template, adapter, "skills", "devflow", "scripts", "run-state.mjs"), "// v2\n", "utf8");
      await fs.mkdir(path.join(v2Template, adapter, "skills", "feature"), { recursive: true });
      await fs.writeFile(path.join(v2Template, adapter, "skills", "feature", "SKILL.md"), "# feature v2\n", "utf8");
    }
    await fs.mkdir(path.join(v2Template, "devflow"), { recursive: true });
    await fs.writeFile(path.join(v2Template, "AGENTS.md"), "# v2 AGENTS\n", "utf8");
    await fs.writeFile(path.join(v2Template, "devflow", "config.json"), JSON.stringify({ schemaVersion: 1 }, null, 2), "utf8");

    // 2. Setup synthetic v3 template (devflow-mode + 5 playbooks, devflow-help + scripts, v3 config)
    for (const adapter of [".agents", ".claude"]) {
      await fs.mkdir(path.join(v3Template, adapter, "skills", "devflow-mode", "playbooks"), { recursive: true });
      await fs.writeFile(path.join(v3Template, adapter, "skills", "devflow-mode", "SKILL.md"), "# devflow-mode v3\n", "utf8");
      for (const pb of ["feature.md", "bug-fix.md", "refactor.md", "discovery.md", "autonomous-queue.md"]) {
        await fs.writeFile(path.join(v3Template, adapter, "skills", "devflow-mode", "playbooks", pb), `# ${pb}\n`, "utf8");
      }
      await fs.mkdir(path.join(v3Template, adapter, "skills", "devflow-help", "scripts"), { recursive: true });
      await fs.writeFile(path.join(v3Template, adapter, "skills", "devflow-help", "SKILL.md"), "# devflow-help v3\n", "utf8");
      await fs.writeFile(path.join(v3Template, adapter, "skills", "devflow-help", "scripts", "run-state.mjs"), "// v3\n", "utf8");
      await fs.mkdir(path.join(v3Template, adapter, "skills", "feature"), { recursive: true });
      await fs.writeFile(path.join(v3Template, adapter, "skills", "feature", "SKILL.md"), "# feature v3\n", "utf8");
    }
    await fs.mkdir(path.join(v3Template, "devflow"), { recursive: true });
    await fs.writeFile(path.join(v3Template, "AGENTS.md"), "# v3 AGENTS\n", "utf8");
    await fs.writeFile(
      path.join(v3Template, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "auto" }, delivery: { gate: "option-a-evidence-packet" } }, null, 2),
      "utf8"
    );

    await fs.mkdir(targetDir, { recursive: true });
    const installV2 = await prepareUpdate({
      targetDir,
      templateRoot: v2Template,
      version: "2.21.0",
      adapter: "all"
    });
    await applyPreparedUpdate(installV2);

    // Customize user v2 config.json and ensure conflict protection catches it while pruning v2 skills on replaceConflicts: true
    await fs.writeFile(
      path.join(targetDir, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, workflow: { stepReview: "every" } }, null, 2),
      "utf8"
    );

    const v3ConflictCheck = await prepareUpdate({
      targetDir,
      templateRoot: v3Template,
      version: "3.0.0"
    });
    assert.ok(v3ConflictCheck.conflictList.some((c) => c.relativePath === "devflow/config.json"));

    // Preserve customized config.json (skip force replace) -> v3 defaults still merge in readProjectConfig
    const preservedConfig = await readProjectConfig(targetDir);
    assert.equal(preservedConfig.values.workflow.stepReview, "every");
    assert.equal(preservedConfig.values.execution.tier, "auto");
    assert.equal(preservedConfig.values.delivery.gate, "option-a-evidence-packet");

    // Apply v3 migration (backup + prune retired v2 skills across both adapter trees)
    await applyPreparedUpdate(v3ConflictCheck, { replaceConflicts: true });

    for (const adapter of [".agents", ".claude"]) {
      await assert.rejects(fs.stat(path.join(targetDir, adapter, "skills", "autopilot")), { code: "ENOENT" });
      await assert.rejects(fs.stat(path.join(targetDir, adapter, "skills", "devflow")), { code: "ENOENT" });
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "devflow-mode", "SKILL.md")));
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "devflow-mode", "playbooks", "autonomous-queue.md")));
      await assert.doesNotReject(fs.stat(path.join(targetDir, adapter, "skills", "devflow-help", "scripts", "run-state.mjs")));
    }

    const updatedManifest = await readManifest(targetDir);
    assert.ok(updatedManifest);
    assert.ok(updatedManifest.lifecycle.companionCommands.includes("devflow-mode"));
    assert.ok(updatedManifest.lifecycle.companionCommands.includes("devflow-help"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("autopilot"));
    assert.ok(!updatedManifest.lifecycle.companionCommands.includes("devflow"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("AC-2: installer matrix supports all 5 adapters (antigravity, claude, codex, copilot, opencode) and 3 role profiles", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-matrix-"));
  const v3Template = path.join(tempDir, "template");

  try {
    for (const adapter of [".agents", ".claude"]) {
      for (const skill of FULL_ROLE_SKILLS) {
        await fs.mkdir(path.join(v3Template, adapter, "skills", skill), { recursive: true });
        await fs.writeFile(path.join(v3Template, adapter, "skills", skill, "SKILL.md"), `# ${skill}\n`, "utf8");
      }
    }
    await fs.mkdir(path.join(v3Template, "devflow"), { recursive: true });
    await fs.writeFile(
      path.join(v3Template, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "auto" }, delivery: { gate: "option-a-evidence-packet" } }, null, 2),
      "utf8"
    );
    await fs.writeFile(path.join(v3Template, "AGENTS.md"), "# v3 Matrix Test\n\n## Proportional engineering\n\nBuild for established requirements, not hypothetical scale.\n", "utf8");
    await fs.writeFile(path.join(v3Template, "CLAUDE.md"), "# Claude Entry\n", "utf8");

    const adapterCases = [
      { mode: "antigravity", hasAgents: true, hasClaude: false },
      { mode: "claude", hasAgents: false, hasClaude: true },
      { mode: "codex", hasAgents: true, hasClaude: false },
      { mode: "copilot", hasAgents: true, hasClaude: false },
      { mode: "opencode", hasAgents: true, hasClaude: false }
    ] as const;

    const roles: readonly DevFlowRole[] = ["full", "dev", "sa"];

    for (const { mode, hasAgents, hasClaude } of adapterCases) {
      for (const role of roles) {
        const target = path.join(tempDir, `${mode}-${role}`);
        await fs.mkdir(target, { recursive: true });
        const prep = await prepareUpdate({
          targetDir: target,
          templateRoot: v3Template,
          version: "3.0.0",
          adapter: mode,
          role
        });
        await applyPreparedUpdate(prep);

        const expectedSkills = getSkillsForRole(role);
        if (hasAgents) {
          const dirs = (await fs.readdir(path.join(target, ".agents", "skills"))).sort();
          assert.deepEqual(dirs, [...expectedSkills].sort());
        } else {
          await assert.rejects(fs.stat(path.join(target, ".agents")), { code: "ENOENT" });
        }

        if (hasClaude) {
          const dirs = (await fs.readdir(path.join(target, ".claude", "skills"))).sort();
          assert.deepEqual(dirs, [...expectedSkills].sort());
        } else {
          await assert.rejects(fs.stat(path.join(target, ".claude")), { code: "ENOENT" });
        }

        const doctorReport = await runDoctor(target);
        assert.equal(doctorReport.failCount, 0, `${mode}/${role} doctor should have 0 failures`);
      }
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("AC-2: applyPreparedUpdate installs and updates cleanly inside space + Thai Unicode target paths", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-unicode-path-"));
  const targetDir = path.join(tempRoot, "โปรเจกต์ ทดสอบ v3");
  const unicodeTemplate = path.join(tempRoot, "template");
  try {
    await fs.mkdir(path.join(unicodeTemplate, ".agents", "skills", "feature"), { recursive: true });
    await fs.mkdir(path.join(unicodeTemplate, "devflow", "context"), { recursive: true });
    await fs.writeFile(
      path.join(unicodeTemplate, ".agents", "skills", "feature", "SKILL.md"),
      "# feature\n",
      "utf8"
    );
    await fs.writeFile(
      path.join(unicodeTemplate, "AGENTS.md"),
      "# Project\n\n## Proportional engineering\n\nBuild for established requirements, not hypothetical scale.\n",
      "utf8"
    );
    await fs.writeFile(
      path.join(unicodeTemplate, "devflow", "config.json"),
      JSON.stringify({ schemaVersion: 1, execution: { engine: "auto" } }, null, 2),
      "utf8"
    );

    await fs.writeFile(
      path.join(unicodeTemplate, "devflow", "build-plan.md"),
      "# Build Plan\n\n- [ ] 1. **Starter** - template\n",
      "utf8"
    );

    const initialPrep = await prepareUpdate({
      targetDir,
      templateRoot: unicodeTemplate,
      version: "2.21.0",
      adapter: "codex",
      role: "full"
    });
    await applyPreparedUpdate(initialPrep);

    const customTaskSpec = "# Feature: งานภาษาไทย\n\n- Keep intact inside space + Unicode path.\n";
    await fs.mkdir(path.join(targetDir, "devflow", "context", "001-งานไทย"), { recursive: true });
    await fs.writeFile(path.join(targetDir, "devflow", "context", "001-งานไทย", "spec.md"), customTaskSpec, "utf8");
    await fs.writeFile(
      path.join(unicodeTemplate, ".agents", "skills", "feature", "SKILL.md"),
      "# feature v3\n",
      "utf8"
    );

    const upgradePrep = await prepareUpdate({
      targetDir,
      templateRoot: unicodeTemplate,
      version: "3.0.0",
      adapter: "codex",
      role: "full"
    });
    assert.equal(upgradePrep.conflictList.length, 0);
    await applyPreparedUpdate(upgradePrep);

    const preservedSpec = await fs.readFile(
      path.join(targetDir, "devflow", "context", "001-งานไทย", "spec.md"),
      "utf8"
    );
    assert.equal(preservedSpec, customTaskSpec, "User task spec must survive update in space/Unicode directory");
    const updatedFeature = await fs.readFile(
      path.join(targetDir, ".agents", "skills", "feature", "SKILL.md"),
      "utf8"
    );
    assert.equal(updatedFeature, "# feature v3\n");

    // Also verify customized managed files are flagged in conflictList (never silently overwritten)
    await fs.writeFile(
      path.join(targetDir, "devflow", "build-plan.md"),
      "# Build Plan\n\n- [ ] 1. **Customized Plan** - keep\n",
      "utf8"
    );
    const conflictPrep = await prepareUpdate({
      targetDir,
      templateRoot: unicodeTemplate,
      version: "3.0.0",
      adapter: "codex",
      role: "full"
    });
    assert.ok(conflictPrep.conflictList.some((c) => c.relativePath === "devflow/build-plan.md" && c.reason === "customized"));

    const doctorReport = await runDoctor(targetDir);
    assert.equal(doctorReport.failCount, 0);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
});

test("prepareUpdate and applyPreparedUpdate seed AI_HANDOFF.md when absent and NEVER overwrite or delete existing AI_HANDOFF.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-handoff-preserve-"));
  const tplV1 = path.join(tempDir, "tpl-v1");
  const tplV2 = path.join(tempDir, "tpl-v2");
  const targetDir = path.join(tempDir, "target");

  try {
    await fs.mkdir(path.join(tplV1, "devflow"), { recursive: true });
    await fs.mkdir(path.join(tplV2, "devflow"), { recursive: true });
    await fs.mkdir(targetDir, { recursive: true });

    await fs.writeFile(path.join(tplV1, "AGENTS.md"), "# V1 AGENTS\n", "utf8");
    await fs.writeFile(path.join(tplV1, "AI_HANDOFF.md"), "# AI_HANDOFF — `<project-name>`\n", "utf8");

    await fs.writeFile(path.join(tplV2, "AGENTS.md"), "# V2 AGENTS\n", "utf8");
    await fs.writeFile(path.join(tplV2, "AI_HANDOFF.md"), "# AI_HANDOFF — v2 updated template\n", "utf8");

    // 1. Fresh install creates starter AI_HANDOFF.md
    const prepInstall = await prepareUpdate({
      targetDir,
      templateRoot: tplV1,
      version: "3.0.0",
      adapter: "codex"
    });
    assert.ok(prepInstall.createList.includes("AI_HANDOFF.md"));
    await applyPreparedUpdate(prepInstall);

    // 2. Team customizes AI_HANDOFF.md; subsequent update (even with replaceConflicts: true) must NOT overwrite or conflict
    const teamHandoff = "# AI_HANDOFF — Team Repo\n\n## 2. Active Lock\n| Codex | feat/auth | ...\n";
    await fs.writeFile(path.join(targetDir, "AI_HANDOFF.md"), teamHandoff, "utf8");

    const prepUpgrade = await prepareUpdate({
      targetDir,
      templateRoot: tplV2,
      version: "3.0.1",
      adapter: "codex"
    });
    assert.equal(prepUpgrade.conflictList.some((c) => c.relativePath === "AI_HANDOFF.md"), false);
    assert.equal(prepUpgrade.updateList.includes("AI_HANDOFF.md"), false);
    assert.equal(prepUpgrade.orphanedFiles.includes("AI_HANDOFF.md"), false);

    await applyPreparedUpdate(prepUpgrade, { replaceConflicts: true });
    const afterUpgrade = await fs.readFile(path.join(targetDir, "AI_HANDOFF.md"), "utf8");
    assert.equal(afterUpgrade, teamHandoff);

    // 3. Even if AI_HANDOFF.md pre-existed BEFORE DevFlow install (untracked by prior manifest), install --force must preserve it
    const preExistingDir = path.join(tempDir, "pre-existing");
    await fs.mkdir(preExistingDir, { recursive: true });
    const preExistingHandoff = "# AI_HANDOFF — Legacy Handcrafted\n";
    await fs.writeFile(path.join(preExistingDir, "AI_HANDOFF.md"), preExistingHandoff, "utf8");

    const prepPre = await prepareUpdate({
      targetDir: preExistingDir,
      templateRoot: tplV2,
      version: "3.0.1",
      adapter: "codex"
    });
    assert.equal(prepPre.conflictList.some((c) => c.relativePath === "AI_HANDOFF.md"), false);
    await applyPreparedUpdate(prepPre, { replaceConflicts: true });
    assert.equal(await fs.readFile(path.join(preExistingDir, "AI_HANDOFF.md"), "utf8"), preExistingHandoff);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

