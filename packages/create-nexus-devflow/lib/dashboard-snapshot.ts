import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { readCommandCatalog } from "./command-catalog.js";

import type { CommandCatalogItem } from "./command-catalog.js";
import { readDiscoveries } from "./discoveries.js";
import type { DiscoverySummary } from "./discoveries.js";
import { runDoctor } from "./doctor.js";
import type { DoctorCheck, DoctorReport } from "./doctor.js";
import { readHistory } from "./history.js";
import type { HistorySummary } from "./history.js";
import { readProjectStatus } from "./status.js";
import type { ProjectStatus } from "./status.js";
import { checkPackageVersion } from "./version-check.js";
import type { FetchLike, PackageVersionStatus } from "./version-check.js";
import { readWorkflowState } from "./workflow-state.js";
import type { WorkflowState } from "./workflow-state.js";
import { evaluateGate, type GateReport } from "./gatekeeper.js";
import { detectGitDrift, type GitDriftReport } from "./drift-reconciler.js";
import { generateSwarmPlan, type SwarmPlan } from "./swarm-orchestrator.js";
import { buildCodeGraph, type CodeGraph } from "./code-graph.js";
import { DEVFLOW_MCP_TOOLS, type McpToolDefinition } from "./mcp.js";

interface DashboardDoctorSummary {
  checks: DoctorCheck[];
  totalChecks: number;
  passCount: number;
  warnCount: number;
  failCount: number;
}

interface AdapterDashboardItem {
  name: string;
  path: string;
  state: "healthy" | "warning" | "configured";
  message: string;
}

interface DashboardNextAction {
  command: string | null;
  reason: string;
}

export interface RecommendedSkillItem {
  name: string;
  category: "workflow" | "security" | "visual" | "ecosystem";
  title: string;
  description: string;
  installed: boolean;
  installCommand: string;
  installedPath?: string;
}

export interface DashboardActiveTicket {
  id: string;
  title: string;
  status: "done" | "in_progress" | "ready" | "blocked";
  blockedBy: string[];
}

export interface DashboardSnapshot {
  schemaVersion: 1;
  generatedAt: string;
  status: ProjectStatus;
  workflow: WorkflowState;
  history: HistorySummary;
  doctor: DashboardDoctorSummary;
  discoveries: DiscoverySummary;
  update: PackageVersionStatus;
  commands: CommandCatalogItem[];
  adapters: AdapterDashboardItem[];
  nextAction: DashboardNextAction;
  gatekeeper: GateReport;
  drift: GitDriftReport;
  swarm: SwarmPlan;
  graph: {
    totalFiles: number;
    totalEdges: number;
    files: string[];
  };
  mcpTools: McpToolDefinition[];
  recommendedSkills: RecommendedSkillItem[];
  activeTickets: DashboardActiveTicket[];
}



interface DashboardSnapshotOptions {
  fetchImpl?: FetchLike;
  now?: () => number;
  slowTtlMs?: number;
  versionCacheTtlMs?: number;
  versionTimeoutMs?: number;
}

interface SlowData {
  doctor: DoctorReport;
  discoveries: DiscoverySummary;
  commands: CommandCatalogItem[];
  graph: CodeGraph;
}

interface SlowCacheEntry {
  expiresAt: number;
  activeDiscoveryId: string | null;
  value: SlowData;
}

const slowCache = new Map<string, SlowCacheEntry>();

async function readDashboardSnapshot(
  startPath: string = process.cwd(),
  options: DashboardSnapshotOptions = {}
): Promise<DashboardSnapshot> {
  const now = options.now || Date.now;
  const status = await readProjectStatus(startPath);
  const projectRoot = status.project.root;
  const workflow = await readWorkflowState(projectRoot, status.currentWork);

  const driftPromise = detectGitDrift(projectRoot, status.git.branch || undefined);
  const [history, slow, update, drift, swarm] = await Promise.all([
    readHistory(projectRoot),
    readSlowData(projectRoot, workflow.activeDiscoveryId, now, options.slowTtlMs ?? 15_000),
    checkPackageVersion({
      installedVersion: status.devflow.version,
      fetchImpl: options.fetchImpl,
      timeoutMs: options.versionTimeoutMs ?? 1000,
      cacheTtlMs: options.versionCacheTtlMs,
      now
    }),
    driftPromise,
    generateSwarmPlan(projectRoot, { branch: status.git.branch || undefined })
  ]);

  const [gatekeeper, activeTickets] = await Promise.all([
    evaluateGate(projectRoot, { status, drift, strict: false }),
    readActiveTickets(projectRoot, status)
  ]);
  const recommendedSkills = readRecommendedSkills(projectRoot);

  return {
    schemaVersion: 1,
    generatedAt: new Date(now()).toISOString(),
    status,
    workflow,
    history,
    doctor: selectDoctorSummary(slow.doctor),
    discoveries: slow.discoveries,
    update,
    commands: slow.commands,
    adapters: buildAdapterItems(status.devflow.adapters, slow.doctor),
    nextAction: selectDashboardNextAction(status, workflow),
    gatekeeper,
    drift,
    swarm,
    graph: {
      totalFiles: slow.graph.totalFiles,
      totalEdges: slow.graph.totalEdges,
      files: Object.keys(slow.graph.nodes)
    },
    mcpTools: DEVFLOW_MCP_TOOLS,
    recommendedSkills,
    activeTickets
  };
}


async function readSlowData(
  projectRoot: string,
  activeDiscoveryId: string | null,
  now: () => number,
  ttlMs: number
): Promise<SlowData> {
  const cached = slowCache.get(projectRoot);
  if (cached && cached.expiresAt > now() && cached.activeDiscoveryId === activeDiscoveryId) {
    return cached.value;
  }
  const [doctor, discoveries, commands, graph] = await Promise.all([
    runDoctor(projectRoot, { fix: false }),
    readDiscoveries(projectRoot, activeDiscoveryId),
    readCommandCatalog(projectRoot),
    buildCodeGraph(projectRoot)
  ]);
  const value = { doctor, discoveries, commands, graph };
  slowCache.set(projectRoot, { expiresAt: now() + ttlMs, activeDiscoveryId, value });
  return value;
}

function selectDoctorSummary(report: DoctorReport): DashboardDoctorSummary {
  return {
    checks: report.checks,
    totalChecks: report.totalChecks,
    passCount: report.passCount,
    warnCount: report.warnCount,
    failCount: report.failCount
  };
}

function buildAdapterItems(
  adapters: ProjectStatus["devflow"]["adapters"],
  doctor: DoctorReport
): AdapterDashboardItem[] {
  const adapterCheck = doctor.checks.find((check) => check.id === "ai_adapters");
  const state: AdapterDashboardItem["state"] = adapterCheck?.status === "fail"
    ? "warning"
    : adapterCheck?.status === "pass"
    ? "healthy"
    : "configured";
  const paths: Record<string, string> = {
    codex: ".agents/skills/",
    copilot: ".agents/skills/",
    antigravity: ".agents/skills/",
    claude: ".claude/skills/"
  };
  return adapters.map((name) => ({
    name,
    path: paths[name] || "AGENTS.md",
    state,
    message: adapterCheck?.message || "Configured in the Nexus-DevFlow manifest."
  }));
}

function clearDashboardSnapshotCache(): void {
  slowCache.clear();
}

function selectDashboardNextAction(
  status: ProjectStatus,
  workflow: WorkflowState
): DashboardNextAction {
  if (workflow.track !== "idle" && workflow.currentStage) {
    const stageCmd = workflow.currentStage === "feature-fix" ? "feature" : workflow.currentStage;
    const suffix =
      workflow.activeRunId && (workflow.track === "deep" || stageCmd === "complete")
        ? ` ${workflow.activeRunId}`
        : "";
    return {
      command: `/${stageCmd}${suffix}`,
      reason: `Continue active workflow at /${stageCmd}.`
    };
  }
  return status.nextAction;
}

function readRecommendedSkills(projectRoot: string): RecommendedSkillItem[] {
  const checkInstalled = (skillName: string, vendorDir?: string): { installed: boolean; path?: string } => {
    const agentSkill = path.join(projectRoot, ".agents", "skills", skillName);
    const claudeSkill = path.join(projectRoot, ".claude", "skills", skillName);
    const vendorPath = vendorDir ? path.join(projectRoot, "devflow", ".vendor", vendorDir) : null;

    if (fsSync.existsSync(agentSkill)) return { installed: true, path: `.agents/skills/${skillName}` };
    if (fsSync.existsSync(claudeSkill)) return { installed: true, path: `.claude/skills/${skillName}` };
    if (vendorPath && fsSync.existsSync(vendorPath)) return { installed: true, path: `devflow/.vendor/${vendorDir}` };
    return { installed: false };
  };

  const bughunter = checkInstalled("bughunter", "bughunter");
  const archify = checkInstalled("archify");
  const diagram = checkInstalled("diagram-design");
  const ponytail = checkInstalled("ponytail", "ponytail");

  return [
    {
      name: "archify",
      category: "visual",
      title: "Archify Dynamic Diagram Engine",
      description: "Interactive architecture, lifecycle pulse maps, sequence, and state machine HTML/SVG diagrams.",
      installed: archify.installed,
      installedPath: archify.path,
      installCommand: "npx nexus-devflow skill add archify"
    },
    {
      name: "diagram-design",
      category: "visual",
      title: "Diagram Design Enterprise Suite",
      description: "Broad diagramming toolkit for business architectures, IT current-state, process, and data modeling.",
      installed: diagram.installed,
      installedPath: diagram.path,
      installCommand: "npx nexus-devflow skill add diagram-design"
    },
    {
      name: "bughunter",
      category: "security",
      title: "BugHunter Offensive Security Suite",
      description: "Automated vulnerability scanner covering 83 flaw classes and 681 disclosed HackerOne patterns.",
      installed: bughunter.installed,
      installedPath: bughunter.path,
      installCommand: "npx nexus-devflow skill add bughunter"
    },
    {
      name: "ponytail",
      category: "workflow",
      title: "Ponytail Lazy Senior Dev Optimizer",
      description: "YAGNI 7-step decision ladder and token/code bloat cutter (~54% reduction).",
      installed: ponytail.installed,
      installedPath: ponytail.path,
      installCommand: "npx nexus-devflow skill add ponytail"
    }
  ];
}

async function readActiveTickets(projectRoot: string, status: ProjectStatus): Promise<DashboardActiveTicket[]> {
  const contextRoot = path.join(projectRoot, "devflow", "context");
  let targetTicketsDir: string | null = null;

  const primaryRunId = status.currentWork?.runId || (status.activeRuns?.[0]?.runId);
  if (primaryRunId) {
    try {
      const entries = await fs.readdir(contextRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith(primaryRunId)) {
          const candidate = path.join(contextRoot, entry.name, "tickets");
          if (fsSync.existsSync(candidate)) {
            targetTicketsDir = candidate;
            break;
          }
        }
      }
    } catch {}
  }

  if (!targetTicketsDir) {
    try {
      const entries = await fs.readdir(contextRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const candidate = path.join(contextRoot, entry.name, "tickets");
          if (fsSync.existsSync(candidate)) {
            targetTicketsDir = candidate;
            break;
          }
        }
      }
    } catch {}
  }

  if (!targetTicketsDir) {
    return [];
  }

  const tickets: DashboardActiveTicket[] = [];
  try {
    const files = await fs.readdir(targetTicketsDir);
    const mdFiles = files.filter((f) => f.endsWith(".md")).sort();
    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(targetTicketsDir, file), "utf8");
      const idMatch = file.match(/^(\d+)/) || content.match(/-\s+\*\*ID\*\*:\s*([^\r\n]+)/i);
      const id = idMatch ? idMatch[1].trim() : file.replace(/\.md$/, "");

      const titleMatch = content.match(/^#\s+(?:Ticket\s+\d+:\s*)?([^\r\n]+)/m);
      const title = titleMatch ? titleMatch[1].trim() : file;

      let statusValue: DashboardActiveTicket["status"] = "ready";
      if (/Status\*\*:\s*(?:Done|Completed|\[x\])/i.test(content)) {
        statusValue = "done";
      } else if (/Status\*\*:\s*(?:In Progress|Active|running)/i.test(content)) {
        statusValue = "in_progress";
      } else if (/Status\*\*:\s*(?:Blocked)/i.test(content)) {
        statusValue = "blocked";
      }

      const blockedMatch = content.match(/Blocked by\*\*:\s*([^\r\n]+)/i);
      const blockedRaw = blockedMatch ? blockedMatch[1].trim() : "";
      const blockedBy = (blockedRaw && !blockedRaw.toLowerCase().includes("none"))
        ? blockedRaw.split(/[,;\s]+/).filter(Boolean)
        : [];

      if (statusValue !== "done" && statusValue !== "in_progress" && blockedBy.length > 0) {
        statusValue = "blocked";
      }

      tickets.push({
        id,
        title,
        status: statusValue,
        blockedBy
      });
    }
  } catch {}

  return tickets;
}

export { clearDashboardSnapshotCache, readDashboardSnapshot, selectDashboardNextAction, readRecommendedSkills, readActiveTickets };

export type { AdapterDashboardItem, DashboardDoctorSummary, DashboardNextAction, DashboardSnapshotOptions };
