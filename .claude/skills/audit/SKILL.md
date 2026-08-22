---
name: audit
description: "[Devflow] Code, quality, security, performance, and test audit skill with durable ledger tracking in devflow/context/findings.md."
argument-hint: "{scope/path or lens: quality | security | performance | tests | full}"
---

# audit - Dedicated Multi-Lens Audit & Quality Ledger

Where this sits in the workflow:

```text
git diff / codebase / path  ->  [audit]  ->  devflow/context/findings.md  ->  check-gate / /complete
(target scope & lenses)         (analyze &   (durable findings ledger)        (quality gates)
                                 record)
```

`audit` is the dedicated quality, security, performance, and test review engine for Nexus-DevFlow. It inspects changed files in the active branch, a targeted path, or the full repository, evaluates them through specialized review lenses, and records findings with durable IDs into `devflow/context/findings.md`.

It is **strictly non-destructive**: it inspects and records findings in `findings.md`, but never modifies source code directly. Remediation is handled via `/fix <ID>` or `/implement`.

## Usage & Invocations

```text
/audit                      # Audit active branch changes across all lenses (Default)
/audit security             # Focused Security audit on active changes
/audit quality              # Focused Quality, dead code & code smells audit
/audit performance          # Focused Performance & efficiency audit
/audit tests                # Focused Test quality & coverage gap audit
/audit full                 # Full repository audit across all lenses
/audit <path>               # Targeted audit on a specific file or directory
$audit                      # Codex CLI invocation
```

---

## Process

### Step 1 - Determine Scope & Lens

1. **Scope Resolution**:
   - **Branch / Active Run (Default)**: Inspect `git diff main...HEAD` or files touched in `devflow/context/current-feature.md`.
   - **Targeted Path**: If a directory/file path is passed (e.g. `src/auth/`), scope analysis to that path.
   - **Full Project**: If `full` is passed, scope analysis across the entire project repository.
2. **Lens Selection**:
   - If a lens name is provided (`security`, `quality`, `performance`, `tests`), focus primarily on that domain.
   - If none is provided, evaluate across all four lenses.

---

### Step 2 - Multi-Lens Inspection

Evaluate code against standard criteria:

#### 1. 🛡️ Security Lens
- **Secrets & Credentials**: Look for hardcoded API keys, JWT secrets, passwords, or tokens.
- **Injection Risks**: Unsanitized SQL, shell command execution, template injection, path traversal.
- **Access Control & Auth**: Unprotected API routes, missing permission checks, insecure direct object references.
- **Data Protection & Sanitization**: Missing XSS sanitization, unsafe HTML rendering, sensitive data leaks in logs.

#### 2. 💎 Quality & Maintainability Lens
- **Code Smells & Complexity**: Overly complex functions, deep nesting, high cyclomatic complexity.
- **Duplication & Dead Code**: Repeated logic that should be abstracted, unused variables/imports/functions.
- **Contract & Type Safety**: Unsafe `any` casts, missing error handling, unhandled Promise rejections.
- **Standards & Conventions**: Compliance with `devflow/context/coding-standards.md`.

#### 3. ⚡ Performance Lens
- **Database & Query Efficiency**: N+1 queries, unindexed filter columns, unbounded queries without pagination.
- **Resource Management**: Memory leaks, unclosed streams/handles, blocking synchronous operations in async loops.
- **Bundle & Asset Footprint**: Unnecessary heavy dependencies, oversized client-side bundles.

#### 4. 🧪 Test Quality Lens
- **Coverage Gaps**: Critical business logic or branch conditions lacking unit or integration tests.
- **Negative & Error Cases**: Testing only the happy path without asserting error handling and failure boundaries.
- **Flakiness & Assertions**: Tests with race conditions, missing awaits, or non-deterministic assertions.

---

### Step 3 - Record Findings in `devflow/context/findings.md`

For every confirmed issue found:

1. Determine **Severity**:
   - `P0` (Critical Blocker): Security vulnerabilities, data corruption bugs, crash-level defects.
   - `P1` (High Blocker): Major regressions, broken critical flows, unhandled failure paths.
   - `P2` (Medium): Code smells, missing non-critical tests, performance bottlenecks.
   - `P3` (Low / Polish): Minor naming inconsistencies, style polish, documentation gaps.

2. Determine **Durable ID**:
   - Check existing IDs in `devflow/context/findings.md` and use the next sequential ID:
     - `SEC-001`, `SEC-002` (Security)
     - `QUAL-001`, `QUAL-002` (Quality)
     - `PERF-001`, `PERF-002` (Performance)
     - `TEST-001`, `TEST-002` (Tests)
     - Or universal `FIND-001`, `FIND-002`

3. Append to `devflow/context/findings.md`:
   ```markdown
   ### SEC-001 [P0] open - Hardcoded Secret Key in config.ts
   - **Location**: `src/config.ts:24`
   - **Impact**: API secret key exposed in client bundle
   - **Remediation**: Move to environment variable `process.env.API_SECRET`
   ```

---

### Step 4 - Output Audit Summary & Recommendations

Present a clean markdown report in **Thai (`th`)**:

```markdown
### 🛡️ ผลการตรวจสอบความปลอดภัยและคุณภาพโค้ด (Audit Summary)

- **ขอบเขตการตรวจสอบ (Scope)**: `{Branch Diff | Path | Full Project}`
- **เลนส์การตรวจ (Lenses)**: `{Quality, Security, Performance, Tests}`
- **ข้อบกพร่องที่พบ (Findings Summary)**:
  - 🔴 **P0 (Critical)**: {count}
  - 🟠 **P1 (High)**: {count}
  - 🟡 **P2 (Medium)**: {count}
  - 🔵 **P3 (Low)**: {count}

#### รายการข้อบกพร่องใหม่ที่บันทึกใน Findings Ledger:
1. `SEC-001 [P0] open - Hardcoded Secret Key in config.ts` (`src/config.ts:24`)
2. `PERF-001 [P2] open - Unbounded query in user list` (`src/users.ts:58`)

---
👉 **คำแนะนำถัดไป (Next Actions)**:
- หากมีข้อบกพร่องระดับ P0/P1: เรียก `/fix SEC-001` เพื่อเริ่มการแก้ไขที่ติดตามได้
- ตรวจสอบสถานะ Blockers: `nexus-devflow findings --blockers`
```

---

## Release Gatekeeper Rule

> [!IMPORTANT]
> Any `P0` or `P1` finding in `open` or `fixed` status in `devflow/context/findings.md` **unconditionally blocks**:
> - `nexus-devflow check-gate` (Exit code 1)
> - `/complete` (Fast-Track delivery close)
> - `70-release` (Deep-Track release packaging)
>
> Findings must be repaired via `/fix` and verified with `/check` to reach `closed`, `accepted`, or `invalid` status.
