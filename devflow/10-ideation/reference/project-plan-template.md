# Project Plan

> **Document Type**: Project Plan (User-Owned)
> **Purpose**: แหล่งความจริงหลัก (Single Source of Truth) สำหรับวิสัยทัศน์ผลิตภัณฑ์ สถาปัตยกรรมระบบ ขอบเขตการทำงาน และข้อกำหนดทางเทคนิค
> **Workflow**: กรอกข้อมูลให้ครบถ้วนแล้วรัน `/overview` เพื่อประมวลผลเป็น `project-overview.md`

---

## 1. Problem - What problem are we solving?
<!-- 
อธิบายปัญหาที่ระบบนี้เข้ามาแก้ไข วัตถุประสงค์หลัก และทำไมโปรเจกต์นี้จึงควรมีอยู่ (2-4 ประโยค)
- ปัญหาในปัจจุบันคืออะไร ทำไมวิธีเดิมถึงไม่ตอบโจทย์
- ผลลัพธ์ที่ต้องการ (Desired Outcome) หลังระบบนี้สร้างเสร็จ
-->

- **Core Problem**: [ระบุปัญหาหลักที่ผู้ใช้กำลังเผชิญ เช่น การทำงานแบบ Manual ที่เสียเวลาและผิดพลาดง่าย]
- **Main Purpose**: [ระบุเป้าหมายหลักของระบบ เช่น แปลง Input 3 อย่างเป็นผลลัพธ์พร้อมใช้งานในไม่กี่วินาที]

---

## 2. Users - Who is this for?
<!-- 
กลุ่มผู้ใช้งานเป้าหมายและ Use Cases หลัก
- Primary Users: ผู้ใช้งานหลักกลุ่มแรก
- Secondary / Later: กลุ่มผู้ใช้ในอนาคต
- Access Tiers: สิทธิ์การเข้าถึง เช่น Guest / Registered / Admin
-->

- **Primary Audience**: [เช่น Solo Developers, Content Creators, นักเรียน/นักศึกษา]
- **Secondary Audience (Later)**: [เช่น ทีมงานองค์กร, ลูกค้าปลายทาง]
- **User Personas & Access Tiers**:
  - `Anonymous / Guest`: [สิทธิ์การใช้งานทั่วไป เช่น ดูข้อมูลสาธารณะ, ทดลองเล่นแบบจำกัด]
  - `Authenticated User`: [สิทธิ์การใช้งานหลัก เช่น จัดการข้อมูลตนเอง, บันทึกประวัติ]
  - `Admin`: [สิทธิ์การจัดการระบบ เช่น ดูแลผู้ใช้, ตรวจสอบ Log]

---

## 3. Features - What does v1 need?
<!-- 
รายการฟีเจอร์ระดับสูงสำหรับเวอร์ชันแรก (MVP / v1)
- เขียนสรุปสั้นๆ บรรทัดละ 1 ข้อ ไม่ต้องลงรายละเอียดทางเทคนิคลึก
- แยกส่วน Out of Scope / Later ให้ชัดเจนเพื่อคุมขอบเขต (Prevent Scope Creep)
-->

### Core MVP Features (v1):
- **Feature 1**: [คำอธิบายสั้นๆ เกี่ยวกับสิ่งที่ฟีเจอร์นี้ทำ]
- **Feature 2**: [คำอธิบายสั้นๆ เกี่ยวกับสิ่งที่ฟีเจอร์นี้ทำ]
- **Feature 3**: [คำอธิบายสั้นๆ เกี่ยวกับสิ่งที่ฟีเจอร์นี้ทำ]
- **Feature 4**: [คำอธิบายสั้นๆ เกี่ยวกับสิ่งที่ฟีเจอร์นี้ทำ]

### Later / Post-MVP (Not in v1):
<!-- สิ่งที่เก็บไว้ทำในอนาคต แต่ยังไม่ทำในรอบแรก -->
- [เช่น ระบบสมัครสมาชิกและจัดการ Billing ผ่าน Stripe]
- [เช่น การส่งออกข้อมูลปริมาณมากแบบ Batch/CSV]
- [เช่น Cloud Sync และการแชร์ข้อมูลข้ามอุปกรณ์]

---

## 4. Data - What are we storing?
<!-- 
โครงสร้างข้อมูลและ Entity หลักที่ระบบต้องจัดเก็บ
- ข้อมูลที่อยู่ใน Code (Static / Config)
- ข้อมูลที่เก็บใน Browser (LocalStorage / Session / Cookies)
- ข้อมูลที่เก็บใน Database (Entities, Fields, Relationships)
-->

- **In-Code / Static**: [เช่น Template Definitions, App Constants, Fixed Options]
- **Client Storage (LocalStorage/Session)**: [เช่น User Preferences, Form Draft, UI Settings]
- **Database Entities (If applicable)**:
  - **`User`**: `id` (String/UUID), `email` (String, Unique), `name` (String), `role` (Enum), `createdAt` (DateTime)
  - **`Resource`**: `id` (UUID), `userId` (FK -> User.id), `title` (String), `status` (Enum), `metadata` (JSON), `updatedAt` (DateTime)
- **Relationships**:
  - `User` 1-to-Many `Resource`

---

## 5. Tech - What stack are we using?
<!-- 
เทคโนโลยี ไลบรารี และเครื่องมือที่เลือกใช้ พร้อมระบุหน้าที่
-->

- **Framework & Runtime**: [เช่น Next.js 15 (App Router), TypeScript, Node.js >=20]
- **Styling & UI**: [เช่น Tailwind CSS v4, Shadcn UI / Radix Primitives, Lucide Icons]
- **State & Data Access**: [เช่น Zustand, TanStack Query, Prisma ORM / Drizzle]
- **Database**: [เช่น PostgreSQL on Neon / Supabase, SQLite on LibSQL]
- **Authentication**: [เช่น NextAuth.js (Auth.js), Clerk, Supabase Auth, หรือ None in v1]
- **Validation**: [เช่น Zod for Schema & Input Validation]
- **Special Engines / Libraries**: [เช่น Puppeteer for Headless PDF/Image Export, Sharp for Image Processing]

---

## 6. Monetize - How will this make money?
<!-- 
โมเดลทางธุรกิจหรือแผนการสร้างรายได้ (หากเป็น Free Tool หรือ Internal App ให้ระบุให้ชัด)
-->

- **Model in v1**: [เช่น Free / Open-Source / Internal Utility (ไม่มีการเก็บเงินใน v1)]
- **Future Monetization (If applicable)**: [เช่น Freemium, Subscription $10/mo, Usage-based API credits]

---

## 7. UI/UX - How should this look and feel?
<!-- 
ธีม โครงสร้างหน้าจอ สไตล์การออกแบบ และประสบการณ์ผู้ใช้
-->

- **Design Aesthetic**: [เช่น Clean & Modern, Dark-Mode First, Glassmorphism, Minimalist]
- **Layout Structure**: [เช่น Single-page dashboard with Split View (Form on left, Live Preview on right)]
- **Key Routes / Screens**:
  - `/`: [หน้า Landing & Main Generator Workflow]
  - `/dashboard`: [หน้าจัดการ Resource และดูประวัติย้อนหลัง]
  - `/settings`: [หน้าตั้งค่า Profile และ Preferences]

---

## 8. Deployment - Where and how will this ship?
<!-- 
เป้าหมายการ Deploy, คำสั่ง Build/Start, และ Environment Variables
-->

- **Target Platform**: [เช่น Vercel, Render, Cloudflare Pages, Fly.io, Self-hosted Docker]
- **Build Command**: `npm run build`
- **Start Command / Output**: `npm run start` (หรือ Static Output `out/`)
- **Required Environment Variables**:
  - `DATABASE_URL`: Connection string สำหรับ Database
  - `NEXTAUTH_SECRET`: Secret key สำหรับ Session signing
  - `API_KEY`: Key สำหรับเชื่อมต่อ Third-party Service
- **Health Check Endpoint**: `/api/health`
