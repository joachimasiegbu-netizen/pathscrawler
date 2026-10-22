import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../utils/reportError'

/**
 * The app's last line of defence. Mounted in main.tsx around <App />, so it
 * covers every one of the routes rather than being wired per page.
 *
 * This is not hypothetical: useLeaderboardStore.ts carries a comment about a
 * real crash where two components mounted the same Supabase channel, the
 * second `.subscribe()` threw, and - in its own words - "uncaught, no error
 * boundary in this app, so it took down the entire React tree". The user saw a
 * white page. That is the failure mode this removes.
 *
 * Still a class component because getDerivedStateFromError and
 * componentDidCatch have no hook equivalent - React provides no other way to
 * catch a render error.
 *
 * Recovery is a full page load rather than a state reset, on purpose. An error
 * escaping render means some part of the tree is in a state it did not expect;
 * clearing `hasError` would re-render that same state and usually throw again
 * straight away. A reload is the honest fix and costs the user one second.
 */

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError(error, {
      where: 'ErrorBoundary',
      extra: { componentStack: info.componentStack, path: window.location.pathname },
    })
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white" style={{ letterSpacing: '-0.01em' }}>
            Something went wrong on this page
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            This is a fault at our end, not anything you did. Nothing you have saved has been lost —
            reloading usually clears it.
          </p>

          {/* The message is for a developer, so it only shows in dev. In
              production it would be noise at best and leak internals at worst. */}
          {import.meta.env.DEV && this.state.message ? (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-3 text-left text-xs leading-5 text-red-700 dark:bg-slate-800 dark:text-red-400">
              {this.state.message}
            </pre>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {/* Full navigations, not router pushes: the router lives inside
                this boundary, so a client-side navigation would keep the same
                broken tree mounted.
                min-h-[44px] on both: px-5 py-2.5 text-sm is only 40px tall,
                and when this screen is showing these two are the ONLY controls
                on the page - there is no header left to fall back to - so they
                have to be real touch targets. inline-flex + centring is what
                gives the anchor that height (a plain <a> wouldn't grow to a
                min-height). */}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Reload the page
            </button>
            <a
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Go to the start
            </a>
          </div>
        </div>
      </div>
    )
  }
}
