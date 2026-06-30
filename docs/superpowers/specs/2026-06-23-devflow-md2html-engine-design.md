# DevFlow Markdown-to-HTML Engine Design

Date: 2026-06-23
Status: proposed
Owner: Codex

## 1. Summary

DevFlow 2.0 should adopt `haidang1810/md2html` as an internal rendering engine, but expose it through a DevFlow-native API and CLI rather than as a user-facing alternate workflow.

The first production consumer will be `60-report`, which will keep its current markdown-first contract:

- `60-report.md` remains the source of truth
- `60-report.html` remains a derived artifact

The new renderer must be reusable by future stages without forcing HTML generation across the entire mainline.

## 2. Problem

Current `60-report.html` generation is implemented as a report-specific script with embedded markdown-to-html behavior. That works for one stage, but it does not give DevFlow a reusable rendering layer for future stage outputs such as `20-spec.html` or `30-plan.html`.

We want:

- one internal markdown-to-html engine for DevFlow
- one DevFlow-native API and CLI surface
- stage-specific HTML policies rather than an all-stage HTML requirement
- a migration path that does not break `60-report`

## 3. Goals

- Introduce a reusable DevFlow-native markdown-to-html renderer
- Integrate `md2html` as an internal engine or preset provider
- Preserve DevFlow 2.0 as the only public workflow surface
- Keep markdown as the source of truth for all stages
- Keep HTML as a derived artifact controlled by per-stage policy
- Migrate `60-report` to the shared renderer without changing user-facing workflow behavior

## 4. Non-Goals

- Do not make HTML mandatory for every stage
- Do not expose Spec Kit or `md2html` as a new public workflow surface
- Do not redesign DevFlow numbering, stage semantics, or running-ID rules
- Do not auto-enable HTML generation for `20-spec`, `30-plan`, or other stages in the first implementation round
- Do not attempt a full theme system for every stage in the first implementation round

## 5. Design Principles

- Markdown-first: every mainline stage keeps `.md` as the contract artifact
- Stage-specific policy: `.html` exists only where the stage policy says it should
- DevFlow-native boundary: workflows and users call DevFlow APIs and commands, not upstream library commands
- Reuse before duplication: generic rendering logic lives in shared modules, not inside stage-specific scripts
- Backward compatibility: `report:html` continues to work for existing flows

## 6. Output Policy

### Required across all stages

- A markdown artifact remains required for every stage that already has a markdown contract

### Optional by stage policy

- HTML is a derived artifact
- A stage may support HTML rendering without requiring it
- A stage may require HTML if the DevFlow contract explicitly says so

### First-round policy

- `60-report` requires `60-report.html`
- Other stages remain markdown-only by default
- The shared renderer is still designed so future stages can opt in

## 7. Proposed Architecture

The renderer stack is split into four layers.

### 7.1 Render Core

Shared renderer responsible for:

- accepting markdown, metadata, preset configuration, and output options
- calling the internal `md2html` integration
- returning final HTML plus warnings or render metadata

This layer owns generic rendering behavior only.

### 7.2 Preset Registry

Shared registry responsible for named DevFlow presets such as:

- `report`
- `spec`
- `plan`
- `default-doc`

Presets define structural and presentation defaults, not workflow behavior.

### 7.3 Stage Adapters

Stage-specific adapters convert DevFlow artifacts into renderer input.

For `60-report`, the adapter will:

- read `60-report.md`
- parse frontmatter
- gather checklist data
- map report sections into the renderer model
- select the `report` preset
- choose the default output path `60-report.html`

Stage adapters own stage mapping logic. They do not own the shared rendering engine.

### 7.4 CLI Facade

Provide a DevFlow-native CLI layer that hides upstream details.

Examples:

- `npm run render:html -- <file-or-workspace>`
- `npm run report:html -- <workspace-path-or-running-id>`

`report:html` remains as a compatibility wrapper for the `60-report` path.

## 8. API Contract

### Core API

Proposed entry point:

```js
renderMarkdownDocument({
  sourcePath,
  markdown,
  preset,
  outputPath,
  metadata,
  assetsMode,
  stagePolicy
})
```

Expected result:

```js
{
  html,
  outputPath,
  presetUsed,
  warnings
}
```

### Stage API

Proposed stage-aware entry point:

```js
renderStageArtifactToHtml({
  stage,
  workspaceDir,
  sourceFile,
  preset
})
```

This API delegates stage interpretation to the appropriate adapter.

## 9. CLI Contract

### New shared command

Add a shared renderer command:

```text
npm run render:html -- <file-or-workspace>
```

Suggested options:

- `--stage <stage-name>`
- `--preset <preset-name>`
- `--out <path>`
- `--check`

### Compatibility command

Keep:

```text
npm run report:html -- <workspace-path-or-running-id>
```

Implementation detail:

- this command becomes a thin compatibility wrapper
- internally it resolves the `60-report` adapter and calls the shared renderer

## 10. Preset Strategy

### Active preset in round one

- `report`

This preset supports stakeholder-oriented report presentation, summary sections, checklist snapshots, decision blocks, and output lists.

### Preset skeletons created in round one

- `spec`
- `plan`
- `default-doc`

These may initially be minimal presets, but the registry shape should support them from the start so the architecture does not need to change later.

## 11. 60-Report Migration Path

### Current state

`scripts/generate-report-html.mjs` contains both:

- generic markdown rendering behavior
- report-specific data mapping and template replacement

### Target state

Move to:

- shared renderer modules for generic markdown-to-html behavior
- a `60-report` stage adapter for report-specific mapping
- a shared CLI command for generic rendering
- the existing `report:html` command as a wrapper

### Migration steps

1. Extract reusable rendering logic from the current report script into shared renderer modules
2. Introduce preset registration with `report` as the first real preset
3. Create a `60-report` adapter that prepares view-model data from report markdown and checklist artifacts
4. Update `scripts/generate-report-html.mjs` to delegate to the shared renderer path
5. Preserve output compatibility for `60-report.html`
6. Update validation and documentation only where needed to reflect the new internal architecture

## 12. Testing Strategy

Use three testing layers.

### 12.1 Unit Tests

Focus on renderer core:

- markdown rendering
- preset resolution
- metadata handling
- fallback behavior
- warning paths

### 12.2 Adapter Tests

Focus on `60-report` mapping:

- frontmatter extraction
- section extraction
- checklist summaries
- blocked and skipped rows
- input and output link mapping

### 12.3 End-to-End CLI Tests

Focus on command-level behavior:

- `npm run report:html -- <workspace>` still succeeds
- the generated file is written to `60-report.html`
- expected title and section content appear in output
- compatibility wrapper and shared renderer produce the same expected structure

## 13. Documentation Updates

Update docs to clarify:

- markdown remains the source of truth
- HTML is a derived artifact controlled by stage policy
- `60-report` remains the only required HTML stage in round one
- the renderer is an internal DevFlow capability, not a new workflow surface

Likely touch points:

- `docs/workspace-artifacts.md`
- `docs/report-html-placeholder-mapping.md`
- `README.md`
- any script usage notes that mention report HTML generation

## 14. Round-One Scope

### Included

- shared DevFlow-native renderer core
- internal `md2html` integration
- preset registry
- working `report` preset
- preset skeletons for `spec`, `plan`, and `default-doc`
- `60-report` stage adapter
- compatibility-preserving migration of `report:html`
- tests across unit, adapter, and CLI layers
- documentation updates for policy and usage

### Excluded

- mandatory HTML generation for all stages
- automatic HTML generation for `20-spec`, `30-plan`, or other stages
- public DevFlow commands that expose upstream branding
- broad redesign of report visuals unrelated to the renderer migration
- framework-wide rollout of stage-specific themes beyond the `report` preset

## 15. Risks And Mitigations

### Risk: compatibility drift in `60-report.html`

Mitigation:

- keep compatibility tests for existing output expectations
- migrate behind the current `report:html` command first

### Risk: stage adapters become thin copies of old scripts

Mitigation:

- move generic rendering and formatting logic into shared modules early
- keep adapters focused on data mapping only

### Risk: future presets force architectural rework

Mitigation:

- define registry and preset shape in round one even if only `report` is fully implemented

## 16. Recommended Next Step

Proceed to an implementation plan that breaks the work into:

- renderer core and preset registry
- `60-report` adapter migration
- CLI compatibility layer
- test migration and expansion
- docs update and validation pass

## 17. Open Section

Additional implementation notes, examples, or follow-up design details may be added here if the renderer contract evolves during planning.
