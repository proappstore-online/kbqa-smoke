import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { ProfileMenu, SignInButton, ThemeToggle } from '@proappstore/sdk/ui'
import { useEffect } from 'react'
import { app } from './app'
import { useCounter } from './useCounter'

export default function App() {
  const { user, loading } = useProAuth(app)
  const { theme } = useTheme()
  const { count, kvLoading, increment } = useCounter(user)

  // Sync data-theme to <html> so Tailwind dark: variants respond.
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const isLoading = loading || kvLoading
  // Unauthenticated: auth resolved AND user is null AND not loading
  const isUnauthenticated = !loading && !kvLoading && user === null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/*
        Top bar — exactly 2 direct children:
        left slot:  ThemeToggle
        right slot: ProfileMenu (always — handles both auth states internally)
      */}
      <header className="h-12 flex items-center justify-between px-4">
        {/* Left slot: SDK ThemeToggle */}
        <ThemeToggle />

        {/* Right slot: ProfileMenu (renders sign-in button when unauth'd) */}
        <ProfileMenu app={app} showThemeToggle showBilling={false} />
      </header>

      {/* Main content — fills remaining viewport */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Count display with a11y live region */}
        <div aria-live="polite" aria-atomic="true">
          {isLoading ? (
            <div
              className="h-24 w-48 rounded-xl bg-foreground/10 animate-pulse"
              aria-label="Loading count"
            />
          ) : isUnauthenticated ? (
            <span className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground">
              &mdash;
            </span>
          ) : (
            <span className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground">
              {count}
            </span>
          )}
        </div>

        {/* Action area: increment button when auth'd, sign-in prompt when not */}
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
