import fs from "node:fs/promises";
import fsSync from "node:fs";
import { resolveActiveContextPaths } from "./branch-context.js";

export type SwarmRole = "coder" | "qa" | "security" | "architect";

export interface SwarmAgentDefinition {
  role: SwarmRole;
  name: string;
  avatar: string;
  responsibility: string;
  recommendedModelTier: "fast" | "reasoning" | "standard";
}

export interface SwarmSubtask {
  id: string;
  role: SwarmRole;
  title: string;
  description: string;
  requiredContext: string[];
  verificationCriterion: string;
  parallelGroup: number;
}

export interface SwarmPlan {
  runId: string;
  title: string;
  track: string;
  totalTasks: number;
  executionStrategy: "parallel" | "sequential" | "hybrid";
  agentRoster: SwarmAgentDefinition[];
  tasks: SwarmSubtask[];
}

export interface SwarmPlanOptions {
  branch?: string;
}

export const SWARM_ROSTER: SwarmAgentDefinition[] = [
  {
    role: "architect",
    name: "Lead Architect Orchestrator",
    avatar: "👑",
    responsibility: "Analyzes system requirements, ensures design invariants, and signs off Quality Gates.",
    recommendedModelTier: "reasoning"
  },
  {
    role: "coder",
    name: "Core Implementation Specialist",
    avatar: "👨‍💻",
    responsibility: "Executes implementation steps, writes clean type-safe code, and adheres to standards.",
    recommendedModelTier: "standard"
  },
  {
    role: "qa",
    name: "QA Verification & Red-Team Verifier",
    avatar: "🕵️",
    responsibility: "Designs unit/smoke test suites, tests boundary edge cases, and captures proof.",
    recommendedModelTier: "reasoning"
  },
  {
    role: "security",
    name: "Security & Standards Auditor",
    avatar: "🛡️",
    responsibility: "Scans for security vulnerabilities, evaluates findings ledger, and ensures zero blockers.",
    recommendedModelTier: "fast"
  }
];

/**
 * Generates an optimized Multi-Agent Swarm Execution Plan from the active living spec.
 */
export async function generateSwarmPlan(
  projectRoot: string,
  options: SwarmPlanOptions = {}
): Promise<SwarmPlan> {
  const contextPaths = await resolveActiveContextPaths(projectRoot, options.branch);

  let runId = "ACTIVE";
  let title = "Active Feature";
  let track = "fast";
  const tasks: SwarmSubtask[] = [];

  if (fsSync.existsSync(contextPaths.featureSpecPath)) {
    const specContent = await fs.readFile(contextPaths.featureSpecPath, "utf8");

    // Extract title & ID
    const titleMatch = specContent.match(/^#\s+📐\s+\[([^\]]+)\]\s+(.*)/m);
    if (titleMatch) {
      runId = titleMatch[1];
      title = titleMatch[2];
    }

    // Parse checklist tasks
    const lines = specContent.split("\n");
    let inChecklist = false;
    let taskIndex = 1;

    for (const line of lines) {
      if (/##\s+3\.\s+Implementation\s+Checklist/i.test(line)) {
        inChecklist = true;
        continue;
      }
      if (inChecklist && (/^##+\s+/.test(line) || line.startsWith("---"))) {
        inChecklist = false;
        continue;
      }

      if (inChecklist && /^[*-]\s+\[[ x]\]\s+\*\*([^*]+)\*\*/.test(line)) {
        const match = line.match(/^[*-]\s+\[[ x]\]\s+\*\*([^*]+)\*\*/);
        const taskTitle = match ? match[1] : `Task ${taskIndex}`;

        let role: SwarmRole = "coder";
        if (/test|verify|check|qa/i.test(taskTitle)) role = "qa";
        else if (/security|audit|gate|findings/i.test(taskTitle)) role = "security";
        else if (/spec|design|manifest|architect/i.test(taskTitle)) role = "architect";

        tasks.push({
          id: `TASK-${taskIndex}`,
          role,
          title: taskTitle,
          description: `Execute ${taskTitle} with role-specialized focus and rigorous verification.`,
          requiredContext: ["devflow/context/current-feature.md", "devflow/context/coding-standards.md"],
          verificationCriterion: `Pass multi-lane quality gate and done-when assertions for ${taskTitle}.`,
          parallelGroup: role === "qa" || role === "security" ? 2 : 1
        });
        taskIndex++;
      }
    }
  }

  // If no tasks were extracted from spec, provide default swarm structure
  if (tasks.length === 0) {
    tasks.push(
      {
        id: "TASK-1",
        role: "architect",
        title: "Specification & Alignment Verification",
        description: "Align living spec with project architectural invariants.",
        requiredContext: ["devflow/context/current-feature.md"],
        verificationCriterion: "Spec adheres to 3-Pillars contract.",
        parallelGroup: 1
      },
      {
        id: "TASK-2",
        role: "coder",
        title: "Core Logic Implementation",
        description: "Develop required functions and modules.",
        requiredContext: ["devflow/context/current-feature.md", "devflow/context/coding-standards.md"],
        verificationCriterion: "Code builds and passes typecheck.",
        parallelGroup: 2
      },
      {
        id: "TASK-3",
        role: "qa",
        title: "Automated Test & Edge Case Coverage",
        description: "Author comprehensive unit tests and run verification.",
        requiredContext: ["devflow/context/current-feature.md"],
        verificationCriterion: "100% test pass rate with zero regressions.",
        parallelGroup: 2
      },
      {
        id: "TASK-4",
        role: "security",
        title: "Security & Standards Audit Pass",
        description: "Verify findings ledger and quality gatekeeper.",
        requiredContext: ["devflow/context/findings.md"],
        verificationCriterion: "0 P0/P1 active blockers.",
        parallelGroup: 3
      }
    );
  }

  const executionStrategy: "parallel" | "sequential" | "hybrid" =
    tasks.some((t) => t.parallelGroup > 1) ? "hybrid" : "sequential";

  return {
    runId,
    title,
    track,
    totalTasks: tasks.length,
    executionStrategy,
    agentRoster: SWARM_ROSTER,
    tasks
  };
}
