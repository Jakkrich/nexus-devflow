import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadCoreSkillInventory } from "../lib/core-skill-inventory.js";
import {
  buildTrackedIndex,
  loadTrackedRepoIndex,
  shouldCopyTemplateEntry,
  stripAgentStarterKitBlock
} from "../scripts/prepare-template.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const templateRoot = path.join(packageRoot, "template");

test("root .gitignore covers transient, raw inbox, analysis, and development files", async () => {
  const gitignoreContent = await fs.readFile(path.join(repoRoot, ".gitignore"), "utf8");

  // Must ignore raw inbox files to protect client secrets / sensitive documents
  assert.match(gitignoreContent, /devflow\/inbox\/\*\/raw\/\*/);
  assert.match(gitignoreContent, /devflow\/inbox\/raw\/\*/);

  // Must ignore analysis artifacts
  assert.match(gitignoreContent, /devflow\/analysis\/\*/);

  // Must ignore scratch files
  assert.match(gitignoreContent, /devflow\/scratch\/\*/);

  // Must ignore vendor and state
  assert.match(gitignoreContent, /devflow\/\.state\//);
  assert.match(gitignoreContent, /devflow\/\.vendor\//);
  assert.match(gitignoreContent, /\.nexus\//);
});

test("template packaging strictly excludes devflow development and transient folders", async () => {
  // Check if template exists (or run check after build)
  try {
    const templateDevflow = path.join(templateRoot, "devflow");
    const stat = await fs.stat(templateDevflow);
    if (!stat.isDirectory()) return;

    // Must NOT contain devflow/inbox
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "inbox")),
      { code: "ENOENT" },
      "template should not contain devflow/inbox"
    );

    // Must NOT contain devflow/analysis
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "analysis")),
      { code: "ENOENT" },
      "template should not contain devflow/analysis"
    );

    // Must NOT contain devflow/scratch
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "scratch")),
      { code: "ENOENT" },
      "template should not contain devflow/scratch"
    );

    // Must NOT contain DevFlow's own formal specs, guard config, or formal verification skills
    await assert.rejects(
      async () => await fs.stat(path.join(templateRoot, "formal")),
      { code: "ENOENT" },
      "template should not contain formal/"
    );
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "check-layers.json")),
      { code: "ENOENT" },
      "template should not contain devflow/check-layers.json"
    );
    await assert.rejects(
      async () => await fs.stat(path.join(templateRoot, ".agents", "skills", "run-isolation-formal")),
      { code: "ENOENT" },
      "template should not bundle local run-isolation-formal skill"
    );

    // Must NOT contain devflow/research
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "research")),
      { code: "ENOENT" },
      "template should not contain devflow/research"
    );

    // Must NOT contain devflow/reports
    await assert.rejects(
      async () => await fs.stat(path.join(templateDevflow, "reports")),
      { code: "ENOENT" },
      "template should not contain devflow/reports"
    );

    // Must NOT contain prototypes
    await assert.rejects(
      async () => await fs.stat(path.join(templateRoot, "prototypes")),
      { code: "ENOENT" },
      "template should not contain prototypes"
    );
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
});

test("shouldCopyTemplateEntry excludes untracked files when tracked index is provided", async () => {
  const inventory = await loadCoreSkillInventory(path.join(repoRoot, "agent-bundle.manifest.json"));
  const tracked = buildTrackedIndex([
    "AGENTS.md",
    ".agents/skills/feature/SKILL.md",
    "devflow/reference/running-id-contract.md"
  ]);

  assert.equal(
    shouldCopyTemplateEntry(".agents/skills/feature/SKILL.md", false, inventory, tracked),
    true
  );
  assert.equal(
    shouldCopyTemplateEntry(".agents/skills/feature", true, inventory, tracked),
    true
  );
  assert.equal(
    shouldCopyTemplateEntry(".agents/skills/feature/scratch-untracked.md", false, inventory, tracked),
    false
  );
  assert.equal(
    shouldCopyTemplateEntry(".agents/skills/feature/untracked-dir", true, inventory, tracked),
    false
  );
  assert.equal(
    shouldCopyTemplateEntry("devflow/reference/untracked-draft.md", false, inventory, tracked),
    false
  );
  assert.equal(
    shouldCopyTemplateEntry("devflow/reference/running-id-contract.md", false, inventory, tracked),
    true
  );
  assert.equal(
    shouldCopyTemplateEntry(".agents/skills/feature/scratch-untracked.md", false, inventory, null),
    true
  );
});

test("shouldCopyTemplateEntry excludes DevFlow formal specs, guard config, and local formal skills even when tracked", async () => {
  const inventory = await loadCoreSkillInventory(path.join(repoRoot, "agent-bundle.manifest.json"));
  const tracked = buildTrackedIndex([
    "AGENTS.md",
    "devflow/check-layers.json",
    "formal/RunStateAllocation.tla",
    "formal/check-layers.json",
    ".agents/skills/run-isolation-formal/SKILL.md",
    ".claude/skills/run-isolation-formal/SKILL.md"
  ]);

  assert.equal(shouldCopyTemplateEntry("AGENTS.md", false, inventory, tracked), true);
  assert.equal(shouldCopyTemplateEntry("devflow/check-layers.json", false, inventory, tracked), false);
  assert.equal(shouldCopyTemplateEntry("formal/RunStateAllocation.tla", false, inventory, tracked), false);
  assert.equal(shouldCopyTemplateEntry("formal/check-layers.json", false, inventory, tracked), false);
  assert.equal(
    shouldCopyTemplateEntry(".agents/skills/run-isolation-formal/SKILL.md", false, inventory, tracked),
    false
  );
  assert.equal(
    shouldCopyTemplateEntry(".claude/skills/run-isolation-formal/SKILL.md", false, inventory, tracked),
    false
  );
});

test("loadTrackedRepoIndex tracks only committed/staged files inside a real git repo and returns null outside git", async () => {
  const nonGitDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-nongit-"));
  const gitDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-git-"));
  try {
    assert.equal(loadTrackedRepoIndex(nonGitDir), null);

    execFileSync("git", ["init"], { cwd: gitDir, stdio: "ignore" });
    await fs.mkdir(path.join(gitDir, ".agents", "skills", "feature"), { recursive: true });
    await fs.writeFile(path.join(gitDir, ".agents", "skills", "feature", "SKILL.md"), "# feature\n");
    await fs.writeFile(path.join(gitDir, ".agents", "skills", "feature", "untracked.md"), "scratch\n");
    execFileSync("git", ["add", ".agents/skills/feature/SKILL.md"], { cwd: gitDir, stdio: "ignore" });

    const tracked = loadTrackedRepoIndex(gitDir);
    assert.ok(tracked, "expected tracked index for real git repo");
    assert.equal(tracked.files.has(".agents/skills/feature/SKILL.md"), true);
    assert.equal(tracked.files.has(".agents/skills/feature/untracked.md"), false);

    // Corrupt .git/index to simulate git ls-files failure inside a real git repo -> must throw, not silently return null
    await fs.writeFile(path.join(gitDir, ".git", "index"), "corrupt-index-bytes");
    assert.throws(() => loadTrackedRepoIndex(gitDir), /Failed to list tracked files/);
  } finally {
    await fs.rm(nonGitDir, { recursive: true, force: true });
    await fs.rm(gitDir, { recursive: true, force: true });
  }
});

test("shouldCopyExtrasEntry bundles only tracked extras/skills files and package.json declares extras/", async () => {
  const mod = await import("../scripts/prepare-template.js");
  assert.equal(typeof (mod as Record<string, unknown>).shouldCopyExtrasEntry, "function");
  const shouldCopyExtrasEntry = (mod as {
    shouldCopyExtrasEntry: (normalized: string, isDir: boolean, tracked: ReturnType<typeof buildTrackedIndex> | null) => boolean;
  }).shouldCopyExtrasEntry;

  const tracked = buildTrackedIndex([
    "extras/skills/setup-tests/SKILL.md",
    "extras/skills/browseros-neo/reference/e2e-templates.md"
  ]);

  assert.equal(shouldCopyExtrasEntry("extras/skills/setup-tests/SKILL.md", false, tracked), true);
  assert.equal(shouldCopyExtrasEntry("extras/skills/setup-tests", true, tracked), true);
  assert.equal(shouldCopyExtrasEntry("extras/skills/setup-tests/untracked.md", false, tracked), false);

  const pkgJson = JSON.parse(await fs.readFile(path.join(packageRoot, "package.json"), "utf8")) as { files?: string[] };
  assert.ok(Array.isArray(pkgJson.files) && pkgJson.files.includes("extras/"), "package.json files must include extras/");

  const gitignore = await fs.readFile(path.join(repoRoot, ".gitignore"), "utf8");
  assert.match(gitignore, /packages\/create-nexus-devflow\/extras\//);
});

test("sanitizeStarterFiles replaces maintainer plans with clean reference starter templates", async () => {
  const mod = await import("../scripts/prepare-template.js");
  assert.equal(typeof (mod as Record<string, unknown>).sanitizeStarterFiles, "function");
  const sanitizeStarterFiles = (mod as {
    sanitizeStarterFiles: (targetTemplateRoot?: string, sourceRepoRoot?: string) => Promise<void>;
  }).sanitizeStarterFiles;

  const tempTemplate = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-starter-plans-"));
  try {
    await fs.mkdir(path.join(tempTemplate, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempTemplate, "devflow", "history"), { recursive: true });
    await fs.writeFile(
      path.join(tempTemplate, "AGENTS.md"),
      "# Project\n\n## Verification & Commands\n- internal\n",
      "utf8"
    );
    await fs.writeFile(
      path.join(tempTemplate, "devflow", "project-plan.md"),
      await fs.readFile(path.join(repoRoot, "devflow", "project-plan.md"), "utf8"),
      "utf8"
    );
    await fs.writeFile(
      path.join(tempTemplate, "devflow", "build-plan.md"),
      await fs.readFile(path.join(repoRoot, "devflow", "build-plan.md"), "utf8"),
      "utf8"
    );

    await sanitizeStarterFiles(tempTemplate, repoRoot);

    const refProjectPlan = await fs.readFile(
      path.join(repoRoot, "devflow", "reference", "project-plan-template.md"),
      "utf8"
    );
    const refBuildPlan = await fs.readFile(
      path.join(repoRoot, "devflow", "reference", "build-plan-template.md"),
      "utf8"
    );
    const outProjectPlan = await fs.readFile(path.join(tempTemplate, "devflow", "project-plan.md"), "utf8");
    const outBuildPlan = await fs.readFile(path.join(tempTemplate, "devflow", "build-plan.md"), "utf8");

    assert.equal(outProjectPlan, refProjectPlan);
    assert.equal(outBuildPlan, refBuildPlan);
    assert.ok(!outBuildPlan.includes("131a"));
    assert.ok(!outBuildPlan.includes("DISC-2026"));

    // F-04 regression: fail loudly if reference starter templates are missing
    const emptySourceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-missing-ref-"));
    try {
      await assert.rejects(() => sanitizeStarterFiles(tempTemplate, emptySourceRoot), { code: "ENOENT" });
    } finally {
      await fs.rm(emptySourceRoot, { recursive: true, force: true });
    }
  } finally {
    await fs.rm(tempTemplate, { recursive: true, force: true });
  }
});

test("shouldCopyTemplateEntry excludes all agent-starter-kit maintainer paths even when tracked", async () => {
  const inventory = await loadCoreSkillInventory(path.join(repoRoot, "agent-bundle.manifest.json"));
  const starterKitPaths = [
    ".agents/.gitignore",
    ".agents/starter-kit.json",
    ".agents/tools/install-project.ps1",
    ".agents/docs/pstack-guide-th/README.md",
    ".agents/assets/logo.png",
    ".agents/rules/chief-of-staff.md",
    ".agents/plugins/pstack/plugin.json",
    ".agents/.cache/pstack-claude/VERSION",
    ".agents/.backup/legacy/note.txt",
    ".agents/skills/chief-of-staff/SKILL.md",
    ".agents/skills/make-bot-ui/SKILL.md",
    ".agents/skills/verify-project/SKILL.md",
    ".claude/skills/chief-of-staff/SKILL.md",
    "AI_HANDOFF.md",
    "GEMINI.md",
    ".context/cos-board.md"
  ];
  const tracked = buildTrackedIndex(["AGENTS.md", "CLAUDE.md", ...starterKitPaths]);

  for (const relPath of starterKitPaths) {
    assert.equal(
      shouldCopyTemplateEntry(relPath, false, inventory, tracked),
      false,
      `Expected tracked path to be excluded from user template: ${relPath}`
    );
    assert.equal(
      shouldCopyTemplateEntry(relPath, false, inventory, null),
      false,
      `Expected untracked-mode path to be excluded from user template: ${relPath}`
    );
  }
});

test("sanitizeStarterFiles strips AGENT-STARTER-KIT marker blocks from AGENTS.md and CLAUDE.md", async () => {
  const mod = await import("../scripts/prepare-template.js");
  const sanitizeStarterFiles = (mod as {
    sanitizeStarterFiles: (targetTemplateRoot?: string, sourceRepoRoot?: string) => Promise<void>;
  }).sanitizeStarterFiles;

  const markerBlock = [
    "<!-- BEGIN AGENT-STARTER-KIT -->",
    "# AI Agent Instructions & Chief of Staff",
    "Read AI_HANDOFF.md and .context/cos-board.md",
    "<!-- END AGENT-STARTER-KIT -->"
  ].join("\n");

  assert.equal(stripAgentStarterKitBlock(`${markerBlock}\n\n# Nexus-DevFlow\n`), "# Nexus-DevFlow\n");

  const tempTemplate = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-strip-markers-"));
  try {
    await fs.mkdir(path.join(tempTemplate, "devflow", "context"), { recursive: true });
    await fs.mkdir(path.join(tempTemplate, "devflow", "history"), { recursive: true });
    await fs.writeFile(
      path.join(tempTemplate, "AGENTS.md"),
      `${markerBlock}\n\n# Nexus-DevFlow\n\n## Verification & Commands\n- internal\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(tempTemplate, "CLAUDE.md"),
      `${markerBlock}\n\n# CLAUDE.md\n\n@AGENTS.md\n`,
      "utf8"
    );

    await sanitizeStarterFiles(tempTemplate, repoRoot);

    const outAgents = await fs.readFile(path.join(tempTemplate, "AGENTS.md"), "utf8");
    const outClaude = await fs.readFile(path.join(tempTemplate, "CLAUDE.md"), "utf8");

    assert.doesNotMatch(outAgents, /AGENT-STARTER-KIT/);
    assert.doesNotMatch(outAgents, /chief-of-staff/);
    assert.match(outAgents, /^# Nexus-DevFlow/);
    assert.match(outAgents, /## Commands/);

    assert.doesNotMatch(outClaude, /AGENT-STARTER-KIT/);
    assert.doesNotMatch(outClaude, /chief-of-staff/);
    assert.equal(outClaude, "# CLAUDE.md\n\n@AGENTS.md\n");
  } finally {
    await fs.rm(tempTemplate, { recursive: true, force: true });
  }
});
