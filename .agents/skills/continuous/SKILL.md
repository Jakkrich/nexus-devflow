---
name: continuous
description: "[devflow] Autonomous multi-feature delivery loop in Nexus-DevFlow: completes planned features serially from devflow/build-plan.md without review pauses. Maintains safety boundaries, Task-Isolated Living Spec, branch isolation, TDD verification, quality gates, and local squash-merges into main. Use when running /continuous, $continuous, or executing Continuous Mode."
argument-hint: "[{resume, max-features, or start-feature}]"
---

# continuous - Complete the Build Plan One Local Feature at a Time

**First action:** Before project inspection, preflight, or any other tool call,
publish `running` to `devflow/.state/run.json` using the dashboard activity
contract in `AGENTS.md`.

Where this sits in the workflow:

```text
/status  ──▶  [continuous]  ──▶  Final Review Packet
(ready)       (Serial Loop:      (Local main only,
               Spec ➔ TDD ➔       never pushed)
               Gates ➔ Merge)
```

`/continuous` (หรือ `$continuous`) คือโหมดการทำงานแบบ Autonomous Multi-Feature Delivery Loop สำหรับจัดส่งฟีเจอร์ที่อยู่ใน `devflow/build-plan.md` ต่อเนื่องทีละฟีเจอร์ในเครื่อง Local โดยไม่ต้องหยุดรอ Manual Review Prompts ในแต่ละขั้นตอนย่อย แต่ยังคงรักษาความเข้มงวดของ **The 3-Pillars Model & Task-Isolated Living Spec (`devflow/context/{xxx-slug}/spec.md`)**, การทำ TDD, การตรวจ Quality Gates, การบันทึก Findings Ledger, และการ Squash-merge ลง Local Main Commit ทีละฟีเจอร์อย่างปลอดภัย 100%

### ขอบเขตสิทธิ์ที่ได้รับอนุญาตเฉพาะในเครื่อง Local:
- สร้างและสลับ Feature Branch ในเครื่อง Local
- บันทึก Checkpoint Commits ย่อยบน Branch
- บันทึก Feature Commit สุดท้าย
- Squash-merge ฟีเจอร์ที่เสร็จสมบูรณ์ลง Default Branch ของ Local
- ลบ Feature Branch เฉพาะใน Local หลังรวมโค้ดสำเร็จ
- วนลูปเริ่มทำฟีเจอร์ที่ยังไม่ได้เช็ค (`- [ ]`) รายการถัดไปใน `build-plan.md`

### ข้อจำกัดความปลอดภัยเด็ดขาด (Strict Safety Boundaries):
- **ห้าม** Push ขึ้น Remote Repository
- **ห้าม** Deploy หรือเผยแพร่ (Publish) สู่ภายนอก
- **ห้าม** ลบข้อมูลจริง, ทำลาย Database, หรือรัน Destructive Migration
- **ห้าม** กด Accept Finding หรือเพิกเฉยต่อ Failing Quality Gate แทนมนุษย์

---

## Input & Target Selection

- **ไม่ระบุ Argument (`/continuous`)**:
  1. หากมีฟีเจอร์ค้างอยู่ใน `devflow/context/{xxx-slug}/` ให้ทำต่อจากขั้นตอนย่อยแรกที่ยังไม่ได้เช็ค (`- [ ]`)
  2. หากไม่มี ให้เลือกฟีเจอร์แรกที่ยังไม่ได้เช็ค (`- [ ]`) ใน `devflow/build-plan.md`
  3. วนลูปทำต่อเนื่องตามลำดับใน `build-plan.md` จนกว่าจะหมด หรือครบตามจำนวน `continuous.maxFeatures` ใน `devflow/config.json`
- **ระบุ `resume` (`/continuous resume`)**: ทำงานต่อจากฟีเจอร์และขั้นตอนย่อยที่ค้างอยู่ทันที
- **ระบุชื่อหรือหมายเลขฟีเจอร์ (`/continuous 13`)**: เริ่มต้นจากฟีเจอร์ที่ระบุ แล้ววนลูปต่อไปยังฟีเจอร์ถัดไป

---

## Step 1: Preflight Safety Check (ตรวจสอบความพร้อมก่อนเริ่ม)

อ่านบริบทตั้งต้น:
- `AGENTS.md`
- `devflow/config.json` (หากไม่มี ให้ใช้ค่า Defaults อย่างปลอดภัย; หาก Invalid ให้หยุดและชี้ไปที่ `/doctor`)
- `devflow/project-plan.md` และ `devflow/build-plan.md`
- `devflow/context/project-overview.md`
- `devflow/context/{xxx-slug}/` (ถ้ามีงานค้างอยู่)
- `devflow/context/coding-standards.md` และ `devflow/context/ai-interaction.md`
- สถานะ Git (`git status`, `git branch`, recent log)

### กฎการเริ่มงาน (Start Conditions):
1. สถานะ Git Working Tree สะอาด (Clean) บน Default Branch หรือมีเฉพาะ Diff ของฟีเจอร์ปัจจุบัน
2. `devflow/build-plan.md` มีฟีเจอร์ที่ยังไม่ได้ทำเหลืออยู่
3. ไม่มี Finding ระดับ P0 หรือ P1 ค้างในสถานะ `open` หรือ `fixed`
4. บันทึก Commit SHA ตั้งต้นของ Default Branch ไว้สำหรับสรุปผลในรายงานสุดท้าย

---

## Step 2: Serial Feature Lifecycle (วงจรการส่งมอบทีละฟีเจอร์)

ดำเนินงานวนลูปทีละ 1 ฟีเจอร์ตามลำดับ:

### 2.1 Select & Spec (เลือกและร่างสเปก)
- หาก Resuming: ใช้ Spec เดิมใน `devflow/context/{xxx-slug}/spec.md`
- หากเป็นฟีเจอร์ใหม่: ถอดความต้องการจาก `build-plan.md` และสร้าง Task Workspace ที่ `devflow/context/{xxx-slug}/` พร้อมเขียน `spec.md`, `stage.md`, `findings.md` และวิเคราะห์ Red-team ก่อนเริ่มโค้ด

### 2.2 Create / Resume Feature Branch
- สร้าง Branch ตาม Prefix ใน Config (เช่น `feature/061-slug`) จาก Default Branch

### 2.3 Implement Small Steps with Strict TDD
- ดำเนินการสร้างฟังก์ชันทีละ Task ตาม Checklist ใน Spec:
  1. `[TDD-Red]`: เขียน Unit Test ก่อน
  2. `[TDD-Green]`: เขียนโค้ดขั้นต่ำให้ Test ผ่าน
  3. `[TDD-Refactor]`: ปรับแต่งโค้ดให้สะอาดและรัน Verification ผ่าน
  4. ทำเครื่องหมาย `- [x]` ใน Spec และบันทึก Checkpoint Commit บน Branch (หาก `workflow.checkpointCommits: "enabled"`)

### 2.4 Apply Continuous Quality Gates
ตรวจสอบตามการตั้งค่า `qualityGates.continuous` ใน `devflow/config.json`:
- **Audit**: `manual` (ข้ามอัตโนมัติ), `when-sensitive` (รันเมื่อแตะ Auth/Security/Database/Secrets), `always` (รันทุกฟีเจอร์)
- **Check**: `manual` (ข้ามอัตโนมัติ), `when-behavioral` (รันเมื่อมี Runtime Behavior เช่น UI/CLI/API), `always` (รันทุกฟีเจอร์)
- **Try Guide**: `manual` (ข้ามอัตโนมัติ), `when-user-facing` (สร้าง Try Guide เมื่อเป็น UI/CLI), `always` (สร้างทุกฟีเจอร์)

### 2.5 Repair Findings
- ซ่อมแซม Finding ระดับ P0/P1 ที่เกิดขึ้นจากฟีเจอร์นี้โดยอัตโนมัติ (ไม่เกิน `continuous.maxRepairAttempts` ครั้ง)
- หากไม่สามารถซ่อมแซมได้ หรือมี P0/P1 ค้างอยู่ ให้หยุดการทำงานทันที

### 2.6 Complete Locally Like a Human
- รัน Verification ขั้นสุดท้าย
- ย้ายและ Archive เอกสารไปที่ `devflow/history/features/{xxx-slug}.md`
- อัปเดตเช็คบ็อกซ์ใน `devflow/build-plan.md`
- ลบโฟลเดอร์รัน `devflow/context/{xxx-slug}/`
- Squash-merge Feature Branch เข้าสู่ Local Main และลบ Feature Branch ใน Local
- นับจำนวนฟีเจอร์ที่สำเร็จเพิ่มขึ้น 1

---

## Step 3: Optional Final Integration Audit

เมื่อครบกำหนดจำนวนฟีเจอร์หรือหมด `build-plan.md` หาก `continuous.finalIntegrationAudit: true` ให้รันการตรวจสอบความเข้ากันได้แบบบูรณาการ (Cross-Feature Contracts & Seams) จากจุดเริ่มต้นถึง HEAD ปัจจุบัน

---

## Step 4: Stop & Report (สรุปรายงานผลลัพธ์)

เมื่อการทำงานสิ้นสุด (ไม่ว่าจะสำเร็จครบถ้วน หรือหยุดเนื่องจากติดเงื่อนไขความปลอดภัย) ให้รายงานสรุปเป็นภาษาไทย:
- Commit เริ่มต้น และ Commit สุดท้ายของ Default Branch
- รายชื่อฟีเจอร์ที่จัดส่งสำเร็จในรอบนี้ พร้อม Commit Hash
- ผลการรัน Quality Gates และการซ่อมแซม Findings (ถ้ามี)
- ความคืบหน้าภาพรวมของ `build-plan.md` และฟีเจอร์ถัดไป
- ย้ำเตือนชัดเจนว่า **ไม่มีการ Push ใดๆ ขึ้น Remote Repository**
