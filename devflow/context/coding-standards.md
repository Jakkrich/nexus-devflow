# Coding Standards & Engineering Guidelines

> Engineering standards, architecture conventions, testing policies, and code quality guidelines for **Nexus-DevFlow**.

---

## 1. TypeScript & Runtime Standards

- **Strict Mode Enabled**: Always adhere to strict TypeScript compilation (`"strict": true` in `tsconfig.json`).
- **No `any` Types**: Prohibit the use of `any`. Use precise interface definitions, generics, or `unknown` with runtime type narrowing.
- **Type Definitions**: Define clear interfaces and types for all function options, CLI arguments, parse results, and data payloads.
- **Type Inference vs. Explicit Types**: Use type inference for straightforward local variables, and explicit return types for public functions, exports, and complex utilities.
- **ESM-First Architecture**: Use native Node.js ESM (`"type": "module"`). Always use explicit `node:` protocol imports (e.g. `node:fs`, `node:path`, `node:os`, `node:child_process`).

---

## 2. CLI Architecture & Engineering Principles

- **Separation of Concerns (Deep Modules)**:
  - Keep CLI entry points (`bin/create-nexus-devflow.ts`) thin: handle argument parsing, option normalization, and terminal formatting.
  - Encapsulate all core business logic, filesystem operations, and parsing inside modular libraries (`lib/current-work.ts`, `lib/findings.ts`, `lib/git.ts`, `lib/uninstall.ts`, `lib/update.ts`).
- **Safety Flags & Idempotency**:
  - Destructive or mutating operations (e.g. `uninstall`, `update`, `install`) must support safety flags:
    - `--dry-run`: Preview actions and affected files without modifying the disk.
    - `-y`, `--yes`, `-f`, `--force`: Non-interactive mode for CI/CD automation.
    - `--json`: Machine-readable structured output for integrations.
- **Cross-Platform Compatibility**:
  - Never assume POSIX-only paths or Windows-only backslashes. Always use `path.join()`, `path.resolve()`, or normalize paths with forward slashes for URLs and identifiers.
  - Handle Windows permission quirks (EPERM, EBUSY) with graceful retries or clear explanatory messages.
- **Terminal UX & ANSI Formatting**:
  - Provide clear, high-contrast, and aesthetic terminal outputs.
  - Automatically respect `process.stdout.isTTY` and support `--no-color` / `NO_COLOR` environment variables.

---

## 3. File Organization & Directory Structure

```text
nexus-devflow/
├── .agents/skills/             # Codex & Google Antigravity skill definitions
├── .claude/skills/             # Claude Code mirrored skill adapters
├── .nexus/                     # Metadata tracking & upstream baseline ledger
├── devflow/                    # Framework workspace context, runs, and discoveries
│   ├── context/                # Living source-of-truth context files
│   ├── discoveries/            # Pre-delivery discovery records (00-discover.md)
│   ├── runs/                   # Running delivery artifacts (current-feature.md / 00-70)
│   ├── history/                # Master delivery archive (HISTORY.md)
│   └── ideas.md                # Idea Inbox and backlog
├── packages/
│   └── create-nexus-devflow/   # Distribution npm package source
│       ├── bin/                # CLI executable binaries
│       ├── lib/                # Modular domain libraries
│       └── test/               # Automated unit tests (*.test.ts)
└── scripts/                    # Maintainer verification & automation scripts
```

---

## 4. Naming Conventions

- **Files & Directories**:
  - Skills and command directories: `kebab-case` (e.g. `00-discover`, `report-html`, `sync-upstream`).
  - Source modules and scripts: `kebab-case.ts` / `kebab-case.mjs` (e.g. `current-work.ts`, `check-devflow.ts`).
  - Test files: `[module].test.ts` (e.g. `status.test.ts`, `uninstall.test.ts`).
- **Identifiers**:
  - Functions & methods: `camelCase` (e.g. `parseCurrentWork`, `applyUninstall`, `readProjectStatus`).
  - Variables & properties: `camelCase`.
  - Types & Interfaces: `PascalCase` without prefixes like `I` or `T` (e.g. `ProjectStatus`, `RunWorkSummary`).
  - Constants & Enums: `SCREAMING_SNAKE_CASE` (e.g. `LEGACY_FEATURE_PATH`, `DEFAULT_ADAPTERS`).

---

## 5. Testing & Empirical Proof Standards

Testing is a core quality gate in Nexus-DevFlow, not an afterthought:

- **Unit Test Mandate**: Any new feature, modified logic, parser improvement, or bug fix **MUST ship with automated unit tests** in the same diff.
- **Test Framework**: Use Node.js native test runner executed via `tsx --test test/*.test.ts` under `packages/create-nexus-devflow/`.
- **Test Design (AAA Pattern)**:
  - Structure each test case cleanly: **Arrange** (setup fixtures/mock directories), **Act** (execute function), **Assert** (verify invariants).
  - Use isolated temporary directories (`fs.mkdtemp` in `os.tmpdir()`) and ensure cleanup in `finally` blocks.
- **Empirical Proof Contract**:
  - Never claim a task is "working", "tested", or "verified" without providing concrete empirical proof (exact command executed, terminal output, pass/fail counts, exit code).
- **3-Lane Verification Matrix**:
  - **Lane 1 (Type & Syntax Safety)**: `tsc --noEmit` (0 type errors).
  - **Lane 2 (Automated Test Suites & Evals)**: `npm test` (Unit tests 100% pass) + `npm run test:routing` (Skill routing accuracy).
  - **Lane 3 (Manual / Scenario Proof)**: Concrete walkthrough steps ("Where to go", "What to run", "What to expect").

---

## 6. Findings Ledger & Quality Gates (`findings.md`)

- All quality defects, security findings, or regression issues identified during review must be logged in `devflow/context/findings.md`.
- **Finding State Machine**:
  - `open`: Confirmed issue waiting to be fixed.
  - `fixed`: Repaired in code, pending QA re-verification.
  - `closed`: Verified by QA as completely resolved without regressions.
  - `accepted`: Formally waived with recorded user justification.
- **P0/P1 Blockers**: Any P0 or P1 finding in `open` or `fixed` status unconditionally blocks `/complete` and `70-release`.

---

## 7. Error Handling & Exit Codes

- Use structured `try / catch` blocks around filesystem and process operations.
- Create meaningful, actionable error messages for the user (explain what failed and how to resolve it).
- Exit cleanly with standard POSIX process exit codes:
  - `0`: Successful execution.
  - `1`: Validation failure, missing arguments, or runtime error.

---

## 8. Comments & Documentation Discipline

Write code that explains itself; comment only what the code cannot say:

- Comment the **why**, not the **what**. Avoid comments that simply rephrase the line of code.
- Avoid noisy banner blocks, section divider lines (`// ====================`), or obvious step narrations.
- Comments earn their place when documenting:
  - Non-obvious architectural decisions.
  - Upstream compatibility quirks or workarounds.
  - Edge-case handling rationale.
- Keep JSDoc minimal and useful: provide a one-line summary and document non-obvious parameters.

---

## 9. Writing & Language Conventions

- **Default Communication & Artifacts**: Thai (`th`) for all generated markdown stage artifacts (`current-feature.md`, `00-discover.md`, etc.), explanations, and user interactions.
- **Code & Identifiers**: English for all source code, variable names, file paths, CLI flags, and commit messages.
- **Typography**: Do not use em dashes (`—`) in AI-generated commit messages or technical summaries; use standard hyphens (`-`) or colons.
