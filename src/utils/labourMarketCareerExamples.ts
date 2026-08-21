import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import { HIGH_DEMAND_CATEGORIES } from './rollWeights'

// Shared between JobMarketUkStatsPage (the stat cards) and the two
// dedicated pages they link out to (JobMarketHeritageCraftsPage,
// JobMarketHighDemandCareersPage) - kept in one place so both sides of
// each link agree on exactly which careers count.

// The 7 ultra-rare heritage-craft careers (demoCareers.js ids 125-131) are
// the only ones with a rarityLabel field, so that's a self-documenting
// filter rather than a hardcoded id list that could drift.
export const heritageCraftCareers: Career[] = demoCareers.filter((career) => Boolean(career.rarityLabel))

// Every career in one of rollWeights.ts's HIGH_DEMAND_CATEGORIES (the same
// set that shapes Roll a Job's odds), grouped by category. Excludes the
// heritage-craft careers even though a couple share a high-demand category
// (Construction & Trades) - they're endangered crafts first, and counting
// them as "in demand" here too would read as a mismatched claim.
export function highDemandCareersByCategory(): { category: string; careers: Career[] }[] {
  const groups = new Map<string, Career[]>()
  for (const career of demoCareers) {
    if (career.rarityLabel || !HIGH_DEMAND_CATEGORIES.has(career.category)) continue
    if (!groups.has(career.category)) groups.set(career.category, [])
    groups.get(career.category)!.push(career)
  }
  return Array.from(groups.entries()).map(([category, careers]) => ({ category, careers }))
}
