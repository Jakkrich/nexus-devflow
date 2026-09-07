# 0006: Absorb 4-Stage Task Archiving and History into DeliveryLifecycleEngine

## Context & Decision

Task delivery in Nexus-DevFlow was previously coordinated across ad-hoc agent instructions, shell scripts, and a passive read-only parser (`history.ts`):
1. Archiving living specs (`devflow/context/{xxx-slug}/spec.md`) into categorized directories (`features/`, `fixes/`, `rollbacks/`).
2. Appending resolved findings and independent review receipts to the archive file.
3. Parsing and updating the markdown table in `devflow/history/HISTORY.md`.
4. Checking off (or unchecking for rollbacks) corresponding build plan items in `devflow/build-plan.md`.
5. Resetting workflow pointers in `stage.md` and transition status in `devflow/.state/run.json`.
6. Cleaning up the active task context directory.

If an AI agent or script encountered a failure midway, the workspace could be left in an inconsistent, half-archived state (e.g. ledger written without context cleanup, or context deleted without ledger entry). Furthermore, `history.ts` provided only passive reading methods without any mutation or serialization model.

We decided to create a deep **Delivery Lifecycle Engine** (`DeliveryLifecycleEngine` class in `packages/create-nexus-devflow/lib/delivery-lifecycle-engine.ts`) with an atomic `archiveTask(taskId, options)` method that coordinates archiving, history ledger mutation, build plan synchronization, context teardown, and run state transitions with transaction rollback protection. Low-level history parsing and table serialization are encapsulated inside a structured `HistoryLedger` model.

## Considered Options

- **Loose coordination via agent prompts or scripts**: Rejected because relying on LLM tool calls or shell scripts for multi-file state updates causes silent partial failures, malformed markdown table rows, and orphaned context stubs.
- **Direct Git commit inside the engine**: Rejected because DevFlow enforces a Mandatory User Delivery Gate (Team MR/PR vs Direct Squash-Merge). The engine prepares and verifies filesystem state and produces a structured `DeliveryCommitPlan`, leaving Git workflow execution to the user-approved delivery gate.

## Consequences

- Task archiving and history updates become atomic and transactionally safe against mid-run errors.
- `HISTORY.md` table mutations are managed via a typed `HistoryLedger` in-memory model, ensuring deterministic column formatting and link generation.
- The boundary between filesystem delivery preparation and Git branch delivery (MR/PR vs Squash) remains clean and testable.
- Legacy `history.ts` functions (`readHistory`, `readHistoryLedger`, `parseHistoryItem`, `formatHistoryHuman`) remain supported as backward-compatible facades delegating to `DeliveryLifecycleEngine`.
