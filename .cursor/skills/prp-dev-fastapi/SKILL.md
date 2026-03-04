---
name: prp-dev-fastapi
description: Comprehensive skill for FastAPI development following the PRP Pure Agentic workflow. Includes project templates, async/await patterns, Pydantic validation, repository/service architecture, and automated validation loops. Use when designing, implementation, or refactoring FastAPI applications.
---

# 🚀 PRP Dev – FastAPI (Pure Agentic)

This Skill operates to assist the AI Agent in systematically developing features for **FastAPI** following the PRP Framework standards, focusing on Architectural correctness, clean code, and automated Validation Loops.

## 🎯 Scope of Work
Apply this Skill when:
- **Design**: Designing the API structure or Database Schema.
- **Implementation**: Writing FastAPI code, Pydantic Models, or the Service Layer.
- **Refactor**: Revamping legacy code for better organization or full Async compatibility.
- **Workflow**: When engaging in tasks related to Backend APIs (spanning from planning to Verify).

---

## 1. 🔍 Platform & Stack Detection
Always ascertain the environment prior to starting work:
1. **Indicators**: Locate `FastAPI` in `main.py`, `requirements.txt`, or through `@app.get()` decorators.
2. **Database/ORM**: Identify the utilization of `SQLAlchemy` (Async/Sync), `SQLModel`, or `Tortoise`.
3. **Pydantic**: Confirm whether Version 1.x or 2.x is used (to guarantee proper Syntax).
4. **Project Type**: Examine if the structure is Monolithic (Small) or Modular (Production-Ready).

---

## 2. 🏗️ Architecture & Organization
Adhere to a Production-Ready architecture (strive to avoid files exceeding 500 lines):

```text
app/
├── api/                    # API route handlers
├── core/                   # config, security, database setup
├── models/                 # Database models (ORM)
├── schemas/                # Pydantic schemas (Request/Response)
├── services/               # Business logic layer
├── repositories/           # Data access layer (CRUD)
├── utils/                  # Utility functions
└── main.py                 # Application entry
```

### Naming Conventions
- **Files**: `snake_case` (e.g., `auth_service.py`)
- **Classes**: `PascalCase` (e.g., `UserUpdate`)
- **Functions**: `snake_case` (e.g., `get_active_users`)
- **Endpoints**: `kebab-case` (e.g., `/api/v1/user-profiles`)

---

## 3. 🛡️ Implementation Patterns (Best Practices)

### 3.1 Async All The Way
- Employ `async def` consistently for Endpoints.
- Utilize `await` for all I/O operations (Database, API Call, File System).
- **Prohibited**: Using Blocking code inside an Async function (e.g., `time.sleep`, `requests.get`). Employ `asyncio.sleep` or `httpx` instead.

### 3.2 Dependency Injection (FastAPI `Depends`)
Use `Depends` for managing Shared resources:
```python
@router.post("/", response_model=Item)
async def create_item(
    item_in: ItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.create(db, obj_in=item_in, user=current_user)
```

### 3.3 CRUD Repository Pattern
Segregate Data management Logic from Business Logic:
```python
# repositories/base.py
class BaseRepository(Generic[ModelType, CreateSchema, UpdateSchema]):
    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()
```

---

## 4. 🔄 PRP Workflow Integration (Pure Agentic)
For each Task, the Agent must adhere to these principles:

### Phase: Planning (/02-Plan)
- Designate the files to be created/modified in the `File & Directory Index`.
- Formulate a comprehensive `Validation Loop`:
    - **Step 1**: Lint & Type Check (`ruff`, `mypy`)
    - **Step 2**: Unit Test (`pytest`)
    - **Step 3**: Integration Test (Start the server and `curl` or use `httpx`)

### Phase: Code (/03-Code)
- Proceed with Subtasks sequentially and update the status in `implementation_plan.json` instantly.
- When producing a new Endpoint, consistently generate the corresponding Pydantic Schema and Test simultaneously.

### Phase: Verify (/04-Verify)
- Execute all commands outlined in the `Validation Loop`.
- Should an Error emerge, the AI must diagnose and rectify it promptly (Fix-Forward).

---

## 🧪 Testing & Validation
- **Framework**: Utilize `pytest` alongside `pytest-asyncio`.
- **Mocking**: Adopt `unittest.mock` or `pytest-mock` for External services.
- **Async Client**: Use `httpx.AsyncClient` to dispatch Requests to FastAPI.
- **Evidence**: Document passed outcomes in `qa_report.md` to instill confidence for a human review.

---

## ⚡ Quick Reference: Common Gotchas
- **Pydantic v2**: Employ `model_dump()` instead of `dict()` and `model_validate()` rather than `from_orm()`.
- **SQLAlchemy Async**: Necessitates the `postgresql+asyncpg://` schema and requires `await session.commit()`.
- **FastAPI Middleware**: Be cautious regarding the insertion sequence of Middleware (CORS should commonly be near the end or customized based on Auth requirements).
- **Token Efficiency**: Should a file grow excessively long, propose Module Splitting as early as the Planning phase.
