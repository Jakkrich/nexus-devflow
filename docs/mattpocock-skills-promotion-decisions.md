# Matt Pocock Skills Promotion Decisions

This document defines how imported support skills may be promoted, retained, or removed after pilot runs.

## Promotion Gates

A support skill may become a public companion command only when all are true:

- users ask for it directly and repeatedly
- the existing public companion surface cannot express it cleanly
- the skill owns support work, not lifecycle state
- the output contract is stable
- validation can prevent public-surface drift

## Default Decisions

| Skill | Current status | Decision |
| :--- | :--- | :--- |
| `grill-with-docs` | support skill | Keep as support behind Define, Spec, and Plan. |
| `domain-modeling` | support skill | Keep as support behind Define, Spec, Plan, and Wiki. |
| `codebase-design` | support skill | Keep as support behind Spec, Plan, Implement, and Verify. |
| `diagnosing-bugs` | support skill | Keep behind `Debug`, Implement, and Verify. |
| `tdd` | support skill | Keep behind Plan, Implement, and Verify. |
| `review` | support skill | Keep behind Verify and Release. Do not replace `PR-Review`. |
| `handoff` | support skill | Keep behind Report, Release, Agent, and cross-session continuation. |
| `writing-great-skills` | maintainer support skill | Keep user-invoked for framework maintainers. |
| `to-prd` | support skill | Keep behind `PRD`. |
| `to-issues` | support skill | Keep behind `/30-Plan` and `Issue-Triage`. |
| `prototype` | support skill | Re-evaluate after pilots; candidate public companion only if runnable exploration becomes frequent. |
| `triage` | support skill | Keep behind `Issue-Triage`. |

## Do Not Promote

- deprecated upstream skills
- personal knowledge-management skills
- stack-specific migration skills
- skills that duplicate an existing public companion command
- skills that require an external issue tracker as their primary contract

## Evidence To Collect

For each pilot or real run:

- Did the agent choose the right skill without overloading context?
- Did the skill output land in the correct stage artifact?
- Did any skill try to own stage movement?
- Was the user-facing command surface still understandable?
- Did validation catch drift early enough?

## Review Cadence

Review promotion decisions after at least three successful real runs for the same skill family.
