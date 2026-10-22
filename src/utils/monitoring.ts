/**
 * Where the two seams in this folder get plugged into real services:
 * `reportError.ts` into Sentry, `analytics.ts` into Plausible.
 *
 * Both are off unless their environment variable is set, and the flags below
 * are the single source of truth for "is it on" - the privacy policy imports
 * the same two functions, so the page can never claim PathScrawler has no
 * analytics while it is sending events, or name a processor it isn't using.
 * That is the whole reason this file exists rather than two calls in
 * main.tsx: the wiring and the disclosure have to move together.
 *
 * Neither SDK is imported at the top level. Sentry is ~100 kB and Plausible
 * is a third-party request, so both are fetched only when configured, which
 * keeps the bundle and the network identical to before for anyone who hasn't
 * set the vars (including every local dev run).
 *
 * To turn either on, set the var in .env.local for dev and in Vercel's
 * Settings -> Environment Variables for production. Vite inlines VITE_-prefixed
 * vars at BUILD time, so a new value needs a redeploy, not just a restart.
 */

import { setErrorReporter } from './reportError'
import { setAnalyticsSink, type AnalyticsEvent, type AnalyticsProps } from './analytics'

/** Sentry project DSN. Not a secret - it only allows writing events. */
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? ''

/** The domain as registered in Plausible, e.g. `pathscrawler.com`. */
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN ?? ''

/**
 * Override for self-hosted Plausible, or for a proxied script path if an ad
 * blocker eating `plausible.io` becomes a problem. Defaults to Plausible Cloud.
 */
const PLAUSIBLE_SRC = import.meta.env.VITE_PLAUSIBLE_SRC ?? 'https://plausible.io/js/script.js'

/** True when errors are being sent to Sentry. Read by the privacy policy. */
export function errorMonitoringEnabled(): boolean {
  return SENTRY_DSN !== ''
}

/** True when events are being sent to Plausible. Read by the privacy policy. */
export function analyticsEnabled(): boolean {
  return PLAUSIBLE_DOMAIN !== ''
}

declare global {
  interface Window {
    /**
     * Installed by Plausible's script. Before it loads, the queue shim below
     * stands in for it, so an event fired during the first paint - which
     * `persona_selected` can be, on a fast click - isn't dropped.
     */
    plausible?: {
      (event: string, options?: { props?: AnalyticsProps }): void
      q?: unknown[]
    }
  }
}

function startSentry(): void {
  // Dynamic so the SDK is a separate chunk, requested only when a DSN exists.
  void import('@sentry/react')
    .then((Sentry) => {
      Sentry.init({
        dsn: SENTRY_DSN,
        // 'development' | 'production', so local noise can be filtered out
        // in the dashboard rather than being mixed in with real reports.
        environment: import.meta.env.MODE,
        // No performance tracing. It samples real user journeys, which is far
        // more data than "something threw" needs, and it is the part that
        // burns a free-tier quota fastest.
        tracesSampleRate: 0,
        // The browser SDK no longer takes `sendDefaultPii` (it was removed in
        // v11 - it is a server-side option), so the guarantee the privacy
        // policy makes about IP addresses is enforced here instead of being
        // left to a default that could change under a dependency bump.
        // `event.user` is where an IP would land, and request headers are
        // where a cookie or a referrer with a query string would.
        beforeSend(event) {
          delete event.user
          if (event.request) {
            delete event.request.headers
            delete event.request.cookies
          }
          return event
        },
      })

      setErrorReporter((error, context) => {
        Sentry.captureException(error, {
          tags: { where: context.where },
          extra: context.extra,
        })
      })
    })
    .catch(() => {
      // A blocked or failed SDK load must not break the app, and must not go
      // through reportError either - that would recurse into the thing that
      // just failed to install. Errors keep being counted locally instead.
    })
}

function startPlausible(): void {
  if (typeof document === 'undefined') return

  // Plausible's own snippet, as a queue: calls made before the script arrives
  // are collected on `.q` and replayed by it on load, which matters because
  // `persona_selected` can fire on a fast click during the first paint.
  if (!window.plausible) {
    const queue: unknown[] = []
    const shim = ((event: string, options?: { props?: AnalyticsProps }) => {
      queue.push([event, options])
    }) as NonNullable<Window['plausible']>
    shim.q = queue
    window.plausible = shim
  }

  const script = document.createElement('script')
  script.src = PLAUSIBLE_SRC
  script.defer = true
  script.dataset.domain = PLAUSIBLE_DOMAIN
  document.head.appendChild(script)

  // `track()` already swallows a throwing sink, so a blocked script (which is
  // common - Plausible is on most blocklists despite being cookieless) costs
  // the user nothing.
  setAnalyticsSink((event: AnalyticsEvent, props?: AnalyticsProps) => {
    window.plausible?.(event, props ? { props } : undefined)
  })
}

/**
 * Call once, from main.tsx, before render. Starts whichever of the two is
 * configured; does nothing at all when neither is.
 */
export function startMonitoring(): void {
  // Written as the raw `import.meta.env` expressions rather than through the
  // two helpers above, which look identical but are not: Vite replaces these
  // with literals at build time, so with the vars unset this compiles to
  // `if ("")` and Rollup drops the branch, the dynamic import and the ~30 kB
  // (gzipped) Sentry chunk out of dist altogether. Behind a function call the
  // bundler cannot prove the branch is dead, and the chunk ships as a file
  // nothing ever fetches. The helpers read the same two variables, so there
  // is nothing here for them to drift from.
  if (import.meta.env.VITE_SENTRY_DSN) startSentry()
  if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) startPlausible()
}
