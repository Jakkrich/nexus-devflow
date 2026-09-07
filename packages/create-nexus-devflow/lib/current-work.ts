import fs from "node:fs/promises";
import path from "node:path";

import { resolveActiveContextPaths } from "./branch-context.js";

type CurrentWorkState = "active" | "idle" | "malformed";
type CurrentWorkType = "feature" | "fix" | "rollback" | "stage";

interface CurrentWorkStep {
  checked: boolean;
  line: number;
  title: string;
}

type CurrentWorkWarningCode =
  | "empty_current_work"
  | "invalid_current_work_path"
  | "malformed_current_work"
  | "missing_current_work"
  | "unsafe_current_work_path";

interface CurrentWorkWarning {
  code: CurrentWorkWarningCode;
  message: string;
}

interface CurrentWorkSummary {
  state: CurrentWorkState;
  type: CurrentWorkType | null;
  title: string | null;
  status: string | null;
  buildPlanItem: string | null;
  runId: string | null;
  steps: CurrentWorkStep[];
  completed: number;
  remaining: number;
  total: number;
  nextStep: CurrentWorkStep | null;
  warnings: CurrentWorkWarning[];
}

const RESET_MARKER = "_Nothing in progress.";
const CHECKBOX_PATTERN = /^\s*-\s+\[([ xX])\]\s+(.+?)\s*$/;
const COMPATIBILITY_FEATURE_PATTERN = /^\*\*Feature ([0-9]+[a-zA-Z]?): ([^*\r\n]+)\*\*\s*$/m;

import { ActiveContextEngine } from "./active-context-engine.js";

async function readCurrentWork(projectRoot: string): Promise<CurrentWorkSummary> {
  const engine = new ActiveContextEngine(projectRoot);
  return engine.getCurrentWork();
}


function extractStageField(markdown: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(
    new RegExp(`^-\\s+(?:\\*\\*)?${escaped}(?:\\*\\*)?:\\s*\\x60?([^\\r\\n\\x60]+)`, "im")
  );
  const value = match?.[1]?.trim() || "";
  return value === "" || value.toLowerCase() === "none" || value.toLowerCase() === "idle"
    ? null
    : value;
}

async function readFastTrackWork(featurePath: string): Promise<CurrentWorkSummary> {
  try {
    const stats = await fs.lstat(featurePath).catch(() => null);
    if (stats?.isFile()) {
      const content = await fs.readFile(featurePath, "utf8");
      if (
        content.trim() !== "" &&
        !content.includes(RESET_MARKER) &&
        !/Nothing in progress|None in progress|No active feature|No active work/i.test(content)
      ) {
        return parseCurrentWork(content);
      }
    }
  } catch {
    // Return idle
  }
  return idleSummary();
}

function parseCurrentWork(markdown: string): CurrentWorkSummary {
  if (markdown.trim() === "") {
    return malformedSummary({
      code: "empty_current_work",
      message: "Current work file is empty."
    });
  }

  if (
    markdown.includes(RESET_MARKER) ||
    /Nothing in progress|None in progress|No active feature|No active work/i.test(markdown)
  ) {
    return idleSummary();
  }

  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || null;
  const headingIdentity = heading?.match(/^(?:(?:\d{2}|[0-9]+)\s+)?(Feature|Fix|Rollback|Stage|Spec):\s*(.+)$/i);
  const fieldIdentity = markdown.match(
    /^\*\*(Feature|Fix|Rollback|Stage|Spec):\*\*\s*(.+)$/im
  );
  const explicitType = markdown.match(
    /^\*\*Type:\*\*\s*(Feature|Fix|Rollback|Stage|Spec)\s*$/im
  )?.[1];
  const canonicalType = normalizeWorkType(
    explicitType || headingIdentity?.[1] || fieldIdentity?.[1] || null
  );
  const compatibilityFeature = !canonicalType || canonicalType === "feature"
    ? parseCompatibilityFeature(markdown, heading)
    : null;
  const typeLabel = canonicalType || (compatibilityFeature ? "Feature" : null);
  const type = normalizeWorkType(typeLabel);
  const fieldValue = fieldIdentity?.[2]?.trim() || null;
  const fieldFeatureIdentity = type === "feature"
    ? fieldValue?.match(/^([0-9]+[a-z]?)\.?(?:\s+|$)(.*)$/i)
    : null;
  const title = headingIdentity?.[2]?.trim() ||
    fieldFeatureIdentity?.[2]?.trim() ||
    fieldValue ||
    compatibilityFeature?.title ||
    heading;
  const status = markdown.match(/^\*\*Status:\*\*\s*(.+)$/im)?.[1]?.trim() || null;
  const runId = markdown.match(/^\*\*Running ID:\*\*\s*`?([A-Za-z0-9-_]+)`?/im)?.[1] || null;
  const explicitBuildPlanItem = markdown.match(
    /^\*\*From build-plan:\*\*\s*feature\s+([0-9]+[a-z]?)\b/im
  )?.[1]?.toLowerCase() || null;
  const buildPlanItem = explicitBuildPlanItem ||
    fieldFeatureIdentity?.[1]?.toLowerCase() ||
    compatibilityFeature?.id ||
    null;
  const steps = parseChecklistSteps(markdown);
  const warnings: CurrentWorkWarning[] = [];

  if (!title) {
    warnings.push({
      code: "malformed_current_work",
      message: "Current work does not contain a recognizable title."
    });
  }

  const normalizedSteps = steps || [];
  const completed = normalizedSteps.filter((step) => step.checked).length;

  return {
    state: warnings.length > 0 ? "malformed" : "active",
    type: type || "feature",
    title,
    status,
    buildPlanItem,
    runId,
    steps: normalizedSteps,
    completed,
    remaining: normalizedSteps.length - completed,
    total: normalizedSteps.length,
    nextStep: normalizedSteps.find((step) => !step.checked) || null,
    warnings
  };
}

function parseCompatibilityFeature(
  markdown: string,
  heading: string | null
): { id: string; title: string } | null {
  if (heading?.toLowerCase() !== "current feature") {
    return null;
  }

  const match = markdown.match(COMPATIBILITY_FEATURE_PATTERN);
  const id = match?.[1]?.toLowerCase() || null;
  const title = match?.[2]?.trim() || null;
  return id && title ? { id, title } : null;
}

function parseChecklistWork(markdown: string, runId: string): CurrentWorkSummary {
  const steps = parseChecklistSteps(markdown) || [];
  const completed = steps.filter((step) => step.checked).length;
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "Implementation";

  return {
    state: "active",
    type: "stage",
    title: heading,
    status: "in_progress",
    buildPlanItem: null,
    runId,
    steps,
    completed,
    remaining: steps.length - completed,
    total: steps.length,
    nextStep: steps.find((step) => !step.checked) || null,
    warnings: []
  };
}

function parseChecklistSteps(markdown: string): CurrentWorkStep[] {
  const lines = markdown.split(/\r?\n/);
  const steps: CurrentWorkStep[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(CHECKBOX_PATTERN);
    if (match) {
      steps.push({
        checked: match[1].toLowerCase() === "x",
        line: index + 1,
        title: parseStepTitle(match[2].trim())
      });
    }
  }

  return steps;
}

function parseStepTitle(content: string): string {
  const boldTitle = content.match(/^(?:\d+\.\s*)?\*\*(.+?)\*\*/)?.[1];
  const label = boldTitle || content.split(/\s+-\s+/, 1)[0] || content;
  return label.replace(/^Step\s+\d+\s*[-:]\s*/i, "").trim();
}

function normalizeWorkType(label: string | null): CurrentWorkType | null {
  if (!label) return null;
  const normalized = label.toLowerCase();
  if (normalized === "feature" || normalized === "spec" || normalized === "stage") return "feature";
  if (normalized === "fix") return "fix";
  if (normalized === "rollback") return "rollback";
  return null;
}

function idleSummary(): CurrentWorkSummary {
  return {
    state: "idle",
    type: null,
    title: null,
    status: null,
    buildPlanItem: null,
    runId: null,
    steps: [],
    completed: 0,
    remaining: 0,
    total: 0,
    nextStep: null,
    warnings: []
  };
}

function malformedSummary(warning: CurrentWorkWarning): CurrentWorkSummary {
  return {
    state: "malformed",
    type: null,
    title: null,
    status: null,
    buildPlanItem: null,
    runId: null,
    steps: [],
    completed: 0,
    remaining: 0,
    total: 0,
    nextStep: null,
    warnings: [warning]
  };
}

export {
  readCurrentWork,
  parseCurrentWork,
  parseCompatibilityFeature
};

export type {
  CurrentWorkSummary,
  CurrentWorkStep,
  CurrentWorkWarning,
  CurrentWorkState,
  CurrentWorkType
};
