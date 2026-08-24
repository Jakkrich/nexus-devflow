# Verification Checklist: RUN-009-devflow-documentation-website-on-github-pages

- **Running ID**: `RUN-009-devflow-documentation-website-on-github-pages`
- **Title**: Verification Checklist สำหรับ Documentation Website บน GitHub Pages
- **Status**: Pending Verification

---

## 1. Docs Engine Verification (Local Checks)

- [ ] `npm run docs:build` คอมไพล์ Static HTML สำเร็จ 100% (No build errors)
- [ ] ไฟล์ใน `website/dist/` มีครบถ้วน ทั้ง HTML, CSS, JS, Assets
- [ ] ทดสอบเปิด Local Server ด้วย `npm run docs:dev` หรือ `npm run docs:preview` และสามารถเข้าใช้งานหน้าหลักและหน้าย่อยได้

---

## 2. UI/UX & Navigation Verification

- [ ] Sidebar Navigation มีหมวดหมู่ Start, Workflow, Commands, Quality, Reference ครบถ้วน
- [ ] Table of Contents (On this page) แสดงหัวข้อย่อยและเลื่อนตามตำแหน่งได้ถูกต้อง
- [ ] Search Dialog (⌘K) ค้นหาคำสำคัญและหัวข้อได้
- [ ] Code Blocks แสดง Syntax Highlighting และมีปุ่ม Copy ทำงานได้
- [ ] Theme Switcher สามารถสลับระหว่าง Dark Mode และ Light Mode ได้

---

## 3. GitHub Pages CI/CD Verification

- [ ] ไฟล์ `.github/workflows/deploy-docs.yml` มีโครงสร้างถูกต้องตามข้อกำหนด GitHub Actions Pages
- [ ] มีสิทธิ์ Permissions `contents: read`, `pages: write`, `id-token: write`

---

## 4. Framework Integrity & Zero Package Bloat

- [ ] `npm run check:static` ผ่าน 100%
- [ ] `npm run check` ผ่าน 100%
- [ ] `npm test` ผ่าน 100%
- [ ] `npm run test:package` ผ่าน 100% (โฟลเดอร์ `website/` ไม่ถูกดึงไปในแพ็กเกจ npm)
