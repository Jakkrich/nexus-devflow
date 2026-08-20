---
title: Role-Based Usage Guide
description: แนวทางการประยุกต์ใช้ Nexus-DevFlow 2.0 สำหรับแต่ละบทบาทหน้าที่ ตั้งแต่ Junior Developer จนถึง Engineering Manager
---

import { Card, CardGrid } from '@astrojs/starlight/components';

**Nexus-DevFlow 2.0** ถูกออกแบบมาเพื่อตอบโจทย์การทำงานร่วมกันระหว่าง **มนุษย์ (Human)** และ **AI Agents** ในทุกระดับประสบการณ์ ไม่ว่าคุณจะเป็นนักพัฒนาเริ่มต้น หรือผู้บริหารระดับสูง คู่มือนี้จะช่วยแนะนำวิธีการใช้งาน DevFlow ให้เกิดประโยชน์สูงสุดสำหรับบทบาทของคุณ:

<CardGrid>
  <Card title="Junior Developer" icon="star">
    เริ่มต้นพัฒนาอย่างมั่นใจ มี Review Gates เป็นเกราะป้องกัน และเรียนรู้ Best Practices ไปพร้อมกับ AI
  </Card>
  <Card title="Senior Engineer" icon="rocket">
    เพิ่มพลังการส่งมอบ ควบคุม Spec/Architecture และตรวจรับรองคุณภาพด้วย Multi-Lane Verification
  </Card>
  <Card title="Tech Lead & Architect" icon="shield">
    คุมมาตรฐานวิศวกรรม กำกับดูแล Findings Ledger (P0-P3) และป้องกัน Workflow Drift ของทั้งทีม
  </Card>
  <Card title="Product & Eng Manager" icon="chart">
    วางกรอบความต้องการ ติดตามความคืบหน้าระดับชิ้นงาน และตรวจรับงานผ่าน Interactive HTML Reports
  </Card>
</CardGrid>

---

## 🔰 1. Junior Developer Path (ก้าวแรกสู่วิศวกรมืออาชีพ)

สำหรับนักพัฒนาเริ่มต้น การทำงานกับ Codebase ขนาดใหญ่หรือการสั่งงาน AI อาจทำให้รู้สึกสับสนและกลัวข้อผิดพลาด DevFlow ทำหน้าที่เป็น **พี่เลี้ยงและเกราะป้องกัน (Safety Net)** ที่ช่วยแนะนำทีละสเต็ป

### กิจวัตรประจำวันของ Junior Developer:
1. **เริ่มต้นวันใหม่ด้วย `/devflow`**:
   - พิมพ์ `/devflow` เพื่อดูว่าโปรเจกต์กำลังอยู่ที่ Stage ไหน และควรทำอะไรต่อไป
   - ป้องกันการหลงทาง หรือการกระโดดไปแก้โค้ดโดยที่ยังไม่มี Spec
2. **รับมอบหมายงานและเปิด Discovery**:
   - เมื่อได้รับ Ticket หรือโจทย์ ให้เริ่มด้วย `/00-discover [โจทย์ที่ได้รับ]`
   - ให้ AI ช่วยวิเคราะห์ไฟล์ที่เกี่ยวข้อง และเสนอแนะทางเลือกก่อนตัดสินใจ
3. **พัฒนาโค้ดแบบก้าวทีละขั้นใน `40-execute`**:
   - ทำตาม Checklist ใน `checklists/implementation-checklist.md` ทีละข้อ
   - **เขียน Unit Test คู่กันเสมอ (TDD)**: ให้ AI ช่วยเขียน Test เคสพื้นฐาน (AAA Pattern: Arrange-Act-Assert) เพื่อการันตีว่าโค้ดทำงานได้จริง
4. **ทดสอบผลงานด้วยตัวเองผ่าน `/try` Guide**:
   - เมื่อถึงขั้นตอนตรวจรับงาน ให้เปิดดู Try Guide ใน `60-report.html` หรือรัน `/try`
   - ปฏิบัติตามขั้นตอน *Where to go, What to click, What to expect* เพื่อทดสอบด้วยตัวเองในเบราว์เซอร์
5. **เมื่อเจอปัญหา ติดขัด หรือเกิด Bug**:
   - ใช้คำสั่ง `/debug [อาการที่พบ]` เพื่อให้ AI ช่วยสืบค้นสาเหตุของปัญหาอย่างมีหลักการ แทนการสุ่มแก้โค้ดไปเรื่อยๆ

:::tip[คำแนะนำสำหรับ Junior]
อย่ากลัว Review Gates! การที่ AI หยุดรอให้คุณกดยืนยัน คือโอกาสที่คุณจะได้ตรวจสอบความถูกต้องและทำความเข้าใจโค้ดก่อนที่มันจะถูกบันทึกจริง
:::

---

## ⚡ 2. Mid / Senior Software Engineer Path (ความเร็วคู่สถาปัตยกรรม)

สำหรับ Senior Engineer คุณคือแกนหลักในการขับเคลื่อนฟีเจอร์และรักษาคุณภาพของโค้ด DevFlow ช่วยให้คุณส่งมอบงานได้เร็วขึ้น 3-5 เท่าโดยไม่ลดทอนมาตรฐาน

### กลยุทธ์การทำงานของ Senior Engineer:
1. **ควบคุมทิศทาง Architecture ตั้งแต่ต้นทาง**:
   - ใช้ทักษะ `/architecture`, `/domain-modeling`, และ `/api-and-interface-design` ในการวาง Seam และ Interface Contracts ก่อนเขียนโค้ด
   - กำหนด Types และ Data Schemas ให้แข็งแรงด้วย `/type-design` และ `/database-design`
2. **ร่าง Spec และ Plan ที่แม่นยำ (`20-spec` & `30-plan`)**:
   - กำหนด Acceptance Criteria ที่วัดผลได้จริง ปิดช่องโหว่ Edge Cases และระบุ Non-Goals ชัดเจน
   - ในขั้นตอน Plan ให้ระบุ Test Decision เป็น `Required` สำหรับทุกการเปลี่ยนแปลงพฤติกรรมโค้ด
3. **ใช้พลังของ Multi-AI Adapters**:
   - สลับใช้งาน AI Engines ตามจุดเด่นของแต่ละโมเดล เช่น ใช้ Claude Code สำหรับงาน Refactor เชิงลึก, ใช้ Antigravity สำหรับ Interactive IDE Flow, และใช้ Codex สำหรับ Terminal CLI
4. **ทำ Senior QA Verification (`50-verify`)**:
   - รันการตรวจสอบหลายมิติ: Unit Tests, Linting, Typechecking, Security Scan (`/security-review`), และ Performance Profiling (`/performance-optimization`)
   - บันทึกปัญหาที่พบลงใน `findings.md` เพื่อให้แน่ใจว่าได้รับการแก้ไขอย่างเป็นระบบ
5. **ทำ Autonomous Pass ด้วย `/autopilot`**:
   - สำหรับงานที่เป็นมาตรฐานหรือฟีเจอร์ที่มีขอบเขตชัดเจน สามารถสั่ง `/autopilot` เพื่อให้ระบบรัน Spec -> Plan -> Implement -> Verify พร้อมทำ Checkpoint Commits อัตโนมัติ

---

## 🛡️ 3. Tech Lead & Software Architect Path (ความเสถียรและมาตรฐานขององค์กร)

สำหรับ Tech Lead และ Architect หน้าที่หลักคือการรักษามาตรฐานวิศวกรรม ความปลอดภัย และความสามารถในการขยายระบบ (Maintainability & Scalability)

### เครื่องมือและหน้าที่ของ Tech Lead / Architect:
1. **การ Onboard และสร้าง Baseline ให้โปรเจกต์**:
   - ใช้ `/onboard` สำหรับโปรเจกต์ใหม่ เพื่อตั้งค่า `coding-standards.md`, คำสั่ง Verify, และ Stack Detection
   - ใช้ `/adopt` เพื่อนำ DevFlow ไปครอบระบบ Brownfield เดิมที่พัฒนาอยู่แล้วอย่างราบรื่น
2. **กำกับดูแล Findings Ledger (`findings.md`)**:
   - บังคับใช้กฎเหล็ก: **ห้าม Merge หรือปิดงาน (`70-release`) เด็ดขาด หากมี Finding ระดับ P0 (Critical Blocker) หรือ P1 (Major Flaw) ค้างอยู่ในสถานะ Open**
   - ตรวจสอบว่า Finding ทุกรายการมี ID ถาวรและได้รับการ Re-verify จนครบถ้วน
3. **ป้องกัน Workflow Drift ด้วย `/doctor`**:
   - รัน `/doctor` สม่ำเสมอเพื่อตรวจสุขภาพของโปรเจกต์ ความสมบูรณ์ของ Adapters และความสดใหม่ของ Context Files
4. **ตั้งค่า Continuous Integration (`/ci`)**:
   - สร้างและดูแล GitHub Actions Verify Workflow (`.github/workflows/verify.yml`) ให้สอดคล้องกับคำสั่งทดสอบจริงของโปรเจกต์
5. **สกัดองค์ความรู้และสร้างความยั่งยืน**:
   - ใช้ `/insight` และ `/documentation-and-adrs` เพื่อบันทึก Architectural Decisions และบทเรียนจาก Incident ต่างๆ เก็บไว้ใน Knowledge Base ของทีม

---

## 📊 4. Product Manager (PO/PM) & Engineering Manager Path (ผลลัพธ์เชิงธุรกิจและการตรวจรับงาน)

สำหรับ Product Manager และ Engineering Manager, DevFlow มอบความโปร่งใส (Traceability) และลดระยะเวลา Time-to-Market พร้อมเครื่องมือตรวจรับงานที่เข้าใจง่าย

### วิธีการใช้งานสำหรับ PM / EM:
1. **เปลี่ยนไอเดียธุรกิจให้เป็นข้อกำหนดทางเทคนิค**:
   - เริ่มต้นด้วย `/goal` หรือ `/brainstorm` เพื่อระดมไอเดียและเปรียบเทียบความคุ้มค่า
   - ร่างเอกสารข้อกำหนดด้วย `/prd` เพื่อกำหนด User Personas, Use Cases, และ Success Metrics
2. **การแบ่งก้อนงานเป็น Slices เล็กๆ (`10-define`)**:
   - ทำงานร่วมกับ Tech Lead ในการแบ่ง Initiative ใหญ่ให้เป็นรอบย่อย (Small Deliverable Runs) เพื่อให้ส่งมอบงานได้อย่างต่อเนื่องและลดความเสี่ยง
3. **การตรวจรับงานจริงผ่าน Interactive HTML Reports (`60-report.html`)**:
   - ไม่จำเป็นต้องอ่านโค้ด เพียงเปิดไฟล์ `60-report.html` ที่ AI สร้างขึ้น
   - ดูสรุปสิ่งที่สร้างเสร็จ, Acceptance Criteria Checklist, ผลการทดสอบ และกดดู **Try Guide** เพื่อทดลองเล่นฟีเจอร์จริงใน Staging
4. **การบริหารจัดการ Release และ Changelog**:
   - ติดตามประวัติการปล่อยงานจาก `devflow/history/HISTORY.md`
   - สร้าง Release Notes และ Changelog สรุปส่งให้ผู้บริหารหรือลูกค้าผ่านคำสั่ง `/changelog` และ `/70-release`
5. **การวางแผน Roadmap ระยะยาว**:
   - ใช้ `/roadmap-strategy` และ `/competitor-analysis` เพื่อวางแผน Roadmap ผลิตภัณฑ์ที่ตอบโจทย์ตลาด
