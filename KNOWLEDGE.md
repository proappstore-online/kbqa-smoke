# KNOWLEDGE.md — kbqa-smoke · Single-Page Counter

> **Ground truth for BA, Dev, QA.** Do not build anything that contradicts this file.
> Last updated by Architect. Source-of-truth references: [PAS SDK docs](https://proappstore.online/skills.md) · [Docs site](https://proappstore.online/docs)

---

## 1 · What It Is

A single-page, single-purpose counter app. One button increments a number that is
persisted **per logged-in user** via `app.kv`. The count is displayed large and
centred on screen. The whole app is one screen; there is no routing, no nav, no
settings page.

---

## 2 · Users & Personas

| Persona | Description |
|---------|-------------|
| **Authenticated user** | Anyone who has signed in with GitHub (or Google). Their count is private to them. |
| **Anonymous visitor** | Sees the UI but the button is disabled (or prompts sign-in). No count is stored. |

There is **no admin persona**, no moderation, no owner-only screens.

---

## 3 · Core Features (in-scope)

1. **Display count** — show the current count as a large number, centred on page.
2. **Increment** — one prominent button adds 1 to the count and persists it immediately.
3. **Per-user persistence** — count is stored in `app.kv` keyed to the authenticated user; refreshing the page restores the last value.
4. **Sign-in / Sign-out** — platform-default auth via `useProAuth`; unauthenticated users see a sign-in prompt.
5. **Dark mode** — respects system preference via the platform's `useTheme` / `ThemeToggle`.

---

## 4 · Explicit Non-Goals

- No decrement, reset, or edit of the count.
- No shared / global counter visible to other users.
- No leaderboard or history.
- No routing / multiple pages.
- No subscription, payments, or Pro gating.
- No `app.db`, `app.storage`, `app.ai`, `app.sms`, `app.rooms`, `app.maps`.
- No custom RBAC / roles (no permission differences between users).
- No MCP tool surface (no `app.db` tables → `docs/mcp-tools.md` explains the skip).

---

## 5 · Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS |
| Platform SDK | `@proappstore/sdk` (single instance, `appId: 'kbqa-smoke'`) |
| Deployment | Cloudflare (via PAS platform) |
| License | MIT |

---

## 6 · SDK Primitives Used

See **`docs/sdk-plan.md`** for exact signatures.

| Primitive | Purpose |
|-----------|---------|
| `app.auth` / `useProAuth` | Sign in, sign out, get current user |
| `app.kv.get` / `app.kv.set` | Persist the count per user |
| `useTheme` / `ThemeToggle` | Dark/light mode |
| `ProfileMenu` | Avatar + sign-out menu in the corner |

---

## 7 · File Map (expected)

```
src/
  main.tsx          # mounts <App />, initPro
  App.tsx           # entire app — auth gate + counter UI
  app.ts            # export const app = initPro({ appId: 'kbqa-smoke' })
KNOWLEDGE.md
docs/
  data-model.md
  sdk-plan.md
  mcp-tools.md
  design.md
  quality.md
```

---

## 8 · Linked Docs

- [`docs/data-model.md`](docs/data-model.md) — KV key schema
- [`docs/sdk-plan.md`](docs/sdk-plan.md) — exact SDK signatures
- [`docs/mcp-tools.md`](docs/mcp-tools.md) — MCP surface (skipped, rationale inside)
- [`docs/design.md`](docs/design.md) — UX / layout / design system
- [`docs/quality.md`](docs/quality.md) — quality bar
