# Data Model — kbqa-smoke

## Storage primitive: `app.kv`

This app has **no SQL database** (`app.db` is not used). All persistence is via the free-tier per-user key/value store.

### KV key schema

| Key | Value type | Description | Scope |
|-----|-----------|-------------|-------|
| `"count"` | `number` | The user's current counter value | Per-user (kv is scoped to the authenticated user automatically) |

### Access pattern

```ts
// Read on mount
const stored = await app.kv.get<number>('count')   // → number | null
const count = stored ?? 0                           // default to 0 if never set

// Write on increment
await app.kv.set('count', count + 1)
```

### Important: `app.kv` is per-user

`app.kv` is scoped to the **currently authenticated user** by the platform. No user-id prefix is needed. Two different users each get their own `"count"` value.

If the user is not signed in, `app.kv.get` / `app.kv.set` will fail or return null — the UI should display the platform sign-in prompt instead of the counter in that case.

### No migrations needed

Because this app uses only `app.kv` (not `app.db`), there are **no SQL migrations**. The `"count"` key is written on first increment and read on every load — no schema setup required.

---

## Out of scope

- No `app.db` tables
- No `app.counters` (those are shared / cross-user; not applicable here)
- No `app.storage` objects
