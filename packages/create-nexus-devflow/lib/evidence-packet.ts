import fs from "node:fs/promises";
import path from "node:path";

export interface EvidenceArtifact {
  relativePath: string;
  bytes: number;
}

export interface RunEvidenceSummary {
  runId: string | null;
  reportDir: string | null;
  present: boolean;
  artifactCount: number;
  totalBytes: number;
  artifacts: EvidenceArtifact[];
  warnings: string[];
}

export type VerifyDriverState = "ready" | "incomplete" | "absent" | "unsafe";

export interface VerifyDriverSummary {
  state: VerifyDriverState;
  skillPath: string | null;
  missingSections: string[];
  warning: string | null;
}

const VALID_RUN_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const MAX_REPORT_DEPTH = 3;
const REQUIRED_VERIFY_SECTIONS = [
  "Launch",
  "Doctor",
  "Drive",
  "Evidence",
  "Cleanup"
] as const;

type AncestorDirCheck = "ok" | "missing" | "unsafe";

async function checkDirectoryNoSymlink(absPath: string): Promise<AncestorDirCheck> {
  try {
    const stats = await fs.lstat(absPath);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      return "unsafe";
    }
    return "ok";
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";
    if (code === "ENOENT") {
      return "missing";
    }
    return "unsafe";
  }
}

/**
 * Inspects `devflow/reports/<runId>/` for non-empty regular proof artifacts.
 * Rejects invalid run IDs, path traversal, and symlinks via `lstat`.
 */
export async function inspectRunEvidence(
  projectRoot: string,
  runId: string | null
): Promise<RunEvidenceSummary> {
  if (!runId) {
    return emptyEvidence(null, null);
  }

  const trimmed = runId.trim();
  if (!VALID_RUN_ID_PATTERN.test(trimmed) || trimmed.includes("..")) {
    return emptyEvidence(trimmed, null, [
      `Run ID '${trimmed}' contains invalid path characters.`
    ]);
  }

  const resolvedRoot = path.resolve(projectRoot);
  const relDir = path.posix.join("devflow", "reports", trimmed);

  const ancestorPairs: ReadonlyArray<readonly [string, string]> = [
    [path.join(resolvedRoot, "devflow"), "devflow"],
    [path.join(resolvedRoot, "devflow", "reports"), "devflow/reports"],
    [path.join(resolvedRoot, "devflow", "reports", trimmed), relDir]
  ];

  for (const [absAncestor, relAncestor] of ancestorPairs) {
    const status = await checkDirectoryNoSymlink(absAncestor);
    if (status === "missing") {
      return emptyEvidence(trimmed, relDir);
    }
    if (status === "unsafe") {
      return emptyEvidence(trimmed, relDir, [
        `Report path '${relAncestor}' is a symlink or non-directory and was refused.`
      ]);
    }
  }

  const absDir = ancestorPairs[2][0];
  const artifacts: EvidenceArtifact[] = [];
  const warnings: string[] = [];
  await collectArtifactsRecursive(absDir, absDir, 0, artifacts, warnings);
  artifacts.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const totalBytes = artifacts.reduce((sum, item) => sum + item.bytes, 0);
  return {
    runId: trimmed,
    reportDir: relDir,
    present: artifacts.length > 0,
    artifactCount: artifacts.length,
    totalBytes,
    artifacts,
    warnings
  };
}

/**
 * Inspects installed adapter trees for a project-local `verify` or `verify-*`
 * driver skill containing Launch, Doctor, Drive, Evidence, and Cleanup sections.
 */
export async function inspectVerifyDriverSkill(
  projectRoot: string
): Promise<VerifyDriverSummary> {
  const resolvedRoot = path.resolve(projectRoot);
  const adapterRoots = [".agents", ".claude"] as const;

  for (const adapter of adapterRoots) {
    const adapterDir = path.join(resolvedRoot, adapter);
    const adapterStatus = await checkDirectoryNoSymlink(adapterDir);
    if (adapterStatus === "missing") {
      continue;
    }
    if (adapterStatus === "unsafe") {
      return {
        state: "unsafe",
        skillPath: adapter,
        missingSections: [...REQUIRED_VERIFY_SECTIONS],
        warning: `Adapter directory '${adapter}' is a symbolic link or non-directory and was refused.`
      };
    }

    const skillsDir = path.join(adapterDir, "skills");
    const skillsDirStatus = await checkDirectoryNoSymlink(skillsDir);
    if (skillsDirStatus === "missing") {
      continue;
    }
    if (skillsDirStatus === "unsafe") {
      return {
        state: "unsafe",
        skillPath: `${adapter}/skills`,
        missingSections: [...REQUIRED_VERIFY_SECTIONS],
        warning: `Skills directory '${adapter}/skills' is a symbolic link or non-directory and was refused.`
      };
    }

    let entries;
    try {
      entries = await fs.readdir(skillsDir, { withFileTypes: true });
    } catch {
      continue;
    }

    const candidates = entries
      .filter((entry) => entry.name === "verify" || entry.name.startsWith("verify-"))
      .sort((a, b) => {
        if (a.name === "verify") return -1;
        if (b.name === "verify") return 1;
        return a.name.localeCompare(b.name);
      });

    for (const candidate of candidates) {
      const relSkill = path.posix.join(adapter, "skills", candidate.name, "SKILL.md");
      const absCandidateDir = path.join(skillsDir, candidate.name);
      const absSkill = path.join(absCandidateDir, "SKILL.md");

      try {
        const dirStats = await fs.lstat(absCandidateDir);
        if (dirStats.isSymbolicLink()) {
          return {
            state: "unsafe",
            skillPath: relSkill,
            missingSections: [...REQUIRED_VERIFY_SECTIONS],
            warning: `Verification driver directory '${adapter}/skills/${candidate.name}' is a symbolic link and was refused.`
          };
        }
        if (!dirStats.isDirectory()) {
          continue;
        }

        const skillStats = await fs.lstat(absSkill);
        if (skillStats.isSymbolicLink()) {
          return {
            state: "unsafe",
            skillPath: relSkill,
            missingSections: [...REQUIRED_VERIFY_SECTIONS],
            warning: `Verification driver '${relSkill}' is a symbolic link and was refused.`
          };
        }
        if (!skillStats.isFile()) {
          continue;
        }

        const content = await fs.readFile(absSkill, "utf8");
        const missingSections = REQUIRED_VERIFY_SECTIONS.filter((section) => {
          const pattern = new RegExp(`^##\\s+${section}\\b`, "im");
          return !pattern.test(content);
        });

        if (missingSections.length > 0) {
          return {
            state: "incomplete",
            skillPath: relSkill,
            missingSections: [...missingSections],
            warning: `Verification driver '${relSkill}' is missing section(s): ${missingSections.join(", ")}.`
          };
        }

        return {
          state: "ready",
          skillPath: relSkill,
          missingSections: [],
          warning: null
        };
      } catch {
        continue;
      }
    }
  }

  return {
    state: "absent",
    skillPath: null,
    missingSections: [],
    warning: null
  };
}

async function collectArtifactsRecursive(
  baseDir: string,
  currentDir: string,
  depth: number,
  artifacts: EvidenceArtifact[],
  warnings: string[]
): Promise<void> {
  if (depth > MAX_REPORT_DEPTH) {
    return;
  }

  let entries;
  try {
    entries = await fs.readdir(currentDir, { withFileTypes: true });
  } catch (error: unknown) {
    const rel = path.relative(baseDir, currentDir).replace(/\\/g, "/") || ".";
    const detail = error instanceof Error ? error.message : String(error);
    warnings.push(`Unreadable report directory '${rel}' (${detail}).`);
    return;
  }

  for (const entry of entries) {
    if (entry.name === ".gitkeep") {
      continue;
    }

    const fullPath = path.join(currentDir, entry.name);
    let stats;
    try {
      stats = await fs.lstat(fullPath);
    } catch {
      continue;
    }

    if (stats.isSymbolicLink()) {
      const rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      warnings.push(`Skipped symlink artifact '${rel}'.`);
      continue;
    }

    if (stats.isDirectory()) {
      await collectArtifactsRecursive(baseDir, fullPath, depth + 1, artifacts, warnings);
      continue;
    }

    if (stats.isFile() && stats.size > 0) {
      artifacts.push({
        relativePath: path.relative(baseDir, fullPath).replace(/\\/g, "/"),
        bytes: stats.size
      });
    }
  }
}

function emptyEvidence(
  runId: string | null,
  reportDir: string | null,
  warnings: string[] = []
): RunEvidenceSummary {
  return {
    runId,
    reportDir,
    present: false,
    artifactCount: 0,
    totalBytes: 0,
    artifacts: [],
    warnings
  };
}
