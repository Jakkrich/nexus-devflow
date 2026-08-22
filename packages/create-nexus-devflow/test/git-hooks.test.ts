import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { installGitHook, uninstallGitHooks } from "../lib/git-hooks.js";

test("installGitHook and uninstallGitHooks manage git hooks properly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-hooks-"));

  try {
    // Non-git directory fails
    const failRes = await installGitHook(tempDir, "pre-commit");
    assert.equal(failRes.success, false);

    // Initialize fake .git
    await fs.mkdir(path.join(tempDir, ".git", "hooks"), { recursive: true });

    // Install pre-commit hook
    const installRes = await installGitHook(tempDir, "pre-commit");
    assert.equal(installRes.success, true);
    assert.match(installRes.path, /pre-commit/);

    const hookContent = await fs.readFile(installRes.path, "utf8");
    assert.match(hookContent, /nexus-devflow check-gate --strict/);

    // Install pre-push hook
    const pushRes = await installGitHook(tempDir, "pre-push", { strict: false });
    assert.equal(pushRes.success, true);

    const pushContent = await fs.readFile(pushRes.path, "utf8");
    assert.match(pushContent, /nexus-devflow check-gate/);

    // Uninstall hooks
    const uninsRes = await uninstallGitHooks(tempDir);
    assert.equal(uninsRes.success, true);
    assert.equal(uninsRes.removed.length, 2);

    const hasPreCommit = await fs.lstat(installRes.path).then(() => true).catch(() => false);
    assert.equal(hasPreCommit, false);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
