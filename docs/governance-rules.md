# Governance Rules

Use these rules when changing the Nexus-DevFlow framework itself. Keep them practical. If a change does not need a new public surface, do not create one.

## Public Surface Rule

- The public workflow surface is the numbered mainline plus the declared public companion commands only.
- Do not introduce a new public command, alternate workflow track, or renamed companion unless the framework truly needs a new user-facing surface.
- Internal helpers may exist, but they should stay internal until the framework explicitly promotes them.

Example:

- `Debug` can support `/40-Implement` or `/50-Verify`, but it does not replace the mainline.

## Placement Rules

- Add a workflow when the behavior owns a public lifecycle state, required stage artifact, or next-step contract.
- Add a skill when the behavior is a reusable method that can support many workflows or agents without owning stage state.
- Add a script when the change reduces repetition, performs setup, or supports validation without changing the public workflow model.
- Add validation when the rule is stable, repeated, and important enough that drift should fail fast.

Examples:

- New stage contract or stage transition rule: workflow
- Reusable review discipline or routing method: skill
- Repeatable scan, sync, render, or install helper: script
- Enforcing naming, contract, or surface rules across the repo: validation

## Documentation Placement Rule

- Update `README.md` and `USAGE.md` only when maintainers or users need the change to be discoverable from a high-surface entry point.
- Put maintainer-operating detail in focused docs under `docs/` instead of expanding public onboarding pages.
- Keep `AGENTS.md` aligned with workflow, agent, and skill boundaries, but avoid turning it into a full maintainer manual.

## Decision Bias

- Prefer the smallest surface that preserves clarity.
- Prefer updating an existing doc, skill, script, or validation rule before creating a new one.
- If two placements seem possible, choose the one that keeps public behavior stable.
