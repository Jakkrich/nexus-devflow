# Living Spec: 079-studio-view-componentization

> **Status**: Completed  
> **Phase**: 04 Upkeep & Refactoring (ADR-0010)  
> **Track**: Fast-Track Refactor  
> **Testing Seam**: `StudioViewRenderer.renderWebDashboard()`, `StudioViewRenderer.renderStyles()` (`packages/create-nexus-devflow/lib/studio-view-renderer.ts`)

---

## 1. Context & Architecture Seam

`packages/create-nexus-devflow/lib/dashboard-page.ts` contains a 47 KB monolithic template string (`DASHBOARD_PAGE_HTML`) with inline CSS, HTML, and JS, along with a mutual circular dependency with `studio-view-renderer.ts`.

### Architecture Goals:
1. **Break Circular Dependency**: `studio-view-renderer.ts` generates and owns the base dashboard layout independently, eliminating the import of `DASHBOARD_PAGE_HTML` from `dashboard-page.js`.
2. **Decompose Presentation Partials**:
   - `StudioViewRenderer.getBaseDashboardHtml()`
   - `renderWebDashboard(snapshot)` for deterministic snapshot hydration.
   - `renderWebviewStudio(snapshot, ideas, options)`
3. **Deep Presentation Module**:
   - High leverage rendering methods hiding HTML/CSS/JS complexity.
4. **Backward-Compatible Facade**:
   - `dashboard-page.ts` is now a thin 18-line facade re-exporting `renderDashboardPage`, `StudioViewRenderer`, and `DASHBOARD_PAGE_HTML` without circular imports.

---

## 2. Invariants & Acceptance Criteria

1. **Circular Dependency Free**: Zero cyclic imports between `dashboard-page.ts` and `studio-view-renderer.ts`.
2. **Deterministic Snapshot Hydration**: `renderWebDashboard(snapshot)` correctly injects serialized snapshot into `window.__INITIAL_SNAPSHOT__` and escapes HTML/opening tags safely.
3. **Backward Compatibility**: All existing presentation and tooling tests pass with zero regression.
4. **All Tests Pass**: 100% green across all unit and framework suites.

---

## 3. Tasks & Tracer-Bullet Tickets

- [x] **Ticket 01**: Decompose `DASHBOARD_PAGE_HTML` into `StudioViewRenderer` and remove circular import in `studio-view-renderer.ts`.
- [x] **Ticket 02**: Update `dashboard-page.ts` to be a clean facade importing from `studio-view-renderer.ts`.
- [x] **Ticket 03**: Write comprehensive unit tests for `StudioViewRenderer` decomposition and snapshot injection in `test/studio-view-renderer.test.ts`.

