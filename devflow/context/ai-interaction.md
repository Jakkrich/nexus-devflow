# AI Interaction Guidelines for Nexus-DevFlow

> **Nexus-DevFlow is an agentic workflow layer**, overlaying on top of scaffolded or existing codebases. Never run a framework scaffolder inside an initialized DevFlow directory.

---

## 1. Communication & Principles

- **Be Concise and Direct**: State conclusions, status, and findings first; provide supporting context afterward.
- **Explain Non-Obvious Decisions Briefly**: Highlight architectural trade-offs, edge-case rationale, or safety considerations in 1–2 sentences.
- **Ask Before Destructive or Architectural Changes**: Always obtain explicit confirmation before deleting files, executing major refactors, or altering public interfaces.
- **Don't Add Unplanned Scope**: Stick strictly to the Acceptance Criteria defined in the spec. Avoid adding "nice-to-have" features that were not requested.
- **Preserve Existing Codebase Patterns**: Respect existing file structure, typing patterns, naming conventions, and deep module boundaries.

---

## 2. Output Formatting

Format every response for fast scanning and readability:

- **Real Markdown, Not Prose Walls**: Use bold labels, concise bullet points, and blank lines between blocks.
- **Enumerations Are Lists**: Numbered or bulleted lists for sequential steps or findings, never inline runs crammed into paragraphs.
- **Tables for Comparative Matrices**: Use markdown tables when comparing status, options, test results, or trade-offs.
- **Backticks for Code References**: Wrap file paths, variable names, functions, CLI flags, and commands in backticks (e.g. `current-feature.md`, `npm run check`).
- **Clickable File Links**: Use GitHub-style markdown links with `file://` scheme (e.g. `[current-feature.md](file:///d:/path/to/current-feature.md)`).
- **Lead With the Result**: State pass/fail status or completed action before presenting logs.

---

## 3. Dual-Track Workflow Lifecycle (The 3-Pillars Model)

```text
devflow/
├── 🔮 ideas.md        # [Future] Idea Inbox
├── ⚡ context/         # [Present] Living Spec (current-feature.md) & Active State
└── 📦 history/         # [Past] features/, fixes/, rollbacks/, and HISTORY.md
```

### 🏎️ Track 1: Fast-Track (Blueprint Mode — 4 Steps)
*Recommended for 85% of daily engineering work (features, bug fixes, UI improvements, iterative refactoring).*

The entire lifecycle is driven by the **Single Living Spec (`devflow/context/current-feature.md`)**:

1. **Spec (`/feature` or `/fix`)**:
   - Checks **Single Active Run Guardrail** (rejects if an uncompleted task is still active).
   - Analyzes request (or consumes `IDEA-xxx` from `devflow/ideas.md`).
   - Allocates sequential ID without prefix (e.g. `022-{slug}`) and creates branch `feature/{xxx-slug}` or `fix/{xxx-slug}`.
   - Generates `devflow/context/current-feature.md` containing **Section 1 (Scope & AC)**, **Section 2 (Plan & Test Strategy)**, and **Section 3 (Checklist)**.
2. **Implement (`/implement`)**:
   - Executes checklist tasks incrementally one small diff at a time using **TDD (Red-Green-Refactor)**.
   - Updates `## 4. Implementation Record` and marks tasks `- [x]` in `current-feature.md`.
3. **Check (`/check`)**:
   - Senior QA multi-lane verification (Lane 1: Typecheck/Lint, Lane 2: Test Suites, Lane 3: Manual Proof).
   - Records empirical proof under `## 5. Verification Evidence` in `current-feature.md`.
4. **Complete (`/complete`)**:
   - Final safety pass, updates `## 6. Release & Handoff` digest in `current-feature.md`.
   - Automatically archives `current-feature.md` ➔ `devflow/history/{features|fixes|rollbacks}/{xxx-slug}.md`.
   - Appends resolved findings and cleans `findings.md`.
   - Resets `current-feature.md` back to the idle stub.
   - Performs Git squash-merge into `main`, updates `devflow/history/HISTORY.md`, and sets workspace to Idle.

---

### 🏗️ Track 2: Deep-Track (Architect Mode — 8 Steps)
*Recommended for large architectural epics, database migrations, security audits, and multi-agent coordination.*

```text
00-discover ➔ 10-define ➔ 20-spec ➔ 30-plan ➔ 40-execute ➔ 50-verify ➔ 60-report ➔ 70-release
```

1. `00-discover`: Explore request before delivery commitment (`DISC-YYYYMMDD-NNN`).
2. `10-define`: Turn approved discovery into bounded delivery run in `devflow/context/current-run/10-define.md`.
3. `20-spec`: Formalize markdown delivery contract & acceptance criteria (`20-spec.md`).
4. `30-plan`: Breakdown spec into executable tasks with test decisions (`30-plan.md` + checklists).
5. `40-execute`: Incremental task execution behind review gates (`40-execute.md`).
6. `50-verify`: Senior QA review & multi-lane verification checks (`50-verify.md`).
7. `60-report`: Standardized markdown delivery digest (`60-report.md`).
8. `70-release`: Release packaging, git merge, archives `devflow/context/current-run/` ➔ `devflow/history/{features|fixes|rollbacks}/{xxx-slug}/`, and closes the run.

---

## 4. Standalone HTML Reporting Policy

> [!IMPORTANT]
> **No Auto-Generated HTML**: Mainline stages (`/complete` and `60-report`) strictly output Markdown only.
> When an interactive web dashboard is desired for presentation or sharing, invoke the standalone companion command:
> `/report:html` (or `npm run report:html -- {ID}`).

---

## 5. Resuming After Context Clear

Progress lives in persistent files, not in transient chat history:

- In Fast-Track: `devflow/context/current-feature.md` maintains ticked checklist boxes `- [x]`.
- In Deep-Track: `devflow/context/current-run/` maintains stage markdown files.
- In Git: Commits, branches, and working tree maintain the code history.
- When starting a fresh session after a context clear, run `devflow` or inspect `current-stage.md` to pick up immediately from the next pending step.

---

## 6. Single Active Run Guardrail (One Thing at a Time)

- Only one active run is allowed at a time across both Fast-Track and Deep-Track.
- The AI will actively block opening a new feature or fix until the current one is completed with `/complete` or `70-release` (or explicitly rolled back/cancelled).

---

## 7. Branching & Git Conventions

- **Branch Naming**: `feature/{xxx-slug}` or `fix/{xxx-slug}`.
- **Commit Messages**: Conventional imperative format (e.g. `feat(uninstall): add clean eject CLI command`, `fix(parser): handle undefined metadata field`).
- **No AI Attribution in Commits**: Never include "Generated with AI" or agent metadata in Git commit logs.
- **Explicit Approval for Push & Deploy**: Merge approval is strictly separate from consent to `git push` to remote repositories or deploy to production.

---

## 8. Autopilot Policy

- `autopilot` is an explicit opt-in command (`/autopilot`). Never suggest it as the default next action.
- When invoked, it runs one bounded spec/plan/implement/verify pass.
- Autopilot **MUST stop** before `/complete`, merge, push, deploy, or any destructive action.
