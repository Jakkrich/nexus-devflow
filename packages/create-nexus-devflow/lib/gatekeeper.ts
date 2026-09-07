import {
  GatekeeperEngine,
  type GatekeeperEngineOptions,
  type GateEvaluateOptions,
  type GateReport,
  type ReconcileOptions
} from "./gatekeeper-engine.js";
import { createStyle } from "./ui.js";

export interface GateOptions extends GateEvaluateOptions {
  color?: boolean;
}

export {
  GatekeeperEngine,
  type GatekeeperEngineOptions,
  type GateEvaluateOptions,
  type GateReport,
  type ReconcileOptions
};

export async function evaluateGate(
  projectRoot: string,
  options: GateOptions = {}
): Promise<GateReport> {
  const engine = new GatekeeperEngine(projectRoot);
  return engine.evaluate(options);
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

