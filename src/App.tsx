import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { ProfileMenu, SignInButton, ThemeToggle } from '@proappstore/sdk/ui'
import { useEffect } from 'react'
import { app } from './app'
import { useCounter } from './useCounter'

export default function App() {
  const { user, loading } = useProAuth(app)
  const { theme } = useTheme()
  const { count, kvLoading, increment } = useCounter(user)

  // Apply data-theme to <html> so Tailwind dark: variants respond.
  // useTheme() already does this internally, but we sync explicitly to be safe.
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const isLoading = loading || kvLoading
  // Unauthenticated: auth resolved AND user is null
  const isUnauthenticated = !loading && user === null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/*
        Top bar — exactly 2 direct children:
        left slot: ThemeToggle
        right slot: SignInButton (unauthenticated) | ProfileMenu (authenticated)
      */}
      <header className="h-12 flex items-center justify-between px-4">
        {/* Left slot: SDK ThemeToggle */}
        <ThemeToggle />

        {/* Right slot: auth control */}
        {isUnauthenticated ? (
          <SignInButton app={app} label="Sign in to start counting" />
        ) : (
          <ProfileMenu app={app} showThemeToggle showBilling={false} />
        )}
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

        {/* Increment button — only shown when authenticated */}
        {!isUnauthenticated && (
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
