# Condition-Based Waiting

อ่านเมื่อ test ใช้ sleep เดาเวลา หรือผ่าน local แต่ timeout ใน CI
เลือก wait helper ของ test runner ก่อน; /debug เสนอแผนและ /implement แก้ test

## waitFor Pattern

ตัวอย่างนี้รับ synchronous predicate เท่านั้น; ส่ง boolean ที่ตรวจ state ล่าสุด
async I/O ให้ใช้ helper ที่รองรับ async และ cancellation/timeout ของ I/O นั้น

```typescript
async function waitFor(
  condition: () => boolean,
  description: string,
  timeoutMs = 5000
): Promise<void> {
  const start = performance.now();
  while (!condition()) {
    if (performance.now() - start >= timeoutMs) {
      throw new Error('Timeout waiting for ' + description);
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}
```

predicate ต้องคืนค่ารวดเร็ว; exception จะส่งต่อให้ test fail
timeout จำกัดการ polling ไม่สามารถยกเลิก predicate ที่ block ได้

| รออะไร | Pattern |
| :--- | :--- |
| State | `await waitFor(() => state === 'ready', 'ready state')` |
| Event ที่เก็บไว้ | `await waitFor(() => events.some(e => e.type === 'DONE'), 'DONE event')` |
| จำนวน | `await waitFor(() => items.length >= 5, 'five items')` |
| ผลลัพธ์เป็น 0 ได้ | `await waitFor(() => result !== undefined, 'result')` |

สมัคร event listener ก่อนเริ่ม operation ถ้าไม่ได้เก็บ event ไว้
รอสำเร็จแล้ว assert ผลจริง; หลีกเลี่ยง cache state ก่อน loop
debounce/throttle ให้ใช้ fake clock หรือช่วงเวลาตาม contract พร้อมเหตุผล
เสร็จเมื่อ test ผ่านซ้ำภายใต้โหลด และ timeout มีข้อความบอกเงื่อนไขที่ไม่สำเร็จ
