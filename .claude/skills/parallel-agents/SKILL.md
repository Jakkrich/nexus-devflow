---
name: parallel-agents
description: Multi-agent orchestration patterns for the current DevFlow 2.0 specialist set. Use when multiple independent analyses or implementation perspectives can run in parallel.
allowed-tools: Read, Glob, Grep
---

# Parallel Agents For DevFlow 2.0

## Overview

Use parallel specialist work only when:

- the task spans multiple independent domains
- findings can be gathered without one agent blocking another
- the lifecycle owner is already clear from the current stage or approved plan

Do not use orchestration for simple single-domain tasks.

## Preconditions

Before parallelizing:

1. read the current stage artifact or approved plan
2. identify the lifecycle owner
3. split the work into independent questions

If those conditions are missing, return first to `/00-Discover`, `/20-Spec`, or `/30-Plan`.

## Basic Invocation Patterns

### Single Specialist

```text
Use the security-auditor agent to review authentication
```

### Sequential Chain

```text
First, use the codebase-explorer agent to discover project structure.
Then, use the backend-specialist to review API endpoints.
Finally, use the test-engineer to identify test gaps.
```

### Parallel Review

```text
Use security-auditor, code-reviewer, and performance-engineer in parallel.
Then synthesize the findings into one recommendation set.
```

## Recommended Patterns

### Pattern 1: Comprehensive Analysis

```text
Agents: codebase-explorer -> [domain-agents] -> synthesis

1. codebase-explorer: map the relevant code paths
2. security-auditor: security posture
3. backend-specialist: API and server quality
4. frontend-specialist: UI and interaction quality
5. test-engineer: test coverage and missing evidence
6. synthesize all findings
```

### Pattern 2: Feature Review

```text
Agents: affected-domain-agents -> test-engineer

1. identify the affected domains
2. invoke relevant domain agents
3. test-engineer checks missing validation or coverage
4. synthesize recommendations
```

### Pattern 3: Verification Sweep

```text
Agents: code-reviewer + security-auditor + performance-engineer

1. code-reviewer: correctness and maintainability risks
2. security-auditor: security and logic risks
3. performance-engineer: bottlenecks and regression risk
4. synthesize priority-ranked findings
```

## Current Agent Set

| Agent | Expertise | Trigger Phrases |
|---|---|---|
| `orchestrator` | coordination | "multi-domain", "comprehensive", "orchestrate" |
| `requirements-engineer` | requirements | "scope", "acceptance criteria", "requirements" |
| `prp-core-planner` | planning | "plan", "breakdown", "milestones" |
| `codebase-explorer` | discovery | "explore", "map", "structure" |
| `backend-specialist` | backend | "API", "server", "Node.js", "Express" |
| `frontend-specialist` | frontend | "React", "UI", "components", "Next.js" |
| `database-architect` | database | "schema", "Prisma", "migrations" |
| `test-engineer` | testing | "tests", "coverage", "TDD" |
| `code-reviewer` | quality | "review", "risk", "correctness" |
| `security-auditor` | security | "security", "auth", "vulnerabilities" |
| `penetration-tester` | offensive security | "pentest", "exploit" |
| `performance-engineer` | performance | "slow", "optimize", "profiling" |
| `devops-engineer` | release/devops | "deploy", "CI/CD", "infrastructure" |
| `prp-core-debugger` | debugging | "bug", "error", "not working" |
| `documentation-maintainer` | docs | "write docs", "update docs", "README" |
| `prp-core-git-committer` | commit/release packaging | "commit", "release packaging" |
| `prp-core-git-pr-maker` | PR preparation | "pull request", "PR summary" |
| `ob-loop-engineer` | maintenance | "overnight maintenance", "maintenance loop", "cleanup loop" |

## Synthesis Protocol

After all agents complete, synthesize:

```markdown
## Orchestration Synthesis

### Task Summary
[What was accomplished]

### Agent Contributions
| Agent | Finding |
|-------|---------|
| security-auditor | Found X |
| backend-specialist | Identified Y |

### Consolidated Recommendations
1. **Critical**: [Issue from Agent A]
2. **Important**: [Issue from Agent B]
3. **Nice-to-have**: [Enhancement from Agent C]

### Action Items
- [ ] Fix critical issue
- [ ] Refactor affected area
- [ ] Add missing validation evidence
```

## Guardrails

- do not invent agent names that are not present in the repo
- do not require a legacy `PLAN.md` file in project root
- do not parallelize dependent tasks that need sequential ownership
- do not let orchestration replace the lifecycle owner
