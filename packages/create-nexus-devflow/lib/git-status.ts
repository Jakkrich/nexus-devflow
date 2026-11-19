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
  isWorktree: boolean;
  mainWorktreeRoot: string | null;
}

interface GitStatusCacheEntry {
  expiresAt: number;
  value: GitStatusSummary;
}

type GitCommandRunner = (
  projectRoot: string,
  args: readonly string[]
) => Promise<string>;

interface GitWorktreeEntry {
  path: string;
  head: string | null;
  branch: string | null;
  isMain: boolean;
  isBare: boolean;
}

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

  const [porcelain, branch, lastCommit, upstream, gitDirsRaw] = await Promise.all([
    gitRunner(projectRoot, ["status", "--porcelain=v1", "--untracked-files=all"]),
    readBranch(projectRoot, gitRunner),
    runOptionalGit(projectRoot, ["log", "-1", "--format=%s"], gitRunner),
    runOptionalGit(projectRoot, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], gitRunner),
    runOptionalGit(projectRoot, ["rev-parse", "--git-dir", "--git-common-dir"], gitRunner)
  ]);

  const changedFiles = porcelain
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .length;

  const divergence = upstream
    ? await readDivergence(projectRoot, gitRunner)
    : { ahead: null, behind: null };

  const worktreeInfo = resolveWorktreeInfo(projectRoot, gitDirsRaw);

  const value: GitStatusSummary = {
    available: true,
    branch,
    clean: changedFiles === 0,
    changedFiles,
    lastCommit,
    upstream,
    ahead: divergence.ahead,
    behind: divergence.behind,
    isWorktree: worktreeInfo.isWorktree,
    mainWorktreeRoot: worktreeInfo.mainWorktreeRoot
  };

  return value;
}

function resolveWorktreeInfo(
  projectRoot: string,
  gitDirsRaw: string | null
): { isWorktree: boolean; mainWorktreeRoot: string | null } {
  if (!gitDirsRaw) {
    return { isWorktree: false, mainWorktreeRoot: null };
  }
  const lines = gitDirsRaw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length < 2) {
    return { isWorktree: false, mainWorktreeRoot: null };
  }
  const resolvedGitDir = path.resolve(projectRoot, lines[0]!);
  const resolvedCommonDir = path.resolve(projectRoot, lines[1]!);
  const norm = (value: string): string =>
    process.platform === "win32" ? path.normalize(value).toLowerCase() : path.normalize(value);
  if (norm(resolvedGitDir) === norm(resolvedCommonDir)) {
    return { isWorktree: false, mainWorktreeRoot: null };
  }
  const mainWorktreeRoot =
    path.basename(resolvedCommonDir).toLowerCase() === ".git"
      ? path.dirname(resolvedCommonDir)
      : resolvedCommonDir;
  return { isWorktree: true, mainWorktreeRoot };
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
    behind: null,
    isWorktree: false,
    mainWorktreeRoot: null
  };
}

async function readGitStatusSafe(
  projectRoot: string,
  options: ReadGitStatusOptions = {}
): Promise<GitStatusSummary> {
  try {
    return await readGitStatus(projectRoot, options);
  } catch {
    return unavailableSummary();
  }
}

async function listGitWorktrees(
  projectRoot: string,
  gitRunner: GitCommandRunner = runGit
): Promise<GitWorktreeEntry[]> {
  if (!(await isGitRepository(projectRoot, gitRunner))) {
    return [];
  }
  const raw = await runOptionalGit(projectRoot, ["worktree", "list", "--porcelain"], gitRunner);
  if (!raw) {
    return [];
  }

  const entries: GitWorktreeEntry[] = [];
  const blocks = raw.split(/\r?\n\r?\n/);
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index].trim();
    if (!block) continue;
    let wtPath = "";
    let head: string | null = null;
    let branch: string | null = null;
    let isBare = false;

    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith("worktree ")) {
        wtPath = path.resolve(line.slice("worktree ".length).trim());
      } else if (line.startsWith("HEAD ")) {
        head = line.slice("HEAD ".length).trim() || null;
      } else if (line.startsWith("branch ")) {
        branch = line.slice("branch ".length).trim().replace(/^refs\/heads\//, "") || null;
      } else if (line === "bare") {
        isBare = true;
      }
    }

    if (wtPath) {
      entries.push({
        path: wtPath,
        head,
        branch,
        isMain: entries.length === 0,
        isBare
      });
    }
  }
  return entries;
}

async function listGitLocalBranches(
  projectRoot: string,
  gitRunner: GitCommandRunner = runGit
): Promise<string[]> {
  if (!(await isGitRepository(projectRoot, gitRunner))) {
    return [];
  }
  const raw = await runOptionalGit(
    projectRoot,
    ["for-each-ref", "refs/heads/", "--format=%(refname:short)"],
    gitRunner
  );
  if (!raw) return [];
  return raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

async function resolveGitCommonDir(
  projectRoot: string,
  gitRunner: GitCommandRunner = runGit
): Promise<string | null> {
  if (!(await isGitRepository(projectRoot, gitRunner))) {
    return null;
  }
  const raw = await runOptionalGit(projectRoot, ["rev-parse", "--git-common-dir"], gitRunner);
  if (!raw) return null;
  return path.resolve(projectRoot, raw);
}

export {
  clearGitStatusCache,
  listGitLocalBranches,
  listGitWorktrees,
  readGitStatus,
  readGitStatusSafe,
  resolveGitCommonDir,
  unavailableSummary as unavailableGitStatusSummary
};

export type { GitStatusSummary, GitWorktreeEntry, ReadGitStatusOptions };
