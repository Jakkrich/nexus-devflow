import assert from "node:assert/strict";
import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { installGitHook, uninstallGitHooks } from "../lib/git-hooks.js";

const execFile = promisify(execFileCb);

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

test("installGitHook handles Git worktrees properly", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-worktree-"));
  const commonGitDir = path.join(tempDir, "common-git");

  try {
    await fs.mkdir(path.join(commonGitDir, "hooks"), { recursive: true });
    const worktreeDir = path.join(tempDir, "worktree");
    await fs.mkdir(worktreeDir, { recursive: true });

    // Create .git file pointing to commonGitDir
    await fs.writeFile(
      path.join(worktreeDir, ".git"),
      `gitdir: ${commonGitDir}\n`,
      "utf8"
    );

    const installRes = await installGitHook(worktreeDir, "pre-commit");
    assert.equal(installRes.success, true);
    assert.equal(installRes.path, path.join(commonGitDir, "hooks", "pre-commit"));

    const exists = await fs.lstat(installRes.path).then(() => true).catch(() => false);
    assert.equal(exists, true);

    const uninsRes = await uninstallGitHooks(worktreeDir);
    assert.equal(uninsRes.success, true);
    assert.equal(uninsRes.removed.length, 1);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("installGitHook resolves commondir inside a real git worktree add checkout", async () => {
  const baseDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-real-wt-hook-"));
  const primaryDir = path.join(baseDir, "primary");
  const worktreeDir = path.join(baseDir, "linked-wt");
  try {
    await fs.mkdir(primaryDir, { recursive: true });
    await execFile("git", ["init", "-b", "main", primaryDir]);
    await execFile("git", ["-C", primaryDir, "config", "user.name", "DevFlow Test"]);
    await execFile("git", ["-C", primaryDir, "config", "user.email", "test@nexus.local"]);
    await fs.writeFile(path.join(primaryDir, "README.md"), "# hook\n", "utf8");
    await execFile("git", ["-C", primaryDir, "add", "README.md"]);
    await execFile("git", ["-C", primaryDir, "commit", "-m", "init"]);
    await execFile("git", ["-C", primaryDir, "worktree", "add", worktreeDir, "-b", "feature/hook-wt"]);

    const installRes = await installGitHook(worktreeDir, "pre-commit");
    assert.equal(installRes.success, true);
    assert.equal(
      installRes.path.toLowerCase(),
      path.join(await fs.realpath(primaryDir), ".git", "hooks", "pre-commit").toLowerCase()
    );

    const exists = await fs.lstat(installRes.path).then(() => true).catch(() => false);
    assert.equal(exists, true);

    const uninsRes = await uninstallGitHooks(worktreeDir);
    assert.equal(uninsRes.success, true);
    assert.equal(uninsRes.removed.length, 1);
  } finally {
    await execFile("git", ["-C", primaryDir, "worktree", "remove", "--force", worktreeDir]).catch(() => {});
    await fs.rm(baseDir, { recursive: true, force: true });
  }
});

