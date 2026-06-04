# Design — kbqa-smoke

## Layout

Single page, no routing. The entire visible UI is centred vertically and horizontally on the viewport.

```
┌─────────────────────────────────┐
│  [ProfileMenu]             top-right corner (absolute/fixed) │
│                                 │
│                                 │
│              42                 │  ← count, very large font
│                                 │
│         [ + Increment ]         │  ← single action button
│                                 │
└─────────────────────────────────┘
```

- The count and button sit in a vertical flex column, centred in the full-height viewport (`min-h-screen flex flex-col items-center justify-center`).
- `<ProfileMenu>` is positioned in the top-right corner and does not interfere with the centred content.

---

## Design system

### Typography

| Element | Tailwind class suggestion | Notes |
|---------|--------------------------|-------|
| Count number | `text-8xl font-bold tabular-nums` | Should be legible at a glance |
| Button label | `text-lg font-semibold` | Clear CTA |

### Colour

- Use **Tailwind semantic colours** (`text-foreground`, `bg-background`, or equivalent) — never hardcode hex values.
- Dark mode is handled by the platform's `ThemeToggle` / `ProfileMenu`. The app must not implement its own theme switcher.
- Button: use a primary accent colour (`bg-indigo-600 hover:bg-indigo-700` or Tailwind's primary scale) with sufficient contrast against both light and dark backgrounds.

### Spacing

- Gap between count and button: `gap-8` (2 rem).
- Button padding: `px-8 py-3`.
- Button border-radius: `rounded-xl`.

---

## States

| State | UI behaviour |
|-------|--------------|
| `loading` (auth resolving) | Show a neutral loading indicator instead of the counter |
| `signed-out` | Show `<SignInButton app={app} />` instead of the counter + button |
| `ready` (user signed in) | Show count + increment button |
| `incrementing` (kv write in-flight) | Disable button (prevent double-click); optimistic update is acceptable |

---

## Dark mode

- Tailwind's `dark:` variant is active via the platform's dark-mode class on `<html>`.
- The SDK's `<ProfileMenu showThemeToggle />` provides the theme toggle — the app does not need to add one separately unless desired.
- Always test both light and dark modes before shipping.

---

## Accessibility

- The count `<div>` / `<p>` must have an accessible label: `aria-label="Current count"` or be wrapped in a `<section aria-label="Counter">`.
- The increment button must have descriptive text or `aria-label="Increment counter"`.
- Focus ring must be visible (`focus-visible:ring-2 focus-visible:ring-indigo-500`).
- No reliance on colour alone to convey state.

---

## Mobile

- The layout is inherently responsive (flex-centred).
- Touch target for the button: minimum 44 × 44 px (`min-h-[44px] min-w-[44px]`).
- No horizontal overflow; count truncation is not a concern for realistic values.
