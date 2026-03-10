# Token Optimization Rules for Cursor

## 🎯 Core Principle
**Read Only What You Need, Generate Directly, Verify Immediately**

---

## 📋 Rule 1: Selective File Reading

### ✅ DO:
- ใช้ `offset` และ `limit` เมื่ออ่านไฟล์
- อ่านเฉพาะส่วนที่เกี่ยวข้อง
- ใช้ `grep` เพื่อหา pattern

### ❌ DON'T:
- อ่านไฟล์ใหญ่ทั้งหมด
- อ่านหลายไฟล์พร้อมกันถ้าไม่จำเป็น
- อ่านไฟล์ซ้ำ

### Example:
```python
# ✅ Good: อ่านเฉพาะส่วนที่ต้องการ
read_file("crm_team.py", offset=1, limit=10)

# ❌ Bad: อ่านทั้งไฟล์
read_file("crm_team.py")
```

---

## 📋 Rule 2: Minimal Context

### ✅ DO:
- สร้าง summary file สำหรับแต่ละ task
- ใช้ bullet points แทน paragraph ยาวๆ
- ระบุเฉพาะ requirements ที่จำเป็น

### ❌ DON'T:
- ส่ง spec.md, plan.md ทั้งหมด
- Duplicate ข้อมูล
- ส่ง context ที่ไม่เกี่ยวข้อง

### Example:
```markdown
# ✅ Good: Minimal Context
Task: สร้าง demo_opencode.py
Function: print_hello_world()
Pattern: crm_team.py#L1-10

# ❌ Bad: ส่งทุกอย่าง
[ส่ง spec.md ทั้งหมด]
[ส่ง plan.md ทั้งหมด]
[ส่ง implementation_plan.json ทั้งหมด]
```

---

## 📋 Rule 3: Incremental Processing

### ✅ DO:
- ทำทีละขั้นตอน
- Verify หลังแต่ละขั้นตอน
- ใช้ผลลัพธ์จากขั้นตอนก่อนหน้า

### ❌ DON'T:
- อ่านทุกอย่างก่อนเริ่มทำงาน
- ทำทุกอย่างพร้อมกัน
- Verify ทีหลังทั้งหมด

### Example:
```
# ✅ Good: Incremental
1. อ่าน requirements (5 บรรทัด)
2. สร้างไฟล์
3. Verify ทันที
4. อ่าน import section (5 บรรทัด)
5. เพิ่ม import
6. Verify อีกครั้ง

# ❌ Bad: All at once
1. อ่านทุกอย่าง
2. สร้างทุกอย่าง
3. Verify ทีหลัง
```

---

## 📋 Rule 4: Pattern-Based Approach

### ✅ DO:
- ใช้ `grep` เพื่อหา pattern
- อ่านเฉพาะส่วนที่ต้องการ
- ใช้ line numbers แทนทั้งไฟล์

### ❌ DON'T:
- อ่านทั้งไฟล์เพื่อหา pattern
- Copy ทั้งไฟล์มาเป็น reference

### Example:
```python
# ✅ Good: ใช้ grep
grep("^from odoo import", "crm_team.py")
grep("^class.*Model", "crm_team.py")

# ✅ Good: อ่านเฉพาะส่วน
read_file("crm_team.py", offset=1, limit=10)

# ❌ Bad: อ่านทั้งไฟล์
read_file("crm_team.py")  # 212 บรรทัด
```

---

## 📋 Rule 5: Direct Code Generation (Simple Tasks)

### ✅ DO:
- สำหรับงานง่ายๆ ให้สร้างโค้ดโดยตรง
- อ่านเฉพาะ requirements ที่จำเป็น
- ใช้ pattern จากไฟล์ reference

### ❌ DON'T:
- อ่าน spec หรือ plan ทั้งหมดก่อน
- สร้าง context ใหญ่ๆ สำหรับงานง่ายๆ

### Example:
```markdown
# ✅ Good: Direct Generation
สร้างไฟล์ demo_opencode.py:
- Pattern: crm_team.py#L1-10
- Function: print_hello_world()
- Docstring: "สร้างโดย Cursor"

# ❌ Bad: Read Everything First
1. อ่าน spec.md ทั้งหมด
2. อ่าน plan.md ทั้งหมด
3. อ่าน implementation_plan.json ทั้งหมด
4. แล้วค่อยสร้างโค้ด
```

---

## 📊 Token Budget Guidelines

### Simple Tasks (< 100K tokens):
- Read requirements: < 10K
- Read patterns: < 20K
- Generate code: < 50K
- Verify: < 20K

### Complex Tasks (< 300K tokens):
- Planning: < 50K
- Implementation (per phase): < 100K
- Verification: < 50K

### Alert Threshold:
- Simple task > 150K tokens → Review approach
- Complex task > 500K tokens → Break into subtasks

---

## 🔧 Implementation Checklist

ก่อนเริ่มทำงาน:

- [ ] กำหนด token budget
- [ ] สร้าง minimal context file
- [ ] ใช้ grep เพื่อหา pattern (ถ้าเป็นไปได้)
- [ ] อ่านไฟล์เฉพาะส่วนที่ต้องการ
- [ ] แบ่งงานเป็น steps เล็กๆ
- [ ] Verify หลังแต่ละ step

---

## 💡 Quick Reference

### สำหรับ Simple Tasks:
1. อ่าน requirements (5-10 บรรทัด)
2. อ่าน pattern (10-20 บรรทัด)
3. สร้างโค้ดโดยตรง
4. Verify ทันที
5. **Target: < 100K tokens**

### สำหรับ Complex Tasks:
1. สร้าง minimal context file
2. แบ่งเป็น phases เล็กๆ
3. ทำทีละ phase และ verify
4. อ่านไฟล์เฉพาะเมื่อจำเป็น
5. **Target: < 300K tokens**
