import fs from "node:fs";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

function readOption(args: string[], name: string): string | null {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

export const renderHtmlCommand: ToolCommand = {
  name: "render-html",
  description: "Render standalone HTML documents from markdown with diagrams and themes",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const cwd = options.cwd ?? options.projectRoot ?? process.cwd();
    // @ts-expect-error - untyped mjs
    const coreMod: any = await import("../../../../../scripts/lib/render-html/core.mjs");
    const { renderMarkdownDocument } = coreMod;

    // @ts-expect-error - untyped mjs
    const stageMod: any = await import("../../../../../scripts/lib/render-html/stage-adapters/report-stage.mjs");
    const { renderReportStageWorkspace, resolveReportWorkspaceDir } = stageMod;

    const preset = readOption(args, "--preset");
    const sourcePath = readOption(args, "--source");
    const outputPath = readOption(args, "--out");
    const metadataPath = readOption(args, "--metadata");
    const stage = readOption(args, "--stage");

    const positionalArgs = args.filter((value, index) => {
      if (value.startsWith("--")) return false;
      const previous = args[index - 1];
      return !["--preset", "--source", "--out", "--metadata", "--stage"].includes(previous);
    });

    if (stage) {
      if (stage !== "report" && stage !== "feature" && stage !== "discovery") {
        throw new ToolingError(`Unsupported stage for render CLI: ${stage}`, 1);
      }
      const target = positionalArgs[0];
      if (!target) {
        throw new ToolingError(
          "Usage: render-html --stage report <workspace-path-or-running-id>",
          1
        );
      }

      try {
        const workspaceDir = resolveReportWorkspaceDir(target, cwd);
        const result = renderReportStageWorkspace({ workspaceDir });
        return {
          ok: true,
          message: `Generated ${result.outputPath}`,
          data: result,
        };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new ToolingError(msg, 1);
      }
    }

    if (!preset || !sourcePath || !outputPath || !metadataPath) {
      throw new ToolingError(
        "Usage: render-html --preset <name> --source <markdown-file> --out <html-file> --metadata <json-file>",
        1
      );
    }

    try {
      const markdown = fs.readFileSync(sourcePath, "utf8");
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      const result = renderMarkdownDocument({
        sourcePath,
        markdown,
        preset,
        outputPath,
        metadata,
      });

      return {
        ok: true,
        message: `Generated ${result.outputPath}`,
        data: result,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new ToolingError(msg, 1);
    }
  },
};
