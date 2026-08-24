import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { readCommandCatalog } from "../lib/command-catalog.js";

test("readCommandCatalog uses manifest order and skill descriptions", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-catalog-"));
  try {
    await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills", "feature"), { recursive: true });
    await fs.writeFile(path.join(tempDir, ".nexus", "nexus-devflow.json"), JSON.stringify({
      schemaVersion: 1, name: "nexus-devflow", package: "pkg", version: "1.0.0", repository: "repo",
      artifactLanguage: "th", adapters: ["codex"],
      workspace: { contextDir: "devflow/context", historyDir: "devflow/history", referenceDir: "devflow/reference", runsDir: "devflow/runs", discoveriesDir: "devflow/discoveries" },
      lifecycle: { fastTrackStages: ["feature"], mainlineStages: ["discovery"], companionCommands: ["doctor"] },
      managedFiles: {}
    }));
    await fs.writeFile(path.join(tempDir, ".agents", "skills", "feature", "SKILL.md"), "---\ndescription: \"[devflow][B] Create a bounded feature spec.\"\n---");
    const items = await readCommandCatalog(tempDir);
    assert.deepEqual(items.map((item) => item.name), ["feature", "discovery", "doctor"]);
    assert.equal(items[0].description, "Create a bounded feature spec.");
    assert.match(items[2].description, /health check/i);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
