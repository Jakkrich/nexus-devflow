---
name: overview
description: "[Devflow] Scan codebase architecture, data models, and shipped history to synthesize or refresh devflow/context/project-overview.md as the living source of truth."
---

# overview - Living Context Synthesis & Sync

Where this sits in the workflow:

```text
codebase + devflow/history/HISTORY.md  ->  [overview]  ->  devflow/context/project-overview.md  ->  00-discover / 10-define / 20-spec
(reality & shipped runs)                    (sync &         (living source of truth)             (informed planning)
                                             synthesize)
```

`overview` is the context synchronization and synthesis engine for Nexus-DevFlow. It inspects the actual codebase (manifest, dependencies, directory layout, models/schemas, entry points) along with the completed delivery history (`devflow/history/HISTORY.md` and `devflow/runs/`) to build or refresh `devflow/context/project-overview.md`.

It ensures that `project-overview.md` remains a **Living Source of Truth** that evolves alongside your software, rather than a stale artifact left behind after onboarding.

## Usage

```text
/overview
$overview
overview
```

Use this when:
- Multiple delivery runs (`RUN-xxx`) have shipped and `project-overview.md` needs to reflect newly added capabilities.
- New database schemas, ORM models, or API boundaries were introduced.
- Major dependencies or architectural patterns were added or modified.
- After completing `70-release` to keep project context perfectly aligned.
- Preparing for a new initiative or discovery pass.

---

## Process

### Step 1 - Scan Reality (Codebase Survey)

Inspect the actual codebase to establish hard facts:

1. **Manifest & Tooling**:
   - Read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, or `Gemfile`.
   - Identify language versions, primary framework, state management, and build tools.
2. **Directory Architecture**:
   - Map high-level directory layout (`src/`, `app/`, `api/`, `lib/`, `components/`, etc.).
   - Identify major modules, entry points, and routing conventions.
3. **Concrete Data Models & Schemas**:
   - Search for ORM schemas (`schema.prisma`, Drizzle schemas, TypeORM entities, SQLAlchemy models, Zod schemas, or core TypeScript types).
   - Extract entity names, core fields, relationships, and invariants.
4. **Verified Commands**:
   - Inspect package scripts (`dev`, `build`, `test`, `lint`, `check`, `verify`).

---

### Step 2 - Scan History (Delivered Capabilities)

Inspect DevFlow history records:

1. Read `devflow/history/HISTORY.md` for completed and released milestones.
2. Scan completed delivery runs in `devflow/runs/` to extract shipped user-visible capabilities and core system features.

---

### Step 3 - Synthesize `project-overview.md`

Write or update `devflow/context/project-overview.md` following standard structure:

```markdown
# Project Overview & Source of Truth

> Living context artifact automatically synchronized with codebase reality and DevFlow delivery history.

## 1. Project Purpose & Target Users
- High-level summary of what the system does, who it serves, and the core problem it solves.

## 2. Architecture & Directory Layout
- Visual directory layout tree with short descriptions for major modules and boundaries.

## 3. Technology Stack & Key Tooling
- Frontend, Backend, Database, ORM, Testing frameworks, CI/CD, and Package Manager.

## 4. Concrete Data Models & Entities
- Field-level definitions of major entities, types, and relationships.

## 5. Shipped Capabilities & Key Modules
- Consolidated list of active features and subsystems verified in the codebase.

## 6. Verified Commands & Developer Workflow
- Exact commands for Dev, Build, Test, Lint, and Verify.

## 7. Known Architectural Focus Areas
- Known technical debt, active migrations, or upcoming architectural focus points.
```

---

### Step 4 - Review & Report

Present a concise summary of the sync:
- Models or entities detected and added
- Shipped capabilities refreshed from history
- Stack and tooling updates
- Any inconsistencies or gaps found between code and documentation

---

## Rules & Guardrails

1. **Grounded in Reality**: Never invent non-existent packages, fictional data models, or unverified endpoints. Everything in `project-overview.md` must be traceable to real code or recorded history.
2. **Preserve User Intent**: Do not erase custom business rules or user-written notes. Integrate new facts smoothly around existing intent.
3. **Concrete Over Vague**: Provide actual model names, field types, and route paths rather than vague one-line summaries.
4. **Non-Destructive**: `overview` only writes to `devflow/context/project-overview.md`. It never modifies source code, runs migrations, or touches git history.
