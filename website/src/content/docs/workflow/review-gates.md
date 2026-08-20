---
title: Review Gates & Discipline
description: กฎเหล็กและการหยุดรอการอนุมัติเพื่อความปลอดภัยสูงสุดในการพัฒนาซอฟต์แวร์ด้วย AI
---

เมื่อทำงานร่วมกับ AI Coding Agents ความเร็วในการเขียนโค้ดจะเพิ่มขึ้นอย่างมหาศาล แต่ความเสี่ยงเรื่อง **Hallucination (การมโนโค้ด)**, **Scope Creep (การทำงานเกินสั่ง)**, และ **Silent Regressions (บั๊กแอบแฝงที่ทำระบบเดิมพัง)** ก็เพิ่มขึ้นเป็นเงาตามตัว

**Nexus-DevFlow** ออกแบบระบบ **Review Gates & Discipline** ซึ่งเป็นด่านตรวจความปลอดภัย 4 ด่านที่คั่นระหว่างขั้นตอนสำคัญ เพื่อให้มั่นใจว่ามนุษย์และ AI เห็นชอบร่วมกันในทุกจุดชี้ขาด

---

## สถาปัตยกรรม 4 ด่านตรวจความปลอดภัย (The 4 Review Gates)

<div class="gate-grid">
  <div class="gate-card">
    <div>
      <div class="gate-card-num">Gate 1</div>
      <div class="gate-card-title">Discovery Gate</div>
      <div class="gate-card-stages">00-discover ➔ 10-define</div>
    </div>
    <p class="gate-card-criteria"><strong>เงื่อนไข:</strong> อนุมัติ <code>Proceed</code> และมีหลักฐานความเป็นไปได้ชัดเจน</p>
  </div>

  <div class="gate-card">
    <div>
      <div class="gate-card-num">Gate 2</div>
      <div class="gate-card-title">Spec & Plan Gate</div>
      <div class="gate-card-stages">20-spec ➔ 30-plan ➔ 40</div>
    </div>
    <p class="gate-card-criteria"><strong>เงื่อนไข:</strong> Acceptance Criteria และ Test Decisions (TDD) ผ่านการอนุมัติ</p>
  </div>

  <div class="gate-card">
    <div>
      <div class="gate-card-num">Gate 3</div>
      <div class="gate-card-title">QA & Findings Gate</div>
      <div class="gate-card-stages">50-verify ➔ 60-report</div>
    </div>
    <p class="gate-card-criteria"><strong>เงื่อนไข:</strong> มี Empirical Evidence และไม่มีข้อบกพร่อง <code>P0/P1</code> ค้างในระบบ</p>
  </div>

  <div class="gate-card">
    <div>
      <div class="gate-card-num">Gate 4</div>
      <div class="gate-card-title">Release Gate</div>
      <div class="gate-card-stages">70-release ➔ Production</div>
    </div>
    <p class="gate-card-criteria"><strong>เงื่อนไข:</strong> มนุษย์ยืนยันการทำ Git Commit, Merge PR หรือ Production Deploy</p>
  </div>
</div>

---

## เจาะลึก 4 ด่านตรวจหลัก (Deep Dive)

### 🚪 ด่านที่ 1: Discovery Gate (ก่อนสร้าง Running ID)
- **วัตถุประสงค์**: ป้องกันไม่ให้ทีมหรือ AI กระโจนลงไปเขียนโค้ดในงานที่ยังไม่ชัดเจน คุ้มค่า หรือยังไม่พร้อม
- **เงื่อนไขการผ่านด่าน**:
  1. เอกสาร `00-discover.md` ต้องระบุผลการตัดสินใจเป็น **`Proceed`** และมีสถานะ `Approval Status: Approved`
  2. หากผลสรุปเป็น `Defer` (ชะลอไว้ก่อน) หรือ `Reject` (ปฏิเสธ) งานจะยุติลงทันที **โดยไม่จัดสรร Running ID**
- **ประโยชน์**: ประหยัดเวลาของทีม และรักษา Running ID ให้เป็นตัวเลขที่สะอาดเฉพาะงานที่ส่งมอบจริง

---

### 🚪 ด่านที่ 2: Spec & Plan Review Gate (ก่อนลงมือเขียนโค้ด)
- **วัตถุประสงค์**: ป้องกันไม่ให้ AI มโนสถาปัตยกรรม เขียนโค้ดตามใจชอบ หรือลืมเขียน Unit Test
- **เงื่อนไขการผ่านด่าน**:
  1. เอกสาร `20-spec.md` ต้องมี **Acceptance Criteria** ที่วัดผลได้จริง และระบุ **Non-Goals (สิ่งที่อยู่นอกขอบเขต)** ชัดเจน
  2. เอกสาร `30-plan.md` ต้องระบุลำดับขั้นตอนย่อย (Subtasks) และมี **Test Decisions (`Required`)** สำหรับทุก Behavior Change
  3. AI ต้องหยุดรอให้มนุษย์ตรวจทาน Spec และ Plan ก่อน จึงจะสามารถเข้าสู่สเตจ `40-execute`
- **ประโยชน์**: มั่นใจได้ว่าโค้ดที่จะเขียนตรงตามความต้องการของธุรกิจ 100%

---

### 🚪 ด่านที่ 3: QA & Findings Gate (ก่อนจัดทำรายงานสรุป)
- **วัตถุประสงค์**: ตรวจสอบคุณภาพและความปลอดภัยอย่างเข้มงวดด้วยหลักฐานเชิงประจักษ์
- **เงื่อนไขการผ่านด่าน**:
  1. สเตจ `50-verify` ต้องมี **Empirical Evidence** (ผลลัพธ์จริงจากการรันเทสต์, Terminal Logs, HTTP Response Codes) ห้าม AI อ้างว่า "ผ่าน" ลอยๆ
  2. **กฎเหล็ก Findings Ledger**: ใน `devflow/context/findings.md` ต้องไม่มีข้อบกพร่องระดับ **`P0 (Blocker)`** หรือ **`P1 (Critical)`** ที่อยู่ในสถานะ `open`
  3. หากพบ P0 หรือ P1 ระบบจะ **Block** ห้ามข้ามไปยัง `60-report` และบังคับให้ AI ส่งกลับไปแก้ไขใน `40-execute` หรือเปิด Run ซ่อมแซมทันที
- **ประโยชน์**: ป้องกันไม่ให้บั๊กความรุนแรงสูงหลุดรอดไปถึงมือผู้ใช้งาน

---

### 🚪 ด่านที่ 4: Release & Delivery Gate (ก่อนส่งมอบงานจริง)
- **วัตถุประสงค์**: มอบอำนาจการตัดสินใจขั้นสูงสุดในการเปลี่ยนแปลง Codebase ให้แก่มนุษย์
- **เงื่อนไขการผ่านด่าน**:
  1. สเตจ `70-release` จะจัดเตรียม Commit Message, PR Description และ Changelog ให้พร้อม
  2. **AI ต้องหยุดเพื่อขอคำยืนยัน (Explicit Approval) จากมนุษย์** ก่อนจะรันคำสั่ง `git commit`, `git merge` หรือสร้าง Pull Request
  3. **ข้อห้ามเด็ดขาด**: ห้าม AI ทำการ `git push --force` หรือสั่ง Deploy ขึ้น Production Server โดยอัตโนมัติเป็นอันขาด
- **ประโยชน์**: มนุษย์เป็นผู้ถือสิทธิ์ควบคุมและรับผิดชอบความปลอดภัยของ Production เสมอ

---

## เปรียบเทียบขอบเขต: สิ่งที่ AI ทำได้เอง vs สิ่งที่ต้องหยุดรอมนุษย์

<div class="comparison-grid">
  <div class="comparison-card">
    <h4>
      <span>🤖 AI ดำเนินการอัตโนมัติ</span>
      <span class="badge blue">Autonomous Actions</span>
    </h4>
    <ul>
      <li><strong>การสำรวจ & วิเคราะห์</strong>: ค้นหาโค้ด, อ่านเอกสาร, ออกแบบทางเลือกเปรียบเทียบ</li>
      <li><strong>การออกแบบ Spec & Plan</strong>: ร่างข้อกำหนดทางเทคนิค, แตก Tasks, เขียน Checklists</li>
      <li><strong>การลงมือเขียนโค้ด</strong>: แก้ไขโค้ดในขอบเขต, เขียน Unit Tests, รันคำสั่ง Local Test</li>
      <li><strong>การตรวจสอบคุณภาพ</strong>: รัน Test Suites, ตรวจจับ Security Flaws, จดบันทึก Findings</li>
      <li><strong>การเตรียมส่งมอบ</strong>: จัดเตรียม Commit Message, ร่าง Release Notes, สร้าง HTML Report</li>
    </ul>
  </div>

  <div class="comparison-card accent">
    <h4>
      <span>👨‍💻 ต้องหยุดขออนุมัติจากมนุษย์</span>
      <span class="badge amber">Review Gate Required</span>
    </h4>
    <ul>
      <li><strong>การตัดสินใจ Discovery</strong>: อนุมัติการ <code>Proceed</code> / <code>Defer</code> / <code>Reject</code> ก่อนสร้าง Running ID</li>
      <li><strong>การอนุมัติขอบเขต</strong>: ตรวจรับ Acceptance Criteria และ Test Decisions ก่อนเริ่มเขียนโค้ด</li>
      <li><strong>การเปลี่ยนขอบเขต</strong>: ห้าม AI ขยายขอบเขตงานนอกเหนือจาก Spec โดยไม่ได้รับความเห็นชอบ</li>
      <li><strong>การปลดบล็อก Finding</strong>: การปิดสถานะ (Close) Finding ระดับ P0/P1</li>
      <li><strong>การกระทบ Production</strong>: การรันคำสั่ง <code>git commit</code>, <code>git merge</code>, <code>git push</code> และ Deploy</li>
    </ul>
  </div>
</div>

---

## บทเรียนเมื่อละเลย Review Gates (Case Studies)

:::caution[กรณีศึกษา: AI ข้ามขั้นตอน Spec แล้วลงมือ Implement ทันที]
- **ผลลัพธ์ที่เกิดขึ้น**: AI เขียนโค้ดเสร็จอย่างรวดเร็ว แต่ใช้ Database Library คนละตัวกับที่โปรเจกต์ใช้อยู่ ทำให้ต้องลบโค้ดทิ้งทั้งหมดและเสีย Token ไปโดยเปล่าประโยชน์
- **วิธีป้องกันด้วย DevFlow**: ด่านที่ 2 บังคับให้ตรวจ `20-spec.md` และ `coding-standards.md` ก่อนลงมือเขียนโค้ด ทำให้ตรวจพบความขัดแย้งของ Library ตั้งแต่นาทีแรก
:::

:::tip[บทสรุป]
Review Gates ใน DevFlow ไม่ได้ทำให้การพัฒนาช้าลง แต่เป็น **ราวกันตก (Guardrails)** ที่ทำให้คุณสามารถปล่อยให้ AI ทำงานได้อย่างเต็มสปีดโดยไม่ต้องกังวลว่าระบบจะพัง!
:::
