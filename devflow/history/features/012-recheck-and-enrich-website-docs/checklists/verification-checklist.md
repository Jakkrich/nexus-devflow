# Verification Checklist: RUN-012-recheck-and-enrich-website-docs

- **Running ID**: `RUN-012-recheck-and-enrich-website-docs`
- **Verification Strategy**: Multi-Lane Documentation Review & Astro Site Build Validation
- **Status**: Pending Execution

---

## 1. Content Completeness & Depth (ความครบถ้วนและลึกซึ้งของเนื้อหา)
- [ ] ตรวจสอบว่าทั้ง 12 หน้ามีเนื้อหาครอบคลุมตาม Spec REQ-1 ถึง REQ-4 ครบถ้วน
- [ ] ตรวจสอบว่าไม่มีหน้าใดที่สั้นเกินไปหรือมีเนื้อหาแบบผิวเผิน
- [ ] ตรวจสอบว่ามี Step-by-Step Guidance, Code Blocks, และ Starlight Alerts (`:::note`, `:::tip`, `:::caution`) ในทุกหน้าที่เหมาะสม

## 2. Cross-Linking & Navigation (การเชื่อมโยงและนำทาง)
- [ ] ลิงก์ภายใน (Internal markdown links) ถูกต้องและไม่เกิด Broken Links
- [ ] Sidebar Navigation ใน `website/astro.config.mjs` สอดคล้องกับไฟล์เอกสารทั้งหมด

## 3. Formatting & Visual Presentation (การจัดรูปแบบและการแสดงผล)
- [ ] ทุกไฟล์มี Frontmatter (`title`, `description`) ถูกต้อง
- [ ] ไม่มี Syntax Error ใน Markdown / Callout Blocks
- [ ] ไวยากรณ์ภาษาไทยถูกต้อง ชัดเจน เข้าใจง่าย และใช้ศัพท์เทคนิคที่สม่ำเสมอ

## 4. Automated Build & Integrity (การ Build อัตโนมัติ)
- [ ] รัน `npm --prefix website run build` (หรือ `npx astro build`) สำเร็จ 100%
- [ ] Exit Code เป็น 0 ไม่มี Build Errors
