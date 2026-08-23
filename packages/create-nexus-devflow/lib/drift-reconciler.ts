import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { resolveActiveContextPaths } from "./branch-context.js";
import { readGitStatus } from "./git-status.js";

export interface GitDriftReport {
  hasDrift: boolean;
  undocumentedFiles: string[];
  phantomFiles: string[];
  matchedFiles: string[];
  gitModifiedFiles: string[];
  specFiles: string[];
  stageDrift: {
    isDrifted: boolean;
    activeBranch: string | null;
    stageRunningId: string | null;
  };
}

export interface ReconcileResult {
  reconciled: boolean;
  addedFiles: string[];
  healedStage: boolean;
  message: string;
}

const IGNORED_DRIFT_PATTERNS = [
  /devflow\/context\/current-feature\.md$/i,
  /devflow\/context\/current-stage\.md$/i,
  /devflow\/history\//i,
  /devflow\/runs\//i,
  /devflow\/discoveries\//i,
  /\.gitignore$/i,
  /\.nexus\//i,
  /\.agents\//i,
  /\.claude\//i,
  /node_modules\//i,
  /dist\//i,
  /package-lock\.json$/i
];

/**
 * Normalizes file path to forward slashes relative to workspace root.
 */
export function normalizeRelativePath(projectRoot: string, filePath: string): string {
  const relative = path.isAbsolute(filePath)
    ? path.relative(projectRoot, filePath)
    : filePath;
  return relative.replace(/\\/g, "/").replace(/^\.\//, "");
}

/**
 * Parses the "Files to Modify/Create" section from a living spec markdown.
 */
export function parseSpecFilesList(specContent: string): string[] {
  const files: string[] = [];
  const lines = specContent.split("\n");
  let inFilesSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/Files\s+to\s+Modify\/Create/i.test(trimmed)) {
      inFilesSection = true;
      continue;
    }

    if (inFilesSection) {
      // Exit if next major section, horizontal rule, or next main bold bullet in Plan (e.g. - **Test Decision**:)
      if (/^##+\s+/.test(trimmed) || /^-\s+\*\*[^*]+\*\*:/i.test(trimmed) || trimmed.startsWith("---")) {
        inFilesSection = false;
        continue;
      }

      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Extract backtick path `path/to/file.ext` or direct path
        const match = trimmed.match(/`([^`]+)`/) || trimmed.match(/^[*-]\s+(?:\[[ x]\]\s+)?([a-zA-Z0-9_./\\-]+\.[a-zA-Z0-9]+)/);
        if (match && match[1]) {
          const clean = match[1].trim().replace(/\\/g, "/");
          // Ensure it looks like a valid file path with extension
          if (/\.[a-zA-Z0-9_-]+$/.test(clean) && !clean.startsWith("http")) {
            files.push(clean);
          }
        }
      }
    }
  }

  return Array.from(new Set(files));
}


/**
 * Detects git drift between modified repository files and spec declaration.
 */
export async function detectGitDrift(
  projectRoot: string,
  explicitBranch?: string
): Promise<GitDriftReport> {
  const contextPaths = await resolveActiveContextPaths(projectRoot, explicitBranch);
  const gitStatus = await readGitStatus(projectRoot);

  let specFiles: string[] = [];
  let stageRunningId: string | null = null;

  if (fsSync.existsSync(contextPaths.featureSpecPath)) {
    const specContent = await fs.readFile(contextPaths.featureSpecPath, "utf8");
    specFiles = parseSpecFilesList(specContent);
  }

  if (fsSync.existsSync(contextPaths.stagePath)) {
    const stageContent = await fs.readFile(contextPaths.stagePath, "utf8");
    const match = stageContent.match(/Active Running ID:\s*`?([a-zA-Z0-9_-]+)`?/i);
    if (match) stageRunningId = match[1];
  }

  // Collect git changed files
  const rawGitFiles: string[] = [];
  if (gitStatus.available) {
    if (gitStatus.changedFiles && Array.isArray(gitStatus.changedFiles)) {
      rawGitFiles.push(...gitStatus.changedFiles);
    }
  }

  // Filter out ignored/transient files
  const gitModifiedFiles = rawGitFiles
    .map((f) => normalizeRelativePath(projectRoot, f))
    .filter((f) => !IGNORED_DRIFT_PATTERNS.some((p) => p.test(f)));

  const normalizedSpecFiles = specFiles.map((f) => normalizeRelativePath(projectRoot, f));

  const undocumentedFiles = gitModifiedFiles.filter(
    (gf) => !normalizedSpecFiles.some((sf) => sf === gf || gf.endsWith(sf) || sf.endsWith(gf))
  );

  const phantomFiles = normalizedSpecFiles.filter(
    (sf) => !gitModifiedFiles.some((gf) => gf === sf || gf.endsWith(sf) || sf.endsWith(gf))
  );

  const matchedFiles = gitModifiedFiles.filter(
    (gf) => normalizedSpecFiles.some((sf) => sf === gf || gf.endsWith(sf) || sf.endsWith(gf))
  );

  const isStageDrifted = Boolean(
    gitStatus.branch &&
    stageRunningId &&
    stageRunningId !== "None" &&
    !gitStatus.branch.includes(stageRunningId) &&
    !stageRunningId.includes(gitStatus.branch)
  );

  const hasDrift = undocumentedFiles.length > 0 || isStageDrifted;

  return {
    hasDrift,
    undocumentedFiles,
    phantomFiles,
    matchedFiles,
    gitModifiedFiles,
    specFiles: normalizedSpecFiles,
    stageDrift: {
      isDrifted: isStageDrifted,
      activeBranch: gitStatus.branch || null,
      stageRunningId
    }
  };
}

/**
 * Automatically reconciles and synchronizes living spec and stage file.
 */
export async function reconcileState(
  projectRoot: string,
  options: { autoAddUndocumented?: boolean; healStage?: boolean } = { autoAddUndocumented: true, healStage: true }
): Promise<ReconcileResult> {
  const drift = await detectGitDrift(projectRoot);
  const contextPaths = await resolveActiveContextPaths(projectRoot);

  const addedFiles: string[] = [];
  let healedStage = false;

  // 1. Reconcile Undocumented Files into current-feature.md
  if (options.autoAddUndocumented && drift.undocumentedFiles.length > 0 && fsSync.existsSync(contextPaths.featureSpecPath)) {
    const specContent = await fs.readFile(contextPaths.featureSpecPath, "utf8");
    const lines = specContent.split("\n");
    const targetIdx = lines.findIndex((l) => /Files\s+to\s+Modify\/Create/i.test(l));

    if (targetIdx !== -1) {
      const newEntries = drift.undocumentedFiles.map(
        (f) => `  - \`${f}\` (Auto-reconciled from Git changes)`
      );
      lines.splice(targetIdx + 1, 0, ...newEntries);
      await fs.writeFile(contextPaths.featureSpecPath, lines.join("\n"), "utf8");
      addedFiles.push(...drift.undocumentedFiles);
    }
  }

  // 2. Heal current-stage.md if drifted
  if (options.healStage && drift.stageDrift.isDrifted && drift.stageDrift.activeBranch && fsSync.existsSync(contextPaths.stagePath)) {
    const stageContent = await fs.readFile(contextPaths.stagePath, "utf8");
    const cleanBranch = drift.stageDrift.activeBranch.replace(/^(feature|fix|chore)\//, "");
    const updatedStage = stageContent.replace(
      /Active Running ID:\s*`?[^`\n]+`?/i,
      `Active Running ID: \`${cleanBranch}\``
    );
    await fs.writeFile(contextPaths.stagePath, updatedStage, "utf8");
    healedStage = true;
  }

  const reconciled = addedFiles.length > 0 || healedStage;
  const message = reconciled
    ? `Reconciliation complete: Added ${addedFiles.length} undocumented file(s) to spec, stage healed: ${healedStage}`
    : "No drift detected or nothing to reconcile.";

  return {
    reconciled,
    addedFiles,
    healedStage,
    message
  };
}
