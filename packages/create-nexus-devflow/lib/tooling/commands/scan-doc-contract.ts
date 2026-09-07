import fs from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

const targets = [
  "README.md",
  "USAGE.md",
  "docs",
  ".agent/agents",
  ".agent/resources/schemas",
  ".agent/scripts/README.md",
  ".agent/workflows",
];

const allowedFiles = new Set([
  path.normalize(".agent/docs/npm-framework-setup.md"),
  path.normalize(".agent/package.json"),
]);

const forbiddenPatterns = [
  {
    pattern: /\bnpx\s+agent-flow\b/,
    message: "Use repo-mode command examples (`npm.cmd run agent -- ...`) in canonical docs.",
  },
  {
    pattern: /\bnpm\.cmd\s+run\s+validate\s+\d+\b/,
    message: "Task validation must use `npm.cmd run agent -- validate {ID}`.",
  },
];

function walk(projectRoot: string, target: string, files: string[] = []): string[] {
  const full = path.join(projectRoot, target);
  if (!fs.existsSync(full)) return files;
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(projectRoot, path.join(target, entry.name), files);
    }
    return files;
  }
  if (/\.(md|json|mjs|js|txt)$/i.test(target)) files.push(path.normalize(target));
  return files;
}

export const scanDocContractCommand: ToolCommand = {
  name: "scan-doc-contract",
  description: "Scan documentation for contract violations and outdated command patterns",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    const files = [...new Set(targets.flatMap((target) => walk(projectRoot, target)))];
    const hits: string[] = [];

    for (const file of files) {
      if (allowedFiles.has(file)) continue;
      const fullPath = path.join(projectRoot, file);
      if (!fs.existsSync(fullPath)) continue;
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split(/\r?\n/);
      lines.forEach((line, index) => {
        for (const rule of forbiddenPatterns) {
          if (rule.pattern.test(line)) {
            hits.push(`${file}:${index + 1}: ${rule.message}`);
          }
        }
      });
    }

    if (hits.length > 0) {
      throw new ToolingError(
        `Document contract violations found:\n${hits.map((h) => ` - ${h}`).join("\n")}`,
        1
      );
    }

    return {
      ok: true,
      message: `Document contract check passed. Scanned ${files.length} files with zero violations.`,
      data: { scannedFiles: files.length, hits: [] },
    };
  },
};
