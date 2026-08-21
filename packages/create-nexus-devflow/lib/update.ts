import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const CONTROL_DIR = ".nexus";
export const MANIFEST_PATH = `${CONTROL_DIR}/nexus-devflow.json`;
export const MANIFEST_SCHEMA_VERSION = 1;

export const MANAGED_ROOTS: Record<string, string[]> = {
  common: ["AGENTS.md", "CLAUDE.md", "devflow", "LICENSE"],
  codex: [".agents/skills"],
  copilot: [".agents/skills"],
  antigravity: [".agents/skills", ".agent/workflows"],
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
    return ["codex", "claude", "copilot"];
  }

  if (adapter === "antigravity") {
    return ["codex"];
  }

  if (adapter === "codex" || adapter === "claude" || adapter === "copilot") {
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
      mainlineStages: [
        "00-discover",
        "10-define",
        "20-spec",
        "30-plan",
        "40-execute",
        "50-verify",
        "60-report",
        "70-release"
      ],
      companionCommands: [
        "feature",
        "fix",
        "implement",
        "check",
        "complete",
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
        "brief"
      ]
    },
    managedFiles
  };
}

export async function collectManagedTemplateFiles(
  templateRoot: string,
  adapters: string[]
): Promise<Map<string, TemplateFile>> {
  const files = new Map<string, TemplateFile>();
  const roots = [
    ...MANAGED_ROOTS.common,
    ...adapters.flatMap((adapter) => MANAGED_ROOTS[adapter] || [])
  ];

  for (const relativeRoot of roots) {
    const sourceRoot = path.join(templateRoot, ...relativeRoot.split("/"));
    await collectSourceFiles(sourceRoot, relativeRoot, files);
  }

  return files;
}

async function collectSourceFiles(
  sourcePath: string,
  relativePath: string,
  files: Map<string, TemplateFile>
): Promise<void> {
  try {
    const stats = await fs.lstat(sourcePath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Managed template path cannot be a symbolic link: ${relativePath}`);
    }

    if (stats.isDirectory()) {
      const children = (await fs.readdir(sourcePath)).sort();

      for (const child of children) {
        await collectSourceFiles(
          path.join(sourcePath, child),
          `${relativePath}/${child}`,
          files
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
  adapter
}: {
  targetDir: string;
  templateRoot: string;
  version: string;
  adapter?: string;
}): Promise<PreparedUpdate> {
  const requestedAdapters = new Set(adapterListFromMode(adapter));
  const previousManifest = await readManifest(targetDir);

  const activeAdapters = new Set([
    ...requestedAdapters,
    ...(previousManifest?.adapters || [])
  ]);

  const templateFiles = await collectManagedTemplateFiles(
    templateRoot,
    [...activeAdapters]
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

export async function applyPreparedUpdate(
  prepared: PreparedUpdate,
  { replaceConflicts = false }: { replaceConflicts?: boolean } = {}
): Promise<{ appliedCount: number; removedCount: number }> {
  if (prepared.conflictList.length > 0 && !replaceConflicts) {
    throw new Error(
      `Cannot apply update with ${prepared.conflictList.length} conflict(s). Pass force/replace option or resolve conflicts.`
    );
  }

  const writeTargets = [
    ...prepared.createList,
    ...prepared.updateList,
    ...(replaceConflicts ? prepared.conflictList.map((item) => item.relativePath) : [])
  ];

  let appliedCount = 0;
  for (const relativePath of writeTargets) {
    const templateFile = prepared.templateFiles.get(relativePath);
    if (!templateFile) {
      continue;
    }

    await copyFileAtomic(prepared.targetDir, relativePath, templateFile.source);
    appliedCount++;
  }

  let removedCount = 0;
  for (const relativePath of prepared.orphanedFiles) {
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

  return {
    appliedCount,
    removedCount
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
