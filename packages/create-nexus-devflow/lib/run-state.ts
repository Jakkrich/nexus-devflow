import fs from "node:fs/promises";
import path from "node:path";

type RunStateKind = "idle" | "recorded" | "malformed";
type RunStatus = "running" | "blocked" | "ready" | "completed";
type RunMode = "manual" | "autopilot" | "continuous";
type RunBoundary = "read-only" | "reviewed" | "local-only";
type RunFreshness = "current" | "stale";

interface RunProgress {
  current: number;
  total: number;
  label: string;
}

interface RunFeature {
  id: string | null;
  title: string;
}

interface RunHandoff {
  decisions?: string[];
  touchedFiles?: string[];
  nextStep?: string;
  notes?: string;
}

interface RunStateWarning {
  code:
    | "invalid_run_state_path"
    | "malformed_run_state"
    | "unsafe_run_state_path";
  message: string;
}

interface RunStateSummary {
  state: RunStateKind;
  mode: RunMode;
  runId?: string | null;
  branch?: string | null;
  worktreePath?: string | null;
  command: string | null;
  status: RunStatus | null;
  freshness: RunFreshness | null;
  summary: string | null;
  detail: string | null;
  boundary: RunBoundary | null;
  startedAt: string | null;
  updatedAt: string | null;
  resumeCommand: string | null;
  progress: RunProgress | null;
  feature: RunFeature | null;
  handoff?: RunHandoff | null;
  warnings: RunStateWarning[];
}

interface RunStateCollectionSummary {
  primary: RunStateSummary;
  runs: RunStateSummary[];
  warnings: RunStateWarning[];
}

const RUN_STATE_PATH = path.join("devflow", ".state", "run.json");
const RUNS_STATE_DIR = path.join("devflow", ".state", "runs");
const COMMAND_PATTERN = /^[a-z][a-z-]{0,31}$/;
const RUN_ID_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const RUN_STATUSES = new Set<RunStatus>([
  "running",
  "blocked",
  "ready",
  "completed"
]);
const RUN_BOUNDARIES = new Set<RunBoundary>([
  "read-only",
  "reviewed",
  "local-only"
]);
const RUN_STALE_AFTER_MS = 60 * 60 * 1000;

async function readRunState(
  projectRoot: string,
  now: Date = new Date()
): Promise<RunStateSummary> {
  const runStatePath = path.join(projectRoot, RUN_STATE_PATH);

  try {
    const stats = await fs.lstat(runStatePath);

    if (stats.isSymbolicLink()) {
      return malformedSummary({
        code: "unsafe_run_state_path",
        message: "Run state is a symbolic link and was not read."
      });
    }

    if (!stats.isFile()) {
      return malformedSummary({
        code: "invalid_run_state_path",
        message: "Run state path is not a regular file."
      });
    }

    return parseRunState(await fs.readFile(runStatePath, "utf8"), now);
  } catch (error: unknown) {
    if (getErrorCode(error) === "ENOENT") {
      return idleSummary();
    }

    throw error;
  }
}

function parseRunState(value: string, now: Date = new Date()): RunStateSummary {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    return malformedSummary({
      code: "malformed_run_state",
      message: "Run state is not valid JSON."
    });
  }

  if (!isRecord(parsed)) {
    return malformedRunState();
  }

  const runId = readOptionalString(parsed.runId);
  const branch = readOptionalString(parsed.branch);
  const worktreePath = readOptionalString(parsed.worktreePath);
  const command = readString(parsed.command);
  const status = readString(parsed.status) as RunStatus | null;
  const summary = readString(parsed.summary);
  const detail = readOptionalString(parsed.detail);
  const boundary = readOptionalString(parsed.boundary) as RunBoundary | null;
  const startedAt = readString(parsed.startedAt);
  const updatedAt = readString(parsed.updatedAt);
  const resumeCommand = readOptionalString(parsed.resumeCommand);
  const progress = parseProgress(parsed.progress);
  const feature = parseFeature(parsed.feature);
  const handoff = parseHandoff(parsed.handoff);

  if (
    parsed.schemaVersion !== 1 ||
    (parsed.runId !== undefined && (!runId || runId.includes("..") || !RUN_ID_PATTERN.test(runId))) ||
    (parsed.branch !== undefined && branch === null) ||
    (parsed.worktreePath !== undefined && worktreePath === null) ||
    !command ||
    !COMMAND_PATTERN.test(command) ||
    !status ||
    !RUN_STATUSES.has(status) ||
    !summary ||
    !startedAt ||
    !updatedAt ||
    !isTimestamp(startedAt) ||
    !isTimestamp(updatedAt) ||
    Date.parse(startedAt) > Date.parse(updatedAt) ||
    (parsed.detail !== undefined && detail === null) ||
    (parsed.boundary !== undefined && (!boundary || !RUN_BOUNDARIES.has(boundary))) ||
    (parsed.resumeCommand !== undefined && resumeCommand === null) ||
    (parsed.progress !== undefined && progress === null) ||
    (parsed.feature !== undefined && feature === null) ||
    (parsed.handoff !== undefined && handoff === null)
  ) {
    return malformedRunState();
  }

  const freshness =
    status === "running" &&
    now.getTime() - Date.parse(updatedAt) > RUN_STALE_AFTER_MS
      ? "stale"
      : "current";

  return {
    state: "recorded",
    mode:
      command === "autopilot"
        ? "autopilot"
        : command === "continuous"
        ? "continuous"
        : "manual",
    runId,
    branch,
    worktreePath,
    command,
    status,
    freshness,
    summary,
    detail,
    boundary,
    startedAt,
    updatedAt,
    resumeCommand,
    progress,
    feature,
    handoff,
    warnings: []
  };
}

function parseHandoff(value: unknown): RunHandoff | null {
  if (value === undefined) {
    return null;
  }
  if (!isRecord(value)) {
    return null;
  }

  const parseStringArray = (raw: unknown): string[] | undefined | null => {
    if (raw === undefined) return undefined;
    if (!Array.isArray(raw)) return null;
    const items: string[] = [];
    for (const entry of raw) {
      const normalized = readString(entry);
      if (!normalized) return null;
      items.push(normalized);
    }
    return items;
  };

  const decisions = parseStringArray(value.decisions);
  const touchedFiles = parseStringArray(value.touchedFiles);
  const nextStep = readOptionalString(value.nextStep);
  const notes = readOptionalString(value.notes);

  if (
    decisions === null ||
    touchedFiles === null ||
    (value.nextStep !== undefined && nextStep === null) ||
    (value.notes !== undefined && notes === null)
  ) {
    return null;
  }

  return {
    ...(decisions !== undefined ? { decisions } : {}),
    ...(touchedFiles !== undefined ? { touchedFiles } : {}),
    ...(nextStep !== null ? { nextStep } : {}),
    ...(notes !== null ? { notes } : {})
  };
}

async function readRunFileAtPath(
  filePath: string,
  now: Date
): Promise<RunStateSummary> {
  const stats = await fs.lstat(filePath);
  if (stats.isSymbolicLink()) {
    return malformedSummary({
      code: "unsafe_run_state_path",
      message: `Run state at ${path.basename(filePath)} is a symbolic link and was not read.`
    });
  }
  if (!stats.isFile()) {
    return malformedSummary({
      code: "invalid_run_state_path",
      message: `Run state at ${path.basename(filePath)} is not a regular file.`
    });
  }
  return parseRunState(await fs.readFile(filePath, "utf8"), now);
}

async function readAllRunStates(
  projectRoot: string,
  now: Date = new Date()
): Promise<RunStateCollectionSummary> {
  const runs: RunStateSummary[] = [];
  const warnings: RunStateWarning[] = [];
  const seenRunIds = new Set<string>();

  const runsDir = path.join(projectRoot, RUNS_STATE_DIR);
  try {
    const dirStats = await fs.lstat(runsDir);
    if (dirStats.isSymbolicLink()) {
      warnings.push({
        code: "unsafe_run_state_path",
        message: "Run states directory is a symbolic link and was not read."
      });
    } else if (!dirStats.isDirectory()) {
      warnings.push({
        code: "invalid_run_state_path",
        message: "Run states path is not a directory."
      });
    } else {
      const entries = (await fs.readdir(runsDir)).filter((name) => name.endsWith(".json")).sort();
      for (const entry of entries) {
        const parsed = await readRunFileAtPath(path.join(runsDir, entry), now);
        warnings.push(...parsed.warnings);
        if (parsed.state === "recorded") {
          const fallbackRunId = entry.replace(/\.json$/, "");
          const normalized: RunStateSummary = {
            ...parsed,
            runId: parsed.runId ?? fallbackRunId
          };
          if (normalized.runId) {
            seenRunIds.add(normalized.runId);
          }
          runs.push(normalized);
        }
      }
    }
  } catch (error: unknown) {
    if (getErrorCode(error) !== "ENOENT") {
      throw error;
    }
  }

  const legacy = await readRunState(projectRoot, now);
  warnings.push(...legacy.warnings);
  if (legacy.state === "recorded" && (!legacy.runId || !seenRunIds.has(legacy.runId))) {
    runs.push(legacy);
  }

  runs.sort((a, b) => {
    const timeDiff = Date.parse(b.updatedAt || "") - Date.parse(a.updatedAt || "");
    if (!Number.isNaN(timeDiff) && timeDiff !== 0) {
      return timeDiff;
    }
    return (a.runId || "").localeCompare(b.runId || "");
  });

  const primary = runs[0] ?? (warnings.length > 0 ? malformedSummary(warnings[0]) : idleSummary());
  return {
    primary,
    runs,
    warnings
  };
}

function parseProgress(value: unknown): RunProgress | null {
  if (value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const label = readString(value.label);
  const current = value.current;
  const total = value.total;

  if (
    !label ||
    !Number.isInteger(current) ||
    !Number.isInteger(total) ||
    Number(current) < 0 ||
    Number(total) < 1 ||
    Number(current) > Number(total)
  ) {
    return null;
  }

  return { label, current: Number(current), total: Number(total) };
}

function parseFeature(value: unknown): RunFeature | null {
  if (value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const id = readOptionalString(value.id);
  const title = readString(value.title);

  if (!title || (value.id !== undefined && id === null)) {
    return null;
  }

  return { id, title };
}

function malformedRunState(): RunStateSummary {
  return malformedSummary({
    code: "malformed_run_state",
    message: "Run state does not match schema version 1."
  });
}

function idleSummary(): RunStateSummary {
  return {
    state: "idle",
    mode: "manual",
    runId: null,
    branch: null,
    worktreePath: null,
    command: null,
    status: null,
    freshness: null,
    summary: null,
    detail: null,
    boundary: null,
    startedAt: null,
    updatedAt: null,
    resumeCommand: null,
    progress: null,
    feature: null,
    handoff: null,
    warnings: []
  };
}

function malformedSummary(warning: RunStateWarning): RunStateSummary {
  return {
    ...idleSummary(),
    state: "malformed",
    warnings: [warning]
  };
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function readOptionalString(value: unknown): string | null {
  return value === undefined ? null : readString(value);
}

function isTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorCode(error: unknown): string | undefined {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
    ? error.code
    : undefined;
}

export { RUN_STATE_PATH, RUNS_STATE_DIR, parseRunState, readAllRunStates, readRunState };

export type {
  RunBoundary,
  RunFeature,
  RunFreshness,
  RunHandoff,
  RunMode,
  RunProgress,
  RunStateCollectionSummary,
  RunStateKind,
  RunStateSummary,
  RunStateWarning,
  RunStatus
};
