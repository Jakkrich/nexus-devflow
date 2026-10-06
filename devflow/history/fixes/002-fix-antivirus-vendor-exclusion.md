# Fix: Exclude Malicious PoCs and Disclosed Reports from Vendor Skills to Prevent Antivirus Triggers

**Type:** Fix
**Target ID:** `002-fix-antivirus-vendor-exclusion`
**Status:** Completed & Archived

---

## 📌 The Problem (ปัญหาที่พบ)

เมื่อผู้ใช้งานติดตั้งหรืออัปเดต companion / vendor skill โดยเฉพาะ **`bughunter`** (`Claude-BugHunter`) ผ่านคำสั่ง:
```bash
npx nexus-devflow skill add bughunter
# หรือ
npx nexus-devflow skill add --recommended
```

1. **คัดลอกโฟลเดอร์ Exploit Payloads ตรงๆ**:
   - ใน `packages/create-nexus-devflow/lib/skill-registry-engine.ts` ได้คัดลอกโฟลเดอร์ `docs/` ทั้งหมดของ upstream เข้าสู่ `devflow/.vendor/bughunter/docs/`
   - ในโฟลเดอร์ `docs/disclosed-reports/` มีไฟล์ markdown รายงาน HackerOne (เช่น `hunt-lfi.md`) ซึ่งมีตัวอย่างโค้ด Web Shell และ LFI Payloads จริง
2. **ติด Windows Defender / Antivirus ทันที**:
   - Windows Defender ตรวจพบและแจ้งเตือน `Trojan:Script/Wacatac.B!ml` และสั่ง Quarantined ไฟล์ `hunt-lfi.md` ทันที
   - เมื่อ AI Agent หรือ IDE ทำการอ่านไฟล์หรือบันทึก session log/transcript ส่งผลให้ไฟล์ `transcript.jsonl` ถูกตรวจจับเป็น `Backdoor:PHP/Perhetshell.B!dha` และถูกลบหรือบล็อก ทำให้ session ของ IDE เสียหาย
3. **โฟลเดอร์ Verification Lab ที่เสี่ยงต่อ False Positive**:
   - ใน `docs/verification/` มีไฟล์สคริปต์แล็บทดสอบ (เช่น `app.py`, `harness.py`) ที่มีโค้ดจำลองช่องโหว่ความปลอดภัย ซึ่งอาจถูกตรวจจับโดย Antivirus อื่นๆ ได้เช่นกัน

---

## 🎯 The Fix (แนวทางแก้ไข)

1. **เพิ่ม Exclusion Filter ใน Skill Registry Engine**:
   - ปรับปรุงการคัดลอกไฟล์ใน `packages/create-nexus-devflow/lib/skill-registry-engine.ts` ตอนดึง compound skill (`bughunter`) และ vendor skills ทั่วไป:
     - **ข้าม (Exclude)**: โฟลเดอร์ `disclosed-reports` (รายงานช่องโหว่ที่มีโค้ด payload เสี่ยง)
     - **ข้าม (Exclude)**: โฟลเดอร์ `verification` ใน `docs/` (แล็บทดสอบที่มีไฟล์ mockup ช่องโหว่)
   - คงไว้ซึ่งคู่มือแนวทาง, ระเบียบวิธี, checklist และ architecture references:
     - `skills/`, `commands/`, `references/`, `docs/superpowers/`, `ENGAGEMENTS.md`, `USAGE.md`, `README.md`
2. **เพิ่ม Clean Sweep & Protection ใน Update Logic**:
   - ตรวจสอบ `packages/create-nexus-devflow/lib/update.ts` ให้ใช้กฎการกรองเดียวกันเมื่อผู้ใช้รัน `npx nexus-devflow skill update`
3. **Clean Up คลัง Vendor ในโปรเจกต์ DevFlow**:
   - ลบโฟลเดอร์ตกค้าง `devflow/.vendor/bughunter/docs/disclosed-reports/` และ `devflow/.vendor/bughunter/docs/verification/` ออกจาก workspace เพื่อให้คลีน 100%
4. **เพิ่ม Automated Unit Test**:
   - เพิ่ม test case ใน `packages/create-nexus-devflow/test/skill-manager.test.ts` เพื่อการันตีว่าเมื่อ install/update compound skill `bughunter` จะไม่มีการคัดลอก `disclosed-reports` หรือ `verification` payload files

---

## 🔨 Build Steps (ขั้นตอนการพัฒนา)

- [x] **Step 1: Implement Antivirus-Safe Exclusion Filter in Skill Registry Engine & Update Logic**
  - เพิ่มฟังก์ชันกรอง exclusion path ใน `packages/create-nexus-devflow/lib/skill-registry-engine.ts` (ป้องกัน `disclosed-reports` และ `verification`)
  - อัปเดต `packages/create-nexus-devflow/lib/update.ts` หากมีการคัดลอกไฟล์ซ้ำ
  - **Done when**: โค้ดคัดลอกไฟล์ของ compound skills ข้ามโฟลเดอร์ `disclosed-reports` และ `verification` อย่างถูกต้อง และ TypeScript compile ผ่าน (`npm run build` ใน `create-nexus-devflow`)

- [x] **Step 2: Clean Existing Vendor Footprint & Add Automated Unit Tests**
  - ลบไฟล์ตกค้าง `devflow/.vendor/bughunter/docs/disclosed-reports` และ `devflow/.vendor/bughunter/docs/verification` ออกจาก workspace
  - เพิ่ม Unit Test ใน `packages/create-nexus-devflow/test/skill-manager.test.ts` ตรวจสอบ assertion ว่าไฟล์ใน exclusion list จะต้องไม่ถูก copy
  - **Done when**: Unit test สำหรับ exclusion filter รันผ่านฉลุย (`npm test`)

---

## ✅ Verify (การตรวจสอบความถูกต้อง)

1. รัน `npm run build` ใน `packages/create-nexus-devflow` เพื่อคอมไพล์โค้ด: ผ่านฉลุย (TSC exit 0)
2. รัน `npm test` เพื่อตรวจสอบว่าทุก test suite ผ่าน 100%: ผ่าน 213 tests (0 fail)
3. ตรวจสอบว่าใน `devflow/.vendor/bughunter/docs/` ไม่มีโฟลเดอร์ `disclosed-reports/` หรือ `verification/` อีกต่อไป: ผ่าน (Test-Path คืนค่า False)
4. รัน `npm run check` เพื่อยืนยัน framework integrity: ผ่านครบทุก stage รวมถึง package smoke test

---

## ⚡ 4. Implementation Log & Evidence

- **`packages/create-nexus-devflow/lib/skill-registry-engine.ts`**:
  - สร้างและส่งออก `isAntivirusSafeVendorPath(sourcePath: string): boolean` โดยกรอง regex pattern `/(^|\/)disclosed-reports(\/|$)/i` และ `/(^|\/)verification(\/|$)/i`
  - ใช้ `filter: (src) => isAntivirusSafeVendorPath(src)` ในการคัดลอก `docs/` ทั้งใน `installSkill` และ `updateThirdPartySkills`
  - ลบคำสั่งคัดลอก `srcReports` (`docs/disclosed-reports`) ออกจาก `updateThirdPartySkills` อย่างถาวร
  - เพิ่ม logic ตรวจสอบและ purge `legacyDangerousPaths` (`disclosed-reports`, `docs/disclosed-reports`, `docs/verification`) อัตโนมัติเมื่อติดตั้งหรืออัปเดต เพื่อ heal โปรเจกต์ที่มีไฟล์ค้างอยู่
- **`packages/create-nexus-devflow/lib/skill-manager.ts`**:
  - Re-export `isAntivirusSafeVendorPath` สำหรับให้โมดูลอื่นและชุดทดสอบเรียกใช้งาน
- **`packages/create-nexus-devflow/test/skill-manager.test.ts`**:
  - เพิ่ม Unit Test สำหรับ `isAntivirusSafeVendorPath` ครอบคลุมทั้ง Linux/macOS slash และ Windows backslash
  - เพิ่ม integration assertion ใน compound skill fallback update เพื่อยืนยันว่า `docs/disclosed-reports`, `root disclosed-reports`, และ `docs/verification` จะไม่ถูกคัดลอก
- **`devflow/.vendor/bughunter/docs/`**:
  - ลบโฟลเดอร์ตกค้าง `disclosed-reports` และ `verification` ออกจาก workspace อย่างสมบูรณ์

---

## 🔬 Post-Mortem Analysis

- **Summary**: ปรับปรุง Skill Registry Engine ให้มี Antivirus-Safe Vendor Exclusion Filter ป้องกันการคัดลอกไฟล์ exploit PoC reports และ verification labs ที่กระตุ้น Windows Defender
- **Symptom**: เมื่อติดตั้ง `bughunter` ผ่าน `skill add` หรือ `skill update` บน Windows ตัว Windows Defender แจ้งเตือน `Trojan:Script/Wacatac.B!ml` บนไฟล์ `docs/disclosed-reports/hunt-lfi.md` และหาก Agent อ่านหรือบันทึก session จะทำให้ไฟล์ `transcript.jsonl` ติด `Backdoor:PHP/Perhetshell.B!dha` จนถูกลบ
- **Root Cause Mechanism**: Upstream repository (`Claude-BugHunter`) มีโฟลเดอร์ `docs/disclosed-reports` และ `docs/verification` ที่บรรจุ exploit code และ vulnerable mock apps จาก HackerOne reports ซึ่งโค้ด `skill-registry-engine.ts` เดิมทำการ `fs.cp` โฟลเดอร์ `docs/` ทั้งหมดโดยไม่มีการกรอง
- **Why It Produced Symptom**: Antivirus ทำการสแกน signature ของ Webshell และ LFI scripts ที่อยู่ในไฟล์ markdown/python ทำให้เกิดการตรวจจับทันทีเมื่อไฟล์ถูกเขียนลง disk
- **Fix**: เพิ่ม `isAntivirusSafeVendorPath` พร้อม filter ใน `fs.cp` เพื่อยกเว้นโฟลเดอร์ `disclosed-reports` และ `verification` พร้อมทั้งเพิ่ม auto-purge เพื่อลบไฟล์เดิมที่ตกค้างใน `targetRefDir`
- **How Found**: ผู้ใช้งานแจ้งพบการแจ้งเตือนจาก Windows Defender เมื่อมีการใช้งาน Agent และมีการตรวจสอบภาพแจ้งเตือนในระบบ
- **Why Slipped Through**: ในการทดสอบเดิมบน Linux CI หรือ unit test mock มีการสร้างเฉพาะโครงสร้าง markdown ตัวอย่างโดยไม่มี exploit string จริง ทำให้ไม่เกิด AV trigger ใน pipeline
- **Validation**:
  - Unit tests: `isAntivirusSafeVendorPath` ครอบคลุม regex filtering ทุก OS separator
  - Integration test: ยืนยันว่า `updateThirdPartySkills` ไม่คัดลอกโฟลเดอร์ดังกล่าว และ auto-purge ไฟล์ตกค้าง
  - Full project check: `npm run check` ผ่านครบทุกขั้นตอน (259/259 tests passed)
- **Action Items**:
  - รวมการแก้ไขนี้เข้ากับเวอร์ชันถัดไปของ `create-nexus-devflow` เพื่อให้ผู้ใช้ใหม่และผู้ที่สั่ง `skill update` ได้รับการปกป้องโดยอัตโนมัติ
