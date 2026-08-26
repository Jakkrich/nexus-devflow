import fs from "node:fs/promises";
import path from "node:path";

import { resolveActiveRunContext } from "./branch-context.js";
import type { StatusCurrentWork } from "./status.js";

type WorkflowTrack = "fast" | "deep" | "idle";
type WorkflowNodeState = "done" | "active" | "pending";

interface WorkflowNode {
  id: string;
  label: string;
  command: string;
  state: WorkflowNodeState;
}

interface WorkflowState {
  track: WorkflowTrack;
  currentStage: string | null;
  activeDiscoveryId: string | null;
  activeRunId: string | null;
  lastCompletedRun: string | null;
  lastUpdated: string | null;
  fast: WorkflowNode[];
  deep: WorkflowNode[];
}

const FAST_STAGES = ["feature-fix", "implement", "check", "complete"] as const;
const PREFLIGHT_STAGES = ["idea", "grill", "brainstorm", "discovery"] as const;

async function readWorkflowState(
  projectRoot: string,
  currentWork: StatusCurrentWork
): Promise<WorkflowState> {
  const runContext = await resolveActiveRunContext(projectRoot);
  const stagePath = runContext.stagePath || path.join(projectRoot, "devflow", "context", "current-stage.md");
  let markdown = "";
  try {
    markdown = await fs.readFile(stagePath, "utf8");
  } catch (error: unknown) {
    if (getErrorCode(error) !== "ENOENT") throw error;
  }

  return parseWorkflowState(markdown, currentWork);
}

function parseWorkflowState(
  markdown: string,
  currentWork: StatusCurrentWork
): WorkflowState {
  const explicitTrack = nullableField(markdown, "Track")?.toLowerCase();
  const activeDiscoveryId = nullableField(markdown, "Active Discovery ID");
  const activeRunId = nullableField(markdown, "Active Running ID");
  const rawStage = nullableField(markdown, "Current Stage");
  const lastCompletedRun = nullableField(markdown, "Last Completed Run");
  const lastUpdated = nullableField(markdown, "Last Updated");
  const preflightStage = normalizePreflightStage(rawStage);
  const fastStageFromMarkdown = normalizeFastStage(rawStage);

  const isExplicitIdle = explicitTrack === "idle" || explicitTrack === "none";
  const isExplicitFast = Boolean(explicitTrack?.includes("fast") || explicitTrack?.includes("living"));
  const isExplicitDeep = Boolean(explicitTrack?.includes("deep") || explicitTrack?.includes("preflight") || explicitTrack?.includes("discovery"));

  let track: WorkflowTrack = "idle";
  let currentStage: string | null = null;

  const isIdle =
    isExplicitIdle ||
    (rawStage === null && currentWork.state === "idle" && !activeRunId && !activeDiscoveryId);

  if (isIdle) {
    track = "idle";
    currentStage = null;
  } else if (isExplicitFast || (activeRunId && currentWork.state === "active")) {
    track = "fast";
    currentStage = fastStageFromMarkdown || fastStage(currentWork);
  } else if (isExplicitDeep || activeDiscoveryId) {
    track = "deep";
    currentStage = preflightStage || "discovery";
  } else if (currentWork.state === "active") {
    track = "fast";
    currentStage = fastStageFromMarkdown || fastStage(currentWork);
  }

  return {
    track,
    currentStage,
    activeDiscoveryId,
    activeRunId,
    lastCompletedRun,
    lastUpdated,
    fast: buildPipeline(FAST_STAGES, track === "fast" ? currentStage : null),
    deep: buildPipeline(PREFLIGHT_STAGES, track === "deep" ? currentStage : null)
  };
}

function nullableField(markdown: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(
    new RegExp(`^-\\s+(?:\\*\\*)?${escaped}(?:\\*\\*)?:\\s*\\x60?([^\\r\\n\\x60]+)`, "im")
  );
  const value = match?.[1]?.trim() || "";
  return value === "" || value.toLowerCase() === "none" || value.toLowerCase() === "idle"
    ? null
    : value;
}

function normalizePreflightStage(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/\b(idea|grill|brainstorm|discovery|explore)\b/i)?.[1];
  if (!match) return null;
  const raw = match.toLowerCase();
  if (raw === "explore") return "discovery";
  return raw;
}

function normalizeFastStage(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/\b(feature|fix|feature-fix|implement|check|complete)\b/i)?.[1];
  if (!match) return null;
  const normalized = match.toLowerCase();
  if (normalized === "feature" || normalized === "fix") return "feature-fix";
  return normalized;
}

function fastStage(work: StatusCurrentWork): string {
  if (work.state === "idle") return "feature-fix";
  if (work.completed === 0 && work.total > 0) return "implement";
  return work.remaining > 0 ? "implement" : "check";
}


function buildPipeline(
  stages: readonly string[],
  activeStage: string | null
): WorkflowNode[] {
  const activeIndex = activeStage ? stages.indexOf(activeStage) : -1;
  return stages.map((stage, index) => ({
    id: stage,
    label: stage === "feature-fix" ? "feature / fix" : stage,
    command: stage === "feature-fix" ? "/feature · /fix" : `/${stage}`,
    state: activeIndex < 0
      ? "pending"
      : index < activeIndex
      ? "done"
      : index === activeIndex
      ? "active"
      : "pending"
  }));
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
    ? error.code
    : undefined;
}

export { parseWorkflowState, readWorkflowState };
export type { WorkflowNode, WorkflowNodeState, WorkflowState, WorkflowTrack };
