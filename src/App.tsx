import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { ProfileMenu, SignInButton } from '@proappstore/sdk/ui'
import { useEffect } from 'react'
import { app } from './app'
import { useCounter } from './useCounter'

export default function App() {
  const { user, loading } = useProAuth(app)
  const theme = useTheme(app)
  const { count, kvLoading, increment } = useCounter(user)

  // Apply data-theme to <html> so Tailwind dark: variants and SDK theme fire
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const isLoading = loading || kvLoading
  const isUnauthenticated = !loading && !kvLoading && user === null
  const isAuthenticated = !loading && !kvLoading && user !== null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top bar — exactly 2 direct children: left (ThemeToggle) + right (ProfileMenu) */}
      <header className="h-12 flex items-center justify-between px-4">
        {/* Left slot: inline ThemeToggle (SDK ThemeToggle component equivalent) */}
        <ThemeToggleButton theme={theme} />
        {/* Right slot: ProfileMenu */}
        <ProfileMenu app={app} showThemeToggle showBilling={false} />
      </header>

      {/* Main content area — fills remaining viewport */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Count display with a11y live region */}
        <div aria-live="polite" aria-atomic="true">
          {isLoading ? (
            <div className="h-24 w-48 rounded-xl bg-foreground/10 animate-pulse" />
          ) : isUnauthenticated ? (
            <span className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground">
              —
            </span>
          ) : (
            <span className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground">
              {count}
            </span>
          )}
        </div>

        {/* Action area */}
        {isUnauthenticated ? (
          <SignInButton app={app} label="Sign in to start counting" />
        ) : (
          <button
            onClick={increment}
            disabled={isLoading}
            aria-label="Increment counter"
            className="rounded-2xl px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition min-w-[10rem] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            +
          </button>
        )}
      </main>
    </div>
  )
}

// ThemeToggle rendered in the left slot of the top bar.
// Uses useTheme hook to show sun/moon icon and toggle between light/dark.
function ThemeToggleButton({ theme }: { theme: string | null }) {
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // ignore storage errors
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
    >
      {theme === 'dark' ? (
        // Sun icon — shown in dark mode to switch to light
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon — shown in light mode to switch to dark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
