import { execFileSync } from "node:child_process";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type CoreSkillInventory,
  loadCoreSkillInventory,
  shouldIncludeTemplatePath
} from "../lib/core-skill-inventory.js";

export interface TrackedIndex {
  readonly files: ReadonlySet<string>;
  readonly dirs: ReadonlySet<string>;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "..", "..");
const templateRoot = path.join(packageRoot, "template");
const extrasRoot = path.join(packageRoot, "extras");

const entries = [
  "AGENTS.md",
  "CLAUDE.md",
  "AI_HANDOFF.md",
  ".agents",
  ".claude",
  "devflow",
  "LICENSE"
];

function matchesPrefix(filePath: string, prefix: string): boolean {
  return filePath === prefix || filePath.startsWith(`${prefix}/`);
}

export function buildTrackedIndex(paths: Iterable<string>): TrackedIndex {
  const files = new Set<string>();
  const dirs = new Set<string>();
  for (const rawPath of paths) {
    const normalized = rawPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
    if (!normalized) continue;
    files.add(normalized);
    let slash = normalized.lastIndexOf("/");
    while (slash > 0) {
      dirs.add(normalized.slice(0, slash));
      slash = normalized.lastIndexOf("/", slash - 1);
    }
  }
  return { files, dirs };
}

export function loadTrackedRepoIndex(rootDir: string): TrackedIndex | null {
  const hasGitMarker = fsSync.existsSync(path.join(rootDir, ".git"));
  try {
    const stdout = execFileSync("git", ["-C", rootDir, "ls-files", "-z"], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      stdio: ["pipe", "pipe", "ignore"]
    });
    return buildTrackedIndex(stdout.split("\0").filter(Boolean));
  } catch (error: unknown) {
    if (hasGitMarker) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to list tracked files in Git repository ${rootDir}: ${detail}`);
    }
    return null;
  }
}

export function shouldCopyTemplateEntry(
  normalized: string,
  isDirectory: boolean,
  inventory: CoreSkillInventory,
  trackedIndex: TrackedIndex | null
): boolean {
  if (!shouldIncludeTemplatePath(normalized, inventory)) {
    return false;
  }
  if (matchesPrefix(normalized, "devflow/.state")) {
    return false;
  }
  if (matchesPrefix(normalized, "devflow/check-layers.json") || matchesPrefix(normalized, "formal")) {
    return false;
  }
  if (
    normalized.startsWith("devflow/context/") &&
    normalized !== "devflow/context" &&
    normalized !== "devflow/context/project-overview.md" &&
    normalized !== "devflow/context/coding-standards.md" &&
    normalized !== "devflow/context/ai-interaction.md" &&
    normalized !== "devflow/context/glossary.md"
  ) {
    return false;
  }
  if (
    normalized.startsWith("devflow/history/features/") &&
    !normalized.endsWith("README.md")
  ) {
    return false;
  }
  if (
    normalized.startsWith("devflow/history/fixes/") &&
    !normalized.endsWith("README.md")
  ) {
    return false;
  }
  if (
    normalized.startsWith("devflow/history/rollbacks/") &&
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
    normalized.startsWith("devflow/decisions/") &&
    !normalized.endsWith(".gitkeep") &&
    !normalized.endsWith("README.md")
  ) {
    return false;
  }
  if (
    matchesPrefix(normalized, "devflow/runs") ||
    matchesPrefix(normalized, "devflow/inbox") ||
    matchesPrefix(normalized, "devflow/analysis") ||
    matchesPrefix(normalized, "devflow/scratch") ||
    matchesPrefix(normalized, "devflow/tmp") ||
    matchesPrefix(normalized, "devflow/temp") ||
    matchesPrefix(normalized, "devflow/brainstorm") ||
    matchesPrefix(normalized, "devflow/brainstorms") ||
    matchesPrefix(normalized, "devflow/backups") ||
    matchesPrefix(normalized, "devflow/reports") ||
    matchesPrefix(normalized, "devflow/playbooks") ||
    matchesPrefix(normalized, "devflow/reference/playbooks") ||
    matchesPrefix(normalized, "devflow/research") ||
    matchesPrefix(normalized, "prototypes") ||
    matchesPrefix(normalized, "evals") ||
    matchesPrefix(normalized, ".nexus")
  ) {
    return false;
  }
  if (
    matchesPrefix(normalized, "devflow/.vendor") ||
    matchesPrefix(normalized, "devflow/reference/bughunter/skills") ||
    matchesPrefix(normalized, "devflow/reference/bughunter/commands") ||
    matchesPrefix(normalized, "devflow/reference/bughunter/disclosed-reports") ||
    matchesPrefix(normalized, "devflow/reference/bughunter/docs")
  ) {
    return false;
  }
  return isTrackedEntry(normalized, isDirectory, trackedIndex);
}

function isTrackedEntry(
  normalized: string,
  isDirectory: boolean,
  trackedIndex: TrackedIndex | null
): boolean {
  if (trackedIndex && normalized !== "") {
    return isDirectory
      ? trackedIndex.dirs.has(normalized)
      : trackedIndex.files.has(normalized);
  }
  return true;
}

export function shouldCopyExtrasEntry(
  normalized: string,
  isDirectory: boolean,
  trackedIndex: TrackedIndex | null
): boolean {
  return isTrackedEntry(normalized, isDirectory, trackedIndex);
}

async function copyEntry(
  entry: string,
  inventory: CoreSkillInventory,
  trackedIndex: TrackedIndex | null
): Promise<void> {
  const source = path.join(repoRoot, entry);
  const target = path.join(templateRoot, entry);
  try {
    await fs.cp(source, target, {
      recursive: true,
      filter: (src) => {
        const normalized = path.relative(repoRoot, src).replace(/\\/g, "/");
        const isDirectory = fsSync.lstatSync(src).isDirectory();
        return shouldCopyTemplateEntry(normalized, isDirectory, inventory, trackedIndex);
      }
    });
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

async function ensureEmptyDirectories(): Promise<void> {
  const discDir = path.join(templateRoot, "devflow", "discoveries");
  const decDir = path.join(templateRoot, "devflow", "decisions");
  const featDir = path.join(templateRoot, "devflow", "history", "features");
  const fixDir = path.join(templateRoot, "devflow", "history", "fixes");
  const rollDir = path.join(templateRoot, "devflow", "history", "rollbacks");

  await fs.mkdir(discDir, { recursive: true });
  await fs.mkdir(decDir, { recursive: true });
  await fs.mkdir(featDir, { recursive: true });
  await fs.mkdir(fixDir, { recursive: true });
  await fs.mkdir(rollDir, { recursive: true });

  await fs.writeFile(path.join(discDir, ".gitkeep"), "", "utf8");
  await fs.writeFile(path.join(decDir, ".gitkeep"), "", "utf8");
}

export async function sanitizeStarterFiles(
  targetTemplateRoot: string = templateRoot,
  sourceRepoRoot: string = repoRoot
): Promise<void> {
  // 1. Sanitize AGENTS.md
  try {
    const agentsPath = path.join(targetTemplateRoot, "AGENTS.md");
    let agentsContent = await fs.readFile(agentsPath, "utf8");
    const maintainerCommandsRegex = /## Verification & Commands[\s\S]*$/;
    const starterCommands = `<!-- devflow:onboarding-required -->
## Commands

- Dev Server: \`npm run dev\`
- Build: \`npm run build\`
- Test: \`npm test\`
- Verify: \`npm run check\` (Run \`/onboard\` to auto-configure)
`;
    agentsContent = agentsContent.replace(maintainerCommandsRegex, starterCommands);
    await fs.writeFile(agentsPath, agentsContent, "utf8");
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  // 2. Clean Starter HISTORY.md
  const starterHistory = `# Master Release History Ledger

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during \`/complete\` and links to its exact Git commit hash, release status, category, and archived delivery artifacts.

---

## 📜 Master Release Log

| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| _No shipped runs yet_ | - | - | Run \`/feature\` or \`/discovery\` to start your first delivery run | - | - | - |

---

## 🗄️ History Categories (The Core 3 Model)

- **\`features/\`**: New user-facing features, enhancements, architecture migrations, refactoring, and tooling/infra.
- **\`fixes/\`**: Bug fixes, hotfixes, regressions, security patches, and performance optimizations.
- **\`rollbacks/\`**: Safe feature reversal and rollback execution records.
`;
  await fs.mkdir(path.join(targetTemplateRoot, "devflow", "history"), { recursive: true });
  await fs.writeFile(path.join(targetTemplateRoot, "devflow", "history", "HISTORY.md"), starterHistory, "utf8");

  // 3. Clean Starter ideas.md
  const starterIdeas = `# 🔮 Centralized Idea Inbox & Backlog

> Record, analyze, and prioritize feature ideas before starting active delivery.
> Use the \`/idea\` command to quickly capture and evaluate new ideas.

---

## 💡 Active Idea Inbox

| ID | Title | Value (1-5) | Feasibility (1-5) | Status | Notes |
| :--- | :--- | :---: | :---: | :--- | :--- |
| _No pending ideas_ | - | - | - | Use \`/idea <your idea>\` to capture | - |

---

## 📦 Archived / Shipped Ideas

| ID | Title | Shipped In | Completed Date |
| :--- | :--- | :--- | :--- |
`;
  await fs.mkdir(path.join(targetTemplateRoot, "devflow"), { recursive: true });
  await fs.writeFile(path.join(targetTemplateRoot, "devflow", "ideas.md"), starterIdeas, "utf8");

  // 4. Clean Starter project-overview.md
  const starterOverview = `# Project Overview & Source of Truth

> Living context artifact automatically synchronized with codebase reality and DevFlow delivery history.
> Run \`/onboard\` (auto-detects brownfield or \`/onboard --adopt\` for existing codebases) to populate this file.

---

## 1. Project Purpose & Target Users
- Describe what this application does, who it is for, and the problems it solves.

## 2. Architecture & Directory Layout
- Visual directory layout and overview of core modules.

## 3. Technology Stack & Key Tooling
- Frameworks, languages, databases, ORMs, package managers, and runtime environment.

## 4. Concrete Data Models & Entities
- Core entities, database schemas, API interfaces, and types.

## 5. Shipped Capabilities & Milestones
- Verified features and components currently functional in the codebase.

## 6. Verified Commands & Developer Workflow
- Dev Server, Build, Test, Lint, and Verify commands.

## 7. Known Architectural Focus Areas
- Upcoming priorities, refactoring targets, or known technical considerations.
`;
  await fs.mkdir(path.join(targetTemplateRoot, "devflow", "context"), { recursive: true });
  await fs.writeFile(path.join(targetTemplateRoot, "devflow", "context", "project-overview.md"), starterOverview, "utf8");

  // 5. Replace maintainer project-plan.md & build-plan.md with clean reference starter templates
  const starterPlanPairs: ReadonlyArray<readonly [string, string]> = [
    ["project-plan-template.md", path.join("devflow", "project-plan.md")],
    ["build-plan-template.md", path.join("devflow", "build-plan.md")],
    ["ai-handoff-template.md", "AI_HANDOFF.md"]
  ];
  for (const [refName, targetRelPath] of starterPlanPairs) {
    const srcPath = path.join(sourceRepoRoot, "devflow", "reference", refName);
    const destPath = path.join(targetTemplateRoot, targetRelPath);
    const content = await fs.readFile(srcPath, "utf8");
    await fs.writeFile(destPath, content, "utf8");
  }
}

async function copyExtrasSkills(trackedIndex: TrackedIndex | null): Promise<void> {
  const source = path.join(repoRoot, "extras", "skills");
  const target = path.join(extrasRoot, "skills");
  try {
    await fs.cp(source, target, {
      recursive: true,
      filter: (src) => {
        const normalized = path.relative(repoRoot, src).replace(/\\/g, "/");
        const isDirectory = fsSync.lstatSync(src).isDirectory();
        return shouldCopyExtrasEntry(normalized, isDirectory, trackedIndex);
      }
    });
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

async function main() {
  const inventory = await loadCoreSkillInventory(
    path.join(repoRoot, "agent-bundle.manifest.json")
  );
  const trackedIndex = loadTrackedRepoIndex(repoRoot);
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  await fs.rm(extrasRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const entry of entries) {
    await copyEntry(entry, inventory, trackedIndex);
  }

  await copyExtrasSkills(trackedIndex);
  await ensureEmptyDirectories();
  await sanitizeStarterFiles();
}

const isEntrypoint =
  Boolean(process.argv[1]) &&
  fsSync.realpathSync(process.argv[1]) === fsSync.realpathSync(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
