---
id: "project-wiki-index"
title: "Project Wiki"
doc_type: "wiki"
category: "knowledge"
status: "active"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
source_workflow: "/59-Wiki"
related_task: null
related_files: []
tags:
  - nexus-devflow
  - wiki
  - knowledge
aliases:
  - "Project Wiki Index"
summary: "Index for reusable project knowledge."
metadata_version: 1
---

# Project Wiki #doc/wiki #status/active

This wiki compiles reusable knowledge about the current project. It is not the source of truth. Source truth remains in code, specs, QA reports, RCA reports, PR reviews, commits, and research artifacts.

## Start Here #section/summary

- [[architecture/overview]] - system shape, modules, and data flow
- [[decisions/index]] - durable project decisions and tradeoffs
- [[domain/index]] - domain concepts and business language
- [[patterns/index]] - implementation, testing, API, and UI patterns
- [[gotchas/index]] - recurring failure modes and traps
- [[tasks/index]] - compiled task lessons
- [[token-context/index]] - context loading and token usage lessons

## Operating Rules #section/guide

- Keep project knowledge under `.workspaces/wiki/project/`.
- Put generated but unreviewed content under `_drafts/`.
- Include a `Sources` section in every page.
- Prefer one focused page over broad rewrites.
- Promote to framework wiki only when the lesson applies beyond this project.

## Sources #section/sources

- `.agent/workflows/59-Wiki.md`
- `docs/workspace-artifacts.md`
- `.workspaces/project_index.json`
