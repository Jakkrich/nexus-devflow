import { readProjectStatus } from "./status.js";
import { readFindings } from "./findings.js";
import { detectGitDrift } from "./drift-reconciler.js";
import { createStyle } from "./ui.js";

export interface GateOptions {
  strict?: boolean;
  allowUnverified?: boolean;
  color?: boolean;
}

export interface GateReport {
  passed: boolean;
  exitCode: 0 | 1;
  strict: boolean;
  completionState: string;
  violations: string[];
  warnings: string[];
  findingsBlockers: number;
  remainingTasks: number;
  twoStage: {
    stage1SpecFidelity: boolean;
    stage2CodeQuality: boolean;
  };
  summary: string;
}

export async function evaluateGate(
  projectRoot: string,
  options: GateOptions = {}
): Promise<GateReport> {
  const status = await readProjectStatus(projectRoot);
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check 1: Active Findings Blockers (P0 / P1 in open or fixed status)
  const blockers = status.findings.blockers || [];
  for (const blocker of blockers) {
    violations.push(
      `Finding ${blocker.id} [${blocker.severity}] (${blocker.status}): ${blocker.title}`
    );
  }

  // Check 1.1: Non-blocker findings warnings (P2 / P3 in open status)
  const nonBlockers = (status.findings.active || []).filter(
    (item) => (item.severity === "P2" || item.severity === "P3") && (item.status === "open" || item.status === "unverified")
  );
  for (const item of nonBlockers) {
    warnings.push(
      `Advisory Finding ${item.id} [${item.severity}] (${item.status}): ${item.title}`
    );
  }

  // Check 1.2: Status / findings warnings
  for (const w of status.warnings || []) {
    warnings.push(`Warning (${w.code}): ${w.message}`);
  }

  // Check 2: Uncompleted tasks in Living Spec
  const remaining = status.currentWork.remaining;
  if (status.currentWork.state === "active" && remaining > 0) {
    violations.push(
      `Living spec '${status.currentWork.runId || "active"}' has ${remaining} uncompleted task(s)`
    );
  }

  // Check 3: Strict mode verification check
  if (options.strict && status.currentWork.state === "active") {
    if (status.completion.state === "needs_verification" || status.completion.state === "blocked") {
      violations.push(
        `Living spec '${status.currentWork.runId || "active"}' is unverified (run /check before delivery)`
      );
    }
  }

  // Check 4: Git drift advisory check
  try {
    const drift = await detectGitDrift(projectRoot);
    if (drift.hasDrift && drift.undocumentedFiles.length > 0) {
      warnings.push(`Warning (git_drift): ${drift.undocumentedFiles.length} file(s) modified in git without being listed in living spec.`);
    }
  } catch {}

  const stage1SpecFidelity = remaining === 0 && (status.currentWork.state === "idle" || status.completion.state === "ready" || !options.strict);
  const stage2CodeQuality = blockers.length === 0;

  const passed = violations.length === 0;
  const exitCode: 0 | 1 = passed ? 0 : 1;

  let summary = "";
  if (passed) {
    summary =
      status.currentWork.state === "idle"
        ? "Quality Gate Passed: Workspace is clean with 0 blockers."
        : "Quality Gate Passed: Active run satisfies all gatekeeper criteria (Stage 1 Spec & Stage 2 Quality).";
  } else {
    summary = `Quality Gate Failed: ${violations.length} blocker(s) detected.`;
  }

  return {
    passed,
    exitCode,
    strict: options.strict === true,
    completionState: status.completion.state,
    violations,
    warnings,
    findingsBlockers: blockers.length,
    remainingTasks: remaining,
    twoStage: {
      stage1SpecFidelity,
      stage2CodeQuality
    },
    summary
  };
}

export function formatGateReport(
  report: GateReport,
  options: { color?: boolean } = {}
): string {
  const style = createStyle(options.color);
  const lines: string[] = [];

  const modeBadge = report.strict ? style.yellow("[Strict Mode]") : style.dim("[Standard Mode]");
  const header = report.passed
    ? style.bold(style.green(`✔ DevFlow Quality Gate PASSED ${modeBadge}`))
    : style.bold(style.red(`✖ DevFlow Quality Gate BLOCKED ${modeBadge}`));

  lines.push(header);
  lines.push(`  ${style.dim(report.summary)}`);
  lines.push("");

  const s1Badge = report.twoStage.stage1SpecFidelity ? style.green("✔ PASS") : style.red("✖ FAIL");
  const s2Badge = report.twoStage.stage2CodeQuality ? style.green("✔ PASS") : style.red("✖ FAIL");
  lines.push(style.bold("Two-Stage Review Status:"));
  lines.push(`  - Stage 1 (Spec Fidelity & Tasks) : ${s1Badge}`);
  lines.push(`  - Stage 2 (Code Quality & Security): ${s2Badge}`);
  lines.push("");

  if (report.violations.length > 0) {
    lines.push(style.bold(style.red("Violations:")));
    for (const v of report.violations) {
      lines.push(`  - ${style.red("✖")} ${v}`);
    }
    lines.push("");
  }

  if (report.warnings.length > 0) {
    lines.push(style.bold(style.yellow("Warnings / Advisories:")));
    for (const w of report.warnings) {
      lines.push(`  - ${style.yellow("⚠")} ${style.dim(w)}`);
    }
    lines.push("");
  }

  if (report.violations.length > 0) {
    lines.push(style.yellow("Suggested Actions:"));
    if (report.findingsBlockers > 0) {
      lines.push(`  - Resolve blockers: ${style.bold("nexus-devflow findings --blockers")}`);
    }
    if (report.remainingTasks > 0) {
      lines.push(`  - Complete tasks: ${style.bold("/implement")}`);
    }
    if (report.completionState === "needs_verification" || report.strict) {
      lines.push(`  - Verify living spec: ${style.bold("/check")}`);
    }
  } else {
    lines.push(style.green("  All quality gates passed. Safe to merge and commit."));
  }

  return lines.join("\n").trimEnd();
}

