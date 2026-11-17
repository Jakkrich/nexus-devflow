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
  shouldCopyTemplateEntry
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
