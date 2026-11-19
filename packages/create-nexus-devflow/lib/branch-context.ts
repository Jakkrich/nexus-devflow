import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import {
  listGitLocalBranches,
  listGitWorktrees,
  readGitStatus,
  resolveGitCommonDir
} from "./git-status.js";
import { readAllRunStates, type RunHandoff, type RunStateSummary } from "./run-state.js";
export {
  ActiveContextEngine,
  type ActiveContextEngineOptions,
  type ActiveTaskContext
} from "./active-context-engine.js";

export interface ActiveContextPaths {
  isBranchScoped: boolean;
  branchName: string | null;
  sanitizedBranch: string | null;
  runId?: string | null;
  branchDir: string | null;
  featureSpecPath: string;
  stagePath: string;
  findingsPath: string;
}

export interface RunContextPaths {
  isMultiRun: boolean;
  runId: string | null;
  runDir: string | null;
  specPath: string;
  stagePath: string;
  findingsPath: string;
  globalOverviewPath: string;
  globalStandardsPath: string;
}

export interface ActiveRunSummary {
  runId: string;
  title: string;
  status: string;
  stage?: string;
  track: string;
  branch: string;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  hasOpenFindings: boolean;
  runDir: string;
  specPath: string;
}

export interface InitRunOptions {
  branch?: string;
  track?: string;
  status?: string;
  initialSpec?: string;
}

export interface WorktreeRunSummary extends ActiveRunSummary {
  worktreePath: string;
  isCurrentWorktree: boolean;
  activity: RunStateSummary | null;
  handoff: RunHandoff | null;
}

export type WorktreeGuardVerdict =
  | {
      allowed: true;
      mode: "isolated_worktree" | "spec_ahead_on_main" | "single_active_run";
    }
  | {
      allowed: false;
      reason: "same_checkout_active_run" | "branch_checked_out_in_sibling_worktree";
      conflictingRunId: string | null;
      conflictingWorktreePath: string | null;
      recommendedAction: string;
    };

const RESERVED_CONTEXT_DIRS = new Set([
  "current-run",
  "findings.md",
  "current-feature.md",
  "current-stage.md",
  "coding-standards.md",
  "project-overview.md",
  "ai-interaction.md",
  "glossary.md"
]);

/**
 * Sanitizes a Git branch name into a cross-platform safe directory name.
 * e.g. "feature/044-auth#login" -> "feature-044-auth-login"
 */
export function sanitizeBranchName(branch: string): string {
  return branch
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/**
 * Parses checklist tasks and status from a living spec content.
 */
function parseSpecTasks(content: string): { total: number; completed: number; title: string } {
  let title = "Living Spec";
  const titleMatch = content.match(/^#\s+(?:📐\s+)?(?:\[([^\]]+)\]\s+)?(.*)/m);
  if (titleMatch) {
    title = titleMatch[2]?.trim() || titleMatch[1]?.trim() || title;
  }

  let total = 0;
  let completed = 0;
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.+)/);
    if (match) {
      total++;
      if (match[1].toLowerCase() === "x") {
        completed++;
      }
    }
  }

  return { total, completed, title };
}

/**
 * Lists all active run contexts under devflow/context/{xxx-slug}/
 */
export async function listActiveRunContexts(projectRoot: string): Promise<ActiveRunSummary[]> {
  const results: ActiveRunSummary[] = [];
  const contextRoot = path.join(projectRoot, "devflow", "context");

  if (!fsSync.existsSync(contextRoot)) {
    return results;
  }

  try {
    const entries = await fs.readdir(contextRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !RESERVED_CONTEXT_DIRS.has(entry.name)) {
        const runDir = path.join(contextRoot, entry.name);
        const specPath = fsSync.existsSync(path.join(runDir, "spec.md"))
          ? path.join(runDir, "spec.md")
          : path.join(runDir, "current-feature.md");

        if (fsSync.existsSync(specPath)) {
          const specContent = await fs.readFile(specPath, "utf8");
          const { total, completed, title } = parseSpecTasks(specContent);

          let track = "fast";
          let status = "spec_ready";
          let stage = "feature";
          let branch = `feature/${entry.name}`;

          const stagePath = path.join(runDir, "stage.md");
          if (fsSync.existsSync(stagePath)) {
            const stageContent = await fs.readFile(stagePath, "utf8");
            const trackMatch = stageContent.match(/(?:-\s*(?:\*\*)?Track(?:\*\*)?:\s*|Track:\s*)`?([a-zA-Z0-9_-]+)`?/i);
            const branchMatch = stageContent.match(/(?:-\s*(?:\*\*)?Branch(?:\*\*)?:\s*|Branch:\s*)`?([a-zA-Z0-9_/.-]+)`?/i);
            const statusMatch = stageContent.match(/(?:-\s*(?:\*\*)?Status(?:\*\*)?:\s*|Status:\s*)`?([a-zA-Z0-9_-]+)`?/i);
            const stageMatch = stageContent.match(/(?:-\s*(?:\*\*)?(?:Current Stage|Stage)(?:\*\*)?:\s*|(?:Current Stage|Stage):\s*)`?([a-zA-Z0-9_-]+)`?/i);
            if (trackMatch) track = trackMatch[1];
            if (branchMatch) branch = branchMatch[1];
            if (statusMatch) status = statusMatch[1];
            if (stageMatch) stage = stageMatch[1];
          }

          let hasOpenFindings = false;
          const findingsPath = path.join(runDir, "findings.md");
          if (fsSync.existsSync(findingsPath)) {
            const findingsContent = await fs.readFile(findingsPath, "utf8");
            hasOpenFindings = /###\s+\[(FIND-\d+|P[0-3])\]/i.test(findingsContent) &&
              !/Status:\s*`?(closed|fixed)`?/i.test(findingsContent);
          }

          results.push({
            runId: entry.name,
            title,
            status,
            stage,
            track,
            branch,
            totalTasks: total,
            completedTasks: completed,
            remainingTasks: Math.max(0, total - completed),
            hasOpenFindings,
            runDir,
            specPath
          });
        }
      }
    }
  } catch {
    // Ignore directory scan errors
  }

  return results.sort((a, b) => a.runId.localeCompare(b.runId));
}

/**
 * Fuzzy matches a user input string to an ActiveRunSummary.
 * Matches:
 * 1. Exact runId
 * 2. Leading number (e.g. "1" -> "001-*", "12" -> "012-*")
 * 3. Case-insensitive substring match in runId or title
 */
export function fuzzyMatchRunId(
  targetInput: string,
  activeRuns: ActiveRunSummary[]
): ActiveRunSummary | null {
  if (!targetInput || activeRuns.length === 0) return null;

  const normalized = targetInput.trim().toLowerCase();
  const cleaned = normalized.replace(/^(feature|fix|chore|rollback)\//, "");

  // 1. Exact match on runId
  const exact = activeRuns.find(
    (r) => r.runId.toLowerCase() === normalized || r.runId.toLowerCase() === cleaned
  );
  if (exact) return exact;

  // 2. Numeric match (e.g. "12", "012", "1")
  if (/^\d+$/.test(cleaned)) {
    const padded = cleaned.padStart(3, "0");
    const numMatch = activeRuns.find(
      (r) => r.runId.startsWith(`${padded}-`) || r.runId.startsWith(`${cleaned}-`) || r.runId === padded || r.runId === cleaned
    );
    if (numMatch) return numMatch;
  }

  // 3. Substring keyword match
  const subMatch = activeRuns.find(
    (r) =>
      r.runId.toLowerCase().includes(cleaned) ||
      cleaned.includes(r.runId.toLowerCase()) ||
      r.title.toLowerCase().includes(cleaned)
  );
  if (subMatch) return subMatch;

  return null;
}

function resolveRunStagePath(
  runDir: string,
  runId: string,
  defaultStagePath: string
): string {
  const localStage = path.join(runDir, "stage.md");
  if (fsSync.existsSync(localStage)) {
    return localStage;
  }
  if (fsSync.existsSync(defaultStagePath)) {
    try {
      const content = fsSync.readFileSync(defaultStagePath, "utf8");
      const match = content.match(/Active Running ID:\s*`?([^\r\n`]+)/i);
      if (match && sanitizeBranchName(match[1]) === sanitizeBranchName(runId)) {
        return defaultStagePath;
      }
    } catch {
      // ignore unreadable legacy stage file
    }
  }
  return localStage;
}

/**
 * Resolves active run context with Multi-Run and fallback support.
 */
export async function resolveActiveRunContext(
  projectRoot: string,
  targetIdOrBranch?: string
): Promise<RunContextPaths> {
  const globalOverviewPath = path.join(projectRoot, "devflow", "context", "project-overview.md");
  const globalStandardsPath = path.join(projectRoot, "devflow", "context", "coding-standards.md");
  const defaultFeaturePath = path.join(projectRoot, "devflow", "context", "current-feature.md");
  const defaultStagePath = path.join(projectRoot, "devflow", "context", "current-stage.md");
  const defaultFindingsPath = path.join(projectRoot, "devflow", "context", "findings.md");

  const activeRuns = await listActiveRunContexts(projectRoot);

  if (targetIdOrBranch) {
    const matched = fuzzyMatchRunId(targetIdOrBranch, activeRuns);
    if (matched) {
      return {
        isMultiRun: true,
        runId: matched.runId,
        runDir: matched.runDir,
        specPath: matched.specPath,
        stagePath: resolveRunStagePath(matched.runDir, matched.runId, defaultStagePath),
        findingsPath: path.join(matched.runDir, "findings.md"),
        globalOverviewPath,
        globalStandardsPath
      };
    }

    // Direct sanitized branch directory check
    const sanitized = sanitizeBranchName(targetIdOrBranch);
    const directDir = path.join(projectRoot, "devflow", "context", sanitized);
    const directSpec = fsSync.existsSync(path.join(directDir, "spec.md"))
      ? path.join(directDir, "spec.md")
      : path.join(directDir, "current-feature.md");

    if (fsSync.existsSync(directSpec)) {
      return {
        isMultiRun: true,
        runId: sanitized,
        runDir: directDir,
        specPath: directSpec,
        stagePath: resolveRunStagePath(directDir, sanitized, defaultStagePath),
        findingsPath: path.join(directDir, "findings.md"),
        globalOverviewPath,
        globalStandardsPath
      };
    }
  }

  // If no target given, check git status
  const git = await readGitStatus(projectRoot);
  if (git.available && git.branch) {
    const branchName = git.branch;
    const gitMatched = activeRuns.find(
      (r) => r.branch === branchName || r.runId === sanitizeBranchName(branchName)
    );
    if (gitMatched) {
      return {
        isMultiRun: true,
        runId: gitMatched.runId,
        runDir: gitMatched.runDir,
        specPath: gitMatched.specPath,
        stagePath: resolveRunStagePath(gitMatched.runDir, gitMatched.runId, defaultStagePath),
        findingsPath: path.join(gitMatched.runDir, "findings.md"),
        globalOverviewPath,
        globalStandardsPath
      };
    }
  }

  // If only 1 active run exists, auto-pick it
  if (activeRuns.length === 1) {
    const single = activeRuns[0];
    return {
      isMultiRun: true,
      runId: single.runId,
      runDir: single.runDir,
      specPath: single.specPath,
      stagePath: resolveRunStagePath(single.runDir, single.runId, defaultStagePath),
      findingsPath: path.join(single.runDir, "findings.md"),
      globalOverviewPath,
      globalStandardsPath
    };
  }

  // Idle / no active task in Pure Multi-Run model
  return {
    isMultiRun: false,
    runId: null,
    runDir: null,
    specPath: "",
    stagePath: "",
    findingsPath: "",
    globalOverviewPath,
    globalStandardsPath
  };
}

/**
 * Initializes a new run context under devflow/context/{runId}/
 */
export async function initRunContext(
  projectRoot: string,
  runId: string,
  title: string,
  options: InitRunOptions = {}
): Promise<RunContextPaths> {
  const sanitized = sanitizeBranchName(runId);
  const runDir = path.join(projectRoot, "devflow", "context", sanitized);
  await fs.mkdir(runDir, { recursive: true });

  const specPath = path.join(runDir, "spec.md");
  const stagePath = path.join(runDir, "stage.md");
  const findingsPath = path.join(runDir, "findings.md");

  const branch = options.branch || `feature/${sanitized}`;
  const track = options.track || "fast";
  const status = options.status || "spec_ready";

  if (options.initialSpec) {
    await fs.writeFile(specPath, options.initialSpec, "utf8");
  } else if (!fsSync.existsSync(specPath)) {
    const defaultSpec = `# 📐 [${sanitized}] ${title}\n\n- **Status**: \`${status}\`\n- **Branch**: \`${branch}\`\n\n## 3. Implementation Checklist\n- [ ] Task 1: Initialize implementation\n`;
    await fs.writeFile(specPath, defaultSpec, "utf8");
  }

  if (!fsSync.existsSync(stagePath)) {
    const stageContent = `# Current Stage\n\n- Track: \`${track}\`\n- Active Running ID: \`${sanitized}\`\n- Status: \`${status}\`\n- Branch: \`${branch}\`\n- Next Action: \`Run /implement to begin execution.\`\n`;
    await fs.writeFile(stagePath, stageContent, "utf8");
  }

  if (!fsSync.existsSync(findingsPath)) {
    const findingsContent = `# Findings\n\n> Findings ledger for \`${sanitized}\`.\n\n_No findings recorded._\n`;
    await fs.writeFile(findingsPath, findingsContent, "utf8");
  }

  return {
    isMultiRun: true,
    runId: sanitized,
    runDir,
    specPath,
    stagePath,
    findingsPath,
    globalOverviewPath: path.join(projectRoot, "devflow", "context", "project-overview.md"),
    globalStandardsPath: path.join(projectRoot, "devflow", "context", "coding-standards.md")
  };
}

/**
 * Cleans up a run context directory after completion.
 */
export async function cleanupRunContext(
  projectRoot: string,
  runId: string
): Promise<boolean> {
  const sanitized = sanitizeBranchName(runId);
  const runDir = path.join(projectRoot, "devflow", "context", sanitized);

  try {
    if (fsSync.existsSync(runDir)) {
      await fs.rm(runDir, { recursive: true, force: true });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

const DEFAULT_RESERVATION_TTL_MS = 10 * 60 * 1000;

async function normalizeRealPath(targetPath: string): Promise<string> {
  try {
    return (await fs.realpath(targetPath)).toLowerCase();
  } catch {
    return path.resolve(targetPath).toLowerCase();
  }
}

async function resolveReservationDir(projectRoot: string): Promise<string> {
  const commonDir = await resolveGitCommonDir(projectRoot);
  if (commonDir) {
    return path.join(commonDir, "devflow-id-reservations");
  }
  return path.join(projectRoot, "devflow", ".state", "locks");
}

function extractLeadingId(value: string): number | null {
  const match = value.match(/(?:^|\/)(?:feature|fix|chore|rollback)?\/?(\d{3})(?:-|$)/i) ||
    value.match(/^(\d{3})/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Calculates the next sequential 3-digit running ID by scanning history archives,
 * active run contexts across all linked worktrees, local branches, and active reservations.
 */
export async function calculateNextRunningId(projectRoot: string): Promise<string> {
  const ids: number[] = [];

  // 1. Scan history archives
  const historyRoots = [
    path.join(projectRoot, "devflow", "history", "features"),
    path.join(projectRoot, "devflow", "history", "fixes"),
    path.join(projectRoot, "devflow", "history", "rollbacks")
  ];

  for (const root of historyRoots) {
    if (fsSync.existsSync(root)) {
      try {
        const files = await fs.readdir(root);
        for (const file of files) {
          const parsed = extractLeadingId(file);
          if (parsed !== null) ids.push(parsed);
        }
      } catch {
        // ignore
      }
    }
  }

  // 2. Scan active run contexts and run state files across current + linked worktrees
  const worktrees = await listGitWorktrees(projectRoot);
  const worktreeRoots = worktrees.length > 0
    ? [...new Set(worktrees.filter((w) => !w.isBare).map((w) => w.path))]
    : [path.resolve(projectRoot)];

  for (const wtRoot of worktreeRoots) {
    const activeRuns = await listActiveRunContexts(wtRoot);
    for (const run of activeRuns) {
      const parsed = extractLeadingId(run.runId);
      if (parsed !== null) ids.push(parsed);
    }

    const states = await readAllRunStates(wtRoot).catch(() => null);
    if (states) {
      for (const state of states.runs) {
        if (state.runId) {
          const parsed = extractLeadingId(state.runId);
          if (parsed !== null) ids.push(parsed);
        }
      }
    }
  }

  // 3. Scan local branches (refs/heads/*)
  const branches = await listGitLocalBranches(projectRoot);
  for (const branch of branches) {
    const parsed = extractLeadingId(branch);
    if (parsed !== null) ids.push(parsed);
  }

  // 4. Scan active non-expired atomic ID reservations
  const reservationDir = await resolveReservationDir(projectRoot);
  if (fsSync.existsSync(reservationDir)) {
    const now = Date.now();
    try {
      const locks = await fs.readdir(reservationDir);
      for (const file of locks) {
        if (!file.endsWith(".lock")) continue;
        const lockPath = path.join(reservationDir, file);
        try {
          const payload = JSON.parse(await fs.readFile(lockPath, "utf8")) as { expiresAt?: number };
          if (typeof payload.expiresAt === "number" && payload.expiresAt <= now) {
            await fs.rm(lockPath, { force: true }).catch(() => {});
            continue;
          }
          const parsed = extractLeadingId(file);
          if (parsed !== null) ids.push(parsed);
        } catch {
          // ignore unreadable or concurrent lock
        }
      }
    } catch {
      // ignore
    }
  }

  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return (maxId + 1).toString().padStart(3, "0");
}

/**
 * Atomically reserves the next sequential 3-digit running ID across concurrent chats/worktrees.
 */
export async function reserveNextRunningId(
  projectRoot: string,
  options: { ttlMs?: number; ownerToken?: string } = {}
): Promise<{ id: string; release: () => Promise<void> }> {
  const ttlMs = options.ttlMs ?? DEFAULT_RESERVATION_TTL_MS;
  const reservationDir = await resolveReservationDir(projectRoot);
  await fs.mkdir(reservationDir, { recursive: true });

  const baseId = parseInt(await calculateNextRunningId(projectRoot), 10);
  for (let attempt = 0; attempt < 256; attempt += 1) {
    const candidateId = (baseId + attempt).toString().padStart(3, "0");
    const lockPath = path.join(reservationDir, `${candidateId}.lock`);
    const now = Date.now();
    const payload = JSON.stringify({
      id: candidateId,
      pid: process.pid,
      ownerToken: options.ownerToken || `${process.pid}-${now}`,
      createdAt: now,
      expiresAt: now + ttlMs
    });

    try {
      await fs.writeFile(lockPath, `${payload}\n`, { encoding: "utf8", flag: "wx" });
      return {
        id: candidateId,
        release: async () => {
          await fs.rm(lockPath, { force: true });
        }
      };
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
      try {
        const existing = JSON.parse(await fs.readFile(lockPath, "utf8")) as { expiresAt?: number };
        if (typeof existing.expiresAt === "number" && existing.expiresAt <= Date.now()) {
          await fs.rm(lockPath, { force: true }).catch(() => {});
          attempt -= 1;
        }
      } catch {
        // another actor holds or just removed lock; advance candidate
      }
    }
  }

  throw new Error("Could not reserve a unique running ID after 256 attempts.");
}

/**
 * Evaluates whether starting or implementing targetRunId in projectRoot conflicts with
 * an active run in the same checkout or a sibling linked worktree holding targetBranch.
 */
export async function evaluateWorktreeGuard(
  projectRoot: string,
  targetRunId: string,
  options: { intent?: "feature_spec" | "implement"; targetBranch?: string } = {}
): Promise<WorktreeGuardVerdict> {
  const intent = options.intent ?? "implement";
  const normalizedTarget = sanitizeBranchName(targetRunId);
  const targetBranch = options.targetBranch || `feature/${normalizedTarget}`;
  const currentPathNorm = await normalizeRealPath(projectRoot);

  const worktrees = await listGitWorktrees(projectRoot);
  for (const wt of worktrees) {
    const wtNorm = await normalizeRealPath(wt.path);
    if (wtNorm !== currentPathNorm && wt.branch === targetBranch) {
      return {
        allowed: false,
        reason: "branch_checked_out_in_sibling_worktree",
        conflictingRunId: normalizedTarget,
        conflictingWorktreePath: wt.path,
        recommendedAction: `Switch to sibling worktree at ${wt.path} or pick a new run ID.`
      };
    }
  }

  if (intent === "feature_spec") {
    return { allowed: true, mode: "spec_ahead_on_main" };
  }

  const runStates = await readAllRunStates(projectRoot);
  const conflicting = runStates.runs.find(
    (entry) =>
      entry.state === "recorded" &&
      entry.status === "running" &&
      entry.freshness !== "stale" &&
      entry.runId &&
      sanitizeBranchName(entry.runId) !== normalizedTarget
  );

  if (conflicting) {
    return {
      allowed: false,
      reason: "same_checkout_active_run",
      conflictingRunId: conflicting.runId || null,
      conflictingWorktreePath: conflicting.worktreePath || projectRoot,
      recommendedAction: `Create a separate worktree: git worktree add ..\\wt-${normalizedTarget} -b ${targetBranch}`
    };
  }

  const git = await readGitStatus(projectRoot);
  return {
    allowed: true,
    mode: git.isWorktree ? "isolated_worktree" : "single_active_run"
  };
}

function parseHandoffFromStage(stageContent: string): RunHandoff | null {
  const match = stageContent.match(/##\s+Handoff Summary\s*\r?\n([\s\S]*?)(?:\r?\n##\s+|$)/i);
  if (!match) return null;
  const bullets = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
  if (bullets.length === 0) return null;
  return {
    notes: bullets.join(" | ")
  };
}

/**
 * Lists active runs across the current checkout and all linked Git worktrees without mutating them.
 */
export async function listWorktreeRunContexts(
  projectRoot: string
): Promise<WorktreeRunSummary[]> {
  const worktrees = await listGitWorktrees(projectRoot);
  const currentPathNorm = await normalizeRealPath(projectRoot);
  const entries = worktrees.length > 0
    ? worktrees.filter((w) => !w.isBare)
    : [{ path: path.resolve(projectRoot), head: null, branch: null, isMain: true, isBare: false }];

  const byRunId = new Map<string, { score: number; item: WorktreeRunSummary }>();

  for (const wt of entries) {
    const wtRoot = wt.path;
    const wtNorm = await normalizeRealPath(wtRoot);
    const isCurrentWorktree = wtNorm === currentPathNorm;
    const [runs, stateCollection] = await Promise.all([
      listActiveRunContexts(wtRoot),
      readAllRunStates(wtRoot).catch(() => null)
    ]);

    for (const run of runs) {
      const activity =
        stateCollection?.runs.find(
          (item) => item.runId && sanitizeBranchName(item.runId) === sanitizeBranchName(run.runId)
        ) || null;

      let handoff: RunHandoff | null = activity?.handoff ?? null;
      if (!handoff) {
        try {
          const stageContent = await fs.readFile(path.join(run.runDir, "stage.md"), "utf8");
          handoff = parseHandoffFromStage(stageContent);
        } catch {
          handoff = null;
        }
      }

      const branchMatches = Boolean(wt.branch && run.branch && wt.branch === run.branch);
      const score =
        (branchMatches ? 4 : 0) +
        (activity ? 2 : 0) +
        (isCurrentWorktree ? 1 : 0);

      const candidate: WorktreeRunSummary = {
        ...run,
        worktreePath: wtRoot,
        isCurrentWorktree,
        activity,
        handoff
      };

      const existing = byRunId.get(run.runId);
      if (!existing || score > existing.score) {
        byRunId.set(run.runId, { score, item: candidate });
      }
    }
  }

  return [...byRunId.values()]
    .map((entry) => entry.item)
    .sort((a, b) => a.runId.localeCompare(b.runId));
}

/**
 * Resolves active context paths for the current repository and git branch (Legacy/Interoperable helper).
 */
export async function resolveActiveContextPaths(
  projectRoot: string,
  explicitBranch?: string
): Promise<ActiveContextPaths> {
  const runContext = await resolveActiveRunContext(projectRoot, explicitBranch);

  if (runContext.isMultiRun && runContext.runDir) {
    return {
      isBranchScoped: true,
      branchName: explicitBranch || runContext.runId,
      sanitizedBranch: runContext.runId,
      runId: runContext.runId,
      branchDir: runContext.runDir,
      featureSpecPath: runContext.specPath,
      stagePath: runContext.stagePath,
      findingsPath: runContext.findingsPath
    };
  }

  return {
    isBranchScoped: false,
    branchName: explicitBranch || null,
    sanitizedBranch: null,
    runId: null,
    branchDir: null,
    featureSpecPath: runContext.specPath,
    stagePath: runContext.stagePath,
    findingsPath: runContext.findingsPath
  };
}

/**
 * Initializes a branch-scoped context directory (Backward compatibility wrapper).
 */
export async function initBranchContext(
  projectRoot: string,
  branchName: string,
  initialSpec?: string,
  useDevflowContextDir: boolean = true
): Promise<ActiveContextPaths> {
  const sanitized = sanitizeBranchName(branchName);
  const runPaths = await initRunContext(projectRoot, sanitized, branchName, {
    branch: branchName,
    initialSpec
  });

  return {
    isBranchScoped: true,
    branchName,
    sanitizedBranch: sanitized,
    branchDir: runPaths.runDir,
    featureSpecPath: runPaths.specPath,
    stagePath: runPaths.stagePath,
    findingsPath: runPaths.findingsPath
  };
}

/**
 * Cleans up branch-scoped context directories (Backward compatibility wrapper).
 */
export async function cleanupBranchContext(
  projectRoot: string,
  branchName: string
): Promise<boolean> {
  const sanitized = sanitizeBranchName(branchName);
  const cleanedRun = await cleanupRunContext(projectRoot, sanitized);
  const nexusBranchDir = path.join(projectRoot, ".nexus", "branches", sanitized);

  let cleanedNexus = false;
  try {
    if (fsSync.existsSync(nexusBranchDir)) {
      await fs.rm(nexusBranchDir, { recursive: true, force: true });
      cleanedNexus = true;
    }
  } catch {
    // ignore
  }

  return cleanedRun || cleanedNexus;
}

/**
 * Lists all active branch isolated contexts (Backward compatibility wrapper).
 */
export async function listBranchContexts(
  projectRoot: string
): Promise<Array<{ branch: string; path: string; hasSpec: boolean; type: "devflow" | "nexus" }>> {
  const activeRuns = await listActiveRunContexts(projectRoot);
  const results: Array<{ branch: string; path: string; hasSpec: boolean; type: "devflow" | "nexus" }> = activeRuns.map((r) => ({
    branch: r.runId,
    path: r.runDir,
    hasSpec: true,
    type: "devflow"
  }));

  // Scan .nexus/branches/
  const nexusBranchesRoot = path.join(projectRoot, ".nexus", "branches");
  if (fsSync.existsSync(nexusBranchesRoot)) {
    try {
      const entries = await fs.readdir(nexusBranchesRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join(nexusBranchesRoot, entry.name);
          const specPath = path.join(dirPath, "current-feature.md");
          results.push({
            branch: entry.name,
            path: dirPath,
            hasSpec: fsSync.existsSync(specPath),
            type: "nexus"
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return results;
}
