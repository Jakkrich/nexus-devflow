# Phase 4 Adoption and Developer Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Phase 4 of Nexus-DevFlow tangible by improving first-run onboarding, documenting concrete example flows, and fixing the most visible documentation quality gaps that block adoption.

**Architecture:** Keep this phase documentation-first and validation-backed. Reuse the existing DevFlow public surface, strengthen quickstart and usage guidance around it, and turn existing tracked artifacts into example material instead of inventing a second workflow surface or heavy new runtime layer.

**Tech Stack:** Markdown documentation, existing `.workspaces` tracked artifacts, Node.js validation scripts, DevFlow schema and workflow docs, and current roadmap/discovery artifacts.

---

## File Structure

### Files To Create

- `docs/adoption-playbook.md`: Single landing document for Phase 4 onboarding strategy and first-run guidance.
- `docs/example-runs.md`: Concrete examples of feature, bugfix, and verification-heavy DevFlow runs using real repository artifacts where possible.
- `docs/superpowers/plans/2026-06-24-phase-4-adoption-and-dx.md`: This implementation plan.

### Files To Modify

- `ROADMAP.md`: Keep the Phase 4 wording aligned with the execution plan if any phrasing drift is found during implementation.
- `.workspaces/roadmap/roadmap-discovery.md`: Refresh roadmap discovery so it reflects the post-migration focus instead of only legacy cleanup.
- `README.md`: Tighten the top-level adoption story and point clearly to quickstart and example guidance.
- `USAGE.md`: Improve entry-point routing and add clearer “what to do first” guidance for new users.
- `docs/quickstart.md`: Make first-run setup, mainline understanding, and “first useful commands” easier to follow.
- `docs/workspace-artifacts.md`: Fix encoding-corrupted Thai text or rewrite affected sections into stable readable text.
- `docs/workflow-surface-map.md`: Fix encoding corruption and keep command/skill/agent distinctions readable for real users.

### Dependencies And Environment

- **New Packages**: None.
- **Config Changes**: None.
- **Constraint**: Preserve DevFlow 2.0 as the only public workflow surface; no Spec Kit terminology should leak into user-facing docs.

## 1. Technical Design And Strategy

- **Overview**: Phase 4 should improve “time to first successful run” rather than add new workflow concepts. The work stays inside docs and tracked planning artifacts so maintainers can validate and iterate quickly.
- **Reasoning**: The current framework already validates and routes correctly, but adoption still depends too much on maintainer explanation. Better onboarding docs and concrete examples are the fastest path to measurable usability gains.
- **Impact Assessment**: The main risk is introducing documentation drift between `README.md`, `USAGE.md`, quickstart, and workflow-surface docs. The plan counters that by updating them as one bounded batch and validating afterward.

## 2. Implementation Blueprint

> **Mirror Pattern**: Follow the tone and structure already used in `README.md`, `USAGE.md`, and `docs/quickstart.md`, while using real repository artifacts such as `.workspaces/specs/001-integrate-md2html/` as the source of example flow evidence.

```md
## Recommended Starting Points

- For new work: start at `/00-Discover`
- For partially clear work: start at `/10-Define`
- For route guidance: use `Help`

## Example Flow

Feature work:
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
```

## 3. Execution Strategy

### Phase 1

- **Phase Name**: Refresh the roadmap discovery and adoption framing
- **Technical Details**: Bring `.workspaces/roadmap/roadmap-discovery.md` in line with the updated roadmap so discovery inputs name Phase 4 goals explicitly: quickstart quality, example runs, and documentation hardening.
- **Edge Cases And Risks**: Do not turn roadmap discovery into a second roadmap. Keep it short, strategic, and evidence-backed.

### Phase 2

- **Phase Name**: Harden first-run onboarding surfaces
- **Technical Details**: Update `README.md`, `USAGE.md`, and `docs/quickstart.md` together so they give a consistent first-run story, clear command entry points, and a lightweight “what to do next” progression.
- **Edge Cases And Risks**: Avoid duplicating large sections across docs. Each document should keep one clear job.

### Phase 3

- **Phase Name**: Publish concrete example-run guidance
- **Technical Details**: Create example-run documentation from existing, validated repo artifacts and from canonical flow shapes already present in DevFlow docs.
- **Edge Cases And Risks**: Do not create fake examples that drift from the real workflow surface. Favor examples backed by tracked artifacts or minimal canonical sequences.

### Phase 4

- **Phase Name**: Repair doc quality blockers and revalidate
- **Technical Details**: Fix encoding-corrupted workflow/docs pages, rescan doc consistency, and run framework validation so adoption improvements ship on top of a clean readable surface.
- **Edge Cases And Risks**: Large rewrites could accidentally change command ownership semantics. Preserve the same routing policy while making the text readable.

## 4. Risks And Mitigations

| Risk | Mitigation |
| :--- | :--- |
| Onboarding docs become repetitive and hard to maintain | Give each file one clear responsibility and cross-link instead of duplicating long explanations |
| Example guidance drifts from the real workflow surface | Base examples on current `README.md`, `USAGE.md`, and `.workspaces/specs/001-integrate-md2html/` artifacts |
| Encoding cleanup changes meaning while fixing readability | Rewrite corrupted sections from current policy sources instead of trying byte-level recovery |
| Phase 4 grows into automation work and loses focus | Keep scripts unchanged unless a docs blocker truly requires a tiny helper adjustment |

## 5. Verification Focus

### Test Decision Gate

| Subtask | Decision | Reason | Schema/Contract | Planned Test Cases | Test File & Command | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Refresh roadmap discovery for Phase 4 | Not Required | Markdown planning artifact only; no behavior surface | N/A | Manual review that discovery reflects adoption, examples, and doc hardening rather than legacy-only cleanup | Review diff plus `npm.cmd run roadmap:validate` | Roadmap validation still passes |
| Tighten README, USAGE, and quickstart onboarding | Not Required | Documentation-only change with no executable behavior | N/A | Review for consistent first-run guidance, entry points, and command naming across all three docs | `node scripts/scan-doc-contract.mjs` and `npm.cmd run validate` | Docs scan and framework validation pass |
| Add example-run documentation | Not Required | Documentation-only change; examples are descriptive artifacts | N/A | Review that examples are traceable to the real workflow and do not introduce retired surfaces | `node scripts/scan-doc-contract.mjs` | Docs scan passes and examples match public command policy |
| Fix encoding-corrupted docs | Not Required | Readability/documentation issue only | N/A | Review `docs/workflow-surface-map.md` and `docs/workspace-artifacts.md` for readable text and unchanged routing policy | `node scripts/scan-doc-contract.mjs` and `npm.cmd run validate:all` | Full validation passes and files are readable |

- **Success Criteria**:
  - [ ] New users can identify where to start from `README.md` or `docs/quickstart.md` without extra maintainer explanation
  - [ ] At least one dedicated example-run document exists and uses current DevFlow terminology only
  - [ ] Roadmap discovery reflects the new Phase 4 focus
  - [ ] Previously corrupted docs are readable and still policy-aligned
  - [ ] Full validation passes after the documentation batch
- **Required Evidence**:
  - [ ] Output from `npm.cmd run roadmap:validate`
  - [ ] Output from `npm.cmd run validate`
  - [ ] Output from `npm.cmd run validate:all`
  - [ ] Output from `node scripts/scan-doc-contract.mjs`
- **Manual Verification**: Read `README.md`, `docs/quickstart.md`, and `docs/example-runs.md` in order and confirm that a new user could identify a starting command, understand the mainline, and see one concrete end-to-end example without opening internal-only workflow files.

## 6. Task Breakdown

### Task 1: Refresh roadmap discovery so Phase 4 has an execution-ready brief

**Files:**
- Modify: `.workspaces/roadmap/roadmap-discovery.md`
- Modify: `ROADMAP.md` if wording drift is discovered during the refresh
- Test: `ROADMAP.md`

- [ ] **Step 1: Rewrite the “Current State” and “Strategy Inputs” sections in `.workspaces/roadmap/roadmap-discovery.md`**

```md
## 3. Current State #section/context

- **Current Product State**: DevFlow 2.0 foundation is stable and validated; adoption work is the next major priority
- **Completed Capabilities**: Mainline workflows, companion routing, markdown-first contracts, and report HTML rendering
- **Known Gaps**: First-run onboarding still depends too much on maintainer guidance; examples and doc quality need hardening

## 5. Strategy Inputs #section/strategy

- **Candidate Priorities**: quickstart hardening, example runs, doc quality cleanup
- **Important Dependencies**: validation scripts, current public command policy, tracked real artifacts
- **Validation Or Evidence Needed**: roadmap and framework validation after doc updates
```

- [ ] **Step 2: Review `ROADMAP.md` and confirm that Phase 4 wording still matches the discovery refresh**

Run: Manual comparison between `ROADMAP.md` and `.workspaces/roadmap/roadmap-discovery.md`
Expected: No contradiction between Phase 4 goals, gaps, or priorities.

- [ ] **Step 3: Run roadmap validation**

Run: `npm.cmd run roadmap:validate`
Expected: PASS with roadmap markdown recognized and no missing-heading or focus-row errors.

- [ ] **Step 4: Commit the roadmap discovery refresh**

```bash
git add .workspaces/roadmap/roadmap-discovery.md ROADMAP.md
git commit -m "docs: refresh phase 4 roadmap discovery"
```

### Task 2: Harden first-run onboarding across README, quickstart, and usage

**Files:**
- Modify: `README.md`
- Modify: `docs/quickstart.md`
- Modify: `USAGE.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Tighten the onboarding section in `README.md`**

```md
## Quick Start

From the framework root:

```powershell
npm.cmd run activate
npm.cmd run validate
```

If you are new to DevFlow:

1. Read `docs/quickstart.md`
2. Use `/00-Discover` for new work or `Help` if the route is unclear
3. Use `docs/example-runs.md` for concrete flow examples
```

- [ ] **Step 2: Rework `docs/quickstart.md` so the flow is “activate -> validate -> choose a start point -> inspect an example”**

```md
## 6. First Example Path

If you are starting new feature work:

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan
```

If you are fixing a bug:

```text
Debug -> /10-Define -> /20-Spec -> /30-Plan
```

See `docs/example-runs.md` for a fuller walkthrough.
```

- [ ] **Step 3: Add a “New To DevFlow?” section in `USAGE.md` that routes readers before they scroll into details**

```md
## New To DevFlow?

- Start with `docs/quickstart.md` if you need the fastest valid setup path
- Start with `/00-Discover` if the work is new
- Start with `Help` if you do not know which command fits
- Read `docs/example-runs.md` if you want concrete flow examples before starting
```

- [ ] **Step 4: Run the documentation contract scan**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS with no documentation contract violations.

- [ ] **Step 5: Run framework validation after the onboarding doc batch**

Run: `npm.cmd run validate`
Expected: PASS with roadmap, workflow naming, artifact-language, and doc-alignment checks still green.

- [ ] **Step 6: Commit the onboarding hardening batch**

```bash
git add README.md docs/quickstart.md USAGE.md
git commit -m "docs: improve devflow onboarding flow"
```

### Task 3: Add concrete example-run documentation

**Files:**
- Create: `docs/example-runs.md`
- Modify: `README.md`
- Modify: `docs/quickstart.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Create `docs/example-runs.md` with three canonical examples**

```md
# Example Runs

## 1. New Feature

```text
/00-Discover "Add password reset"
/10-Define
/20-Spec
/30-Plan
/40-Implement
/50-Verify
/70-Release
/60-Report
```

## 2. Bug Fix

```text
Debug "Login redirects forever after session expiry"
/10-Define
/20-Spec
/30-Plan
/40-Implement
/50-Verify
```

## 3. Verification-Heavy Work

Use a tracked run such as `.workspaces/specs/001-integrate-md2html/` to show how `30-plan.md`, `checklists/`, `50-verify.md`, and `60-report.md` relate.
```

- [ ] **Step 2: Link the new example document from `README.md` and `docs/quickstart.md`**

Run: Manual doc edits to add `[Example Runs](./docs/example-runs.md)` from `README.md` and `[example-runs.md](example-runs.md)` from `docs/quickstart.md`
Expected: Readers can reach examples from both entry documents in one click.

- [ ] **Step 3: Review the existing tracked run to ensure the verification-heavy example names real artifacts correctly**

Run: Manual review of `.workspaces/specs/001-integrate-md2html/`
Expected: The example mentions only files that exist in the tracked run.

- [ ] **Step 4: Run the documentation contract scan again**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS.

- [ ] **Step 5: Commit the example-run documentation**

```bash
git add docs/example-runs.md README.md docs/quickstart.md
git commit -m "docs: add devflow example runs"
```

### Task 4: Repair encoding-corrupted docs and keep policy intact

**Files:**
- Modify: `docs/workflow-surface-map.md`
- Modify: `docs/workspace-artifacts.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Rewrite the corrupted introduction and section prose in `docs/workflow-surface-map.md` using the current readable policy as source**

```md
# Workflow Surface Map

This document decides which workflow surfaces should remain public commands, which should stay internal companions, and which behaviors should live primarily in skills or agents in DevFlow 2.0.
```

- [ ] **Step 2: Rewrite the corrupted Thai or broken-text sections in `docs/workspace-artifacts.md` into stable readable prose**

```md
## Task Workspace Files

Each mainline run lives under `.workspaces/specs/{ID}-{slug}/` and uses flat stage filenames in one directory so the work stays easy to inspect, resume, and validate.
```

- [ ] **Step 3: Review both files against `AGENTS.md` and `USAGE.md` to verify that command ownership did not change**

Run: Manual comparison across `AGENTS.md`, `USAGE.md`, `docs/workflow-surface-map.md`, and `docs/workspace-artifacts.md`
Expected: Public commands, internal companions, and mainline stages still match exactly.

- [ ] **Step 4: Run the docs scan and full validation**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS.

Run: `npm.cmd run validate:all`
Expected: PASS with documentation contract scan and framework validation both green.

- [ ] **Step 5: Commit the doc-quality cleanup**

```bash
git add docs/workflow-surface-map.md docs/workspace-artifacts.md
git commit -m "docs: repair workflow and workspace reference pages"
```

## 7. Checklist Initialization

- **Checklist Directory**: Not required for this planning artifact unless execution is moved into a numbered DevFlow run under `.workspaces/specs/`.
- **Required Files**: If Phase 4 execution is promoted into `/30-Plan` under a tracked run, create `implementation-checklist.md` and `verification-checklist.md`.
- **Checklist Rule**: Convert the four tasks above into live checklist items before `/40-Implement` if the team wants visible progress tracking.
- **Synchronization Rule**: Keep each commit aligned to one task so checklist evidence and report summaries stay easy to reconstruct.

## 8. Sources

- `ROADMAP.md`
- `.workspaces/roadmap/roadmap-discovery.md`
- `README.md`
- `USAGE.md`
- `docs/quickstart.md`
- `docs/workspace-artifacts.md`
- `docs/workflow-surface-map.md`
- `.workspaces/specs/001-integrate-md2html/`
- `docs/spec-kit-devflow-rules.md`
- `scripts/scan-doc-contract.mjs`
- `scripts/validate-framework.mjs`
- `scripts/validate-all.mjs`

---

Technical plan generated via Nexus-DevFlow Manager.
