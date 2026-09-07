import {
  ProjectStatusEngine,
  type CompletionState,
  type HumanStatusOptions,
  type ProjectStatus,
  type StatusActivity,
  type StatusActiveRun,
  type StatusCompletion,
  type StatusCurrentWork,
  type StatusFindings,
  type StatusNextAction,
  type StatusWarning
} from "./project-status-engine.js";

async function readProjectStatus(
  startPath: string = process.cwd()
): Promise<ProjectStatus> {
  const engine = new ProjectStatusEngine(startPath);
  return engine.getStatus();
}

function formatHumanStatus(
  status: ProjectStatus,
  options: HumanStatusOptions = {}
): string {
  const engine = new ProjectStatusEngine(status.project?.root || process.cwd());
  return engine.formatHuman(status, options);
}

function shouldUseColor(
  isTTY: boolean | undefined = process.stdout.isTTY,
  environment: NodeJS.ProcessEnv = process.env
): boolean {
  const engine = new ProjectStatusEngine();
  return engine.shouldUseColor(isTTY, environment);
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
