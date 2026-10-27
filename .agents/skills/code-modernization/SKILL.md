---
name: code-modernization
description: "[devflow] Guided legacy codebase modernization (Assessment, Business Rules mining, Uplift, Rewrite & Byte-for-byte Proof). Use for /code-modernization, /modernize, legacy code upgrades, or architectural rebuilds."
argument-hint: "[<system-name> | <legacy-path>] [--source <path>] [--track <uplift|transform|reimagine>]"
---

# 🚀 code-modernization - Guided Legacy Modernization Orchestrator

$ARGUMENTS

**Aliases:** `/code-modernization`, `/modernize`

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

`code-modernization` is the flagship modernization orchestrator in Nexus-DevFlow, bringing the complete power of Anthropic's **Official Code Modernization Plugin** directly into your project with **Zero Cognitive Load**.

The user does **NOT** need to memorize 13 sub-commands or track complex manual steps. This skill serves as an **Autonomous State Machine & Interactive Guide**: it inspects the current state, handles the next logical phase, and asks questions only at required human decision gates.

---

## ⚠️ Pre-Flight Check (Vendor Knowledge Base Availability)

Before executing any modernization task:
1. **Check if `devflow/.vendor/code-modernization/` exists in this project**.
2. **If MISSING / NOT INSTALLED**:
   - Inform the user in Thai (per project rules):
     *"คลังความรู้และเครื่องมือ `code-modernization` ยังไม่ได้ติดตั้งในโปรเจกต์นี้"*
   - Provide the exact installation command:
     ```bash
     npx nexus-devflow skill add code-modernization
     ```
   - Offer to run the installation on their behalf and wait for completion.
3. **If PRESENT**:
   - Proceed to the State Machine & Guided Execution below.

---

## 🧭 The Guided 8-Phase Lifecycle & Python Engine

```text
Step 0: INTENT  ──▶ Step 1: PREFLIGHT ──▶ Step 2: ASSESS ──▶ Step 3: MAP
       │                                                         │
       ▼                                                         ▼
Step 8: HARDEN  ◀── Step 7: VERIFY   ◀── Step 6: BUILD  ◀── Step 4 & 5: RULES & BRIEF
  (Security)         (Proof Engine)     (Uplift/Transform)      (Approval Gates)
```

| Phase | What Happens | Output Artifact | AI Specialist Agent / Python Script |
| :--- | :--- | :--- | :--- |
| **0. Intent** | Gathers goals, constraints, and registers source | `analysis/<sys>/INTENT.md` | Front-door wizard |
| **1. Preflight** | 5 Human questions, sanity build check | `analysis/<sys>/PREFLIGHT.md` | `commands/modernize-preflight.md` |
| **2. Assess** | Tech inventory, complexity, debt, security | `analysis/<sys>/ASSESSMENT.md` | `agents/legacy-analyst.md` |
| **3. Map** | Dependencies, dataflows, entry points | `analysis/<sys>/MAP.html` / `.md` | `commands/modernize-map.md` |
| **4. Extract Rules** | Business rules mined as Given/When/Then | `analysis/<sys>/RULES.md` | `agents/business-rules-extractor.md` + `render_rules.py` |
| **4b. Review** | Human validates / corrects suspicious rules | Updated `RULES.md` | **Human Gate 1** |
| **5. Brief** | Phased modernization plan approved by human | `analysis/<sys>/BRIEF.md` | `agents/architecture-critic.md` (**Human Gate 2**) |
| **6. Build** | Track A (Uplift), Track B (Transform), or Track C (Reimagine) | `modernized/` code | `agents/uplift-migrator.md` or `scaffolder.md` |
| **7. Verify** | Clean tests, byte-for-byte comparison & canaries | `analysis/<sys>/PROOF.md` | `scripts/proof_pack.py` + `compare.py` (**Human Gate 3**) |
| **8. Harden** | Legacy CVE scan & reviewed security patch | `analysis/<sys>/HARDENING.md` | `agents/security-auditor.md` |

Every phase automatically refreshes **`analysis/<sys>/REPORT.html`** using:
```bash
python devflow/.vendor/code-modernization/scripts/build_report.py analysis/<system-name>
```

---

## 🤖 Adaptive State Machine Execution Protocol

Whenever `/code-modernization` or `/modernize` is invoked:

### Step 1: Detect System & Active State
1. Parse arguments: `<system-name>` or `--source <path>`.
2. Inspect `analysis/` and `legacy/`:
   - If no systems exist: Initiate **Phase 0: Intent Wizard**.
   - If one system exists: Automatically resume that system.
   - If multiple systems exist and none specified: Ask the user which system to work on using `ask_question`.

### Step 2: Evaluate Pipeline Progress
Check which artifacts exist in `analysis/<system>/`:
- **No `INTENT.md`**: Run **Phase 0: Intent Wizard** (see below).
- **Has `INTENT.md` but no `PREFLIGHT.md`**: Run **Phase 1: Preflight Environment Check**.
- **Has `PREFLIGHT.md` but no `ASSESSMENT.md`**: Run **Phase 2: Codebase Assessment**.
- **Has `ASSESSMENT.md` but no `MAP.md`**: Run **Phase 3: Architecture & Dataflow Map**.
- **Has `MAP.md` but no `RULES.md`**: Run **Phase 4: Business Rules Mining**.
- **Has `RULES.md` but no `BRIEF.md`**: Present **Human Gate 1 (Rule Validation)** and generate **Phase 5: Brief**.
- **Has `BRIEF.md` but no Modernized code**: Check if Brief is approved (**Human Gate 2**). If approved, execute **Phase 6: Build** (Uplift/Transform/Reimagine).
- **Has Modernized code but no `PROOF.md`**: Run **Phase 7: Independent Proof Engine** (`scripts/proof_pack.py`).
- **Has `PROOF.md`**: Present **Proof Verdict (PROVEN / NOT PROVEN)** and offer **Phase 8: Security Hardening** or DevFlow Delivery Completion (`/complete`).

---

## 👥 The 6 Human Decision Gates (ด่านหน้าถามแทน)

When reaching a decision point, use the `ask_question` tool in Antigravity IDE (or interactive modal):

1. **Preflight Intent**:
   - Question: *What is your goal for this codebase?*
     - Option 1: `(Recommended) Understand it first: map it and list business rules`
     - Option 2: `Move to a newer version of the same technology (Uplift)`
     - Option 3: `Rewrite in a different technology, module-by-module (Transform)`
     - Option 4: `Rebuild from scratch on modern architecture (Reimagine)`
   - Question: *What must stay true?*
     - Option 1: `(Recommended) The old system keeps running during the move`
     - Option 2: `Behavior must match existing system byte-for-byte`
     - Option 3: `Focus on clean modern architecture over legacy quirks`
2. **Review Extracted Rules**:
   - Present suspicious rules discovered in `RULES.md` with file/line citations and ask:
     *"กฎธุรกิจนี้ถูกต้องตาม Business Logic หรือเป็น Bug เดิมของระบบเก่า?"*
3. **Approve Modernization Brief**:
   - Show the phased milestone plan from `BRIEF.md`. Nothing is built until approved.
4. **Select Implementation Track**:
   - Confirm target stack, compiler version, and frameworks.
5. **Accept Behavioral Differences**:
   - If `compare.py` detects byte differences (e.g. masked timestamps, floating point precision), ask whether to accept or fix.
6. **Sign-off & Security Patch**:
   - Final review of `REPORT.html` and option to apply legacy CVE hardening patches.

---

## 🐍 Python Automation Engine Reference

Execute scripts from `devflow/.vendor/code-modernization/scripts/` using Python 3:

```bash
# 1. Compile single-page interactive report
python devflow/.vendor/code-modernization/scripts/build_report.py analysis/<system>

# 2. Run byte-for-byte differential comparison
python devflow/.vendor/code-modernization/scripts/compare.py --old <legacy_out> --new <modern_out>

# 3. Calculate formal proof verdict (PROVEN / PARTLY PROVEN / NOT PROVEN)
python devflow/.vendor/code-modernization/scripts/proof_pack.py --analysis analysis/<system>

# 4. Render business rules cards
python devflow/.vendor/code-modernization/scripts/render_rules.py analysis/<system>/RULES.md
```

---

## 🔗 Integration with Nexus-DevFlow Core Lifecycle

- **Pre-Flight / Discovery**: Maps seamlessly to DevFlow `/discovery`. Architectural decisions record to `devflow/decisions/ADR-xxx.md`.
- **Approved Brief**: Translates directly into DevFlow's Master Build Plan (`devflow/build-plan.md`) and Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`).
- **Implementation**: Follows DevFlow's strict TDD Red-Green-Refactor discipline.
- **Verification**: Proof metrics from `proof_pack.py` embed into DevFlow's `/check` matrix and `findings.md`.
- **Archive**: Once `PROVEN`, wraps up with `/complete` and archives to `devflow/history/features/`.
