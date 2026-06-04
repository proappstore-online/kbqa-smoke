import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for kbqa-smoke E2E tests.
 *
 * BASE_URL env var overrides the default localhost dev-server URL.
 * Set it in CI to point at the deployed Cloudflare Pages URL.
 *
 * COOKIE_STATE env var (optional) — path to a Playwright storage-state JSON
 * produced by `playwright auth` — gates sign-in-only tests via `hasSession`.
 */
export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env['BASE_URL'] ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    storageState: process.env['COOKIE_STATE'] || undefined,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
