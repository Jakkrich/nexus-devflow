import fs from "node:fs/promises";
import path from "node:path";

const DEVFLOW_MANIFEST_PATH = path.join("devflow", ".state", "manifest.json");
const BLUEPRINT_MANIFEST_PATH = path.join("blueprint", ".state", "manifest.json");

async function findProjectRoot(startPath: string = process.cwd()): Promise<string | null> {
  const resolvedStart = await fs.realpath(startPath);
  const stats = await fs.stat(resolvedStart);
  let currentDir = stats.isDirectory()
    ? resolvedStart
    : path.dirname(resolvedStart);

  while (true) {
    if (await isDevFlowProjectRoot(currentDir)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

async function isDevFlowProjectRoot(directory: string): Promise<boolean> {
  const devflowDir = path.join(directory, "devflow");
  const blueprintDir = path.join(directory, "blueprint");

  const hasDevFlowDir = await isDirectory(devflowDir);
  const hasBlueprintDir = await isDirectory(blueprintDir);

  if (!hasDevFlowDir && !hasBlueprintDir) {
    return false;
  }

  return (
    (await hasInstallManifest(directory)) ||
    (await isFile(path.join(directory, "AGENTS.md")))
  );
}

async function hasInstallManifest(directory: string): Promise<boolean> {
  const devflowStateDir = path.join(directory, "devflow", ".state");
  const blueprintStateDir = path.join(directory, "blueprint", ".state");

  if (
    (await isDirectory(devflowStateDir)) &&
    (await isFile(path.join(directory, DEVFLOW_MANIFEST_PATH)))
  ) {
    return true;
  }

  return (
    (await isDirectory(blueprintStateDir)) &&
    (await isFile(path.join(directory, BLUEPRINT_MANIFEST_PATH)))
  );
}

async function isDirectory(targetPath: string): Promise<boolean> {
  try {
    return (await fs.lstat(targetPath)).isDirectory();
  } catch (error: unknown) {
    const code = getErrorCode(error);

    if (code === "ENOENT" || code === "ENOTDIR") {
      return false;
    }

    throw error;
  }
}

async function isFile(targetPath: string): Promise<boolean> {
  try {
    return (await fs.lstat(targetPath)).isFile();
  } catch (error: unknown) {
    const code = getErrorCode(error);

    if (code === "ENOENT" || code === "ENOTDIR") {
      return false;
    }

    throw error;
  }
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : undefined;
}

export {
  findProjectRoot,
  isDevFlowProjectRoot
};
