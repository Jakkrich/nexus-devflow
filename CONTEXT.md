# Nexus-DevFlow Domain Model

Nexus-DevFlow is an agentic workflow layer and spec-driven pair programming operating system for human developers and AI coding agents.

## Language

**Tooling Engine**:
A unified execution engine that dispatches internal developer CLI utilities and tooling commands behind a single programmatic seam.
_Avoid_: Script runner, script bundle, utility collection

**Tool Command**:
A self-contained command implementation registered in the Tooling Engine that executes a specific automation or reporting task without producing side-effect exits.
_Avoid_: CLI script, sub-script, runner

**Living Spec**:
The single active task specification document (`spec.md`) that drives the 4-stage lifecycle from definition through empirical proof.
_Avoid_: PRD, design document, static specification

**Quality Gate**:
A hard programmatic verification checkpoint that blocks completion or commit when tests fail, spec tasks remain incomplete, or unresolved findings persist.
_Avoid_: Lint check, completion check, pre-commit barrier
