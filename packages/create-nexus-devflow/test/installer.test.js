const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  adapterListFromMode,
  createManifest,
  prepareUpdate,
  applyPreparedUpdate,
  readManifest
} = require("../lib/update");

test("adapterListFromMode resolves adapter aliases correctly", () => {
  assert.deepEqual(adapterListFromMode("both"), ["codex", "claude"]);
  assert.deepEqual(adapterListFromMode("all"), ["codex", "claude"]);
  assert.deepEqual(adapterListFromMode("antigravity"), ["codex"]);
  assert.deepEqual(adapterListFromMode("codex"), ["codex"]);
  assert.deepEqual(adapterListFromMode("claude"), ["claude"]);
  assert.throws(() => adapterListFromMode("invalid"), /Unknown adapter mode/);
});

test("createManifest constructs valid manifest metadata", () => {
  const templateFiles = new Map([
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

    const installedManifest = await readManifest(targetDir);
    assert.notEqual(installedManifest, null);
    assert.equal(installedManifest.version, "2.0.0");

    const targetAgents = await fs.readFile(path.join(targetDir, "AGENTS.md"), "utf8");
    assert.equal(targetAgents, "# AGENTS\n");
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
