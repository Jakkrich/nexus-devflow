---
title: Case Studies & Real-World Usage Flows
description: รวมกรณีศึกษาและเส้นทางการใช้งานจริงครบทุกรูปแบบ (All Recommended Flows) จากคลังเอกสารทางการของ Nexus-DevFlow 2.0
---

import { Card, CardGrid, Tabs, TabItem } from '@astrojs/starlight/components';

หน้านี้รวบรวม **เส้นทางการใช้งานจริงครบทุกกรณี (All Recommended Flows & Case Studies)** ตามมาตรฐานของ [`docs/USAGE.md`](file:///d:/Projects/devtools/nexus-devflow/docs/USAGE.md) และ [`docs/example-runs.md`](file:///d:/Projects/devtools/nexus-devflow/docs/example-runs.md) เพื่อเป็นพิมพ์เขียวในการเลือกเส้นทางที่ถูกต้องสำหรับงานแต่ละประเภท โดยแสดงผลเป็นแผนผัง HTML ที่ชัดเจน สวยงาม และเข้าใจง่ายครับ

---

## 🧭 รวมเส้นทางการใช้งานจริงครบทุกกรณี (All Recommended Flows)

---

### 🔹 Flow 1: งานพัฒนาฟีเจอร์ใหม่มาตรฐาน (Standard New Work)

ใช้เส้นทาง Mainline เต็มรูปแบบเมื่อเริ่มต้นงานฟีเจอร์ใหม่ที่ต้องการจัดเก็บประวัติ Artifact ครบวงจรตั้งแต่การตั้งสมมติฐานจนถึงการส่งมอบ:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #0B43BA; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B43BA" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    Flow 1: Standard Linear Mainline (00 ➔ 70)
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem;">
    <div style="padding: 0.45rem 0.75rem; background: #E9F0FF; border: 1px solid #0B43BA; border-radius: 6px; font-weight: 700; color: #0B43BA; font-size: 0.85rem;">🔵 00-discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FDF4FF; border: 1px solid #7C3AED; border-radius: 6px; font-weight: 700; color: #7C3AED; font-size: 0.85rem;">🟣 10-define</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FEF9C3; border: 1px solid #CA8A04; border-radius: 6px; font-weight: 700; color: #854D0E; font-size: 0.85rem;">🟡 20-spec</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FFEDD5; border: 1px solid #EA580C; border-radius: 6px; font-weight: 700; color: #9A3412; font-size: 0.85rem;">🟠 30-plan</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #DCFCE7; border: 1px solid #16A34A; border-radius: 6px; font-weight: 700; color: #166534; font-size: 0.85rem;">🟢 40-execute</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FFE4E6; border: 1px solid #E11D48; border-radius: 6px; font-weight: 700; color: #9F1239; font-size: 0.85rem;">🔴 50-verify</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #F5EBE6; border: 1px solid #854D0E; border-radius: 6px; font-weight: 700; color: #78350F; font-size: 0.85rem;">🟤 60-report</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #F1F5F9; border: 1px solid #475569; border-radius: 6px; font-weight: 700; color: #1E293B; font-size: 0.85rem;">🔘 70-release</div>
  </div>
</div>

* **ตัวอย่างการสั่งงาน**:
  ```bash
  /00-discover "Add password reset with email OTP"
  /10-define DISC-20260818-001-password-reset
  /20-spec RUN-012-password-reset
  /30-plan RUN-012-password-reset
  /40-execute RUN-012-password-reset
  /50-verify RUN-012-password-reset
  /60-report RUN-012-password-reset
  /70-release RUN-012-password-reset
  ```
* **ผลลัพธ์ของ Flow**:
  - `00-discover`: บันทึกไอเดียและการอนุมัติ Proceed ภายใต้ Discovery ID โดยไม่จอง Running ID
  - `10-define`: ตีกรอบ In-Scope และจัดสรร Running ID (`RUN-012`)
  - `20-spec` ถึง `70-release`: ร่างสเปก, วางแผน, เขียนโค้ดคู่ Unit Test (TDD), ตรวจสอบ QA, สร้างรายงาน HTML, และ Release

---

### 🔹 Flow 2: ไอเดียที่ยังมีหลายทางเลือก (Idea Still Needs Shaping)

ใช้เมื่อโจทย์มีความคลุมเครือ มีหลายแนวทางที่เป็นไปได้ หรือต้องการเปรียบเทียบข้อดี-ข้อเสีย (Trade-offs) ก่อนตัดสินใจ:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #6366F1; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
    Flow 2: Brainstorming & Ideation Loop
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;">
    <div style="padding: 0.45rem 0.75rem; background: #E9F0FF; border: 1px solid #0B43BA; border-radius: 6px; font-weight: 700; color: #0B43BA; font-size: 0.85rem;">🔵 00-discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #EEF2FF; border: 1px solid #6366F1; border-radius: 6px; font-weight: 700; color: #4338CA; font-size: 0.85rem;">💡 Brainstorm (ทางเลือก)</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #ECFDF5; border: 1px solid #10B981; border-radius: 6px; font-weight: 700; color: #065F46; font-size: 0.85rem;">🔄 สรุปผลกลับเข้า Discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FDF4FF; border: 1px solid #7C3AED; border-radius: 6px; font-weight: 700; color: #7C3AED; font-size: 0.85rem;">🟣 10-define</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FEF9C3; border: 1px solid #CA8A04; border-radius: 6px; font-weight: 700; color: #854D0E; font-size: 0.85rem;">🟡 20-spec</div>
  </div>
</div>

* **ตัวอย่างการสั่งงาน**:
  ```bash
  /00-discover "Improve user onboarding flow"
  Brainstorm "Compare 3 onboarding wizard patterns"
  /00-discover DISC-20260818-002-user-onboarding
  /10-define DISC-20260818-002-user-onboarding
  /20-spec RUN-013-user-onboarding
  ```
* **เหตุผลที่ต้องใช้**: ได้เปรียบเทียบทางเลือก A vs B vs C พร้อมวิเคราะห์ Trade-offs ลงใน `devflow/research/` แล้วดึงผลสรุปกลับมารวมใน `00-discover.md`

---

### 🔹 Flow 3: งานที่ต้องการข้อมูลเทคนิคและการเชื่อมต่อระบบ (Needs Integration Knowledge)

ใช้เมื่องานต้องเชื่อมต่อกับ API ภายนอก, Library ใหม่ หรือต้องการค้นคว้าความเข้ากันได้ของสถาปัตยกรรมเดิม:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #0284C7; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    Flow 3: Research & Codebase Investigation Loop
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;">
    <div style="padding: 0.45rem 0.75rem; background: #E9F0FF; border: 1px solid #0B43BA; border-radius: 6px; font-weight: 700; color: #0B43BA; font-size: 0.85rem;">🔵 00-discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #F0F9FF; border: 1px solid #0284C7; border-radius: 6px; font-weight: 700; color: #0369A1; font-size: 0.85rem;">🔬 Research (ค้นคว้าข้อมูล)</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #ECFDF5; border: 1px solid #10B981; border-radius: 6px; font-weight: 700; color: #065F46; font-size: 0.85rem;">🔄 สรุปผลกลับเข้า Discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FDF4FF; border: 1px solid #7C3AED; border-radius: 6px; font-weight: 700; color: #7C3AED; font-size: 0.85rem;">🟣 10-define</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FEF9C3; border: 1px solid #CA8A04; border-radius: 6px; font-weight: 700; color: #854D0E; font-size: 0.85rem;">🟡 20-spec</div>
  </div>
</div>

* **ตัวอย่างการสั่งงาน**:
  ```bash
  /00-discover "Subscription billing with Stripe"
  Research "Stripe subscription webhook idempotency and customer portal"
  /00-discover DISC-20260818-003-stripe-billing
  /10-define DISC-20260818-003-stripe-billing
  /20-spec RUN-014-stripe-billing
  ```
* **เหตุผลที่ต้องใช้**: รวบรวมข้อเท็จจริงทางเทคนิคและ Payload Contract บันทึกไว้ใน `devflow/research/` ก่อนเริ่มเขียนสเปก

---

### 🔹 Flow 4: งานที่ต้องการตีกรอบ Product และขอบเขต MVP (Needs Product & Market Framing)

ใช้เมื่อฟีเจอร์มีความสำคัญเชิงธุรกิจสูง ต้องการนิยาม User Persona, Business Value, ขอบเขต MVP และตัวชี้วัดความสำเร็จ:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #7C3AED; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    Flow 4: PRD & Product Scoping Flow
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;">
    <div style="padding: 0.45rem 0.75rem; background: #E9F0FF; border: 1px solid #0B43BA; border-radius: 6px; font-weight: 700; color: #0B43BA; font-size: 0.85rem;">🔵 00-discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #F0F9FF; border: 1px solid #0284C7; border-radius: 6px; font-weight: 700; color: #0369A1; font-size: 0.85rem;">🔬 Research</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FAF5FF; border: 1px solid #A855F7; border-radius: 6px; font-weight: 700; color: #6B21A8; font-size: 0.85rem;">📋 PRD (กรอบ MVP)</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #ECFDF5; border: 1px solid #10B981; border-radius: 6px; font-weight: 700; color: #065F46; font-size: 0.85rem;">🔄 สรุปผลกลับเข้า Discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FDF4FF; border: 1px solid #7C3AED; border-radius: 6px; font-weight: 700; color: #7C3AED; font-size: 0.85rem;">🟣 10-define</div>
  </div>
</div>

* **ตัวอย่างการสั่งงาน**:
  ```bash
  /00-discover "AI Assistant workflow enhancement"
  Research "Competitor developer workflows and CLI interaction patterns"
  PRD "AI Assistant MVP Framing"
  /00-discover DISC-20260818-004-ai-assistant
  /10-define DISC-20260818-004-ai-assistant
  /20-spec RUN-015-ai-assistant
  ```
* **เหตุผลที่ต้องใช้**: สร้างเอกสาร PRD ใน `devflow/prds/` เพื่อตีกรอบ MVP และเกณฑ์วัดความสำเร็จก่อนก้าวสู่การวางข้อกำหนดทางเทคนิค

---

### 🔹 Flow 5: ปัญหาเริ่มจากบั๊กในระบบ (Starts from a Bug / Failure)

ใช้เมื่อเกิดปัญหา ข้อผิดพลาด หรือ Regression ในระบบ และต้องการสืบสวนหาต้นตอ (Root Cause Analysis - RCA) ก่อนเริ่มแก้ไขโค้ด:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #E11D48; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    Flow 5: Bug Investigation & Safe Fix Flow
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem;">
    <div style="padding: 0.45rem 0.75rem; background: #E9F0FF; border: 1px solid #0B43BA; border-radius: 6px; font-weight: 700; color: #0B43BA; font-size: 0.85rem;">🔵 00-discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FFF1F2; border: 1px solid #E11D48; border-radius: 6px; font-weight: 700; color: #9F1239; font-size: 0.85rem;">🐞 Debug (วิเคราะห์ RCA)</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #ECFDF5; border: 1px solid #10B981; border-radius: 6px; font-weight: 700; color: #065F46; font-size: 0.85rem;">🔄 สรุปผลกลับเข้า Discover</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FDF4FF; border: 1px solid #7C3AED; border-radius: 6px; font-weight: 700; color: #7C3AED; font-size: 0.85rem;">🟣 10-define</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FFEDD5; border: 1px solid #EA580C; border-radius: 6px; font-weight: 700; color: #9A3412; font-size: 0.85rem;">🟠 30-plan</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #DCFCE7; border: 1px solid #16A34A; border-radius: 6px; font-weight: 700; color: #166534; font-size: 0.85rem;">🟢 40-execute</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FFE4E6; border: 1px solid #E11D48; border-radius: 6px; font-weight: 700; color: #9F1239; font-size: 0.85rem;">🔴 50-verify</div>
  </div>
</div>

* **ตัวอย่างการสั่งงาน**:
  ```bash
  /00-discover "Login redirects forever after session expiry"
  Debug "Login redirects forever after session expiry"
  /00-discover DISC-20260818-005-session-redirect-bug
  /10-define DISC-20260818-005-session-redirect-bug
  /20-spec RUN-016-session-redirect-bug
  /30-plan RUN-016-session-redirect-bug
  /40-execute RUN-016-session-redirect-bug
  /50-verify RUN-016-session-redirect-bug
  ```
* **เหตุผลที่ต้องใช้**: `Debug` จะช่วยวิเคราะห์และจำลองการพัง (Reproduction Case) พร้อมบันทึก RCA ลงใน `devflow/debug/` โดยยังไม่แก้โค้ดแบบสุ่มสี่สุ่มห้า

---

### 🔹 Flow 6: งานคำขอกว้างที่ต้องหาเป้าหมายก่อน (Goal Intake Routing Flow)

ใช้เมื่อคำขอของผู้ใช้มีความกว้างมาก (Broad Request) และยังไม่แน่ใจว่าจะเริ่มต้นอย่างไร:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #0284C7; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    Flow 6: Goal Runner & Intake Routing
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;">
    <div style="padding: 0.45rem 0.75rem; background: #F0FDF4; border: 1px solid #16A34A; border-radius: 6px; font-weight: 700; color: #166534; font-size: 0.85rem;">🎯 Goal Runner (ตั้งเป้าหมาย)</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #F8FAFC; border: 1px solid #64748B; border-radius: 6px; font-weight: 700; color: #334155; font-size: 0.85rem;">🧭 Routing & Context Evaluation</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #E9F0FF; border: 1px solid #0B43BA; border-radius: 6px; font-weight: 700; color: #0B43BA; font-size: 0.85rem;">🔵 00-discover (เข้าสู่ Mainline)</div>
  </div>
</div>

* **ตัวอย่างการสั่งงาน**:
  ```bash
  Goal "Add password reset with regression tests and rate limiting"
  # หรือผ่าน CLI:
  npm run goal -- goal "Add password reset with regression tests" max-turns 20 dry-run
  ```
* **ผลลัพธ์ของ Flow**: ช่วยวิเคราะห์เจตนาเบื้องต้นก่อนส่งมอบเข้าสู่ `00-discover` อย่างเป็นระเบียบ

---

### 🔹 Flow 7: งานที่เน้นการพิสูจน์ผลลัพธ์สูง (Verification-Heavy & Tracked Run)

ใช้สำหรับงานประเภท Infrastructure, Core Migrations, หรือ Security Hardening ที่การพิสูจน์ผลลัพธ์ (Evidence Verification) มีความสำคัญสูงสุด:

<div class="flow-diagram-container" style="margin: 1.25rem 0; padding: 1.25rem; background: #FFFFFF; border: 1px solid #D9DED9; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
  <div style="font-weight: 700; color: #0F172A; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    Flow 7: Verification-Heavy Tracked Run with Checklists
  </div>
  <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem;">
    <div style="padding: 0.45rem 0.75rem; background: #FFEDD5; border: 1px solid #EA580C; border-radius: 6px; font-weight: 700; color: #9A3412; font-size: 0.85rem;">🟠 30-plan</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FEF3C7; border: 1px solid #D97706; border-radius: 6px; font-weight: 700; color: #92400E; font-size: 0.85rem;">📋 Checklists Layer</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #DCFCE7; border: 1px solid #16A34A; border-radius: 6px; font-weight: 700; color: #166534; font-size: 0.85rem;">🟢 40-execute</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #FFE4E6; border: 1px solid #E11D48; border-radius: 6px; font-weight: 700; color: #9F1239; font-size: 0.85rem;">🔴 50-verify</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #E0E7FF; border: 1px solid #4338CA; border-radius: 6px; font-weight: 700; color: #312E81; font-size: 0.85rem;">📊 60-report.html</div>
    <span style="color: #64748B; font-weight: 700;">➔</span>
    <div style="padding: 0.45rem 0.75rem; background: #F1F5F9; border: 1px solid #475569; border-radius: 6px; font-weight: 700; color: #1E293B; font-size: 0.85rem;">🔘 70-release</div>
  </div>
</div>

* **การติดตามงานผ่าน Checklists**:
  - `checklists/implementation-checklist.md`: ติดตาม Task รายย่อยพร้อมเครื่องหมาย `- [x]`
  - `checklists/verification-checklist.md`: บันทึกคำสั่งและผลลัพธ์การรันจริง (Execution Evidence)
  - `60-report.html`: รายงาน Standalone HTML สำหรับให้ Stakeholders เปิดตรวจรับงานจริงได้ทันที

---

## 🧭 ตัวช่วยตัดสินใจ: สถานการณ์ไหน ควรเริ่มด้วยคำสั่งใด? (Quick Decision Navigator)

### 1. 💡 คำขอใหม่ หรือยังไม่แน่ใจในทิศทาง
* **สถานการณ์**: มีไอเดียใหม่ หรือมีหลายทิศทางที่ต้องชั่งน้ำหนัก
* **คำสั่งเริ่มต้น**: `/00-discover` หรือ `Brainstorm`
* **เส้นทางถัดไป**: สรุปผล ➔ `/10-define`

---

### 2. 🔬 ต้องการข้อมูลเทคนิค / API ภายนอก
* **สถานการณ์**: ขาดข้อเท็จจริง ต้องค้นคว้า Codebase เดิม หรือศึกษา Library ใหม่
* **คำสั่งเริ่มต้น**: `Research`
* **เส้นทางถัดไป**: ดึงผลสรุปกลับ ➔ `/00-discover`

---

### 3. 🐞 เจอบั๊ก หรือระบบพัง
* **สถานการณ์**: ต้องการสืบสวนหาต้นตอ (Root Cause Analysis - RCA) ก่อนเริ่มแก้โค้ด
* **คำสั่งเริ่มต้น**: `Debug`
* **เส้นทางถัดไป**: วิเคราะห์ RCA ➔ `/00-discover`

---

### 4. 📋 ต้องการตีกรอบ MVP / Business Value
* **สถานการณ์**: นิยาม User Persona, User Story, และตัวชี้วัดความสำเร็จของฟีเจอร์
* **คำสั่งเริ่มต้น**: `PRD`
* **เส้นทางถัดไป**: สร้างเอกสาร PRD ➔ `/00-discover`

---

### 5. 🟣 มี Discovery ที่ได้รับอนุมัติแล้ว
* **สถานการณ์**: พร้อมกำหนดขอบเขต In-Scope/Out-of-Scope และจัดสรร Running ID
* **คำสั่งเริ่มต้น**: `/10-define {discovery-id}`
* **เส้นทางถัดไป**: จัดสรร Run ➔ `/20-spec`

---

### 6. 🟠 สเปกนิ่งแล้ว ต้องการแตกงานย่อย
* **สถานการณ์**: วางแผนการพัฒนา กำหนด Test Decisions และสร้าง Checklists
* **คำสั่งเริ่มต้น**: `/30-plan {running-id}`
* **เส้นทางถัดไป**: แตก Tasks ➔ `/40-execute`

---

### 7. 🔴 พัฒนาโค้ดเสร็จแล้ว ต้องการตรวจรับงาน
* **สถานการณ์**: ตรวจสอบ Acceptance Criteria และเคลียร์ Findings Ledger (P0/P1)
* **คำสั่งเริ่มต้น**: `/50-verify {running-id}`
* **เส้นทางถัดไป**: Multi-Lane QA ➔ `/60-report`

---

### 8. 🟤 ต้องการสรุปผลและคู่มือทดสอบสำหรับมนุษย์
* **สถานการณ์**: สร้างรายงาน Standalone HTML พร้อม Try Guide สำหรับตรวจรับจริง
* **คำสั่งเริ่มต้น**: `/60-report {running-id}`
* **เส้นทางถัดไป**: เรนเดอร์ HTML ➔ `/70-release`

