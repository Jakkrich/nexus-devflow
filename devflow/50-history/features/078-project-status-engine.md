# Living Spec: 078-project-status-engine

> **Status**: Completed  
> **Phase**: 04 Upkeep & Refactoring (ADR-0009)  
> **Track**: Fast-Track Refactor  
> **Testing Seam**: `ProjectStatusEngine.getStatus()` in-memory seam (`packages/create-nexus-devflow/lib/project-status-engine.ts`)

---

## 1. Context & Architecture Seam

`packages/create-nexus-devflow/lib/status.ts` is currently a 788-line procedural coordinator that manually imports 9 separate files to calculate project health, active tasks, review states, and recommendations.

### The New Deep Module:
- **`ProjectStatusEngine`**: Deep engine that provides:
  - `getStatus(options?: StatusOptions): Promise<ProjectStatus>`: Returns atomic, complete project status.
  - `formatHuman(status: ProjectStatus, options?: { color?: boolean }): string`: Renders human-readable CLI report.
- **Composition of Deep Engines**:
  - Encapsulates active context, run-state, review receipts, findings, ideas, and git status.
  - Retains full backward compatibility in `status.ts` with `readProjectStatus` and `formatHumanStatus`.

---

## 2. Invariants & Acceptance Criteria

1. **Deterministic Seam**: `getStatus()` returns the complete typed `ProjectStatus` domain model containing `activeRun`, `currentWork`, `findings`, `git`, `review`, `completion`, `nextAction`.
2. **Backward Compatibility**: `status.ts` exports `ProjectStatusEngine`, `readProjectStatus`, and `formatHumanStatus` without breaking any existing callers.
3. **All Tests Pass**: Existing status tests in `test/status.test.ts` and `test/project-status-engine.test.ts` pass with zero failures.

---

## 3. Tasks & Tracer-Bullet Tickets

- [x] **Ticket 01**: Implement `ProjectStatusEngine` core class in `packages/create-nexus-devflow/lib/project-status-engine.ts`.
- [x] **Ticket 02**: Wire `status.ts` as a backward-compatible facade re-exporting `ProjectStatusEngine`, `readProjectStatus`, and `formatHumanStatus`.
- [x] **Ticket 03**: Implement comprehensive unit tests in `packages/create-nexus-devflow/test/project-status-engine.test.ts`.

