# KNOWLEDGE.md — kbqa-smoke

> **Ground truth for every team member.** BA, Dev, and QA treat this file (and `docs/`) as the canonical reference. Do not build what isn't here; do not contradict what is.

---

## 1. What the app is

**kbqa-smoke** is a minimal single-page counter app.

- The user sees one large, centred number.
- One button increments that number.
- The count is **persisted per-user** via `app.kv` — so each logged-in user has their own counter, and the value survives page reloads.
- Auth is provided automatically by the PAS platform (GitHub OAuth by default). The app does **not** add its own auth wall — users who aren't signed in simply see a sign-in prompt from the platform shell.

---

## 2. Who it's for

| User type | Description |
|-----------|-------------|
| Any platform user | Anyone with a PAS account (GitHub OAuth). No special role needed. |

This is a **demo / smoke-test** app. Its primary value is verifying that the PAS SDK's `app.kv` round-trip works end-to-end in a live deployment.

---

## 3. Core features

| # | Feature | Notes |
|---|---------|-------|
| 1 | Display the current count | Large, centred number; loads from `app.kv` on mount |
| 2 | Increment button | Reads current value, adds 1, writes back via `app.kv.set` |
| 3 | Persistence | Count survives page reload via `app.kv` (per-user) |
| 4 | Platform auth | Handled by `useProAuth` / `ProfileMenu`; not custom-built |

---

## 4. Explicit non-goals

- ❌ No decrement, reset, or step-size controls
- ❌ No shared / global counter (not using `app.counters`)
- ❌ No history or time-series log
- ❌ No custom auth UI or role gating
- ❌ No `app.db` — this app uses only `app.kv` (free tier primitive)
- ❌ No server AI, storage, SMS, email, or webhooks
- ❌ No subscription / paywall
- ❌ No MCP tool surface (no `app.db` data model)
- ❌ No multi-page routing

---

## 5. Technology stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Platform SDK | `@proappstore/sdk` (single instance) |
| Persistence | `app.kv` (free primitive, per-user) |
| Deploy target | Cloudflare (via PAS platform) |
| License | MIT (free-tier app) |

---

## 6. Reference docs

- PAS platform/SDK guide: <https://proappstore.online/skills.md>
- PAS docs site: <https://proappstore.online/docs>
- API base: <https://api.proappstore.online>

---

## 7. Linked sub-documents

| File | Contents |
|------|----------|
| [`docs/data-model.md`](docs/data-model.md) | KV key schema (no SQL tables) |
| [`docs/sdk-plan.md`](docs/sdk-plan.md) | Exact SDK primitives + verified signatures |
| [`docs/mcp-tools.md`](docs/mcp-tools.md) | MCP tool surface (N/A — no `app.db`) |
| [`docs/design.md`](docs/design.md) | Layout, design system, dark mode |
| [`docs/quality.md`](docs/quality.md) | TypeScript, lint, a11y, mobile quality bar |
