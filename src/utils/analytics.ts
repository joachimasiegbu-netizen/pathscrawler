/**
 * One place every product event in the app passes through, so that wiring up
 * a real analytics tool later is a single call in main.tsx rather than an
 * edit in every file that wants to count something.
 *
 * NOTHING IS SENT ANYWHERE UNTIL A SINK IS INSTALLED. There is deliberately
 * no provider here, for three reasons, all of which are the project owner's
 * call rather than a default worth assuming:
 *
 *  1. It needs an account and a domain with whichever tool is chosen.
 *  2. It sends data about real users (many of them under 18) to a third
 *     party, which is a decision, not an implementation detail.
 *  3. `src/data/legal.ts` currently states, in terms the privacy policy
 *     renders verbatim, that there is nothing for advertising or tracking.
 *     Turning this on makes that sentence false.
 *
 * So before installing a sink: pick a cookieless, no-personal-data tool
 * (Plausible, Fathom, Umami and similar need no consent banner under PECR
 * because they set no cookies and store no identifiers), then update
 * DEVICE_STORAGE / the "no analytics" wording in legal.ts and name the
 * processor in the privacy policy. The code change is one line:
 *
 *     import { setAnalyticsSink } from './utils/analytics'
 *     setAnalyticsSink((event, props) => window.plausible?.(event, { props }))
 *
 * Until that exists, events are counted in memory and logged in dev, so the
 * call sites can be verified without shipping anything.
 */

/** The events worth counting, named rather than free-form so a typo at a call
 * site is a type error instead of a silently separate series. */
export type AnalyticsEvent =
  /** Which persona someone picks on /role - the single most useful number
   * about how this app is actually used. */
  | 'persona_selected'
  /** Someone finished the 5-question quick assessment. With the above, this
   * is the drop-off between "arrived" and "got a recommendation". */
  | 'assessment_completed'

/** Event properties. Deliberately typed as scalars: no object nesting, and
 * nothing that could carry a name, an email or free text from a user. */
export type AnalyticsProps = Record<string, string | number | boolean>

type Sink = (event: AnalyticsEvent, props?: AnalyticsProps) => void

let sink: Sink | null = null
const counts = new Map<AnalyticsEvent, number>()

/** Point this at a real analytics tool. Call once, from main.tsx. Passing
 * null removes it again (which is what an opt-out would do). */
export function setAnalyticsSink(next: Sink | null): void {
  sink = next
}

/** How many times each event has fired this session. Nothing surfaces this
 * yet; it exists so the call sites are verifiable with no provider wired. */
export function analyticsCounts(): Record<string, number> {
  return Object.fromEntries(counts)
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  counts.set(event, (counts.get(event) ?? 0) + 1)

  if (sink) {
    try {
      sink(event, props)
    } catch {
      // Analytics must never be able to break a user's journey. A failing
      // sink is swallowed, exactly as reportError.ts does with a failing
      // reporter.
    }
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, props ?? '')
  }
}
