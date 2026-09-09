# TDD Anti-Patterns

อ่านเมื่อวาง RED/GREEN หรือทบทวนคุณภาพ tests
ใช้ตาม test decision ใน spec และ [implement](SKILL.md)

## The Iron Law

`NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`

สำหรับ behavior change ให้เห็น test fail ที่ตั้งใจก่อนเขียน production code
ถ้าเขียนก่อน ให้ย้อนเฉพาะงานของตนในขั้นนั้น แล้วเริ่มจาก test
รักษางานเดิมของผู้ใช้; งาน docs/config ที่ไม่มี logic ใช้ verification ตาม spec

## Red-Phase Checklist

- รันแล้ว fail จริง ไม่ใช่ syntax/import error
- ข้อความ failure ชี้ behavior ที่ยังขาดหรือผิด
- test setup ถูกต้อง และ fail ที่ assertion ที่ตั้งใจ

ถ้าผ่านทันที ตรวจว่า test กระตุ้น behavior ใหม่จริงหรือไม่
แก้ setup error และรันซ้ำก่อน GREEN

| Bad | Good |
| :--- | :--- |
| ชื่อ `retry works` | `returns success after transient failure` |
| Assert เฉพาะ mock call | Assert ผลลัพธ์และจำนวน attempts เมื่อเป็น contract |
| รวมหลาย behavior | แยก success, retry และ exhausted failure |
| เขียน test แล้วไม่รัน | RED → GREEN → REFACTOR พร้อมผลแต่ละช่วง |
| เพิ่ม options เผื่ออนาคต | ทำเฉพาะ behavior ที่ spec/test ต้องการ |

```typescript
let attempts = 0;
const result = await retryOperation(async () => {
  attempts++;
  if (attempts < 3) throw new Error('transient');
  return 'ok';
});
assert.equal(result, 'ok');
assert.equal(attempts, 3);
```

GREEN ใช้ code น้อยที่สุดให้ผ่าน แล้ว REFACTOR ขณะ tests ยังผ่าน
mock เฉพาะ boundary ที่จำเป็น; ตรวจ contract ของ dependency ก่อนสร้าง fake
เสร็จเมื่อมีหลักฐาน RED ที่ถูกเหตุและ GREEN ของ behavior พร้อม regression checks
