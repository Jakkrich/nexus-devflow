---
description: Coordinate multiple agents for complex tasks. Use for multi-perspective analysis, comprehensive reviews, or tasks requiring different domain expertise.
---

# 🎼 Multi-Agent Orchestration

You are now in **ORCHESTRATION MODE**. Your task: coordinate specialized agents to solve this complex problem before handing it over to the PRPs Framework workflow.

## Task to Orchestrate
$ARGUMENTS

---

## 🔴 CRITICAL: Minimum Agent Requirement

> ⚠️ **ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS**
> 
> If you use fewer than 3 agents, you are NOT orchestrating - you're just delegating.
> 
> **Validation before completion:**
> - Count invoked agents
> - If `agent_count < 3` → STOP and invoke more agents
> - Single agent = FAILURE of orchestration

### Agent Selection Matrix
(Use Agents from `../agents/` folder)

| Task Type | REQUIRED Agents (minimum) |
|-----------|---------------------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-engineer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | orchestrator, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | prp-core-debugger, codebase-explorer, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

---

## 🔴 STRICT 2-PHASE ORCHESTRATION

### PHASE 1: DISCOVERY & ARCHITECTURE

| Step | Agent | Action |
|------|-------|--------|
| 1 | `orchestrator` | Analyze requirements |
| 2 | `codebase-explorer` | Codebase discovery mapping |

> 🔴 **Do NOT write code yet!**

### ⏸️ CHECKPOINT: User Approval

```
After Discovery is complete, ASK:

"✅ Discovery Phase Complete.

Do you approve this architecture? (Y/N)
- Y: Start Implementation strategy
- N: I'll revise the plan"
```

> 🔴 **DO NOT proceed to Phase 2 without explicit user approval!**

### PHASE 2: IMPLEMENTATION STRATEGY (Parallel Agent Thinking)

| Parallel Group | Agents |
|----------------|--------|
| Foundation | `database-architect`, `security-auditor` |
| Core | `backend-specialist`, `frontend-specialist` |
| Polish | `test-engineer`, `devops-engineer` |

> ✅ After user approval, invoke multiple agents to draft the technical specifications.

---

## Orchestration Protocol

### Step 1: Analyze Task Domains
Identify ALL domains this task touches (Frontend, Backend, Security, SEO, etc.)

### Step 2: Context Passing (MANDATORY)

When invoking ANY subagent, you MUST include:
1. **Original User Request:** Full text of what user asked
2. **Decisions Made:** All user answers to Socratic questions
3. **Previous Agent Work:** Summary of what previous agents did

**Example with FULL context:**
```
Use the frontend-specialist AND backend-specialist agents:

**CONTEXT:**
- User Request: "A social platform for students, using mock data"
- Decisions: Tech=Vue 3, Auth=Mock, Design=Youthful & dynamic
- Previous Work: Architect defined the DB schema.

**TASK:** Create detailed specs based on ABOVE decisions.
```

> ⚠️ **VIOLATION:** Invoking subagent without full context = subagent will make wrong assumptions!

### Step 3: Synthesize Results
Combine all agent outputs into a unified report.

---

## 📝 Output Format

```markdown
## 🎼 Orchestration Report

### Task
[Original task summary]

### Agents Invoked (MINIMUM 3)
| # | Agent | Focus Area | Status |
|---|-------|------------|--------|
| 1 | orchestrator | Architecture | ✅ |
| 2 | frontend-specialist | UI implementation | ✅ |
| 3 | security-auditor | Security Check | ✅ |

### Key Findings
1. **[Agent 1]**: Finding
2. **[Agent 2]**: Finding
3. **[Agent 3]**: Finding

### Summary
[One paragraph synthesis of all agent work]
```

---

## 🔴 EXIT GATE / HANDOFF TO PRPs

Before completing orchestration, verify:
1. ✅ **Agent Count:** `invoked_agents >= 3`
2. ✅ **Report Generated:** Orchestration Report with all agents listed

> **Once Orchestration is complete, INSTRUCT THE USER to run `/01-Task` and `/02-Plan` to convert this Orchestration Report into formal PRPs JSON Tracking files.**
