import fs from "node:fs/promises";
import path from "node:path";

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
  runId: string | null;
  steps: CurrentWorkStep[];
  completed: number;
  remaining: number;
  total: number;
  nextStep: CurrentWorkStep | null;
  warnings: CurrentWorkWarning[];
}

const DEVFLOW_CURRENT_FEATURE_PATH = path.join("devflow", "context", "current-feature.md");
const DEVFLOW_CURRENT_RUN_DIR = path.join("devflow", "context", "current-run");
const CURRENT_STAGE_PATH = path.join("devflow", "context", "current-stage.md");
const LEGACY_FEATURE_PATH = path.join("blueprint", "context", "current-feature.md");
const RESET_MARKER = "_Nothing in progress.";
const CHECKBOX_PATTERN = /^\s*-\s+\[([ xX])\]\s+(.+?)\s*$/;

async function readCurrentWork(projectRoot: string): Promise<CurrentWorkSummary> {
  const currentStageFile = path.join(projectRoot, CURRENT_STAGE_PATH);
  const devflowFeatureFile = path.join(projectRoot, DEVFLOW_CURRENT_FEATURE_PATH);

  // 1. Root Switch Authority: Check devflow/context/current-stage.md
  try {
    const stageStats = await fs.lstat(currentStageFile).catch(() => null);
    if (stageStats?.isFile()) {
      const stageContent = await fs.readFile(currentStageFile, "utf8");
      const track = extractStageField(stageContent, "Track")?.toLowerCase();
      const activeRunningId = extractStageField(stageContent, "Active Running ID");
      const activeDiscoveryId = extractStageField(stageContent, "Active Discovery ID");
      const currentStage = extractStageField(stageContent, "Current Stage");

      const isExplicitIdle = track === "idle" ||
        (!track && activeRunningId?.toLowerCase() === "none" && currentStage?.toLowerCase().startsWith("idle"));

      if (!isExplicitIdle) {
        if (track === "deep" || (!track && (activeDiscoveryId || (activeRunningId && activeRunningId.toLowerCase() !== "none")))) {
          const runSummary = await readDeepTrackWork(projectRoot, activeRunningId);
          if (runSummary.state === "active") {
            return runSummary;
          }
        }

        if (track === "fast" || !track) {
          const fastSummary = await readFastTrackWork(devflowFeatureFile);
          if (fastSummary.state === "active") {
            if (activeRunningId && activeRunningId.toLowerCase() !== "none") {
              fastSummary.runId = activeRunningId;
            }
            return fastSummary;
          }
        }
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Auto-Detect & Auto-Sync Fallback:
  // If current-stage.md is idle or missing, check if active spec exists in current-feature.md or current-run/
  const fastSummary = await readFastTrackWork(devflowFeatureFile);
  if (fastSummary.state === "active") {
    return fastSummary;
  }

  const deepSummary = await readDeepTrackWork(projectRoot, null);
  if (deepSummary.state === "active") {
    return deepSummary;
  }

  // 3. Fallback to legacy blueprint/context/current-feature.md
  const legacyPath = path.join(projectRoot, LEGACY_FEATURE_PATH);
  try {
    const stats = await fs.lstat(legacyPath).catch(() => null);
    if (stats?.isFile()) {
      const content = await fs.readFile(legacyPath, "utf8");
      return parseCurrentWork(content);
    }
  } catch {
    // Return idle
  }

  return idleSummary();
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
      if (content.trim() !== "" && !content.includes(RESET_MARKER)) {
        return parseCurrentWork(content);
      }
    }
  } catch {
    // Return idle
  }
  return idleSummary();
}

async function readDeepTrackWork(
  projectRoot: string,
  activeRunningId: string | null
): Promise<CurrentWorkSummary> {
  // Check devflow/context/current-run/
  const currentRunDir = path.join(projectRoot, DEVFLOW_CURRENT_RUN_DIR);
  try {
    const runStats = await fs.lstat(currentRunDir).catch(() => null);
    if (runStats?.isDirectory()) {
      const featurePath = path.join(currentRunDir, "current-feature.md");
      const specPath = path.join(currentRunDir, "20-spec.md");
      const checklistPath = path.join(currentRunDir, "checklists", "implementation-checklist.md");

      const specFile = (await fs.lstat(featurePath).catch(() => null))?.isFile()
        ? featurePath
        : (await fs.lstat(specPath).catch(() => null))?.isFile()
        ? specPath
        : null;

      if (specFile) {
        const specContent = await fs.readFile(specFile, "utf8");
        const parsed = parseCurrentWork(specContent);
        if (parsed.state === "active") {
          if (activeRunningId) parsed.runId = activeRunningId;
          parsed.type = "stage";
          return parsed;
        }
      }

      const checkStats = await fs.lstat(checklistPath).catch(() => null);
      if (checkStats?.isFile()) {
        const checklistContent = await fs.readFile(checklistPath, "utf8");
        return parseChecklistWork(checklistContent, activeRunningId || "current-run");
      }
    }
  } catch {
    // Continue
  }

  // Check legacy active run directory under devflow/runs/
  if (activeRunningId && activeRunningId.toLowerCase() !== "none") {
    const activeRunDir = path.join(projectRoot, "devflow", "runs", activeRunningId);
    try {
      const featurePath = path.join(activeRunDir, "current-feature.md");
      const legacySpecPath = path.join(activeRunDir, "spec.md");
      const stage20Path = path.join(activeRunDir, "20-spec.md");
      const specPath = (await fs.lstat(featurePath).catch(() => null))?.isFile()
        ? featurePath
        : (await fs.lstat(stage20Path).catch(() => null))?.isFile()
        ? stage20Path
        : (await fs.lstat(legacySpecPath).catch(() => null))?.isFile()
        ? legacySpecPath
        : null;

      if (specPath) {
        const specContent = await fs.readFile(specPath, "utf8");
        const parsed = parseCurrentWork(specContent);
        parsed.runId = activeRunningId;
        parsed.type = "stage";
        return parsed;
      }

      const checklistPath = path.join(activeRunDir, "checklists", "implementation-checklist.md");
      const checklistStats = await fs.lstat(checklistPath).catch(() => null);
      if (checklistStats?.isFile()) {
        const checklistContent = await fs.readFile(checklistPath, "utf8");
        return parseChecklistWork(checklistContent, activeRunningId);
      }
    } catch {
      // Continue
    }
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
    /Nothing in progress|None in progress/i.test(markdown)
  ) {
    return idleSummary();
  }

  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || null;
  const headingIdentity = heading?.match(/^(?:(?:\d{2}|[0-9]+)\s+)?(Feature|Fix|Rollback|Stage|Spec):\s*(.+)$/i);
  const explicitType = markdown.match(
    /^\*\*Type:\*\*\s*(Feature|Fix|Rollback|Stage|Spec)\s*$/im
  )?.[1];
  const typeLabel = explicitType || headingIdentity?.[1] || null;
  const type = normalizeWorkType(typeLabel);
  const title = headingIdentity?.[2]?.trim() || heading;
  const status = markdown.match(/^\*\*Status:\*\*\s*(.+)$/im)?.[1]?.trim() || null;
  const runId = markdown.match(/^\*\*Running ID:\*\*\s*`?([A-Za-z0-9-_]+)`?/im)?.[1] || null;
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
    runId,
    steps: normalizedSteps,
    completed,
    remaining: normalizedSteps.length - completed,
    total: normalizedSteps.length,
    nextStep: normalizedSteps.find((step) => !step.checked) || null,
    warnings
  };
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
        title: match[2].trim()
      });
    }
  }

  return steps;
}

function normalizeWorkType(label: string | null): CurrentWorkType | null {
  if (!label) return null;
  const normalized = label.toLowerCase();
  if (normalized === "feature") return "feature";
  if (normalized === "fix") return "fix";
  if (normalized === "rollback") return "rollback";
  if (normalized === "stage" || normalized === "spec") return "stage";
  return null;
}

function idleSummary(): CurrentWorkSummary {
  return {
    state: "idle",
    type: null,
    title: null,
    status: null,
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
  parseCurrentWork
};

export type {
  CurrentWorkSummary,
  CurrentWorkStep,
  CurrentWorkWarning,
  CurrentWorkState,
  CurrentWorkType
};
