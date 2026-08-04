---
id: "{running_id}-define"
title: "Define: {Work Title}"
doc_type: "stage"
stage: "10-define"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "th"
related_run: "{running_id}"
source_discovery: "{discovery_id}"
sibling_runs: []
dependencies: []
supersedes: []
related_files: []
---

# Define: {Work Title}

## 1. Objective

- Lock one coherent delivery boundary created from an approved discovery so specification can proceed without loading the whole initiative.

## 2. Source Inputs

- `.workspaces/discoveries/{DISCOVERY_ID}-{slug}/00-discover.md`
- Linked Brainstorm, PRD, Research, or Debug artifacts
- Project context documents

## 3. Project Context To Preserve

- Global rules shared by sibling runs
- Domain language that must remain consistent
- Program-level constraints and cross-run decisions

## 4. Source Discovery And Run Allocation

- Discovery ID: `{discovery_id}`
- Running ID: `{running_id}`
- Sibling runs: [List IDs or None]
- Allocation rationale: [Why this outcome deserves one Running ID]

## 5. Problem Definition

- [Define the part of the approved problem owned by this run]

## 6. Delivery Scope

- [Describe the independently specifiable and reviewable outcome]

## 7. In Scope

- [List items explicitly included]

## 8. Out Of Scope

- [List items explicitly excluded, including sibling-run responsibilities]

## 9. Success Criteria

- [List outcomes that make this run ready for Spec]

## 10. Hard Constraints

- [List constraints later stages must not violate]

## 11. Dependencies

- [List sibling runs, teams, systems, or research dependencies]

## 12. Assumptions And Open Decisions

- Assumptions: [List]
- Open decisions: [List]

## 13. AI Actions Performed

- [List decomposition, allocation, scope consolidation, and traceability actions]

## 14. Human Review Required

- Confirm this Running ID has one coherent delivery boundary
- Confirm sibling responsibilities are not duplicated
- Confirm dependencies and exclusions are explicit

## 15. Approval Status

- Pending

## 16. Next Allowed Command

- `/20-Spec {running_id}`

## 17. Nexus Event

- `/00-Discover {discovery_id}` when the delivery decision is no longer stable
- `Research {discovery_id}` when evidence still blocks the boundary
- `grill-with-docs` when scope or terminology remains ambiguous

## 18. Change Log

- {Date}: Running ID allocated and initial definition created

## 19. Additional Notes

- Add any extra headings below this section when useful.
