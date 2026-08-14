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

// Ordered weakest -> strongest. No salary field anymore - rarity is about
// how few people actually hold the job (career.employmentPercentage, real
// ONS/DfE data - see demoCareers.d.ts), not how much it pays. See
// getCareerTier below for the actual employmentPercentage cutoffs; this
// array only carries roll-probability weighting now.
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

// Rarity cutoffs on career.employmentPercentage (real UK workforce share -
// see demoCareers.d.ts) - LOWER percentage means FEWER people hold that job
// in real life, so it earns a RARER tier. Inverted from how this used to
// work (higher salary -> rarer tier); a job being well-paid no longer has
// anything to do with its tier.
//
// Thresholds were picked by sorting all 111 careers' real employmentPercentage
// values and choosing cutoffs that give a sensible rarity spread rather than
// an even split - re-verified against the actual distribution: Mythic 2
// careers (Energy/Mining Production Director 0.036%, Senior Police Officer
// 0.050% - genuinely the two rarest real occupations in the whole list),
// Legendary 11, Epic 25, Rare 22, Uncommon 28, Common 23 (sums to 111).
const MYTHIC_MAX_PCT = 0.06
const LEGENDARY_MAX_PCT = 0.12
const EPIC_MAX_PCT = 0.22
const RARE_MAX_PCT = 0.4
const UNCOMMON_MAX_PCT = 0.8

export function getCareerTier(career: Career): TierKey {
  const pct = career.employmentPercentage
  if (pct < MYTHIC_MAX_PCT) return 'mythic'
  if (pct < LEGENDARY_MAX_PCT) return 'legendary'
  if (pct < EPIC_MAX_PCT) return 'epic'
  if (pct < RARE_MAX_PCT) return 'rare'
  if (pct < UNCOMMON_MAX_PCT) return 'uncommon'
  return 'common'
}

export function getTierConfig(tier: TierKey): TierConfig {
  return TIERS.find((entry) => entry.key === tier) ?? TIERS[0]
}
