---
description: Spec Research - Validate external integrations, APIs, libraries, services, and implementation constraints before planning.
---

# Phase 15: Spec Research

## Topic: $ARGUMENTS

Use this workflow when requirements mention external dependencies, APIs, SDKs, databases, cloud services, auth providers, payment systems, browser tooling, or other integrations that must be verified before implementation.

## Prompt Source

Adapted from:

- `spec_researcher.md`
- `mcp_tools/api_validation.md`
- `mcp_tools/database_validation.md`
- `mcp_tools/electron_validation.md`
- `mcp_tools/puppeteer_browser.md`

## Process

### 1. Load Context

- Read the relevant `requirements.json`, `spec.md`, PRD, or user request.
- Identify every external dependency, integration, API, package, platform, and service.
- If the topic belongs to an existing task, inspect `.workspaces/specs/{ID}-*/`.

### 2. Research And Verify

- Prefer official documentation for APIs, libraries, and SDKs.
- For changing or current information, browse and cite sources.
- Record package names, install commands, imports, initialization patterns, config requirements, auth requirements, rate limits, and gotchas.
- Separate confirmed facts from assumptions.

### 3. Produce Research Output

Save or summarize research under `.workspaces/research/` when the result is reusable.
**MANDATORY:** Before generating a reusable markdown research file, inspect `.agent/resources/schemas/spec_research.template.md` and use its required headings and table structure.

Recommended file name:

```text
.workspaces/research/{date}-{slug}-spec-research.md
```

If this research belongs to a task, update task artifacts with script-first commands when practical:

```powershell
npm run agent -- artifact:append {ID} context files_to_reference "{source_or_doc_url}"
npm run agent -- artifact:append {ID} requirements constraints "{verified_constraint}"
npm run agent -- validate {ID}
```

## Output

Return:

- researched integrations
- confirmed implementation constraints
- relevant source links
- risks and unknowns
- recommended next step: `/12-PRD`, `/30-Task`, or `/31-Plan`
