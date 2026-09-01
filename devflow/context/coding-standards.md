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

## 2. CLI Architecture & Deep Modules Philosophy

- **Deep Modules Principles (John Ousterhout Philosophy)**:
  - **Module**: Anything with an interface and an implementation (function, class, package, or subsystem).
  - **Interface**: Everything a caller must know to use the module correctly (types, invariants, ordering, error modes, configuration).
  - **Implementation**: The hidden body of code inside the module.
  - **Depth (High Leverage)**: A module is **Deep** when a large amount of complex behavior sits behind a small, simple interface. A module is **Shallow** (to be avoided) when its interface is nearly as complex as its implementation.
  - **Seam**: The clean architectural location where an interface lives.
  - **Adapter**: A concrete implementer satisfying the interface at a seam.
  - **The Deletion Test**: Imagine deleting the module. If complexity concentrates across N callers, it was earning its keep (Deep). If complexity simply vanishes or moves, it was a pass-through (Shallow).
  - **Designing for Testability**:
    - *Accept dependencies, don't instantiate them inside.*
    - *Return results, minimize unobservable side effects.*
    - *Small surface area: fewer methods and simple parameter objects.*
- **Separation of Concerns (Information Hiding)**:
  - Keep CLI entry points (`bin/create-nexus-devflow.ts`) thin: handle argument parsing, option normalization, and terminal formatting.
  - Encapsulate all core business logic, filesystem operations, and parsing inside modular libraries (`lib/current-work.ts`, `lib/findings.ts`, `lib/git.ts`, `lib/uninstall.ts`, `lib/update.ts`).
- **Refactoring & Code Simplification (Simplify Discipline)**:
  - **Early Returns**: Guard conditions should exit early to eliminate deep nesting.
  - **Single Responsibility (SRP)**: Functions should do one cohesive thing and stay under 50 lines whenever possible.
  - **Pure Functions**: Favor deterministic functions without side effects for data transformation and parsing.
- **Baseline 12 Fowler Code Smells (Continuous Refactoring)**:
  - **Mysterious Name**: Names that don't reveal what they do -> Rename with clear intention.
  - **Duplicated Code**: Identical or similar logic shapes -> Extract shared helper.
  - **Feature Envy**: Method reaching into another object's data -> Move method onto that data.
  - **Data Clumps**: Same 3+ fields traveling together -> Bundle into a cohesive type.
  - **Primitive Obsession**: Raw string/number representing a domain concept -> Define a branded/domain type.
  - **Repeated Switches**: Duplicate `switch`/`if` cascades -> Use polymorphism or lookup map.
  - **Shotgun Surgery**: One change forcing scattered edits in many files -> Unify into one deep module.
  - **Divergent Change**: One file edited for multiple unrelated reasons -> Split responsibilities.
  - **Speculative Generality**: Hooks/params added for hypothetical needs -> Delete and inline until needed.
  - **Message Chains**: Long `a.b().c().d()` navigation -> Hide behind a method on the root object.
  - **Middle Man**: Class/function that only delegates -> Remove and call target directly.
  - **Refused Bequest**: Subclass ignoring inherited methods -> Replace inheritance with composition.
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
├── .agents/skills/             # Codex, Google Antigravity & Copilot skill definitions
├── .claude/skills/             # Claude Code mirrored skill adapters
├── .nexus/                     # Metadata tracking & upstream baseline ledger
├── devflow/                    # Framework workspace context, history, and discoveries
│   ├── context/                # Living source-of-truth context files
│   ├── decisions/              # Architecture Decision Records (ADRs)
│   ├── discoveries/            # Pre-delivery discovery records (discovery.md)
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
  - Skills and command directories: `kebab-case` (e.g. `discovery`, `report-html`, `convert-any-to-md`).
  - Source modules and scripts: `kebab-case.ts` / `kebab-case.mjs` (e.g. `current-work.ts`, `check-devflow.ts`).
  - Test files: `[module].test.ts` (e.g. `status.test.ts`, `uninstall.test.ts`).
- **Identifiers**:
  - Functions & methods: `camelCase` (e.g. `parseCurrentWork`, `applyUninstall`, `readProjectStatus`).
  - Variables & properties: `camelCase`.
  - Types & Interfaces: `PascalCase` without prefixes like `I` or `T` (e.g. `ProjectStatus`, `RunWorkSummary`).
  - Constants & Enums: `SCREAMING_SNAKE_CASE` (e.g. `LEGACY_FEATURE_PATH`, `DEFAULT_ADAPTERS`).

---

## 7. Testing & Empirical Proof Standards (Strict TDD & Two-Stage Review)

Testing is a core quality gate in Nexus-DevFlow, not an afterthought:

- **Unit Test Mandate**: Any new feature, modified logic, parser improvement, or bug fix **MUST ship with automated unit tests** in the same diff.
- **Strict TDD (Red-Green-Refactor) Protocol**:
  1. **🔴 RED (Test First)**: Always write automated tests *before* writing or modifying functional logic. Run the test command and verify that it fails for the expected reason.
  2. **🟢 GREEN (Minimal Code)**: Write only the minimal production code necessary to make the failing test pass. Run the test command and verify 100% green pass.
  3. **🔵 REFACTOR (Clean & Robust)**: Refactor code for readability, performance, and DRY/YAGNI discipline while ensuring all tests stay green.
  - *Code Deletion / Reversion Rule*: If functional code is created without a prior failing test for behavior changes, it must be reverted or immediately backed by tests before continuing.
- **Test Framework**: Use Node.js native test runner executed via `tsx --test test/*.test.ts` under `packages/create-nexus-devflow/`.
- **Test Design (AAA Pattern)**:
  - Structure each test case cleanly: **Arrange** (setup fixtures/mock directories), **Act** (execute function), **Assert** (verify invariants).
  - Use isolated temporary directories (`fs.mkdtemp` in `os.tmpdir()`) and ensure cleanup in `finally` blocks.
- **Empirical Proof Contract**:
  - Never claim a task is "working", "tested", or "verified" without providing concrete empirical proof (exact command executed, terminal output, pass/fail counts, exit code).
- **Hybrid Browser Verification Protocol**:
  - **Dual-Layer Hierarchy**:
    1. *Code-Driven Automation (CI/Repeatable)*: Headless Playwright (`@playwright/test`) assertions executed via `npm run test:browser`.
    2. *Interactive AI Visual QA (MCP)*: Live DOM and styling inspection via MCP `browseros-neo` (`http://127.0.0.1:9010/mcp`) during `/check` and `/try`.
- **Two-Stage Review Pattern (Verification Gate)**:
  - **Stage 1: Spec Fidelity & Acceptance Gate**:
    - Verify 100% conformance against the Single Living Spec (`current-feature.md`).
    - Validate all Acceptance Criteria (ACs) and "Done When" observables without missing requirements or scope creep.
    - Test edge cases and boundary conditions defined in the specification.
  - **Stage 2: Code Quality, Security & Architecture Gate**:
    - **Lane 1 (Type & Syntax Safety)**: `tsc --noEmit` (0 type errors).
    - **Lane 2 (Automated Test Suites & Evals)**: `npm test` (Unit tests 100% pass) + `npm run test:routing` (Skill routing accuracy).
    - **Lane 3 (Scrutinize & Security Audit)**: Edge cases, null-safety, 0 secrets, safe inputs.
    - **Lane 4 (Manual / Scenario Proof)**: Concrete walkthrough steps ("Where to go", "What to run", "What to expect").
    - **Findings Ledger State**: 0 blockers (P0/P1) in `devflow/context/findings.md`.

---

## 8. Findings Ledger & Quality Gates (`findings.md`, `review.md`)

- All quality defects, security findings, or regression issues identified during review must be logged in `devflow/context/findings.md`.
- **Finding State Machine**:
  - `open`: Confirmed issue waiting to be fixed.
  - `fixed`: Repaired in code, pending QA re-verification.
  - `closed`: Verified by QA as completely resolved without regressions.
  - `accepted`: Formally waived with recorded user justification.
- **P0/P1 Blockers**: Any P0 or P1 finding in `open` or `fixed` status unconditionally blocks `/complete`.
- **Allowed Waivers**: A P0 or P1 finding may only be bypassed if marked `accepted` (with explicit user justification recorded) or `invalid` (with evidence recorded by `/audit`).
- **Independent Review Gate (`review.md`)**:
  - Holds immutable review request and receipt records bound to target commit SHA, merge base, and spec SHA-256 hash.
  - When `qualityGates.regular.independentReview` is active, completion is blocked until a fresh session completes the 4-lens audit and records a valid, non-stale `passed` receipt.

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

---

## 11. Architecture Decision Records (ADRs) & Domain Glossary

- **Domain Glossary (`devflow/context/glossary.md`)**:
  - Keep domain terms concise, precise, and unambiguous.
  - Define entity boundaries, invariants, and lifecycle rules.
  - Do NOT store implementation specs or ephemeral task lists in the glossary.
- **Architecture Decision Records (`devflow/decisions/ADR-xxx-{slug}.md`)**:
  - Store durable, high-impact, hard-to-reverse architectural decisions in `devflow/decisions/`.
  - Number sequentially (`ADR-001`, `ADR-002`, ...).
  - Must include: Context, Decision, Alternatives Considered (with trade-offs), and Consequences (positive gains and accepted risks).
