import type { Career } from '../data/demoCareers'

export type TierKey = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

export interface TierConfig {
  key: TierKey
  label: string
  emoji: string
  /**
   * Target long-run roll share (sums to 1). Display/reference only - actual
   * roll probability is per-career now (see rollWeights.ts / rollEngine.ts),
   * not picked by tier. Kept here because it's still what the tier-balance
   * cap in rollEngine.ts is checking against.
   */
  targetShare: number
}

// Ordered weakest -> strongest. Roll a Job's tier is graded by salary again
// (see getCareerTier below for the actual cutoffs) - a separate,
// real-rarity-based check (getRealRarityTier) still exists purely for
// Weekly Spotlight, which deliberately cares about genuine UK workforce
// scarcity rather than pay. This array only carries roll-probability
// weighting, same either way.
// targetShare IS the roll probability (rollEngine.ts's pickTier() uses it
// directly as the per-tier weight in its weighted-random walk), so tuning
// these numbers directly retunes the odds - re-verified by simulation
// after the last rebalance: Common 55% (was rolling Rare too routinely -
// e.g. 3 in a row - at the old 18%), Uncommon 25%, Rare 12% (~1 in 8),
// Epic 5.5% (~1 in 18), Legendary 2% (~1 in 50), Mythic held exactly at
// 0.5% (~1 in 200) per the brief. Sums to 1 (0.55+0.25+0.12+0.055+0.02+0.005).
export const TIERS: TierConfig[] = [
  { key: 'common', label: 'Common', emoji: '🟢', targetShare: 0.55 },
  { key: 'uncommon', label: 'Uncommon', emoji: '🔵', targetShare: 0.25 },
  { key: 'rare', label: 'Rare', emoji: '🟣', targetShare: 0.12 },
  { key: 'epic', label: 'Epic', emoji: '🟡', targetShare: 0.055 },
  { key: 'legendary', label: 'Legendary', emoji: '💎', targetShare: 0.02 },
  { key: 'mythic', label: 'Mythic', emoji: '⚫', targetShare: 0.005 },
]

export function parseSalaryAvg(salary: string): number {
  const matches = salary.match(/\d+(?:\.\d+)?/g)
  if (!matches || matches.length === 0) return 0
  const numbers = matches.map(Number)
  return (Math.min(...numbers) + Math.max(...numbers)) / 2
}

// --- Real-world UK rarity (employment-share based) -------------------------
// Cutoffs on career.employmentPercentage (real UK workforce share - see
// demoCareers.d.ts) - LOWER percentage means FEWER people hold that job in
// real life, so it earns a RARER tier here. This is now used by Weekly
// Spotlight only (see weeklySpotlight.ts) rather than Roll a Job's own
// color grading below - a Master Thatcher earning £30k is real-world rarer
// than almost any executive job, and staying real-rarity-based is the
// entire point of that feature, so it keeps its own tier check independent
// of what Roll a Job now grades by.
//
// Thresholds were picked by sorting all 111 original careers' real
// employmentPercentage values and choosing cutoffs that give a sensible
// rarity spread rather than an even split - re-verified against the actual
// distribution: Mythic 2 careers (Energy/Mining Production Director
// 0.036%, Senior Police Officer 0.050% - genuinely the two rarest real
// occupations in the original 111), Legendary 11, Epic 25, Rare 22,
// Uncommon 28, Common 23 (sums to 111). The 10 ultra-rare heritage-craft
// careers added later (demoCareers.js ids 125-134) fall vastly below the
// Mythic cutoff too, so Mythic is 12 real careers total now - see
// weeklySpotlight.ts.
const MYTHIC_MAX_PCT = 0.06
const LEGENDARY_MAX_PCT = 0.12
const EPIC_MAX_PCT = 0.22
const RARE_MAX_PCT = 0.4
const UNCOMMON_MAX_PCT = 0.8

export function getRealRarityTier(career: Career): TierKey {
  const pct = career.employmentPercentage
  if (pct < MYTHIC_MAX_PCT) return 'mythic'
  if (pct < LEGENDARY_MAX_PCT) return 'legendary'
  if (pct < EPIC_MAX_PCT) return 'epic'
  if (pct < RARE_MAX_PCT) return 'rare'
  if (pct < UNCOMMON_MAX_PCT) return 'uncommon'
  return 'common'
}

// --- Roll a Job tier / color grading (pay-based) ----------------------------
// Roll a Job's tier (and therefore its card color, which pool it rolls
// from in rollEngine.ts, and its badge everywhere else that shows a tier -
// Binder, Compare, Stats) is graded by salary again - back to how it
// worked before the real-rarity experiment above, per instruction. Cutoffs
// were picked by sorting all 118 careers' salary averages (parseSalaryAvg)
// and choosing bands that give a sensible descending pyramid - re-verified
// against the actual distribution: Common 33, Uncommon 31, Rare 13, Epic
// 16, Legendary 13, Mythic 12 (sums to 118).
const UNCOMMON_MIN_SALARY_AVG = 35
const RARE_MIN_SALARY_AVG = 45
const EPIC_MIN_SALARY_AVG = 60
const LEGENDARY_MIN_SALARY_AVG = 90
const MYTHIC_MIN_SALARY_AVG = 130

export function getCareerTier(career: Career): TierKey {
  const avg = parseSalaryAvg(career.salary)
  if (avg >= MYTHIC_MIN_SALARY_AVG) return 'mythic'
  if (avg >= LEGENDARY_MIN_SALARY_AVG) return 'legendary'
  if (avg >= EPIC_MIN_SALARY_AVG) return 'epic'
  if (avg >= RARE_MIN_SALARY_AVG) return 'rare'
  if (avg >= UNCOMMON_MIN_SALARY_AVG) return 'uncommon'
  return 'common'
}

export function getTierConfig(tier: TierKey): TierConfig {
  return TIERS.find((entry) => entry.key === tier) ?? TIERS[0]
}

// --- Displayed rarity ("1 in every N workers") ------------------------------
// A high-paying career landing in Epic+ by salary but that's actually
// common in the real UK workforce (e.g. Investment Banker, really about 1
// in 111) reads oddly next to an "Epic"/"Legendary"/"Mythic" badge - a
// card that rare-looking should feel properly scarce. So Epic-tier-and-up
// careers get a floor: if their real "1 in every N" figure is more common
// than 1 in 300 (a smaller N), the DISPLAYED N is bumped up to 300 - the
// underlying career.employmentPercentage (the real, ONS/DfE-sourced
// figure) is never touched, only what's shown on the card is. Common/
// Uncommon/Rare careers always show their real figure, no floor.
const SCARCITY_FLOOR_N = 300

export function getDisplayRarityN(career: Career): number {
  const realN = Math.round(100 / career.employmentPercentage)
  const tier = getCareerTier(career)
  const isHighTier = tier === 'epic' || tier === 'legendary' || tier === 'mythic'
  return isHighTier && realN < SCARCITY_FLOOR_N ? SCARCITY_FLOOR_N : realN
}
