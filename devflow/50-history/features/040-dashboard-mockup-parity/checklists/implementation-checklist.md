# Implementation Checklist: 040-dashboard-mockup-parity

- [x] สร้าง workflow-state model ที่รองรับ `fast`, `deep`, `idle`
- [x] สร้าง dashboard snapshot จาก status, history, doctor, discoveries, version และ command catalog
- [x] อ่านคำอธิบาย Quick Commands จาก skill metadata จริง
- [x] รองรับ discovery records และ npm version status แบบ cache/timeout/offline-safe
- [x] ปรับ history reader ให้ใช้ `HISTORY.md` เป็น authoritative ledger และรองรับ directory archive
- [x] ปรับ dashboard เป็นธีม blueprint ตาม mockup
- [x] ตั้ง preferred Thai font เป็น `Google Sans Thai` / `Google Sans` พร้อม `Noto Sans Thai` fallback
- [x] วาง Next Action ใต้ Dual-Track Delivery Model
- [x] เพิ่ม tooltip แบบ hover และ keyboard focus ให้ Quick Commands
- [x] เพิ่ม spacing และ responsive layout สำหรับ cards
- [x] คง compatibility ของ `/api/status` และ `/api/history`
- [x] เพิ่ม `/api/dashboard` สำหรับ snapshot ใหม่
- [x] เพิ่ม CSP สำหรับ Google Fonts โดยไม่เปิด policy เกินจำเป็น
- [x] เพิ่ม unit/integration tests สำหรับ workflow, discoveries, version, commands, history, snapshot และ dashboard
- [x] แก้ Deep-Track next action ให้ชี้ stage ปัจจุบัน
- [x] แก้ horizontal overflow ที่ desktop, tablet และ mobile
- [x] ตรวจ dashboard จริงด้วย BrowserOS neo MCP

