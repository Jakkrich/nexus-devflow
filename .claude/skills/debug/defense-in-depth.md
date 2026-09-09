# Defense-in-Depth Validation

อ่านหลังยืนยัน root cause เพื่อวางจุดป้องกันในแผน /fix
/debug วิเคราะห์เท่านั้น; เพิ่ม guards และ tests ใน /implement

## The Four Layers

1. **Entry point**: ปฏิเสธ input ผิดก่อนเข้า operation
2. **Business logic**: ตรวจ invariant ที่ caller อื่นอาจข้าม entry
3. **Environment guard**: จำกัด operation เสี่ยงใน test ให้ใช้ sandbox
4. **Instrumentation**: เก็บหลักฐานที่ redact แล้วเพื่อวินิจฉัย ไม่ใช่ validation

```typescript
// Entry point
if (!directory.trim()) throw new Error('directory required');

// Business invariant
if (!session.ready) throw new Error('session not ready');

// Test sandbox: canonical paths, not a string-prefix check
const root = realpathSync(sandboxRoot);
const target = realpathSync(directory);
const rel = relative(root, target);
if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) {
  throw new Error('outside sandbox');
}

// Instrumentation
console.error('[DEBUG-guard]', { sessionReady: session.ready });
```

ตัวอย่างใช้ realpathSync จาก node:fs และ relative, sep, isAbsolute จาก node:path
target ต้องมีอยู่จริง; path ใหม่ให้ตรวจ canonical parent ก่อนสร้าง
guard นี้ไม่ป้องกัน filesystem race ถ้า actor อื่นเปลี่ยน symlink ระหว่างตรวจและใช้

## วิธีตรวจ

ตาม data flow ด้วย [root-cause-tracing.md](root-cause-tracing.md)
เลือก layer ตาม invariant และความเสี่ยง ไม่เพิ่ม guard ซ้ำโดยไร้เหตุผล
ทดสอบการ bypass entry, sibling path และ symlink ที่ออกนอก sandbox
เสร็จเมื่อทุก guard ที่เลือกมีหลักฐานว่าปฏิเสธ input ผิดและยอมรับ input ถูก
