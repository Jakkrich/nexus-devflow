# 🎛️ Interactive Choice & Predictive Follow-Up Rules

> Rules for Google Antigravity & Nexus-DevFlow Agents (Context First & Zero Copy-Paste Friction)

---

## 📌 Principles & Mandatory Workflow

When the agent finishes a workflow stage or needs to:
1. **Present Options & Recommendations**: (e.g. Next Actions, Architecture Options, Design Choices)
2. **Ask Clarification & Confirmations**: (e.g. Branching paths, confirming spec/scope)
3. **Anticipate Next Follow-up Questions**: (e.g. What the user might want to explore or ask next)

---

### 📝 1. Context First: Mandatory Summary Before Prompting
- **ห้ามเด้งหน้าต่างถามตัวเลือกโดยเด็ดขาด หากยังไม่มีการสรุปผลงานให้ผู้ใช้อ่านก่อน**
- ในการตอบกลับทุกครั้งที่มีการเรียกใช้ `ask_question`:
  1. **Chat Content**: ต้องเขียนสรุปผลการทำงานในข้อความแชตให้ละเอียด ชัดเจน และอ่านง่ายเสมอ (เช่น งานที่เสร็จแล้ว, ไฟล์ที่แก้ไข, ผลการรัน Test, สถานะปัจจุบัน)
  2. **Modal Context (`question`)**: ในช่องคำถามของ Modal ต้องใส่สรุปสั้นๆ (Context Snapshot 1-3 บรรทัด) บอกให้ทราบว่าขั้นตอนก่อนหน้านี้ทำอะไรสำเร็จไปแล้วบ้าง ก่อนจะถามคำถาม เพื่อให้ผู้ใช้ที่กำลังดูหน้าต่าง Modal ทราบสถานะได้ทันทีโดยไม่ต้องเลื่อนหา

---

### ❌ 2. Strict Prohibitions
- **DO NOT** output a raw numbered or bulleted list (e.g. `1. Option A`, `2. Option B`) in the markdown chat and ask the user to type or copy-paste their choice into the chat prompt.
- **DO NOT** trigger `ask_question` without providing context or explanation of the current step's outcome.

---

### ✅ 3. Mandatory In-App Modal Action
- **ALWAYS call the `ask_question` tool** (in Google Antigravity IDE):
  - Formulate a clear contextual header + question in `question` (e.g., summary of latest progress + direct question).
  - Provide 2–4 concise, predictive choices in `options`.
  - Always prefix the recommended choice with `(Recommended)` as the first item.
  - Set `is_multi_select: false` (or `true` if multiple selections make sense).
- In Antigravity IDE, calling `ask_question` automatically renders an interactive modal window with radio/checkbox buttons and an integrated write-in feedback box. The user can simply click their preferred option without typing or copying text!
