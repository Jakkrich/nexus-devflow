# SA Requirement Ingestion & Socratic Grill Reference

Use this reference from `/discovery` Mode 3 (SA Intake, raw documents, `REQ-ID`, or `--grill` / legacy `/analyze` & `/grill`).

## Part A: Multi-Format Requirement Ingestion (`REQ-YYYYMMDD-NNN`)

When the input is raw stakeholder requirements, chat transcripts, or files (PDF, DOCX, XLSX, CSV, images/wireframes, or unassigned files in `devflow/inbox/`):

1. **Allocate REQ-ID & Workspace**:
   - Allocate sequential `REQ-YYYYMMDD-NNN-{slug}` (or resume an existing `REQ-ID`).
   - Create `devflow/inbox/{REQ-ID}/raw/` and copy/archive incoming source files inside it.
2. **Parse & Normalize (`devflow/inbox/{REQ-ID}/parsed.md`)**:
   - For Office/PDF docs: use native document/multimodal inspection, or optional extension `convert-any-to-md` (`npx nexus-devflow skill add convert-any-to-md`) if needed.
   - For URLs / Confluence / Notion: use an active web-fetch/browser reader when available.
   - For images / wireframes: perform Multimodal Vision OCR and describe layout and fields.
   - Structure `parsed.md` into: **Executive Summary**, **Target Persona & User Stories**, **Functional Requirements (FR)**, **Non-Functional Requirements (NFR)**, and **Data Entities & Fields**.
3. **Codebase Impact & Blast Radius (`devflow/analysis/{REQ-ID}/codebase-impact.md`)** *(brownfield repos)*:
   - Search existing models, services, routes, and contracts using `grep_search` / `rg`.
   - Record affected files, API/contract breaking risks, and Complexity Rating (`Low` | `Medium` | `High` | `Extreme`).
4. **Socratic Gap Detection (`devflow/inbox/{REQ-ID}/clarifications.md`)**:
   - Flag missing edge cases, ambiguous business rules, and authorization/PII/security boundaries into an actionable stakeholder clarification checklist.

## Part B: Interactive Socratic Grill & Immediate State Persistence

When ambiguities remain or `--grill` / alignment is requested:

1. **Codebase-Grounded First**: Inspect `devflow/context/project-overview.md`, `devflow/context/coding-standards.md`, existing `devflow/context/glossary.md`, and code patterns before asking anything. Never ask what the codebase already answers.
2. **One Round at a Time**: Ask **1–2 focused, high-leverage questions maximum per turn** across critical branches (Domain Language, Data Flow & Ownership, Edge Cases, Irreversible Trade-offs), always offering a recommended default with concise rationale.
3. **Immediate State Persistence**:
   - **Domain Glossary (`devflow/context/glossary.md`)**: Append resolved terms immediately using:
     ```markdown
     ### [Term / Concept]
     - **Definition**: Clear definition within this project.
     - **Constraints**: Invariants, boundaries, or lifecycle rules.
     - **Aliases / Related**: Related terms or common misnomers.
     ```
   - **Architecture Decision Records (`devflow/decisions/ADR-xxx-{slug}.md`)**: Record hard-to-reverse decisions that affect architecture, schema, security, or public APIs with sequential ID (`ADR-001`, ...), `Status: Accepted | Assumed` (include Assumption Metadata if `Assumed`), Context, Decision, Alternatives Considered, and Consequences.
4. **Handoff**: When resolved, summarize settled terms/ADRs and recommend `/feature {REQ-ID}` (or continue Mode 2 Micro Discovery if further exploration is needed).
