# บทที่ 5: ลงมือสร้างและทำความสะอาด diff

Playbook สายลงมือสร้างทั้งหมดมีวินัยร่วมกันข้อเดียว คือให้บอกสิ่งที่คุณสังเกตเห็น แล้วปล่อยให้ playbook เป็นฝ่ายเรียกร้องหลักฐาน บทนี้แสดงให้ดูว่าใน prompt ของงานแต่ละประเภทควรใส่อะไรบ้าง รวมถึงนิสัยการทำความสะอาด diff เพื่อให้โค้ดพร้อมรีวิว

## ป้อนข้อมูลที่รู้ให้แต่ละ build playbook

prompt แก้บั๊ก ระบุอาการและสั่งให้ reproduce ก่อนเสมอ:

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

prompt เพิ่มฟีเจอร์ ระบุพฤติกรรมใหม่และสิ่งที่ห้ามเปลี่ยน:

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

prompt ปรับโครงสร้าง (refactor) ปักหมุดพฤติกรรมเดิมก่อนย้ายโค้ด:

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

prompt แก้ปัญหาความช้า (perf) ระบุตัวเลขที่วัดได้ ไม่ใช่ความรู้สึก:

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

คำสั่งแต่ละแบบจะถูกส่งเข้า playbook ของตัวเอง ([Bug fix](../../../skills/poteto-mode/playbooks/bug-fix.md), [Feature](../../../skills/poteto-mode/playbooks/feature.md), [Refactoring](../../../skills/poteto-mode/playbooks/refactoring.md), [Perf issue](../../../skills/poteto-mode/playbooks/perf-issue.md)) และตัว playbook จะเติมขั้นตอนที่คุณไม่ได้พิมพ์ลงไปให้เอง ได้แก่ reproduce ก่อนแก้, ตั้งชื่อ data shape ก่อนลงมือ, ล็อกพฤติกรรมเดิมก่อนปรับโครงสร้าง, และ profile ก่อนทำ optimization

สำหรับการปรับปรุงตัวเลขเพียงค่าเดียวอย่างต่อเนื่อง มี [Hillclimb playbook](../../../skills/poteto-mode/playbooks/hillclimb.md) แค่ส่งตัวชี้วัด (metric), เป้าหมาย (target), และจำนวนรอบขั้นต่ำที่ต้องลอง มันจะวนลูปทดสอบสมมติฐานทีละข้อบนชุดวัดผลที่ล็อกค่าคงที่ไว้ แล้วเก็บเฉพาะรอบที่ชนะ ส่วนรอบที่ไม่ดีขึ้นจะ revert ทิ้งทั้งหมด

ทั้ง perf playbook และ hillclimb จะเรียกใช้ [`/benchmark-checklist`](../../../skills/benchmark-checklist/SKILL.md) กับตัวเลขของมัน Perf issue ตรวจทั้ง baseline และทุกตัวเลขหลังจากนั้น ส่วน Hillclimb ตรวจชุดวัดผลก่อนแช่แข็งไว้ (ดูจังหวะที่ควรพิมพ์เรียกใช้เองใน [บทที่ 6: ตรวจตัวเลขที่วัดได้ด้วย `/benchmark-checklist`](./06-verify-and-ship.md#ตรวจตัวเลขที่วัดได้ด้วย-benchmark-checklist))

บางครั้งคุณอยากรู้สาเหตุก่อนแก้ สำหรับอาการที่เกิดระหว่างโปรแกรมกำลังรัน เช่น memory leak, CPU หมุนเปล่าตอน idle, หรือภาพกระตุก [Runtime forensics playbook](../../../skills/poteto-mode/playbooks/runtime-forensics.md) จะฝังตัววัดลงในโปรเซสที่กำลังรันอยู่ ส่วนไฟล์ profile ที่คุณจับเก็บไว้แล้ว [Trace forensics playbook](../../../skills/poteto-mode/playbooks/trace-forensics.md) จะอ่านไฟล์นั้นแล้วชี้ว่า hot frame ตรงกับโค้ดบรรทัดไหน ทั้งคู่ส่งคืนเฉพาะผลการวินิจฉัย ยังไม่แก้โค้ด:

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## เขียน test ที่พังก่อนด้วย `/tdd`

เมื่อบั๊กมีเส้นทางเขียน local test ที่ถูกและเร็ว บางครั้งทั้ง prompt ใช้แค่สองคำก็พอ:

```text
/tdd implement
```

เมื่อมีบริบทอยู่แล้ว แค่นั้นก็เพียงพอ [`/tdd`](../../../skills/tdd/SKILL.md) จะเขียน test ที่เล็กที่สุดซึ่งพังด้วยเหตุผลที่ตั้งใจไว้ แล้วค่อยเขียนโค้ดแก้ จากนั้นรัน test ซ้ำ แต่ถ้าการเขียน test ต้องตั้งค่า harness ใหญ่โตหรือสร้าง mock ที่เปราะบาง ตัว skill จะบอกตรงๆ และเลือกใช้คำสั่งจริงที่รันตรวจสอบได้ใกล้เคียงที่สุดแทน อย่าฝืนเขียน unit test ในจุดที่การรันคำสั่งจริงให้หลักฐานที่หนักแน่นกว่า

## โหลดกฎ TypeScript ด้วยการเอ่ยชื่อ

[`typescript-best-practices`](../../../skills/typescript-best-practices/SKILL.md) แปลงหลักการของ type system ให้เป็นกฎที่จับต้องได้ เช่น discriminated unions, ใช้ `unknown` ที่ขอบระบบ, การเช็ก variant ให้ครบ (exhaustive), และสร้าง type จาก schema ตัวนี้ไม่ถูกโหลดอัตโนมัติ ให้พิมพ์ `/typescript-best-practices` เมื่อไหร่ก็ตามที่งานแตะไฟล์ `.ts` หรือ `.tsx`

## ทำความสะอาดก่อน commit

[Opening a PR playbook](../../../skills/poteto-mode/playbooks/opening-a-pr.md) จะรัน `/deslop` บน diff ก่อน commit ทุกครั้ง และ poteto-mode จะนำ [`/unslop`](../../../skills/unslop/SKILL.md) มาขัดเกลาคำอธิบาย PR และข้อความ commit หมายเหตุว่า `/deslop` มากับ plugin `cursor-team-kit` ไม่ได้อยู่ใน pstack ถ้าคุณไม่มีตัวนั้น ให้สั่งผลลัพธ์เดียวกันด้วยภาษาธรรมดา คือให้ลบ comment ที่คอยเล่าเรื่องโค้ด, ลบ guard ดักเคสที่ไม่มีอยู่จริง, ลบโค้ด compatibility ที่ตายแล้ว, และเอาโค้ดที่แก้หลุดขอบเขตออก

สำหรับงานเขียนภาษาคน `/unslop` รับเป้าหมายและกฎเพิ่มเติมของคุณได้:

```text
/unslop the readme changes, no emdashes
```

เดี๋ยวคุณจะเริ่มมีคำย่อส่วนตัว ตัว skill เข้าใจเจตนาได้ดีแม้จากคำสั่งห้วนๆ อย่าง `unslop that, tighten it`

## กวาดล้าง comment ด้วย `/no-comments`

เรื่อง comment ต้องตรวจแยกอีกรอบ และห้ามใช้ agent ตัวเดิมที่เขียนมันเป็นคนตรวจ เพราะคนเขียนจะคอยปกป้อง comment ของตัวเองเหมือนกับที่คุณปกป้อง comment ของคุณ ดังนั้นก่อนเปิดรีวิว ให้ส่งต่อให้สายตาคู่ใหม่:

```text
/no-comments the diff
```

[`/no-comments`](../../../skills/no-comments/SKILL.md) จะเรียก [Comment Sicko](../../../agents/comment-sicko.md) นักตรวจโค้ดแบบ read-only ที่มีรายการข้อยกเว้นสั้นมาก คือ license header, doc comment ของ public API, ลิงก์ที่อธิบายสิ่งที่โค้ดแสดงไม่ได้, และพฤติกรรมที่ถูกบังคับโดย dependency ภายนอกที่เราแก้โครงสร้างไม่ได้ นอกนั้นโดนตัดทิ้งทั้งหมด ถ้าคุณใส่ comment เพื่ออธิบายจุดน่าประหลาดใจในโค้ดตัวเอง มันจะไม่ปล่อยผ่าน comment นั้นจะกลับมาเป็นธงให้แก้โครงสร้างโค้ดใหม่ แล้ว `/no-comments` จะเข้าไปแก้ต้นเหตุตามธงที่ยอมรับ ส่วน comment ประเภทอ้างข้อจำกัดอย่าง "do not remove" ตัว skill จะเสนอให้แปลงข้ออ้างนั้นเป็น type, test, หรือ lint แทน ไม่ว่าจะทางไหน comment นั้นก็ถูกเอาออกอยู่ดี

ควรจำการแบ่งหน้าที่นี้ไว้ให้แม่น `/deslop` เก็บกวาดขยะออกจากโค้ด, `/unslop` เก็บกวาดสำนวน AI ออกจากข้อความ, และ `/no-comments` ส่ง comment ทั้งหมดไปให้ผู้ตรวจที่ไม่ได้เป็นคนเขียนตัดสิน

**กับดัก:** การทำความสะอาดไม่ใช่ขั้นตอนแต่งสวยที่ข้ามได้ diff ที่เต็มไปด้วย comment พากย์โค้ดและโค้ดกันเหนียวที่ตายแล้ว ดูเหมือนงานที่ยังทำไม่เสร็จในสายตา reviewer และโค้ดส่วนเกินเหล่านั้นแหละคือที่ซ่อนของบั๊กรายต่อไป ถ้ารู้สึกว่า diff มันบวม ให้สั่ง `deslop it` ก่อน commit อย่าปล่อยให้ reviewer เป็นคนทัก

บทถัดไป: [บทที่ 6: พิสูจน์ผลลัพธ์และเปิด PR](./06-verify-and-ship.md)

---

## สรุปท้ายบท

- **แก่นของบทนี้:** เขียน prompt แบบแยกบทบาทของงานให้ชัด (Bug = repro ก่อน, Feature = ห้ามทำของเดิมพัง, Refactor = ปักหมุดผลลัพธ์เดิมก่อน, Perf = เอาตัวเลขจริงมาวัด) แล้วค่อยขัดเกลาโค้ดก่อนส่งตรวจ
- **อาวุธทำความสะอาด diff 3 ชิ้น:**
  - `/deslop` (หรือสั่งด้วยคำพูดตรงๆ) → กวาดโค้ดขยะ/guard ลอยๆ ออกจากซอร์สโค้ด
  - `/unslop` → กวาดสำนวนหุ่นยนต์ออกจากข้อความ, README, และ PR
  - `/no-comments` → ส่ง **Comment Sicko** (ผู้ตรวจที่ไม่ได้เขียนโค้ดนั้น) มาสับ comment ที่ไม่จำเป็นทิ้ง หรือบังคับแปลงคำเตือนให้เป็น test/type แทน
