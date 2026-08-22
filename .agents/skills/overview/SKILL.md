---
name: overview
description: "[Devflow] Distill user-owned planning docs (project-plan.md & build-plan.md) and codebase reality into devflow/context/project-overview.md as the living source of truth."
---

# overview - Living Context Synthesis & Sync

Where this sits in the workflow:

```text
devflow/project-plan.md + devflow/build-plan.md + codebase  ->  [overview]  ->  devflow/context/project-overview.md  ->  feature / 00-explore
(user-owned plans & reality)                                     (distill &     (living source of truth)             (informed delivery)
                                                                  synthesize)
```

`overview` is the context synchronization and distillation engine for Nexus-DevFlow. It synthesizes user-owned planning docs (`devflow/project-plan.md` and `devflow/build-plan.md`) along with the actual codebase and completed history (`devflow/history/HISTORY.md`) to generate or refresh `devflow/context/project-overview.md`.

It ensures that `project-overview.md` remains a **Living Source of Truth** that evolves alongside your software, rather than a stale artifact.

## Usage

```text
/overview
$overview
overview
```

Use this when:
- You have created or edited `devflow/project-plan.md` or `devflow/build-plan.md`.
- Multiple delivery runs (`xxx-slug`) have shipped and `project-overview.md` needs to reflect newly added capabilities.
- New database schemas, ORM models, or API boundaries were introduced.
- Major dependencies or architectural patterns were added or modified.
- Preparing for a new initiative or discovery pass.

---

## Process

### Step 1 - Read User Planning Documents (If Present)

1. **`devflow/project-plan.md`** (or `blueprint/project-plan.md`):
   - Extract product vision, problem statement, target audience, and non-goals.
   - Extract tech stack decisions, architectural constraints, and milestones.
2. **`devflow/build-plan.md`** (or `blueprint/build-plan.md`):
   - Extract upcoming queued features, phase breakdown, dependencies, and sizing.

---

### Step 2 - Scan Reality (Codebase Survey)

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

### Step 3 - Scan History (Delivered Capabilities)

1. Read `devflow/history/HISTORY.md` for completed and released milestones.
2. Scan completed delivery runs in `devflow/history/features/`, `devflow/history/fixes/`, and `devflow/history/rollbacks/` to extract shipped user-visible capabilities.

---

### Step 4 - Synthesize `project-overview.md`

Write or update `devflow/context/project-overview.md` following standard structure:

```markdown
# Project Overview & Source of Truth

> Living context artifact automatically synchronized with user plans, codebase reality, and DevFlow delivery history.

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

## 6. Upcoming Features & Roadmap Queue
- Summary of queued features and phases from `devflow/build-plan.md`.

## 7. Verified Commands & Developer Workflow
- Exact commands for Dev, Build, Test, Lint, and Verify.
```

---

### Step 5 - Review & Report

Present a concise summary of the sync:
- Planning goals and roadmap extracted
- Models or entities detected and added
- Shipped capabilities refreshed from history
- Stack and tooling updates

---

## Rules & Guardrails

1. **Grounded in Reality**: Never invent non-existent packages, fictional data models, or unverified endpoints. Everything in `project-overview.md` must be traceable to real code, plans, or recorded history.
2. **Preserve User Intent**: Do not erase custom business rules or user-written notes. Integrate new facts smoothly around existing intent.
3. **Non-Destructive**: `overview` only writes to `devflow/context/project-overview.md`. It never modifies source code, runs migrations, or touches git history.
