---
name: release-git-operations
description: Handle commit, pull request, merge, deployment, and changelog work around Release. Use when packaging verified work for sharing, integration, deployment, or release communication.
---

# Release Git Operations

## Overview

This skill groups release-adjacent git and deployment behavior that used to be spread across multiple companion workflows.

It is the shared behavior layer behind:

- `Commit`
- `PR`
- `Merge`
- `Deploy`
- `Changelog`

## Related Foundation Skills

This skill should reuse and align with:

- `.agent/skills/git-workflow-and-versioning/SKILL.md`
- `.agent/skills/shipping-and-launch/SKILL.md`
- `.agent/skills/deployment-procedures/SKILL.md`

## When to Use

- After `/50-Verify` when verified work is ready for packaging
- During `/60-Release` when the team needs commit, PR, merge, deployment, or changelog support
- When release communication must be built from markdown-first stage artifacts

## Supported Modes

- `commit`
- `pr`
- `merge`
- `deploy`
- `changelog`

## Process

### 1. Confirm Release Context

Read the minimum required artifacts:

- `verify.md`
- `release.md`
- `report.md` when relevant
- git state and repository policy when relevant

### 2. Run The Appropriate Mode

#### Commit

- stage the intended scope
- use disciplined commit messaging
- preserve branch safety rules

#### PR

- build PR narrative from markdown-first artifacts
- preserve repository template fidelity
- route follow-up review work cleanly

#### Merge

- confirm verification and review gates are satisfied
- integrate safely using repository policy
- route conflicts back to implementation or follow-up

#### Deploy

- apply shipping and launch discipline
- verify platform-specific readiness
- keep rollback and health checks explicit

#### Changelog

- summarize user-facing changes from stage artifacts and git evidence
- avoid leaking low-value internal detail

### 3. Route Back

- return to `/60-Release` when packaging is still in progress
- return to `/70-Report` when communication is the remaining task
- return to `/40-Implement`, `/50-Verify`, or `PR-Followup` if release blockers are discovered

## Output

Return:

- mode executed
- artifacts or git actions produced
- risks, blockers, or follow-up needs
- recommended next stage or companion command
