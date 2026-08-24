# Phase 20: Delivery Specification

- **Running ID**: `023-prune-unused-skills-and-consolidate`
- **Title**: ข้อกำหนดทางเทคนิคการลดรูปและผนวกรวมโครงสร้าง Skills ของ Nexus-DevFlow ให้ Lean & Clean (ปรับลดจาก 81 เหลือ ~25-28 Skills)
- **Source Definition**: [10-define.md](10-define.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-21
- **Owner**: DevFlow Core Engineering Team

---

## 1. วัตถุประสงค์และขอบเขตข้อกำหนด (Objective & Contract Scope)

เอกสารฉบับนี้กำหนดสัญญาทางเทคนิค (Delivery Contract) สำหรับการพัฒนารอบ **`023`** เพื่อ:
1. **ลดความเทอะทะของระบบ Skills (Eliminate Skill Bloat)**: ปรับลดโฟลเดอร์ Skills จากเดิม **81 รายการ** ให้เหลือเพียง **~25-28 รายการ** (ลดลง ~68%) ซึ่งเทียบเท่ากับความคลีนและคล่องตัวของ AI Blueprint (21 Skills)
2. **รักษา Best Practices สำคัญครบ 100% (Zero Feature Loss via Consolidation)**: ดึงเอาความรู้ เทคนิค และ Checklist สำคัญจาก 17 Skills ที่มีประโยชน์ ไปผนวกรวมไว้ใน Core Skills และ `devflow/context/coding-standards.md` ก่อนทำการลบโฟลเดอร์ทิ้ง
3. **ขจัด Token Bloat และ Router Confusion**: ป้องกันไม่ให้ AI สับสนกับคำสั่ง Alias ซ้ำซ้อน (เช่น `spec`, `goal`, `help`, `app-builder`) และประหยัด Token ใน System Prompt
4. **รักษาความสมบูรณ์ของระบบ (100% System Integrity)**: อัปเดต Manifests, Adapter Sync (`.agents/` ➔ `.claude/`), และผ่านชุดทดสอบ Multi-Lane Verification ทั้งหมด 100%

---

## 2. รายการจำแนกสถานะของ Skill ทั้งหมด 81 รายการ (Detailed Skill Classification)

### 🟢 1. ชุด Core Skills ที่คงอยู่ (Keep As-Is) — รวม 25-28 Skills
```text
.agents/skills/
├── [Fast-Track: Blueprint Mode]
│   ├── feature/
│   ├── fix/
│   ├── implement/
│   ├── check/
│   └── complete/
├── [Deep-Track: Architect Mode]
│   ├── 00-discover/
│   ├── 10-define/
│   ├── 20-spec/
│   ├── 30-plan/
│   ├── 40-execute/
│   ├── 50-verify/
│   ├── 60-report/
│   └── 70-release/
└── [Essential Utilities, Gates & Prototyping]
    ├── devflow/ (รวม status)
    ├── doctor/
    ├── overview/
    ├── debug/
    ├── onboard/
    ├── adopt/
    ├── try/
    ├── rollback/
    ├── idea/
    ├── ci/
    ├── test/
    ├── autopilot/
    ├── prototype/
    ├── report-html/
    └── brief/
```

---

### 🔄 2. ชุด Skills ที่ต้องดูดซับส่วนดีก่อนแล้วลบ (Consolidate & Delete) — รวม 17 Skills
| Skill เดิม | สาระสำคัญที่ต้องดูดซับ (Good Parts) | จุดปลายทางที่นำไปรวม (Target Destination) |
| :--- | :--- | :--- |
| `commit` | Conventional Commits (`feat`, `fix`, etc.) + Imperative mood | `complete/SKILL.md`, `70-release/SKILL.md`, `coding-standards.md` |
| `changelog` | SemVer Rules + Keep a Changelog Format (`Added`, `Fixed`, etc.) | `complete/SKILL.md`, `70-release/SKILL.md` |
| `pr` | PR Body Template, Breaking Changes Alert, Evidence Links | `complete/SKILL.md`, `70-release/SKILL.md` |
| `merge` | Squash Merge & Branch Cleanup Checklist | `complete/SKILL.md`, `70-release/SKILL.md` |
| `deploy` | Pre-flight Checks & Smoke Validation Checklist | `70-release/SKILL.md` |
| `brainstorm` | Divergent/Convergent Matrix & Trade-off Comparison Table | Sub-route ใน `00-discover/SKILL.md` |
| `research` | Empirical Codebase Proof & Web Search Method | Sub-route ใน `00-discover/SKILL.md` |
| `prd` | User Story Mapping, In-Scope & Out-of-Scope Definitions | Sub-route ใน `00-discover/SKILL.md` / `10-define/SKILL.md` |
| `issue-triage` | ลำดับความสำคัญและเกณฑ์คัดกรอง Bug ก่อนเริ่มงาน | `00-discover/SKILL.md` และ `fix/SKILL.md` |
| `review` | 9arm Scrutinize (Boundary checks, Null/Undefined edge cases) | QA Matrix ใน `check/SKILL.md` และ `50-verify/SKILL.md` |
| `security-review` | Security Audit Checklist (OWASP Top 10, Secrets, Input Validation) | QA Matrix ใน `check/SKILL.md` และ `50-verify/SKILL.md` |
| `lint-and-validate` | Multi-lane Static Analysis Matrix (Typecheck, Lint, Formatting) | QA Matrix ใน `check/SKILL.md` และ `50-verify/SKILL.md` |
| `simplify` | Refactoring Rules (Early returns, Flatten nested conditions, Deep modules) | `devflow/context/coding-standards.md` และ `implement/SKILL.md` |
| `database-design` | กฎความปลอดภัยของ Database Schema Migrations & Indexing | `devflow/context/coding-standards.md` |
| `api-and-interface-design` | กฎการออกแบบ REST/API Interfaces และ Module Boundaries | `devflow/context/coding-standards.md` |
| `codebase-design` | หลักการออกแบบ Deep Modules และ Information Hiding | `devflow/context/coding-standards.md` |
| `type-design` | กฎการเขียน TypeScript แบบ Strict Typing (ห้ามใช้ `any`) | `devflow/context/coding-standards.md` |
| `insight` | การสกัด Lessons Learned / Gotchas หลังจบงาน | Retrospective ใน `60-report/SKILL.md` และ `complete/SKILL.md` |

---

### ❌ 3. ชุด Skills ที่ลบออกได้ทันที (Direct Delete) — รวม 36 Skills
1. `bash-linux` (ไวยากรณ์ Bash พื้นฐาน)
2. `powershell-windows` (ไวยากรณ์ PowerShell)
3. `python-patterns` (คู่มือภาษา Python ทั่วไป)
4. `nodejs-best-practices` (คู่มือภาษา Node.js ทั่วไป)
5. `tailwind-patterns` (คู่มือ Tailwind CSS ทั่วไป)
6. `nextjs-react-expert` (คู่มือ React / Next.js ทั่วไป)
7. `frontend-ui-engineering` (ทฤษฎี UI ทั่วไป)
8. `seo-fundamentals` (ทฤษฎี SEO / E-E-A-T)
9. `mobile-design` (ทฤษฎี Mobile Design)
10. `server-management` (ทฤษฎี Server / PM2)
11. `domain-modeling` (ทฤษฎี DDD ซ้ำซ้อน)
12. `i18n-localization` (ทฤษฎีจัดการภาษา i18n)
13. `ui-ux-pro-max` (Text dump ขนาดใหญ่เรื่อง UI ดีไซน์)
14. `architecture` (ทฤษฎีสถาปัตยกรรมซ้ำซ้อน)
15. `spec` (คำสั่งครอบซ้ำซ้อนกับ `feature`/`fix`)
16. `spec-driven-development` (ทฤษฎี Spec ซ้ำซ้อน)
17. `goal` (คำสั่งครอบซ้ำซ้อนกับ `00-discover`)
18. `help` (คำสั่งครอบซ้ำซ้อนกับ `devflow`)
19. `app-builder` (ซ้ำซ้อนกับ Fast-Track Workflow)
20. `agent` (สลับ Persona ที่ไม่จำเป็น)
21. `behavioral-modes` (ทฤษฎี Persona Modes)
22. `parallel-agents` (ทฤษฎีรัน Agent ขนาน)
23. `context-engineering` (ทฤษฎี Context Management)
24. `skill-development` (คู่มือสอนสร้าง Skill)
25. `package-json-generator` (Agent จัดการไฟล์ `package.json` ผ่าน Tool ตรงๆ)
26. `preview` (รัน dev server ผ่าน terminal ตรงๆ)
27. `followup` (บันทึกลงใน `ideas.md` หรือ `findings.md` โดยตรง)
28. `competitor-analysis` (ใช้ Web Search Tool ตรงๆ มีประสิทธิภาพกว่า)
29. `documentation-and-adrs` (บันทึกใน Context หรือ Markdown ตรงๆ)
30. `mcp-builder` (คู่มือเฉพาะทางเกินไป)
31. `handoff` (ส่งต่องานผ่าน State Context ปกติ)
32. `roadmap-strategy` (ไม่จำเป็นสำหรับงาน Coding ประจำวัน)
33. `sync-upstream` (ย้ายไป `scripts/` สำหรับ Maintainer เท่านั้น)
34. `package-release` (ย้ายไป `scripts/` สำหรับ Maintainer เท่านั้น)

---

## 3. ข้อกำหนดฟังก์ชันการทำงานหลัก (Core Functional Requirements)

### REQ-1: การยกระดับ Core Skills ด้วย Best Practices (Consolidation Engine)
- **R1.1 การปรับปรุง `complete/SKILL.md` และ `70-release/SKILL.md`**:
  - ผสานขั้นตอน Conventional Commits (`feat(scope): imperative summary`)
  - ผสานขั้นตอนคำนวณ SemVer Version Bump (Major, Minor, Patch)
  - ผสานขั้นตอนการเขียน CHANGELOG.md ตามมาตรฐาน Keep a Changelog
  - ผสานคำแนะนำในการสร้าง Pull Request Body และ Checklist
- **R1.2 การปรับปรุง `00-discover/SKILL.md`**:
  - ผสาน Supporting Routes ละเอียด: Brainstorm (Trade-off Matrix), Research (Empirical Evidence), PRD (User Stories & Out-of-scope boundaries) เข้าเป็นไกด์ในตัว Skill
- **R1.3 การปรับปรุง `check/SKILL.md` และ `50-verify/SKILL.md`**:
  - ผสาน 9arm Scrutinize Checklist (Edge cases, Null/Undefined, Off-by-one errors)
  - ผสาน Security Review Matrix (Secrets, OWASP Top 10, Input validation)
  - ผสาน Static Analysis & Multi-lane verification
- **R1.4 การปรับปรุง `devflow/context/coding-standards.md`**:
  - เพิ่มหัวข้อ Database Design & Migration Safety
  - เพิ่มหัวข้อ Stable API & Interface Design
  - เพิ่มหัวข้อ Deep Modules & Information Hiding
  - เพิ่มหัวข้อ TypeScript Strict Type Discipline (ห้ามใช้ `any`)

### REQ-2: การลบ Skill ส่วนเกินใน `.agents/skills/` และ `.claude/skills/`
- **R2.1 การลบโฟลเดอร์อย่างปลอดภัย**:
  - ลบโฟลเดอร์ Skill ที่ระบุในกลุ่ม 2 และกลุ่ม 3 รวมประมาณ 53 โฟลเดอร์ออกจาก `.agents/skills/`
  - ลบโฟลเดอร์ออกจาก `.claude/skills/`
  - ตรวจสอบให้แน่ใจว่าไม่มี Stale References หรือ Broken Links ค้างอยู่ใน Skill ที่เหลืออยู่

### REQ-3: การอัปเดต Manifests, Adapters และ Evals
- **R3.1 `evals/routing/`**:
  - ลบไฟล์ Test Cases `.json` ของ Skill ที่ถูกลบออก เพื่อให้ `npm run test:routing` ทดสอบเฉพาะชุด Skills ที่ใช้งานจริง
- **R3.2 `agent-bundle.manifest.json` & `AGENTS.md`**:
  - อัปเดตรายการคำสั่งและ Skill ให้สะท้อนชุดที่ Lean ใหม่
- **R3.3 Adapter Synchronization**:
  - รัน `npm run sync:adapters` เพื่อรับรองว่า `.claude/skills/` ตรงกับ `.agents/skills/` 100%

---

## 4. ข้อจำกัดและกฎความปลอดภัย (Hard Constraints)

1. **Zero Broken Mainline Workflows**: Fast-Track (`/feature`, `/fix`, `/implement`, `/check`, `/complete`) และ Deep-Track (`00-discover` ถึง `70-release`) ต้องทำงานได้อย่างสมบูรณ์ 100%
2. **Zero Regressions in Tests**: ต้องรัน `npm run check` (Static validation + Typecheck + Routing Evals + Unit Tests + Package Smoke Test) ผ่านทุกขั้นตอน
3. **No External Dependencies**: ไม่ติดตั้ง npm packages ภายนอกเพิ่ม

---

## 5. แผนการทดสอบและการพิสูจน์เชิงประจักษ์ (Testing & Verification Strategy)

| ช่องทางการทดสอบ | คำสั่ง / วิธีการ | เกณฑ์ผ่าน |
| :--- | :--- | :--- |
| **Lane 1: Static Framework Validation** | `npm run check:static` | โครงสร้างโฟลเดอร์และ Mainline Numbering ถูกต้อง |
| **Lane 2: Skill Routing Accuracy** | `npm run test:routing` | Test cases ทั้งหมดผ่าน (100% Rank 1 Match) |
| **Lane 3: Unit Tests Suite** | `npm test` | Unit tests ทั้งหมดผ่าน 100% (20/20+ tests) |
| **Lane 4: Package Smoke Test** | `npm run test:package` | Tarball Packaging และ Overlay CLI ทดสอบผ่าน |
| **Lane 5: Master Verification Gate** | `npm run check` | ผ่านทุก Gate โดยไม่มี Error |

---

## 6. คำสั่งถัดไปที่อนุญาต (Next Allowed Command)

- สเตจถัดไป: `30-plan 023-prune-unused-skills-and-consolidate` (หรือ `/30-plan 023`)
