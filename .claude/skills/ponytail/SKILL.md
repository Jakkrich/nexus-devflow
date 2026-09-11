---
name: ponytail
description: "[devflow] Lazy senior dev mode & YAGNI optimization orchestrator. Cuts ~54% code bloat, tokens, and unnecessary dependencies via the 7-step Decision Ladder. Includes 5W1H Playbook, intensity modes (lite, full, ultra), and auto-bypass safety for UI/frontend tasks. JIT resources in devflow/.vendor/ponytail/."
argument-hint: "[lite|full|ultra|audit|debt|help]"
---

# 🪓 ponytail - Lazy Senior Dev Mode & YAGNI Optimization Orchestrator

$ARGUMENTS

`ponytail` is the code simplification and YAGNI optimization engine in Nexus-DevFlow, bringing the senior developer mindset (*"The best code is the code you never wrote"*) into your development lifecycle with **Zero Token Bloat** and **Strict UI Aesthetic Safeguards**.

---

## ⚠️ Pre-Flight Check (Knowledge Base Availability)

Before executing any Ponytail optimization or JIT inspection:
1. **Check if `devflow/.vendor/ponytail/` exists in this project using your file inspection tool**.
2. **If `devflow/.vendor/ponytail/` is MISSING / NOT INSTALLED**:
   - Inform the user in their configured communication language (Thai default):
     - State clearly that the Ponytail upstream repository is not yet downloaded in this project.
     - Provide the installation command:
       ```bash
       npx @jakkrichm/create-nexus-devflow skill add ponytail
       ```
     - Offer to run the installation command on their behalf.
   - Stop and wait for installation before proceeding.
3. **If `devflow/.vendor/ponytail/` is PRESENT**:
   - Proceed with the Decision Ladder, Guardrails, and Execution Flow below.

---

## 🎨 UI/Frontend Auto-Bypass Safety Guardrail (CRITICAL)

> [!IMPORTANT]
> **Aesthetic Protection Gate**:
> If the current task involves **Web Frontend, UI Components, Styling (`.css`, `.scss`, `.tsx`, `.vue`, `.html`), or `/prototype`**:
> - **AUTO-BYPASS PONYTAIL**: Immediately disable Ponytail.
> - **PRESERVE RICH AESTHETICS**: Never strip micro-animations, glassmorphism, modern typography, or rich UI components.
> - **REASON**: Prevents the agent from reverting to raw unstyled HTML (e.g., `<input type="date">`), violating the project's premium aesthetic standards.

---

## 🪜 The 7-Rung Decision Ladder

When working on **Backend Logic, Algorithms, CLI, Data Processing, `/fix`, `/debug`, or `/implement` (Non-UI)**, stop at the earliest rung that solves the requirement:

```text
1. Does this need to exist at all?  ➔ YAGNI: If it is speculative future-proofing, skip and record brief rationale.
2. Already in this codebase?        ➔ Reuse: Search existing utils/helpers/types. Never duplicate.
3. Standard library does it?        ➔ Stdlib: Always prefer Node.js / runtime built-in modules.
4. Native platform covers it?       ➔ Platform: Use platform features (e.g., DB constraints) instead of app logic.
5. Installed dependency solves it?  ➔ Deps: Use installed packages. Do not add npm packages for trivial code.
6. Can this be one line?            ➔ One-liner: Collapse to a single line if readable and safe.
7. Only then: minimum that works    ➔ Code: Write the minimum viable code that is correct and tested.
```

### Senior Bug Fixing Mandate (`/fix` & `/debug`)
- **Root Cause over Symptom**: When diagnosing a bug, find all callers of the affected function. Fix once at the shared source instead of patching individual call sites.

---

## 🎚️ Intensity Modes

| Mode | Trigger | Behavior |
| :--- | :--- | :--- |
| **lite** | `/ponytail lite` | Gentle nudge: prevents unnecessary external libraries and redundant abstractions. |
| **full** | `/ponytail` or `/ponytail full` | *(Default)* Strictly enforce Decision Ladder: eliminates single-implementation boilerplate. |
| **ultra** | `/ponytail ultra` | Maximum minimalism for refactoring/code golfing: fewest files, shortest diffs, net negative lines. |
| **audit** | `/ponytail audit` | Scans for over-engineering, dead code, and bloated dependencies (per `devflow/.vendor/ponytail/skills/ponytail-audit/`). |
| **debt** | `/ponytail debt` | Assesses technical debt from superfluous abstractions (per `devflow/.vendor/ponytail/skills/ponytail-debt/`). |

---

## 📖 Universal Contextual Help & Playbook Protocol (`help`, `--help`, `-h`, `?`)

When invoked with `/ponytail help`, `ponytail --help`, or `/ponytail -h`:
1. **Execution Safety Gate**: Do not edit code or apply transformations.
2. **5W1H Framework Presentation**: Render the 5W1H guide in chat.
3. **HTML Playbook Generation**: Generate or update the styled HTML report at:
   `devflow/docs/playbooks/ponytail.html`
4. Conclude with: `"Help menu displayed successfully"`
