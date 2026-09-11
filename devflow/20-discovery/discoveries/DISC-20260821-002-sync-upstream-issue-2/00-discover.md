# Discovery: Review & Adapt AI Blueprint Upstream Updates (v0.9.1 -> v0.11.0)

- **Discovery ID**: `DISC-20260821-002`
- **Date**: 2026-08-21
- **Source**: [Issue #2: AI Blueprint upstream updates awaiting review](https://github.com/Jakkrich/nexus-devflow/issues/2)
- **Status**: Completed
- **Decision**: `Proceed` (อนุมัตินำทั้ง GitHub Copilot Adapter และ Live Dashboard UI มาปรับใช้ใน Nexus-DevFlow)

---

## 1. Context & Problem Statement

ระบบตรวจสอบ Upstream อัตโนมัติ (`nexus-upstream-monitor`) ตรวจพบการอัปเดตใหม่จาก Upstream Repository (`aiblueprinthq/ai-blueprint` branch `main`) จำนวน **4 Commits** ตั้งแต่ Baseline `c394e3b` (v0.9.1) ถึง Upstream HEAD `478a8b9` (v0.11.0)

ผู้ดูแลโครงการ (Maintainer) จำเป็นต้องทำการประเมินความเข้ากันได้ (Compatibility & Trade-off Analysis) ร่วมกับโครงสร้างของ **Nexus-DevFlow 2.0** ก่อนตัดสินใจอนุมัติและปรับใช้ใน codebase

---

## 2. Upstream Changes Analysis

### รายการ Commits ที่ตรวจพบ (4 Commits)

| Commit | ผู้เขียน / วันที่ | ข้อความ Commit | ฟีเจอร์ / การเปลี่ยนแปลง |
| :--- | :--- | :--- | :--- |
| `ab24730` | Akash Kakkar<br>*(2026-08-21)* | `feat: add GitHub Copilot adapter support (#4)` | เพิ่ม GitHub Copilot Adapter (`--copilot`), เปลี่ยน default combined mode เป็น `--all`, เก็บ `--both` เป็น deprecated alias |
| `f1cfad5` | Brad Traversy<br>*(2026-08-21)* | `chore: release create-ai-blueprint 0.10.0` | Release v0.10.0 |
| `4a31ffa` | Brad Traversy<br>*(2026-08-21)* | `feat: add live Blueprint dashboard` | เพิ่มคำสั่ง `blueprint ui` (และ `npx create-ai-blueprint ui`), เพิ่ม `lib/dashboard.ts` และ `lib/history.ts` แสดงผล Dashboard ในเครื่อง |
| `478a8b9` | Brad Traversy<br>*(2026-08-21)* | `chore: release create-ai-blueprint 0.11.0` | Release v0.11.0 |

---

## 3. Analysis & Compatibility with DevFlow 2.0

### A. Feature 1: GitHub Copilot Adapter Support (`ab24730`)
- **การทำงาน**: GitHub Copilot แชร์การใช้งานโครงสร้าง Skill ร่วมกับ OpenAI Codex ผ่านโฟลเดอร์ `.agents/skills/` โดย Copilot อ่าน `AGENTS.md` และ skill instruction ภายใน `.agents/`
- **ผลกระทบต่อ Nexus-DevFlow**:
  - Nexus-DevFlow รองรับ Copilot ในคำแนะนำ `AGENTS.md` อยู่แล้ว
  - การปรับใช้ใน `packages/create-nexus-devflow`: อัปเดต `project-metadata.ts` และ `update.ts` ให้รองรับ `--copilot` และ `--all` เพื่อความสมบูรณ์แบบในการติดตั้ง CLI

### B. Feature 2: Live Blueprint Dashboard UI (`4a31ffa`)
- **การทำงาน**: เพิ่มโมดูล `lib/dashboard.ts` Server และ Web Client ในตัว package เพื่อรัน Local Web Server แสดงสถานะโครงการและประวัติงาน
- **ผลกระทบต่อ Nexus-DevFlow**:
  - Nexus-DevFlow 2.0 มีระบบ 3-Pillars (`ideas.md`, `devflow/context/`, `devflow/history/`) และมีสคริปต์ standalone `/report:html`
  - การนำ Live Dashboard UI มาปรับใช้จะช่วยให้ผู้ใช้สามารถรัน `nexus-devflow ui` หรือ `devflow ui` เพื่อดูสถานะ Active Work, Discovery, History ผ่านเว็บอินเทอร์เฟซแบบเรียลไทม์ได้สะดวกยิ่งขึ้น

---

## 4. Trade-off Comparison Table

| ทางเลือก | ข้อดี (Pros) | ข้อเสีย / ความท้าทาย (Cons) | คำแนะนำ (Recommendation) |
| :--- | :--- | :--- | :--- |
| **Option A: ปรับใช้เฉพาะ Copilot Adapter (`ab24730`)** | ทำได้ง่าย ความเสี่ยงต่ำ ช่วยเพิ่มความสมบูรณ์ในการติดตั้งผ่าน CLI | ยังไม่ได้ประโยชน์จากระบบ Live Dashboard UI ใหม่ | ไม่แนะนำ (ได้ประโยชน์ไม่ครบถ้วน) |
| **Option B: ปรับใช้เฉพาะ Live Dashboard UI (`4a31ffa`)** | ผู้ใช้ได้ Live UI ทันที | ขาดการอัปเดต Copilot Adapter ใน CLI installer | ไม่แนะนำ |
| **Option C: ปรับใช้ทั้ง Copilot Adapter และ Live Dashboard UI** *(แนะนำ)* | ได้ฟีเจอร์ครบถ้วนตาม Upstream v0.11.0 พร้อมปรับแต่งให้รองรับ DevFlow 2.0 Architecture | ต้องออกแรงปรับแต่ง `dashboard.ts` และ `update.ts` ให้เข้ากับโครงสร้าง `nexus-devflow` | **แนะนำอย่างยิ่ง (Proceed)** |
| **Option D: ข้ามการอัปเดต (Defer / Reject)** | ไม่ต้องแก้ไขโค้ด | พลาดฟีเจอร์ใหม่และเกิดความล้าหลังสะสมจาก Upstream | ไม่แนะนำ |

---

## 5. Overlapping Files & Conflict Assessment

จากการรัน `scripts/inspect-upstream.ts` พบไฟล์ที่มีการแก้ไขใน Upstream และมีอยู่ใน `nexus-devflow`:

1. `AGENTS.md`: Nexus-DevFlow มีเนื้อหา AGENTS.md เฉพาะตัวสำหรับ DevFlow 2.0 อยู่แล้ว ให้ปรับปรุงเพียงจุดอ้างอิง Copilot Adapter
2. `packages/create-nexus-devflow/`: ปรับใช้การเปลี่ยนแปลงจาก `packages/create-ai-blueprint/` เข้ากับ package ของ nexus-devflow
3. `README.md` & `CHANGELOG.md`: บันทึกการอัปเดตเข้าสู่ออร์แกนิกของ Nexus-DevFlow
4. `.nexus/upstream-ai-blueprint.json`: อัปเดต `lastReviewedCommit` เป็น `478a8b9a04f05286fa092b192184e50388e59ba8` หลังเสร็จสิ้นการ Delivery

---

## 6. Decision & Next Steps

- **Decision**: `Proceed`
- **คำแนะนำสำหรับ Delivery Stage**:
  1. สร้าง Delivery Run: `/10-define DISC-20260821-002` (หรือเปิด Blueprint Fast-Track `/feature sync-upstream-v0110`)
  2. ดำเนินการตาม DevFlow Delivery Pipeline (`20-spec` -> `30-plan` -> `40-execute` -> `50-verify` -> `60-report` -> `70-release`)
  3. อัปเดต `.nexus/upstream-ai-blueprint.json` ให้ `lastReviewedCommit` ชี้ไปที่ `478a8b9a04f05286fa092b192184e50388e59ba8`
