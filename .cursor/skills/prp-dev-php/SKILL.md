---
name: prp-dev-php
description: Help developers implement PHP features following PRP workflow, with proper framework detection (CodeIgniter 3 vs Yii 2), MVC patterns, security best practices, and PHP testing. Use when working with PHP projects, CodeIgniter, Yii Framework, or when the user mentions PHP controllers, models, views, or framework-specific features.
---

# PRP Dev – PHP

## Scope

ใช้ skill นี้เมื่อผู้ใช้กำลังทำงานกับ **PHP** และ:
- ขอให้ช่วยเขียน/แก้โค้ด PHP (CodeIgniter 3 หรือ Yii Framework)
- ขอให้ช่วย "ทำตาม PRP" หรือ "แตก/ทำ Subtasks"
- ขอให้ช่วยสร้าง controllers, models, views
- พูดถึง CodeIgniter, Yii Framework, MVC patterns, หรือ PHP features

อ้างอิงหลักจาก:
- `README.md`, `AGENT_FLOW.md`
- `.cursor/rules-templates/rules.template-base-php`
- PRP templates ใน `PRPs-Framework/templates/`

---

## 1. Platform Detection & Framework

เมื่อเริ่มทำงาน:

1. **ตรวจสอบ framework indicators:**
   - มี `application/config/config.php` → **CodeIgniter 3**
   - มี `composer.json` กับ `"yiisoft/yii2"` → **Yii Framework**
   - มี `index.php` กับ `define('ENVIRONMENT')` → **CodeIgniter 3**
   - มี `web/index.php` กับ `require(__DIR__ . '/../vendor/autoload.php')` → **Yii Framework**
   - ตรวจ directory structure:
     - `application/` folder → **CodeIgniter 3**
     - `vendor/yiisoft/` folder → **Yii Framework**

2. **ตรวจสอบ framework version:**
   - CodeIgniter 3: ตรวจ `application/config/config.php` สำหรับ version comments
   - Yii Framework: ตรวจ `composer.json` สำหรับ `"yiisoft/yii2": "~2.0.x"`

3. **รายงาน framework ที่ตรวจพบ:**
   - "Detected: CodeIgniter 3" หรือ "Detected: Yii Framework"
   - อ่าน config files เพื่อเข้าใจ configuration
   - ปรับ rules ตาม framework ที่ตรวจพบ

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
   - อัปเดต PRP: `- [x] T2: Create UserController – สร้าง controllers/UserController.php`

4. **Git workflow (ถ้าใช้ Git):**
   - สร้าง branch จากชื่อ PRP: `prp/feat-123-add-user-auth`
   - Commit checkpoint หลังจบ subtask สำคัญ

5. **หลังจบ subtasks:**
   - ชี้ให้เห็นว่าควรรันคำสั่ง QA ตาม Validation Loop
   - ถ้าเจอปัญหาจากผลเทส ให้แก้ตาม evidence

---

## 3. CodeIgniter 3 Specific Rules

### Configuration

- **อ่าน `application/config/config.php`** เพื่อเข้าใจ configuration
- **ตรวจ `application/config/routes.php`** สำหรับ routing rules

### Naming Conventions

- **Controllers**: `PascalCase` (e.g., `UserController.php`)
- **Models**: `PascalCase` (e.g., `User_model.php`)
- **Views**: `snake_case` (e.g., `user_list.php`)
- **Libraries**: `PascalCase` (e.g., `Email_library.php`)

### Loading Resources

```php
// Load model
$this->load->model('User_model');

// Load view
$this->load->view('user_list', $data);

// Load library
$this->load->library('email');
```

### Input Handling

- **ใช้ `$this->input->post()`** สำหรับ POST data (ไม่ใช้ `$_POST`)
- **ใช้ `$this->input->get()`** สำหรับ GET data
- **ใช้ `$this->db->escape()`** สำหรับ SQL injection prevention

### Common Patterns

```php
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserController extends CI_Controller {
    public function index() {
        $this->load->model('User_model');
        $data['users'] = $this->User_model->get_all();
        $this->load->view('user_list', $data);
    }
}
```

### Gotchas

- **ตรวจ `BASEPATH`** เสมอ - ป้องกัน direct access
- **Session handling**: ใช้ `$this->session->userdata()`
- **File uploads**: ใช้ `$this->upload->do_upload()`
- **Form validation**: ใช้ `$this->form_validation->run()`

---

## 4. Yii Framework Specific Rules

### Configuration

- **อ่าน `config/web.php`** หรือ `config/console.php` เพื่อเข้าใจ configuration
- **ตรวจ `config/routes.php`** สำหรับ URL routing rules

### Naming Conventions

- **Controllers**: `PascalCase` (e.g., `UserController.php`)
- **Models**: `PascalCase` (e.g., `User.php`)
- **Views**: `snake_case` (e.g., `index.php`)
- **Components**: `PascalCase` (e.g., `EmailService.php`)

### ActiveRecord

```php
use yii\db\ActiveRecord;

class User extends ActiveRecord {
    public static function tableName() {
        return 'users';
    }
    
    public function getOrders() {
        return $this->hasMany(Order::class, ['user_id' => 'id']);
    }
}
```

### Dependency Injection

```php
use Yii;

// Get component
$cache = Yii::$app->cache;
$db = Yii::$app->db;
```

### Common Patterns

```php
<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\models\User;

class UserController extends Controller {
    public function actionIndex() {
        $users = User::find()->all();
        return $this->render('index', ['users' => $users]);
    }
}
```

### Gotchas

- **ใช้ ActiveRecord** - ไม่เขียน raw SQL queries
- **ใช้ `Yii::$app->`** สำหรับ application components
- **CSRF protection**: Enabled by default, ใช้ `csrfParam` ใน forms
- **XSS prevention**: ใช้ `Html::encode()` สำหรับ output
- **Database transactions**: ใช้ `$transaction = Yii::$app->db->beginTransaction()`
- **Cache**: ใช้ `Yii::$app->cache->set()` และ `get()`

---

## 5. Code Structure & Organization

### CodeIgniter 3 Structure

```
application/
  ├── config/          # Configuration files
  ├── controllers/     # Request handling
  ├── models/          # Data access และ business logic
  ├── views/           # Presentation layer
  ├── libraries/       # Reusable classes
  └── helpers/         # Utility functions
```

### Yii Framework Structure

```
controllers/           # Request handling
models/               # Data models และ business logic
views/                # Presentation layer
components/           # Reusable components
widgets/              # UI widgets
config/               # Configuration files
```

### File Size Limit

- **ไม่สร้างไฟล์ยาวเกิน 500 lines** - แบ่งเป็น classes หรือ helpers เล็ก ๆ
- แบ่งตาม feature

---

## 6. Security Best Practices

### Common Rules (Both Frameworks)

- **Validate ทุก input** - ไม่เชื่อ user input
- **ใช้ prepared statements** - ป้องกัน SQL injection
- **Escape output** - ป้องกัน XSS attacks
- **Error handling** - ใช้ try-catch blocks
- **Memory management** - ระวัง large data sets
- **Session security** - ใช้ secure session configuration

### CodeIgniter 3 Security

- **ใช้ `$this->input->post()`** แทน `$_POST`
- **ใช้ `$this->db->escape()`** สำหรับ SQL injection prevention
- **ใช้ `$this->form_validation->run()`** สำหรับ form validation
- **ตรวจ `BASEPATH`** เพื่อป้องกัน direct access

### Yii Framework Security

- **ใช้ ActiveRecord** - ไม่เขียน raw SQL
- **ใช้ `Html::encode()`** สำหรับ output
- **CSRF protection**: Enabled by default
- **ใช้ framework's security features**

---

## 7. Database Operations

### CodeIgniter 3

```php
// Query Builder
$this->db->select('*')
    ->from('users')
    ->where('status', 'active')
    ->get()
    ->result();

// Prepared statements
$this->db->query('SELECT * FROM users WHERE id = ?', [$id]);
```

### Yii Framework

```php
// ActiveRecord
$users = User::find()
    ->where(['status' => 'active'])
    ->all();

// Query Builder
$users = (new \yii\db\Query())
    ->from('users')
    ->where(['status' => 'active'])
    ->all();
```

---

## 8. Testing

### Testing Rules

1. **สร้าง unit tests** สำหรับ:
   - Model methods
   - Business logic
   - API endpoints

2. **Test อย่างน้อย:**
   - 1 happy path
   - 1 edge case
   - 1 error case

3. **ใช้ database fixtures** สำหรับ testing

4. **Test with different user roles** (ถ้าเกี่ยวข้องกับ authentication)

### PHPUnit Example

```php
<?php
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase {
    public function testCreateUser() {
        $user = new User();
        $user->name = 'Test User';
        $user->email = 'test@example.com';
        $this->assertTrue($user->save());
    }
}
```

### Validation Loop Integration

- ผูก test กับ Validation Loop ใน PRP
- ชี้ว่า test ไหนตอบโจทย์ checklist ข้อไหน
- ถ้า test fail → วิเคราะห์ root cause และเสนอ patch

---

## 9. Code Style & Conventions

### PHP Code

- **Follow PSR-12** coding standard
- **ใช้ type hints** (PHP 7.4+)
- **Format with `php-cs-fixer`** หรือ `phpcs`
- **ใช้ strict types**: `declare(strict_types=1);`

### Documentation

- **Document model properties** ด้วย PHPDoc comments
- **Comment complex business logic** ด้วย `// Reason:` comments
- **Document API endpoints** ด้วย PHPDoc

---

## 10. Common Gotchas

### CodeIgniter 3

- **ตรวจ `BASEPATH`** เสมอ - ป้องกัน direct access
- **ใช้ `$this->input->post()`** แทน `$_POST`
- **ใช้ `$this->db->escape()`** สำหรับ SQL injection prevention
- **Session handling**: ใช้ `$this->session->userdata()`
- **File uploads**: ใช้ `$this->upload->do_upload()`
- **Form validation**: ใช้ `$this->form_validation->run()`

### Yii Framework

- **ใช้ ActiveRecord** - ไม่เขียน raw SQL queries
- **ใช้ `Yii::$app->`** สำหรับ application components
- **CSRF protection**: Enabled by default
- **XSS prevention**: ใช้ `Html::encode()` สำหรับ output
- **Database transactions**: ใช้ `$transaction = Yii::$app->db->beginTransaction()`

### Common PHP

- **Validate ทุก input** - ไม่เชื่อ user input
- **ใช้ prepared statements** - ป้องกัน SQL injection
- **Escape output** - ป้องกัน XSS attacks
- **Error handling** - ใช้ try-catch blocks
- **Memory management** - ระวัง large data sets

---

## 11. Refactoring

เมื่อไฟล์เริ่มยาวหรือโค้ดเริ่มซับซ้อน:

1. **ถ้าใกล้/เกิน 500 บรรทัด:**
   - แนะนำวิธี split file ตาม domain / responsibility
   - แบ่งเป็น classes หรือ helpers เล็ก ๆ

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

### CodeIgniter 3 Structure Example

```
application/
  ├── controllers/
  │   └── UserController.php
  ├── models/
  │   └── User_model.php
  └── views/
      └── user_list.php
```

### Yii Framework Structure Example

```
controllers/
  └── UserController.php
models/
  └── User.php
views/
  └── user/
      └── index.php
```
