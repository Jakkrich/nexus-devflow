# DevFlow 2.0 Scripts

โฟลเดอร์นี้เก็บเฉพาะ script ที่ยังเป็นส่วนหนึ่งของ active engine ใน DevFlow 2.0

## Active Scripts

- `goal-runner.mjs`: route เป้าหมายกว้างไปยัง flow ที่เหมาะสม
- `test-goal-runner.mjs`: contract test ของ goal runner
- `test-workflow-recommendations.mjs`: ตรวจ workflow recommendation contract

## Notes

- task JSON runtime เก่าถูกถอดออกจาก active engine แล้ว
- dashboard runtime เก่าถูกถอดออกแล้ว
- Python helper scripts ที่ไม่ใช่เส้นหลักของ 2.0 ถูกลบออกแล้ว
- งานใหม่ควรอิง markdown contracts ใต้ `.agent/resources/schemas/`
