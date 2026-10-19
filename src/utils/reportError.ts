/**
 * One place every unexpected failure in the app passes through, so that
 * wiring up a real monitoring service later is a single call in main.tsx
 * rather than an edit in every file that currently holds a bare
 * `console.error`.
 *
 * Deliberately NOT a Sentry integration yet. That needs an account, a DSN in
 * the env, and a dependency, and it ships user data to a third party - all
 * decisions for the owner of the project, not defaults to assume. This is the
 * seam those choices plug into:
 *
 *     import * as Sentry from '@sentry/react'
 *     Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN })
 *     setErrorReporter((error, context) => Sentry.captureException(error, { extra: context }))
 *
 * Until that line exists, reports go to the console in dev and are counted in
 * production so the app can at least say "this has failed N times" rather than
 * failing silently.
 */

export interface ErrorContext {
  /** Where this came from, e.g. 'ErrorBoundary' or 'leaderboard.fetch'. */
  where: string
  /** Anything else worth having in the report. Keep it free of secrets. */
  extra?: Record<string, unknown>
}

type Reporter = (error: unknown, context: ErrorContext) => void

let reporter: Reporter | null = null
let installed = false
let count = 0

/** Point this at a real monitoring service. Call once, from main.tsx. */
export function setErrorReporter(next: Reporter | null): void {
  reporter = next
}

/** How many errors have been reported this session - surfaced by nothing yet,
 * but it is the cheapest possible "is this user having a bad time" signal. */
export function errorCount(): number {
  return count
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value
  return new Error(typeof value === 'string' ? value : JSON.stringify(value))
}

export function reportError(error: unknown, context: ErrorContext): void {
  count += 1
  const err = toError(error)

  if (reporter) {
    try {
      reporter(err, context)
    } catch {
      // A failing reporter must never become a second error. Swallow it.
    }
  }

  // Kept in dev regardless of whether a reporter is installed - the console is
  // still the fastest way to see a stack while actually building.
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(`[${context.where}]`, err, context.extra ?? '')
  }
}

/**
 * Catches the two classes of failure a React error boundary cannot see: errors
 * thrown outside the render tree (event handlers, timers, rAF callbacks) and
 * rejected promises nobody awaited. Without this, an async Supabase call that
 * throws after its component unmounted disappears entirely.
 */
export function installGlobalErrorHandlers(): void {
  if (installed || typeof window === 'undefined') return
  installed = true

  window.addEventListener('error', (event) => {
    reportError(event.error ?? event.message, {
      where: 'window.error',
      extra: { source: event.filename, line: event.lineno, column: event.colno },
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, { where: 'window.unhandledrejection' })
  })
}
