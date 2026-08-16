---
name: writing-great-skills
description: Maintainer reference for writing predictable DevFlow skills. Use when creating, importing, pruning, or refactoring .agent/skills content.
disable-model-invocation: true
---

# Writing Great Skills

Use this maintainer support skill when editing `.agent/skills`.

A skill exists to make a process predictable. It should make the agent take the same kind of action in the same kind of situation, without bloating context or competing with workflow ownership.

## Invocation

Choose the lowest-load invocation mode:

- Model-invoked skill: use when the agent must discover and apply the skill on its own.
- User-invoked skill: use when only humans or another explicit router should call it.
- Router skill: use when many user-invoked skills create cognitive load.

In DevFlow, public workflow surface should stay stable. New skills usually start as support skills, not public companion commands.

## Description Rules

- Front-load the leading word.
- Include only distinct trigger branches.
- Remove synonyms that repeat the same trigger.
- Keep stage ownership out of the description; put lifecycle placement in the body.

## Information Hierarchy

Put material where it belongs:

1. In-skill steps: actions every invocation needs.
2. In-skill reference: rules frequently needed during execution.
3. External reference files: details only some branches need.

Use progressive disclosure for long reference material.

## Splitting Rules

Split a skill only when:

- it needs independent model invocation
- a long step sequence causes premature completion
- branches are different enough that one file causes confusion

Do not split only because a file is aesthetically long.

## Pruning Rules

- Keep one source of truth for each rule.
- Delete no-op advice that does not change behavior.
- Delete stale upstream assumptions when importing.
- Prefer DevFlow stage names and artifact paths.

## Import Checklist

- [ ] Fits `docs/skill-selection-policy.md`.
- [ ] Does not create a new mainline stage.
- [ ] Does not expand public companion commands by accident.
- [ ] Names owning DevFlow stages.
- [ ] Describes output location.
- [ ] Routes contradictions back to the owning stage.
- [ ] Passes `npm run validate`.
