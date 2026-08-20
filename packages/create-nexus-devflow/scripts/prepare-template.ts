import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const templateRoot = path.join(packageRoot, "template");

const entries = [
  "AGENTS.md",
  "CLAUDE.md",
  ".agents",
  ".claude",
  "devflow",
  "LICENSE"
];

async function copyEntry(entry: string): Promise<void> {
  const source = path.join(repoRoot, entry);
  const target = path.join(templateRoot, entry);
  try {
    await fs.cp(source, target, {
      recursive: true,
      filter: (src) => {
        const normalized = path.relative(repoRoot, src).replace(/\\/g, "/");
        if (
          normalized.startsWith("devflow/runs/") &&
          !normalized.endsWith(".gitkeep") &&
          !normalized.endsWith("README.md")
        ) {
          return false;
        }
        if (
          normalized.startsWith("devflow/discoveries/") &&
          !normalized.endsWith(".gitkeep") &&
          !normalized.endsWith("README.md")
        ) {
          return false;
        }
        if (
          normalized.includes(".agents/skills/sync-upstream") ||
          normalized.includes(".claude/skills/sync-upstream")
        ) {
          return false;
        }
        return true;
      }
    });
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

async function ensureEmptyDirectories(): Promise<void> {
  const runsDir = path.join(templateRoot, "devflow", "runs");
  const discDir = path.join(templateRoot, "devflow", "discoveries");

  await fs.mkdir(runsDir, { recursive: true });
  await fs.mkdir(discDir, { recursive: true });

  await fs.writeFile(path.join(runsDir, ".gitkeep"), "", "utf8");
  await fs.writeFile(path.join(discDir, ".gitkeep"), "", "utf8");
}

async function sanitizeAgentsEntryFile(filePath: string): Promise<void> {
  try {
    let content = await fs.readFile(filePath, "utf8");

    const maintainerCommandsRegex = /## Verification & Commands[\s\S]*$/;
    const starterCommands = `## Commands

- Dev Server: \`npm run dev\`
- Build: \`npm run build\`
- Test: \`npm test\`
- Verify: \`npm run check\` (Run \`/onboard\` to auto-configure)
`;
    content = content.replace(maintainerCommandsRegex, starterCommands);

    await fs.writeFile(filePath, content, "utf8");
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

async function main() {
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const entry of entries) {
    await copyEntry(entry);
  }

  await ensureEmptyDirectories();
  await sanitizeAgentsEntryFile(path.join(templateRoot, "AGENTS.md"));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
