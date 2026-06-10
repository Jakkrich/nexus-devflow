# Agent Ownership Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `codebase-analyst`, consolidate its factual analysis responsibilities into `codebase-explorer`, and make ownership and handoff boundaries explicit for overlapping agents.

**Architecture:** `codebase-explorer` becomes the canonical internal codebase discovery persona and emits one unified discovery report. Lifecycle owners retain responsibility for PRD, requirements, planning, implementation, verification, and workflow guidance; specialists contribute bounded expertise and hand results back to the owner.

**Tech Stack:** Markdown agent personas and workflows, PowerShell, ripgrep, Node.js framework validation.

---

### Task 1: Consolidate Codebase Discovery

**Files:**
- Modify: `.agent/agents/codebase-explorer.md`
- Delete: `.agent/agents/codebase-analyst.md`

- [ ] **Step 1: Record the pre-change references**

Run:

```powershell
rg --hidden -n "codebase-analyst|codebase-explorer" . --glob '!.git/**'
```

Expected: references include both persona files and routing documentation.

- [ ] **Step 2: Expand the Explorer contract**

Add explicit `Owns`, `Does Not Own`, `Input`, `Output`, and `Handoff` fields. Merge Analyst responsibilities into Explorer: entry points, implementation flow, data flow, state changes, side effects, contracts, configuration, and error handling. Preserve the documentarian-only boundary and file/line citation requirement.

- [ ] **Step 3: Delete the Analyst persona**

Delete `.agent/agents/codebase-analyst.md` without creating an alias or redirect.

- [ ] **Step 4: Verify the merged persona**

Run:

```powershell
rg -n "Owns|Does Not Own|Input|Output|Handoff|data flow|state changes|side effects|contracts|error handling" .agent/agents/codebase-explorer.md
```

Expected: every ownership field and merged analysis capability is present.

### Task 2: Route All Discovery Through Explorer

**Files:**
- Modify: `.agent/agents/prp-core-planner.md`
- Modify: `.agent/agents/prp-core-prd-architect.md`
- Modify: `.agent/agents/prp-core-debugger.md`
- Modify: `.agent/agents/prp-core-codebase-assistant.md`
- Modify: `.agent/workflows/11-Research.md`
- Modify: `.agent/workflows/31-Plan.md`
- Modify: `.agent/workflows/90-Agent.md`
- Modify: `.agent/agents/README.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Replace dual-agent planning with unified discovery**

Update `prp-core-planner` to call `codebase-explorer` once for file discovery, patterns, entry points, architecture, data flow, contracts, side effects, configuration, and tests. Remove the second-agent merge instructions and update completion checks to name only Explorer.

- [ ] **Step 2: Update adjacent persona routing**

Replace Analyst calls in PRD research, debugger trace preparation, and codebase-assistant query decomposition. The assistant should route both WHERE and HOW questions to Explorer and recommend one unified investigation rather than sequential Explorer/Analyst calls.

- [ ] **Step 3: Update workflow and catalog references**

Remove Analyst from `/11-Research`, `/31-Plan`, `/90-Agent`, `.agent/agents/README.md`, and `AGENTS.md`. Describe Explorer as owning files, patterns, architecture, data flow, and module relationships.

- [ ] **Step 4: Verify no active reference remains**

Run:

```powershell
rg --hidden -n "codebase-analyst" . --glob '!.git/**' --glob '!docs/superpowers/**'
```

Expected: exit code 1 with no matches.

### Task 3: Add Ownership And Handoff Contracts

**Files:**
- Modify: `.agent/agents/prp-core-prd-architect.md`
- Modify: `.agent/agents/requirements-engineer.md`
- Modify: `.agent/agents/prp-core-planner.md`
- Modify: `.agent/agents/orchestrator.md`
- Modify: `.agent/agents/prp-core-coder.md`
- Modify: `.agent/agents/backend-specialist.md`
- Modify: `.agent/agents/frontend-specialist.md`
- Modify: `.agent/agents/database-architect.md`
- Modify: `.agent/agents/code-reviewer.md`
- Modify: `.agent/agents/test-engineer.md`
- Modify: `.agent/agents/security-auditor.md`
- Modify: `.agent/agents/performance-engineer.md`
- Modify: `.agent/agents/coach-guideline.md`
- Modify: `.agent/agents/prp-core-codebase-assistant.md`

- [ ] **Step 1: Add planning lifecycle boundaries**

Add a concise `Ownership And Handoff` section to PRD Architect, Requirements Engineer, Planner, and Orchestrator. State the owned artifact, exclusions, input, output, and next workflow/persona.

- [ ] **Step 2: Add implementation boundaries**

State that Coder owns approved-plan execution and validation. Backend, Frontend, and Database specialists own bounded domain work and return changes, assumptions, and evidence to Coder or `/32-Code`.

- [ ] **Step 3: Add quality boundaries**

State that Code Reviewer owns general correctness/regression synthesis; Test Engineer owns test strategy/evidence; Security Auditor owns threat-focused review; Performance Engineer owns measurement-based bottleneck analysis. Each specialist hands findings to the reviewer or verification workflow.

- [ ] **Step 4: Add support boundaries**

State that Coach owns workflow guidance and remains read-only. Codebase Assistant owns concise project-logic answers, routing broad investigations to Explorer and process questions to Coach.

- [ ] **Step 5: Verify every retained persona has the contract**

Run:

```powershell
$files = @('.agent/agents/prp-core-prd-architect.md','.agent/agents/requirements-engineer.md','.agent/agents/prp-core-planner.md','.agent/agents/orchestrator.md','.agent/agents/prp-core-coder.md','.agent/agents/backend-specialist.md','.agent/agents/frontend-specialist.md','.agent/agents/database-architect.md','.agent/agents/code-reviewer.md','.agent/agents/test-engineer.md','.agent/agents/security-auditor.md','.agent/agents/performance-engineer.md','.agent/agents/coach-guideline.md','.agent/agents/prp-core-codebase-assistant.md'); foreach ($file in $files) { if (-not (Select-String -LiteralPath $file -Pattern '## Ownership And Handoff' -Quiet)) { Write-Error "Missing ownership contract: $file" } }
```

Expected: exit code 0 with no missing-contract errors.

### Task 4: Validate The Framework

**Files:**
- Modify if required by validation: only files already listed in Tasks 1-3

- [ ] **Step 1: Run focused reference checks**

Run:

```powershell
rg --hidden -n "codebase-analyst" . --glob '!.git/**' --glob '!docs/superpowers/**'
```

Expected: no matches.

- [ ] **Step 2: Run framework validation**

Run:

```powershell
npm run validate
```

Expected: framework validation succeeds.

- [ ] **Step 3: Review the final diff**

Run:

```powershell
git diff --check
git status --short
git diff --stat
```

Expected: no whitespace errors; only the approved persona, workflow, catalog, and plan files are changed.
