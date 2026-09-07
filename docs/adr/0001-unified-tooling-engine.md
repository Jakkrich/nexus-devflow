# 0001: Consolidate Loose Tooling Scripts into a Unified Tooling Engine

## Context & Decision

The repository accumulated 15+ standalone `.mjs` scripts under `scripts/` (e.g. `render-html.mjs`, `switch-artifact-language.mjs`, `scan-doc-contract.mjs`) alongside loose test scripts. Each script was shallow, duplicated command-line parsing, and leaked exit-code handling via raw `process.exit()` calls.

We decided to collapse all loose tooling scripts into a deep **Tooling Engine** (`packages/create-nexus-devflow/lib/tooling/` and `scripts/tooling.ts`). Individual scripts are eliminated, subcommands are registered in a static registry, and error handling returns typed results rather than terminating the process. Tests will exercise the engine through its programmatic interface under `scripts/test/`.

## Considered Options

- **Keep standalone scripts with shared helper**: Rejected because it leaves 15+ shallow scripts polluting the root directory and does not eliminate inconsistent exit codes.
- **Dynamic directory-based discovery**: Rejected in favor of a static registry to ensure full compile-time type safety and cross-platform reliability.

## Consequences

- All tooling callers (npm scripts in `package.json`, DevFlow skills, CI workflows) invoke a single entrypoint seam (`tsx scripts/tooling.ts <command>`).
- Tool commands can be safely imported and tested in-memory without spawning child processes or risking process termination.
