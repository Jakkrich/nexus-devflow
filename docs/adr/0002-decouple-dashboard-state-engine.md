# 0002: Decouple Dashboard Server Transport from State Snapshot Engine

## Context & Decision

`dashboard.ts` previously contained over 1,300 lines of code coupling low-level Node HTTP socket handling, route parsing, and CSP header manipulation with business-critical state querying (snapshots, code graph analysis, blast radius calculation, drift reconciliation). Concurrently, `webview-studio.ts` duplicated several snapshot and gate evaluation queries for the IDE Webview interface.

We decided to extract a deep **Dashboard State Engine** (`DashboardStateEngine` class) that encapsulates all snapshot calculation, code graph inspection, and action execution behind a protocol-agnostic programmatic seam. The HTTP server in `dashboard.ts` and the Webview Studio in `webview-studio.ts` become two lightweight **Dashboard Transport Adapters** at that seam. All state computation is tested in-memory without opening network sockets.

## Considered Options

- **Keep HTTP server coupled and refactor route files**: Rejected because it retains network socket requirements during testing and does not resolve the duplicate state logic in `webview-studio.ts`.
- **Stateless functional API**: Rejected in favor of a `DashboardStateEngine` instance bound to `projectRoot` to avoid parameter passing redundancy and allow in-memory pre-warming and snapshot caching.

## Consequences

- Full alignment with the principle *"Two adapters justify the seam"*: both the browser HTTP server and the IDE Webview consume the identical state engine seam.
- Tests exercise snapshot generation, blast radius calculation, and actions in-memory in milliseconds without socket lifecycle flakiness or Windows network permission issues.
- `dashboard.ts` shrinks from 1,300+ lines to a focused HTTP adapter under 200 lines.
