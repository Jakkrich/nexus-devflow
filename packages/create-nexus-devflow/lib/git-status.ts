import { execFile } from "node:child_process";
import path from "node:path";
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

type GitCommandRunner = (
  projectRoot: string,
  args: readonly string[]
) => Promise<string>;

interface ReadGitStatusOptions {
  ttlMs?: number;
  forceFresh?: boolean;
  now?: () => number;
  runGit?: GitCommandRunner;
}

const gitCache = new Map<string, GitStatusCacheEntry>();
const gitInFlight = new Map<string, Promise<GitStatusSummary>>();
const DEFAULT_GIT_CACHE_TTL_MS = 2000;

const execFileAsync = promisify(execFile);

function clearGitStatusCache(): void {
  gitCache.clear();
  gitInFlight.clear();
}

async function readGitStatus(
  projectRoot: string,
  options: ReadGitStatusOptions = {}
): Promise<GitStatusSummary> {
  const now = options.now || Date.now;
  const ttlMs = options.ttlMs ?? DEFAULT_GIT_CACHE_TTL_MS;
  const cacheKey = path.resolve(projectRoot);
  const gitRunner = options.runGit || runGit;

  if (!options.forceFresh) {
    const cached = gitCache.get(cacheKey);
    if (cached && cached.expiresAt > now()) {
      return cached.value;
    }

    const pending = gitInFlight.get(cacheKey);
    if (pending) return pending;
  }

  const computeAndCache = async (): Promise<GitStatusSummary> => {
    const value = await computeGitStatus(projectRoot, gitRunner);
    gitCache.set(cacheKey, { expiresAt: now() + ttlMs, value });
    return value;
  };

  if (options.forceFresh) {
    return computeAndCache();
  }

  let pending: Promise<GitStatusSummary>;
  pending = computeAndCache().finally(() => {
    if (gitInFlight.get(cacheKey) === pending) gitInFlight.delete(cacheKey);
  });
  gitInFlight.set(cacheKey, pending);
  return pending;
}

async function computeGitStatus(
  projectRoot: string,
  gitRunner: GitCommandRunner
): Promise<GitStatusSummary> {
  if (!(await isGitRepository(projectRoot, gitRunner))) {
    return unavailableSummary();
  }

  const [porcelain, branch, lastCommit, upstream] = await Promise.all([
    gitRunner(projectRoot, ["status", "--porcelain=v1", "--untracked-files=all"]),
    readBranch(projectRoot, gitRunner),
    runOptionalGit(projectRoot, ["log", "-1", "--format=%s"], gitRunner),
    runOptionalGit(projectRoot, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], gitRunner)
  ]);

  const changedFiles = porcelain
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .length;

  const divergence = upstream
    ? await readDivergence(projectRoot, gitRunner)
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

  return value;
}

async function isGitRepository(
  projectRoot: string,
  gitRunner: GitCommandRunner
): Promise<boolean> {
  return (await runOptionalGit(projectRoot, [
    "rev-parse",
    "--is-inside-work-tree"
  ], gitRunner)) === "true";
}

async function readBranch(
  projectRoot: string,
  gitRunner: GitCommandRunner
): Promise<string> {
  const branch = await runOptionalGit(projectRoot, [
    "symbolic-ref",
    "--quiet",
    "--short",
    "HEAD"
  ], gitRunner);
  return branch || "(detached HEAD)";
}

async function readDivergence(
  projectRoot: string,
  gitRunner: GitCommandRunner
): Promise<Pick<GitStatusSummary, "ahead" | "behind">> {
  const counts = await runOptionalGit(projectRoot, [
    "rev-list",
    "--left-right",
    "--count",
    "HEAD...@{upstream}"
  ], gitRunner);
  const match = counts?.match(/^(\d+)\s+(\d+)$/);

  return match
    ? { ahead: Number(match[1]), behind: Number(match[2]) }
    : { ahead: null, behind: null };
}

async function runOptionalGit(
  projectRoot: string,
  args: readonly string[],
  gitRunner: GitCommandRunner
): Promise<string | null> {
  try {
    return await gitRunner(projectRoot, args);
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
