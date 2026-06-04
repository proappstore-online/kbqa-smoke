import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { ThemeToggle, ProfileMenu, SignInButton } from '@proappstore/sdk/ui'
import { app } from './app'
import { useCounter } from './useCounter'

export default function App({ kvLoading: kvLoadingProp = false }: { kvLoading?: boolean }) {
  // Apply theme (sets data-theme on <html>)
  useTheme(app)

  const { user, loading } = useProAuth(app)
  const { count, kvLoading: kvLoadingHook, increment } = useCounter(user)

  const kvLoading = kvLoadingProp || kvLoadingHook
  const isLoading = loading || kvLoading
  const isUnauthed = user === null && !loading && !kvLoading

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex h-12 items-center px-4 justify-between">
        {/* Left slot: ThemeToggle */}
        <ThemeToggle />
        {/* Right slot: ProfileMenu when authed, SignInButton when unauthed */}
        {isUnauthed ? (
          <SignInButton app={app} label="Sign in to start counting" />
        ) : (
          <ProfileMenu app={app} showThemeToggle showBilling={false} />
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Count display */}
        <div aria-live="polite" aria-atomic="true">
          {isLoading ? (
            <div className="h-24 w-48 rounded-xl bg-foreground/10 animate-pulse" />
          ) : isUnauthed ? (
            <span className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground">
              &mdash;
            </span>
          ) : (
            <span className="text-6xl sm:text-8xl font-bold tabular-nums text-foreground">
              {count}
            </span>
          )}
        </div>

        {/* Button area */}
        {isUnauthed ? null : (
          <button
            className="rounded-2xl px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition min-w-[10rem] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increment counter"
            onClick={increment}
            disabled={isLoading}
          >
            +
          </button>
        )}
      </main>
    </div>
  )
}
