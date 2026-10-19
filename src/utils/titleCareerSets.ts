import { useEffect, useState } from 'react'
import { MONEY_BAGS_SALARY_THRESHOLD } from './titles'

/**
 * The four per-career id sets three titles are scored against. They used to
 * be module-level `new Set(demoCareers.filter(...))` constants in titles.ts,
 * which meant anything importing titles.ts - including RollStandingPanel, in
 * the app's permanent header - pulled the whole 657 KB career dataset into
 * the initial chunk. Nothing on the landing page needs it.
 *
 * So the dataset is reached through `await import()` here instead, and
 * memoized: the sets are derived once per page load, the first time something
 * actually asks for them (a signed-in player's Binder sync, or opening the
 * Achievements panel), and every later caller gets the same instance back.
 *
 * `inFlight` is what keeps a burst of callers to one import+derive rather
 * than N - the Binder effect and the panel's own hook routinely fire in the
 * same tick.
 */
export interface TitleCareerSets {
  /** Working Class Hero - every Common-tier career. */
  common: Set<number>
  /** Mythic set (titles.ts) - every Mythic-tier career. */
  mythic: Set<number>
  /** Money Bags - every career at or above MONEY_BAGS_SALARY_THRESHOLD. */
  moneyBags: Set<number>
  /** Graduate - the 'very-easy' barrier tier from easyEntryCareers.ts. */
  graduate: Set<number>
}

let cached: TitleCareerSets | null = null
let inFlight: Promise<TitleCareerSets> | null = null

async function deriveSets(): Promise<TitleCareerSets> {
  // Both of these statically import demoCareers, so both have to be reached
  // dynamically - importing careerTiers alone would not be enough.
  const [{ default: demoCareers }, { getCareerTier, parseSalaryAvg }, { getEasyEntryCareers }] = await Promise.all([
    import('../data/demoCareers'),
    import('./careerTiers'),
    import('./easyEntryCareers'),
  ])

  return {
    common: new Set(demoCareers.filter((career) => getCareerTier(career) === 'common').map((career) => career.id)),
    mythic: new Set(demoCareers.filter((career) => getCareerTier(career) === 'mythic').map((career) => career.id)),
    moneyBags: new Set(
      demoCareers
        .filter((career) => parseSalaryAvg(career.salary) >= MONEY_BAGS_SALARY_THRESHOLD)
        .map((career) => career.id),
    ),
    // Graduate's "entry-level jobs" - reuses the Easy Entry Careers system
    // (easyEntryCareers.ts, already built for the Job Market "Easiest Jobs to
    // Get Into" page) rather than inventing a second, competing definition of
    // "entry-level". Specifically the 'very-easy' barrier tier ("No formal
    // qualifications beyond GCSEs - most employers train you on the job") -
    // the actual literal entry-level end of that list, not the wider 'easy'
    // tier (apprenticeships/short courses), which happens to land at exactly
    // 20 careers, matching "~15-20 entry-level jobs" as given.
    graduate: new Set(
      getEasyEntryCareers()
        .filter((entry) => entry.barrier === 'very-easy')
        .map((entry) => entry.career.id),
    ),
  }
}

/** Resolves to the memoized sets, importing the career dataset on first call. */
export function getTitleCareerSets(): Promise<TitleCareerSets> {
  if (cached) return Promise.resolve(cached)
  if (inFlight) return inFlight
  inFlight = deriveSets().then(
    (sets) => {
      cached = sets
      inFlight = null
      return sets
    },
    (error) => {
      // Leave both caches empty so a later caller retries rather than being
      // stuck with a permanent failure - a chunk that failed to load once
      // (flaky network, a deploy mid-session) usually loads on the next try.
      inFlight = null
      throw error
    },
  )
  return inFlight
}

/** Already-derived sets, or null if nothing has asked for them yet. Lets a
 * synchronous caller take the fast path without forcing the import. */
export function peekTitleCareerSets(): TitleCareerSets | null {
  return cached
}

/**
 * The sets for a component that renders counts against them (the Achievements
 * panel's per-title progress rows). Returns null until the dataset chunk has
 * loaded - callers render the row without its "N / M collected" figure in the
 * meantime rather than blocking the whole header on a 657 KB download.
 */
export function useTitleCareerSets(): TitleCareerSets | null {
  const [sets, setSets] = useState<TitleCareerSets | null>(() => peekTitleCareerSets())

  useEffect(() => {
    if (sets) return
    let active = true
    void getTitleCareerSets().then(
      (loaded) => {
        if (active) setSets(loaded)
      },
      () => {
        // Nothing to show the player here - the panel just keeps rendering
        // its rows without collection counts. reportError is deliberately not
        // called: this is a progress nicety, not a failure worth a report.
      },
    )
    return () => {
      active = false
    }
  }, [sets])

  return sets
}
