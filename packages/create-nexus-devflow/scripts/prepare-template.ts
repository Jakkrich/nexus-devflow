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
        if (normalized.startsWith("devflow/research/")) {
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

async function sanitizeStarterFiles(): Promise<void> {
  // 1. Sanitize AGENTS.md
  try {
    const agentsPath = path.join(templateRoot, "AGENTS.md");
    let agentsContent = await fs.readFile(agentsPath, "utf8");
    const maintainerCommandsRegex = /## Verification & Commands[\s\S]*$/;
    const starterCommands = `## Commands

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

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during \`/complete\` or \`70-deliver\` and links to its exact Git commit hash, release status, category, and archived delivery artifacts.

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
  await fs.writeFile(path.join(templateRoot, "devflow", "history", "HISTORY.md"), starterHistory, "utf8");

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
  await fs.writeFile(path.join(templateRoot, "devflow", "ideas.md"), starterIdeas, "utf8");

  // 4. Clean Starter project-overview.md
  const starterOverview = `# Project Overview & Source of Truth

> Living context artifact automatically synchronized with codebase reality and DevFlow delivery history.
> Run \`/onboard\` (for new projects) or \`/adopt\` (for existing codebases) to populate this file.

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
  await fs.writeFile(path.join(templateRoot, "devflow", "context", "project-overview.md"), starterOverview, "utf8");

  // 5. Clean Starter current-stage.md
  const starterStage = `# Current DevFlow Run Status

- **Active Discovery ID**: \`None\`
- **Active Running ID**: \`None\`
- **Current Stage**: \`Idle (Ready for new /feature, /fix, /discovery, or /10-define)\`
- **Living Spec**: \`None\`
- **Last Completed Run**: \`None\`
- **Last Updated**: \`None\`
`;
  await fs.writeFile(path.join(templateRoot, "devflow", "context", "current-stage.md"), starterStage, "utf8");

  // 6. Clean Starter current-feature.md
  const starterFeature = `# Current Feature

_Nothing in progress. Run /feature, /fix, or /rollback to start._
`;
  await fs.writeFile(path.join(templateRoot, "devflow", "context", "current-feature.md"), starterFeature, "utf8");
}

async function main() {
  await fs.rm(templateRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  await fs.mkdir(templateRoot, { recursive: true });

  for (const entry of entries) {
    await copyEntry(entry);
  }

  await ensureEmptyDirectories();
  await sanitizeStarterFiles();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
