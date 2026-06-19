---
name: specialist-agent-routing
description: Route a request to the right specialist agent and preserve the DevFlow 2.0 stage-first contract. Use when the user wants direct specialist judgment on a file, folder, workspace, or concern.
---

# Specialist Agent Routing

## Overview

This skill is the shared behavior layer behind `Agent`.

It keeps direct specialist invocation available for advanced use, but makes clear that the owning workflow or mainline stage still controls lifecycle state.

## When to Use

- when the user explicitly wants a specialist persona
- when a stage needs deeper focused judgment on a bounded target
- when a file, folder, running ID workspace, or codebase concern maps better to one expert than to a whole workflow

## Core Rule

`Agent` is not a mainline stage and should not replace the owning workflow.

Use it to add focused expertise, then route back to the correct lifecycle step.

## Input Shape

```text
Agent {AGENT_NAME} {TARGET}
```

Examples:

```text
Agent requirements-engineer .workspaces/specs/007/spec.md
Agent codebase-explorer src/services/
Agent code-reviewer .workspaces/specs/007
```

## Process

### 1. Load The Specialist

Read:

- `.agent/agents/{AGENT_NAME}.md`
- the minimum necessary target context
- relevant stage artifacts when the target belongs to a running ID

### 2. Preserve Stage-First Contract

- prefer `discover.md`, `define.md`, `spec.md`, `plan.md`, `implement.md`, `verify.md`, `release.md`, and `report.md`
- do not silently mutate legacy JSON contracts
- if the agent is only reviewing, return recommendations or save a report instead of pretending to execute the whole lifecycle

### 3. Apply Specialist Discipline

Examples:

- `code-reviewer` -> correctness, risk, maintainability, findings-first review
- `prp-core-debugger` -> RCA and validation evidence
- `requirements-engineer` -> scope, ambiguity, acceptance criteria
- `codebase-explorer` -> architecture, pattern, and data flow investigation

### 4. Save A Reusable Report When Needed

For substantial outputs, save to:

```text
.workspaces/reports/{date}-{agent-name}-{timestamp}.md
```

Use `.agent/resources/schemas/agent_report.template.md` unless the invoking workflow provides a more specific template.

### 5. Route Back

Return to the owning step:

- `/10-Define`
- `/20-Spec`
- `/30-Plan`
- `/40-Implement`
- `/50-Verify`
- `/60-Release`
- `/70-Report`
- `PR-Review`
- `Research`

## Skills That Should Not Be Invoked As Agents

These former narrow agents now belong in the skill layer:

- `code-simplification`
- `type-design`
- `silent-failure-audit`

Invoke them through the responsible workflow or agent instead.

## Output

Return:

- agent used
- target reviewed
- concise findings or changes
- report path when a substantial report was written
- exact recommended next route
