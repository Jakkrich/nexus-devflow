---
title: Nexus-DevFlow 2.13.0 Manual Review & Quality Gate Specification
status: active
updated: 2026-09-07
owner: Nexus-DevFlow Core Team
---

# Nexus-DevFlow 2.13.0 Manual Review & Quality Gate Specification

## 1. Purpose & Overview

This specification defines the **Manual Review, Verification Gates, and Audit Discipline** for **Nexus-DevFlow 2.13.0 (The 3-Pillars & Pure Task-Isolated Living Spec Model)**.

In production-grade software development, AI coding assistants should not blindly write code without human alignment. Nexus-DevFlow treats human review as **explicit, non-bypassable gates** throughout the 4-stage delivery lifecycle:

```text
/feature (or /fix) ──▶ [Spec Gate] ──▶ /implement ──▶ [TDD Checkpoint] ──▶ /check ──▶ [QA Gate] ──▶ /complete ──▶ [Delivery Gate]
```

---

## 2. The 4 Essential Human Review Gates

### 🚪 Gate 1: The Spec Review Gate (`/feature` / `/fix`)
- **When**: Triggered immediately after the AI creates or updates `devflow/context/{xxx-slug}/spec.md`.
- **AI Action**: Defines problem statement, boundaries, data contracts, acceptance criteria (AC-1..AC-N), and TDD execution plan, then **pauses**.
- **Human Verification Checklist**:
  1. Are scope boundaries and non-goals explicitly defined?
  2. Are invariants (what must not break) protected?
  3. Are acceptance criteria testable and unambiguous?
  4. Is the TDD execution plan granular (`[TDD-Red]`, `[TDD-Green]`, `[TDD-Refactor]`)?
- **Approval Rule**: AI does not write application code until the developer reviews and approves the spec.

---

### 🚪 Gate 2: The TDD Implementation Checkpoint (`/implement`)
- **When**: During task execution in `devflow/context/{xxx-slug}/spec.md`.
- **AI Action**: Implements tasks one by one under strict Red-Green-Refactor discipline, recording diffs and test logs into the implementation checklist and evidence sections.
- **Human Verification Checklist**:
  1. Did each behavior change start with a failing test (`[TDD-Red]`)?
  2. Is the code diff minimal, clean, and adhering to `coding-standards.md`?
  3. Were refactoring steps performed without changing public contracts?
- **Approval Rule**: Optional commit checkpoints on the feature branch after each passing step.

---

### 🚪 Gate 3: Senior QA Verification Gate (`/check`)
- **When**: After all implementation tasks in the living spec are checked off.
- **AI Action**: Assumes the role of an independent Senior QA engineer, running the multi-lane verification matrix (Typecheck, Lint, Test suites, and behavioral manual proof).
- **Human Verification Checklist**:
  1. Did all lanes in the matrix achieve `PASS`?
  2. Are test assertions testing behavior rather than mock implementation details?
  3. Has manual behavioral proof (browser/terminal/API) been recorded?
- **Approval Rule**: Passing checks recorded as empirical evidence in `devflow/context/{xxx-slug}/spec.md` and any findings logged in `findings.md`.

---

### 🚪 Gate 4: The Findings & Git Delivery Gate (`/audit` + `/complete`)
- **When**: Final step before closing the work item.
- **AI Action**:
  - `/audit current` inspects the complete feature branch delta and records findings in `devflow/context/{xxx-slug}/findings.md`.
  - `/complete` compiles the Release Digest, updates `HISTORY.md` and `build-plan.md`, archives the living spec to `devflow/history/features/`, cleanly tears down the active task directory, and asks for approval before merging.
- **Human Verification Checklist**:
  1. Are all P0 (Critical) and P1 (High) findings in `findings.md` resolved and verified (`closed`) or explicitly waived (`accepted`)?
  2. Is the Release Digest accurate and complete?
- **Approval Rule**: Mandatory human confirmation before squash-merging the feature branch into `main` and deleting the branch.

---

## 3. Artifact Placement & State Contracts (The 3-Pillars)

```text
devflow/
├── ideas.md                    # 🔮 Future (Backlog): Idea Inbox with AI scoring
├── project-plan.md             # 🔮 Future (Backlog): Product Vision & Architectural Roadmap
├── build-plan.md               # 🔮 Future (Backlog): Master Feature Delivery Sequence
├── context/                    # ⚡ Present (Active Context): Global Truth & Task Workspaces
│   ├── project-overview.md     # Single Source of Truth
│   ├── coding-standards.md     # Engineering standards & conventions
│   ├── ai-interaction.md       # AI interaction guidelines
│   ├── glossary.md             # Domain glossary & architecture terms
│   └── {xxx-slug}/             # Active Task-Isolated Workspace
│       ├── spec.md             # Living Spec & Task Breakdown
│       ├── stage.md            # Stage pointer & status
│       └── findings.md         # Dedicated audit & quality ledger
├── decisions/                  # 🏛️ Decisions: Architecture Decision Records (ADR-xxx.md)
├── history/                    # 📦 Past (History Archive): Categorized delivery archives
│   ├── features/               # Shipped features ({xxx-slug}.md)
│   ├── fixes/                  # Resolved bug fixes ({xxx-slug}.md)
│   ├── rollbacks/              # Reversal audit logs (YYYY-MM-DD-{xxx-slug}.md)
│   └── HISTORY.md              # Master release ledger
└── discoveries/                # 🔍 Discoveries: Pre-delivery discovery records (DISC-xxx.md)
```

---

## 4. Task-Isolated Living Spec Contract (`spec.md`)

Every delivery run operates on `devflow/context/{xxx-slug}/spec.md`, structured into **6 standard sections**:

1. **🎯 1. Define & Boundaries**: Problem statement, proposed solution, scope boundaries, and non-breaking invariants.
2. **📐 2. Technical Spec & Contracts**: Data contracts, API schemas, and testable Acceptance Criteria (AC-1..AC-N).
3. **📋 3. Execution Plan & TDD Checklist**: Sequential task breakdown with granular `[TDD-Red]`, `[TDD-Green]`, and `[TDD-Refactor]` sub-tasks.
4. **⚡ 4. Implementation Log & Evidence**: Live engineering log recording step-by-step implementation evidence and diffs.
5. **🧪 5. Multi-Lane Verification Matrix**: Empirical test logs, benchmark data, and manual proof verification.
6. **📦 6. Release Digest & Retrospective**: Release summary, key architectural decisions, and retrospective notes.

---

## 5. Reference Examples

For complete markdown templates and living spec examples, refer to:
- [`devflow/docs/examples/living-spec/current-feature.example.md`](examples/living-spec/current-feature.example.md)
- [`devflow/docs/examples/living-spec/discovery.example.md`](examples/living-spec/discovery.example.md)
- [`devflow/docs/examples/living-spec/adr.example.md`](examples/living-spec/adr.example.md)
- [`devflow/docs/examples/living-spec/ideas.example.md`](examples/living-spec/ideas.example.md)
