# 40 Execute: 040-dashboard-mockup-parity

## Execution Summary

ปรับ dashboard ปัจจุบันให้ใช้ visual language เดียวกับ reference mockup โดยยึดข้อมูลจริงจาก Nexus-DevFlow และคง API compatibility เดิมไว้ งานครอบคลุม data model, server snapshot, UI renderer, responsive behavior และ automated tests

## Implemented

- เพิ่ม workflow model สำหรับ Fast-Track 4 stages, Deep-Track 8 stages และ idle state
- เพิ่ม dashboard snapshot ที่รวม status, history, doctor, discoveries, package update, commands และ adapter health
- เพิ่ม command catalog จาก manifest และ frontmatter ของ skills
- เพิ่ม npm registry version checker ที่มี timeout, TTL cache และ offline-safe state
- เพิ่ม discovery reader ที่ไม่ล้มเมื่อ directory หรือไฟล์ยังไม่มี
- ปรับ history reader ให้ `devflow/history/HISTORY.md` เป็น authoritative ledger และใช้ archive scan เป็น fallback
- เพิ่ม `/api/dashboard` พร้อมคง `/api/status` และ `/api/history`
- เปลี่ยนหน้า dashboard เป็น blueprint theme, Thai-first font stack, card spacing, tooltip และ responsive layout
- เพิ่ม test coverage สำหรับโมดูลใหม่และ integration contract ของ dashboard

## Defects Found and Fixed During Execution

| Defect | Root cause | Resolution |
|---|---|---|
| Deep run แสดง next action เป็น `/check` | ใช้ Fast-Track status selector กับ Deep-Track | เพิ่ม dashboard-specific next action จาก active stage/run ID |
| Tablet เกิด horizontal overflow | 8-stage stepper และ tooltip ขยาย layout | จำกัด overflow ของ track container และใช้ fixed tooltip ใน viewport <= 920px |
| Released runs แสดง 16/17 แทน 35 | reader นับเฉพาะ archive files/directories | อ่าน authoritative rows จาก `HISTORY.md` |
| Copy feedback ไม่ deterministic | รอ clipboard promise ก่อนเปลี่ยน label | แสดง `Copied!` ก่อนเรียก clipboard API |

## Evidence

- BrowserOS neo v0.0.44 ผ่าน Streamable HTTP MCP ที่ `http://127.0.0.1:9010/mcp`
- Desktop screenshot: `devflow/context/current-run/evidence/dashboard-desktop.png`
- Browser assertions ครอบคลุม desktop 1440px, tablet 900px และ mobile 390px

## Completion

- Implementation checklist: completed
- Scope changes: ready for `50-verify`

