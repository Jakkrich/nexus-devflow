# Phase 10: Define Contract

- **Running ID**: `021-categorized-history-and-clean-living-spec-architecture`
- **Title**: ปรับโครงสร้าง Categorized History (`features/`, `fixes/`, `rollbacks/`), ลบ Prefix `RUN-`, บังคับกฎ Single Active Run, และวาง Living Spec ใน `devflow/context/current-feature.md`
- **Source Discovery**: [DISC-20260821-017-align-and-enrich-devflow-context-files](../../discoveries/DISC-20260821-017-align-and-enrich-devflow-context-files/00-discover.md)
- **Artifact Language**: th
- **Status**: Approved
- **Created Date**: 2026-08-21
- **Owner**: DevFlow Core Engineering Team

---

## 1. วัตถุประสงค์และความเป็นมา (Initiative Summary & Objectives)

จากการทบทวนและออกแบบสถาปัตยกรรมการจัดเก็บประวัติ (History) และสถานะการทำงานปัจจุบัน (Active Work) ในการสนทนา Discovery พบว่า:
1. **การจัดหมวดหมู่ประวัติ (`devflow/history/`)**: เดิมใช้ตารางใน `HISTORY.md` เพียงอย่างเดียว ต้องการปรับโครงสร้างให้แยกเป็นโฟลเดอร์ย่อย `features/`, `fixes/`, และ `rollbacks/` โดยให้ AI ทำการเลือกโฟลเดอร์ปลายทางตามประเภทงานโดยอัตโนมัติ (เช่นเดียวกับ Blueprint)
2. **การลบ Prefix `RUN-`**: เปลี่ยนรูปแบบ Sequential Numbering จากเดิม `RUN-xxx-slug` ➔ เป็น **`xxx-slug`** (เช่น `001-setup-auth`, `021-categorized-history...`) เพื่อความกระชับและเรียงลำดับใน File Explorer ได้อย่างเป็นระเบียบ
3. **การวางตำแหน่ง Living Spec สำหรับ Fast-Track**: ให้ไฟล์ Active Living Spec อยู่ที่ **`devflow/context/current-feature.md`** โดยตรง เพื่อให้ AI ทุกตัวอ่านได้ง่ายและไม่ต้องมีโฟลเดอร์ค้างใน `runs/` และเมื่อรัน `/complete` จะทำการย้ายและ Archive ไปเก็บใน `devflow/history/features/xxx-slug.md` พร้อมรีเซ็ต `current-feature.md` กลับเป็น Stub ว่าง
4. **การวางตำแหน่งสำหรับ Deep-Track**: เมื่อรันงาน Deep-Track โฟลเดอร์จะอยู่ที่ `devflow/runs/xxx-slug/` และเมื่อจบที่ `70-release` จะย้ายทั้งโฟลเดอร์ไปไว้ที่ `devflow/history/features/xxx-slug/` ทำให้โฟลเดอร์ `devflow/runs/` ว่างลง
5. **การบังคับกฎเหล็ก Single Active Run (One Thing at a Time)**: ป้องกันไม่ให้เปิดงานใหม่ซ้อนขณะที่งานเดิมยังไม่เสร็จ โดยจะแจ้งเตือนให้ผู้ใช้ปิดงานเดิมด้วย `/complete` หรือ `70-release` เสียก่อน

---

## 2. ขอบเขตงานที่ต้องดำเนินการ (In-Scope)

### ส่วนที่ 1: โครงสร้าง History และการย้ายไฟล์ (Categorized History Engine)
1. **สร้างโฟลเดอร์ใน `devflow/history/`**:
   - `devflow/history/features/` (พร้อม `README.md`)
   - `devflow/history/fixes/` (พร้อม `README.md`)
   - `devflow/history/rollbacks/` (พร้อม `README.md`)
   - ย้ายประวัติเดิม (`RUN-001` ถึง `RUN-020`) เข้าสู่โครงสร้างใหม่โดยตัด prefix `RUN-` ออก (เช่น `001-align-devflow-blueprint`, `020-uninstall-and-eject-devflow-cli.md`)
2. **ปรับปรุงทักษะการปิดงาน (`complete` และ `70-release`)**:
   - **Fast-Track `/complete`**:
     - ตรวจสอบประเภทงาน (Feature ➔ `history/features/`, Fix ➔ `history/fixes/`, Rollback ➔ `history/rollbacks/`)
     - ย้าย `devflow/context/current-feature.md` ไป Archive เป็นไฟล์เดี่ยว `devflow/history/{category}/{xxx-slug}.md`
     - รวบรวม Resolved Findings (`closed`/`accepted`) ไปแปะท้ายไฟล์ Archive
     - รีเซ็ต `devflow/context/current-feature.md` กลับเป็น Stub ว่าง
     - อัปเดตตาราง `devflow/history/HISTORY.md`
   - **Deep-Track `70-release`**:
     - ย้ายทั้งโฟลเดอร์ `devflow/runs/{xxx-slug}/` ➔ ไปที่ `devflow/history/{category}/{xxx-slug}/`
     - อัปเดต `devflow/history/HISTORY.md`

### ส่วนที่ 2: ระบบ Sequential Numbering รูปแบบใหม่ (`xxx-slug`)
1. เปลี่ยนการสร้าง Running ID ในทุกสเตจ (`feature`, `fix`, `spec`, `10-define`) จาก `RUN-xxx-slug` ➔ เป็น **`xxx-slug`** (Format: 3 หลัก เช่น `021-xxx`)
2. อัปเดต Branch Naming Convention: `feature/{xxx-slug}` หรือ `fix/{xxx-slug}`
3. อัปเดต Contract: [running-id-contract.md](../../reference/running-id-contract.md)

### ส่วนที่ 3: กฎเหล็ก Single Active Run Guardrails
1. อัปเดต `feature/SKILL.md`, `fix/SKILL.md`, `spec/SKILL.md`, และ `10-define/SKILL.md`:
   - ตรวจสอบ `devflow/context/current-stage.md` และ `devflow/context/current-feature.md`
   - หากพบว่ามีงานเดิมกำลังดำเนินอยู่ (`Active Running ID != None` หรือ `current-feature.md` มีเนื้อหาที่ยังไม่เสร็จ):
     - **ปฏิเสธการเริ่มงานใหม่ทันที** และแนะนำคำสั่งปิดงานเดิม (`/complete` หรือ `70-release`) หรือยกเลิกงาน

### ส่วนที่ 4: ปรับปรุง Core Libraries, CLI, Test Suites, และ Scripts
1. **`packages/create-nexus-devflow/lib/current-work.ts`**:
   - ปรับการตรวจจับ Active Work ให้รองรับ `devflow/context/current-feature.md` เป็นอันดับแรก
   - รองรับ ID Format ทั้งแบบใหม่ (`021-xxx`) และแบบเดิม (`RUN-xxx`)
2. **`packages/create-nexus-devflow/lib/status.ts` & `findings.ts`**:
   - ปรับปรุงการอ่านสถานะให้เข้ากับโครงสร้างใหม่
3. **`packages/create-nexus-devflow/test/`**:
   - ปรับปรุง Unit Tests ทั้งหมดให้ทดสอบ ID รูปแบบใหม่และการอ่าน `context/current-feature.md`
4. **`scripts/lib/render-html/stage-adapters/report-stage.mjs`**:
   - ปรับให้อ่านรายงานได้ทั้งจาก `devflow/context/current-feature.md` และ `devflow/history/`
5. **Sync Adapters**:
   - รัน `npm run sync:adapters` ให้ `.claude/skills/` ตรงกัน 100%

---

## 3. สิ่งที่อยู่นอกขอบเขต (Out-of-Scope / Non-Goals)

- ไม่ลบประวัติการส่งมอบเดิม (`001` ถึง `020`) แต่ทำการย้ายและแปลงชื่อให้เข้ากับมาตรฐานใหม่
- ไม่เปลี่ยน Core Architecture ของ Dual-Track (ยังคงมี 4-Step Fast-Track และ 8-Step Deep-Track เหมือนเดิม)
- ไม่เพิ่ม Third-party dependencies ใหม่

---

## 4. แผนที่การส่งมอบ (Run Map)

| Running ID | Slug | Outcome |
| :--- | :--- | :--- |
| **`021`** | `categorized-history-and-clean-living-spec-architecture` | ติดตั้ง Categorized History (`features/`, `fixes/`, `rollbacks/`), ตัด Prefix `RUN-`, บังคับกฎ Single Active Run, วาง Living Spec ใน `devflow/context/current-feature.md` และอัปเดตระบบทั้งหมดพร้อม Unit Tests 100% |

---

## 5. เกณฑ์ความสำเร็จและการตรวจรับ (Acceptance Criteria)

- [ ] **AC-1**: โฟลเดอร์ `devflow/history/` มีการจัดหมวดหมู่ `features/`, `fixes/`, และ `rollbacks/` พร้อม `README.md` อธิบายชัดเจน
- [ ] **AC-2**: ประวัติทั้งหมดใช้ Sequential Numbering แบบไม่มี `RUN-` (เช่น `001-xxx`, `021-xxx`)
- [ ] **AC-3**: คำสั่ง `/feature` และ `/fix` สร้างและอัปเดต Living Spec ใน `devflow/context/current-feature.md` โดยตรงในขณะที่กำลังทำงาน (Active)
- [ ] **AC-4**: เมื่อรัน `/complete`: AI เลือกย้ายและ Archive ไฟล์เข้า `devflow/history/{features|fixes|rollbacks}/` อย่างถูกต้อง และรีเซ็ต `current-feature.md` กลับเป็น Stub ว่าง
- [ ] **AC-5**: เมื่อรัน `70-release`: AI ย้ายโฟลเดอร์งาน Deep-Track เข้า `devflow/history/{features|fixes|rollbacks}/` และทำให้ `devflow/runs/` สะอาด
- [ ] **AC-6**: มีระบบตรวจสอบความปลอดภัย ปฏิเสธการเปิดงานใหม่หากมี Active Run เดิมค้างอยู่
- [ ] **AC-7**: คำสั่ง `nexus-devflow status` อ่านสถานะ Active Work จาก `current-feature.md` ได้อย่างแม่นยำ
- [ ] **AC-8**: ผ่านชุดทดสอบ Unit Tests 100% (20/20+) และผ่าน Master Verification Gate (`npm run check`)

---

## 6. ความเสี่ยงและการบรรเทาผลกระทบ (Risks & Mitigation)

| ความเสี่ยง | ระดับ | มาตรการบรรเทาผลกระทบ |
| :--- | :--- | :--- |
| **ความเข้ากันได้กับประวัติเก่า** | ปานกลาง | ปรับ `current-work.ts` และ Regex ให้รองรับทั้ง ID แบบเดิม (`RUN-xxx`) และแบบใหม่ (`xxx-slug`) |
| **การลืมปิดงานเก่าทำให้ค้าง** | ต่ำ | ให้ข้อความแจ้งเตือนที่ชัดเจน พร้อมแนะแนวทางแก้ปัญหา เช่น รัน `/complete` หรือแก้ไขสถานะใน `current-stage.md` |

---

## 7. คำสั่งถัดไปที่อนุญาต (Next Allowed Command)

- สเตจถัดไป: `20-spec 021-categorized-history-and-clean-living-spec-architecture` (หรือ `/20-spec 021`)
