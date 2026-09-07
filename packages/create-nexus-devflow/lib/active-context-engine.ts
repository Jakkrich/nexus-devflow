import path from "node:path";
import fs from "node:fs/promises";
import {
  resolveActiveContextPaths,
  resolveActiveRunContext,
  listActiveRunContexts,
  type ActiveContextPaths,
  type RunContextPaths,
  type ActiveRunSummary
} from "./branch-context.js";
import {
  readCurrentWork,
  parseCurrentWork,
  type CurrentWorkSummary
} from "./current-work.js";

import { readDiscoveries, type DiscoverySummary } from "./discoveries.js";

export interface ActiveContextEngineOptions {
  cacheTtlMs?: number;
}

export interface ActiveTaskContext {
  state: "idle" | "active" | "pre-flight";
  runId: string | null;
  track: "fast" | "deep" | "idle";
  paths: ActiveContextPaths;
  currentWork: CurrentWorkSummary;
  stage: string | null;
  discoveries: string[];
  activeRuns?: ActiveRunSummary[];
}

export class ActiveContextEngine {
  public readonly projectRoot: string;
  private readonly options: ActiveContextEngineOptions;
  private cachedContext: ActiveTaskContext | null = null;
  private cacheExpiresAt: number = 0;

  constructor(projectRoot: string = process.cwd(), options: ActiveContextEngineOptions = {}) {
    this.projectRoot = path.resolve(projectRoot);
    this.options = options;
  }

  /**
   * Resolves active context paths for repository and branch.
   */
  public async getPaths(branch?: string): Promise<ActiveContextPaths> {
    return resolveActiveContextPaths(this.projectRoot, branch);
  }

  /**
   * Retrieves current work summary from living spec.
   */
  public async getCurrentWork(paths?: ActiveContextPaths): Promise<CurrentWorkSummary> {
    const resolvedPaths = paths || (await this.getPaths());
    const devflowFeatureFile = resolvedPaths.featureSpecPath;

    if (!devflowFeatureFile) {
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

    try {
      let activeRunningId: string | null = null;
      if (resolvedPaths.stagePath) {
        try {
          const stageContent = await fs.readFile(resolvedPaths.stagePath, "utf8");
          const match = stageContent.match(
            /^-\s+(?:\*\*)?Active Running ID(?:\*\*)?:\s*\x60?([^\r\n\x60]+)/im
          );
          const val = match?.[1]?.trim() || "";
          if (val && val.toLowerCase() !== "none" && val.toLowerCase() !== "idle") {
            activeRunningId = val;
          }
        } catch {}
      }

      const stats = await fs.lstat(devflowFeatureFile).catch(() => null);
      if (stats?.isFile()) {
        const content = await fs.readFile(devflowFeatureFile, "utf8");
        if (
          content.trim() !== "" &&
          !content.includes("_Nothing in progress.") &&
          !/Nothing in progress|None in progress|No active feature|No active work/i.test(content)
        ) {
          const summary = parseCurrentWork(content);
          if (summary.state === "active" && activeRunningId) {
            summary.runId = activeRunningId;
          }
          return summary;
        }
      }
    } catch {}

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

  /**
   * Retrieves active task context atomically.
   */
  public async getActiveContext(branch?: string): Promise<ActiveTaskContext> {
    const now = Date.now();
    if (this.options.cacheTtlMs && this.cachedContext && now < this.cacheExpiresAt && !branch) {
      return this.cachedContext;
    }

    const paths = await this.getPaths(branch);
    const currentWork = await this.getCurrentWork(paths);

    let stage: string | null = null;
    let track: "fast" | "deep" | "idle" = "idle";
    let activeRunningId: string | null = paths.runId || currentWork.runId || null;


    if (paths.stagePath) {
      try {
        const stageContent = await fs.readFile(paths.stagePath, "utf8");
        const stageMatch = stageContent.match(/Current Stage:\s*`?([^`\r\n]+)`?/i);
        if (stageMatch) {
          stage = stageMatch[1].trim();
        }

        const trackMatch = stageContent.match(/Track:\s*`?([^`\r\n]+)`?/i);
        if (trackMatch) {
          const t = trackMatch[1].trim().toLowerCase();
          if (t === "fast" || t === "deep" || t === "idle") {
            track = t;
          }
        }

        const idMatch = stageContent.match(/Active Running ID:\s*`?([^`\r\n]+)`?/i);
        if (idMatch && idMatch[1].trim().toLowerCase() !== "none") {
          activeRunningId = idMatch[1].trim();
        }
      } catch {
        // stage file not found or unreadable
      }
    }

    // Discoveries check
    const discoveriesSummary = await readDiscoveries(this.projectRoot).catch(() => ({ total: 0, recent: [] }));
    const discoveries = (discoveriesSummary.recent || []).map((d) => d.id);

    // State determination
    let state: "idle" | "active" | "pre-flight" = "idle";
    if (currentWork.state === "active" || (activeRunningId && activeRunningId.toLowerCase() !== "none")) {
      state = "active";
      if (track === "idle") {
        track = "fast";
      }
    } else if (discoveries.length > 0) {
      state = "pre-flight";
      track = "deep";
    }

    const activeRuns = await listActiveRunContexts(this.projectRoot).catch(() => []);

    const context: ActiveTaskContext = {
      state,
      runId: activeRunningId,
      track,
      paths,
      currentWork,
      stage,
      discoveries,
      activeRuns
    };

    if (this.options.cacheTtlMs && !branch) {
      this.cachedContext = context;
      this.cacheExpiresAt = now + this.options.cacheTtlMs;
    }

    return context;
  }

  /**
   * Retrieves all active runs in multi-task context.
   */
  public async getActiveRuns(): Promise<ActiveRunSummary[]> {
    return listActiveRunContexts(this.projectRoot);
  }

  /**
   * Retrieves discoveries summary.
   */
  public async getDiscoveries(): Promise<DiscoverySummary> {
    return readDiscoveries(this.projectRoot);
  }

  /**
   * Clears in-memory cached context.
   */
  public invalidate(): void {
    this.cachedContext = null;
    this.cacheExpiresAt = 0;
  }
}

