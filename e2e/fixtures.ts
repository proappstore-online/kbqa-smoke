/**
 * Shared Playwright fixtures for kbqa-smoke E2E tests.
 *
 * Usage in specs:
 *   import { test, expect, hasSession } from '../fixtures'
 *
 * The `app` fixture is a Page already navigated to the live base URL.
 * When a session cookie is present (COOKIE_STATE env var points to a
 * Playwright storage-state JSON file), the page is also signed in.
 *
 * Gate sign-in-only assertions with:
 *   test.skip(!hasSession, 'needs a session')
 */

import { test as base, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Session detection
// ---------------------------------------------------------------------------

/**
 * True when a saved auth session (COOKIE_STATE env var) is available.
 * CI sets this when secrets are present; local dev may set it manually.
 */
export const hasSession: boolean = Boolean(process.env['COOKIE_STATE']);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

type Fixtures = {
  /** A Page pre-navigated to the app root, optionally pre-authenticated. */
  app: Page;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    const baseURL =
      process.env['BASE_URL'] ?? 'http://localhost:5173';
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await use(page);
  },
});

export { expect };
