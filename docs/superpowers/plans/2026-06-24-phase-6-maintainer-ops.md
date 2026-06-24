# Phase 6 Maintainer Operations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Phase 6 maintainer-operations pack for Nexus-DevFlow so framework maintainers can release, upgrade, support, and govern the framework with a clearer manual operating model.

**Architecture:** Keep Phase 6 documentation-first and maintainer-first. The plan adds release, upgrade, troubleshooting, preset, and governance artifacts around the existing DevFlow public surface without introducing new public commands or broad automation.

**Tech Stack:** Markdown documentation, existing DevFlow validation commands, current install/update scripts, maintainer-facing framework docs, and the current public command policy in `README.md`, `USAGE.md`, `AGENTS.md`, and `docs/workflow-surface-map.md`.

---

## File Structure

### Files To Create

- `docs/release-process.md`: Maintainer-facing release checklist and release-stage guidance.
- `docs/upgrade-path.md`: Version upgrade expectations, release-type guidance, and post-update validation path.
- `docs/install-update-troubleshooting.md`: Troubleshooting guide for install, check, update, and update-with-pull flows.
- `docs/team-presets.md`: Maintainer-facing recommendations for different team adoption shapes.
- `docs/governance-rules.md`: Stable rules for future workflow, skill, script, validation, and documentation changes.
- `docs/superpowers/plans/2026-06-24-phase-6-maintainer-ops.md`: This implementation plan.

### Files To Modify

- `README.md`: Add links to new maintainer-facing documentation where appropriate.
- `SETUP.md`: Clarify maintainer-relevant install and update expectations.
- `SETUP-BY-AI.md`: Keep AI-assisted install and update guidance aligned with the new maintainer docs.
- `USAGE.md`: Reference presets or maintainer routing guidance only where it helps users and maintainers without expanding the public command surface.
- `AGENTS.md`: Align governance wording and stable-surface guidance with the new Phase 6 policy docs.
- `ROADMAP.md`: Update active focus or progress notes only if the completed Phase 6 documentation materially changes roadmap status.

### Dependencies And Environment

- **New Packages**: None.
- **Config Changes**: None.
- **Existing Commands To Reuse**: `npm.cmd run codex:check-global`, `npm.cmd run codex:update-global`, `npm.cmd run codex:update-global:pull`, `npm.cmd run roadmap:validate`, `npm.cmd run validate`, `npm.cmd run validate:all`.
- **Primary Constraint**: Preserve DevFlow 2.0 as the only public workflow surface and do not introduce new public commands in this phase.

## 1. Technical Design And Strategy

- **Overview**: Phase 6 packages the framework's manual maintainer workflow into a coherent documentation set. It should answer how to release, how to update safely, how to guide teams, and how to keep future changes from drifting the framework.
- **Reasoning**: The framework is now strong enough that maintainer pain is less about missing basic workflow primitives and more about repeatability, supportability, and decision consistency. Documentation and policy are the lightest-weight way to reduce that pain before automation is introduced.
- **Impact Assessment**: This work touches several high-surface docs, so the main risk is wording drift between the new maintainer docs and the existing public-command documentation. The plan counters that with explicit alignment checks and full validation after each documentation batch.

## 2. Implementation Blueprint

> **Mirror Pattern**: Follow the current tone and structural discipline of `README.md`, `USAGE.md`, `SETUP.md`, `SETUP-BY-AI.md`, and `AGENTS.md`. Prefer concise decision-oriented prose over long essays, and anchor every maintainer instruction to a real command or stable policy source already present in the repo.

```md
## Before A Release

1. Confirm scope and docs alignment
2. Run validation
3. Verify install and upgrade paths
4. Write release notes

## When To Use This Preset

- Product feature teams
- Bugfix-heavy teams
- Framework maintainers
```

## 3. Execution Strategy

### Phase 1

- **Phase Name**: Release checklist and upgrade path
- **Technical Details**: Create the release-process and upgrade-path docs together so release stages, release-type expectations, and post-update validation remain one coherent maintainer story.
- **Edge Cases And Risks**: Avoid writing generic semver theory. Keep the release guidance grounded in the actual commands and documentation practices of this repo.

### Phase 2

- **Phase Name**: Install, check, and update documentation hardening
- **Technical Details**: Add a troubleshooting-oriented doc and align `SETUP.md` and `SETUP-BY-AI.md` to the real install/check/update commands already supported by the framework.
- **Edge Cases And Risks**: Do not create unsupported troubleshooting branches. Every documented recovery path should map to existing commands or existing repo expectations.

### Phase 3

- **Phase Name**: Team usage presets
- **Technical Details**: Add a preset guide for at least product feature teams, bugfix or ops teams, and framework maintainers. Keep presets as recommendation bundles only.
- **Edge Cases And Risks**: Do not let presets behave like alternate workflow systems. Each preset must stay anchored to the same mainline and public companion set.

### Phase 4

- **Phase Name**: Governance rules and alignment sweep
- **Technical Details**: Add governance rules and update high-surface docs such as `AGENTS.md`, `USAGE.md`, and `README.md` only where needed to keep policy aligned.
- **Edge Cases And Risks**: Governance must stay practical. Avoid creating heavy review rules for ordinary doc maintenance.

## 4. Risks And Mitigations

| Risk | Mitigation |
| :--- | :--- |
| Release guidance drifts away from actual commands | Tie every release and upgrade step to commands already in `package.json` and revalidate after doc updates |
| Team presets start acting like alternate frameworks | State clearly that presets are recommendation bundles on top of the same public command model |
| Governance becomes too abstract or too heavy | Use short decision rules with concrete examples and keep hard rules limited to high-risk change categories |
| Maintainer docs contradict public-surface docs | Review `README.md`, `USAGE.md`, `AGENTS.md`, and `docs/workflow-surface-map.md` after each workstream and run full validation |

## 5. Verification Focus

### Test Decision Gate

| Subtask | Decision | Reason | Schema/Contract | Planned Test Cases | Test File & Command | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Release checklist and upgrade path docs | Not Required | Documentation-only change with no direct behavior surface | N/A | Review that release and upgrade docs reference only existing commands and align with roadmap direction | `npm.cmd run validate` and manual doc review | Validation passes and release docs remain command-accurate |
| Install, check, update troubleshooting docs | Not Required | Documentation-only change with no code behavior change | N/A | Review that every troubleshooting path maps to a real command or existing recovery step | `node scripts/scan-doc-contract.mjs` and `npm.cmd run validate:all` | Docs scan and full validation pass |
| Team usage presets | Not Required | Presets are recommendation docs, not executable behavior | N/A | Review that presets use current public commands only and do not invent variant workflow surfaces | `node scripts/scan-doc-contract.mjs` | Docs scan passes and preset wording stays policy-aligned |
| Governance rules and alignment sweep | Not Required | Policy/documentation update only | N/A | Review that workflow, skill, script, and doc placement rules match current framework structure and public-surface definitions | `npm.cmd run validate:all` | Full validation passes and policy docs stay aligned |

- **Success Criteria**:
  - [ ] Maintainers have one documented release checklist with explicit validation and install-check steps
  - [ ] Maintainers have a documented upgrade path and troubleshooting guide based on real commands
  - [ ] Team presets exist for at least three distinct adoption shapes
  - [ ] Governance rules explain how to place future changes without changing the public command surface
  - [ ] Full validation passes after the Phase 6 documentation batch
- **Required Evidence**:
  - [ ] Output from `node scripts/scan-doc-contract.mjs`
  - [ ] Output from `npm.cmd run roadmap:validate`
  - [ ] Output from `npm.cmd run validate`
  - [ ] Output from `npm.cmd run validate:all`
- **Manual Verification**: Read the new docs in this order: `docs/release-process.md`, `docs/upgrade-path.md`, `docs/install-update-troubleshooting.md`, `docs/team-presets.md`, and `docs/governance-rules.md`. Confirm that a framework maintainer can understand how to release, update, support, and govern the framework without needing to infer missing steps from scattered docs.

## 6. Task Breakdown

### Task 1: Add release checklist and upgrade-path guidance

**Files:**
- Create: `docs/release-process.md`
- Create: `docs/upgrade-path.md`
- Modify: `ROADMAP.md` only if the completed work should update active-phase wording
- Test: `ROADMAP.md`

- [ ] **Step 1: Draft `docs/release-process.md` with a stage-based release checklist**

```md
# Release Process

## Release Stages

### 1. Pre-Release Readiness

- Confirm the intended release scope
- Confirm roadmap and docs alignment for any changed public direction
- Confirm that maintainer-facing and user-facing docs are updated together when needed

### 2. Validation

- Run `npm.cmd run roadmap:validate`
- Run `npm.cmd run validate`
- Run `npm.cmd run validate:all`

### 3. Install And Upgrade Verification

- Run `npm.cmd run codex:check-global`
- Run `npm.cmd run codex:update-global` when the local framework should be installed globally
- Run `npm.cmd run validate` again after any meaningful update path check

### 4. Release Notes

- Summarize public-surface changes
- Separate maintainer-only changes from user-facing changes
- Call out install, update, or preset changes explicitly
```

- [ ] **Step 2: Draft `docs/upgrade-path.md` with release-type guidance and post-update expectations**

```md
# Upgrade Path

## Release Types

- `patch`: internal refinement or documentation update with no public workflow change
- `minor`: new framework capability or guidance that keeps the public command model stable
- `major`: change that alters stable expectations or requires a meaningful migration step

## Upgrade Flow

1. Run `npm.cmd run codex:check-global`
2. Decide whether `npm.cmd run codex:update-global` or `npm.cmd run codex:update-global:pull` is appropriate
3. Run `npm.cmd run validate`
4. Run `npm.cmd run validate:all` when the update affects broad framework behavior
```

- [ ] **Step 3: Review whether `ROADMAP.md` needs a light status refresh after these docs exist**

Run: Manual comparison between `ROADMAP.md`, `docs/release-process.md`, and `docs/upgrade-path.md`
Expected: Either no roadmap edit is needed, or any roadmap edit stays limited to progress/status wording.

- [ ] **Step 4: Run roadmap and framework validation**

Run: `npm.cmd run roadmap:validate`
Expected: PASS with roadmap markdown recognized and no contract errors.

Run: `npm.cmd run validate`
Expected: PASS with framework validation green.

- [ ] **Step 5: Commit the release and upgrade guidance**

```bash
git add docs/release-process.md docs/upgrade-path.md ROADMAP.md
git commit -m "docs: add phase 6 release and upgrade guidance"
```

### Task 2: Harden install, check, and update documentation

**Files:**
- Create: `docs/install-update-troubleshooting.md`
- Modify: `SETUP.md`
- Modify: `SETUP-BY-AI.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Draft `docs/install-update-troubleshooting.md` around the real framework lifecycle commands**

```md
# Install And Update Troubleshooting

## Commands

- `npm.cmd run codex:check-global`
- `npm.cmd run codex:update-global`
- `npm.cmd run codex:update-global:pull`
- `npm.cmd run validate`
- `npm.cmd run validate:all`

## Common Situations

### Global check fails

1. Confirm you are running from the framework root
2. Re-run `npm.cmd run codex:check-global`
3. Run `npm.cmd run validate`

### Update after local changes

1. Inspect `git status --short`
2. Do not pull blindly if the worktree is dirty
3. Choose whether to commit, stash, or skip the pull path before `npm.cmd run codex:update-global:pull`
```

- [ ] **Step 2: Update `SETUP.md` so it points maintainers to the troubleshooting and post-install validation path**

```md
## After Install

Run:

```powershell
npm.cmd run codex:check-global
npm.cmd run validate
```

If install or update checks fail, see `docs/install-update-troubleshooting.md`.
```

- [ ] **Step 3: Update `SETUP-BY-AI.md` so AI-assisted setup and update guidance uses the same recovery path**

```md
## Verification After Setup

- Run `npm.cmd run codex:check-global`
- Run `npm.cmd run validate`
- Use `docs/install-update-troubleshooting.md` when setup or update behavior is unexpected
```

- [ ] **Step 4: Run docs scan and full validation**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS with no documentation contract violations.

Run: `npm.cmd run validate:all`
Expected: PASS with framework validation, doc scan, and supporting tests all green.

- [ ] **Step 5: Commit the install/update hardening batch**

```bash
git add docs/install-update-troubleshooting.md SETUP.md SETUP-BY-AI.md
git commit -m "docs: harden phase 6 install and update guidance"
```

### Task 3: Add team usage presets

**Files:**
- Create: `docs/team-presets.md`
- Modify: `README.md`
- Modify: `USAGE.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Create `docs/team-presets.md` with three maintainer-facing presets**

```md
# Team Presets

## Product Feature Team

- Recommended entry: `/00-Discover`
- Core flow: full mainline
- Essential artifacts: `00-discover.md`, `10-define.md`, `20-spec.md`, `30-plan.md`, `50-verify.md`, `70-report.md`

## Bugfix Or Operations Team

- Recommended entry: `Debug` or `Issue-Triage`
- Core flow: companion entry plus tighter mainline path
- Essential artifacts: `10-define.md`, `20-spec.md`, `30-plan.md`, `50-verify.md`

## Framework Maintainer Team

- Recommended entry: roadmap, validation, docs, and release-facing work
- Core flow: roadmap and maintainer docs plus validation commands
- Essential artifacts: roadmap docs, setup docs, release docs, governance docs
```

- [ ] **Step 2: Update `README.md` to point maintainers to the preset guide without changing the public command model**

```md
## Documentation

| [Team Presets](./docs/team-presets.md) | Maintainer-facing guidance for recommending DevFlow adoption shapes |
```

- [ ] **Step 3: Update `USAGE.md` to reference presets as recommendation guidance rather than alternate workflow surfaces**

```md
## Maintainer Guidance

Maintainers who need to recommend a lighter or heavier DevFlow usage shape should use `docs/team-presets.md`. Presets do not replace the mainline or public companion commands.
```

- [ ] **Step 4: Run the documentation contract scan**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS.

- [ ] **Step 5: Commit the preset guidance**

```bash
git add docs/team-presets.md README.md USAGE.md
git commit -m "docs: add phase 6 team presets"
```

### Task 4: Add governance rules and align high-surface framework docs

**Files:**
- Create: `docs/governance-rules.md`
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `USAGE.md`
- Test: `scripts/scan-doc-contract.mjs`

- [ ] **Step 1: Create `docs/governance-rules.md` with short decision rules for future framework changes**

```md
# Governance Rules

## Public Surface Rule

The public workflow surface remains the mainline plus the declared public companion commands only.

## Placement Rules

- Add a workflow only when the behavior owns public stage state or a public command surface
- Add a skill when the behavior is reusable and does not own workflow state
- Add a script when the change reduces repetition or supports validation without changing the public workflow model
- Add validation when the contract is stable and repeated enough to justify enforcement
```

- [ ] **Step 2: Update `AGENTS.md` to align any maintainer-facing governance wording with the new rules**

```md
## Workflow, Agent, Skill Boundary

Use `docs/governance-rules.md` for maintainer-facing decision rules when deciding whether new behavior belongs in a workflow, skill, script, or validation surface.
```

- [ ] **Step 3: Update `README.md` and `USAGE.md` only where needed so governance references remain discoverable but not user-heavy**

Run: Manual doc edits to add a governance doc link or short reference in the documentation sections
Expected: Maintainers can find the governance guide without changing the public onboarding story.

- [ ] **Step 4: Run docs scan and full validation**

Run: `node scripts/scan-doc-contract.mjs`
Expected: PASS.

Run: `npm.cmd run validate:all`
Expected: PASS with docs and framework surfaces aligned.

- [ ] **Step 5: Commit the governance and alignment batch**

```bash
git add docs/governance-rules.md AGENTS.md README.md USAGE.md
git commit -m "docs: add phase 6 governance guidance"
```

## 7. Checklist Initialization

- **Checklist Directory**: Not required for this planning artifact unless Phase 6 execution is moved into a numbered DevFlow run under `.workspaces/specs/`.
- **Required Files**: If execution is promoted into `/30-Plan` inside a tracked run, create `master-checklist.md`, `implementation-checklist.md`, and `verification-checklist.md` before `/40-Implement`.
- **Checklist Rule**: Convert the four tasks above into live checklist items if maintainers want visible execution tracking across release, setup, presets, and governance work.
- **Synchronization Rule**: Keep commit boundaries aligned with the four workstreams so evidence stays easy to audit and report.

## 8. Sources

- `docs/superpowers/specs/2026-06-24-phase-6-maintainer-ops-design.md`
- `ROADMAP.md`
- `README.md`
- `SETUP.md`
- `SETUP-BY-AI.md`
- `USAGE.md`
- `AGENTS.md`
- `docs/workflow-surface-map.md`
- `docs/spec-kit-devflow-rules.md`
- `package.json`
- `scripts/update-codex-global.mjs`
- `scripts/validate-framework.mjs`
- `scripts/validate-all.mjs`
- `scripts/scan-doc-contract.mjs`

---

Technical plan generated via Nexus-DevFlow Manager.
