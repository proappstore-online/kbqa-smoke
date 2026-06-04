# Design — kbqa-smoke

## Layout

Single screen. No routing, no sidebar, no nav bar.

```
┌─────────────────────────────────────┐
│  [ThemeToggle]         [ProfileMenu] │  ← thin top bar, h-12
│                                     │
│                                     │
│              1 2 3 4 5              │  ← count, ~8xl/9xl, bold, centred
│                                     │
│           [ + Increment ]           │  ← single large button, centred
│                                     │
└─────────────────────────────────────┘
```

- Top bar is minimal: `ThemeToggle` on the left, `ProfileMenu` on the right.
- The rest of the viewport is a single flex column centred both axes.
- **No other UI elements.** No labels, no sub-text, no history, no decorations.

---

## Unauthenticated State

When `user === null` and `loading === false`:

- The count area shows `—` (em-dash) or is hidden.
- The increment button is replaced by (or below) a `<SignInButton app={app} />`.
- Copy: `"Sign in to start counting"`.

---

## Loading State

While `loading === true` (auth resolution) or while fetching the KV value:

- Show a subtle pulse/skeleton in place of the count number.
- Button is disabled and shows no spinner (keep it simple).

---

## Tailwind Conventions

| Token | Usage |
|-------|-------|
| `text-8xl font-bold tabular-nums` | Count display |
| `text-foreground` | Primary text colour |
| `bg-background` | Page background |
| `rounded-2xl px-8 py-4 text-lg font-semibold` | Increment button |
| `bg-primary text-primary-foreground` | Increment button colour |
| `hover:opacity-90 active:scale-95 transition` | Button interaction |
| `disabled:opacity-40 disabled:cursor-not-allowed` | Disabled state |

---

## Dark Mode

- The platform SDK manages dark mode via `data-theme` on `<html>`.
- Use Tailwind `dark:` variants for any custom overrides.
- `<ThemeToggle />` (from `@proappstore/sdk/ui`) provides the toggle; no custom toggle needed.
- System preference is respected on first visit.

---

## Accessibility

- The counter `<div>` must carry `aria-live="polite"` and `aria-atomic="true"` so screen readers announce each new value.
- The increment button must have a descriptive `aria-label` (e.g. `"Increment counter"`) in case icon-only rendering is ever added.
- All interactive elements must be reachable by keyboard and have a visible `:focus-visible` ring.
- Minimum tap target: 44 × 44 px.

---

## Mobile

- The layout is a single centred column — it naturally adapts.
- Count font size may scale down on small viewports: `text-6xl sm:text-8xl`.
- Button should span at least `w-40` to remain comfortably tappable.
- No horizontal scroll at any viewport width.
