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
 * Resolves active context paths for the current repository and git branch.
 * Checks for branch-isolated context in:
 *   1. devflow/context/<sanitized>/ (Primary user-visible multi-dev location)
 *   2. .nexus/branches/<sanitized>/ (Internal branch cache)
 *   3. devflow/context/ (Default fallback)
 */
export async function resolveActiveContextPaths(
  projectRoot: string,
  explicitBranch?: string
): Promise<ActiveContextPaths> {
  const defaultFeaturePath = path.join(projectRoot, "devflow", "context", "current-feature.md");
  const defaultStagePath = path.join(projectRoot, "devflow", "context", "current-stage.md");
  const defaultFindingsPath = path.join(projectRoot, "devflow", "context", "findings.md");

  let branchName: string | null = explicitBranch || null;
  if (!branchName) {
    const git = await readGitStatus(projectRoot);
    if (git.available && git.branch) {
      branchName = git.branch;
    }
  }

  if (!branchName || branchName === "main" || branchName === "master" || branchName === "HEAD") {
    return {
      isBranchScoped: false,
      branchName,
      sanitizedBranch: null,
      branchDir: null,
      featureSpecPath: defaultFeaturePath,
      stagePath: defaultStagePath,
      findingsPath: defaultFindingsPath
    };
  }

  const sanitized = sanitizeBranchName(branchName);

  // Candidate 1: devflow/context/<sanitized>/
  const devflowBranchDir = path.join(projectRoot, "devflow", "context", sanitized);
  const devflowBranchFeature = path.join(devflowBranchDir, "current-feature.md");
  const devflowBranchStage = path.join(devflowBranchDir, "current-stage.md");

  if (fsSync.existsSync(devflowBranchFeature)) {
    return {
      isBranchScoped: true,
      branchName,
      sanitizedBranch: sanitized,
      branchDir: devflowBranchDir,
      featureSpecPath: devflowBranchFeature,
      stagePath: fsSync.existsSync(devflowBranchStage) ? devflowBranchStage : defaultStagePath,
      findingsPath: defaultFindingsPath
    };
  }

  // Candidate 2: .nexus/branches/<sanitized>/
  const nexusBranchDir = path.join(projectRoot, ".nexus", "branches", sanitized);
  const nexusBranchFeature = path.join(nexusBranchDir, "current-feature.md");
  const nexusBranchStage = path.join(nexusBranchDir, "current-stage.md");

  if (fsSync.existsSync(nexusBranchFeature)) {
    return {
      isBranchScoped: true,
      branchName,
      sanitizedBranch: sanitized,
      branchDir: nexusBranchDir,
      featureSpecPath: nexusBranchFeature,
      stagePath: fsSync.existsSync(nexusBranchStage) ? nexusBranchStage : defaultStagePath,
      findingsPath: defaultFindingsPath
    };
  }

  return {
    isBranchScoped: false,
    branchName,
    sanitizedBranch: sanitized,
    branchDir: null,
    featureSpecPath: defaultFeaturePath,
    stagePath: defaultStagePath,
    findingsPath: defaultFindingsPath
  };
}

/**
 * Initializes a branch-scoped context directory under devflow/context/<sanitized>/ (or .nexus/branches/)
 */
export async function initBranchContext(
  projectRoot: string,
  branchName: string,
  initialSpec?: string,
  useDevflowContextDir: boolean = true
): Promise<ActiveContextPaths> {
  const sanitized = sanitizeBranchName(branchName);
  const branchDir = useDevflowContextDir
    ? path.join(projectRoot, "devflow", "context", sanitized)
    : path.join(projectRoot, ".nexus", "branches", sanitized);

  await fs.mkdir(branchDir, { recursive: true });

  const featurePath = path.join(branchDir, "current-feature.md");
  const stagePath = path.join(branchDir, "current-stage.md");

  if (initialSpec) {
    await fs.writeFile(featurePath, initialSpec, "utf8");
  } else if (!fsSync.existsSync(featurePath)) {
    const defaultFeature = path.join(projectRoot, "devflow", "context", "current-feature.md");
    try {
      const baseline = await fs.readFile(defaultFeature, "utf8");
      await fs.writeFile(featurePath, baseline, "utf8");
    } catch {
      await fs.writeFile(
        featurePath,
        "# Current Feature\n\n_Nothing in progress. Run /feature, /fix, or /rollback to start._\n",
        "utf8"
      );
    }
  }

  if (!fsSync.existsSync(stagePath)) {
    const defaultStage = path.join(projectRoot, "devflow", "context", "current-stage.md");
    try {
      const baseline = await fs.readFile(defaultStage, "utf8");
      await fs.writeFile(stagePath, baseline, "utf8");
    } catch {
      await fs.writeFile(
        stagePath,
        `# Current Stage\n\n- Track: \`fast\`\n- Branch: \`${branchName}\`\n`,
        "utf8"
      );
    }
  }

  return {
    isBranchScoped: true,
    branchName,
    sanitizedBranch: sanitized,
    branchDir,
    featureSpecPath: featurePath,
    stagePath,
    findingsPath: path.join(projectRoot, "devflow", "context", "findings.md")
  };
}

/**
 * Cleans up branch-scoped context directories after completion.
 */
export async function cleanupBranchContext(
  projectRoot: string,
  branchName: string
): Promise<boolean> {
  const sanitized = sanitizeBranchName(branchName);
  const devflowBranchDir = path.join(projectRoot, "devflow", "context", sanitized);
  const nexusBranchDir = path.join(projectRoot, ".nexus", "branches", sanitized);

  let cleaned = false;

  try {
    if (fsSync.existsSync(devflowBranchDir)) {
      await fs.rm(devflowBranchDir, { recursive: true, force: true });
      cleaned = true;
    }
    if (fsSync.existsSync(nexusBranchDir)) {
      await fs.rm(nexusBranchDir, { recursive: true, force: true });
      cleaned = true;
    }
    return cleaned;
  } catch {
    return false;
  }
}

/**
 * Lists all active branch isolated contexts.
 */
export async function listBranchContexts(
  projectRoot: string
): Promise<Array<{ branch: string; path: string; hasSpec: boolean; type: "devflow" | "nexus" }>> {
  const results: Array<{ branch: string; path: string; hasSpec: boolean; type: "devflow" | "nexus" }> = [];
  const reservedDevflowDirs = new Set(["current-run", "findings.md", "current-feature.md", "current-stage.md", "coding-standards.md", "project-overview.md", "ai-interaction.md"]);

  // Scan devflow/context/
  const contextRoot = path.join(projectRoot, "devflow", "context");
  if (fsSync.existsSync(contextRoot)) {
    const entries = await fs.readdir(contextRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !reservedDevflowDirs.has(entry.name)) {
        const dirPath = path.join(contextRoot, entry.name);
        const specPath = path.join(dirPath, "current-feature.md");
        results.push({
          branch: entry.name,
          path: dirPath,
          hasSpec: fsSync.existsSync(specPath),
          type: "devflow"
        });
      }
    }
  }

  // Scan .nexus/branches/
  const nexusBranchesRoot = path.join(projectRoot, ".nexus", "branches");
  if (fsSync.existsSync(nexusBranchesRoot)) {
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
  }

  return results;
}
