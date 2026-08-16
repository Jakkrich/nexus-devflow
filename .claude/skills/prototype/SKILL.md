---
name: prototype
description: Build a throwaway prototype to answer a design question during Discover, Define, Spec, Research, or Plan.
disable-model-invocation: true
---

# Prototype

A prototype is throwaway code that answers one question.

Use this support skill behind `Research`, `Brainstorm`, `/00-Discover`, `/10-Define`, `/20-Spec`, or `/30-Plan` when conversation alone cannot settle the uncertainty.

## Branches

Choose one:

- **Logic prototype**: use when the question is about state, business rules, parsing, scheduling, or algorithm behavior.
- **UI prototype**: use when the question is about interaction, visual hierarchy, layout, or user flow.

If the branch is ambiguous, state the assumption and choose the one closest to the surrounding code.

## Rules

- Mark it as throwaway.
- Keep it close to the relevant module or task workspace.
- Provide one command to run it.
- Avoid persistence unless the question is specifically about persistence.
- Skip polish, broad error handling, and abstractions.
- Show state clearly after each action or variant switch.
- Delete, absorb, or explicitly mark the prototype after it answers the question.

## Durable Capture

The answer is the artifact worth keeping.

Capture:

- the question
- prototype path and command
- what was learned
- decision or remaining uncertainty
- next DevFlow route

Use an ADR only if the prototype resolves a hard-to-reverse, surprising trade-off.
