# DevFlow 2.0 Schema And Template Rules

This document is the source of truth for DevFlow 2.0 stage contracts.

DevFlow 2.0 is:

- `workspace-stage-first`
- `markdown-first`
- `running-id based`
- `Timeline workflow only for numbered commands`

DevFlow 2.0 is not:

- dashboard-first
- JSON-first
- schema-driven around JSON task hubs

## 1. Timeline Stage Contracts

```text
/00-Discover -> /10-Define -> /20-Spec -> /30-Plan -> /40-Implement -> /50-Verify -> /60-Report -> /70-Release
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

## 1. Objective

## 2. Source Inputs

## 3. Project Context To Preserve

## 4. Stage-Specific Content

## 5. AI Actions Performed

## 6. Human Review Required

## 7. Approval Status

## 8. Next Allowed Command

## 9. Nexus Event

## 10. Change Log

## 11. Additional Notes
```

Rules:

1. Required headings must stay in this order.
2. Stage-specific detail may expand inside the numbered contract, but the manual review headings must still exist.
3. AI may add more headings after `## 11. Additional Notes`.
4. AI must not remove required headings.
5. Stage files are contracts for handoff.
6. Context that used to be stored in JSON must now be stored in markdown sections.
7. Every `.template.md` file must declare `artifact_language: "th"` or `"en"` in frontmatter.
8. Before creating a markdown artifact, the workflow must read `artifact_language` from the template and write the artifact in that language.
9. `Next Allowed Command` should preserve the Timeline continuation.
10. `Nexus Event` may list optional skills, companion commands, or specialist lanes that fit the current situation and later return to the Timeline.

## 3. Manual Review Contract

DevFlow 2.0 now supports a manual-review-friendly contract for the Timeline stages.

Each stage should answer:

1. What inputs did AI use
2. What project context must still be preserved
3. What did AI actually do in this stage
4. What must a human reviewer inspect
5. What command is allowed next
6. Which optional branches might help before or around the next Timeline step

Recommended approval values:

- `Pending`
- `Approved`
- `Needs Revision`
- `Rejected`

## 4. Checklist Contracts

Detailed run tracking may be stored under:

```text
.workspaces/specs/{ID}-{slug}/checklists/
```

Checklist files are supporting operational contracts, not replacements for stage files.

Recommended files:

- `implementation-checklist.md`
- `verification-checklist.md`

Rules:

1. Checklist items must map back to a running ID.
2. Checklist status must reflect current reality, not only the original plan.
3. Checklist items should include owner, updated timestamp, and evidence.
4. Checklist files support `/30-Plan`, `/40-Implement`, `/50-Verify`, `/60-Report`, and `/70-Release`.
5. The stage markdown files remain the Timeline source of truth for handoff and decisions.

## 5. Legacy Artifacts

The following categories are retired from the DevFlow 2.0 Timeline:

- JSON schemas for task state
- JSON templates for task state
- dashboard-first contracts
- PRP runtime commands that mutate task JSON

Legacy files may still appear in history, but new 2.0 work must not route to them.
