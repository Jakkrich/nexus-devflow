---
id: "roadmap-nexus-devflow"
title: "Roadmap: Nexus-DevFlow"
doc_type: "roadmap"
status: "active"
created: "2026-06-18"
updated: "2026-06-18"
owner: "Framework Maintainers"
source_of_truth: "ROADMAP.md"
supporting_artifacts:
  - ".workspaces/roadmap/roadmap-discovery.md"
---

# Roadmap: Nexus-DevFlow

## Summary

Nexus-DevFlow is moving from a JSON/dashboard-driven workflow model to a DevFlow 2.0 markdown-first model with a clear mainline, lighter companion surfaces, and more behavior pushed into skills or agents where appropriate.

## Strategic Direction

- Use numbered workflows only for the mainline from `/00-Discover` through `/70-Report`.
- Keep companion commands unnumbered and easy to route from the active stage.
- Use markdown contracts as the primary source of truth instead of task or roadmap JSON.
- Reduce legacy aliases, mixed 1.x and 2.0 wording, and outdated support surfaces across the repo.

## Phases

| Phase | Status | Goal |
| :--- | :--- | :--- |
| Phase 1 | complete | Establish DevFlow 2.0 mainline workflows, stage templates, and remove old runtime dependencies from the primary path. |
| Phase 2 | complete | Finish reference cleanup, routing cleanup, docs consistency, and first-pass companion-to-skill migration across active surfaces. |
| Phase 3 | in progress | Push the repo further toward 2.0-only by cleaning archive/history docs, usage leftovers, and broader knowledge surfaces. |

## Phase Status Notes

- **Phase 2 closed on 2026-06-18** after active docs, routing references, and validation surfaces were re-synced to the DevFlow 2.0 command model.
- **Phase 3 is now active** and focuses on historical cleanup only, including archive reports, research notes, and compatibility-era wording that is no longer part of the live operating surface.

## Current Focus

| Priority | Focus Item | Rationale | Source |
| :--- | :--- | :--- | :--- |
| High | Historical report and archive cleanup | Old wording should remain only where history is intentional and clearly labeled. | `.workspaces/reports`, `.workspaces/roadmap`, `.workspaces/research` |
| High | Usage and knowledge-surface consistency | Remaining user-facing references should continue to match the current command surface. | `README.md`, `USAGE.md`, `docs/` |
| Medium | Compatibility wording reduction | Retire or relabel remaining wording that implies legacy numbered companions are still active choices. | historical docs, deprecation matrix |
| Medium | Roadmap and knowledge maintenance | Keep roadmap and supporting notes aligned with actual migration progress. | `ROADMAP.md`, supporting artifacts |
| Low | Optional deeper archive pruning | Remove or condense low-value historical material if it no longer helps maintainers. | archive/history surfaces |

## Risks And Dependencies

- **Risks**: Over-cleaning historical material could erase useful migration context; under-labeling it could confuse users about the live surface.
- **Dependencies**: validator coverage, workflow docs, schema templates, and aligned workflow/skill/agent references across the repo.
- **Validation Needed**: `npm.cmd run roadmap:validate`, `npm.cmd run validate`, `npm.cmd run validate:all`

## Machine-Readable Sources

- `.workspaces/roadmap/roadmap-discovery.md`
- `.workspaces/project_index.json` only when repository structure context is needed during migration

## Validation

- `npm.cmd run roadmap:validate`
- `npm.cmd run validate`
- `npm.cmd run validate:all`
