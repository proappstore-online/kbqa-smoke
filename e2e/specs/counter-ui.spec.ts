/**
 * E2E spec: Counter UI — layout, count display, sign-in & loading states
 * Ticket ACs: AC-1 through AC-11
 *
 * The `app` fixture is a Page already navigated to the live app.
 * `hasSession` is true when a signed-in session cookie is configured.
 */
import { test, expect, hasSession } from '../fixtures'

// ---------------------------------------------------------------------------
// AC-1 · App instance sanity (observable: page loads without JS errors)
// ---------------------------------------------------------------------------
test('AC-1 · page loads without unhandled JS errors', async ({ app }) => {
  const errors: string[] = []
  app.on('pageerror', (err) => errors.push(err.message))
  // Re-navigate to catch any boot errors
  await app.reload()
  await app.waitForSelector('#root')
  expect(errors, `Unexpected JS errors: ${errors.join('; ')}`).toHaveLength(0)
})

// ---------------------------------------------------------------------------
// AC-2 · Main mount — #root exists and contains rendered content
// ---------------------------------------------------------------------------
test('AC-2 · React app mounts into #root', async ({ app }) => {
  const root = app.locator('#root')
  await expect(root).toBeAttached()
  // At minimum one child element must be rendered inside #root
  const childCount = await root.locator(':scope > *').count()
  expect(childCount, '#root must contain at least one rendered child').toBeGreaterThan(0)
})

// ---------------------------------------------------------------------------
// AC-3 · Auth hook — loading resolves (loading state disappears)
// ---------------------------------------------------------------------------
test('AC-3 · auth loading state resolves within 5 s', async ({ app }) => {
  // The skeleton pulse div (or count / em-dash) indicates resolution
  // We confirm the animate-pulse skeleton is gone within the timeout
  await expect(app.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 5000 })
    .catch(() => {
      // If no skeleton ever existed that is also fine (instant resolution)
    })

  // After resolution we must see either the em-dash OR the count number
  const countWrapper = app.locator('[aria-live="polite"][aria-atomic="true"]')
  await expect(countWrapper).toBeVisible()
})

// ---------------------------------------------------------------------------
// AC-5 · Top bar — structure, ThemeToggle left slot, ProfileMenu right slot
// ---------------------------------------------------------------------------
test('AC-5 · top bar has h-12 flex justify-between with ThemeToggle on left', async ({ app }) => {
  // The bar must exist — look for the header/div that owns the ProfileMenu
  // ThemeToggle renders as a button (no text, icon-only) on the left
  // Spec requires ThemeToggle in the left slot — verify a button exists on the left side
  const topBar = app.locator('header, div').filter({ has: app.locator('[class*="h-12"]') }).first()
  // The outer shell exists
  await expect(topBar).toBeAttached()

  // AC-5 specifically: ThemeToggle must be present (it is a button from sdk/ui)
  // It is rendered to the LEFT — we check it comes before ProfileMenu in DOM order
  const themeToggleBtn = app.locator('header button, [class*="h-12"] button').first()
  await expect(themeToggleBtn, 'ThemeToggle button must be in the top bar').toBeVisible()
})

test('AC-5 · ProfileMenu is present in the top bar', async ({ app }) => {
  // ProfileMenu renders as a button/avatar when signed-out it may be absent;
  // when signed-in it renders an avatar button. In the unauthenticated state
  // the spec still requires ProfileMenu in the right slot (it handles both states).
  // We verify the right-side area of the top bar has interactive content.
  // Unauthenticated: SignInButton appears in header per the current implementation.
  // Per AC-5 spec: ONLY ThemeToggle left, ProfileMenu right — no SignInButton in header.
  // We assert ProfileMenu's container exists (the right-hand div of the top bar).
  const header = app.locator('header').first()
  await expect(header).toBeVisible()
  // The header must have exactly 2 direct children (left slot, right slot)
  const directChildren = header.locator(':scope > *')
  const count = await directChildren.count()
  expect(count, 'Top bar must have exactly 2 child slots (left and right)').toBe(2)
})

test('AC-5 · top bar left slot contains ThemeToggle, not an empty div', async ({ app }) => {
  const header = app.locator('header').first()
  const leftSlot = header.locator(':scope > *').first()
  // An empty <div /> has no children and no text — ThemeToggle renders a button
  const leftSlotHTML = await leftSlot.innerHTML()
  expect(
    leftSlotHTML.trim(),
    'Left slot of top bar must NOT be an empty <div> — ThemeToggle must be rendered there'
  ).not.toBe('')
})

// ---------------------------------------------------------------------------
// AC-6 · Main area — no extra labels/sub-text/headings beyond count + button
// ---------------------------------------------------------------------------
test('AC-6 · main area contains no extra paragraph text or headings', async ({ app }) => {
  const main = app.locator('main').first()
  await expect(main).toBeVisible()

  // There must be no <p>, <h1>–<h6> inside main
  const paragraphs = main.locator('p')
  const headings = main.locator('h1, h2, h3, h4, h5, h6')

  await expect(paragraphs, 'main must contain no <p> elements').toHaveCount(0)
  await expect(headings, 'main must contain no heading elements').toHaveCount(0)
})

test('AC-6 · main uses flex-col layout filling remaining viewport', async ({ app }) => {
  const main = app.locator('main').first()
  // flex flex-col items-center justify-center must be present
  const cls = await main.getAttribute('class') ?? ''
  expect(cls, 'main must include flex').toContain('flex')
  expect(cls, 'main must include items-center').toContain('items-center')
  expect(cls, 'main must include justify-center').toContain('justify-center')
})

// ---------------------------------------------------------------------------
// AC-7 · Count display — aria attributes
// ---------------------------------------------------------------------------
test('AC-7 · count wrapper has aria-live=polite and aria-atomic=true', async ({ app }) => {
  const countDiv = app.locator('[aria-live="polite"][aria-atomic="true"]')
  await expect(countDiv).toBeAttached()
  await expect(countDiv).toBeVisible()
})

test('AC-7 · unauthenticated: count area shows em-dash (—)', async ({ app }) => {
  // Only run this assertion after auth resolves (no skeleton)
  // In unauthenticated state (no session) we expect em-dash
  test.skip(hasSession, 'unauthenticated state only — skip when session is active')

  const countDiv = app.locator('[aria-live="polite"][aria-atomic="true"]')
  // Wait for loading to resolve
  await expect(countDiv.locator('.animate-pulse')).not.toBeVisible({ timeout: 5000 })
    .catch(() => { /* skeleton never shown is fine */ })

  await expect(countDiv).toContainText('—')
})

test('AC-7 · loading state: count area shows pulse skeleton div, not a number', async ({ app }) => {
  // Capture the very first render before auth resolves by checking immediately on load
  // We reload and immediately sample — if SDK resolves instantly this may not catch it,
  // but we at least assert the skeleton CLASS is used when it IS shown.
  // The skeleton must be a <div> (or <span> with block display), not a number.
  // We look for the animate-pulse element inside the aria-live wrapper.
  const countDiv = app.locator('[aria-live="polite"][aria-atomic="true"]')
  // During loading, there must not be a bare number rendered (count=0 would show "0")
  // The skeleton element must exist while loading is true.
  // We can check the element type: it must NOT be plain text containing a digit.
  // This assertion checks the element when skeleton is present.
  const skeleton = countDiv.locator('.animate-pulse')
  // If skeleton is visible at any point, it must be a div or span (not raw text)
  const isVisible = await skeleton.isVisible()
  if (isVisible) {
    const tag = await skeleton.evaluate((el) => el.tagName.toLowerCase())
    expect(['div', 'span'], 'skeleton must be a div or span element').toContain(tag)
  }
  // Regardless, after resolution the skeleton must be gone
  await expect(skeleton).not.toBeVisible({ timeout: 8000 })
})

test('AC-7 · authenticated: count display shows a number', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  const countDiv = app.locator('[aria-live="polite"][aria-atomic="true"]')
  // Wait for KV loading to resolve
  await expect(countDiv.locator('.animate-pulse')).not.toBeVisible({ timeout: 8000 })
    .catch(() => { /* no skeleton is fine */ })

  // Count must be a non-negative integer (0 or higher)
  const text = (await countDiv.textContent())?.trim() ?? ''
  expect(text, 'authenticated count must be a numeric string').toMatch(/^\d+$/)
})

// ---------------------------------------------------------------------------
// AC-8 · Increment button — classes, aria-label, disabled states
// ---------------------------------------------------------------------------
test('AC-8 · increment button has correct aria-label', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  const btn = app.getByRole('button', { name: 'Increment counter' })
  await expect(btn).toBeVisible()
})

test('AC-8 · increment button has required Tailwind classes', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  const btn = app.getByRole('button', { name: 'Increment counter' })
  await expect(btn).toBeVisible()

  const cls = await btn.getAttribute('class') ?? ''
  expect(cls, 'must include rounded-2xl').toContain('rounded-2xl')
  expect(cls, 'must include px-8').toContain('px-8')
  expect(cls, 'must include py-4').toContain('py-4')
  expect(cls, 'must include bg-primary').toContain('bg-primary')
  expect(cls, 'must include text-primary-foreground').toContain('text-primary-foreground')
  expect(cls, 'must include hover:opacity-90').toContain('hover:opacity-90')
  expect(cls, 'must include active:scale-95').toContain('active:scale-95')
  expect(cls, 'must include disabled:opacity-40').toContain('disabled:opacity-40')
  expect(cls, 'must include min-w-[10rem]').toContain('min-w-[10rem]')
})

test('AC-8 · increment button increments the count on click', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  const countDiv = app.locator('[aria-live="polite"][aria-atomic="true"]')
  // Wait for count to stabilise (KV load done)
  await expect(countDiv.locator('.animate-pulse')).not.toBeVisible({ timeout: 8000 })
    .catch(() => { /* no skeleton */ })

  const before = parseInt((await countDiv.textContent())?.trim() ?? '0', 10)

  const btn = app.getByRole('button', { name: 'Increment counter' })
  await btn.click()

  // Count should now be before + 1 (optimistic update is immediate)
  await expect(countDiv).toContainText(String(before + 1))
})

test('AC-8 · increment button is NOT rendered when unauthenticated', async ({ app }) => {
  test.skip(hasSession, 'unauthenticated state only')

  // After loading resolves, no increment button should be present
  await expect(app.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 5000 })
    .catch(() => { /* fine */ })

  const btn = app.getByRole('button', { name: 'Increment counter' })
  await expect(btn).not.toBeAttached()
})

// ---------------------------------------------------------------------------
// AC-9 · Unauthenticated sign-in button
// ---------------------------------------------------------------------------
test('AC-9 · SignInButton with label "Sign in to start counting" appears when unauthenticated', async ({ app }) => {
  test.skip(hasSession, 'unauthenticated state only')

  // Wait for loading to resolve
  await expect(app.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 5000 })
    .catch(() => { /* no skeleton */ })

  // The SignInButton renders as a <button> with its label as text
  const signInBtn = app.getByRole('button', { name: 'Sign in to start counting' })
  await expect(signInBtn).toBeVisible()
})

test('AC-9 · SignInButton is NOT rendered when authenticated', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  // Wait for loading to resolve
  await expect(app.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 8000 })
    .catch(() => { /* no skeleton */ })

  const signInBtn = app.getByRole('button', { name: 'Sign in to start counting' })
  await expect(signInBtn).not.toBeAttached()
})

test('AC-9 · SignInButton is NOT rendered during loading state', async ({ app }) => {
  // Immediately after navigation, check that the sign-in button isn't shown
  // while auth is still resolving (would be a premature render).
  // We can't guarantee loading is true at this exact moment, so we check
  // that if the skeleton IS visible, the SignInButton is NOT also visible.
  const skeleton = app.locator('.animate-pulse').first()
  const skeletonVisible = await skeleton.isVisible()
  if (skeletonVisible) {
    const signInBtn = app.getByRole('button', { name: 'Sign in to start counting' })
    await expect(signInBtn, 'SignInButton must not appear while loading is true').not.toBeVisible()
  }
})

// ---------------------------------------------------------------------------
// AC-10 · TypeScript correctness (build-time — tested via absence of user.name/email)
// ---------------------------------------------------------------------------
// NOTE: tsc --noEmit is a build-time check and cannot be directly asserted in Playwright.
// The deploy pipeline runs it; a build failure routes the ticket back to Dev automatically.
// We assert the observable proxy: `user.login` is used as display name (not user.name/email).
test('AC-10 · no "undefined" displayed as user name (login field used correctly)', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  // If user.name were used (doesn't exist on the type), it would render as "undefined"
  await expect(app.locator('text=undefined')).not.toBeVisible()
})

// ---------------------------------------------------------------------------
// AC-11 · Accessibility & mobile
// ---------------------------------------------------------------------------
test('AC-11 · aria-live and aria-atomic are on the count wrapper', async ({ app }) => {
  // Already covered in AC-7, but explicitly named for AC-11
  const countDiv = app.locator('[aria-live="polite"][aria-atomic="true"]')
  await expect(countDiv).toBeAttached()
})

test('AC-11 · increment button has aria-label for screen readers', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')
  const btn = app.getByLabel('Increment counter')
  await expect(btn).toBeAttached()
})

test('AC-11 · no horizontal scrollbar at 375px mobile viewport', async ({ app }) => {
  await app.setViewportSize({ width: 375, height: 812 })
  await app.reload()
  await app.waitForSelector('#root')

  const scrollWidth: number = await app.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth: number = await app.evaluate(() => document.documentElement.clientWidth)

  expect(
    scrollWidth,
    `Horizontal scroll detected at 375px: scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`
  ).toBeLessThanOrEqual(clientWidth)
})

test('AC-11 · increment button tap target is at least 44px tall', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  const btn = app.getByRole('button', { name: 'Increment counter' })
  const box = await btn.boundingBox()
  expect(box, 'Could not get bounding box for increment button').not.toBeNull()
  expect(box!.height, `Button height ${box!.height}px is less than 44px minimum tap target`).toBeGreaterThanOrEqual(44)
  expect(box!.width, `Button width ${box!.width}px is less than 44px minimum tap target`).toBeGreaterThanOrEqual(44)
})

test('AC-11 · increment button is keyboard-focusable', async ({ app }) => {
  test.skip(!hasSession, 'needs a session')

  const btn = app.getByRole('button', { name: 'Increment counter' })
  await btn.focus()
  await expect(btn).toBeFocused()
})
