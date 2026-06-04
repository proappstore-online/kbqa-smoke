# SDK Plan — kbqa-smoke

All signatures verified against the live PAS SDK docs (`read_docs`).
Import paths matter — wrong paths cause `tsc` errors that break the deploy build.

> Reference: <https://proappstore.online/skills.md>

---

## 1. SDK instance (root import)

```ts
import { initPro } from '@proappstore/sdk'

const app = initPro({ appId: 'kbqa-smoke' })
```

- Import `initPro` from the **root** `'@proappstore/sdk'` — never from `/hooks` or `/ui`.
- Create **one** singleton `app` instance (e.g. in `src/lib/app.ts`), then import it everywhere.

---

## 2. Auth — `useProAuth` hook

### Import path

```ts
import { useProAuth } from '@proappstore/sdk/hooks'
```

### Signature

```ts
const { user, loading, signIn, signOut, deleteAccount } = useProAuth(app)
```

### Return shape

| Field | Type | Notes |
|-------|------|-------|
| `user` | `{ id: string; login: string; avatarUrl: string \| null; dateOfBirth: string \| null } \| null` | `null` when signed out |
| `loading` | `boolean` | `true` while auth state is being resolved |
| `signIn` | `() => void` | Zero-arg; calls GitHub OAuth |
| `signOut` | `() => void` | — |
| `deleteAccount` | `() => void` | — |

### ⚠️ Critical field rules

- Use `user.login` for the display name — **NOT** `user.name` (does not exist → `tsc` error).
- Use `user.id` (e.g. `"gh:123"`) as the stable key — **NOT** `user.email` (does not exist → `tsc` error).
- `user.name` and `user.email` **do not exist** on the User type.

---

## 3. Per-user KV — `app.kv`

### Signatures (verified)

```ts
await app.kv.set('count', value)          // value: any serialisable — use number here
await app.kv.get<number>('count')         // → number | null
await app.kv.delete('key')               // not used in this app
await app.kv.list({ prefix: 'prefix:' }) // → string[] (keys only) — not used
await app.kv.getMany(keys)               // → Map<string, T> — not used
```

### Usage in this app

```ts
// On component mount — load saved count
const stored = await app.kv.get<number>('count')
const count = stored ?? 0

// On button click — increment and persist
const next = count + 1
await app.kv.set('count', next)
setCount(next)  // update React state
```

### Behaviour

- `app.kv` is **per-user** — no manual namespacing needed.
- Returns `null` for a key that has never been set; default to `0`.
- Calls on an unauthenticated session will fail; gate on `user !== null` before calling.

---

## 4. UI components

### Import path

```ts
import { ProfileMenu } from '@proappstore/sdk/ui'
```

### `<ProfileMenu>` — exact props

```tsx
<ProfileMenu app={app} showThemeToggle showBilling />
```

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `app` | `ProApp` | ✅ | The `app` singleton |
| `showThemeToggle` | `boolean` | optional | Adds theme toggle to menu |
| `showBilling` | `boolean` | optional | Adds billing link (not needed here — no subscription) |

Do **not** pass undocumented props — compile error.

### `<SignInButton>` — exact props

```tsx
<SignInButton app={app} label="Sign in" />
```

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `app` | `ProApp` | ✅ | — |
| `label` | `string` | optional | Button text |

⚠️ `<SignInButton>` has **no `provider` prop** and always calls GitHub OAuth. Do **not** pass `provider` or `onClick` — compile error.

---

## 5. Primitives NOT used by this app

| Primitive | Reason not used |
|-----------|-----------------|
| `app.db` | No SQL data model; KV is sufficient |
| `app.counters` | Those are shared/cross-user; counter here is per-user |
| `app.rooms` | No real-time collaboration |
| `app.storage` | No file uploads |
| `app.ai` | No AI features |
| `app.subscription` | No paywall |
| `app.sms` / `app.email` | No messaging |
| `app.notifications` | No push notifications |
| `app.roles` | No role gating |
| `app.proxy` | No external API calls |
| `app.maps` | Not applicable |
| `app.webhooks` | Not applicable |

---

## 6. React hook import summary

```ts
// ✅ Correct
import { initPro }   from '@proappstore/sdk'         // app singleton only
import { useProAuth } from '@proappstore/sdk/hooks'   // hooks
import { ProfileMenu, SignInButton } from '@proappstore/sdk/ui'  // components

// ❌ Wrong — these fail tsc
import { useProAuth } from '@proappstore/sdk'         // no hooks from root
import { ProfileMenu } from '@proappstore/sdk'         // no components from root
```
