# 🧩 4 Slicing Archetypes Framework

> คู่มือมาตรฐานการแบ่งขนาดฟีเจอร์ (Feature Slicing & Decomposition) ใน Nexus-DevFlow เพื่อให้แต่ละรอบการส่งมอบ (Feature Run) มีขนาดเล็ก ส่งมอบคุณค่าได้จริง และทดสอบได้รอบด้าน

---

## 🎯 ทำไมต้องมี Slicing Archetypes?

ในการพัฒนาซอฟต์แวร์และการทำงานร่วมกับ AI Coding Agents ปัญหาคลาสสิก 2 ประการคือ:
1. **Slicing by Technical Layer** (เช่น ทำเฉพาะ Database หรือทำเฉพาะ Backend API ก่อน): ทำให้ในรอบนั้นไม่มี UI ให้ทดสอบ หรือไม่สามารถทดสอบแบบ End-to-End ได้
2. **Oversized Features** (ก้อนใหญ่เกินไป): ทำให้ Context Window เต็มเร็ว AI เริ่มเพี้ยน และการ Review ทำได้ยาก

**4 Slicing Archetypes** ช่วยให้คุณและ Agent เลือกกลยุทธ์การหั่นงานที่เหมาะสมที่สุดตามเป้าหมายของแต่ละ Milestone:

---

## 🛹 1. Skateboard Archetype (Minimal Functional Loop)

> *"อย่าเริ่มสร้างรถยนต์ด้วยการทำล้อ แต่ให้เริ่มด้วยการทำสเก็ตบอร์ดที่พาผู้ใช้เคลื่อนที่ได้จริง"*

### นิยาม & วัตถุประสงค์:
- สร้าง Core Business Logic & State Machine ที่ทำงานได้จริงครบ Loop แม้ UI จะเรียบง่ายที่สุด (Minimal UI หรือ Single Route / Basic Form / CLI interface)
- เน้นความถูกต้องของ Logic, Validation, Edge Cases และ Data Flow

### เหมาะสำหรับ:
- ฟีเจอร์ที่ Logic ซับซ้อน มีการคำนวณ การแปลงข้อมูล หรือ State transitions หลายขั้นตอน
- ต้องการพิสูจน์ว่าแนวคิดหลัก (Core Mechanism) ทำงานได้จริงก่อนลงทุนตกแต่งหน้าจอ

### ตัวอย่าง:
- **Search & Filter**: สร้างหน้าค้นหาที่มี Search Input เรียบๆ และแสดงผลลัพธ์แบบ Text List เพื่อทดสอบ Search Query, Debounce, Pagination และ Filter Logic
- **Payment Processing**: ระบบคำนวณราคาสินค้า ส่วนลด ภาษี และสร้าง Transaction Record โดยยังไม่ต้องมี UI สวยหรู

---

## 🎭 2. Facade Archetype (Rich UI / Mock-Backed DX)

> *"สร้างประสบการณ์ใช้งานจริงที่สวยงามและจับต้องได้ โดยเชื่อมต่อกับ Mock Data ก่อนพัฒนา Backend จริง"*

### นิยาม & วัตถุประสงค์:
- สร้าง Full Rich Interactive UI, Component Interactions, Micro-animations และ Design System สมบูรณ์แบบ
- จำลอง Data Source ด้วย In-Memory Mock หรือ JSON Fixtures เพื่อเก็บ Feedback เรื่อง UX/DX ทันที

### เหมาะสำหรับ:
- ฟีเจอร์ที่เน้นประสบการณ์ผู้ใช้ (UI/UX Heavy), Dashboard, Data Visualization, Complex Multi-step Wizards
- ต้องการให้ Stakeholders / ผู้ใช้เห็นหน้าตาและสัมผัส Flow การกดจริงเพื่อสรุป Design ก่อนลงมือทำ Backend

### ตัวอย่าง:
- **Analytics Dashboard**: สร้างชาร์ต กราฟ และ Card KPIs สวยงาม Interactive เต็มรูปแบบโดยอ่านข้อมูลจาก Mock Dataset
- **Interactive Kanban Board**: Drag & drop การ์ด ย้ายคอลัมน์ ปรับแท็กแบบ Real-time บน Local State ก่อนเชื่อมต่อ Database จริง

---

## 🎯 3. Tracer Bullet Archetype (End-to-End Vertical Slice)

> *"ยิงกระสุนส่องวิถี ทะลวงผ่านทุกเลเยอร์ของระบบจากบนลงล่าง สำหรับ 1 Happy Path ที่สมบูรณ์"*

### นิยาม & วัตถุประสงค์:
- สร้าง Full-Stack Vertical Slice ตั้งแต่ UI -> API Controller -> Service/Logic -> Database Model & Migration สำหรับ **1 Single Happy Path**
- พิสูจน์ Contract, Network Protocol, Serialization, Type Safety และ Infrastructure ทั้งหมดว่าเชื่อมต่อกันได้จริง

### เหมาะสำหรับ:
- สถาปัตยกรรมใหม่ หรือเมื่อต้องต่อเชื่อม Third-Party Service, DB ใหม่, หรือ Auth Flow ใหม่
- ต้องการลดความเสี่ยงด้าน Integration Risk ในช่วงต้นของโปรเจกต์

### ตัวอย่าง:
- **User Authentication**: สร้าง Registration Form -> Submit API -> Hash Password -> บันทึกลง PostgreSQL DB -> Issue JWT Token -> Redirect ไปหน้า Profile สำหรับกรณีข้อมูลถูกต้อง 1 กรณี
- **Report Export**: กดปุ่ม Export -> Backend Query ข้อมูล -> สร้าง PDF Stream -> Browser ดาวน์โหลดไฟล์สำเร็จ

---

## 🧭 4. Journey Archetype (Slice by User Workflow / Milestones)

> *"แบ่งฟีเจอร์ตามขั้นตอนการเดินทางของผู้ใช้งาน (User Journey Steps)"*

### นิยาม & วัตถุประสงค์:
- หั่นงานตามลำดับขั้นตอนธรรมชาติของ Business Process (เช่น Stage 1: Onboarding -> Stage 2: Core Activity -> Stage 3: Summary & Export)
- แต่ละชิ้นงานจบในตัว และปลดล็อคขั้นตอนถัดไปใน Journey ของผู้ใช้

### เหมาะสำหรับ:
- Workflow ขนาดใหญ่ที่มีหลายสเตจ, Checkout Flows, Multi-step Form Wizard, Approval Pipeline

### ตัวอย่าง:
- **E-Commerce Checkout**:
  - *Slice 1 (Cart Review)*: หน้าสรุปรายการสินค้าและปรับจำนวน
  - *Slice 2 (Shipping & Address)*: แบบฟอร์มกรอกที่อยู่จัดส่งและคำนวณค่าส่ง
  - *Slice 3 (Payment & Order Confirmation)*: เลือกวิธีชำระเงินและสรุปใบสั่งซื้อ

---

## 📊 ตารางเปรียบเทียบและการเลือกใช้งาน (Selection Matrix)

| Archetype | จุดเน้นหลัก (Focus) | UI Level | Backend / DB | เมื่อไหร่ควรเลือก? |
| :--- | :--- | :---: | :---: | :--- |
| 🛹 **Skateboard** | Core Logic & Flow | Minimal | Real | Logic ซับซ้อน ต้องการความถูกต้องก่อนตกแต่ง |
| 🎭 **Facade** | UX, DX & Interaction | Rich / Complete | Mocked | ต้องการทดสอบ UX / รับ Feedback จากผู้ใช้เร็ว |
| 🎯 **Tracer Bullet** | Full Architecture Path | Functional | Real | ต้องการทดสอบ Integration & Pipeline ทะลุทุกชั้น |
| 🧭 **Journey** | Step-by-Step Workflow | Balanced | Real | Workflow ยาว แบ่งทำทีละสเตจตามลำดับ |

---

## 💡 แนวทางปฏิบัติใน DevFlow Workflow

1. **ใน `/discovery` หรือ `/brainstorm`**: เมื่อวิเคราะห์ฟีเจอร์ใหญ่ ให้เสนอ Archetype ที่แนะนำในการแบ่ง Sub-features
2. **ใน `/feature` (Step 2 Sizing & Splitting)**: หากต้องแยกฟีเจอร์ย่อย (เช่น 4a, 4b, 4c) ให้ระบุ Archetype กำกับ เช่น `4a. (Tracer Bullet) Core Export Engine` -> `4b. (Facade) Interactive Export Modal & Template Preview`
3. **ใน Living Spec (`spec.md`)**: ระบุ Archetype ในส่วนหัวของ Spec เพื่อให้ Agent ในขั้นตอน `/implement` ทราบความคาดหวังเรื่องระดับ UI และ Data Source อย่างชัดเจน
