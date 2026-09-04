# Requirement Specification: ซิงก์ส่วนขยาย Upstream AI Blueprint (v1.5.3 / Latest Commits)

> **Request ID**: `REQ-20260904-001-sync-upstream-ai-blueprint`  
> **Source**: Upstream Repository `aiblueprinthq/ai-blueprint` (Commits `b4eb32e` .. `2b5f334`)  
> **Ingested Date**: 2026-09-04  
> **Target Run ID**: `072` (Feature)  
> **Language**: Thai (`th`) Default

---

## 📌 Executive Summary

สกัดและวิเคราะห์การเปลี่ยนแปลงล่าสุดจากต้นน้ำ (Upstream `ai-blueprint`) หลังการซิงก์รอบ v1.5.2 (Run `071`) โดยพบการอัปเดตสำคัญระดับสถาปัตยกรรมและกระบวนการ Onboarding ใน commit `b4eb32e` (fix: honor selected adapters) พร้อมทั้งการปรับปรุงเอกสารและ Diagram ใน commit `ed9c19c`, `a231195`, `2b5f334` 

หัวใจหลักของการอัปเดตครั้งนี้คือการทำให้ขั้นตอน `/onboard` มีความฉลาดในการอ่านและยึดถือรายการ Adapter จากไฟล์ Manifest (`.nexus/nexus-devflow.json` หรือ `devflow/.state/manifest.json`) เป็นความจริงหลัก (Authoritative Source of Truth) เพื่อแก้ปัญหาที่ Onboard เคยเดาเอาเองว่าการมีโฟลเดอร์ `.agents/` แปลว่าผู้ใช้เลือกเครื่องมือทุกตัว (Codex, Antigravity, GitHub Copilot, OpenCode) และถามผู้ใช้ซ้ำซ้อน

---

## 👥 Target Personas & User Stories

1. **ผู้ใช้ใหม่ที่ติดตั้ง DevFlow ด้วย Interactive Installer**:
   - *As a developer* ติดตั้ง DevFlow ด้วยคำสั่ง `npx @jakkrichm/create-nexus-devflow` และเลือกเฉพาะ Claude Code และ Antigravity/Codex
   - *I want* เมื่อรันคำสั่ง `/onboard` ให้ระบบจำการเลือกของฉันจาก Manifest โดยตรง
   - *So that* AI จะไม่ถามซ้ำ และไม่ทึกทักไปเองว่าเราเลือก GitHub Copilot หรือ OpenCode เพิ่มขึ้นมา

2. **ผู้ใช้เดิมที่รัน Onboard โดยไม่มี Manifest (Legacy / Manual Copy)**:
   - *As a developer* ที่คัดลอกไฟล์มาเองหรือไม่มี Manifest
   - *I want* AI อธิบายชัดเจนว่าโครงสร้าง `.agents/` ใช้ร่วมกันได้หลายเครื่องมือ แล้วถามยืนยันว่าใช้เครื่องมือใดบ้าง
   - *So that* รายงาน Onboarding ถูกต้องตรงกับสิ่งที่ใช้งานจริง

3. **Core Framework Maintainer**:
   - *As a maintainer* ของ Nexus-DevFlow
   - *I want* ระบบ E2E Test มี Scenario ตัวที่ 10 (`adapter-selection.ts`) และ Static Contract Validator ป้องกัน Regression
   - *So that* ฟีเจอร์ Onboard Manifest Preservation ทำงานถูกต้อง 100% ตามมาตรฐาน Upstream

---

## ⚙️ Functional Requirements (FR)

- **FR-1: Manifest-Aware Adapter Inspection ใน `/onboard` (Step 1)**
  - เพิ่มการอ่านไฟล์ `devflow/.state/manifest.json` หรือ `.nexus/nexus-devflow.json` ในขั้นตอน Preflight/Inspection เพื่อดึง `adapters` list
- **FR-2: Authoritative Selection & No Repeated Prompts ใน `/onboard` (Step 6)**
  - เมื่อพบ Manifest ที่ถูกต้อง ให้ยึด `adapters` ใน Manifest เป็นหลัก ห้ามถามผู้ใช้ซ้ำ
  - อธิบายว่าการมีอยู่ของ `.agents/` ไม่ได้หมายความว่าเลือกเครื่องมือทุกตัว
  - หากไม่มี Manifest ให้ถามอย่างชัดเจนโดยไม่เดา
- **FR-3: Dual-Adapter Contract Synchronicity**
  - ปรับปรุงเนื้อหาใน `.agents/skills/onboard/SKILL.md` และ `.claude/skills/onboard/SKILL.md` ให้ตรงกัน 100%
- **FR-4: Automated E2E Scenario Integration**
  - เพิ่มชุดทดสอบ E2E Scenario `scripts/e2e/scenarios/adapter-selection.ts` ตรวจสอบพฤติกรรม Onboard กับ Manifest
- **FR-5: Static Verification Guardrails**
  - อัปเดต `agent-bundle.manifest.json` และ `scripts/validate-framework.ts` ให้ตรวจจับ Contract ใหม่ของ Onboard

---

## 🛡️ Non-Functional Requirements (NFR)

- **Context Budget**: Skill Description และ Instruction ต้องไม่เกินขีดจำกัด Context Budget (< 400 ตัวอักษรต่อคำอธิบาย, ไม่ทำให้ไฟล์เกิน 20KB)
- **Zero Breaking Change**: รักษาความเข้ากันได้กับโปรเจกต์เดิมที่มีหรือไม่มี Manifest
- **Cross-Tool Parity**: รองรับ Codex, Antigravity, Claude Code, GitHub Copilot และ OpenCode
