import fs from "node:fs";
import path from "node:path";
import type { ToolCommand, ToolResult, ToolingOptions } from "../types.js";
import { ToolingError } from "../types.js";

const excludedDirs = new Set([
  ".git",
  "node_modules",
  ".test-workspace-node",
  ".local-tools",
  ".specify",
  ".venv",
  "venv",
  "env",
  ".uv_cache",
  ".pytest_cache",
  "model_cache",
  "rag_storage",
  "tests",
  "docs",
]);

const allowedFiles = new Set([
  path.normalize("scripts/scan-security-hygiene.mjs"),
  path.normalize("packages/create-nexus-devflow/lib/tooling/commands/scan-security-hygiene.ts"),
  path.normalize("README.md"),
  path.normalize("README_zh.md"),
]);

const rules = [
  { name: "OpenAI key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Private key block", pattern: /BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY/ },
  {
    name: "Likely assigned secret",
    pattern: /\b(password|secret|token|api[_-]?key)\s*[:=]\s*["'][^"']{8,}["']/i,
  },
  { name: "Destructive git reset", pattern: /\bgit\s+reset\s+--hard\b/i },
  { name: "Force remove command", pattern: /\brm\s+-rf\b/i },
];

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excludedDirs.has(entry.name)) walk(path.join(dir, entry.name), files);
      continue;
    }
    if (!/\.(md|json|mjs|js|ts|py|ps1|sh|txt|yaml|yml|toml)$/i.test(entry.name)) continue;
    files.push(path.join(dir, entry.name));
  }
  return files;
}

export const scanSecurityHygieneCommand: ToolCommand = {
  name: "scan-security-hygiene",
  description: "Scan repository for leaked secrets, destructive git commands, or security hygiene issues",
  async run(args: string[], options: ToolingOptions = {}): Promise<ToolResult> {
    const projectRoot = options.projectRoot ?? options.cwd ?? process.cwd();
    let targetDir = projectRoot;

    for (let i = 0; i < args.length; i++) {
      if ((args[i] === "--dir" || args[i] === "--path") && args[i + 1]) {
        targetDir = path.resolve(projectRoot, args[i + 1]);
        i++;
      }
    }

    const hits: string[] = [];
    const files = walk(targetDir);

    for (const file of files) {
      const relative = path.normalize(path.relative(projectRoot, file));
      if (allowedFiles.has(relative)) continue;
      // Also ignore .scratch, docs/adr, etc.
      if (relative.startsWith(".scratch") || relative.startsWith(".agent")) continue;

      const content = fs.readFileSync(file, "utf8");
      const lines = content.split(/\r?\n/);
      lines.forEach((line, index) => {
        for (const rule of rules) {
          if (rule.pattern.test(line)) {
            hits.push(`${relative}:${index + 1}: ${rule.name}`);
          }
        }
      });
    }

    if (hits.length > 0) {
      throw new ToolingError(
        `Security hygiene violations found:\n${hits.map((h) => ` - ${h}`).join("\n")}`,
        1
      );
    }

    return {
      ok: true,
      message: `Security hygiene check passed. Scanned ${files.length} files with zero violations.`,
      data: { scannedFiles: files.length, hits: [] },
    };
  },
};
