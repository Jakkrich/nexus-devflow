import path from "node:path";
import { readDashboardSnapshot, type DashboardSnapshot, type DashboardSnapshotOptions } from "./dashboard-snapshot.js";
import { readProjectStatus, type ProjectStatus } from "./status.js";
import { buildCodeGraph, calculateBlastRadius, type CodeGraph, type BlastRadiusReport } from "./code-graph.js";
import { GatekeeperEngine, type GateReport, type GateEvaluateOptions } from "./gatekeeper.js";
import type { ReconcileResult } from "./drift-reconciler.js";

export interface DashboardEngineOptions {
  snapshotOptions?: DashboardSnapshotOptions;
  cacheTtlMs?: number;
}

export interface DashboardAction {
  type: string;
  strict?: boolean;
  filePath?: string;
  [key: string]: unknown;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export class DashboardStateEngine {
  public readonly projectRoot: string;
  private readonly options: DashboardEngineOptions;
  private cachedSnapshot: DashboardSnapshot | null = null;
  private cachedGraph: CodeGraph | null = null;
  public readonly gatekeeper: GatekeeperEngine;

  constructor(projectRoot: string = process.cwd(), options: DashboardEngineOptions = {}) {
    this.projectRoot = path.resolve(projectRoot);
    this.options = options;
    this.gatekeeper = new GatekeeperEngine(this.projectRoot);
  }

  /**
   * Retrieves the current project status in-memory.
   */
  public async getStatus(): Promise<ProjectStatus> {
    return readProjectStatus(this.projectRoot);
  }

  /**
   * Retrieves or computes a dashboard snapshot, caching the result in-memory.
   */
  public async getSnapshot(
    options: { force?: boolean } & DashboardSnapshotOptions = {}
  ): Promise<DashboardSnapshot> {
    if (!options.force && this.cachedSnapshot) {
      return this.cachedSnapshot;
    }

    const snapshotOpts: DashboardSnapshotOptions = {
      ...this.options.snapshotOptions,
      ...options
    };

    const snapshot = await readDashboardSnapshot(this.projectRoot, snapshotOpts);
    this.cachedSnapshot = snapshot;
    return snapshot;
  }

  /**
   * Builds or returns cached code graph for the project.
   */
  public async getCodeGraph(force: boolean = false): Promise<CodeGraph> {
    if (!force && this.cachedGraph) {
      return this.cachedGraph;
    }
    const graph = await buildCodeGraph(this.projectRoot);
    this.cachedGraph = graph;
    return graph;
  }

  /**
   * Calculates blast radius for a given target file.
   */
  public async getBlastRadius(filePath: string): Promise<BlastRadiusReport> {
    const graph = await this.getCodeGraph();
    return calculateBlastRadius(graph, filePath);
  }

  /**
   * Pre-warms the snapshot cache in the background.
   */
  public prewarm(): void {
    void this.getSnapshot().catch(() => {});
  }

  /**
   * Dispatches a state action (e.g. gate evaluation, drift reconciliation).
   */
  public async dispatchAction(action: DashboardAction): Promise<ActionResult> {
    switch (action.type) {
      case "check-gate": {
        const gateReport = await this.gatekeeper.evaluate({
          strict: Boolean(action.strict)
        });
        return {
          ok: true,
          message: gateReport.passed ? "Gate passed" : "Gate blocked",
          data: gateReport
        };
      }
      case "reconcile": {
        const result = await this.gatekeeper.reconcile({
          autoAddUndocumented: true,
          healStage: true
        });
        this.cachedSnapshot = null;
        return {
          ok: true,
          reconciled: result.reconciled,
          healedStage: result.healedStage,
          addedFiles: result.addedFiles,
          message: result.message,
          data: result
        };
      }

      case "refresh":
      case "invalidate-cache": {
        this.cachedSnapshot = null;
        this.cachedGraph = null;
        return {
          ok: true,
          message: "Cache invalidated successfully"
        };
      }
      default:
        return {
          ok: false,
          message: `Unknown action type: ${action.type}`
        };
    }
  }
}
