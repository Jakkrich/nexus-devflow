---
name: brainstorm
description: "[devflow][B] Companion skill for structured divergent and convergent ideation, generating 2-3 viable options with trade-off analysis before committing to delivery."
argument-hint: "{topic, feature, or discovery-id}"
---

# Brainstorming & Option Analysis

$ARGUMENTS

Explore a vague request, architectural choice, or feature direction without allocating a Running ID. Formulate 2-3 materially different options, analyze trade-offs, and recommend the optimal path.

## Usage

```text
brainstorm {topic or request}
brainstorm {discovery-id}
```

Use this when:
- A request has multiple viable implementation paths
- The team needs to compare options before locking delivery scope
- Discovering or defining a complex technical feature

## Process & Execution Lenses

### 1. Ground the Problem
- Restate the core goal and target user/stakeholder value.
- Identify technical, business, or timeline constraints.

### 2. Option Formulation (Divergent Phase)
Provide at least 2-3 materially distinct approaches:
- **Option A (Standard / Conservative)**: Low risk, proven pattern, minimal changes.
- **Option B (Modern / Optimized)**: Best-practice architecture, balanced trade-off, scalable.
- **Option C (Alternative / Unconventional)**: High innovation, simplified scope, or creative alternative.

### 3. Trade-off Comparison Matrix
Construct a structured evaluation table:

| Option | Pros (ข้อดี) | Cons (ข้อเสีย) | Effort & Complexity | Verdict / Status |
| :--- | :--- | :--- | :--- | :--- |
| **Option A** | ... | ... | Low / Med / High | ... |
| **Option B** | ... | ... | Low / Med / High | **Recommended** |
| **Option C** | ... | ... | Low / Med / High | ... |

### 4. Codebase & Feasibility Check
- Use `grep_search` to inspect existing patterns in the project.
- Verify library suitability or external API contracts before recommending.

### 5. Recommendation & Next Steps (Convergent Phase)
- Select the best option and explain the core rationale.
- Define actionable next steps without writing prematurely detailed code.

## Output

1. Render the comparison matrix and recommended path directly in the conversation.
2. (Optional) Save persistent artifact to `devflow/research/brainstorm-{slug}.md` when attached to a discovery run.

## Next Workflow Recommendation

- **Primary**: `discovery {discovery_id}` (if resuming discovery) or `10-define` / `feature` (if ready to specify)
- **Inbox**: `idea` to record into `devflow/ideas.md`