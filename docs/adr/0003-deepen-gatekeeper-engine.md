# 0003: Deepen Gatekeeper Engine by Absorbing Findings and Drift Verification

## Context & Decision

`gatekeeper.ts` previously existed as a shallow evaluation function that received `ProjectStatus` and made ad-hoc calls to `detectGitDrift()`. External callers and CLI commands were required to independently coordinate findings aggregation (`findings.ts`), drift detection and reconciliation (`drift-reconciler.ts`), and gate policy evaluation (`devflow/config.json`). This created fragmented verification points and increased friction for CI and multi-agent workflows.

We decided to create a deep **Gatekeeper Engine** (`GatekeeperEngine` class) that absorbs findings blocker inspection, Git drift detection, spec fidelity validation, and deterministic policy enforcement behind a unified programmatic seam. Low-level markdown and git parsers (`findings.ts`, `drift-reconciler.ts`) are encapsulated behind this engine. `GatekeeperEngine` evaluates Two-Stage quality criteria (Stage 1: Spec Fidelity; Stage 2: Code Quality & Security) and provides automated reconciliation hooks.

## Considered Options

- **Keep standalone functions and wrap in a utility script**: Rejected because it maintains a shallow module surface where callers must understand the internal interaction between status, findings, drift, and policies.
- **Merge all parser files into a single 700+ line monolith**: Rejected to preserve Single Responsibility Principle (SRP) for internal parsers while exposing a cohesive seam to callers.

## Consequences

- Callers (CLI `nexus-devflow gate`, `DashboardStateEngine`, Autopilot, and CI runners) interact with a single, authoritative `GatekeeperEngine` seam.
- Two-Stage quality verification (Spec fidelity and Code quality) is evaluated atomically with support for Strict Mode, Standard Mode, and `devflow/config.json` policy rules.
- Existing functions (`evaluateGate`) remain supported as backward-compatible wrappers delegating to `GatekeeperEngine`.
