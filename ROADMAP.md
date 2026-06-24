---
id: "roadmap-nexus-devflow"
title: "Roadmap: Nexus-DevFlow"
doc_type: "roadmap"
status: "active"
created: "2026-06-18"
updated: "2026-06-24"
owner: "Framework Maintainers"
source_of_truth: "ROADMAP.md"
supporting_artifacts:
  - ".workspaces/roadmap/roadmap-discovery.md"
phase_count: 6
focus_count: 6
---

# Roadmap: Nexus-DevFlow

## Summary

- **Vision**: Make Nexus-DevFlow the clearest markdown-first operating model for human and AI software delivery, from rough goal through verified report.
- **Target Users**: AI-assisted developers, framework maintainers, and teams that want explicit stage state, reusable artifacts, and verifiable handoffs.
- **Strategic Constraints**: Preserve DevFlow 2.0 as the only public workflow surface, keep running-ID and markdown-first contracts intact, and use Spec Kit only as an internal planning aid rather than a user-facing layer.

## Strategic Direction

- **Completed Capabilities**: DevFlow 2.0 mainline workflows are established, companion command boundaries are documented, markdown-first stage contracts are active, report HTML rendering exists, and framework validation is passing across core checks.
- **Active Work**: The framework is finishing compatibility cleanup while shifting attention toward easier adoption, better operational flow, and stronger release confidence.
- **Known Gaps**: Roadmap discovery is still migration-heavy, some docs need hardening or cleanup, automation helpers around stage progression are still thin, and the framework needs better real-world onboarding and ecosystem readiness signals.

- Use DevFlow 2.0 as the only public workflow surface while treating Spec Kit as a private planning aid.
- Finish compatibility cleanup without letting cleanup dominate the next era of the roadmap.
- Invest next in adoption, workflow automation, and ecosystem maturity so the framework is easier to start, easier to operate, and easier to release.

## Phases

| Phase | Theme | Outcome | Evidence |
| --- | --- | --- | --- |
| Phase 1 | DevFlow 2.0 foundation | Mainline workflow model, stage templates, and markdown-first contracts replaced the old primary path. | Mainline workflow set exists under `.agent/workflows/`; framework validation passes. |
| Phase 2 | Surface cleanup and routing alignment | Public companion commands, workflow boundaries, and first-pass migration surfaces were aligned to DevFlow 2.0. | `README.md`, `USAGE.md`, `AGENTS.md`, and workflow routing docs were re-synced. |
| Phase 3 | Historical cleanup and compatibility reduction | Remaining archive-era wording is reduced or clearly labeled so the live surface stays unambiguous. | Validation reports no live legacy workspace or IDE-switcher references. |
| Phase 4 | Adoption and developer experience | New users can start a real run quickly with clear quickstart paths, example workspaces, and lower setup friction. | Faster first-run success, stronger onboarding docs, and reusable example artifacts. |
| Phase 5 | Workflow automation and operational flow | Repetitive stage work is scaffolded with safe helpers so teams spend less time on manual artifact setup and routine transitions. | Helper scripts or commands for run creation, checklist seeding, and stage/report scaffolding. |
| Phase 6 | Ecosystem, release, and team readiness | The framework becomes easier to maintain, release, validate across environments, and adapt for different team contexts without surface drift. | Stronger global install confidence, cleaner release playbooks, and documented usage profiles or presets. |

## Current Focus

| Priority | Focus Item | Rationale | Source |
| --- | --- | --- | --- |
| High | Rewrite roadmap and discovery around the next era | Planning artifacts should reflect the framework's post-migration direction, not only legacy cleanup. | `ROADMAP.md`, `.workspaces/roadmap/roadmap-discovery.md` |
| High | Quickstart and onboarding path hardening | DevFlow should be easy to adopt without requiring maintainers to explain the model every time. | `README.md`, `USAGE.md`, `docs/quickstart.md` |
| High | Example run and workspace patterns | Users need concrete examples for feature work, bugfixes, and verification-heavy flows. | `.workspaces/specs/`, `docs/workspace-artifacts.md` |
| Medium | Automation helpers for stage operations | Common tasks such as run creation, checklist seeding, and report scaffolding should be safer and faster. | `scripts/`, `.agent/resources/schemas/`, workflow surfaces |
| Medium | Documentation quality and encoding cleanup | User-facing docs should be readable, consistent, and free of avoidable corruption or wrapper drift. | `docs/`, especially `docs/workflow-surface-map.md` |
| Medium | Global install and release confidence | The framework should be easier to update, validate, and trust across local environments and future releases. | `scripts/update-codex-global.mjs`, `SETUP.md`, `SETUP-BY-AI.md` |

## Risks And Dependencies

- **Risks**: Over-automating the framework could hide the stage model instead of clarifying it; under-investing in examples could keep adoption dependent on maintainer guidance; documentation drift could reintroduce mixed signals between public commands, internal companions, and skills.
- **Dependencies**: Stable validator coverage, aligned workflow and schema contracts, reliable global install/update paths, and maintained examples that reflect the real DevFlow surface.
- **Validation Needed**: `npm.cmd run roadmap:validate`, `npm.cmd run validate`, `npm.cmd run validate:all`, and targeted checks for onboarding, helper scripts, and release/update flows as they are added.

## Machine-Readable Sources

- `.workspaces/roadmap/roadmap-discovery.md`
- `.workspaces/project_index.json` when repository structure context is needed for framework-facing roadmap work

## Sources

- `.workspaces/roadmap/roadmap-discovery.md`
- `README.md`
- `USAGE.md`
- `AGENTS.md`
- `docs/workspace-artifacts.md`
- `docs/spec-kit-devflow-rules.md`

## Validation

- `npm.cmd run roadmap:validate`
- `npm.cmd run validate`
- `npm.cmd run validate:all`
