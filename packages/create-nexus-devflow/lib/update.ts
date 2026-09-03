import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { type DevFlowRole, getSkillsForRole } from "./skill-manager.js";

export const CONTROL_DIR = ".nexus";
export const MANIFEST_PATH = `${CONTROL_DIR}/nexus-devflow.json`;
export const MANIFEST_SCHEMA_VERSION = 1;

export const MANAGED_ROOTS: Record<string, string[]> = {
  common: ["AGENTS.md", "CLAUDE.md", "devflow", "LICENSE"],
  codex: [".agents/skills"],
  copilot: [".agents/skills"],
  antigravity: [".agents/skills", ".agent/workflows"],
  opencode: [".agents/skills"],
  claude: [".claude/skills"]
};

export interface Manifest {
  schemaVersion: number;
  name: string;
  package: string;
  version: string;
  repository: string;
  artifactLanguage: string;
  adapters: string[];
  workspace: {
    contextDir: string;
    historyDir: string;
    referenceDir: string;
    runsDir: string;
    discoveriesDir: string;
  };
  lifecycle: {
    fastTrackStages: string[];
    mainlineStages: string[];
    companionCommands: string[];
  };
  managedFiles: Record<string, string>;
}

export interface TemplateFile {
  source: string;
  hash: string;
}

export interface Conflict {
  relativePath: string;
  reason: "symlink" | "not_file" | "customized";
  detail: string;
}

export interface PreparedUpdate {
  targetDir: string;
  templateRoot: string;
  previousManifest: Manifest | null;
  nextManifest: Manifest;
  activeAdapters: string[];
  templateFiles: Map<string, TemplateFile>;
  createList: string[];
  updateList: string[];
  conflictList: Conflict[];
  orphanedFiles: string[];
}

export function adapterListFromMode(adapter?: string): string[] {
  if (!adapter || adapter === "both" || adapter === "all") {
    return ["codex", "claude", "copilot", "antigravity", "opencode"];
  }

  if (adapter === "antigravity") {
    return ["antigravity", "codex"];
  }

  if (
    adapter === "codex" ||
    adapter === "claude" ||
    adapter === "copilot" ||
    adapter === "opencode"
  ) {
    return [adapter];
  }

  throw new Error(`Unknown adapter mode: ${adapter}`);
}

export function createManifest(
  version: string,
  adapters: Iterable<string>,
  templateFiles: Map<string, TemplateFile>
): Manifest {
  const managedFiles: Record<string, string> = {};

  for (const [relativePath, file] of [...templateFiles.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    managedFiles[relativePath] = file.hash;
  }

  return {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    name: "nexus-devflow",
    package: "@jakkrichm/create-nexus-devflow",
    version,
    repository: "https://github.com/Jakkrich/nexus-devflow",
    artifactLanguage: "th",
    adapters: [...adapters].sort(),
    workspace: {
      contextDir: "devflow/context",
      historyDir: "devflow/history",
      referenceDir: "devflow/reference",
      runsDir: "devflow/runs",
      discoveriesDir: "devflow/discoveries"
    },
    lifecycle: {
      fastTrackStages: [
        "feature",
        "fix",
        "implement",
        "check",
        "complete"
      ],
      mainlineStages: [
        "feature",
        "fix",
        "implement",
        "check",
        "complete"
      ],
      companionCommands: [
        "devflow",
        "doctor",
        "overview",
        "debug",
        "onboard",
        "adopt",
        "try",
        "rollback",
        "idea",
        "ci",
        "test",
        "autopilot",
        "prototype",
        "report-html",
        "brief",
        "audit",
        "release",
        "brainstorm",
        "grill"
      ]
    },
    managedFiles
  };
}

export async function collectManagedTemplateFiles(
  templateRoot: string,
  adapters: string[],
  role?: DevFlowRole
): Promise<Map<string, TemplateFile>> {
  const files = new Map<string, TemplateFile>();
  const roots = [
    ...MANAGED_ROOTS.common,
    ...adapters.flatMap((adapter) => MANAGED_ROOTS[adapter] || [])
  ];
  const allowedSkills = role ? new Set(getSkillsForRole(role)) : undefined;

  for (const relativeRoot of roots) {
    const sourceRoot = path.join(templateRoot, ...relativeRoot.split("/"));
    await collectSourceFiles(sourceRoot, relativeRoot, files, allowedSkills);
  }

  return files;
}

async function collectSourceFiles(
  sourcePath: string,
  relativePath: string,
  files: Map<string, TemplateFile>,
  allowedSkills?: Set<string>
): Promise<void> {
  try {
    const stats = await fs.lstat(sourcePath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Managed template path cannot be a symbolic link: ${relativePath}`);
    }

    if (stats.isDirectory()) {
      const match = relativePath.match(/^\.(?:agents|claude)\/skills\/([^/]+)$/);
      if (match && allowedSkills && !allowedSkills.has(match[1])) {
        return;
      }

      const children = (await fs.readdir(sourcePath)).sort();

      for (const child of children) {
        await collectSourceFiles(
          path.join(sourcePath, child),
          `${relativePath}/${child}`,
          files,
          allowedSkills
        );
      }

      return;
    }

    if (!stats.isFile()) {
      throw new Error(`Managed template path is not a regular file: ${relativePath}`);
    }

    files.set(relativePath, {
      source: sourcePath,
      hash: await hashFile(sourcePath)
    });
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw err;
  }
}

export async function readManifest(targetDir: string): Promise<Manifest | null> {
  const manifestFile = targetPath(targetDir, MANIFEST_PATH);
  await assertNoSymlinkParents(targetDir, MANIFEST_PATH);

  try {
    const content = await fs.readFile(manifestFile, "utf8");
    const data = JSON.parse(content) as Manifest;

    if (!data || data.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
      throw new Error("Unsupported manifest schema version.");
    }

    return data;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function prepareUpdate({
  targetDir,
  templateRoot,
  version,
  adapter,
  role
}: {
  targetDir: string;
  templateRoot: string;
  version: string;
  adapter?: string;
  role?: DevFlowRole;
}): Promise<PreparedUpdate> {
  const requestedAdapters = new Set(adapterListFromMode(adapter));
  const previousManifest = await readManifest(targetDir);

  const activeAdapters = new Set([
    ...requestedAdapters,
    ...(previousManifest?.adapters || [])
  ]);

  const templateFiles = await collectManagedTemplateFiles(
    templateRoot,
    [...activeAdapters],
    role
  );
  const nextManifest = createManifest(version, activeAdapters, templateFiles);

  const createList: string[] = [];
  const updateList: string[] = [];
  const conflictList: Conflict[] = [];

  for (const [relativePath, templateFile] of templateFiles) {
    await assertNoSymlinkParents(targetDir, relativePath);
    const targetFile = targetPath(targetDir, relativePath);

    let targetStats = null;
    try {
      targetStats = await fs.lstat(targetFile);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    if (!targetStats) {
      createList.push(relativePath);
      continue;
    }

    if (targetStats.isSymbolicLink()) {
      conflictList.push({
        relativePath,
        reason: "symlink",
        detail: "Target path is a symbolic link."
      });
      continue;
    }

    if (!targetStats.isFile()) {
      conflictList.push({
        relativePath,
        reason: "not_file",
        detail: "Target path exists but is not a regular file."
      });
      continue;
    }

    const currentHash = await hashFile(targetFile);
    if (currentHash === templateFile.hash) {
      continue;
    }

    const recordedHash = previousManifest?.managedFiles?.[relativePath];
    if (recordedHash && recordedHash === currentHash) {
      updateList.push(relativePath);
      continue;
    }

    conflictList.push({
      relativePath,
      reason: "customized",
      detail: recordedHash
        ? "File was modified locally since last install."
        : "File exists in project and differs from template."
    });
  }

  const orphanedFiles: string[] = [];
  if (previousManifest) {
    for (const [relativePath, recordedHash] of Object.entries(
      previousManifest.managedFiles
    )) {
      if (templateFiles.has(relativePath)) {
        continue;
      }

      await assertNoSymlinkParents(targetDir, relativePath);
      const targetFile = targetPath(targetDir, relativePath);

      let targetStats = null;
      try {
        targetStats = await fs.lstat(targetFile);
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }

      if (!targetStats || !targetStats.isFile()) {
        continue;
      }

      const currentHash = await hashFile(targetFile);
      if (currentHash === recordedHash) {
        orphanedFiles.push(relativePath);
      }
    }
  }

  return {
    targetDir,
    templateRoot,
    previousManifest,
    nextManifest,
    activeAdapters: [...activeAdapters].sort(),
    templateFiles,
    createList,
    updateList,
    conflictList,
    orphanedFiles
  };
}

export interface ApplyUpdateOptions {
  replaceConflicts?: boolean;
  now?: () => Date;
}

export interface ApplyUpdateResult {
  appliedCount: number;
  removedCount: number;
  backupDir: string | null;
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z").replaceAll(":", "-");
}

function sanitizeSegment(value: string): string {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function writeControlIgnore(targetDir: string): Promise<void> {
  const ignoreFile = targetPath(targetDir, `${CONTROL_DIR}/.gitignore`);
  await assertNoSymlinkParents(targetDir, `${CONTROL_DIR}/.gitignore`);
  await fs.mkdir(path.dirname(ignoreFile), { recursive: true });
  await fs.writeFile(ignoreFile, "backups/\nstaging/\n", "utf8");
}

export async function applyPreparedUpdate(
  prepared: PreparedUpdate,
  { replaceConflicts = false, now = () => new Date() }: ApplyUpdateOptions = {}
): Promise<ApplyUpdateResult> {
  if (prepared.conflictList.length > 0 && !replaceConflicts) {
    throw new Error(
      `Cannot apply update with ${prepared.conflictList.length} conflict(s). Pass force/replace option or resolve conflicts.`
    );
  }

  const replacements = [
    ...prepared.updateList,
    ...(replaceConflicts ? prepared.conflictList.map((item) => item.relativePath) : [])
  ];
  const removals = prepared.orphanedFiles;
  const existingOperations = [...replacements, ...removals];

  const previousVersion = prepared.previousManifest?.version || "legacy";
  const nextVersion = prepared.nextManifest.version;
  const identifier = `${formatTimestamp(now())}-${sanitizeSegment(
    previousVersion
  )}-to-${sanitizeSegment(nextVersion)}-${crypto.randomBytes(4).toString("hex")}`;

  const backupDir = existingOperations.length > 0
    ? targetPath(prepared.targetDir, `${CONTROL_DIR}/backups/${identifier}`)
    : null;
  const stagingDir = targetPath(prepared.targetDir, `${CONTROL_DIR}/staging/${identifier}`);
  const previousManifestFile = targetPath(prepared.targetDir, MANIFEST_PATH);

  const writeTargets = [...prepared.createList, ...replacements];
  await fs.mkdir(stagingDir, { recursive: true });

  for (const relativePath of writeTargets) {
    const templateFile = prepared.templateFiles.get(relativePath);
    if (!templateFile) continue;

    const stageFile = path.join(stagingDir, ...relativePath.split("/"));
    await fs.mkdir(path.dirname(stageFile), { recursive: true });
    await fs.copyFile(templateFile.source, stageFile);

    if ((await hashFile(stageFile)) !== templateFile.hash) {
      throw new Error(`Template file changed during staging: ${relativePath}`);
    }
  }

  if (backupDir) {
    for (const relativePath of existingOperations) {
      const backupFile = path.join(backupDir, "files", ...relativePath.split("/"));
      await fs.mkdir(path.dirname(backupFile), { recursive: true });
      const sourceFile = targetPath(prepared.targetDir, relativePath);
      try {
        await fs.copyFile(sourceFile, backupFile);
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
    }

    try {
      await fs.copyFile(previousManifestFile, path.join(backupDir, "nexus-devflow.json"));
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    await fs.mkdir(backupDir, { recursive: true });
    await fs.writeFile(
      path.join(backupDir, "backup.json"),
      `${JSON.stringify(
        {
          fromVersion: previousVersion,
          toVersion: nextVersion,
          replaced: replacements,
          removed: removals
        },
        null,
        2
      )}\n`,
      "utf8"
    );
  }

  let appliedCount = 0;
  let removedCount = 0;

  try {
    for (const relativePath of writeTargets) {
      const stageFile = path.join(stagingDir, ...relativePath.split("/"));
      await copyFileAtomic(prepared.targetDir, relativePath, stageFile);
      appliedCount++;
    }

    for (const relativePath of removals) {
      const fileToRemove = targetPath(prepared.targetDir, relativePath);
      try {
        await fs.unlink(fileToRemove);
        removedCount++;
        await cleanEmptyParentDirectories(prepared.targetDir, fileToRemove);
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
    }

    await writeInstallManifest(prepared.targetDir, prepared.nextManifest);
    await writeControlIgnore(prepared.targetDir);
  } catch (error: unknown) {
    try {
      for (const relativePath of prepared.createList) {
        const fileToRemove = targetPath(prepared.targetDir, relativePath);
        try {
          await fs.unlink(fileToRemove);
        } catch { }
      }

      if (backupDir) {
        for (const relativePath of existingOperations) {
          const backupFile = path.join(backupDir, "files", ...relativePath.split("/"));
          try {
            await copyFileAtomic(prepared.targetDir, relativePath, backupFile);
          } catch { }
        }
      }

      if (prepared.previousManifest) {
        await writeInstallManifest(prepared.targetDir, prepared.previousManifest);
      } else {
        try {
          await fs.unlink(previousManifestFile);
        } catch { }
      }
    } catch (rollbackError: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const rbMsg = rollbackError instanceof Error ? rollbackError.message : String(rollbackError);
      throw new Error(`Update failed: ${msg}. Rollback also failed: ${rbMsg}`);
    }

    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Update failed and was rolled back: ${msg}`);
  } finally {
    await fs.rm(stagingDir, { recursive: true, force: true });
  }

  return {
    appliedCount,
    removedCount,
    backupDir
  };
}

export async function cleanEmptyParentDirectories(targetDir: string, filePath: string): Promise<void> {
  let parentDir = path.dirname(filePath);
  const resolvedTarget = path.resolve(targetDir);

  while (parentDir !== resolvedTarget && parentDir.startsWith(resolvedTarget)) {
    try {
      const entries = await fs.readdir(parentDir);
      if (entries.length === 0) {
        await fs.rmdir(parentDir);
        parentDir = path.dirname(parentDir);
      } else {
        break;
      }
    } catch {
      break;
    }
  }
}

export async function writeInstallManifest(targetDir: string, manifest: Manifest): Promise<void> {
  const manifestFile = targetPath(targetDir, MANIFEST_PATH);
  await fs.mkdir(path.dirname(manifestFile), { recursive: true });
  await fs.writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeControlIgnore(targetDir);
}

export async function copyFileAtomic(
  targetDir: string,
  relativePath: string,
  sourcePath: string
): Promise<void> {
  await assertNoSymlinkParents(targetDir, relativePath);
  const destinationPath = targetPath(targetDir, relativePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  const tempPath = `${destinationPath}.tmp-${process.pid}-${Date.now()}`;
  await fs.copyFile(sourcePath, tempPath);
  await fs.rename(tempPath, destinationPath);
}

export function targetPath(targetDir: string, relativePath: string): string {
  return path.resolve(targetDir, ...relativePath.split("/"));
}

export async function assertNoSymlinkParents(targetDir: string, relativePath: string): Promise<void> {
  const parts = relativePath.split("/");
  let current = path.resolve(targetDir);

  for (let i = 0; i < parts.length - 1; i++) {
    current = path.join(current, parts[i]);
    try {
      const stats = await fs.lstat(current);
      if (stats.isSymbolicLink()) {
        throw new Error(
          `Target sub-path "${parts.slice(0, i + 1).join("/")}" is a symbolic link.`
        );
      }
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        break;
      }
      throw error;
    }
  }
}

export async function hashFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}
