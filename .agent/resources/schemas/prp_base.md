name: "Base PRP Template v2 - Context-Rich with Validation Loops (Universal)"
description: |
  Universal template optimized for AI agents to implement features with sufficient context and self-validation capabilities. Works with any programming language and framework.

## Purpose
Template optimized for AI agents to implement features with sufficient context and self-validation capabilities to achieve working code through iterative refinement. This universal version works with any programming language and framework.

## Change History
- **Created:** YYYY-MM-DD
- **Type:** BUG / FEATURE / CHANGE / REFACTOR / OTHER
- **Source Spec:** [.workspaces/specs/ISSUE_xxx_*.md]
- **Related PRPs:**
  - [.workspaces/specs/PRPs_FEAT-xxx_*.md] - [Why related]
  - [.workspaces/specs/PRPs_BUG-yyy_*.md] - [Why related]
- **Updates:**
  - YYYY-MM-DD: [What changed in this PRP or its implementation]

## Git Context
- **Proposed Branch**: [type]/#[issue]-[alias]
- **Commit Pattern**: [type]: <summary>

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in .antigravityrules or CLAUDE.md

---

## Goal
[What needs to be built - be specific about the end state and desires]

## Why
- [Business value and user impact]
- [Integration with existing features]
- [Problems this solves and for whom]

## What
[User-visible behavior and technical requirements]

### Success Criteria
- [ ] [Specific measurable outcomes]

## Execution Strategy

**Task Breakdown Required:** [YES/NO/AUTO]

- **YES**: This PRP must be broken into tasks and executed step-by-step
- **NO**: This PRP can be executed as a single unit
- **AUTO**: Let AI decide based on complexity (default)

**If YES, tasks are defined in "list of tasks" section below.**
**If NO, proceed with direct implementation.**

## Plan / Subtasks

**IMPORTANT: This section will be created by the `/generate-prp` command**

This section is used to specify subtasks to be executed in sequence, along with dependencies and target files.

```markdown
## Plan / Subtasks

- [ ] T1: [Subtask name]
     - Target files: [path/to/file1, path/to/file2]
     - Depends on: []
     - Notes: [Short description]

- [ ] T2: [Subtask name]
     - Target files: [...]
     - Depends on: [T1]
     - Notes: [...]
```

**Principles:**
- Divide work into clear, actionable subtasks that can be tackled one by one.
- Each subtask should have specific target files.
- Specify dependencies between subtasks (Depends on: [T1, T2]).
- Subtasks should follow an ascending dependency order.
- Subtasks should align with the "list of tasks" in the Implementation Blueprint.

**For PRPs not requiring task breakdown:** This section can be left blank.

## All Needed Context

### Documentation & References (list all context needed to implement the feature)

Agent will **fetch external URLs** and **read PDFs** when cited here. See `PRPs-Framework/references/README.md` for conventions.

```yaml
# MUST READ - Include these in your context window
- url: [Official API docs URL]
  why: [Specific sections/methods you'll need]
  
- file: [path/to/example.py OR path/to/example.php OR path/to/example.js]
  why: [Pattern to follow, gotchas to avoid]
  
- doc: [Library documentation URL] 
  section: [Specific section about common pitfalls]
  critical: [Key insight that prevents common errors]

- example: [PRPs-Framework/references/path/to/file.ext OR PRPs-Framework/references/folder_name/]
  why: [Pattern to follow, implementation approach, or gotchas from user-provided examples]

- pdf: [PRPs-Framework/references/docs/spec.pdf OR path under PRPs-Framework/references/]
  why: [Sections or topics in the PDF relevant to this issue - agent will read and select by problem]

- docfile: [PRPs-Framework/references/topic.md containing external links]
  why: [Agent will fetch URLs found in this file and use content for this issue]
  
- docfile: [PRPs-Framework/ai_docs/file.md]
  why: [Documentation that the user has pasted into the project]

```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase
```bash

```

### Desired Codebase tree with files to be added and responsibility of file
```bash

```

### Known Gotchas of our codebase & Library Quirks
```
# CRITICAL: [Library/Framework name] requires [specific setup]
# Example: FastAPI requires async functions for endpoints
# Example: CodeIgniter 3 requires BASEPATH check
# Example: Odoo 13 requires @api.model instead of @api.one
# Example: This ORM doesn't support batch inserts over 1000 records
# Example: We use pydantic v2 and need to use model_validate()
```

## Related PRPs
- [.workspaces/specs/PRPs_FEAT-xxx_some-feature_prp.md] - [Shared behavior or dependencies]
- [.workspaces/specs/PRPs_BUG-yyy_some-bug_prp.md] - [Historical bug or regression]
- [.workspaces/specs/PRPs_CHG-zzz_some-change_prp.md] - [Refactors that affect this area]

## Implementation Blueprint

### Data models and structure

Create the core data models to ensure type safety and consistency.

**IMPORTANT: Use language/framework-appropriate patterns based on detected project type.**

**For Python projects:**
```python
Examples: 
 - SQLAlchemy ORM models
 - Pydantic models/schemas
 - Pydantic validators
 - SQLModel (Pydantic + SQLAlchemy)
```

**For PHP projects:**
```php
Examples:
 - Eloquent models (Laravel)
 - ActiveRecord models (Yii)
 - CodeIgniter models
 - Doctrine entities
```

**For JavaScript/TypeScript projects:**
```typescript
Examples:
 - TypeScript interfaces/types
 - Zod schemas
 - Class-based models
 - TypeORM entities
```

**For Odoo projects:**
```python
Examples:
 - Odoo models (models.Model)
 - Odoo fields (fields.Char, fields.Many2one, etc.)
 - Computed fields with @api.depends
```

**For other languages/frameworks:** Use appropriate data modeling patterns for the detected project type.

### list of tasks to be completed to fulfill the PRP in the order they should be completed

**IMPORTANT: Only include this section if "Task Breakdown Required" is YES or if the PRP is complex enough to warrant task breakdown.**

```yaml
Task 1:
MODIFY [path/to/existing_file.ext]:
  - FIND pattern: "[pattern to find]"
  - INJECT after line containing "[line content]"
  - PRESERVE existing method signatures/patterns

CREATE [path/to/new_file.ext]:
  - MIRROR pattern from: [path/to/similar_file.ext]
  - MODIFY [specific changes needed]
  - KEEP [pattern/error handling] identical

...(...)

Task N:
...
```

**If PRP is simple (single file change, minor modification), this section can be omitted.**

### Per task pseudocode as needed added to each task

**IMPORTANT: Use language-appropriate syntax based on detected project type.**

**For Python projects:**
```python
# Task 1
# Pseudocode with CRITICAL details - don't write entire code
async def new_feature(param: str) -> Result:
    # PATTERN: Always validate input first (see src/validators.py)
    validated = validate_input(param)  # raises ValidationError
    
    # GOTCHA: This library requires connection pooling
    async with get_connection() as conn:  # see src/db/pool.py
        # PATTERN: Use existing retry decorator
        @retry(attempts=3, backoff=exponential)
        async def _inner():
            # CRITICAL: API returns 429 if >10 req/sec
            await rate_limiter.acquire()
            return await external_api.call(validated)
        
        result = await _inner()
    
    # PATTERN: Standardized response format
    return format_response(result)  # see src/utils/responses.py
```

**For PHP projects:**
```php
// Task 1
// Pseudocode with CRITICAL details
public function newFeature(string $param): Result {
    // PATTERN: Always validate input first (see app/Validators/InputValidator.php)
    $validated = $this->validateInput($param);  // throws ValidationException
    
    // GOTCHA: This library requires connection pooling
    $conn = $this->getConnection();  // see app/Database/Connection.php
    // PATTERN: Use existing retry mechanism
    $result = $this->retry(function() use ($conn, $validated) {
        // CRITICAL: API returns 429 if >10 req/sec
        $this->rateLimiter->acquire();
        return $this->externalApi->call($validated);
    }, attempts: 3);
    
    // PATTERN: Standardized response format
    return $this->formatResponse($result);  // see app/Utils/ResponseFormatter.php
}
```

**For JavaScript/TypeScript projects:**
```typescript
// Task 1
// Pseudocode with CRITICAL details
async function newFeature(param: string): Promise<Result> {
    // PATTERN: Always validate input first (see src/validators.ts)
    const validated = validateInput(param);  // throws ValidationError
    
    // GOTCHA: This library requires connection pooling
    const conn = await getConnection();  // see src/db/pool.ts
    // PATTERN: Use existing retry decorator
    const result = await retry(async () => {
        // CRITICAL: API returns 429 if >10 req/sec
        await rateLimiter.acquire();
        return await externalApi.call(validated);
    }, { attempts: 3, backoff: 'exponential' });
    
    // PATTERN: Standardized response format
    return formatResponse(result);  // see src/utils/responses.ts
}
```

**For other languages:** Use appropriate syntax and patterns for the detected project type.

### Integration Points
```yaml
DATABASE:
  - migration: "[SQL migration description]"
  - index: "[CREATE INDEX statement]"
  - OR use framework migration tools (Alembic, Laravel migrations, etc.)
  
CONFIG:
  - add to: [config/settings.py OR config/config.php OR .env]
  - pattern: "[Configuration pattern to follow]"
  
ROUTES:
  - add to: [src/api/routes.py OR app/routes.php OR src/routes.ts]
  - pattern: "[Route registration pattern]"
  
MIDDLEWARE:
  - add to: [appropriate middleware file]
  - pattern: "[Middleware registration pattern]"
```

## Validation Loop

### Level 1: Syntax & Style

**IMPORTANT: Use project-appropriate validation commands based on detected language/framework.**

**For Python projects:**
```bash
# Run these FIRST - fix any errors before proceeding
ruff check [file_path] --fix  # Auto-fix what's possible
# OR
black [file_path] && flake8 [file_path]
# OR
pylint [file_path]

mypy [file_path]              # Type checking

# Expected: No errors. If errors, READ the error and fix.
```

**For PHP projects:**
```bash
# Run these FIRST - fix any errors before proceeding
phpcs [file_path] --standard=PSR12
# OR
php-cs-fixer fix [file_path]

phpstan analyse [file_path]   # Static analysis

# Expected: No errors. If errors, READ the error and fix.
```

**For JavaScript/TypeScript projects:**
```bash
# Run these FIRST - fix any errors before proceeding
eslint [file_path] --fix
npm run type-check
# OR
tsc --noEmit

# Expected: No errors. If errors, READ the error and fix.
```

**For Odoo projects:**
```bash
# Run these FIRST - fix any errors before proceeding
pylint odoo/addons/[module_name]/
black odoo/addons/[module_name]/

# Expected: No errors. If errors, READ the error and fix.
```

**For other languages:** Use appropriate linting and type checking commands for the detected project type.

### Level 2: Unit Tests - each new feature/file/function use existing test patterns

**IMPORTANT: Use framework-appropriate testing syntax and patterns.**

**For Python projects (pytest):**
```python
# CREATE test_new_feature.py with these test cases:
def test_happy_path():
    """Basic functionality works"""
    result = new_feature("valid_input")
    assert result.status == "success"

def test_validation_error():
    """Invalid input raises ValidationError"""
    with pytest.raises(ValidationError):
        new_feature("")

def test_external_api_timeout():
    """Handles timeouts gracefully"""
    with mock.patch('external_api.call', side_effect=TimeoutError):
        result = new_feature("valid")
        assert result.status == "error"
        assert "timeout" in result.message
```

```bash
# Run and iterate until passing:
pytest test_new_feature.py -v
# OR
python -m unittest discover
# If failing: Read error, understand root cause, fix code, re-run (never mock to pass)
```

**For PHP projects (PHPUnit):**
```php
// CREATE NewFeatureTest.php with these test cases:
public function testHappyPath() {
    $result = $this->newFeature("valid_input");
    $this->assertEquals("success", $result->status);
}

public function testValidationError() {
    $this->expectException(ValidationException::class);
    $this->newFeature("");
}

public function testExternalApiTimeout() {
    $this->mockExternalApi->shouldReceive('call')
        ->andThrow(new TimeoutException());
    
    $result = $this->newFeature("valid");
    $this->assertEquals("error", $result->status);
    $this->assertStringContainsString("timeout", $result->message);
}
```

```bash
# Run and iterate until passing:
phpunit tests/NewFeatureTest.php
# OR
vendor/bin/phpunit tests/NewFeatureTest.php
# If failing: Read error, understand root cause, fix code, re-run
```

**For JavaScript/TypeScript projects (Jest/Vitest):**
```typescript
// CREATE newFeature.test.ts with these test cases:
describe('newFeature', () => {
  test('happy path - basic functionality works', () => {
    const result = newFeature("valid_input");
    expect(result.status).toBe("success");
  });

  test('validation error - invalid input raises error', () => {
    expect(() => newFeature("")).toThrow(ValidationError);
  });

  test('external api timeout - handles timeouts gracefully', () => {
    jest.spyOn(externalApi, 'call').mockRejectedValue(new TimeoutError());
    const result = newFeature("valid");
    expect(result.status).toBe("error");
    expect(result.message).toContain("timeout");
  });
});
```

```bash
# Run and iterate until passing:
npm test
# OR
jest newFeature.test.ts
# OR
vitest newFeature.test.ts
# If failing: Read error, understand root cause, fix code, re-run
```

**For Odoo projects:**
```python
# CREATE test_new_feature.py with Odoo test patterns:
from odoo.tests.common import TransactionCase

class TestNewFeature(TransactionCase):
    @odoo.tests.tagged('post_install', '-at_install')
    def test_happy_path(self):
        """Basic functionality works"""
        result = self.env['model.name'].new_feature("valid_input")
        self.assertEqual(result.status, "success")
```

```bash
# Run and iterate until passing:
odoo-bin -c odoo.conf --test-enable --stop-after-init -d test_db
# If failing: Read error, understand root cause, fix code, re-run
```

**For other languages:** Use appropriate testing framework and patterns for the detected project type.

### Level 3: Integration Test

**IMPORTANT: Use project-appropriate integration testing commands.**

**For Python/FastAPI projects:**
```bash
# Start the service
python -m src.main --dev
# OR
uvicorn app.main:app --reload

# Test the endpoint
curl -X POST http://localhost:8000/feature \
  -H "Content-Type: application/json" \
  -d '{"param": "test_value"}'

# Expected: {"status": "success", "data": {...}}
# If error: Check logs at logs/app.log for stack trace
```

**For PHP projects:**
```bash
# Start the service (if needed)
php -S localhost:8000 -t public/

# Test the endpoint
curl -X POST http://localhost:8000/feature \
  -H "Content-Type: application/json" \
  -d '{"param": "test_value"}'

# Expected: {"status": "success", "data": {...}}
# If error: Check logs at storage/logs/app.log for stack trace
```

**For JavaScript/Node.js projects:**
```bash
# Start the service
npm run dev
# OR
node src/index.js

# Test the endpoint
curl -X POST http://localhost:3000/feature \
  -H "Content-Type: application/json" \
  -d '{"param": "test_value"}'

# Expected: {"status": "success", "data": {...}}
# If error: Check console output or logs for stack trace
```

**For Odoo projects:**
```bash
# Test in Odoo interface
# Navigate to the feature in Odoo UI
# Test all user interactions
# Check Odoo logs at /var/log/odoo/ for errors
```

**For other projects:** Use appropriate integration testing approach for the detected project type.

## Final validation Checklist

**IMPORTANT: Use project-appropriate validation commands.**

- [ ] All tests pass: `[project-specific test command]`
- [ ] No linting errors: `[project-specific lint command]`
- [ ] No type errors: `[project-specific type check command]`
- [ ] Manual test successful: [specific curl/command or UI test]
- [ ] Error cases handled gracefully
- [ ] Logs are informative but not verbose
- [ ] Documentation updated if needed

**Example commands by project type:**

**Python:**
- `pytest tests/ -v`
- `ruff check src/`
- `mypy src/`

**PHP:**
- `phpunit tests/`
- `phpcs app/`
- `phpstan analyse`

**JavaScript/TypeScript:**
- `npm test`
- `eslint .`
- `npm run type-check`

**Odoo:**
- `odoo-bin --test-enable -d test_db`
- `pylint odoo/addons/`
- `black odoo/addons/`

## Maintenance Notes
- [Notes for future developers]
- [Known limitations]
- [Areas that need extra care when changing this feature]

---

## Anti-Patterns to Avoid
- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip validation because "it should work"
- ❌ Don't ignore failing tests - fix them
- ❌ Don't use sync functions in async context (if applicable)
- ❌ Don't hardcode values that should be config
- ❌ Don't catch all exceptions - be specific
- ❌ Don't mix language/framework patterns - use consistent approach
- ❌ Don't assume validation commands - detect and use appropriate ones
