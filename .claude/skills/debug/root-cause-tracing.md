# Root-Cause Tracing

อ่านเมื่อ error อยู่ลึกใน call stack หรือไม่รู้ว่าค่าผิดมาจากไหน
ใช้ประกอบ Phase 4 ของ [debug](SKILL.md); ส่งแผนซ่อมไป /fix และ /implement

## 5-Step Backward Trace

1. **Observe symptom**: เก็บ error, stack และตำแหน่งที่เกิด
2. **Immediate cause**: ระบุ operation และ input ที่ผิด
3. **Caller**: หาว่าใครส่ง input นี้มา
4. **Trace upward**: ไล่ parameter ย้อนทีละ call จนพบจุดเปลี่ยนค่า
5. **Original trigger**: ทำ reproduction ยืนยันต้นตอและเสนอ regression test

ตัวอย่าง: test อ่าน tempDir ก่อน beforeEach → ส่งค่าว่าง → git init ใช้ cwd ผิด
พิสูจน์ลำดับ setup ก่อนเสนอ guard ที่ต้นทาง

## Stack Trace Instrumentation

ใช้ scratch reproduction หรือ debugger ตามขอบเขต /debug
บันทึกเฉพาะข้อมูลที่ redact แล้ว; ไม่ dump environment หรือ secrets

```typescript
console.error('[DEBUG-trace]', {
  hasDirectory: Boolean(directory?.trim()),
  stack: new Error().stack,
});
```

ใช้ `rg 'DEBUG-trace' diagnostic.log` หา probe แล้วล้าง probe เมื่อจบ
ระบบหลายชั้นให้เทียบ input/output ที่แต่ละ seam โดยบันทึกเพียงสถานะ SET/UNSET

ถ้าบั๊กเกิดเมื่อรัน tests ร่วมกัน ให้แบ่งชุด tests ครึ่งหนึ่งซ้ำเพื่อหาตัว polluter
พร้อมตรวจ state ก่อน/หลังแต่ละชุด

เสร็จเมื่อระบุ trigger, call chain และหลักฐาน reproduction ได้
จากนั้นใช้ [defense-in-depth.md](defense-in-depth.md) วางจุดป้องกันในแผนซ่อม
