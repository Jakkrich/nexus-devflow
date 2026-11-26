# บทที่ 8: คุมทิศทางด้วยชื่อ Principle

pstack มีหลักการวิศวกรรม (principles) ทั้งหมด 24 ข้อแยกเป็น skill รายตัว `/poteto-mode` จะอ่านดัชนีของหลักการเหล่านี้ตั้งแต่เริ่มงานที่มีหลายขั้นตอน เลือกใช้ข้อที่เข้าเงื่อนไขของงาน และระบุชื่อหลักการแต่ละข้อที่นำมาใช้ลงในคำตอบ พร้อมบอกว่าหลักการนั้นเปลี่ยนการตัดสินใจตรงไหน

คุณไม่ต้องเรียกใช้ principle แบบ slash command แต่ใช้ **ชื่อของมัน** เพื่อดึงหางเสือคุมทิศทาง (steer) ชื่อแต่ละชื่อชี้ไปยังกฎฉบับเต็มที่ agent อ่านไว้แล้ว ประโยคสั้นๆ ประโยคเดียวจึงหักเหทิศทางงานได้แม่นยำกว่าการพิมพ์คำสั่งยาวเป็นย่อหน้า

## การคุมทิศทางในการใช้งานจริง

สมมติ agent กำลังจะเอา adapter ใหม่ไปแปะซ้อนทับ adapter เดิม 3 ตัว:

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

สมมติมันประกาศว่าเสร็จแล้วแค่เพราะ build ผ่าน:

```text
apply prove it works. run the real import flow and show me the written records.
```

สมมติงานขนาน 2 สายกำลังจะเขียนลง branch เดียวกัน:

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

วลีสั้นๆ พวกนี้ทำงานได้ทันทีเพราะกฎที่อยู่เบื้องหลังมันเจาะจงมาก และตัว agent ยังคงต้องรายงานในคำตอบด้วยว่ากฎนั้นเปลี่ยนการตัดสินใจอะไรไป การอ้างชื่อ principle ลอยๆ โดยไม่มีการตัดสินใจที่เปลี่ยนตามมา แปลว่า agent แค่ท่องชื่อกฎแต่ไม่ได้เอามาใช้จริง

## สรุปทั้ง 24 ข้อแบบกระชับ

**กลุ่มหลัก (Core Principles)** — ตัดสินใจว่าควรสร้างมากแค่ไหน และเมื่อไหร่ควรรื้อโครงสร้างคิดใหม่:

- [Laziness Protocol](../../../skills/principle-laziness-protocol/SKILL.md) — เน้นการลบและความเปลี่ยนแปลงที่เล็กที่สุดซึ่งแก้ปัญหาได้จริง
- [Foundational Thinking](../../../skills/principle-foundational-thinking/SKILL.md) — เลือกโครงสร้างข้อมูลหลักให้ชัดก่อนเขียน logic
- [Redesign from First Principles](../../../skills/principle-redesign-from-first-principles/SKILL.md) — ผสานความต้องการใหม่เข้ากับดีไซน์เดิม ราวกับว่ามันถูกออกแบบมารองรับเรื่องนี้ตั้งแต่วันแรก
- [Attack the Premise](../../../skills/principle-attack-the-premise/SKILL.md) — เขียนสมมติฐานร่วมที่ทำให้การแก้ 2 ครั้งก่อนพังที่ด่านเดิมออกมา แล้วทดสอบสมมติฐานนั้นตรงๆ ก่อนเขียนโค้ดแก้รอบถัดไป
- [Subtract Before You Add](../../../skills/principle-subtract-before-you-add/SKILL.md) — ลบน้ำหนักส่วนเกินและของตายออกก่อนจะสร้างอะไรเพิ่มทับลงไป
- [Minimize Reader Load](../../../skills/principle-minimize-reader-load/SKILL.md) — ยุบชั้นซ้อนและ state ที่ซ่อนอยู่ ซึ่งทำให้คนอ่านต้องจำไว้ในหัวเยอะเกินจำเป็น
- [Outcome-Oriented Execution](../../../skills/principle-outcome-oriented-execution/SKILL.md) — พาการเขียนใหม่ (rewrite) วิ่งตรงสู่โครงสร้างเป้าหมาย แทนที่จะเลี้ยงสถานะชั่วคราวแบบใช้แล้วทิ้งไว้กลางทาง
- [Experience First](../../../skills/principle-experience-first/SKILL.md) — เลือกผลลัพธ์ที่ดีต่อผู้ใช้งานเหนือกว่าความสะดวกสบายในการเขียนโค้ด
- [Exhaust the Design Space](../../../skills/principle-exhaust-the-design-space/SKILL.md) — สร้าง prototype แข่งกัน 2–3 แบบเมื่อเรื่องนั้นยังไม่เคยมีแบบอย่างมาก่อน
- [Build the Lever](../../../skills/principle-build-the-lever/SKILL.md) — สร้างสคริปต์ที่ทำงานหรือพิสูจน์งานนั้นได้จริงเพื่อให้คนรีวิวรันซ้ำได้ เมื่อใดที่ agent ทำเรื่องเดิมซ้ำๆ ด้วยมือ ให้สั่งมันเขียนเครื่องมือหรือ skill ที่มันอยากมีไว้ใช้เอง ถ้าสคริปต์ทำขั้นตอนนั้นซ้ำแบบเดิมได้ทุกครั้ง จงใช้สคริปต์ แล้วเก็บ agent ไว้ใช้กับงานที่ต้องใช้วิจารณญาณ

**กลุ่มสถาปัตยกรรม (Architecture Principles)** — ตัดสินใจว่า state, การตรวจสอบความถูกต้อง (validation), และ compatibility ควรอยู่ตรงไหน:

- [Model the Domain](../../../skills/principle-model-the-domain/SKILL.md) — เข้ารหัสกฎที่ทำซ้ำๆ ให้อยู่ในโครงสร้างเดียว (เช่น state machine, table, registry) แทนที่จะกระจัดกระจายอยู่ใน `if/else` ทั่วไฟล์
- [Boundary Discipline](../../../skills/principle-boundary-discipline/SKILL.md) — ตรวจสอบข้อมูล (validate) ที่ขอบระบบ แล้วเชื่อใจ internal types ข้างใน
- [Type System Discipline](../../../skills/principle-type-system-discipline/SKILL.md) — ออกแบบ type ให้สถานะที่ผิดกฎหมายไม่สามารถถูกสร้างขึ้นมาได้
- [Make Operations Idempotent](../../../skills/principle-make-operations-idempotent/SKILL.md) — ออกแบบให้การรันซ้ำ (retry) ลู่เข้าสู่ผลลัพธ์สุดท้ายเดียวกันเสมอ
- [Migrate Callers Then Delete Legacy APIs](../../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) — ย้ายผู้เรียกใช้งานทั้งหมดแล้วลบ API เก่าทิ้งในระลอกเดียวกัน
- [Separate Before Serializing Shared State](../../../skills/principle-separate-before-serializing-shared-state/SKILL.md) — แยกสิ่งที่ใช้ร่วมกันออกจากกันเสียก่อนที่จะไปเพิ่มตัวจัดการคิวหรือ lock

**กลุ่มการพิสูจน์ (Verification Principles)** — นิยามว่าอะไรบ้างที่นับเป็นหลักฐานจริง:

- [Prove It Works](../../../skills/principle-prove-it-works/SKILL.md) — ตรวจพิสูจน์กับผลผลิตจริง ไม่ใช่ตัวแทนหรือแค่คำว่าผ่าน build
- [Fix Root Causes](../../../skills/principle-fix-root-causes/SKILL.md) — จำลองปัญหาและไล่หาต้นตอจริงก่อนแก้โค้ด
- [Sequence Work into Verifiable Units](../../../skills/principle-sequence-verifiable-units/SKILL.md) — จบงานแต่ละหน่วยเล็กๆ ด้วยการเช็กให้ผ่านก่อนเริ่มหน่วยถัดไป
- [Test Behavior, Not Implementation](../../../skills/principle-test-behavior-not-implementation/SKILL.md) — ตรวจสอบสิ่งที่ผู้ใช้งานโค้ดนั้นสังเกตเห็นได้ เพื่อที่ test จะพังเฉพาะเมื่อพฤติกรรมเสีย และยังผ่านได้แม้ปรับแก้ไส้ใน
- [Explain the Number](../../../skills/principle-explain-the-number/SKILL.md) — บอกตัวจำกัดของตัวเลขที่วัดได้ และตัดโอกาสที่มันกำลังวัดผิดจุดออกก่อนจะเชื่อหรือนำไปรายงาน ([`/benchmark-checklist`](../../../skills/benchmark-checklist/SKILL.md) แปลงหลักการนี้เป็นคำถาม 7 ข้อจากการรันจริง)

**กลุ่มการมอบหมายงาน (Delegation Principles)** — คุมการทำงานขนานกันให้ไม่เพี้ยน:

- [Guard the Context Window](../../../skills/principle-guard-the-context-window/SKILL.md) — โยนงานอ่านข้อมูลปริมาณมากไปให้ subagent และเก็บเฉพาะข้อสรุปไว้ในแชทหลัก
- [Never Block on the Human](../../../skills/principle-never-block-on-the-human/SKILL.md) — งานที่ย้อนกลับได้ให้ตัดสินใจทำต่อแล้วนำผลมารายงาน

**และ 1 หลักการระดับ Meta:**

- [Encode Lessons in Structure](../../../skills/principle-encode-lessons-in-structure/SKILL.md) — เปลี่ยนคำเตือนที่คุณต้องพูดซ้ำเป็นครั้งที่สองให้กลายเป็น lint, check, หรือสคริปต์ ([`/correct`](../../../skills/correct/SKILL.md) นำหลักการนี้ไปใช้กับทั้ง repo ตามที่อธิบายใน [บทที่ 9: แก้สภาพแวดล้อมด้วย `/correct`](./09-make-it-yours.md#แก้สภาพแวดล้อมด้วย-correct))

ไม่ต้องท่องจำรายการนี้ แค่อ่านผ่านๆ ไว้ก่อน แล้วค่อยกลับมาเปิดดูเมื่อจับได้ว่า agent กำลังทำอะไรบางอย่างที่ชื่อหลักการในหน้านี้ช่วยเบรกไว้ได้ นั่นคือวิธีที่คำศัพท์ชุดนี้จะติดหัวไปเอง

บทถัดไป: [บทที่ 9: ปรับแต่งให้เข้ากับสไตล์ของคุณ](./09-make-it-yours.md)

---

## สรุปท้ายบท

- **แก่นของบทนี้:** ชื่อ Principle ทั้ง 24 ข้อคือ **"คำสั่งพวงมาลัย"** (steering vocabulary) เอาไว้ดึงสติ agent กลางคันด้วยประโยคเดียว แทนการพิมพ์อธิบายยาวเหยียด
- **5 ชื่อที่หยิบใช้บ่อยที่สุดในชีวิตประจำวัน:**
  1. `Subtract Before You Add` (ลบของตายก่อนสร้างเพิ่ม)
  2. `Attack the Premise` (หยุดแก้แบบเดิมหลังพัง 2 รอบ มาเช็กสมมติฐานร่วม)
  3. `Model the Domain` (ยุบ `if/else` กระจัดกระจายให้เป็นโครงสร้างข้อมูล)
  4. `Prove It Works` (เอาหลักฐานของจริงมาโชว์ ไม่ใช่แค่ compile ผ่าน)
  5. `Encode Lessons in Structure` (อย่าเตือนด้วย text ซ้ำๆ — แปลงเป็น script/lint/type)
