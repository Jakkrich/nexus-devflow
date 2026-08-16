# Deepening

Use this reference when a cluster of shallow modules may need to become one deeper module.

## Dependency Categories

| Category | Meaning | Testing strategy |
| :--- | :--- | :--- |
| In-process | Pure computation or in-memory state | Test through the new interface directly. |
| Local-substitutable | Dependency has a local test stand-in | Test the deep module with the local stand-in. |
| Remote but owned | Internal service across a network boundary | Define a port at the seam; use production and in-memory adapters. |
| True external | Third-party service you do not control | Inject a port and use a mock adapter at the system boundary. |

## Seam Discipline

- One adapter means a hypothetical seam; two adapters means a real one.
- A deep module may have internal seams, but callers should not need to know them.
- Do not add ports only to make tests easier when the real design does not vary there.

## Testing Strategy

- Replace tests of shallow internals with tests at the deepened module's interface.
- Assert observable behavior through the interface.
- Keep tests resilient to internal refactors.
