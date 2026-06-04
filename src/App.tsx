import { useState, useEffect } from 'react'
import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { ProfileMenu, SignInButton } from '@proappstore/sdk/ui'
import { app } from './app'
import { useCounter } from './useCounter'

/**
 * Drives the data-theme attribute on <html> based on stored preference.
 * Works alongside useTheme(app) — useTheme handles the platform integration
 * while this hook manages the toggle state.
 */
function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('pas-theme')
    if (stored !== null) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const value = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem('pas-theme', value)
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}

/** Icon-only theme toggle — renders as a <button> in the left header slot */
function ThemeToggleButton({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
    >
      {dark ? (
        /* Sun */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        /* Moon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export default function App() {
  // SDK theme hook — applies data-theme to <html> via the platform
  useTheme(app)

  // Local dark-mode state for toggle button
  const { dark, toggle } = useDarkMode()

  const { user, loading } = useProAuth(app)
  const { count, kvLoading, increment } = useCounter(user)

  const buttonDisabled = loading || kvLoading || user === null

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      {/* Exactly 2 direct children: left slot (ThemeToggle), right slot (ProfileMenu) */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {/* Left slot: theme toggle */}
        <div>
          <ThemeToggleButton dark={dark} onToggle={toggle} />
        </div>

        {/* Right slot: ProfileMenu (authenticated) or SignInButton (unauthenticated) */}
        <div>
          {user !== null ? (
            <ProfileMenu app={app} showThemeToggle={false} showBilling={false} />
          ) : (
            <SignInButton app={app} label="Sign in" />
          )}
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* Count display — aria-live so screen readers announce updates */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-8xl font-bold tabular-nums select-none"
        >
          {loading ? (
            /* Auth resolving */
            <div
              className="animate-pulse w-32 h-20 rounded-xl bg-gray-200 dark:bg-gray-700"
              aria-label="Loading count"
            />
          ) : user === null ? (
            /* Signed out */
            <span>&#8212;</span>
          ) : kvLoading ? (
            /* KV hydrating */
            <div
              className="animate-pulse w-32 h-20 rounded-xl bg-gray-200 dark:bg-gray-700"
              aria-label="Loading count"
            />
          ) : (
            /* Ready */
            <span>{count}</span>
          )}
        </div>

        {/* Increment button — only rendered when authenticated */}
        {!loading && user !== null && (
          <button
            type="button"
            onClick={increment}
            disabled={buttonDisabled}
            aria-label="Increment counter"
            className="rounded-2xl px-8 py-4 bg-primary text-primary-foreground text-xl font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 min-w-[10rem] transition-all"
          >
            +1
          </button>
        )}

        {/* Sign-in CTA — only rendered when signed out and not loading */}
        {!loading && user === null && (
          <SignInButton app={app} label="Sign in to start counting" />
        )}
      </main>
    </div>
  )
}
