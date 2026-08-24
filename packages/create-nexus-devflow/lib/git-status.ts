import { execFile } from "node:child_process";
import { promisify } from "node:util";

interface GitStatusSummary {
  available: boolean;
  branch: string | null;
  clean: boolean | null;
  changedFiles: number;
  lastCommit: string | null;
  upstream: string | null;
  ahead: number | null;
  behind: number | null;
}

interface GitStatusCacheEntry {
  expiresAt: number;
  value: GitStatusSummary;
}

const gitCache = new Map<string, GitStatusCacheEntry>();
const DEFAULT_GIT_CACHE_TTL_MS = 2000;

const execFileAsync = promisify(execFile);

function clearGitStatusCache(): void {
  gitCache.clear();
}

async function readGitStatus(
  projectRoot: string,
  options: { ttlMs?: number; forceFresh?: boolean; now?: () => number } = {}
): Promise<GitStatusSummary> {
  const now = (options.now || Date.now)();
  const ttlMs = options.ttlMs ?? DEFAULT_GIT_CACHE_TTL_MS;

  if (!options.forceFresh) {
    const cached = gitCache.get(projectRoot);
    if (cached && cached.expiresAt > now) {
      return cached.value;
    }
  }

  if (!(await isGitRepository(projectRoot))) {
    const unavail = unavailableSummary();
    gitCache.set(projectRoot, { expiresAt: now + ttlMs, value: unavail });
    return unavail;
  }

  const [porcelain, branch, lastCommit, upstream] = await Promise.all([
    runGit(projectRoot, ["status", "--porcelain=v1", "--untracked-files=all"]),
    readBranch(projectRoot),
    runOptionalGit(projectRoot, ["log", "-1", "--format=%s"]),
    runOptionalGit(projectRoot, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"])
  ]);

  const changedFiles = porcelain
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .length;

  const divergence = upstream
    ? await readDivergence(projectRoot)
    : { ahead: null, behind: null };

  const value: GitStatusSummary = {
    available: true,
    branch,
    clean: changedFiles === 0,
    changedFiles,
    lastCommit,
    upstream,
    ahead: divergence.ahead,
    behind: divergence.behind
  };

  gitCache.set(projectRoot, { expiresAt: now + ttlMs, value });
  return value;
}

async function isGitRepository(projectRoot: string): Promise<boolean> {
  return (await runOptionalGit(projectRoot, [
    "rev-parse",
    "--is-inside-work-tree"
  ])) === "true";
}

async function readBranch(projectRoot: string): Promise<string> {
  const branch = await runOptionalGit(projectRoot, [
    "symbolic-ref",
    "--quiet",
    "--short",
    "HEAD"
  ]);
  return branch || "(detached HEAD)";
}

async function readDivergence(
  projectRoot: string
): Promise<Pick<GitStatusSummary, "ahead" | "behind">> {
  const counts = await runOptionalGit(projectRoot, [
    "rev-list",
    "--left-right",
    "--count",
    "HEAD...@{upstream}"
  ]);
  const match = counts?.match(/^(\d+)\s+(\d+)$/);

  return match
    ? { ahead: Number(match[1]), behind: Number(match[2]) }
    : { ahead: null, behind: null };
}

async function runOptionalGit(
  projectRoot: string,
  args: readonly string[]
): Promise<string | null> {
  try {
    return await runGit(projectRoot, args);
  } catch {
    return null;
  }
}

async function runGit(projectRoot: string, args: readonly string[]): Promise<string> {
  const result = await execFileAsync("git", ["-C", projectRoot, ...args], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
  return result.stdout.trim();
}

function unavailableSummary(): GitStatusSummary {
  return {
    available: false,
    branch: null,
    clean: null,
    changedFiles: 0,
    lastCommit: null,
    upstream: null,
    ahead: null,
    behind: null
  };
}

export { readGitStatus, clearGitStatusCache };

export type { GitStatusSummary };
