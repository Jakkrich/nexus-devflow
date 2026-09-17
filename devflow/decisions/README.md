# 🏛️ Architecture Decision Records (ADRs)

This directory stores durable Architecture Decision Records (ADRs) produced during `/grill`, `/discovery`, or high-stakes architectural design sessions.

---

## 📋 ADR Format & Standards

Each ADR is named `ADR-xxx-{slug}.md` (e.g. `ADR-001-database-schema-migration.md`) and follows this structure:

```markdown
# ADR-xxx: {Title}

- **Status**: `Accepted` | `Proposed` | `Assumed` (Fast-tracked Assumption) | `Deprecated` | `Superseded by ADR-yyy`
- **Date**: YYYY-MM-DD
- **Context**: Problem statement, background, and why this decision was needed.
- **Decision**: The selected architectural approach or invariant.
- **Assumption Metadata** *(Mandatory when Status is `Assumed`)*:
  - **Assumption**: ข้อสมมติฐานทางเทคนิคที่ตั้งขึ้นเพื่อปลดบล็อกการทำงานชั่วคราว
  - **Risk Level & Blast Radius**: ระดับความเสี่ยงและขอบเขตผลกระทบหากข้อสมมติไม่ถูกต้อง
  - **Ratification Plan**: เงื่อนไข, วันที่ หรือเหตุการณ์ที่จะทำการทวนสอบ (Ratify) เพื่อเปลี่ยนสถานะเป็น `Accepted` หรือ `Rejected`
- **Alternatives Considered**:
  - *Option 1*: Pros / Cons
  - *Option 2*: Pros / Cons
- **Consequences**:
  - *Positive*: Benefits and capabilities unlocked
  - *Trade-offs / Risks*: Costs, complexity, or constraints
```

---

## ⚡ Assumed Decision Debt Policy

เมื่อทีมหรือ Agent จำเป็นต้องเดินหน้าพัฒนาอย่างรวดเร็ว (Fast-track) โดยที่ข้อสรุปทางสถาปัตยกรรมยังไม่ได้รับการยืนยัน 100% จากผู้ใช้ ให้บันทึก ADR ด้วย `Status: Assumed` พร้อมกรอก **Assumption Metadata** ให้ครบถ้วน

> [!WARNING]
> **Zero Untracked Decision Debt**: ทุก ADR ที่มีสถานะ `Assumed` จะถูกตรวจสอบโดย `/audit` และ `/complete` เพื่อแจ้งเตือนให้ทีมยืนยัน (Ratify) หรือปรับแก้ก่อนส่งมอบขึ้น Production เสมอ

