import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { readGitStatus } from "./git-status.js";

export interface ActiveContextPaths {
  isBranchScoped: boolean;
  branchName: string | null;
  sanitizedBranch: string | null;
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
          let branch = `feature/${entry.name}`;

          const stagePath = path.join(runDir, "stage.md");
          if (fsSync.existsSync(stagePath)) {
            const stageContent = await fs.readFile(stagePath, "utf8");
            const trackMatch = stageContent.match(/Track:\s*`?([a-zA-Z0-9_-]+)`?/i);
            const branchMatch = stageContent.match(/Branch:\s*`?([a-zA-Z0-9_/.-]+)`?/i);
            const statusMatch = stageContent.match(/Status:\s*`?([a-zA-Z0-9_-]+)`?/i);
            if (trackMatch) track = trackMatch[1];
            if (branchMatch) branch = branchMatch[1];
            if (statusMatch) status = statusMatch[1];
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

  // 1. Exact match on runId
  const exact = activeRuns.find((r) => r.runId.toLowerCase() === normalized);
  if (exact) return exact;

  // 2. Numeric match (e.g. "12", "012", "1")
  if (/^\d+$/.test(normalized)) {
    const padded = normalized.padStart(3, "0");
    const numMatch = activeRuns.find(
      (r) => r.runId.startsWith(`${padded}-`) || r.runId.startsWith(`${normalized}-`) || r.runId === padded || r.runId === normalized
    );
    if (numMatch) return numMatch;
  }

  // 3. Substring keyword match
  const subMatch = activeRuns.find(
    (r) => r.runId.toLowerCase().includes(normalized) || r.title.toLowerCase().includes(normalized)
  );
  if (subMatch) return subMatch;

  return null;
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
      const stageFile = fsSync.existsSync(path.join(matched.runDir, "stage.md"))
        ? path.join(matched.runDir, "stage.md")
        : defaultStagePath;
      const findingsFile = fsSync.existsSync(path.join(matched.runDir, "findings.md"))
        ? path.join(matched.runDir, "findings.md")
        : defaultFindingsPath;

      return {
        isMultiRun: true,
        runId: matched.runId,
        runDir: matched.runDir,
        specPath: matched.specPath,
        stagePath: stageFile,
        findingsPath: findingsFile,
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
        stagePath: fsSync.existsSync(path.join(directDir, "stage.md"))
          ? path.join(directDir, "stage.md")
          : defaultStagePath,
        findingsPath: fsSync.existsSync(path.join(directDir, "findings.md"))
          ? path.join(directDir, "findings.md")
          : defaultFindingsPath,
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
        stagePath: fsSync.existsSync(path.join(gitMatched.runDir, "stage.md"))
          ? path.join(gitMatched.runDir, "stage.md")
          : defaultStagePath,
        findingsPath: fsSync.existsSync(path.join(gitMatched.runDir, "findings.md"))
          ? path.join(gitMatched.runDir, "findings.md")
          : defaultFindingsPath,
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
      stagePath: fsSync.existsSync(path.join(single.runDir, "stage.md"))
        ? path.join(single.runDir, "stage.md")
        : defaultStagePath,
      findingsPath: fsSync.existsSync(path.join(single.runDir, "findings.md"))
        ? path.join(single.runDir, "findings.md")
        : defaultFindingsPath,
      globalOverviewPath,
      globalStandardsPath
    };
  }

  // Fallback to root context
  return {
    isMultiRun: false,
    runId: null,
    runDir: null,
    specPath: defaultFeaturePath,
    stagePath: defaultStagePath,
    findingsPath: defaultFindingsPath,
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

/**
 * Calculates the next sequential 3-digit running ID by scanning history archives and active run contexts.
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
          const match = file.match(/^(\d{3})/);
          if (match) {
            ids.push(parseInt(match[1], 10));
          }
        }
      } catch {
        // ignore
      }
    }
  }

  // 2. Scan active run contexts
  const activeRuns = await listActiveRunContexts(projectRoot);
  for (const run of activeRuns) {
    const match = run.runId.match(/^(\d{3})/);
    if (match) {
      ids.push(parseInt(match[1], 10));
    }
  }

  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return (maxId + 1).toString().padStart(3, "0");
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
