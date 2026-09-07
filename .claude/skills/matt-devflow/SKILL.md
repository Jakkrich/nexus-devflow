---
name: matt-devflow
description: "Master Matt Pocock's 6 AI-engineering flows (Getting Started, Main Flow, Shaping, Upkeep, Productivity, Reference) for developing Nexus-DevFlow according to real-world situations, while interactively mentoring the developer."
---

# matt-devflow — The 6 Canonical Matt Pocock Flows for DevFlow

Use this skill to develop, maintain, and architect **Nexus-DevFlow** using **Matt Pocock's 6 Canonical Flows** (from [aihero.dev](https://www.aihero.dev)). 

This skill serves as both an **Execution Engine** (calling the real skills under `.agent/`) and an **Interactive Coach** that teaches the engineering mindset behind each flow based on real-world situations.

---

## 🧭 The Golden Rule: "Decisions are Yours, Facts are the Agent's"

Matt Pocock's workflow is built on a clear boundary:
- **Agent's Role**: Gather codebase facts, analyze primary sources, propose options, write deterministic tests, and draft code.
- **Developer's Role**: Make architectural decisions, approve testing seams, define boundaries, and resolve business trade-offs.

---

## 🗺️ The 6 Flows by Real-World Situations

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 01. Getting Started  : Setup repo once & Router (/setup-matt-pocock-skills, /ask-matt) │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────────────────┐
       ▼                                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│ 03. Shaping                  │              │ 04. Upkeep                   │
│ สำรวจคำถามเปิด/ไอเดียคลุมเครือ  │              │ ซ่อมบำรุง/แก้บั๊ก/จัดระเบียบโค้ด   │
│ • /wayfinder (แผนที่การตัดสินใจ) │              │ • /diagnosing-bugs (บั๊กยาก)  │
│ • /prototype (ลองทำ UI/Logic)│              │ • /improve-codebase-architecture│
│ • /research (ค้นคว้าเอกสารลึก) │              │ • /resolving-merge-conflicts │
└──────┬───────────────────────┘              │ • /triage /wizard            │
       │ (ได้คำตอบแล้ว)                          └──────────────┬───────────────┘
       │                                                     │ (แตกงานเข้า Flow)
       ▼                                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 02. The Main Flow (Idea ➔ Ship Spine)                                       │
│ 1. /grill-with-docs ➔ 2. /to-spec ➔ 3. /to-tickets ➔ [CLEAR] ➔ 4. /implement ➔ 5. /code-review │
└─────────────────────────────────────────────────────────────────────────────┘
       ▲                                                             ▲
       │                                                             │
┌──────┴───────────────────────┐              ┌──────────────────────┴───────┐
│ 05. Productivity (ทำงานกับคน)  │              │ 06. Reference (ชั้นคำศัพท์ฐาน) │
│ • /grill-me (ไอเดียไร้ repo)   │              │ • /codebase-design (Seams)   │
│ • /handoff (ส่งต่อ session)   │              │ • /domain-modeling (คำศัพท์)   │
│ • /to-questionnaire /teach   │              │ • /grilling (แกนสัมภาษณ์)      │
│ • /wait-what /writing-for-agents │          │ • /tdd (Red-Green-Refactor)  │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 01. Getting Started Flow (เริ่มต้นตั้งค่าและหาทางไป)

> **สถานการณ์จริงที่เจอ:**  
> - เพิ่งเปิดโปรเจกต์ใหม่ หรือเพิ่ง clone repo มา ยังไม่เคยตั้งค่า agent ให้รู้จัก repository  
> - กำลังงงว่ามี 37 skills อยู่ตรงหน้า สถานการณ์ตอนนี้ควรหยิบตัวไหนมาใช้ดี

### เครื่องมือใน Flow:
1. **`/setup-matt-pocock-skills`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/setup-matt-pocock-skills/SKILL.md)
   - **สิ่งที่ทำ**: รันครั้งแรกครั้งเดียว เพื่อสำรวจ repo และสร้าง config ใน `docs/agents/` (กำหนด Issue tracker เช่น GitHub/GitLab/Local `.scratch/`, คำศัพท์ป้ายกำกับ Triage, และ layout ของ `CONTEXT.md`)
   - **คำสั่ง**: `/matt-devflow setup` หรือ `/setup-matt-pocock-skills`
2. **`/ask-matt`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/ask-matt/SKILL.md)
   - **สิ่งที่ทำ**: GPS ประจำตัว สอบถามสถานการณ์ปัจจุบันแล้วบอกทันทีว่าต้องเดินไป Flow ไหนต่อ
   - **คำสั่ง**: `/matt-devflow ask "สถานการณ์ของคุณ..."`

> 💡 **Matt's Tip:** อย่าเริ่มลงมือเขียนโค้ดจนกว่า Agent จะเข้าใจ "สภาพแวดล้อม" ของโปรเจกต์ การตั้งค่าครั้งเดียวที่ `docs/agents/` จะทำให้ skills ทุกตัวใน repo ทำงานเข้าขากันอย่างสมบูรณ์

---

## 02. The Main Flow (แกนหลักจากไอเดียสู่ของจริง: Idea ➔ Ship)

> **สถานการณ์จริงที่เจอ:**  
> มีฟีเจอร์ใหม่ที่ชัดเจนในระดับหนึ่งแล้ว และต้องการพัฒนาตั้งแต่ศูนย์จนเสร็จสมบูรณ์พร้อมส่งมอบ

### 5 ขั้นตอนเรียงตามลำดับ (The Spine):
1. **`/grill-with-docs`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/grill-with-docs/SKILL.md)
   - สัมภาษณ์ขยี้ไอเดีย 2–3 รอบ หาขอบเขตและข้อจำกัด บันทึกคำศัพท์ลง `CONTEXT.md` และสร้าง `docs/adr/` หากมีการตัดสินใจที่เปลี่ยนใจยาก
2. **`/to-spec`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/to-spec/SKILL.md)
   - นำผลการสัมภาษณ์มาสังเคราะห์เป็น Living Spec กำหนด **Testing Seam** (รอยต่อสูงสุดที่จะใช้เทสต์) และเขียน User Stories ให้ครอบคลุมทุกมุม
3. **`/to-tickets`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/to-tickets/SKILL.md)
   - แตกสเปกเป็น **Tracer-bullet tickets** แผ่นบาง ๆ แต่ทะลุทุกเลเยอร์ พร้อมระบุ `Blocked by:` ชัดเจน (บันทึกไว้ที่ `.scratch/<feature>/issues/<NN>-<slug>.md` หรือ GitHub)
4. ⚠️ **Phase Boundary (Context Hygiene)**:
   - **ล้าง Context (`/clear` หรือเริ่ม Session ใหม่)** ก่อนเริ่มทำโค้ด! เพราะตั๋วแต่ละใบมีข้อมูลครบในตัวเองแล้ว การล้างหน้าจอจะทำให้ AI อยู่ใน **Smart Zone (~150k tokens)** ที่เขียนโค้ดได้เฉียบคมที่สุด
5. **`/implement`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/implement/SKILL.md)
   - หยิบ Ticket ทีละใบมาทำ โดยขับเคลื่อนด้วย **`/tdd`** (Red ➔ Green ➔ Refactor)
6. **`/code-review`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/code-review/SKILL.md)
   - ตรวจสอบ Git diff แบบ 2 แกนอิสระ: **Spec Axis** (ตรงโจทย์ไหม) + **Standards Axis** (โค้ดสะอาด สถาปัตยกรรมลึกไหม) ก่อน Commit

> 💡 **Matt's Tip:** กฎเหล็กคือขั้นตอน 1–3 ให้ทำใน context เดียวกันโดยไม่ล้างแชต เพื่อให้ความคิดเชื่อมโยง แต่พอได้ tickets แล้ว *ต้องล้าง context ทิ้งทันที* ก่อนเข้าสู่การเขียนโค้ด

---

## 03. Shaping Flow (สำรวจคำถามเปิดและไอเดียที่ยังคลุมเครือ)

> **สถานการณ์จริงที่เจอ:**  
> - โปรเจกต์ใหญ่มากจนมองไม่เห็นทางข้างหน้า (Fog of War) ไม่รู้จะเริ่มตรงไหน  
> - ติดคำถามด้าน UX หรือ State Machine ที่เถียงกันบนกระดาษไม่จบ ต้องลองสร้างของมาคลิกดู  
> - ต้องการค้นคว้าข้อมูลเชิงลึกจาก official doc หรือ primary source ก่อนตัดสินใจ

### เครื่องมือใน Flow:
1. **`/wayfinder`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/wayfinder/SKILL.md)
   - สำหรับงานใหญ่ระดับมหากาพย์ (Greenfield หรือ Huge feature): สร้าง **"แผนที่การตัดสินใจ (Decision Map)"** และคลี่คลายทีละเปลาะจนหมอกจางลง แล้วจึง Hand-off เข้าสู่ `/to-spec`
2. **`/prototype`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/prototype/SKILL.md)
   - สร้างโค้ดทดลองชั่วคราว (Throwaway code) ที่รันง่ายสุด ๆ (เช่น HTML หน้าเดียว) เพื่อตอบคำถามเรื่อง State/UI ให้มนุษย์กดดู เมื่อได้คำตอบแล้วนำข้อสรุปกลับเข้า Flow หลัก แล้ว commit prototype เก็บไว้บน branch แยก
3. **`/research`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/research/SKILL.md)
   - ส่ง Background agent ไปเจาะอ่าน **Primary Sources** (Official docs, Source code ของ library) แล้วเขียนสรุปพร้อมอ้างอิงแหล่งที่มา เพื่อนำข้อมูลกลับมาใช้ใน `/grill-with-docs`

> 💡 **Matt's Tip:** Prototype ไม่ใช่ Production! ไม่ต้องเขียน Test, ไม่ต้องต่อ Database จริง จุดประสงค์เดียวคือ "ตอบคำถามที่ค้างคาใจให้เร็วที่สุด" แล้วทิ้งมันไป

---

## 04. Upkeep Flow (การดูแลรักษาโค้ดและจัดการปัญหาหน้างาน)

> **สถานการณ์จริงที่เจอ:**  
> - มีเวลาว่าง อยากปรับปรุงโค้ดให้สะอาดและเป็นมิตรกับ AI  
> - เจอบั๊กประหลาดที่หาต้นเหตุไม่เจอ  
> - เกิด Git Merge Conflict  
> - มีบั๊กหรือคำขอจากภายนอกกองเต็ม issue tracker

### เครื่องมือใน Flow:
1. **`/diagnosing-bugs`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/diagnosing-bugs/SKILL.md)
   - สำหรับบั๊กยาก: **ปฏิเสธการตั้งทฤษฎีมั่วซั่ว** จนกว่าจะมีคำสั่งที่รันแล้วแดง (Tight Red Loop) เมื่อจับจุดได้แล้ว จึงแก้พร้อมเขียน Regression Test ปิดท้าย
2. **`/improve-codebase-architecture`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/improve-codebase-architecture/SKILL.md)
   - สแกน codebase เพื่อหาว่าโมดูลไหนตื้นเกินไปหรือมีรอยต่อพันกัน แล้วทำรายงานจุดที่ควร Refactor
3. **`/resolving-merge-conflicts`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/resolving-merge-conflicts/SKILL.md)
   - แก้ conflict ทีละ hunk โดยสืบย้อนไปหา "เจตนาของโค้ด (Intent)" ทั้งสองฝั่ง ไม่ใช่แค่เลือกบรรทัดใดบรรทัดหนึ่ง
4. **`/triage`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/triage/SKILL.md)
   - คัดแยก Issue ดิบจากภายนอก แปะป้าย triage (`needs-info`, `ready-for-agent`, `wontfix`) เพื่อให้ทีมพร้อมหยิบไปทำ
5. **`/wizard`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/wizard/SKILL.md)
   - สร้าง Interactive CLI Script ช่วยมนุษย์กดตั้งค่าภายนอกที่ AI ทำแทนไม่ได้ (เช่น สมัคร Cloud, ป้อน Secret ลง `.env`)

> 💡 **Matt's Tip:** เวลาเจอบั๊ก อย่ารีบแก้โค้ด! บังคับตัวเองให้เขียน Test ที่รันแล้วพัง (Red) ให้ได้ก่อน เพราะถ้าคุณยังไม่รู้วิธีทำให้มันพัง แสดงว่าคุณยังไม่เข้าใจบั๊กนั้นจริง ๆ

---

## 05. Productivity Skills (การทำงานร่วมกับมนุษย์และการสื่อสาร)

> **สถานการณ์จริงที่เจอ:**  
> - มีไอเดียแต่ยังไม่ได้เปิดโฟลเดอร์โปรเจกต์ (ไม่มี repo ให้เขียน `CONTEXT.md`)  
> - แชตยาวมากจน memory เริ่มเต็ม ต้องส่งต่องานให้อีก Agent หรือเริ่ม Session ใหม่  
> - ติดปัญหาที่คำตอบอยู่ในหัวของคนอื่น ไม่ได้อยู่ในโค้ด  
> - AI ใช้ศัพท์เทคนิคแปลก ๆ จนคุยไม่รู้เรื่อง

### เครื่องมือใน Flow:
1. **`/grill-me`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/grill-me/SKILL.md)
   - สัมภาษณ์ขยี้ไอเดียแบบ **Stateless** (ไม่สร้างไฟล์ ไม่แตะ repo) เหมาะสำหรับการคุยปรับไอเดียลอย ๆ
2. **`/handoff`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/handoff/SKILL.md)
   - สรุปสถานะงานปัจจุบันเป็น Markdown ส่งออกไปยัง Temporary Directory ของเครื่อง เพื่อให้ Agent ตัวใหม่มาหยิบงานต่อได้อย่างไร้รอยต่อ
3. **`/to-questionnaire`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/to-questionnaire/SKILL.md)
   - เมื่อข้อมูลที่ขาดหายไปอยู่ในหัวคนอื่น: สร้างแบบสอบถามที่เจาะจงเพื่อส่งให้ Stakeholder หรือเพื่อนร่วมทีมตอบ
4. **`/wait-what`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/wait-what/SKILL.md)
   - ใช้พิมพ์แทรกทันทีเมื่อ AI อธิบายอะไรแล้วฟังไม่เข้าใจ AI จะอธิบายใหม่ด้วยภาษาคนธรรมดาโดยอ้างอิงคำศัพท์จาก `CONTEXT.md`
5. **`/teach`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/teach/SKILL.md)
   - สอนคอนเซปต์ใหม่ ๆ ข้ามเซสชันโดยใช้ workspace เป็นกระดานทดลอง
6. **`/writing-for-agents`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/writing-for-agents/SKILL.md)
   - คู่มือและมาตรฐานการเขียนเอกสารเพื่อให้ AI Agent อ่านเข้าใจง่าย

---

## 06. Reference Skills (ชั้นคำศัพท์และมาตรฐานรากฐาน)

> **สถานการณ์จริงที่เจอ:**  
> - ต้องการออกแบบโครงสร้างโค้ดและโมดูลใหม่ให้ถูกต้องตามหลักวิศวกรรม  
> - คำศัพท์ในโปรเจกต์เริ่มสับสน ตีความได้หลายแบบ  
> - ต้องการแนวทางปฏิบัติที่ถูกต้องของการทำ TDD

### เครื่องมือใน Flow:
1. **`/codebase-design`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/codebase-design/SKILL.md)
   - คัมภีร์เรื่อง **Deep Modules & Clean Seams**: การซ่อนการทำงานที่ซับซ้อนไว้หลัง Interface ที่เล็กและคมชัด
2. **`/domain-modeling`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/domain-modeling/SKILL.md)
   - การจัดการศัพท์โดเมนให้คมชัด บันทึกลง `CONTEXT.md` และสร้าง Architecture Decision Records (ADRs)
3. **`/grilling`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/grilling/SKILL.md)
   - แกนกลางของกระบวนการสัมภาษณ์ที่ skills อื่น ๆ (`grill-with-docs`, `triage`, `wayfinder`) ดึงไปใช้
4. **`/tdd`** — [SKILL.md](file:///d:/devtools/nexus-devflow/.agent/tdd/SKILL.md)
   - กฎเหล็กของวงจร Red ➔ Green ➔ Refactor

---

## 🕹️ การนำไปใช้งานจริง (Real-World Dispatcher)

คุณสามารถเรียกใช้งาน `matt-devflow` ตามสถานการณ์จริงที่คุณพบเจอได้ทันที:

```bash
# 01 Getting Started
/matt-devflow setup                        # รัน setup ครั้งแรกของ repo
/matt-devflow ask "กำลังเจอบั๊กลึกลับ..."    # ให้ Matt ช่วยเลือก flow

# 02 The Main Flow (Idea -> Ship)
/matt-devflow grill "ระบบ export pdf"      # เริ่มต้นขยี้ไอเดีย
/matt-devflow spec                         # กำหนด Seam และสร้าง Spec
/matt-devflow tickets                      # แตก tracer-bullet tickets
/matt-devflow run-ticket 01                # รัน TDD implement ทีละ ticket
/matt-devflow review                       # Two-axis review ก่อน commit

# 03 Shaping
/matt-devflow wayfinder "โปรเจกต์ใหญ่..."   # คลี่คลายโปรเจกต์ใหญ่ที่ยังมืดแปดด้าน
/matt-devflow prototype "อยากลอง UI นี้"   # ทำ prototype ทดสอบ
/matt-devflow research "อยากรู้เรื่อง..."   # ส่ง agent ไปเจาะอ่าน official docs

# 04 Upkeep
/matt-devflow bug "ทำไมคำสั่ง check พัง"   # หาสาเหตุแบบ tight red loop
/matt-devflow architecture                 # สำรวจจุดที่ควร refactor
/matt-devflow conflict                     # แก้ git merge conflict

# 05 Productivity & Learning
/matt-devflow learn "smart zone คืออะไร"   # ขอให้สอนเชิงลึกเรื่องแนวคิดของ Matt
/matt-devflow handoff "เตรียมย้าย session" # เขียนสรุปส่งต่องาน
```
