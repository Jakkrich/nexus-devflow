import assert from "node:assert/strict";
import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { readGitStatus, readGitStatusSafe, clearGitStatusCache, listGitWorktrees } from "../lib/git-status.js";

const execFile = promisify(execFileCb);

test("readGitStatus handles non-git directory gracefully", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-git-non-"));
  try {
    const status = await readGitStatus(tempDir);
    assert.equal(status.available, false);
    assert.equal(status.branch, null);
    assert.equal(status.clean, null);
    assert.equal(status.changedFiles, 0);
    assert.equal(status.isWorktree, false);
    assert.equal(status.mainWorktreeRoot, null);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test("readGitStatus reads current repository git status", async () => {
  clearGitStatusCache();
  const status = await readGitStatus(process.cwd());
  assert.equal(status.available, true);
  assert.ok(typeof status.branch === "string");
  assert.ok(typeof status.changedFiles === "number");
});

test("readGitStatus reuses TTL cache on repeated calls", async () => {
  clearGitStatusCache();
  const t0 = performance.now();
  const first = await readGitStatus(process.cwd());
  const t1 = performance.now();
  const second = await readGitStatus(process.cwd());
  const t2 = performance.now();

  assert.deepEqual(first, second);
  // Second call from cache should be practically instantaneous (< 20ms)
  assert.ok((t2 - t1) < 50, `Cached call took ${t2 - t1}ms, expected < 50ms`);
});

test("readGitStatus coalesces concurrent misses and starts TTL after completion", async () => {
  clearGitStatusCache();
  let now = 1_000;
  let releaseGit!: () => void;
  const gitBarrier = new Promise<void>((resolve) => {
    releaseGit = resolve;
  });
  const commands: string[][] = [];
  const runGit = async (_projectRoot: string, args: readonly string[]): Promise<string> => {
    commands.push([...args]);
    await gitBarrier;
    return fakeGitOutput(args);
  };
  const projectRoot = path.join(os.tmpdir(), "nexus-test-git-single-flight");
  const options = { ttlMs: 2_000, now: () => now, runGit };

  const concurrentReads = Array.from(
    { length: 5 },
    () => readGitStatus(projectRoot, options)
  );
  await new Promise<void>((resolve) => setImmediate(resolve));
  now = 5_000;
  releaseGit();

  const results = await Promise.all(concurrentReads);
  assert.ok(results.every((result) => result.available));
  assert.equal(commands.length, 6, "expected one shared six-command Git computation");

  now = 6_000;
  await readGitStatus(projectRoot, options);
  assert.equal(commands.length, 6, "expected a full TTL measured from completion");
});

test("readGitStatus clears a failed in-flight computation so the next call can retry", async () => {
  clearGitStatusCache();
  let shouldFailStatus = true;
  let statusAttempts = 0;
  const runGit = async (_projectRoot: string, args: readonly string[]): Promise<string> => {
    if (args[0] === "status") {
      statusAttempts += 1;
      if (shouldFailStatus) {
        throw new Error("simulated git status failure");
      }
    }
    return fakeGitOutput(args);
  };
  const projectRoot = path.join(os.tmpdir(), "nexus-test-git-retry");

  await assert.rejects(
    readGitStatus(projectRoot, { runGit }),
    /simulated git status failure/
  );

  shouldFailStatus = false;
  const retried = await readGitStatus(projectRoot, { runGit });
  assert.equal(retried.available, true);
  assert.equal(statusAttempts, 2);
});

test("readGitStatusSafe returns unavailable summary when git status fails or exceeds maxBuffer", async () => {
  clearGitStatusCache();
  const status = await readGitStatusSafe(path.join(os.tmpdir(), "nexus-test-git-safe-fail"), {
    runGit: async (_projectRoot: string, args: readonly string[]) => {
      if (args[0] === "status") {
        throw new Error("stdout maxBuffer length exceeded");
      }
      return fakeGitOutput(args);
    }
  });
  assert.equal(status.available, false);
  assert.equal(status.branch, null);
  assert.equal(status.clean, null);
  assert.equal(status.changedFiles, 0);
});

test("readGitStatus detects linked git worktree and resolves mainWorktreeRoot", async () => {
  clearGitStatusCache();
  const baseDir = await fs.mkdtemp(path.join(os.tmpdir(), "nexus-test-worktree-"));
  const primaryDir = path.join(baseDir, "primary");
  const worktreeDir = path.join(baseDir, "wt-114d");
  try {
    await fs.mkdir(primaryDir, { recursive: true });
    await execFile("git", ["init", "-b", "main", primaryDir]);
    await execFile("git", ["-C", primaryDir, "config", "user.name", "DevFlow Test"]);
    await execFile("git", ["-C", primaryDir, "config", "user.email", "test@nexus.local"]);
    await fs.writeFile(path.join(primaryDir, "README.md"), "# test\n", "utf8");
    await execFile("git", ["-C", primaryDir, "add", "README.md"]);
    await execFile("git", ["-C", primaryDir, "commit", "-m", "init"]);
    await execFile("git", ["-C", primaryDir, "worktree", "add", worktreeDir, "-b", "feature/wt-test"]);

    const primaryStatus = await readGitStatus(primaryDir, { forceFresh: true });
    assert.equal(primaryStatus.available, true);
    assert.equal(primaryStatus.isWorktree, false);
    assert.equal(primaryStatus.mainWorktreeRoot, null);

    const wtStatus = await readGitStatus(worktreeDir, { forceFresh: true });
    assert.equal(wtStatus.available, true);
    assert.equal(wtStatus.branch, "feature/wt-test");
    assert.equal(wtStatus.isWorktree, true);
    assert.equal(
      wtStatus.mainWorktreeRoot?.toLowerCase(),
      (await fs.realpath(primaryDir)).toLowerCase()
    );

    const worktrees = await listGitWorktrees(worktreeDir);
    assert.equal(worktrees.length, 2);
    assert.ok(worktrees.some((w) => w.isMain && w.branch === "main"));
    assert.ok(worktrees.some((w) => !w.isMain && w.branch === "feature/wt-test"));
  } finally {
    await execFile("git", ["-C", primaryDir, "worktree", "remove", "--force", worktreeDir]).catch(() => {});
    await fs.rm(baseDir, { recursive: true, force: true });
  }
});

function fakeGitOutput(args: readonly string[]): string {
  if (args[0] === "rev-parse" && args[1] === "--is-inside-work-tree") return "true";
  if (args[0] === "rev-parse" && args[1] === "--git-dir") return ".git\n.git";
  if (args[0] === "symbolic-ref") return "2.5.0";
  if (args[0] === "log") return "test commit";
  if (args[0] === "rev-parse") return "";
  if (args[0] === "status") return "";
  if (args[0] === "rev-list") return "0 0";
  throw new Error(`Unexpected fake Git command: ${args.join(" ")}`);
}
