# Spec Kit For Developing DevFlow 2.0

This document defines how `github/spec-kit` may be used to improve `DevFlow 2.0` without becoming part of the public product surface.

## Positioning

`DevFlow 2.0` is the only user-facing workflow surface.

`Spec Kit` may be used behind the scenes as an internal drafting and quality aid to improve how we shape discovery, definition, specification, and planning work, but users should still experience one workflow system only: `DevFlow 2.0`.

## Local Installation Rule

- Keep the local Spec Kit checkout under `D:\Projects\nexus-devflow\.local-tools\spec-kit`
- Do not commit the Spec Kit repository into the DevFlow repository
- Do not vendor Spec Kit files into tracked DevFlow paths unless they are intentionally rewritten into DevFlow-native docs, workflows, skills, templates, or scripts
- Treat `.local-tools/` as local-only tooling space
- Treat `.specify/` as ignored scratch space, not part of the DevFlow contract

## Source Of Truth Rule

The source of truth remains:

- `DevFlow 2.0` mainline workflows
- DevFlow companion commands
- DevFlow skills and agents
- DevFlow markdown-first stage contracts under `.workspaces/`

Spec Kit outputs are drafts, prompts, checklists, or analysis aids until their useful ideas are translated into DevFlow-native artifacts.

## What We Borrow

Borrow from Spec Kit when it improves internal thinking quality:

- sharper requirement framing
- better problem, scope, and non-goal separation
- clearer acceptance criteria
- stronger scenario and edge-case coverage
- consistency checks across spec, plan, and tasks
- quality checklists before implementation begins
- structured clarification loops for underspecified work

## What We Do Not Borrow

Do not let Spec Kit replace or compete with DevFlow 2.0 in any of these areas:

- public command surface
- mainline stage model
- running-ID workspace model
- markdown-first handoff contract
- DevFlow naming and terminology
- release, verification, or report ownership
- branding, documentation voice, or product identity

## Command Boundary Rule

Do not expose Spec Kit commands as part of the normal DevFlow user experience.

That means:

- do not document `/speckit.*` as user commands in DevFlow public guides
- do not require end users to learn Spec Kit terminology
- do not route users into Spec Kit as an alternate workflow
- do not add workflow numbers or stages that mimic Spec Kit phases

If a Spec Kit command helps internally, its result must be translated back into a DevFlow artifact or decision.

## Recommended Internal Mapping

Use Spec Kit concepts as backstage helpers only:

| Spec Kit concept | Allowed DevFlow use |
| :--- | :--- |
| `constitution` | Draft or pressure-test DevFlow principles, governance, quality bars, and authoring rules |
| `specify` | Explore candidate inputs for `Discover`, `Define`, and `Spec` |
| `clarify` | Pressure-test ambiguity before locking `10-Define` or `20-Spec` |
| `plan` | Stress-test technical planning before finalizing `30-Plan` |
| `tasks` | Generate candidate execution slices before converting them into DevFlow plans or checklists |
| `analyze` | Check cross-artifact consistency between requirement, plan, and delivery intent |
| `checklist` | Draft review rubrics for quality, completeness, or readiness |
| `implement` | Study execution patterns only; do not let it replace `40-Implement` as the public implementation stage |
| `converge` | Use as an internal gap-finding pass during verification or follow-up planning |

## Authoring Rule

When Spec Kit gives us a useful idea, we should rewrite it into one of these DevFlow-native homes:

- workflow guidance in `.agent/workflows/`
- skill instructions in `.agent/skills/`
- schema or template guidance in `.agent/resources/schemas/`
- human-readable framework docs in `docs/`, `README.md`, `USAGE.md`, or `AGENTS.md`

Do not copy upstream wording or templates wholesale when a DevFlow-native rewrite is clearer.

## Workflow Safety Rule

When using Spec Kit during DevFlow framework development:

1. Start from a DevFlow problem or improvement goal
2. Use Spec Kit locally to sharpen thinking, challenge assumptions, or draft alternatives
3. Pull out only the useful ideas
4. Rewrite them into DevFlow-native language and structure
5. Validate the resulting DevFlow changes with the normal framework validation commands

## Product Identity Rule

DevFlow 2.0 should feel like:

- a stage-based workflow system
- one coherent operating model for human and AI work
- markdown-first and running-ID driven
- explicit about state, evidence, and handoff

It should not feel like:

- a thin wrapper around Spec Kit
- a renamed Spec Kit integration
- a second workflow living on top of DevFlow

## Practical Guardrails

- Do not run `specify init` at the root of the DevFlow repository unless there is an explicit decision to track the generated files
- Prefer using a local scratch area under `.local-tools/` when experimenting with Spec Kit outputs
- If a generated artifact is worth keeping, rewrite it into tracked DevFlow files instead of committing raw Spec Kit scaffolding
- If a Spec Kit idea conflicts with DevFlow's mainline-only numbering, DevFlow wins
- If a Spec Kit idea increases user cognitive load without improving DevFlow clarity, reject it

## Default Decision Test

Use this quick filter:

- If it improves internal thinking while keeping the public DevFlow surface unchanged, adopt it
- If it changes what users must learn, see, or run, reject or rewrite it
- If it competes with stage markdown contracts, reject it
- If it strengthens `Discover -> Define -> Spec -> Plan` without weakening `Implement -> Verify -> Release -> Report`, it is a good candidate
