import fsSync from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";
import {
  formatCheckPipelineReport,
  runCheckPipeline,
  type CheckPipelineResult
} from "../../check-pipeline.js";

export const verifyLayersCommand: ToolCommand<CheckPipelineResult> = {
  name: "verify-layers",
  description:
    "Detect project languages and run fail-fast 3-layer verification (lint/typecheck -> tests -> TLA+/Lean formal check)",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult<CheckPipelineResult>> {
    const projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    let targetDir = projectRoot;
    let planOnly = false;
    let json = false;
    let files: string[] | undefined;

    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if ((arg === "--dir" || arg === "--path") && args[i + 1]) {
        targetDir = path.resolve(projectRoot, args[++i]);
      } else if (arg === "--plan" || arg === "--dry-run") {
        planOnly = true;
      } else if (arg === "--json") {
        json = true;
      } else if (arg === "--files" && args[i + 1]) {
        files = args[++i]
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    if (!planOnly && fsSync.existsSync(path.join(targetDir, "devflow"))) {
      const reportsDir = path.join(targetDir, "devflow", "reports");
      fsSync.mkdirSync(reportsDir, { recursive: true });
      const gitignorePath = path.join(reportsDir, ".gitignore");
      if (!fsSync.existsSync(gitignorePath)) {
        fsSync.writeFileSync(gitignorePath, "*\n", "utf8");
      }
    }

    const result = runCheckPipeline(targetDir, { files, planOnly });
    const message = json ? JSON.stringify(result, null, 2) : formatCheckPipelineReport(result);

    if (!result.passed) {
      throw new ToolingError(message, 1);
    }

    return {
      ok: true,
      message,
      data: result
    };
  }
};
