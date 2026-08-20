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

type CompletionState = "blocked" | "needs_verification" | "ready";

interface StatusWarning {
  code: string;
  message: string;
}

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
  schemaVersion: 1;
  health: "ok" | "warning";
  project: {
    name: string;
    root: string;
  };
  devflow: {
    version: string | null;
    adapters: ProjectAdapter[];
  };
  currentWork: StatusCurrentWork;
  findings: StatusFindings;
  git: GitStatusSummary;
  completion: StatusCompletion;
  nextAction: StatusNextAction;
  warnings: StatusWarning[];
}

async function readProjectStatus(
  startPath: string = process.cwd()
): Promise<ProjectStatus> {
  const metadata = await readProjectMetadata(startPath);
  const [currentWork, findings, git] = await Promise.all([
    readCurrentWork(metadata.project.root),
    readFindings(metadata.project.root),
    readGitStatus(metadata.project.root)
  ]);

  const warnings: StatusWarning[] = [
    ...metadata.warnings,
    ...currentWork.warnings,
    ...findings.warnings,
    ...findDrift(currentWork, git)
  ];
  const completion = selectCompletion(currentWork, findings, git);
  const nextAction = selectNextAction(currentWork, findings);

  return {
    schemaVersion: metadata.schemaVersion,
    health: warnings.length > 0 || findings.blockers.length > 0
      ? "warning"
      : "ok",
    project: metadata.project,
    devflow: metadata.devflow,
    currentWork: formatCurrentWork(currentWork),
    findings: formatFindings(findings),
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
    "",
    formatSection("Progress", style),
    formatRow("Work", formatWorkValue(status.currentWork, style), style)
  ];

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

  lines.push(
    formatRow("Findings", formatFindingsValue(status.findings, style), style),
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
    .filter((status) => findings.byStatus[status] > 0)
    .map((status) => `${findings.byStatus[status]} ${status}`);
  const value = [...activeCounts, ...resolvedCounts].join(", ");

  if (findings.blockers.length > 0) {
    return style.red(value);
  }

  return findings.active.length > 0 ? style.yellow(value) : style.green(value);
}

function formatCompletionValue(
  completion: StatusCompletion,
  style: TextStyle
): string {
  if (completion.state === "ready") {
    return style.green("ready");
  }

  if (completion.state === "needs_verification") {
    return style.yellow("needs verification");
  }

  return style.red(`blocked: ${completion.blockers.join("; ")}`);
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
  git: GitStatusSummary
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

  if (blockers.length > 0) {
    return { state: "blocked", blockers };
  }

  return {
    state: "needs_verification",
    blockers: ["verification evidence is not persisted"]
  };
}

function selectNextAction(
  currentWork: CurrentWorkSummary,
  findings: FindingsSummary
): StatusNextAction {
  if (currentWork.state === "malformed") {
    return {
      command: "/doctor",
      reason: "Repair the stage or spec contract before continuing."
    };
  }

  if (currentWork.state === "active") {
    if (currentWork.nextStep) {
      return {
        command: "/implement",
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
  StatusCompletion,
  StatusCurrentWork,
  StatusFindings,
  StatusNextAction,
  StatusWarning
};
