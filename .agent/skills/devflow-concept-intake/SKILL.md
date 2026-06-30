---
name: devflow-concept-intake
description: Studies external Git repositories, READMEs, prompt frameworks, agent workflows, and engineering-methodology repos before adapting ideas into Nexus-DevFlow. Use when the user asks to research a repo for DevFlow, compare concepts, decide what to adopt or reject, create an adoption proposal, write an option guide for coupled practices, or track upstream sources for adopted concepts.
---

# DevFlow Concept Intake

## Overview

Use this skill to turn external repo ideas into deliberate Nexus-DevFlow decisions. Study the source, critique the principles, discuss trade-offs with the user, then propose adoption only when the concept improves the workflow without unnecessary complexity.

## Core Rule

Do not import ideas just because they are interesting. Every concept must pass through critique, DevFlow fit analysis, and user discussion before it becomes a workflow, agent, skill, artifact, or option guide.

## Core Process

### 1. Source Intake

Identify the source before judging it:

- Record repo URL, README path, docs path, branch, commit, tag, or release when available.
- Prefer primary source files: `README`, docs, examples, workflow definitions, prompts, CLI scripts, schemas, and changelog.
- If the user gives only a summary, mark source confidence as `low` and ask for the repo/README before making durable recommendations.
- Separate stated principles from inferred principles.

For current or remote source facts, browse or fetch the source when tools allow it. Do not rely on memory for live repo state.

### 2. Discussion-First Report

Produce a direct critique before proposing implementation. Use `references/concept-report-template.md` when a written artifact is requested or the analysis is substantial.

Classify each concept:

| Decision | Meaning |
| :--- | :--- |
| `Adopt` | Fits DevFlow as-is and adds clear value. |
| `Adapt` | Useful idea, but must be reshaped for DevFlow. |
| `Reject` | Does not fit, adds avoidable risk, or conflicts with DevFlow goals. |
| `Defer` | Potentially useful, but needs evidence, a real use case, or upstream maturity. |

Be explicit about what not to take. A rejected idea is useful output, not a failure.

### 3. Adoption Proposal

Only create an adoption proposal after the user agrees the concept is worth exploring. Use `references/adoption-proposal-template.md`.

Map the concept to the smallest fitting DevFlow surface:

| Target | Use When |
| :--- | :--- |
| Workflow | The idea changes phase order, gates, or user-visible commands. |
| Agent | The idea needs a specialist persona with a bounded responsibility. |
| Skill | The idea is reusable guidance or a discipline layer inside existing workflows. |
| Artifact | The idea needs persistent JSON or Markdown state. |
| Option guide | The idea is useful only as an optional bundle of practices. |
| Wiki/docs | The idea is knowledge, not behavior. |

Prefer skill-backed or option-guide adoption before adding new slash workflows. Keep the canonical `/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release` path stable unless the concept improves a core invariant.

### 4. Coupled Concepts And Option Packs

When principles must be used together, do not scatter them across unrelated flows. Write them as an option pack:

- Name the pack with the `devflow-*` prefix.
- State which concepts are mandatory together and which are optional.
- Define when to activate the pack.
- Define what workflows, agents, skills, artifacts, and validation gates are affected.
- Include an explicit "Do not use this option when..." section.

Examples:

- `devflow-upstream-sync-pack`: use only when adopting concepts that need regular upstream review.
- `devflow-agent-discipline-pack`: use when multiple agent behavior rules must work together.
- `devflow-research-to-adoption-pack`: use when repo study, proposal, and tracking must be chained.

### 5. Upstream Tracking

Track upstream only for concepts the user chooses to adopt or actively evaluate. Use `references/upstream-tracking-template.md`.

Record:

- Source repo and exact revision.
- Adopted concepts and local DevFlow mapping.
- Local files or workflows affected.
- Update strategy: manual review, scheduled review, diff-based review, or no tracking.
- Compatibility risk if upstream changes.
- Credit and license notes when applicable.

Do not promise automatic syncing unless the repository has a clear, testable transformation path. Prefer reviewable update notes over blind merges.

## Fit Criteria

Favor concepts that:

- Reduce ambiguity in agent work.
- Improve traceability, validation, or recovery.
- Strengthen user-controlled phase gates.
- Fit the markdown-first stage artifact contract.
- Can be explained as a small rule, skill, option, or workflow addition.
- Preserve source credit and make upstream drift visible.

Reject or defer concepts that:

- Add autonomous execution that skips human approval gates.
- Require copying large frameworks wholesale.
- Make core workflows harder to understand.
- Depend on brittle prompt magic with no observable artifact.
- Duplicate an existing DevFlow skill, agent, or workflow.
- Create tracking burden without clear recurring value.

## Output Expectations

For lightweight discussion, answer in Thai or the user's language with:

- Source studied.
- Main principles found.
- `Adopt / Adapt / Reject / Defer` table.
- Direct critique.
- Recommended next DevFlow action.

For substantial work, produce one or more Markdown artifacts under an appropriate workspace path such as:

```text
.workspaces/research/devflow-concepts/{source-slug}/concept-report.md
.workspaces/research/devflow-concepts/{source-slug}/adoption-proposal.md
.workspaces/research/devflow-concepts/{source-slug}/upstream-tracking.md
```

Ask before writing files unless the user explicitly requested artifacts.

## Red Flags

- Summarizing the repo without giving a recommendation.
- Treating upstream popularity as proof of DevFlow fit.
- Proposing a new workflow when a skill or option guide is enough.
- Omitting the "do not adopt" list.
- Tracking every studied repo instead of only adopted or actively evaluated concepts.
- Mixing source truth, interpretation, and local proposal in one undifferentiated document.

## Verification

Before finishing:

- Confirm the source and revision confidence.
- Confirm every major concept has `Adopt`, `Adapt`, `Reject`, or `Defer`.
- Confirm rejected concepts and reasons are included.
- Confirm any adoption proposal maps to a specific DevFlow surface.
- Confirm coupled concepts are represented as an option pack.
- Confirm upstream tracking exists only when adoption or active evaluation is chosen.
