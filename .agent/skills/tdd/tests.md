# Good And Bad Tests

## Good Tests

Good tests verify observable behavior through real interfaces.

Characteristics:

- tests behavior users or callers care about
- uses public API only
- survives internal refactors
- describes what, not how
- has one logical assertion

## Bad Tests

Red flags:

- mocking internal collaborators
- testing private methods
- asserting call counts or internal order
- breaking when behavior is unchanged
- verifying through external means instead of the interface

Prefer:

```typescript
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

Avoid:

```typescript
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});
```
