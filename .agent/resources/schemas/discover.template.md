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

- Explore the request and reach a reviewable go/no-go decision before creating any Running ID.

## 2. Source Inputs

- Incoming request
- Existing project context
- Related links, notes, or files
- Companion outputs linked to this Discovery ID

## 3. Project Context To Preserve

- Global business rules that must carry into future delivery runs
- Cross-module constraints
- Domain language and unresolved questions

## 4. Request Summary

- [Summarize the request in plain language]

## 5. Problem Or Opportunity

- [Describe the problem, opportunity, affected users, and why it matters]

## 6. Decision-Blocking Unknowns

- [List only unknowns that could change the route or decision]

## 7. Candidate Routes

| Route | Why It May Be Needed | Decision Question |
| :--- | :--- | :--- |
| `Brainstorm` | [Reason or Not Needed] | [Question] |
| `PRD` | [Reason or Not Needed] | [Question] |
| `Research` | [Reason or Not Needed] | [Question] |
| `Debug` | [Reason or Not Needed] | [Question] |
| Direct decision | [Reason or Not Ready] | [Question] |

## 8. Selected Route

- Route: [Brainstorm / PRD / Research / Debug / Direct decision]
- Rationale: [Why this is the smallest useful route]
- Return target: `/00-Discover {discovery_id}`

## 9. Returned Findings

- [Summarize durable findings and link their artifact paths]

## 10. Candidate Delivery Slices

- [List provisional, unnumbered outcomes only; `/10-Define` owns final splitting and Running ID allocation]

## 11. Decision

- Status: [Proceed / Defer / Reject / Pending]
- Rationale: [Evidence supporting the decision]

## 12. AI Actions Performed

- [List concrete actions such as routing, synthesizing evidence, or updating the decision]

## 13. Human Review Required

- Confirm the selected route and returned evidence
- Confirm `Proceed`, `Defer`, or `Reject`
- Confirm no Running ID has been allocated during Discover

## 14. Approval Status

- Pending

## 15. Next Allowed Command

- [Selected companion command, `/10-Define {discovery_id}` after approved Proceed, or `None` for Defer/Reject]

## 16. Nexus Event

- `grill-with-docs` when clarification could change the decision
- `prototype` when runnable evidence is needed

## 17. Allocated Runs

- [Updated by `/10-Define`; keep empty during Discover]

## 18. Change Log

- {Date}: Initial discovery draft created

## 19. Additional Notes

- Add any extra headings below this section when useful.

