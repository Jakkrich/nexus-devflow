---
name: package-json-generator
description: Generates or updates a package.json file with standardized npm scripts for the project. Automatically migrates tasks from .vscode/tasks.json if present. Use when initializing npm scripts, migrating from VS Code tasks, or setting up a centralized task runner.
---

# Package JSON Generator

เครื่องมือสำหรับสร้างและจัดการไฟล์ `package.json` ในโปรเจค เพื่อรวบรวมคำสั่ง (Scripts) ต่างๆ ไว้ที่ส่วนกลาง (Centralized Scripts Environment) โดยสามารถดึงข้อมูลและแปลงคำสั่งจาก `.vscode/tasks.json` มาเป็น npm scripts ได้โดยอัตโนมัติ

## วิธีการทำงาน

1. ตรวจสอบว่ามีไฟล์ `package.json` อยู่ในโปรเจคหรือไม่ หากไม่มีจะทำการสร้างขึ้นมาใหม่
2. ค้นหาไฟล์ `.vscode/tasks.json` เพื่ออ่านคำสั่ง (tasks) ที่มีอยู่
3. แปลงคำสั่งจาก `tasks.json` ให้อยู่ในรูปแบบของ npm scripts
4. หากคำสั่งไหนมีการรับค่า (เช่น `${input:version}`) จะถูกแปลงให้อยู่ในรูปแบบการใช้ PowerShell `Read-Host` หรือ Bash `read` โดยอัตโนมัติ
5. อัปเดตและบันทึกไฟล์ `package.json`

## การใช้งาน

รันสคริปต์เพื่อสร้างหรืออัปเดต `package.json` ใน root ของโปรเจคปัจจุบัน:

```bash
bash /mnt/skills/user/package-json-generator/scripts/run.sh [project-path]
```

**อาร์กิวเมนต์:**
- `project-path` - (Optional) Path ของโปรเจคที่ต้องการสร้าง `package.json` (ค่าเริ่มต้นคือโฟลเดอร์ปัจจุบัน `./`)

**ตัวอย่าง:**
```bash
# รันในโฟลเดอร์ปัจจุบัน
bash /mnt/skills/user/package-json-generator/scripts/run.sh

# ระบุ path ของโปรเจค
bash /mnt/skills/user/package-json-generator/scripts/run.sh /mnt/d/ramasri/tracker
```

## เอาต์พุต

```json
{
  "status": "success",
  "message": "Generated package.json successfully",
  "data": {
    "scriptsAdded": 10,
    "path": "/mnt/d/ramasri/tracker/package.json"
  }
}
```

## การนำเสนอผลลัพธ์ต่อผู้ใช้

- แจ้งผู้ใช้ว่าได้ทำการสร้างหรืออัปเดต `package.json` เรียบร้อยแล้ว
- สรุปรายการ scripts ที่ถูกเพิ่มเข้าไปให้ผู้ใช้ทราบ
- แนะนำให้ผู้ใช้ทดลองรันคำสั่งด้วย `npm run <script-name>`

## การแก้ไขปัญหา

- หากระบบแจ้งว่าหา Node.js ไม่พบ ให้ตรวจสอบการติดตั้ง Node.js
- หากไฟล์ `tasks.json` มีโครงสร้างที่ผิดปกติ สคริปต์อาจจะดึงคำสั่งมาได้ไม่ครบถ้วน ให้ตรวจสอบและเพิ่มเข้าไปใน `package.json` เองในภายหลัง
