# 055-eliminate-dashboard-git-cache-stampede: Eliminate Dashboard Git Cache Stampede

- **Fix ID**: `055-eliminate-dashboard-git-cache-stampede`
- **Category**: `fixes`
- **Type**: `Fix`
- **Target Branch**: `2.5.0`
- **Status**: `Verified / Ready for /complete`
- **Track**: `Unified Fast-Track`
- **Supersedes Verification**: Fix 054 latency claims that do not reproduce under concurrent Git reads

---

## 🎯 1. Define & Boundaries

### The problem

Dashboard snapshot latency remains 10–19 seconds after Fix 054. `readGitStatus()` caches only completed values, so concurrent cache misses each launch a full Git subprocess batch. The cache expiry is calculated before those subprocesses finish; when execution exceeds the 2-second TTL, the newly stored value is already stale.

`readProjectStatus()` triggers this condition internally by running `resolveActiveContextPaths()` and `readGitStatus()` concurrently, while dashboard drift/swarm work can add further reads. `GET /` waits for the complete snapshot, so the subprocess storm directly delays first paint.

### The fix

- Coalesce concurrent `readGitStatus()` misses per project root by sharing one in-flight Promise.
- Start the TTL when Git computation completes, not when it starts.
- Ensure cache clearing removes both completed and in-flight state.
- Reuse the already-resolved Git branch in dashboard swarm/context resolution where practical.
- Add regression coverage that deterministically proves concurrent callers perform one Git computation and that the completed value receives a full TTL.

### Must not break

- `forceFresh` must still bypass a completed cached value.
- Failed Git reads must not leave a rejected Promise permanently cached.
- Separate project roots must retain independent cache state.
- Existing public status, drift, gatekeeper, swarm, and dashboard response shapes must remain compatible.

---

## 📐 2. Technical Spec & Contracts

### Cache contract

- Cache key: normalized/resolved project root.
- At most one normal in-flight Git status computation per key.
- Successful completion stores the value with `expiresAt = completionTime + ttlMs`.
- Failure clears in-flight state and remains retryable.
- `clearGitStatusCache()` clears all cache state for test isolation.

### Acceptance criteria

- [x] **AC-1**: Five concurrent `readGitStatus()` calls for one root share one underlying computation.
- [x] **AC-2**: The first call immediately after a slow computation is served from cache within 50 ms.
- [x] **AC-3**: Failure does not poison the cache; a subsequent call can retry successfully.
- [x] **AC-4**: Dashboard snapshot no longer creates duplicate branch-resolution Git work and meets `< 2,000 ms` uncached / `< 250 ms` warm under the local benchmark.
- [x] **AC-5**: Focused tests, `npm test`, `npm run typecheck`, and `npm run check` pass.

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Make Git status cache single-flight and completion-based**
  - [x] 1.1 `[TDD-Red]` Add deterministic concurrent, post-completion TTL, and failure-retry tests.
  - [x] 1.2 `[TDD-Green]` Implement the minimal in-flight cache and completion-time expiry behavior.
  - [x] 1.3 `[TDD-Refactor]` Keep cache lifecycle and `forceFresh` semantics explicit and type-safe.

- [x] **Task 2: Remove avoidable dashboard Git re-entry**
  - [x] 2.1 `[TDD-Red]` Add coverage proving pre-resolved branch/context avoids another Git status read.
  - [x] 2.2 `[TDD-Green]` Pass resolved branch/context into swarm generation and dashboard consumers.
  - [x] 2.3 `[TDD-Refactor]` Preserve existing public response contracts.

- [x] **Task 3: Re-run performance and quality gates**
  - [x] 3.1 Benchmark uncached, warm, and concurrent snapshot paths against AC-4.
  - [x] 3.2 Run focused tests, full tests, typecheck, and `npm run check`.

---

## ⚡ 4. Implementation Log & Evidence

- **Task 1 — Git status single-flight cache**:
  - RED: focused suite exposed two failures for concurrent coalescing/TTL and failure retry.
  - GREEN: five concurrent callers now share one Git computation; TTL begins on successful completion; rejected in-flight work is removed.
  - Proof: focused `5/5`, full `npm test` `98/98`, and `npm run check` passed including typecheck, 112 routing evals, and package smoke test.
- **Task 2 — Pre-resolved swarm branch context**:
  - RED: swarm selected default run `048-swarm-test` instead of branch-scoped `055-branch-context`.
  - GREEN: `generateSwarmPlan()` accepts an optional branch and Dashboard passes `status.git.branch` directly.
  - Proof: focused `7/7`, full `npm test` `99/99`, and `npm run check` passed with unchanged response contracts.
- **Task 3 — Performance and quality gates**:
  - Snapshot benchmark: cold `1,402 ms`, warm `12 ms`, five concurrent snapshots `1,309 ms` total.
  - HTTP benchmark on a temporary server loading current source: `268 ms`, `57 ms`, and `19 ms` after startup.
  - Final proof: `npm test` `99/99`, typecheck clean, routing evals `112/112`, package smoke test passed, and `npm run check` passed.

---

## 🧪 5. Multi-Lane Verification Matrix

### Stage 1: Spec Fidelity & Acceptance Gate

| Criterion | Verdict | Empirical evidence |
| :--- | :---: | :--- |
| AC-1: Five concurrent callers share one Git computation | PASS | Focused regression test observed one five-command computation across five callers. |
| AC-2: Full TTL begins after slow completion | PASS | Deterministic clock regression passed; observed snapshot warm latency `5 ms` and sequential HTTP warm latency `43 ms` / `15 ms`. |
| AC-3: Failed in-flight work remains retryable | PASS | Simulated `git status` rejection followed by a successful retry in the focused suite. |
| AC-4: Dashboard latency and branch reuse | PASS | Snapshot cold `1,079 ms`, warm `5 ms`; five concurrent HTTP requests all returned 200 in `930–959 ms`; sequential HTTP returned 200 in `489 ms`, `43 ms`, `15 ms`. |
| AC-5: Quality commands pass | PASS | Focused `12/12`, full `npm test` `99/99`, typecheck clean, routing `112/112`, package smoke test passed, and `npm run check` passed. |

### Stage 2: Code Quality, Security & Architecture Gate

| Lane | Verdict | Evidence |
| :--- | :---: | :--- |
| Type & Syntax | PASS | `tsc --noEmit` completed with 0 errors through `npm run check`. |
| Automated Tests | PASS | Package tests `95/95` plus overview tests `4/4`; focused dashboard/cache/swarm tests `12/12`. |
| Runtime/API | PASS | Temporary server loading current branch returned schema version 1 and HTTP 200 for all sequential and concurrent `/api/dashboard` requests. |
| Security & Hygiene | PASS with scanner note | `git diff --check` passed. The repository scanner flagged unchanged rollback instructions containing the prohibition “Never use git reset --hard”; inspection confirmed these are safety rules, not executable behavior or changes in this fix. |
| Findings Ledger | PASS | 0 active P0/P1 findings. |

**Final Verdict**: Verified. All acceptance criteria passed and Fix 055 is ready for `/complete`.

---

## 📦 6. Release Digest & Retrospective

### Release summary

- Eliminated concurrent Git cache stampedes by coalescing normal cache misses into one in-flight computation per resolved project root.
- Moved TTL expiry to successful completion time so slow Git work still receives the full cache lifetime.
- Kept failed computations retryable and preserved `forceFresh` behavior.
- Reused the resolved Git branch when generating the dashboard swarm plan, avoiding unnecessary Git discovery.

### Verification proof

- Snapshot: cold `1,079 ms`, warm `5 ms`.
- HTTP: sequential `489 ms`, `43 ms`, `15 ms`; five concurrent requests `930–959 ms`, all HTTP 200 with schema version 1.
- Automated verification: focused `12/12`, full `npm test` `99/99`, typecheck clean, routing `112/112`, package smoke test passed, and `npm run check` passed.

### Retrospective

- A value-only TTL cache does not prevent concurrent misses; async caches need explicit single-flight behavior.
- TTL must start after computation, otherwise slow work can publish an already-expired entry.
- Performance verification must exercise a real Git repository and concurrent requests; sequential temporary-directory tests cannot expose subprocess stampedes.
