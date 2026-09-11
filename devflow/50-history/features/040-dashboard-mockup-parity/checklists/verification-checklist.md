# Verification Checklist: 040-dashboard-mockup-parity

| ID | Test case | Result | Evidence |
|---|---|---|---|
| V-01 | Dashboard ใช้ blueprint navy/grid theme | PASS | BrowserOS desktop screenshot และ computed color `rgb(10, 37, 64)` |
| V-02 | Thai font stack ให้ Google Sans มาก่อน fallback | PASS | BrowserOS computed font: `Google Sans Thai, Google Sans, Noto Sans Thai` |
| V-03 | แสดง Deep-Track 8 stages และ active stage | PASS | BrowserOS DOM assertion: track `deep`, next action `/40-execute 040-dashboard-mockup-parity` ระหว่าง execution |
| V-04 | Next Action อยู่ใต้ Dual-Track Delivery Model | PASS | DOM section-order assertion |
| V-05 | Quick Commands มาจากข้อมูลจริง | PASS | BrowserOS พบ 18 commands; command-catalog tests ผ่าน |
| V-06 | Tooltip แสดงด้วย mouse hover | PASS | BrowserOS hover assertion: visible/opacity 1 |
| V-07 | Tooltip แสดงด้วย keyboard focus | PASS | BrowserOS focus assertion และ `.cmd:focus:after` contract |
| V-08 | Copy command มี feedback | PASS | BrowserOS interaction แสดง `Copied!` |
| V-09 | Desktop 1440x900 ไม่มี horizontal overflow | PASS | BrowserOS width/scrollWidth assertion |
| V-10 | Tablet 900px ไม่มี overflow และ stats เป็น 2 columns | PASS | BrowserOS responsive assertion |
| V-11 | Mobile 390px ไม่มี overflow และ adapters เป็น 1 column | PASS | BrowserOS responsive assertion |
| V-12 | Accessibility tree มี track tabs และ command buttons | PASS | BrowserOS accessibility snapshot |
| V-13 | History แสดงข้อมูลจริงครบ | PASS | BrowserOS แสดง released runs `35` จาก authoritative `HISTORY.md` |
| V-14 | Browser console ไม่มี error/warning | PASS | BrowserOS console read |
| V-15 | Legacy dashboard API ยังทำงาน | PASS | dashboard integration tests |

## Automated verification

- [x] `npm test` exit 0
- [x] `npm run check` exit 0
- [x] `npm run test:routing` exit 0, Rank 1 Match Accuracy 92.86%
- [x] `git diff --check` exit 0
- [ ] `npm run security:scan` exit 1 เนื่องจาก destructive reset pattern เดิมใน rollback skills ทั้งสาม adapter ซึ่งอยู่นอก changed scope

