---
name: idea
description: "[devflow] Quick idea capture and AI enrichment - analyze feasibility, value, key points, and record into devflow/ideas.md inbox."
argument-hint: "\"<idea text or description>\""
---

# idea - Quick Idea Capture & AI Enrichment

$ARGUMENTS

Use this skill to quickly capture feature ideas, improvements, or architectural thoughts before they are forgotten. The AI immediately enriches the idea with **Feasibility Assessment**, **Value & Impact Analysis**, and **Quick Seed Key Points** (to prevent forgetting the nuance), then stores it in the central idea inbox at `devflow/ideas.md`.

## Invocations & Aliases

- `/idea "<idea text>"`: Standard slash command in Claude Code / Antigravity
- `idea "<idea text>"`: Plain text invocation
- `$idea "<idea text>"`: Codex CLI invocation

## Behavior & Contract

When invoked:

### 1. Load Idea Inbox Hub
1. Check if `devflow/ideas.md` exists. If not, create it with the standard DevFlow Ideas template.
2. Read `devflow/ideas.md` and find the highest existing `IDEA-xxx` number.
3. Allocate the next sequential ID (e.g. `IDEA-001`, `IDEA-002`).

### 2. AI Feasibility & Value Analysis
Evaluate the user's raw idea and generate an enriched entry in Thai (`th` per user communication rules):
- **Raw Idea**: The user's input description
- **AI Feasibility & Tech**: Feasibility rating (Easy / Medium / Complex) along with recommended libraries, APIs, or architectural approaches
- **Value & Potential**: Business value, user benefits, and strategic impact
- **Quick Seed**: 2-3 key technical nuances or seed points to preserve context for later pickup

### 3. Append to `devflow/ideas.md`
Insert the new idea block directly under `## 📌 Pending Ideas` in `devflow/ideas.md`:

```markdown
### [IDEA-001] {Brief idea title}
- **บันทึกเมื่อ**: {YYYY-MM-DD}
- **ไอเดียตั้งต้น**: {User's raw idea text}
- **AI Feasibility & Tech**: {Feasibility and tooling analysis}
- **Value & Potential**: {Value and impact analysis}
- **Quick Seed (กันลืม)**:
  1. {Key point 1}
  2. {Key point 2}
- **สถานะ**: `Pending` (Ready for pickup via `/feature IDEA-001` or `/discovery IDEA-001`)
```

*(If placeholder `*(ยังไม่มีไอเดียค้างอยู่...)*` exists, remove it upon recording the first idea)*

### 4. Output Summary
Report to the user:
- Allocated Idea ID: `[IDEA-xxx]`
- Summary of Feasibility & Value analysis
- Seed points saved
- Instructions for promotion: "Ready to implement? Run `/feature IDEA-xxx` or `/discovery IDEA-xxx` anytime."