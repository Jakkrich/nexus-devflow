# Nexus-DevFlow Roadmap

Strategic direction and planned evolution for Nexus-DevFlow.

## Strategic Direction

Nexus-DevFlow is a local-first, stage-based workflow layer for building production software with AI coding assistants. It keeps product intent, active delivery state, verification evidence, and shipped history in durable Markdown/JSON contracts that can move between agents and IDEs.

## Phases

| Phase | Description | Target Status |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | Overlay installer, 5-adapter bundle, task-isolated living specs, quality gates, and 15 Core Skills. | **Completed** |
| **Phase 2: Ecosystem Reliability** | Multi-chat isolation (`130`), overview integrity gate (`119`), cross-platform installer/update matrix, and bilingual routing evals. | **Completed / Hardened** |
| **Phase 3: Integration** | DevFlow v3 Lead-Coordinator & `pstack` rework (`131a`–`131d`), evidence-first verification, and optional sidecar/continuation pilots (`122`, `123`). | **Delivered (v3 Core)** |
| **Phase 4: Adoption** | Production release readiness (`125` for `3.0.0`), golden-path examples (`124`), and governed npm release. | **Active Focus (`3.0.0` Ready)** |

## Current Focus

1. Finalize and verify **Feature 125 (`Production Release Readiness`)** gates (`npm run check:release`, retired-command scans, engine alignment, and tarball hygiene) for **`3.0.0`**.
2. Complete maintainer-approved Git integration and governed npm publishing checklist.
3. Expand golden-path greenfield/brownfield examples (`124`) and cross-IDE handoff pilots (`122`, `123`) based on usage feedback.

## Sequencing Guardrail

IDE sidecar pilots start only on top of the locked v3 CLI/MCP JSON and `3.0.0` planning integrity contracts. No `git push`, `git tag`, or `npm publish` executes without explicit maintainer approval.

## Explicitly Deferred

- Hosted SaaS, accounts, billing, and cloud sync
- Broad multi-editor UI extensions before a single read-only CLI/MCP sidecar pilot is proven
- New Core Skills without measured routing or capability gaps
- Automated publishing, pushing, or deployment without explicit maintainer approval
