# SDK Plan — kbqa-smoke

> All signatures verified against the live PAS SDK docs:
> https://proappstore.online/skills.md
> Do NOT deviate from the signatures below — wrong signatures fail `tsc` and break the deploy.

---

## App Initialisation

```ts
// src/app.ts
import { initPro } from '@proappstore/sdk'

export const app = initPro({ appId: 'kbqa-smoke' })
```

- Import path: `@proappstore/sdk` (root, no sub-path).
- Single instance; re-export and import into all modules.

---

## Authentication

### Hook — `useProAuth`

```ts
import { useProAuth } from '@proappstore/sdk/hooks'

const { user, loading, signIn, signOut } = useProAuth(app)
```

| Return field | Type | Notes |
|---|---|---|
| `user` | `{ id: string; login: string; avatarUrl: string \| null; dateOfBirth: string \| null } \| null` | `null` when signed out or loading |
| `loading` | `boolean` | `true` during initial auth resolution |
| `signIn` | `() => void` | Zero-arg; always GitHub |
| `signOut` | `() => void` | |
| `deleteAccount` | `() => void` | Available but not used in this app |

> ⚠️ **Critical:** The user object has NO `name` and NO `email` fields.
> Always use `user.login` for display and `user.id` (e.g. `"gh:123"`) as the stable key.
> Writing `user.name` or `user.email` **fails `tsc`**.

### Auth Providers

- Default `signIn()` → GitHub OAuth.
- `app.auth.signIn('google')` → Google OAuth (one-line change if needed later).
- There is **NO** `'apple'` provider — `signIn('apple')` fails `tsc`.

### `<SignInButton>` props (verified)

```tsx
import { SignInButton } from '@proappstore/sdk/ui'

// ONLY valid props: app, label (optional)
<SignInButton app={app} label="Sign in to count" />
```

> ⚠️ `<SignInButton>` has **no `provider` prop** and **no `onClick` prop**.
> Passing either fails `tsc`. For Google, render your own `<button>`.

---

## KV Storage

```ts
// Read on mount
const stored = await app.kv.get<number>('count')  // → number | null
const count = stored ?? 0

// Write on increment
await app.kv.set('count', count + 1)
```

| Method | Signature | Returns |
|--------|-----------|--------|
| `kv.get<T>` | `(key: string) → Promise<T \| null>` | The stored value, or `null` if not yet set |
| `kv.set` | `(key: string, value: unknown) → Promise<void>` | Nothing |

- Keys are **per-user** (platform-scoped automatically). No manual namespacing needed.
- Calling `kv.get` or `kv.set` without an authenticated user will error; always guard behind `user !== null`.

---

## UI Components Used

All from `@proappstore/sdk/ui` unless stated.

### `<ProfileMenu>`

```tsx
import { ProfileMenu } from '@proappstore/sdk/ui'

<ProfileMenu app={app} showThemeToggle showBilling={false} />
```

Valid props: `app`, `showThemeToggle?`, `showBilling?`, `children?`.

### `<ThemeToggle>`

```tsx
import { ThemeToggle } from '@proappstore/sdk/ui'

<ThemeToggle />  // no props
```

---

## Theme

```ts
import { useTheme } from '@proappstore/sdk/hooks'

const { theme, preference, setPreference } = useTheme()
// theme: 'light' | 'dark'  (resolved)
// preference: 'light' | 'dark' | 'system'
```

- Stores preference in `localStorage('stores-theme')`.
- Applies `data-theme` attribute on `<html>`.
- Tailwind `dark:` variants respond to this attribute.

---

## Primitives NOT Used (out of scope)

| Primitive | Reason excluded |
|-----------|-----------------|
| `app.db` | No SQL tables needed; `app.kv` is sufficient |
| `app.storage` | No files |
| `app.ai` | No AI features |
| `app.rooms` | No real-time / multiplayer |
| `app.sms` / `app.email` | No messaging |
| `app.maps` | No location features |
| `app.roles` | No permission differences between users |
| `app.subscription` | No Pro gating |
| `app.counters` | Per-user persistence is required; `app.counters` is cross-user/shared — wrong primitive |

> **Note on `app.counters` vs `app.kv`:** `app.counters.increment` is a *shared,
> cross-user* atomic counter (all users share the same value). This app needs
> *per-user* counts, so `app.kv` is the correct primitive.
