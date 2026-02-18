# QA PRP Command

รัน validation ตาม Validation Loop ใน PRP และสรุปผล

## การใช้งาน

```
/04-Verify-Quality PRPs-Framework/issues/456_login-fails/prp.md
```

หรือ

```
/04-Verify-Quality PRPs-Framework/issues/123_social-login/prp.md
```

## System Prompt / Persona
- **QA Reviewer**: Use `PRPs-Framework/prompts/qa_reviewer.md` for the QA Process.

## พฤติกรรม

1. อ่าน PRP จากไฟล์ที่ระบุ
2. อ่าน section **"Validation Loop"** ใน PRP
3. รัน validation commands ตามลำดับที่กำหนดใน Validation Loop:
   - **Level 1: Syntax & Style** (lint, format, type check)
     - รันคำสั่ง lint/format ตามที่ PRP กำหนด
     - ตรวจสอบ syntax errors
     - ตรวจสอบ code style
   - **Level 2: Unit Tests**
     - รัน unit tests ตามที่ PRP กำหนด
     - ตรวจสอบว่า tests ผ่านทั้งหมด
   - **Level 3: Integration Tests**
     - รัน integration tests ตามที่ PRP กำหนด
     - ตรวจสอบว่า integration ทำงานถูกต้อง
4. สรุปผลในรูปแบบ:

```markdown
## QA Result

- Lint: PASS/FAIL – [คำอธิบาย]
- Unit Tests: PASS/FAIL – [คำอธิบาย]
- Integration: PASS/FAIL – [คำอธิบาย]

Issues:
- [ID1]: สรุป error และไฟล์ที่เกี่ยวข้อง
- [ID2]: สรุป error อื่น ๆ
```

5. ถ้ามีการ “บันทึกผล QA เป็นไฟล์” ให้สร้างไฟล์ result ไว้ที่:
   - โฟลเดอร์: `PRPs-Framework/issues/{folder}/`
   - รูปแบบชื่อไฟล์: `qa_result.md`
   - ตัวอย่าง:
     - PRP: `PRPs-Framework/issues/456_login-fails/prp.md`
     - Result: `PRPs-Framework/issues/456_login-fails/qa_result.md`

6. ถ้า **FAIL**:
   - ระบุ root cause ของแต่ละ error
   - แนะนำให้ใช้ `/03-Implement-Code` แก้ไขต่อ
   - บอกว่า subtask ไหนที่ต้องแก้ (ถ้ารู้)

7. ถ้า **PASS ทั้งหมด**:
   - สรุปว่า feature/bug นี้พร้อมใช้งานแล้ว
   - แนะนำให้ตรวจสอบ Final validation Checklist ใน PRP

## หลักการทำงาน

- **รันตามลำดับ**: Level 1 → Level 2 → Level 3
- **หยุดที่ error แรก**: ถ้า Level 1 fail ไม่ต้องรัน Level 2-3 (เว้นแต่ PRP ระบุให้รันต่อ)
- **สรุปผลชัดเจน**: บอกว่า PASS/FAIL และทำไม
- **ระบุไฟล์ที่เกี่ยวข้อง**: บอกว่า error อยู่ที่ไฟล์ไหน

## ตัวอย่าง

**Input:**
```
/04-Verify-Quality PRPs-Framework/issues/FEAT-001_add-user-auth/prp.md
```

**Validation Loop ใน PRP:**
```markdown
## Validation Loop

### Level 1: Syntax & Style
```bash
ruff check src/ --fix
mypy src/
```

### Level 2: Unit Tests
```bash
pytest tests/test_auth.py -v
```

### Level 3: Integration Tests
```bash
curl -X POST http://localhost:8000/auth/login -d '{"email":"test@example.com","password":"test"}'
```
```

**ผลลัพธ์ (PASS):**
```markdown
## QA Result

- Lint: PASS – ไม่มี linting errors
- Unit Tests: PASS – tests/test_auth.py ผ่านทั้งหมด 5 tests
- Integration: PASS – login endpoint ทำงานถูกต้อง, ได้ JWT token

✅ Feature พร้อมใช้งานแล้ว
```

**ผลลัพธ์ (FAIL):**
```markdown
## QA Result

- Lint: PASS – ไม่มี linting errors
- Unit Tests: FAIL – tests/test_auth.py มี 2 tests fail
- Integration: SKIP – ไม่รันเพราะ unit tests fail

Issues:
- [ID1]: test_login_invalid_password() fail - AssertionError: expected 'error' but got 'success'
  - ไฟล์: services/auth_service.py:45
  - สาเหตุ: validation password ไม่ทำงาน
- [ID2]: test_login_missing_email() fail - KeyError: 'email'
  - ไฟล์: routes/auth.py:12
  - สาเหตุ: ไม่มี error handling สำหรับ missing fields

แนะนำ: ใช้ `/03-Implement-Code PRPs-Framework/issues/FEAT-001_add-user-auth/prp.md` เพื่อแก้ไข issues เหล่านี้
```

## ข้อห้าม

- **ห้ามเพิ่ม feature ใหม่** ในขั้น QA
- **แก้เฉพาะสิ่งที่จำเป็น** ต่อให้ validation ผ่านเท่านั้น
- **ห้ามข้าม validation level** - ต้องรันตามลำดับ
- **ห้ามสรุปผลแบบคลุมเครือ** - ต้องบอกชัดเจนว่า PASS/FAIL และทำไม

## ข้อควรระวัง

- ต้องมี PRP ที่มี section "Validation Loop"
- Validation commands ต้องเหมาะสมกับ project type (Python/PHP/JS/etc.)
- ถ้า validation command ไม่มีในระบบ ให้แนะนำ user ติดตั้งหรือใช้คำสั่งอื่นแทน
