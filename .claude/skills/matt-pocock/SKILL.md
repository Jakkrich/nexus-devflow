---
name: matt-pocock
description: "[devflow] Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference) for developing software according to real-world situations, while interactively mentoring the developer. References JIT skills in devflow/.vendor/matt-pocock/. Use when running /matt-pocock, learning AI workflows, or orchestrating spec-driven development."
argument-hint: "[{flow, topic, or question}]"
---

# 🧠 matt-pocock — The 6 Canonical Matt Pocock Flows & Interactive Coaching

$ARGUMENTS

`matt-pocock` brings the full AI-engineering workflow pioneered by **Matt Pocock** (from [aihero.dev](https://www.aihero.dev)) into Nexus-DevFlow.

This skill serves two complementary purposes:
1. **Interactive Coach & Mentor**: Teaches the engineering discipline and mindset behind each flow based on real-world engineering situations.
2. **Execution & Routing Orchestrator**: Directs, prepares, and dispatches the actual skills located in `devflow/.vendor/matt-pocock/`.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any Matt Pocock flow, advice, or skill guidance:
1. **Check if `devflow/.vendor/matt-pocock/` exists in this project using your file inspection tool (`view_file` or `list_dir`)**.
2. **If `devflow/.vendor/matt-pocock/` is MISSING / NOT INSTALLED**:
   - **DO NOT hallucinate skill instructions or invent fake flows**.
   - Inform the user in their configured communication language (defaulting to Thai per `devflow/config.json` and `AGENTS.md`):
     - State clearly that the Matt Pocock skill suite (`devflow/.vendor/matt-pocock/`) is not yet installed in this project.
     - Provide the exact installation command:
       ```bash
       npx @jakkrichm/create-nexus-devflow skill add matt-pocock
       ```
     - Offer to run the installation command on their behalf.
   - Stop and wait for installation before proceeding.
3. **If `devflow/.vendor/matt-pocock/` is PRESENT**:
   - Proceed with the 6 Canonical Flows, JIT skill references, and interactive coaching below.

---

## 🧭 The Golden Rule: "Decisions are Yours, Facts are the Agent's"

Matt Pocock's workflow is built upon a strict division of responsibility:
- **Agent's Role**: Gather codebase facts, inspect primary sources, surface constraints, write deterministic tests, propose candidate options, and draft code.
- **Developer's Role**: Make architectural decisions, approve testing seams, define domain boundaries, and evaluate business trade-offs.

---

## 🗺️ The 6 Canonical Flows & Real-World Situations

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 01. Getting Started  : Setup repo once & Router (/setup-matt-pocock-skills, /ask-matt) │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────────────────┐
       ▼                                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ 03. Shaping                  │              │ 04. Upkeep                   │
│ Open questions & fuzzy ideas │              │ Maintenance & bug diagnosis  │
│ • /wayfinder (Decision map)  │              │ • /diagnosing-bugs (Red loop)│
│ • /prototype (Throwaway code)│              │ • /improve-codebase-arch     │
│ • /research (Primary docs)   │              │ • /resolving-merge-conflicts │
└──────┬───────────────────────┘              │ • /triage /wizard            │
       │ (Clarity reached)                    └──────────────┬───────────────┘
       │                                                     │ (Split into issues)
       ▼                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 02. The Main Flow (Idea ➔ Ship Spine)                                       │
│ 1. /grill-with-docs ➔ 2. /to-spec ➔ 3. /to-tickets ➔ [CLEAR] ➔ 4. /implement ➔ 5. /code-review │
└─────────────────────────────────────────────────────────────────────────────┘
       ▲                                                             ▲
       │                                                             │
┌──────┴───────────────────────┐              ┌──────────────────────┴───────┐
│ 05. Productivity (Human Collab)             │ 06. Reference (Foundations)  │
│ • /grill-me (Repo-less idea) │              │ • /codebase-design (Seams)   │
│ • /handoff (Session transfer)│              │ • /domain-modeling (Glossary)│
│ • /to-questionnaire /teach   │              │ • /grilling (Interview core) │
│ • /wait-what /writing-for-agents            │ • /tdd (Red-Green-Refactor)  │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 01. Getting Started Flow (Initial Configuration & Routing)

> **Real-World Situation:**  
> - A freshly cloned or initialized repository where the AI does not yet know the issue tracker, triage labels, or domain context layout.  
> - You have 37 skills available and need an immediate GPS to pick the right flow.

### Key Skills:
1. **`/setup-matt-pocock-skills`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/setup-matt-pocock-skills/SKILL.md)
   - **Action**: Run once per repo to explore the codebase and populate `docs/agents/` (configuring Issue Tracker location like `.scratch/`, triage labels, and `CONTEXT.md` layout).
   - **Command**: `/matt-pocock setup` or `/setup-matt-pocock-skills`
2. **`/ask-matt`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/ask-matt/SKILL.md)
   - **Action**: Acts as an interactive router. Evaluates your current situation and directs you to the optimal flow.
   - **Command**: `/matt-pocock ask "<your current situation...>"`

> 💡 **Matt's Tip:** Never begin coding until the agent understands the project's environment. Running setup once establishes unified project awareness for every tool in the repository.

---

## 02. The Main Flow (The Spine: Idea ➔ Ship)

> **Real-World Situation:**  
> A feature or requirement is reasonably understood and needs to be taken from raw idea all the way to tested, verified, and shipped code.

### The 5 Progressive Steps:
1. **`/grill-with-docs`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/grill-with-docs/SKILL.md)
   - Conduct 2–3 rounds of Socratic grilling to unearth boundaries, assumptions, and edge cases. Retain domain terms in `CONTEXT.md` and record hard-to-reverse decisions in `docs/adr/`.
2. **`/to-spec`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/to-spec/SKILL.md)
   - Synthesize interview results into a Living Spec. Explicitly identify the **Testing Seam** (the highest level of integration to test against) and outline comprehensive User Stories.
3. **`/to-tickets`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/to-tickets/SKILL.md)
   - Decompose the spec into thin, end-to-end **Tracer-bullet tickets** with explicit `Blocked by:` dependencies (saved under `.scratch/<feature>/issues/<NN>-<slug>.md` or an issue tracker).
4. ⚠️ **Phase Boundary (Context Hygiene)**:
   - **Clear Context (`/clear` or fresh session)** before coding! Because each ticket is self-contained with its own acceptance criteria, resetting the window brings the agent into the **Smart Zone (~150k tokens)** where code generation is sharpest.
5. **`/implement`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/implement/SKILL.md)
   - Execute tickets sequentially, driven by **`/tdd`** (Red ➔ Green ➔ Refactor).
6. **`/code-review`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/code-review/SKILL.md)
   - Perform independent two-axis review of the diff: **Spec Axis** (did we build what was asked?) and **Standards Axis** (clean code, deep modules, regression safety) prior to committing.

> 💡 **Matt's Tip:** Steps 1–3 must stay in a single unbroken context window so the grilling, spec, and tickets share continuous reasoning. But once tickets exist, *immediately clear context* before implementing.

---

## 03. Shaping Flow (Open Questions & Fog of War)

> **Real-World Situation:**  
> - A massive greenfield initiative or high-uncertainty feature with heavy Fog of War.  
> - UI/UX or state-machine dilemmas that cannot be resolved in conversation alone.  
> - Deep research into official docs or third-party source code needed before committing to a plan.

### Key Skills:
1. **`/wayfinder`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/wayfinder/SKILL.md)
   - Constructs a **Decision Map** for sprawling projects, resolving fog node by node until an actionable path emerges to hand off to `/to-spec`.
2. **`/prototype`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/prototype/SKILL.md)
   - Creates throwaway, minimal prototype code (e.g. single HTML file or standalone script) to provide tactile validation of UI or complex state logic. Commit onto a separate prototype branch and discard.
3. **`/research`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/research/SKILL.md)
   - Dispatches a background subagent to inspect **Primary Sources** (official documentation, vendor source code) and generates cited summaries for `/grill-with-docs`.

> 💡 **Matt's Tip:** Prototypes are NOT production code! No unit tests, no real database. Their singular purpose is to answer nagging design questions as quickly as possible.

---

## 04. Upkeep Flow (Code Health & Maintenance)

> **Real-World Situation:**  
> - Complex, intermittent, or hard-to-pinpoint bugs.  
> - Modules that feel bloated, shallow, or tightly coupled.  
> - Git merge conflicts during branch integration.  
> - Incoming raw bug reports and feature requests needing categorization.

### Key Skills:
1. **`/diagnosing-bugs`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/diagnosing-bugs/SKILL.md)
   - Enforces a **Tight Red Loop**: refuse to propose fixes or theorize until an exact, failing reproduction command is captured. Fix the defect and keep the test as a regression lock.
2. **`/improve-codebase-architecture`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/improve-codebase-architecture/SKILL.md)
   - Analyzes codebase boundaries to identify shallow modules or tangled dependencies, outputting a prioritized refactoring plan.
3. **`/resolving-merge-conflicts`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/resolving-merge-conflicts/SKILL.md)
   - Resolves conflicts hunk-by-hunk by discovering the underlying **engineering intent** of both branches rather than picking arbitrary lines.
4. **`/triage`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/triage/SKILL.md)
   - Triages raw external requests and bugs, applying standard labels (`needs-info`, `ready-for-agent`, `wontfix`).
5. **`/wizard`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/wizard/SKILL.md)
   - Generates interactive CLI scripts guiding developers through manual out-of-band setups (cloud provisioning, OAuth tokens, secrets).

---

## 05. Productivity Skills (Human Collaboration & Communication)

> **Real-World Situation:**  
> - Exploring an idea before any repository or directory exists.  
> - Context window nearing saturation, requiring seamless handover to a fresh session.  
> - Missing information is locked inside a teammate's or stakeholder's head.  
> - Explaining complex technical concepts cleanly.

### Key Skills:
1. **`/grill-me`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/grill-me/SKILL.md)
   - Stateless ideation interview without file writes or repo modifications. Ideal for early brainstorming.
2. **`/handoff`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/handoff/SKILL.md)
   - Exports the current session state and open threads into a standalone Markdown file in the OS temporary directory for instant agent pickup.
3. **`/to-questionnaire`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/to-questionnaire/SKILL.md)
   - Formulates targeted questionnaires to send to external stakeholders when domain knowledge is missing from code.
4. **`/wait-what`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/wait-what/SKILL.md)
   - Instant interruption command when the agent uses jargon or confusing explanations; forces plain-language re-explanation using `CONTEXT.md`.
5. **`/teach`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/teach/SKILL.md)
   - Teaches programming or architecture concepts interactively using the workspace as a live chalkboard.
6. **`/writing-for-agents`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/writing-for-agents/SKILL.md)
   - Guidelines for authoring markdown documentation optimized for AI agent readability and retrieval.

---

## 06. Reference Skills (Architecture Foundations & Mental Models)

> **Real-World Situation:**  
> Establishing foundational engineering standards, domain taxonomies, and testing discipline across the engineering team.

### Key Skills:
1. **`/codebase-design`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/codebase-design/SKILL.md)
   - Principles of **Deep Modules & Clean Seams**: encapsulating complexity behind concise, stable interfaces.
2. **`/domain-modeling`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/domain-modeling/SKILL.md)
   - Refining domain vocabulary, synchronizing `CONTEXT.md`, and documenting immutable decisions in Architecture Decision Records (ADRs).
3. **`/grilling`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/productivity/grilling/SKILL.md)
   - Core interview methodology leveraged by `grill-with-docs`, `triage`, and `wayfinder`.
4. **`/tdd`** — [SKILL.md](file:///d:/devtools/nexus-devflow/devflow/.vendor/matt-pocock/skills/engineering/tdd/SKILL.md)
   - The ironclad Red ➔ Green ➔ Refactor discipline with deterministic assertions.

---

## 🗂️ Just-In-Time (JIT) Reference Knowledge Map

Before running any flow, inspect the exact primary skill document in `devflow/.vendor/matt-pocock/` using your file reading tool:

| Flow Category | Skill Name | Path in `devflow/.vendor/matt-pocock/` |
| :--- | :--- | :--- |
| **01. Getting Started** | `setup-matt-pocock-skills` | `skills/engineering/setup-matt-pocock-skills/SKILL.md` |
| | `ask-matt` | `skills/engineering/ask-matt/SKILL.md` |
| **02. The Main Flow** | `grill-with-docs` | `skills/engineering/grill-with-docs/SKILL.md` |
| | `to-spec` | `skills/engineering/to-spec/SKILL.md` |
| | `to-tickets` | `skills/engineering/to-tickets/SKILL.md` |
| | `implement` | `skills/engineering/implement/SKILL.md` |
| | `code-review` | `skills/engineering/code-review/SKILL.md` |
| **03. Shaping** | `wayfinder` | `skills/engineering/wayfinder/SKILL.md` |
| | `prototype` | `skills/engineering/prototype/SKILL.md` |
| | `research` | `skills/engineering/research/SKILL.md` |
| **04. Upkeep** | `diagnosing-bugs` | `skills/engineering/diagnosing-bugs/SKILL.md` |
| | `improve-codebase-architecture` | `skills/engineering/improve-codebase-architecture/SKILL.md` |
| | `resolving-merge-conflicts` | `skills/engineering/resolving-merge-conflicts/SKILL.md` |
| | `triage` | `skills/engineering/triage/SKILL.md` |
| | `wizard` | `skills/engineering/wizard/SKILL.md` |
| **05. Productivity** | `grill-me` | `skills/productivity/grill-me/SKILL.md` |
| | `handoff` | `skills/productivity/handoff/SKILL.md` |
| | `to-questionnaire` | `skills/productivity/to-questionnaire/SKILL.md` |
| | `wait-what` | `skills/productivity/wait-what/SKILL.md` |
| | `teach` | `skills/productivity/teach/SKILL.md` |
| | `writing-for-agents` | `skills/productivity/writing-for-agents/SKILL.md` |
| **06. Reference** | `codebase-design` | `skills/engineering/codebase-design/SKILL.md` |
| | `domain-modeling` | `skills/engineering/domain-modeling/SKILL.md` |
| | `grilling` | `skills/productivity/grilling/SKILL.md` |
| | `tdd` | `skills/engineering/tdd/SKILL.md` |

---

## 🕹️ CLI & Command Dispatcher

Invoke `matt-pocock` according to your specific task or question:

```bash
# 01 Getting Started
/matt-pocock setup                       # Run one-time repo setup in docs/agents/
/matt-pocock ask "Encountering a bug..." # Consult Matt for flow selection

# 02 The Main Flow (Idea -> Ship)
/matt-pocock grill "Export PDF feature"  # Socratic grilling of the requirement
/matt-pocock spec                        # Establish Seam and generate Living Spec
/matt-pocock tickets                     # Split spec into tracer-bullet tickets
/matt-pocock run-ticket 01               # TDD implementation of ticket 01
/matt-pocock review                      # Two-axis review before git commit

# 03 Shaping
/matt-pocock wayfinder "Massive project" # Resolve high-fog architecture
/matt-pocock prototype "Test UI state"   # Fast throwaway tactile validation
/matt-pocock research "Library internals"# Deep-dive reading of official docs

# 04 Upkeep
/matt-pocock bug "check command failing" # Tight red loop root-cause diagnosis
/matt-pocock architecture                # Identify shallow modules for refactoring
/matt-pocock conflict                    # Semantic merge conflict resolution

# 05 Productivity & Learning
/matt-pocock learn "Explain Smart Zone"  # In-depth conceptual coaching
/matt-pocock handoff "Switching session" # Generate Markdown handoff note
```

---

## 🌐 Artifact & Communication Language

All user-facing communication, guidance, coaching responses, and stage artifacts MUST default to **Thai (`th`)** (per `devflow/config.json` and `AGENTS.md` directive #5 / `ai-interaction.md`), while code snippets, CLI commands, file paths, and technical identifiers remain in English.
