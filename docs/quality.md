# Quality Bar — kbqa-smoke

Every PR and every generated code change **must** satisfy all of the following.

---

## TypeScript

- `tsc --noEmit` exits **0** — no type errors.
- TypeScript `strict` mode is **on** (noImplicitAny, strictNullChecks, etc.).
- **Zero `as any`** — forbidden. Use proper generics or type guards.
- **Zero `@ts-ignore` / `@ts-expect-error`** — forbidden unless paired with a
  comment explaining why it cannot be resolved and approved by the team.
- All `app.kv.get<T>` calls must pass the generic type parameter — e.g.
  `app.kv.get<number>('count')` — so the return type is `number | null`, not `unknown | null`.
- The `user` object is typed exactly as
  `{ id: string; login: string; avatarUrl: string | null; dateOfBirth: string | null }`.
  Never access `user.name` or `user.email` — they do not exist and break the build.

---

## SDK Import Rules

| What | Correct import path | Wrong path (fails `tsc`) |
|------|--------------------|--------------------------|
| `initPro` | `@proappstore/sdk` | anything else |
| Hooks (`useProAuth`, `useTheme`, …) | `@proappstore/sdk/hooks` | `@proappstore/sdk` |
| UI components (`SignInButton`, `ProfileMenu`, …) | `@proappstore/sdk/ui` | `@proappstore/sdk` |
| `ProShell` | `@proappstore/sdk/shell` | `@proappstore/sdk/ui` |

---

## Linting

- ESLint passes with **zero errors**.
- `react-hooks/exhaustive-deps` rule is on — all hook dependencies must be declared.
- No unused imports or variables.

---

## Accessibility (a11y)

- Counter element has `aria-live="polite"` + `aria-atomic="true"`.
- Increment button has a meaningful `aria-label`.
- All interactive elements are focusable and show a `:focus-visible` ring.
- No colour is used as the sole means of conveying information.
- Minimum tap target 44 × 44 px on mobile.

---

## Performance

- KV read (`app.kv.get`) is called once on mount (after user resolves), not on every render.
- KV write (`app.kv.set`) is called once per click; no debouncing needed (single fast write).
- No unnecessary re-renders: the increment handler is stable (`useCallback` or defined outside render).

---

## Error Handling

- If `app.kv.get` rejects, catch the error and show a non-blocking inline error message (do not crash the page).
- If `app.kv.set` rejects, roll back the optimistic state update and surface a brief error.
- Never swallow errors silently.

---

## Testing Checklist (manual QA gates)

| Scenario | Expected |
|----------|----------|
| First visit, signed out | Sign-in prompt visible; count area hidden or shows `—` |
| Sign in | Count loads from KV (or shows `0` for new user) |
| Click increment | Count increments immediately (optimistic); button re-enabled after persist |
| Refresh page | Count matches last persisted value |
| Sign out | Count area resets; sign-in prompt reappears |
| Dark mode toggle | UI switches without flash or layout shift |
| Viewport 375 px wide | No horizontal scroll; count and button readable and tappable |
| KV write failure | Optimistic update rolls back; error message shown |
