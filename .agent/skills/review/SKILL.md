---
name: review
description: Two-axis review for changed work. Use inside /50-Verify or /70-Release when a branch, PR, or work-in-progress diff needs standards and spec review.
---

# Review

Use this support skill as one verification lane. `/50-Verify` owns validation evidence; this skill reviews a diff from two separate angles.

## Axes

- **Standards**: does the change follow documented repo conventions?
- **Spec**: does the change implement the originating issue, PRD, spec, or stage artifact?

Keep the axes separate so one does not hide the other.

## Process

1. Pin the fixed point.
   - Use the user-supplied commit, branch, tag, or merge-base.
   - If none is supplied, default to the active branch merge-base with `main` when available.
   - Confirm the diff is non-empty.

2. Identify the spec source.
   - Prefer `.workspaces/specs/{ID}-*/20-spec.md`, `30-plan.md`, issue brief, PRD, or explicit user path.
   - If no spec exists, mark the Spec axis as skipped.

3. Identify standards sources.
   - Look for repo docs such as `AGENTS.md`, `CONTRIBUTING.md`, coding standards, workflow docs, or stage contracts.

4. Review standards.
   - Cite the violated standard.
   - Distinguish hard violations from judgment calls.
   - Skip issues that tooling already enforces unless tooling is missing.

5. Review spec.
   - Report missing or partial requirements.
   - Report scope creep.
   - Report implemented behavior that appears wrong against the spec.

6. Aggregate findings.
   - Present `Standards` and `Spec` separately.
   - Lead with concrete findings and file references.
   - Record residual risk and skipped axes.

## Output

Return:

- fixed point and diff scope
- standards sources
- spec source or skipped reason
- findings by axis
- worst issue per axis
- recommended DevFlow route
