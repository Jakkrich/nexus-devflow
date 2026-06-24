# DevFlow Phase 6 Maintainer Operations Design

Date: 2026-06-24
Status: proposed
Owner: Codex

## 1. Summary

Phase 6 should make Nexus-DevFlow easier to maintain, release, upgrade, and support across teams without changing the public DevFlow 2.0 workflow surface.

The phase is maintainer-first. It focuses on four linked workstreams:

- release checklist and upgrade path
- install, check, and update documentation hardening
- team usage presets
- governance rules for future framework changes

The goal is not to add new automation or new public commands yet. The goal is to make the current framework predictable to operate.

## 2. Problem

DevFlow 2.0 is now in a stronger state than the earlier migration phases:

- the mainline exists and is documented
- validation is already strong
- onboarding and example flows are improving

But framework maintainers still need a more reliable operating model for:

- deciding what is required before a release
- explaining how to install, check, update, and recover from update problems
- guiding different team types without re-explaining the framework every time
- keeping future changes from drifting the public surface or fragmenting framework behavior

Without that maintainer layer, the framework risks becoming harder to release and harder to extend safely even if the current docs are readable.

## 3. Goals

- Define a maintainer-ready release process for Nexus-DevFlow
- Define an upgrade path and validation expectations for framework updates
- Harden install, check, and update documentation around the commands that already exist
- Provide team usage presets that help maintainers recommend the right depth of DevFlow adoption
- Define governance rules for workflows, skills, scripts, and docs so the framework can evolve without surface drift
- Preserve DevFlow 2.0 as the only public workflow surface

## 4. Non-Goals

- Do not introduce new public commands in this phase
- Do not add major new automation helpers in this phase
- Do not redesign the mainline, running-ID model, or markdown-first contract
- Do not create a second framework layer that users must learn
- Do not turn governance into heavyweight bureaucracy for routine documentation changes

## 5. Design Principles

- Maintainer-first: optimize for the people who release and support the framework
- Surface stability: keep the public DevFlow command model unchanged
- Documentation before automation: make the manual process explicit and reliable before automating it
- Policy traceability: every governance rule should map to an existing framework risk or recurring decision
- Minimum viable structure: write enough policy to reduce drift, not enough to slow the project down

## 6. Phase Scope

Phase 6 should be delivered as a documentation-and-policy pack first.

That pack should answer five maintainer questions:

1. What must be true before we release?
2. How do we update the installed framework and know it still works?
3. How do we tell different teams how much of DevFlow to adopt?
4. What parts of the framework are stable versus internal?
5. How do we decide whether a future change belongs in a workflow, skill, script, or doc?

## 7. Proposed Workstreams

### 7.1 Release Checklist And Upgrade Path

Create a clear release process for maintainers.

Expected coverage:

- pre-release checks
- required validation commands
- doc and roadmap consistency checks
- global install/update verification
- release note expectations
- version change classification guidance

Also document upgrade expectations between framework versions:

- what a maintainer should check before updating
- what a maintainer should run after updating
- how to recover if validation fails after upgrade

### 7.2 Install, Check, And Update Documentation Hardening

Clarify the existing framework lifecycle commands:

- `npm run codex:check-global`
- `npm run codex:update-global`
- `npm run codex:update-global:pull`
- `npm run validate`
- `npm run validate:all`

This workstream should explain:

- when each command should be used
- what a successful result looks like
- how to diagnose common failure modes
- what maintainers should do before telling teams to upgrade

### 7.3 Team Usage Presets

Create maintainable preset guidance for different adoption shapes.

Suggested initial presets:

- product feature team
- bugfix or operations-heavy team
- framework maintainer team

Each preset should define:

- the minimum recommended command surface
- the typical entry point into DevFlow
- which artifacts are essential
- which optional layers can be skipped safely

The point is not to create new workflow variants. The point is to help maintainers recommend sane usage defaults.

### 7.4 Governance Rules For Future Changes

Write stable rules for future framework evolution.

The rules should cover:

- what counts as public surface versus internal companion surface
- when to add a workflow versus a skill versus a script
- when to update templates versus docs versus validation
- what kind of changes should require stronger review
- how to keep command ownership and terminology aligned across the repo

## 8. Proposed Artifacts

Phase 6 should likely create or update the following documents.

### Likely New Docs

- `docs/release-process.md`
- `docs/upgrade-path.md`
- `docs/install-update-troubleshooting.md`
- `docs/team-presets.md`
- `docs/governance-rules.md`

### Likely Updated Docs

- `README.md`
- `SETUP.md`
- `SETUP-BY-AI.md`
- `USAGE.md`
- `AGENTS.md`
- `ROADMAP.md`

The final artifact list may change during planning, but it should stay within the maintainer-operations scope.

## 9. Release Process Design

The release checklist should be structured around stages rather than a loose bullet list.

Suggested release stages:

### Pre-Release Readiness

- confirm intended scope
- confirm roadmap alignment if public direction changed
- confirm relevant docs are updated

### Validation

- run core framework validation
- run full validation
- confirm any new docs remain contract-aligned

### Install And Upgrade Verification

- run the global check command
- run the update path intentionally when release behavior changed
- confirm expected post-update validation

### Release Notes And Change Communication

- summarize public-facing changes
- call out maintainer-only changes separately
- explain whether team presets or install/update guidance changed

## 10. Upgrade Path Design

The upgrade path should be explicit about different release types.

Suggested classification:

- `patch`: documentation, validation, or internal behavior refinements with no public workflow change
- `minor`: new framework capability, new maintainer guidance, or expanded artifact behavior that keeps the public command model stable
- `major`: changes that alter stable expectations for maintainers or teams, or require a meaningful migration step

The design does not need to lock semver policy with legal precision yet, but it should create a usable maintainer rule of thumb.

## 11. Team Preset Design

Presets should not fragment the framework. They should be recommendation bundles only.

Each preset should include:

- who the preset is for
- what problem shape it fits
- recommended starting commands
- minimum artifact set
- optional layers to add when the team matures

Example preset framing:

- product feature team: use the full mainline more often
- bugfix or ops team: use `Debug`, `Issue-Triage`, and a tighter mainline subset
- framework maintainer team: use roadmap, validation, docs, and release-facing controls more often

## 12. Governance Design

Governance should answer recurring change-placement questions.

Examples:

- If the user needs a new public lifecycle state, is that a workflow?
- If the behavior is reusable and does not own state, is that a skill?
- If the change reduces repetition or supports validation without changing the public surface, is that a script?
- If the repo has already declared something internal, what would be required to promote it into the public surface?

This design should prefer short decision rules and examples over long prose.

## 13. Validation Strategy

Phase 6 should use existing validation commands first.

Required baseline:

- `npm.cmd run roadmap:validate`
- `npm.cmd run validate`
- `npm.cmd run validate:all`

In addition, Phase 6 should include a maintainer-facing manual review checklist for:

- release docs consistency
- install and update guidance consistency
- preset alignment with current public command policy
- governance alignment with `AGENTS.md`, `USAGE.md`, and `docs/workflow-surface-map.md`

New automated validation should only be proposed if repeated Phase 6 work exposes a stable contract worth enforcing.

## 14. Risks And Mitigations

### Risk: governance becomes too heavy

Mitigation:

- keep rules short
- focus on high-frequency decisions
- separate hard rules from recommendation guidance

### Risk: release docs drift from actual commands

Mitigation:

- tie every release and upgrade step to commands that already exist
- validate after doc changes

### Risk: presets become unofficial forks of the framework

Mitigation:

- define presets as recommended usage shapes, not alternate frameworks
- keep them anchored to the same public command set

### Risk: maintainers optimize for docs but still need automation next

Mitigation:

- document manual flow first
- use Phase 6 findings to inform any future automation proposal

## 15. Recommended Delivery Order

The workstreams should be delivered in this order:

1. release checklist and upgrade path
2. install, check, and update documentation hardening
3. team usage presets
4. governance rules for future changes

This order matches the maintainer pain hierarchy:

- safe releases first
- safe updates second
- repeatable team guidance third
- long-term framework evolution rules fourth

## 16. Recommended Next Step

Proceed to a Phase 6 implementation plan that breaks the work into four documentation-and-policy tasks aligned to the workstreams above.

That plan should keep the phase manual-first and should not propose new automation unless a planning review proves that a repeated maintainer step is both stable and worth automating.

## 17. Open Section

Additional notes, maintainer heuristics, versioning examples, or governance decision tables may be added here during planning if Phase 6 needs more concrete operational examples.
