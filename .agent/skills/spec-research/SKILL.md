---
name: spec-research
description: Validate integrations, APIs, SDKs, libraries, and external constraints before planning or verification. Use when a requirement depends on outside systems or when implementation choices need source-backed confirmation.
---

# Spec Research

## Overview

This skill strengthens a stage artifact with verified external knowledge. It is not a replacement for the mainline stage; it is supporting evidence for Discover, Define, Spec, Plan, or Verify.

## When to Use

- The work depends on APIs, SDKs, libraries, cloud services, auth providers, browser tooling, or managed platforms
- A spec or plan has unresolved integration assumptions
- A verification step needs confirmation that an implementation choice matches official docs

## Process

### 1. Load The Owning Context

Read the minimum relevant stage artifacts first:

- `discover.md`
- `define.md`
- `spec.md`
- `verify.md`
- direct user request if stage files are not available

### 2. Research Official Sources

- prefer primary documentation
- collect configuration, setup, imports, auth requirements, quotas, limits, pricing constraints, and notable gotchas
- separate confirmed facts from inference

### 3. Produce Reusable Output

If the result is reusable, write it under:

```text
.workspaces/research/{date}-{slug}-spec-research.md
```

Use `.agent/resources/schemas/spec_research.template.md` when saving a reusable report.

### 4. Route Back To The Right Stage

- `/00-Discover` if the finding changes problem framing
- `/10-Define` if the finding changes scope
- `/20-Spec` if the delivery contract needs verified constraints
- `/50-Verify` if the finding validates or blocks an implementation choice

## Output

Return:

- integrations researched
- confirmed constraints
- source links
- unknowns and blockers
- exact recommended return stage
