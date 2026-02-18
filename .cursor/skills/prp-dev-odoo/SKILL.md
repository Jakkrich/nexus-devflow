---
name: prp-dev-odoo
description: Help developers implement Odoo features following PRP workflow, with proper version detection (Odoo 8 vs 13+), model/view/controller patterns, security files, and Odoo testing. Use when working with Odoo modules, ERP development, or when the user mentions Odoo models, views, wizards, or module structure.
---

# PRP Dev – Odoo

## Scope

ใช้ skill นี้เมื่อผู้ใช้กำลังทำงานกับ **Odoo** และ:
- ขอให้ช่วยเขียน/แก้โค้ด Odoo module
- ขอให้ช่วย "ทำตาม PRP" หรือ "แตก/ทำ Subtasks"
- ขอให้ช่วยสร้าง models, views, controllers, wizards
- พูดถึง Odoo 8, Odoo 13+, module structure, หรือ ERP features

อ้างอิงหลักจาก:
- `README.md`, `AGENT_FLOW.md`
- `.cursor/rules-templates/rules.template-base-odoo`
- PRP templates ใน `PRPs-Framework/templates/`

---

## 1. Platform Detection & Version

เมื่อเริ่มทำงาน:

1. **ตรวจสอบ Odoo version indicators:**
   - มี `openerp.py` → **Odoo 8** (old naming)
   - มี `__manifest__.py` → **Odoo 13+** (new naming)
   - ตรวจ `__openerp__.py` version field → **Odoo 8**
   - ตรวจ `__manifest__.py` version field → **Odoo 13+**

2. **ตรวจสอบ directory structure:**
   - มี `addons/` folder → Odoo module structure
   - มี `models/`, `views/`, `controllers/`, `wizards/` → Odoo module structure

3. **รายงาน version ที่ตรวจพบ:**
   - "Detected: Odoo 8" หรือ "Detected: Odoo 13+"
   - อ่าน `__manifest__.py` หรือ `__openerp__.py` เพื่อเข้าใจ dependencies และ metadata
   - ปรับ rules ตาม version ที่ตรวจพบ

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
   - อัปเดต PRP: `- [x] T2: Create sale_order model – สร้าง models/sale_order.py`

4. **Git workflow (ถ้าใช้ Git):**
   - สร้าง branch จากชื่อ PRP: `prp/feat-123-add-sale-module`
   - Commit checkpoint หลังจบ subtask สำคัญ

5. **หลังจบ subtasks:**
   - ชี้ให้เห็นว่าควรรันคำสั่ง QA ตาม Validation Loop
   - ถ้าเจอปัญหาจากผลเทส ให้แก้ตาม evidence

---

## 3. Version-Specific Rules

### Odoo 8 Specific

- **อ่าน `__openerp__.py`** เพื่อเข้าใจ module dependencies และ metadata
- **ใช้ `openerp` namespace**: `from openerp import models, fields, api`
- **ใช้ decorators**: `@api.one`, `@api.multi`, `@api.depends`
- **XML views**: ใช้ `<openerp>` root tag
- **Related fields**: ใช้ `fields.related()` สำหรับ related fields
- **Python**: Python 2.7 compatible (ถ้าเป็น legacy system)

### Odoo 13+ Specific

- **อ่าน `__manifest__.py`** เพื่อเข้าใจ module dependencies และ metadata
- **ใช้ `odoo` namespace**: `from odoo import models, fields, api`
- **ใช้ decorators**: `@api.model`, `@api.depends` (ไม่มี `@api.one/@api.multi` แล้ว)
- **XML views**: ใช้ `<odoo>` root tag
- **Related fields**: ใช้ computed fields แทน `fields.related()` (deprecated)
- **Python**: Python 3.6+ compatible

### Common Rules (Both Versions)

- **ตรวจ existing modules** ใน `addons/` folder ก่อนสร้างใหม่
- **ใช้ naming conventions ที่สอดคล้อง:**
  - Module names: `snake_case`
  - Model names: `snake_case` (e.g., `sale_order_line`)
  - Class names: `CamelCase` (e.g., `SaleOrderLine`)
  - Field names: `snake_case`

---

## 4. Code Structure & Organization

### Directory Structure

```
addons/
  └── your_module/
      ├── __manifest__.py  # หรือ __openerp__.py (Odoo 8)
      ├── models/          # Data models และ business logic
      ├── views/           # XML views (form, tree, kanban, graph, pivot)
      ├── controllers/     # HTTP controllers สำหรับ web routes
      ├── wizards/          # Transient models สำหรับ user interactions
      ├── reports/         # QWeb reports
      ├── security/        # Access rights และ record rules
      └── tests/           # Unit tests
```

### File Size Limit

- **ไม่สร้างไฟล์ยาวเกิน 500 lines** - แบ่งเป็น models หรือ mixins เล็ก ๆ
- แบ่งตาม feature

---

## 5. Model Implementation

### Creating Models

1. **ตรวจ existing models** ก่อนสร้างใหม่
2. **ใช้ inheritance patterns:**
   - Model inheritance: `_inherit` และ `_name`
   - View inheritance: `<xpath>` หรือ `<field>` position attributes

3. **Odoo 8 Example:**
   ```python
   from openerp import models, fields, api
   
   class SaleOrder(models.Model):
       _name = 'sale.order'
       _inherit = 'sale.order'
       
       custom_field = fields.Char(string='Custom Field')
       
       @api.one
       def compute_total(self):
           self.total = sum(line.price for line in self.order_line)
   ```

4. **Odoo 13+ Example:**
   ```python
   from odoo import models, fields, api
   
   class SaleOrder(models.Model):
       _name = 'sale.order'
       _inherit = 'sale.order'
       
       custom_field = fields.Char(string='Custom Field')
       
       @api.model
       def compute_total(self):
           for record in self:
               record.total = sum(line.price for line in record.order_line)
   ```

### Gotchas

- **Odoo 8**: `@api.one` returns list, `@api.multi` expects recordset
- **Odoo 13+**: ไม่มี `@api.one` แล้ว - ใช้ `@api.model` กับ loop
- **Odoo 8**: `fields.related()` requires `readonly=True` by default
- **Odoo 13+**: `fields.related()` deprecated - ใช้ computed fields
- **Odoo 13+**: `@api.onchange` deprecated - ใช้ `@api.depends` กับ compute

---

## 6. View Implementation

### XML Views

1. **ใช้ root tag ที่ถูกต้อง:**
   - Odoo 8: `<openerp>`
   - Odoo 13+: `<odoo>`

2. **View Types:**
   - Form views
   - Tree views (list)
   - Kanban views
   - Graph views
   - Pivot views

3. **View Inheritance:**
   - ใช้ `<xpath>` สำหรับ inheritance
   - ใช้ `<field>` position attributes

### Odoo 8 Example

```xml
<?xml version="1.0"?>
<openerp>
    <data>
        <record id="view_sale_order_form" model="ir.ui.view">
            <field name="name">sale.order.form</field>
            <field name="model">sale.order</field>
            <field name="inherit_id" ref="sale.view_order_form"/>
            <field name="arch" type="xml">
                <xpath expr="//field[@name='partner_id']" position="after">
                    <field name="custom_field"/>
                </xpath>
            </field>
        </record>
    </data>
</openerp>
```

### Odoo 13+ Example

```xml
<?xml version="1.0"?>
<odoo>
    <data>
        <record id="view_sale_order_form" model="ir.ui.view">
            <field name="name">sale.order.form</field>
            <field name="model">sale.order</field>
            <field name="inherit_id" ref="sale.view_order_form"/>
            <field name="arch" type="xml">
                <xpath expr="//field[@name='partner_id']" position="after">
                    <field name="custom_field"/>
                </xpath>
            </field>
        </record>
    </data>
</odoo>
```

---

## 7. Controller Implementation

### Creating Controllers

1. **ใช้ `@route()` decorators** สำหรับ web routes
2. **ใช้ `request.env`** สำหรับ environment access

### Example

```python
from odoo import http
from odoo.http import request

class CustomController(http.Controller):
    @http.route('/custom/endpoint', auth='public', type='http')
    def custom_endpoint(self):
        return request.render('your_module.custom_template', {
            'data': request.env['your.model'].search([])
        })
```

---

## 8. Security Files

### Access Rights (ir.model.access.csv)

เมื่อเพิ่ม model ใหม่:

1. **สร้าง/อัปเดต `security/ir.model.access.csv`:**
   ```csv
   id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
   access_your_model_user,your.model.user,model_your_model,base.group_user,1,1,1,1
   ```

2. **ระบุ permissions:**
   - `perm_read`: อ่าน
   - `perm_write`: แก้ไข
   - `perm_create`: สร้าง
   - `perm_unlink`: ลบ

### Record Rules

สร้าง record rules ใน `security/ir.rule.xml`:

```xml
<record id="your_model_rule" model="ir.rule">
    <field name="name">Your Model Rule</field>
    <field name="model_id" ref="model_your_model"/>
    <field name="domain_force">[('user_id', '=', user.id)]</field>
</record>
```

---

## 9. Testing

### Odoo 8 Testing

```python
from openerp.tests.common import TransactionCase

class TestYourModel(TransactionCase):
    @openerp.tests.common.at_install(False)
    @openerp.tests.common.post_install(True)
    def test_your_method(self):
        # Test code
        pass
```

### Odoo 13+ Testing

```python
from odoo.tests.common import TransactionCase, tagged
from odoo.tests import Form

@tagged('post_install', '-at_install')
class TestYourModel(TransactionCase):
    def test_your_method(self):
        # Test code
        pass
    
    def test_form_helper(self):
        form = Form(self.env['your.model'])
        form.name = 'Test'
        record = form.save()
        self.assertEqual(record.name, 'Test')
```

### Testing Rules

1. **สร้าง unit tests** สำหรับ:
   - Model methods (compute, onchange, constraints)
   - Business logic
   - Workflow transitions

2. **Test อย่างน้อย:**
   - 1 happy path
   - 1 edge case
   - 1 error case

3. **Test with different user groups** (ถ้าเกี่ยวข้องกับ security)

---

## 10. Common Gotchas

### Environment Access

- **ใช้ `self.env`** สำหรับ environment access
- **ใช้ `sudo()`** อย่างระมัดระวัง - ใช้เมื่อจำเป็นเท่านั้น

### Transaction Management

- **Changes are auto-committed** - ไม่ต้อง commit manual
- **ระวัง cache invalidation** - รู้ว่าเมื่อไหร่ fields จะ recompute

### Access Rights

- **ตรวจ `ir.model.access.csv`** และ record rules
- **อัปเดต security files** เมื่อเพิ่ม model ใหม่หรือ field สำคัญ

### Version Mixing

- **ไม่ mix Odoo 8 และ Odoo 13+ syntax** ใน module เดียวกัน
- **ใช้ version-appropriate code** ตามที่ตรวจพบ

---

## 11. Code Style & Conventions

### Python Code

- **Follow PEP8**
  - Odoo 13+: Python 3.6+ style
  - Odoo 8: Python 2.7 style (ถ้าเป็น legacy)
- **ใช้ type hints** (Odoo 13+ only, optional)
- **Format with `black`** (ถ้ามี)

### Documentation

- **Document model fields** ด้วย `string` และ `help` attributes
- **Comment complex business logic** ด้วย `# Reason:` comments

---

## 12. Refactoring

เมื่อไฟล์เริ่มยาวหรือโค้ดเริ่มซับซ้อน:

1. **ถ้าใกล้/เกิน 500 บรรทัด:**
   - แนะนำวิธี split file ตาม domain / responsibility
   - แบ่งเป็น models หรือ mixins เล็ก ๆ

2. **ตรวจหา code smells:**
   - ฟังก์ชันยาวมาก
   - logic ซ้ำหลายที่
   - ผูกกับ external services แน่นเกินไป

3. **เสนอ refactor step เล็ก ๆ ที่ปลอดภัย:**
   - extract function/class
   - move function ไป module ที่เหมาะสม
   - ใช้ mixins สำหรับ reusable functionality

เสมอเชื่อมโยงกับ PRP หรือ ISSUE ที่เกี่ยวข้อง (เพื่อให้ trace ได้)

---

## Quick Reference

### Command Flow

```bash
# 1. สร้าง ISSUE Spec
/create-issue FEAT 123 Add custom sale order fields

# 2. Generate PRP
/generate-prp PRPs-Framework/issues/ISSUE_123_add-custom-sale-fields.md

# 3. Execute PRP
/execute-prp PRPs-Framework/PRPs/PRPs_FEAT-123_add-custom-sale-fields_prp.md --auto-qa
```

### Module Structure Example

```
addons/
  └── custom_sale/
      ├── __manifest__.py
      ├── models/
      │   └── sale_order.py
      ├── views/
      │   └── sale_order_views.xml
      ├── security/
      │   ├── ir.model.access.csv
      │   └── ir.rule.xml
      └── tests/
          └── test_sale_order.py
```
