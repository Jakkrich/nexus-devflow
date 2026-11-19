#!/usr/bin/env node
// Exhaustive & concurrent property check for Multi-Chat Safe Isolation.
// Property: two concurrent DevFlow runs never overwrite each other's per-run
// activity state, never allocate duplicate running IDs across worktrees, are
// blocked by evaluateWorktreeGuard before colliding on checkout/branch, and
// aggregate cleanly into status with handoff summaries intact.

import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import {
  evaluateWorktreeGuard,
  initRunContext,
  listWorktreeRunContexts,
  reserveNextRunningId
} from "../packages/create-nexus-devflow/lib/branch-context.js";
import { ProjectStatusEngine } from "../packages/create-nexus-devflow/lib/project-status-engine.js";
import { readAllRunStates } from "../packages/create-nexus-devflow/lib/run-state.js";

const execFile = promisify(execFileCb);
const RUN_STATE_HELPER = path.resolve(
  ".agents",
  "skills",
  "devflow",
  "scripts",
  "run-state.mjs"
);

type Clause =
  | "state-isolation"
  | "worktree-guard"
  | "id-uniqueness"
  | "aggregation-completeness";

async function runHelper(cwd: string, args: string[]): Promise<void> {
  await execFile(process.execPath, [RUN_STATE_HELPER, ...args], { cwd });
}

async function setupGitRepoWithWorktree(baseDir: string): Promise<{
  primaryDir: string;
  siblingWt: string;
}> {
  const primaryDir = path.join(baseDir, "primary");
  const siblingWt = path.join(baseDir, "wt-sibling");
  await fs.mkdir(path.join(primaryDir, "devflow", "context"), { recursive: true });
  await fs.mkdir(path.join(primaryDir, "devflow", ".state", "runs"), { recursive: true });
  await fs.mkdir(path.join(primaryDir, ".agents", "skills"), { recursive: true });
  await fs.writeFile(path.join(primaryDir, "AGENTS.md"), "# DevFlow\n", "utf8");

  await execFile("git", ["init", "-b", "main", primaryDir]);
  await execFile("git", ["-C", primaryDir, "config", "user.name", "DevFlow Proof"]);
  await execFile("git", ["-C", primaryDir, "config", "user.email", "proof@nexus.local"]);
  await execFile("git", ["-C", primaryDir, "add", "."]);
  await execFile("git", ["-C", primaryDir, "commit", "-m", "init"]);
  await execFile("git", ["-C", primaryDir, "worktree", "add", siblingWt, "-b", "feature/200-sibling"]);
  return { primaryDir, siblingWt };
}

async function verifyStateIsolation(
  baseDir: string,
  found: Map<Clause, string>
): Promise<number> {
  const intents = ["feature", "implement", "check"] as const;
  let cases = 0;

  for (const cmdA of intents) {
    for (const cmdB of intents) {
      cases += 1;
      const root = path.join(baseDir, `state-iso-${cases}`);
      await fs.mkdir(path.join(root, "devflow", ".state"), { recursive: true });

      await Promise.all([
        runHelper(root, [
          "start",
          "--run-id", "130-run-a",
          "--branch", "feature/130-run-a",
          "--worktree", root,
          "--command", cmdA,
          "--summary", `Run A ${cmdA}`,
          "--boundary", "reviewed",
          "--handoff-note", `Note A ${cmdA}`
        ]),
        runHelper(root, [
          "start",
          "--run-id", "131-run-b",
          "--branch", "feature/131-run-b",
          "--worktree", `${root}-wt`,
          "--command", cmdB,
          "--summary", `Run B ${cmdB}`,
          "--boundary", "local-only",
          "--handoff-note", `Note B ${cmdB}`
        ])
      ]);

      const collection = await readAllRunStates(root);
      const a = collection.runs.find((r) => r.runId === "130-run-a");
      const b = collection.runs.find((r) => r.runId === "131-run-b");
      if (!a || !b || a.command !== cmdA || b.command !== cmdB) {
        found.set(
          "state-isolation",
          `cmdA=${cmdA} cmdB=${cmdB} -> count=${collection.runs.length} a=${a?.command ?? "missing"} b=${b?.command ?? "missing"}`
        );
        return cases;
      }
    }
  }
  return cases;
}

async function verifyWorktreeGuardMatrix(
  baseDir: string,
  found: Map<Clause, string>
): Promise<number> {
  const intents = ["feature_spec", "implement"] as const;
  const siblingMatchStates = [false, true] as const;
  const otherStatuses = ["none", "running", "ready", "completed"] as const;
  let cases = 0;

  for (const intent of intents) {
    for (const siblingMatch of siblingMatchStates) {
      for (const otherStatus of otherStatuses) {
        cases += 1;
        const caseDir = path.join(baseDir, `guard-${cases}`);
        const { primaryDir, siblingWt } = await setupGitRepoWithWorktree(caseDir);

        try {
          if (otherStatus !== "none") {
            await fs.writeFile(
              path.join(primaryDir, "devflow", ".state", "runs", "201-other.json"),
              JSON.stringify({
                schemaVersion: 1,
                runId: "201-other",
                branch: "feature/201-other",
                worktreePath: primaryDir,
                command: "implement",
                status: otherStatus,
                summary: "Other run",
                startedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }),
              "utf8"
            );
          }

          const targetRunId = siblingMatch ? "200-sibling" : "202-target";
          const targetBranch = siblingMatch ? "feature/200-sibling" : "feature/202-target";
          const verdict = await evaluateWorktreeGuard(primaryDir, targetRunId, {
            intent,
            targetBranch
          });

          const mustBlock =
            siblingMatch || (intent === "implement" && otherStatus === "running");

          if (mustBlock && verdict.allowed) {
            found.set(
              "worktree-guard",
              `intent=${intent} siblingMatch=${siblingMatch} otherStatus=${otherStatus} -> expected blocked, got allowed`
            );
            return cases;
          }
          if (!mustBlock && !verdict.allowed) {
            found.set(
              "worktree-guard",
              `intent=${intent} siblingMatch=${siblingMatch} otherStatus=${otherStatus} -> expected allowed, got ${verdict.reason}`
            );
            return cases;
          }
        } finally {
          await execFile("git", ["-C", primaryDir, "worktree", "remove", "--force", siblingWt]).catch(() => {});
        }
      }
    }
  }

  return cases;
}

async function verifyIdUniqueness(
  baseDir: string,
  found: Map<Clause, string>
): Promise<number> {
  let waves = 0;
  for (const [parallelCount, splitWorktrees] of [
    [4, false],
    [2, true],
    [4, true]
  ] as const) {
    waves += 1;
    const waveDir = path.join(baseDir, `id-wave-${waves}`);
    const { primaryDir, siblingWt } = await setupGitRepoWithWorktree(waveDir);

    try {
      const callers = Array.from({ length: parallelCount }, (_, idx) =>
        reserveNextRunningId(splitWorktrees && idx % 2 === 1 ? siblingWt : primaryDir, {
          ownerToken: `worker-${idx}`
        })
      );
      const reservations = await Promise.all(callers);
      const ids = reservations.map((r) => r.id);
      const uniqueCount = new Set(ids).size;
      await Promise.all(reservations.map((r) => r.release()));

      if (uniqueCount !== parallelCount) {
        found.set(
          "id-uniqueness",
          `parallelCount=${parallelCount} splitWorktrees=${splitWorktrees} -> collided IDs=[${ids.join(", ")}]`
        );
        return waves;
      }
    } finally {
      await execFile("git", ["-C", primaryDir, "worktree", "remove", "--force", siblingWt]).catch(() => {});
    }
  }
  return waves;
}

async function verifyAggregationCompleteness(
  baseDir: string,
  found: Map<Clause, string>
): Promise<number> {
  const aggDir = path.join(baseDir, "agg-check");
  const { primaryDir, siblingWt } = await setupGitRepoWithWorktree(aggDir);

  try {
    await initRunContext(primaryDir, "201-primary-feature", "Primary Feature", {
      branch: "feature/201-primary-feature"
    });
    await initRunContext(siblingWt, "200-sibling", "Sibling Feature", {
      branch: "feature/200-sibling"
    });

    await Promise.all([
      runHelper(primaryDir, [
        "start",
        "--run-id", "201-primary-feature",
        "--branch", "feature/201-primary-feature",
        "--worktree", primaryDir,
        "--command", "feature",
        "--summary", "Primary spec",
        "--boundary", "reviewed",
        "--handoff-note", "Primary handoff"
      ]),
      runHelper(siblingWt, [
        "start",
        "--run-id", "200-sibling",
        "--branch", "feature/200-sibling",
        "--worktree", siblingWt,
        "--command", "implement",
        "--summary", "Sibling build",
        "--boundary", "local-only",
        "--handoff-note", "Sibling handoff"
      ])
    ]);

    const [wtRuns, status] = await Promise.all([
      listWorktreeRunContexts(primaryDir),
      new ProjectStatusEngine(primaryDir).getStatus()
    ]);

    const hasPrimary = wtRuns.some(
      (r) => r.runId === "201-primary-feature" && r.handoff?.notes === "Primary handoff"
    );
    const hasSibling = status.worktreeRuns?.some(
      (r) =>
        r.runId === "200-sibling" &&
        !r.isCurrentWorktree &&
        r.handoff?.notes === "Sibling handoff"
    );

    if (!hasPrimary || !hasSibling) {
      found.set(
        "aggregation-completeness",
        `hasPrimary=${hasPrimary} hasSibling=${Boolean(hasSibling)} count=${wtRuns.length}`
      );
    }
  } finally {
    await execFile("git", ["-C", primaryDir, "worktree", "remove", "--force", siblingWt]).catch(() => {});
  }

  return 1;
}

async function main(): Promise<number> {
  const scratchRoot = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-formal-iso-"));
  const found = new Map<Clause, string>();

  try {
    const stateCases = await verifyStateIsolation(scratchRoot, found);
    const guardCases = await verifyWorktreeGuardMatrix(scratchRoot, found);
    const idWaves = await verifyIdUniqueness(scratchRoot, found);
    const aggCases = await verifyAggregationCompleteness(scratchRoot, found);

    console.log("verify-concurrent-run-isolation");
    console.log(
      `cases: ${stateCases} state-isolation + ${guardCases} worktree-guard + ${idWaves} id-waves + ${aggCases} aggregation`
    );
    console.log(
      "property: concurrent runs never overwrite sibling state or allocate duplicate IDs, guard blocks same-checkout/sibling-branch conflicts, and status aggregates every worktree handoff."
    );

    const clauses: readonly Clause[] = [
      "state-isolation",
      "worktree-guard",
      "id-uniqueness",
      "aggregation-completeness"
    ];

    for (const clause of clauses) {
      const detail = found.get(clause);
      if (!detail) {
        console.log(`${clause}: pass`);
      } else {
        console.log(`${clause}: FAIL`);
        console.log(`  ${detail}`);
      }
    }

    if (found.size > 0) {
      console.log("exit: 1");
      return 1;
    }
    console.log("exit: 0");
    return 0;
  } finally {
    await fs.rm(scratchRoot, { recursive: true, force: true });
  }
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
