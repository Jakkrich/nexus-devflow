import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { detectAdapters, readProjectMetadata } from "../lib/project-metadata.js";

test("detectAdapters detects installed codex and claude adapters", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-adapters-"));
  try {
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".claude", "skills"), { recursive: true });

    const adapters = await detectAdapters(tempDir);
    assert.deepEqual(adapters, ["codex", "claude"]);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readProjectMetadata reads metadata from project with manifest", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-meta-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".nexus"), { recursive: true });
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    await fs.writeFile(
      path.join(tempDir, ".nexus", "nexus-devflow.json"),
      JSON.stringify({
        schemaVersion: 1,
        name: "test-meta",
        package: "@jakkrichm/create-nexus-devflow",
        version: "2.0.15",
        repository: "https://github.com/Jakkrich/nexus-devflow",
        artifactLanguage: "th",
        adapters: ["codex"],
        workspace: {
          contextDir: "devflow/context",
          historyDir: "devflow/history",
          referenceDir: "devflow/reference",
          runsDir: "devflow/runs",
          discoveriesDir: "devflow/discoveries"
        },
        lifecycle: {
          mainlineStages: [],
          companionCommands: []
        },
        managedFiles: {}
      })
    );

    const metadata = await readProjectMetadata(tempDir);
    assert.equal(metadata.schemaVersion, 1);
    assert.equal(metadata.devflow.version, "2.0.15");
    assert.deepEqual(metadata.devflow.adapters, ["codex"]);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("detectAdapters detects opencode adapter from manifest", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-opencode-"));
  try {
    await fs.mkdir(path.join(tempDir, ".agents", "skills"), { recursive: true });

    const adapters = await detectAdapters(tempDir, ["opencode"]);
    assert.deepEqual(adapters, ["opencode"]);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

