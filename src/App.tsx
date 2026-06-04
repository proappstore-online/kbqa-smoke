import { useProAuth, useTheme } from '@proappstore/sdk/hooks'
import { SignInButton, ProfileMenu } from '@proappstore/sdk/ui'
import { app } from './app'
import { useCounter } from './useCounter'

export default function App() {
  const { user, loading } = useProAuth(app)
  const { count, kvLoading, increment } = useCounter(user)

  // Apply theme to document
  useTheme()

  const isDisabled = loading || kvLoading || user === null

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="h-12 flex items-center justify-between px-4">
        <div />
        <div>
          {user ? (
            <ProfileMenu app={app} showThemeToggle showBilling={false} />
          ) : (
            !loading && <SignInButton app={app} label="Sign in" />
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Count display */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-6xl sm:text-8xl font-bold tabular-nums"
        >
          {loading || kvLoading ? (
            <span
              className="inline-block w-32 h-20 rounded-xl bg-foreground/10 animate-pulse"
              aria-label="Loading count"
            />
          ) : user ? (
            count
          ) : (
            <span className="text-foreground/40">—</span>
          )}
        </div>

        {/* Increment button or sign-in prompt */}
        {user ? (
          <button
            onClick={increment}
            disabled={isDisabled}
            aria-label="Increment counter"
            className="
              rounded-2xl px-8 py-4 text-lg font-semibold
              bg-primary text-primary-foreground
              hover:opacity-90 active:scale-95 transition
              disabled:opacity-40 disabled:cursor-not-allowed
              min-w-[10rem] min-h-[2.75rem]
            "
          >
            + Increment
          </button>
        ) : (
          !loading && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-foreground/60 text-sm">Sign in to start counting</p>
              <SignInButton app={app} label="Sign in to start counting" />
            </div>
          )
        )}
      </main>
    </div>
  )
}
