# Two-Stage Review Template

ใช้ประกอบ /audit independent หลังอ่าน [SKILL.md](SKILL.md)
และ [receipt contract](reference/independent-review.md)
template นี้จัดคำถาม review; ไม่แทน request, receipt หรือ permission gate

## Reviewer Dispatch Context

เติมข้อมูลจริงจาก immutable checkpoint:

```text
Feature: {ID และชื่อ}
Spec: {path และ SHA-256}
Base ref / Base SHA: {ref / full SHA}
Target SHA: {full SHA}
Builder adapter / model: {actual identity}
Requested reviewer / model / execution: {request values}
Acceptance criteria: {คัดลอกจาก spec}
Check evidence: {commands และผล}
Scope: {paths และ exclusions}
```

ส่งให้ fresh reviewer ตาม execution ที่บันทึกใน request
ใช้ Phase A/B และ required fields จาก receipt contract ทุกครั้ง

## Stage 1: Spec Compliance

ตรวจทุก AC ว่ามี implementation และหลักฐานตรงกัน
ตรวจ scope creep, ข้อกำหนดที่ทำไม่ครบ และ test/evidence ของ behavioral AC
รายงาน PASS/FAIL พร้อม path:line และรายการที่ขาด
ถ้า FAIL ให้หยุดก่อน Stage 2 และส่งกลับเพื่อซ่อม

## Stage 2: Code Quality

เมื่อ Stage 1 PASS ตรวจ security, error paths, performance,
maintainability และความถูกต้องของ docs/examples
แต่ละ finding ระบุ ID, P0–P3, path:line, ผลกระทบ, หลักฐาน และแนวทางแก้

## ผลส่งกลับ

ใช้ verdict และ status ตาม receipt contract พร้อม findings, คำสั่งตรวจ,
remaining risk, reviewer identity, fresh-context declaration และเวลา
reviewer รายงานอย่างเดียว ไม่แก้ product code
P0/P1 ที่ open หรือ fixed ยังบล็อก; ปิดผ่านการตรวจซ้ำตาม /audit
เก็บ target/base SHA และ spec hash เดิม ห้ามสร้างผลผ่านล่วงหน้า
