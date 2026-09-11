import fs from "node:fs/promises";
import path from "node:path";

export interface WorkspacePaths {
  contextDir: string;
  ideationDir: string;
  discoveryDir: string;
  planningDir: string;
  tasksDir: string;
  historyDir: string;
  docsDir: string;
  referenceDir: string;
  isDecadeNumbered: boolean;
}

export const LEGACY_WORKSPACE_PATHS: WorkspacePaths = {
  contextDir: "devflow/context",
  ideationDir: "devflow",
  discoveryDir: "devflow/discoveries",
  planningDir: "devflow",
  tasksDir: "devflow/context",
  historyDir: "devflow/history",
  docsDir: "devflow/docs",
  referenceDir: "devflow/reference",
  isDecadeNumbered: false
};

export const DECADE_NUMBERED_WORKSPACE_PATHS: WorkspacePaths = {
  contextDir: "devflow/00-context",
  ideationDir: "devflow/10-ideation",
  discoveryDir: "devflow/20-discovery",
  planningDir: "devflow/30-planning",
  tasksDir: "devflow/40-tasks",
  historyDir: "devflow/50-history",
  docsDir: "devflow/60-docs",
  referenceDir: "devflow/10-ideation/reference",
  isDecadeNumbered: true
};

export async function isDecadeNumberedLayout(projectRoot: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(projectRoot, "devflow", "00-context"));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function resolveWorkspacePaths(projectRoot: string): Promise<WorkspacePaths> {
  // 1. Check manifest for custom workspace configuration
  try {
    const manifestPath = path.join(projectRoot, ".nexus", "nexus-devflow.json");
    const content = await fs.readFile(manifestPath, "utf8");
    const manifest = JSON.parse(content);
    if (manifest && typeof manifest === "object" && manifest.workspace) {
      const isDecade = Boolean(
        manifest.workspace.contextDir?.includes("00-context") ||
        (await isDecadeNumberedLayout(projectRoot))
      );
      const base = isDecade ? DECADE_NUMBERED_WORKSPACE_PATHS : LEGACY_WORKSPACE_PATHS;
      return {
        ...base,
        ...manifest.workspace,
        isDecadeNumbered: isDecade
      };
    }
  } catch {
    // Fall through to auto-detection
  }

  // 2. Physical directory inspection
  if (await isDecadeNumberedLayout(projectRoot)) {
    return { ...DECADE_NUMBERED_WORKSPACE_PATHS };
  }

  // 3. Fallback to legacy flat layout
  return { ...LEGACY_WORKSPACE_PATHS };
}
