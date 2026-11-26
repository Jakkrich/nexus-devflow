import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  evaluateWorktreeGuard,
  reserveNextRunningId
} from "../packages/create-nexus-devflow/lib/branch-context.js";

type ActorId = "a1" | "a2";
type Phase = "idle" | "reserved" | "implementing" | "done";
type Mode = "sound" | "broken_no_wx_lock" | "broken_no_checkout_guard";

interface ModelState {
  readonly phases: Record<ActorId, Phase>;
  readonly heldIds: Record<ActorId, number | null>;
  readonly committedByActor: Record<ActorId, number | null>;
  readonly checkoutOwner: ActorId | null;
}

export interface ModelCheckResult {
  readonly passed: boolean;
  readonly exploredStates: number;
  readonly transitions: number;
  readonly violatedInvariant: string | null;
  readonly counterexample: readonly string[];
}

const ACTORS: readonly ActorId[] = ["a1", "a2"];
const IDS: readonly number[] = [1, 2, 3];

function serializeState(s: ModelState): string {
  return JSON.stringify([
    s.phases.a1,
    s.phases.a2,
    s.heldIds.a1,
    s.heldIds.a2,
    s.committedByActor.a1,
    s.committedByActor.a2,
    s.checkoutOwner
  ]);
}

function cloneState(s: ModelState): ModelState {
  return {
    phases: { ...s.phases },
    heldIds: { ...s.heldIds },
    committedByActor: { ...s.committedByActor },
    checkoutOwner: s.checkoutOwner
  };
}

function maxCommitted(s: ModelState): number {
  let max = 0;
  for (const a of ACTORS) {
    const id = s.committedByActor[a];
    if (id !== null && id > max) max = id;
  }
  return max;
}

function checkInvariants(s: ModelState): string | null {
  // Invariant 1: No two actors may hold or own the same running ID simultaneously.
  const activeIds: number[] = [];
  for (const a of ACTORS) {
    const id = s.heldIds[a] ?? s.committedByActor[a];
    if (id !== null) {
      if (activeIds.includes(id)) {
        return `NoDuplicateRunningId (both actors allocated running ID ${id})`;
      }
      activeIds.push(id);
    }
  }

  // Invariant 2: At most one actor may actively implement in the shared main checkout.
  const implementingInMain = ACTORS.filter(
    (a) => s.phases[a] === "implementing" && s.checkoutOwner === a
  );
  if (implementingInMain.length > 1) {
    return `NoSharedMainCheckout (concurrent actors in main checkout: ${implementingInMain.join(", ")})`;
  }
  if (
    ACTORS.filter((a) => s.phases[a] === "implementing").length > 1
  ) {
    return "NoSharedMainCheckout (more than one actor implementing in main checkout)";
  }

  return null;
}

function nextTransitions(
  s: ModelState,
  mode: Mode
): Array<{ label: string; next: ModelState }> {
  const edges: Array<{ label: string; next: ModelState }> = [];
  const baseMax = maxCommitted(s);

  for (const a of ACTORS) {
    if (s.phases[a] === "idle") {
      for (const id of IDS) {
        if (id <= baseMax) continue;
        const alreadyCommitted = ACTORS.some((other) => s.committedByActor[other] === id);
        const alreadyLocked = ACTORS.some((other) => s.heldIds[other] === id);
        if (alreadyCommitted) continue;
        if (mode !== "broken_no_wx_lock" && alreadyLocked) continue;

        const next = cloneState(s);
        next.phases[a] = "reserved";
        next.heldIds[a] = id;
        edges.push({ label: `ReserveId(${a}, ${id})`, next });
      }
    } else if (s.phases[a] === "reserved") {
      const heldId = s.heldIds[a];
      if (heldId !== null) {
        // Path A: Enter main checkout (guarded by same_checkout_active_run unless broken)
        if (mode === "broken_no_checkout_guard" || s.checkoutOwner === null) {
          edges.push({
            label: `EnterMainCheckout(${a}, id=${heldId})`,
            next: {
              phases: { ...s.phases, [a]: "implementing" },
              heldIds: { ...s.heldIds, [a]: null },
              committedByActor: { ...s.committedByActor, [a]: heldId },
              checkoutOwner: a
            }
          });
        }

        // Path B: Enter isolated linked worktree (never collides with main checkout)
        const wtNext = cloneState(s);
        wtNext.phases[a] = "done";
        wtNext.heldIds[a] = null;
        wtNext.committedByActor[a] = heldId;
        edges.push({ label: `EnterIsolatedWorktree(${a}, id=${heldId})`, next: wtNext });
      }
    } else if (s.phases[a] === "implementing") {
      edges.push({
        label: `CompleteMainRun(${a})`,
        next: {
          phases: { ...s.phases, [a]: "done" },
          heldIds: { ...s.heldIds },
          committedByActor: { ...s.committedByActor },
          checkoutOwner: s.checkoutOwner === a ? null : s.checkoutOwner
        }
      });
    }
  }

  return edges;
}

/**
 * Exhaustively explore all reachable interleavings of RunStateAllocation up to MaxId=3.
 */
export function runExhaustiveModelCheck(mode: Mode = "sound"): ModelCheckResult {
  const initial: ModelState = {
    phases: { a1: "idle", a2: "idle" },
    heldIds: { a1: null, a2: null },
    committedByActor: { a1: null, a2: null },
    checkoutOwner: null
  };

  const visited = new Set<string>([serializeState(initial)]);
  const queue: Array<{ state: ModelState; path: string[] }> = [{ state: initial, path: [] }];
  let transitions = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const violation = checkInvariants(current.state);
    if (violation) {
      return {
        passed: false,
        exploredStates: visited.size,
        transitions,
        violatedInvariant: violation,
        counterexample: current.path
      };
    }

    for (const edge of nextTransitions(current.state, mode)) {
      transitions += 1;
      const key = serializeState(edge.next);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: edge.next, path: [...current.path, edge.label] });
      }
    }
  }

  return {
    passed: true,
    exploredStates: visited.size,
    transitions,
    violatedInvariant: null,
    counterexample: []
  };
}

/**
 * Verify the real implementation in branch-context.ts matches the model invariants.
 */
export async function verifyRealCodeParity(): Promise<void> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "devflow-formal-parity-"));
  try {
    await fs.mkdir(path.join(tempDir, "devflow", ".state", "runs"), { recursive: true });
    await fs.mkdir(path.join(tempDir, "devflow", "context"), { recursive: true });

    const [r1, r2] = await Promise.all([
      reserveNextRunningId(tempDir, { ownerToken: "actor-1" }),
      reserveNextRunningId(tempDir, { ownerToken: "actor-2" })
    ]);
    assert.notEqual(r1.id, r2.id, "Concurrent reserveNextRunningId must allocate distinct IDs");
    await Promise.all([r1.release(), r2.release()]);

    const nowIso = new Date().toISOString();
    await fs.writeFile(
      path.join(tempDir, "devflow", ".state", "runs", "001-active.json"),
      JSON.stringify({
        schemaVersion: 1,
        runId: "001-active",
        command: "implement",
        status: "running",
        summary: "Active run 001",
        startedAt: nowIso,
        updatedAt: nowIso
      })
    );
    const guard = await evaluateWorktreeGuard(tempDir, "002-second", { intent: "implement" });
    assert.equal(guard.allowed, false);
    if (!guard.allowed) {
      assert.equal(guard.reason, "same_checkout_active_run");
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  const proveDetection = process.argv.includes("--prove-detection");

  const sound = runExhaustiveModelCheck("sound");
  if (!sound.passed) {
    console.error(
      `FAIL: ${sound.violatedInvariant}\nCounterexample:\n  ${sound.counterexample.join("\n  ")}`
    );
    process.exit(1);
  }
  console.log(
    `PASS: RunStateAllocation sound model verified (${sound.exploredStates} states, ${sound.transitions} transitions, 0 violations).`
  );

  await verifyRealCodeParity();
  console.log("PASS: Real-code parity check (reserveNextRunningId + evaluateWorktreeGuard) succeeded.");

  if (proveDetection) {
    const brokenLock = runExhaustiveModelCheck("broken_no_wx_lock");
    assert.equal(brokenLock.passed, false, "broken_no_wx_lock must fail");
    console.log(
      `PASS (broken variant caught): ${brokenLock.violatedInvariant} -> [${brokenLock.counterexample.join(" -> ")}]`
    );

    const brokenGuard = runExhaustiveModelCheck("broken_no_checkout_guard");
    assert.equal(brokenGuard.passed, false, "broken_no_checkout_guard must fail");
    console.log(
      `PASS (broken variant caught): ${brokenGuard.violatedInvariant} -> [${brokenGuard.counterexample.join(" -> ")}]`
    );
  }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` || process.argv[1]?.endsWith("check-run-isolation.ts")) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
