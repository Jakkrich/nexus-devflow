import fs from "node:fs/promises";
import path from "node:path";
import { isDecadeNumberedLayout } from "../../workspace-paths.js";

export interface MigrationResult {
  success: boolean;
  moved: string[];
  warnings: string[];
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function movePath(src: string, dest: string, moved: string[], warnings: string[]): Promise<void> {
  if (!(await pathExists(src))) return;
  if (path.resolve(src) === path.resolve(dest)) return;

  await fs.mkdir(path.dirname(dest), { recursive: true });
  try {
    await fs.rename(src, dest);
    moved.push(`${src} -> ${dest}`);
  } catch (err: any) {
    try {
      const stat = await fs.stat(src);
      if (stat.isDirectory()) {
        await fs.cp(src, dest, { recursive: true });
        await fs.rm(src, { recursive: true, force: true });
      } else {
        await fs.copyFile(src, dest);
        await fs.unlink(src);
      }
      moved.push(`${src} -> ${dest}`);
    } catch (fallbackErr: any) {
      warnings.push(`Failed to move ${src} -> ${dest}: ${fallbackErr.message}`);
    }
  }
}

export async function migrateDevflowStructure(projectRoot: string): Promise<MigrationResult> {
  const moved: string[] = [];
  const warnings: string[] = [];

  const devflowDir = path.join(projectRoot, "devflow");
  if (!(await pathExists(devflowDir))) {
    return {
      success: false,
      moved: [],
      warnings: ["Directory devflow does not exist"]
    };
  }

  // Ensure target decade directories exist
  const targetDirs = [
    "00-context",
    "10-ideation",
    "20-discovery",
    "30-planning",
    "40-tasks",
    "50-history",
    "60-docs"
  ];

  for (const d of targetDirs) {
    await fs.mkdir(path.join(devflowDir, d), { recursive: true });
  }

  // 1. Handle devflow/context/
  const oldContextDir = path.join(devflowDir, "context");
  if (await pathExists(oldContextDir)) {
    const entries = await fs.readdir(oldContextDir, { withFileTypes: true });
    for (const entry of entries) {
      const src = path.join(oldContextDir, entry.name);
      if (entry.isDirectory()) {
        // Active task folder -> devflow/40-tasks/{task-slug}
        const dest = path.join(devflowDir, "40-tasks", entry.name);
        await movePath(src, dest, moved, warnings);
      } else {
        // Context file -> devflow/00-context/{file}
        const dest = path.join(devflowDir, "00-context", entry.name);
        await movePath(src, dest, moved, warnings);
      }
    }
    // Remove empty old context dir
    try {
      await fs.rm(oldContextDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }

  // 2. Handle 10-ideation (ideas.md, inbox/, reference/)
  await movePath(
    path.join(devflowDir, "ideas.md"),
    path.join(devflowDir, "10-ideation", "ideas.md"),
    moved,
    warnings
  );
  await movePath(
    path.join(devflowDir, "inbox"),
    path.join(devflowDir, "10-ideation", "inbox"),
    moved,
    warnings
  );
  await movePath(
    path.join(devflowDir, "reference"),
    path.join(devflowDir, "10-ideation", "reference"),
    moved,
    warnings
  );

  // 3. Handle 20-discovery (analysis/, discoveries/, decisions/, research/)
  await movePath(
    path.join(devflowDir, "analysis"),
    path.join(devflowDir, "20-discovery", "analysis"),
    moved,
    warnings
  );
  await movePath(
    path.join(devflowDir, "discoveries"),
    path.join(devflowDir, "20-discovery", "discoveries"),
    moved,
    warnings
  );
  await movePath(
    path.join(devflowDir, "decisions"),
    path.join(devflowDir, "20-discovery", "decisions"),
    moved,
    warnings
  );
  await movePath(
    path.join(devflowDir, "research"),
    path.join(devflowDir, "20-discovery", "research"),
    moved,
    warnings
  );

  // 4. Handle 30-planning (project-plan.md, build-plan.md)
  await movePath(
    path.join(devflowDir, "project-plan.md"),
    path.join(devflowDir, "30-planning", "project-plan.md"),
    moved,
    warnings
  );
  await movePath(
    path.join(devflowDir, "build-plan.md"),
    path.join(devflowDir, "30-planning", "build-plan.md"),
    moved,
    warnings
  );

  // 5. Handle 50-history (history/)
  const oldHistoryDir = path.join(devflowDir, "history");
  if (await pathExists(oldHistoryDir)) {
    const historyEntries = await fs.readdir(oldHistoryDir, { withFileTypes: true });
    for (const entry of historyEntries) {
      const src = path.join(oldHistoryDir, entry.name);
      const dest = path.join(devflowDir, "50-history", entry.name);
      await movePath(src, dest, moved, warnings);
    }
    try {
      await fs.rm(oldHistoryDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }

  // 6. Handle 60-docs (docs/)
  const oldDocsDir = path.join(devflowDir, "docs");
  if (await pathExists(oldDocsDir)) {
    const docsEntries = await fs.readdir(oldDocsDir, { withFileTypes: true });
    for (const entry of docsEntries) {
      const src = path.join(oldDocsDir, entry.name);
      const dest = path.join(devflowDir, "60-docs", entry.name);
      await movePath(src, dest, moved, warnings);
    }
    try {
      await fs.rm(oldDocsDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }

  // 7. Clean up legacy runs folder
  const oldRunsDir = path.join(devflowDir, "runs");
  if (await pathExists(oldRunsDir)) {
    try {
      await fs.rm(oldRunsDir, { recursive: true, force: true });
      moved.push(`${oldRunsDir} (removed legacy runs folder)`);
    } catch {
      // ignore
    }
  }

  // 8. Update manifest if present
  const manifestPath = path.join(projectRoot, ".nexus", "nexus-devflow.json");
  if (await pathExists(manifestPath)) {
    try {
      const manifestContent = await fs.readFile(manifestPath, "utf8");
      const manifest = JSON.parse(manifestContent);
      const isAlreadyDecade = manifest.workspace?.contextDir === "devflow/00-context";
      if (!isAlreadyDecade) {
        manifest.workspace = {
          ...manifest.workspace,
          contextDir: "devflow/00-context",
          ideationDir: "devflow/10-ideation",
          discoveryDir: "devflow/20-discovery",
          planningDir: "devflow/30-planning",
          tasksDir: "devflow/40-tasks",
          historyDir: "devflow/50-history",
          docsDir: "devflow/60-docs"
        };
        delete manifest.workspace.runsDir;
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
        moved.push(`${manifestPath} (updated workspace paths)`);
      }
    } catch (err: any) {
      warnings.push(`Could not update manifest: ${err.message}`);
    }
  }

  return {
    success: true,
    moved,
    warnings
  };
}

import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";

export const migrateStructureCommand: ToolCommand<MigrationResult> = {
  name: "migrate-structure",
  description: "Migrate legacy devflow folder structure to Decade-Numbered layout (00-context, 10-ideation, etc.)",
  async run(args: string[], options?: ToolingOptions): Promise<ToolResult<MigrationResult>> {
    const projectRoot = options?.projectRoot || options?.cwd || process.cwd();
    const result = await migrateDevflowStructure(projectRoot);
    if (!result.success) {
      return {
        ok: false,
        message: result.warnings.join("\n") || "Migration failed",
        data: result
      };
    }
    return {
      ok: true,
      message: `Successfully migrated devflow structure (${result.moved.length} items processed)`,
      data: result
    };
  }
};

