---
description: Structured brainstorming for projects and features. Transitional compatibility path for the Brainstorm companion command in DevFlow 2.0.
---

# Brainstorm - Structured Idea Exploration

$ARGUMENTS

This file keeps its old numeric path for migration compatibility.

In DevFlow 2.0, `Brainstorm` is a companion command, not a numbered mainline workflow. The operational behavior remains intentionally rich so the user experience does not regress.

## Purpose

Use `Brainstorm` for structured idea exploration before committing to a direction.

Use it when:

- the request is still vague
- there are multiple possible directions
- the team needs to compare options before locking the work
- Discover or Define would benefit from explicit option comparison

Preferred DevFlow 2.0 pairing:

- from `/00-Discover` when the request is still fuzzy
- from `/10-Define` when the direction is still unstable

## Behavior

When `Brainstorm` is triggered:

1. Understand the goal
   - What problem are we solving?
   - Who is the user or stakeholder?
   - What constraints matter?
2. Generate options
   - Provide at least 3 materially different approaches
   - Include pros and cons for each
   - Consider both safe and unconventional paths when useful
3. Compare and recommend
   - Summarize the tradeoffs
   - Give a recommendation with reasoning
4. Keep it exploratory
   - Do not pretend certainty where it does not exist
   - Do not turn this into implementation planning too early

Apply prompt ideation addons when useful:

- `ideation_code_improvements`
- `ideation_code_quality`
- `ideation_documentation`
- `ideation_performance`
- `ideation_security`
- `ideation_ui_ux`

In DevFlow 2.0, do not treat `Brainstorm` as a required linear state before `10-Define`. It supports the mainline; it does not replace it.

## Output Format

Return a brief summary in chat, and save the full brainstorming report under `.workspaces/research/brainstorm-{topic}.md`.

Before generating the report:

1. Inspect `.agent/resources/schemas/brainstorm.template.md`
2. Preserve its required headings and structure
3. Replace all placeholders with concrete content
4. Re-check the output against `brainstorm.template.md`, ensure required headings remain, and remove all placeholders before completion

Use this structure:

```markdown
## ๐ง  Brainstorm: [Topic]

### Context
[Brief problem statement]

---

### Option A: [Name]
[Description]

โ… **Pros:**
- [benefit 1]
- [benefit 2]

โ **Cons:**
- [drawback 1]

๐“ **Effort:** Low | Medium | High

---

### Option B: [Name]
[Description]

โ… **Pros:**
- [benefit 1]

โ **Cons:**
- [drawback 1]
- [drawback 2]

๐“ **Effort:** Low | Medium | High

---

### Option C: [Name]
[Description]

โ… **Pros:**
- [benefit 1]

โ **Cons:**
- [drawback 1]

๐“ **Effort:** Low | Medium | High

---

## ๐’ก Recommendation

**Option [X]** because [reasoning].

## Next Suggested Actions
- [Action 1]
- [Action 2]
```

## Examples

```text
Brainstorm authentication system
Brainstorm state management for complex form
Brainstorm database schema for social app
Brainstorm caching strategy
```

## Key Principles

- No code unless the user explicitly changes mode
- Honest tradeoffs over fake confidence
- Multiple viable paths before recommending one
- Persistent output saved to disk
- Mainline remains: `/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release`

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `/00-Discover`, `/10-Define`
- Typical handoff targets: `/00-Discover`, `/10-Define`, `/20-Spec`, `Research`, `PRD`

## Sources

- `AGENTS.md`
- `.agent/resources/schemas/brainstorm.template.md`
- Related commands: `/00-Discover`, `/10-Define`, `Research`, `PRD`, `/20-Spec`

## Next Workflow Recommendation

- Default: return to `/00-Discover` or `/10-Define` with the chosen direction
- Alternate: `Research` when facts are still missing
- Alternate: `/20-Spec` when the direction is now stable enough to formalize

