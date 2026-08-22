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

interface DashboardSnapshot {
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
  const [history, slow, update] = await Promise.all([
    readHistory(projectRoot),
    readSlowData(projectRoot, workflow.activeDiscoveryId, now, options.slowTtlMs ?? 15_000),
    checkPackageVersion({
      installedVersion: status.devflow.version,
      fetchImpl: options.fetchImpl,
      timeoutMs: options.versionTimeoutMs,
      cacheTtlMs: options.versionCacheTtlMs,
      now
    })
  ]);

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
    nextAction: selectDashboardNextAction(status, workflow)
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
  const [doctor, discoveries, commands] = await Promise.all([
    runDoctor(projectRoot, { fix: false }),
    readDiscoveries(projectRoot, activeDiscoveryId),
    readCommandCatalog(projectRoot)
  ]);
  const value = { doctor, discoveries, commands };
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
  if (workflow.track !== "deep" || !workflow.currentStage) {
    return status.nextAction;
  }
  const suffix = workflow.activeRunId ? ` ${workflow.activeRunId}` : "";
  return {
    command: `/${workflow.currentStage}${suffix}`,
    reason: `Continue the active Deep-Track run at ${workflow.currentStage}.`
  };
}

export { clearDashboardSnapshotCache, readDashboardSnapshot, selectDashboardNextAction };
export type { AdapterDashboardItem, DashboardDoctorSummary, DashboardNextAction, DashboardSnapshot, DashboardSnapshotOptions };
