# Data Model — kbqa-smoke

> This app uses **`app.kv`** (per-user key-value store) only.
> There is **no `app.db`** (no SQL tables, no migrations).

---

## KV Schema

`app.kv` is a per-user namespace: every key is automatically scoped to the
authenticated user's session. There is no cross-user leakage.

| Key | Type | Description |
|-----|------|-------------|
| `"count"` | `number` | The user's current counter value. Defaults to `0` if the key does not exist (i.e. `kv.get` returns `null`). |

### Access Patterns

| Operation | SDK Call | Notes |
|-----------|----------|-------|
| Read count on load | `app.kv.get<number>('count')` | Returns `null` for first-time users → treat as `0` |
| Increment count | `app.kv.set('count', current + 1)` | Optimistic UI: update local state first, persist after |

### Invariants

- The stored value is always a non-negative integer (`≥ 0`).
- Only the owner user can read or write their own key (enforced by the platform).
- No TTL or expiry is set on the key.

---

## Why Not `app.db`?

A single integer per user does not warrant a SQL table. `app.kv` is the correct
primitive: it is free-tier, per-user by default, and requires no schema migration.
Using `app.db` would add unnecessary complexity and move the app from free to Pro tier.
