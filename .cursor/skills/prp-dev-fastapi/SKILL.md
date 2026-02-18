---
name: prp-dev-fastapi
description: Help developers implement FastAPI features following PRP workflow, with async/await patterns, Pydantic validation, proper testing, and FastAPI best practices. Use when working with FastAPI projects, Python REST APIs, or when the user mentions FastAPI endpoints, async code, or Pydantic models.
---

# PRP Dev – FastAPI

## Scope

ใช้ skill นี้เมื่อผู้ใช้กำลังทำงานกับ **FastAPI** และ:
- ขอให้ช่วยเขียน/แก้โค้ด FastAPI
- ขอให้ช่วย "ทำตาม PRP" หรือ "แตก/ทำ Subtasks"
- ขอให้ช่วยเขียน test / QA / refactor
- พูดถึง async/await, Pydantic, SQLAlchemy, หรือ API endpoints

อ้างอิงหลักจาก:
- `README.md`, `AGENT_FLOW.md`
- `.cursor/rules-templates/rules.template-base-fastapi`
- PRP templates ใน `PRPs-Framework/templates/`

---

## 1. Platform Detection

เมื่อเริ่มทำงาน:

1. **ตรวจสอบ FastAPI indicators:**
   - มี `main.py` หรือ `app.py` ที่ `from fastapi import FastAPI`
   - มี `fastapi` ใน `requirements.txt` / `pyproject.toml`
   - มี `uvicorn` หรือ `gunicorn` ใน dependencies
   - มี `@app.get()`, `@app.post()` decorators

2. **ตรวจสอบ database ORM:**
   - `SQLAlchemy` imports → SQLAlchemy ORM
   - `SQLModel` imports → SQLModel (Pydantic + SQLAlchemy)
   - `Tortoise ORM` → Async ORM
   - `databases` package → Async database

3. **ตรวจสอบ validation library:**
   - `pydantic` imports → Pydantic for validation
   - Pydantic models with `BaseModel`

4. **รายงาน stack ที่ตรวจพบ:**
   - "Detected: FastAPI with [ORM] and [Validation]"
   - อ่าน `main.py` หรือ `app.py` เพื่อเข้าใจโครงสร้าง
   - ตรวจ `requirements.txt` หรือ `pyproject.toml` สำหรับ dependencies

---

## 2. PRP Workflow (execute-prp)

เมื่อผู้ใช้พูดถึงหรือเปิด `PRPs-Framework/PRPs/*_prp.md`:

1. **อ่าน PRP อย่างเป็นระบบ:**
   - `Goal`, `Why`, `What`
   - `All Needed Context` (docs, references, gotchas)
   - `Plan / Subtasks` หรือ `list of tasks`
   - `Validation Loop` (lint/test/integration)

2. **ตัดสินใจ execution strategy:**
   - **ทำทีละ subtask** (แนะนำสำหรับงานกลาง–ใหญ่)
   - **ทำเป็นก้อนเดียว** (สำหรับงานเล็กหรือ PRP simple)

3. **ถ้าทำทีละ subtask:**
   - เลือก T ที่ **พร้อมทำ** (dependency ครบแล้ว)
   - อธิบายสั้น ๆ ว่าใน T นี้จะไปแก้ไฟล์ไหนบ้าง และจะทำอะไร
   - เขียน/ปรับโค้ดให้เสร็จ T นั้น
   - อัปเดต PRP: `- [x] T2: Implement login endpoint – สร้าง api/auth.py และเพิ่ม UserService`

4. **Git workflow (ถ้าใช้ Git):**
   - สร้าง branch จากชื่อ PRP: `prp/feat-123-add-auth`
   - Commit checkpoint หลังจบ subtask สำคัญ

5. **หลังจบ subtasks:**
   - ชี้ให้เห็นว่าควรรันคำสั่ง QA ตาม Validation Loop
   - ถ้าเจอปัญหาจากผลเทส ให้แก้ตาม evidence

---

## 3. Code Structure & Organization

### Directory Structure

ยึดโครงจาก `rules.template-base-fastapi`:

```
api/          # API route handlers
models/       # Database models (SQLAlchemy/SQLModel)
schemas/      # Pydantic models for request/response
services/     # Business logic layer
core/         # Core functionality (config, security, database)
utils/        # Utility functions
```

### Naming Conventions

- **Files**: `snake_case` (e.g., `user_service.py`)
- **Classes**: `PascalCase` (e.g., `UserService`)
- **Functions**: `snake_case` (e.g., `get_user_by_id`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_COUNT`)
- **API endpoints**: `kebab-case` in URLs (e.g., `/api/v1/user-profiles`)

### File Size Limit

- **ไม่สร้างไฟล์ยาวเกิน 500 lines** - แบ่งเป็น modules เล็ก ๆ
- แบ่งตาม feature หรือ responsibility

---

## 4. FastAPI Implementation Patterns

### Creating API Endpoints

1. **ตรวจ pattern ที่มีอยู่ก่อน** ในโปรเจค
2. **ใช้ dependency injection** สำหรับ shared resources:
   ```python
   from fastapi import Depends
   
   @app.get("/users/{user_id}")
   async def get_user(
       user_id: int,
       db: Session = Depends(get_db),
       current_user: User = Depends(get_current_user)
   ):
       ...
   ```

3. **ใช้ Pydantic models** สำหรับ request/response:
   ```python
   from pydantic import BaseModel
   
   class UserCreate(BaseModel):
       email: EmailStr
       password: str
   
   class UserResponse(BaseModel):
       id: int
       email: str
   ```

4. **ใช้ async/await** สำหรับ I/O operations:
   ```python
   async def get_user_by_id(db: Session, user_id: int) -> User:
       result = await db.execute(select(User).where(User.id == user_id))
       return result.scalar_one_or_none()
   ```

### Separating Concerns

- **Routes**: จัดการ HTTP requests/responses เท่านั้น
- **Services**: เก็บ business logic
- **Models**: จัดการ data persistence
- **Schemas**: จัดการ validation

---

## 5. Async/Await Best Practices

### Rules

- **ใช้ `async def`** สำหรับ endpoints ที่ทำ I/O operations
- **ใช้ `await`** สำหรับ async database operations
- **ไม่ mix sync และ async** - ให้ consistent
- **ใช้ `asyncio.gather()`** สำหรับ parallel async operations

### Database Operations

- **ใช้ dependency injection** สำหรับ database sessions
- **Commit transactions** อย่างชัดเจนเมื่อจำเป็น
- **Handle database errors** ด้วย try-except blocks
- **ใช้ connection pooling** สำหรับ production
- **Close database connections** อย่างถูกต้อง

### Gotchas

- **ไม่ block event loop** ด้วย I/O sync หนัก ๆ
- **ใช้ async DB driver** (asyncpg, aiomysql) ถ้าโปรเจคใช้
- **ระวัง validation** - ทำใน schema แทนไปทำใน route

---

## 6. Pydantic Validation

### Rules

- **ใช้ Pydantic models** สำหรับทุก request/response validation
- **Validate ที่ schema level** - ไม่ validate ใน routes
- **ใช้ `EmailStr`, `HttpUrl`** สำหรับ common validations
- **Custom validators** - ใช้ Pydantic validators สำหรับ logic ที่ซับซ้อน

### Example

```python
from pydantic import BaseModel, EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

---

## 7. Testing

### Testing Framework

- **ใช้ `pytest`** สำหรับ unit และ integration tests
- **ใช้ `pytest-asyncio`** สำหรับ async tests
- **ใช้ `httpx`** สำหรับ testing FastAPI endpoints
- **ใช้ `pytest-mock`** สำหรับ mocking

### Testing Rules

1. **สร้าง unit tests** สำหรับ:
   - API endpoints (ทุก HTTP methods)
   - Service layer functions
   - Utility functions

2. **Test อย่างน้อย:**
   - 1 happy path
   - 1 edge case
   - 1 error case

3. **ใช้ fixtures** สำหรับ test data และ database setup

4. **Test async endpoints** ด้วย `pytest-asyncio`

### Example Test

```python
import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/users",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"
```

### Validation Loop Integration

- ผูก test กับ Validation Loop ใน PRP
- ชี้ว่า test ไหนตอบโจทย์ checklist ข้อไหน
- ถ้า test fail → วิเคราะห์ root cause และเสนอ patch

---

## 8. Security Best Practices

### Rules

- **ไม่เก็บ password ใน plain text** - ใช้ hash เสมอ
- **ใช้ `python-jose`** สำหรับ JWT tokens
- **Validate ทุก user input** - ไม่เชื่อ client data
- **ใช้ HTTPS** ใน production
- **Implement rate limiting** สำหรับ API endpoints
- **ใช้ CORS middleware** ที่ configure ถูกต้อง

---

## 9. Performance Optimization

### Rules

- **ใช้ async database drivers** (asyncpg, aiomysql)
- **Implement caching** สำหรับข้อมูลที่เข้าถึงบ่อย
- **ใช้ background tasks** สำหรับงานที่ใช้เวลานาน
- **Optimize database queries** - หลีกเลี่ยง N+1 queries
- **ใช้ connection pooling** อย่างมีประสิทธิภาพ

---

## 10. Code Style & Conventions

### Python Code

- **Follow PEP8** coding standard
- **ใช้ type hints** สำหรับทุก functions และ methods
- **Format with `black`**
- **Lint with `ruff`** หรือ `flake8`
- **ใช้ `mypy`** สำหรับ type checking

### Documentation

- **เพิ่ม docstrings** สำหรับทุก functions และ classes
- **Document API endpoints** ด้วย description parameters
- **Comment complex business logic** ด้วย `# Reason:` comments

---

## 11. Refactoring

เมื่อไฟล์เริ่มยาวหรือโค้ดเริ่มซับซ้อน:

1. **ถ้าใกล้/เกิน 500 บรรทัด:**
   - แนะนำวิธี split file ตาม domain / responsibility

2. **ตรวจหา code smells:**
   - ฟังก์ชันยาวมาก
   - logic ซ้ำหลายที่
   - ผูกกับ external services แน่นเกินไป

3. **เสนอ refactor step เล็ก ๆ ที่ปลอดภัย:**
   - extract function/class
   - move function ไป module ที่เหมาะสม
   - เพิ่ม test ก่อน/หลัง refactor ถ้าเสี่ยง

เสมอเชื่อมโยงกับ PRP หรือ ISSUE ที่เกี่ยวข้อง (เพื่อให้ trace ได้)

---

## 12. Common Gotchas

### Async/Await
- ไม่ mix sync และ async - ให้ consistent
- ใช้ `asyncio.gather()` สำหรับ parallel operations

### Database
- ใช้ dependency injection สำหรับ sessions
- Commit transactions อย่างชัดเจน
- Handle errors ด้วย try-except

### Validation
- Validate ที่ schema level - ไม่ validate ใน routes
- ใช้ Pydantic validators สำหรับ custom logic

### Security
- Hash passwords - ไม่เก็บ plain text
- Validate ทุก input
- ใช้ HTTPS ใน production

---

## Quick Reference

### Command Flow

```bash
# 1. สร้าง ISSUE Spec
/create-issue FEAT 123 Add user authentication

# 2. Generate PRP
/generate-prp PRPs-Framework/issues/ISSUE_123_add-user-auth.md

# 3. Execute PRP
/execute-prp PRPs-Framework/PRPs/PRPs_FEAT-123_add-user-auth_prp.md --auto-qa
```

### File Structure Example

```
api/
  └── auth.py          # Auth endpoints
models/
  └── user.py          # User model
schemas/
  └── user.py          # User schemas
services/
  └── auth_service.py  # Auth business logic
tests/
  └── test_auth.py     # Auth tests
```
