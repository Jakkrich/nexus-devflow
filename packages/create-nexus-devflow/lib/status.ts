import fs from "node:fs/promises";
import path from "node:path";

import { listActiveRunContexts, resolveActiveContextPaths } from "./branch-context.js";
import type { ActiveRunSummary } from "./branch-context.js";
import { readCurrentWork } from "./current-work.js";
import type {
  CurrentWorkSummary,
  CurrentWorkType
} from "./current-work.js";
import { readFindings } from "./findings.js";
import type {
  Finding,
  FindingsSummary,
  FindingStatus
} from "./findings.js";
import { readGitStatus } from "./git-status.js";
import type { GitStatusSummary } from "./git-status.js";
import { readProjectMetadata } from "./project-metadata.js";
import type { ProjectAdapter } from "./project-metadata.js";

import { readIdeas } from "./ideas.js";
import type { IdeasSummary } from "./ideas.js";
import { readProjectConfig } from "./project-config.js";
import type {
  ProjectConfig,
  ProjectConfigState,
  QualityGatePolicy
} from "./project-config.js";
import { readRunState } from "./run-state.js";
import type { RunStateSummary } from "./run-state.js";
import { readIndependentReview } from "./review.js";
import type {
  IndependentReviewSummary,
  ReviewCheckResult,
  ReviewFreshness,
  ReviewState
} from "./review.js";

type CompletionState = "blocked" | "needs_verification" | "ready";

interface StatusWarning {
  code: string;
  message: string;
}

interface StatusConfiguration {
  path: string;
  state: ProjectConfigState;
  values: ProjectConfig;
}

type StatusActivity = Omit<RunStateSummary, "warnings">;

interface StatusCurrentWork {
  state: CurrentWorkSummary["state"];
  type: CurrentWorkType | null;
  title: string | null;
  status: string | null;
  runId: string | null;
  completed: number;
  remaining: number;
  total: number;
  nextStep: { title: string } | null;
}

interface StatusFindings {
  total: number;
  byStatus: Record<FindingStatus, number>;
  active: Array<Pick<Finding, "id" | "severity" | "status" | "title">>;
  blockers: Array<Pick<Finding, "id" | "severity" | "status" | "title">>;
}

interface StatusReview {
  state: ReviewState;
  freshness: ReviewFreshness;
  verdict: "changes-requested" | "passed" | null;
  checkResult: ReviewCheckResult | null;
  targetCommit: string | null;
  requestedReviewer: string | null;
  requestedModel: string | null;
  reviewerAdapter: string | null;
  reviewerModel: string | null;
  warnings: StatusWarning[];
}

interface StatusActiveRun extends ActiveRunSummary {
  review: StatusReview;
}

interface StatusNextAction {
  command: string | null;
  reason: string;
}

interface StatusCompletion {
  state: CompletionState;
  blockers: string[];
}

interface HumanStatusOptions {
  color?: boolean;
}

interface TextStyle {
  bold: (value: string) => string;
  brightCyan: (value: string) => string;
  cyan: (value: string) => string;
  dim: (value: string) => string;
  green: (value: string) => string;
  red: (value: string) => string;
  yellow: (value: string) => string;
}

interface ProjectStatus {
  schemaVersion: number;
  health: "ok" | "warning";
  project: {
    name: string;
    root: string;
  };
  devflow: {
    version: string | null;
    adapters: ProjectAdapter[];
  };
  configuration: StatusConfiguration;
  activity: StatusActivity;
  currentWork: StatusCurrentWork;
  activeRuns: StatusActiveRun[];
  findings: StatusFindings;
  review: StatusReview;
  ideas: IdeasSummary;
  git: GitStatusSummary;
  completion: StatusCompletion;
  nextAction: StatusNextAction;
  warnings: StatusWarning[];
}

async function readProjectStatus(
  startPath: string = process.cwd()
): Promise<ProjectStatus> {
  const metadata = await readProjectMetadata(startPath);
  const [contextPaths, config, currentWork, activeRuns, findings, git, ideas, runState] = await Promise.all([
    resolveActiveContextPaths(metadata.project.root),
    readProjectConfig(metadata.project.root),
    readCurrentWork(metadata.project.root),
    listActiveRunContexts(metadata.project.root),
    readFindings(metadata.project.root),
    readGitStatus(metadata.project.root),
    readIdeas(metadata.project.root),
    readRunState(metadata.project.root)
  ]);

  const primaryRunId = currentWork.runId || (activeRuns.length === 1 ? activeRuns[0]?.runId : undefined);
  const [review, activeRunReviews] = await Promise.all([
    readIndependentReview(metadata.project.root, primaryRunId || undefined),
    Promise.all(activeRuns.map((run) => readIndependentReview(metadata.project.root, run.runId)))
  ]);
  const statusReview = formatReview(review);
  const statusActiveRuns = activeRuns.map((run, index) => ({
    ...run,
    review: formatReview(activeRunReviews[index] || review)
  }));

  let stageMarkdown = "";
  try {
    stageMarkdown = await fs.readFile(contextPaths.stagePath, "utf8");
  } catch {}

  const warnings: StatusWarning[] = [
    ...metadata.warnings,
    ...config.warnings,
    ...currentWork.warnings,
    ...findings.warnings,
    ...runState.warnings,
    ...review.warnings,
    ...findDrift(currentWork, git)
  ];
  const completion = selectCompletion(currentWork, findings, git, stageMarkdown, review, config.values);
  const nextAction = selectNextAction(currentWork, findings, stageMarkdown);

  return {
    schemaVersion: metadata.schemaVersion,
    health: warnings.length > 0 || findings.blockers.length > 0
      ? "warning"
      : "ok",
    project: metadata.project,
    devflow: metadata.devflow,
    configuration: {
      path: config.path,
      state: config.state,
      values: config.values
    },
    activity: {
      state: runState.state,
      mode: runState.mode,
      command: runState.command,
      status: runState.status,
      freshness: runState.freshness,
      summary: runState.summary,
      detail: runState.detail,
      boundary: runState.boundary,
      startedAt: runState.startedAt,
      updatedAt: runState.updatedAt,
      resumeCommand: runState.resumeCommand,
      progress: runState.progress,
      feature: runState.feature
    },
    currentWork: formatCurrentWork(currentWork),
    activeRuns: statusActiveRuns,
    findings: formatFindings(findings),
    review: statusReview,
    ideas,
    git,
    completion,
    nextAction,
    warnings
  };
}

function formatHumanStatus(
  status: ProjectStatus,
  options: HumanStatusOptions = {}
): string {
  const style = createTextStyle(options.color === true);
  const adapters = status.devflow.adapters.length > 0
    ? status.devflow.adapters.join(", ")
    : "none detected";

  const lines = [
    `${style.bold(style.cyan("Nexus-DevFlow Status"))}  ${style.bold(status.project.name)}`,
    "",
    formatSection("Project", style),
    formatRow("Path", status.project.root, style),
    formatRow("Version", status.devflow.version || "unknown", style),
    formatRow("Adapters", adapters, style),
    formatRow("Config", formatConfigValue(status.configuration.state), style),
    formatRow("Quality gates", formatQualityGates(status.configuration.values.qualityGates.regular), style),
    "",
    formatSection("Progress", style),
    formatRow("Progress", formatWorkValue(status.currentWork, style), style)
  ];

  if (status.activity && status.activity.state === "recorded" && status.activity.command) {
    lines.push(
      formatRow("Activity", formatActivityValue(status.activity, style), style)
    );
  }

  if (status.currentWork.state === "active") {
    lines.push(
      formatRow(
        "Steps",
        `${status.currentWork.completed}/${status.currentWork.total} complete`,
        style
      )
    );

    if (status.currentWork.nextStep) {
      lines.push(formatRow("Next step", status.currentWork.nextStep.title, style));
    }
  }

  if (status.activeRuns && status.activeRuns.length > 0) {
    lines.push(
      formatRow(
        "Spec Queue",
        `${status.activeRuns.length} active (${status.activeRuns.map((r) => r.runId).join(", ")})`,
        style
      )
    );
  }

  lines.push(
    formatRow("Findings", formatFindingsValue(status.findings, style), style)
  );

  if (status.review && status.review.state !== "none") {
    lines.push(
      formatRow("Review", formatReviewValue(status.review, style), style)
    );
  }

  lines.push(
    formatRow("Completion", formatCompletionValue(status.completion, style), style),
    "",
    formatSection("Git", style)
  );
  appendGitLines(lines, status.git, style);

  if (status.warnings.length > 0) {
    lines.push("", formatSection("Attention", style));

    for (const warning of status.warnings) {
      lines.push(`  ${style.yellow("!")} ${style.yellow(warning.message)}`);
    }
  }

  lines.push("", formatSection("Next action", style));

  if (status.nextAction.command) {
    lines.push(`  ${style.bold(style.brightCyan(status.nextAction.command))}`);
  }

  lines.push(`  ${status.nextAction.reason}`);
  return lines.join("\n");
}

function formatConfigValue(state: ProjectConfigState): string {
  if (state === "project") {
    return "project settings";
  }

  if (state === "invalid") {
    return "invalid, using defaults";
  }

  return "built-in defaults";
}

function formatQualityGates(gates: QualityGatePolicy): string {
  return `audit ${gates.audit}, review ${gates.independentReview}, check ${gates.check}, try guide ${gates.tryGuide}`;
}

function shouldUseColor(
  isTTY: boolean | undefined = process.stdout.isTTY,
  environment: NodeJS.ProcessEnv = process.env
): boolean {
  return isTTY === true && !Object.hasOwn(environment, "NO_COLOR");
}

function formatSection(label: string, style: TextStyle): string {
  return style.bold(label);
}

function formatRow(label: string, value: string, style: TextStyle): string {
  return `  ${style.cyan(label.padEnd(14))}${value}`;
}

function formatReviewValue(review: StatusReview, style: TextStyle): string {
  const parts: string[] = [review.state];
  if (review.verdict) {
    parts.push(`verdict ${review.verdict}`);
  }
  if (review.checkResult) {
    parts.push(`check ${review.checkResult}`);
  }
  parts.push(`freshness ${review.freshness}`);
  if (review.reviewerModel) {
    parts.push(`(${review.reviewerModel})`);
  }
  return review.freshness === "stale"
    ? style.yellow(parts.join(", "))
    : parts.join(", ");
}

function formatReview(review: IndependentReviewSummary): StatusReview {
  return {
    state: review.state,
    freshness: review.freshness,
    verdict: review.verdict,
    checkResult: review.checkResult,
    targetCommit: review.targetCommit,
    requestedReviewer: review.requestedReviewer,
    requestedModel: review.requestedModel,
    reviewerAdapter: review.reviewerAdapter,
    reviewerModel: review.reviewerModel,
    warnings: review.warnings.map((warning) => ({
      code: warning.code,
      message: warning.message
    }))
  };
}

function formatActivityValue(activity: StatusActivity, style: TextStyle): string {
  if (activity.state !== "recorded" || !activity.command) {
    return style.dim("none");
  }

  const parts = [`/${activity.command}`];
  if (activity.status) {
    parts.push(
      activity.status === "running"
        ? style.brightCyan(activity.status)
        : activity.status === "ready"
        ? style.green(activity.status)
        : activity.status === "blocked"
        ? style.red(activity.status)
        : activity.status
    );
  }

  if (activity.progress) {
    parts.push(
      `${activity.progress.current}/${activity.progress.total} ${activity.progress.label}`
    );
  }

  if (activity.boundary) {
    parts.push(`(${activity.boundary})`);
  }

  if (activity.freshness === "stale") {
    parts.push(style.yellow("[stale]"));
  }

  return parts.join(" ");
}

function formatWorkValue(work: StatusCurrentWork, style: TextStyle): string {
  if (work.state === "idle") {
    return style.dim("none");
  }

  if (work.state === "malformed") {
    return style.red("present but malformed");
  }

  const type = work.type || "work";
  const identity = work.runId
    ? `${work.runId} - ${work.title || "untitled"}`
    : work.title || "untitled";
  return style.brightCyan(`${type} ${identity}`);
}

function formatFindingsValue(
  findings: StatusFindings,
  style: TextStyle
): string {
  if (findings.total === 0) {
    return style.green("none");
  }

  const activeGroups = new Map<string, string[]>();
  for (const finding of findings.active) {
    const key = `${finding.status} ${finding.severity}`;
    activeGroups.set(key, [...(activeGroups.get(key) || []), finding.id]);
  }
  const activeCounts = [...activeGroups.entries()].map(
    ([label, ids]) => `${ids.length} ${label} (${ids.join(", ")})`
  );
  const resolvedCounts = (["closed", "accepted", "invalid"] as const)
    .map((status) => {
      const count = findings.byStatus[status] || 0;
      return count > 0 ? `${count} ${status}` : null;
    })
    .filter(Boolean);

  const parts = [...activeCounts, ...resolvedCounts];
  return parts.join(", ");
}

function formatCompletionValue(
  completion: StatusCompletion,
  style: TextStyle
): string {
  if (completion.state === "ready") {
    return style.green("ready to complete");
  }

  if (completion.state === "needs_verification") {
    return style.yellow(
      `needs verification (${completion.blockers.join("; ")})`
    );
  }

  return style.red(`blocked (${completion.blockers.join("; ")})`);
}

function appendGitLines(
  lines: string[],
  git: GitStatusSummary,
  style: TextStyle
): void {
  if (!git.available) {
    lines.push(formatRow("Status", style.red("not a Git repository"), style));
    return;
  }

  const workingTree = git.clean
    ? style.green("clean")
    : style.yellow(
        `${git.changedFiles} changed ${git.changedFiles === 1 ? "file" : "files"}`
      );
  const remote = git.upstream
    ? `${git.upstream} (${git.ahead || 0} ahead, ${git.behind || 0} behind)`
    : "not configured";
  const coloredRemote = git.upstream && git.ahead === 0 && git.behind === 0
    ? style.green(remote)
    : style.yellow(remote);

  lines.push(
    formatRow("Branch", git.branch || "unknown", style),
    formatRow("Working tree", workingTree, style),
    formatRow("Remote", coloredRemote, style)
  );

  if (git.lastCommit) {
    lines.push(`  ${style.cyan("Last commit")}`, `    ${git.lastCommit}`);
  }
}

function createTextStyle(enabled: boolean): TextStyle {
  const paint = (code: number, value: string): string =>
    enabled ? `\u001b[${code}m${value}\u001b[0m` : value;

  return {
    bold: (value) => paint(1, value),
    brightCyan: (value) => paint(96, value),
    cyan: (value) => paint(36, value),
    dim: (value) => paint(2, value),
    green: (value) => paint(32, value),
    red: (value) => paint(31, value),
    yellow: (value) => paint(33, value)
  };
}

function formatCurrentWork(currentWork: CurrentWorkSummary): StatusCurrentWork {
  return {
    state: currentWork.state,
    type: currentWork.type,
    title: currentWork.title,
    status: currentWork.status,
    runId: currentWork.runId,
    completed: currentWork.completed,
    remaining: currentWork.remaining,
    total: currentWork.total,
    nextStep: currentWork.nextStep
      ? { title: currentWork.nextStep.title }
      : null
  };
}

function formatFindings(findings: FindingsSummary): StatusFindings {
  const selectFinding = (
    finding: Finding
  ): Pick<Finding, "id" | "severity" | "status" | "title"> => ({
    id: finding.id,
    severity: finding.severity,
    status: finding.status,
    title: finding.title
  });

  return {
    total: findings.total,
    byStatus: findings.byStatus,
    active: findings.items
      .filter((finding) =>
        finding.status === "unverified" ||
        finding.status === "open" ||
        finding.status === "fixed"
      )
      .map(selectFinding),
    blockers: findings.blockers.map(selectFinding)
  };
}

function selectCompletion(
  currentWork: CurrentWorkSummary,
  findings: FindingsSummary,
  git: GitStatusSummary,
  stageMarkdown?: string,
  review?: IndependentReviewSummary,
  config?: ProjectConfig
): StatusCompletion {
  const blockers: string[] = [];

  if (currentWork.state !== "active") {
    blockers.push("no active delivery run or living spec");
  } else if (currentWork.remaining > 0) {
    blockers.push(`${currentWork.remaining} checklist steps remain`);
  }

  if (findings.blockers.length > 0) {
    blockers.push(
      `blocking findings ${findings.blockers.map((finding) => finding.id).join(", ")}`
    );
  }

  if (!git.available) {
    blockers.push("Git repository is unavailable");
  }

  if (review && config) {
    const isGateActive = config.qualityGates.regular.independentReview !== "manual";
    if (review.state === "malformed") {
      blockers.push("independent review record is malformed");
    } else if (review.state === "changes-requested") {
      blockers.push("independent review requested changes");
    } else if (review.state === "pending") {
      blockers.push("independent review is pending");
    } else if (isGateActive && review.state === "none") {
      blockers.push("independent review is required");
    } else if (review.state === "passed" && review.freshness !== "current") {
      blockers.push("independent review receipt is stale");
    }
  }

  if (blockers.length > 0) {
    return { state: "blocked", blockers };
  }

  const isVerified = Boolean(
    stageMarkdown &&
    (/ready\s+for\s+\/complete|Passed\s+->\s+Ready|\/complete/i.test(stageMarkdown) ||
     /Current Stage:\s*check\s*\(Passed/i.test(stageMarkdown))
  );

  if (
    isVerified ||
    currentWork.status?.toLowerCase().includes("verified") ||
    currentWork.status?.toLowerCase().includes("ready")
  ) {
    return {
      state: "ready",
      blockers: []
    };
  }

  return {
    state: "needs_verification",
    blockers: ["verification evidence is not persisted"]
  };
}

function selectNextAction(
  currentWork: CurrentWorkSummary,
  findings: FindingsSummary,
  stageMarkdown?: string
): StatusNextAction {
  if (currentWork.state === "malformed") {
    return {
      command: "/doctor",
      reason: "Repair the stage or spec contract before continuing."
    };
  }

  // 1. Authoritative Next Action from current-stage.md
  if (stageMarkdown) {
    const stageNextActionMatch = stageMarkdown.match(
      /^-\s+(?:\*\*)?Next Action(?:\*\*)?:\s*`?(\/[^\r\n`]+)`?/im
    );
    const stageNextAction = stageNextActionMatch?.[1]?.trim();

    const rawStage = stageMarkdown.match(
      /^-\s+(?:\*\*)?Current Stage(?:\*\*)?:\s*`?([^\r\n`]+)`?/im
    )?.[1]?.trim();

    if (
      stageNextAction &&
      !stageNextAction.toLowerCase().includes("none") &&
      !stageNextAction.toLowerCase().startsWith("/idle")
    ) {
      const isReadyForComplete =
        stageNextAction.startsWith("/complete") ||
        /ready\s+for\s+\/complete/i.test(rawStage || "");
      const reason = isReadyForComplete
        ? "Verification passed. Ready to complete, archive, and merge."
        : `Continue active stage at ${rawStage || stageNextAction}.`;
      return {
        command: stageNextAction,
        reason
      };
    }
  }

  if (currentWork.state === "active") {
    if (currentWork.nextStep) {
      const runSuffix = currentWork.runId ? ` ${currentWork.runId}` : "";
      return {
        command: `/implement${runSuffix}`,
        reason: `Resume active work with ${currentWork.nextStep.title}.`
      };
    }

    const openBlocker = findings.blockers.find(
      (finding) => finding.status === "open"
    );
    if (openBlocker) {
      return {
        command: "/implement",
        reason: `Repair blocking finding ${openBlocker.id}.`
      };
    }

    const fixedBlocker = findings.blockers.find(
      (finding) => finding.status === "fixed"
    );
    if (fixedBlocker) {
      return {
        command: "/check",
        reason: `Re-verify fixed finding ${fixedBlocker.id}.`
      };
    }

    return {
      command: "/check",
      reason: "All checklist steps are completed; run QA verification."
    };
  }

  const openBlocker = findings.blockers.find(
    (finding) => finding.status === "open"
  );
  if (openBlocker) {
    return {
      command: `/fix ${openBlocker.id}`,
      reason: "Start a tracked repair for the blocking finding."
    };
  }

  return {
    command: "/feature",
    reason: "Workspace is idle. Ready to spec or discover a new feature."
  };
}

function findDrift(
  currentWork: CurrentWorkSummary,
  git: GitStatusSummary
): StatusWarning[] {
  if (currentWork.state !== "active") {
    return [];
  }

  const warnings: StatusWarning[] = [];

  if (git.available && (git.branch === "main" || git.branch === "master")) {
    warnings.push({
      code: "active_work_on_default_branch",
      message: `Active ${currentWork.type || "work"} is running on the default branch.`
    });
  }

  if (currentWork.total > 0 && currentWork.remaining === 0) {
    warnings.push({
      code: "completed_steps_not_released",
      message: "All checklist steps are checked, but run has not been completed or verified."
    });
  }

  return warnings;
}

export { formatHumanStatus, readProjectStatus, shouldUseColor };

export type {
  CompletionState,
  HumanStatusOptions,
  ProjectStatus,
  StatusActivity,
  StatusActiveRun,
  StatusCompletion,
  StatusCurrentWork,
  StatusFindings,
  StatusNextAction,
  StatusWarning
};
