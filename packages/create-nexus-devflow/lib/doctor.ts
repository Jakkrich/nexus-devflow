import fs from "node:fs/promises";
import path from "node:path";
import { isDevFlowProjectRoot } from "./project-root.js";
import { createStyle } from "./ui.js";
import { readProjectConfig } from "./project-config.js";

export interface DoctorCheck {
  id: string;
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  fixable: boolean;
  fixed?: boolean;
}

export interface DoctorReport {
  projectRoot: string;
  isDevFlowProject: boolean;
  checks: DoctorCheck[];
  totalChecks: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  fixedCount: number;
}

export interface DoctorOptions {
  fix?: boolean;
  color?: boolean;
}

const DEFAULT_FINDINGS_STUB = `# Findings Ledger

> **Generated Ledger File.** Tracks quality findings, security vulnerabilities, regression risks, and architectural debt raised during review and QA passes.
>
> **Finding Format**:
> \`### <ID> [<SEVERITY>] <STATUS> - <Title>\`
> - **Severities**: \`P0\` (Critical Blocker), \`P1\` (High Blocker), \`P2\` (Medium), \`P3\` (Low / Polish)
> - **Statuses**: \`unverified\`, \`open\`, \`fixed\`, \`closed\`, \`accepted\`, \`invalid\`
> - **Release Gate Rule**: Any \`P0\` or \`P1\` finding in \`open\` or \`fixed\` status unconditionally blocks \`/complete\`.

---

_No active findings recorded. QA and audit passes append findings here as they are discovered._
`;

const DEFAULT_CURRENT_STAGE_STUB = `# Current Stage

- Active Discovery ID: \`None\`
- Active Running ID: \`None\`
- Track: \`idle\`
- Current Stage: \`idle\`
- Active Branch: \`main\`
- Living Spec: \`devflow/context/{xxx-slug}/spec.md\`
- Next Action: \`Run /feature, /fix, or /discovery to start new work.\`
- Last Completed Run: \`None\`
- Last Updated: ${new Date().toISOString().split("T")[0]}
`;

const DEFAULT_CURRENT_FEATURE_STUB = `# Current Feature

_Nothing in progress. Run /feature, /fix, or /rollback to start._
`;

const DEFAULT_IDEAS_STUB = `# 💡 DevFlow Idea Inbox & Backlog

บันทึกไอเดียที่รอดำเนินการ พร้อมบทวิเคราะห์ความเป็นไปได้เบื้องต้นจาก AI (บันทึกด้วยคำสั่ง \`/idea "<text>"\`)

---

## 📌 Pending Ideas

---

## 📦 Archived / Shipped Ideas
`;

const DEFAULT_HISTORY_STUB = `# Nexus-DevFlow Master Release History Ledger

This master ledger tracks all released delivery runs, milestones, and rollbacks in chronological order. Each entry is recorded during \`/complete\` and links to its exact Git commit hash, release status, category, and archived delivery artifacts.

---

## 📜 Master Release Log

| Completed Date | Run ID | Category | Title | Git Commit | Status | Archive Link |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

---

## 🗄️ History Categories (The Core 3 Model)

- **\`features/\`**: New user-facing features, enhancements, architecture migrations, refactoring, and tooling/infra.
- **\`fixes/\`**: Bug fixes, hotfixes, regressions, security patches, and performance optimizations.
- **\`rollbacks/\`**: Safe feature reversal and rollback execution records.
`;

const DEFAULT_PROJECT_PLAN_STUB = `# 🗺️ Project Plan (User-Owned Architectural Vision)

> **Document Type**: Project Plan (User-Owned)  
> **Purpose**: Single source of truth for high-level product vision, architecture, constraints, and non-goals. Distilled into \`devflow/context/project-overview.md\` by \`/overview\`.

---

## 1. Product Vision & Problem Statement
- **What this is**: A description of the project and the core problem it solves.
- **Target Audience**: Who will use this system and why.
- **Core Value Proposition**: Key differentiator and value delivered.

## 2. Architecture & Tech Stack
- **Runtime / Framework**: Primary language, framework, and runtime (e.g. Node.js, Next.js, FastAPI, Go).
- **Storage / Database**: Data persistence layers, caching, and state storage.
- **Key Modules / Services**: High-level module breakdown and directory responsibilities.
- **Integration Points**: External APIs, MCP servers, or third-party services.

## 3. Constraints & Non-Goals
- **Non-Goals**: What this project explicitly will NOT do in the current scope.
- **Technical Constraints**: Performance targets, security standards, offline requirements, or backward compatibility rules.
- **Delivery Rules**: The 3-Pillars & Single Living Spec Model (Fast-Track 4 steps with Deep Architectural Rigour).

## 4. Key Milestones & Roadmap
- **Milestone 1**: Core Foundation & MVP
- **Milestone 2**: Feature Expansion & Integrations
- **Milestone 3**: Enterprise Hardening & Release Polish
`;

const DEFAULT_BUILD_PLAN_STUB = `# 📋 Build Plan (User-Owned Feature Queue)

> **Document Type**: Build Plan (User-Owned)  
> **Purpose**: Master sequential feature build queue with dependencies and sizing. Inspected by \`/brief\` and consumed by \`/feature\`.

---

## 🚀 Phase 1: Core Foundation & MVP

- [ ] **1. Project Baseline & Context Setup** \`[Size: S]\`
  - *Dependencies*: None
  - *Scope*: Configure project scaffolding, coding standards, and initial workspace verification.
- [ ] **2. Core Data Models & Store** \`[Size: M]\`
  - *Dependencies*: Feature 1
  - *Scope*: Implement foundational data schemas, types, and persistence layer.
- [ ] **3. Primary User Interface & Navigation** \`[Size: M]\`
  - *Dependencies*: Feature 2
  - *Scope*: Build core views, interactive components, and responsive layout.

---

## ⚡ Phase 2: Feature Expansion & Integrations

- [ ] **4. Automated Quality Gates & CI Pipeline** \`[Size: M]\`
  - *Dependencies*: Phase 1
  - *Scope*: Wire up \`nexus-devflow check-gate\`, GitHub Actions workflows, and pre-commit hooks.
- [ ] **5. External Services & Tooling** \`[Size: L]\`
  - *Dependencies*: Feature 4
  - *Scope*: Integrate third-party APIs, MCP servers, or background worker jobs.

---

## 📦 Phase 3: Hardening & Production Release

- [ ] **6. Security & Performance Audit** \`[Size: M]\`
  - *Dependencies*: Phase 2
  - *Scope*: Run \`/audit\`, resolve P0/P1 blockers, and optimize asset bundle sizes.
- [ ] **7. Production Deployment & Cloud Smoke Tests** \`[Size: S]\`
  - *Dependencies*: Feature 6
  - *Scope*: Configure Render / Vercel deployment and run end-to-end smoke tests.
`;

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.lstat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.lstat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function runDoctor(
  projectRoot: string,
  options: DoctorOptions = {}
): Promise<DoctorReport> {
  const isDevFlow = await isDevFlowProjectRoot(projectRoot);
  const checks: DoctorCheck[] = [];

  // Check 1: Project Root
  if (isDevFlow) {
    checks.push({
      id: "project_root",
      name: "DevFlow Project Root",
      status: "pass",
      message: "Directory contains DevFlow workspace markers (AGENTS.md & devflow/).",
      fixable: false
    });
  } else {
    checks.push({
      id: "project_root",
      name: "DevFlow Project Root",
      status: "fail",
      message: "Not a recognized DevFlow project directory.",
      fixable: false
    });
  }

  // Check 2: Internal State Manifest
  const manifestPath = path.join(projectRoot, ".nexus", "nexus-devflow.json");
  const hasManifest = await fileExists(manifestPath);
  if (hasManifest) {
    try {
      const parsed = JSON.parse(await fs.readFile(manifestPath, "utf8"));
      checks.push({
        id: "manifest_state",
        name: "Internal State Manifest (.nexus/)",
        status: "pass",
        message: `Manifest valid (version: ${parsed.version || "unknown"}, mode: ${parsed.mode || "standard"}).`,
        fixable: false
      });
    } catch {
      checks.push({
        id: "manifest_state",
        name: "Internal State Manifest (.nexus/)",
        status: "warn",
        message: "Manifest file is malformed JSON.",
        fixable: true
      });
    }
  } else {
    checks.push({
      id: "manifest_state",
      name: "Internal State Manifest (.nexus/)",
      status: "warn",
      message: "Manifest (.nexus/nexus-devflow.json) not found.",
      fixable: true
    });
  }

  // Check 3: Adapters
  const hasAgentsDir = await dirExists(path.join(projectRoot, ".agents"));
  const hasClaudeDir = await dirExists(path.join(projectRoot, ".claude"));
  if (hasAgentsDir || hasClaudeDir) {
    const adapters: string[] = [];
    if (hasAgentsDir) adapters.push("Codex/Copilot/Antigravity (.agents)");
    if (hasClaudeDir) adapters.push("Claude Code (.claude)");
    checks.push({
      id: "ai_adapters",
      name: "AI Tool Adapters",
      status: "pass",
      message: `Active adapters detected: ${adapters.join(", ")}.`,
      fixable: false
    });
  } else {
    checks.push({
      id: "ai_adapters",
      name: "AI Tool Adapters",
      status: "warn",
      message: "No AI adapter folders (.agents or .claude) detected.",
      fixable: false
    });
  }

  // Check 4: Global Shared Context Files (Pure Multi-Run Architecture)
  const contextFiles = [
    { name: "project-overview.md", path: path.join("devflow", "context", "project-overview.md"), stub: "# Project Overview\n\n_Source of truth for project architecture and domain rules._\n" },
    { name: "coding-standards.md", path: path.join("devflow", "context", "coding-standards.md"), stub: "# Coding Standards\n\n_Engineering conventions and quality standards._\n" },
    { name: "ai-interaction.md", path: path.join("devflow", "context", "ai-interaction.md"), stub: "# AI Interaction Guidelines\n\n_Rules and guidelines for interacting with AI agents._\n" },
    { name: "glossary.md", path: path.join("devflow", "context", "glossary.md"), stub: "# Domain & Architecture Glossary\n\n_Ubiquitous language and architecture definitions._\n" }
  ];

  for (const cf of contextFiles) {
    const absPath = path.join(projectRoot, cf.path);
    const exists = await fileExists(absPath);
    if (exists) {
      checks.push({
        id: `context_${cf.name}`,
        name: `Context File (${cf.name})`,
        status: "pass",
        message: `Found at ${cf.path}.`,
        fixable: false
      });
    } else {
      let fixed = false;
      if (options.fix) {
        await fs.mkdir(path.dirname(absPath), { recursive: true });
        await fs.writeFile(absPath, cf.stub, "utf8");
        fixed = true;
      }
      checks.push({
        id: `context_${cf.name}`,
        name: `Context File (${cf.name})`,
        status: fixed ? "pass" : "warn",
        message: fixed ? `Restored stub at ${cf.path}.` : `Missing at ${cf.path}.`,
        fixable: true,
        fixed
      });
    }
  }

  // Check 5: Planning Documents (project-plan.md & build-plan.md)
  const projectPlanPath = path.join(projectRoot, "devflow", "project-plan.md");
  const buildPlanPath = path.join(projectRoot, "devflow", "build-plan.md");
  const hasProjectPlan = await fileExists(projectPlanPath);
  const hasBuildPlan = await fileExists(buildPlanPath);

  if (hasProjectPlan && hasBuildPlan) {
    checks.push({
      id: "planning_documents",
      name: "Planning Documents (project-plan.md & build-plan.md)",
      status: "pass",
      message: "Both project-plan.md and build-plan.md are present.",
      fixable: false
    });
  } else if (hasProjectPlan || hasBuildPlan) {
    let fixed = false;
    if (options.fix) {
      if (!hasProjectPlan) await fs.writeFile(projectPlanPath, DEFAULT_PROJECT_PLAN_STUB, "utf8");
      if (!hasBuildPlan) await fs.writeFile(buildPlanPath, DEFAULT_BUILD_PLAN_STUB, "utf8");
      fixed = true;
    }
    checks.push({
      id: "planning_documents",
      name: "Planning Documents (project-plan.md & build-plan.md)",
      status: fixed ? "pass" : "warn",
      message: fixed
        ? "Restored missing planning document."
        : `Partially present (${hasProjectPlan ? "project-plan.md present" : "build-plan.md present"}).`,
      fixable: true,
      fixed
    });
  } else {
    let fixed = false;
    if (options.fix) {
      await fs.writeFile(projectPlanPath, DEFAULT_PROJECT_PLAN_STUB, "utf8");
      await fs.writeFile(buildPlanPath, DEFAULT_BUILD_PLAN_STUB, "utf8");
      fixed = true;
    }
    checks.push({
      id: "planning_documents",
      name: "Planning Documents (project-plan.md & build-plan.md)",
      status: fixed ? "pass" : "warn",
      message: fixed
        ? "Initialized project-plan.md and build-plan.md."
        : "User-owned planning documents not configured (optional, recommended for long-term roadmap).",
      fixable: true,
      fixed
    });
  }

  // Check 6: Ideas File
  const ideasPath = path.join(projectRoot, "devflow", "ideas.md");
  const hasIdeas = await fileExists(ideasPath);
  if (hasIdeas) {
    checks.push({
      id: "ideas_inbox",
      name: "Idea Inbox (devflow/ideas.md)",
      status: "pass",
      message: "Found at devflow/ideas.md.",
      fixable: false
    });
  } else {
    let fixed = false;
    if (options.fix) {
      await fs.mkdir(path.dirname(ideasPath), { recursive: true });
      await fs.writeFile(ideasPath, DEFAULT_IDEAS_STUB, "utf8");
      fixed = true;
    }
    checks.push({
      id: "ideas_inbox",
      name: "Idea Inbox (devflow/ideas.md)",
      status: fixed ? "pass" : "warn",
      message: fixed ? "Restored stub at devflow/ideas.md." : "Missing devflow/ideas.md.",
      fixable: true,
      fixed
    });
  }

  // Check 7: History Directory Structure
  const historyDir = path.join(projectRoot, "devflow", "history");
  const historyLedger = path.join(historyDir, "HISTORY.md");
  const featuresDir = path.join(historyDir, "features");
  const fixesDir = path.join(historyDir, "fixes");
  const rollbacksDir = path.join(historyDir, "rollbacks");

  const hasHistory = await dirExists(historyDir);
  const hasLedger = await fileExists(historyLedger);
  const hasFeatures = await dirExists(featuresDir);
  const hasFixes = await dirExists(fixesDir);
  const hasRollbacks = await dirExists(rollbacksDir);

  if (hasHistory && hasLedger && hasFeatures && hasFixes && hasRollbacks) {
    checks.push({
      id: "history_structure",
      name: "History Ledger & Archives (devflow/history/)",
      status: "pass",
      message: "Master ledger and categorized subdirectories (features, fixes, rollbacks) intact.",
      fixable: false
    });
  } else {
    let fixed = false;
    if (options.fix) {
      await fs.mkdir(featuresDir, { recursive: true });
      await fs.mkdir(fixesDir, { recursive: true });
      await fs.mkdir(rollbacksDir, { recursive: true });
      if (!hasLedger) {
        await fs.writeFile(historyLedger, DEFAULT_HISTORY_STUB, "utf8");
      }
      fixed = true;
    }
    checks.push({
      id: "history_structure",
      name: "History Ledger & Archives (devflow/history/)",
      status: fixed ? "pass" : "warn",
      message: fixed ? "Repaired devflow/history/ directories and HISTORY.md." : "devflow/history/ structure incomplete.",
      fixable: true,
      fixed
    });
  }

  // Check 8: Reference & Discoveries Directories
  const refDir = path.join(projectRoot, "devflow", "reference");
  const discDir = path.join(projectRoot, "devflow", "discoveries");
  const hasRef = await dirExists(refDir);
  const hasDisc = await dirExists(discDir);

  if (hasRef && hasDisc) {
    checks.push({
      id: "reference_discoveries",
      name: "Support Folders (reference/ & discoveries/)",
      status: "pass",
      message: "Folders present for document conversion and discovery storage.",
      fixable: false
    });
  } else {
    let fixed = false;
    if (options.fix) {
      await fs.mkdir(refDir, { recursive: true });
      await fs.mkdir(discDir, { recursive: true });
      fixed = true;
    }
    checks.push({
      id: "reference_discoveries",
      name: "Support Folders (reference/ & discoveries/)",
      status: fixed ? "pass" : "warn",
      message: fixed ? "Created devflow/reference/ and devflow/discoveries/." : "Missing reference/ or discoveries/ folder.",
      fixable: true,
      fixed
    });
  }

  // Check 9: Configuration (devflow/config.json)
  const configResult = await readProjectConfig(projectRoot);
  if (configResult.state === "project") {
    checks.push({
      id: "project_configuration",
      name: "Project Configuration (devflow/config.json)",
      status: "pass",
      message: "Valid devflow/config.json configuration detected.",
      fixable: false
    });
  } else if (configResult.state === "defaults") {
    checks.push({
      id: "project_configuration",
      name: "Project Configuration (devflow/config.json)",
      status: "pass",
      message: "Built-in defaults active (devflow/config.json not present).",
      fixable: false
    });
  } else {
    checks.push({
      id: "project_configuration",
      name: "Project Configuration (devflow/config.json)",
      status: "warn",
      message: configResult.warnings.map((w) => w.message).join(" "),
      fixable: false
    });
  }

  // Check 10: Third-Party Skills & Extensions
  const agentsSkillsDir = path.join(projectRoot, ".agents", "skills");
  if (await dirExists(agentsSkillsDir)) {
    try {
      const { listInstalledSkills, syncSkills } = await import("./skill-manager.js");
      const inventory = await listInstalledSkills(projectRoot);
      if (inventory.thirdPartySkills.length > 0) {
        const desynced = inventory.thirdPartySkills.filter((s) => !s.synced);
        if (desynced.length > 0) {
          let fixed = false;
          if (options.fix) {
            await syncSkills(projectRoot);
            fixed = true;
          }
          checks.push({
            id: "third_party_skills",
            name: "Third-Party Skills & Extensions",
            status: fixed ? "pass" : "warn",
            message: fixed
              ? `Auto-synced ${inventory.thirdPartySkills.length} third-party skill(s) across adapters.`
              : `${inventory.thirdPartySkills.length} third-party skill(s) detected (${desynced.map((d) => d.name).join(", ")} out of sync). Run 'nexus-devflow skill sync' or '--fix' to resolve.`,
            fixable: true,
            fixed
          });
        } else {
          checks.push({
            id: "third_party_skills",
            name: "Third-Party Skills & Extensions",
            status: "pass",
            message: `${inventory.thirdPartySkills.length} third-party skill(s) installed and synchronized (${inventory.thirdPartySkills.map((s) => s.name).join(", ")}).`,
            fixable: false
          });
        }
      }
    } catch {
      // ignore
    }
  }

  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;
  let fixedCount = 0;

  for (const c of checks) {
    if (c.fixed) fixedCount++;
    if (c.status === "pass") passCount++;
    else if (c.status === "warn") warnCount++;
    else if (c.status === "fail") failCount++;
  }

  return {
    projectRoot,
    isDevFlowProject: isDevFlow,
    checks,
    totalChecks: checks.length,
    passCount,
    warnCount,
    failCount,
    fixedCount
  };
}

export function formatDoctorHuman(
  report: DoctorReport,
  options: { color?: boolean } = {}
): string {
  const style = createStyle(options.color);
  const lines: string[] = [];

  lines.push(
    style.bold(
      `Nexus-DevFlow Doctor Health Report (${report.passCount} passed, ${report.warnCount} warnings, ${report.failCount} failed)`
    )
  );
  if (report.fixedCount > 0) {
    lines.push(style.green(`  ⚡ Auto-healed ${report.fixedCount} items via --fix`));
  }
  lines.push("");

  for (const check of report.checks) {
    let icon = style.green("✔");
    if (check.status === "warn") icon = style.yellow("⚠");
    if (check.status === "fail") icon = style.red("✖");

    let statusText = style.green("PASS");
    if (check.status === "warn") statusText = style.yellow("WARN");
    if (check.status === "fail") statusText = style.red("FAIL");
    if (check.fixed) statusText = style.cyan("FIXED");

    lines.push(`  ${icon} ${style.bold(check.name)} [${statusText}]`);
    lines.push(`     ${style.dim(check.message)}`);
  }

  lines.push("");
  if (report.warnCount > 0 && report.fixedCount === 0) {
    lines.push(style.yellow("Tip: Run `nexus-devflow doctor --fix` to automatically repair missing context and folders."));
  }

  return lines.join("\n").trimEnd();
}
