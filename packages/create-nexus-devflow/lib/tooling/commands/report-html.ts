import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

export const reportHtmlCommand: ToolCommand = {
  name: "report-html",
  description: "Generate interactive standalone HTML report for a DevFlow stage or task",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const cwd = options.cwd ?? options.projectRoot ?? process.cwd();
    // @ts-expect-error - untyped mjs
    const reportStageMod: any = await import("../../../../../scripts/lib/render-html/stage-adapters/report-stage.mjs");
    const { runReportHtmlCommand } = reportStageMod;

    try {
      const outputPath = runReportHtmlCommand({
        projectRoot: cwd,
        argument: args[0],
      });
      return {
        ok: true,
        message: `Generated ${outputPath}`,
        data: { outputPath },
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new ToolingError(msg, 1);
    }
  },
};
