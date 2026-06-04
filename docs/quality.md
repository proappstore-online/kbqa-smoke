# Quality Bar — kbqa-smoke

All items below are **required** before a build is considered shippable.

---

## TypeScript

- `tsc --noEmit` must pass with **zero errors**.
- `as any` is **banned** — use proper generics (e.g. `app.kv.get<number>('count')`).
- `@ts-ignore` and `@ts-expect-error` are **banned** unless accompanied by a code-reviewed justification comment.
- All SDK call sites must use the exact types documented in `docs/sdk-plan.md`:
  - `user.login` not `user.name`
  - `user.id` not `user.email`
  - `app.kv.get<number>(...)` — generic parameter required, otherwise `rows` / return is `unknown`

---

## Lint

- ESLint (or Biome) must report **zero errors**.
- No unused imports or variables.
- Consistent quote style and trailing commas (enforced by config, not by hand).

---

## Import hygiene

Verify these at review time — wrong paths are a common `tsc` failure:

| What | Correct import path |
|------|--------------------|
| `initPro` | `@proappstore/sdk` |
| `useProAuth` | `@proappstore/sdk/hooks` |
| `ProfileMenu`, `SignInButton` | `@proappstore/sdk/ui` |

Importing hooks or components from the root `@proappstore/sdk` will compile-fail.

---

## Accessibility (a11y)

- The counter value must be announced to screen readers (`aria-live="polite"` on the count element so increment is announced without focus change).
- The increment button must have an accessible name (`aria-label` or visible text).
- Keyboard navigation: button reachable by Tab, activated by Enter/Space.
- Colour contrast ratio ≥ 4.5:1 (WCAG AA) for both light and dark themes.
- No `role` or `aria-*` attributes used incorrectly.

---

## Mobile / responsive

- Layout must render correctly on viewports from 320 px wide.
- Touch target for the increment button ≥ 44 × 44 px.
- No horizontal scroll at any viewport width.
- Test on both iOS Safari and Chrome for Android (or emulators).

---

## Functional correctness

| Scenario | Expected behaviour |
|----------|--------------------|  
| First visit (signed in, no KV value) | Count shows `0` |
| Increment clicked | Count increments by exactly 1; value persisted to `app.kv` |
| Page reload after increment | Count restored to last persisted value |
| Signed-out user | Sign-in prompt shown; no counter rendered; no `app.kv` call attempted |
| Double-click on increment | Button disabled during kv write; count increments by 1 only |
| Network error on kv write | User sees an error state or toast; count does **not** advance in UI |

---

## Build

- `vite build` completes with no errors.
- Bundle size: no unnecessary heavy dependencies (this is a trivial app).
- No `console.error` or unhandled promise rejections in the browser console during normal use.

---

## Review checklist

- [ ] `tsc --noEmit` clean
- [ ] ESLint/Biome clean
- [ ] No `as any` / `@ts-ignore`
- [ ] Correct SDK import paths
- [ ] `aria-live="polite"` on count
- [ ] Button has accessible name
- [ ] Button disabled during in-flight kv write
- [ ] Signed-out state handled (no kv call before auth)
- [ ] Mobile layout verified at 320 px
- [ ] Both light and dark themes pass contrast check
