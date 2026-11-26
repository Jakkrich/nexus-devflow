import path from "node:path";
import { readProjectStatus, type ProjectStatus } from "./status.js";
import { readFindings, type FindingsSummary } from "./findings.js";
import { readProjectConfig, type ProjectConfig } from "./project-config.js";
import { detectGitDrift, reconcileState, type GitDriftReport, type ReconcileResult } from "./drift-reconciler.js";
import {
  inspectRunEvidence,
  type EvidenceArtifact,
  type RunEvidenceSummary
} from "./evidence-packet.js";

export type { EvidenceArtifact, RunEvidenceSummary };

export interface GatekeeperEngineOptions {
  config?: ProjectConfig;
}

export interface GateEvaluateOptions {
  strict?: boolean;
  allowUnverified?: boolean;
  requireEvidenceArtifacts?: boolean;
  status?: ProjectStatus;
  drift?: GitDriftReport;
  workflow?: "regular" | "continuous";
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
  evidence: RunEvidenceSummary;
  twoStage: {
    stage1SpecFidelity: boolean;
    stage2CodeQuality: boolean;
  };
  summary: string;
}

export interface ReconcileOptions {
  autoAddUndocumented?: boolean;
  healStage?: boolean;
}

import { ActiveContextEngine, type ActiveTaskContext } from "./active-context-engine.js";

export class GatekeeperEngine {
  public readonly projectRoot: string;
  private readonly options: GatekeeperEngineOptions;
  private cachedConfig: ProjectConfig | null = null;
  public readonly context: ActiveContextEngine;

  constructor(projectRoot: string = process.cwd(), options: GatekeeperEngineOptions = {}) {
    this.projectRoot = path.resolve(projectRoot);
    this.options = options;
    this.context = new ActiveContextEngine(this.projectRoot);
    if (options.config) {
      this.cachedConfig = options.config;
    }
  }

  /**
   * Retrieves active task context through composed ActiveContextEngine.
   */
  public async getActiveContext(): Promise<ActiveTaskContext> {
    return this.context.getActiveContext();
  }


  /**
   * Resolves project configuration from devflow/config.json or defaults.
   */
  public async getConfig(): Promise<ProjectConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }
    const resolved = await readProjectConfig(this.projectRoot);
    this.cachedConfig = resolved.values;
    return this.cachedConfig;
  }

  /**
   * Retrieves parsed findings ledger summary and active blockers.
   */
  public async getFindings(): Promise<FindingsSummary> {
    return readFindings(this.projectRoot);
  }

  /**
   * Evaluates Git drift between modified repository files and active living spec.
   */
  public async getDrift(branch?: string): Promise<GitDriftReport> {
    return detectGitDrift(this.projectRoot, branch);
  }

  /**
   * Automatically reconciles undocumented modified files and heals stage drift.
   */
  public async reconcile(options: ReconcileOptions = { autoAddUndocumented: true, healStage: true }): Promise<ReconcileResult> {
    return reconcileState(this.projectRoot, options);
  }

  /**
   * Evaluates Two-Stage quality criteria (Stage 1 Spec Fidelity, Stage 2 Code Quality).
   */
  public async evaluate(options: GateEvaluateOptions = {}): Promise<GateReport> {
    const config = await this.getConfig();
    const workflow = options.workflow || "regular";
    const gatePolicy = config.qualityGates[workflow] || config.qualityGates.regular;

    // Resolve strict mode: explicit override takes precedence, else check policy
    const isStrict = options.strict !== undefined
      ? options.strict
      : gatePolicy.check === "always";

    const status = options.status || (await readProjectStatus(this.projectRoot));
    const violations: string[] = [];
    const warnings: string[] = [];

    // Stage 2 Check: Active Findings Blockers (P0 / P1 in open or fixed status)
    const blockers = status.findings.blockers || [];
    for (const blocker of blockers) {
      violations.push(
        `Finding ${blocker.id} [${blocker.severity}] (${blocker.status}): ${blocker.title}`
      );
    }

    // Unverified Hypotheses (P0 / P1 not yet reproduced by run) & Advisory Findings (P2 / P3)
    for (const item of status.findings.active || []) {
      if ((item.severity === "P0" || item.severity === "P1") && item.status === "unverified") {
        if (options.allowUnverified === false) {
          violations.push(
            `Unverified Hypothesis ${item.id} [${item.severity}] (unverified): ${item.title}`
          );
        } else {
          warnings.push(
            `Unverified Hypothesis ${item.id} [${item.severity}] (unverified): ${item.title}`
          );
        }
      } else if (
        (item.severity === "P2" || item.severity === "P3") &&
        (item.status === "open" || item.status === "unverified")
      ) {
        warnings.push(
          `Advisory Finding ${item.id} [${item.severity}] (${item.status}): ${item.title}`
        );
      }
    }

    // Status warnings
    for (const w of status.warnings || []) {
      warnings.push(`Warning (${w.code}): ${w.message}`);
    }

    // Stage 1 Check: Uncompleted tasks in Living Spec
    const remaining = status.currentWork.remaining;
    if (status.currentWork.state === "active" && remaining > 0) {
      violations.push(
        `Living spec '${status.currentWork.runId || "active"}' has ${remaining} uncompleted task(s)`
      );
    }

    // Strict mode verification check
    if (isStrict && status.currentWork.state === "active") {
      if (status.completion.state === "needs_verification" || status.completion.state === "blocked") {
        violations.push(
          `Living spec '${status.currentWork.runId || "active"}' is unverified (run /check before delivery)`
        );
      }
    }

    // Independent review policy check
    if (gatePolicy.independentReview === "always" && status.currentWork.state === "active") {
      if (status.review && (status.review.verdict !== "passed" || status.review.freshness !== "current")) {
        const reviewSummary = `verdict: ${status.review.verdict || "none"}, freshness: ${status.review.freshness}`;
        if (isStrict) {
          violations.push(
            `Independent review required by policy (${gatePolicy.independentReview}) but review is not verified (${reviewSummary})`
          );
        } else {
          warnings.push(
            `Independent review is recommended by policy (${gatePolicy.independentReview}) but review is not verified (${reviewSummary})`
          );
        }
      }
    }



    // Git drift detection
    try {
      const drift = options.drift || (await this.getDrift());
      if (drift.hasDrift && drift.undocumentedFiles.length > 0) {
        const driftMsg = `Warning (git_drift): ${drift.undocumentedFiles.length} file(s) modified in git without being listed in living spec.`;
        if (isStrict && gatePolicy.check === "always") {
          violations.push(driftMsg);
        } else {
          warnings.push(driftMsg);
        }
      }
    } catch {
      // ignore drift detection errors in isolated test environments
    }

    const evidence = await inspectRunEvidence(this.projectRoot, status.currentWork.runId);
    for (const evidenceWarning of evidence.warnings) {
      warnings.push(`Warning (evidence_packet): ${evidenceWarning}`);
    }

    if (status.currentWork.state === "active" && !evidence.present) {
      const targetRunId = status.currentWork.runId || "active";
      if (options.requireEvidenceArtifacts === true) {
        violations.push(
          `Missing durable evidence artifacts in devflow/reports/${targetRunId}/ (missing_evidence_artifacts)`
        );
      } else if (
        isStrict &&
        status.completion.state === "ready" &&
        config.delivery.gate === "option-a-evidence-packet"
      ) {
        warnings.push(
          `Warning (missing_evidence_artifacts): No durable proof files found in devflow/reports/${targetRunId}/. Save /check outputs before Option A handoff.`
        );
      }
    }

    const stage1SpecFidelity = remaining === 0 && (
      status.currentWork.state === "idle" ||
      status.completion.state === "ready" ||
      !isStrict
    );
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
      strict: isStrict,
      completionState: status.completion.state,
      violations,
      warnings,
      findingsBlockers: blockers.length,
      remainingTasks: remaining,
      evidence,
      twoStage: {
        stage1SpecFidelity,
        stage2CodeQuality
      },
      summary
    };
  }
}
