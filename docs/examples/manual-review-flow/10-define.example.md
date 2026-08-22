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

- Lock one bounded delivery outcome created from an approved discovery.

## 2. Source Inputs

- `devflow/discoveries/{DISCOVERY_ID}-{slug}/00-explore.md`
- Linked companion findings and project context

## 3. Project Context To Preserve

- Global rules, shared language, and cross-run constraints

## 4. Source Discovery And Run Allocation

- Discovery ID: `{discovery_id}`
- Running ID: `{running_id}`
- Sibling runs: [IDs or None]
- Allocation rationale: [Why this is one run]

## 5. Problem Definition

- [Define this run's part of the approved problem]

## 6. Delivery Scope

- [Describe the independently specifiable outcome]

## 7. In Scope

- [Included items]

## 8. Out Of Scope

- [Excluded and sibling-owned items]

## 9. Success Criteria

- [Outcomes that make the run ready for Spec]

## 10. Hard Constraints

- [Constraints]

## 11. Dependencies

- [Sibling runs, systems, teams, or research]

## 12. Assumptions And Open Decisions

- Assumptions: [List]
- Open decisions: [List]

## 13. AI Actions Performed

- [Decomposition, allocation, and traceability actions]

## 14. Human Review Required

- Confirm one coherent delivery boundary
- Confirm sibling responsibilities and dependencies

## 15. Approval Status

- Pending

## 16. Next Allowed Command

- `/20-Spec {running_id}`

## 17. Nexus Event

- `/00-explore {discovery_id}`, `Research`, or `grill-with-docs` when needed

## 18. Change Log

- {Date}: Running ID allocated and definition created

## 19. Additional Notes

- Add extra headings below this section when useful.
