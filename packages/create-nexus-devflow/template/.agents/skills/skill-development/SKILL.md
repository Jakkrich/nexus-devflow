---
name: skill-development
description: Guides the creation and maintenance of agent skills. Use when building new skills or modifying existing ones to ensure they follow the PRP framework standards.
---

# Skill Development (Skill Anatomy)

## Overview

This skill defines the standard structure and format of agent-skills skill files. It serves as the "source of truth" for creating new capabilities within the PRP framework.

## When to Use
- When contributing or creating a new skill.
- When refactoring existing skills to match the standard.
- When you need to understand the structural requirements of a `SKILL.md` file.

---

## 🏗️ Skill Structure (Anatomy)

Every skill lives in its own directory under `skills/`:

```text
skills/
  skill-name/
  ├── SKILL.md           # Required: The skill definition
  └── supporting-file.md # Optional: Reference material loaded on demand
```

### 1. Frontmatter (Required)

```yaml
---
name: skill-name-with-hyphens
description: Brief statement of what the skill does. Use when [specific trigger conditions].
---
```

**Rules:**
- `name`: Lowercase, hyphen-separated. Must match the directory name.
- `description`: Starts with what the skill does (third person), followed by trigger conditions. Maximum 1024 characters.

### 2. Standard Sections

A `SKILL.md` should contain these sections:

| Section | Purpose |
|:---|:---|
| **# Skill Title** | Clear, descriptive title. |
| **## Overview** | One-two sentences explaining what this skill does and why it matters. |
| **## When to Use** | Triggers (symptoms/task types) and when NOT to use. |
| **## Core Process** | The main workflow, broken into numbered steps or phases. |
| **## Patterns/Techniques**| Detailed guidance, code examples, or templates. |
| **## Rationalizations** | A table of excuses agents use to skip steps vs. the reality. |
| **## Red Flags** | Signs that the skill is being violated. |
| **## Verification** | Checklist of exit criteria with evidence requirements. |

---

## ✍️ Writing Principles

1. **Process over knowledge**: Skills are workflows, not reference docs. Focus on steps, not facts.
2. **Specific over general**: "Run `npm test`" is better than "verify the tests".
3. **Evidence over assumption**: Every verification checkbox requires proof (logs, output).
4. **Anti-rationalization**: pair common agent excuses with factual counter-arguments.
5. **Token-conscious**: If a section doesn't change agent behavior, remove it.

---

## 🚫 Common Rationalizations

| Rationalization | Reality |
|:---|:---|
| "This is a simple change, I can skip the spec." | Simple changes often have hidden side effects. The spec prevents regressions. |
| "I'll add tests after the implementation." | TDD ensures the code is testable from the start and prevents "forgetting" tests. |
| "I don't need to read the explorer findings, I know the code." | Assumed knowledge is the primary source of bugs. Always verify patterns. |

---

## ✅ Verification Checklist

- [ ] Directory name matches `name` in frontmatter.
- [ ] `SKILL.md` is all uppercase.
- [ ] All mandatory sections (Overview, Process, Rationalizations, Verification) are present.
- [ ] Verification steps are objective and require evidence.
- [ ] Language is imperative and actionable.
