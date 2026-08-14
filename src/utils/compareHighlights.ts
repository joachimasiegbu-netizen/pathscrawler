import type { Career } from '../data/demoCareers'
import { parseSalaryAvg } from './careerTiers'
import { entryBarrierWeight } from './rollWeights'

// Shared by both comparison pages (the universal /compare and the Binder's
// /binder/compare) so "best salary/easiest to start/best long-term" mean
// the same thing everywhere, computed once rather than reimplemented twice.

// A progression rung looks like "Hospitality Worker (£24k-£32k)" - pull out
// the highest £Xk figure in it (works equally on a bare salary string like
// "£25k - £70k").
export function parseCeiling(text: string): number {
  const matches = text.match(/£(\d+(?:\.\d+)?)k/gi) || []
  const values = matches.map((match) => parseFloat(match.replace(/[£k]/gi, '')))
  return values.length ? Math.max(...values) : 0
}

export function longTermCeiling(career: Career): number {
  if (career.progression.length === 0) return parseSalaryAvg(career.salary)
  return parseCeiling(career.progression[career.progression.length - 1])
}

export function pickBest<T>(items: T[], score: (item: T) => number): T {
  return items.reduce((best, item) => (score(item) > score(best) ? item : best))
}

export interface CompareHighlights {
  bestSalary: Career
  easiestStart: Career
  bestLongTerm: Career
}

// Callers should only invoke this with 2+ careers - pickBest on a single
// item degenerates to "that item wins everything," which isn't a real
// comparison; both comparison pages already gate on length >= 2 before
// reaching this.
export function computeCompareHighlights(careers: Career[]): CompareHighlights {
  return {
    bestSalary: pickBest(careers, (career) => parseSalaryAvg(career.salary)),
    easiestStart: pickBest(careers, entryBarrierWeight),
    bestLongTerm: pickBest(careers, longTermCeiling),
  }
}
