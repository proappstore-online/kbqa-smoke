/**
 * e2e/fixtures.ts
 *
 * Central fixture harness for kbqa-smoke Playwright specs.
 *
 * Usage in a spec:
 *   import { test, expect, hasSession } from '../fixtures'
 *
 * The `app` fixture is a Page already navigated to the app root.
 * When PAS_SESSION_COOKIE is present in the environment the fixture
 * injects it before navigation so the app boots in a signed-in state.
 *
 * Gate signed-in tests with:
 *   test.skip(!hasSession, 'needs a session')
 */

import { test as base, expect, type Page } from '@playwright/test'

// ── environment ──────────────────────────────────────────────────────────────
const BASE_URL = process.env.APP_URL ?? 'http://localhost:5173'
const SESSION_COOKIE = process.env.PAS_SESSION_COOKIE ?? ''

/** True when a real auth session is available (CI injects PAS_SESSION_COOKIE). */
export const hasSession = SESSION_COOKIE.length > 0

// ── fixtures ─────────────────────────────────────────────────────────────────
type Fixtures = { app: Page }

export const test = base.extend<Fixtures>({
  app: async ({ browser }, use) => {
    const ctx = await browser.newContext()

    if (hasSession) {
      // Inject the platform session cookie so useProAuth resolves to a real user
      await ctx.addCookies([
        {
          name: 'pas_session',
          value: SESSION_COOKIE,
          domain: new URL(BASE_URL).hostname,
          path: '/',
          httpOnly: true,
          secure: BASE_URL.startsWith('https'),
          sameSite: 'Lax',
        },
      ])
    }

    const page = await ctx.newPage()
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    // Wait for #root to be populated (React mounted)
    await page.locator('#root').waitFor({ state: 'attached' })

    await use(page)
    await ctx.close()
  },
})

export { expect }
