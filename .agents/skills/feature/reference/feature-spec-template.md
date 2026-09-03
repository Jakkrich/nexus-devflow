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
{คำอธิบายปัญหาและที่มาของความจำเป็นในการพัฒนาฟีเจอร์นี้}

### 1.2 In-Scope
1. {ขอบเขตการทำงานข้อที่ 1}
2. {ขอบเขตการทำงานข้อที่ 2}

### 1.3 Out-of-Scope
- {สิ่งที่อยู่นอกเหนือขอบเขตหรือไม่ทำในรอบนี้}

### 1.4 Acceptance Criteria (เกณฑ์การยอมรับ)
- [ ] **AC-1**: {เกณฑ์การตรวจรับข้อที่ 1}
- [ ] **AC-2**: {เกณฑ์การตรวจรับข้อที่ 2}

---

## 2. Plan & Test Strategy

### 2.1 Files Modified / Created
- `{file-path}` [NEW | MODIFY | DELETE]

### 2.2 Quality Gates & Sensitivity Check
- **Quality Gate Policy (`independentReview`)**: `manual` | `always` | `when-sensitive`
- **UI Evidence / Browser Tests**: {Not applicable | Playwright / BrowserOS Neo}
- **Review Strategy**: One feature-level review packet at completion

### 2.3 Test Decision: Required (TDD) | Optional
- **Rationale**: {เหตุผลความจำเป็นในการเขียน Unit Tests / TDD}

---

## 3. Implementation Checklist (Strict TDD)

- [ ] **Task 1: {หัวข้องานที่ 1}**
  - [ ] 1.1 `[TDD-Red]`: {เขียน Test เคสล้มเหลว}
  - [ ] 1.2 `[TDD-Green]`: {เขียนโค้ดขั้นต่ำเพื่อให้ Test ผ่าน}
  - [ ] 1.3 `[TDD-Refactor]`: {Refactor และตรวจให้ 100% Tests Green}

- [ ] **Task 2: {หัวข้องานที่ 2}**
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
- **Findings Ledger**: ตรวจสอบ `findings.md` สะอาด 100%

### 🎯 Axis 2: Spec Fidelity & Behavioral Acceptance Gate
- [ ] **AC-1**: {หลักฐานการผ่านเกณฑ์ข้อที่ 1}
- [ ] **AC-2**: {หลักฐานการผ่านเกณฑ์ข้อที่ 2}

---

## 5. Delivery Verification & Independent Receipt

- **Delivery Date**: TBD
- **Verification Verdict**: TBD
- **Framework Tests**: TBD
- **Static Contract**: TBD
- **Package Smoke Test**: TBD
