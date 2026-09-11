import fs from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";

const stageOrder = [
  "discovery",
  "spec",
  "current-feature",
  "feature",
  "implement",
  "check",
  "complete",
];

function readIfExists(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

export const summarizeRunStatusCommand: ToolCommand = {
  name: "summarize-run-status",
  description: "Summarize current active DevFlow stage and run status",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    let projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    const isJson = args.includes("--json");

    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--project-root" && args[i + 1]) {
        projectRoot = path.resolve(args[i + 1]);
        i++;
      }
    }

    const decadeTasksDir = path.join(projectRoot, "devflow", "40-tasks");
    const legacyContextDir = path.join(projectRoot, "devflow", "context");
    const contextDir = fs.existsSync(decadeTasksDir) ? decadeTasksDir : legacyContextDir;
    let activeStage = "idle";
    let activeTask: string | null = null;

    if (fs.existsSync(contextDir)) {
      const entries = fs.readdirSync(contextDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && /^\d{3}-/.test(entry.name)) {
          activeTask = entry.name;
          const stageFile = path.join(contextDir, entry.name, "stage.md");
          const stageContent = readIfExists(stageFile);
          if (stageContent) {
            const match = stageContent.match(/^### Stage:\s*(\w+)/m);
            if (match) activeStage = match[1];
          }
          break;
        }
      }
    }

    const summaryData = {
      projectRoot,
      activeStage,
      activeTask,
      stages: stageOrder,
    };

    const message = `Active Stage: ${activeStage}${activeTask ? ` (${activeTask})` : ""}`;
    return {
      ok: true,
      message: isJson ? JSON.stringify(summaryData, null, 2) : message,
      data: summaryData,
    };
  },
};
