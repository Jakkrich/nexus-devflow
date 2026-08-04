---
id: "{discovery_id}-discover"
title: "Discover: {Work Title}"
doc_type: "discovery"
stage: "00-discover"
created: "{Date}"
updated: "{Date}"
owner: "{Owner}"
status: "draft"
artifact_language: "th"
decision: "Pending"
selected_route: "Undecided"
related_runs: []
related_files: []
---

# Discover: {Work Title}

## 1. Objective

- Explore the request and decide whether delivery should begin before allocating a Running ID.

## 2. Source Inputs

- Incoming request and project context
- Linked Brainstorm, PRD, Research, or Debug findings

## 3. Project Context To Preserve

- Global rules, domain language, and cross-module constraints

## 4. Request Summary

- [Summarize the request]

## 5. Problem Or Opportunity

- [Describe the problem, affected users, and value]

## 6. Decision-Blocking Unknowns

- [List unknowns that could change the route or decision]

## 7. Candidate Routes

| Route | Why It May Be Needed | Decision Question |
| :--- | :--- | :--- |
| `Brainstorm` | [Reason or Not Needed] | [Question] |
| `PRD` | [Reason or Not Needed] | [Question] |
| `Research` | [Reason or Not Needed] | [Question] |
| `Debug` | [Reason or Not Needed] | [Question] |

## 8. Selected Route

- Route: [Brainstorm / PRD / Research / Debug / Direct decision]
- Return target: `/00-Discover {discovery_id}`

## 9. Returned Findings

- [Summarize findings and artifact paths]

## 10. Candidate Delivery Slices

- [List provisional unnumbered outcomes]

## 11. Decision

- Status: [Proceed / Defer / Reject / Pending]
- Rationale: [Evidence]

## 12. AI Actions Performed

- [List routing and synthesis actions]

## 13. Human Review Required

- Confirm route, evidence, and decision
- Confirm no Running ID was allocated

## 14. Approval Status

- Pending

## 15. Next Allowed Command

- [Companion route, `/10-Define {discovery_id}`, or None]

## 16. Nexus Event

- `grill-with-docs` or `prototype` when needed

## 17. Allocated Runs

- [Updated by `/10-Define`]

## 18. Change Log

- {Date}: Initial discovery draft created

## 19. Additional Notes

- Add extra headings below this section when useful.
