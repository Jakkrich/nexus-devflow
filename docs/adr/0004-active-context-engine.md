# 0004: Consolidate Active Task Context and Workflow State behind ActiveContextEngine

## Context & Decision

Active task context resolution in Nexus-DevFlow was previously fragmented across 5 shallow modules:
1. `branch-context.ts`: resolved folder paths for active task workspaces (`devflow/context/{xxx-slug}/`), root fallbacks, and branch matching.
2. `current-work.ts`: inspected and parsed `spec.md` to count remaining tasks, checklist progress, and determine the next step.
3. `workflow-state.ts`: parsed `stage.md` to detect workflow state (`fast`, `pre-flight`, or `idle`).
4. `discoveries.ts`: scanned active discovery records in `devflow/discoveries/`.
5. `context-slicer.ts`: extracted scoped context slices.

Callers (including `status.ts`, `gatekeeper-engine.ts`, `dashboard-snapshot.ts`, and MCP server tools) had to independently coordinate multiple calls and handle edge cases where branch and stage pointers drifted.

We decided to create a deep **Active Context Engine** (`ActiveContextEngine` class in `packages/create-nexus-devflow/lib/active-context-engine.ts`) that encapsulates task workspace discovery, living spec inspection, workflow state tracking, and discovery queues behind a single in-memory seam. Low-level filesystem and markdown parsers are encapsulated behind this engine.

## Considered Options

- **Keep standalone utility functions with loose imports**: Rejected because understanding active task state forces callers to bounce across 5 separate modules, leading to duplicated coordination logic and leaky abstractions.
- **Big-bang rewrite removing existing functions**: Rejected to maintain 100% backward compatibility for existing callers and external integrations during progressive refactoring.

## Consequences

- External callers (`status.ts`, `gatekeeper-engine.ts`, `DashboardStateEngine`, and MCP handlers) interact with a single authoritative `ActiveContextEngine` seam.
- `getActiveContext()` provides an atomic snapshot containing active task ID, resolved file paths, living spec checklist progress, workflow stage, and pending discoveries in a single call.
- Existing utility functions (`resolveActiveContextPaths`, `readCurrentWork`) remain supported as backward-compatible facade wrappers delegating to `ActiveContextEngine`.
- Supports fresh disk reads by default with opt-in caching (`cacheTtlMs`) for high-frequency callers.
