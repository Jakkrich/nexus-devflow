import fs from "node:fs/promises";
import path from "node:path";
import { findProjectRoot } from "./project-root.js";

export interface UninstallOptions {
  targetDir: string;
  keepHistory?: boolean;
}

export interface PreparedUninstall {
  targetDir: string;
  projectRoot: string | null;
  itemsToDelete: string[];
  totalFiles: number;
  totalDirectories: number;
}

export interface ApplyUninstallResult {
  deletedCount: number;
  deletedItems: string[];
  success: boolean;
}

const KNOWN_DEVFLOW_ROOT_FILES = [
  "AGENTS.md",
  "CLAUDE.md"
];

const KNOWN_DEVFLOW_DIRECTORIES = [
  ".agents",
  ".claude",
  ".nexus",
  "devflow",
  "blueprint"
];

export async function prepareUninstall(options: UninstallOptions): Promise<PreparedUninstall> {
  const targetDir = path.resolve(process.cwd(), options.targetDir || ".");
  const projectRoot = await findProjectRoot(targetDir).catch(() => null);
  const rootDir = projectRoot || targetDir;

  const itemsToDelete: string[] = [];
  let totalFiles = 0;
  let totalDirectories = 0;

  // 1. Check known root files
  for (const file of KNOWN_DEVFLOW_ROOT_FILES) {
    const fullPath = path.join(rootDir, file);
    if (await fileExists(fullPath)) {
      itemsToDelete.push(file);
      totalFiles++;
    }
  }

  // 2. Check known root directories
  for (const dir of KNOWN_DEVFLOW_DIRECTORIES) {
    const fullPath = path.join(rootDir, dir);
    if (await directoryExists(fullPath)) {
      if (options.keepHistory && dir === "devflow") {
        // Special case: keep devflow/history/
        const subItems = await fs.readdir(fullPath);
        for (const sub of subItems) {
          if (sub === "history") continue;
          const subFullPath = path.join(fullPath, sub);
          const relPath = path.join(dir, sub);
          itemsToDelete.push(relPath);
          const stats = await countItemsRecursive(subFullPath);
          totalFiles += stats.files;
          totalDirectories += stats.directories + 1;
        }
      } else {
        itemsToDelete.push(dir);
        const stats = await countItemsRecursive(fullPath);
        totalFiles += stats.files;
        totalDirectories += stats.directories + 1;
      }
    }
  }

  return {
    targetDir: rootDir,
    projectRoot,
    itemsToDelete,
    totalFiles,
    totalDirectories
  };
}

export async function applyUninstall(
  prepared: PreparedUninstall,
  options: { dryRun?: boolean } = {}
): Promise<ApplyUninstallResult> {
  const deletedItems: string[] = [];

  if (options.dryRun) {
    return {
      deletedCount: prepared.itemsToDelete.length,
      deletedItems: [...prepared.itemsToDelete],
      success: true
    };
  }

  for (const item of prepared.itemsToDelete) {
    const fullPath = path.join(prepared.targetDir, item);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
      deletedItems.push(item);
    } catch {
      // Ignore if already removed or inaccessible
    }
  }

  return {
    deletedCount: deletedItems.length,
    deletedItems,
    success: true
  };
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(targetPath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function directoryExists(targetPath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(targetPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function countItemsRecursive(dirPath: string): Promise<{ files: number; directories: number }> {
  let files = 0;
  let directories = 0;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        directories++;
        const sub = await countItemsRecursive(path.join(dirPath, entry.name));
        files += sub.files;
        directories += sub.directories;
      } else if (entry.isFile()) {
        files++;
      }
    }
  } catch {
    // Ignore read errors
  }

  return { files, directories };
}
