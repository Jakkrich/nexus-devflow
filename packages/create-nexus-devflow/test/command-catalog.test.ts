import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { readCommandCatalog } from "../lib/command-catalog.js";
import { createManifest } from "../lib/update.js";

test("readCommandCatalog uses manifest order and skill descriptions", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-catalog-"));
  try {
    await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills", "feature"), { recursive: true });
    await fs.writeFile(path.join(tempDir, ".nexus", "nexus-devflow.json"), JSON.stringify({
      schemaVersion: 1, name: "nexus-devflow", package: "pkg", version: "1.0.0", repository: "repo",
      artifactLanguage: "th", adapters: ["codex"],
      workspace: { contextDir: "devflow/context", historyDir: "devflow/history", referenceDir: "devflow/reference", runsDir: "devflow/runs", discoveriesDir: "devflow/discoveries" },
      lifecycle: { fastTrackStages: ["feature"], mainlineStages: ["discovery"], companionCommands: ["devflow"] },
      managedFiles: {}
    }));
    await fs.writeFile(path.join(tempDir, ".agents", "skills", "feature", "SKILL.md"), "---\ndescription: \"[devflow][B] Create a bounded feature spec.\"\n---");
    const items = await readCommandCatalog(tempDir);
    assert.deepEqual(items.map((item) => item.name), ["feature", "discovery", "devflow"]);
    assert.equal(items[0].description, "Create a bounded feature spec.");
    assert.match(items[2].description, /workflow state|doctor/i);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("createManifest and readCommandCatalog default expose 15 Core Skills without retired commands", async () => {
  const manifest = createManifest("2.19.4", ["antigravity"], new Map());
  const retired = [
    "try", "report-html", "adopt", "brief", "grill", "brainstorm",
    "analyze", "continuous", "devflow-doctor", "devflow-status",
    "test", "ci", "release", "rollback"
  ];
  for (const name of retired) {
    assert.ok(!manifest.lifecycle.companionCommands.includes(name), `Unexpected retired command ${name} in createManifest().lifecycle.companionCommands`);
  }
  assert.ok(manifest.lifecycle.companionCommands.includes("devflow"));
  assert.ok(manifest.lifecycle.companionCommands.includes("explore"));

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-catalog-default-"));
  try {
    const items = await readCommandCatalog(tempDir);
    const names = new Set(items.map((i) => i.name));
    for (const name of retired) {
      assert.ok(!names.has(name), `Unexpected retired command ${name} in default command catalog`);
    }
    assert.ok(names.has("devflow"));
    assert.ok(names.has("explore"));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
