---
description: Spec Research - Validate external integrations, APIs, libraries, services, and implementation constraints before planning.
---

# Phase 15: Spec Research

## Topic: $ARGUMENTS

Use this workflow when requirements mention external dependencies, APIs, SDKs, databases, cloud services, auth providers, payment systems, browser tooling, or other integrations that must be verified before implementation.

In DevFlow 2.0, this is a supporting workflow. It should strengthen `Discover`, `Define`, `Spec`, or `Verify`, not replace them.

Primary behavior now lives in:

```text
.agent/skills/spec-research/SKILL.md
```

Treat this workflow file as a compatibility wrapper around that skill.

## Prompt Source

Adapted from:

- `spec_researcher.md`
- `mcp_tools/api_validation.md`
- `mcp_tools/database_validation.md`
- `mcp_tools/electron_validation.md`
- `mcp_tools/puppeteer_browser.md`

## Process

### 1. Load Context

- Read the most relevant stage artifacts first:
  - `00-discover.md`
  - `10-define.md`
  - `20-spec.md`
  - `50-verify.md`
  - PRD or direct user request
- Identify every external dependency, integration, API, package, platform, and service that could affect implementation or delivery risk.
- If the topic belongs to an existing running ID, inspect `.workspaces/specs/{ID}-*/`.
- Read legacy JSON only when migration context still requires it.

### 2. Research And Verify

- Prefer official documentation for APIs, libraries, SDKs, and managed services.
- For changing or current information, browse and cite sources.
- Record:
  - package or service names
  - install commands
  - imports and initialization patterns
  - config requirements
  - auth requirements
  - quotas, rate limits, or pricing constraints when relevant
  - environment assumptions
  - gotchas and incompatibilities
- Separate confirmed facts from assumptions or inferred recommendations.
- If a capability cannot be verified, say so explicitly rather than smoothing over uncertainty.

### 3. Produce Research Output

Save or summarize research under `.workspaces/research/` when the result is reusable.

**MANDATORY:** Before generating a reusable markdown research file, inspect `.agent/resources/schemas/spec_research.template.md` and use its required headings and table structure.

Before reporting completion, run:

Review `{report_path}` against `spec_research.template.md`, keep the required headings, and remove placeholder text before completion.

Replace any placeholder or template text with verified sources, package details, constraints, and follow-up tasks.

Recommended file name:

```text
.workspaces/research/{date}-{slug}-spec-research.md
```

If the research belongs to a running ID, mirror only the minimum necessary context into the current stage markdown files instead of treating JSON as the primary contract.

### 4. Map Research To The Right Stage

Route the result back into the Timeline flow:

- `/00-Discover` when the research changes problem framing
- `/10-Define` when the research changes scope or decisions
- `/20-Spec` when the delivery contract needs verified constraints
- `/50-Verify` when the research is validating an implementation choice or release risk

## Output

Return:

- researched integrations
- confirmed implementation constraints
- relevant source links
- risks, unknowns, and blockers
- the exact recommended next stage or companion command

## Relationship To DevFlow 2.0

- Classification: Companion command
- Mainline status: Not a numbered stage
- Typical entry points: `/20-Spec`, `Spec-Orchestrate`, `Issue-Triage`
- Typical handoff targets: `/20-Spec`, `PRD`, `Competitor`, `Spec-Orchestrate`

## Sources

- `AGENTS.md`
- `.agent/skills/spec-research/SKILL.md`
- `.agent/resources/schemas/spec_research.template.md`
- Related commands: `/20-Spec`, `Research`, `PRD`, `Competitor`, `Spec-Orchestrate`


