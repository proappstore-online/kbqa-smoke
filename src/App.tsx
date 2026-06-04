import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { ProfileMenu, SignInButton } from '@proappstore/sdk/ui'
import { useEffect } from 'react'
import { app } from './app'
import { useCounter } from './useCounter'

export default function App() {
  const { user, loading } = useProAuth(app)
  const theme = useTheme(app)
  const { count, kvLoading, increment } = useCounter(user)

  // Apply data-theme to <html> so Tailwind dark: variants fire
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const isLoading = loading
  const isAuthenticated = !loading && user !== null
  const isUnauthenticated = !loading && user === null
  const buttonDisabled = isLoading || kvLoading || !isAuthenticated

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark:bg-slate-900 dark:text-slate-100">
      {/* Top bar */}
      <header className="h-12 flex items-center justify-between px-4">
        {/* Left slot: ThemeToggle */}
        <div>
          <ThemeToggleButton />
        </div>
        {/* Right slot: ProfileMenu */}
        <div>
          <ProfileMenu app={app} />
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Count display */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-8xl font-bold tabular-nums"
        >
          {isLoading || kvLoading ? (
            <div className="animate-pulse w-32 h-24 rounded-xl bg-slate-200 dark:bg-slate-700" />
          ) : isAuthenticated ? (
            <span>{count}</span>
          ) : (
            <span>&#8212;</span>
          )}
        </div>

        {/* Action area */}
        {!isLoading && (
          isAuthenticated ? (
            <button
              onClick={increment}
              disabled={buttonDisabled}
              aria-label="Increment counter"
              className="rounded-2xl px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 min-w-[10rem] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              + Increment
            </button>
          ) : (
            <SignInButton app={app} label="Sign in to start counting" />
          )
        )}
      </main>
    </div>
  )
}

// Inline ThemeToggle using the SDK hook — renders a button on the left
function ThemeToggleButton() {
  const theme = useTheme(app)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    // Persist preference
    try { localStorage.setItem('theme', next) } catch { /* ignore */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {theme === 'dark' ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        // Moon icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
