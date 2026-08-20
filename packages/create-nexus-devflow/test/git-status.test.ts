import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readGitStatus } from "../lib/git-status.js";

test("readGitStatus handles non-git directory gracefully", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-git-non-"));
  try {
    const status = await readGitStatus(tempDir);
    assert.equal(status.available, false);
    assert.equal(status.branch, null);
    assert.equal(status.clean, null);
    assert.equal(status.changedFiles, 0);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readGitStatus reads current repository git status", async () => {
  const status = await readGitStatus(process.cwd());
  assert.equal(status.available, true);
  assert.ok(typeof status.branch === "string");
  assert.ok(typeof status.changedFiles === "number");
});
