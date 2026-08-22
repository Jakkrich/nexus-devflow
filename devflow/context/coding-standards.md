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

- **Separation of Concerns (Deep Modules & Information Hiding)**:
  - Keep CLI entry points (`bin/create-nexus-devflow.ts`) thin: handle argument parsing, option normalization, and terminal formatting.
  - Encapsulate all core business logic, filesystem operations, and parsing inside modular libraries (`lib/current-work.ts`, `lib/findings.ts`, `lib/git.ts`, `lib/uninstall.ts`, `lib/update.ts`).
  - **Deep Modules**: Strive for simple, narrow interfaces that hide extensive implementation complexity internally.
- **Refactoring & Code Simplification (Simplify Discipline)**:
  - **Early Returns**: Guard conditions should exit early to eliminate deep nesting.
  - **Single Responsibility (SRP)**: Functions should do one cohesive thing and stay under 50 lines whenever possible.
  - **Pure Functions**: Favor deterministic functions without side effects for data transformation and parsing.
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

## 3. Stable API & Interface Design Standards

- **Contract Stability**: Public exports, CLI options, and stage artifact schemas form immutable delivery contracts. Never break contracts without a major version bump.
- **Explicit Parameter Objects**: For functions with more than 2 arguments, use an options object interface with descriptive property names.
- **Defensive Input Validation**: Validate all inputs at module boundaries before processing. Never trust user or external JSON input without structural validation.

---

## 4. Database & Storage Architecture (When Applicable)

- **Migration Safety**: Schema changes must be backward-compatible (Expand and Contract pattern). Never drop columns or rename fields in a single step.
- **Indexing Strategy**: Always index foreign keys, search filters, and unique constraints.
- **Connection Hygiene**: Use connection pooling and ensure connections/file handles are closed cleanly in `finally` blocks.

---

## 5. File Organization & Directory Structure

```text
nexus-devflow/
├── .agents/skills/             # Codex & Google Antigravity skill definitions
├── .claude/skills/             # Claude Code mirrored skill adapters
├── .nexus/                     # Metadata tracking & upstream baseline ledger
├── devflow/                    # Framework workspace context, history, and discoveries
│   ├── context/                # Living source-of-truth context files
│   ├── discoveries/            # Pre-delivery discovery records (00-explore.md)
│   ├── history/                # Master delivery archive (features/, fixes/, rollbacks/, HISTORY.md)
│   └── ideas.md                # Idea Inbox and backlog
├── packages/
│   └── create-nexus-devflow/   # Distribution npm package source
│       ├── bin/                # CLI executable binaries
│       ├── lib/                # Modular domain libraries
│       └── test/               # Automated unit tests (*.test.ts)
└── scripts/                    # Maintainer verification & automation scripts
```

---

## 6. Naming Conventions

- **Files & Directories**:
  - Skills and command directories: `kebab-case` (e.g. `00-explore`, `report-html`, `sync-upstream`).
  - Source modules and scripts: `kebab-case.ts` / `kebab-case.mjs` (e.g. `current-work.ts`, `check-devflow.ts`).
  - Test files: `[module].test.ts` (e.g. `status.test.ts`, `uninstall.test.ts`).
- **Identifiers**:
  - Functions & methods: `camelCase` (e.g. `parseCurrentWork`, `applyUninstall`, `readProjectStatus`).
  - Variables & properties: `camelCase`.
  - Types & Interfaces: `PascalCase` without prefixes like `I` or `T` (e.g. `ProjectStatus`, `RunWorkSummary`).
  - Constants & Enums: `SCREAMING_SNAKE_CASE` (e.g. `LEGACY_FEATURE_PATH`, `DEFAULT_ADAPTERS`).

---

## 7. Testing & Empirical Proof Standards

Testing is a core quality gate in Nexus-DevFlow, not an afterthought:

- **Unit Test Mandate**: Any new feature, modified logic, parser improvement, or bug fix **MUST ship with automated unit tests** in the same diff.
- **Test Framework**: Use Node.js native test runner executed via `tsx --test test/*.test.ts` under `packages/create-nexus-devflow/`.
- **Test Design (AAA Pattern)**:
  - Structure each test case cleanly: **Arrange** (setup fixtures/mock directories), **Act** (execute function), **Assert** (verify invariants).
  - Use isolated temporary directories (`fs.mkdtemp` in `os.tmpdir()`) and ensure cleanup in `finally` blocks.
- **Empirical Proof Contract**:
  - Never claim a task is "working", "tested", or "verified" without providing concrete empirical proof (exact command executed, terminal output, pass/fail counts, exit code).
- **Multi-Lane Verification Matrix**:
  - **Lane 1 (Type & Syntax Safety)**: `tsc --noEmit` (0 type errors).
  - **Lane 2 (Automated Test Suites & Evals)**: `npm test` (Unit tests 100% pass) + `npm run test:routing` (Skill routing accuracy).
  - **Lane 3 (Scrutinize & Security Audit)**: Edge cases, null-safety, 0 secrets, safe inputs.
  - **Lane 4 (Manual / Scenario Proof)**: Concrete walkthrough steps ("Where to go", "What to run", "What to expect").

---

## 8. Findings Ledger & Quality Gates (`findings.md`)

- All quality defects, security findings, or regression issues identified during review must be logged in `devflow/context/findings.md`.
- **Finding State Machine**:
  - `open`: Confirmed issue waiting to be fixed.
  - `fixed`: Repaired in code, pending QA re-verification.
  - `closed`: Verified by QA as completely resolved without regressions.
  - `accepted`: Formally waived with recorded user justification.
- **P0/P1 Blockers**: Any P0 or P1 finding in `open` or `fixed` status unconditionally blocks `/complete` and `70-deliver`.

---

## 9. Error Handling & Exit Codes

- Use structured `try / catch` blocks around filesystem and process operations.
- Create meaningful, actionable error messages for the user (explain what failed and how to resolve it).
- Exit cleanly with standard POSIX process exit codes:
  - `0`: Successful execution.
  - `1`: Validation failure, missing arguments, or runtime error.

---

## 10. Conventional Commits & Release Discipline

- **Conventional Commits**:
  - Format: `<type>(<scope>): <short imperative summary>`
  - Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **SemVer Versioning**:
  - `Major`: Breaking architectural change
  - `Minor`: New feature addition
  - `Patch`: Bug fix or documentation update
