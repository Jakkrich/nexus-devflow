---
name: prp-dev-php
description: Comprehensive skill for PHP development following the PRP Pure Agentic workflow. Supports CodeIgniter 3 and Yii 2, with MVC patterns and automated validation loops in a Zero-Script environment.
---

# 🐘 PRP Dev – PHP (Pure Agentic)

This Skill empowers feature development on **PHP** conforming to the PRP Framework standards, focusing principally on CodeIgniter 3 (Legacy) and Yii Framework 2 (Modern). It fully addresses MVC operations alongside fundamental security fortifications.

## 🎯 Scope of Work
Apply this Skill when:
- **Framework Dev**: Constructing or mending Controllers, Models, and Views.
- **Legacy Support**: Improving CodeIgniter 3 codebases for better security and structure.
- **Modern PHP**: Advancing Yii 2 exploiting ActiveRecord and Dependency Injection.
- **Workflow**: Doing Task-related work pertinent to PHP Apps.

---

## 1. 🔍 Framework Detection
Probe the environment prior to starting work:
1. **CodeIgniter 3**: Probe for `application/config/config.php` or `system/`.
2. **Yii 2**: Probe for `vendor/yiisoft/yii2` or `config/web.php`.
3. **Composer**: Look over `composer.json` for PHP versions and Dependencies.

---

## 2. 🏛️ Implementation Patterns

### CodeIgniter 3 (The Singleton Pattern)
- **Namespacing**: Frequently lacks namespaces (Global usage).
- **Loading**: Implements `$this->load->model('...')` or `$this->load->view('...')`.
- **Security**: Compulsory check: `defined('BASEPATH') OR exit('...');` required universally at the top of files.

### Yii Framework 2 (The Component Pattern)
- **ActiveRecord**: Fulfills Querying through Model Classes (e.g., `User::find()`).
- **Namespacing**: Extensively integrates PSR-4 Namespacing.
- **Views**: Incorporates `Html::encode()` alongside `$this->render()`.

---

## 🛡️ Security Best Practices
- **Prepared Statements**: Mandate using the Query Builder or ORM. Raw SQL accepting direct Variables is strictly forbidden.
- **Input Validation**: Abide by Framework Validation (CI Form Validation / Yii Rules).
- **Output Escaping**: Obviate XSS attacks by Encoding data before displaying it on HTML.

---

## 🔄 PRP Workflow Integration (Zero-Script)
For each Task, the Agent must adhere to these principles:

### Phase: Planning (/30-Plan)
- Designate the files for modification and outline Validation procedures (e.g., executing `phpunit`).

### Phase: Implement (/40-Implement)
- Proceed with subtasks sequentially and capture real progress in `implement.md`.
- Chronicle implementation and verification-relevant notes in `implement.md` and `verify.md` first.

---

## 🧪 Testing & Validation
- **Unit Testing**: Employ `PHPUnit` or any pre-installed testing framework within the project.
- **Command Line**: Tests typically run via `./vendor/bin/phpunit` or specialized framework commands.
- **Manual Check**: Specify manual verification steps in `verify.md`.
