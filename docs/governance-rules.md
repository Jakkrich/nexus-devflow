# Governance Rules

Use these rules when changing the Nexus-DevFlow framework itself. Keep them practical. If a change does not need a new public surface, do not create one.

---

## 1. Public Surface Rule

- The public workflow surface consists of the **4-stage Living Spec lifecycle** (`/feature`, `/implement`, `/check`, `/complete`) plus the declared **companion skills** (e.g. `/idea`, `/grill`, `/discovery`, `/devflow`, `/doctor`, `/audit`, `/rollback`).
- Do not introduce a new public command, alternate workflow track, or renamed companion unless the framework truly needs a new user-facing surface.
- Internal helpers may exist, but they should stay internal until the framework explicitly promotes them.

Example:
- `/debug` supports root-cause analysis before `/fix` or `/implement`, but it does not replace the delivery lifecycle.

---

## 2. Placement Rules

- **Workflow Stage**: Add or modify a lifecycle stage when the behavior owns a public lifecycle state, required stage artifact, or next-step contract in `current-feature.md`.
- **Skill**: Add a skill under `.agents/skills/` and `.claude/skills/` when the behavior is a reusable method that can support multiple workflows or AI agents.
- **Script**: Add a script under `scripts/` when the change reduces repetition, performs workspace setup, or supports validation without changing the public workflow model.
- **Validation**: Add validation to `scripts/validate-framework.ts` when the rule is stable, repeated, and important enough that drift should fail fast in CI.

---

## 3. Documentation Placement Rule

- Update `README.md`, `README.th.md`, and `USAGE.md` only when maintainers or users need the change to be discoverable from a high-surface entry point.
- Put maintainer-operating detail in focused docs under `docs/` instead of expanding public onboarding pages.
- Keep `AGENTS.md` aligned with workflow, agent, and skill boundaries, but avoid turning it into a full maintainer manual.

---

## 4. Decision Bias

- Prefer the smallest surface that preserves clarity.
- Prefer updating an existing doc, skill, script, or validation rule before creating a new one.
- If two placements seem possible, choose the one that keeps public behavior stable across all supported AI IDEs.
