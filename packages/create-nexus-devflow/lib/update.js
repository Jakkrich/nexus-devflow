const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

const CONTROL_DIR = ".nexus";
const MANIFEST_PATH = `${CONTROL_DIR}/nexus-devflow.json`;
const MANIFEST_SCHEMA_VERSION = 1;
const MANAGED_ROOTS = {
  common: ["AGENTS.md", "CLAUDE.md", "devflow", "LICENSE"],
  codex: [".agents/skills"],
  antigravity: [".agents/skills", ".agent/workflows"],
  claude: [".claude/skills"]
};

function adapterListFromMode(adapter) {
  if (adapter === "both" || adapter === "all") {
    return ["codex", "claude"];
  }

  if (adapter === "antigravity") {
    return ["codex"];
  }

  if (adapter === "codex" || adapter === "claude") {
    return [adapter];
  }

  throw new Error(`Unknown adapter mode: ${adapter}`);
}

function createManifest(version, adapters, templateFiles) {
  const managedFiles = {};

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
        "40-implement",
        "50-verify",
        "60-report",
        "70-release"
      ],
      companionCommands: [
        "goal",
        "brainstorm",
        "research",
        "debug",
        "prd",
        "issue-triage",
        "security-review",
        "check-for-updates",
        "help"
      ]
    },
    managedFiles
  };
}

async function collectManagedTemplateFiles(templateRoot, adapters) {
  const files = new Map();
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

async function collectSourceFiles(sourcePath, relativePath, files) {
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
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }
    throw err;
  }
}

async function readManifest(targetDir) {
  const manifestFile = targetPath(targetDir, MANIFEST_PATH);
  await assertNoSymlinkParents(targetDir, MANIFEST_PATH);

  try {
    const content = await fs.readFile(manifestFile, "utf8");
    const data = JSON.parse(content);

    if (!data || data.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
      throw new Error("Unsupported manifest schema version.");
    }

    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function prepareUpdate({ targetDir, templateRoot, version, adapter }) {
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

  const createList = [];
  const updateList = [];
  const conflictList = [];

  for (const [relativePath, templateFile] of templateFiles) {
    await assertNoSymlinkParents(targetDir, relativePath);
    const targetFile = targetPath(targetDir, relativePath);

    let targetStats = null;
    try {
      targetStats = await fs.lstat(targetFile);
    } catch (error) {
      if (error.code !== "ENOENT") {
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

  const orphanedFiles = [];
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
      } catch (error) {
        if (error.code !== "ENOENT") {
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

async function applyPreparedUpdate(prepared, { replaceConflicts = false } = {}) {
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

      let parentDir = path.dirname(fileToRemove);
      while (parentDir !== prepared.targetDir && parentDir.startsWith(prepared.targetDir)) {
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
    } catch (error) {
      if (error.code !== "ENOENT") {
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

async function writeInstallManifest(targetDir, manifest) {
  const manifestFile = targetPath(targetDir, MANIFEST_PATH);
  await fs.mkdir(path.dirname(manifestFile), { recursive: true });
  await fs.writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function copyFileAtomic(targetDir, relativePath, sourcePath) {
  await assertNoSymlinkParents(targetDir, relativePath);
  const destinationPath = targetPath(targetDir, relativePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  const tempPath = `${destinationPath}.tmp-${process.pid}-${Date.now()}`;
  await fs.copyFile(sourcePath, tempPath);
  await fs.rename(tempPath, destinationPath);
}

function targetPath(targetDir, relativePath) {
  return path.resolve(targetDir, ...relativePath.split("/"));
}

async function assertNoSymlinkParents(targetDir, relativePath) {
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
    } catch (error) {
      if (error.code === "ENOENT") {
        break;
      }
      throw error;
    }
  }
}

async function hashFile(filePath) {
  const content = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

module.exports = {
  CONTROL_DIR,
  MANIFEST_PATH,
  adapterListFromMode,
  applyPreparedUpdate,
  createManifest,
  prepareUpdate,
  readManifest,
  writeInstallManifest
};
