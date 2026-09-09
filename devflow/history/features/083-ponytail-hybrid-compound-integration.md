# Feature: Ponytail Hybrid Compound-Vendor Integration

**From build-plan:** feature 33

> **Template Type**: Task-Isolated Living Spec
> **Active Location**: `devflow/context/083-ponytail-hybrid-compound-integration/spec.md`
> **Archive Location**: `devflow/history/features/083-ponytail-hybrid-compound-integration.md`

- **Feature ID**: `083-ponytail-hybrid-compound-integration`
- **Category**: `features`
- **Target Branch**: `feature/083-ponytail-hybrid-compound-integration`
- **Status**: `In-Progress`
- **Track**: `Unified Fast-Track`
- **Discovery Ref**: `devflow/discoveries/DISC-20260909-001-ponytail-skill-integration-eval/discovery.md`

---

## 🎯 1. Define & Boundaries

### Problem Statement & Goal
- **Problem**: โมเดล LLM มักเขียนโค้ดเยิ่นเย้อ (Over-Engineering), สร้าง Abstraction เกินความจำเป็น และแอบลง library ภายนอกซ้ำซ้อน ทำให้โค้ดบวมและเปลือง Token ในขณะที่ชุดสกิล `DietrichGebert/ponytail` มีศักยภาพในการตัดโค้ดส่วนเกินได้ถึง ~54% แต่หากติดตั้งเป็น Always-On จะขัดแย้งกับมาตรฐาน UI/UX ความพรีเมียมของระบบ
- **Goal**: ติดตั้ง `DietrichGebert/ponytail` ในรูปแบบ **Hybrid Compound-Vendor** (`type: "compound-knowledge"`) โดยโคลน upstream ลง `devflow/.vendor/ponytail/`, สร้าง Master Wrapper Skill (`.agents/skills/ponytail/` และ `.claude/skills/ponytail/`) พร้อม Auto-Bypass เมื่อทำงานสเตจ Frontend/UI, รองรับ Playbook 5W1H (`/ponytail help`), ลงทะเบียนใน `skill-registry-engine.ts`, และบันทึกใน `.nexus/nexus-devflow.json`

### In-Scope & Out-of-Scope
- **In-Scope**:
  - โคลนคลังต้นทาง `https://github.com/DietrichGebert/ponytail` เก็บไว้ที่ `devflow/.vendor/ponytail/`
  - เพิ่ม alias `ponytail` เป็น `type: "compound-knowledge"` ใน `packages/create-nexus-devflow/lib/skill-registry-engine.ts`
  - สร้าง Master Wrapper `.agents/skills/ponytail/SKILL.md` และ `.claude/skills/ponytail/SKILL.md` พร้อม 5W1H Playbook และ UI Guardrail
  - บันทึกการติดตั้งลงใน `.nexus/nexus-devflow.json` ภายใต้ `thirdPartySkills`
  - เพิ่ม Unit Tests ใน `skill-registry-engine.test.ts`
- **Out-of-Scope**:
  - ไม่เปิดเป็น Global Always-On Rule ใน `.agents/rules/` หรือ Global Hooks
  - ไม่ดัดแปลง source code ภายใน `devflow/.vendor/ponytail/` เพื่อให้รองรับ `git pull` อัปเดตได้ราบรื่น

### Quality-Gate Decision
- **Independent Review**: `when-sensitive` (Feature นี้เป็นการติดตั้ง Third-Party Skill และผสานเข้ากับ Skill Registry Engine ซึ่งถือเป็น Dependency/Skill Boundary ที่สำคัญ)

---

## 📐 2. Technical Spec & Contracts

### Acceptance Criteria (AC)
- [x] **AC-1**: `KNOWN_SKILL_ALIASES` ใน `skill-registry-engine.ts` มี `ponytail` ชี้ไปยัง `https://github.com/DietrichGebert/ponytail` โดยมี `type: "compound-knowledge"` และ `referencePath: "devflow/.vendor/ponytail"`
- [x] **AC-2**: `devflow/.vendor/ponytail/` มีไฟล์ครบถ้วน (`skills/`, `examples/`, `docs/`, `benchmarks/`, `README.md`)
- [x] **AC-3**: Master Wrapper `.agents/skills/ponytail/SKILL.md` และ `.claude/skills/ponytail/SKILL.md` มีเนื้อหาตรงตาม DevFlow Protocol (มี 5W1H Playbook, Intensity: lite/full/ultra, และ Auto-Bypass เมื่อเจอสเตจ/ไฟล์ UI)
- [x] **AC-4**: `.nexus/nexus-devflow.json` บันทึก `ponytail` ใน `thirdPartySkills` ถูกต้อง
- [x] **AC-5**: Automated Unit Tests และ Static Contract Check ผ่าน 100%

---

## 📋 3. Execution Plan & TDD Checklist

- [x] **Task 1: Upstream Vendor Cloning & Alias Configuration**
  - [x] 1.1 `[TDD-Red]` เขียน Unit Test ใน `skill-registry-engine.test.ts` ตรวจสอบ alias `ponytail` และการประมวลผล compound-knowledge
  - [x] 1.2 `[TDD-Green]` โคลน upstream repo เข้าสู่ `devflow/.vendor/ponytail/`
  - [x] 1.3 `[TDD-Green]` อัปเดต `packages/create-nexus-devflow/lib/skill-registry-engine.ts` เพิ่ม alias และ logic จัดการ compound knowledge
  - [x] 1.4 `[TDD-Refactor]` รัน unit test ให้ผ่าน 100%

- [x] **Task 2: Master Wrapper Skill Authoring & Multi-Adapter Sync**
  - [x] 2.1 `[TDD-Green]` สร้าง `.agents/skills/ponytail/SKILL.md` พร้อม 5W1H Playbook, UI Safety Guardrail และ JIT Reference
  - [x] 2.2 `[TDD-Green]` ซิงก์ไปยัง `.claude/skills/ponytail/SKILL.md`
  - [x] 2.3 `[TDD-Green]` อัปเดต `.nexus/nexus-devflow.json` บันทึก `ponytail` ใน `thirdPartySkills`

- [x] **Task 3: Verification & Playbook Generation**
  - [x] 3.1 `[TDD-Green]` ทดสอบ `/ponytail help` และตรวจสอบการสร้าง HTML Playbook ที่ `devflow/docs/playbooks/ponytail.html`
  - [x] 3.2 `[TDD-Green]` รัน `npm test` และ `npm run check:static` ยืนยันความสมบูรณ์

---

## ⚡ 4. Implementation Log & Evidence

- **Task 1 Evidence**:
  - เพิ่ม Unit test `recognizes ponytail as compound-knowledge alias and installs into devflow/.vendor/ponytail` ใน `skill-registry-engine.test.ts`
  - เพิ่ม alias `ponytail` ใน `KNOWN_SKILL_ALIASES` และอัปเดตฟังก์ชัน `install()` / `update()` ใน `skill-registry-engine.ts` ให้คัดลอก `examples/` และ `benchmarks/`
  - ทำการโคลน `https://github.com/DietrichGebert/ponytail` ไปยัง `devflow/.vendor/ponytail/` ครบถ้วน 40 โฟลเดอร์/ไฟล์
- **Task 2 Evidence**:
  - สร้าง `.agents/skills/ponytail/SKILL.md` และซิงก์ `.claude/skills/ponytail/SKILL.md`
  - บันทึก `ponytail` (v4.9.0) เข้าสู่ `thirdPartySkills` ใน `.nexus/nexus-devflow.json`
- **Task 3 Evidence**:
  - สร้าง Playbook HTML สำเร็จที่ `devflow/docs/playbooks/ponytail.html`
  - ผ่านการตรวจ static framework contract (`npm run check:static`) 100%
  - ผ่านชุดทดสอบทั้งหมด (`npm test`) 184 passing tests
- **Task 4: Post-Install CLI Recommendations (Enhancement)**:
  - อัปเดต `printNextSteps()` ใน `packages/create-nexus-devflow/bin/create-nexus-devflow.ts` แนะนำ `skill add --recommended` และคำสั่งติดตั้ง companion skills รายตัว (`archify`, `diagram-design`, `bughunter`, `ponytail`, `9arm`) หลังติดตั้งเสร็จ
  - อัปเดต `RECOMMENDED_THIRD_PARTY_SKILLS` ให้ครอบคลุม 5 พรีเซ็ตครบถ้วน และเพิ่ม unit test รองรับ

---

## 🧪 5. Multi-Lane Verification Matrix

| Lane | Command / Verification Target | Result | Notes / Proof |
| :--- | :--- | :---: | :--- |
| **Static Contract** | `npm run check:static` | ✅ PASS | 32 core skills synced, lifecycle validated, no legacy rules |
| **Unit Tests** | `npm test` | ✅ PASS | 184 tests pass, 0 fail |
| **Skill Registry CLI** | `npx tsx packages/.../bin/... skill list` | ✅ PASS | `✔ ponytail v4.9.0 [third-party]` registered correctly |
| **HTML Playbook** | `devflow/docs/playbooks/ponytail.html` | ✅ PASS | Standalone 5W1H styled dashboard generated |

