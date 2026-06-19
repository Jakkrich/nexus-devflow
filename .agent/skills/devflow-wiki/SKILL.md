---
name: devflow-wiki
description: Use when creating, updating, linting, querying, or deciding whether to ingest Nexus-DevFlow framework or project wiki knowledge under .workspaces/wiki.
---

# DevFlow Wiki

Use DevFlow Wiki to compile reusable knowledge from source artifacts into small, source-backed Markdown pages.

## Core Rules

- Treat wiki pages as compiled knowledge, not source truth.
- Keep `framework` and `project` namespaces separate.
- Include `## Sources` on every page.
- Use `_drafts/` for generated or unreviewed project pages.
- Prefer one focused page over broad rewrites.
- Do not ingest noisy logs, unverified hypotheses, or routine edits with no reusable lesson.

## Namespace Decision

| Scope | Use For | Path |
| :--- | :--- | :--- |
| `framework` | DevFlow workflows, agents, commands, install behavior, output contracts, token/context rules | `.workspaces/wiki/framework/` |
| `project` | Target project architecture, domain concepts, decisions, patterns, gotchas, task lessons | `.workspaces/wiki/project/` |

Promote project pages to framework only when the lesson applies beyond one project.

## Commands

Initialize and maintain wiki pages through the documented markdown structure under `.workspaces/wiki/`. Do not rely on the retired PRP runtime for wiki commands.

Use `Wiki {scope} ingest {source}` for workflow-level ingestion and route reporting.

## Project Wiki Contract

Every project wiki uses:

```text
.workspaces/wiki/project/
|-- index.md
|-- architecture/
|-- decisions/
|-- domain/
|-- gotchas/
|-- patterns/
|-- tasks/
|-- token-context/
`-- _drafts/
```

Each published page should follow `.agent/resources/schemas/wiki_page.template.md`.

## Ingest Heuristics

Ingest when the source contains reusable knowledge:

- verified QA evidence
- confirmed root cause and prevention
- durable project decision
- stable architecture or domain concept
- repeated gotcha or risk pattern
- context/token optimization lesson

Skip ingest when the source is one-off, unverified, noisy, or already represented in a focused page.

## Output Expectation

Always report:

- pages created or updated
- source artifacts used
- lint result or remaining issue
- next workflow recommendation
- wiki update recommendation

