import { Link } from 'react-router-dom'

interface FiguresDisclaimerProps {
  /** Where the numbers on this page come from, and what they measure, in the
   * page's own words - e.g. "ONS ASHE 2025 median full-time gross annual
   * pay". Rendered before the shared not-advice line so a reader gets the
   * specific caveat first and the general one second. Pages with nothing
   * specific to add can leave it out. */
  sources?: string
  /** Set on the always-dark "game mode" pages (Roll a Job's corner of the
   * app) where the light-mode slate tones are unreadable. */
  onDark?: boolean
}

/**
 * The "these are estimates, not advice" line for every page that publishes a
 * salary, a job-market statistic or a student-finance figure, linking to the
 * "Information, not advice" section of /terms.
 *
 * Why it exists: /terms commits to telling people that careers and
 * student-finance figures are general information rather than advice, and the
 * Student Debt Calculator said so inline - but the Job Market pages, which
 * publish salary bands, demand rankings and automation-risk claims people act
 * on, said nothing. A promise that only appears on the page nobody reads is
 * not a disclaimer. Sharing one component also means the wording can't drift
 * apart from the terms page across nine pages.
 *
 * Deliberately quiet styling (the same small muted note these pages already
 * used for source lines) rather than a warning banner: it has to be present
 * and findable on every figure page, not shout over the content on all of
 * them.
 */
export default function FiguresDisclaimer({ sources, onDark = false }: FiguresDisclaimerProps) {
  return (
    <p
      className={`border-t pt-4 text-xs leading-5 ${
        onDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-400 dark:border-slate-700 dark:text-slate-500'
      }`}
    >
      {sources ? <>{sources} </> : null}
      These figures are general information and estimates, can be out of date, and can't take account of your own
      situation - they aren't careers or financial advice. Check an official source before making a decision. See{' '}
      <Link
        to="/terms#information-not-advice"
        className={`font-semibold underline underline-offset-2 ${
          onDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        Information, not advice
      </Link>
      .
    </p>
  )
}
