---
name: analyze
description: "[devflow] Unified SA requirement ingestion, multi-format doc parsing (PDF, Word, Excel, images, text), codebase impact scan, and Socratic clarification checklist."
argument-hint: "[{file-path, raw requirement text, or REQ-ID}]"
---

# analyze - SA Requirement Ingestion & Codebase Impact Analysis

$ARGUMENTS

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

`/analyze` is the flagship System Analyst (SA) entry point in Nexus-DevFlow. It ingests messy, multi-format requirements, auto-allocates an isolated Request Workspace, normalizes raw content into structured Markdown, scans codebase impact (for existing systems), and generates a Socratic clarification checklist before system design.

---

## Invocations & Usage

```text
# 1. Ingest specific file from any path (PDF, DOCX, XLSX, Image, CSV, Text)
/analyze C:\Users\...\Downloads\customer-spec.pdf
/analyze ./mockup.png ./schema.xlsx "Loyalty point system"

# 2. Ingest raw text or requirement from chat
/analyze "Customer requested 0% installment plan connected to KBank Payment Gateway..."

# 3. Scan pending unassigned files in devflow/inbox/
/analyze

# 4. Resume analysis on an existing Request ID
/analyze REQ-20260903-001
```

---

## 4-Step Analysis Execution Pipeline

```text
[Multi-format Input] ──▶ 1. Auto-Allocate & Ingest ──▶ 2. Parse & Normalize 
                                                              │
                                                              ▼
[Clarification Checklist] ◀── 4. Socratic Gap Scan ◀── 3. Codebase Impact Scan
```

---

## Step 1: Auto-Allocate Workspace & Ingestion (Frictionless Ingest)
1. **Allocate REQ-ID**: Generate sequential ID format `REQ-YYYYMMDD-NNN` (e.g. `REQ-20260903-001-point-system`).
2. **Create Request Workspace**:
   ```text
   devflow/inbox/{REQ-ID}/
   ├── raw/                # Original source files (PDF, Word, Excel, Images, Email)
   ├── parsed.md           # Extracted structured text/tables (Clean Markdown)
   └── clarifications.md   # Questions and clarifications checklist for stakeholders
   ```
3. Copy or save incoming files into `devflow/inbox/{REQ-ID}/raw/`.

---

## Step 2: Parse & Normalize Requirement (`parsed.md`)
1. Extract text and tables from all raw files:
   - For Office/PDF docs: Invoke `convert-any-to-md` or document extractor.
   - For Web URLs / Confluence / Notion: Invoke `defuddle`.
   - For Images / Wireframes / Screenshots: Conduct Multimodal Vision OCR and describe layout and fields.
2. Structure into `devflow/inbox/{REQ-ID}/parsed.md`:
   - **Executive Summary**: Core purpose and business objective of the requirement
   - **Target Persona & User Stories**: Who performs what action and why
   - **Functional Requirements (FR)**: List of functions and business rules
   - **Non-Functional Requirements (NFR)**: Performance, Security, PDPA/Privacy, Data Retention
   - **Data Entities & Fields**: Data fields, schemas, and initial types

---

## Step 3: Codebase Impact & Blast Radius Analysis (`codebase-impact.md`)
*(Execute when operating on an existing system / brownfield codebase)*

1. Search codebase patterns using `grep_search`, `rg`, and AST analysis for affected models, controllers, APIs, and routes.
2. Calculate **Blast Radius & Complexity Score**:
   - **Affected Files & Modules**: List of files to be modified or newly created
   - **API & Contract Breaking Risk**: Check if existing APIs or third-party contracts are impacted
   - **Complexity Rating**: `Low` | `Medium` | `High` | `Extreme` with rationale
3. Save analysis report to `devflow/analysis/{REQ-ID}/codebase-impact.md`.

---

## Step 4: Socratic Gap Detection & Clarification Checklist (`clarifications.md`)
1. Apply `grilling` and `domain-modeling` lenses to detect gaps:
   - **Missing Edge Cases**: Boundary conditions, error states, network drops, concurrent requests
   - **Ambiguous Business Rules**: Unclear policies, unspecified SLAs, or undefined workflows
   - **Security & Authorization**: Role definitions, access permissions, personal identifiable data (PII)
2. Generate an actionable checklist in `devflow/inbox/{REQ-ID}/clarifications.md` for the SA to take directly into stakeholder meetings.

---

## Output Artifacts Summary

| Artifact | Location | Purpose |
| :--- | :--- | :--- |
| **Raw Files** | `devflow/inbox/{REQ-ID}/raw/` | Archived original files |
| **Parsed Spec** | `devflow/inbox/{REQ-ID}/parsed.md` | Clean structured Markdown requirements |
| **Impact Report** | `devflow/analysis/{REQ-ID}/codebase-impact.md` | Codebase blast radius & complexity score |
| **Clarifications** | `devflow/inbox/{REQ-ID}/clarifications.md` | Socratic questions for stakeholders |

---

## Next Workflow Step

Once analysis is reviewed and gaps are aligned, proceed to **System Design & Acceptance Test Matrix**:
```bash
/design {REQ-ID}
```
