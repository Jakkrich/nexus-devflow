import fs from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";

const stageMappings = [
  { legacyDir: "explore", legacyFile: "discover.md", targetFile: "discovery.md" },
  { legacyDir: "discovery", legacyFile: "discovery.md", targetFile: "discovery.md" },
  { legacyDir: "spec", legacyFile: "spec.md", targetFile: "spec.md" },
  { legacyDir: "implement", legacyFile: "implement.md", targetFile: "spec.md" },
  { legacyDir: "verify", legacyFile: "verify.md", targetFile: "findings.md" },
  { legacyDir: "report", legacyFile: "report.md", targetFile: "report.md" },
  { legacyDir: "report", legacyFile: "report.html", targetFile: "report.html" },
];

function isLegacyRunDirectory(workspacesRoot: string, entryName: string): boolean {
  if (!/^\d{3}-/.test(entryName)) return false;
  const candidate = path.join(workspacesRoot, entryName);
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) return false;
  if (entryName === "specs") return false;

  return stageMappings.some(({ legacyDir, legacyFile }) =>
    fs.existsSync(path.join(candidate, legacyDir, legacyFile))
  );
}

export const migrateStageArtifactsCommand: ToolCommand = {
  name: "migrate-stage-artifacts",
  description: "Migrate legacy multi-folder stage artifacts into unified format",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    let projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    const shouldWrite = args.includes("--write");

    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--project-root" && args[i + 1]) {
        projectRoot = path.resolve(args[i + 1]);
        i++;
      }
    }

    const workspacesRoot = path.join(projectRoot, "devflow");
    if (!fs.existsSync(workspacesRoot)) {
      return {
        ok: true,
        message: "No legacy workspaces require migration.",
        data: { plans: [] },
      };
    }

    const runDirectories = fs
      .readdirSync(workspacesRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && isLegacyRunDirectory(workspacesRoot, entry.name))
      .map((entry) => entry.name)
      .sort();

    if (runDirectories.length === 0) {
      return {
        ok: true,
        message: "No legacy workspaces require migration.",
        data: { plans: [] },
      };
    }

    return {
      ok: true,
      message: `Found ${runDirectories.length} legacy workspace(s) to migrate (write: ${shouldWrite})`,
      data: { legacyDirectories: runDirectories },
    };
  },
};
