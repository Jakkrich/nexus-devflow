# Discovery Document: [DISC-20260902-001] Analysis and Removal Plan for Extensions Feature

> **Discovery ID**: `DISC-20260902-001`  
> **Topic**: การวิเคราะห์โครงสร้าง ผลกระทบ และขั้นตอนการนำ feature / โฟลเดอร์ `extensions` ออกจากโปรเจกต์ Nexus-DevFlow  
> **Date**: 2026-09-02  
> **Status**: `Proceed (Ready for User Decision on Option Scope)`  
> **Target Scope**: `extensions/`, `packages/create-nexus-devflow/lib/ide-extension.ts`, `devflow/context/project-overview.md`, `scripts/overview.ts`

---

## 1. Executive Summary & สรุปสาระสำคัญ (TL;DR)

**คำถาม**: จะเอา feature `extensions` (`d:\devtools\nexus-devflow\extensions`) ออก ต้องทำอย่างไรบ้าง และต้องลบส่วนใดที่เกี่ยวข้องออก?

**คำตอบสรุป**:
1. **สถานะปัจจุบันของโฟลเดอร์ `extensions`**:
   - โฟลเดอร์ `d:\devtools\nexus-devflow\extensions` ในปัจจุบัน **ไม่ได้ถูก Track อยู่บน Git branch `main` เลยแม้แต่ไฟล์เดียว**
   - สิ่งที่หลงเหลืออยู่ในโฟลเดอร์นี้จริง ๆ มีเพียง compiled artifacts เก่า (`extensions/vscode/dist/extension.js`) และ `node_modules/` ซึ่งทั้งคู่ถูก `.gitignore` ละเว้นไว้
   - ในอดีต โฟลเดอร์นี้เคยเป็นโปรโตไทป์ VS Code Extension ที่พัฒนาแยกบน Git branch `Nexus-DevFlow-IDE-Extension` (commit `ae4d4bf`) แต่ไม่ได้ถูกผสานเข้ามาเป็น Git repository content ใน `main`
   - สาเหตุที่ `extensions` ยังปรากฏอยู่ในเอกสาร `devflow/context/project-overview.md` (ข้อ 8 Data Sources) เป็นเพราะสคริปต์คอมไพเลอร์ `scripts/overview.ts` ใช้ `fs.readdir()` สแกนพบโฟลเดอร์ที่มีอยู่จริงบนดิสก์

2. **ส่วนประกอบในโค้ดเบสที่เกี่ยวข้องกับคำว่า "Extension"**:
   - โฟลเดอร์ดิสก์: `extensions/` (Orphaned untracked folder)
   - โมดูล Manifest Generator: `packages/create-nexus-devflow/lib/ide-extension.ts` (ฟังก์ชัน `generateIdeExtensionManifest` สำหรับสร้าง `package.json` ของ VS Code extension)
   - เทสที่เกี่ยวข้อง: `packages/create-nexus-devflow/test/ide-extension.test.ts` (มีเทสของ `generateIdeExtensionManifest` 1 เคส และเทสของ `renderStudioHtml` อีก 3 เคส)
   - เอกสารภาพรวม: `devflow/context/project-overview.md` (มีคำว่า `extensions` ในรายการโฟลเดอร์หลัก)

---

## 2. ผลการตรวจสอบเชิงลึก (Empirical Codebase Audit)

จากการตรวจสอบอย่างละเอียดด้วยเครื่องมือค้นหาและ Git history:

### 2.1 โฟลเดอร์ `extensions/` บน Disk
```text
extensions/
└── vscode/
    ├── dist/
    │   ├── extension.js       (gitignored via .gitignore:14)
    │   └── extension.js.map
    └── node_modules/          (gitignored via .gitignore:4)
```
- **Git Tracking**: `git ls-files extensions` คืนค่าว่างเปล่า (0 files)
- **สรุป**: เป็น directory ขยะค้างจาก build/experiment เก่า สามารถลบโฟลเดอร์ `extensions/` ทิ้งได้ทันทีโดยไม่กระทบ Git working tree

### 2.2 โมดูล `ide-extension.ts` ใน Package
- ไฟล์: `packages/create-nexus-devflow/lib/ide-extension.ts`
- บทบาท: ฟังก์ชัน `generateIdeExtensionManifest()` คืนค่าโครงสร้าง `package.json` ของ VS Code Extension
- การอ้างอิง: **ไม่มีไฟล์โค้ดใดในโปรเจกต์ (ทั้ง CLI และ Library) ที่ import หรือเรียกใช้ฟังก์ชันนี้เลย** มีเพียงไฟล์เทส `packages/create-nexus-devflow/test/ide-extension.test.ts` ที่ import ไปทดสอบเท่านั้น

### 2.3 โมดูล `webview-studio.ts` (แยกแยะให้ชัดเจน)
- ฟีเจอร์ Webview Studio (`packages/create-nexus-devflow/lib/webview-studio.ts`) ทำหน้าที่เรนเดอร์หน้าจอ Studio UI
- โมดูลนี้ถูกเรียกใช้โดย:
  - คำสั่ง CLI: `nexus-devflow studio` (ใน `bin/create-nexus-devflow.ts`)
  - DevFlow MCP Server Tool: `devflow_get_studio_html` (ใน `lib/mcp.ts`)
- **ข้อควรระวัง**: `webview-studio.ts` เป็น UI ของ DevFlow Studio ที่เปิดผ่านเบราว์เซอร์และผ่าน MCP ได้ จึง**ไม่ใช่โค้ดในโฟลเดอร์ `extensions`** และยังเป็นฟังก์ชันที่มีประโยชน์ในปัจจุบัน

### 2.4 เอกสาร `devflow/context/project-overview.md`
- บรรทัดที่ 97 ระบุ:
  ```markdown
  - โฟลเดอร์หลัก: devflow, docs, evals, extensions, packages, scripts
  ```
- เกิดจากฟังก์ชัน `collectDataSources()` ใน `scripts/overview.ts`:
  ```typescript
  const entries = await fs.readdir(projectRoot, { withFileTypes: true });
  const visibleDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && name !== "node_modules" && name !== "dist")
    .sort();
  ```
  เมื่อใดก็ตามที่ลบโฟลเดอร์ `extensions` ออกจาก root แล้วสั่งรัน `npm run overview -- --write` รายการนี้จะอัปเดตตัด `extensions` ออกโดยอัตโนมัติ

---

## 3. การเปรียบเทียบทางเลือกในการนำออก (Options & Trade-offs)

| มิติการพิจารณา | Option A: ลบเฉพาะโฟลเดอร์ดิสก์ (Minimalist) | Option B: ลบโฟลเดอร์ + ลบ Manifest Generator (แนะนำ) | Option C: ลบทั้งโฟลเดอร์ + Manifest + Webview Studio ทั้งหมด |
| :--- | :--- | :--- | :--- |
| **ขอบเขตการลบ** | ลบโฟลเดอร์ `extensions/` และอัปเดต `project-overview.md` | ลบโฟลเดอร์ `extensions/` + ลบ `ide-extension.ts` + ปรับแก้เทสให้เป็น `studio.test.ts` + อัปเดต `project-overview.md` | ลบโฟลเดอร์ `extensions/` + ลบ `ide-extension.ts` + ลบ `webview-studio.ts` + ตัดคำสั่ง CLI `studio` + ตัด MCP tool `devflow_get_studio_html` |
| **ความสะอาดของโค้ด** | ปานกลาง (ยังมี `ide-extension.ts` ที่ไม่ได้ใช้งานค้างอยู่) | **สูงสุด (Clean & Consistent)** ตัดส่วน VS Code manifest ที่ไม่ได้ใช้ออก โดยไม่เสียฟังก์ชันการทำงานอื่น | ตัดฟีเจอร์ Studio ออกทั้งหมด |
| **ความเสี่ยง / Breaking Change** | 0% (ไม่มีไฟล์ Git เปลี่ยนแปลงนอกจากเอกสาร overview) | 0% (ไม่มี CLI หรือโค้ดภายนอกเรียกใช้ `generateIdeExtensionManifest`) | สูง (ตัดคำสั่ง `nexus-devflow studio` และ MCP tool ที่ผู้ใช้อาจใช้งาน) |
| **สถานะ Webview Studio & MCP** | คงอยู่ 100% | คงอยู่ 100% | ถูกลบทั้งหมด |

---

## 4. แผนงานการปฏิบัติการทีละขั้นตอน (Step-by-Step Execution Plan)

### สำหรับ Option B (แนวทางที่แนะนำ):

#### ขั้นตอนที่ 1: ลบโฟลเดอร์ขยะ `extensions/` ออกจาก Filesystem
```powershell
Remove-Item -Recurse -Force "d:\devtools\nexus-devflow\extensions"
```
- เนื่องจากไม่มีไฟล์ที่ track ใน Git จึงไม่มี git diff ในขั้นตอนนี้

#### ขั้นตอนที่ 2: ลบไฟล์ `ide-extension.ts`
```powershell
Remove-Item -Force "d:\devtools\nexus-devflow\packages\create-nexus-devflow\lib\ide-extension.ts"
```

#### ขั้นตอนที่ 3: ปรับปรุงไฟล์เทส `packages/create-nexus-devflow/test/ide-extension.test.ts`
- เปลี่ยนชื่อไฟล์เป็น `packages/create-nexus-devflow/test/webview-studio.test.ts`
- ลบ import `generateIdeExtensionManifest` ออก
- ลบเทสเคส `test("generateIdeExtensionManifest returns valid VS Code extension package definition", ...)` ออก
- คงเทสเคสของ `renderStudioHtml` และ MCP tool `devflow_get_studio_html` ไว้ทั้งหมด

#### ขั้นตอนที่ 4: คอมไพล์และอัปเดต `project-overview.md`
- รันคำสั่งคอมไพเลอร์อัตโนมัติ:
  ```bash
  npm run overview -- --write
  ```
- ผลลัพธ์: บรรทัด `โฟลเดอร์หลัก` ใน `devflow/context/project-overview.md` จะเปลี่ยนเป็น:
  `- โฟลเดอร์หลัก: devflow, docs, evals, packages, scripts` (ไม่มีคำว่า `extensions` อีกต่อไป)

#### ขั้นตอนที่ 5: ตรวจสอบความถูกต้อง (Multi-Lane Verification)
- รัน Typecheck: `npm run typecheck`
- รัน Package Tests: `npm test`
- รัน Framework Integrity Check: `npm run check`
- รัน Static Contract Check: `npm run check:static`
- รัน Package Smoke Test: `npm run test:package`

---

## 5. ผลกระทบต่อเอกสารประวัติศาสตร์ (Historical Archives)

- เอกสาร `devflow/history/features/047-ide-native-extension-webview-studio.md` และ `devflow/build-plan.md` (Feature 6):
  - **คำแนะนำ**: **ไม่ต้องลบหรือแก้ไขย้อนหลัง** เนื่องจากตามระเบียบของ Living Spec & 3-Pillars Model เอกสารใน `devflow/history/` ถือเป็น Immutable Archive (บันทึกสิ่งที่เคยทำไปแล้ว ณ วันที่ 2026-08-23)
  - หากต้องการบันทึกการนำออก ให้เปิด Task ใหม่ผ่าน `/fix` หรือ `/feature` เพื่อบันทึกเป็นประวัติการ Remodel/Cleanup อย่างถูกต้อง

---

## 6. ข้อเสนอแนะและขั้นตอนถัดไป (Decision & Next Steps)

- **คำแนะนำ**: เลือก **Option B** (ลบโฟลเดอร์ `extensions/`, ลบ `ide-extension.ts`, รีแฟกเตอร์เทสเป็น `webview-studio.test.ts`, และอัปเดต `project-overview.md`)
- **การดำเนินการต่อไป**:
  - เมื่อผู้ใช้เห็นชอบกับแนวทาง ให้เริ่มต้นกระบวนการแก้ไขผ่านคำสั่ง:
    - `/fix remove-unused-extensions-artifacts` หรือดำเนินการคลีนอัปตาม 5 ขั้นตอนข้างต้นทันที
