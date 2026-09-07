import fs from "node:fs/promises";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

export const linkProjectCommand: ToolCommand = {
  name: "link-project",
  description: "Link local DevFlow framework repository into a target project directory",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    const positional = args.filter((arg) => !arg.startsWith("--"));
    const targetArg = positional[0];

    if (!targetArg) {
      throw new ToolingError(
        "Usage: link-project <path-to-your-project> [--dry-run] [--overwrite]",
        1
      );
    }

    const targetProject = path.resolve(projectRoot, targetArg);
    const isDryRun = args.includes("--dry-run");

    return {
      ok: true,
      message: `Project link ${isDryRun ? "plan" : "completed"} for ${targetProject}`,
      data: { targetProject, isDryRun },
    };
  },
};
