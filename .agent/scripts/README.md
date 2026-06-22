# DevFlow 2.0 Scripts

This folder should describe only the scripts that still matter to the active DevFlow 2.0 engine.

## Current intent

- DevFlow 2.0 is `markdown-first`.
- Numbered workflows should depend on stage markdown contracts, not legacy task JSON runtime.
- `/70-Report` HTML generation and checklist validation are current must-have capabilities.
- Migration tooling can remain temporarily, but should not define the core architecture.

## Script Classification

| Script | Entry | Status | Why it stays or goes |
| :--- | :--- | :--- | :--- |
| Agent activation | `activate` -> `scripts/activate-agent.mjs` | Keep | Core bootstrap for installing or refreshing the local `.agent` bundle. |
| Goal routing | `goal` -> `.agent/scripts/goal-runner.mjs` | Keep | Public companion entry that routes broad goals into the mainline. |
| Framework validation | `validate` -> `scripts/validate-framework.mjs` | Keep | Main contract validator for stage artifacts, checklist consistency, and report requirements. |
| Full validation | `validate:all` -> `scripts/validate-all.mjs` | Keep | Aggregates framework validation, docs contract scan, and security hygiene scan. |
| Docs contract scan | `validate:docs` -> `scripts/scan-doc-contract.mjs` | Keep | Guards workflow and docs consistency and catches drift in public guidance. |
| Security hygiene scan | `security:scan` -> `scripts/scan-security-hygiene.mjs` | Keep | Repo-wide safety gate even though it is not itself a workflow feature. |
| Agent sync check | `sync:check` -> `scripts/sync-agent-bundle.mjs` | Keep | Confirms the checked-in `.agent` bundle stays in sync with framework sources. |
| Report HTML generator | `report:html` -> `scripts/generate-report-html.mjs` | Keep | Must-have for `/70-Report` so every workspace can emit the same HTML format from markdown plus checklists. |
| Report generator test | `report:html:test` -> `scripts/test-generate-report-html.mjs` | Keep | Regression protection for future template changes. |
| Checklist validation test | `validate:checklists:test` -> `scripts/test-validate-checklists.mjs` | Keep | Regression protection for checklist parsing and consistency rules. |
| Project index generator | `index` -> `scripts/generate-project-index.mjs` | Keep for now | Useful support tooling, but not part of the strict numbered mainline contract. |
| Project linker | `link-project` -> `scripts/link-project.mjs` | Keep for now | Supports local project onboarding and framework attachment. |
| Global Codex install | `codex:install-global` -> `scripts/install-codex-global.mjs` | Keep for now | Needed while Nexus-DevFlow is distributed as a global Codex workflow layer. |
| Global check/update | `codex:check-global`, `codex:update-global`, `codex:update-global:pull` -> `scripts/update-codex-global.mjs` | Keep for now | Operational tooling for managed global install/update flow. |
| Artifact migration | `migrate:artifacts` -> `scripts/migrate-stage-artifacts.mjs` | Transitional | Needed only while older workspaces are being migrated into the markdown-first 2.0 layout. |

## 2.0 Removal Bias

| Decision rule | Action |
| :--- | :--- |
| Required to create, validate, or publish a numbered stage artifact | Keep |
| Required to support the two must-haves: `/70-Report` HTML output and checklist validation and consistency checks | Keep |
| Useful for onboarding or global install, but not part of the stage contract itself | Keep for now and revisit after the distribution model is stable |
| Exists mainly to migrate old structures | Treat as transitional and plan removal in a later cleanup pass |

## Notes

- Legacy task JSON runtime is no longer part of the active engine.
- Legacy dashboard runtime is no longer part of the active engine.
- New work should align with markdown contracts under `.agent/resources/schemas/`.
