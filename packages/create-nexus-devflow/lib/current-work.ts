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

const CURRENT_STAGE_PATH = path.join("devflow", "context", "current-stage.md");
const LEGACY_FEATURE_PATH = path.join("blueprint", "context", "current-feature.md");
const RESET_MARKER = "_Nothing in progress.";
const CHECKBOX_PATTERN = /^\s*-\s+\[([ xX])\]\s+(.+?)\s*$/;

async function readCurrentWork(projectRoot: string): Promise<CurrentWorkSummary> {
  // First, check active run living spec in devflow/runs/
  const devflowRunsDir = path.join(projectRoot, "devflow", "runs");
  try {
    const runsStats = await fs.lstat(devflowRunsDir).catch(() => null);
    if (runsStats?.isDirectory()) {
      const runEntries = (await fs.readdir(devflowRunsDir)).sort().reverse();
      for (const runDirName of runEntries) {
        const runDirPath = path.join(devflowRunsDir, runDirName);
        const dirStats = await fs.lstat(runDirPath).catch(() => null);
        if (!dirStats?.isDirectory()) continue;

        // Check for spec.md or checklists
        const specPath = path.join(runDirPath, "spec.md");
        const specStats = await fs.lstat(specPath).catch(() => null);
        if (specStats?.isFile()) {
          const specContent = await fs.readFile(specPath, "utf8");
          const parsed = parseCurrentWork(specContent);
          if (parsed.state === "active") {
            parsed.runId = runDirName;
            return parsed;
          }
        }

        // Check for 30-plan or implementation-checklist
        const checklistPath = path.join(runDirPath, "checklists", "implementation-checklist.md");
        const checklistStats = await fs.lstat(checklistPath).catch(() => null);
        if (checklistStats?.isFile()) {
          const checklistContent = await fs.readFile(checklistPath, "utf8");
          const parsed = parseChecklistWork(checklistContent, runDirName);
          if (parsed.state === "active") {
            return parsed;
          }
        }
      }
    }
  } catch {
    // Continue to current-stage.md
  }

  // Next, check current-stage.md or legacy current-feature.md
  const candidates = [
    path.join(projectRoot, CURRENT_STAGE_PATH),
    path.join(projectRoot, LEGACY_FEATURE_PATH)
  ];

  for (const currentWorkPath of candidates) {
    try {
      const stats = await fs.lstat(currentWorkPath);

      if (stats.isSymbolicLink()) {
        return malformedSummary({
          code: "unsafe_current_work_path",
          message: "Current work file is a symbolic link and was not read."
        });
      }

      if (!stats.isFile()) {
        continue;
      }

      const content = await fs.readFile(currentWorkPath, "utf8");
      return parseCurrentWork(content);
    } catch (error: unknown) {
      if (getErrorCode(error) === "ENOENT") {
        continue;
      }
      throw error;
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

  if (markdown.includes(RESET_MARKER)) {
    return idleSummary();
  }

  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || null;
  const headingIdentity = heading?.match(/^(Feature|Fix|Rollback|Stage|Spec):\s*(.+)$/i);
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
    status: "In Progress",
    runId,
    steps,
    completed,
    remaining: steps.length - completed,
    total: steps.length,
    nextStep: steps.find((step) => !step.checked) || null,
    warnings: []
  };
}

function parseChecklistSteps(markdown: string): CurrentWorkStep[] | null {
  const lines = markdown.split(/\r?\n/);
  const candidates: CurrentWorkStep[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] || "";
    const match = line.match(CHECKBOX_PATTERN);
    if (!match) {
      continue;
    }

    const marker = match[1] || "";
    const content = match[2] || "";
    candidates.push({
      checked: marker.toLowerCase() === "x",
      line: index + 1,
      title: parseStepTitle(content)
    });
  }

  return candidates.length > 0 ? candidates : null;
}

function parseStepTitle(content: string): string {
  const boldTitle = content.match(/^\*\*(.+?)\*\*/)?.[1];
  const label = boldTitle || content.split(/\s+-\s+/, 1)[0] || content;
  return label.replace(/^Step\s+\d+\s*[-:]\s*/i, "").trim();
}

function normalizeWorkType(value: string | null): CurrentWorkType | null {
  const normalized = value?.toLowerCase();

  if (normalized === "feature" || normalized === "fix" || normalized === "rollback" || normalized === "stage" || normalized === "spec") {
    return normalized === "spec" ? "feature" : (normalized as CurrentWorkType);
  }

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
    ...idleSummary(),
    state: "malformed",
    warnings: [warning]
  };
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : undefined;
}

export { CURRENT_STAGE_PATH, parseCurrentWork, readCurrentWork };

export type {
  CurrentWorkState,
  CurrentWorkStep,
  CurrentWorkSummary,
  CurrentWorkType,
  CurrentWorkWarning,
  CurrentWorkWarningCode
};
