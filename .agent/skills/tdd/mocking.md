# Mocking

Mock at system boundaries only:

- external APIs
- databases when no practical test database exists
- time and randomness
- file system when needed

Do not mock:

- your own modules
- internal collaborators
- anything you control and can exercise through a public interface

## Designing For Mockability

Use dependency injection for external dependencies:

```typescript
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}
```

Avoid creating external clients inside behavior logic:

```typescript
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

Prefer specific SDK-style interfaces over one generic fetcher with conditional behavior.
