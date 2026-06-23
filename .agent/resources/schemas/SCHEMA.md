# DevFlow 2.0 Schema And Template Rules

This document is the source of truth for DevFlow 2.0 stage contracts.

DevFlow 2.0 is:

- `workspace-stage-first`
- `markdown-first`
- `running-id based`
- `mainline workflow only for numbered commands`

DevFlow 2.0 is not:

- dashboard-first
- JSON-first
- schema-driven around JSON task hubs

## 1. Mainline Stage Contracts

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Release -> /70-Report
```

Each stage must produce one primary markdown file.
Runs may also produce supporting checklist markdown files under `checklists/` when detailed operational tracking is needed.

## 2. Shared Markdown Contract Shape

Every stage template should follow this structure:

```markdown
---
id: "{running_id}-{stage_slug}"
title: "{Stage Title}: {Work Title}"
doc_type: "{stage_doc_type}"
stage: "{stage_code}-{stage_name}"
created: "{date}"
updated: "{date}"
owner: "{owner}"
status: "draft"
artifact_language: "en"
related_run: "{running_id}"
related_files: []
---

# {Stage Title}: {Work Title}

## 1. Purpose

## 2. Inputs

## 3. Required Content

## 4. Decisions

## 5. Outputs

## 6. Next Step Guidance

## 7. Additional Notes
```

Rules:

1. Required headings must stay in this order.
2. AI may add more headings after `## 7. Additional Notes`.
3. AI must not remove required headings.
4. Stage files are contracts for handoff.
5. Context that used to be stored in JSON must now be stored in markdown sections.
6. Every `.template.md` file must declare `artifact_language: "th"` or `"en"` in frontmatter.
7. Before creating a markdown artifact, the workflow must read `artifact_language` from the template and write the artifact in that language.

## 3. Checklist Contracts

Detailed run tracking may be stored under:

```text
.workspaces/specs/{ID}-{slug}/checklists/
```

Checklist files are supporting operational contracts, not replacements for stage files.

Recommended files:

- `master-checklist.md`
- `implementation-checklist.md`
- `verification-checklist.md`

Rules:

1. Checklist items must map back to a running ID.
2. Checklist status must reflect current reality, not only the original plan.
3. Checklist items should include owner, updated timestamp, and evidence.
4. Checklist files support `/30-Plan`, `/40-Implement`, `/50-Verify`, and `/60-Release`.
5. The stage markdown files remain the mainline source of truth for handoff and decisions.

## 4. Legacy Artifacts

The following categories are retired from the DevFlow 2.0 mainline:

- JSON schemas for task state
- JSON templates for task state
- dashboard-first contracts
- PRP runtime commands that mutate task JSON

Legacy files may still appear in history, but new 2.0 work must not route to them.
