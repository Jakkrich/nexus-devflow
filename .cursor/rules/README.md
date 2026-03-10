# Cursor Rules Directory

## 📋 Overview

ไฟล์ใน directory นี้จะถูกโหลดอัตโนมัติโดย Cursor เป็น system rules สำหรับ AI agent

---

## 🔄 การทำงานของ Cursor Rules

### 1. **Auto-Loading**
- Cursor จะโหลดไฟล์ `.md` ทั้งหมดใน `.cursor/rules/` อัตโนมัติ
- โหลดเมื่อเริ่ม session ใหม่
- ใช้เป็น system prompt/prompt engineering rules

### 2. **Priority Order**
Cursor จะโหลด rules ตามลำดับนี้:
1. `.cursorrules` (root level) - Highest priority
2. `.cursor/rules/*.md` - Medium priority
3. Project-specific rules (เช่น `.cursor/rules/project-specific.md`)

### 3. **Usage**
- AI จะใช้ rules เหล่านี้ในการตัดสินใจทำงาน
- ไม่ต้องเรียกใช้เอง มันจะทำงานอัตโนมัติ
- แต่ AI อาจจะไม่ใช้เสมอไป ถ้าไม่ระบุชัดเจน

---

## 📁 ไฟล์ที่มีอยู่

### `token-optimization.md`
- **Purpose:** กฎสำหรับลด token usage
- **When Used:** ทุกครั้งที่ AI ทำงาน
- **Key Rules:**
  - Selective file reading
  - Minimal context
  - Incremental processing
  - Pattern-based approach
  - Direct code generation

---

## ⚠️ Important Notes

### ไฟล์จะถูกโหลดอัตโนมัติ แต่...

1. **AI อาจไม่ใช้เสมอไป**
   - ถ้าไม่ระบุชัดเจนใน prompt
   - ถ้ามี rules อื่นที่ขัดแย้ง
   - ถ้า context มีข้อมูลมากเกินไป

2. **ควรอ้างอิงใน Prompt**
   - ระบุว่า "ใช้ token optimization rules"
   - หรือ "อ่าน token-optimization.md ก่อนเริ่มทำงาน"

3. **ควรเพิ่มใน .cursorrules**
   - เพิ่ม reference ใน `.cursorrules` เพื่อให้แน่ใจว่า AI จะใช้
   - หรือสร้างไฟล์รวม rules ทั้งหมด

---

## 💡 Best Practices

### 1. สร้างไฟล์รวม Rules
สร้างไฟล์ `.cursor/rules/README.md` (ไฟล์นี้) เพื่ออธิบายว่าไฟล์ไหนใช้ทำอะไร

### 2. อ้างอิงใน .cursorrules
เพิ่มใน `.cursorrules`:
```markdown
## Token Optimization
See: .cursor/rules/token-optimization.md
```

### 3. ระบุใน Prompt
เมื่อเริ่มทำงาน ระบุว่า:
```
ใช้ token optimization rules จาก .cursor/rules/token-optimization.md
```

---

## 🔧 วิธีให้แน่ใจว่า Rules จะถูกใช้

### Option 1: เพิ่มใน .cursorrules (แนะนำ)
```markdown
## Token Optimization Rules
Always follow token optimization rules from .cursor/rules/token-optimization.md:
- Read only what you need (use offset and limit)
- Create minimal context files
- Process incrementally
- Use pattern-based approach
- Generate code directly for simple tasks
```

### Option 2: อ้างอิงใน Prompt
```
ก่อนเริ่มทำงาน ให้อ่าน .cursor/rules/token-optimization.md และใช้ rules เหล่านั้น
```

### Option 3: สร้างไฟล์รวม Rules
สร้างไฟล์ `.cursor/rules/all-rules.md` ที่รวม rules ทั้งหมด

---

## 📊 Token Optimization Rules Usage

### เมื่อไหร่ที่ Rules จะถูกใช้:

1. **อัตโนมัติ:** เมื่อ Cursor โหลด rules (แต่ไม่แน่ใจว่าจะใช้)
2. **เมื่อระบุใน Prompt:** "ใช้ token optimization rules"
3. **เมื่ออ้างอิงใน .cursorrules:** จะถูกใช้แน่นอน

### วิธีตรวจสอบว่า Rules ถูกใช้:

ดูจาก token usage:
- ถ้าใช้ rules: token usage จะต่ำ (< 100K สำหรับ simple task)
- ถ้าไม่ใช้ rules: token usage จะสูง (> 500K)

---

## ✅ Checklist

- [ ] ไฟล์ `token-optimization.md` อยู่ใน `.cursor/rules/`
- [ ] เพิ่ม reference ใน `.cursorrules` (แนะนำ)
- [ ] อ้างอิงใน prompt เมื่อเริ่มทำงาน (ถ้าจำเป็น)
- [ ] ตรวจสอบ token usage ว่าต่ำหรือไม่
