import type { Career } from '../data/demoCareers'

export type TierKey = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'celestial'

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

// Ordered weakest -> strongest. targetShare IS the roll probability
// (rollEngine.ts's pickTier() uses it directly as the per-tier weight in
// its weighted-random walk), so tuning these numbers directly retunes the
// odds - separate from getCareerTier below (which career FALLS INTO which
// tier in the first place, real-world-rarity based, not this probability
// of landing on that tier once picked).
// Was all zeroed except celestial=1 (a leftover from testing Celestial's
// reveal animation - every roll landed Celestial regardless of the real
// odds, with a "REVERT before shipping" comment that never got acted on).
// Replaced per explicit request with a new target distribution - sums to
// 0.999, not a clean 1 (0.68+0.20+0.08+0.03+0.005+0.003+0.001), but
// pickTier() below normalizes against its own running total either way,
// so the 0.1% shortfall doesn't skew the actual odds.
export const TIERS: TierConfig[] = [
  { key: 'common', label: 'Common', emoji: '🟢', targetShare: 0.68 },
  { key: 'uncommon', label: 'Uncommon', emoji: '🔵', targetShare: 0.2 },
  { key: 'rare', label: 'Rare', emoji: '🟣', targetShare: 0.08 },
  { key: 'epic', label: 'Epic', emoji: '🟡', targetShare: 0.03 },
  { key: 'legendary', label: 'Legendary', emoji: '💎', targetShare: 0.005 },
  { key: 'mythic', label: 'Mythic', emoji: '⚫', targetShare: 0.003 },
  { key: 'celestial', label: 'Celestial', emoji: '✨', targetShare: 0.001 },
]

/** Parses a "£35k - £45k" style range into its midpoint. Used for salary
 * DISPLAY/comparison purposes elsewhere (Highest Paying sort, Compare's
 * "best salary" highlight, Binder's salary sort) - no longer for tier
 * classification, see getCareerTier below. */
export function parseSalaryAvg(salary: string): number {
  const matches = salary.match(/\d+(?:\.\d+)?/g)
  if (!matches || matches.length === 0) return 0
  const numbers = matches.map(Number)
  return (Math.min(...numbers) + Math.max(...numbers)) / 2
}

// --- Career tier (real-world UK rarity, employment-share based) ------------
// Pay doesn't factor into this at all. Cutoffs are on
// career.employmentPercentage (real UK workforce share, ~31.4M people - see
// demoCareers.d.ts) - LOWER percentage means FEWER people hold that job in
// real life, so it earns a RARER tier. This is the one tier check the whole
// app shares (Roll a Job's card color/pool, Binder, Compare, Stats, Weekly
// Spotlight) - there's no separate pay-based classification.
//
// Was a fixed "1 in X" band table (Common 1-50, ..., Celestial 4,000,001+,
// each boundary exactly 10x the last) - replaced per explicit request with
// a second, wider band table (Common 1-150, Uncommon 151-1,000, Rare
// 1,001-8,000, Epic 8,001-80,000, Legendary 80,001-500,000, Mythic
// 500,001-5,000,000, Celestial 5,000,001+). Re-verified against the
// current 184-career set: no exact-pct tie ever gets split across two
// tiers at any of these five boundaries, and this table fits the real
// data far better than the previous one did - Common 33, Uncommon 103,
// Rare 25, Epic 7, Legendary 5, Mythic 9 (Celestial's still the fixed 4,
// see below), a real (if not perfectly monotonic) pyramid shape rather
// than the previous table's 2/98/61/1/9 split. One consequence: several
// of the careers added specifically to populate the OLD table's Legendary
// band (demoCareers.js's "LEGENDARY TIER CAREERS" block) now fall in Epic
// instead under this wider Legendary band (80,001-500,000 is a much
// rarer bar than the old 50,001-100,000) - their employmentPercentage
// wasn't changed, they just land differently against the new cutoff.
// Celestial is NOT wired to CELESTIAL_MAX_PCT here (there isn't one) -
// still reserved for exactly the 4 hand-picked careers via forcedTier
// below, same as before. Unlike the previous table, this one doesn't
// even need that exception in practice: the rarest REAL career in the
// current set (Pargeter / Cut Crystal Glass Cutter, ~1 in 4,310,345) is
// still short of the new 5,000,001+ Celestial floor, so nothing would
// leak in even if this were wired up.
const MYTHIC_MAX_PCT = 0.0002 // 1 in 500,000
const LEGENDARY_MAX_PCT = 0.00125 // 1 in 80,000
const EPIC_MAX_PCT = 0.0125 // 1 in 8,000
const RARE_MAX_PCT = 0.1 // 1 in 1,000
const UNCOMMON_MAX_PCT = 0.6667 // 1 in 150

export function getCareerTier(career: Career): TierKey {
  // Celestial is never reached via employmentPercentage math, no matter
  // how tiny - it's reserved for exactly the 4 hand-picked careers that
  // set this field (Prime Minister, President, Vice President, Royal
  // Butler - see demoCareers.js), kept deliberately separate from real
  // occupation data rather than folded into whichever percentage a "1 in
  // 4,000,001+" cutoff would otherwise imply (several genuine heritage
  // crafts are already rarer than that in real life, and conflating them
  // with Celestial would both crowd out the 4 intended careers and
  // mis-badge real, pursuable ones as a joke-tier "you can never actually
  // do this" rarity).
  if (career.forcedTier) return career.forcedTier
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

// --- Leaderboard scoring -----------------------------------------------------
// Flat points per tier (rarer = worth more), used by useLeaderboardStore to
// score each roll and rank the Roll a Job leaderboard. Deliberately not a
// straight function of targetShare - a simple doubling-ish curve so a
// single Mythic (or Celestial) clearly outweighs a stack of Commons
// without needing the full odds math the roll itself uses.
export const TIER_POINTS: Record<TierKey, number> = {
  common: 1,
  uncommon: 5,
  rare: 15,
  epic: 30,
  legendary: 60,
  mythic: 100,
  celestial: 200,
}

// --- Displayed rarity ("1 in every N workers") ------------------------------
// The real figure, always - no floor/cap of any kind. Celestial careers
// don't use this at all in practice (they carry their own hand-written
// rarityLabel, checked first everywhere this gets displayed), but the
// function still needs to return SOMETHING finite for them since
// employmentPercentage is a required field either way.
export function getDisplayRarityN(career: Career): number {
  return Math.round(100 / career.employmentPercentage)
}
