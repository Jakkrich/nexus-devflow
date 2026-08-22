import fs from "node:fs/promises";
import path from "node:path";

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
const DEEP_STAGES = [
  "00-explore",
  "10-define",
  "20-spec",
  "30-plan",
  "40-execute",
  "50-verify",
  "60-report",
  "70-deliver"
] as const;

async function readWorkflowState(
  projectRoot: string,
  currentWork: StatusCurrentWork
): Promise<WorkflowState> {
  const stagePath = path.join(projectRoot, "devflow", "context", "current-stage.md");
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
  const deepStage = normalizeDeepStage(rawStage);

  let track: WorkflowTrack = "idle";
  let currentStage: string | null = null;

  if (explicitTrack === "deep") {
    track = "deep";
    currentStage = deepStage || (activeDiscoveryId ? "00-explore" : "10-define");
  } else if (explicitTrack === "fast") {
    track = "fast";
    currentStage = fastStage(currentWork);
  } else if (explicitTrack === "idle") {
    track = "idle";
    currentStage = null;
  } else if (activeRunId && deepStage) {
    track = "deep";
    currentStage = deepStage;
  } else if (activeDiscoveryId) {
    track = "deep";
    currentStage = "00-explore";
  } else if (currentWork.state === "active") {
    track = currentWork.type === "stage" ? "deep" : "fast";
    currentStage = track === "deep" ? deepStage || "40-execute" : fastStage(currentWork);
  }

  return {
    track,
    currentStage,
    activeDiscoveryId,
    activeRunId,
    lastCompletedRun,
    lastUpdated,
    fast: buildPipeline(FAST_STAGES, track === "fast" ? currentStage : null),
    deep: buildPipeline(DEEP_STAGES, track === "deep" ? currentStage : null)
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

function normalizeDeepStage(value: string | null): string | null {
  if (!value) return null;
  const handoff = value.match(/(?:ready\s+for|executing)\s+(00-explore|10-define|20-spec|30-plan|40-execute|50-verify|60-report|70-deliver)/i)?.[1];
  const direct = value.match(/\b(00-explore|10-define|20-spec|30-plan|40-execute|50-verify|60-report|70-deliver)\b/i)?.[1];
  return (handoff || direct || "").toLowerCase() || null;
}

function fastStage(work: StatusCurrentWork): string {
  if (work.total === 0) return "implement";
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
