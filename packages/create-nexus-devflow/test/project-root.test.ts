import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { findProjectRoot, isDevFlowProjectRoot } from "../lib/project-root.js";

test("findProjectRoot finds root when inside a DevFlow project", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-root-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", ".state"), { recursive: true });
    await fs.writeFile(
      path.join(tempDir, "devflow", ".state", "manifest.json"),
      JSON.stringify({ schemaVersion: 1, name: "test-app" })
    );

    const subDir = path.join(tempDir, "src", "nested", "folder");
    await fs.mkdir(subDir, { recursive: true });

    const found = await findProjectRoot(subDir);
    assert.equal(found, await fs.realpath(tempDir));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("isDevFlowProjectRoot detects project with devflow dir and AGENTS.md", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-root-agents-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "AGENTS.md"), "# DevFlow Instructions");

    const isRoot = await isDevFlowProjectRoot(tempDir);
    assert.equal(isRoot, true);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("findProjectRoot returns null when directory is not a DevFlow project", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-non-root-"));
  try {
    const found = await findProjectRoot(tempDir);
    assert.equal(found, null);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
