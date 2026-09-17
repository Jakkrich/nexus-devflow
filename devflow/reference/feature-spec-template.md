# 📐 [{xxx-slug}] {title}

> **Status**: In-Progress  
> **Track**: Fast-Track (Task-Isolated Living Spec Mode - Feature)  
> **Category**: Feature  
> **Source**: `devflow/build-plan.md: Feature {n}` & `devflow/discoveries/{DISC-ID}/discovery.md`  
> **Branch**: `feature/{xxx-slug}`  
> **Started Date**: {YYYY-MM-DD}  
> **Delivered Date**: TBD  
> **Owner**: DevFlow Core Framework Team & AI  

---

## 1. Specification & Scope

### 1.1 Problem Statement
{Description of the problem, background, and rationale for developing this feature}

### 1.2 In-Scope
1. {In-scope item 1}
2. {In-scope item 2}

### 1.3 Out-of-Scope
- {Items deliberately excluded or deferred to future features}

### 1.4 Acceptance Criteria
- [ ] **AC-1**: {Acceptance criterion 1}
- [ ] **AC-2**: {Acceptance criterion 2}

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `{file-path}` [NEW | MODIFY | DELETE]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `manual` | `always` | `when-sensitive`
- **UI Evidence / Browser Tests**: {Not applicable | Playwright / BrowserOS Neo}
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD) | Optional
- **Rationale**: {Reason for requiring Unit Tests / TDD}

---

## 3. Implementation Checklist (Strict TDD)

- [ ] **Task 1: {Task 1 title}**
  - [ ] 1.1 `[TDD-Red]`: {Write failing unit or behavioral test}
  - [ ] 1.2 `[TDD-Green]`: {Write minimal implementation to pass test}
  - [ ] 1.3 `[TDD-Refactor]`: {Refactor and ensure 100% tests green}

- [ ] **Task 2: {Task 2 title}**
  - [ ] 2.1 `[TDD-Red]`: ...
  - [ ] 2.2 `[TDD-Green]`: ...
  - [ ] 2.3 `[TDD-Refactor]`: ...

---

## 4. Verification Evidence Matrix

### ⚖️ Axis 1: Standards, Architecture & Quality Gate
- **Type Safety & Build Integrity**: TBD
- **Automated Test Matrix**: TBD
- **Static Contract Verification**: TBD
- **Package Smoke Test**: TBD
- **Findings Ledger**: Verify `findings.md` is 100% clean

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [ ] **AC-1**: {Empirical proof for AC-1}
- [ ] **AC-2**: {Empirical proof for AC-2}

### 🔗 Axis 3: AC-to-Test Traceability Matrix

| Acceptance Criterion | File Tier | Automated Test Case / Assertion | Verification Command | Status |
| :--- | :--- | :--- | :--- | :---: |
| **AC-1** | Tier 1 (Logic) / Tier 2 (UI) | `it('AC-1: ...')` | `npm test` | ⏳ Pending |
| **AC-2** | Tier 3 (API) / Tier 4 (Tooling) | `it('AC-2: ...')` | `npm run check:static` | ⏳ Pending |


---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: TBD
- **Verification Verdict**: TBD
- **Framework Tests**: TBD
- **Static Contract**: TBD
- **Package Smoke Test**: TBD
