/**
 * One place every unexpected failure in the app passes through, so that
 * wiring up a real monitoring service later is a single call in main.tsx
 * rather than an edit in every file that currently holds a bare
 * `console.error`.
 *
 * No provider is named in this file on purpose - it stays the seam. Sentry is
 * wired into it by `src/utils/monitoring.ts`, which only does so when
 * VITE_SENTRY_DSN is set, and which the privacy policy reads to decide whether
 * to name Sentry as a processor.
 *
 * With no reporter installed, reports go to the console in dev and are counted
 * in production, so the app can still say "this has failed N times" rather
 * than failing silently.
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
