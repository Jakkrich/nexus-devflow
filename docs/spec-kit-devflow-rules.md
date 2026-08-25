# Spec Kit For Developing Nexus-DevFlow 2.5.0

This document defines how `github/spec-kit` may be used as an internal drafting and quality aid for **Nexus-DevFlow 2.5.0** without polluting the public product surface.

---

## 1. Positioning & Product Identity

`Nexus-DevFlow 2.5.0` is the single unified, user-facing workflow surface.

Spec Kit concepts (e.g. constitution, specify, clarify, tasks) may be used behind the scenes to sharpen requirements, but end users only interact with Nexus-DevFlow's **3-Pillars Architecture** and **Single Living Spec Model**.

---

## 2. Local Installation & Isolation Rule

- Keep any local Spec Kit checkout in an untracked scratch directory (e.g. `.local-tools/spec-kit`)
- **Do not commit** external Spec Kit files into the DevFlow repository.
- Treat `.local-tools/` and `.specify/` as local-only, git-ignored scratch space.

---

## 3. Source of Truth Rule

The source of truth remains:
- Nexus-DevFlow 4-Stage Living Spec Lifecycle (`/feature`, `/implement`, `/check`, `/complete`)
- Companion skills (`/idea`, `/grill`, `/brainstorm`, `/discovery`, `/devflow`, etc.)
- Multi-agent skill adapters (`.agents/skills/` and `.claude/skills/`)
- Markdown-first stage artifacts under `devflow/` (`ideas.md`, `context/`, `decisions/`, `history/`)

---

## 4. Concept Mapping (Internal Translation)

| Spec Kit Concept | DevFlow 2.5.0 Native Equivalent |
| :--- | :--- |
| `constitution` | `devflow/context/coding-standards.md` & `ai-interaction.md` |
| `specify` | Section 1 (Define & Boundaries) of the Living Spec (`current-feature.md`) |
| `clarify` | `/grill` (or `/align`) Socratic ADR Alignment & Glossary extraction |
| `plan` | Section 2 (Technical Spec & Contracts) of `current-feature.md` |
| `tasks` | Section 3 (Execution Plan & TDD Checklist with Red-Green-Refactor) |
| `analyze` | `/audit` Branch & Repository Quality/Security Audit |
| `checklist` | TDD Execution and Senior QA Multi-Lane Verification Matrix |
| `implement` | `/implement` Step-by-Step TDD Execution |

---

## 5. Authoring Rule

When adopting useful ideas from external specifications, always translate them into DevFlow-native homes:
- Skill instructions in `.agents/skills/<skill>/SKILL.md` and `.claude/skills/<skill>/SKILL.md`
- Core context files in `devflow/context/`
- Documentation in `docs/`, `README.md`, `README.th.md`, `USAGE.md`, or `AGENTS.md`
